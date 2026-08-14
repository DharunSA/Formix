from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database import Base, SessionLocal, engine
from app.routers import ai, automations, contacts, forms, public

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Formix API", version="1.0.0")

# Allow origins: comma-separated list in ALLOWED_ORIGINS env var, or default to localhost dev
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(forms.router)
app.include_router(public.router)
app.include_router(contacts.router)
app.include_router(automations.router)
app.include_router(ai.router)


@app.on_event("startup")
def seed_if_empty():
    from app import models
    from app.seed import run_seed

    db = SessionLocal()
    try:
        has_forms = db.query(models.Form).first() is not None
        if not has_forms:
            run_seed(db)
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok"}
