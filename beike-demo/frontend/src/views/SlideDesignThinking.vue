<template>
  <div class="slide-design-thinking">
    <div class="page-header">
      <h1>{{ courseTitle }}</h1>
      <p class="subtitle">课件设计思路</p>
    </div>

    <div class="content">
      <!-- 标签页切换 -->
      <el-tabs v-model="activeTab" class="design-tabs">
        <!-- 结构化编辑模式 -->
        <el-tab-pane label="结构化编辑" name="structure">
          <div class="structure-editor">
            <el-alert
              type="info"
              :closable="false"
              style="margin-bottom: 20px"
              title="课件设计思路"
              description="根据35页课件设计思路模板,填写或编辑课件结构,AI将基于此生成完整课件"
            />

            <el-form :model="designData" label-width="120px">
              <!-- 基本信息 -->
              <el-divider content-position="left">
                <el-tag type="primary">基本信息</el-tag>
              </el-divider>

              <el-form-item label="课程名称">
                <el-input v-model="designData.lessonTitle" disabled />
              </el-form-item>

              <el-form-item label="总页数">
                <el-input-number
                  v-model="designData.totalPages"
                  :min="10"
                  :max="50"
                />
              </el-form-item>

              <el-form-item label="课件风格">
                <el-select v-model="designData.style" placeholder="请选择风格">
                  <el-option label="简约现代" value="modern" />
                  <el-option label="温馨人文" value="warm" />
                  <el-option label="商务专业" value="business" />
                  <el-option label="活泼生动" value="lively" />
                </el-select>
              </el-form-item>

              <!-- 课件结构 -->
              <el-divider content-position="left">
                <el-tag type="success">课件结构</el-tag>
              </el-divider>

              <el-form-item label="课件模块">
                <el-button
                  type="primary"
                  :icon="Plus"
                  size="small"
                  @click="handleAddModule"
                >
                  添加模块
                </el-button>
              </el-form-item>

              <!-- 模块列表 -->
              <div class="modules-list">
                <el-card
                  v-for="(module, index) in designData.modules"
                  :key="index"
                  class="module-card"
                  shadow="hover"
                >
                  <template #header>
                    <div class="card-header">
                      <span>模块 {{ index + 1 }}: {{ module.title }}</span>
                      <el-button
                        type="danger"
                        :icon="Delete"
                        size="small"
                        circle
                        @click="handleDeleteModule(index)"
                      />
                    </div>
                  </template>

                  <el-form :model="module" label-width="100px">
                    <el-form-item label="模块标题">
                      <el-input
                        v-model="module.title"
                        placeholder="如:导入环节"
                      />
                    </el-form-item>

                    <el-form-item label="页面类型">
                      <el-select v-model="module.type" placeholder="请选择类型">
                        <el-option label="标题页" value="title" />
                        <el-option label="目录页" value="catalog" />
                        <el-option label="讲解页" value="lecture" />
                        <el-option label="互动页" value="interactive" />
                        <el-option label="过渡页" value="transition" />
                        <el-option label="总结页" value="summary" />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="页数">
                      <el-input-number
                        v-model="module.pages"
                        :min="1"
                        :max="10"
                      />
                    </el-form-item>

                    <el-form-item label="内容要点">
                      <el-input
                        v-model="module.content"
                        type="textarea"
                        :rows="3"
                        placeholder="描述本模块的核心内容和教学要点"
                      />
                    </el-form-item>

                    <el-form-item label="素材需求">
                      <el-checkbox-group v-model="module.materials">
                        <el-checkbox label="图片">图片</el-checkbox>
                        <el-checkbox label="视频">视频</el-checkbox>
                        <el-checkbox label="音频">音频</el-checkbox>
                        <el-checkbox label="互动元素">互动元素</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="教学活动">
                      <el-input
                        v-model="module.activity"
                        type="textarea"
                        :rows="2"
                        placeholder="如:小组讨论、角色扮演、案例分析等"
                      />
                    </el-form-item>
                  </el-form>
                </el-card>
              </div>

              <!-- 教学建议 -->
              <el-divider content-position="left">
                <el-tag type="warning">教学建议</el-tag>
              </el-divider>

              <el-form-item label="教学重点">
                <el-input
                  v-model="designData.teachingFocus"
                  type="textarea"
                  :rows="3"
                  placeholder="描述本课的教学重点"
                />
              </el-form-item>

              <el-form-item label="教学难点">
                <el-input
                  v-model="designData.teachingDifficulty"
                  type="textarea"
                  :rows="3"
                  placeholder="描述本课的教学难点"
                />
              </el-form-item>

              <el-form-item label="学情分析">
                <el-input
                  v-model="designData.studentAnalysis"
                  type="textarea"
                  :rows="3"
                  placeholder="分析学生的基础情况和可能遇到的问题"
                />
              </el-form-item>

              <!-- AI生成选项 -->
              <el-divider content-position="left">
                <el-tag type="info">生成选项</el-tag>
              </el-divider>

              <el-form-item label="是否生成素材">
                <el-switch v-model="designData.generateMaterials" />
                <span style="margin-left: 10px; color: #909399">
                  自动生成配套的图片、视频等素材
                </span>
              </el-form-item>

              <el-form-item label="是否生成活动">
                <el-switch v-model="designData.generateActivities" />
                <span style="margin-left: 10px; color: #909399">
                  自动生成教学活动和互动环节
                </span>
              </el-form-item>

              <el-form-item label="详细程度">
                <el-radio-group v-model="designData.detailLevel">
                  <el-radio label="simple">简洁</el-radio>
                  <el-radio label="normal">适中</el-radio>
                  <el-radio label="detailed">详细</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>

            <!-- 操作按钮 -->
            <div class="actions">
              <el-button @click="handleCancel">取消</el-button>
              <el-button type="info" @click="handleSaveDesign">
                保存设计思路
              </el-button>
              <el-button
                type="primary"
                :loading="isGenerating"
                @click="handleGenerateFromDesign"
              >
                生成课件
              </el-button>
            </div>
          </div>
        </el-tab-pane>

        <!-- 逐页展示模式 -->
        <el-tab-pane label="逐页展示" name="slides">
          <div class="slides-view">
            <p class="view-subtitle">正在为您逐页整理PPT...</p>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Edit, Lightning, Plus, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { slideApi, type SlideData as ApiSlideData } from "@/api/slide.api";
