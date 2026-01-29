"""Base experiment class and configuration."""

from abc import ABC, abstractmethod
from collections.abc import AsyncIterator
from dataclasses import dataclass, field
from typing import Any, Literal

from app.providers import get_provider
from app.providers.base import ChatMessage, StreamChunk


@dataclass
class ExperimentConfig:
    """Configuration for an experiment."""

    id: str
    name: str
    description: str
    category: Literal["llm", "multimodal", "agents", "traditional"]
    icon: str = ""
    tags: list[str] = field(default_factory=list)
    supports_streaming: bool = True
    supports_multimodal: bool = False
    default_provider: str | None = None
    default_model: str | None = None
    parameters: list[dict] = field(default_factory=list)


@dataclass
class ExperimentInput:
    """Input for an experiment execution."""

    messages: list[ChatMessage] = field(default_factory=list)
    provider: str | None = None
    model: str | None = None
    parameters: dict = field(default_factory=dict)
    files: list[dict] = field(default_factory=list)


@dataclass
class ExperimentResult:
    """Result from an experiment execution."""

    content: str
    metadata: dict = field(default_factory=dict)
    usage: dict = field(default_factory=dict)


class BaseExperiment(ABC):
    """Abstract base class for experiments."""

    config: ExperimentConfig

    def __init__(self):
        """Initialize the experiment."""
        if not hasattr(self, "config"):
            raise ValueError("Experiment must define a config attribute")

    @property
    def id(self) -> str:
        """Return the experiment ID."""
        return self.config.id

    @property
    def name(self) -> str:
        """Return the experiment name."""
        return self.config.name

    def get_provider(self, provider_type: str | None = None):
        """Get an AI provider instance."""
        return get_provider(provider_type or self.config.default_provider)

    @abstractmethod
    async def execute(
        self,
        input_data: ExperimentInput,
        **kwargs,
    ) -> ExperimentResult:
        """Execute the experiment and return the result."""
        pass

    async def execute_stream(
        self,
        input_data: ExperimentInput,
        **kwargs,
    ) -> AsyncIterator[StreamChunk]:
        """Execute the experiment with streaming output.

        Default implementation uses the provider's chat_stream.
        Override for custom streaming behavior.
        """
        if not self.config.supports_streaming:
            result = await self.execute(input_data, **kwargs)
            yield StreamChunk(content=result.content, is_final=True)
            return

        provider = self.get_provider(input_data.provider)
        model = input_data.model or self.config.default_model

        async for chunk in provider.chat_stream(
            messages=input_data.messages,
            model=model,
            **input_data.parameters,
        ):
            yield chunk

    def validate_input(self, input_data: ExperimentInput) -> list[str]:
        """Validate input data. Return list of error messages."""
        errors = []

        if not input_data.messages:
            errors.append("Messages are required")

        return errors

    def to_dict(self) -> dict[str, Any]:
        """Convert experiment config to dictionary."""
        return {
            "id": self.config.id,
            "name": self.config.name,
            "description": self.config.description,
            "category": self.config.category,
            "icon": self.config.icon,
            "tags": self.config.tags,
            "supports_streaming": self.config.supports_streaming,
            "supports_multimodal": self.config.supports_multimodal,
            "default_provider": self.config.default_provider,
            "default_model": self.config.default_model,
            "parameters": self.config.parameters,
        }
