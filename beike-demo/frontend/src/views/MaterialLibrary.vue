<template>
  <div class="material-library-view">
    <div class="page-header">
      <div class="header-left">
        <h1>素材库</h1>
        <p class="subtitle">规格化的多媒体教学素材</p>
      </div>
      <div class="header-right">
        <el-statistic
          title="素材总数"
          :value="materialsStore.materials.length"
        />
        <el-button @click="showMaterialList = true">
          <el-icon><Document /></el-icon>
          查看素材清单
        </el-button>
        <el-button type="primary" @click="showAddDrawer = true">
          <el-icon><Plus /></el-icon>
          添加素材
        </el-button>
      </div>
    </div>

    <div class="toolbar">
      <div class="category-filter">
        <el-radio-group
          v-model="selectedCategory"
          @change="handleCategoryChange"
        >
          <el-radio-button value="all">全部</el-radio-button>
          <el-radio-button value="作者肖像">作者肖像</el-radio-button>
          <el-radio-button value="母亲形象">母亲形象</el-radio-button>
          <el-radio-button value="环境音效">环境音效</el-radio-button>
          <el-radio-button value="意境视频">意境视频</el-radio-button>
          <el-radio-button value="交互工具">交互工具</el-radio-button>
        </el-radio-group>
      </div>

      <div class="search-bar">
        <MaterialSearch v-model="searchKeyword" @search="handleSearch" />
      </div>
    </div>

    <div class="type-filter">
      <el-tag
        v-for="type in typeOptions"
        :key="type.value"
        :type="currentType === type.value ? 'primary' : 'info'"
        :effect="currentType === type.value ? 'dark' : 'plain'"
        size="large"
        class="type-tag"
        @click="handleTypeChange(type.value)"
      >
        <el-icon>
          <component :is="type.icon" />
        </el-icon>
        {{ type.label }}
        <span class="count">({{ getTypeCount(type.value) }})</span>
      </el-tag>
    </div>

    <el-divider />

    <div v-if="materialsStore.isLoading" class="loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <div v-else class="material-content">
      <MaterialGrid
        :materials="filteredMaterials"
        @use="handleUseMaterial"
        @preview="handlePreview"
        @select="handleSelect"
      />
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="showPreview"
      :title="currentMaterial?.name"
      width="800px"
    >
      <div v-if="currentMaterial" class="preview-content">
        <div
          v-if="currentMaterial.type === 'image'"
          class="image-preview-large"
        >
          <img :src="currentMaterial.src" :alt="currentMaterial.name" />
        </div>

        <div
          v-else-if="currentMaterial.type === 'audio'"
          class="audio-preview-large"
        >
          <audio controls :src="currentMaterial.src" style="width: 100%">
            您的浏览器不支持音频播放
          </audio>
        </div>

        <div
          v-else-if="currentMaterial.type === 'video'"
          class="video-preview-large"
        >
          <video controls :src="currentMaterial.src" style="width: 100%">
            您的浏览器不支持视频播放
          </video>
        </div>

        <div v-else class="interactive-preview-large">
          <el-result
            icon="info"
            title="交互素材"
            sub-title="需要在实际教学环境中使用"
          />
        </div>

        <div class="preview-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="素材ID">{{
              currentMaterial.id
            }}</el-descriptions-item>
            <el-descriptions-item label="类型">{{
              getTypeName(currentMaterial.type)
            }}</el-descriptions-item>
            <el-descriptions-item label="分类">{{
              currentMaterial.category
            }}</el-descriptions-item>
            <el-descriptions-item label="风格">{{
              currentMaterial.style
            }}</el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">{{
              currentMaterial.description
            }}</el-descriptions-item>
            <el-descriptions-item label="标签" :span="2">
              <el-tag
                v-for="tag in currentMaterial.tags"
                :key="tag"
                size="small"
                style="margin-right: 8px"
                >{{ tag }}</el-tag
              >
            </el-descriptions-item>
            <el-descriptions-item label="适用环节" :span="2">
              <el-tag
                v-for="stage in currentMaterial.适用环节"
                :key="stage"
                type="success"
                size="small"
                style="margin-right: 8px"
                >{{ stage }}</el-tag
              >
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <el-button @click="showPreview = false">关闭</el-button>
        <el-button type="primary" @click="handleUseMaterial(currentMaterial!)"
          >使用此素材</el-button
        >
      </template>
    </el-dialog>

    <!-- 素材清单对话框 -->
    <el-dialog
      v-model="showMaterialList"
      title="《秋天的怀念》素材清单"
      width="900px"
      :close-on-click-modal="false"
    >
      <div v-if="materialListLoading" class="loading-content">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else class="material-list-content" v-html="materialListContent"></div>
      <template #footer>
        <el-button @click="showMaterialList = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 添加素材抽屉 -->
    <el-drawer
      v-model="showAddDrawer"
      title="添加素材"
      size="500px"
      direction="rtl"
    >
      <div class="add-material-drawer">
        <!-- 上传区域 -->
        <el-collapse v-model="uploadCollapseActive">
          <el-collapse-item name="upload" title="从本地上传素材">
            <div class="drawer-upload">
              <el-upload
                ref="uploadRef"
                :auto-upload="false"
                :on-change="handleFileChange"
                :show-file-list="false"
                :accept="acceptTypes"
                drag
                multiple
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持图片、音频、视频文件（单个文件不超过 50MB）
                  </div>
                </template>
              </el-upload>
            </div>
          </el-collapse-item>
        </el-collapse>

        <!-- 上传文件列表 -->
        <div v-if="uploadFiles.length > 0" class="upload-files-list">
          <div
            v-for="(file, index) in uploadFiles"
            :key="index"
            class="upload-file-item"
          >
            <div class="file-preview">
              <img
                v-if="file.type.startsWith('image/')"
                :src="file.url"
                alt="预览"
                class="preview-image"
              />
              <el-icon v-else class="file-icon">
                <Document />
              </el-icon>
            </div>
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ formatFileSize(file.size) }}</div>
              <el-input
                v-model="file.materialName"
                placeholder="素材名称"
                size="small"
                style="margin-top: 8px"
              />
              <el-input
                v-model="file.materialDesc"
                placeholder="素材描述（可选）"
                size="small"
                style="margin-top: 8px"
              />
            </div>
            <div class="file-actions">
              <el-button
                type="primary"
                size="small"
                @click="handleConfirmUpload(file, index)"
              >
                确认添加
              </el-button>
              <el-button
                size="small"
                @click="handleRemoveUploadFile(index)"
              >
                移除
              </el-button>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- 搜索栏 -->
        <div class="drawer-search">
          <el-input
            v-model="drawerSearchKeyword"
            placeholder="搜索素材..."
            clearable
            @input="handleDrawerSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 类型筛选 -->
        <div class="drawer-type-filter">
          <el-radio-group v-model="drawerTypeFilter" @change="handleDrawerTypeChange">
            <el-radio-button value="all">全部</el-radio-button>
            <el-radio-button value="image">图片</el-radio-button>
            <el-radio-button value="audio">音频</el-radio-button>
            <el-radio-button value="video">视频</el-radio-button>
            <el-radio-button value="interactive">交互</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 素材列表 -->
        <div class="drawer-material-list">
          <div
            v-for="material in drawerFilteredMaterials"
            :key="material.id"
            class="drawer-material-item"
            @click="handleAddMaterial(material)"
          >
            <div class="material-item-icon">
              <el-icon v-if="material.type === 'image'"><Picture /></el-icon>
              <el-icon v-else-if="material.type === 'audio'"><Headset /></el-icon>
              <el-icon v-else-if="material.type === 'video'"><VideoPlay /></el-icon>
              <el-icon v-else><Operation /></el-icon>
            </div>
            <div class="material-item-info">
              <div class="material-item-name">{{ material.name }}</div>
              <div class="material-item-desc">{{ material.description }}</div>
              <div class="material-item-tags">
                <el-tag
                  v-for="tag in material.tags.slice(0, 3)"
                  :key="tag"
                  size="small"
                  style="margin-right: 4px"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div class="material-item-action">
              <el-button type="primary" size="small">添加</el-button>
            </div>
          </div>
          <el-empty
            v-if="drawerFilteredMaterials.length === 0"
            description="暂无素材"
            :image-size="100"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
  Loading,
  Picture,
  Headset,
  VideoPlay,
  Operation,
  Document,
  Plus,
  Search,
  UploadFilled,
} from "@element-plus/icons-vue";
import type { UploadFile, UploadFiles, UploadInstance } from "element-plus";
import { ElMessage } from "element-plus";
import MarkdownIt from "markdown-it";
import { useMaterialsStore, type MaterialItem } from "@/stores/materials";
import MaterialGrid from "@/components/materials/MaterialGrid.vue";
import MaterialSearch from "@/components/materials/MaterialSearch.vue";

