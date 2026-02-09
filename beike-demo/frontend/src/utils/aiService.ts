import axios from "axios";

// AI系统提示词
const SYSTEM_PROMPT = `你是一位资深的语文教学专家，帮助老师设计高质量的课程。

你的专长包括：
- 分析教学内容，提炼核心价值
- 设计情境任务式、分组探究式等创新教学模式
- 推荐合适的教学素材
- 评估课程设计的有效性，提供优化建议
- 生成分层作业

请始终：
- 遵循新课标要求和核心素养导向
- 以学生为中心设计教学活动
- 提供具体、可操作的建议
- 保持专业、友好的沟通风格`;

// API配置
let apiConfig: {
  api_key: string;
  api_url: string;
  model: string;
} | null = null;

// 加载API配置
export const loadApiConfig = async () => {
  try {
    const response = await fetch("/config/api.json");
    apiConfig = await response.json();

    // 如果没有配置API URL，使用默认的aimindsky地址
    if (!apiConfig?.api_url) {
      apiConfig = {
        ...apiConfig!,
        api_url: "https://api.aimindsky.com/v1/messages",
      };
    }

    // 如果没有配置模型，使用默认的Claude模型
    if (!apiConfig?.model) {
      apiConfig = {
        ...apiConfig!,
        model: "claude-3-5-sonnet-20241022",
      };
    }
  } catch (error) {
    console.error("加载API配置失败:", error);
    throw error;
  }
};

// AI消息类型
export type AIMessage = {
  role: "user" | "assistant";
  content: string;
};

// 调用Claude API（通过aimindsky代理）
export const callClaudeAPI = async (
  messages: AIMessage[],
  systemPrompt: string = SYSTEM_PROMPT,
): Promise<string> => {
  if (!apiConfig) {
    await loadApiConfig();
  }

  if (!apiConfig) {
    throw new Error("API配置未加载");
  }

  if (!apiConfig.api_key) {
    throw new Error("请先配置API Key");
  }

  try {
    const response = await axios.post(
      apiConfig.api_url,
      {
        model: apiConfig.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiConfig.api_key}`,
          "anthropic-version": "2023-06-01",
        },
      },
    );

    return response.data.content[0].text;
  } catch (error: any) {
    console.error("调用Claude API失败:", error);
    if (error.response) {
      console.error("错误详情:", error.response.data);
      throw new Error(
        `API调用失败: ${error.response.data.error?.message || error.message}`,
      );
    }
    throw error;
  }
};

// 素材智能匹配
export const recommendMaterials = async (
  contextDescription: string,
  materialsContext: string,
): Promise<string> => {
  const messages: AIMessage[] = [
    {
      role: "user",
      content: `我正在设计以下教学环节：

${contextDescription}

以下是可用的素材清单：
${materialsContext}

请从素材清单中推荐3-5个最合适的素材，并说明推荐理由。请以JSON格式返回，格式如下：
[
  {
    "materialId": "素材ID",
    "materialName": "素材名称",
    "reason": "推荐理由"
  }
]`,
    },
  ];

  return await callClaudeAPI(messages);
};

// 设计评估优化
export const evaluateCourseDesign = async (
  courseDesignContent: string,
  teachingTheory: string,
): Promise<string> => {
  const messages: AIMessage[] = [
    {
      role: "user",
      content: `请评估以下课程设计：

${courseDesignContent}

参考教学理论：
${teachingTheory}

请从以下维度进行评估：
1. 教学目标是否明确、合理
2. 教学活动是否以学生为中心
3. 问题链设计是否层层递进
4. 知识点覆盖是否完整
5. 教学方法是否创新有效

请提供：
- 优点（3-5条）
- 需要改进的问题（3-5条）
- 具体的优化建议（3-5条）`,
    },
  ];

  return await callClaudeAPI(messages);
};

// 生成分层作业
export const generateAssignments = async (
  courseDesignContent: string,
  referenceAssignment: string,
): Promise<string> => {
  const messages: AIMessage[] = [
    {
      role: "user",
      content: `基于以下课程设计内容：

${courseDesignContent}

参考作业示例：
${referenceAssignment}

请生成三个层次的作业：
1. 基础练习（3-5题）：巩固字词、文学常识等基础知识
2. 能力提升（2-3题）：考查文本理解、分析能力
3. 创新应用（1-2题）：要求创造性思维和迁移运用

请以JSON格式返回，格式如下：
{
  "basic": [
    {
      "question": "题目",
      "answer": "参考答案",
      "score": 分值
    }
  ],
  "advanced": [...],
  "creative": [...]
}`,
    },
  ];

  return await callClaudeAPI(messages);
};

// 通用AI对话
export const chatWithAI = async (
  userMessage: string,
  conversationHistory: AIMessage[] = [],
  context?: string,
): Promise<string> => {
  const messages: AIMessage[] = [
    ...conversationHistory,
    {
      role: "user",
      content: context ? `${context}\n\n${userMessage}` : userMessage,
    },
  ];

  return await callClaudeAPI(messages);
};
