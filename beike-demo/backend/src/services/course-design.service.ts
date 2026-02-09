import path from "path";
import * as fs from "fs";
import {
  CourseDesign,
  CourseDesignTable,
  CourseDesignDetailed,
  GenerateCourseDesignRequest,
  GenerateFromDocumentRequest,
  FrontendCourseData,
  FrontendSection,
  TeachingPhaseTable,
  TeachingPhaseDetailed,
} from "../models/course-design.model";
import { courseDesignParser } from "./course-design.parser";
import {
  callClaudeAPI,
  callClaudeAPIStream,
  type AIMessage,
} from "./ai.service";

/**
 * 课程设计业务服务
 */
export class CourseDesignService {
  private templateCache: Map<
    string,
    { data: CourseDesign; expireTime: number }
  > = new Map();
  private readonly CACHE_TTL = 3600 * 1000; // 1小时缓存过期时间

  /**
   * 获取表格版模版
   */
  async getTableTemplate(): Promise<CourseDesignTable> {
    const cacheKey = "template-table";
    const cached = this.templateCache.get(cacheKey);

    // 检查缓存是否存在且未过期
    if (cached && Date.now() < cached.expireTime) {
      console.log("使用缓存的表格版模版");
      return cached.data as CourseDesignTable;
    }

    console.log("重新加载表格版模版");
    const filePath = path.join(
      process.cwd(),
      "..",
      "data",
      "busi",
      "7. 1《秋天的怀念》情境任务式课程设计（表格版）.md",
    );

    const template = await courseDesignParser.parseCourseDesignFile(filePath);

    if (template.version !== "table") {
      throw new Error("模版文件格式不匹配：期望表格版");
    }

    // 存入缓存，设置过期时间
    this.templateCache.set(cacheKey, {
      data: template,
      expireTime: Date.now() + this.CACHE_TTL,
    });

    return template;
  }

  /**
   * 获取完整版模版
   */
  async getDetailedTemplate(): Promise<CourseDesignDetailed> {
    const cacheKey = "template-detailed";
    const cached = this.templateCache.get(cacheKey);

    // 检查缓存是否存在且未过期
    if (cached && Date.now() < cached.expireTime) {
      console.log("使用缓存的完整版模版");
      return cached.data as CourseDesignDetailed;
    }

    console.log("重新加载完整版模版");
    const filePath = path.join(
      process.cwd(),
      "..",
      "data",
      "busi",
      "7.2 《秋天的怀念》情境任务式课程设计（完整版）.md",
    );

    const template = await courseDesignParser.parseCourseDesignFile(filePath);

    if (template.version !== "detailed") {
      throw new Error("模版文件格式不匹配：期望完整版");
    }

    // 存入缓存，设置过期时间
    this.templateCache.set(cacheKey, {
      data: template,
      expireTime: Date.now() + this.CACHE_TTL,
    });

    return template;
  }

  /**
   * 根据文档生成课程设计（流式响应）
   */
  async generateFromDocumentStream(
    request: GenerateFromDocumentRequest,
    onChunk: (chunk: any) => void,
  ): Promise<void> {
    try {
      // 提取课程标题
      const lessonTitle =
        request.lessonTitle || this.extractTitle(request.documentContent);

      // 发送开始状态
      onChunk({
        type: "chunk",
        content: "开始分析文档内容...",
        progress: 5,
      });

      // 获取参考模版
      const referenceTemplate = await this.getDetailedTemplate();

      // 构建AI提示词
      const prompt = this.buildCourseDesignPrompt(
        request.documentContent,
        lessonTitle,
        referenceTemplate,
      );

      // 调用AI服务生成课程设计
      await this.generateWithAI(prompt, lessonTitle, onChunk);
    } catch (error) {
      console.error("生成课程设计失败:", error);
      onChunk({
        type: "error",
        message: error instanceof Error ? error.message : "生成课程设计失败",
      });
      throw error;
    }
  }

