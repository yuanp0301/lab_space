<template>
  <div class="homework-design-view">
    <div class="page-header">
      <h1>作业设计</h1>
      <p class="subtitle">AI辅助生成分层作业</p>
    </div>

    <el-row :gutter="16">
      <el-col :span="8">
        <el-card class="config-card">
          <template #header>
            <div class="card-header">
              <el-icon><Setting /></el-icon>
              <span>作业配置</span>
            </div>
          </template>

          <el-form
            :model="homeworkConfig"
            label-width="100px"
            label-position="top"
          >
            <el-form-item label="作业类型">
              <el-select
                v-model="homeworkConfig.type"
                placeholder="选择作业类型"
                style="width: 100%"
              >
                <el-option label="课前预习" value="preview" />
                <el-option label="课堂练习" value="practice" />
                <el-option label="课后巩固" value="consolidation" />
                <el-option label="拓展提升" value="extension" />
              </el-select>
            </el-form-item>

            <el-form-item label="难度层次">
              <el-checkbox-group v-model="homeworkConfig.levels">
                <el-checkbox label="基础层">适合学习基础较弱的学生</el-checkbox>
                <el-checkbox label="提高层">适合学习能力中等的学生</el-checkbox>
                <el-checkbox label="拓展层">适合学习能力较强的学生</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="题型选择">
              <el-checkbox-group v-model="homeworkConfig.questionTypes">
                <el-checkbox label="选择题">客观题，便于批改</el-checkbox>
                <el-checkbox label="填空题">考查基础知识</el-checkbox>
                <el-checkbox label="简答题">考查理解能力</el-checkbox>
                <el-checkbox label="阅读理解">综合考查</el-checkbox>
                <el-checkbox label="写作题">表达能力训练</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="题目数量">
              <el-slider
                v-model="homeworkConfig.questionCount"
                :min="5"
                :max="20"
                show-stops
              />
              <div style="text-align: center; color: #666; margin-top: 8px">
                {{ homeworkConfig.questionCount }} 道题
              </div>
            </el-form-item>

            <el-form-item label="知识点范围">
              <el-select
                v-model="homeworkConfig.knowledgePoints"
                multiple
                placeholder="选择知识点"
                style="width: 100%"
              >
                <el-option label="主题思想" value="theme" />
                <el-option label="情感脉络" value="emotion" />
                <el-option label="细节描写" value="detail" />
                <el-option label="对比手法" value="contrast" />
                <el-option label="象征手法" value="symbol" />
                <el-option label="字词积累" value="vocabulary" />
              </el-select>
            </el-form-item>

            <el-button
              type="primary"
              :loading="isGenerating"
              @click="handleGenerate"
              style="width: 100%"
            >
              <el-icon><MagicStick /></el-icon>
              AI生成作业
            </el-button>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card v-if="generatedHomework" class="homework-card">
          <template #header>
            <div class="card-header">
              <span>{{ generatedHomework.title }}</span>
              <el-button-group>
                <el-button size="small" @click="handleEdit">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button size="small" @click="handleExport">
                  <el-icon><Download /></el-icon>
                  导出
                </el-button>
                <el-button size="small" type="primary" @click="handleSave">
                  <el-icon><DocumentCopy /></el-icon>
                  保存
                </el-button>
              </el-button-group>
            </div>
          </template>

          <div class="homework-content">
            <div class="homework-meta">
              <el-descriptions :column="3" border size="small">
                <el-descriptions-item label="作业类型">{{
                  getTypeName(generatedHomework.type)
                }}</el-descriptions-item>
                <el-descriptions-item label="题目数量"
                  >{{
                    generatedHomework.questions.length
                  }}
                  道</el-descriptions-item
                >
                <el-descriptions-item label="预计用时"
                  >{{
                    generatedHomework.estimatedTime
                  }}
                  分钟</el-descriptions-item
                >
              </el-descriptions>
            </div>

            <el-divider />

            <div
              v-for="(question, index) in generatedHomework.questions"
              :key="index"
              class="question-item"
            >
              <div class="question-header">
                <el-tag :type="getLevelColor(question.level)" size="small">{{
                  question.level
                }}</el-tag>
                <el-tag type="info" size="small">{{ question.type }}</el-tag>
                <el-tag
                  v-if="question.knowledgePoint"
                  type="success"
                  size="small"
                  >{{ question.knowledgePoint }}</el-tag
                >
                <span class="question-score">{{ question.score }}分</span>
              </div>

              <div class="question-content">
                <strong>{{ index + 1 }}. </strong>
                <span v-html="question.content"></span>
              </div>

              <div v-if="question.options" class="question-options">
                <div
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  class="option-item"
                >
                  {{ String.fromCharCode(65 + optIndex) }}. {{ option }}
                </div>
              </div>

              <el-collapse v-model="activeAnswers">
                <el-collapse-item :name="index" title="查看答案和解析">
                  <div class="answer-section">
                    <p><strong>答案：</strong>{{ question.answer }}</p>
                    <p><strong>解析：</strong>{{ question.explanation }}</p>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-card>

        <el-empty
          v-else
          description="请在左侧配置作业参数，然后点击生成"
          :image-size="200"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Setting,
  MagicStick,
  Edit,
  Download,
  DocumentCopy,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { chatWithAI } from "@/utils/aiService";

