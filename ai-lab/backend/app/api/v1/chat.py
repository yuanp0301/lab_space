"""Chat API endpoints."""

from fastapi import APIRouter, HTTPException

from app.providers import get_provider
from app.providers.base import ChatMessage as ProviderChatMessage
from app.providers.base import StreamChunk
from app.providers.factory import ProviderFactory
from app.schemas.chat import (
    ChatCompletionRequest,
    ChatCompletionResponse,
    ProviderInfo,
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
            # Convert content blocks
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


@router.get("/providers", response_model=list[ProviderInfo])
async def list_providers():
    """List available AI providers and their models."""
    return ProviderFactory.get_available_providers()


@router.post("/completions", response_model=ChatCompletionResponse)
async def create_completion(request: ChatCompletionRequest):
    """Create a chat completion (non-streaming)."""
    try:
        provider = get_provider(request.provider)
        messages = convert_messages(request.messages)

        response = await provider.chat(
            messages=messages,
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )

        return ChatCompletionResponse(
            content=response.content,
            model=response.model,
            usage=response.usage,
            finish_reason=response.finish_reason,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def create_stream(request: ChatCompletionRequest):
    """Create a streaming chat completion."""
    try:
        provider = get_provider(request.provider)
        messages = convert_messages(request.messages)

        async def generate():
            async for chunk in provider.chat_stream(
                messages=messages,
                model=request.model,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
            ):
                yield chunk

        def transform_chunk(chunk: StreamChunk) -> dict:
            return {
                "content": chunk.content,
                "is_final": chunk.is_final,
                "usage": chunk.usage,
            }

        return create_sse_response(generate(), transform=transform_chunk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