import { useSlidesStore } from "@/stores/slides";
import { useCourseStore } from "@/stores/course";

interface SlideData extends ApiSlideData {
  loading?: boolean;
}

// 设计数据类型
type DesignModule = {
  title: string;
  type: string;
  pages: number;
  content: string;
  materials: string[];
  activity: string;
};

type DesignData = {
  lessonTitle: string;
  totalPages: number;
  style: string;
  modules: DesignModule[];
  teachingFocus: string;
  teachingDifficulty: string;
  studentAnalysis: string;
  generateMaterials: boolean;
  generateActivities: boolean;
  detailLevel: string;
};

const route = useRoute();
const router = useRouter();
const slidesStore = useSlidesStore();
const courseStore = useCourseStore();

const activeTab = ref<"structure" | "slides">("structure");
const courseTitle = ref("《秋天的怀念》");
const allSlides = ref<SlideData[]>([]);
const currentPage = ref(1);
const pageSize = 9; // 每页显示9个卡片
const fileName = "6. 《秋天的怀念》课件设计思路.md"; // 文件名
const isGenerating = ref(false);

// 设计数据
const designData = reactive<DesignData>({
  lessonTitle: courseTitle.value,
  totalPages: 35,
  style: "modern",
  modules: [
    {
      title: "封面页",
      type: "title",
      pages: 1,
      content: "课程标题、教师姓名",
      materials: ["图片"],
      activity: "",
    },
    {
      title: "导入环节",
      type: "transition",
      pages: 2,
      content: "创设情境,引入课题",
      materials: ["图片", "视频"],
      activity: "情境导入、提问思考",
    },
    {
      title: "核心讲解",
      type: "lecture",
      pages: 15,
      content: "重点知识讲解、案例分析",
      materials: ["图片", "互动元素"],
      activity: "讲解、示范、练习",
    },
    {
      title: "互动探究",
      type: "interactive",
      pages: 10,
      content: "小组讨论、实践活动",
      materials: ["互动元素"],
      activity: "小组讨论、角色扮演、案例分析",
    },
    {
      title: "总结提升",
      type: "summary",
      pages: 5,
      content: "知识总结、拓展延伸",
      materials: ["图片"],
      activity: "总结回顾、拓展思考",
    },
    {
      title: "作业布置",
      type: "summary",
      pages: 2,
      content: "课后作业、思考题",
      materials: [],
      activity: "",
    },
  ],
  teachingFocus: "",
  teachingDifficulty: "",
  studentAnalysis: "",
  generateMaterials: true,
  generateActivities: true,
  detailLevel: "normal",
});

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
    // 如果是从课件生成页面跳转过来的，则跳转回去
    const from = route.query.from as string;
    if (from === "slide-generator" || from === "course-design") {
      router.push({
        path: "/slide-generator",
      });
    }
  }
};

