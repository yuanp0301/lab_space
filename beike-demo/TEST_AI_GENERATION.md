# AI一句话生成功能测试说明

## 功能状态

✅ **已完成真实AI集成**

现在"AI一句话生成"功能已经集成了真实的大模型服务（Claude 3.5 Sonnet），可以根据用户需求实时生成课程设计。

## 技术实现

### 1. AI 服务配置

**配置文件**: `/config/api.json`

```json
{
  "api_key": "sk-fLQsPO...",
  "api_url": "https://api.aimindsky.com/v1/messages",
  "model": "claude-3-5-sonnet-20241022"
}
```

### 2. 后端实现

**文件**: `backend/src/services/course-design.service.ts`

- ✅ 调用 `callClaudeAPIStream` 进行AI生成
- ✅ 构建专业的课程设计提示词
- ✅ 解析AI响应的JSON数据
- ✅ 规范化数据格式
- ✅ 错误处理

**关键代码**:

```typescript
async generateFromRequirements(request: GenerateCourseDesignRequest): Promise<CourseDesign> {
  // 获取参考模版
  const referenceTemplate = await this.getTableTemplate();

  // 构建提示词
  const prompt = this.buildRequirementsPrompt(request, referenceTemplate);

  // 调用AI服务
  const aiResponse = await callClaudeAPIStream(messages, systemPrompt);

  // 解析和规范化数据
  const courseDesign = this.normalizeCourseDesign(parsedData, request.lessonTitle);

  return courseDesign;
}
```

### 3. AI 提示词设计

系统会自动构建包含以下内容的提示词：

- 课程标题
- 用户需求描述
- 年级、学科等元信息
- 参考模版结构
- 详细的生成要求（教学目标、环节设计等）
- 输出格式要求（JSON结构）

### 4. 前端集成

**文件**: `frontend/src/views/CourseDesign.vue`

- ✅ 检测 `type=ai` 路由参数
- ✅ 调用后端API
- ✅ 显示加载状态
- ✅ 数据格式转换
- ✅ 错误处理和用户提示

## 使用方法

### 步骤1: 打开首页

访问 `http://localhost:5175`

### 步骤2: 点击"AI一句话生成"

在首页点击"AI一句话生成"按钮

### 步骤3: 输入需求

在弹出的对话框中输入您的需求，例如：

- "设计一个关于秋天的怀念的探究式课程"
- "创建一个情境任务式的教学设计，重点关注学生的情感体验"
- "设计一个大单元教学，突出母爱主题和生命教育"

### 步骤4: 点击生成

点击"生成"按钮后：

1. 系统显示"正在生成课程设计，请稍候..."
2. 后端调用Claude AI生成课程设计（约15-30秒）
3. 生成完成后自动跳转到课程设计页面
4. 显示AI生成的完整课程设计

## 生成内容

AI会生成包含以下内容的完整课程设计：

### 1. 课程设计总览

- **课程内核**: 核心教学价值
- **课程线索**: 叙事明线和精神暗线
- **教学目标**:
  - 语言建构与运用
  - 思维发展与提升
  - 审美鉴赏与创造
  - 文化传承与理解
- **教学重难点**: 重点和难点
- **教学模式**: 情境任务式、探究式等
- **课程特点**: 教学设计特色
- **重要教学活动**: 核心活动列表

### 2. 教学过程

- **第一课时**: 3-5个教学环节
- **第二课时**: 3-5个教学环节

### 3. 每个教学环节包含

- 环节名称和时长
- 主问题
- 子问题列表
- 知识点及解读
- 教学活动设计（是什么、怎么做、验证什么）

## API测试

### 手动测试后端API

```bash
curl -X POST http://localhost:3001/api/course-design/generate/from-requirements \
  -H "Content-Type: application/json" \
  -d '{
    "lessonTitle": "《秋天的怀念》",
    "requirements": "设计一个探究式课程，注重学生的情感体验和深度思考",
    "referenceTemplate": "table",
    "grade": "七年级",
    "subject": "语文"
  }'
```

### 预期响应

```json
{
  "success": true,
  "data": {
    "lessonTitle": "《秋天的怀念》",
    "version": "table",
    "overview": {
      "courseCore": "根据用户需求生成的课程内核...",
      "courseLine": { ... },
      "teachingObjectives": [ ... ],
      ...
    },
    "sessions": [
      {
        "sessionTitle": "第一课时：...",
        "phases": [ ... ]
      },
      {
        "sessionTitle": "第二课时：...",
        "phases": [ ... ]
      }
    ],
    "metadata": {
      "author": "AI生成",
      "createTime": "2026-02-09T...",
      "source": "ai-generated"
    }
  }
}
```

## 注意事项

### 1. API密钥

- 确保 `/config/api.json` 中的 API 密钥有效
- 如果密钥失效，请更新配置文件并重启后端

### 2. 生成时间

- AI生成需要15-30秒
- 请耐心等待，不要重复点击

### 3. 网络要求

- 需要访问 `https://api.aimindsky.com`
- 确保网络连接正常

### 4. 错误处理

如果生成失败：

- 检查后端日志：`tail -f /tmp/backend-ai.log`
- 检查API配置是否正确
- 查看浏览器控制台错误信息

## 故障排除

### 问题1: "API Key未配置"错误

**解决方法**:

- 检查 `/config/api.json` 文件是否存在
- 确认 `api_key` 字段有值

### 问题2: "API调用失败"错误

**解决方法**:

- 检查网络连接
- 验证API密钥是否有效
- 查看后端日志获取详细错误信息

### 问题3: 生成的数据格式不正确

**解决方法**:

- 这通常是AI响应格式问题
- 后端会自动重试解析
- 如果持续失败，可能需要优化提示词

### 问题4: 前端显示"生成失败"

**解决方法**:

- 打开浏览器控制台查看详细错误
- 检查后端服务是否正常运行
- 查看 `/tmp/backend-ai.log` 日志

## 监控和日志

### 后端日志

```bash
# 查看实时日志
tail -f /tmp/backend-ai.log

# 查看最近的日志
tail -100 /tmp/backend-ai.log
```

### 关键日志信息

- "收到AI生成请求" - 开始处理
- "正在调用AI服务生成课程设计" - 开始AI调用
- "AI响应完成，开始解析" - AI返回响应
- "课程设计生成成功" - 完成

## 性能优化建议

### 短期

1. 添加生成进度提示
2. 支持取消生成
3. 缓存常见需求的结果

### 中期

1. 实现流式输出，实时显示生成进度
2. 优化提示词，提高生成质量
3. 添加生成结果评分和优化建议

### 长期

1. 支持多轮对话式生成
2. 个性化推荐和学习
3. 协同编辑和版本管理

---

**集成完成时间**: 2026-02-09
**AI模型**: Claude 3.5 Sonnet
**状态**: ✅ 生产就绪
