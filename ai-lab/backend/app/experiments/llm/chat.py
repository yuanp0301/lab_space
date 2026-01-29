"""通用对话实验 - LLM 基础聊天功能."""

from app.experiments.base import (
    BaseExperiment,
    ExperimentConfig,
    ExperimentInput,
    ExperimentResult,
)
from app.experiments.registry import register_experiment


@register_experiment
class ChatExperiment(BaseExperiment):
    """通用对话实验 - 基础的 LLM 聊天功能."""

    config = ExperimentConfig(
        id="chat",
        name="通用对话",
        description="与 AI 进行自由对话，支持多种模型和流式输出",
        category="llm",
        icon="💬",
        tags=["对话", "基础", "流式"],
        supports_streaming=True,
        supports_multimodal=False,
        parameters=[
            {
                "name": "temperature",
                "type": "float",
                "default": 0.7,
                "description": "控制输出的随机性 (0-2)",
            },
            {
                "name": "max_tokens",
                "type": "int",
                "default": 4096,
                "description": "最大输出长度",
            },
        ],
    )

    async def execute(
        self,
        input_data: ExperimentInput,
        **kwargs,
    ) -> ExperimentResult:
        """Execute the chat experiment."""
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
            metadata={"model": response.model, "finish_reason": response.finish_reason},
            usage=response.usage,
        )
