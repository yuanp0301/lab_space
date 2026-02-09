<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { NSpin, NEmpty, NButton } from "naive-ui";
import { storeToRefs } from "pinia";
import { useExperimentStore } from "@/stores/experiment";
import ChatContainer from "@/components/chat/ChatContainer.vue";

const route = useRoute();
const experimentStore = useExperimentStore();
const { currentExperiment, isLoading } = storeToRefs(experimentStore);

const experimentId = ref(route.params.id as string);

onMounted(async () => {
  await experimentStore.fetchExperiment(experimentId.value);
});
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Experiment Header (simplified) -->
    <div
      v-if="currentExperiment"
      class="border-b border-[var(--border-color)] bg-white px-4 py-3"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-lg"
        >
          {{ currentExperiment.icon || "🧪" }}
        </div>
        <div>
          <h1 class="font-semibold text-[var(--text-primary)]">
            {{ currentExperiment.name }}
          </h1>
          <p class="text-sm text-[var(--text-secondary)]">
            {{ currentExperiment.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-hidden">
      <!-- Loading -->
      <div v-if="isLoading" class="flex h-full items-center justify-center">
        <NSpin size="large" />
      </div>

      <!-- Not Found -->
      <div
        v-else-if="!currentExperiment"
        class="flex h-full items-center justify-center"
      >
        <NEmpty description="实验不存在">
          <template #extra>
            <NButton @click="$router.push('/experiments')">返回列表</NButton>
          </template>
        </NEmpty>
      </div>

      <!-- Experiment Chat -->
      <div v-else class="h-full">
        <ChatContainer />
      </div>
    </div>
  </div>
</template>
