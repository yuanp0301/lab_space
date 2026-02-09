import axios from "axios";
import type { AxiosInstance } from "axios";

// API基础URL配置
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5分钟超时，因为AI生成可能需要较长时间
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

/**
 * 课程设计数据接口
 */
export interface CourseDesign {
  lessonTitle: string;
  version: "table" | "detailed";
  overview: CourseOverview;
  sessions: CourseSession[];
  metadata?: {
    author?: string;
    createTime?: string;
    source?: string;
  };
}

export interface CourseOverview {
  courseCore: string;
  courseLine: {
    narrativeLine: string;
    emotionalLine: string;
  };
  teachingObjectives: TeachingObjective[];
  teachingFocus: TeachingFocus[];
  teachingSessions: string[];
  teachingMode: string;
  courseFeatures: string[];
  learningOutcomes: string[];
  keyActivities: string[];
}

export interface TeachingObjective {
  category: string;
  description: string;
}

export interface TeachingFocus {
  type: "focus" | "difficulty";
  content: string;
}

export interface CourseSession {
  sessionTitle: string;
  phases: TeachingPhase[];
}

export interface TeachingPhase {
  phase: string;
  mainQuestion?: string;
  subQuestions?: string[];
  questions?: string;
  knowledge?: string;
  knowledgePoints?: KnowledgePoint[];
  activities?: string | TeachingActivity;
}

export interface KnowledgePoint {
  tag: string;
  description: string;
}

export interface TeachingActivity {
  name: string;
  what: string;
  how: string;
  verify: string;
  organize?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface GenerateFromDocumentRequest {
  documentContent: string;
  documentType: string;
  lessonTitle?: string;
  generateOptions?: {
    includeActivities?: boolean;
    detailLevel?: "simple" | "normal" | "detailed";
  };
}

/**
 * 流式响应数据块
 */
export interface StreamChunk {
  type: "chunk" | "complete" | "error";
  data?: Partial<CourseDesign>;
  content?: string;
  message?: string;
  progress?: number;
}

/**
 * 读取文件内容
 * 注意：对于二进制文件（如docx、pdf），这里只读取文件名
 * 实际内容由后端处理
 */
async function readFileContent(file: File): Promise<string> {
  // 对于文本文件，直接读取内容
  const textExtensions = ["txt", "md", "markdown", "html", "htm"];
  const ext = getFileType(file.name);

  if (textExtensions.includes(ext)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsText(file, "UTF-8");
    });
  }

  // 对于其他文件类型，返回文件名（实际内容由后端从FormData中读取）
  return file.name;
}

/**
 * 获取文件类型
 */
function getFileType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    doc: "docx",
    docx: "docx",
    md: "markdown",
    markdown: "markdown",
    html: "html",
    htm: "html",
    txt: "txt",
    pdf: "pdf",
  };
  return typeMap[ext || ""] || "txt";
}

/**
 * 课程设计API服务
 */
