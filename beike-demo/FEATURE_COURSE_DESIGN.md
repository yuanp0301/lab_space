# 课程设计模块功能说明

## 概述

本次更新为 Beike Demo 项目新增了**课程设计模块**,提供课程设计模版数据服务和 AI 生成能力(待实现)。

## 功能列表

### ✅ 功能一：课程设计模版数据服务

提供两种课程设计模版的读取和解析能力：

#### 1.1 表格版课程设计模版

- **数据源**: `data/busi/7. 1《秋天的怀念》情境任务式课程设计（表格版）.md`
- **API 端点**: `GET /api/course-design/template/table`
- **数据结构**: `CourseDesignTable`
  - 课程标题、版本标识
  - 课程设计总览（课程内核、线索、教学目标、重难点等）
  - 教学过程（2个课时，每课时4个教学环节）
  - 每个教学环节包含：环节名称、问题引导、知识点解读、教学活动

**解析状态**: ✅ 完成 (成功解析2个课时，共8个教学环节)

#### 1.2 完整版课程设计模版

- **数据源**: `data/busi/7.2 《秋天的怀念》情境任务式课程设计（完整版）.md`
- **API 端点**: `GET /api/course-design/template/detailed`
- **数据结构**: `CourseDesignDetailed`
  - 课程标题、版本标识
  - 课程设计总览（结构同表格版）
  - 教学过程（详细版格式）
  - 每个教学环节包含：主问题、子问题列表、知识点详解、教学活动详情

**解析状态**: ⚠️ 部分完成 (课时识别正常，环节解析待优化)

### ⏳ 功能二：基于文档的AI课程设计生成 (TODO)

根据用户上传的文档内容，结合AI大模型能力，自动生成完整的课程设计。

- **API 端点**: `POST /api/course-design/generate/from-document`
- **请求参数**:
  ```typescript
  {
    documentContent: string;      // 文档内容
    documentType: string;          // 文档类型 (docx/pdf/txt)
    lessonTitle?: string;          // 课程标题(可选)
    generateOptions?: {
      includeActivities?: boolean; // 是否包含教学活动
      detailLevel?: string;        // 详细程度(simple/normal/detailed)
    }
  }
  ```
- **返回**: `CourseDesign` (与模版数据结构一致)
- **状态**: 🔴 待实现 (需集成AI服务)

### ⏳ 功能三：基于需求的AI课程设计生成 (TODO)

接受用户前端输入的生成要求,参考功能一的模版数据,生成完整的课程设计。

- **API 端点**: `POST /api/course-design/generate/from-requirements`
- **请求参数**:
  ```typescript
  {
    lessonTitle: string;            // 课程标题 (必填)
    grade?: string;                 // 年级
    subject?: string;               // 学科
    textContent?: string;           // 文本内容
    requirements?: string;          // 特殊要求
    referenceTemplate?: 'table' | 'detailed';  // 参考模版类型
  }
  ```
- **返回**: `CourseDesign`
- **状态**: 🔴 待实现 (需集成AI服务)

## 技术架构

### 数据模型

**核心类型**:

- `CourseDesignTable` - 表格版课程设计
- `CourseDesignDetailed` - 完整版课程设计
- `CourseOverview` - 课程总览
- `TeachingPhaseTable` - 教学环节(表格版)
- `TeachingPhaseDetailed` - 教学环节(完整版)

详见: `backend/src/models/course-design.model.ts`

### 核心服务

#### 1. CourseDesignParserService

**文件**: `backend/src/services/course-design.parser.ts`

**职责**: 解析 Markdown 格式的课程设计模版文件

**主要方法**:

- `parseCourseDesignFile(filePath)` - 解析入口，自动识别版本
- `parseTableVersion()` - 解析表格版
- `parseDetailedVersion()` - 解析完整版
- `parseOverview()` - 解析课程总览
- `parseTableSessions()` - 解析表格版教学过程
- `parseDetailedSessions()` - 解析完整版教学过程

**关键实现**:

- 支持带中文编号的章节标题 (如 "一、")
- 智能识别表格版 vs 完整版格式
- 处理多行表格单元格内容
- 清理 HTML 标签和格式标记
- 提取嵌套的教学目标、重难点等结构化信息

#### 2. CourseDesignService

**文件**: `backend/src/services/course-design.service.ts`

**职责**: 业务逻辑层，提供模版缓存和AI生成接口

**主要方法**:

- `getTableTemplate()` - 获取表格版模版 (带缓存)
- `getDetailedTemplate()` - 获取完整版模版 (带缓存)
- `generateFromDocument(request)` - 从文档生成 (TODO)
- `generateFromRequirements(request)` - 从需求生成 (TODO)
- `clearCache(templateType?)` - 清除缓存

### API 路由

**文件**: `backend/src/routes/course-design.routes.ts`

**端点列表**:

| 方法 | 路径                                            | 说明               | 状态 |
| ---- | ----------------------------------------------- | ------------------ | ---- |
| GET  | `/api/course-design/template/table`             | 获取表格版模版     | ✅   |
| GET  | `/api/course-design/template/detailed`          | 获取完整版模版     | ⚠️   |
| POST | `/api/course-design/generate/from-document`     | 从文档生成课程设计 | 🔴   |
| POST | `/api/course-design/generate/from-requirements` | 从需求生成课程设计 | 🔴   |
| POST | `/api/course-design/cache/clear`                | 清除模版缓存       | ✅   |

