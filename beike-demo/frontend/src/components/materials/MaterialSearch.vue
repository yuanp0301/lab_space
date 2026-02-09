<template>
  <div class="material-search">
    <el-input
      v-model="searchKeyword"
      placeholder="搜索素材名称、描述或标签..."
      clearable
      @input="handleSearch"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  search: [keyword: string];
}>();

const searchKeyword = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    searchKeyword.value = val;
  },
);

const handleSearch = () => {
  emit("update:modelValue", searchKeyword.value);
  emit("search", searchKeyword.value);
};
</script>

<style scoped lang="scss">
.material-search {
  width: 100%;

  :deep(.el-input__inner) {
    height: 40px;
  }
}
</style>
