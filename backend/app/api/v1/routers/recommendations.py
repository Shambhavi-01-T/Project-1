from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import ContentRecommendation, TrendData
from app.api.v1.schemas import RecommendationResponse, RepurposeRequest, RepurposeResponse
from app.ai.repurposer import repurpose_content

router = APIRouter()

@router.get("/{trend_id}", response_model=List[RecommendationResponse])
def get_recommendations(trend_id: str, db: Session = Depends(get_db)):
    trend = db.query(TrendData).filter(TrendData.id == trend_id).first()
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found.")
        
    recommendations = db.query(ContentRecommendation).filter(ContentRecommendation.trend_id == trend_id).all()
    return recommendations

@router.post("/repurpose", response_model=RepurposeResponse)
def post_repurpose_content(payload: RepurposeRequest):
    try:
        output = repurpose_content(
            trend_name=payload.trend_name,
            source_platform=payload.source_platform.lower(),
            target_platform=payload.target_platform.lower(),
            source_text=payload.source_text
        )
        return output
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Repurposing logic encountered an error: {str(e)}"
        )
