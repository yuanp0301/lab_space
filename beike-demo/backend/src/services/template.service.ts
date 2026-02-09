import { Template } from "../models/template.model";

/**
 * 预定义的课件模板列表
 */
const TEMPLATES: Template[] = [
  {
    id: "template-blue-cold",
    name: "蓝色清新",
    color: "#4A90E2",
    description: "适合理性分析类课程，清新简约的设计风格",
  },
  {
    id: "template-green-nature",
    name: "绿色自然",
    color: "#52C41A",
    description: "适合环保、自然科学类课程，清新自然的配色",
  },
  {
    id: "template-orange-warm",
    name: "橙色温暖",
    color: "#FA8C16",
    description: "适合人文、艺术类课程，温暖活泼的氛围",
  },
  {
    id: "template-purple-elegant",
    name: "紫色优雅",
    color: "#722ED1",
    description: "适合高端、专业类课程，优雅大气的风格",
  },
  {
    id: "template-red-passionate",
    name: "红色热情",
    color: "#F5222D",
    description: "适合激励、演讲类课程，充满活力和激情",
  },
  {
    id: "template-gray-professional",
    name: "灰色专业",
    color: "#8C8C8C",
    description: "适合商务、技术类课程，专业稳重的设计",
  },
];

/**
 * 模板服务类
 */
export class TemplateService {
  /**
   * 获取所有模板列表
   */
  getAllTemplates(): Template[] {
    return TEMPLATES;
  }

  /**
   * 根据ID获取单个模板
   */
  getTemplateById(id: string): Template | undefined {
    return TEMPLATES.find((template) => template.id === id);
  }

  /**
   * 验证模板ID是否有效
   */
  isValidTemplateId(id: string): boolean {
    return TEMPLATES.some((template) => template.id === id);
  }
}

// 导出单例实例
export const templateService = new TemplateService();
