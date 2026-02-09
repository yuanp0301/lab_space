<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { NSpin } from "naive-ui";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/stores/chat";
import { useSSE } from "@/composables/useSSE";
import { chatApi, type ContentBlock } from "@/api/chat";
import MessageItem from "./MessageItem.vue";
import ChatInput from "./ChatInput.vue";

const chatStore = useChatStore();
const { messages, providers, currentProvider, currentModel, hasMessages } =
  storeToRefs(chatStore);

const { stream, isStreaming, error } = useSSE();
const messagesContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  chatStore.fetchProviders();
});

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(messages, scrollToBottom, { deep: true });

const handleSend = async (content: string | ContentBlock[]) => {
  // Add user message
  chatStore.addMessage({ role: "user", content });

  // Add assistant placeholder
  const assistantMessage = chatStore.addMessage({
    role: "assistant",
    content: "",
  });

  await stream(
    chatApi.getStreamUrl(),
    {
      messages: chatStore.getMessagesForAPI().slice(0, -1),
      provider: currentProvider.value || undefined,
      model: currentModel.value || undefined,
    },
    {
      onChunk: (chunk) => {
        chatStore.updateMessage(
          assistantMessage.id,
          (assistantMessage.content as string) + chunk.content,
        );
      },
      onError: (err) => {
        chatStore.updateMessage(assistantMessage.id, `错误: ${err.message}`);
      },
    },
  );
};

const handleProviderChange = (provider: string) => {
  chatStore.setProvider(provider);
};

const handleModelChange = (model: string) => {
  chatStore.setModel(model);
};
</script>

<template>
  <div
    class="flex h-full flex-col bg-gradient-to-b from-white via-[#fafbfc] to-[#f8fafc]"
  >
    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto">
      <!-- Empty State -->
      <div
        v-if="!hasMessages"
        class="flex h-full items-center justify-center px-6"
      >
        <div class="text-center max-w-md">
          <div class="relative inline-block mb-6">
            <div
              class="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-30"
            ></div>
            <div class="relative text-7xl">💬</div>
          </div>
          <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-2">
            开始一段新对话
          </h3>
          <p class="text-[var(--text-secondary)] text-base">
            输入消息开始与 AI 助手交流
          </p>
        </div>
      </div>

      <!-- Messages -->
      <div v-else class="mx-auto max-w-3xl px-4 py-6">
        <MessageItem v-for="msg in messages" :key="msg.id" :message="msg" />

        <!-- Streaming Indicator -->
        <div v-if="isStreaming" class="flex justify-center py-4">
          <NSpin size="small" />
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="py-2 text-center text-red-500">
        {{ error.message }}
      </div>
    </div>

    <!-- Input Area -->
    <div
      class="border-t border-[var(--border-light)] bg-white/95 backdrop-blur-xl shadow-lg"
    >
      <div class="mx-auto max-w-4xl px-8 py-6">
        <ChatInput
          :disabled="isStreaming"
          :loading="isStreaming"
          :providers="providers"
          :current-model="currentModel"
          @update:current-model="handleModelChange"
          @send="handleSend"
        />
      </div>
    </div>
  </div>
</template>
