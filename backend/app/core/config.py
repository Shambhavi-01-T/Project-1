import os
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "EarlyTrend AI")
    APP_VERSION: str = os.getenv("APP_VERSION", "0.1.0")
    
    # Defaults to PostgreSQL, but our main.py handles SQLite fallback automatically
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://earlytrend:earlytrendpass@db:5432/earlytrend"
    )
    
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "replace-with-secure-secret-trend-ai-2026")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    API_PREFIX: str = os.getenv("API_PREFIX", "/api/v1")

settings = Settings()
