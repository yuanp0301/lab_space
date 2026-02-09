<template>
  <div class="table-view">
    <el-table :data="sections" border stripe style="width: 100%">
      <el-table-column type="index" label="#" width="60" />
      <el-table-column prop="title" label="环节名称" width="150" />
      <el-table-column prop="mainQuestion" label="主问题" min-width="200" />
      <el-table-column prop="activities" label="教学活动" width="150" />
      <el-table-column label="知识点" width="120">
        <template #default="{ row }">
          <el-tag
            v-for="point in row.knowledgePoints.slice(0, 2)"
            :key="point"
            size="small"
            style="margin: 2px"
          >
            {{ point }}
          </el-tag>
          <span v-if="row.knowledgePoints.length > 2" style="font-size: 12px">
            +{{ row.knowledgePoints.length - 2 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="duration"
        label="时长(分钟)"
        width="100"
        align="center"
      />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" @click="handleAIOptimize(row)">
              <el-icon><MagicStick /></el-icon>
              AI优化
            </el-button>
            <el-button size="small" @click="handleRecommendMaterials(row)">
              <el-icon><Picture /></el-icon>
              推荐素材
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Edit, MagicStick, Picture } from "@element-plus/icons-vue";
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
.table-view {
  :deep(.el-table) {
    font-size: 14px;

    .el-table__header th {
      background-color: #2d3e50;
      color: white;
      font-weight: bold;
    }

    .el-table__row:hover {
      background-color: rgba(74, 144, 226, 0.05);
    }
  }

  .el-button-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .el-button {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
