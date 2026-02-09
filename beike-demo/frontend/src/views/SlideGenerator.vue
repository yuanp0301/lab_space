<template>
  <div class="slide-generator">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <h2>{{ slideData?.lessonTitle || "课件生成器" }}</h2>
        <span v-if="slideData" class="update-time">
          更新时间: {{ formatTime(slideData.updateTime) }}
        </span>
      </div>
      <div class="toolbar-right">
        <el-button
          v-if="!slideData"
          type="primary"
          :icon="MagicStick"
          @click="showTemplateDialog = true"
        >
          生成课件
        </el-button>
        <template v-else>
          <el-button :icon="View" @click="currentView = 'preview'">
            预览
          </el-button>
          <el-button :icon="Edit" @click="currentView = 'editor'">
            编辑
          </el-button>
          <el-button :icon="Document" @click="showDesignDialog = true">
            课件设计思路
          </el-button>
          <el-button
            type="primary"
            :icon="Download"
            :loading="isLoading"
            @click="handleSave"
          >
            保存
          </el-button>
        </template>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 空状态 -->
      <div v-if="!slideData" class="empty-state">
        <el-empty description="还没有课件内容">
          <el-button type="primary" @click="showTemplateDialog = true">
            开始生成课件
          </el-button>
        </el-empty>
      </div>

      <!-- 编辑视图 -->
      <SlideEditor
        v-else-if="currentView === 'editor'"
        :slide-data="slideData"
        @update="handleUpdateSlide"
      />

      <!-- 预览视图 -->
      <SlidePreview
        v-else-if="currentView === 'preview'"
        :slide-data="slideData"
      />
    </div>

    <!-- 模板选择对话框 -->
    <el-dialog
      v-model="showTemplateDialog"
      title="选择课件模板"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="template-selection">
        <div class="lesson-input">
          <el-form :model="form" label-width="100px">
            <el-form-item label="课程名称">
              <el-input
                v-model="form.lessonTitle"
                placeholder="请输入课程名称，如：秋天的怀念"
              />
            </el-form-item>
            <el-form-item label="教师姓名">
              <el-input v-model="form.username" placeholder="请输入教师姓名" />
            </el-form-item>
          </el-form>
        </div>

        <div class="template-list">
          <h3>选择模板风格</h3>
          <el-row :gutter="20">
            <el-col v-for="template in templates" :key="template.id" :span="8">
              <div
                class="template-card"
                :class="{ active: selectedTemplate === template.id }"
                @click="selectedTemplate = template.id"
              >
                <div
                  class="template-preview"
                  :style="{ backgroundColor: template.color }"
                >
                  <span class="template-name">{{ template.name }}</span>
                </div>
                <div class="template-info">
                  <p>{{ template.description }}</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <template #footer>
        <el-button @click="showTemplateDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="isLoading"
          :disabled="!form.lessonTitle || !selectedTemplate"
          @click="handleGenerate"
        >
          开始生成
        </el-button>
      </template>
    </el-dialog>

    <!-- 课件设计思路对话框 -->
    <el-dialog
      v-model="showDesignDialog"
      title="课件设计思路"
      width="900px"
      :close-on-click-modal="false"
    >
      <SlideDesignEditor
        v-if="slideData"
        :lesson-title="slideData.lessonTitle"
        @generate="handleRegenerateFromDesign"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  MagicStick,
  View,
  Edit,
  Document,
  Download,
} from "@element-plus/icons-vue";
import { useSlidesStore } from "@/stores/slides";
import { useCourseStore } from "@/stores/course";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import SlideEditor from "@/components/slides/SlideEditor.vue";
import SlidePreview from "@/components/slides/SlidePreview.vue";
import SlideDesignEditor from "@/components/slides/SlideDesignEditor.vue";

// Store
const route = useRoute();
const slidesStore = useSlidesStore();
const courseStore = useCourseStore();
const userStore = useUserStore();
const { slideData, isLoading } = storeToRefs(slidesStore);

// 视图状态
const currentView = ref<"editor" | "preview">("editor");
const showTemplateDialog = ref(false);
const showDesignDialog = ref(false);

// 表单数据
const form = ref({
  lessonTitle: "",
  username: "",
});

