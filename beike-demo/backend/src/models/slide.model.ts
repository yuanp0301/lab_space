/**
 * 幻灯片数据模型
 */

/**
 * 幻灯片完整数据结构
 */
export interface SlideData {
  page: string; // 页码，如 "P1", "P2"
  pageNumber: number; // 数字页码
  type: string; // 页面类型，如 "标题页", "导入页", "讲解页"
  title1: string; // 一级标题（主标题）
  title2: string; // 二级标题（副标题）
  content: string; // 正文内容
  materialType: string; // 素材类型，如 "背景图 + 配图", "图示"
  requirements: string; // 具体需求描述
  // 从requirements中提取的详细信息
  grade?: string; // 授课年级
  teacher?: string; // 授课教师
  visual?: string; // 视觉/交互/画面描述
  style?: string; // 风格描述
}

/**
 * 课件设计思路文档结构
 */
export interface CourseSlideDesign {
  courseTitle: string; // 课程标题，如 "《秋天的怀念》"
  totalSlides: number; // 总页数
  slides: SlideData[]; // 所有幻灯片数据
  metadata?: {
    // 元数据
    author?: string; // 作者
    createTime?: string; // 创建时间
    description?: string; // 描述
  };
}

/**
 * 幻灯片简化数据（用于列表显示）
 */
export interface SlideSimple {
  page: string;
  pageNumber: number;
  type: string;
  title1: string;
  title2: string;
}

/**
 * 分页查询参数
 */
export interface SlideQueryParams {
  page?: number; // 当前页码
  pageSize?: number; // 每页数量
  type?: string; // 按类型筛选
}

/**
 * 分页查询结果
 */
export interface SlidePageResult {
  total: number; // 总数
  page: number; // 当前页
  pageSize: number; // 每页数量
  totalPages: number; // 总页数
  data: SlideData[]; // 数据列表
}
