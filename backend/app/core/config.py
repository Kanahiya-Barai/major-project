from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Fraud Detection Payment System"
    api_v1_prefix: str = "/api/v1"
    secret_key: str = "change-this-secret-key-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite:///./fraud_detection.db"
    ml_api_url: str = "http://127.0.0.1:8001/predict"
    ml_timeout_seconds: int = 3
    high_amount_threshold: float = 10000.0
    medium_amount_threshold: float = 5000.0
    failed_attempt_threshold: int = 3
    failed_attempt_window_minutes: int = 60
    otp_expiry_minutes: int = 5
    otp_max_attempts: int = 3
    admin_emails: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()


def admin_email_set() -> set[str]:
    if not settings.admin_emails:
        return set()
    return {item.strip().lower() for item in settings.admin_emails.split(",") if item.strip()}
