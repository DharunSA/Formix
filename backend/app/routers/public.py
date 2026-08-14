from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app import models, schemas
from app.database import get_db
from app.models import now_utc
from app.validation import AnswerValidationError, render_value_text, validate_answer

router = APIRouter(prefix="/api/public", tags=["public"])


def _get_published_form_or_404(db: Session, share_slug: str) -> models.Form:
    form = (
        db.query(models.Form)
        .options(selectinload(models.Form.questions))
        .filter(models.Form.share_slug == share_slug)
        .first()
    )
    if not form or form.status != models.FormStatus.published.value:
        raise HTTPException(status_code=404, detail="This form isn't available.")
    return form


@router.get("/forms/{share_slug}", response_model=schemas.PublicFormOut)
def get_public_form(share_slug: str, db: Session = Depends(get_db)):
    return _get_published_form_or_404(db, share_slug)


@router.post("/forms/{share_slug}/responses/progress", response_model=schemas.ResponseDetailOut)
def save_response_progress(share_slug: str, payload: schemas.ProgressResponseIn, db: Session = Depends(get_db)):
    """Saves partial response progress in real-time as the respondent answers questions."""
    form = _get_published_form_or_404(db, share_slug)
    questions_by_id = {q.id: q for q in form.questions}

    # Fetch or create response
    response = None
    if payload.response_id is not None:
        response = (
            db.query(models.Response)
            .filter(models.Response.id == payload.response_id, models.Response.form_id == form.id)
            .first()
        )
    if not response:
        response = models.Response(
            form_id=form.id,
            completed=False,
            started_at=now_utc(),
        )
        db.add(response)
        db.flush()

    # Upsert answers for provided questions
    existing_answers = {a.question_id: a for a in response.answers}
    for ans_in in payload.answers:
        if ans_in.question_id not in questions_by_id:
            continue
        q = questions_by_id[ans_in.question_id]
        raw_val = ans_in.value
        # For in-progress saves, skip strict required validation but format if present
        if raw_val is None or raw_val == "":
            continue
        try:
            val = validate_answer(q, raw_val)
        except AnswerValidationError:
            val = raw_val

        if q.id in existing_answers:
            existing = existing_answers[q.id]
            existing.value = val
            existing.value_text = render_value_text(q, val)
        else:
            db.add(
                models.Answer(
                    response_id=response.id,
                    question_id=q.id,
                    value=val,
                    value_text=render_value_text(q, val),
                )
            )

    db.commit()
    db.refresh(response)
    return response


@router.post("/forms/{share_slug}/responses", response_model=schemas.ResponseDetailOut, status_code=201)
def submit_response(share_slug: str, payload: schemas.ResponseCreate, db: Session = Depends(get_db)):
    form = _get_published_form_or_404(db, share_slug)
    questions_by_id = {q.id: q for q in form.questions}
    answers_by_qid = {a.question_id: a.value for a in payload.answers if a.question_id in questions_by_id}

    errors = []
    validated = {}
    for q in form.questions:
        raw_value = answers_by_qid.get(q.id)
        try:
            validated[q.id] = validate_answer(q, raw_value)
        except AnswerValidationError as e:
            errors.append({"question_id": e.question_id, "message": e.message})

    if errors:
        raise HTTPException(status_code=422, detail={"errors": errors})

    response = None
    if payload.response_id is not None:
        response = (
            db.query(models.Response)
            .filter(models.Response.id == payload.response_id, models.Response.form_id == form.id)
            .first()
        )

    if response:
        response.completed = payload.completed
        response.submitted_at = now_utc() if payload.completed else None
        # Remove existing answers and re-insert validated ones
        for old_a in list(response.answers):
            db.delete(old_a)
        db.flush()
    else:
        response = models.Response(
            form_id=form.id,
            completed=payload.completed,
            submitted_at=now_utc() if payload.completed else None,
        )
        db.add(response)
        db.flush()

    for q in form.questions:
        value = validated.get(q.id)
        if value is None:
            continue
        db.add(
            models.Answer(
                response_id=response.id,
                question_id=q.id,
                value=value,
                value_text=render_value_text(q, value),
            )
        )

    # 1. Contact Extraction from Email fields
    if payload.completed:
        extracted_email = None
        extracted_name = "Anonymous"
        for q in form.questions:
            val = validated.get(q.id)
            if val and isinstance(val, str) and "@" in val and "." in val:
                extracted_email = val.strip().lower()
            if val and isinstance(val, str) and "name" in q.title.lower() and len(val.strip()) > 1:
                extracted_name = val.strip()

        if extracted_email:
            existing_contact = db.query(models.Contact).filter(models.Contact.email == extracted_email).first()
            if existing_contact:
                existing_contact.submissions_count += 1
                existing_contact.last_active_at = now_utc()
                if extracted_name != "Anonymous" and existing_contact.name in ("Anonymous", "", None):
                    existing_contact.name = extracted_name
            else:
                new_contact = models.Contact(
                    name=extracted_name,
                    email=extracted_email,
                    source_form_id=form.id,
                    tags=["Form Respondent", "Auto-Synced"],
                    submissions_count=1,
                    created_at=now_utc(),
                    last_active_at=now_utc(),
                )
                db.add(new_contact)

        # 2. Trigger Active Automations for this form
        automations = (
            db.query(models.Automation)
            .filter(
                models.Automation.is_active == True,
                (models.Automation.form_id == form.id) | (models.Automation.form_id == None),
            )
            .all()
        )
        for auto in automations:
            # Check condition
            should_run = True
            if auto.condition_type == "rating_less_than" and auto.condition_value:
                try:
                    thresh = float(auto.condition_value)
                    # Check if any rating is less than thresh
                    ratings = [v for q_id, v in validated.items() if isinstance(v, (int, float))]
                    should_run = any(r < thresh for r in ratings) if ratings else False
                except ValueError:
                    should_run = True

            if should_run:
                auto.execution_count += 1
                auto.last_executed_at = now_utc()

    db.commit()
    db.refresh(response)
    return response
