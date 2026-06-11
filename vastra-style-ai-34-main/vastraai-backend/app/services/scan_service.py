import base64
import json
import re
import time
from tracemalloc import start
from urllib import response
import httpx

from app.models.recommendation import ScanAnalysis
from app.utils.config import settings


GEMINI_ENDPOINT_TEMPLATE = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "{model}:generateContent"
)


def _extract_json(text: str) -> dict:
    fenced = re.search(r"```(?:json)?\s*(.*?)```", text, flags=re.DOTALL)
    raw = fenced.group(1) if fenced else text
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("Gemini did not return JSON.")
    return json.loads(raw[start : end + 1])


def _clean_analysis(payload: dict) -> ScanAnalysis:
    colors = payload.get("colors") or []
    if isinstance(colors, str):
        colors = [part.strip() for part in colors.split(",") if part.strip()]
    if not isinstance(colors, list):
        colors = []

    return ScanAnalysis(
        style=str(payload.get("style") or "casual").strip(),
        colors=[str(color).strip() for color in colors if str(color).strip()][:8],
        clothing_type=str(payload.get("clothing_type") or "clothing").strip(),
        occasion=str(payload.get("occasion") or "daily").strip(),
        recommendations_context=str(
            payload.get("recommendations_context")
            or "Recommend clothing that coordinates with the visible outfit."
        ).strip(),
    )


async def analyze_fashion_image(image_bytes: bytes, mime_type: str) -> ScanAnalysis:
    print("KEY STARTS WITH:", settings.gemini_api_key[:10])
    start = time.time()

    print("IMAGE SIZE KB:", round(len(image_bytes) / 1024, 2))
    if not settings.gemini_api_key:
        raise ValueError("GEMINI_API_KEY is not configured.")

    prompt = """Analyze this fashion image for a styling and shopping app.
Return JSON only with exactly these fields:
{
  "style": "short style aesthetic",
  "colors": ["dominant wearable colors"],
  "clothing_type": "visible clothing categories only",
  "occasion": "best matching occasion",
  "recommendations_context": "one concise sentence to guide matching clothing recommendations"
}

Rules:
- Analyze clothing only.
- Do not recommend shoes, bags, watches, jewelry, eyewear, or accessories.
- If the image is unclear, still infer conservatively from visible clothing."""

    body = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": base64.b64encode(image_bytes).decode("ascii"),
                        }
                    },
                ],
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "response_mime_type": "application/json",
        },
    }

    async with httpx.AsyncClient(timeout=20) as client:

        print("MODEL:", settings.gemini_model)
        print("KEY:", settings.gemini_api_key[:15])

        response = await client.post(
            GEMINI_ENDPOINT_TEMPLATE.format(model=settings.gemini_model),
            params={"key": settings.gemini_api_key},
            json=body,
        )

        print("STATUS:", response.status_code)

    print("BODY:", response.text)

    if response.status_code >= 400:
        raise ValueError(f"Gemini scan failed with status {response.status_code}.")

    data = response.json()

    print("SCAN TIME:", round(time.time() - start, 2), "sec")
    
    text = (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
    )
    return _clean_analysis(_extract_json(text))
