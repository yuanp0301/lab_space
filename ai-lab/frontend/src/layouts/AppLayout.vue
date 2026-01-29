<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSidebarStore } from "@/stores/sidebar";
import IconSidebar from "@/components/layout/IconSidebar.vue";
import SecondarySidebar from "@/components/layout/SecondarySidebar.vue";

const sidebarStore = useSidebarStore();
const { isSecondarySidebarCollapsed } = storeToRefs(sidebarStore);
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Icon Sidebar (60px) -->
    <IconSidebar />

    <!-- Secondary Sidebar (260px) -->
    <SecondarySidebar v-if="!isSecondarySidebarCollapsed" />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-hidden bg-[var(--bg-color)]">
      <router-view />
    </main>
  </div>
</template>
