import fs from "fs/promises";
import path from "path";
import { SlideData, CourseSlideDesign } from "../models/slide.model";

/**
 * Markdown表格解析服务
 */
export class MarkdownParserService {
  /**
   * 解析Markdown文件中的表格数据
   * @param filePath 文件路径
   * @returns 课件设计数据
   */
  async parseSlideDesignFile(filePath: string): Promise<CourseSlideDesign> {
    try {
      // 读取文件内容
      const content = await fs.readFile(filePath, "utf-8");

      // 提取课程标题
      const courseTitle = this.extractCourseTitle(content);

      // 解析表格数据
      const slides = this.parseTableData(content);

      return {
        courseTitle,
        totalSlides: slides.length,
        slides,
        metadata: {
          createTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("解析Markdown文件失败:", error);
      throw new Error(
        `文件解析失败: ${error instanceof Error ? error.message : "未知错误"}`,
      );
    }
  }

  /**
   * 提取课程标题
   */
  private extractCourseTitle(content: string): string {
    // 尝试从标题行提取
    const titleMatch = content.match(/###\s*[*《]*([^*》\n]+)[*》]*/);
    if (titleMatch) {
      return titleMatch[1].trim();
    }

    // 尝试从第一个表格的标题列提取
    const tableMatch = content.match(/《([^》]+)》/);
    if (tableMatch) {
      return `《${tableMatch[1]}》`;
    }

    return "未命名课程";
  }

  /**
   * 解析表格数据
   */
  private parseTableData(content: string): SlideData[] {
    const lines = content.split("\n");

    // 找到表格起始位置
    const tableStartIndex = lines.findIndex((line) =>
      line.includes("| **页码**"),
    );

    if (tableStartIndex === -1) {
      throw new Error("未找到表格起始位置");
    }

    const slides: SlideData[] = [];
    let currentRow: string[] = [];

    // 从表格内容开始解析（跳过表头和分隔行）
    for (let i = tableStartIndex + 2; i < lines.length; i++) {
      const line = lines[i].trim();

      // 跳过分隔行
      if (line.startsWith("|---") || line.startsWith("| :---")) {
        continue;
      }

      // 检测表格结束标记
      if (
        line.includes("**整体风格**") ||
        line.includes("---") ||
        line.length === 0 ||
        !line.startsWith("|")
      ) {
        // 保存最后一行数据
        if (currentRow.length >= 7) {
          const slide = this.parseSlideRow(currentRow);
          if (slide) slides.push(slide);
        }
        break;
      }

      // 处理表格行
      if (line.startsWith("|") && line.endsWith("|")) {
        const cells = line
          .split("|")
          .slice(1, -1) // 去掉首尾空元素
          .map((cell) => cell.trim());

        // 检查是否是新行的开始（第一个单元格有页码格式）
        if (cells[0] && /^\*\*P\d+\*\*/.test(cells[0])) {
          // 保存上一行数据
          if (currentRow.length >= 7) {
            const slide = this.parseSlideRow(currentRow);
            if (slide) slides.push(slide);
          }
          // 开始新行
          currentRow = [...cells];
        } else if (currentRow.length > 0) {
          // 这是上一行的续行（多行单元格），合并到当前行
          for (let j = 0; j < cells.length && j < currentRow.length; j++) {
            if (cells[j]) {
              currentRow[j] = (currentRow[j] || "") + " " + cells[j];
            }
          }
        }
      }
    }

    console.log(`成功解析 ${slides.length} 页课件设计思路`);
    return slides;
  }

  /**
   * 解析单行表格数据
   */
  private parseSlideRow(cells: string[]): SlideData | null {
    try {
      // 确保有足够的列
      if (cells.length < 7) {
        console.warn("表格列数不足:", cells);
        return null;
      }

      // 提取基本信息
      const page = cells[0].replace(/\*\*/g, "").trim();
      const pageNumber = parseInt(page.replace(/[^0-9]/g, "")) || 0;
      const type = cells[1].replace(/\*\*/g, "").trim();
      const title1 = this.cleanText(cells[2]);
      const title2 = this.cleanText(cells[3]);
      const content = this.cleanContent(cells[4]);
      const materialType = cells[5].replace(/\*\*/g, "").trim();
      const requirements = this.cleanContent(cells[6]);

      // 从requirements中提取详细信息
      const details = this.extractDetailFromRequirements(requirements);

      return {
        page,
        pageNumber,
        type,
        title1,
        title2,
        content: content === "——" ? "" : content,
        materialType,
        requirements,
        ...details,
      };
    } catch (error) {
      console.error("解析行数据失败:", error, cells);
      return null;
    }
  }

  /**
   * 从需求描述中提取详细信息
   */
  private extractDetailFromRequirements(requirements: string): {
    grade?: string;
    teacher?: string;
    visual?: string;
    style?: string;
  } {
    const details: {
      grade?: string;
      teacher?: string;
      visual?: string;
      style?: string;
    } = {};

    // 匹配授课年级
    const gradeMatch = requirements.match(/授课年级[：:]\s*([^\n<]+)/);
    if (gradeMatch) {
      details.grade = gradeMatch[1].trim();
    }

    // 匹配授课教师
    const teacherMatch = requirements.match(/授课教师[：:]\s*([^\n<]+)/);
    if (teacherMatch) {
      details.teacher = teacherMatch[1].trim();
    }

    // 匹配视觉/交互/画面描述
    const visualMatch = requirements.match(
      /[**]*(?:背景图|配图|图示)[：:]?\s*([^\n]+?)(?:<br|$)/i,
    );
    if (visualMatch) {
      details.visual = this.cleanText(visualMatch[1]);
    }

    // 匹配风格描述
    const styleMatch = requirements.match(/[**]*风格[：:]?\s*([^\n<]+)/);
    if (styleMatch) {
      details.style = this.cleanText(styleMatch[1]);
    }

    return details;
  }

  /**
   * 清理文本内容
   */
  private cleanText(text: string): string {
    return text
      .replace(/\*\*/g, "") // 移除加粗标记
      .replace(/<\/?font[^>]*>/g, "") // 移除font标签
      .replace(/style="[^"]*"/g, "") // 移除style属性
      .trim();
  }

  /**
   * 清理内容文本（保留换行和加粗）
   */
  private cleanContent(text: string): string {
    return text
      .replace(/<br\s*\/?>/gi, "\n") // 将<br>转换为换行
      .replace(/<\/?font[^>]*>/g, "") // 移除font标签
      .replace(/style="[^"]*"/g, "") // 移除style属性
      .trim();
  }
}

// 导出单例
export const markdownParser = new MarkdownParserService();
