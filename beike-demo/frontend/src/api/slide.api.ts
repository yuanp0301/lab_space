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
};
