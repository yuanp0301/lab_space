"""Provider factory for creating AI provider instances."""

from typing import Literal

from app.config import get_settings
from app.providers.aimindsky import AIMindSkyProvider
from app.providers.anthropic import AnthropicProvider
from app.providers.base import BaseProvider, ProviderConfig
from app.providers.ollama import OllamaProvider
from app.providers.openai import OpenAIProvider

ProviderType = Literal["anthropic", "openai", "ollama", "aimindsky"]


class ProviderFactory:
    """Factory for creating AI provider instances."""

    _providers: dict[str, type[BaseProvider]] = {
        "anthropic": AnthropicProvider,
        "openai": OpenAIProvider,
        "ollama": OllamaProvider,
        "aimindsky": AIMindSkyProvider,
    }

    _instances: dict[str, BaseProvider] = {}

    @classmethod
    def register(cls, name: str, provider_class: type[BaseProvider]) -> None:
        """Register a new provider type."""
        cls._providers[name] = provider_class

    @classmethod
    def create(cls, provider_type: ProviderType) -> BaseProvider:
        """Create a new provider instance."""
        if provider_type not in cls._providers:
            raise ValueError(f"Unknown provider type: {provider_type}")

        settings = get_settings()

        if provider_type == "anthropic":
            config = ProviderConfig(
                name="anthropic",
                api_key=settings.anthropic_api_key,
                default_model=settings.default_anthropic_model,
            )
        elif provider_type == "openai":
            config = ProviderConfig(
                name="openai",
                api_key=settings.openai_api_key,
                default_model=settings.default_openai_model,
            )
        elif provider_type == "ollama":
            config = ProviderConfig(
                name="ollama",
                base_url=settings.ollama_base_url,
                default_model=settings.default_ollama_model,
            )
        elif provider_type == "aimindsky":
            config = ProviderConfig(
                name="aimindsky",
                api_key=settings.aimindsky_api_key,
                base_url=settings.aimindsky_base_url,
                default_model=settings.default_aimindsky_model,
            )
        else:
            raise ValueError(f"Unknown provider type: {provider_type}")

        return cls._providers[provider_type](config)

    @classmethod
    def get(cls, provider_type: ProviderType | None = None) -> BaseProvider:
        """Get a provider instance (cached)."""
        if provider_type is None:
            settings = get_settings()
            provider_type = settings.default_provider  # type: ignore

        if provider_type not in cls._instances:
            cls._instances[provider_type] = cls.create(provider_type)

        return cls._instances[provider_type]

    @classmethod
    def get_available_providers(cls) -> list[dict]:
        """Get list of available providers with their models."""
        settings = get_settings()
        providers = []

        # Anthropic
        if settings.anthropic_api_key:
            providers.append({
                "name": "anthropic",
                "label": "Anthropic (Claude)",
                "models": AnthropicProvider.MODELS,
                "default_model": settings.default_anthropic_model,
            })

        # OpenAI
        if settings.openai_api_key:
            providers.append({
                "name": "openai",
                "label": "OpenAI (GPT)",
                "models": OpenAIProvider.MODELS,
                "default_model": settings.default_openai_model,
            })

        # Ollama (always available if configured)
        providers.append({
            "name": "ollama",
            "label": "Ollama (Local)",
            "models": OllamaProvider.DEFAULT_MODELS,
            "default_model": settings.default_ollama_model,
        })

        # AIMindSky
        if settings.aimindsky_api_key:
            providers.append({
                "name": "aimindsky",
                "label": "AIMindSky (代理)",
                "models": AIMindSkyProvider.MODELS,
                "default_model": settings.default_aimindsky_model,
            })

        return providers

    @classmethod
    async def close_all(cls) -> None:
        """Close all cached provider instances."""
        for provider in cls._instances.values():
            await provider.close()
        cls._instances.clear()


def get_provider(provider_type: ProviderType | None = None) -> BaseProvider:
    """Convenience function to get a provider instance."""
    return ProviderFactory.get(provider_type)