const md = new MarkdownIt();

const materialsStore = useMaterialsStore();
const selectedCategory = ref("all");
const searchKeyword = ref("");
const currentType = ref<string>("all");
const showPreview = ref(false);
const currentMaterial = ref<MaterialItem>();
const showMaterialList = ref(false);
const materialListContent = ref("");
const materialListLoading = ref(false);
const showAddDrawer = ref(false);
const drawerSearchKeyword = ref("");
const drawerTypeFilter = ref("all");
const uploadRef = ref<UploadInstance>();
const uploadFiles = ref<
  Array<{
    file: File;
    name: string;
    size: number;
    type: string;
    url: string;
    materialName: string;
    materialDesc: string;
  }>
>([]);
const acceptTypes = "image/*,audio/*,video/*";
const uploadCollapseActive = ref<string[]>([]);

const typeOptions = [
  { value: "all", label: "全部", icon: "Grid" },
  { value: "image", label: "图片", icon: Picture },
  { value: "audio", label: "音频", icon: Headset },
  { value: "video", label: "视频", icon: VideoPlay },
  { value: "interactive", label: "交互", icon: Operation },
];

const filteredMaterials = computed(() => {
  let result = materialsStore.filteredMaterials();
  if (currentType.value !== "all") {
    result = result.filter((m) => m.type === currentType.value);
  }
  return result;
});

