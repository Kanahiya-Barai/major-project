from fastapi import FastAPI

from app.routes.predict import router as predict_router

app = FastAPI(
    title="Fraud Detection ML Engine",
    version="1.0.0",
    description="FastAPI microservice for fraud probability and anomaly scoring",
)

app.include_router(predict_router)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "healthy"}
