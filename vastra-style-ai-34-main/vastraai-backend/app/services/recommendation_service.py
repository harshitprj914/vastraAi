import hashlib
import re
from typing import Any

import httpx


from app.models.recommendation import (
    ProductRecommendation,
    RecommendationRequest,
    RecommendationResponse,
)
from app.utils.config import settings

SERPAPI_ENDPOINT = "https://serpapi.com/search.json"
BLOCKED_TERMS = (
    "shoe",
    "sneaker",
    "loafer",
    "sandal",
    "heel",
    "boot",
    "footwear",
    "bag",
    "handbag",
    "clutch",
    "watch",
    "belt",
    "wallet",
    "jewel",
    "jewelry",
    "necklace",
    "earring",
    "ring",
    "bracelet",
    "sunglass",
    "perfume",
    "fragrance",
    "cap",
    "hat",
    "scarf",
    "tie",
    "sock",
    "accessor",
)
CLOTHING_TERMS = (
    "shirt",
    "t-shirt",
    "tee",
    "top",
    "blouse",
    "kurta",
    "kurti",
    "saree",
    "lehenga",
    "dress",
    "jeans",
    "trouser",
    "pants",
    "skirt",
    "blazer",
    "jacket",
    "hoodie",
    "sweater",
    "cardigan",
    "co-ord",
    "suit",
    "anarkali",
    "sherwani",
)


def _scan_text(preferences: RecommendationRequest) -> str:
    scan = preferences.scan_analysis
    if not scan:
        return ""
    return " ".join(
        [
            scan.style,
            " ".join(scan.colors),
            scan.clothing_type,
            scan.occasion,
            scan.recommendations_context,
        ]
    )


def _queries(preferences: RecommendationRequest) -> list[str]:

    gender = preferences.gender or ""
    occasion_pref = preferences.occasion or ""

    if preferences.scan_analysis:
        scan = preferences.scan_analysis

        query = " ".join(
            filter(
                None,
                [
                    gender,
                    scan.style,
                    scan.clothing_type,
                    occasion_pref,
                    " ".join(scan.colors[:2]),
                    "India",
                ],
            )
        )

        return [query]

    budget_text = ""

    if preferences.budget == "₹1500-3000":
        budget_text = "premium"

    elif preferences.budget == "₹3000-6000":
        budget_text = "designer"

    elif preferences.budget == "₹6000+":
        budget_text = "luxury"

    return [
        f"{gender} {preferences.style} {preferences.occasion} fashion India",
        f"{gender} {budget_text} {preferences.style} clothing India",
        f"{gender} designer outfit India",
        f"{gender} luxury fashion India",
    ]

def _parse_price(value: Any) -> float:
    if isinstance(value, int | float):
        return float(value)
    text = str(value or "")
    numbers = re.findall(r"\d+(?:,\d{2,3})*(?:\.\d+)?|\d+(?:\.\d+)?", text)
    if not numbers:
        return 0.0
    return float(numbers[0].replace(",", ""))


def _category_for(title: str) -> str:
    lower = title.lower()
    for term in CLOTHING_TERMS:
        if term in lower:
            return term
    return "clothing"


def _is_clothing(item: dict[str, Any]) -> bool:
    haystack = " ".join(
    str(item.get(key, ""))
    for key in ("title", "snippet", "source", "category")
    ).lower()


    if any(term in haystack for term in BLOCKED_TERMS):
        return False

    return any(term in haystack for term in CLOTHING_TERMS)




def _product_id(title: str, url: str) -> str:
    digest = hashlib.sha1(
        f"{title}|{url}".encode("utf-8")
    ).hexdigest()[:12]

    return f"serpapi-{digest}"


def _normalize_product(item: dict[str, Any]) -> ProductRecommendation | None:
    title = str(item.get("title") or "").strip()

    image = str(
        item.get("thumbnail")
        or item.get("image")
        or ""
    ).strip()

    if not image.startswith("http"):
        image = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900"

    product_url = str(
        item.get("link")
        or item.get("product_link")
        or ""
    ).strip()

    if not title or not product_url.startswith("http"):
        return None

    brand = str(
        item.get("source")
        or item.get("seller")
        or item.get("merchant")
        or title.split()[0]
        or "Store"
    ).strip()

    price = _parse_price(
        item.get("extracted_price")
        or item.get("price")
    )

    
    return ProductRecommendation(
        id=_product_id(title, product_url),
        title=title[:160],
        brand=brand[:80],
        price=price,
        image=image,
        product_url=product_url,
        category=_category_for(title),
    )