  /**
   * 构建课程设计生成提示词
   */
  private buildCourseDesignPrompt(
    documentContent: string,
    lessonTitle: string,
    referenceTemplate: CourseDesignDetailed,
  ): string {
    return `请根据以下文档内容，生成一份完整的课程设计。

课程标题：${lessonTitle}

文档内容：
${documentContent.substring(0, 5000)}${documentContent.length > 5000 ? "..." : ""}

参考模版结构（请参考此格式，但内容要根据文档生成）：
${JSON.stringify(referenceTemplate, null, 2).substring(0, 3000)}

请生成一份完整的课程设计，要求：
1. 包含课程总览（课程内核、线索、教学目标、重难点等）
2. **根据教学内容的复杂度和深度，智能决定需要1个课时还是2个课时**：
   - 如果内容较简单、教学目标单一、活动简洁，生成1个课时（3-4个环节）
   - 如果内容复杂、需要深度探讨、活动丰富，生成2个课时（每课时3-5个环节）
   - 请在overview.teachingSessions中如实反映课时数量
3. 每个环节包含：环节名称、主问题、子问题、知识点、教学活动

请以JSON格式返回，格式如下：
{
  "lessonTitle": "课程标题",
  "version": "detailed",
  "overview": {
    "courseCore": "课程内核",
    "courseLine": {
      "narrativeLine": "叙事明线",
      "emotionalLine": "情感暗线"
    },
    "teachingObjectives": [
      {
        "category": "目标类别",
        "description": "目标描述"
      }
    ],
    "teachingFocus": [
      {
        "type": "focus",
        "content": "重点内容"
      },
      {
        "type": "difficulty",
        "content": "难点内容"
      }
    ],
    "teachingSessions": ["第一课时"] 或 ["第一课时", "第二课时"],  // 根据实际需要
    "teachingMode": "教学模式",
    "courseFeatures": ["特点1", "特点2"],
    "learningOutcomes": ["收获1", "收获2"],
    "keyActivities": ["活动1", "活动2"]
  },
  "sessions": [
    {
      "sessionTitle": "课时标题",
      "phases": [
        {
          "phase": "环节名称",
          "mainQuestion": "主问题",
          "subQuestions": ["子问题1", "子问题2"],
          "knowledgePoints": [
            {
              "tag": "#知识点标签#",
              "description": "知识点描述"
            }
          ],
          "activities": {
            "name": "活动名称",
            "what": "是什么",
            "how": "怎么做",
            "verify": "验证什么",
            "organize": "怎么组织"
          }
        }
      ]
    }
    // 如果需要2个课时，添加第二个session对象
  ]
}

请直接返回JSON，不要包含其他文字说明。`;
  }

