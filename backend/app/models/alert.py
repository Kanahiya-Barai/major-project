from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import JSON, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: f"alert_{uuid4().hex[:12]}")
    transaction_id: Mapped[str] = mapped_column(ForeignKey("transactions.id"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=_utcnow, onupdate=_utcnow
    )
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="open")
    assignee: Mapped[str | None] = mapped_column(String(120), nullable=True)
    notes: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    explanation: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    features: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)

    transaction = relationship("Transaction", back_populates="alert")

    def __repr__(self) -> str:  # pragma: no cover
        return f"Alert(id={self.id!r}, transaction_id={self.transaction_id!r}, status={self.status!r})"
