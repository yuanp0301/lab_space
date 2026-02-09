<template>
  <div class="slide-preview">
    <!-- 控制栏 -->
    <div class="preview-controls">
      <div class="control-left">
        <span class="slide-counter">
          {{ currentIndex + 1 }} / {{ slideData.slides.length }}
        </span>
      </div>
      <div class="control-center">
        <el-button-group>
          <el-button
            :icon="ArrowLeft"
            :disabled="currentIndex === 0"
            @click="prevSlide"
          >
            上一页
          </el-button>
          <el-button :icon="Position" @click="showNavigator = true">
            导航
          </el-button>
          <el-button
            :icon="ArrowRight"
            :disabled="currentIndex === slideData.slides.length - 1"
            @click="nextSlide"
          >
            下一页
          </el-button>
        </el-button-group>
      </div>
      <div class="control-right">
        <el-button :icon="FullScreen" @click="toggleFullscreen">
          全屏
        </el-button>
        <el-button :icon="Download" @click="handleExport">导出</el-button>
      </div>
    </div>

    <!-- 主预览区 -->
    <div class="preview-main" :class="transitionClass">
      <div
        v-if="currentSlide"
        class="slide-container"
        :style="slideStyle"
        @click="nextSlide"
      >
        <!-- 页面标题 -->
        <div v-if="currentSlide.title" class="slide-title">
          {{ currentSlide.title }}
        </div>

        <!-- 页面内容 -->
        <div class="slide-content" v-html="currentSlide.content" />

        <!-- 素材展示 -->
        <div v-if="currentSlide.materials.length > 0" class="slide-materials">
          <template
            v-for="(material, idx) in currentSlide.materials"
            :key="idx"
          >
            <!-- 图片 -->
            <img
              v-if="material.type === 'image'"
              :src="material.src"
              :class="['material-item', `position-${material.position}`]"
              alt="素材图片"
            />

            <!-- 视频 -->
            <video
              v-else-if="material.type === 'video'"
              :src="material.src"
              :class="['material-item', `position-${material.position}`]"
              controls
            />

            <!-- 音频 -->
            <audio
              v-else-if="material.type === 'audio'"
              :src="material.src"
              controls
              class="material-audio"
            />
          </template>
        </div>

        <!-- 页码指示器 -->
        <div class="slide-indicator">
          {{ currentIndex + 1 }} / {{ slideData.slides.length }}
        </div>
      </div>
    </div>

    <!-- 导航抽屉 -->
    <el-drawer v-model="showNavigator" title="课件导航" size="400px">
      <div class="navigator-list">
        <div
          v-for="(slide, index) in slideData.slides"
          :key="slide.id"
          class="navigator-item"
          :class="{ active: index === currentIndex }"
          @click="jumpToSlide(index)"
        >
          <div class="item-number">{{ index + 1 }}</div>
          <div class="item-content">
            <div class="item-title">{{ slide.title || "未命名" }}</div>
            <div class="item-preview" v-html="slide.content" />
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import {
  ArrowLeft,
  ArrowRight,
  Position,
  FullScreen,
  Download,
} from "@element-plus/icons-vue";
import type { SlideData } from "@/stores/slides";

type Props = {
  slideData: SlideData;
};

const props = defineProps<Props>();

// 当前页面索引
const currentIndex = ref(0);
const currentSlide = computed(() => props.slideData.slides[currentIndex.value]);

// 显示导航
const showNavigator = ref(false);

// 过渡效果class
const transitionClass = computed(() => {
  const transition = currentSlide.value?.transition || "fade";
  return `transition-${transition}`;
});

