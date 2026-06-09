from pydantic import BaseModel, Field, HttpUrl


class ScanAnalysis(BaseModel):
    style: str = Field(..., min_length=1, max_length=120)
    colors: list[str] = Field(default_factory=list, max_length=8)
    clothing_type: str = Field(..., min_length=1, max_length=160)
    occasion: str = Field(..., min_length=1, max_length=120)
    recommendations_context: str = Field(..., min_length=1, max_length=800)


class RecommendationRequest(BaseModel):
    gender: str = Field(..., min_length=1, max_length=50)
    body_type: str = Field(..., min_length=1, max_length=80)
    style: str = Field(..., min_length=1, max_length=100)
    occasion: str = Field(..., min_length=1, max_length=100)
    season: str = Field(..., min_length=1, max_length=50)
    budget: str = Field(..., min_length=1, max_length=50)

    scan_analysis: ScanAnalysis | None = None


class ProductRecommendation(BaseModel):
    id: str
    title: str
    brand: str
    price: float = Field(..., ge=0)
    image: HttpUrl
    product_url: HttpUrl
    category: str


class RecommendationResponse(BaseModel):
    products: list[ProductRecommendation]