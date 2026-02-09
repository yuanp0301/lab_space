<template>
  <div class="card-view">
    <el-row :gutter="24">
      <el-col
        v-for="(section, index) in sections"
        :key="section.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <el-card class="section-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="section-number">{{ index + 1 }}</span>
              <span class="section-title">{{ section.title }}</span>
            </div>
          </template>

          <div class="card-content">
            <div class="info-item">
              <el-icon><QuestionFilled /></el-icon>
              <span class="label">主问题：</span>
              <p class="value">{{ section.mainQuestion }}</p>
            </div>

            <div class="info-item">
              <el-icon><Memo /></el-icon>
              <span class="label">活动形式：</span>
              <p class="value">{{ section.activities }}</p>
            </div>

            <div class="info-item">
              <el-icon><Collection /></el-icon>
              <span class="label">知识点：</span>
              <div class="tags">
                <el-tag
                  v-for="point in section.knowledgePoints"
                  :key="point"
                  size="small"
                  type="info"
                >
                  {{ point }}
                </el-tag>
              </div>
            </div>

            <div class="info-item">
              <el-icon><Timer /></el-icon>
              <span class="label">时长：</span>
              <span class="value">{{ section.duration }}分钟</span>
            </div>
          </div>

          <template #footer>
            <div class="card-actions">
              <el-button size="small" @click="handleEdit(section)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-dropdown trigger="click">
                <el-button size="small">
                  更多
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleAIOptimize(section)">
                      <el-icon><MagicStick /></el-icon>
                      AI优化
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="handleRecommendMaterials(section)"
                    >
                      <el-icon><Picture /></el-icon>
                      推荐素材
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  QuestionFilled,
  Memo,
  Collection,
  Timer,
  Edit,
  MagicStick,
  Picture,
  ArrowDown,
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
.card-view {
  .section-card {
    margin-bottom: 24px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;

      .section-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background-color: #4a90e2;
        color: white;
        border-radius: 50%;
        font-weight: bold;
        font-size: 14px;
      }

      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: #1a2332;
      }
    }

    .card-content {
      .info-item {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .el-icon {
          display: inline-block;
          margin-right: 4px;
          color: #4a90e2;
        }

        .label {
          font-size: 12px;
          color: #666;
          font-weight: bold;
        }

        .value {
          font-size: 14px;
          color: #333;
          margin: 0;
          padding-left: 20px;
          line-height: 1.6;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding-left: 20px;
        }
      }
    }

    .card-actions {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
  }
}
</style>
