import path from "path";
import * as fs from "fs";
import { CourseSlideDesign, SlideData } from "../models/slide.model";
import {
  CourseDesign,
  CourseDesignDetailed,
} from "../models/course-design.model";
import { callClaudeAPIStream, type AIMessage } from "./ai.service";

/**
 * 课件AI生成请求参数
 */
export interface GenerateSlideRequest {
  lessonTitle: string; // 课程标题
  textContent?: string; // 文本内容（可选）
  requirements?: string; // 特殊要求（可选）
  documentType?: string; // 文档类型（用于文档上传）
}

/**
 * 流式响应回调
 */
export type StreamCallback = (chunk: any) => void;

/**
 * 课件生成业务服务
 */
export class SlideGeneratorService {
  private templateCache: string | null = null;

  /**
   * 获取课件参考模版
   */
  private async getReferenceTemplate(): Promise<string> {
    if (this.templateCache) {
      return this.templateCache;
    }

    const filePath = path.join(
      process.cwd(),
      "..",
      "data",
      "busi",
      "6. 《秋天的怀念》课件设计思路.md",
    );

    if (!fs.existsSync(filePath)) {
      throw new Error("课件参考模版文件不存在");
    }

    this.templateCache = fs.readFileSync(filePath, "utf-8");
    return this.templateCache;
  }

  /**
   * 基于课程设计生成课件（流式响应）
   */
  async generateFromCourseDesignStream(
    courseDesign: CourseDesign,
    onChunk: StreamCallback,
  ): Promise<void> {
    try {
      // 发送开始状态
      onChunk({
        type: "chunk",
        content: "开始分析课程设计...",
        progress: 5,
      });

      // 获取参考模版
      const referenceTemplate = await this.getReferenceTemplate();

      onChunk({
        type: "chunk",
        content: "正在构建课件生成提示词...",
        progress: 10,
      });

      // 构建AI提示词
      const prompt = this.buildSlidePromptFromCourseDesign(
        courseDesign,
        referenceTemplate,
      );

      // 调用AI服务生成课件
      await this.generateWithAI(prompt, courseDesign.lessonTitle, onChunk, 10);
    } catch (error) {
      console.error("基于课程设计生成课件失败:", error);
      onChunk({
        type: "error",
        message: error instanceof Error ? error.message : "生成课件失败",
      });
      throw error;
    }
  }

  /**
   * 基于需求生成课件（流式响应）
   */
  async generateFromRequirementsStream(
    request: GenerateSlideRequest,
    onChunk: StreamCallback,
  ): Promise<void> {
    try {
      // 发送开始状态
      onChunk({
        type: "chunk",
        content: "开始分析需求...",
        progress: 5,
      });

      // 获取参考模版
      const referenceTemplate = await this.getReferenceTemplate();

      onChunk({
        type: "chunk",
        content: "正在构建课件生成提示词...",
        progress: 10,
      });

      // 构建AI提示词
      const prompt = this.buildSlidePromptFromRequirements(
        request,
        referenceTemplate,
      );

      // 调用AI服务生成课件
      await this.generateWithAI(prompt, request.lessonTitle, onChunk, 10);
    } catch (error) {
      console.error("基于需求生成课件失败:", error);
      onChunk({
        type: "error",
        message: error instanceof Error ? error.message : "生成课件失败",
      });
      throw error;
    }
  }

  /**
   * 基于文档生成课件（流式响应）
   */
  async generateFromDocumentStream(
    documentContent: string,
    documentType: string,
    lessonTitle?: string,
    onChunk?: StreamCallback,
  ): Promise<void> {
    try {
      if (onChunk) {
        onChunk({
          type: "chunk",
          content: "开始分析文档内容...",
          progress: 5,
        });
      }

      // 提取课程标题
      const extractedTitle = lessonTitle || this.extractTitle(documentContent);

      const request: GenerateSlideRequest = {
        lessonTitle: extractedTitle,
        textContent: documentContent,
        documentType,
      };

      await this.generateFromRequirementsStream(request, onChunk || (() => {}));
    } catch (error) {
      console.error("基于文档生成课件失败:", error);
      if (onChunk) {
        onChunk({
          type: "error",
          message: error instanceof Error ? error.message : "生成课件失败",
        });
      }
      throw error;
    }
  }

