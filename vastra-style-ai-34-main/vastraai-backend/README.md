# VastraAI Backend

Production-ready FastAPI backend skeleton for the VastraAI AI fashion recommendation app.

## Features

- FastAPI application factory
- Modular routes, services, models, and utilities
- CORS middleware configured from environment variables
- `GET /health` endpoint
- `POST /recommend` endpoint with mock clothing recommendations
- Local development setup with Uvicorn
- Environment configuration via `.env`

## Project Structure

```text
vastraai-backend/
  app/
    routes/
    services/
    models/
    utils/
    main.py
  requirements.txt
  .env.example
  README.md
```

## Local Setup

Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

Run the API:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open:

- API health check: <http://127.0.0.1:8000/health>
- Interactive docs: <http://127.0.0.1:8000/docs>

## Recommendation Endpoint

Send user preferences:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:8000/recommend `
  -ContentType "application/json" `
  -Body '{
    "gender": "female",
    "age": 26,
    "body_type": "pear",
    "occasion": "office lunch",
    "weather": "warm",
    "style": "minimal",
    "color_preference": "pastels",
    "ethnic_or_western": "western",
    "formality": "smart casual"
  }'
```

The endpoint currently returns 12 mock clothing products only. Shoes, bags, belts, watches, jewelry, and accessories are intentionally excluded.

## Notes

Recommendation logic and external integrations are intentionally not included yet.
