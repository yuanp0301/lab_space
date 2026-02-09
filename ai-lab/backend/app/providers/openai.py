"""OpenAI provider implementation."""

from collections.abc import AsyncIterator

import openai

from app.providers.base import (
    BaseProvider,
    ChatMessage,
    ChatResponse,
    ProviderConfig,
    StreamChunk,
)


class OpenAIProvider(BaseProvider):
    """OpenAI GPT provider."""

    MODELS = [
        "gpt-4o",
        "gpt-4o-mini",
        "gpt-4-turbo",
        "gpt-3.5-turbo",
    ]

    def __init__(self, config: ProviderConfig):
        """Initialize OpenAI provider."""
        super().__init__(config)
        self._client = openai.AsyncOpenAI(api_key=config.api_key)

    @property
    def name(self) -> str:
        """Return the provider name."""
        return "openai"

    @property
    def available_models(self) -> list[str]:
        """Return list of available models."""
        return self.MODELS

    def _convert_messages(self, messages: list[ChatMessage]) -> list[dict]:
        """Convert ChatMessage list to OpenAI format."""
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
        """Convert content blocks to OpenAI format."""
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

        response = await self._client.chat.completions.create(
            model=model,
            messages=converted_messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )

        choice = response.choices[0]
        return ChatResponse(
            content=choice.message.content or "",
            model=response.model,
            usage={
                "input_tokens": response.usage.prompt_tokens if response.usage else 0,
                "output_tokens": response.usage.completion_tokens if response.usage else 0,
            },
            finish_reason=choice.finish_reason or "",
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

        stream = await self._client.chat.completions.create(
            model=model,
            messages=converted_messages,
            max_tokens=max_tokens,
            temperature=temperature,
            stream=True,
            stream_options={"include_usage": True},
        )

        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield StreamChunk(content=chunk.choices[0].delta.content)

            # Check for final chunk with usage
            if chunk.usage:
                yield StreamChunk(
                    content="",
                    is_final=True,
                    usage={
                        "input_tokens": chunk.usage.prompt_tokens,
                        "output_tokens": chunk.usage.completion_tokens,
                    },
                )

    async def close(self):
        """Close the OpenAI client."""
        await self._client.close()
