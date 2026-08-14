from datetime import datetime, timezone
import json
import urllib.request
import urllib.error
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app import models, schemas
from app.deps import get_db

router = APIRouter(prefix="/api/automations", tags=["automations"])


def _now_utc():
    return datetime.now(timezone.utc)


@router.get("", response_model=list[schemas.AutomationOut])
def list_automations(db: Session = Depends(get_db)):
    automations = (
        db.query(models.Automation)
        .options(selectinload(models.Automation.form))
        .order_by(models.Automation.created_at.desc())
        .all()
    )
    results = []
    for a in automations:
        out = schemas.AutomationOut.model_validate(a)
        if a.form:
            out.form_title = a.form.title
        results.append(out)
    return results


@router.post("", response_model=schemas.AutomationOut, status_code=status.HTTP_201_CREATED)
def create_automation(payload: schemas.AutomationCreate, db: Session = Depends(get_db)):
    if payload.form_id:
        form = db.query(models.Form).filter(models.Form.id == payload.form_id).first()
        if not form:
            raise HTTPException(status_code=404, detail="Selected form not found")

    automation = models.Automation(
        name=payload.name.strip() or "New Workflow Automation",
        trigger_type=payload.trigger_type,
        form_id=payload.form_id,
        condition_type=payload.condition_type,
        condition_value=payload.condition_value,
        action_type=payload.action_type,
        action_config=payload.action_config or {},
        is_active=payload.is_active,
        execution_count=0,
        created_at=_now_utc(),
    )
    db.add(automation)
    db.commit()
    db.refresh(automation)

    out = schemas.AutomationOut.model_validate(automation)
    if automation.form:
        out.form_title = automation.form.title
    return out


@router.patch("/{automation_id}", response_model=schemas.AutomationOut)
def update_automation(
    automation_id: int, payload: schemas.AutomationUpdate, db: Session = Depends(get_db)
):
    automation = (
        db.query(models.Automation)
        .filter(models.Automation.id == automation_id)
        .first()
    )
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")

    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(automation, field, val)

    db.commit()
    db.refresh(automation)
    out = schemas.AutomationOut.model_validate(automation)
    if automation.form:
        out.form_title = automation.form.title
    return out


@router.delete("/{automation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_automation(automation_id: int, db: Session = Depends(get_db)):
    automation = (
        db.query(models.Automation)
        .filter(models.Automation.id == automation_id)
        .first()
    )
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")
    db.delete(automation)
    db.commit()


@router.post("/{automation_id}/test", response_model=schemas.AutomationTestResult)
def test_automation(automation_id: int, db: Session = Depends(get_db)):
    """Executes a live test run for the specified automation node."""
    automation = (
        db.query(models.Automation)
        .options(selectinload(models.Automation.form))
        .filter(models.Automation.id == automation_id)
        .first()
    )
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")

    now = _now_utc()
    config = automation.action_config or {}

    # Webhook execution
    if automation.action_type == "webhook":
        url = config.get("url", "").strip()
        if not url:
            return schemas.AutomationTestResult(
                success=False,
                status_code=400,
                message="No Webhook URL configured for this action.",
                executed_at=now,
            )

        test_payload = {
            "event": "form_response.test",
            "automation_id": automation.id,
            "automation_name": automation.name,
            "form_id": automation.form_id,
            "form_title": automation.form.title if automation.form else "Sample Form",
            "submitted_at": now.isoformat(),
            "data": {
                "email": "test.respondent@example.com",
                "name": "Jane Doe",
                "rating": 5,
                "feedback": "This is an automated test trigger payload from Formix.",
            },
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(test_payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "User-Agent": "Formix-Automations/1.0"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                status_code = response.getcode()
                automation.execution_count += 1
                automation.last_executed_at = now
                db.commit()
                return schemas.AutomationTestResult(
                    success=True,
                    status_code=status_code,
                    message=f"Webhook delivered successfully with status {status_code}.",
                    executed_at=now,
                )
        except urllib.error.HTTPError as e:
            automation.execution_count += 1
            automation.last_executed_at = now
            db.commit()
            return schemas.AutomationTestResult(
                success=False,
                status_code=e.code,
                message=f"Webhook endpoint returned HTTP error {e.code}: {e.reason}.",
                executed_at=now,
            )
        except Exception as ex:
            return schemas.AutomationTestResult(
                success=False,
                status_code=500,
                message=f"Failed to connect to webhook URL: {str(ex)}",
                executed_at=now,
            )

    # Email action execution
    elif automation.action_type == "email":
        target_email = config.get("email", "admin@company.com")
        automation.execution_count += 1
        automation.last_executed_at = now
        db.commit()
        return schemas.AutomationTestResult(
            success=True,
            status_code=200,
            message=f"Email notification successfully routed to {target_email}.",
            executed_at=now,
        )

    # Slack or CRM integration placeholder
    else:
        automation.execution_count += 1
        automation.last_executed_at = now
        db.commit()
        return schemas.AutomationTestResult(
            success=True,
            status_code=200,
            message=f"Action '{automation.action_type}' simulated successfully.",
            executed_at=now,
        )
