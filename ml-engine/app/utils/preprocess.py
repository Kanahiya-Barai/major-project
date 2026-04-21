from datetime import datetime

import pandas as pd

from app.schemas.prediction_schema import PredictionRequest

FEATURE_COLUMNS = [
    "amount",
    "transaction_frequency",
    "device_change",
    "location_change",
    "hour_of_day",
]


def _extract_hour(value: datetime) -> int:
    return int(value.hour)


def build_feature_frame(payload: PredictionRequest) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "amount": float(payload.amount),
                "transaction_frequency": int(payload.transaction_frequency),
                "device_change": int(payload.device_change),
                "location_change": int(payload.location_change),
                "hour_of_day": _extract_hour(payload.transaction_time),
            }
        ],
        columns=FEATURE_COLUMNS,
    )