const getTypeCount = (type: string) => {
  if (type === "all") return materialsStore.materials.length;
  return materialsStore.materials.filter((m) => m.type === type).length;
};

const getTypeName = (type: string) => {
  const names: Record<string, string> = {
    image: "图片",
    audio: "音频",
    video: "视频",
    interactive: "交互",
  };
  return names[type] || type;
};

onMounted(async () => {
  await materialsStore.loadMaterials();
  loadSampleMaterials();
});

// 监听素材清单对话框
watch(showMaterialList, (newVal) => {
  if (newVal && !materialListContent.value) {
    loadMaterialList();
  }
});

// 监听抽屉关闭，清理上传文件
watch(showAddDrawer, (newVal) => {
  if (!newVal) {
    // 关闭抽屉时清理所有上传文件的对象 URL
    uploadFiles.value.forEach((file) => {
      if (file.url) {
        URL.revokeObjectURL(file.url);
      }
    });
    uploadFiles.value = [];
  }
});

const loadSampleMaterials = () => {
  materialsStore.materials.push(
    {
      id: "P-02",
      name: "作者中年轮椅照",
      type: "image",
      category: "作者肖像",
      src: "/data/resource/pic/P-02.jpg",
      description: "史铁生中年坐在轮椅上的照片",
      tags: ["作者", "轮椅", "史铁生"],
      style: "纪实摄影",
      适用环节: ["背景介绍", "情感对比"],
    },
    {
      id: "P-03",
      name: "作者线描插画",
      type: "image",
      category: "作者肖像",
      src: "/data/resource/pic/P-03.jpg",
      description: "史铁生的线描风格插画",
      tags: ["作者", "插画", "艺术"],
      style: "线描插画",
      适用环节: ["导入", "装饰"],
    },
    {
      id: "P-04",
      name: "母亲慈祥照",
      type: "image",
      category: "母亲形象",
      src: "/data/resource/pic/P-04.jpg",
      description: "中年妇女慈祥微笑的照片",
      tags: ["母亲", "慈祥", "微笑"],
      style: "人物摄影",
      适用环节: ["人物分析", "情感理解"],
    },
    {
      id: "A-02",
      name: "母亲啜泣声",
      type: "audio",
      category: "环境音效",
      src: "/data/resource/audio/mother-cry.mp3",
      description: "母亲低声啜泣的音效",
      tags: ["母亲", "哭泣", "情感"],
      style: "情感音效",
      适用环节: ["情感渲染", "细节体会"],
    },
    {
      id: "V-01",
      name: "秋思·怀念意境短片",
      type: "video",
      category: "意境视频",
      src: "/data/resource/video/v-1.mp4",
      description: "秋日落叶、菊花盛开的意境短片，2分30秒",
      tags: ["秋天", "意境", "菊花"],
      style: "电影级实拍",
      适用环节: ["导入", "意象升华"],
    },
    {
      id: "I-01",
      name: "作者数字名片",
      type: "interactive",
      category: "交互工具",
      src: "/data/resource/interactive/author-card.html",
      description: "可交互的作者信息数字名片",
      tags: ["交互", "作者", "信息"],
      style: "HTML5交互",
      适用环节: ["预习", "导入"],
    },
  );
};

