<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NInput, NButton } from "naive-ui";
import { storeToRefs } from "pinia";
import { useSidebarStore } from "@/stores/sidebar";
import { useExperimentStore } from "@/stores/experiment";
import SidebarMenuItem from "./SidebarMenuItem.vue";
import ConversationList from "./ConversationList.vue";

const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebarStore();
const experimentStore = useExperimentStore();
const { activeSection } = storeToRefs(sidebarStore);
const { experiments } = storeToRefs(experimentStore);

const sectionTitle = computed(() => {
  const titles: Record<string, string> = {
    chat: "AI 助手",
    experiments: "AI 实验",
    settings: "设置",
  };
  return titles[activeSection.value] || "AI Lab";
});

type MenuItem = {
  id: string;
  icon: string;
  label: string;
  path?: string;
  action?: string;
};

const menuItems = computed((): MenuItem[] => {
  if (activeSection.value === "chat") {
    return [
      { id: "new-chat", icon: "➕", label: "新建对话", action: "new-chat" },
    ];
  }
  if (activeSection.value === "experiments") {
    return experiments.value.slice(0, 5).map((exp) => ({
      id: exp.id,
      icon: exp.icon || "🧪",
      label: exp.name,
      path: `/experiments/${exp.id}`,
    }));
  }
  return [];
});

const handleMenuAction = (action: string) => {
  if (action === "new-chat") {
    sidebarStore.addConversation();
    router.push("/chat");
  }
};

const handleMenuClick = (item: MenuItem) => {
  if (item.action) {
    handleMenuAction(item.action);
  } else if (item.path) {
    router.push(item.path);
  }
};
</script>

<template>
  <div
    class="flex h-full w-[260px] flex-col border-r border-[var(--border-color)] bg-white"
  >
    <!-- Header -->
    <div class="border-b border-[var(--border-color)] px-4 py-4">
      <h2 class="text-lg font-semibold text-[var(--text-primary)]">
        {{ sectionTitle }}
      </h2>
    </div>

    <!-- Menu Items -->
    <div
      v-if="menuItems.length > 0"
      class="border-b border-[var(--border-color)] p-2"
    >
      <SidebarMenuItem
        v-for="item in menuItems"
        :key="item.id"
        :icon="item.icon"
        :label="item.label"
        :active="item.path ? route.path === item.path : false"
        @click="handleMenuClick(item)"
      />
    </div>

    <!-- Search (for chat section) -->
    <div
      v-if="activeSection === 'chat'"
      class="border-b border-[var(--border-color)] p-3"
    >
      <NInput placeholder="搜索对话..." size="small">
        <template #prefix>
          <span class="text-gray-400">🔍</span>
        </template>
      </NInput>
    </div>

    <!-- Conversation List (for chat section) -->
    <div v-if="activeSection === 'chat'" class="flex-1 overflow-y-auto p-2">
      <ConversationList />
    </div>

    <!-- Experiment List (for experiments section) -->
    <div
      v-if="activeSection === 'experiments'"
      class="flex-1 overflow-y-auto p-2"
    >
      <div class="text-xs font-medium uppercase text-gray-400 px-2 py-2">
        所有实验
      </div>
      <SidebarMenuItem
        v-for="exp in experiments"
        :key="exp.id"
        :icon="exp.icon || '🧪'"
        :label="exp.name"
        :active="route.path === `/experiments/${exp.id}`"
        @click="router.push(`/experiments/${exp.id}`)"
      />
    </div>

    <!-- View All Button -->
    <div
      v-if="activeSection === 'experiments'"
      class="border-t border-[var(--border-color)] p-3"
    >
      <NButton
        block
        size="small"
        secondary
        @click="router.push('/experiments')"
      >
        查看所有实验
      </NButton>
    </div>
  </div>
</template>
