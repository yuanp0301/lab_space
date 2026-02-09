"""图片理解实验 - 多模态图像分析."""

from collections.abc import AsyncIterator

from app.experiments.base import (
    BaseExperiment,
    ExperimentConfig,
    ExperimentInput,
    ExperimentResult,
)
from app.experiments.registry import register_experiment
from app.providers.base import StreamChunk


@register_experiment
class ImageChatExperiment(BaseExperiment):
    """图片理解实验 - 支持图片上传和分析."""

    config = ExperimentConfig(
        id="image-chat",
        name="图片理解",
        description="上传图片并与 AI 讨论图片内容，支持多种图片格式",
        category="multimodal",
        icon="🖼️",
        tags=["图片", "多模态", "视觉"],
        supports_streaming=True,
        supports_multimodal=True,
        default_provider="anthropic",
        parameters=[
            {
                "name": "temperature",
                "type": "float",
                "default": 0.7,
                "description": "控制输出的随机性",
            },
            {
                "name": "detail",
                "type": "string",
                "default": "auto",
                "description": "图片分析详细程度 (auto/low/high)",
            },
        ],
    )

    def validate_input(self, input_data: ExperimentInput) -> list[str]:
        """Validate that images are provided."""
        errors = super().validate_input(input_data)

        # Check if there are any image content blocks
        has_image = False
        for msg in input_data.messages:
            if isinstance(msg.content, list):
                for block in msg.content:
                    if isinstance(block, dict) and block.get("type") == "image":
                        has_image = True
                        break
            if has_image:
                break

        if not has_image and not input_data.files:
            # Allow text-only messages after initial image
            pass

        return errors

    async def execute(
        self,
        input_data: ExperimentInput,
        **kwargs,
    ) -> ExperimentResult:
        """Execute the image chat experiment."""
        provider = self.get_provider(input_data.provider)
        model = input_data.model

        temperature = input_data.parameters.get("temperature", 0.7)
        max_tokens = input_data.parameters.get("max_tokens", 4096)

        response = await provider.chat(
            messages=input_data.messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        return ExperimentResult(
            content=response.content,
            metadata={
                "model": response.model,
                "finish_reason": response.finish_reason,
            },
            usage=response.usage,
        )

    async def execute_stream(
        self,
        input_data: ExperimentInput,
        **kwargs,
    ) -> AsyncIterator[StreamChunk]:
        """Execute with streaming output."""
        provider = self.get_provider(input_data.provider)
        model = input_data.model or self.config.default_model

        temperature = input_data.parameters.get("temperature", 0.7)
        max_tokens = input_data.parameters.get("max_tokens", 4096)

        async for chunk in provider.chat_stream(
            messages=input_data.messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
        ):
            yield chunk
