<template>
  <div class="home-view">
    <!-- 课程信息列表 -->
    <div class="course-info-section">
      <div class="section-header">
        <div class="title-wrapper">
          <h1 class="course-title">秋天的怀念</h1>
          <span class="course-author">史铁生</span>
        </div>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">作者</span>
          <span class="info-value"
            >史铁生（1951-2010），当代作家，21岁瘫痪后坚持创作</span
          >
        </div>
        <div class="info-item">
          <span class="info-label">主题</span>
          <span class="info-value"
            >回忆母亲的关怀与鼓励，表达怀念与愧疚，以"看菊花"为线索展现母爱</span
          >
        </div>
        <div class="info-item">
          <span class="info-label">重点</span>
          <div class="info-tags">
            <span class="tag">理解母爱</span>
            <span class="tag">情感变化</span>
            <span class="tag">细节描写</span>
            <span class="tag">生命意义</span>
          </div>
        </div>
        <div class="info-item">
          <span class="info-label">价值</span>
          <span class="info-value">感受亲情、学会感恩、培养面对困境的勇气</span>
        </div>
      </div>
    </div>

    <!-- 功能按钮区域 -->
    <div class="functions-section">
      <!-- 课程设计功能 -->
      <div class="function-group">
        <div class="group-header">
          <h2 class="group-title">课程设计</h2>
          <div class="function-buttons">
            <button class="function-btn" @click="showTemplateDialog = true">
              <div class="btn-content">
                <div class="btn-icon-wrapper">
                  <span class="btn-icon">📋</span>
                </div>
                <span class="btn-text">基于模版生成</span>
              </div>
            </button>
            <button
              class="function-btn"
              @click="showDocumentUploadDialog = true"
            >
              <div class="btn-content">
                <div class="btn-icon-wrapper">
                  <span class="btn-icon">📄</span>
                </div>
                <span class="btn-text">基于文档生成</span>
              </div>
            </button>
            <button class="function-btn" @click="showTextInputDialog = true">
              <div class="btn-content">
                <div class="btn-icon-wrapper">
                  <span class="btn-icon">📝</span>
                </div>
                <span class="btn-text">粘贴文本生成</span>
              </div>
            </button>
            <button class="function-btn" @click="showAIDialog = true">
              <div class="btn-content">
                <div class="btn-icon-wrapper">
                  <span class="btn-icon">🤖</span>
                </div>
                <span class="btn-text">AI一句话生成</span>
              </div>
            </button>
          </div>
        </div>
        <!-- 参考成品资源列表 -->
        <div class="reference-resources">
          <div class="resources-header">
            <h3 class="resources-title">模版资源</h3>
            <button
              class="more-resources-btn"
              @click="handleMoreResources('course')"
            >
              更多精品资源 →
            </button>
          </div>
          <ul class="resources-list">
            <li
              v-for="(resource, index) in courseDesignResources"
              :key="index"
              class="resource-item"
              @click="goToCourseDesign"
            >
              <span class="resource-number">{{ index + 1 }}</span>
              <span class="resource-name">{{ resource.name }}</span>
              <span class="resource-desc">{{ resource.desc }}</span>
              <span class="resource-arrow">→</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 课件生成功能 -->
      <div class="function-group">
        <div class="group-header">
          <h2 class="group-title">课件生成</h2>
          <div class="function-buttons">
            <button
              class="function-btn"
              @click="showCourseDesignSelectDialog = true"
            >
              <div class="btn-content">
                <div class="btn-icon-wrapper">
                  <span class="btn-icon">📋</span>
                </div>
                <span class="btn-text">基于课程设计生成</span>
              </div>
            </button>
            <button
              class="function-btn"
              @click="handleSlideGenerator('document')"
            >
              <div class="btn-content">
                <div class="btn-icon-wrapper">
                  <span class="btn-icon">📄</span>
                </div>
                <span class="btn-text">基于文档生成</span>
              </div>
            </button>
            <button class="function-btn" @click="handleSlideGenerator('text')">
              <div class="btn-content">
                <div class="btn-icon-wrapper">
                  <span class="btn-icon">📝</span>
                </div>
                <span class="btn-text">粘贴文本生成</span>
              </div>
            </button>
            <button class="function-btn" @click="handleSlideGenerator('ai')">
              <div class="btn-content">
                <div class="btn-icon-wrapper">
                  <span class="btn-icon">🤖</span>
                </div>
                <span class="btn-text">AI一句话生成</span>
              </div>
            </button>
          </div>
        </div>
        <!-- 参考成品资源列表 -->
        <div class="reference-resources">
          <div class="resources-header">
            <h3 class="resources-title">模版资源</h3>
            <button
              class="more-resources-btn"
              @click="handleMoreResources('slide')"
            >
              更多精品资源 →
            </button>
          </div>
          <ul class="resources-list">
            <li
              v-for="(resource, index) in slideGeneratorResources"
              :key="index"
              class="resource-item"
              @click="goToSlideGenerator"
            >
              <span class="resource-number">{{ index + 1 }}</span>
              <span class="resource-name">{{ resource.name }}</span>
              <span class="resource-desc">{{ resource.desc }}</span>
              <span class="resource-arrow">→</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- AI课堂功能 -->
      <div class="function-group">
        <div class="group-header">
          <h2 class="group-title">AI课堂</h2>
          <div class="function-buttons function-buttons-single">
            <button
              class="function-btn"
              @click="handleAIClassroom('interactive-web')"
            >
              <div class="btn-content">
                <div class="btn-icon-wrapper">
                  <span class="btn-icon">🌐</span>
                </div>
                <span class="btn-text">生成交互网页</span>
              </div>
            </button>
          </div>
        </div>
        <!-- 参考成品资源列表 -->
        <div class="reference-resources">
          <div class="resources-header">
            <h3 class="resources-title">模版资源</h3>
            <button
              class="more-resources-btn"
              @click="handleMoreResources('ai-classroom')"
            >
              更多精品资源 →
            </button>
          </div>
          <ul class="resources-list">
            <li
              v-for="(resource, index) in aiClassroomResources"
              :key="index"
              class="resource-item"
              @click="goToAIClassroom"
            >
              <span class="resource-number">{{ index + 1 }}</span>
              <span class="resource-name">{{ resource.name }}</span>
              <span class="resource-desc">{{ resource.desc }}</span>
              <span class="resource-arrow">→</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 模版选择对话框 -->
    <div
      v-if="showTemplateDialog"
      class="template-dialog-overlay"
      @click="showTemplateDialog = false"
    >
      <div class="template-dialog" @click.stop>
        <div class="dialog-header">
          <h3 class="dialog-title">选择课程设计模版</h3>
          <button class="dialog-close" @click="showTemplateDialog = false">
            ×
          </button>
        </div>
        <div class="template-grid">
          <div
            v-for="template in courseTemplates"
            :key="template.id"
            class="template-card"
            @click="selectTemplate(template.id)"
          >
            <div class="template-icon">{{ template.icon }}</div>
            <div class="template-name">{{ template.name }}</div>
            <div class="template-desc">{{ template.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文档上传对话框 -->
    <div
      v-if="showDocumentUploadDialog"
      class="template-dialog-overlay"
      @click="
        showDocumentUploadDialog = false;
        clearDocumentUploadDialog();
      "
    >
      <div class="template-dialog upload-dialog" @click.stop>
        <div class="dialog-header">
          <h3 class="dialog-title">上传文档</h3>
          <button
            class="dialog-close"
            @click="
              showDocumentUploadDialog = false;
              clearDocumentUploadDialog();
            "
          >
            ×
          </button>
        </div>
        <div class="select-tabs">
          <button
            class="tab-button"
            :class="{ active: documentUploadTab === 'upload' }"
            @click="documentUploadTab = 'upload'"
          >
            上传文件
          </button>
          <button
            class="tab-button"
            :class="{ active: documentUploadTab === 'url' }"
            @click="documentUploadTab = 'url'"
          >
            输入URL
          </button>
        </div>
        <div class="upload-content">
          <!-- 上传文件 -->
          <div v-if="documentUploadTab === 'upload'" class="upload-panel">
            <div
              class="upload-area"
              @click="triggerFileInput"
              @dragover.prevent="handleDragOver"
              @drop.prevent="handleDrop"
              :class="{ 'drag-over': isDragOver }"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".doc,.docx,.md,.markdown,.html,.htm"
                @change="handleFileSelect"
                style="display: none"
              />
              <div class="upload-icon">📄</div>
              <div class="upload-text">
                <p class="upload-title">点击或拖拽文件到此处上传</p>
                <p class="upload-hint">
                  支持 Word 文档 (.doc, .docx)、Markdown (.md, .markdown)、HTML
                  (.html, .htm)
                </p>
              </div>
            </div>
            <div v-if="selectedFile" class="file-info">
              <div class="file-item">
                <span class="file-icon">📎</span>
                <span class="file-name">{{ selectedFile.name }}</span>
                <span class="file-size"
                  >({{ formatFileSize(selectedFile.size) }})</span
                >
                <button class="file-remove" @click="removeFile">×</button>
              </div>
            </div>
          </div>

          <!-- 输入URL -->
          <div v-if="documentUploadTab === 'url'" class="url-panel">
            <input
              v-model="documentURL"
              class="url-input"
              type="text"
              placeholder="请输入学科网URL地址，例如：https://www.zxxk.com/..."
            />
          </div>
        </div>
        <div class="dialog-actions">
          <button
            class="action-btn cancel-btn"
            @click="
              showDocumentUploadDialog = false;
              clearDocumentUploadDialog();
            "
          >
            取消
          </button>
          <button
            class="action-btn confirm-btn"
            @click="handleUploadDocument"
            :disabled="
              documentUploadTab === 'upload'
                ? !selectedFile
                : !documentURL.trim()
            "
          >
            上传并生成
          </button>
        </div>
      </div>
    </div>

    <!-- 文本输入对话框 -->
    <div
      v-if="showTextInputDialog"
      class="template-dialog-overlay"
      @click="showTextInputDialog = false"
    >
      <div class="template-dialog text-input-dialog" @click.stop>
        <div class="dialog-header">
          <h3 class="dialog-title">粘贴文本生成课程设计</h3>
          <button class="dialog-close" @click="showTextInputDialog = false">
            ×
          </button>
        </div>
        <div class="text-input-content">
          <textarea
            v-model="inputText"
            class="text-input"
            placeholder="请在此粘贴或输入文本内容..."
            rows="12"
          ></textarea>
          <div class="text-count">{{ inputText.length }} 字</div>
        </div>
        <div class="dialog-actions">
          <button
            class="action-btn cancel-btn"
            @click="showTextInputDialog = false"
          >
            取消
          </button>
          <button
            class="action-btn confirm-btn"
            @click="handleSubmitText"
            :disabled="!inputText.trim()"
          >
            提交并生成
          </button>
        </div>
      </div>
    </div>

    <!-- AI一句话生成对话框（底部弹出） -->
    <div
      v-if="showAIDialog"
      class="ai-dialog-overlay"
      @click="
        showAIDialog = false;
        clearAIDialog();
      "
    >
      <div class="ai-dialog" @click.stop>
        <div class="ai-dialog-header">
          <h3 class="ai-dialog-title">AI一句话生成课程设计</h3>
          <button
            class="ai-dialog-close"
            @click="
              showAIDialog = false;
              clearAIDialog();
            "
          >
            ×
          </button>
        </div>
        <div class="ai-dialog-content">
          <input
            v-model="aiInputText"
            class="ai-input"
            type="text"
            placeholder="请输入一句话描述，例如：设计一个关于秋天的怀念的探究式课程..."
            @keyup.enter="handleSubmitAI"
          />
          <div class="ai-upload-section">
            <div class="upload-label">参考文件（可选）</div>
            <div
              class="ai-upload-area"
              @click="triggerAIFileInput"
              @dragover.prevent="handleAIDragOver"
              @drop.prevent="handleAIDrop"
              @dragleave.prevent="isAIDragOver = false"
              :class="{ 'drag-over': isAIDragOver }"
            >
              <input
                ref="aiFileInput"
                type="file"
                accept=".doc,.docx,.md,.markdown,.html,.htm,.txt,.pdf"
                @change="handleAIFileSelect"
                style="display: none"
              />
              <div class="upload-icon-small">📎</div>
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
            <input
              v-model="aiReferenceURL"
              class="url-input-small"
              type="text"
              placeholder="请输入学科网URL地址，例如：https://www.zxxk.com/..."
            />
          </div>
        </div>
        <div class="ai-dialog-actions">
          <button
            class="action-btn cancel-btn"
            @click="
              showAIDialog = false;
              clearAIDialog();
            "
          >
            取消
          </button>
          <button
            class="action-btn confirm-btn"
            @click="handleSubmitAI"
            :disabled="!aiInputText.trim()"
          >
            生成
          </button>
        </div>
      </div>
    </div>

    <!-- 课程设计选择对话框 -->
    <div
      v-if="showCourseDesignSelectDialog"
      class="template-dialog-overlay"
      @click="showCourseDesignSelectDialog = false"
    >
      <div class="template-dialog course-design-select-dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title-wrapper">
            <h3 class="dialog-title">选择课程设计</h3>
          </div>
          <button
            class="dialog-close"
            @click="showCourseDesignSelectDialog = false"
          >
            ×
          </button>
        </div>
        <div class="select-tabs">
          <button
            v-for="tab in courseDesignSelectTabs"
            :key="tab.id"
            class="tab-button"
            :class="{ active: activeSelectTab === tab.id }"
            @click="activeSelectTab = tab.id"
          >
            <span class="tab-icon">{{ tab.icon || "📄" }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>
        <div class="select-content">
          <!-- 上传文件 -->
          <div v-if="activeSelectTab === 'upload'" class="select-panel">
            <div class="upload-section">
              <div
                class="upload-area-small"
                @click="triggerCourseDesignFileInput"
                @dragover.prevent="handleCourseDesignDragOver"
                @drop.prevent="handleCourseDesignDrop"
                @dragleave.prevent="isCourseDesignDragOver = false"
                :class="{
                  'drag-over': isCourseDesignDragOver,
                  'has-file': courseDesignFile,
                }"
              >
                <input
                  ref="courseDesignFileInput"
                  type="file"
                  accept=".doc,.docx,.md,.markdown,.html,.htm"
                  @change="handleCourseDesignFileSelect"
                  style="display: none"
                />
                <div class="upload-icon-small">
                  <span v-if="!courseDesignFile">📤</span>
                  <span v-else>✅</span>
                </div>
                <div class="upload-text-small">
                  <div v-if="!courseDesignFile" class="upload-text-content">
                    <div class="upload-main-text">
                      点击或拖拽上传课程设计文件
                    </div>
                    <div class="upload-hint-text">
                      支持 Word、Markdown、HTML 格式
                    </div>
                  </div>
                  <div v-else class="file-info-content">
                    <div class="file-name">{{ courseDesignFile.name }}</div>
                    <div class="file-size-hint">文件已选择</div>
                  </div>
                </div>
                <button
                  v-if="courseDesignFile"
                  class="file-remove-small"
                  @click.stop="removeCourseDesignFile"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- 输入URL -->
          <div v-if="activeSelectTab === 'url'" class="select-panel">
            <div class="url-input-wrapper">
              <div class="url-icon">🔗</div>
              <input
                v-model="courseDesignURL"
                class="url-input"
                type="text"
                placeholder="请输入学科网URL地址，例如：https://www.zxxk.com/..."
              />
              <div v-if="courseDesignURL" class="url-status-icon">✓</div>
            </div>
            <div class="url-hint">
              支持学科网、教育资源网等平台的课程设计链接
            </div>
          </div>

          <!-- 选择已有文档 -->
          <div v-if="activeSelectTab === 'select'" class="select-panel">
            <div class="document-list">
              <div
                v-for="(doc, index) in myCourseDesigns"
                :key="index"
                class="document-item"
                :class="{ active: selectedCourseDesign === index }"
                @click="selectedCourseDesign = index"
              >
                <div class="document-icon">📋</div>
                <div class="document-info">
                  <div class="document-name">{{ doc.name }}</div>
                  <div class="document-meta">{{ doc.updateTime }}</div>
                </div>
                <div
                  v-if="selectedCourseDesign === index"
                  class="document-check"
                >
                  ✓
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <button
            class="action-btn cancel-btn"
            @click="showCourseDesignSelectDialog = false"
          >
            取消
          </button>
          <button
            class="action-btn confirm-btn"
            @click="handleSubmitCourseDesignSelect"
            :disabled="!isCourseDesignSelectValid"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 模版选择对话框状态
const showTemplateDialog = ref(false);

// 文档上传对话框状态
const showDocumentUploadDialog = ref(false);
const documentUploadTab = ref("upload");
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const documentURL = ref("");

// 文本输入对话框状态
const showTextInputDialog = ref(false);
const inputText = ref("");

// AI对话框状态
const showAIDialog = ref(false);
const aiInputText = ref("");
const aiReferenceFile = ref<File | null>(null);
const aiFileInput = ref<HTMLInputElement | null>(null);
const isAIDragOver = ref(false);
const aiReferenceURL = ref("");

// 课程设计选择对话框状态
const showCourseDesignSelectDialog = ref(false);
const activeSelectTab = ref("upload");
const courseDesignFile = ref<File | null>(null);
const courseDesignFileInput = ref<HTMLInputElement | null>(null);
const isCourseDesignDragOver = ref(false);
const courseDesignURL = ref("");
const selectedCourseDesign = ref<number | null>(null);

// 课程设计选择标签页
const courseDesignSelectTabs = ref([
  { id: "upload", label: "上传文件", icon: "📤" },
  { id: "url", label: "输入URL", icon: "🔗" },
  { id: "select", label: "选择已有文档", icon: "📋" },
]);

// 我的课程设计列表
const myCourseDesigns = ref([
  { name: "《秋天的怀念》情景任务式课程设计", updateTime: "2024-01-15" },
  { name: "《秋天的怀念》探究式课程设计", updateTime: "2024-01-10" },
  { name: "《秋天的怀念》大单元教学课程设计", updateTime: "2024-01-08" },
]);

// 课程设计模版
const courseTemplates = ref([
  {
    id: "situation-task",
    name: "情景任务式",
    desc: "以任务驱动，情境化教学",
    icon: "🎯",
  },
  { id: "inquiry", name: "探究式", desc: "引导探究，自主发现", icon: "🔬" },
  {
    id: "unit-teaching",
    name: "大单元教学",
    desc: "整体设计，系统化教学",
    icon: "📚",
  },
  {
    id: "project-based",
    name: "项目式",
    desc: "项目驱动，实践应用",
    icon: "🚀",
  },
]);

// 课程设计参考资源
const courseDesignResources = ref([
  { name: "情景任务式课程设计", desc: "以任务驱动，情境化教学" },
  { name: "大单元教学课程设计", desc: "整体设计，系统化教学" },
  { name: "探究式课程设计", desc: "引导探究，自主发现" },
  { name: "项目式课程设计", desc: "项目驱动，实践应用" },
]);

// 课件生成参考资源
const slideGeneratorResources = ref([
  { name: "《秋天的怀念》完整课件", desc: "完整教学课件" },
  { name: "情境任务式教学课件", desc: "情境化教学课件" },
  { name: "互动式教学课件", desc: "互动式教学课件" },
  { name: "多媒体融合课件", desc: "多媒体融合课件" },
]);

// AI课堂参考资源
const aiClassroomResources = ref([
  { name: "图片资源", desc: "高质量教学图片素材" },
  { name: "多媒体资源", desc: "视频、音频等多媒体内容" },
  { name: "交互网页", desc: "互动式网页教学资源" },
  { name: "学科工具", desc: "专业学科教学工具" },
  { name: "学科特色", desc: "特色学科教学资源" },
]);

const handleCourseDesign = (type: string) => {
  // 根据不同类型跳转到课程设计页面，可以传递参数
  router.push({
    path: "/course-design",
    query: { type },
  });
};

// 选择模版
const selectTemplate = (templateId: string) => {
  showTemplateDialog.value = false;
  router.push({
    path: "/course-design",
    query: { type: "template", template: templateId },
  });
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
      alert("不支持的文件类型，请上传 Word、Markdown 或 HTML 文档");
    }
  }
};

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
      alert("不支持的文件类型，请上传 Word、Markdown 或 HTML 文档");
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

