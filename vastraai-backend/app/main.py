from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import health, recommendations, scan, chat
from app.utils.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/docs" if settings.environment != "production" else None,
        redoc_url="/redoc" if settings.environment != "production" else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(scan.router)
    app.include_router(recommendations.router)
    app.include_router(chat.router)
    return app


app = create_app()
