from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.models.recommendation import ScanAnalysis
from app.services.scan_service import analyze_fashion_image


router = APIRouter(prefix="/scan", tags=["scan"])


@router.post("", response_model=ScanAnalysis, status_code=status.HTTP_200_OK)
async def scan_fashion_image(file: UploadFile = File(...)) -> ScanAnalysis:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload a valid image file.",
        )

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded image is empty.",
        )
    if len(image_bytes) > 8 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image too large. Maximum size is 8MB.",
        )

    try:
        return await analyze_fashion_image(
            image_bytes=image_bytes,
            mime_type=file.content_type,
        )

    except ValueError as exc:
        print("SCAN VALUE ERROR:", str(exc))

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        print("SCAN UNKNOWN ERROR:", repr(exc))

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to analyze image at this time.",
        ) from exc