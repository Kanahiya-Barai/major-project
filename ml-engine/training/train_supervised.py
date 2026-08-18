from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from training.feature_engineering import FEATURE_COLUMNS, TARGET_COLUMN
from training.metrics_store import write_metrics
from training.preprocess import DEFAULT_PROCESSED_FILE, preprocess_dataset

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
RANDOM_FOREST_MODEL_PATH = MODEL_DIR / "random_forest.pkl"
LOGISTIC_REGRESSION_MODEL_PATH = MODEL_DIR / "logistic_regression.pkl"
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

    random_forest = RandomForestClassifier(
        n_estimators=300,
        max_depth=18,
        min_samples_leaf=2,
        n_jobs=-1,
        class_weight="balanced_subsample",
        random_state=42,
    )
    logistic_regression = LogisticRegression(
        class_weight="balanced",
        max_iter=1000,
        random_state=42,
    )

    random_forest.fit(X_train_scaled, y_train)
    logistic_regression.fit(X_train_scaled, y_train)

    rf_probabilities = random_forest.predict_proba(X_test_scaled)[:, 1]
    lr_probabilities = logistic_regression.predict_proba(X_test_scaled)[:, 1]
    metrics = {
        "random_forest_roc_auc": float(roc_auc_score(y_test, rf_probabilities)),
        "random_forest_average_precision": float(average_precision_score(y_test, rf_probabilities)),
        "logistic_regression_roc_auc": float(roc_auc_score(y_test, lr_probabilities)),
        "logistic_regression_average_precision": float(average_precision_score(y_test, lr_probabilities)),
    }

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(random_forest, RANDOM_FOREST_MODEL_PATH)
    joblib.dump(logistic_regression, LOGISTIC_REGRESSION_MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    write_metrics("supervised", metrics)
    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train supervised fraud models")
    parser.add_argument("--processed-path", type=Path, default=DEFAULT_PROCESSED_FILE)
    parser.add_argument("--sample-rows", type=int, default=250000)
    args = parser.parse_args()
    metrics = train_supervised(args.processed_path, args.sample_rows)
    print(metrics)
