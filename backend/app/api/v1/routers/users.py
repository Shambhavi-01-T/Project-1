from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User, CreatorProfile
from app.api.v1.schemas import UserResponse, UserProfileUpdate
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_in: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Update User level details
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
    if profile_in.organization is not None:
        current_user.organization = profile_in.organization
    
    # Query or create CreatorProfile detail record
    profile = db.query(CreatorProfile).filter(CreatorProfile.user_id == current_user.id).first()
    if not profile:
        profile = CreatorProfile(
            user_id=current_user.id,
            niche_tags=profile_in.niche_tags or [],
            platform_focus=profile_in.platform_focus or []
        )
        db.add(profile)
    else:
        if profile_in.niche_tags is not None:
            profile.niche_tags = profile_in.niche_tags
        if profile_in.platform_focus is not None:
            profile.platform_focus = profile_in.platform_focus
            
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/deduct-credit", response_model=UserResponse)
def deduct_credit(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.credits <= 0:
        raise HTTPException(status_code=400, detail="Insufficient credits daily balance.")
        
    current_user.credits -= 1
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/refill", response_model=UserResponse)
def refill_credits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.credits += 50
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/upgrade", response_model=UserResponse)
def upgrade_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.plan_type = "paid"
    current_user.credits = 9999
    db.commit()
    db.refresh(current_user)
    return current_user