export const courseDesignApi = {
  /**
   * 根据文档生成课程设计（流式响应）
   */
  async generateFromDocumentStream(
    file: File,
    onChunk: (chunk: StreamChunk) => void,
    onError?: (error: Error) => void,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const documentType = getFileType(file.name);

        // 创建FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", documentType);

        // 对于文本文件，也传递内容（后端会优先使用文件）
        try {
          const fileContent = await readFileContent(file);
          formData.append("documentContent", fileContent);
        } catch (e) {
          // 如果读取失败，只传递文件
          console.warn("无法读取文件内容，将仅传递文件:", e);
        }

        // 使用fetch进行流式请求
        const response = await fetch(
          `${API_BASE_URL}/api/course-design/generate/from-document-stream`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 读取流式响应
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("无法读取响应流");
        }

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // 解码数据
          buffer += decoder.decode(value, { stream: true });

          // 处理可能包含多个JSON对象的缓冲区
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // 保留最后一个不完整的行

          for (const line of lines) {
            if (line.trim()) {
              try {
                // 处理SSE格式的数据
                if (line.startsWith("data: ")) {
                  const jsonStr = line.substring(6);
                  if (jsonStr === "[DONE]") {
                    onChunk({ type: "complete" });
                    resolve();
                    return;
                  }
                  const chunk: StreamChunk = JSON.parse(jsonStr);
                  onChunk(chunk);
                } else {
                  // 直接JSON格式
                  const chunk: StreamChunk = JSON.parse(line);
                  onChunk(chunk);
                }
              } catch (e) {
                console.warn("解析流数据失败:", e, line);
              }
            }
          }
        }

        // 处理剩余的缓冲区
        if (buffer.trim()) {
          try {
            if (buffer.startsWith("data: ")) {
              const jsonStr = buffer.substring(6);
              const chunk: StreamChunk = JSON.parse(jsonStr);
              onChunk(chunk);
            } else {
              const chunk: StreamChunk = JSON.parse(buffer);
              onChunk(chunk);
            }
          } catch (e) {
            console.warn("解析最后的数据块失败:", e);
          }
        }

        onChunk({ type: "complete" });
        resolve();
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("生成课程设计失败");
        if (onError) {
          onError(err);
        }
        reject(err);
      }
    });
  },

  /**
   * 根据文档生成课程设计（非流式，用于URL方式）
   */
  async generateFromDocument(
    request: GenerateFromDocumentRequest,
  ): Promise<CourseDesign> {
    const response = await apiClient.post<any, ApiResponse<CourseDesign>>(
      "/api/course-design/generate/from-document",
      request,
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "生成课程设计失败");
    }

    return response.data;
  },

  /**
   * 根据用户需求生成课程设计（AI一句话生成）
   */
  async generateFromRequirements(request: {
    lessonTitle: string;
    grade?: string;
    subject?: string;
    textContent?: string;
    requirements?: string;
    referenceTemplate?: "table" | "detailed";
  }): Promise<CourseDesign> {
    const response = await apiClient.post<any, ApiResponse<CourseDesign>>(
      "/api/course-design/generate/from-requirements",
      request,
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "生成课程设计失败");
    }

    return response.data;
  },

  /**
   * 获取表格版模版
   */
  async getTableTemplate(): Promise<CourseDesign> {
    const response = await apiClient.get<any, ApiResponse<CourseDesign>>(
      "/api/course-design/template/table",
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "获取模版失败");
    }

    return response.data;
  },

  /**
   * 获取完整版模版
   */
  async getDetailedTemplate(): Promise<CourseDesign> {
    const response = await apiClient.get<any, ApiResponse<CourseDesign>>(
      "/api/course-design/template/detailed",
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "获取模版失败");
    }

    return response.data;
  },

  /**
   * 获取表格版模版（前端格式）
   */
  async getTableTemplateFrontend(): Promise<any> {
    const response = await apiClient.get<any, ApiResponse<any>>(
      "/api/course-design/template/table/frontend",
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "获取模版失败");
    }

    return response.data;
  },

  /**
   * 获取完整版模版（前端格式）
   */
  async getDetailedTemplateFrontend(): Promise<any> {
    const response = await apiClient.get<any, ApiResponse<any>>(
      "/api/course-design/template/detailed/frontend",
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "获取模版失败");
    }

    return response.data;
  },

  /**
   * 保存课程设计
   */
  async saveCourseDesign(username: string, courseData: any): Promise<void> {
    const response = await apiClient.post<any, ApiResponse<any>>(
      "/api/course-design/save",
      { username, courseData },
    );

    if (!response.success) {
      throw new Error(response.message || "保存课程设计失败");
    }
  },

  /**
   * 加载用户的课程设计
   */
  async loadCourseDesign(
    username: string,
    filename?: string,
  ): Promise<any | null> {
    try {
      const url = filename
        ? `/api/course-design/load/${username}?filename=${encodeURIComponent(filename)}`
        : `/api/course-design/load/${username}`;

      const response = await apiClient.get<any, ApiResponse<any>>(url);

      if (!response.success) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("加载课程设计失败:", error);
      return null;
    }
  },

  /**
   * 列出用户的所有课程设计
   */
  async listUserCourseDesigns(
    username: string,
  ): Promise<
    Array<{ filename: string; lessonTitle: string; updateTime: string }>
  > {
    const response = await apiClient.get<
      any,
      ApiResponse<
        Array<{ filename: string; lessonTitle: string; updateTime: string }>
      >
    >(`/api/course-design/list/${username}`);

    if (!response.success || !response.data) {
      return [];
    }

    return response.data;
  },

  /**
   * 删除指定的课程设计
   */
  async deleteCourseDesign(username: string, filename: string): Promise<void> {
    const response = await apiClient.delete<any, ApiResponse<any>>(
      `/api/course-design/delete/${username}/${encodeURIComponent(filename)}`,
    );

    if (!response.success) {
      throw new Error(response.message || "删除课程设计失败");
    }
  },
};
