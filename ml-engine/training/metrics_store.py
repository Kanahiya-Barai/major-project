from __future__ import annotations

import json
from pathlib import Path


METRICS_PATH = Path(__file__).resolve().parents[1] / "models" / "metrics.json"


def write_metrics(section: str, metrics: dict[str, float]) -> Path:
    existing: dict = {}
    if METRICS_PATH.exists():
        with METRICS_PATH.open("r", encoding="utf-8") as handle:
            existing = json.load(handle)
    existing[section] = metrics
    METRICS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with METRICS_PATH.open("w", encoding="utf-8") as handle:
        json.dump(existing, handle, indent=2)
    return METRICS_PATH
