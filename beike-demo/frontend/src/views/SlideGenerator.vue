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
          <el-button :icon="Document" @click="handleNavigateToDesignThinking">
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

    <!-- 基于文档生成对话框 -->
    <el-dialog
      v-model="showDocumentDialog"
      title="基于文档生成课件"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="document-upload-dialog">
        <el-tabs v-model="documentUploadTab" class="upload-tabs">
          <el-tab-pane label="上传文件" name="upload">
            <div
              class="upload-area"
              @click="triggerFileInput"
              @dragover.prevent="handleDragOver"
              @drop.prevent="handleDrop"
              @dragleave.prevent="isDragOver = false"
              :class="{ 'drag-over': isDragOver, 'has-file': selectedFile }"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".doc,.docx,.md,.markdown,.html,.htm"
                @change="handleFileSelect"
                style="display: none"
              />
              <div class="upload-icon">
                <span v-if="!selectedFile">📤</span>
                <span v-else>✅</span>
              </div>
              <div class="upload-text">
                <div v-if="!selectedFile" class="upload-text-content">
                  <div class="upload-main-text">点击或拖拽上传文档</div>
                  <div class="upload-hint-text">
                    支持 Word、Markdown、HTML 格式
                  </div>
                </div>
                <div v-else class="file-info-content">
                  <div class="file-name">{{ selectedFile.name }}</div>
                  <div class="file-size-hint">文件已选择</div>
                </div>
              </div>
              <button
                v-if="selectedFile"
                class="file-remove"
                @click.stop="removeFile"
              >
                ×
              </button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="输入URL" name="url">
            <div class="url-input-wrapper">
              <el-input
                v-model="documentURL"
                placeholder="请输入文档URL地址，例如：https://www.zxxk.com/..."
                clearable
              />
              <div class="url-hint">支持学科网、教育资源网等平台的文档链接</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <el-button @click="showDocumentDialog = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!isDocumentValid"
          @click="handleSubmitDocument"
        >
          提交
        </el-button>
      </template>
    </el-dialog>

    <!-- 粘贴文本生成对话框 -->
    <el-dialog
      v-model="showTextDialog"
      title="粘贴文本生成课件"
      width="700px"
      :close-on-click-modal="false"
    >
      <div class="text-input-dialog">
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="12"
          placeholder="请在此粘贴或输入文本内容..."
          show-word-limit
          maxlength="10000"
        />
        <div class="text-count">{{ inputText.length }} 字</div>
      </div>
      <template #footer>
        <el-button @click="showTextDialog = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!inputText.trim()"
          @click="handleSubmitText"
        >
          提交
        </el-button>
      </template>
    </el-dialog>

    <!-- AI一句话生成对话框 -->
    <el-dialog
      v-model="showAIDialog"
      title="AI一句话生成课件"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="ai-dialog-content">
        <el-input
          v-model="aiInputText"
          type="textarea"
          :rows="3"
          placeholder="请输入一句话描述，例如：设计一个关于秋天的怀念的课件..."
          @keyup.ctrl.enter="handleSubmitAI"
        />
        <div class="ai-upload-section">
          <div class="upload-label">参考文件（可选）</div>
          <div
            class="ai-upload-area"
            @click="triggerAIFileInput"
            @dragover.prevent="handleAIDragOver"
            @drop.prevent="handleAIDrop"
            @dragleave.prevent="isAIDragOver = false"
            :class="{ 'drag-over': isAIDragOver, 'has-file': aiReferenceFile }"
          >
            <input
              ref="aiFileInput"
              type="file"
              accept=".doc,.docx,.md,.markdown,.html,.htm,.txt,.pdf"
              @change="handleAIFileSelect"
              style="display: none"
            />
            <div class="upload-icon-small">
              <span v-if="!aiReferenceFile">📎</span>
              <span v-else>✅</span>
            </div>
            <div class="upload-text-small">
              <span v-if="!aiReferenceFile">点击或拖拽上传参考文件</span>
              <span v-else>{{ aiReferenceFile.name }}</span>
            </div>
            <button
              v-if="aiReferenceFile"
              class="file-remove-small"
              @click.stop="removeAIFile"
            >
              ×
            </button>
          </div>
        </div>
        <div class="ai-url-section">
          <div class="upload-label">学科网URL（可选）</div>
          <el-input
            v-model="aiReferenceURL"
            placeholder="请输入学科网URL地址，例如：https://www.zxxk.com/..."
            clearable
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="showAIDialog = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!aiInputText.trim()"
          @click="handleSubmitAI"
        >
          提交
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
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
import { slideGenerateApi } from "@/api/slide-generate.api";
import type { Template } from "@/types/slide.types";

// Store
const route = useRoute();
const router = useRouter();
const slidesStore = useSlidesStore();
const courseStore = useCourseStore();
const userStore = useUserStore();
const { slideData, isLoading } = storeToRefs(slidesStore);

