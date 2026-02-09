<script setup lang="ts">
import { useRouter } from "vue-router";
import { NEmpty } from "naive-ui";
import { storeToRefs } from "pinia";
import { useSidebarStore } from "@/stores/sidebar";

const router = useRouter();
const sidebarStore = useSidebarStore();
const { sortedConversations, currentConversationId } =
  storeToRefs(sidebarStore);

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (days === 1) {
    return "昨天";
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  }
};

const handleSelect = (id: string) => {
  sidebarStore.setCurrentConversation(id);
  router.push("/chat");
};

const handleDelete = (e: Event, id: string) => {
  e.stopPropagation();
  sidebarStore.deleteConversation(id);
};
</script>

<template>
  <div class="px-2">
    <NEmpty
      v-if="sortedConversations.length === 0"
      size="small"
      description="暂无对话"
      class="py-8"
    />

    <div v-else class="space-y-1">
      <button
        v-for="conv in sortedConversations"
        :key="conv.id"
        class="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 hover:shadow-sm"
        :class="[
          conv.id === currentConversationId
            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100'
            : 'text-[var(--text-secondary)] hover:bg-gray-50/80',
        ]"
        @click="handleSelect(conv.id)"
      >
        <div
          class="flex items-center justify-center rounded-lg"
          :class="[
            conv.id === currentConversationId
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-gray-100 text-gray-500',
          ]"
          :style="{
            height: 'clamp(2rem, 3vw, 2.25rem)',
            width: 'clamp(2rem, 3vw, 2.25rem)',
            fontSize: 'clamp(0.875rem, 1.3vw, 1rem)',
          }"
        >
          💬
        </div>
        <div class="flex-1 min-w-0">
          <div
            class="truncate font-semibold mb-0.5"
            :style="{ fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' }"
          >
            {{ conv.title }}
          </div>
          <div
            class="truncate"
            :class="
              conv.id === currentConversationId
                ? 'text-indigo-500'
                : 'text-gray-400'
            "
            :style="{ fontSize: 'clamp(0.625rem, 0.85vw, 0.75rem)' }"
          >
            {{ conv.preview || "无消息" }}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="font-medium"
            :class="
              conv.id === currentConversationId
                ? 'text-indigo-500'
                : 'text-gray-400'
            "
            :style="{ fontSize: 'clamp(0.625rem, 0.85vw, 0.75rem)' }"
            >{{ formatTime(conv.timestamp) }}</span
          >
          <button
            class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            @click="(e) => handleDelete(e, conv.id)"
          >
            <svg
              class="fill-none stroke-current"
              :style="{
                width: 'clamp(0.875rem, 1.2vw, 1rem)',
                height: 'clamp(0.875rem, 1.2vw, 1rem)',
              }"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </button>
    </div>
  </div>
</template>
