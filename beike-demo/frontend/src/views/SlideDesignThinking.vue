<template>
  <div class="slide-design-thinking">
    <div class="page-header">
      <h1>{{ courseTitle }}</h1>
      <p class="subtitle">正在为您逐页整理PPT...</p>
    </div>

    <div class="content">
      <div class="slides-grid">
        <div
          v-for="(slide, index) in displaySlides"
          :key="index"
          class="slide-card"
          :class="{ loading: slide.loading }"
        >
          <!-- 已生成的内容卡片 -->
          <template v-if="slide && !slide.loading">
            <div class="card-header">
              <span class="page-number"
                >第{{ slide.page }}页 {{ slide.title1 }}</span
              >
              <el-button
                type="primary"
                size="small"
                class="edit-btn"
                @click="handleEdit(slide)"
              >
                <el-icon><Edit /></el-icon>
                点击可编辑
              </el-button>
            </div>
            <div class="card-content">
              <div class="content-section" v-if="slide.title2">
                <span class="label">副标题:</span>
                <span class="value">{{ slide.title2 }}</span>
              </div>
              <div class="content-section" v-if="slide.grade">
                <span class="label">授课年级:</span>
                <span class="value">{{ slide.grade }}</span>
              </div>
              <div class="content-section" v-if="slide.teacher">
                <span class="label">授课教师:</span>
                <span class="value">{{ slide.teacher }}</span>
              </div>
              <div class="content-section" v-if="slide.visual">
                <span class="label">视觉/交互-画面描述:</span>
                <span class="value">{{ slide.visual }}</span>
              </div>
              <div class="content-section" v-if="slide.style">
                <span class="label">风格:</span>
                <span class="value">{{ slide.style }}</span>
              </div>
              <div class="content-section" v-if="slide.content">
                <span class="label">正文内容:</span>
                <div
                  class="value content-text"
                  v-html="formatContent(slide.content)"
                ></div>
              </div>
            </div>
          </template>

          <!-- 加载中的占位符 -->
          <template v-else-if="!slide || slide.loading">
            <div class="card-header loading-header">
              <el-icon class="loading-icon"><Lightning /></el-icon>
              <span>内容生成中</span>
            </div>
            <div class="loading-content">
              <div class="loading-bar" :style="{ width: '85%' }"></div>
              <div class="loading-bar" :style="{ width: '70%' }"></div>
              <div class="loading-bar" :style="{ width: '90%' }"></div>
            </div>
          </template>
        </div>
      </div>

      <div class="footer-message">
        <span class="message-text"
          >大纲生成后,将生产逐页的ppt内容供您核对\调整哦~</span
        >
        <div class="footer-buttons">
          <el-button @click="handlePrevious">上一步</el-button>
          <el-button type="primary" @click="handleNext">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Edit, Lightning } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { slideApi, type SlideData as ApiSlideData } from "@/api/slide.api";

interface SlideData extends ApiSlideData {
  loading?: boolean;
}

const route = useRoute();
const router = useRouter();

const courseTitle = ref("《秋天的怀念》");
const allSlides = ref<SlideData[]>([]);
const currentPage = ref(1);
const pageSize = 9; // 每页显示9个卡片
const fileName = "6. 《秋天的怀念》课件设计思路.md"; // 文件名

// 从后端API加载课件设计数据
const loadSlideDesign = async () => {
  try {
    const design = await slideApi.getCourseSlideDesign(fileName);

    // 更新标题和数据
    courseTitle.value = design.courseTitle;
    allSlides.value = design.slides as SlideData[];

    console.log(`成功加载 ${design.totalSlides} 页课件设计思路`);
  } catch (error) {
    console.error("加载课件设计思路失败:", error);
    ElMessage.error("加载课件设计思路失败: " + (error as Error).message);
  }
};