// 清理文档上传对话框
const clearDocumentUploadDialog = () => {
  selectedFile.value = null;
  documentURL.value = "";
  documentUploadTab.value = "upload";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// 上传文档
const handleUploadDocument = () => {
  if (documentUploadTab.value === "upload") {
    if (!selectedFile.value) return;

    // 这里可以添加上传逻辑，比如调用API上传文件
    // 目前直接跳转到课程设计页面
    showDocumentUploadDialog.value = false;
    router.push({
      path: "/course-design",
      query: {
        type: "document",
        fileName: selectedFile.value.name,
        fileType:
          selectedFile.value.type ||
          getFileTypeFromName(selectedFile.value.name),
      },
    });

    // 清空选择
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  } else if (documentUploadTab.value === "url") {
    if (!documentURL.value.trim()) return;

    const url = documentURL.value.trim();
    showDocumentUploadDialog.value = false;
    clearDocumentUploadDialog();

    router.push({
      path: "/course-design",
      query: {
        type: "document",
        source: "url",
        url: url,
      },
    });
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

// 提交文本
const handleSubmitText = () => {
  if (!inputText.value.trim()) return;

  showTextInputDialog.value = false;
  router.push({
    path: "/course-design",
    query: {
      type: "text",
      content: inputText.value.trim(),
    },
  });

  // 清空输入
  inputText.value = "";
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
      alert("不支持的文件类型，请上传 Word、Markdown、HTML、TXT 或 PDF 文档");
    }
  }
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
      alert("不支持的文件类型，请上传 Word、Markdown、HTML、TXT 或 PDF 文档");
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
  clearAIDialog();

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

  router.push({
    path: "/course-design",
    query,
  });
  aiInputText.value = "";
  aiReferenceFile.value = null;
  if (aiFileInput.value) {
    aiFileInput.value.value = "";
  }
};

const handleSlideGenerator = (type: string) => {
  // 根据不同类型跳转到课件生成页面，可以传递参数
  router.push({
    path: "/slide-generator",
    query: { type },
  });
};

// 触发课程设计文件选择
const triggerCourseDesignFileInput = () => {
  courseDesignFileInput.value?.click();
};

// 课程设计文件选择处理
const handleCourseDesignFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (validateFileType(file)) {
      courseDesignFile.value = file;
    } else {
      alert("不支持的文件类型，请上传 Word、Markdown 或 HTML 文档");
    }
  }
};

