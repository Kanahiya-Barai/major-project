import random
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.otp import OTP
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction_schema import PaymentDecisionResponse, TransactionResponse


def create_otp_for_transaction(db: Session, current_user: User, transaction: Transaction) -> OTP:
    otp = OTP(
        user_id=current_user.id,
        transaction_id=transaction.id,
        code=_generate_otp(),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expiry_minutes),
        attempts=0,
        verified=False,
    )
    db.add(otp)
    return otp


def verify_otp(db: Session, current_user: User, payload) -> PaymentDecisionResponse:
    transaction = _get_user_transaction(db, current_user.id, payload.transaction_id)
    otp = transaction.otp
    if not otp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="OTP not found")
    if otp.verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP already used")
    if otp.attempts >= settings.otp_max_attempts:
        transaction.status = "otp_failed"
        transaction.failure_reason = "Maximum OTP attempts exceeded"
        db.add(transaction)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Maximum OTP attempts exceeded")
    if otp.expires_at < datetime.now(timezone.utc):
        transaction.status = "otp_failed"
        transaction.failure_reason = "OTP expired"
        db.add(transaction)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP expired")

    otp.attempts += 1
    if otp.code != payload.otp_code:
        db.add(otp)
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

    otp.verified = True
    db.add(otp)

    from app.services.payment_service import complete_transaction

    complete_transaction(db, current_user, transaction)
    db.commit()
    db.refresh(transaction)
    return PaymentDecisionResponse(
        transaction=TransactionResponse.model_validate(transaction),
        decision="ALLOW",
        message="OTP verified. Payment completed successfully.",
        risk_score=transaction.risk_score,
        risk_level=transaction.risk_level,
        otp_required=False,
    )


def resend_otp(db: Session, current_user: User, transaction_id: int) -> PaymentDecisionResponse:
    transaction = _get_user_transaction(db, current_user.id, transaction_id)
    if transaction.status != "otp_required":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP resend is only available for pending OTP transactions",
        )

    otp = transaction.otp
    if otp is None:
        create_otp_for_transaction(db, current_user, transaction)
    else:
        otp.code = _generate_otp()
        otp.attempts = 0
        otp.verified = False
        otp.expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expiry_minutes)
        db.add(otp)

    db.commit()
    db.refresh(transaction)
    return PaymentDecisionResponse(
        transaction=TransactionResponse.model_validate(transaction),
        decision="OTP_REQUIRED",
        message="OTP regenerated successfully.",
        risk_score=transaction.risk_score,
        risk_level=transaction.risk_level,
        otp_required=True,
    )


def _get_user_transaction(db: Session, user_id: int, transaction_id: int) -> Transaction:
    transaction = db.get(Transaction, transaction_id)
    if not transaction or transaction.sender_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transaction


def _generate_otp() -> str:
    return f"{random.randint(0, 999999):06d}"
