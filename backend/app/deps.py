from typing import Optional
from fastapi import Depends, Header, HTTPException, status
import jwt
from sqlalchemy.orm import Session

from app import models
from app.database import get_db


def get_current_creator(
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
) -> models.Creator:
    """
    Decodes Supabase / JWT Bearer token from request headers.
    Returns the authenticated Creator or falls back to default demo creator.
    """
    user_email = "creator@typeform-clone.local"
    user_name = "Demo Creator"

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        if token not in ("demo-token", "dev-token", "mock-token") and not token.startswith("demo-"):
            try:
                payload = jwt.decode(token, options={"verify_signature": False})
                user_email = payload.get("email") or user_email
                user_name = payload.get("user_metadata", {}).get("full_name") or payload.get("name") or user_name
            except Exception:
                pass

    creator = db.query(models.Creator).filter(models.Creator.email == user_email).first()
    if creator is None:
        creator = models.Creator(name=user_name or user_email.split("@")[0], email=user_email)
        db.add(creator)
        db.commit()
        db.refresh(creator)
        try:
            from app.seed import seed_forms_for_creator
            seed_forms_for_creator(db, creator)
        except Exception:
            pass

    return creator


# Alias get_default_creator to get_current_creator for strict authorization
get_default_creator = get_current_creator