// 课程设计拖拽悬停
const handleCourseDesignDragOver = (event: DragEvent) => {
  event.preventDefault();
  isCourseDesignDragOver.value = true;
};

// 课程设计拖拽放下
const handleCourseDesignDrop = (event: DragEvent) => {
  event.preventDefault();
  isCourseDesignDragOver.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    if (validateFileType(file)) {
      courseDesignFile.value = file;
    } else {
      alert("不支持的文件类型，请上传 Word、Markdown 或 HTML 文档");
    }
  }
};

// 移除课程设计文件
const removeCourseDesignFile = () => {
  courseDesignFile.value = null;
  if (courseDesignFileInput.value) {
    courseDesignFileInput.value.value = "";
  }
};

// 验证课程设计选择是否有效
const isCourseDesignSelectValid = computed(() => {
  if (activeSelectTab.value === "upload") {
    return courseDesignFile.value !== null;
  } else if (activeSelectTab.value === "url") {
    return courseDesignURL.value.trim() !== "";
  } else if (activeSelectTab.value === "select") {
    return selectedCourseDesign.value !== null;
  }
  return false;
});

// 提交课程设计选择
const handleSubmitCourseDesignSelect = () => {
  showCourseDesignSelectDialog.value = false;
  const query: any = {
    type: "course-design",
  };

  if (activeSelectTab.value === "upload" && courseDesignFile.value) {
    query.source = "upload";
    query.fileName = courseDesignFile.value.name;
    query.fileType =
      courseDesignFile.value.type ||
      getFileTypeFromName(courseDesignFile.value.name);
  } else if (activeSelectTab.value === "url" && courseDesignURL.value.trim()) {
    query.source = "url";
    query.url = courseDesignURL.value.trim();
  } else if (
    activeSelectTab.value === "select" &&
    selectedCourseDesign.value !== null
  ) {
    query.source = "select";
    query.designId = selectedCourseDesign.value;
    query.designName = myCourseDesigns.value[selectedCourseDesign.value].name;
  }

  router.push({
    path: "/slide-generator",
    query,
  });

  // 清空选择
  courseDesignFile.value = null;
  courseDesignURL.value = "";
  selectedCourseDesign.value = null;
  activeSelectTab.value = "upload";
  if (courseDesignFileInput.value) {
    courseDesignFileInput.value.value = "";
  }
};