// 模板数据
const selectedTemplate = ref("");
const templates = [
  {
    id: "template-blue-cold",
    name: "蓝色清新",
    color: "#4A90E2",
    description: "适合理性分析类课程",
  },
  {
    id: "template-warm-orange",
    name: "橙色温暖",
    color: "#F5A623",
    description: "适合人文情感类课程",
  },
  {
    id: "template-green-nature",
    name: "绿色自然",
    color: "#7ED321",
    description: "适合科学探究类课程",
  },
  {
    id: "template-purple-elegant",
    name: "紫色典雅",
    color: "#9013FE",
    description: "适合艺术鉴赏类课程",
  },
  {
    id: "template-red-passion",
    name: "红色热情",
    color: "#D0021B",
    description: "适合活动互动类课程",
  },
  {
    id: "template-gray-modern",
    name: "灰色现代",
    color: "#9B9B9B",
    description: "适合商务专业类课程",
  },
];

// 时间格式化
const formatTime = (time: string) => {
  return new Date(time).toLocaleString("zh-CN");
};

// 生成课件
const handleGenerate = async () => {
  try {
    await slidesStore.generateFromTemplate(
      selectedTemplate.value,
      form.value.lessonTitle,
      form.value.username,
    );
    showTemplateDialog.value = false;
    ElMessage.success("课件生成成功!");
    currentView.value = "editor";
  } catch (error) {
    ElMessage.error("生成失败，请重试");
  }
};

// 根据课件设计思路重新生成
const handleRegenerateFromDesign = async (designData: any) => {
  try {
    await slidesStore.generateFromDesign(designData);
    showDesignDialog.value = false;
    ElMessage.success("根据设计思路重新生成成功!");
  } catch (error) {
    ElMessage.error("生成失败，请重试");
  }
};

// 更新单页课件
const handleUpdateSlide = (slideId: string, updates: any) => {
  slidesStore.updateSlide(slideId, updates);
};

// 保存课件
const handleSave = async () => {
  try {
    await ElMessageBox.confirm("确认保存当前课件？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info",
    });

    await slidesStore.saveSlides(slideData.value?.username || "");
    ElMessage.success("保存成功!");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("保存失败，请重试");
    }
  }
};

// 页面加载时尝试加载课件数据
onMounted(() => {
  slidesStore.loadSlides();
  
  // 检测是否从课程设计页面跳转过来
  if (route.query.from === "course-design") {
    // 如果有课程设计数据，自动打开课件设计思路对话框
    if (courseStore.courseData) {
      // 初始化课件数据（如果还没有），使用课程设计的标题
      if (!slideData.value) {
        slideData.value = {
          username: courseStore.courseData.username || userStore.username || "",
          lessonTitle: courseStore.courseData.lessonTitle,
          updateTime: new Date().toISOString(),
          template: "template-blue-cold",
          slides: [],
        };
      } else {
        // 如果已有数据，更新标题
        slideData.value.lessonTitle = courseStore.courseData.lessonTitle;
      }
      // 延迟打开对话框，确保组件已渲染
      setTimeout(() => {
        showDesignDialog.value = true;
      }, 300);
    }
  }
});
</script>

<style scoped lang="scss">
.slide-generator {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background-color: white;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 16px;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #303133;
      }

      .update-time {
        font-size: 14px;
        color: #909399;
      }
    }

    .toolbar-right {
      display: flex;
      gap: 12px;
    }
  }

  .main-content {
    flex: 1;
    overflow: auto;
    padding: 24px;

    .empty-state {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .template-selection {
    .lesson-input {
      margin-bottom: 24px;
    }

    .template-list {
      h3 {
        margin-bottom: 16px;
        font-size: 16px;
        color: #303133;
      }

      .template-card {
        cursor: pointer;
        border: 2px solid #e4e7ed;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s;
        margin-bottom: 16px;

        &:hover {
          border-color: #409eff;
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
        }

        &.active {
          border-color: #409eff;
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
        }

        .template-preview {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: 600;
        }

        .template-info {
          padding: 12px;
          background-color: white;

          p {
            margin: 0;
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }
  }
}
</style>
