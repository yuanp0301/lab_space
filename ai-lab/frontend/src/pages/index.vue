<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useExperimentStore } from "@/stores/experiment";
import { useSidebarStore } from "@/stores/sidebar";
import { useChatStore } from "@/stores/chat";
import type { ContentBlock } from "@/api/chat";
import WelcomeHero from "@/components/home/WelcomeHero.vue";
import PromptCard from "@/components/home/PromptCard.vue";
import HomeInput from "@/components/home/HomeInput.vue";

const router = useRouter();
const experimentStore = useExperimentStore();
const sidebarStore = useSidebarStore();
const chatStore = useChatStore();
const { experiments } = storeToRefs(experimentStore);

onMounted(() => {
  experimentStore.fetchExperiments();
});

const promptCards = [
  {
    icon: "💡",
    title: "帮我写代码",
    description: "解释代码、编写函数、调试错误、代码优化",
  },
  {
    icon: "📝",
    title: "文案创作",
    description: "撰写文章、邮件、报告、营销文案",
  },
  {
    icon: "🔍",
    title: "信息查询",
    description: "解答问题、知识检索、概念解释",
  },
  {
    icon: "📊",
    title: "数据分析",
    description: "分析数据、生成图表、提取洞见",
  },
];

const handlePromptClick = (prompt: string) => {
  // Create a new conversation and navigate to chat
  sidebarStore.addConversation(prompt);
  router.push("/chat");
};

const handleExperimentClick = (id: string) => {
  sidebarStore.setActiveSection("experiments");
  router.push(`/experiments/${id}`);
};

const handleSend = async (content: string | ContentBlock[]) => {
  // Create a new conversation
  const title = typeof content === "string" ? content.slice(0, 20) : "新对话";
  sidebarStore.addConversation(title);

  // Add the message to chat store
  chatStore.addMessage({ role: "user", content });

  // Navigate to chat page
  router.push("/chat");
};
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto px-8 py-6">
      <div class="mx-auto max-w-4xl">
        <!-- Welcome Hero -->
        <WelcomeHero />

        <!-- Cards Section -->
        <div class="mt-8 grid grid-cols-2 gap-6">
          <!-- Prompt Cards -->
          <div>
            <h3
              class="mb-4 text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wide"
            >
              常用提示词
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <PromptCard
                v-for="card in promptCards"
                :key="card.title"
                :icon="card.icon"
                :title="card.title"
                :description="card.description"
                @click="handlePromptClick(card.title)"
              />
            </div>
          </div>

          <!-- Experiment Cards -->
          <div>
            <h3
              class="mb-4 text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wide"
            >
              AI 实验室
            </h3>
            <div class="grid grid-cols-1 gap-3">
              <PromptCard
                v-for="exp in experiments.slice(0, 2)"
                :key="exp.id"
                :icon="exp.icon || '🧪'"
                :title="exp.name"
                :description="exp.description"
                @click="handleExperimentClick(exp.id)"
              />
              <button
                v-if="experiments.length > 2"
                class="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border-color)] p-4 text-[var(--text-secondary)] transition-colors hover:border-brand-400 hover:text-brand-500"
                @click="router.push('/experiments')"
              >
                <span>查看更多实验</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Input Area -->
    <div class="border-t border-[var(--border-color)] bg-white p-4">
      <HomeInput @send="handleSend" />
    </div>
  </div>
</template>