const goToCourseDesign = () => {
  router.push("/course-design");
};

const goToSlideGenerator = () => {
  router.push("/slide-generator");
};

const handleMoreResources = (type: string) => {
  // 根据类型跳转到对应的资源页面
  if (type === "course") {
    router.push("/course-design");
  } else if (type === "slide") {
    router.push("/slide-generator");
  } else if (type === "ai-classroom") {
    // 跳转到AI课堂资源页面
    router.push("/ai-classroom");
  }
};

const handleAIClassroom = (type: string) => {
  // 根据不同类型跳转到AI课堂页面
  router.push({
    path: "/ai-classroom",
    query: { type },
  });
};

const goToAIClassroom = () => {
  router.push("/ai-classroom");
};
</script>

<style scoped lang="scss">
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 课程信息区域 - 与侧边栏风格一致
.course-info-section {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(240, 253, 255, 0.9) 100%
  );
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow:
    0 4px 20px rgba(6, 182, 212, 0.15),
    0 0 0 1px rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  position: relative;
  overflow: hidden;

  .section-header {
    margin-bottom: 12px;

    .title-wrapper {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }

    .course-title {
      font-size: 24px;
      font-weight: 600;
      background: linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      letter-spacing: -0.3px;
      font-family:
        -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
    }

    .course-author {
      font-size: 14px;
      color: #0284c7;
      font-weight: 400;
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .info-label {
        font-size: 11px;
        font-weight: 500;
        color: #0284c7;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-value {
        font-size: 13px;
        color: #0c4a6e;
        line-height: 1.4;
        font-weight: 400;
      }

      .info-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        .tag {
          display: inline-block;
          padding: 4px 10px;
          background: linear-gradient(
            135deg,
            rgba(6, 182, 212, 0.15) 0%,
            rgba(14, 165, 233, 0.15) 100%
          );
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 16px;
          font-size: 12px;
          color: #0284c7;
          font-weight: 400;
          transition: all 0.2s ease;

          &:hover {
            background: linear-gradient(
              135deg,
              rgba(6, 182, 212, 0.25) 0%,
              rgba(14, 165, 233, 0.25) 100%
            );
            border-color: rgba(6, 182, 212, 0.5);
            box-shadow: 0 2px 8px rgba(6, 182, 212, 0.2);
          }
        }
      }
    }
  }
}

