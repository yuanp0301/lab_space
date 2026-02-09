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
    title: "代码助手",
    description: "编写、解释、优化代码",
  },
  {
    icon: "📝",
    title: "文案创作",
    description: "撰写文章、邮件、报告",
  },
  {
    icon: "🔍",
    title: "知识问答",
    description: "解答问题、解释概念",
  },
  {
    icon: "📊",
    title: "数据分析",
    description: "分析数据、提取洞见",
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
  <div class="flex h-full flex-col bg-gradient-to-b from-white to-[#f8fafc]">
    <!-- Header -->
    <div
      class="flex items-center justify-between border-b border-[var(--border-light)] bg-white/90 backdrop-blur-xl shadow-sm px-8 py-5"
    >
      <div class="flex items-center gap-4">
        <h1
          class="text-2xl font-bold text-[var(--text-primary)] tracking-tight"
        >
          AI助手
        </h1>
        <div class="h-6 w-px bg-[var(--border-color)]"></div>
        <span class="text-sm text-[var(--text-secondary)] font-medium"
          >智能对话平台</span
        >
      </div>
      <div
        class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 text-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        🎓
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="mx-auto max-w-5xl px-8 py-12">
        <!-- Welcome Hero -->
        <WelcomeHero />

        <!-- Quick Actions -->
        <div class="mt-16">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="h-0.5 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
            ></div>
            <h3
              class="text-lg font-bold text-[var(--text-primary)] tracking-tight"
            >
              常用提示词
            </h3>
            <div
              class="flex-1 h-0.5 rounded-full bg-gradient-to-r from-purple-400 to-transparent"
            ></div>
          </div>
          <div class="grid grid-cols-2 gap-5">
            <PromptCard
              v-for="card in promptCards.slice(0, 4)"
              :key="card.title"
              :icon="card.icon"
              :title="card.title"
              :description="card.description"
              @click="handlePromptClick(card.title)"
            />
          </div>
        </div>

        <!-- Knowledge Base Section -->
        <div class="mt-16">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="h-0.5 w-8 rounded-full bg-gradient-to-r from-pink-400 to-rose-400"
            ></div>
            <h3
              class="text-lg font-bold text-[var(--text-primary)] tracking-tight"
            >
              智能知识库
            </h3>
            <div
              class="flex-1 h-0.5 rounded-full bg-gradient-to-r from-rose-400 to-transparent"
            ></div>
          </div>
          <div class="grid grid-cols-2 gap-5">
            <PromptCard
              icon="📚"
              title="调试中-勿用"
              description="系统调试中，请勿使用"
              @click="() => {}"
            />
            <PromptCard
              icon="💾"
              title="sqlboy"
              description="SQL 知识库"
              @click="() => {}"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Input Area -->
    <div
      class="border-t border-[var(--border-light)] bg-white/95 backdrop-blur-xl shadow-lg"
    >
      <div class="mx-auto max-w-5xl px-8 py-6">
        <HomeInput @send="handleSend" />
      </div>
    </div>
  </div>
</template>
