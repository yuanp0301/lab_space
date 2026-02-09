"""Chat-related Pydantic schemas."""

from typing import Literal

from pydantic import BaseModel, Field


class ContentBlock(BaseModel):
    """A content block for multimodal messages."""

    type: Literal["text", "image"]
    text: str | None = None
    data: str | None = None  # Base64 encoded image data
    media_type: str | None = None  # e.g., "image/jpeg"


class ChatMessage(BaseModel):
    """A chat message with role and content."""

    role: Literal["user", "assistant", "system"]
    content: str | list[ContentBlock]


class ChatCompletionRequest(BaseModel):
    """Request for chat completion."""

    messages: list[ChatMessage]
    provider: str | None = None
    model: str | None = None
    temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=4096, ge=1, le=100000)
    stream: bool = False


class ChatCompletionResponse(BaseModel):
    """Response from chat completion."""

    content: str
    model: str
    usage: dict = Field(default_factory=dict)
    finish_reason: str = ""


class ProviderInfo(BaseModel):
    """Information about an AI provider."""

    name: str
    label: str
    models: list[str]
    default_model: str