const handleCategoryChange = (category: string) => {
  materialsStore.filterByCategory(category);
};
const handleSearch = (keyword: string) => {
  materialsStore.searchMaterials(keyword);
};
const handleTypeChange = (type: string) => {
  currentType.value = type;
};
const handleUseMaterial = (material: MaterialItem) => {
  ElMessage.success(`已选择素材：${material.name}`);
};
const handlePreview = (material: MaterialItem) => {
  currentMaterial.value = material;
  showPreview.value = true;
};
const handleSelect = (material: MaterialItem) => {
  handlePreview(material);
};

// 加载素材清单
const loadMaterialList = async () => {
  materialListLoading.value = true;
  try {
    const response = await fetch("/data/busi/5. 《秋天的怀念》素材清单.md");
    if (!response.ok) {
      throw new Error("加载失败");
    }
    const markdownText = await response.text();
    materialListContent.value = md.render(markdownText);
  } catch (error) {
    ElMessage.error("加载素材清单失败");
    materialListContent.value = "<p>加载失败，请稍后重试</p>";
  } finally {
    materialListLoading.value = false;
  }
};


// 抽屉中的素材过滤
const drawerFilteredMaterials = computed(() => {
  let result = materialsStore.materials;

  // 类型筛选
  if (drawerTypeFilter.value !== "all") {
    result = result.filter((m) => m.type === drawerTypeFilter.value);
  }

  // 搜索筛选
  if (drawerSearchKeyword.value) {
    const keyword = drawerSearchKeyword.value.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(keyword) ||
        m.description.toLowerCase().includes(keyword) ||
        m.tags.some((tag) => tag.toLowerCase().includes(keyword)),
    );
  }

  return result;
});

const handleDrawerSearch = () => {
  // 搜索逻辑已在 computed 中处理
};

const handleDrawerTypeChange = () => {
  // 类型筛选逻辑已在 computed 中处理
};

const handleAddMaterial = (material: MaterialItem) => {
  // 将素材添加到素材库
  if (!materialsStore.materials.find((m) => m.id === material.id)) {
    materialsStore.materials.push(material);
    ElMessage.success(`已添加素材：${material.name}`);
  } else {
    ElMessage.info("该素材已存在");
  }
};

