from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.db.database import get_db
from app.models.models import TrendData, TrendScore, TrendForecast
from app.api.v1.schemas import TrendResponse, PredictionResponse

router = APIRouter()

@router.get("/", response_model=List[TrendResponse])
def list_trends(
    platform: Optional[str] = Query(None, description="Filter by social platform (youtube, instagram, linkedin)"),
    status: Optional[str] = Query(None, description="Filter by status (early, rising, mature)"),
    search: Optional[str] = Query(None, description="Search term matching trend name"),
    timeframe: Optional[str] = Query(None, description="Filter by discovery timeframe (hour, week, month, quarter)"),
    country: Optional[str] = Query(None, description="Filter by target country (us, in, uk, global)"),
    db: Session = Depends(get_db)
):
    query = db.query(TrendData)
    
    if platform:
        query = query.filter(TrendData.platform == platform.lower())
    if status:
        query = query.filter(TrendData.status == status.lower())
    if search:
        query = query.filter(TrendData.trend_name.ilike(f"%{search}%"))
        
    if timeframe:
        now = datetime.utcnow()
        tf = timeframe.lower()
        if tf == "hour":
            query = query.filter(TrendData.first_seen_at >= now - timedelta(hours=1))
        elif tf == "week":
            query = query.filter(TrendData.first_seen_at >= now - timedelta(days=7))
        elif tf == "month":
            query = query.filter(TrendData.first_seen_at >= now - timedelta(days=30))
        elif tf == "quarter":
            query = query.filter(TrendData.first_seen_at >= now - timedelta(days=90))
        
    trends = query.order_by(TrendData.latest_seen_at.desc()).all()
    
    # Database-agnostic JSON check for country filtering
    if country:
        trends = [
            t for t in trends 
            if t.raw_metrics and t.raw_metrics.get("country", "").lower() == country.lower()
        ]
        
    return trends

@router.get("/{id}", response_model=TrendResponse)
def get_trend(id: str, db: Session = Depends(get_db)):
    trend = db.query(TrendData).filter(TrendData.id == id).first()
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found.")
    return trend

@router.get("/{id}/prediction", response_model=PredictionResponse)
def get_trend_prediction(id: str, db: Session = Depends(get_db)):
    trend = db.query(TrendData).filter(TrendData.id == id).first()
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found.")
        
    scores = trend.scores
    if not scores:
        raise HTTPException(status_code=404, detail="Scoring metrics not found for this trend.")
        
    forecast = db.query(TrendForecast).filter(TrendForecast.trend_id == id).first()
    
    velocity = forecast.expected_velocity if forecast else 2.5
    reach = forecast.expected_reach if forecast else 15000
    window = forecast.lifetime_window_days if forecast else 12
    p_viral = forecast.probability_of_viral if forecast else 0.65

    return {
        "trend_id": trend.id,
        "early_score": scores.early_score,
        "virality_score": scores.virality_score,
        "lifetime_score": scores.lifetime_score,
        "saturation_score": scores.saturation_score,
        "momentum_score": scores.momentum_score,
        "expected_velocity": velocity,
        "expected_reach": reach,
        "lifetime_window_days": window,
        "probability_of_viral": p_viral
    }
