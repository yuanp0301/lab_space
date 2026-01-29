"""Base Provider abstraction for AI models."""

from abc import ABC, abstractmethod
from collections.abc import AsyncIterator
from dataclasses import dataclass, field
from typing import Literal


@dataclass
class ChatMessage:
    """A chat message with role and content."""

    role: Literal["user", "assistant", "system"]
    content: str | list[dict]  # str or multimodal content blocks


@dataclass
class ProviderConfig:
    """Configuration for a provider."""

    name: str
    api_key: str = ""
    base_url: str | None = None
    default_model: str = ""


@dataclass
class ChatResponse:
    """Response from a chat completion."""

    content: str
    model: str
    usage: dict = field(default_factory=dict)
    finish_reason: str = ""


@dataclass
class StreamChunk:
    """A chunk from a streaming response."""

    content: str
    is_final: bool = False
    usage: dict | None = None


class BaseProvider(ABC):
    """Abstract base class for AI providers."""

    def __init__(self, config: ProviderConfig):
        """Initialize the provider with configuration."""
        self.config = config
        self._client = None

    @property
    @abstractmethod
    def name(self) -> str:
        """Return the provider name."""
        pass

    @property
    @abstractmethod
    def available_models(self) -> list[str]:
        """Return list of available models."""
        pass

    @abstractmethod
    async def chat(
        self,
        messages: list[ChatMessage],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        **kwargs,
    ) -> ChatResponse:
        """Send a chat completion request."""
        pass

    @abstractmethod
    async def chat_stream(
        self,
        messages: list[ChatMessage],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        **kwargs,
    ) -> AsyncIterator[StreamChunk]:
        """Send a streaming chat completion request."""
        pass

    def _get_model(self, model: str | None) -> str:
        """Get the model to use, falling back to default."""
        return model or self.config.default_model

    async def close(self):
        """Close the provider client."""
        if hasattr(self._client, "close"):
            await self._client.close()
