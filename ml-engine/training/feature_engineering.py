from __future__ import annotations

import pandas as pd

FEATURE_COLUMNS = [
    "amount",
    "transaction_frequency",
    "device_change",
    "location_change",
    "hour_of_day",
]
TARGET_COLUMN = "isFraud"


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    frame = df.copy()
    frame["step"] = pd.to_numeric(frame["step"], errors="coerce").fillna(0).astype(int)
    frame["amount"] = pd.to_numeric(frame["amount"], errors="coerce").fillna(0.0)
    frame[TARGET_COLUMN] = pd.to_numeric(frame[TARGET_COLUMN], errors="coerce").fillna(0).astype(int)
    frame = frame.sort_values(["nameOrig", "step", "nameDest"]).reset_index(drop=True)

    time_bucket = frame["step"] // 24
    frame["transaction_frequency"] = frame.groupby(["nameOrig", time_bucket]).cumcount() + 1
    frame["hour_of_day"] = frame["step"] % 24

    # The source dataset does not expose raw device or location identifiers.
    # We derive stable behavioral proxies from account activity so the model can still
    # learn from abrupt context switches in a reproducible way.
    device_proxy = pd.util.hash_pandas_object(
        frame["nameOrig"].astype(str) + "|" + frame["type"].astype(str) + "|" + (frame["step"] // 6).astype(str),
        index=False,
    ).astype("int64") % 11
    previous_device_proxy = device_proxy.groupby(frame["nameOrig"]).shift(1)
    frame["device_change"] = (
        previous_device_proxy.notna() & (device_proxy != previous_device_proxy)
    ).astype(int)

    location_proxy = pd.util.hash_pandas_object(
        frame["nameDest"].astype(str) + "|" + (frame["step"] // 12).astype(str),
        index=False,
    ).astype("int64") % 17
    previous_location_proxy = location_proxy.groupby(frame["nameOrig"]).shift(1)
    frame["location_change"] = (
        previous_location_proxy.notna() & (location_proxy != previous_location_proxy)
    ).astype(int)

    feature_frame = frame[FEATURE_COLUMNS + [TARGET_COLUMN]].dropna().reset_index(drop=True)
    return feature_frame