// 功能按钮区域 - 苹果极简风格
.functions-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.function-group {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(240, 253, 255, 0.9) 100%
  );
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow:
    0 4px 20px rgba(6, 182, 212, 0.15),
    0 0 0 1px rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  position: relative;
  overflow: hidden;

  .group-header {
    margin-bottom: 16px;
  }

  .group-title {
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 16px 0;
    letter-spacing: -0.3px;
    font-family:
      -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  }

  .function-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    // 单个按钮时居中显示
    &.function-buttons-single {
      grid-template-columns: 1fr;
      max-width: 200px;

      @media (max-width: 768px) {
        max-width: 100%;
      }
    }
  }

  .function-btn {
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    .btn-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 12px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(6, 182, 212, 0.2);
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
    }

    .btn-icon-wrapper {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(
        135deg,
        rgba(6, 182, 212, 0.15) 0%,
        rgba(14, 165, 233, 0.15) 100%
      );
      border: 1px solid rgba(6, 182, 212, 0.3);
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-icon {
      font-size: 18px;
    }

    .btn-text {
      font-size: 12px;
      font-weight: 400;
      color: #0c4a6e;
      text-align: center;
      line-height: 1.3;
    }

    &:hover {
      .btn-content {
        background: rgba(6, 182, 212, 0.1);
        border-color: rgba(6, 182, 212, 0.4);
        transform: translateY(-2px);
        box-shadow:
          0 4px 16px rgba(6, 182, 212, 0.2),
          0 0 0 1px rgba(6, 182, 212, 0.1);
      }

      .btn-icon-wrapper {
        background: linear-gradient(
          135deg,
          rgba(6, 182, 212, 0.25) 0%,
          rgba(14, 165, 233, 0.25) 100%
        );
        border-color: rgba(6, 182, 212, 0.5);
        transform: scale(1.08);
        box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);
      }
    }

    &:active {
      .btn-content {
        transform: translateY(0);
      }
    }
  }

  // 参考资源列表 - 与侧边栏风格一致
  .reference-resources {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(6, 182, 212, 0.2);

    .resources-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .resources-title {
      font-size: 16px;
      font-weight: 600;
      color: #0c4a6e;
      margin: 0;
      letter-spacing: -0.2px;
    }

    .more-resources-btn {
      padding: 6px 12px;
      background: transparent;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 400;
      color: #06b6d4;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        background: rgba(6, 182, 212, 0.15);
        color: #0284c7;
        box-shadow: 0 2px 8px rgba(6, 182, 212, 0.2);
      }

      &:active {
        background: rgba(6, 182, 212, 0.25);
      }
    }

    .resources-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: rgba(6, 182, 212, 0.1);
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(6, 182, 212, 0.2);
    }

    .resource-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: rgba(6, 182, 212, 0.15);
        transform: translateX(4px);
        box-shadow: 0 2px 12px rgba(6, 182, 212, 0.2);

        .resource-arrow {
          opacity: 1;
          transform: translateX(4px);
          color: #06b6d4;
        }

        .resource-number {
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
        }
      }

      .resource-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background: #0c4a6e;
        color: #ffffff;
        border-radius: 50%;
        font-size: 11px;
        font-weight: 500;
        flex-shrink: 0;
        transition: all 0.3s ease;
      }

      .resource-name {
        font-size: 13px;
        font-weight: 400;
        color: #0c4a6e;
        flex: 0 0 180px;
      }

      .resource-desc {
        font-size: 12px;
        color: #0284c7;
        flex: 1;
        font-weight: 400;
      }

      .resource-arrow {
        font-size: 14px;
        color: #0284c7;
        opacity: 0;
        transition: all 0.3s ease;
        flex-shrink: 0;
      }
    }
  }
}