async def _search_serpapi(query: str) -> list[dict[str, Any]]:

    
    if not settings.serpapi_api_key:
        return []

    params = {
        "engine": "google_shopping",
        "q": query,
        "gl": "in",
        "hl": "en",
        "api_key": settings.serpapi_api_key,
        "num": 40,
    }
    async with httpx.AsyncClient(timeout=35) as client:
        response = await client.get(SERPAPI_ENDPOINT, params=params)
    
    data = response.json()

    if response.status_code >= 400:
        return []

    return data.get("shopping_results") or data.get("inline_shopping_results") or []


def _fallback_products(preferences: RecommendationRequest) -> list[ProductRecommendation]:
    # Used only if live search returns fewer than 12 clothing products.
    style = preferences.scan_analysis.style if preferences.scan_analysis else preferences.style
    seeds = [
        ("Linen Shirt", "Myntra", 1899, "shirt"),
        ("Structured Blazer", "Ajio", 4299, "blazer"),
        ("Cotton Kurta", "Nykaa Fashion", 1999, "kurta"),
        ("Wide Leg Trousers", "Zara India", 2990, "trousers"),
        ("Midi Dress", "H&M India", 2499, "dress"),
        ("Straight Jeans", "Amazon India", 2299, "jeans"),
        ("Co-ord Set", "Myntra", 3499, "co-ord"),
        ("Fine Knit Cardigan", "Ajio", 2599, "cardigan"),
        ("Poplin Shirt", "Nykaa Fashion", 1799, "shirt"),
        ("Pleated Skirt", "Zara India", 2890, "skirt"),
        ("Anarkali Kurta Set", "Myntra", 4599, "anarkali"),
        ("Denim Jacket", "Amazon India", 3299, "jacket"),
    ]
    products = []
    for index, (name, brand, price, category) in enumerate(seeds):
        title = f"{style} {name}".strip()
        products.append(
            ProductRecommendation(
                id=f"fallback-{index + 1:03d}",
                title=title,
                brand=brand,
                price=float(price),
                image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900",
                product_url=f"https://www.google.com/search?tbm=shop&q={title.replace(' ', '+')}",
                category=category,
            )
        )
    return products


async def get_recommendations(
    preferences: RecommendationRequest,
) -> RecommendationResponse:
    
    print("GENDER:", preferences.gender)

    products: list[ProductRecommendation] = []
    seen: set[str] = set()

    for query in _queries(preferences)[:1]:

        print("FINAL QUERY:", query)

        results = await _search_serpapi(query)

        print("RESULT COUNT:", len(results))

        for item in results:
            

            if not _is_clothing(item):
                continue

            product = _normalize_product(item)
            if not product:
                continue

            print("PRODUCT PRICE:", product.price)
            print("BUDGET:", preferences.budget)

            budget = preferences.budget

            if budget == "Under ₹1500" and product.price > 1500:
                continue

            elif budget == "₹1500-3000" and not (1500 <= product.price <= 3000):
                continue

            elif budget == "₹3000-6000" and not (3000 <= product.price <= 6000):
                continue

            elif budget == "₹6000+" and product.price < 6000:
                continue

            key = str(product.product_url)
            title_key = product.title.lower().strip()

            if key in seen or title_key in seen:
                continue

            seen.add(key)
            seen.add(title_key)
            print("PRODUCT:", product.title, product.price)
            products.append(product)

            if len(products) >= 12:
                break

        if len(products) >= 12:
            break
    print("LIVE PRODUCTS:", len(products))

    if len(products) < 1:
        print("USING FALLBACK")
        products = _fallback_products(preferences)

    print("FINAL PRODUCTS:", len(products))

    return RecommendationResponse(products=products[:12])