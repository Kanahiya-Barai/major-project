from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.semi_supervised import LabelPropagation, SelfTrainingClassifier

from training.feature_engineering import FEATURE_COLUMNS, TARGET_COLUMN
from training.metrics_store import write_metrics
from training.preprocess import DEFAULT_PROCESSED_FILE, preprocess_dataset
from training.train_supervised import SCALER_PATH
from training.train_supervised import train_supervised

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
SELF_TRAINING_MODEL_PATH = MODEL_DIR / "self_training.pkl"
LABEL_PROPAGATION_MODEL_PATH = MODEL_DIR / "label_propagation.pkl"


def _partially_hide_labels(
    labels: pd.Series,
    unlabeled_fraction: float = 0.7,
    min_labeled_per_class: int = 25,
) -> pd.Series:
    masked = labels.copy()
    for class_value in sorted(masked.unique()):
        class_indices = masked.index[masked == class_value]
        class_count = len(class_indices)
        unlabeled_count = min(
            int(class_count * unlabeled_fraction),
            max(class_count - min_labeled_per_class, 0),
        )
        if unlabeled_count <= 0:
            continue
        unlabeled_indices = (
            pd.Series(class_indices)
            .sample(n=unlabeled_count, random_state=42)
            .to_list()
        )
        masked.loc[unlabeled_indices] = -1
    return masked


def _class_probability(probabilities: np.ndarray, classes: np.ndarray, class_label: int = 1) -> np.ndarray:
    if class_label not in classes:
        return np.zeros(probabilities.shape[0], dtype=float)
    probabilities = np.nan_to_num(probabilities, nan=0.0, posinf=1.0, neginf=0.0)
    class_index = int(np.where(classes == class_label)[0][0])
    return probabilities[:, class_index]


def _safe_predict_proba(model, features: np.ndarray) -> np.ndarray:
    probabilities = np.asarray(model.predict_proba(features), dtype=float)
    if np.isnan(probabilities).any():
        probabilities = np.nan_to_num(probabilities, nan=0.0, posinf=1.0, neginf=0.0)
        row_sums = probabilities.sum(axis=1, keepdims=True)
        zero_rows = row_sums.squeeze(axis=1) == 0
        if np.any(zero_rows):
            predictions = model.predict(features[zero_rows])
            for row_index, prediction in zip(np.where(zero_rows)[0], predictions, strict=False):
                probabilities[row_index] = 0.0
                if prediction in model.classes_:
                    class_index = int(np.where(model.classes_ == prediction)[0][0])
                    probabilities[row_index, class_index] = 1.0
        row_sums = probabilities.sum(axis=1, keepdims=True)
        row_sums[row_sums == 0] = 1.0
        probabilities = probabilities / row_sums
    return probabilities


def train_semisupervised(
    processed_path: Path = DEFAULT_PROCESSED_FILE,
    sample_rows: int = 250000,
    label_propagation_max_samples: int = 5000,
) -> dict[str, float]:
    if not processed_path.exists() or processed_path.stat().st_size == 0:
        preprocess_dataset(sample_rows=sample_rows)
    if not SCALER_PATH.exists() or SCALER_PATH.stat().st_size == 0:
        train_supervised(processed_path=processed_path, sample_rows=sample_rows)

    df = pd.read_csv(processed_path)
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    scaler = joblib.load(SCALER_PATH)
    X_scaled = scaler.transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled,
        y.to_numpy(),
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    y_train_partial = _partially_hide_labels(pd.Series(y_train)).to_numpy()

    self_training = SelfTrainingClassifier(
        LogisticRegression(
            class_weight="balanced",
            max_iter=1000,
            random_state=42,
        ),
        threshold=0.8,
        criterion="threshold",
    )
    self_training.fit(X_train, y_train_partial)

    train_subset_size = min(len(X_train), label_propagation_max_samples)
    X_lp = X_train[:train_subset_size]
    y_lp = y_train_partial[:train_subset_size]
    label_propagation = LabelPropagation(kernel="knn", n_neighbors=7, max_iter=1000)
    label_propagation.fit(X_lp, y_lp)

    self_training_probabilities = _class_probability(
        _safe_predict_proba(self_training, X_test),
        self_training.classes_,
    )
    label_propagation_probabilities = _class_probability(
        _safe_predict_proba(label_propagation, X_test),
        label_propagation.classes_,
    )

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(self_training, SELF_TRAINING_MODEL_PATH)
    joblib.dump(label_propagation, LABEL_PROPAGATION_MODEL_PATH)

    metrics = {
        "self_training_roc_auc": float(roc_auc_score(y_test, self_training_probabilities)),
        "self_training_average_precision": float(
            average_precision_score(y_test, self_training_probabilities)
        ),
        "label_propagation_roc_auc": float(roc_auc_score(y_test, label_propagation_probabilities)),
        "label_propagation_average_precision": float(
            average_precision_score(y_test, label_propagation_probabilities)
        ),
        "label_propagation_train_samples": float(train_subset_size),
    }
    write_metrics("semisupervised", metrics)
    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train semi-supervised fraud models")
    parser.add_argument("--processed-path", type=Path, default=DEFAULT_PROCESSED_FILE)
    parser.add_argument("--sample-rows", type=int, default=250000)
    parser.add_argument("--label-propagation-max-samples", type=int, default=5000)
    args = parser.parse_args()
    metrics = train_semisupervised(
        processed_path=args.processed_path,
        sample_rows=args.sample_rows,
        label_propagation_max_samples=args.label_propagation_max_samples,
    )
    print(metrics)
