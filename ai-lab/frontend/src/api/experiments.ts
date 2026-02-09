import api from "./index";
import type { ChatMessage } from "./chat";

export type ExperimentCategory =
  | "llm"
  | "multimodal"
  | "agents"
  | "traditional";

export type ExperimentInfo = {
  id: string;
  name: string;
  description: string;
  category: ExperimentCategory;
  icon: string;
  tags: string[];
  supports_streaming: boolean;
  supports_multimodal: boolean;
  default_provider?: string;
  default_model?: string;
  parameters: Array<{
    name: string;
    type: string;
    default?: unknown;
    description?: string;
  }>;
};

export type ExperimentListResponse = {
  experiments: ExperimentInfo[];
  total: number;
};

export type ExperimentExecuteRequest = {
  messages: ChatMessage[];
  provider?: string;
  model?: string;
  parameters?: Record<string, unknown>;
  stream?: boolean;
};

export type ExperimentExecuteResponse = {
  content: string;
  metadata: Record<string, unknown>;
  usage: Record<string, number>;
};

export const experimentsApi = {
  list: (category?: ExperimentCategory) =>
    api.get<ExperimentListResponse>("/experiments", {
      params: category ? { category } : undefined,
    }),

  get: (id: string) => api.get<ExperimentInfo>(`/experiments/${id}`),

  execute: (id: string, request: ExperimentExecuteRequest) =>
    api.post<ExperimentExecuteResponse>(`/experiments/${id}/execute`, request),

  getStreamUrl: (id: string) => `/api/v1/experiments/${id}/stream`,
};
