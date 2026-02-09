<template>
  <div class="slide-design-editor">
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
        <el-input-number v-model="designData.totalPages" :min="10" :max="50" />
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
              <el-input v-model="module.title" placeholder="如:导入环节" />
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
              <el-input-number v-model="module.pages" :min="1" :max="10" />
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
      <el-button type="primary" :loading="isGenerating" @click="handleGenerate">
        生成课件
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";

type Props = {
  lessonTitle: string;
};

type Emits = {
  generate: [designData: any];
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

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

// 设计数据
const designData = reactive<DesignData>({
  lessonTitle: props.lessonTitle,
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

const isGenerating = ref(false);

// 添加模块
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

// 删除模块
const handleDeleteModule = (index: number) => {
  if (designData.modules.length <= 1) {
    ElMessage.warning("至少保留一个模块");
    return;
  }
  designData.modules.splice(index, 1);
};

// 保存设计思路
const handleSaveDesign = () => {
  // TODO: 保存到本地或服务器
  ElMessage.success("设计思路已保存");
};

// 生成课件
const handleGenerate = async () => {
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
    // 延迟模拟生成
    await new Promise((resolve) => setTimeout(resolve, 2000));
    emit("generate", designData);
    ElMessage.success("开始生成课件...");
  } catch (error) {
    ElMessage.error("生成失败,请重试");
  } finally {
    isGenerating.value = false;
  }
};

// 取消
const handleCancel = () => {
  ElMessage.info("已取消");
};
</script>

<style scoped lang="scss">
.slide-design-editor {
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
  }
}
</style>
