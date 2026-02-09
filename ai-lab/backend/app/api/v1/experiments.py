"""Experiments API endpoints."""

from fastapi import APIRouter, HTTPException

from app.experiments.base import ExperimentInput
from app.experiments.registry import get_experiment, get_experiments
from app.providers.base import ChatMessage as ProviderChatMessage
from app.providers.base import StreamChunk
from app.schemas.experiment import (
    ExperimentExecuteRequest,
    ExperimentExecuteResponse,
    ExperimentInfo,
    ExperimentListResponse,
)
from app.utils.sse import create_sse_response

router = APIRouter()


def convert_messages(messages: list) -> list[ProviderChatMessage]:
    """Convert API messages to provider messages."""
    result = []
    for msg in messages:
        if isinstance(msg.content, str):
            content = msg.content
        else:
            content = []
            for block in msg.content:
                if block.type == "text":
                    content.append({"type": "text", "text": block.text})
                elif block.type == "image":
                    content.append({
                        "type": "image",
                        "data": block.data,
                        "media_type": block.media_type,
                    })

        result.append(ProviderChatMessage(role=msg.role, content=content))
    return result


@router.get("", response_model=ExperimentListResponse)
async def list_experiments(category: str | None = None):
    """List all available experiments."""
    experiments = get_experiments(category)
    return ExperimentListResponse(
        experiments=[ExperimentInfo(**e.to_dict()) for e in experiments],
        total=len(experiments),
    )


@router.get("/{experiment_id}", response_model=ExperimentInfo)
async def get_experiment_info(experiment_id: str):
    """Get information about a specific experiment."""
    experiment = get_experiment(experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return ExperimentInfo(**experiment.to_dict())


@router.post("/{experiment_id}/execute", response_model=ExperimentExecuteResponse)
async def execute_experiment(experiment_id: str, request: ExperimentExecuteRequest):
    """Execute an experiment (non-streaming)."""
    experiment = get_experiment(experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")

    try:
        input_data = ExperimentInput(
            messages=convert_messages(request.messages),
            provider=request.provider,
            model=request.model,
            parameters=request.parameters,
        )

        # Validate input
        errors = experiment.validate_input(input_data)
        if errors:
            raise HTTPException(status_code=400, detail={"errors": errors})

        result = await experiment.execute(input_data)

        return ExperimentExecuteResponse(
            content=result.content,
            metadata=result.metadata,
            usage=result.usage,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{experiment_id}/stream")
async def stream_experiment(experiment_id: str, request: ExperimentExecuteRequest):
    """Execute an experiment with streaming output."""
    experiment = get_experiment(experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")

    if not experiment.config.supports_streaming:
        raise HTTPException(
            status_code=400,
            detail="This experiment does not support streaming",
        )

    try:
        input_data = ExperimentInput(
            messages=convert_messages(request.messages),
            provider=request.provider,
            model=request.model,
            parameters=request.parameters,
        )

        # Validate input
        errors = experiment.validate_input(input_data)
        if errors:
            raise HTTPException(status_code=400, detail={"errors": errors})

        async def generate():
            async for chunk in experiment.execute_stream(input_data):
                yield chunk

        def transform_chunk(chunk: StreamChunk) -> dict:
            return {
                "content": chunk.content,
                "is_final": chunk.is_final,
                "usage": chunk.usage,
            }

        return create_sse_response(generate(), transform=transform_chunk)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
