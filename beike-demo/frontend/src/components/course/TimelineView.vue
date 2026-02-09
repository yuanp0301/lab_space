<template>
  <div class="timeline-view">
    <el-timeline>
      <el-timeline-item
        v-for="(section, index) in sections"
        :key="section.id"
        :timestamp="`${section.duration}分钟`"
        placement="top"
        :type="index === 0 ? 'primary' : 'info'"
        :size="index === 0 ? 'large' : 'normal'"
      >
        <el-card>
          <template #header>
            <div class="timeline-header">
              <h3>{{ section.title }}</h3>
              <div class="actions">
                <el-button-group size="small">
                  <el-button @click="handleEdit(section)">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button @click="handleAIOptimize(section)">
                    <el-icon><MagicStick /></el-icon>
                  </el-button>
                  <el-button @click="handleRecommendMaterials(section)">
                    <el-icon><Picture /></el-icon>
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </template>

          <div class="timeline-content">
            <div class="content-section">
              <h4>
                <el-icon><QuestionFilled /></el-icon>
                主问题
              </h4>
              <p>{{ section.mainQuestion }}</p>
            </div>

            <div class="content-section" v-if="section.subQuestions.length > 0">
              <h4>
                <el-icon><List /></el-icon>
                子问题链
              </h4>
              <ol>
                <li v-for="(q, i) in section.subQuestions" :key="i">{{ q }}</li>
              </ol>
            </div>

            <div class="content-section">
              <h4>
                <el-icon><Memo /></el-icon>
                教学活动
              </h4>
              <p>{{ section.activities }}</p>
            </div>

            <div class="content-section">
              <h4>
                <el-icon><Collection /></el-icon>
                知识点
              </h4>
              <div class="tags">
                <el-tag
                  v-for="point in section.knowledgePoints"
                  :key="point"
                  type="success"
                  effect="plain"
                >
                  {{ point }}
                </el-tag>
              </div>
            </div>

            <div class="content-section">
              <h4>
                <el-icon><Flag /></el-icon>
                预期成果
              </h4>
              <p>{{ section.expectedOutcome }}</p>
            </div>

            <div class="content-section">
              <h4>
                <el-icon><CircleCheck /></el-icon>
                验证方式
              </h4>
              <p>{{ section.verification }}</p>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
import {
  Edit,
  MagicStick,
  Picture,
  QuestionFilled,
  List,
  Memo,
  Collection,
  Flag,
  CircleCheck,
} from "@element-plus/icons-vue";
import type { Section } from "@/stores/course";

defineProps<{
  sections: Section[];
}>();

const emit = defineEmits<{
  edit: [section: Section];
  aiOptimize: [section: Section];
  recommendMaterials: [section: Section];
}>();

const handleEdit = (section: Section) => {
  emit("edit", section);
};

const handleAIOptimize = (section: Section) => {
  emit("aiOptimize", section);
};

const handleRecommendMaterials = (section: Section) => {
  emit("recommendMaterials", section);
};
</script>

<style scoped lang="scss">
.timeline-view {
  padding: 24px;

  :deep(.el-timeline) {
    padding-left: 0;
  }

  .el-card {
    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        color: #1a2332;
        font-size: 18px;
      }

      .actions {
        display: flex;
        gap: 8px;
      }
    }

    .timeline-content {
      .content-section {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 8px 0;
          color: #4a90e2;
          font-size: 14px;
          font-weight: bold;

          .el-icon {
            font-size: 16px;
          }
        }

        p {
          margin: 0;
          color: #333;
          line-height: 1.6;
          padding-left: 24px;
        }

        ol {
          margin: 0;
          padding-left: 44px;
          color: #333;

          li {
            line-height: 1.8;
          }
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-left: 24px;
        }
      }
    }
  }

  :deep(.el-timeline-item__timestamp) {
    color: #4a90e2;
    font-weight: bold;
  }
}
</style>
