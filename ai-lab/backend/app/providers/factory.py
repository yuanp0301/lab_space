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
        """Create a new provider instance.
        
        注意：所有 provider 类型统一使用 AIMindSky 服务。
        """
        settings = get_settings()

        # 统一使用 AIMindSky provider
        config = ProviderConfig(
            name="aimindsky",
            api_key=settings.aimindsky_api_key,
            base_url=settings.aimindsky_base_url,
            default_model=settings.default_aimindsky_model,
        )

        return AIMindSkyProvider(config)

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
        """Get list of available providers with their models.
        
        注意：统一返回 AIMindSky provider，所有模型请求都通过 AIMindSky 代理。
        """
        settings = get_settings()
        providers = []

        # 统一使用 AIMindSky
        providers.append({
            "name": "aimindsky",
            "label": "AIMindSky (代理)",
            "models": AIMindSkyProvider.MODELS,
            "default_model": settings.default_aimindsky_model,
        })

        # 为了兼容性，也返回其他 provider 名称（但实际都使用 AIMindSky）
        # 这样前端可以选择不同的 provider 名称，但后端统一使用 AIMindSky
        for provider_name in ["anthropic", "openai", "ollama"]:
            providers.append({
                "name": provider_name,
                "label": f"{provider_name} (通过 AIMindSky 代理)",
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
