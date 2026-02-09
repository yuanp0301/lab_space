import fs from "fs/promises";
import {
  CourseDesign,
  CourseDesignTable,
  CourseDesignDetailed,
  CourseOverview,
  TeachingPhaseTable,
  TeachingPhaseDetailed,
  TeachingObjective,
  TeachingFocus,
} from "../models/course-design.model";

/**
 * 课程设计Markdown解析服务
 */
export class CourseDesignParserService {
  /**
   * 解析课程设计Markdown文件
   */
  async parseCourseDesignFile(filePath: string): Promise<CourseDesign> {
    try {
      const content = await fs.readFile(filePath, "utf-8");

      // 判断是表格版还是完整版
      const isTableVersion = this.isTableVersion(content);

      if (isTableVersion) {
        return this.parseTableVersion(content, filePath);
      } else {
        return this.parseDetailedVersion(content, filePath);
      }
    } catch (error) {
      console.error("解析课程设计文件失败:", error);
      throw new Error(
        `文件解析失败: ${error instanceof Error ? error.message : "未知错误"}`,
      );
    }
  }

  /**
   * 判断是否为表格版
   */
  private isTableVersion(content: string): boolean {
    // 表格版包含"| **教学环节**"这样的表格标记
    return (
      content.includes("| **教学环节**") &&
      content.includes("| **问题引导（主问题及子问题）**")
    );
  }

  /**
   * 解析表格版课程设计
   */
  private parseTableVersion(
    content: string,
    filePath: string,
  ): CourseDesignTable {
    const lines = content.split("\n");

    // 提取课程标题
    const lessonTitle = this.extractLessonTitle(content);

    // 解析总览部分
    const overview = this.parseOverview(content);

    // 解析教学过程
    const sessions = this.parseTableSessions(content);

    return {
      lessonTitle,
      version: "table",
      overview,
      sessions,
      metadata: {
        createTime: new Date().toISOString(),
        source: filePath,
      },
    };
  }

  /**
   * 解析完整版课程设计
   */
  private parseDetailedVersion(
    content: string,
    filePath: string,
  ): CourseDesignDetailed {
    const lessonTitle = this.extractLessonTitle(content);
    const overview = this.parseOverview(content);
    const sessions = this.parseDetailedSessions(content);

    return {
      lessonTitle,
      version: "detailed",
      overview,
      sessions,
      metadata: {
        createTime: new Date().toISOString(),
        source: filePath,
      },
    };
  }

  /**
   * 提取课程标题
   */
  private extractLessonTitle(content: string): string {
    // 从文件名或内容中提取标题
    const titleMatch = content.match(/《([^》]+)》/);
    return titleMatch ? `《${titleMatch[1]}》` : "未命名课程";
  }

  /**
   * 解析课程设计总览
   */
  private parseOverview(content: string): CourseOverview {
    const overviewSection = this.extractSection(content, "一、课程设计总览");

    return {
      courseCore: this.extractField(overviewSection, "课程内核"),
      courseLine: {
        narrativeLine: this.extractSubField(
          overviewSection,
          "课程线索",
          "叙事明线",
        ),
        emotionalLine: this.extractSubField(
          overviewSection,
          "课程线索",
          "精神暗线",
        ),
      },
      teachingObjectives: this.parseTeachingObjectives(overviewSection),
      teachingFocus: this.parseTeachingFocus(overviewSection),
      teachingSessions: this.parseListField(overviewSection, "教学环节"),
      teachingMode: this.extractField(overviewSection, "教学模式"),
      courseFeatures: this.parseListField(overviewSection, "课程特点"),
      learningOutcomes: this.parseListField(overviewSection, "学习收获"),
      keyActivities: this.parseListField(overviewSection, "重要教学活动"),
    };
  }

