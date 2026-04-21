from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

from training.feature_engineering import build_features

RAW_DIR = Path(__file__).resolve().parents[1] / "data" / "raw"
PROCESSED_DIR = Path(__file__).resolve().parents[1] / "data" / "processed"
DEFAULT_RAW_FILE = RAW_DIR / "transaction_data.csv"
DEFAULT_PROCESSED_FILE = PROCESSED_DIR / "clean_data.csv"


def load_raw_dataset(path: Path, sample_rows: int | None = 250000) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Raw dataset not found: {path}")
    return pd.read_csv(path, nrows=sample_rows)


def preprocess_dataset(
    raw_path: Path = DEFAULT_RAW_FILE,
    output_path: Path = DEFAULT_PROCESSED_FILE,
    sample_rows: int | None = 250000,
) -> Path:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    raw_df = load_raw_dataset(raw_path, sample_rows=sample_rows)
    processed_df = build_features(raw_df)
    processed_df.to_csv(output_path, index=False)
    return output_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Preprocess fraud dataset")
    parser.add_argument("--raw-path", type=Path, default=DEFAULT_RAW_FILE)
    parser.add_argument("--output-path", type=Path, default=DEFAULT_PROCESSED_FILE)
    parser.add_argument("--sample-rows", type=int, default=250000)
    args = parser.parse_args()
    result = preprocess_dataset(args.raw_path, args.output_path, args.sample_rows)
    print(f"Processed dataset saved to {result}")
