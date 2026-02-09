<template>
  <div class="placeholder-view">
    <el-empty :description="description">
      <template #image>
        <div class="icon">{{ icon }}</div>
      </template>
      <el-button type="primary">即将推出</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  description: string;
}>();
</script>

<style scoped lang="scss">
.placeholder-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;

  .icon {
    font-size: 120px;
    margin-bottom: 24px;
  }
}
</style>
