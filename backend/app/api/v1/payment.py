from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter
from fastapi import Query
from pydantic import BaseModel, Field

from app.services.risk_engine import evaluate_risk

router = APIRouter(prefix="/payment", tags=["payment"])

_CATEGORIES = (
    "Transfers",
    "Shopping",
    "Subscriptions",
    "Bills",
    "Food",
)
_transactions: list[dict] = []


class PaymentRequest(BaseModel):
    amount: float = Field(gt=0)
    receiver_name: str = Field(min_length=2, max_length=120)
    receiver_account: str = Field(min_length=4, max_length=64)
    failed_attempts: int = Field(default=0, ge=0)


class PaymentResponse(BaseModel):
    transaction_id: str
    decision: str
    risk_score: float
    message: str


@router.post("/create", response_model=PaymentResponse)
def create_payment(payload: PaymentRequest) -> PaymentResponse:
    result = evaluate_risk(
        amount=payload.amount,
        failed_attempts=payload.failed_attempts,
    )

    transaction_id = uuid4().hex
    created_at = datetime.now(timezone.utc)
    category = _CATEGORIES[len(_transactions) % len(_CATEGORIES)]

    status = "completed"
    if result["decision"] == "OTP_REQUIRED":
        status = "pending"
    elif result["decision"] == "BLOCK":
        status = "failed"

    _transactions.insert(
        0,
        {
            "id": transaction_id,
            "amount": payload.amount,
            "status": status,
            "riskScore": round(float(result["risk_score"]), 2),
            "date": created_at.astimezone(timezone.utc).strftime("%Y-%m-%d"),
            "category": category,
        },
    )

    return PaymentResponse(
        transaction_id=transaction_id,
        decision=result["decision"],
        risk_score=result["risk_score"],
        message=result["message"],
    )


@router.get("/transactions")
def get_transactions(limit: int | None = Query(default=None, ge=1, le=200)) -> list[dict]:
    if limit is None:
        return list(_transactions)
    return list(_transactions)[:limit]


@router.get("/stats")
def get_stats() -> dict:
    if not _transactions:
        return {
            "totalSpent": 0,
            "spentChange": 0,
            "transactionCount": 0,
            "txChange": 0,
            "avgRiskScore": 0,
            "monthlySpend": 0,
            "monthlyChange": 0,
        }

    total_spent = sum(tx["amount"] for tx in _transactions if tx["status"] != "failed")
    avg_risk = sum(tx["riskScore"] for tx in _transactions) / len(_transactions)

    now = datetime.now(timezone.utc)
    current_month_key = now.strftime("%Y-%m")
    monthly_spend = sum(
        tx["amount"]
        for tx in _transactions
        if tx["status"] != "failed" and str(tx["date"]).startswith(current_month_key)
    )

    return {
        "totalSpent": round(total_spent, 2),
        "spentChange": 0,
        "transactionCount": len(_transactions),
        "txChange": 0,
        "avgRiskScore": round(avg_risk, 2),
        "monthlySpend": round(monthly_spend, 2),
        "monthlyChange": 0,
    }


@router.get("/analytics/spending-trend")
def get_spending_trend() -> list[dict]:
    now = datetime.now(timezone.utc)
    months: list[str] = []
    for offset in range(5, -1, -1):
        month_dt = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
        month_index = (month_dt.month - 1) - offset
        year = month_dt.year + (month_index // 12)
        month = (month_index % 12) + 1
        months.append(datetime(year, month, 1, tzinfo=timezone.utc).strftime("%Y-%m"))

    totals_by_month: dict[str, float] = defaultdict(float)
    categories_by_month: dict[str, Counter[str]] = defaultdict(Counter)
    for tx in _transactions:
        month_key = str(tx["date"])[:7]
        totals_by_month[month_key] += float(tx["amount"])
        categories_by_month[month_key][tx.get("category", "Transfers")] += 1

    trend: list[dict] = []
    for month_key in months:
        month_label = datetime.strptime(month_key, "%Y-%m").strftime("%b")
        trend.append(
            {
                "month": month_label,
                "amount": round(totals_by_month.get(month_key, 0.0), 2),
            },
        )

    # Provide a category breakdown on the most recent entry (used by the UI).
    latest_month = months[-1]
    if trend:
        trend[-1]["categories"] = [
            {"name": name, "value": count}
            for name, count in categories_by_month.get(latest_month, Counter()).most_common()
        ]

    return trend


@router.get("/analytics/risk-distribution")
def get_risk_distribution() -> list[dict]:
    buckets = {"Low": 0, "Medium": 0, "High": 0}
    for tx in _transactions:
        score = float(tx.get("riskScore", 0))
        if score > 70:
            buckets["High"] += 1
        elif score > 40:
            buckets["Medium"] += 1
        else:
            buckets["Low"] += 1

    return [{"name": key, "value": value} for key, value in buckets.items()]
