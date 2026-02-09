<template>
  <el-card class="material-card" shadow="hover" @click="handleClick">
    <div class="material-preview">
      <div v-if="material.type === 'image'" class="image-preview">
        <img :src="material.thumbnail || material.src" :alt="material.name" />
      </div>
      <div v-else-if="material.type === 'audio'" class="audio-preview">
        <el-icon :size="48"><Headset /></el-icon>
        <span>音频素材</span>
      </div>
      <div v-else-if="material.type === 'video'" class="video-preview">
        <el-icon :size="48"><VideoPlay /></el-icon>
        <span>视频素材</span>
      </div>
      <div v-else class="interactive-preview">
        <el-icon :size="48"><Operation /></el-icon>
        <span>交互素材</span>
      </div>

      <div class="type-badge">
        <el-tag :type="getTypeColor(material.type)" size="small">
          {{ getTypeName(material.type) }}
        </el-tag>
      </div>
    </div>

    <div class="material-info">
      <h4 class="material-name" :title="material.name">{{ material.name }}</h4>
      <p class="material-description">{{ material.description }}</p>

      <div class="material-meta">
        <el-tag size="small" type="info">{{ material.category }}</el-tag>
      </div>

      <div class="material-tags">
        <el-tag
          v-for="tag in material.tags.slice(0, 3)"
          :key="tag"
          size="small"
          effect="plain"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <div class="material-actions">
      <el-button size="small" type="primary" @click.stop="handleUse">
        <el-icon><Check /></el-icon>
        使用
      </el-button>
      <el-button size="small" @click.stop="handlePreview">
        <el-icon><View /></el-icon>
        预览
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import {
  Headset,
  VideoPlay,
  Operation,
  Check,
  View,
} from "@element-plus/icons-vue";
import type { MaterialItem } from "@/stores/materials";

const props = defineProps<{
  material: MaterialItem;
}>();

const emit = defineEmits<{
  use: [material: MaterialItem];
  preview: [material: MaterialItem];
  click: [material: MaterialItem];
}>();

const getTypeName = (type: string) => {
  const names: Record<string, string> = {
    image: "图片",
    audio: "音频",
    video: "视频",
    interactive: "交互",
  };
  return names[type] || type;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, any> = {
    image: "success",
    audio: "warning",
    video: "danger",
    interactive: "primary",
  };
  return colors[type] || "info";
};

const handleClick = () => {
  emit("click", props.material);
};

const handleUse = () => {
  emit("use", props.material);
};

const handlePreview = () => {
  emit("preview", props.material);
};
</script>

<style scoped lang="scss">
.material-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  :deep(.el-card__body) {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .material-preview {
    position: relative;
    width: 100%;
    height: 180px;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .image-preview {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .audio-preview,
    .video-preview,
    .interactive-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #666;

      .el-icon {
        color: #4a90e2;
      }

      span {
        font-size: 14px;
      }
    }

    .type-badge {
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }

  .material-info {
    padding: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .material-name {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: bold;
      color: #1a2332;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .material-description {
      margin: 0 0 8px 0;
      font-size: 12px;
      color: #666;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      flex: 1;
    }

    .material-meta {
      margin-bottom: 8px;
    }

    .material-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
  }

  .material-actions {
    padding: 12px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 8px;

    .el-button {
      flex: 1;
    }
  }
}
</style>
