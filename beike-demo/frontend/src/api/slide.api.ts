import axios from "axios";

// API基础URL配置
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
 * 幻灯片数据接口
 */
export interface SlideData {
  page: string;
  pageNumber: number;
  type: string;
  title1: string;
  title2: string;
  content: string;
  materialType: string;
  requirements: string;
  grade?: string;
  teacher?: string;
  visual?: string;
  style?: string;
}

export interface CourseSlideDesign {
  courseTitle: string;
  totalSlides: number;
  slides: SlideData[];
  metadata?: {
    author?: string;
    createTime?: string;
    description?: string;
  };
}

export interface SlidePageResult {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: SlideData[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * 课件生成请求参数
 */
export interface GenerateSlideRequest {
  lessonTitle: string;
  textContent?: string;
  requirements?: string;
  documentType?: string;
}

/**
 * 流式响应数据块
 */
export interface StreamChunk {
  type: "chunk" | "complete" | "error" | "done";
  content?: string;
  progress?: number;
  data?: CourseSlideDesign;
  message?: string;
}

/**
 * 幻灯片API服务
 */
export const slideApi = {
  /**
   * 获取课件设计完整数据
   */
  async getCourseSlideDesign(fileName: string): Promise<CourseSlideDesign> {
    const response = await apiClient.get<any, ApiResponse<CourseSlideDesign>>(
      "/api/slides/design",
      {
        params: { fileName },
      },
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "获取课件设计数据失败");
    }

    return response.data;
  },

  /**
   * 分页查询幻灯片
   */
  async getSlidesByPage(
    fileName: string,
    page: number = 1,
    pageSize: number = 9,
    type?: string,
  ): Promise<SlidePageResult> {
    const response = await apiClient.get<any, ApiResponse<SlidePageResult>>(
      "/api/slides/page",
      {
        params: { fileName, page, pageSize, type },
      },
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "分页查询失败");
    }

    return response.data;
  },

  /**
   * 根据页码获取单个幻灯片
   */
  async getSlideByPage(
    fileName: string,
    pageNumber: string,
  ): Promise<SlideData> {
    const response = await apiClient.get<any, ApiResponse<SlideData>>(
      "/api/slides/detail",
      {
        params: { fileName, page: pageNumber },
      },
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "获取幻灯片详情失败");
    }

    return response.data;
  },

  /**
   * 清除缓存
   */
  async clearCache(fileName?: string): Promise<void> {
    const response = await apiClient.post<any, ApiResponse<void>>(
      "/api/slides/cache/clear",
      { fileName },
    );

    if (!response.success) {
      throw new Error(response.message || "清除缓存失败");
    }
  },

  /**
   * 基于课程设计生成课件（流式响应）
   */
  async generateFromCourseDesignStream(
    courseDesign: any,
    onChunk: (chunk: StreamChunk) => void,
    onError?: (error: Error) => void,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // 使用fetch进行流式请求
        const response = await fetch(
          `${API_BASE_URL}/api/slides/generate/from-course-design-stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseDesign }),
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

                  // 如果收到完成或错误标记，结束
                  if (chunk.type === "done" || chunk.type === "complete") {
                    resolve();
                    return;
                  }
                  if (chunk.type === "error") {
                    throw new Error(chunk.message || "生成课件失败");
                  }
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
        const err = error instanceof Error ? error : new Error("生成课件失败");
        if (onError) {
          onError(err);
        }
        reject(err);
      }
    });
  },

  /**
   * 基于需求生成课件（流式响应）
   */
  async generateFromRequirementsStream(
    request: GenerateSlideRequest,
    onChunk: (chunk: StreamChunk) => void,
    onError?: (error: Error) => void,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // 使用fetch进行流式请求
        const response = await fetch(
          `${API_BASE_URL}/api/slides/generate/from-requirements-stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
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

                  // 如果收到完成或错误标记，结束
                  if (chunk.type === "done" || chunk.type === "complete") {
                    resolve();
                    return;
                  }
                  if (chunk.type === "error") {
                    throw new Error(chunk.message || "生成课件失败");
                  }
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
        const err = error instanceof Error ? error : new Error("生成课件失败");
        if (onError) {
          onError(err);
        }
        reject(err);
      }
    });
  },

  /**
   * 基于文档生成课件（流式响应）
   */
  async generateFromDocumentStream(
    file: File,
    lessonTitle: string | undefined,
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
        if (lessonTitle) {
          formData.append("lessonTitle", lessonTitle);
        }

        // 对于文本文件，也传递内容
        try {
          const fileContent = await readFileContent(file);
          formData.append("documentContent", fileContent);
        } catch (e) {
          console.warn("无法读取文件内容，将仅传递文件:", e);
        }

        // 使用fetch进行流式请求
        const response = await fetch(
          `${API_BASE_URL}/api/slides/generate/from-document-stream`,
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

                  // 如果收到完成或错误标记，结束
                  if (chunk.type === "done" || chunk.type === "complete") {
                    resolve();
                    return;
                  }
                  if (chunk.type === "error") {
                    throw new Error(chunk.message || "生成课件失败");
                  }
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
        const err = error instanceof Error ? error : new Error("生成课件失败");
        if (onError) {
          onError(err);
        }
        reject(err);
      }
    });
  },
};

/**
 * 辅助函数：读取文件内容
 */
async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        resolve(content);
      } else {
        reject(new Error("无法读取文件内容"));
      }
    };
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.readAsText(file);
  });
}

/**
 * 辅助函数：根据文件名获取文件类型
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
