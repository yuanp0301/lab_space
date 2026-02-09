<template>
  <header class="app-header">
    <div class="logo">📚 备课助手</div>
    <div class="title">《秋天的怀念》- 课程设计Demo</div>
    <div class="spacer"></div>
    <div class="user-info" v-if="userStore.username">
      <el-icon><User /></el-icon>
      <span>{{ userStore.username }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { User } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>

<style scoped lang="scss">
.app-header {
  height: 64px;
  background-color: #1a2332;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;

  .logo {
    font-size: 20px;
    font-weight: bold;
    margin-right: 24px;
  }

  .title {
    font-size: 18px;
  }

  .spacer {
    flex: 1;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
}
</style>
