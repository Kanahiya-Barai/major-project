from functools import lru_cache
from pathlib import Path

import joblib

MODEL_DIR = Path(__file__).resolve().parents[2] / "models"
SCALER_PATH = MODEL_DIR / "scaler.pkl"
RANDOM_FOREST_MODEL_PATH = MODEL_DIR / "random_forest.pkl"
LOGISTIC_REGRESSION_MODEL_PATH = MODEL_DIR / "logistic_regression.pkl"
SELF_TRAINING_MODEL_PATH = MODEL_DIR / "self_training.pkl"
LABEL_PROPAGATION_MODEL_PATH = MODEL_DIR / "label_propagation.pkl"
ISOLATION_FOREST_MODEL_PATH = MODEL_DIR / "isolation_forest.pkl"
KMEANS_MODEL_PATH = MODEL_DIR / "kmeans_clustering.pkl"


def _load_artifact(path: Path):
    if not path.exists() or path.stat().st_size == 0:
        raise FileNotFoundError(
            f"Required model artifact not found or empty: {path}. Run the training pipeline first."
        )
    return joblib.load(path)


@lru_cache(maxsize=1)
def load_random_forest_model():
    return _load_artifact(RANDOM_FOREST_MODEL_PATH)


@lru_cache(maxsize=1)
def load_logistic_regression_model():
    return _load_artifact(LOGISTIC_REGRESSION_MODEL_PATH)


@lru_cache(maxsize=1)
def load_self_training_model():
    return _load_artifact(SELF_TRAINING_MODEL_PATH)


@lru_cache(maxsize=1)
def load_label_propagation_model():
    return _load_artifact(LABEL_PROPAGATION_MODEL_PATH)


@lru_cache(maxsize=1)
def load_isolation_forest_model():
    return _load_artifact(ISOLATION_FOREST_MODEL_PATH)


@lru_cache(maxsize=1)
def load_kmeans_model():
    return _load_artifact(KMEANS_MODEL_PATH)


@lru_cache(maxsize=1)
def load_scaler():
    return _load_artifact(SCALER_PATH)
