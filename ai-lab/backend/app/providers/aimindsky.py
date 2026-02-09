"""AIMindSky (代理大模型) provider implementation."""

import json
from collections.abc import AsyncIterator

import httpx

from app.providers.base import (
    BaseProvider,
    ChatMessage,
    ChatResponse,
    ProviderConfig,
    StreamChunk,
)


class AIMindSkyProvider(BaseProvider):
    """AIMindSky 代理大模型 provider."""

    MODELS = [
        "gpt-4o",
        "gpt-4o-mini",
        "gpt-4-turbo",
        "gpt-3.5-turbo",
        "claude-sonnet-4-20250514",
        "claude-opus-4-20250514",
        "claude-3-5-haiku-20241022",
    ]

    def __init__(self, config: ProviderConfig):
        """Initialize AIMindSky provider."""
        super().__init__(config)
        base_url = config.base_url or "https://api.aimindsky.com/v1"
        headers = {
            "Content-Type": "application/json",
        }
        if config.api_key:
            headers["Authorization"] = f"Bearer {config.api_key}"

        self._base_url = base_url
        self._headers = headers
        self._client = httpx.AsyncClient(
            base_url=base_url,
            headers=headers,
            timeout=120.0,
        )

    @property
    def name(self) -> str:
        """Return the provider name."""
        return "aimindsky"

    @property
    def available_models(self) -> list[str]:
        """Return list of available models."""
        return self.MODELS

    def _convert_messages(self, messages: list[ChatMessage]) -> list[dict]:
        """Convert ChatMessage list to OpenAI-compatible format."""
        converted = []

        for msg in messages:
            if isinstance(msg.content, str):
                converted.append({"role": msg.role, "content": msg.content})
            else:
                # Handle multimodal content
                content = self._convert_content_blocks(msg.content)
                converted.append({"role": msg.role, "content": content})

        return converted

    def _convert_content_blocks(self, content: list[dict]) -> list[dict]:
        """Convert content blocks to OpenAI-compatible format."""
        blocks = []
        for block in content:
            if block.get("type") == "text":
                blocks.append({"type": "text", "text": block["text"]})
            elif block.get("type") == "image":
                # Support base64 images
                media_type = block.get("media_type", "image/jpeg")
                data = block["data"]
                blocks.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{media_type};base64,{data}",
                    },
                })
        return blocks

    async def chat(
        self,
        messages: list[ChatMessage],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        **kwargs,
    ) -> ChatResponse:
        """Send a chat completion request."""
        model = self._get_model(model)
        converted_messages = self._convert_messages(messages)

        payload = {
            "model": model,
            "messages": converted_messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }

        response = await self._client.post(
            "/chat/completions",
            json=payload,
        )
        response.raise_for_status()
        data = response.json()

        # Handle OpenAI-compatible response format
        choice = data.get("choices", [{}])[0]
        message = choice.get("message", {})
        usage = data.get("usage", {})

        return ChatResponse(
            content=message.get("content", ""),
            model=data.get("model", model),
            usage={
                "input_tokens": usage.get("prompt_tokens", 0),
                "output_tokens": usage.get("completion_tokens", 0),
            },
            finish_reason=choice.get("finish_reason", ""),
        )

    async def chat_stream(
        self,
        messages: list[ChatMessage],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        **kwargs,
    ) -> AsyncIterator[StreamChunk]:
        """Send a streaming chat completion request."""
        model = self._get_model(model)
        converted_messages = self._convert_messages(messages)

        payload = {
            "model": model,
            "messages": converted_messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": True,
        }

        async with self._client.stream(
            "POST",
            "/chat/completions",
            json=payload,
        ) as response:
            response.raise_for_status()

            async for line in response.aiter_lines():
                if not line.strip():
                    continue

                # Handle SSE format: "data: {...}"
                if line.startswith("data: "):
                    line = line[6:]  # Remove "data: " prefix

                if line.strip() == "[DONE]":
                    break

                try:
                    chunk_data = json.loads(line)
                    choices = chunk_data.get("choices", [])
                    if choices:
                        delta = choices[0].get("delta", {})
                        content = delta.get("content", "")
                        if content:
                            yield StreamChunk(content=content)

                    # Check for final chunk with usage
                    usage = chunk_data.get("usage")
                    if usage:
                        yield StreamChunk(
                            content="",
                            is_final=True,
                            usage={
                                "input_tokens": usage.get("prompt_tokens", 0),
                                "output_tokens": usage.get("completion_tokens", 0),
                            },
                        )
                except json.JSONDecodeError:
                    # Skip invalid JSON lines
                    continue

    async def close(self):
        """Close the AIMindSky client."""
        await self._client.aclose()
