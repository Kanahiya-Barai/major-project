from functools import lru_cache
from pathlib import Path

import joblib

MODEL_DIR = Path(__file__).resolve().parents[2] / "models"
FRAUD_MODEL_PATH = MODEL_DIR / "fraud_model.pkl"
ANOMALY_MODEL_PATH = MODEL_DIR / "anomaly_model.pkl"
SCALER_PATH = MODEL_DIR / "scaler.pkl"


def _load_artifact(path: Path):
    if not path.exists() or path.stat().st_size == 0:
        raise FileNotFoundError(
            f"Required model artifact not found or empty: {path}. Run the training pipeline first."
        )
    return joblib.load(path)


@lru_cache(maxsize=1)
def load_supervised_model():
    return _load_artifact(FRAUD_MODEL_PATH)


@lru_cache(maxsize=1)
def load_anomaly_model():
    return _load_artifact(ANOMALY_MODEL_PATH)


@lru_cache(maxsize=1)
def load_scaler():
    return _load_artifact(SCALER_PATH)
