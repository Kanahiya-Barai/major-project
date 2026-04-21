from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

from training.feature_engineering import FEATURE_COLUMNS, TARGET_COLUMN
from training.preprocess import DEFAULT_PROCESSED_FILE, preprocess_dataset

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
ANOMALY_MODEL_PATH = MODEL_DIR / "anomaly_model.pkl"
SCALER_PATH = MODEL_DIR / "scaler.pkl"


def train_anomaly(processed_path: Path = DEFAULT_PROCESSED_FILE, sample_rows: int = 250000) -> dict[str, float]:
    if not processed_path.exists() or processed_path.stat().st_size == 0:
        preprocess_dataset(sample_rows=sample_rows)

    df = pd.read_csv(processed_path)
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    scaler = joblib.load(SCALER_PATH) if SCALER_PATH.exists() and SCALER_PATH.stat().st_size > 0 else StandardScaler().fit(X)
    X_scaled = scaler.transform(X)
    normal_mask = y == 0
    contamination = float(max(min(y.mean(), 0.2), 0.001))

    model = IsolationForest(
        n_estimators=250,
        contamination=contamination,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_scaled[normal_mask])

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, ANOMALY_MODEL_PATH)
    if not SCALER_PATH.exists() or SCALER_PATH.stat().st_size == 0:
        joblib.dump(scaler, SCALER_PATH)

    scores = model.decision_function(X_scaled)
    return {
        "contamination": contamination,
        "mean_decision_score": float(scores.mean()),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train IsolationForest anomaly model")
    parser.add_argument("--processed-path", type=Path, default=DEFAULT_PROCESSED_FILE)
    parser.add_argument("--sample-rows", type=int, default=250000)
    args = parser.parse_args()
    metrics = train_anomaly(args.processed_path, args.sample_rows)
    print(metrics)
