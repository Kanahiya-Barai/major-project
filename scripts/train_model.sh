#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR/ml-engine"
python -m training.train_supervised
python -m training.train_anomaly
python -m training.train_semisupervised
