/**
 * 课程设计数据模型
 */

/**
 * 教学目标
 */
export interface TeachingObjective {
  category: string; // 目标类别，如 "语言建构与运用"
  description: string; // 目标描述
}

/**
 * 教学重难点
 */
export interface TeachingFocus {
  type: "focus" | "difficulty"; // 重点 or 难点
  content: string;
}

/**
 * 教学环节 - 表格版
 */
export interface TeachingPhaseTable {
  phase: string; // 环节名称
  questions: string; // 问题引导（主问题及子问题）
  knowledge: string; // 知识点及解读
  activities: string; // 教学活动/互动/训练
}

/**
 * 教学环节 - 完整版
 */
export interface TeachingPhaseDetailed {
  phase: string; // 环节名称，如 "【环节一：情境导入，初触秋思 (2分钟)】"
  mainQuestion: string; // 主问题
  subQuestions: string[]; // 子问题
  knowledgePoints: KnowledgePoint[]; // 知识点
  activities: TeachingActivity; // 教学活动
}

/**
 * 知识点
 */
export interface KnowledgePoint {
  tag: string; // 知识点标签，如 "#文本标题#"
  description: string; // 知识点描述
}

/**
 * 教学活动
 */
export interface TeachingActivity {
  name: string; // 活动名称
  what: string; // 是什么
  how: string; // 怎么做
  verify: string; // 验证什么
  organize?: string; // 怎么组织（完整版独有）
}

/**
 * 课程设计总览
 */
export interface CourseOverview {
  courseCore: string; // 课程内核
  courseLine: {
    // 课程线索
    narrativeLine: string; // 叙事明线
    emotionalLine: string; // 精神暗线/情感暗线
  };
  teachingObjectives: TeachingObjective[]; // 教学目标
  teachingFocus: TeachingFocus[]; // 教学重难点
  teachingSessions: string[]; // 教学环节（课时划分）
  teachingMode: string; // 教学模式
  courseFeatures: string[]; // 课程特点
  learningOutcomes: string[]; // 学习收获
  keyActivities: string[]; // 重要教学活动
}

/**
 * 课程设计完整数据 - 表格版
 */
export interface CourseDesignTable {
  lessonTitle: string; // 课程标题
  version: "table"; // 版本标识
  overview: CourseOverview; // 课程设计总览
  sessions: {
    // 教学过程
    sessionTitle: string; // 课时标题
    phases: TeachingPhaseTable[]; // 教学环节
  }[];
  metadata?: {
    // 元数据
    author?: string;
    createTime?: string;
    source?: string; // 来源文件
  };
}

/**
 * 课程设计完整数据 - 完整版
 */
export interface CourseDesignDetailed {
  lessonTitle: string; // 课程标题
  version: "detailed"; // 版本标识
  overview: CourseOverview; // 课程设计总览
  sessions: {
    // 教学过程
    sessionTitle: string; // 课时标题
    phases: TeachingPhaseDetailed[]; // 教学环节（详细）
  }[];
  metadata?: {
    // 元数据
    author?: string;
    createTime?: string;
    source?: string; // 来源文件
  };
}

/**
 * 课程设计统一类型（支持两种版本）
 */
export type CourseDesign = CourseDesignTable | CourseDesignDetailed;

/**
 * AI 生成课程设计请求参数
 */
export interface GenerateCourseDesignRequest {
  lessonTitle: string; // 课程标题
  grade?: string; // 年级
  subject?: string; // 学科
  textContent?: string; // 文本内容（可选）
  requirements?: string; // 特殊要求（可选）
  referenceTemplate?: "table" | "detailed"; // 参考模版类型（可选）
}

/**
 * 文档上传生成请求参数
 */
export interface GenerateFromDocumentRequest {
  documentContent: string; // 文档内容
  documentType: string; // 文档类型，如 'docx', 'pdf', 'txt'
  lessonTitle?: string; // 课程标题（可选，可从文档中提取）
  generateOptions?: {
    // 生成选项
    includeActivities?: boolean; // 是否包含教学活动
    detailLevel?: "simple" | "normal" | "detailed"; // 详细程度
  };
}

/**
 * 前端数据格式 - Section (教学环节)
 */
export interface FrontendSection {
  id: string;
  title: string;
  mainQuestion: string;
  subQuestions: string[];
  activities: string;
  knowledgePoints: string[];
  expectedOutcome: string;
  verification: string;
  duration: number;
}

/**
 * 前端数据格式 - Lesson (课时)
 */
export interface FrontendLesson {
  title: string;
  sections: FrontendSection[];
}

/**
 * 前端数据格式 - CourseData (完整课程设计数据)
 */
export interface FrontendCourseData {
  username: string;
  lessonTitle: string;
  updateTime: string;
  courseDesign: {
    lesson1: FrontendLesson;
    lesson2: FrontendLesson;
  };
}
