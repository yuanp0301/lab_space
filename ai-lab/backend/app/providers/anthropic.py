"""Anthropic (Claude) provider implementation."""

from collections.abc import AsyncIterator

import anthropic

from app.providers.base import (
    BaseProvider,
    ChatMessage,
    ChatResponse,
    ProviderConfig,
    StreamChunk,
)


class AnthropicProvider(BaseProvider):
    """Anthropic Claude provider."""

    MODELS = [
        "claude-sonnet-4-20250514",
        "claude-opus-4-20250514",
        "claude-3-5-haiku-20241022",
    ]

    def __init__(self, config: ProviderConfig):
        """Initialize Anthropic provider."""
        super().__init__(config)
        self._client = anthropic.AsyncAnthropic(api_key=config.api_key)

    @property
    def name(self) -> str:
        """Return the provider name."""
        return "anthropic"

    @property
    def available_models(self) -> list[str]:
        """Return list of available models."""
        return self.MODELS

    def _convert_messages(
        self, messages: list[ChatMessage]
    ) -> tuple[str | None, list[dict]]:
        """Convert ChatMessage list to Anthropic format.

        Returns (system_prompt, messages).
        """
        system_prompt = None
        converted = []

        for msg in messages:
            if msg.role == "system":
                system_prompt = msg.content if isinstance(msg.content, str) else ""
            else:
                if isinstance(msg.content, str):
                    content = msg.content
                else:
                    # Handle multimodal content
                    content = self._convert_content_blocks(msg.content)
                converted.append({"role": msg.role, "content": content})

        return system_prompt, converted

    def _convert_content_blocks(self, content: list[dict]) -> list[dict]:
        """Convert content blocks to Anthropic format."""
        blocks = []
        for block in content:
            if block.get("type") == "text":
                blocks.append({"type": "text", "text": block["text"]})
            elif block.get("type") == "image":
                # Support base64 images
                blocks.append({
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": block.get("media_type", "image/jpeg"),
                        "data": block["data"],
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
        system_prompt, converted_messages = self._convert_messages(messages)

        params = {
            "model": model,
            "messages": converted_messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        if system_prompt:
            params["system"] = system_prompt

        response = await self._client.messages.create(**params)

        return ChatResponse(
            content=response.content[0].text if response.content else "",
            model=response.model,
            usage={
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            },
            finish_reason=response.stop_reason or "",
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
        system_prompt, converted_messages = self._convert_messages(messages)

        params = {
            "model": model,
            "messages": converted_messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        if system_prompt:
            params["system"] = system_prompt

        async with self._client.messages.stream(**params) as stream:
            async for text in stream.text_stream:
                yield StreamChunk(content=text)

            # Get final message for usage stats
            final_message = await stream.get_final_message()
            yield StreamChunk(
                content="",
                is_final=True,
                usage={
                    "input_tokens": final_message.usage.input_tokens,
                    "output_tokens": final_message.usage.output_tokens,
                },
            )

    async def close(self):
        """Close the Anthropic client."""
        await self._client.close()
