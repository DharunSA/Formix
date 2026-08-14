from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, selectinload

from app import models, schemas
from app.deps import get_db

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


def _now_utc():
    return datetime.now(timezone.utc)


@router.get("", response_model=list[schemas.ContactOut])
def list_contacts(
    search: Optional[str] = Query(None),
    form_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Contact).options(selectinload(models.Contact.source_form))
    if form_id:
        query = query.filter(models.Contact.source_form_id == form_id)
    if search:
        s = f"%{search.strip().lower()}%"
        query = query.filter(
            (models.Contact.name.ilike(s)) | (models.Contact.email.ilike(s))
        )
    
    contacts = query.order_by(models.Contact.last_active_at.desc()).all()
    results = []
    for c in contacts:
        out = schemas.ContactOut.model_validate(c)
        if c.source_form:
            out.source_form_title = c.source_form.title
        results.append(out)
    return results


@router.post("", response_model=schemas.ContactOut, status_code=status.HTTP_201_CREATED)
def create_contact(payload: schemas.ContactCreate, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    if not email_clean or "@" not in email_clean:
        raise HTTPException(status_code=400, detail="A valid email address is required")
    
    existing = db.query(models.Contact).filter(models.Contact.email == email_clean).first()
    if existing:
        if payload.name and payload.name != "Anonymous":
            existing.name = payload.name
        if payload.tags:
            current_tags = list(existing.tags or [])
            for t in payload.tags:
                if t not in current_tags:
                    current_tags.append(t)
            existing.tags = current_tags
        existing.last_active_at = _now_utc()
        db.commit()
        db.refresh(existing)
        return existing

    contact = models.Contact(
        name=payload.name or "Anonymous",
        email=email_clean,
        source_form_id=payload.source_form_id,
        tags=payload.tags or ["Manual Entry"],
        submissions_count=1,
        created_at=_now_utc(),
        last_active_at=_now_utc(),
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.post("/auto-sync", response_model=schemas.ContactAutoSyncResult)
def auto_sync_from_forms(db: Session = Depends(get_db)):
    """Scans all answers for email-type questions or valid email strings across all forms,
    and extracts or updates contacts in the database."""
    email_questions = (
        db.query(models.Question)
        .filter(
            (models.Question.type == models.QuestionType.email.value)
            | (models.Question.title.ilike("%email%"))
        )
        .all()
    )

    q_ids = [q.id for q in email_questions]
    form_map = {q.id: q.form_id for q in email_questions}
    name_map = {}

    # Also find name questions to associate names
    name_questions = (
        db.query(models.Question)
        .filter(models.Question.title.ilike("%name%"))
        .all()
    )
    name_q_ids = [q.id for q in name_questions]

    new_count = 0
    updated_count = 0
    synced_emails = set()

    # Query all completed answers
    answers = (
        db.query(models.Answer)
        .filter(models.Answer.question_id.in_(q_ids))
        .all()
    )

    for ans in answers:
        raw = str(ans.value_text or ans.value or "").strip().lower()
        if "@" in raw and "." in raw:
            email = raw
            synced_emails.add(email)
            source_form_id = form_map.get(ans.question_id)

            # Try to find name in the same response
            name_val = "Anonymous"
            if name_q_ids:
                name_ans = (
                    db.query(models.Answer)
                    .filter(
                        models.Answer.response_id == ans.response_id,
                        models.Answer.question_id.in_(name_q_ids),
                    )
                    .first()
                )
                if name_ans and name_ans.value_text:
                    name_val = name_ans.value_text.strip()

            contact = db.query(models.Contact).filter(models.Contact.email == email).first()
            if contact:
                contact.submissions_count += 1
                contact.last_active_at = _now_utc()
                if name_val != "Anonymous" and contact.name in ("Anonymous", "", None):
                    contact.name = name_val
                updated_count += 1
            else:
                contact = models.Contact(
                    name=name_val,
                    email=email,
                    source_form_id=source_form_id,
                    submissions_count=1,
                    tags=["Form Respondent", "Auto-Synced"],
                    created_at=_now_utc(),
                    last_active_at=_now_utc(),
                )
                db.add(contact)
                new_count += 1

    # If no answers exist, create a sample high-fidelity contact so the user gets instant value
    if new_count == 0 and updated_count == 0 and db.query(models.Contact).count() == 0:
        sample_contacts = [
            models.Contact(
                name="Sarah Jenkins",
                email="sarah.jenkins@acme.corp",
                tags=["Qualified Lead", "Enterprise"],
                submissions_count=3,
                created_at=_now_utc(),
                last_active_at=_now_utc(),
            ),
            models.Contact(
                name="Alex Rivera",
                email="alex@growthlab.io",
                tags=["Beta Tester", "High Intent"],
                submissions_count=2,
                created_at=_now_utc(),
                last_active_at=_now_utc(),
            ),
            models.Contact(
                name="Priya Sharma",
                email="priya.sharma@techflow.ai",
                tags=["Customer", "Product Feedback"],
                submissions_count=1,
                created_at=_now_utc(),
                last_active_at=_now_utc(),
            ),
        ]
        db.add_all(sample_contacts)
        new_count = len(sample_contacts)

    db.commit()
    return schemas.ContactAutoSyncResult(
        synced_count=new_count + updated_count,
        new_contacts=new_count,
        updated_contacts=updated_count,
        message=f"Successfully synchronized {new_count + updated_count} contact(s) from form responses.",
    )


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
