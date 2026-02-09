<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { NTooltip } from "naive-ui";
import { useSidebarStore, type SidebarSection } from "@/stores/sidebar";

const router = useRouter();
const route = useRoute();
const sidebarStore = useSidebarStore();

type MenuItem = {
  id: SidebarSection;
  icon: string;
  label: string;
  path: string;
};

const menuItems: MenuItem[] = [
  { id: "chat", icon: "💬", label: "AI 助手", path: "/" },
  { id: "experiments", icon: "🧪", label: "AI 实验", path: "/experiments" },
  { id: "settings", icon: "⚙️", label: "设置", path: "/settings" },
];

const handleClick = (item: MenuItem) => {
  sidebarStore.setActiveSection(item.id);
  router.push(item.path);
};

const isActive = (item: MenuItem) => {
  if (item.id === "chat") {
    return route.path === "/" || route.path.startsWith("/chat");
  }
  return route.path.startsWith(item.path);
};
</script>

<template>
  <div
    class="flex h-full w-[60px] flex-col items-center border-r border-[var(--border-color)] bg-white py-4"
  >
    <!-- Logo -->
    <div
      class="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-400 text-lg text-white"
    >
      AI
    </div>

    <!-- Menu Items -->
    <div class="flex flex-1 flex-col gap-2">
      <NTooltip
        v-for="item in menuItems"
        :key="item.id"
        placement="right"
        trigger="hover"
      >
        <template #trigger>
          <button
            class="flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-all"
            :class="[
              isActive(item)
                ? 'bg-brand-50 text-brand-500'
                : 'text-gray-500 hover:bg-gray-100',
            ]"
            @click="handleClick(item)"
          >
            {{ item.icon }}
          </button>
        </template>
        {{ item.label }}
      </NTooltip>
    </div>

    <!-- Bottom section -->
    <div class="mt-auto">
      <button
        class="flex h-11 w-11 items-center justify-center rounded-xl text-xl text-gray-500 transition-all hover:bg-gray-100"
        @click="sidebarStore.toggleSecondarySidebar()"
      >
        📐
      </button>
    </div>
  </div>
</template>
