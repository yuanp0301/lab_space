import path from "path";
import { markdownParser } from "./markdown.parser";
import {
  CourseSlideDesign,
  SlideData,
  SlidePageResult,
  SlideQueryParams,
} from "../models/slide.model";

/**
 * 幻灯片业务逻辑服务
 */
export class SlideService {
  private dataCache: Map<string, CourseSlideDesign> = new Map();

  /**
   * 获取课件设计数据
   * @param fileName 文件名（相对于data/busi目录）
   */
  async getCourseSlideDesign(fileName: string): Promise<CourseSlideDesign> {
    // 检查缓存
    if (this.dataCache.has(fileName)) {
      return this.dataCache.get(fileName)!;
    }

    // 构建文件路径 - 后端在backend目录下运行，需要返回上级目录
    const filePath = path.join(process.cwd(), "..", "data", "busi", fileName);

    // 解析文件
    const design = await markdownParser.parseSlideDesignFile(filePath);

    // 缓存结果
    this.dataCache.set(fileName, design);

    return design;
  }

  /**
   * 分页查询幻灯片
   */
  async getSlidesByPage(
    fileName: string,
    params: SlideQueryParams,
  ): Promise<SlidePageResult> {
    const design = await this.getCourseSlideDesign(fileName);

    const { page = 1, pageSize = 9, type } = params;

    // 筛选数据
    let filteredSlides = design.slides;
    if (type) {
      filteredSlides = filteredSlides.filter((slide) => slide.type === type);
    }

    // 分页
    const total = filteredSlides.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredSlides.slice(start, end);

    return {
      total,
      page,
      pageSize,
      totalPages,
      data,
    };
  }

  /**
   * 根据页码获取单个幻灯片
   */
  async getSlideByPage(
    fileName: string,
    pageNumber: string,
  ): Promise<SlideData | null> {
    const design = await this.getCourseSlideDesign(fileName);
    return design.slides.find((slide) => slide.page === pageNumber) || null;
  }

  /**
   * 清除缓存
   */
  clearCache(fileName?: string): void {
    if (fileName) {
      this.dataCache.delete(fileName);
    } else {
      this.dataCache.clear();
    }
  }
}

// 导出单例
export const slideService = new SlideService();
