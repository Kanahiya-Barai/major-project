from app.integrations.ml_client import fetch_ml_scores


def evaluate_risk(*, amount: float, failed_attempts: int) -> dict:
    rule_score = 0.0

    if amount > 10000:
        rule_score += 0.6

    if failed_attempts > 2:
        rule_score += 0.4

    rule_score = min(rule_score, 1.0)

    ml_scores = fetch_ml_scores(
        amount=amount,
        transaction_frequency=failed_attempts + 1,
        device_change=failed_attempts > 0,
        location_change=amount > 15000,
    )

    final_score = round(
        (ml_scores["ml_score"] * 0.5)
        + (ml_scores["anomaly_score"] * 0.3)
        + (rule_score * 0.2),
        4,
    )

    if final_score < 0.4:
        return {
            "decision": "ALLOW",
            "risk_score": final_score,
            "message": "Payment approved successfully.",
        }
    if final_score <= 0.7:
        return {
            "decision": "OTP_REQUIRED",
            "risk_score": final_score,
            "message": "OTP verification is required for this payment.",
        }
    return {
        "decision": "BLOCK",
        "risk_score": final_score,
        "message": "Payment blocked due to high fraud risk.",
    }
