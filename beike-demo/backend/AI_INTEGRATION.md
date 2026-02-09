# AI服务集成说明

## 概述

已成功集成真实的AI服务到课程设计生成功能中，支持流式响应和实时内容展示。

## 已完成的工作

### 1. 后端依赖安装

- ✅ 已添加 `axios` 依赖（用于HTTP请求）
- ✅ 已添加 `multer` 依赖（用于文件上传）
- ✅ 已添加 `@types/multer` 类型定义
- ✅ 运行 `npm install` 完成依赖安装

### 2. AI服务实现 (`backend/src/services/ai.service.ts`)

#### 功能特性

- ✅ 支持流式响应（SSE格式）
- ✅ 支持非流式回退（当API不支持流式时）
- ✅ 自动加载API配置（从 `config/api.json` 或环境变量）
- ✅ 错误处理和重试机制

#### API配置

配置文件位置：`config/api.json`

```json
{
  "api_key": "your-api-key",
  "api_url": "https://api.aimindsky.com/v1/messages",
  "model": "claude-3-5-sonnet-20241022"
}
```

或使用环境变量：

- `AI_API_KEY`: API密钥
- `AI_API_URL`: API地址
- `AI_MODEL`: 模型名称
- `AI_STREAM_ENABLED`: 是否启用流式（true/false）

### 3. 课程设计服务集成 (`backend/src/services/course-design.service.ts`)

#### 主要方法

**`generateFromDocumentStream`**

- 根据文档内容生成课程设计
- 使用AI服务进行智能生成
- 支持流式响应，实时推送生成进度

**`buildCourseDesignPrompt`**

- 构建AI提示词
- 包含文档内容、参考模版和生成要求
- 要求AI返回结构化JSON格式

**`generateWithAI`**

- 调用AI服务进行流式生成
- 实时解析AI返回的JSON
- 规范化数据结构

**`normalizeCourseDesign`**

- 验证和规范化AI生成的数据
- 确保数据结构符合 `CourseDesignDetailed` 接口

### 4. 流式响应处理

#### 前端到后端

1. 前端上传文件到 `/api/course-design/generate/from-document-stream`
2. 后端使用multer接收文件
3. 后端设置SSE响应头
4. 后端调用AI服务进行流式生成
5. 后端实时推送数据块到前端

#### 数据格式

```typescript
{
  type: "chunk" | "complete" | "error",
  content?: string,        // 状态文本
  progress?: number,       // 进度百分比
  data?: Partial<CourseDesign>,  // 课程设计数据
  message?: string        // 错误消息
}
```

## 使用说明

### 1. 配置API密钥

确保 `config/api.json` 文件存在且包含有效的API密钥：

```bash
cp config/api.json.example config/api.json
# 编辑 config/api.json，填入你的API密钥
```

### 2. 启动后端服务

```bash
cd backend
npm install  # 如果还没安装依赖
npm run dev
```

### 3. 测试流式生成

1. 打开前端应用
2. 进入首页
3. 点击"基于文档生成"
4. 上传一个文档文件（支持 .txt, .md, .html, .docx 等）
5. 观察加载动画和实时生成进度
6. 生成完成后自动跳转到课程设计页面

## 技术细节

### AI提示词设计

提示词包含：

1. 文档内容（前5000字符）
2. 参考模版结构（前3000字符）
3. 详细的生成要求
4. JSON格式规范

### 数据解析策略

1. **实时解析**：在流式生成过程中，尝试解析已接收的JSON片段
2. **最终解析**：生成完成后，提取完整的JSON并验证
3. **错误处理**：如果解析失败，返回错误信息并允许重试

### 流式响应格式

支持多种格式：

- SSE格式：`data: {...}\n\n`
- 直接JSON：`{...}`
- Claude API格式：`content_block_delta` 事件

## 故障排查

### 问题1：API调用失败

**症状**：控制台显示"API调用失败"
**解决**：

1. 检查 `config/api.json` 中的API密钥是否正确
2. 检查网络连接
3. 查看后端日志了解详细错误信息

### 问题2：流式响应不工作

**症状**：没有实时更新，等待很久后一次性显示
**解决**：

1. 检查API是否支持流式响应
2. 设置环境变量 `AI_STREAM_ENABLED=true`
3. 查看后端日志确认流式处理是否正常

### 问题3：JSON解析失败

**症状**：生成完成但数据格式错误
**解决**：

1. 查看后端日志中的AI响应内容
2. 检查提示词是否要求返回JSON格式
3. 可能需要调整提示词，明确要求JSON格式

## 后续优化建议

1. **缓存机制**：缓存已生成的课程设计，避免重复生成
2. **重试机制**：API调用失败时自动重试
3. **进度估算**：根据文档长度更准确地估算生成进度
4. **部分更新**：支持在生成过程中部分更新已生成的内容
5. **多模型支持**：支持切换不同的AI模型

## 相关文件

- `backend/src/services/ai.service.ts` - AI服务实现
- `backend/src/services/course-design.service.ts` - 课程设计服务
- `backend/src/routes/course-design.routes.ts` - API路由
- `frontend/src/api/course-design.api.ts` - 前端API客户端
- `frontend/src/views/HomeView.vue` - 首页组件
- `frontend/src/views/CourseDesign.vue` - 课程设计页面
