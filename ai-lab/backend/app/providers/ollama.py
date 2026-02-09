"""Ollama (local models) provider implementation."""

from collections.abc import AsyncIterator

import httpx

from app.providers.base import (
    BaseProvider,
    ChatMessage,
    ChatResponse,
    ProviderConfig,
    StreamChunk,
)


class OllamaProvider(BaseProvider):
    """Ollama local models provider."""

    DEFAULT_MODELS = [
        "llama3.2",
        "llama3.1",
        "mistral",
        "codellama",
        "llava",
    ]

    def __init__(self, config: ProviderConfig):
        """Initialize Ollama provider."""
        super().__init__(config)
        self._base_url = config.base_url or "http://localhost:11434"
        self._client = httpx.AsyncClient(base_url=self._base_url, timeout=120.0)

    @property
    def name(self) -> str:
        """Return the provider name."""
        return "ollama"

    @property
    def available_models(self) -> list[str]:
        """Return list of available models."""
        return self.DEFAULT_MODELS

    def _convert_messages(self, messages: list[ChatMessage]) -> list[dict]:
        """Convert ChatMessage list to Ollama format."""
        converted = []

        for msg in messages:
            if isinstance(msg.content, str):
                converted.append({"role": msg.role, "content": msg.content})
            else:
                # Handle multimodal content
                text_parts = []
                images = []
                for block in msg.content:
                    if block.get("type") == "text":
                        text_parts.append(block["text"])
                    elif block.get("type") == "image":
                        images.append(block["data"])

                message = {"role": msg.role, "content": " ".join(text_parts)}
                if images:
                    message["images"] = images
                converted.append(message)

        return converted

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

        response = await self._client.post(
            "/api/chat",
            json={
                "model": model,
                "messages": converted_messages,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens,
                },
            },
        )
        response.raise_for_status()
        data = response.json()

        return ChatResponse(
            content=data.get("message", {}).get("content", ""),
            model=model,
            usage={
                "input_tokens": data.get("prompt_eval_count", 0),
                "output_tokens": data.get("eval_count", 0),
            },
            finish_reason="stop",
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

        async with self._client.stream(
            "POST",
            "/api/chat",
            json={
                "model": model,
                "messages": converted_messages,
                "stream": True,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens,
                },
            },
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line:
                    continue

                import json

                data = json.loads(line)
                content = data.get("message", {}).get("content", "")

                if data.get("done"):
                    yield StreamChunk(
                        content=content,
                        is_final=True,
                        usage={
                            "input_tokens": data.get("prompt_eval_count", 0),
                            "output_tokens": data.get("eval_count", 0),
                        },
                    )
                else:
                    yield StreamChunk(content=content)

    async def close(self):
        """Close the Ollama client."""
        await self._client.aclose()
