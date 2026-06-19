from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import CompetitorAnalysis, TrendData
from app.api.v1.schemas import CompetitorResponse

router = APIRouter()

@router.get("/{trend_id}", response_model=List[CompetitorResponse])
def get_competitor_analysis(trend_id: str, db: Session = Depends(get_db)):
    trend = db.query(TrendData).filter(TrendData.id == trend_id).first()
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found.")
        
    analyses = db.query(CompetitorAnalysis).filter(CompetitorAnalysis.trend_id == trend_id).all()
    return analyses
