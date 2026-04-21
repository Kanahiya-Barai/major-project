from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.fraud_log import FraudLog
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction_schema import PaymentCreate, PaymentDecisionResponse, TransactionResponse
from app.services.risk_engine import evaluate_risk

TWOPLACES = Decimal("0.01")


def create_payment(db: Session, current_user: User, payload: PaymentCreate) -> PaymentDecisionResponse:
    amount = payload.amount.quantize(TWOPLACES, rounding=ROUND_HALF_UP)
    if current_user.balance < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance",
        )

    risk = evaluate_risk(db, current_user, amount)
    transaction = Transaction(
        sender_id=current_user.id,
        receiver_name=payload.receiver_name,
        receiver_account=payload.receiver_account,
        amount=amount,
        currency=payload.currency.upper(),
        status="pending",
        risk_score=risk.score,
        risk_level=risk.level,
        otp_required=risk.decision == "OTP_REQUIRED",
    )
    db.add(transaction)
    db.flush()

    if risk.decision == "BLOCK":
        transaction.status = "blocked"
        transaction.failure_reason = risk.reason
        _record_fraud_log(db, current_user.id, transaction.id, risk.score, risk.level, "BLOCK", risk)
        db.commit()
        db.refresh(transaction)
        return _decision_response(transaction, "BLOCK", risk.reason)

    if risk.decision == "OTP_REQUIRED":
        transaction.status = "otp_required"
        from app.services.otp_service import create_otp_for_transaction

        create_otp_for_transaction(db, current_user, transaction)
        _record_fraud_log(
            db,
            current_user.id,
            transaction.id,
            risk.score,
            risk.level,
            "OTP_REQUIRED",
            risk,
        )
        db.commit()
        db.refresh(transaction)
        return _decision_response(
            transaction,
            "OTP_REQUIRED",
            "OTP sent. Verify the transaction to complete payment.",
        )

    complete_transaction(db, current_user, transaction)
    _record_fraud_log(db, current_user.id, transaction.id, risk.score, risk.level, "ALLOW", risk)
    db.commit()
    db.refresh(transaction)
    return _decision_response(transaction, "ALLOW", "Payment processed successfully")


def complete_transaction(db: Session, current_user: User, transaction: Transaction) -> Transaction:
    if current_user.balance < transaction.amount:
        transaction.status = "failed"
        transaction.failure_reason = "Insufficient balance at execution time"
        db.add(transaction)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance",
        )

    current_user.balance = (Decimal(current_user.balance) - Decimal(transaction.amount)).quantize(TWOPLACES)
    transaction.status = "completed"
    transaction.completed_at = datetime.now(timezone.utc)
    transaction.failure_reason = None
    db.add(current_user)
    db.add(transaction)
    return transaction


def list_user_transactions(db: Session, current_user: User) -> list[TransactionResponse]:
    transactions = db.scalars(
        select(Transaction)
        .where(Transaction.sender_id == current_user.id)
        .order_by(Transaction.created_at.desc())
    ).all()
    return [TransactionResponse.model_validate(item) for item in transactions]


def _record_fraud_log(
    db: Session,
    user_id: int,
    transaction_id: int,
    score: float,
    level: str,
    decision: str,
    risk,
) -> None:
    log = FraudLog(
        user_id=user_id,
        transaction_id=transaction_id,
        risk_score=score,
        risk_level=level,
        decision=decision,
        reason=risk.reason,
        rule_hits=risk.rule_hits,
    )
    db.add(log)


def _decision_response(
    transaction: Transaction,
    decision: str,
    message: str,
) -> PaymentDecisionResponse:
    return PaymentDecisionResponse(
        transaction=TransactionResponse.model_validate(transaction),
        decision=decision,
        message=message,
        risk_score=transaction.risk_score,
        risk_level=transaction.risk_level,
        otp_required=transaction.otp_required,
    )