  /**
   * 使用AI生成课程设计（流式）
   */
  private async generateWithAI(
    prompt: string,
    lessonTitle: string,
    onChunk: (chunk: any) => void,
  ): Promise<void> {
    const messages: AIMessage[] = [
      {
        role: "user",
        content: prompt,
      },
    ];

    let accumulatedText = "";
    let parsedData: any = null;
    let currentProgress = 10;

    // 调用AI流式生成
    await callClaudeAPIStream(
      messages,
      `你是一位资深的语文教学专家，擅长设计高质量的课程。请根据用户提供的文档内容，生成完整的课程设计。`,
      async (chunk: string, isComplete: boolean) => {
        if (chunk) {
          accumulatedText += chunk;
          currentProgress = Math.min(
            10 + Math.floor((accumulatedText.length / 10000) * 80),
            90,
          );

          // 发送进度更新
          onChunk({
            type: "chunk",
            content: `正在生成课程设计... (${Math.floor(currentProgress)}%)`,
            progress: currentProgress,
          });

          // 尝试解析JSON（如果可能）
          if (isComplete || accumulatedText.length > 500) {
            try {
              // 尝试提取JSON部分
              const jsonMatch = accumulatedText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);

                // 发送解析后的数据
                onChunk({
                  type: "chunk",
                  content: "正在解析生成的内容...",
                  progress: currentProgress,
                  data: parsedData,
                });
              }
            } catch (e) {
              // JSON还未完整，继续等待
            }
          }
        }

        if (isComplete) {
          // 最终解析
          try {
            const jsonMatch = accumulatedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              parsedData = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("无法从AI响应中提取JSON");
            }

            // 验证和规范化数据
            const normalizedData = this.normalizeCourseDesign(
              parsedData,
              lessonTitle,
            );

            // 发送最终数据
            onChunk({
              type: "chunk",
              content: "生成完成！",
              progress: 100,
              data: normalizedData,
            });
          } catch (error) {
            console.error("解析AI响应失败:", error);
            console.error("AI响应内容:", accumulatedText);
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
   * 规范化课程设计数据
   */
  private normalizeCourseDesign(
    data: any,
    lessonTitle: string,
  ): CourseDesignDetailed {
    return {
      lessonTitle: data.lessonTitle || lessonTitle,
      version: "detailed" as const,
      overview: data.overview || {
        courseCore: "",
        courseLine: { narrativeLine: "", emotionalLine: "" },
        teachingObjectives: [],
        teachingFocus: [],
        teachingSessions: [],
        teachingMode: "",
        courseFeatures: [],
        learningOutcomes: [],
        keyActivities: [],
      },
      sessions: data.sessions || [],
      metadata: {
        createTime: new Date().toISOString(),
        source: "ai-generated",
      },
    };
  }

  /**
   * 模拟流式生成（保留作为备用）
   */
  private async simulateStreamGeneration(
    lessonTitle: string,
    request: GenerateFromDocumentRequest,
    onChunk: (chunk: any) => void,
  ): Promise<void> {
    // 模拟生成过程，分阶段发送数据
    const stages = [
      {
        content: "正在提取课程核心信息...",
        progress: 15,
        delay: 1000,
      },
      {
        content: "正在设计教学目标...",
        progress: 30,
        delay: 1500,
        data: {
          lessonTitle,
          overview: {
            courseCore: "通过回忆母亲的关怀，理解母爱的深沉与伟大",
            courseLine: {
              narrativeLine: "看花明线",
              emotionalLine: "情感暗线",
            },
            teachingObjectives: [
              {
                category: "语言建构与运用",
                description: "理解关键词句的含义和作用",
              },
            ],
            teachingFocus: [
              { type: "focus", content: "理解母爱的深沉与伟大" },
              { type: "difficulty", content: "体会作者的情感变化" },
            ],
            teachingSessions: ["第一课时", "第二课时"],
            teachingMode: "情境任务式",
            courseFeatures: [],
            learningOutcomes: [],
            keyActivities: [],
          },
        },
      },
      {
        content: "正在设计第一课时...",
        progress: 50,
        delay: 2000,
        data: {
          sessions: [
            {
              sessionTitle: "第一课时：整体感知·初探张力",
              phases: [
                {
                  phase: "导入新课",
                  mainQuestion: "什么样的秋天让作者如此怀念？",
                  subQuestions: [
                    "从标题中你能获取哪些信息？",
                    "作者是谁？你了解他吗？",
                  ],
                  knowledgePoints: [
                    { tag: "#文学常识#", description: "了解作者史铁生" },
                  ],
                  activities: {
                    name: "情境导入",
                    what: "播放秋日意境视频，展示作者简介",
                    how: "引发学生思考",
                    verify: "学生能简单介绍作者史铁生",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        content: "正在设计第二课时...",
        progress: 70,
        delay: 2000,
        data: {
          sessions: [
            {
              sessionTitle: "第一课时：整体感知·初探张力",
              phases: [
                {
                  phase: "导入新课",
                  mainQuestion: "什么样的秋天让作者如此怀念？",
                  subQuestions: [
                    "从标题中你能获取哪些信息？",
                    "作者是谁？你了解他吗？",
                  ],
                  knowledgePoints: [
                    { tag: "#文学常识#", description: "了解作者史铁生" },
                  ],
                  activities: {
                    name: "情境导入",
                    what: "播放秋日意境视频，展示作者简介",
                    how: "引发学生思考",
                    verify: "学生能简单介绍作者史铁生",
                  },
                },
                {
                  phase: "初读课文",
                  mainQuestion: "文章讲述了一个怎样的故事？",
                  subQuestions: [
                    "文中出现了哪些人物？",
                    "围绕什么事件展开叙述？",
                  ],
                  knowledgePoints: [
                    { tag: "#字音字形#", description: "掌握生字词" },
                  ],
                  activities: {
                    name: "自由朗读",
                    what: "学生自由朗读，圈画生字词",
                    how: "梳理故事情节",
                    verify: "学生用一句话概括故事",
                  },
                },
              ],
            },
            {
              sessionTitle: "第二课时：细读品味·领悟升华",
              phases: [
                {
                  phase: "细节品析",
                  mainQuestion: '母亲的动作"悄悄地"出现了几次？体现了什么？',
                  subQuestions: [
                    '找出所有"悄悄地"的句子',
                    '为什么要"悄悄地"？',
                    "这反映了母爱的什么特点？",
                  ],
                  knowledgePoints: [
                    { tag: "#细节描写#", description: "理解细节描写的作用" },
                  ],
                  activities: {
                    name: "分组讨论",
                    what: '填写"细节解码分析单"',
                    how: "分组讨论",
                    verify: "学生分享解码单内容",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        content: "正在完善课程设计...",
        progress: 90,
        delay: 1500,
      },
      {
        content: "生成完成！",
        progress: 100,
        delay: 500,
      },
    ];

    for (const stage of stages) {
      await new Promise((resolve) => setTimeout(resolve, stage.delay));

      const chunk: any = {
        type: "chunk",
        content: stage.content,
        progress: stage.progress,
      };

      if (stage.data) {
        chunk.data = stage.data;
      }

      onChunk(chunk);
    }
  }

  /**
   * 根据文档生成课程设计
   * TODO: 需要集成AI服务
   */
  async generateFromDocument(
    request: GenerateFromDocumentRequest,
  ): Promise<CourseDesign> {
    // 提取课程标题
    const lessonTitle =
      request.lessonTitle || this.extractTitle(request.documentContent);

    // TODO: 调用AI服务生成课程设计
    // 这里需要集成实际的AI生成逻辑
    throw new Error("AI生成功能待实现：需要集成大模型服务");

    // 示例返回结构（实际应由AI生成）
    // return {
    //   lessonTitle,
    //   version: 'detailed',
    //   overview: { ... },
    //   sessions: [ ... ],
    //   metadata: {
    //     createTime: new Date().toISOString(),
    //     source: 'ai-generated',
    //   }
    // };
  }

  /**
   * 根据需求生成课程设计（调用真实AI服务）
   */
  async generateFromRequirements(
    request: GenerateCourseDesignRequest,
  ): Promise<CourseDesign> {
    console.log("收到AI生成请求:", request);

    // 获取参考模版
    const referenceTemplate =
      request.referenceTemplate === "table"
        ? await this.getTableTemplate()
        : await this.getDetailedTemplate();

    // 构建AI提示词
    const prompt = this.buildRequirementsPrompt(request, referenceTemplate);

    // 构建消息
    const messages: AIMessage[] = [
      {
        role: "user",
        content: prompt,
      },
    ];

    try {
      console.log("正在调用AI服务生成课程设计...");

      // 使用非流式API获取完整响应（流式可能导致JSON不完整）
      const aiResponse = await callClaudeAPI(
        messages,
        `你是一位资深的语文教学专家，擅长设计高质量的课程。请根据用户提供的需求，生成完整的课程设计。`,
      );

      console.log("AI响应完成，开始解析...");
      console.log("原始响应长度:", aiResponse.length);

      // ai.service.ts已经正确处理了SSE流，直接使用返回的文本
      // 从AI响应中提取JSON（去除可能的markdown代码块标记）
      let cleanedResponse = aiResponse.trim();

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

      // 从响应中提取JSON
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(
          "AI响应中未找到JSON，原始响应:",
          aiResponse.substring(0, 500),
        );
        throw new Error("AI响应格式不正确，无法提取课程设计数据");
      }

      console.log("提取的JSON长度:", jsonMatch[0].length);

      let parsedData;
      try {
        parsedData = JSON.parse(jsonMatch[0]);
        console.log("JSON解析成功");
      } catch (parseError) {
        console.error("JSON解析失败:", parseError);
        console.error("尝试解析的内容:", jsonMatch[0].substring(0, 500));
        throw new Error("课程设计数据解析失败，请重试");
      }

      // 规范化数据
      const courseDesign: CourseDesign = this.normalizeCourseDesign(
        parsedData,
        request.lessonTitle,
      );

      console.log("课程设计生成成功");

      return courseDesign;
    } catch (error) {
      console.error("AI生成失败:", error);
      throw new Error(
        error instanceof Error ? `AI生成失败: ${error.message}` : "AI生成失败",
      );
    }
  }

  /**
   * 构建根据需求生成课程设计的提示词
   */
  private buildRequirementsPrompt(
    request: GenerateCourseDesignRequest,
    referenceTemplate: CourseDesign,
  ): string {
    const templateExample = JSON.stringify(
      referenceTemplate,
      null,
      2,
    ).substring(0, 3000);

    return `请根据以下需求，生成一份完整的课程设计。

**课程标题**: ${request.lessonTitle}

**用户需求**: ${request.requirements || "请按照标准格式设计课程"}

${request.grade ? `**年级**: ${request.grade}` : ""}
${request.subject ? `**学科**: ${request.subject}` : ""}
${request.textContent ? `**课文内容摘要**: ${request.textContent.substring(0, 500)}` : ""}

**参考模版格式**（请参考此JSON结构，但内容要完全根据用户需求重新生成）：
\`\`\`json
${templateExample}
\`\`\`

**生成要求**：
1. 完整的课程设计总览（课程内核、课程线索、教学目标、教学重难点等）
2. **根据教学内容的复杂度和深度，智能决定需要1个课时还是2个课时**：
   - 如果内容较简单、教学目标单一、活动简洁，生成1个课时（3-4个环节）
   - 如果内容复杂、需要深度探讨、活动丰富，生成2个课时（每课时3-5个环节）
   - 请在overview.teachingSessions中如实反映课时数量（如["第一课时"]或["第一课时", "第二课时"]）
3. 每个环节包含：环节名称、问题引导、知识点解读、教学活动
4. 教学目标分为：语言建构与运用、思维发展与提升、审美鉴赏与创造、文化传承与理解
5. 教学活动要具体、可操作，符合实际教学场景

**重要提示**：
- 请根据用户的具体需求进行创新设计，不要照搬模版内容
- 如果用户提到"探究式"、"任务式"等教学模式，请在设计中体现
- 内容要符合新课标要求和核心素养导向
- 以学生为中心设计教学活动

**输出格式**：
请直接返回JSON格式的课程设计数据，不要包含任何其他文字说明。JSON结构必须严格遵循模版格式。`;
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
   * 将后端CourseDesign格式转换为前端FrontendCourseData格式
   */
  convertToFrontendFormat(
    courseDesign: CourseDesign,
    username: string = "",
  ): FrontendCourseData {
    return {
      username,
      lessonTitle: courseDesign.lessonTitle,
      updateTime: new Date().toISOString(),
      courseDesign: {
        lesson1: {
          title: courseDesign.sessions[0]?.sessionTitle || "第一课时",
          sections: this.convertPhasesToSections(
            courseDesign.sessions[0]?.phases || [],
          ),
        },
        lesson2: {
          title: courseDesign.sessions[1]?.sessionTitle || "第二课时",
          sections: this.convertPhasesToSections(
            courseDesign.sessions[1]?.phases || [],
          ),
        },
      },
    };
  }

  /**
   * 将教学环节(phases)转换为前端Section格式
   */
  private convertPhasesToSections(
    phases: (TeachingPhaseTable | TeachingPhaseDetailed)[],
  ): FrontendSection[] {
    return phases.map((phase, index) => {
      // 判断是表格版还是完整版
      const isTableVersion = "questions" in phase && "knowledge" in phase;

      if (isTableVersion) {
        // 表格版格式
        const tablePhase = phase as TeachingPhaseTable;
        return {
          id: `${Date.now()}-${index}`,
          title: tablePhase.phase || `环节${index + 1}`,
          mainQuestion: tablePhase.questions || "",
          subQuestions: this.extractSubQuestions(tablePhase.questions || ""),
          activities: tablePhase.activities || "",
          knowledgePoints: this.extractKnowledgePoints(
            tablePhase.knowledge || "",
          ),
          expectedOutcome: "",
          verification: "",
          duration: this.extractDuration(tablePhase.phase || ""),
        };
      } else {
        // 完整版格式
        const detailedPhase = phase as TeachingPhaseDetailed;
        return {
          id: `${Date.now()}-${index}`,
          title: detailedPhase.phase || `环节${index + 1}`,
          mainQuestion: detailedPhase.mainQuestion || "",
          subQuestions: detailedPhase.subQuestions || [],
          activities:
            typeof detailedPhase.activities === "string"
              ? detailedPhase.activities
              : this.formatTeachingActivity(detailedPhase.activities),
          knowledgePoints: detailedPhase.knowledgePoints
            ? detailedPhase.knowledgePoints.map(
                (kp) => `${kp.tag} ${kp.description}`,
              )
            : [],
          expectedOutcome: "",
          verification: "",
          duration: this.extractDuration(detailedPhase.phase || ""),
        };
      }
    });
  }

  /**
   * 从问题文本中提取子问题列表
   */
  private extractSubQuestions(questionsText: string): string[] {
    if (!questionsText) return [];

    // 尝试匹配"子问题："后面的内容
    const subMatch = questionsText.match(/子问题[：:]([\s\S]*)/);
    if (!subMatch) return [];

    // 按换行或数字编号分割
    const subQuestionsText = subMatch[1].trim();
    const questions = subQuestionsText
      .split(/[\n\r]+/)
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .map((q) => q.replace(/^[①②③④⑤⑥⑦⑧⑨⑩\d]+[、\.]?\s*/, ""));

    return questions;
  }

  /**
   * 从知识点文本中提取知识点列表
   */
  private extractKnowledgePoints(knowledgeText: string): string[] {
    if (!knowledgeText) return [];

    // 提取所有#标签#格式的知识点
    const tags = knowledgeText.match(/#[^#]+#/g);
    if (tags) {
      return tags.map((tag) => tag.replace(/#/g, "").trim());
    }

    // 如果没有标签，按段落分割
    return knowledgeText
      .split(/[\n\r]+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  /**
   * 从环节标题中提取时长（分钟）
   */
  private extractDuration(phaseTitle: string): number {
    const match = phaseTitle.match(/[（(](\d+)分钟[）)]/);
    return match ? parseInt(match[1]) : 10; // 默认10分钟
  }

  /**
   * 格式化教学活动对象为字符串
   */
  private formatTeachingActivity(activity: any): string {
    if (typeof activity === "string") return activity;
    if (!activity) return "";

    const parts = [];
    if (activity.name) parts.push(`活动名称：${activity.name}`);
    if (activity.what) parts.push(`是什么：${activity.what}`);
    if (activity.how) parts.push(`怎么做：${activity.how}`);
    if (activity.verify) parts.push(`验证：${activity.verify}`);
    if (activity.organize) parts.push(`组织：${activity.organize}`);

    return parts.join("\n");
  }

  /**
   * 清除缓存
   */
  clearCache(templateType?: "table" | "detailed") {
    if (templateType) {
      this.templateCache.delete(`template-${templateType}`);
    } else {
      this.templateCache.clear();
    }
  }

  /**
   * 保存课程设计到用户目录
   */
  async saveCourseDesign(
    username: string,
    courseData: FrontendCourseData,
  ): Promise<string> {
    try {
      // 构建保存路径
      const userDir = path.join(process.cwd(), "..", "data", "users", username);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `课程设计_${courseData.lessonTitle}_${timestamp}.json`;
      const savePath = path.join(userDir, filename);

      // 确保用户目录存在
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      // 更新时间戳和用户名
      const dataToSave = {
        ...courseData,
        username,
        updateTime: new Date().toISOString(),
      };

      // 保存文件
      fs.writeFileSync(savePath, JSON.stringify(dataToSave, null, 2), "utf-8");

      console.log(`课程设计已保存: ${savePath}`);
      return savePath;
    } catch (error) {
      console.error("保存课程设计失败:", error);
      throw new Error(
        error instanceof Error ? error.message : "保存课程设计失败",
      );
    }
  }

  /**
   * 加载用户的课程设计
   */
  async loadCourseDesign(
    username: string,
    filename?: string,
  ): Promise<FrontendCourseData | null> {
    try {
      const userDir = path.join(process.cwd(), "..", "data", "users", username);

      if (!fs.existsSync(userDir)) {
        return null;
      }

      if (filename) {
        // 加载指定文件
        const filePath = path.join(userDir, filename);
        if (!fs.existsSync(filePath)) {
          return null;
        }
        const content = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(content) as FrontendCourseData;
      } else {
        // 加载最新的文件
        const files = fs
          .readdirSync(userDir)
          .filter((f) => f.endsWith(".json"))
          .sort()
          .reverse(); // 按时间倒序

        if (files.length === 0) {
          return null;
        }

        const latestFile = files[0];
        const filePath = path.join(userDir, latestFile);
        const content = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(content) as FrontendCourseData;
      }
    } catch (error) {
      console.error("加载课程设计失败:", error);
      throw new Error(
        error instanceof Error ? error.message : "加载课程设计失败",
      );
    }
  }

  /**
   * 列出用户的所有课程设计
   */
  async listUserCourseDesigns(username: string): Promise<
    Array<{
      filename: string;
      lessonTitle: string;
      updateTime: string;
    }>
  > {
    try {
      const userDir = path.join(process.cwd(), "..", "data", "users", username);

      if (!fs.existsSync(userDir)) {
        return [];
      }

      const files = fs
        .readdirSync(userDir)
        .filter((f) => f.endsWith(".json"))
        .sort()
        .reverse();

      const courseList = files.map((filename) => {
        const filePath = path.join(userDir, filename);
        const content = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(content) as FrontendCourseData;

        return {
          filename,
          lessonTitle: data.lessonTitle,
          updateTime: data.updateTime,
        };
      });

      return courseList;
    } catch (error) {
      console.error("列出课程设计失败:", error);
      throw new Error(
        error instanceof Error ? error.message : "列出课程设计失败",
      );
    }
  }

  /**
   * 删除指定的课程设计
   */
  async deleteCourseDesign(username: string, filename: string): Promise<void> {
    try {
      const filePath = path.join(
        process.cwd(),
        "..",
        "data",
        "users",
        username,
        filename,
      );

      if (!fs.existsSync(filePath)) {
        throw new Error("文件不存在");
      }

      fs.unlinkSync(filePath);
      console.log(`课程设计已删除: ${filePath}`);
    } catch (error) {
      console.error("删除课程设计失败:", error);
      throw new Error(
        error instanceof Error ? error.message : "删除课程设计失败",
      );
    }
  }
}

// 导出单例
export const courseDesignService = new CourseDesignService();