  /**
   * 构建基于课程设计的课件生成提示词
   */
  private buildSlidePromptFromCourseDesign(
    courseDesign: CourseDesign,
    referenceTemplate: string,
  ): string {
    // 提取课程设计的关键信息
    const overview = courseDesign.overview;
    const sessions = courseDesign.sessions;

    // 构建课程设计摘要
    const courseDesignSummary = `
**课程标题**: ${courseDesign.lessonTitle}

**课程内核**: ${overview.courseCore}

**课程线索**:
- 叙事明线: ${overview.courseLine.narrativeLine}
- 情感暗线: ${overview.courseLine.emotionalLine}

**教学目标**:
${overview.teachingObjectives.map((obj, i) => `${i + 1}. ${obj.category}: ${obj.description}`).join("\n")}

**教学重难点**:
${overview.teachingFocus.map((focus) => `- ${focus.type === "focus" ? "重点" : "难点"}: ${focus.content}`).join("\n")}

**课时安排**: ${overview.teachingSessions.join("、")}

**教学环节**:
${sessions
  .map(
    (session, idx) => `
【${session.sessionTitle}】
${session.phases
  .map(
    (phase, pIdx) => `
  环节${pIdx + 1}: ${phase.phase}
  ${
    "mainQuestion" in phase
      ? `主问题: ${phase.mainQuestion}
  子问题: ${phase.subQuestions?.join("; ") || "无"}`
      : `问题引导: ${phase.questions || "无"}`
  }
`,
  )
  .join("")}
`,
  )
  .join("\n")}
`;

    return `请根据以下课程设计，生成一份完整的35页课件设计方案。

# 课程设计信息

${courseDesignSummary}

# 课件设计要求

请严格按照以下要求生成35页课件：

## 页面类型分布
- 标题页: 2页（第1页正式标题页，第14页第二课时标题页）
- 导入页: 3页（情境导入、课程概览等）
- 讲解页: 18页（核心知识点讲解）
- 互动/活动/训练页: 10页（学生活动、练习、讨论等）
- 总结页: 2页（课时小结、课程总结）

## 页面内容设计原则
1. **与课程设计对应**: 每个教学环节都要在课件中体现
2. **问题驱动**: 讲解页要包含主问题和子问题
3. **活动具体**: 互动页要有明确的活动目标和操作步骤
4. **素材清晰**: 每页都要明确素材类型和具体需求

## 参考模版结构

以下是一个35页课件的标准格式示例（仅供参考结构，内容要完全基于上述课程设计重新生成）：

${referenceTemplate.substring(0, 6000)}

# 输出格式

请以JSON格式返回，格式如下：

\`\`\`json
{
  "courseTitle": "课程标题",
  "totalSlides": 35,
  "slides": [
    {
      "page": "P1",
      "pageNumber": 1,
      "type": "标题页",
      "title1": "一级标题",
      "title2": "二级标题",
      "content": "正文内容（包含问题、引导语、知识点等）",
      "materialType": "背景图 + 配图",
      "requirements": "详细的素材需求描述，包括背景图、配图、图示、风格等具体要求"
    },
    ... (共35页)
  ]
}
\`\`\`

**重要提示**:
- 必须生成完整的35页课件，不能少
- 每页的type必须是: "标题页"、"导入页"、"讲解页"、"教学活动/互动/训练页"、"环节过渡页"、"课程总结页"、"结束页" 之一
- content字段要详细，包含完整的教学内容、问题引导、知识点讲解等
- requirements字段要具体描述素材需求，便于后续素材生成
- 课件内容要完全基于提供的课程设计，与教学环节一一对应
- 请直接返回JSON，不要包含其他文字说明
`;
  }

  /**
   * 构建基于需求的课件生成提示词
   */
  private buildSlidePromptFromRequirements(
    request: GenerateSlideRequest,
    referenceTemplate: string,
  ): string {
    return `请根据以下需求，生成一份完整的35页课件设计方案。

# 课程信息

**课程标题**: ${request.lessonTitle}

${request.textContent ? `**课文内容**: \n${request.textContent.substring(0, 2000)}${request.textContent.length > 2000 ? "..." : ""}` : ""}

${request.requirements ? `**用户需求**: ${request.requirements}` : ""}

# 课件设计要求

请严格按照以下要求生成35页课件：

## 页面类型分布
- 标题页: 2页（第1页正式标题页，第14页第二课时标题页）
- 导入页: 3页（情境导入、课程概览等）
- 讲解页: 18页（核心知识点讲解）
- 互动/活动/训练页: 10页（学生活动、练习、讨论等）
- 总结页: 2页（课时小结、课程总结）

## 参考模版结构

以下是一个35页课件的标准格式示例：

${referenceTemplate.substring(0, 8000)}

# 输出格式

请以JSON格式返回，格式如下：

\`\`\`json
{
  "courseTitle": "${request.lessonTitle}",
  "totalSlides": 35,
  "slides": [
    {
      "page": "P1",
      "pageNumber": 1,
      "type": "标题页",
      "title1": "一级标题",
      "title2": "二级标题",
      "content": "正文内容",
      "materialType": "背景图 + 配图",
      "requirements": "详细的素材需求描述"
    },
    ... (共35页)
  ]
}
\`\`\`

**重要提示**:
- 必须生成完整的35页课件
- 每页的type必须准确
- content和requirements字段要详细具体
- 请直接返回JSON，不要包含其他文字说明
`;
  }

