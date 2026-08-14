import numpy as np
import pandas as pd

from app.services.model_loader import load_isolation_forest_model, load_kmeans_model, load_scaler
from app.utils.preprocess import FEATURE_COLUMNS


def _score_isolation_forest(scaled_features: np.ndarray) -> float:
    model = load_isolation_forest_model()
    decision_score = float(model.decision_function(scaled_features)[0])
    normalized = 1.0 / (1.0 + np.exp(4.0 * decision_score))
    return round(float(np.clip(normalized, 0.0, 1.0)), 4)


def _score_kmeans(scaled_features: np.ndarray) -> float:
    artifact = load_kmeans_model()
    model = artifact["model"]
    distance_scale = float(artifact.get("distance_scale", 1.0)) or 1.0
    distances = model.transform(scaled_features)
    min_distance = float(np.min(distances, axis=1)[0])
    normalized = min(min_distance / distance_scale, 1.0)
    return round(float(np.clip(normalized, 0.0, 1.0)), 4)


def score_anomaly(features: pd.DataFrame) -> tuple[float, dict[str, float]]:
    scaler = load_scaler()
    scaled = scaler.transform(features[FEATURE_COLUMNS])
    isolation_forest_score = _score_isolation_forest(scaled)
    kmeans_score = _score_kmeans(scaled)
    combined_score = round(float(np.mean([isolation_forest_score, kmeans_score])), 4)
    return combined_score, {
        "isolation_forest": isolation_forest_score,
        "kmeans_clustering": kmeans_score,
    }
