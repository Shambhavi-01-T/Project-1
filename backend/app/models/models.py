import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

# Helper to generate UUIDs as strings
def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="creator")  # admin, agency, creator, viewer
    organization = Column(String(255), nullable=True)
    plan_type = Column(String(50), default="free")  # free, paid, agency
    credits = Column(Integer, default=15)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def niche_tags(self):
        if self.profiles:
            return self.profiles[0].niche_tags or []
        return []

    @property
    def platform_focus(self):
        if self.profiles:
            return self.profiles[0].platform_focus or []
        return []

    # Relationships
    profiles = relationship("CreatorProfile", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")


class TrendData(Base):
    __tablename__ = "trend_data"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    platform = Column(String(50), nullable=False, index=True)  # youtube, instagram, linkedin
    trend_name = Column(String(255), nullable=False, index=True)
    canonical_topic = Column(String(255), nullable=True)
    trend_hash = Column(String(255), unique=True, index=True)
    first_seen_at = Column(DateTime, default=datetime.utcnow)
    latest_seen_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    raw_metrics = Column(JSON, nullable=True)  # JSON holding platform-specific volume parameters
    status = Column(String(50), default="early", index=True)  # early, rising, mature
    source_count = Column(Integer, default=1)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    scores = relationship("TrendScore", back_populates="trend", uselist=False, cascade="all, delete-orphan")
    keywords = relationship("Keyword", back_populates="trend", cascade="all, delete-orphan")
    recommendations = relationship("ContentRecommendation", back_populates="trend", cascade="all, delete-orphan")
    forecasts = relationship("TrendForecast", back_populates="trend", cascade="all, delete-orphan")
    competitor_analyses = relationship("CompetitorAnalysis", back_populates="trend", cascade="all, delete-orphan")


class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trend_id = Column(String(36), ForeignKey("trend_data.id", ondelete="CASCADE"), nullable=False)
    keyword = Column(String(255), nullable=False)
    keyword_type = Column(String(50), default="hashtag")  # hashtag, phrase, topic
    score = Column(Integer, default=50)
    volume = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    trend = relationship("TrendData", back_populates="keywords")


class TrendScore(Base):
    __tablename__ = "trend_scores"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trend_id = Column(String(36), ForeignKey("trend_data.id", ondelete="CASCADE"), unique=True, nullable=False)
    early_score = Column(Integer, default=0)
    virality_score = Column(Integer, default=0)
    lifetime_score = Column(Integer, default=0)
    saturation_score = Column(Integer, default=0)
    momentum_score = Column(Integer, default=0)
    competition_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    trend = relationship("TrendData", back_populates="scores")


class ContentRecommendation(Base):
    __tablename__ = "content_recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trend_id = Column(String(36), ForeignKey("trend_data.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String(50), nullable=False)  # youtube, instagram, linkedin
    title_suggestion = Column(String(255), nullable=True)
    hook = Column(Text, nullable=True)
    post_format = Column(String(100), nullable=True)  # Video script, Thread, Carousel
    suggested_length = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    trend = relationship("TrendData", back_populates="recommendations")


class CreatorProfile(Base):
    __tablename__ = "creator_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    niche_tags = Column(JSON, nullable=True)  # List of strings like ["AI", "Tech", "Lifestyle"]
    follower_count = Column(Integer, default=0)
    average_engagement = Column(Float, default=0.0)
    platform_focus = Column(JSON, nullable=True)  # List of strings like ["youtube", "linkedin"]
    trend_fit_score = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profiles")


class TrendForecast(Base):
    __tablename__ = "trend_forecasts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trend_id = Column(String(36), ForeignKey("trend_data.id", ondelete="CASCADE"), nullable=False)
    forecast_date = Column(DateTime, default=datetime.utcnow)
    expected_velocity = Column(Float, default=0.0)
    expected_reach = Column(Integer, default=0)
    lifetime_window_days = Column(Integer, default=7)
    probability_of_viral = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    trend = relationship("TrendData", back_populates="forecasts")


class CompetitorAnalysis(Base):
    __tablename__ = "competitor_analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trend_id = Column(String(36), ForeignKey("trend_data.id", ondelete="CASCADE"), nullable=False)
    competitor_name = Column(String(255), nullable=False)
    platform = Column(String(50), nullable=False)
    content_gap = Column(JSON, nullable=True)  # JSON holding analysis specifics
    adoption_rate = Column(Float, default=0.0)
    benchmark_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    trend = relationship("TrendData", back_populates="competitor_analyses")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action_type = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=True)
    resource_id = Column(String(100), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
