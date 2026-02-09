<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  NCard,
  NGrid,
  NGridItem,
  NTabs,
  NTabPane,
  NSpin,
  NEmpty,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { useExperimentStore } from "@/stores/experiment";
import type { ExperimentCategory } from "@/api/experiments";

const router = useRouter();
const experimentStore = useExperimentStore();
const { experiments, isLoading, categoryLabels } = storeToRefs(experimentStore);

const currentCategory = ref<ExperimentCategory | "all">("all");

onMounted(() => {
  experimentStore.fetchExperiments();
});

const filteredExperiments = () => {
  if (currentCategory.value === "all") {
    return experiments.value;
  }
  return experiments.value.filter((e) => e.category === currentCategory.value);
};

const goToExperiment = (id: string) => {
  router.push(`/experiments/${id}`);
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    llm: "LLM",
    multimodal: "MM",
    agents: "AGT",
    traditional: "ML",
  };
  return icons[category] || "?";
};
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="mx-auto max-w-5xl px-6 py-6">
      <!-- Page Title -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-[var(--text-primary)]">
          AI 实验列表
        </h1>
        <p class="mt-1 text-[var(--text-secondary)]">
          探索各种 AI 能力实验，包括 LLM、多模态、Agent 等
        </p>
      </div>

      <!-- Category Tabs -->
      <NTabs v-model:value="currentCategory" type="line" class="mb-6">
        <NTabPane name="all" tab="全部" />
        <NTabPane
          v-for="(label, cat) in categoryLabels"
          :key="cat"
          :name="cat"
          :tab="label"
        />
      </NTabs>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <NSpin size="large" />
      </div>

      <!-- Experiments Grid -->
      <div v-else>
        <NGrid :cols="3" :x-gap="16" :y-gap="16" responsive="screen">
          <NGridItem
            v-for="experiment in filteredExperiments()"
            :key="experiment.id"
          >
            <NCard
              hoverable
              class="cursor-pointer transition-shadow hover:shadow-md"
              @click="goToExperiment(experiment.id)"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
                >
                  {{ experiment.icon || getCategoryIcon(experiment.category) }}
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-[var(--text-primary)]">
                    {{ experiment.name }}
                  </h3>
                  <p class="mt-1 text-sm text-[var(--text-secondary)]">
                    {{ experiment.description }}
                  </p>
                  <div class="mt-2 flex flex-wrap gap-1">
                    <span
                      v-for="tag in experiment.tags"
                      :key="tag"
                      class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </NCard>
          </NGridItem>
        </NGrid>

        <NEmpty
          v-if="filteredExperiments().length === 0"
          class="py-12"
          description="暂无实验"
        />
      </div>
    </div>
  </div>
</template>