  /**
   * 使用AI生成课件（流式）
   */
  private async generateWithAI(
    prompt: string,
    lessonTitle: string,
    onChunk: StreamCallback,
    startProgress: number = 10,
  ): Promise<void> {
    const messages: AIMessage[] = [
      {
        role: "user",
        content: prompt,
      },
    ];

    let accumulatedText = "";
    let parsedData: any = null;
    let currentProgress = startProgress;

    // 调用AI流式生成
    await callClaudeAPIStream(
      messages,
      `你是一位资深的教学设计专家，擅长设计高质量的教学课件。请根据用户提供的课程设计或需求，生成详细的35页课件设计方案。`,
      async (chunk: string, isComplete: boolean) => {
        if (chunk) {
          accumulatedText += chunk;

          // 根据累积文本长度更新进度
          // 预估35页课件的JSON长度约为15000-25000字符
          const estimatedTotalLength = 20000;
          currentProgress = Math.min(
            startProgress +
              Math.floor((accumulatedText.length / estimatedTotalLength) * 85),
            95,
          );

          // 根据进度显示不同的状态文案
          let statusText = "正在生成课件...";
          if (currentProgress < 30) {
            statusText = "正在生成标题页和导入页...";
          } else if (currentProgress < 50) {
            statusText = "正在生成第一课时讲解页...";
          } else if (currentProgress < 70) {
            statusText = "正在生成互动和训练页...";
          } else if (currentProgress < 90) {
            statusText = "正在生成第二课时内容...";
          } else {
            statusText = "正在完成最后几页...";
          }

          // 发送进度更新
          onChunk({
            type: "chunk",
            content: statusText,
            progress: currentProgress,
          });

          // 尝试解析JSON（如果可能）
          if (isComplete || accumulatedText.length > 1000) {
            try {
              // 尝试提取JSON部分
              const jsonMatch = accumulatedText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);

                // 发送解析后的数据（部分）
                if (parsedData.slides && parsedData.slides.length > 0) {
                  onChunk({
                    type: "chunk",
                    content: `已生成 ${parsedData.slides.length} 页课件...`,
                    progress: currentProgress,
                    data: parsedData,
                  });
                }
              }
            } catch (e) {
              // JSON还未完整，继续等待
            }
          }
        }

        if (isComplete) {
          // 最终解析
          try {
            onChunk({
              type: "chunk",
              content: "正在解析和验证结果...",
              progress: 95,
            });

            // 清理响应文本
            let cleanedResponse = accumulatedText.trim();

            // 移除可能的markdown代码块标记
            if (cleanedResponse.startsWith("```json")) {
              cleanedResponse = cleanedResponse
                .replace(/^```json\s*/, "")
                .replace(/\s*```$/, "");
            } else if (cleanedResponse.startsWith("```")) {
              cleanedResponse = cleanedResponse
                .replace(/^```\s*/, "")
                .replace(/\s*```$/, "");
            }

            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsedData = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("无法从AI响应中提取JSON");
            }

            // 验证和规范化数据
            const normalizedData = this.normalizeSlideDesign(
              parsedData,
              lessonTitle,
            );

            // 发送最终数据
            onChunk({
              type: "complete",
              content: "课件生成完成！",
              progress: 100,
              data: normalizedData,
            });
          } catch (error) {
            console.error("解析AI响应失败:", error);
            console.error("AI响应内容:", accumulatedText.substring(0, 1000));
            onChunk({
              type: "error",
              message: "解析AI生成的内容失败，请重试",
            });
            throw error;
          }
        }
      },
    );
  }

  /**
   * 规范化课件设计数据
   */
  private normalizeSlideDesign(
    data: any,
    lessonTitle: string,
  ): CourseSlideDesign {
    // 验证slides数组
    if (!data.slides || !Array.isArray(data.slides)) {
      throw new Error("课件数据格式错误：缺少slides数组");
    }

    // 确保有35页
    if (data.slides.length < 35) {
      console.warn(`课件页数不足35页，当前: ${data.slides.length}页`);
    }

    // 规范化每一页的数据
    const normalizedSlides: SlideData[] = data.slides.map(
      (slide: any, index: number): SlideData => ({
        page: slide.page || `P${index + 1}`,
        pageNumber: slide.pageNumber || index + 1,
        type: slide.type || "讲解页",
        title1: slide.title1 || "",
        title2: slide.title2 || "",
        content: slide.content || "",
        materialType: slide.materialType || "背景图",
        requirements: slide.requirements || "",
      }),
    );

    return {
      courseTitle: data.courseTitle || lessonTitle,
      totalSlides: normalizedSlides.length,
      slides: normalizedSlides,
      metadata: {
        createTime: new Date().toISOString(),
        author: "AI Generated",
        description: "基于课程设计自动生成的课件",
      },
    };
  }

  /**
   * 从文档内容中提取标题
   */
  private extractTitle(content: string): string {
    // 尝试匹配《xxx》格式的标题
    const titleMatch = content.match(/《([^》]+)》/);
    if (titleMatch) {
      return `《${titleMatch[1]}》`;
    }

    // 尝试匹配markdown标题
    const mdTitleMatch = content.match(/^#\s+(.+)$/m);
    if (mdTitleMatch) {
      return mdTitleMatch[1].trim();
    }

    return "未命名课程";
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.templateCache = null;
  }
}

// 导出单例
export const slideGeneratorService = new SlideGeneratorService();
