<template>
  <div class="slide-editor">
    <!-- 左侧:课件列表 -->
    <div class="slide-list">
      <div class="list-header">
        <span>课件页面 ({{ slideData.slides.length }})</span>
        <el-button
          type="primary"
          :icon="Plus"
          size="small"
          circle
          @click="handleAddSlide"
        />
      </div>
      <el-scrollbar class="list-content">
        <draggable
          v-model="slideData.slides"
          item-key="id"
          class="slide-items"
          @end="handleDragEnd"
        >
          <template #item="{ element, index }">
            <div
              class="slide-item"
              :class="{ active: currentSlideIndex === index }"
              @click="currentSlideIndex = index"
            >
              <div class="slide-number">{{ index + 1 }}</div>
              <div class="slide-preview">
                <div class="slide-title">{{ element.title || "未命名" }}</div>
                <div class="slide-content-preview" v-html="element.content" />
              </div>
              <el-button
                type="danger"
                :icon="Delete"
                size="small"
                circle
                class="delete-btn"
                @click.stop="handleDeleteSlide(element.id)"
              />
            </div>
          </template>
        </draggable>
      </el-scrollbar>
    </div>

    <!-- 右侧:课件编辑区 -->
    <div class="slide-content">
      <div v-if="currentSlide" class="content-editor">
        <!-- 编辑工具栏 -->
        <div class="editor-toolbar">
          <el-button-group>
            <el-button :icon="EditPen" @click="showRichEditor = true">
              富文本编辑
            </el-button>
            <el-button :icon="Picture" @click="handleAddImage">
              添加图片
            </el-button>
            <el-button :icon="VideoPlay" @click="handleAddVideo">
              添加视频
            </el-button>
            <el-button :icon="Headset" @click="handleAddAudio">
              添加音频
            </el-button>
          </el-button-group>
        </div>

        <!-- 页面基本信息 -->
        <el-form :model="currentSlide" label-width="100px" class="slide-form">
          <el-form-item label="页面标题">
            <el-input
              v-model="currentSlide.title"
              placeholder="请输入页面标题"
              @change="handleUpdate"
            />
          </el-form-item>

          <el-form-item label="页面类型">
            <el-select
              v-model="currentSlide.type"
              placeholder="请选择页面类型"
              @change="handleUpdate"
            >
              <el-option label="标题页" value="title" />
              <el-option label="目录页" value="catalog" />
              <el-option label="讲解页" value="lecture" />
              <el-option label="互动页" value="interactive" />
              <el-option label="过渡页" value="transition" />
              <el-option label="总结页" value="summary" />
            </el-select>
          </el-form-item>

          <el-form-item label="背景图片">
            <el-input
              v-model="currentSlide.bgImage"
              placeholder="背景图片URL"
              @change="handleUpdate"
            >
              <template #append>
                <el-button :icon="Upload" @click="handleUploadBg">
                  上传
                </el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="过渡效果">
            <el-select
              v-model="currentSlide.transition"
              placeholder="请选择过渡效果"
              @change="handleUpdate"
            >
              <el-option label="淡入" value="fade" />
              <el-option label="滑动" value="slide" />
              <el-option label="缩放" value="zoom" />
              <el-option label="翻转" value="flip" />
              <el-option label="无" value="none" />
            </el-select>
          </el-form-item>

          <el-form-item label="页面内容">
            <div class="content-preview">
              <div v-html="currentSlide.content" class="html-content" />
              <el-button @click="showRichEditor = true">编辑内容</el-button>
            </div>
          </el-form-item>

          <el-form-item label="素材列表">
            <div class="materials-list">
              <div
                v-for="(material, idx) in currentSlide.materials"
                :key="idx"
                class="material-item"
              >
                <el-tag :type="getMaterialTagType(material.type)">
                  {{ material.type }}
                </el-tag>
                <span class="material-src">{{ material.src }}</span>
                <el-button
                  type="danger"
                  :icon="Delete"
                  size="small"
                  circle
                  @click="handleDeleteMaterial(idx)"
                />
              </div>
              <el-button
                type="primary"
                :icon="Plus"
                @click="showMaterialDialog = true"
              >
                添加素材
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 空状态 -->
      <el-empty v-else description="请选择一个页面进行编辑" />
    </div>

    <!-- 富文本编辑器对话框 -->
    <el-dialog
      v-model="showRichEditor"
      title="编辑页面内容"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="tempContent"
        type="textarea"
        :rows="15"
        placeholder="输入HTML内容或Markdown"
      />
      <template #footer>
        <el-button @click="showRichEditor = false">取消</el-button>
        <el-button type="primary" @click="handleSaveContent">保存</el-button>
      </template>
    </el-dialog>

    <!-- 素材添加对话框 -->
    <el-dialog
      v-model="showMaterialDialog"
      title="添加素材"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="materialForm" label-width="100px">
        <el-form-item label="素材类型">
          <el-select v-model="materialForm.type" placeholder="请选择素材类型">
            <el-option label="图片" value="image" />
            <el-option label="音频" value="audio" />
            <el-option label="视频" value="video" />
          </el-select>
        </el-form-item>
        <el-form-item label="素材地址">
          <el-input v-model="materialForm.src" placeholder="输入URL或上传文件">
            <template #append>
              <el-button :icon="Upload">上传</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="位置">
          <el-input
            v-model="materialForm.position"
            placeholder="如: top-left, center等"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showMaterialDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddMaterial">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  Delete,
  EditPen,
  Picture,
  VideoPlay,
  Headset,
  Upload,
} from "@element-plus/icons-vue";
import type { SlideData, Slide, Material } from "@/stores/slides";
import draggable from "vuedraggable";

