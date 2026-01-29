<script setup lang="ts">
import { NAvatar } from "naive-ui";
</script>

<template>
  <div class="flex flex-col items-center text-center py-8">
    <NAvatar
      :size="80"
      round
      :style="{
        backgroundColor: '#4F8CFF',
        fontSize: '32px',
      }"
    >
      AI
    </NAvatar>
    <h1 class="mt-4 text-2xl font-semibold text-[var(--text-primary)]">
      你好，我是 AI 助手
    </h1>
    <p class="mt-2 text-[var(--text-secondary)] max-w-md">
      我可以帮你回答问题、写代码、分析数据、创作内容等。有什么可以帮到你的吗？
    </p>
  </div>
</template>
