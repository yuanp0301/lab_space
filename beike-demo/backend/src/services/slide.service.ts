import path from "path";
import fs from "fs/promises";
import { markdownParser } from "./markdown.parser";
import {
  CourseSlideDesign,
  SlideData,
  SlidePageResult,
  SlideQueryParams,
} from "../models/slide.model";
import {
  GeneratedSlideData,
  SlideListItem,
  GenerateFromTemplateRequest,
  GenerateFromDesignRequest,
  Template,
} from "../models/template.model";
import { callClaudeAPI } from "./ai.service";
import { templateService } from "./template.service";

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

  /**
   * 保存生成的课件到服务器
   * @param slideData 课件数据
   */
  async saveGeneratedSlides(
    slideData: GeneratedSlideData,
  ): Promise<{ filePath: string; savedAt: string }> {
    const { username, lessonTitle } = slideData;

    // 构建用户目录路径
    const userDir = path.join(process.cwd(), "..", "data", "users", username);

    // 确保目录存在
    await fs.mkdir(userDir, { recursive: true });

    // 构建文件路径
    const fileName = `${lessonTitle}_课件.json`;
    const filePath = path.join(userDir, fileName);

    // 保存数据
    await fs.writeFile(filePath, JSON.stringify(slideData, null, 2), "utf-8");

    return {
      filePath: path.relative(process.cwd(), filePath),
      savedAt: new Date().toISOString(),
    };
  }

  /**
   * 加载用户保存的课件
   * @param username 用户名
   * @param lessonTitle 课程标题
   */
  async loadGeneratedSlides(
    username: string,
    lessonTitle: string,
  ): Promise<GeneratedSlideData> {
    // 构建文件路径
    const fileName = `${lessonTitle}_课件.json`;
    const filePath = path.join(
      process.cwd(),
      "..",
      "data",
      "users",
      username,
      fileName,
    );

    // 读取文件
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content) as GeneratedSlideData;

    return data;
  }

  /**
   * 获取用户的课件列表
   * @param username 用户名
   */
  async getSlidesList(username: string): Promise<SlideListItem[]> {
    const userDir = path.join(process.cwd(), "..", "data", "users", username);

    try {
      // 读取目录
      const files = await fs.readdir(userDir);

      // 筛选课件文件
      const slideFiles = files.filter((file) => file.endsWith("_课件.json"));

      // 读取每个文件的元数据
      const slidesList: SlideListItem[] = [];

      for (const file of slideFiles) {
        const filePath = path.join(userDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(content) as GeneratedSlideData;

        slidesList.push({
          lessonTitle: data.lessonTitle,
          updateTime: data.updateTime,
          template: data.template,
          slideCount: data.slides.length,
          filePath: path.relative(process.cwd(), filePath),
        });
      }

      // 按更新时间倒序排序
      slidesList.sort(
        (a, b) =>
          new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime(),
      );

      return slidesList;
    } catch (error) {
      // 如果目录不存在，返回空数组
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  /**
   * 基于模板生成课件
   * @param params 生成参数
   */
  async generateSlidesFromTemplate(
    params: GenerateFromTemplateRequest,
  ): Promise<GeneratedSlideData> {
    const { templateId, lessonTitle, username, grade, subject, requirements } =
      params;

    // 验证模板ID
    const template = templateService.getTemplateById(templateId);
    if (!template) {
      throw new Error(`模板ID不存在: ${templateId}`);
    }

    // 构建AI提示词
    const systemPrompt = `你是一位专业的课件设计专家，负责根据教师的要求生成高质量的课件内容。

你需要生成一个完整的35页课件，每页课件都包含标题和丰富的内容。

课件应该包含以下部分：
1. 标题页（1页）
2. 课程目标（1-2页）
3. 课程导入（2-3页）
4. 主要内容讲解（20-25页）
5. 课堂活动（2-3页）
6. 总结与作业（2-3页）

返回格式要求：
- 必须返回严格的JSON格式
- 不要包含任何markdown标记（如\`\`\`json）
- slides数组必须包含35个元素
- 每个slide必须包含id、title、content、materials、transition、type字段
- content字段使用HTML格式，包含丰富的内容（段落、列表、引用等）`;

    const userPrompt = `请为以下课程生成完整的35页课件：

课程名称：${lessonTitle}
教师姓名：${username}
${grade ? `年级：${grade}` : ""}
${subject ? `学科：${subject}` : ""}
${requirements ? `特殊要求：${requirements}` : ""}

模板风格：${template.name}（${template.description}）
主题色：${template.color}

请返回JSON格式：
{
  "username": "${username}",
  "lessonTitle": "${lessonTitle}",
  "updateTime": "${new Date().toISOString()}",
  "template": "${templateId}",
  "slides": [
    {
      "id": "slide-1",
      "title": "课件标题",
      "content": "<h1>课件内容HTML</h1><p>详细内容...</p>",
      "materials": [],
      "transition": "fade",
      "type": "title"
    },
    ... (共35个slide)
  ]
}

注意：
1. content必须是HTML格式，内容要丰富详细
2. type可选值：title（标题页）、objective（目标页）、introduction（导入页）、lecture（讲解页）、activity（活动页）、summary（总结页）
3. transition可选值：fade、slide、zoom
4. materials暂时为空数组[]
5. 确保总共有35页`;

    // 调用AI生成
    const aiResponse = await callClaudeAPI(
      [{ role: "user", content: userPrompt }],
      systemPrompt,
    );

    // 解析AI响应
    let slideData: GeneratedSlideData;
    try {
      // 清理可能的markdown标记
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/, "")
          .replace(/```\s*$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\s*/, "")
          .replace(/```\s*$/, "");
      }

      slideData = JSON.parse(cleanedResponse);

      // 验证数据
      if (!slideData.slides || !Array.isArray(slideData.slides)) {
        throw new Error("AI响应格式错误：缺少slides数组");
      }

      // 确保有35页（如果不足，补充空白页）
      while (slideData.slides.length < 35) {
        slideData.slides.push({
          id: `slide-${slideData.slides.length + 1}`,
          title: "待完善",
          content: "<p>待完善的内容...</p>",
          materials: [],
          transition: "fade",
          type: "lecture",
        });
      }

      // 确保不超过35页
      if (slideData.slides.length > 35) {
        slideData.slides = slideData.slides.slice(0, 35);
      }

      // 更新时间戳
      slideData.updateTime = new Date().toISOString();

      return slideData;
    } catch (error) {
      console.error("解析AI响应失败:", error);
      console.error("原始响应:", aiResponse);
      throw new Error(
        `解析AI响应失败: ${error instanceof Error ? error.message : "未知错误"}`,
      );
    }
  }

  /**
   * 基于设计思路生成课件
   * @param params 生成参数
   */
  async generateSlidesFromDesign(
    params: GenerateFromDesignRequest,
  ): Promise<GeneratedSlideData> {
    const { designFileName, templateId, username, customOptions } = params;

    // 验证模板ID
    const template = templateService.getTemplateById(templateId);
    if (!template) {
      throw new Error(`模板ID不存在: ${templateId}`);
    }

    // 获取设计思路数据
    const design = await this.getCourseSlideDesign(designFileName);

    if (design.slides.length !== 35) {
      throw new Error(
        `设计思路页数不符合要求，期望35页，实际${design.slides.length}页`,
      );
    }

    // 构建AI提示词
    const systemPrompt = `你是一位专业的课件设计专家，负责根据课件设计思路生成完整的课件内容。

你将收到一份详细的课件设计思路（35页），需要根据这份设计思路生成完整的课件内容。

返回格式要求：
- 必须返回严格的JSON格式
- 不要包含任何markdown标记（如\`\`\`json）
- slides数组必须包含35个元素，与设计思路一一对应
- 每个slide必须包含id、title、content、materials、transition、type字段
- content字段使用HTML格式，根据设计思路的要求生成丰富的内容`;

    // 构建设计思路描述
    const designDescription = design.slides
      .map(
        (slide, index) => `
第${index + 1}页（${slide.page}）：
- 页面类型：${slide.type}
- 一级标题：${slide.title1}
- 二级标题：${slide.title2}
- 正文内容：${slide.content}
- 素材要求：${slide.materialType}
- 具体需求：${slide.requirements}
`,
      )
      .join("\n");

    const userPrompt = `请根据以下课件设计思路生成完整的35页课件：

课程标题：${design.courseTitle}
教师姓名：${username}

模板风格：${template.name}（${template.description}）
主题色：${template.color}

课件设计思路（35页）：
${designDescription}

${
  customOptions
    ? `
自定义选项：
- 生成素材：${customOptions.generateMaterials ? "是" : "否"}
- 生成活动：${customOptions.generateActivities ? "是" : "否"}
- 详细程度：${customOptions.detailLevel}
`
    : ""
}

请返回JSON格式：
{
  "username": "${username}",
  "lessonTitle": "${design.courseTitle}",
  "updateTime": "${new Date().toISOString()}",
  "template": "${templateId}",
  "slides": [
    {
      "id": "slide-1",
      "title": "页面标题",
      "content": "<h1>根据设计思路生成的HTML内容</h1><p>详细内容...</p>",
      "materials": [],
      "transition": "fade",
      "type": "title"
    },
    ... (共35个slide，与设计思路一一对应)
  ]
}

注意：
1. 严格按照设计思路的顺序和内容生成
2. content必须是HTML格式，内容要丰富详细
3. 每页的title、content要根据设计思路的title1、title2、content生成
4. type要根据设计思路的type映射（标题页→title，导入页→introduction，讲解页→lecture，活动页→activity，总结页→summary）
5. materials暂时为空数组[]
6. 确保总共有35页，与设计思路完全对应`;

    // 调用AI生成
    const aiResponse = await callClaudeAPI(
      [{ role: "user", content: userPrompt }],
      systemPrompt,
    );

    // 解析AI响应
    let slideData: GeneratedSlideData;
    try {
      // 清理可能的markdown标记
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/, "")
          .replace(/```\s*$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\s*/, "")
          .replace(/```\s*$/, "");
      }

      slideData = JSON.parse(cleanedResponse);

      // 验证数据
      if (!slideData.slides || !Array.isArray(slideData.slides)) {
        throw new Error("AI响应格式错误：缺少slides数组");
      }

      if (slideData.slides.length !== 35) {
        throw new Error(
          `AI生成的课件页数不符合要求，期望35页，实际${slideData.slides.length}页`,
        );
      }

      // 更新时间戳
      slideData.updateTime = new Date().toISOString();

      return slideData;
    } catch (error) {
      console.error("解析AI响应失败:", error);
      console.error("原始响应:", aiResponse);
      throw new Error(
        `解析AI响应失败: ${error instanceof Error ? error.message : "未知错误"}`,
      );
    }
  }
}

// 导出单例
export const slideService = new SlideService();
