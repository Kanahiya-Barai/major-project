from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class PaymentCreate(BaseModel):
    receiver_name: str = Field(min_length=2, max_length=120)
    receiver_account: str = Field(min_length=6, max_length=64)
    amount: Decimal = Field(gt=0, decimal_places=2, max_digits=12)
    currency: str = Field(default="INR", min_length=3, max_length=10)


class TransactionResponse(BaseModel):
    id: int
    sender_id: int
    receiver_name: str
    receiver_account: str
    amount: Decimal
    currency: str
    status: str
    risk_score: float
    risk_level: str
    otp_required: bool
    failure_reason: str | None
    created_at: datetime
    completed_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class PaymentDecisionResponse(BaseModel):
    transaction: TransactionResponse
    decision: str
    message: str
    risk_score: float
    risk_level: str
    otp_required: bool


class OTPVerifyRequest(BaseModel):
    transaction_id: int
    otp_code: str = Field(min_length=6, max_length=6)


class OTPResendRequest(BaseModel):
    transaction_id: int


class FraudLogResponse(BaseModel):
    id: int
    user_id: int
    transaction_id: int | None
    risk_score: float
    risk_level: str
    decision: str
    reason: str
    rule_hits: list[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminDashboardResponse(BaseModel):
    total_users: int
    total_transactions: int
    blocked_transactions: int
    otp_required_transactions: int
