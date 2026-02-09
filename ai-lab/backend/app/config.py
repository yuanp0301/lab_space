"""Application configuration management."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Environment
    environment: str = "development"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # API Keys
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    aimindsky_api_key: str = ""

    # Ollama
    ollama_base_url: str = "http://localhost:11434"

    # AIMindSky
    aimindsky_base_url: str = "https://api.aimindsky.com/v1"

    # Default Provider
    default_provider: str = "aimindsky"

    # Default Models
    default_anthropic_model: str = "claude-sonnet-4-20250514"
    default_openai_model: str = "gpt-4o"
    default_ollama_model: str = "llama3.2"
    default_aimindsky_model: str = "gpt-4o"

    # CORS
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Upload
    max_upload_size: int = 10 * 1024 * 1024  # 10MB
    upload_dir: str = "./uploads"

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins string to list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment == "development"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
