import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine, SessionLocal
from app.db.seed import seed_db
from app.api.v1.routers import auth, users, trends, recommendations, competitors
from app.core.config import settings

# Attempt to initialize DB. Fallback to SQLite if connection fails.
try:
    # Trigger connection testing or table creation
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Database connection failed ({e}). Falling back to local SQLite database...", file=sys.stderr)
    from sqlalchemy import create_engine
    import app.db.database as db_module
    
    # Overwrite engine & session configured for SQLite
    sqlite_url = "sqlite:///./earlytrend.db"
    db_module.engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    db_module.SessionLocal.configure(bind=db_module.engine)
    engine = db_module.engine
    SessionLocal = db_module.SessionLocal
    
    # Re-attempt table creation on SQLite
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EarlyTrend AI Backend",
    description="Backend API for EarlyTrend AI: Early social media trend detection.",
    version="0.1.0",
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Seed Handler
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_db(db)
    except Exception as e:
        print(f"Seed warning: Failed to populate tables ({e})", file=sys.stderr)
    finally:
        db.close()

# Include Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(trends.router, prefix="/api/v1/trends", tags=["trends"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["recommendations"])
app.include_router(competitors.router, prefix="/api/v1/competitors", tags=["competitors"])

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "service": "EarlyTrend AI", "version": settings.APP_VERSION}
