from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from training.feature_engineering import FEATURE_COLUMNS, TARGET_COLUMN
from training.preprocess import DEFAULT_PROCESSED_FILE, preprocess_dataset

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
FRAUD_MODEL_PATH = MODEL_DIR / "fraud_model.pkl"
SCALER_PATH = MODEL_DIR / "scaler.pkl"


def train_supervised(processed_path: Path = DEFAULT_PROCESSED_FILE, sample_rows: int = 250000) -> dict[str, float]:
    if not processed_path.exists() or processed_path.stat().st_size == 0:
        preprocess_dataset(sample_rows=sample_rows)

    df = pd.read_csv(processed_path)
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=18,
        min_samples_leaf=2,
        n_jobs=-1,
        class_weight="balanced_subsample",
        random_state=42,
    )
    model.fit(X_train_scaled, y_train)

    probabilities = model.predict_proba(X_test_scaled)[:, 1]
    metrics = {
        "roc_auc": float(roc_auc_score(y_test, probabilities)),
        "average_precision": float(average_precision_score(y_test, probabilities)),
    }

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, FRAUD_MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train RandomForest fraud model")
    parser.add_argument("--processed-path", type=Path, default=DEFAULT_PROCESSED_FILE)
    parser.add_argument("--sample-rows", type=int, default=250000)
    args = parser.parse_args()
    metrics = train_supervised(args.processed_path, args.sample_rows)
    print(metrics)
