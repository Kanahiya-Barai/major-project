from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

from training.feature_engineering import FEATURE_COLUMNS, TARGET_COLUMN
from training.metrics_store import write_metrics
from training.preprocess import DEFAULT_PROCESSED_FILE, preprocess_dataset

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
ISOLATION_FOREST_MODEL_PATH = MODEL_DIR / "isolation_forest.pkl"
KMEANS_MODEL_PATH = MODEL_DIR / "kmeans_clustering.pkl"
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

    isolation_forest = IsolationForest(
        n_estimators=250,
        contamination=contamination,
        random_state=42,
        n_jobs=-1,
    )
    normal_data = X_scaled[normal_mask]
    isolation_forest.fit(normal_data)

    cluster_count = int(max(2, min(8, np.sqrt(len(normal_data)))))
    kmeans = KMeans(
        n_clusters=cluster_count,
        n_init=10,
        random_state=42,
    )
    kmeans.fit(normal_data)
    normal_distances = np.min(kmeans.transform(normal_data), axis=1)
    distance_scale = float(np.percentile(normal_distances, 95)) or 1.0

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(isolation_forest, ISOLATION_FOREST_MODEL_PATH)
    joblib.dump(
        {
            "model": kmeans,
            "distance_scale": distance_scale,
        },
        KMEANS_MODEL_PATH,
    )
    if not SCALER_PATH.exists() or SCALER_PATH.stat().st_size == 0:
        joblib.dump(scaler, SCALER_PATH)

    scores = isolation_forest.decision_function(X_scaled)
    metrics = {
        "contamination": contamination,
        "mean_isolation_forest_score": float(scores.mean()),
        "kmeans_clusters": float(cluster_count),
        "kmeans_distance_scale": distance_scale,
    }
    write_metrics("unsupervised", metrics)
    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train unsupervised fraud models")
    parser.add_argument("--processed-path", type=Path, default=DEFAULT_PROCESSED_FILE)
    parser.add_argument("--sample-rows", type=int, default=250000)
    args = parser.parse_args()
    metrics = train_anomaly(args.processed_path, args.sample_rows)
    print(metrics)
