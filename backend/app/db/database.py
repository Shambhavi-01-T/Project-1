import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Determine if we're using SQLite or PostgreSQL
# We support SQLite out-of-the-box for zero-config local runs
database_url = settings.DATABASE_URL
if database_url.startswith("sqlite"):
    # SQLite requires connect_args for multithreading
    engine = create_engine(
        database_url, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
