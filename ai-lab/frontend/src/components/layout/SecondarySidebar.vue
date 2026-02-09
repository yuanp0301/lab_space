<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NInput } from "naive-ui";
import { storeToRefs } from "pinia";
import { useSidebarStore } from "@/stores/sidebar";
import ConversationList from "./ConversationList.vue";

const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebarStore();
const { activeSection, expandedMenuId } = storeToRefs(sidebarStore);

// 定义菜单项和子菜单
const menuConfig = {
  chat: {
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
  image: {
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
};

const currentSubmenu = computed(() => {
  if (expandedMenuId.value === "chat") {
    return menuConfig.chat.submenu;
  }
  if (expandedMenuId.value === "image") {
    return menuConfig.image.submenu;
  }
  return [];
});

const shouldShowSubmenu = computed(() => {
  return (
    (expandedMenuId.value === "chat" || expandedMenuId.value === "image") &&
    currentSubmenu.value.length > 0
  );
});
</script>

<template>
  <Transition name="slide-fade">
    <div
      v-if="shouldShowSubmenu"
      class="absolute left-full top-0 h-full flex flex-col border-r border-[var(--border-light)] bg-white/95 backdrop-blur-xl shadow-xl z-10"
      :style="{ width: 'clamp(180px, 16vw, 240px)' }"
    >
      <!-- Submenu Items -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4 space-y-1">
          <button
            v-for="item in currentSubmenu"
            :key="item.id"
            class="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
            :class="[
              route.path === item.path ||
              (item.path === '/chat' && route.path === '/')
                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-800',
            ]"
            @click="router.push(item.path)"
          >
            <span
              class="h-1.5 w-1.5 rounded-full transition-all flex-shrink-0"
              :class="[
                route.path === item.path ||
                (item.path === '/chat' && route.path === '/')
                  ? 'bg-blue-500 shadow-sm'
                  : 'bg-gray-300 group-hover:bg-gray-400',
              ]"
            ></span>
            <span
              class="font-medium"
              :style="{ fontSize: 'clamp(0.75rem, 1.1vw, 0.875rem)' }"
              >{{ item.label }}</span
            >
          </button>
        </div>

        <!-- Search (only for chat section) -->
        <div
          v-if="expandedMenuId === 'chat'"
          class="border-t border-[var(--border-light)] p-4 bg-white/50"
        >
          <NInput
            placeholder="搜索对话..."
            size="medium"
            class="rounded-xl"
            :style="{ fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' }"
          >
            <template #prefix>
              <span
                class="text-gray-400"
                :style="{ fontSize: 'clamp(0.875rem, 1.3vw, 1.125rem)' }"
                >🔍</span
              >
            </template>
          </NInput>
        </div>

        <!-- Conversation List (only for chat section) -->
        <div
          v-if="expandedMenuId === 'chat'"
          class="flex-1 overflow-y-auto px-3 py-2"
        >
          <div
            class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3"
            :style="{ fontSize: 'clamp(0.625rem, 0.9vw, 0.75rem)' }"
          >
            最近对话
          </div>
          <ConversationList />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
