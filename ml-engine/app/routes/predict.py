from fastapi import APIRouter

from app.schemas.prediction_schema import PredictionRequest, PredictionResponse
from app.services.predictor import predict_fraud

router = APIRouter(prefix="", tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> PredictionResponse:
    return predict_fraud(payload)
