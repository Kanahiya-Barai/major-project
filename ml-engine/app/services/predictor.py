from app.schemas.prediction_schema import PredictionRequest, PredictionResponse
from app.services.anomaly_detector import score_anomaly
from app.services.model_loader import load_scaler, load_supervised_model
from app.utils.preprocess import FEATURE_COLUMNS, build_feature_frame


def predict_fraud(payload: PredictionRequest) -> PredictionResponse:
    features = build_feature_frame(payload)
    scaler = load_scaler()
    model = load_supervised_model()
    scaled = scaler.transform(features[FEATURE_COLUMNS])
    fraud_probability = float(model.predict_proba(scaled)[0][1])
    anomaly_score = score_anomaly(features)
    return PredictionResponse(
        fraud_probability=round(fraud_probability, 4),
        anomaly_score=anomaly_score,
    )