// 视图状态
const currentView = ref<"editor" | "preview">("editor");
const showTemplateDialog = ref(false);
const showDocumentDialog = ref(false);

// 文档上传相关状态
const documentUploadTab = ref<"upload" | "url">("upload");
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const documentURL = ref("");

// 文本输入相关状态
const showTextDialog = ref(false);
const inputText = ref("");

// AI生成相关状态
const showAIDialog = ref(false);
const aiInputText = ref("");
const aiReferenceFile = ref<File | null>(null);
const aiFileInput = ref<HTMLInputElement | null>(null);
const isAIDragOver = ref(false);
const aiReferenceURL = ref("");

// 表单数据
const form = ref({
  lessonTitle: "",
  username: "",
});

// 模板数据
const selectedTemplate = ref("");
const templates = ref<Template[]>([]);

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

// 跳转到课件设计思路页面
const handleNavigateToDesignThinking = () => {
  if (!slideData.value) {
    ElMessage.warning("请先生成课件");
    return;
  }
  router.push({
    path: "/slide-design-thinking",
    query: {
      title: slideData.value.lessonTitle,
      from: "slide-generator",
    },
  });
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

    await slidesStore.saveSlides();
    ElMessage.success("保存成功!");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("保存失败，请重试");
    }
  }
};

// 验证文档输入是否有效
const isDocumentValid = computed(() => {
  if (documentUploadTab.value === "upload") {
    return selectedFile.value !== null;
  } else {
    return documentURL.value.trim() !== "";
  }
});

// 验证文件类型
const validateFileType = (file: File): boolean => {
  const validTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/markdown",
    "text/html",
  ];
  const validExtensions = [
    ".doc",
    ".docx",
    ".md",
    ".markdown",
    ".html",
    ".htm",
  ];
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

  return (
    validTypes.includes(file.type) || validExtensions.includes(fileExtension)
  );
};

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 文件选择处理
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (validateFileType(file)) {
      selectedFile.value = file;
    } else {
      ElMessage.warning("不支持的文件类型，请上传 Word、Markdown 或 HTML 文档");
    }
  }
};

// 拖拽悬停
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

// 拖拽放下
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    if (validateFileType(file)) {
      selectedFile.value = file;
    } else {
      ElMessage.warning("不支持的文件类型，请上传 Word、Markdown 或 HTML 文档");
    }
  }
};

// 移除文件
const removeFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// 从文件名获取文件类型
const getFileTypeFromName = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["doc", "docx"].includes(ext || "")) return "word";
  if (["md", "markdown"].includes(ext || "")) return "markdown";
  if (["html", "htm"].includes(ext || "")) return "html";
  return "unknown";
};

// 提交文档
const handleSubmitDocument = () => {
  const query: any = {
    type: "document",
  };

  if (documentUploadTab.value === "upload" && selectedFile.value) {
    query.source = "upload";
    query.fileName = selectedFile.value.name;
    query.fileType =
      selectedFile.value.type || getFileTypeFromName(selectedFile.value.name);
  } else if (documentUploadTab.value === "url" && documentURL.value.trim()) {
    query.source = "url";
    query.url = documentURL.value.trim();
  }

  showDocumentDialog.value = false;

  // 跳转到课件设计思路页面
  router.push({
    path: "/slide-design-thinking",
    query,
  });

  // 清空选择
  selectedFile.value = null;
  documentURL.value = "";
  documentUploadTab.value = "upload";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// 提交文本
const handleSubmitText = () => {
  if (!inputText.value.trim()) return;

  showTextDialog.value = false;

  // 跳转到课件设计思路页面
  router.push({
    path: "/slide-design-thinking",
    query: {
      type: "text",
      content: inputText.value.trim(),
    },
  });

  // 清空输入
  inputText.value = "";
};

// 验证AI文件类型
const validateAIFileType = (file: File): boolean => {
  const validTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/markdown",
    "text/html",
    "text/plain",
    "application/pdf",
  ];
  const validExtensions = [
    ".doc",
    ".docx",
    ".md",
    ".markdown",
    ".html",
    ".htm",
    ".txt",
    ".pdf",
  ];
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

  return (
    validTypes.includes(file.type) || validExtensions.includes(fileExtension)
  );
};

// 触发AI文件选择
const triggerAIFileInput = () => {
  aiFileInput.value?.click();
};

// AI文件选择处理
const handleAIFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (validateAIFileType(file)) {
      aiReferenceFile.value = file;
    } else {
      ElMessage.warning(
        "不支持的文件类型，请上传 Word、Markdown、HTML、TXT 或 PDF 文档",
      );
    }
  }
};

// AI拖拽悬停
const handleAIDragOver = (event: DragEvent) => {
  event.preventDefault();
  isAIDragOver.value = true;
};

