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
  <div>
    <div class="text-xs font-medium uppercase text-gray-400 px-2 py-2">
      历史对话
    </div>

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
        class="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors"
        :class="[
          conv.id === currentConversationId
            ? 'bg-brand-50 text-brand-600'
            : 'text-[var(--text-secondary)] hover:bg-gray-100',
        ]"
        @click="handleSelect(conv.id)"
      >
        <span class="text-base">💬</span>
        <div class="flex-1 min-w-0">
          <div class="truncate text-sm font-medium">{{ conv.title }}</div>
          <div class="truncate text-xs text-gray-400">
            {{ conv.preview || "无消息" }}
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-xs text-gray-400">{{
            formatTime(conv.timestamp)
          }}</span>
          <button
            class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
            @click="(e) => handleDelete(e, conv.id)"
          >
            ×
          </button>
        </div>
      </button>
    </div>
  </div>
</template>
