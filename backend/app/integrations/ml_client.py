from datetime import datetime, timezone

import requests

ML_API_URL = "http://localhost:8002/predict"
ML_TIMEOUT_SECONDS = 5


def fetch_ml_scores(
    *,
    amount: float,
    transaction_frequency: int,
    device_change: bool,
    location_change: bool,
) -> dict:
    payload = {
        "amount": amount,
        "transaction_frequency": transaction_frequency,
        "device_change": device_change,
        "location_change": location_change,
        "transaction_time": datetime.now(timezone.utc).isoformat(),
    }

    try:
      response = requests.post(ML_API_URL, json=payload, timeout=ML_TIMEOUT_SECONDS)
      response.raise_for_status()
      data = response.json()
      return {
          "ml_score": float(data.get("fraud_probability", 0.35)),
          "anomaly_score": float(data.get("anomaly_score", 0.35)),
      }
    except (requests.RequestException, TypeError, ValueError):
      fallback = min(max(amount / 20000, 0.1), 0.9)
      anomaly = min(max(transaction_frequency / 10, 0.1), 0.9)
      return {
          "ml_score": round(fallback, 4),
          "anomaly_score": round(anomaly, 4),
      }
