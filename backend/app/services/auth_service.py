from fastapi import HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import admin_email_set
from app.core.security import create_access_token, decode_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth_schema import LoginRequest, RegisterRequest, TokenResponse


def create_user(db: Session, payload: RegisterRequest) -> User:
    existing_user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    email = payload.email.lower()
    role = "admin" if email in admin_email_set() else "user"
    user = User(
        email=email,
        password=get_password_hash(payload.password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, payload: LoginRequest) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Auto-promote allowlisted emails to admin.
    allowlisted = user.email.lower() in admin_email_set()
    if allowlisted and user.role != "admin":
        user.role = "admin"
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not allowlisted and user.role == "admin":
        user.role = "user"
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(str(user.id))
    return TokenResponse(access_token=access_token)


def get_current_user(
    db: Session,
    credentials: HTTPAuthorizationCredentials | None,
) -> User:
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
        )

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload["sub"])
    except (ValueError, KeyError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user
