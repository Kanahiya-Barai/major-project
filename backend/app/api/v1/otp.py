from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.transaction_schema import OTPResendRequest, OTPVerifyRequest, PaymentDecisionResponse
from app.services.otp_service import resend_otp, verify_otp

router = APIRouter(prefix="/otp", tags=["otp"])


@router.post("/verify", response_model=PaymentDecisionResponse)
def verify_otp_endpoint(
    payload: OTPVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PaymentDecisionResponse:
    return verify_otp(db, current_user, payload)


@router.post("/resend", response_model=PaymentDecisionResponse)
def resend_otp_endpoint(
    payload: OTPResendRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PaymentDecisionResponse:
    return resend_otp(db, current_user, payload.transaction_id)
