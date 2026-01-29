"""提示词市场实验 - 预置提示词模板."""

from collections.abc import AsyncIterator

from app.experiments.base import (
    BaseExperiment,
    ExperimentConfig,
    ExperimentInput,
    ExperimentResult,
)
from app.experiments.registry import register_experiment
from app.providers.base import ChatMessage, StreamChunk

# 预置提示词模板
PROMPT_TEMPLATES = {
    "translator": {
        "name": "翻译助手",
        "description": "将文本翻译成目标语言",
        "system_prompt": """你是一位专业的翻译专家，精通多种语言。请将用户输入的内容翻译成指定的目标语言。
翻译时请注意：
1. 保持原文的语气和风格
2. 专业术语使用准确
3. 翻译自然流畅，符合目标语言的表达习惯
如果用户没有指定目标语言，默认翻译成英文。""",
    },
    "code_reviewer": {
        "name": "代码审查员",
        "description": "审查代码并提供改进建议",
        "system_prompt": """你是一位经验丰富的高级软件工程师，专门负责代码审查。
请对用户提供的代码进行详细审查，关注以下方面：
1. 代码质量和可读性
2. 潜在的 bug 和安全问题
3. 性能优化建议
4. 最佳实践和设计模式
5. 单元测试建议
请给出具体的改进建议和示例代码。""",
    },
    "writing_assistant": {
        "name": "写作助手",
        "description": "帮助润色和改进文章",
        "system_prompt": """你是一位专业的写作顾问，擅长各类文体的写作和润色。
请帮助用户：
1. 润色和改进文章表达
2. 纠正语法和拼写错误
3. 优化文章结构
4. 提供写作建议
保持原文的核心意思，同时让表达更加清晰、流畅、有感染力。""",
    },
    "tech_explainer": {
        "name": "技术讲解员",
        "description": "用简单易懂的方式解释技术概念",
        "system_prompt": """你是一位擅长科普的技术专家，能够将复杂的技术概念用简单易懂的方式解释给普通人。
解释时请：
1. 使用日常生活中的类比
2. 避免过多专业术语
3. 从简单到复杂，循序渐进
4. 提供具体的例子
5. 总结核心要点
目标是让没有技术背景的人也能理解。""",
    },
    "sql_expert": {
        "name": "SQL 专家",
        "description": "帮助编写和优化 SQL 查询",
        "system_prompt": """你是一位数据库专家，精通各种 SQL 方言（MySQL、PostgreSQL、SQL Server 等）。
请帮助用户：
1. 根据需求编写 SQL 查询
2. 优化现有的 SQL 语句
3. 解释 SQL 执行计划
4. 提供索引优化建议
5. 处理复杂的数据查询需求
请给出可直接执行的 SQL 代码，并解释查询逻辑。""",
    },
}


@register_experiment
class PromptMarketExperiment(BaseExperiment):
    """提示词市场实验 - 使用预置提示词模板."""

    config = ExperimentConfig(
        id="prompt-market",
        name="提示词市场",
        description="使用精选的提示词模板，快速启动专业对话场景",
        category="llm",
        icon="📚",
        tags=["提示词", "模板", "场景"],
        supports_streaming=True,
        supports_multimodal=False,
        parameters=[
            {
                "name": "template",
                "type": "string",
                "default": "translator",
                "description": "选择提示词模板",
                "options": list(PROMPT_TEMPLATES.keys()),
            },
            {
                "name": "temperature",
                "type": "float",
                "default": 0.7,
                "description": "控制输出的随机性",
            },
        ],
    )

    def get_available_templates(self) -> dict:
        """Get list of available prompt templates."""
        return {
            k: {"name": v["name"], "description": v["description"]}
            for k, v in PROMPT_TEMPLATES.items()
        }

    def _prepare_messages(
        self, input_data: ExperimentInput
    ) -> list[ChatMessage]:
        """Prepare messages with system prompt from template."""
        template_key = input_data.parameters.get("template", "translator")
        template = PROMPT_TEMPLATES.get(template_key, PROMPT_TEMPLATES["translator"])

        messages = [
            ChatMessage(role="system", content=template["system_prompt"])
        ]
        messages.extend(input_data.messages)
        return messages

    async def execute(
        self,
        input_data: ExperimentInput,
        **kwargs,
    ) -> ExperimentResult:
        """Execute the prompt market experiment."""
        provider = self.get_provider(input_data.provider)
        model = input_data.model

        temperature = input_data.parameters.get("temperature", 0.7)
        max_tokens = input_data.parameters.get("max_tokens", 4096)

        messages = self._prepare_messages(input_data)

        response = await provider.chat(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        return ExperimentResult(
            content=response.content,
            metadata={
                "model": response.model,
                "template": input_data.parameters.get("template", "translator"),
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

        messages = self._prepare_messages(input_data)

        async for chunk in provider.chat_stream(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
        ):
            yield chunk