  /**
   * 解析教学目标
   */
  private parseTeachingObjectives(content: string): TeachingObjective[] {
    const objectives: TeachingObjective[] = [];
    const objectivesMatch = content.match(
      /教学目标[\s\S]*?(?=\n-\s*\*\*|###|$)/,
    );

    if (objectivesMatch) {
      const objectivesText = objectivesMatch[0];
      const matches = objectivesText.matchAll(
        /\d+\.\s*\*\*([^*]+)\*\*[：:]\s*([^\n]+)/g,
      );

      for (const match of matches) {
        objectives.push({
          category: match[1].trim(),
          description: match[2].trim(),
        });
      }
    }

    return objectives;
  }

  /**
   * 解析教学重难点
   */
  private parseTeachingFocus(content: string): TeachingFocus[] {
    const focus: TeachingFocus[] = [];
    const focusMatch = content.match(/教学重难点[\s\S]*?(?=\n-\s*\*\*|###|$)/);

    if (focusMatch) {
      const focusText = focusMatch[0];

      // 提取重点
      const focusPointMatch = focusText.match(/\*\*重点\*\*[：:]\s*([^\n]+)/);
      if (focusPointMatch) {
        focus.push({
          type: "focus",
          content: this.cleanText(focusPointMatch[1]),
        });
      }

      // 提取难点
      const difficultyMatch = focusText.match(/\*\*难点\*\*[：:]\s*([^\n]+)/);
      if (difficultyMatch) {
        focus.push({
          type: "difficulty",
          content: this.cleanText(difficultyMatch[1]),
        });
      }
    }

    return focus;
  }

  /**
   * 解析表格版教学过程
   */
  private parseTableSessions(content: string): CourseDesignTable["sessions"] {
    const sessions: CourseDesignTable["sessions"] = [];
    const teachingProcessSection = this.extractSection(content, "教学过程");

    if (!teachingProcessSection) {
      return sessions;
    }

    // 匹配每个课时
    const sessionMatches = teachingProcessSection.matchAll(
      /####\s*\*\*([^*]+)\*\*/g,
    );

    for (const sessionMatch of sessionMatches) {
      const sessionTitle = sessionMatch[1].trim();
      const sessionStartIndex = sessionMatch.index || 0;

      // 提取该课时的表格
      const sessionContent =
        teachingProcessSection.substring(sessionStartIndex);
      const phases = this.parseTablePhases(sessionContent);

      sessions.push({
        sessionTitle,
        phases,
      });
    }

    return sessions;
  }

  /**
   * 解析表格版教学环节
   */
  private parseTablePhases(content: string): TeachingPhaseTable[] {
    const phases: TeachingPhaseTable[] = [];

    // 找到表格起始位置
    const tableStartIndex = content.indexOf("| **教学环节**");
    if (tableStartIndex === -1) return phases;

    const lines = content.substring(tableStartIndex).split("\n");
    let currentRow: string[] = [];

    for (let i = 2; i < lines.length; i++) {
      // 跳过表头和分隔行
      const line = lines[i].trim();

      if (!line.startsWith("|")) break; // 表格结束
      if (line.includes("---")) continue; // 分隔行

      const cells = line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());

      // 判断是否是新行
      if (cells[0] && cells[0].startsWith("**")) {
        // 保存上一行
        if (currentRow.length >= 4) {
          phases.push(this.parseTableRow(currentRow));
        }
        currentRow = [...cells];
      } else if (currentRow.length > 0) {
        // 续行，合并内容
        for (let j = 0; j < cells.length && j < currentRow.length; j++) {
          if (cells[j]) {
            currentRow[j] += " " + cells[j];
          }
        }
      }
    }

    // 处理最后一行
    if (currentRow.length >= 4) {
      phases.push(this.parseTableRow(currentRow));
    }

    return phases;
  }

  /**
   * 解析表格行数据
   */
  private parseTableRow(cells: string[]): TeachingPhaseTable {
    return {
      phase: this.cleanText(cells[0]),
      questions: this.cleanText(cells[1]),
      knowledge: this.cleanText(cells[2]),
      activities: this.cleanText(cells[3]),
    };
  }

  /**
   * 解析完整版教学过程
   */
  private parseDetailedSessions(
    content: string,
  ): CourseDesignDetailed["sessions"] {
    const sessions: CourseDesignDetailed["sessions"] = [];
    const teachingProcessSection = this.extractSection(content, "教学过程");

    if (!teachingProcessSection) {
      return sessions;
    }

    // 匹配每个课时
    const sessionMatches = teachingProcessSection.matchAll(
      /####\s*\*\*([^*]+)\*\*/g,
    );

    for (const sessionMatch of sessionMatches) {
      const sessionTitle = sessionMatch[1].trim();
      const sessionStartIndex = sessionMatch.index || 0;

      // 提取该课时的内容
      const sessionContent =
        teachingProcessSection.substring(sessionStartIndex);
      const phases = this.parseDetailedPhases(sessionContent);

      sessions.push({
        sessionTitle,
        phases,
      });
    }

    return sessions;
  }

  /**
   * 解析完整版教学环节
   */
  private parseDetailedPhases(content: string): TeachingPhaseDetailed[] {
    const phases: TeachingPhaseDetailed[] = [];

    // 匹配每个环节 - 优化后的正则，支持<font>标签包裹
    // 格式: **<font style="...">【环节一：...】</font>** 或 **【环节一：...】**
    const phaseMatches = content.matchAll(
      /\*\*(?:<font[^>]*>)?【([^】]+)】(?:<\/font>)?\*\*/g,
    );

    let lastPhaseEndIndex = 0;

    for (const phaseMatch of phaseMatches) {
      const phase = phaseMatch[1].trim();
      const phaseStartIndex = phaseMatch.index || 0;

      // 提取该环节的内容 (从当前环节到下一个环节或结尾)
      let phaseContent = "";
      const nextPhaseMatch = content
        .substring(phaseStartIndex + phaseMatch[0].length)
        .match(/\*\*(?:<font[^>]*>)?【[^】]+】(?:<\/font>)?\*\*/);

      if (nextPhaseMatch && nextPhaseMatch.index !== undefined) {
        phaseContent = content.substring(
          phaseStartIndex,
          phaseStartIndex + phaseMatch[0].length + nextPhaseMatch.index,
        );
      } else {
        // 如果没有下一个环节，取到内容结尾或下一个课时标题
        const nextSessionMatch = content
          .substring(phaseStartIndex + phaseMatch[0].length)
          .match(/####\s*\*\*/);
        if (nextSessionMatch && nextSessionMatch.index !== undefined) {
          phaseContent = content.substring(
            phaseStartIndex,
            phaseStartIndex + phaseMatch[0].length + nextSessionMatch.index,
          );
        } else {
          phaseContent = content.substring(phaseStartIndex);
        }
      }

      phases.push({
        phase,
        mainQuestion: this.extractDetailedField(phaseContent, "主问题"),
        subQuestions: this.extractDetailedList(phaseContent, "子问题"),
        knowledgePoints: this.extractKnowledgePoints(phaseContent),
        activities: this.extractTeachingActivity(phaseContent),
      });

      lastPhaseEndIndex =
        phaseStartIndex + (phaseContent?.length || phaseMatch[0].length);
    }

    return phases;
  }

  /**
   * 提取知识点
   */
  private extractKnowledgePoints(content: string): any[] {
    const points: any[] = [];
    const matches = content.matchAll(/#([^#]+)#[：:]?\s*([^\n]+)/g);

    for (const match of matches) {
      points.push({
        tag: `#${match[1].trim()}#`,
        description: this.cleanText(match[2]),
      });
    }

    return points;
  }

  /**
   * 提取教学活动
   */
  private extractTeachingActivity(content: string): any {
    return {
      name: this.extractDetailedField(content, "活动名称"),
      what: this.extractDetailedField(content, "是什么"),
      how: this.extractDetailedField(content, "怎么做"),
      verify: this.extractDetailedField(content, "验证什么"),
      organize: this.extractDetailedField(content, "怎么组织"),
    };
  }

  /**
   * 辅助方法：提取章节内容
   */
  private extractSection(content: string, sectionTitle: string): string {
    // 支持带编号的标题（如"一、"）和不带编号的标题
    // 使用贪婪匹配，匹配到下一个同级标题或文件末尾
    const regex = new RegExp(
      `###\\s*\\*\\*[一二三四五六七八九十]*、?${sectionTitle}[\\s\\S]*(?=###|$)`,
    );
    const match = content.match(regex);
    return match ? match[0] : "";
  }

  /**
   * 辅助方法：提取字段
   */
  private extractField(content: string, fieldName: string): string {
    const regex = new RegExp(
      `[*-]\\s*\\*\\*.*?${fieldName}.*?\\*\\*[：:]?\\s*([^\\n]+)`,
    );
    const match = content.match(regex);
    return match ? this.cleanText(match[1]) : "";
  }

  /**
   * 辅助方法：提取子字段
   */
  private extractSubField(
    content: string,
    parentField: string,
    subField: string,
  ): string {
    const parentMatch = content.match(
      new RegExp(`${parentField}[\\s\\S]*?(?=\\n-\\s*\\*\\*|###|$)`),
    );
    if (!parentMatch) return "";

    const subMatch = parentMatch[0].match(
      new RegExp(`\\*\\*${subField}\\*\\*[：:]?\\s*([^\\n]+)`),
    );
    return subMatch ? this.cleanText(subMatch[1]) : "";
  }

  /**
   * 辅助方法：解析列表字段
   */
  private parseListField(content: string, fieldName: string): string[] {
    const items: string[] = [];
    const sectionMatch = content.match(
      new RegExp(`${fieldName}[\\s\\S]*?(?=\\n-\\s*\\*\\*|###|$)`),
    );

    if (sectionMatch) {
      const matches = sectionMatch[0].matchAll(/\d+\.\s*\*\*?([^*\n]+)\*?\*?/g);
      for (const match of matches) {
        items.push(this.cleanText(match[1]));
      }
    }

    return items;
  }

  /**
   * 辅助方法：提取详细版字段
   */
  private extractDetailedField(content: string, fieldName: string): string {
    const regex = new RegExp(
      `\\*\\*.*?${fieldName}.*?\\*\\*[：:]?\\s*([^\\n]+)`,
    );
    const match = content.match(regex);
    return match ? this.cleanText(match[1]) : "";
  }

  /**
   * 辅助方法：提取详细版列表
   */
  private extractDetailedList(content: string, fieldName: string): string[] {
    const items: string[] = [];
    const sectionMatch = content.match(
      new RegExp(`${fieldName}[\\s\\S]*?(?=\\n\\s*-\\s*\\*\\*|###|$)`),
    );

    if (sectionMatch) {
      const matches = sectionMatch[0].matchAll(/\d+\.\s*([^\n]+)/g);
      for (const match of matches) {
        items.push(this.cleanText(match[1]));
      }
    }

    return items;
  }

  /**
   * 辅助方法：清理文本
   */
  private cleanText(text: string): string {
    return text
      .replace(/\*\*/g, "")
      .replace(/<\/?font[^>]*>/g, "")
      .replace(/style="[^"]*"/g, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .trim();
  }
}

// 导出单例
export const courseDesignParser = new CourseDesignParserService();