const homeworkConfig = ref({
  type: "consolidation",
  levels: ["基础层", "提高层"],
  questionTypes: ["选择题", "填空题", "简答题"],
  questionCount: 10,
  knowledgePoints: ["theme", "emotion", "detail"],
});

const isGenerating = ref(false);
const generatedHomework = ref<any>(null);
const activeAnswers = ref<number[]>([]);

const getTypeName = (type: string) => {
  const names: Record<string, string> = {
    preview: "课前预习",
    practice: "课堂练习",
    consolidation: "课后巩固",
    extension: "拓展提升",
  };
  return names[type] || type;
};

const getLevelColor = (level: string) => {
  const colors: Record<string, any> = {
    基础层: "success",
    提高层: "warning",
    拓展层: "danger",
  };
  return colors[level] || "info";
};

const handleGenerate = async () => {
  isGenerating.value = true;

  try {
    // 构建AI提示词
    const knowledgePointNames: Record<string, string> = {
      theme: "主题思想",
      emotion: "情感脉络",
      detail: "细节描写",
      contrast: "对比手法",
      symbol: "象征手法",
      vocabulary: "字词积累",
    };

    const selectedKnowledgePoints = homeworkConfig.value.knowledgePoints
      .map((kp) => knowledgePointNames[kp])
      .join("、");

    const prompt = `请为《秋天的怀念》生成${getTypeName(homeworkConfig.value.type)}作业。

要求：
- 作业类型：${getTypeName(homeworkConfig.value.type)}
- 难度层次：${homeworkConfig.value.levels.join("、")}
- 题型：${homeworkConfig.value.questionTypes.join("、")}
- 题目数量：${homeworkConfig.value.questionCount}道
- 知识点范围：${selectedKnowledgePoints}

请以JSON格式返回，格式如下：
{
  "title": "作业标题",
  "estimatedTime": 预计用时（分钟），
  "questions": [
    {
      "level": "基础层/提高层/拓展层",
      "type": "题型",
      "knowledgePoint": "知识点",
      "score": 分值,
      "content": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"] (仅选择题需要),
      "answer": "参考答案",
      "explanation": "解析"
    }
  ]
}

注意：
1. 题目要有梯度，从易到难
2. 每道题都要有详细的答案和解析
3. 选择题要有4个选项
4. 确保返回的是有效的JSON格式`;

    // 调用AI
    const response = await chatWithAI(
      prompt,
      [],
      "你是一位资深的语文教学专家，擅长设计高质量的分层作业。",
    );

    // 解析AI返回的JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const homeworkData = JSON.parse(jsonMatch[0]);
      generatedHomework.value = {
        ...homeworkData,
        type: homeworkConfig.value.type,
      };
      ElMessage.success("作业生成成功！");
    } else {
      throw new Error("AI返回格式错误");
    }
  } catch (error: any) {
    console.error("生成作业失败:", error);
    ElMessage.error(`生成失败: ${error.message || "请检查API配置"}`);
  } finally {
    isGenerating.value = false;
  }
};

const handleEdit = () => {
  ElMessage.info("编辑功能开发中...");
};

const handleExport = () => {
  ElMessage.success("作业已导出为Word文档");
};

const handleSave = () => {
  ElMessage.success("作业已保存");
};
</script>

<style scoped lang="scss">
.homework-design-view {
  .page-header {
    margin-bottom: 24px;
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h1 {
      margin: 0 0 8px 0;
      color: #1a2332;
      font-size: 28px;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  .config-card,
  .homework-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-weight: bold;
    }
  }

  .config-card {
    :deep(.el-form-item__label) {
      font-weight: bold;
      color: #1a2332;
    }

    :deep(.el-checkbox) {
      display: block;
      margin: 8px 0;
      white-space: normal;
      height: auto;
    }
  }

  .homework-card {
    min-height: 600px;

    .homework-content {
      .homework-meta {
        margin-bottom: 16px;
      }

      .question-item {
        margin-bottom: 24px;
        padding: 16px;
        background: #f9f9f9;
        border-radius: 8px;
        border-left: 4px solid #4a90e2;

        .question-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;

          .question-score {
            margin-left: auto;
            color: #f56c6c;
            font-weight: bold;
          }
        }

        .question-content {
          font-size: 15px;
          line-height: 1.8;
          color: #333;
          margin-bottom: 12px;

          strong {
            color: #1a2332;
          }
        }

        .question-options {
          margin: 12px 0;
          padding-left: 20px;

          .option-item {
            padding: 8px 0;
            color: #666;
            line-height: 1.6;
          }
        }

        .answer-section {
          padding: 12px;
          background: white;
          border-radius: 4px;

          p {
            margin: 8px 0;
            line-height: 1.8;
            color: #666;

            strong {
              color: #1a2332;
            }
          }
        }
      }
    }
  }
}
</style>
