<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    class="group relative flex flex-col items-start gap-4 rounded-2xl bg-white p-6 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-[var(--border-light)] w-full hover:border-indigo-200/50 overflow-hidden"
    @click="$emit('click')"
  >
    <!-- 背景渐变效果 -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-indigo-50/50 group-hover:via-purple-50/30 group-hover:to-pink-50/50 transition-all duration-300"
    ></div>

    <!-- 图标容器 -->
    <div class="relative z-10">
      <div
        class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-md"
      >
        <span class="relative z-10">{{ icon }}</span>
        <div
          class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent"
        ></div>
      </div>
    </div>

    <!-- 内容 -->
    <div class="relative z-10 flex-1 w-full">
      <h3
        class="font-bold text-[var(--text-primary)] text-base mb-2 group-hover:text-indigo-700 transition-colors"
      >
        {{ title }}
      </h3>
      <p
        class="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 font-medium"
      >
        {{ description }}
      </p>
    </div>

    <!-- 装饰性箭头 -->
    <div
      class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <svg
        class="w-5 h-5 text-indigo-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </div>
  </button>
</template>
