from datetime import datetime

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    amount: float = Field(gt=0)
    transaction_frequency: int = Field(ge=0)
    device_change: bool
    location_change: bool
    transaction_time: datetime


class PredictionResponse(BaseModel):
    fraud_probability: float
    anomaly_score: float
