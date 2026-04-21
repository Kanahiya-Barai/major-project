from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.api.v1.payment import router as payment_router
from app.api.v1.users import router as users_router
from app.db.session import Base, engine, ensure_sqlite_schema
from app.models.user import User  # noqa: F401

app = FastAPI(title="Fraud Detection Auth Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
ensure_sqlite_schema()
app.include_router(auth_router, prefix="/api/v1")
app.include_router(payment_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy"}
