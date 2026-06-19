from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Dict, Any

# --- Authentication Schemas ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    organization: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    organization: Optional[str] = None
    plan_type: str
    credits: int
    niche_tags: Optional[List[str]] = []
    platform_focus: Optional[List[str]] = []
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    email: str
    role: str
    plan_type: str
    credits: int

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    organization: Optional[str] = None
    niche_tags: Optional[List[str]] = None
    platform_focus: Optional[List[str]] = None

# --- Trend Schemas ---

class KeywordResponse(BaseModel):
    id: str
    keyword: str
    keyword_type: str
    score: int
    volume: int

    class Config:
        from_attributes = True

class TrendScoreResponse(BaseModel):
    early_score: int
    virality_score: int
    lifetime_score: int
    saturation_score: int
    momentum_score: int
    competition_score: int

    class Config:
        from_attributes = True

class TrendResponse(BaseModel):
    id: str
    platform: str
    trend_name: str
    canonical_topic: Optional[str] = None
    first_seen_at: datetime
    latest_seen_at: datetime
    status: str
    raw_metrics: Optional[Dict[str, Any]] = None
    scores: Optional[TrendScoreResponse] = None
    keywords: Optional[List[KeywordResponse]] = []

    class Config:
        from_attributes = True

# --- Prediction & Forecast Schemas ---

class PredictionResponse(BaseModel):
    trend_id: str
    early_score: int
    virality_score: int
    lifetime_score: int
    saturation_score: int
    momentum_score: int
    expected_velocity: float
    expected_reach: int
    lifetime_window_days: int
    probability_of_viral: float

# --- Content Recommendation & Repurposer Schemas ---

class RecommendationResponse(BaseModel):
    id: str
    trend_id: str
    platform: str
    title_suggestion: Optional[str] = None
    hook: Optional[str] = None
    post_format: Optional[str] = None
    suggested_length: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RepurposeRequest(BaseModel):
    trend_name: str
    source_platform: str
    target_platform: str
    source_text: str

class RepurposeResponse(BaseModel):
    source_platform: str
    target_platform: str
    title_suggestion: str
    hook: str
    body_copy: str
    format_notes: str

# --- Competitor Schemas ---

class CompetitorResponse(BaseModel):
    id: str
    trend_id: str
    competitor_name: str
    platform: str
    content_gap: Optional[Dict[str, Any]] = None
    adoption_rate: float
    benchmark_score: int
    created_at: datetime

    class Config:
        from_attributes = True
