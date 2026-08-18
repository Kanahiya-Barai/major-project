from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class OtpState(Base):
    __tablename__ = "otp_states"

    transaction_id: Mapped[str] = mapped_column(
        ForeignKey("transactions.id"), primary_key=True
    )
    code: Mapped[str] = mapped_column(String(6), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sent_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=_utcnow, onupdate=_utcnow
    )

    transaction = relationship("Transaction", back_populates="otp_state")

    def __repr__(self) -> str:  # pragma: no cover
        return f"OtpState(transaction_id={self.transaction_id!r}, verified={self.verified!r})"
