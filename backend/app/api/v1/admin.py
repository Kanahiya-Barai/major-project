from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_admin
from app.db.session import get_db
from app.models.fraud_log import FraudLog
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction_schema import (
    AdminDashboardResponse,
    FraudLogResponse,
    TransactionResponse,
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard", response_model=AdminDashboardResponse)
def dashboard(
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> AdminDashboardResponse:
    total_users = db.scalar(select(func.count()).select_from(User)) or 0
    total_transactions = db.scalar(select(func.count()).select_from(Transaction)) or 0
    blocked_transactions = db.scalar(
        select(func.count()).select_from(Transaction).where(Transaction.status == "blocked")
    ) or 0
    otp_required = db.scalar(
        select(func.count()).select_from(Transaction).where(Transaction.status == "otp_required")
    ) or 0
    return AdminDashboardResponse(
        total_users=total_users,
        total_transactions=total_transactions,
        blocked_transactions=blocked_transactions,
        otp_required_transactions=otp_required,
    )


@router.get("/transactions", response_model=list[TransactionResponse])
def all_transactions(
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> list[TransactionResponse]:
    transactions = db.scalars(select(Transaction).order_by(Transaction.created_at.desc())).all()
    return [TransactionResponse.model_validate(item) for item in transactions]


@router.get("/fraud-logs", response_model=list[FraudLogResponse])
def fraud_logs(
    _: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> list[FraudLogResponse]:
    logs = db.scalars(select(FraudLog).order_by(FraudLog.created_at.desc())).all()
    return [FraudLogResponse.model_validate(item) for item in logs]
