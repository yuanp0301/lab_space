import api from "./index";

export type ContentBlock = {
  type: "text" | "image";
  text?: string;
  data?: string;
  media_type?: string;
};

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string | ContentBlock[];
};

export type ChatCompletionRequest = {
  messages: ChatMessage[];
  provider?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
};

export type ChatCompletionResponse = {
  content: string;
  model: string;
  usage: {
    input_tokens?: number;
    output_tokens?: number;
  };
  finish_reason: string;
};

export type ProviderInfo = {
  name: string;
  label: string;
  models: string[];
  default_model: string;
};

export const chatApi = {
  getProviders: () => api.get<ProviderInfo[]>("/chat/providers"),

  createCompletion: (request: ChatCompletionRequest) =>
    api.post<ChatCompletionResponse>("/chat/completions", request),

  getStreamUrl: () => "/api/v1/chat/stream",
};
