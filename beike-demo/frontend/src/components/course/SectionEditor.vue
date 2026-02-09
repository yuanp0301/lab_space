<template>
  <el-dialog
    v-model="visible"
    :title="isNew ? '添加教学环节' : '编辑教学环节'"
    width="800px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="环节名称" prop="title">
        <el-input v-model="formData.title" placeholder="请输入环节名称" />
      </el-form-item>

      <el-form-item label="主问题" prop="mainQuestion">
        <el-input
          v-model="formData.mainQuestion"
          type="textarea"
          :rows="3"
          placeholder="请输入主问题"
        />
      </el-form-item>

      <el-form-item label="子问题链">
        <div class="sub-questions">
          <div
            v-for="(question, index) in formData.subQuestions"
            :key="index"
            class="sub-question-item"
          >
            <el-input
              v-model="formData.subQuestions[index]"
              placeholder="请输入子问题"
            >
              <template #append>
                <el-button
                  @click="removeSubQuestion(index)"
                  :icon="Delete"
                  circle
                />
              </template>
            </el-input>
          </div>
          <el-button @click="addSubQuestion" :icon="Plus" size="small">
            添加子问题
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="教学活动" prop="activities">
        <el-input
          v-model="formData.activities"
          type="textarea"
          :rows="3"
          placeholder="描述教学活动形式"
        />
      </el-form-item>

      <el-form-item label="知识点">
        <el-select
          v-model="formData.knowledgePoints"
          multiple
          filterable
          allow-create
          placeholder="选择或输入知识点"
          style="width: 100%"
        >
          <el-option
            v-for="point in commonKnowledgePoints"
            :key="point"
            :label="point"
            :value="point"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="预期成果" prop="expectedOutcome">
        <el-input
          v-model="formData.expectedOutcome"
          type="textarea"
          :rows="2"
          placeholder="学生完成后的预期成果"
        />
      </el-form-item>

      <el-form-item label="验证方式" prop="verification">
        <el-input
          v-model="formData.verification"
          type="textarea"
          :rows="2"
          placeholder="如何验证学生达到预期"
        />
      </el-form-item>

      <el-form-item label="时长(分钟)" prop="duration">
        <el-input-number
          v-model="formData.duration"
          :min="1"
          :max="45"
          :step="5"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import type { Section } from "@/stores/course";

const props = defineProps<{
  modelValue: boolean;
  section?: Section;
  isNew?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [section: Partial<Section>];
}>();

const visible = ref(props.modelValue);
const formRef = ref<FormInstance>();

const formData = reactive<Partial<Section>>({
  title: "",
  mainQuestion: "",
  subQuestions: [],
  activities: "",
  knowledgePoints: [],
  expectedOutcome: "",
  verification: "",
  duration: 10,
});

const rules: FormRules = {
  title: [{ required: true, message: "请输入环节名称", trigger: "blur" }],
  mainQuestion: [{ required: true, message: "请输入主问题", trigger: "blur" }],
  activities: [{ required: true, message: "请输入教学活动", trigger: "blur" }],
  expectedOutcome: [
    { required: true, message: "请输入预期成果", trigger: "blur" },
  ],
  verification: [
    { required: true, message: "请输入验证方式", trigger: "blur" },
  ],
  duration: [{ required: true, message: "请输入时长", trigger: "blur" }],
};

const commonKnowledgePoints = [
  "字音字形",
  "词语理解",
  "文学常识",
  "情节分析",
  "人物形象",
  "主题思想",
  "写作手法",
  "细节描写",
  "朗读技巧",
];

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
    if (val && props.section) {
      Object.assign(formData, props.section);
    } else if (val && props.isNew) {
      resetForm();
    }
  },
);

watch(visible, (val) => {
  emit("update:modelValue", val);
});

const addSubQuestion = () => {
  if (!formData.subQuestions) {
    formData.subQuestions = [];
  }
  formData.subQuestions.push("");
};

const removeSubQuestion = (index: number) => {
  formData.subQuestions?.splice(index, 1);
};

const resetForm = () => {
  Object.assign(formData, {
    title: "",
    mainQuestion: "",
    subQuestions: [],
    activities: "",
    knowledgePoints: [],
    expectedOutcome: "",
    verification: "",
    duration: 10,
  });
  formRef.value?.clearValidate();
};

const handleClose = () => {
  visible.value = false;
  resetForm();
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (valid) {
      emit("save", { ...formData });
      handleClose();
    }
  });
};
</script>

<style scoped lang="scss">
.sub-questions {
  width: 100%;

  .sub-question-item {
    margin-bottom: 8px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
