# Beike Demo Backend

备课演示系统后端服务 - 提供课件设计数据处理和API接口

## 功能特性

### 核心功能

1. **Markdown表格解析**
   - 解析课件设计思路文档（Markdown格式）
   - 智能处理多行表格单元格
   - 提取和结构化课件设计数据

2. **数据模型抽象**
   - `SlideData`: 单个幻灯片完整数据结构
   - `CourseSlideDesign`: 课程设计完整数据结构
   - `SlidePageResult`: 分页查询结果

3. **RESTful API**
   - 获取课件设计完整数据
   - 分页查询幻灯片
   - 根据页码获取单个幻灯片详情
   - 缓存管理

### 技术栈

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Dev Tool**: tsx (TypeScript执行器)

## 快速开始

### 安装依赖

```bash
cd backend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3001` 启动

### 构建生产版本

```bash
npm run build
npm start
```

## API接口文档

### 基础URL

```
http://localhost:3001/api/slides
```

### 1. 获取课件设计完整数据

**GET** `/design`

查询参数:

- `fileName` (required): 文件名，例如 `6. 《秋天的怀念》课件设计思路.md`

响应示例:

```json
{
  "success": true,
  "data": {
    "courseTitle": "《秋天的怀念》",
    "totalSlides": 35,
    "slides": [...],
    "metadata": {
      "createTime": "2026-02-09T..."
    }
  }
}
```

### 2. 分页查询幻灯片

**GET** `/page`

查询参数:

- `fileName` (required): 文件名
- `page` (optional): 当前页码，默认 1
- `pageSize` (optional): 每页数量，默认 9
- `type` (optional): 按类型筛选，如 "标题页", "导入页"

响应示例:

```json
{
  "success": true,
  "data": {
    "total": 35,
    "page": 1,
    "pageSize": 9,
    "totalPages": 4,
    "data": [...]
  }
}
```

### 3. 获取单个幻灯片详情

**GET** `/detail`

查询参数:

- `fileName` (required): 文件名
- `page` (required): 页码，如 "P1", "P2"

响应示例:

```json
{
  "success": true,
  "data": {
    "page": "P1",
    "pageNumber": 1,
    "type": "标题页",
    "title1": "《秋天的怀念》",
    "title2": "史铁生",
    "content": "",
    "materialType": "背景图 + 配图",
    "requirements": "...",
    "visual": "...",
    "style": "..."
  }
}
```

### 4. 清除缓存

**POST** `/cache/clear`

请求体:

```json
{
  "fileName": "6. 《秋天的怀念》课件设计思路.md" // 可选
}
```

## 数据模型

### SlideData

```typescript
{
  page: string;           // 页码，如 "P1"
  pageNumber: number;     // 数字页码
  type: string;           // 页面类型
  title1: string;         // 主标题
  title2: string;         // 副标题
  content: string;        // 正文内容
  materialType: string;   // 素材类型
  requirements: string;   // 具体需求描述
  grade?: string;         // 授课年级
  teacher?: string;       // 授课教师
  visual?: string;        // 视觉/交互描述
  style?: string;         // 风格描述
}
```

## 目录结构

```
backend/
├── src/
│   ├── models/          # 数据模型定义
│   │   └── slide.model.ts
│   ├── services/        # 业务逻辑服务
│   │   ├── markdown.parser.ts   # Markdown解析服务
│   │   └── slide.service.ts     # 幻灯片服务
│   ├── routes/          # API路由
│   │   └── slide.routes.ts
│   └── index.ts         # 应用入口
├── dist/                # 编译输出
├── package.json
└── tsconfig.json
```

## 开发指南

### 添加新的解析规则

在 `src/services/markdown.parser.ts` 中修改 `parseSlideRow` 方法

### 添加新的API接口

1. 在 `src/services/slide.service.ts` 添加业务逻辑
2. 在 `src/routes/slide.routes.ts` 添加路由

### 类型检查

```bash
npm run type-check
```

## 注意事项

1. 文件路径基于项目根目录的 `data/busi/` 目录
2. Markdown文件编码必须是 UTF-8
3. 表格格式必须符合规范（见示例文件）
4. 缓存会在服务器重启后清空
