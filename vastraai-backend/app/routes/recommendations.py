from fastapi import APIRouter, HTTPException, status

from app.models.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import get_recommendations


router = APIRouter(prefix="/recommend", tags=["recommendations"])


@router.post("", response_model=RecommendationResponse, status_code=status.HTTP_200_OK)
async def recommend_outfits(
    preferences: RecommendationRequest,
) -> RecommendationResponse:
    try:
        return await get_recommendations(preferences)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate recommendations at this time.",
        ) from exc
