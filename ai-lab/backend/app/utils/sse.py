"""Server-Sent Events (SSE) utilities."""

from __future__ import annotations

import json
from collections.abc import AsyncIterator, Callable
from typing import Any

from fastapi.responses import StreamingResponse


def sse_event(data: Any, event: str | None = None) -> str:
    """Format data as an SSE event.

    Args:
        data: Data to send (will be JSON encoded if not a string)
        event: Optional event type name

    Returns:
        Formatted SSE event string
    """
    lines = []

    if event:
        lines.append(f"event: {event}")

    if isinstance(data, str):
        json_data = json.dumps({"content": data})
    else:
        json_data = json.dumps(data)

    lines.append(f"data: {json_data}")
    lines.append("")  # Empty line to end the event

    return "\n".join(lines) + "\n"


async def stream_generator(
    async_iterator: AsyncIterator,
    transform: Callable | None = None,
) -> AsyncIterator[str]:
    """Convert an async iterator to SSE events.

    Args:
        async_iterator: Source async iterator
        transform: Optional function to transform each item before sending

    Yields:
        Formatted SSE event strings
    """
    try:
        async for item in async_iterator:
            if transform:
                item = transform(item)
            yield sse_event(item)
    except Exception as e:
        yield sse_event({"error": str(e)}, event="error")


def create_sse_response(
    async_iterator: AsyncIterator,
    transform: Callable | None = None,
) -> StreamingResponse:
    """Create an SSE streaming response.

    Args:
        async_iterator: Source async iterator
        transform: Optional function to transform each item

    Returns:
        FastAPI StreamingResponse configured for SSE
    """
    return StreamingResponse(
        stream_generator(async_iterator, transform),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
