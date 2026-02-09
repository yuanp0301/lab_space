<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSidebarStore, type SidebarSection } from "@/stores/sidebar";
import { storeToRefs } from "pinia";
import SecondarySidebar from "./SecondarySidebar.vue";

const router = useRouter();
const route = useRoute();
const sidebarStore = useSidebarStore();
const { expandedMenuId } = storeToRefs(sidebarStore);

// 初始化时根据路由展开对应菜单
onMounted(() => {
  const currentMenuId = activeMenuId.value;
  if (
    currentMenuId &&
    menuItems.find((item) => item.id === currentMenuId)?.submenu
  ) {
    sidebarStore.setExpandedMenuId(currentMenuId);
  }
});

type MenuItem = {
  id: string;
  icon: string;
  label: string;
  path?: string;
  submenu?: { id: string; label: string; path: string }[];
};

const menuItems: MenuItem[] = [
  {
    id: "chat",
    icon: "💬",
    label: "AI 助手",
    path: "/",
    submenu: [
      { id: "general-chat", label: "通用聊天", path: "/chat" },
      {
        id: "pdf-to-word",
        label: "PDF(支持图片)转Word",
        path: "/experiments/pdf-to-word",
      },
      {
        id: "html-assistant",
        label: "</> HTML助手",
        path: "/experiments/html-assistant",
      },
      {
        id: "chart-assistant",
        label: "图表助手",
        path: "/experiments/chart-assistant",
      },
      {
        id: "prompt-market",
        label: "提示词市场",
        path: "/experiments/prompt-market",
      },
      {
        id: "knowledge-base",
        label: "智能知识库",
        path: "/experiments/knowledge-base",
      },
    ],
  },
  {
    id: "image",
    icon: "🖼️",
    label: "AI 图片",
    path: "/experiments/image-chat",
    submenu: [
      {
        id: "dream-image",
        label: "即梦生图",
        path: "/experiments/dream-image",
      },
      {
        id: "image-upscale",
        label: "图片放大",
        path: "/experiments/image-upscale",
      },
      { id: "ai-matting", label: "AI抠图", path: "/experiments/ai-matting" },
      {
        id: "image-to-desc",
        label: "图片转描述",
        path: "/experiments/image-to-desc",
      },
      {
        id: "public-gallery",
        label: "公共画廊",
        path: "/experiments/public-gallery",
      },
      { id: "my-works", label: "我的作品", path: "/experiments/my-works" },
    ],
  },
  { id: "audio", icon: "🎵", label: "AI 音频", path: "/experiments/audio" },
  { id: "video", icon: "🎬", label: "AI 视频", path: "/experiments/video" },
  { id: "course", icon: "🎓", label: "AI 课程", path: "/experiments/course" },
  {
    id: "community",
    icon: "⭐",
    label: "AI 社区",
    path: "/experiments/community",
  },
];

const activeMenuId = computed(() => {
  if (route.path === "/" || route.path.startsWith("/chat")) {
    return "chat";
  }
  // 检查是否匹配子菜单路径
  for (const item of menuItems) {
    if (item.submenu) {
      const matched = item.submenu.find(
        (sub) => route.path === sub.path || route.path.startsWith(sub.path),
      );
      if (matched) {
        return item.id;
      }
    }
    if (item.path && route.path.startsWith(item.path)) {
      return item.id;
    }
  }
  return "";
});

const handleClick = (item: MenuItem) => {
  // 切换二级菜单显示
  if (item.submenu && item.submenu.length > 0) {
    expandedMenuId.value = expandedMenuId.value === item.id ? null : item.id;
    // 设置当前展开的菜单ID到store
    sidebarStore.setExpandedMenuId(expandedMenuId.value);
  } else {
    expandedMenuId.value = null;
    sidebarStore.setExpandedMenuId(null);
  }

  if (item.id === "chat") {
    sidebarStore.setActiveSection("chat");
  } else {
    sidebarStore.setActiveSection("experiments");
  }

  // 如果没有子菜单，直接跳转
  if (!item.submenu && item.path) {
    router.push(item.path);
  }
};

const isActive = (item: MenuItem) => {
  return activeMenuId.value === item.id;
};

const isExpanded = (item: MenuItem) => {
  return expandedMenuId.value === item.id;
};
</script>

<template>
  <div
    class="relative flex h-full flex-col border-r border-[var(--border-light)] bg-white/95 backdrop-blur-xl shadow-sm"
    :style="{ width: 'clamp(60px, 8vw, 90px)' }"
  >
    <!-- Logo -->
    <div
      class="flex flex-col items-center gap-2 px-2 py-4 border-b border-[var(--border-light)]"
    >
      <div
        class="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-2xl font-bold shadow-lg"
      >
        <div
          class="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"
        ></div>
        <span class="relative leading-none">👁️👁️</span>
      </div>
      <div class="flex flex-col items-center">
        <span
          class="font-bold text-[var(--text-primary)] tracking-tight text-center leading-tight"
          :style="{ fontSize: 'clamp(0.625rem, 1vw, 0.75rem)' }"
          >学科网·AI实验室</span
        >
      </div>
    </div>

    <!-- Menu Items -->
    <div class="flex-1 overflow-y-auto py-3 px-2">
      <div v-for="item in menuItems" :key="item.id" class="mb-2">
        <button
          class="group relative flex flex-col items-center justify-center gap-1.5 w-full rounded-xl px-2 py-3 transition-all duration-200"
          :class="[
            isActive(item)
              ? 'bg-gradient-to-b from-indigo-50 to-purple-50 text-indigo-700 font-semibold shadow-sm'
              : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900',
          ]"
          @click="handleClick(item)"
        >
          <span
            class="leading-none"
            :style="{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }"
            >{{ item.icon }}</span
          >
          <span
            class="font-medium text-center leading-tight"
            :style="{ fontSize: 'clamp(0.625rem, 0.9vw, 0.75rem)' }"
            >{{ item.label }}</span
          >
          <div
            v-if="isActive(item)"
            class="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-500 to-purple-500"
          ></div>
        </button>
      </div>
    </div>

    <!-- User Icon at Bottom -->
    <div class="border-t border-[var(--border-light)] p-3 flex justify-center">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        :style="{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }"
      >
        👤
      </div>
    </div>

    <!-- Secondary Sidebar (绝对定位在一级菜单旁边) -->
    <SecondarySidebar />
  </div>
</template>
