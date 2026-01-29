import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  experimentsApi,
  type ExperimentInfo,
  type ExperimentCategory,
} from "@/api/experiments";

export const useExperimentStore = defineStore("experiment", () => {
  const experiments = ref<ExperimentInfo[]>([]);
  const currentExperiment = ref<ExperimentInfo | null>(null);
  const isLoading = ref(false);

  const experimentsByCategory = computed(() => {
    const grouped: Record<ExperimentCategory, ExperimentInfo[]> = {
      llm: [],
      multimodal: [],
      agents: [],
      traditional: [],
    };

    for (const exp of experiments.value) {
      grouped[exp.category].push(exp);
    }

    return grouped;
  });

  const categoryLabels: Record<ExperimentCategory, string> = {
    llm: "LLM 实验",
    multimodal: "多模态实验",
    agents: "Agent 实验",
    traditional: "传统 ML/CV",
  };

  const fetchExperiments = async (category?: ExperimentCategory) => {
    isLoading.value = true;
    try {
      const response = await experimentsApi.list(category);
      experiments.value = response.data.experiments;
    } catch (error) {
      console.error("Failed to fetch experiments:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchExperiment = async (id: string) => {
    isLoading.value = true;
    try {
      const response = await experimentsApi.get(id);
      currentExperiment.value = response.data;
      return response.data;
    } catch (error) {
      console.error("Failed to fetch experiment:", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const getExperimentById = (id: string) => {
    return experiments.value.find((exp) => exp.id === id);
  };

  return {
    experiments,
    currentExperiment,
    isLoading,
    experimentsByCategory,
    categoryLabels,
    fetchExperiments,
    fetchExperiment,
    getExperimentById,
  };
});