// AI拖拽放下
const handleAIDrop = (event: DragEvent) => {
  event.preventDefault();
  isAIDragOver.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    if (validateAIFileType(file)) {
      aiReferenceFile.value = file;
    } else {
      ElMessage.warning(
        "不支持的文件类型，请上传 Word、Markdown、HTML、TXT 或 PDF 文档",
      );
    }
  }
};

// 移除AI文件
const removeAIFile = () => {
  aiReferenceFile.value = null;
  if (aiFileInput.value) {
    aiFileInput.value.value = "";
  }
};

// 清理AI对话框
const clearAIDialog = () => {
  aiInputText.value = "";
  aiReferenceFile.value = null;
  aiReferenceURL.value = "";
  if (aiFileInput.value) {
    aiFileInput.value.value = "";
  }
};

// 提交AI输入
const handleSubmitAI = () => {
  if (!aiInputText.value.trim()) return;

  const prompt = aiInputText.value.trim();
  const referenceURL = aiReferenceURL.value.trim();
  const referenceFile = aiReferenceFile.value;

  showAIDialog.value = false;

  const query: any = {
    type: "ai",
    prompt: prompt,
  };

  // 如果有参考文件，添加文件信息
  if (referenceFile) {
    query.referenceFile = referenceFile.name;
    query.referenceFileType =
      referenceFile.type || getFileTypeFromName(referenceFile.name);
  }

  // 如果有参考URL，添加URL信息
  if (referenceURL) {
    query.referenceURL = referenceURL;
  }

  // 跳转到课件设计思路页面
  router.push({
    path: "/slide-design-thinking",
    query,
  });

  // 清空输入
  clearAIDialog();
};

// 页面加载时尝试加载课件数据
onMounted(async () => {
  // 加载模板列表
  try {
    templates.value = await slideGenerateApi.getTemplates();
  } catch (error) {
    console.error("加载模板列表失败:", error);
    ElMessage.error("加载模板列表失败");
  }

  // slidesStore.loadSlides(); // 注释掉，因为需要username和lessonTitle参数

  // 检测是否从首页跳转过来，根据类型打开对应对话框
  const type = route.query.type as string;
  if (type === "document") {
    showDocumentDialog.value = true;
  } else if (type === "text") {
    showTextDialog.value = true;
  } else if (type === "ai") {
    showAIDialog.value = true;
  }

  // 检测是否从课程设计页面跳转过来
  if (route.query.from === "course-design") {
    // 如果有课程设计数据，自动跳转到课件设计思路页面
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
      // 跳转到课件设计思路页面
      router.push({
        path: "/slide-design-thinking",
        query: {
          title: courseStore.courseData.lessonTitle,
          from: "course-design",
        },
      });
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

  .document-upload-dialog {
    .upload-tabs {
      margin-bottom: 20px;
    }

    .upload-area {
      border: 2px dashed #dcdfe6;
      border-radius: 8px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;

      &:hover {
        border-color: #409eff;
        background-color: #f5f7fa;
      }

      &.drag-over {
        border-color: #409eff;
        background-color: #ecf5ff;
      }

      &.has-file {
        border-color: #67c23a;
        background-color: #f0f9ff;
      }

      .upload-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .upload-text {
        .upload-text-content {
          .upload-main-text {
            font-size: 16px;
            color: #303133;
            margin-bottom: 8px;
          }

          .upload-hint-text {
            font-size: 14px;
            color: #909399;
          }
        }

        .file-info-content {
          .file-name {
            font-size: 16px;
            color: #303133;
            margin-bottom: 8px;
            word-break: break-all;
          }

          .file-size-hint {
            font-size: 14px;
            color: #67c23a;
          }
        }
      }

      .file-remove {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
        border: none;
        background-color: #f56c6c;
        color: white;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: #f78989;
        }
      }
    }

    .url-input-wrapper {
      .url-hint {
        margin-top: 12px;
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .text-input-dialog {
    .text-count {
      margin-top: 12px;
      font-size: 14px;
      color: #909399;
      text-align: right;
    }
  }

  .ai-dialog-content {
    .ai-upload-section {
      margin-top: 20px;

      .upload-label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 8px;
      }

      .ai-upload-area {
        border: 2px dashed #dcdfe6;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;

        &:hover {
          border-color: #409eff;
          background-color: #f5f7fa;
        }

        &.drag-over {
          border-color: #409eff;
          background-color: #ecf5ff;
        }

        &.has-file {
          border-color: #67c23a;
          background-color: #f0f9ff;
        }

        .upload-icon-small {
          font-size: 24px;
        }

        .upload-text-small {
          font-size: 14px;
          color: #606266;
          flex: 1;
          text-align: left;
        }

        .file-remove-small {
          width: 20px;
          height: 20px;
          border: none;
          background-color: #f56c6c;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background-color: #f78989;
          }
        }
      }
    }

    .ai-url-section {
      margin-top: 20px;

      .upload-label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