// 结构化编辑相关函数
const handleAddModule = () => {
  designData.modules.push({
    title: "新模块",
    type: "lecture",
    pages: 1,
    content: "",
    materials: [],
    activity: "",
  });
};

const handleDeleteModule = (index: number) => {
  if (designData.modules.length <= 1) {
    ElMessage.warning("至少保留一个模块");
    return;
  }
  designData.modules.splice(index, 1);
};

const handleSaveDesign = () => {
  // TODO: 保存到本地或服务器
  ElMessage.success("设计思路已保存");
};

const handleGenerateFromDesign = async () => {
  // 验证总页数
  const totalModulePages = designData.modules.reduce(
    (sum, m) => sum + m.pages,
    0,
  );
  if (totalModulePages !== designData.totalPages) {
    ElMessage.warning(
      `模块总页数(${totalModulePages})与设定总页数(${designData.totalPages})不一致`,
    );
    return;
  }

  isGenerating.value = true;
  try {
    await slidesStore.generateFromDesign(designData);
    ElMessage.success("开始生成课件...");
    // 跳转回课件生成页面
    router.push({
      path: "/slide-generator",
    });
  } catch (error) {
    ElMessage.error("生成失败,请重试");
  } finally {
    isGenerating.value = false;
  }
};

const handleCancel = () => {
  const from = route.query.from as string;
  if (from === "slide-generator" || from === "course-design") {
    router.push({
      path: "/slide-generator",
    });
  } else {
    router.back();
  }
};

onMounted(async () => {
  const query = route.query;
  if (query.title) {
    courseTitle.value = query.title as string;
    designData.lessonTitle = query.title as string;
  }

  // 如果是从课程设计页面跳转过来的，使用课程设计的标题
  if (query.from === "course-design" && courseStore.courseData) {
    courseTitle.value = courseStore.courseData.lessonTitle;
    designData.lessonTitle = courseStore.courseData.lessonTitle;
  }

  // 使用后端API加载数据
  await loadSlideDesign();

  // 如果数据加载成功，更新标题为第一页的标题
  if (allSlides.value.length > 0 && allSlides.value[0].title1) {
    const firstTitle = allSlides.value[0].title1;
    if (firstTitle.includes("《") && firstTitle.includes("》")) {
      courseTitle.value = firstTitle;
      designData.lessonTitle = firstTitle;
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

    .design-tabs {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      .structure-editor {
        .modules-list {
          margin-bottom: 24px;

          .module-card {
            margin-bottom: 16px;

            .card-header {
              display: flex;
              justify-content: space-between;
              align-items: center;

              span {
                font-weight: 600;
                font-size: 16px;
              }
            }
          }
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid #e4e7ed;
          margin-top: 24px;
        }
      }

      .slides-view {
        .view-subtitle {
          margin: 0 0 24px 0;
          color: #666;
          font-size: 16px;
        }

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
          margin-top: 24px;

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
