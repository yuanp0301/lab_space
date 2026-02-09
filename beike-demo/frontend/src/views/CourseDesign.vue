<template>
  <div class="course-design-view">
    <div class="page-header">
      <div class="header-left">
        <h1>课程设计</h1>
        <p class="subtitle">《秋天的怀念》情境任务式课程设计</p>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleSave">
          <el-icon><DocumentCopy /></el-icon>
          保存课程设计
        </el-button>
        <el-button @click="handleNewCourseDesign">
          <el-icon><Plus /></el-icon>
          新增课程设计
        </el-button>
        <el-button type="success" @click="handleGenerateSlides">
          <el-icon><MagicStick /></el-icon>
          生成课件
        </el-button>
      </div>
    </div>

    <div class="toolbar">
      <div class="view-switcher">
        <el-radio-group
          v-model="courseStore.currentView"
          @change="handleViewChange"
        >
          <el-radio-button value="table">
            <el-icon><Grid /></el-icon>
            表格视图
          </el-radio-button>
          <el-radio-button value="card">
            <el-icon><Postcard /></el-icon>
            卡片视图
          </el-radio-button>
          <el-radio-button value="timeline">
            <el-icon><Clock /></el-icon>
            时间轴视图
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="toolbar-actions">
        <el-button @click="handleAddSection">
          <el-icon><Plus /></el-icon>
          添加环节
        </el-button>
        <el-button @click="handleEvaluate">
          <el-icon><MagicStick /></el-icon>
          AI评估
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeLesson" type="border-card" class="lesson-tabs">
      <el-tab-pane label="第一课时：整体感知·初探张力" name="lesson1">
        <div v-if="courseStore.isLoading" class="loading">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>

        <div v-else class="lesson-content">
          <TableView
            v-if="courseStore.currentView === 'table'"
            :sections="lesson1Sections"
            @edit="handleEdit"
            @ai-optimize="handleAIOptimize"
            @recommend-materials="handleRecommendMaterials"
          />
          <CardView
            v-else-if="courseStore.currentView === 'card'"
            :sections="lesson1Sections"
            @edit="handleEdit"
            @ai-optimize="handleAIOptimize"
            @recommend-materials="handleRecommendMaterials"
          />
          <TimelineView
            v-else
            :sections="lesson1Sections"
            @edit="handleEdit"
            @ai-optimize="handleAIOptimize"
            @recommend-materials="handleRecommendMaterials"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="第二课时：细读品味·领悟升华" name="lesson2">
        <div v-if="courseStore.isLoading" class="loading">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>

        <div v-else class="lesson-content">
          <TableView
            v-if="courseStore.currentView === 'table'"
            :sections="lesson2Sections"
            @edit="handleEdit"
            @ai-optimize="handleAIOptimize"
            @recommend-materials="handleRecommendMaterials"
          />
          <CardView
            v-else-if="courseStore.currentView === 'card'"
            :sections="lesson2Sections"
            @edit="handleEdit"
            @ai-optimize="handleAIOptimize"
            @recommend-materials="handleRecommendMaterials"
          />
          <TimelineView
            v-else
            :sections="lesson2Sections"
            @edit="handleEdit"
            @ai-optimize="handleAIOptimize"
            @recommend-materials="handleRecommendMaterials"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 环节编辑器 -->
    <SectionEditor
      v-model="showEditor"
      :section="currentSection"
      :is-new="isNewSection"
      @save="handleSaveSection"
    />

    <!-- 保存对话框 -->
    <el-dialog v-model="showSaveDialog" title="保存课程设计" width="400px">
      <el-form>
        <el-form-item label="用户名">
          <el-input
            v-model="saveUsername"
            placeholder="请输入您的姓名"
            autofocus
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSaveDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  DocumentCopy,
  Grid,
  Postcard,
  Clock,
  Plus,
  MagicStick,
  Loading,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useCourseStore, type Section } from "@/stores/course";