// 模版选择对话框
.template-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.template-dialog {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(240, 253, 255, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow:
    0 20px 60px rgba(6, 182, 212, 0.3),
    0 0 0 1px rgba(6, 182, 212, 0.2);
  border: 1px solid rgba(6, 182, 212, 0.3);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(6, 182, 212, 0.2);

    .dialog-title {
      font-size: 20px;
      font-weight: 600;
      background: linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    .dialog-close {
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(6, 182, 212, 0.1);
      border-radius: 8px;
      font-size: 24px;
      color: #0c4a6e;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;

      &:hover {
        background: rgba(6, 182, 212, 0.2);
        transform: scale(1.1);
      }
    }
  }

  .template-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .template-card {
    padding: 20px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(6, 182, 212, 0.2);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    &:hover {
      background: rgba(6, 182, 212, 0.1);
      border-color: rgba(6, 182, 212, 0.4);
      transform: translateY(-4px);
      box-shadow:
        0 8px 24px rgba(6, 182, 212, 0.2),
        0 0 0 1px rgba(6, 182, 212, 0.1);
    }

    .template-icon {
      font-size: 40px;
      margin-bottom: 4px;
    }

    .template-name {
      font-size: 16px;
      font-weight: 600;
      color: #0c4a6e;
    }

    .template-desc {
      font-size: 13px;
      color: #0284c7;
      line-height: 1.4;
    }
  }

  // 文档上传对话框样式
  &.upload-dialog {
    max-width: 500px;

    .select-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(6, 182, 212, 0.2);

      .tab-button {
        padding: 10px 20px;
        border: none;
        background: transparent;
        border-bottom: 2px solid transparent;
        font-size: 14px;
        font-weight: 500;
        color: #0284c7;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        top: 1px;

        &:hover {
          color: #06b6d4;
        }

        &.active {
          color: #06b6d4;
          border-bottom-color: #06b6d4;
        }
      }
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .upload-panel {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .url-panel {
        .url-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          color: #0c4a6e;
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;

          &:focus {
            outline: none;
            border-color: rgba(6, 182, 212, 0.5);
            box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
          }

          &::placeholder {
            color: #0284c7;
            opacity: 0.6;
          }
        }
      }
    }

    .upload-area {
      border: 2px dashed rgba(6, 182, 212, 0.3);
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.5);

      &:hover {
        border-color: rgba(6, 182, 212, 0.5);
        background: rgba(6, 182, 212, 0.05);
      }

      &.drag-over {
        border-color: rgba(6, 182, 212, 0.6);
        background: rgba(6, 182, 212, 0.1);
        transform: scale(1.02);
      }

      .upload-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .upload-text {
        .upload-title {
          font-size: 16px;
          font-weight: 600;
          color: #0c4a6e;
          margin: 0 0 8px 0;
        }

        .upload-hint {
          font-size: 13px;
          color: #0284c7;
          margin: 0;
          line-height: 1.5;
        }
      }
    }

    .file-info {
      .file-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(6, 182, 212, 0.2);
        border-radius: 8px;

        .file-icon {
          font-size: 20px;
        }

        .file-name {
          flex: 1;
          font-size: 14px;
          color: #0c4a6e;
          font-weight: 500;
        }

        .file-size {
          font-size: 12px;
          color: #0284c7;
        }

        .file-remove {
          width: 24px;
          height: 24px;
          border: none;
          background: rgba(6, 182, 212, 0.1);
          border-radius: 50%;
          font-size: 18px;
          color: #0c4a6e;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;

          &:hover {
            background: rgba(6, 182, 212, 0.2);
            transform: scale(1.1);
          }
        }
      }
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 8px;

      .action-btn {
        padding: 10px 24px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;

        &.cancel-btn {
          background: rgba(6, 182, 212, 0.1);
          color: #0c4a6e;

          &:hover {
            background: rgba(6, 182, 212, 0.2);
          }
        }

        &.confirm-btn {
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  // 文本输入对话框样式
  &.text-input-dialog {
    max-width: 700px;

    .text-input-content {
      margin-bottom: 20px;

      .text-input {
        width: 100%;
        padding: 16px;
        border: 1px solid rgba(6, 182, 212, 0.2);
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        color: #0c4a6e;
        background: rgba(255, 255, 255, 0.9);
        resize: vertical;
        min-height: 200px;
        line-height: 1.6;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: rgba(6, 182, 212, 0.5);
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        &::placeholder {
          color: #0284c7;
          opacity: 0.6;
        }
      }

      .text-count {
        margin-top: 8px;
        font-size: 12px;
        color: #0284c7;
        text-align: right;
      }
    }
  }
}

// AI对话框（底部弹出）
.ai-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.ai-dialog {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(240, 253, 255, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 20px 20px 0 0;
  padding: 24px;
  width: 100%;
  max-width: 800px;
  box-shadow:
    0 -4px 40px rgba(6, 182, 212, 0.3),
    0 0 0 1px rgba(6, 182, 212, 0.2);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-bottom: none;
  animation: slideUpFromBottom 0.3s ease;

  @keyframes slideUpFromBottom {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .ai-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(6, 182, 212, 0.2);

    .ai-dialog-title {
      font-size: 18px;
      font-weight: 600;
      background: linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    .ai-dialog-close {
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(6, 182, 212, 0.1);
      border-radius: 8px;
      font-size: 24px;
      color: #0c4a6e;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;

      &:hover {
        background: rgba(6, 182, 212, 0.2);
        transform: scale(1.1);
      }
    }
  }

  .ai-dialog-content {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .ai-input {
      width: 100%;
      padding: 14px 16px;
      border: 1px solid rgba(6, 182, 212, 0.2);
      border-radius: 10px;
      font-size: 15px;
      font-family: inherit;
      color: #0c4a6e;
      background: rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: rgba(6, 182, 212, 0.5);
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
      }

      &::placeholder {
        color: #0284c7;
        opacity: 0.6;
      }
    }

    .ai-upload-section {
      .upload-label {
        font-size: 13px;
        font-weight: 500;
        color: #0284c7;
        margin-bottom: 8px;
      }

      .ai-upload-area {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border: 1px dashed rgba(6, 182, 212, 0.3);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        transition: all 0.3s ease;
        min-height: 44px;

        &:hover {
          border-color: rgba(6, 182, 212, 0.5);
          background: rgba(6, 182, 212, 0.05);
        }

        &.drag-over {
          border-color: rgba(6, 182, 212, 0.6);
          background: rgba(6, 182, 212, 0.1);
          border-style: solid;
        }

        .upload-icon-small {
          font-size: 18px;
          flex-shrink: 0;
        }

        .upload-text-small {
          flex: 1;
          font-size: 13px;
          color: #0c4a6e;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-remove-small {
          width: 20px;
          height: 20px;
          border: none;
          background: rgba(6, 182, 212, 0.1);
          border-radius: 50%;
          font-size: 14px;
          color: #0c4a6e;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          flex-shrink: 0;

          &:hover {
            background: rgba(6, 182, 212, 0.2);
            transform: scale(1.1);
          }
        }
      }
    }

    .ai-url-section {
      .upload-label {
        font-size: 13px;
        font-weight: 500;
        color: #0284c7;
        margin-bottom: 8px;
      }

      .url-input-small {
        width: 100%;
        padding: 12px 14px;
        border: 1px solid rgba(6, 182, 212, 0.2);
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        color: #0c4a6e;
        background: rgba(255, 255, 255, 0.9);
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: rgba(6, 182, 212, 0.5);
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        &::placeholder {
          color: #0284c7;
          opacity: 0.6;
        }
      }
    }
  }

  .ai-dialog-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;

    .action-btn {
      padding: 10px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;

      &.cancel-btn {
        background: rgba(6, 182, 212, 0.1);
        color: #0c4a6e;

        &:hover {
          background: rgba(6, 182, 212, 0.2);
        }
      }

      &.confirm-btn {
        background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }

  // 课程设计选择对话框样式
  &.course-design-select-dialog {
    max-width: 800px;
    padding: 40px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.99) 0%,
      rgba(240, 253, 255, 0.97) 100%
    );
    box-shadow:
      0 24px 80px rgba(6, 182, 212, 0.25),
      0 8px 24px rgba(6, 182, 212, 0.15),
      0 0 0 1px rgba(6, 182, 212, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);

    .dialog-header {
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(6, 182, 212, 0.1);
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, #06b6d4 0%, #0ea5e9 100%);
        border-radius: 2px;
      }

      .dialog-title-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;

        .dialog-icon {
          font-size: 28px;
          filter: drop-shadow(0 2px 4px rgba(6, 182, 212, 0.2));
          animation: iconFloat 3s ease-in-out infinite;
        }

        .dialog-title {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(
            135deg,
            #0c4a6e 0%,
            #06b6d4 50%,
            #0ea5e9 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          text-shadow: 0 2px 8px rgba(6, 182, 212, 0.1);
        }
      }
    }

    .select-tabs {
      display: flex;
      gap: 6px;
      margin-bottom: 28px;
      padding: 6px;
      background: linear-gradient(
        135deg,
        rgba(6, 182, 212, 0.06) 0%,
        rgba(14, 165, 233, 0.04) 100%
      );
      border-radius: 14px;
      position: relative;
      box-shadow:
        inset 0 2px 4px rgba(6, 182, 212, 0.05),
        0 1px 2px rgba(6, 182, 212, 0.1);

      .tab-button {
        flex: 1;
        padding: 14px 20px;
        border: none;
        background: transparent;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #0284c7;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        .tab-icon {
          font-size: 18px;
          transition: transform 0.3s ease;
        }

        .tab-label {
          transition: color 0.3s ease;
        }

        &:hover:not(.active) {
          color: #06b6d4;
          background: rgba(6, 182, 212, 0.1);
          transform: translateY(-1px);

          .tab-icon {
            transform: scale(1.15);
          }
        }

        &.active {
          color: #ffffff;
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          box-shadow:
            0 4px 12px rgba(6, 182, 212, 0.4),
            0 2px 4px rgba(6, 182, 212, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);

          .tab-icon {
            transform: scale(1.2) rotate(5deg);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          }
        }
      }
    }

    @keyframes iconFloat {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-4px);
      }
    }

    .select-content {
      min-height: 280px;
      margin-bottom: 28px;

      .select-panel {
        animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);

        .upload-section {
          .upload-area-small {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 32px 24px;
            border: 2px dashed rgba(6, 182, 212, 0.3);
            border-radius: 16px;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(240, 253, 255, 0.7) 100%
            );
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            min-height: 120px;
            position: relative;
            overflow: hidden;

            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(
                135deg,
                rgba(6, 182, 212, 0.08) 0%,
                rgba(14, 165, 233, 0.06) 100%
              );
              opacity: 0;
              transition: opacity 0.4s ease;
            }

            &::after {
              content: "";
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(
                circle,
                rgba(6, 182, 212, 0.1) 0%,
                transparent 70%
              );
              opacity: 0;
              transition: opacity 0.4s ease;
            }

            &:hover {
              border-color: rgba(6, 182, 212, 0.5);
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 1) 0%,
                rgba(240, 253, 255, 0.9) 100%
              );
              transform: translateY(-3px);
              box-shadow:
                0 8px 24px rgba(6, 182, 212, 0.2),
                0 4px 12px rgba(6, 182, 212, 0.1),
                0 0 0 1px rgba(6, 182, 212, 0.15);

              &::before,
              &::after {
                opacity: 1;
              }
            }

            &.drag-over {
              border-color: rgba(6, 182, 212, 0.8);
              background: linear-gradient(
                135deg,
                rgba(6, 182, 212, 0.15) 0%,
                rgba(14, 165, 233, 0.12) 100%
              );
              border-style: solid;
              transform: scale(1.02) translateY(-2px);
              box-shadow:
                0 12px 32px rgba(6, 182, 212, 0.3),
                0 4px 16px rgba(6, 182, 212, 0.2),
                0 0 0 3px rgba(6, 182, 212, 0.25);
            }

            &.has-file {
              border-color: rgba(34, 197, 94, 0.4);
              background: linear-gradient(
                135deg,
                rgba(34, 197, 94, 0.05) 0%,
                rgba(240, 253, 255, 0.8) 100%
              );
            }

            .upload-icon-small {
              font-size: 40px;
              flex-shrink: 0;
              filter: drop-shadow(0 4px 8px rgba(6, 182, 212, 0.25));
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              position: relative;
              z-index: 1;
            }

            &:hover .upload-icon-small {
              transform: scale(1.15) rotate(8deg);
            }

            .upload-text-small {
              flex: 1;
              position: relative;
              z-index: 1;

              .upload-text-content {
                .upload-main-text {
                  font-size: 16px;
                  font-weight: 600;
                  color: #0c4a6e;
                  margin-bottom: 6px;
                  line-height: 1.4;
                }

                .upload-hint-text {
                  font-size: 13px;
                  color: #0284c7;
                  opacity: 0.7;
                  font-weight: 400;
                }
              }

              .file-info-content {
                .file-name {
                  font-size: 15px;
                  font-weight: 600;
                  color: #0c4a6e;
                  margin-bottom: 4px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                .file-size-hint {
                  font-size: 12px;
                  color: rgba(34, 197, 94, 0.8);
                  font-weight: 500;
                }
              }
            }

            .file-remove-small {
              width: 32px;
              height: 32px;
              border: none;
              background: rgba(6, 182, 212, 0.1);
              border-radius: 50%;
              font-size: 18px;
              color: #0c4a6e;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 1;
              flex-shrink: 0;
              position: relative;
              z-index: 1;
              box-shadow: 0 2px 4px rgba(6, 182, 212, 0.1);

              &:hover {
                background: rgba(239, 68, 68, 0.15);
                color: #dc2626;
                transform: scale(1.2) rotate(90deg);
                box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
              }
            }
          }
        }

        .url-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(240, 253, 255, 0.85) 100%
          );
          border: 2px solid rgba(6, 182, 212, 0.2);
          border-radius: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.08);

          &:focus-within {
            border-color: rgba(6, 182, 212, 0.6);
            background: rgba(255, 255, 255, 1);
            box-shadow:
              0 6px 20px rgba(6, 182, 212, 0.18),
              0 0 0 3px rgba(6, 182, 212, 0.1);
            transform: translateY(-2px);
          }

          .url-icon {
            font-size: 22px;
            padding-left: 12px;
            flex-shrink: 0;
            filter: drop-shadow(0 2px 4px rgba(6, 182, 212, 0.2));
          }

          .url-input {
            flex: 1;
            padding: 16px 12px;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-family: inherit;
            color: #0c4a6e;
            background: transparent;
            transition: all 0.3s ease;

            &:focus {
              outline: none;
            }

            &::placeholder {
              color: #0284c7;
              opacity: 0.6;
              font-weight: 400;
            }
          }

          .url-status-icon {
            font-size: 20px;
            color: rgba(34, 197, 94, 0.8);
            padding-right: 12px;
            flex-shrink: 0;
            animation: checkBounce 0.5s ease;
          }
        }

        .url-hint {
          margin-top: 12px;
          font-size: 13px;
          color: #0284c7;
          opacity: 0.7;
          padding-left: 4px;
          font-weight: 400;
        }

        @keyframes checkBounce {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        .document-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 360px;
          overflow-y: auto;
          padding-right: 6px;
          padding: 4px;

          // 自定义滚动条
          &::-webkit-scrollbar {
            width: 8px;
          }

          &::-webkit-scrollbar-track {
            background: rgba(6, 182, 212, 0.05);
            border-radius: 4px;
          }

          &::-webkit-scrollbar-thumb {
            background: linear-gradient(
              135deg,
              rgba(6, 182, 212, 0.4) 0%,
              rgba(14, 165, 233, 0.4) 100%
            );
            border-radius: 4px;
            border: 2px solid transparent;
            background-clip: padding-box;

            &:hover {
              background: linear-gradient(
                135deg,
                rgba(6, 182, 212, 0.6) 0%,
                rgba(14, 165, 233, 0.6) 100%
              );
              background-clip: padding-box;
            }
          }

          .document-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px 22px;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(240, 253, 255, 0.7) 100%
            );
            border: 2px solid rgba(6, 182, 212, 0.2);
            border-radius: 14px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;

            &::before {
              content: "";
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 5px;
              background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
              opacity: 0;
              transition: all 0.4s ease;
              border-radius: 14px 0 0 14px;
            }

            &::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(
                135deg,
                rgba(6, 182, 212, 0.03) 0%,
                transparent 100%
              );
              opacity: 0;
              transition: opacity 0.4s ease;
            }

            &:hover {
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 1) 0%,
                rgba(240, 253, 255, 0.9) 100%
              );
              border-color: rgba(6, 182, 212, 0.5);
              transform: translateX(6px) translateY(-3px);
              box-shadow:
                0 8px 24px rgba(6, 182, 212, 0.2),
                0 4px 12px rgba(6, 182, 212, 0.1),
                0 0 0 1px rgba(6, 182, 212, 0.15);

              &::before {
                opacity: 1;
                width: 5px;
              }

              &::after {
                opacity: 1;
              }
            }

            &.active {
              background: linear-gradient(
                135deg,
                rgba(6, 182, 212, 0.15) 0%,
                rgba(14, 165, 233, 0.1) 100%
              );
              border-color: rgba(6, 182, 212, 0.7);
              box-shadow:
                0 8px 28px rgba(6, 182, 212, 0.25),
                0 4px 16px rgba(6, 182, 212, 0.15),
                0 0 0 2px rgba(6, 182, 212, 0.2);
              transform: translateX(6px);

              &::before {
                opacity: 1;
                width: 5px;
              }

              &::after {
                opacity: 1;
              }
            }

            .document-icon {
              font-size: 32px;
              flex-shrink: 0;
              filter: drop-shadow(0 3px 6px rgba(6, 182, 212, 0.25));
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            &:hover .document-icon {
              transform: scale(1.15) rotate(-5deg);
            }

            &.active .document-icon {
              transform: scale(1.1);
              filter: drop-shadow(0 4px 8px rgba(6, 182, 212, 0.35));
            }

            .document-info {
              flex: 1;
              min-width: 0;

              .document-name {
                font-size: 16px;
                font-weight: 700;
                color: #0c4a6e;
                margin-bottom: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 1.4;
                letter-spacing: -0.2px;
              }

              .document-meta {
                font-size: 13px;
                color: #0284c7;
                font-weight: 500;
                opacity: 0.85;
                display: flex;
                align-items: center;
                gap: 6px;

                &::before {
                  content: "🕒";
                  font-size: 12px;
                  opacity: 0.7;
                }
              }
            }

            .document-check {
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
              color: #ffffff;
              border-radius: 50%;
              font-size: 18px;
              font-weight: 700;
              flex-shrink: 0;
              box-shadow:
                0 4px 12px rgba(6, 182, 212, 0.4),
                0 2px 6px rgba(6, 182, 212, 0.3),
                0 0 0 3px rgba(255, 255, 255, 0.6);
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            &.active .document-check {
              animation: checkPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow:
                0 6px 16px rgba(6, 182, 212, 0.5),
                0 3px 8px rgba(6, 182, 212, 0.4),
                0 0 0 3px rgba(255, 255, 255, 0.7);
            }
          }
        }
      }
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 8px;
      padding-top: 24px;
      border-top: 2px solid rgba(6, 182, 212, 0.1);

      .action-btn {
        padding: 12px 28px;
        border: none;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        letter-spacing: 0.3px;

        &.cancel-btn {
          background: linear-gradient(
            135deg,
            rgba(6, 182, 212, 0.1) 0%,
            rgba(14, 165, 233, 0.08) 100%
          );
          color: #0c4a6e;
          border: 2px solid rgba(6, 182, 212, 0.2);
          box-shadow: 0 2px 4px rgba(6, 182, 212, 0.1);

          &:hover {
            background: linear-gradient(
              135deg,
              rgba(6, 182, 212, 0.15) 0%,
              rgba(14, 165, 233, 0.12) 100%
            );
            border-color: rgba(6, 182, 212, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(6, 182, 212, 0.15);
          }
        }

        &.confirm-btn {
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          color: #ffffff;
          box-shadow:
            0 4px 16px rgba(6, 182, 212, 0.35),
            0 2px 8px rgba(6, 182, 212, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);

          &:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow:
              0 8px 24px rgba(6, 182, 212, 0.4),
              0 4px 12px rgba(6, 182, 212, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
            background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          }

          &:active:not(:disabled) {
            transform: translateY(-1px);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
        }
      }
    }
  }

  @keyframes checkPulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
}
</style>