// 文件上传处理
const handleFileChange = (uploadFile: UploadFile) => {
  const file = uploadFile.raw;
  if (!file) return;

  // 验证文件大小（50MB）
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage.error("文件大小不能超过 50MB");
    return;
  }

  // 验证文件类型
  const validTypes = ["image", "audio", "video"];
  const fileType = file.type.split("/")[0];
  if (!validTypes.includes(fileType)) {
    ElMessage.error("只支持图片、音频、视频文件");
    return;
  }

  // 创建预览 URL
  const url = URL.createObjectURL(file);

  // 添加到上传列表
  uploadFiles.value.push({
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    url,
    materialName: file.name.replace(/\.[^/.]+$/, ""), // 默认使用文件名（不含扩展名）
    materialDesc: "",
  });
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// 确认上传
const handleConfirmUpload = (
  uploadFile: {
    file: File;
    name: string;
    size: number;
    type: string;
    url: string;
    materialName: string;
    materialDesc: string;
  },
  index: number,
) => {
  if (!uploadFile.materialName.trim()) {
    ElMessage.warning("请输入素材名称");
    return;
  }

  // 确定素材类型
  const fileType = uploadFile.type.split("/")[0];
  let materialType: "image" | "audio" | "video" | "interactive" = "image";
  if (fileType === "image") materialType = "image";
  else if (fileType === "audio") materialType = "audio";
  else if (fileType === "video") materialType = "video";

  // 生成素材 ID
  const materialId = `${materialType.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 创建素材对象
  // 注意：这里使用对象 URL，实际项目中应该上传到服务器并获取真实 URL
  const newMaterial: MaterialItem = {
    id: materialId,
    name: uploadFile.materialName,
    type: materialType,
    category: "自定义素材",
    src: uploadFile.url, // 使用对象 URL，实际应该使用服务器返回的 URL
    description: uploadFile.materialDesc || "用户上传的素材",
    tags: ["自定义", materialType === "image" ? "图片" : materialType === "audio" ? "音频" : "视频"],
    style: "用户上传",
    适用环节: ["通用"],
  };

  // 添加到素材库
  materialsStore.materials.push(newMaterial);
  ElMessage.success(`已添加素材：${uploadFile.materialName}`);

  // 移除上传列表中的文件
  handleRemoveUploadFile(index);
};

// 移除上传文件
const handleRemoveUploadFile = (index: number) => {
  const file = uploadFiles.value[index];
  // 释放对象 URL
  if (file.url) {
    URL.revokeObjectURL(file.url);
  }
  uploadFiles.value.splice(index, 1);
};
</script>

<style scoped lang="scss">
.material-library-view {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .toolbar {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    padding: 16px 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .type-filter {
    display: flex;
    gap: 12px;
    padding: 16px 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .material-content {
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-height: 400px;
  }
  .preview-content .image-preview-large {
    text-align: center;
    margin-bottom: 24px;
    img {
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .material-list-content {
    max-height: 600px;
    overflow-y: auto;
    padding: 16px;
    line-height: 1.8;

    :deep(h1),
    :deep(h2),
    :deep(h3) {
      margin-top: 24px;
      margin-bottom: 16px;
      color: #1a2332;
    }

    :deep(p) {
      margin-bottom: 12px;
    }

    :deep(ul),
    :deep(ol) {
      margin-bottom: 16px;
      padding-left: 24px;
    }

    :deep(li) {
      margin-bottom: 8px;
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;

      th,
      td {
        border: 1px solid #e4e7ed;
        padding: 8px 12px;
        text-align: left;
      }

      th {
        background-color: #f5f7fa;
        font-weight: 600;
      }
    }

    :deep(code) {
      background-color: #f5f7fa;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: "Courier New", monospace;
    }

    :deep(pre) {
      background-color: #f5f7fa;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 16px;
    }
  }

  .loading-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 48px;
    color: #4a90e2;
    font-size: 16px;

    .el-icon {
      font-size: 24px;
    }
  }

  .add-material-drawer {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);

    .drawer-upload {
      margin-bottom: 16px;

      :deep(.el-upload) {
        width: 100%;
      }

      :deep(.el-upload-dragger) {
        width: 100%;
        padding: 20px;
        border: 2px dashed #d9d9d9;
        border-radius: 6px;
        background-color: #fafafa;
        transition: all 0.3s;

        &:hover {
          border-color: #409eff;
        }
      }

      :deep(.el-icon--upload) {
        font-size: 48px;
        color: #409eff;
        margin-bottom: 16px;
      }

      :deep(.el-upload__text) {
        color: #606266;
        font-size: 14px;

        em {
          color: #409eff;
          font-style: normal;
        }
      }

      :deep(.el-upload__tip) {
        color: #909399;
        font-size: 12px;
        margin-top: 8px;
      }
    }

    .upload-files-list {
      margin-bottom: 16px;
      max-height: 300px;
      overflow-y: auto;

      .upload-file-item {
        display: flex;
        gap: 12px;
        padding: 12px;
        margin-bottom: 12px;
        background: #f5f7fa;
        border-radius: 8px;
        border: 1px solid #e4e7ed;

        .file-preview {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 4px;
          overflow: hidden;

          .preview-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .file-icon {
            font-size: 32px;
            color: #909399;
          }
        }

        .file-info {
          flex: 1;
          min-width: 0;

          .file-name {
            font-size: 14px;
            font-weight: 600;
            color: #1a2332;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .file-size {
            font-size: 12px;
            color: #909399;
            margin-bottom: 8px;
          }
        }

        .file-actions {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      }
    }

    .drawer-search {
      margin-bottom: 16px;
    }

    .drawer-type-filter {
      margin-bottom: 16px;

      :deep(.el-radio-group) {
        width: 100%;
        display: flex;
        gap: 8px;

        .el-radio-button {
          flex: 1;
        }
      }
    }

    .drawer-material-list {
      flex: 1;
      overflow-y: auto;
      padding-right: 8px;
      min-height: 0;

      .drawer-material-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        margin-bottom: 12px;
        background: #f5f7fa;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #e4e7ed;
          transform: translateX(-4px);
        }

        .material-item-icon {
          font-size: 32px;
          color: #4a90e2;
          flex-shrink: 0;
        }

        .material-item-info {
          flex: 1;
          min-width: 0;

          .material-item-name {
            font-size: 16px;
            font-weight: 600;
            color: #1a2332;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .material-item-desc {
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .material-item-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }
        }

        .material-item-action {
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
