/**
 * 课件相关类型定义（与后端保持一致）
 */

/**
 * 课件模板接口
 */
export type Template = {
  id: string; // 模板ID，如 "template-blue-cold"
  name: string; // 模板名称，如 "蓝色清新"
  color: string; // 主题色，如 "#4A90E2"
  description: string; // 模板描述
  preview?: string; // 预览图URL（可选）
};

/**
 * 素材类型
 */
export type Material = {
  type: "image" | "audio" | "video"; // 素材类型
  src: string; // 素材URL
  position?: string; // 位置（可选）
};

/**
 * 生成的幻灯片（单页）
 */
export type GeneratedSlide = {
  id: string; // 幻灯片ID
  title: string; // 标题
  content: string; // 内容（HTML格式）
  bgImage?: string; // 背景图（可选）
  materials: Material[]; // 素材列表
  transition?: string; // 过渡动画
  type?: string; // 页面类型，如 "title", "lecture", "activity"
};

/**
 * 生成的课件数据（完整课件）
 */
export type GeneratedSlideData = {
  username: string; // 教师姓名
  lessonTitle: string; // 课程名称
  updateTime: string; // 更新时间（ISO格式）
  template: string; // 使用的模板ID
  slides: GeneratedSlide[]; // 幻灯片列表
};

/**
 * 基于模板生成课件的请求参数
 */
export type GenerateFromTemplateRequest = {
  templateId: string; // 模板ID
  lessonTitle: string; // 课程名称
  username: string; // 教师姓名
  grade?: string; // 年级（可选）
  subject?: string; // 学科（可选）
  requirements?: string; // 特殊要求（可选）
};

/**
 * 基于设计思路生成课件的请求参数
 */
export type GenerateFromDesignRequest = {
  designFileName: string; // 设计思路文件名
  templateId: string; // 模板ID
  username: string; // 教师姓名
  customOptions?: {
    // 自定义选项
    generateMaterials: boolean; // 是否生成素材
    generateActivities: boolean; // 是否生成活动
    detailLevel: "simple" | "normal" | "detailed"; // 详细程度
  };
};

/**
 * 课件列表项
 */
export type SlideListItem = {
  lessonTitle: string; // 课程标题
  updateTime: string; // 更新时间
  template: string; // 模板ID
  slideCount: number; // 幻灯片数量
  filePath: string; // 文件路径
};

/**
 * 设计思路幻灯片数据（从Markdown解析出来的）
 */
export type SlideDesignData = {
  page: string; // 页码，如 "P1", "P2"
  pageNumber: number; // 数字页码
  type: string; // 页面类型，如 "标题页", "导入页", "讲解页"
  title1: string; // 一级标题（主标题）
  title2: string; // 二级标题（副标题）
  content: string; // 正文内容
  materialType: string; // 素材类型，如 "背景图 + 配图", "图示"
  requirements: string; // 具体需求描述
  grade?: string; // 授课年级
  teacher?: string; // 授课教师
  visual?: string; // 视觉/交互/画面描述
  style?: string; // 风格描述
};

/**
 * 课件设计思路文档结构
 */
export type CourseSlideDesign = {
  courseTitle: string; // 课程标题，如 "《秋天的怀念》"
  totalSlides: number; // 总页数
  slides: SlideDesignData[]; // 所有幻灯片设计数据
  metadata?: {
    // 元数据
    author?: string; // 作者
    createTime?: string; // 创建时间
    description?: string; // 描述
  };
};
