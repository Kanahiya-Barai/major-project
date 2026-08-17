from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class FraudLog(Base):
    """Legacy fraud decision audit log (used by the sender_id-based transaction flow)."""

    __tablename__ = "fraud_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    transaction_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False)
    decision: Mapped[str] = mapped_column(String(20), nullable=False)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    rule_hits: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=_utcnow)

    def __repr__(self) -> str:  # pragma: no cover
        return f"FraudLog(id={self.id!r}, decision={self.decision!r})"
