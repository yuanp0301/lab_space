import axios, { AxiosResponse } from "axios";
import * as fs from "fs";
import * as path from "path";

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
interface ApiConfig {
  api_key: string;
  api_url: string;
  model: string;
}

let apiConfig: ApiConfig | null = null;

// 加载API配置
async function loadApiConfig(): Promise<ApiConfig> {
  if (apiConfig) {
    return apiConfig;
  }

  try {
    // 尝试从config/api.json读取配置
    const configPath = path.join(process.cwd(), "..", "config", "api.json");
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, "utf-8");
      apiConfig = JSON.parse(configContent);
    } else {
      // 使用环境变量或默认值
      apiConfig = {
        api_key: process.env.AI_API_KEY || "",
        api_url:
          process.env.AI_API_URL || "https://api.aimindsky.com/v1/messages",
        model: process.env.AI_MODEL || "claude-3-5-sonnet-20241022",
      };
    }

    // 如果没有配置API URL，使用默认的aimindsky地址
    if (!apiConfig.api_url) {
      apiConfig.api_url = "https://api.aimindsky.com/v1/messages";
    }

    // 如果没有配置模型，使用默认的Claude模型
    if (!apiConfig.model) {
      apiConfig.model = "claude-3-5-sonnet-20241022";
    }

    if (!apiConfig.api_key) {
      throw new Error("API Key未配置，请在config/api.json或环境变量中设置");
    }

    return apiConfig;
  } catch (error) {
    console.error("加载API配置失败:", error);
    throw error;
  }
}

// AI消息类型
export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

// 流式响应回调
export type StreamCallback = (chunk: string, isComplete: boolean) => void;

/**
 * 调用Claude API（流式响应）
 */
export async function callClaudeAPIStream(
  messages: AIMessage[],
  systemPrompt: string = SYSTEM_PROMPT,
  onChunk?: StreamCallback,
): Promise<string> {
  const config = await loadApiConfig();

  try {
    // 检查API是否支持流式响应
    const supportsStream =
      config.api_url.includes("aimindsky") ||
      config.api_url.includes("anthropic") ||
      process.env.AI_STREAM_ENABLED === "true";

    if (!supportsStream) {
      // 如果不支持流式，使用普通调用
      console.log("API不支持流式响应，使用普通调用");
      const response = await callClaudeAPI(messages, systemPrompt);
      if (onChunk) {
        // 模拟流式输出
        const words = response.split("");
        for (let i = 0; i < words.length; i += 10) {
          const chunk = words.slice(i, i + 10).join("");
          await new Promise((resolve) => setTimeout(resolve, 50));
          onChunk(chunk, false);
        }
        onChunk("", true);
      }
      return response;
    }

    const response = await axios.post(
      config.api_url,
      {
        model: config.model,
        max_tokens: 8192,
        system: systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        stream: true, // 启用流式响应
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.api_key}`,
          "anthropic-version": "2023-06-01",
        },
        responseType: "stream", // 使用流式响应
      },
    );

    let fullResponse = "";
    const stream = response.data;

    return new Promise((resolve, reject) => {
      let buffer = "";

      stream.on("data", (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          // 跳过SSE事件标记行
          if (line.trim().startsWith("event:")) continue;

          // 处理SSE格式: data: {...}
          if (line.startsWith("data: ")) {
            const jsonStr = line.substring(6).trim();
            if (jsonStr === "[DONE]") {
              if (onChunk) {
                onChunk("", true);
              }
              resolve(fullResponse);
              return;
            }

            try {
              const data = JSON.parse(jsonStr);

              // Claude API流式响应格式
              if (data.type === "content_block_delta" && data.delta?.text) {
                const text = data.delta.text;
                fullResponse += text;
                if (onChunk) {
                  onChunk(text, false);
                }
              } else if (data.type === "message_stop") {
                if (onChunk) {
                  onChunk("", true);
                }
                resolve(fullResponse);
                return;
              } else if (data.content && Array.isArray(data.content)) {
                // 处理content数组格式
                for (const block of data.content) {
                  if (block.type === "text" && block.text) {
                    const text = block.text;
                    fullResponse += text;
                    if (onChunk) {
                      onChunk(text, false);
                    }
                  }
                }
              } else if (data.text) {
                // 直接文本格式
                const text = data.text;
                fullResponse += text;
                if (onChunk) {
                  onChunk(text, false);
                }
              }
            } catch (e) {
              // 忽略解析错误，继续处理下一行
              console.warn("解析流数据失败:", e, line);
            }
          } else {
            // 尝试直接解析JSON（非SSE格式）
            try {
              const data = JSON.parse(line);
              if (data.text || data.content) {
                const text = data.text || data.content;
                fullResponse += text;
                if (onChunk) {
                  onChunk(text, false);
                }
              }
            } catch (e) {
              // 不是JSON，忽略（可能是event:行或其他标记）
              // 不要添加到fullResponse中
            }
          }
        }
      });

      stream.on("end", () => {
        // 处理剩余的buffer
        if (buffer.trim()) {
          try {
            if (buffer.startsWith("data: ")) {
              const jsonStr = buffer.substring(6).trim();
              if (jsonStr !== "[DONE]") {
                const data = JSON.parse(jsonStr);
                if (data.text || data.content) {
                  const text = data.text || data.content;
                  fullResponse += text;
                  if (onChunk) {
                    onChunk(text, false);
                  }
                }
              }
            }
          } catch (e) {
            // 忽略
          }
        }

        if (onChunk) {
          onChunk("", true);
        }
        resolve(fullResponse);
      });

      stream.on("error", (error: Error) => {
        console.error("流式响应错误:", error);
        reject(error);
      });
    });
  } catch (error: any) {
    console.error("调用Claude API失败:", error);
    if (error.response) {
      console.error("错误详情:", error.response.data);
      throw new Error(
        `API调用失败: ${error.response.data?.error?.message || error.message}`,
      );
    }
    throw error;
  }
}

/**
 * 调用Claude API（非流式，用于兼容）
 */
export async function callClaudeAPI(
  messages: AIMessage[],
  systemPrompt: string = SYSTEM_PROMPT,
): Promise<string> {
  const config = await loadApiConfig();

  try {
    const response = await axios.post(
      config.api_url,
      {
        model: config.model,
        max_tokens: 8192,
        system: systemPrompt,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.api_key}`,
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
        `API调用失败: ${error.response.data?.error?.message || error.message}`,
      );
    }
    throw error;
  }
}