import { useUserStore } from "@/stores/user";
import TableView from "@/components/course/TableView.vue";
import CardView from "@/components/course/CardView.vue";
import TimelineView from "@/components/course/TimelineView.vue";
import SectionEditor from "@/components/course/SectionEditor.vue";
import { evaluateCourseDesign } from "@/utils/aiService";

const router = useRouter();
const courseStore = useCourseStore();
const userStore = useUserStore();

const activeLesson = ref<"lesson1" | "lesson2">("lesson1");
const showEditor = ref(false);
const currentSection = ref<Section>();
const isNewSection = ref(false);
const showSaveDialog = ref(false);
const saveUsername = ref("");

const lesson1Sections = computed(
  () => courseStore.courseData?.courseDesign.lesson1.sections || [],
);

const lesson2Sections = computed(
  () => courseStore.courseData?.courseDesign.lesson2.sections || [],
);

onMounted(async () => {
  await courseStore.loadCourseDesign();
  // 加载示例数据
  loadSampleData();
});

const loadSampleData = () => {
  if (!courseStore.courseData) return;

  // 为演示添加一些示例环节
  courseStore.courseData.courseDesign.lesson1.sections = [
    {
      id: "1-1",
      title: "导入新课",
      mainQuestion: "什么样的秋天让作者如此怀念？",
      subQuestions: ["从标题中你能获取哪些信息？", "作者是谁？你了解他吗？"],
      activities: "播放秋日意境视频，展示作者简介，引发学生思考",
      knowledgePoints: ["文学常识", "标题理解"],
      expectedOutcome: "学生对作者和文章背景有初步了解",
      verification: "学生能简单介绍作者史铁生",
      duration: 5,
    },
    {
      id: "1-2",
      title: "初读课文",
      mainQuestion: "文章讲述了一个怎样的故事？",
      subQuestions: ["文中出现了哪些人物？", "围绕什么事件展开叙述？"],
      activities: "学生自由朗读，圈画生字词，梳理故事情节",
      knowledgePoints: ["字音字形", "情节梳理"],
      expectedOutcome: "学生能概括文章主要内容",
      verification: "学生用一句话概括故事",
      duration: 10,
    },
    {
      id: "1-3",
      title: "梳理情感脉络",
      mainQuestion: '母亲为什么多次提出"看花"？"我"的态度有什么变化？',
      subQuestions: [
        '找出文中"看花"出现的位置',
        '"我"对看花的态度分别是什么？',
        "这种变化说明了什么？",
      ],
      activities: "小组合作，绘制双线脉络图（看花明线+情感暗线）",
      knowledgePoints: ["情节分析", "情感理解", "双线结构"],
      expectedOutcome: "学生绘制出双线脉络图",
      verification: "小组展示脉络图并讲解",
      duration: 15,
    },
  ];

  courseStore.courseData.courseDesign.lesson2.sections = [
    {
      id: "2-1",
      title: "细节品析（一）",
      mainQuestion: '母亲的动作"悄悄地"出现了几次？体现了什么？',
      subQuestions: [
        '找出所有"悄悄地"的句子',
        '为什么要"悄悄地"？',
        "这反映了母爱的什么特点？",
      ],
      activities: '分组讨论，填写"细节解码分析单"',
      knowledgePoints: ["细节描写", "人物形象"],
      expectedOutcome: "学生理解母爱的隐忍与小心翼翼",
      verification: "学生分享解码单内容",
      duration: 12,
    },
    {
      id: "2-2",
      title: "意象升华",
      mainQuestion: "文章结尾的菊花有什么象征意义？",
      subQuestions: [
        "菊花的颜色分别象征什么？",
        '"好好儿活"在文中出现了几次？',
        '你如何理解"好好儿活"？',
      ],
      activities: '独立思考，完成"意象感悟卡"',
      knowledgePoints: ["象征手法", "主题思想"],
      expectedOutcome: "学生理解生命的意义",
      verification: "学生朗读感悟卡",
      duration: 10,
    },
  ];
};

