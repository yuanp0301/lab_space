"""Experiment-related Pydantic schemas."""

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.chat import ChatMessage


class ExperimentInfo(BaseModel):
    """Information about an experiment."""

    id: str
    name: str
    description: str
    category: Literal["llm", "multimodal", "agents", "traditional"]
    icon: str = ""
    tags: list[str] = Field(default_factory=list)
    supports_streaming: bool = True
    supports_multimodal: bool = False
    default_provider: str | None = None
    default_model: str | None = None
    parameters: list[dict] = Field(default_factory=list)


class ExperimentListResponse(BaseModel):
    """Response containing list of experiments."""

    experiments: list[ExperimentInfo]
    total: int


class ExperimentExecuteRequest(BaseModel):
    """Request to execute an experiment."""

    messages: list[ChatMessage] = Field(default_factory=list)
    provider: str | None = None
    model: str | None = None
    parameters: dict = Field(default_factory=dict)
    stream: bool = False


class ExperimentExecuteResponse(BaseModel):
    """Response from experiment execution."""

    content: str
    metadata: dict = Field(default_factory=dict)
    usage: dict = Field(default_factory=dict)
