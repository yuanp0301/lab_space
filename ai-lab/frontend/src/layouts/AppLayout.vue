<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSidebarStore } from "@/stores/sidebar";
import IconSidebar from "@/components/layout/IconSidebar.vue";
import SecondarySidebar from "@/components/layout/SecondarySidebar.vue";

const sidebarStore = useSidebarStore();
const { isSecondarySidebarCollapsed } = storeToRefs(sidebarStore);
</script>

<template>
  <div
    class="flex h-screen w-full overflow-hidden bg-gradient-to-b from-white to-[#f8fafc]"
  >
    <!-- Main Sidebar (包含一级和二级菜单) -->
    <IconSidebar />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-hidden flex flex-col">
      <router-view />
    </main>
  </div>
</template>