const handleViewChange = (view: string) => {
  courseStore.setView(view as "table" | "card" | "timeline");
};

const handleEdit = (section: Section) => {
  currentSection.value = section;
  isNewSection.value = false;
  showEditor.value = true;
};

const handleAddSection = () => {
  currentSection.value = undefined;
  isNewSection.value = true;
  showEditor.value = true;
};

const handleSaveSection = (data: Partial<Section>) => {
  if (isNewSection.value) {
    const newSection: Section = {
      id: `${activeLesson.value}-${Date.now()}`,
      title: data.title || "",
      mainQuestion: data.mainQuestion || "",
      subQuestions: data.subQuestions || [],
      activities: data.activities || "",
      knowledgePoints: data.knowledgePoints || [],
      expectedOutcome: data.expectedOutcome || "",
      verification: data.verification || "",
      duration: data.duration || 10,
    };
    courseStore.addSection(
      activeLesson.value === "lesson1" ? 1 : 2,
      newSection,
    );
    ElMessage.success("添加成功");
  } else if (currentSection.value) {
    courseStore.updateSection(
      activeLesson.value === "lesson1" ? 1 : 2,
      currentSection.value.id,
      data,
    );
    ElMessage.success("保存成功");
  }
};

const handleAIOptimize = async (section: Section) => {
  ElMessage.info("AI优化功能开发中...");
  // TODO: 调用AI优化
};

const handleRecommendMaterials = (section: Section) => {
  ElMessage.info("素材推荐功能开发中...");
  // TODO: 打开素材推荐对话框
};

const handleEvaluate = async () => {
  try {
    ElMessage.info("AI正在评估您的课程设计，请稍候...");
    // TODO: 调用AI评估
    const result = await evaluateCourseDesign(
      JSON.stringify(courseStore.courseData?.courseDesign),
      "参考教学理论...",
    );
    ElMessageBox.alert(result, "AI评估结果", {
      confirmButtonText: "知道了",
      type: "info",
    });
  } catch (error) {
    ElMessage.error("评估失败，请稍后再试");
  }
};

const handleSave = () => {
  if (userStore.username) {
    saveUsername.value = userStore.username;
    confirmSave();
  } else {
    showSaveDialog.value = true;
  }
};

const confirmSave = async () => {
  if (!saveUsername.value.trim()) {
    ElMessage.warning("请输入用户名");
    return;
  }

  try {
    await courseStore.saveCourseDesign(saveUsername.value);
    userStore.setUsername(saveUsername.value);
    showSaveDialog.value = false;
    ElMessage.success("保存成功");
  } catch (error) {
    ElMessage.error("保存失败");
  }
};

const handleGenerateSlides = () => {
  if (!courseStore.courseData) {
    ElMessage.warning("请先完成课程设计");
    return;
  }

  // 跳转到课件生成页面，并传递标识
  router.push({
    path: "/slide-generator",
    query: {
      from: "course-design",
    },
  });
};

const handleNewCourseDesign = async () => {
  try {
    await ElMessageBox.confirm(
      "创建新的课程设计将清空当前所有内容，是否继续？",
      "确认新建",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    // 重置课程设计数据
    await courseStore.loadCourseDesign();
    activeLesson.value = "lesson1";
    ElMessage.success("已创建新的课程设计");
  } catch (error) {
    // 用户取消操作
    if (error !== "cancel") {
      ElMessage.error("操作失败");
    }
  }
};
</script>

<style scoped lang="scss">
.course-design-view {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .header-left {
      h1 {
        margin: 0 0 8px 0;
        color: #1a2332;
        font-size: 28px;
      }

      .subtitle {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .view-switcher {
      flex: 1;
    }

    .toolbar-actions {
      display: flex;
      gap: 8px;
    }
  }

  .lesson-tabs {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .lesson-content {
      padding: 24px;
      min-height: 400px;
    }

    .loading {
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
  }
}
</style>
