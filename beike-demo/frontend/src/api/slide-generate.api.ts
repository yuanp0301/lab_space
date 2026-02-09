import axios from "axios";
import type {
  Template,
  GeneratedSlideData,
  GenerateFromTemplateRequest,
  GenerateFromDesignRequest,
  SlideListItem,
} from "@/types/slide.types";

// API基础URL配置
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // AI生成需要较长时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API请求失败:", error);
    return Promise.reject(error);
  },
);

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * 课件生成相关API
 */
export const slideGenerateApi = {
  /**
   * 获取课件模板列表
   */
  async getTemplates(): Promise<Template[]> {
    const response = await apiClient.get<any, ApiResponse<Template[]>>(
      "/api/slides/templates",
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "获取模板列表失败");
    }

    return response.data;
  },

  /**
   * 基于模板生成课件
   */
  async generateFromTemplate(
    params: GenerateFromTemplateRequest,
  ): Promise<GeneratedSlideData> {
    const response = await apiClient.post<any, ApiResponse<GeneratedSlideData>>(
      "/api/slides/generate/from-template",
      params,
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "生成课件失败");
    }

    return response.data;
  },

  /**
   * 基于设计思路生成课件
   */
  async generateFromDesign(
    params: GenerateFromDesignRequest,
  ): Promise<GeneratedSlideData> {
    const response = await apiClient.post<any, ApiResponse<GeneratedSlideData>>(
      "/api/slides/generate/from-design",
      params,
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "生成课件失败");
    }

    return response.data;
  },

  /**
   * 保存课件
   */
  async saveSlides(data: GeneratedSlideData): Promise<void> {
    const response = await apiClient.post<any, ApiResponse<any>>(
      "/api/slides/save",
      data,
    );

    if (!response.success) {
      throw new Error(response.message || "保存课件失败");
    }
  },

  /**
   * 加载课件
   */
  async loadSlides(
    username: string,
    lessonTitle: string,
  ): Promise<GeneratedSlideData> {
    const response = await apiClient.get<any, ApiResponse<GeneratedSlideData>>(
      "/api/slides/load",
      {
        params: { username, lessonTitle },
      },
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "加载课件失败");
    }

    return response.data;
  },

  /**
   * 获取课件列表
   */
  async getSlidesList(username: string): Promise<SlideListItem[]> {
    const response = await apiClient.get<any, ApiResponse<SlideListItem[]>>(
      "/api/slides/list",
      {
        params: { username },
      },
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "获取课件列表失败");
    }

    return response.data;
  },
};
