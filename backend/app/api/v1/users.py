from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/count")
def user_count(db: Session = Depends(get_db)) -> dict[str, int]:
    count = db.scalar(select(func.count()).select_from(User)) or 0
    return {"count": int(count)}


@router.get("")
def list_users(
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[dict]:
    users = db.scalars(select(User).order_by(User.id.desc()).limit(limit)).all()
    result: list[dict] = []
    for user in users:
        name = user.email.split("@", 1)[0] if user.email else f"user{user.id}"
        result.append(
            {
                "id": str(user.id),
                "name": name,
                "email": user.email,
                "role": getattr(user, "role", "user"),
                "status": "active",
                "joined": "",
            },
        )
    return result
