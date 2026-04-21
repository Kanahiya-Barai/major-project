import numpy as np
import pandas as pd

from app.services.model_loader import load_anomaly_model, load_scaler
from app.utils.preprocess import FEATURE_COLUMNS


def score_anomaly(features: pd.DataFrame) -> float:
    scaler = load_scaler()
    model = load_anomaly_model()
    scaled = scaler.transform(features[FEATURE_COLUMNS])
    decision_score = float(model.decision_function(scaled)[0])
    normalized = 1.0 / (1.0 + np.exp(4.0 * decision_score))
    return round(float(np.clip(normalized, 0.0, 1.0)), 4)