## 测试验证

### 表格版模版测试

```bash
# 获取表格版模版
curl 'http://localhost:3001/api/course-design/template/table'

# 响应示例
{
  "success": true,
  "data": {
    "lessonTitle": "《秋天的怀念》",
    "version": "table",
    "overview": {
      "courseCore": "聚焦"双重苦难的张力"...",
      "teachingObjectives": [...],
      "teachingFocus": [...]
    },
    "sessions": [
      {
        "sessionTitle": "第一课时：整体感知·初探张力",
        "phases": [
          {
            "phase": "环节一：导入课题，初感基调 (8分钟)",
            "questions": "主问题：看到《秋天的怀念》这个题目...",
            "knowledge": "#文本标题#（表层含义）：...",
            "activities": "活动名称：初感分享与基调确认..."
          }
          // ... 共4个环节
        ]
      },
      {
        "sessionTitle": "第二课时：细读品味·领悟升华",
        "phases": [
          // ... 4个环节
        ]
      }
    ],
    "metadata": {
      "createTime": "2026-02-09T11:08:37.201Z",
      "source": "..."
    }
  }
}
```

**测试结果**:

- ✅ 成功解析2个教学课时
- ✅ 每个课时包含4个完整的教学环节
- ✅ 教学总览信息完整
- ✅ 缓存机制正常工作

### 完整版模版测试

```bash
# 获取完整版模版
curl 'http://localhost:3001/api/course-design/template/detailed'
```

**测试结果**:

- ✅ 成功识别2个教学课时
- ⚠️ 教学环节解析为空 (格式差异较大,需优化解析器)
- ✅ 教学总览信息正常

### 缓存测试

```bash
# 清除所有缓存
curl -X POST 'http://localhost:3001/api/course-design/cache/clear' \
  -H 'Content-Type: application/json'

# 清除特定模版缓存
curl -X POST 'http://localhost:3001/api/course-design/cache/clear' \
  -H 'Content-Type: application/json' \
  -d '{"templateType": "table"}'
```

## 已知问题和待优化项

### 1. 完整版环节解析问题

**问题描述**: 完整版模版的教学环节使用特殊格式标记 `**【环节一：...】**`,当前解析器无法正确识别。

**影响**: `sessions[].phases` 数组为空

**解决方案**:

- 更新 `parseDetailedPhases()` 方法
- 识别 `【环节.*】` 格式的环节标记
- 提取环节内的主问题、子问题、知识点、教学活动

### 2. HTML 标签过滤

**问题描述**: 部分模版文件包含 `<font>` 标签用于着色,解析时需要清理。

**当前状态**: 已实现基本清理,但可能遗漏部分标签

**优化方向**: 增强 `cleanText()` 方法的标签过滤能力

### 3. AI 生成功能未实现

**状态**: API 接口已定义,但核心生成逻辑待实现

**下一步**:

- 选择 AI 服务提供商 (OpenAI / Claude / 本地模型)
- 设计 Prompt 模版
- 实现文档内容提取和预处理
- 集成 AI API 调用
- 实现流式响应 (可选)

## 使用指南

### 启动服务

```bash
cd backend
npm install
npm run dev
```

服务器将运行在 `http://localhost:3001`

### 前端集成示例 (待实现)

```typescript
import axios from "axios";

// 获取表格版模版
const getTableTemplate = async () => {
  const response = await axios.get("/api/course-design/template/table");
  return response.data.data;
};

// 从需求生成课程设计 (待后端实现)
const generateCourse = async (requirements) => {
  const response = await axios.post(
    "/api/course-design/generate/from-requirements",
    {
      lessonTitle: requirements.title,
      grade: requirements.grade,
      subject: requirements.subject,
      referenceTemplate: "table",
    },
  );
  return response.data.data;
};
```

## 文件清单

### 新增文件

```
backend/src/
├── models/
│   └── course-design.model.ts       # 数据模型定义
├── services/
│   ├── course-design.parser.ts      # Markdown 解析服务
│   └── course-design.service.ts     # 业务逻辑服务
└── routes/
    └── course-design.routes.ts      # API 路由定义
```

### 修改文件

```
backend/src/
└── index.ts                          # 添加课程设计路由
```

## 后续计划

### Phase 1: 优化完整版解析 (优先级: 高)

- [ ] 实现完整版教学环节识别
- [ ] 提取主问题、子问题、知识点
- [ ] 解析教学活动详情
- [ ] 完善单元测试

### Phase 2: AI 生成功能 (优先级: 高)

- [ ] 选择并集成 AI 服务
- [ ] 设计课程设计生成 Prompt
- [ ] 实现文档内容预处理
- [ ] 实现生成接口
- [ ] 添加生成结果验证和优化

### Phase 3: 功能增强 (优先级: 中)

- [ ] 支持更多模版格式
- [ ] 添加课程设计编辑功能
- [ ] 实现版本管理
- [ ] 导出为 Word/PDF 格式
- [ ] 前端可视化界面

### Phase 4: 生产就绪 (优先级: 中)

- [ ] 添加完整的单元测试
- [ ] 错误处理优化
- [ ] 性能优化和压力测试
- [ ] API 文档完善
- [ ] 日志和监控

---

**开发者**: Claude Sonnet 4.5
**日期**: 2026-02-09
**版本**: V0.2-dev
