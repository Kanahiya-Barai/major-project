from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from fastapi import HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import admin_email_set, settings
from app.core.security import create_access_token, decode_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth_schema import GoogleLoginRequest, LoginRequest, RegisterRequest, TokenResponse


def create_user(db: Session, payload: RegisterRequest) -> User:
    normalized_email = payload.email.strip().lower()
    existing_user = db.scalar(select(User).where(User.email == normalized_email))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    email = normalized_email
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
    normalized_email = payload.email.strip().lower()
    user = db.scalar(select(User).where(User.email == normalized_email))
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


def authenticate_google_user(db: Session, payload: GoogleLoginRequest) -> TokenResponse:
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google sign-in is not configured on the server",
        )

    try:
        google_payload = id_token.verify_oauth2_token(
            payload.credential,
            google_requests.Request(),
            settings.google_client_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential",
        ) from exc

    email = str(google_payload.get("email", "")).strip().lower()
    email_verified = bool(google_payload.get("email_verified"))
    if not email or not email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account email is unavailable or not verified",
        )

    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        role = "admin" if email in admin_email_set() else "user"
        user = User(
            email=email,
            password=get_password_hash(f"google-oauth::{google_payload.get('sub', email)}"),
            role=role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        allowlisted = user.email.lower() in admin_email_set()
        expected_role = "admin" if allowlisted else "user"
        if user.role != expected_role:
            user.role = expected_role
            db.add(user)
            db.commit()
            db.refresh(user)

    return TokenResponse(access_token=create_access_token(str(user.id)))


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


def ensure_demo_users(db: Session) -> None:
    demo_accounts = (
        ("manishsahani.edu@gmail.com", "admin", "12345@qq"),
        ("user@example.com", "user"),
        ("admin@example.com", "admin"),
    )
    for account in demo_accounts:
        if len(account) == 3:
            email, role, password = account
        else:
            email, role = account
            password = "Password123"
        existing = db.scalar(select(User).where(User.email == email))
        if existing is not None:
            if existing.role != role:
                existing.role = role
                db.add(existing)
            if not verify_password(password, existing.password):
                existing.password = get_password_hash(password)
                db.add(existing)
            continue

        db.add(
            User(
                email=email,
                password=get_password_hash(password),
                role=role,
            )
        )
    db.commit()