// 页面样式
const slideStyle = computed(() => {
  const style: Record<string, string> = {};

  if (currentSlide.value?.bgImage) {
    style.backgroundImage = `url(${currentSlide.value.bgImage})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
  }

  // 根据模板应用不同的背景色
  const template = props.slideData.template;
  const templateColors: Record<string, string> = {
    "template-blue-cold": "#f0f7ff",
    "template-warm-orange": "#fff7ed",
    "template-green-nature": "#f0fdf4",
    "template-purple-elegant": "#faf5ff",
    "template-red-passion": "#fef2f2",
    "template-gray-modern": "#f9fafb",
  };

  if (!currentSlide.value?.bgImage && template) {
    style.backgroundColor = templateColors[template] || "#ffffff";
  }

  return style;
});

// 上一页
const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

// 下一页
const nextSlide = () => {
  if (currentIndex.value < props.slideData.slides.length - 1) {
    currentIndex.value++;
  }
};

// 跳转到指定页
const jumpToSlide = (index: number) => {
  currentIndex.value = index;
  showNavigator.value = false;
};

// 全屏切换
const toggleFullscreen = () => {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch((err) => {
      ElMessage.error(`全屏失败: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};

// 导出课件
const handleExport = () => {
  ElMessage.info("导出功能待实现，可导出为PDF、PPT等格式");
};

// 键盘导航
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case "ArrowLeft":
    case "PageUp":
      prevSlide();
      break;
    case "ArrowRight":
    case "PageDown":
    case " ":
      e.preventDefault();
      nextSlide();
      break;
    case "Home":
      currentIndex.value = 0;
      break;
    case "End":
      currentIndex.value = props.slideData.slides.length - 1;
      break;
  }
};

// 注册键盘事件
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<script lang="ts">
import { onMounted, onUnmounted } from "vue";
</script>

<style scoped lang="scss">
.slide-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #2c3e50;

  .preview-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    background-color: #34495e;
    color: white;

    .slide-counter {
      font-size: 16px;
      font-weight: 600;
    }

    .control-center {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .control-right {
      display: flex;
      gap: 8px;
    }
  }

  .preview-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    overflow: hidden;

    .slide-container {
      position: relative;
      width: 100%;
      max-width: 1200px;
      aspect-ratio: 16 / 9;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      padding: 60px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.02);
      }

      .slide-title {
        font-size: 48px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 32px;
        text-align: center;
      }

      .slide-content {
        font-size: 24px;
        line-height: 1.8;
        color: #34495e;

        :deep(h1) {
          font-size: 56px;
          margin-bottom: 24px;
          text-align: center;
        }

        :deep(h2) {
          font-size: 40px;
          margin-bottom: 20px;
          color: #409eff;
        }

        :deep(h3) {
          font-size: 32px;
          margin-bottom: 16px;
        }

        :deep(p) {
          margin-bottom: 16px;
        }

        :deep(ul),
        :deep(ol) {
          margin-left: 32px;
          margin-bottom: 16px;

          li {
            margin-bottom: 12px;
          }
        }
      }

      .slide-materials {
        margin-top: 32px;

        .material-item {
          max-width: 100%;
          max-height: 400px;
          border-radius: 8px;
          margin: 16px auto;
          display: block;

          &.position-center {
            margin-left: auto;
            margin-right: auto;
          }

          &.position-left {
            margin-right: auto;
          }

          &.position-right {
            margin-left: auto;
          }
        }

        .material-audio {
          width: 100%;
          margin-top: 16px;
        }
      }

      .slide-indicator {
        position: absolute;
        bottom: 24px;
        right: 32px;
        font-size: 18px;
        color: #909399;
        font-weight: 600;
      }
    }

    // 过渡效果
    &.transition-fade {
      transition: opacity 0.5s;
    }

    &.transition-slide {
      transition: transform 0.5s;
    }

    &.transition-zoom {
      transition:
        transform 0.5s,
        opacity 0.5s;
    }
  }

  .navigator-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .navigator-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border: 2px solid #e4e7ed;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
        background-color: #ecf5ff;
      }

      &.active {
        border-color: #409eff;
        background-color: #e6f7ff;
      }

      .item-number {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        background-color: #409eff;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }

      .item-content {
        flex: 1;
        min-width: 0;

        .item-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 8px;
        }

        .item-preview {
          font-size: 14px;
          color: #909399;
          max-height: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;

          :deep(*) {
            font-size: 14px !important;
          }
        }
      }
    }
  }
}
</style>
