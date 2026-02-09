"""AI Lab Backend - FastAPI Application Entry Point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import chat, experiments, files
from app.config import get_settings
from app.experiments.registry import discover_experiments


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup: discover and register experiments
    discover_experiments()
    yield
    # Shutdown: cleanup if needed


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="AI Lab",
        description="AI 能力验证实验场 - LLM、多模态、Agent、传统 ML/CV",
        version="0.1.0",
        lifespan=lifespan,
        docs_url="/docs" if settings.is_development else None,
        redoc_url="/redoc" if settings.is_development else None,
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
    app.include_router(experiments.router, prefix="/api/v1/experiments", tags=["Experiments"])
    app.include_router(files.router, prefix="/api/v1/files", tags=["Files"])

    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "version": "0.1.0"}

    return app


app = create_app()
