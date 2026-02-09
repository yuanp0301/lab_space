<script setup lang="ts">
import { NAvatar } from "naive-ui";
</script>

<template>
  <div class="flex flex-col items-center text-center py-8">
    <div class="relative mb-6">
      <!-- 多层光晕效果 -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-2xl opacity-20"
      ></div>

      <!-- 头像容器 -->
      <div class="relative">
        <div
          class="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-xl opacity-50"
        ></div>
        <NAvatar
          :size="120"
          round
          :style="{
            background:
              'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            fontSize: '48px',
            position: 'relative',
            boxShadow:
              '0 20px 40px rgba(99, 102, 241, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.1)',
            border: '4px solid rgba(255, 255, 255, 0.2)',
          }"
        >
          <span class="relative z-10">🎓</span>
        </NAvatar>
      </div>
    </div>

    <h1
      class="mt-2 text-4xl font-bold text-[var(--text-primary)] tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text"
    >
      AI 助手
    </h1>
    <p
      class="mt-4 text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed font-medium"
    >
      智能对话，随时为你提供帮助
    </p>

    <!-- 装饰性元素 -->
    <div class="mt-6 flex items-center gap-2">
      <div
        class="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
      ></div>
      <div class="h-1 w-1 rounded-full bg-indigo-400"></div>
      <div
        class="h-1 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
      ></div>
    </div>
  </div>
</template>