type Props = {
  slideData: SlideData;
};

type Emits = {
  update: [slideId: string, updates: Partial<Slide>];
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 当前编辑的页面索引
const currentSlideIndex = ref(0);
const currentSlide = computed(
  () => props.slideData.slides[currentSlideIndex.value],
);

// 对话框状态
const showRichEditor = ref(false);
const showMaterialDialog = ref(false);
const tempContent = ref("");

// 素材表单
const materialForm = ref<Material>({
  type: "image",
  src: "",
  position: "",
});

// 拖拽结束
const handleDragEnd = () => {
  ElMessage.success("页面顺序已更新");
};

// 添加页面
const handleAddSlide = () => {
  const newSlide: Slide = {
    id: `slide-${Date.now()}`,
    title: "新页面",
    content: "<p>点击编辑内容</p>",
    materials: [],
    transition: "fade",
    type: "lecture",
  };

  props.slideData.slides.push(newSlide);
  currentSlideIndex.value = props.slideData.slides.length - 1;
  ElMessage.success("已添加新页面");
};

// 删除页面
const handleDeleteSlide = async (slideId: string) => {
  try {
    await ElMessageBox.confirm("确认删除该页面?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const index = props.slideData.slides.findIndex((s) => s.id === slideId);
    if (index > -1) {
      props.slideData.slides.splice(index, 1);
      if (currentSlideIndex.value >= props.slideData.slides.length) {
        currentSlideIndex.value = Math.max(
          0,
          props.slideData.slides.length - 1,
        );
      }
      ElMessage.success("页面已删除");
    }
  } catch {
    // 用户取消
  }
};

// 更新当前页面
const handleUpdate = () => {
  if (currentSlide.value) {
    emit("update", currentSlide.value.id, currentSlide.value);
  }
};

// 保存内容
const handleSaveContent = () => {
  if (currentSlide.value) {
    currentSlide.value.content = tempContent.value;
    handleUpdate();
    showRichEditor.value = false;
    ElMessage.success("内容已保存");
  }
};

// 监听富文本编辑器打开
watch(showRichEditor, (val) => {
  if (val && currentSlide.value) {
    tempContent.value = currentSlide.value.content;
  }
});

// 添加图片
const handleAddImage = () => {
  materialForm.value = {
    type: "image",
    src: "",
    position: "center",
  };
  showMaterialDialog.value = true;
};

// 添加视频
const handleAddVideo = () => {
  materialForm.value = {
    type: "video",
    src: "",
    position: "center",
  };
  showMaterialDialog.value = true;
};

// 添加音频
const handleAddAudio = () => {
  materialForm.value = {
    type: "audio",
    src: "",
    position: "",
  };
  showMaterialDialog.value = true;
};

// 添加素材
const handleAddMaterial = () => {
  if (!materialForm.value.src) {
    ElMessage.warning("请输入素材地址");
    return;
  }

  if (currentSlide.value) {
    currentSlide.value.materials.push({ ...materialForm.value });
    handleUpdate();
    showMaterialDialog.value = false;
    ElMessage.success("素材已添加");
  }
};

// 删除素材
const handleDeleteMaterial = (index: number) => {
  if (currentSlide.value) {
    currentSlide.value.materials.splice(index, 1);
    handleUpdate();
    ElMessage.success("素材已删除");
  }
};

// 上传背景图
const handleUploadBg = () => {
  ElMessage.info("上传功能待实现");
};

// 获取素材标签类型
const getMaterialTagType = (type: string) => {
  const typeMap: Record<string, any> = {
    image: "success",
    video: "warning",
    audio: "info",
  };
  return typeMap[type] || "info";
};
</script>

<script lang="ts">
import { watch } from "vue";
</script>

<style scoped lang="scss">
.slide-editor {
  display: flex;
  height: 100%;
  gap: 24px;

  .slide-list {
    width: 280px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e4e7ed;

      span {
        font-weight: 600;
        color: #303133;
      }
    }

    .list-content {
      flex: 1;
      padding: 12px;

      .slide-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .slide-item {
        position: relative;
        padding: 12px;
        border: 2px solid #e4e7ed;
        border-radius: 6px;
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

        .slide-number {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background-color: #409eff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .slide-preview {
          .slide-title {
            font-size: 14px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 8px;
            padding-right: 32px;
          }

          .slide-content-preview {
            font-size: 12px;
            color: #909399;
            max-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.4;
          }
        }

        .delete-btn {
          position: absolute;
          bottom: 8px;
          right: 8px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        &:hover .delete-btn {
          opacity: 1;
        }
      }
    }
  }

  .slide-content {
    flex: 1;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 24px;
    overflow: auto;

    .content-editor {
      .editor-toolbar {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e4e7ed;
      }

      .slide-form {
        .content-preview {
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          padding: 16px;
          background-color: #f5f7fa;

          .html-content {
            min-height: 100px;
            margin-bottom: 12px;
          }
        }

        .materials-list {
          .material-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            background-color: #f5f7fa;
            border-radius: 4px;
            margin-bottom: 8px;

            .material-src {
              flex: 1;
              font-size: 14px;
              color: #606266;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}
</style>