// 格式化内容文本
const formatContent = (content: string) => {
  if (!content) return "";
  return content
    .replace(/\n/g, "<br>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
};

// 当前页显示的幻灯片
const displaySlides = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  const slides = allSlides.value.slice(start, end);

  // 确保总是显示9个卡片
  const result: (SlideData | { loading: true; page: string })[] = [];

  for (let i = 0; i < pageSize; i++) {
    if (i < slides.length) {
      const slide = slides[i];
      // 第一个显示详细内容，其他显示加载中
      if (i === 0) {
        result.push(slide); // 第一个显示完整内容
      } else {
        result.push({
          ...slide,
          loading: true, // 其他显示加载中
        });
      }
    } else {
      // 填充空的加载卡片
      result.push({
        loading: true,
        page: `P${start + i + 1}`,
      } as any);
    }
  }

  return result;
});

const handleEdit = (slide: SlideData) => {
  ElMessage.info(`编辑第${slide.page}页: ${slide.title1}`);
  // TODO: 实现编辑功能
};

const handlePrevious = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  } else {
    router.back();
  }
};

const handleNext = () => {
  const totalPages = Math.ceil(allSlides.value.length / pageSize);
  if (currentPage.value < totalPages) {
    currentPage.value++;
  } else {
    ElMessage.success("所有内容已生成完成！");
    // TODO: 跳转到下一步
  }
};

onMounted(async () => {
  const query = route.query;
  if (query.title) {
    courseTitle.value = query.title as string;
  }

  // 使用后端API加载数据
  await loadSlideDesign();

  // 如果数据加载成功，更新标题为第一页的标题
  if (allSlides.value.length > 0 && allSlides.value[0].title1) {
    const firstTitle = allSlides.value[0].title1;
    if (firstTitle.includes("《") && firstTitle.includes("》")) {
      courseTitle.value = firstTitle;
    }
  }
});
</script>

<style scoped lang="scss">
.slide-design-thinking {
  min-height: 100vh;
  background-color: #f5f7fa;

  .page-header {
    padding: 32px 24px;
    background: white;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    text-align: center;

    h1 {
      margin: 0 0 12px 0;
      color: #1a2332;
      font-size: 32px;
      font-weight: 600;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 16px;
    }
  }

  .content {
    padding: 32px 24px;
    max-width: 1400px;
    margin: 0 auto;

    .slides-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 40px;

      .slide-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        min-height: 400px;
        display: flex;
        flex-direction: column;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        &.loading {
          background: linear-gradient(
            135deg,
            #f5f7fa 0%,
            #ffffff 50%,
            #f5f7fa 100%
          );
          background-size: 200% 200%;
          animation: shimmer 2s infinite;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e4e7ed;

          .page-number {
            font-size: 16px;
            font-weight: 600;
            color: #1a2332;
          }

          .edit-btn {
            padding: 6px 16px;
            border-radius: 4px;
            font-size: 14px;
          }

          &.loading-header {
            justify-content: center;
            gap: 8px;
            color: #666;
            font-size: 16px;
            font-weight: 500;

            .loading-icon {
              font-size: 20px;
              color: #409eff;
              animation: pulse 1.5s infinite;
            }
          }
        }

        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;

          .content-section {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .label {
              font-size: 13px;
              color: #909399;
              font-weight: 500;
              margin-bottom: 4px;
            }

            .value {
              font-size: 14px;
              color: #303133;
              line-height: 1.6;
            }

            .content-text {
              max-height: 200px;
              overflow-y: auto;
            }
          }
        }

        .loading-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          padding: 20px 0;

          .loading-bar {
            height: 12px;
            background: linear-gradient(
              90deg,
              #409eff 0%,
              #67c23a 50%,
              #e6a23c 100%
            );
            border-radius: 6px;
            animation: loading 1.5s ease-in-out infinite;
          }
        }
      }
    }

    .footer-message {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      .message-text {
        color: #666;
        font-size: 14px;
      }

      .footer-buttons {
        display: flex;
        gap: 12px;
      }
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes loading {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .slide-design-thinking .content .slides-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .slide-design-thinking .content .slides-grid {
    grid-template-columns: 1fr;
  }

  .slide-design-thinking .content .footer-message {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
