<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { NButton, NEmpty, NSpin } from "naive-ui";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/stores/chat";
import { useSSE } from "@/composables/useSSE";
import { chatApi, type ContentBlock } from "@/api/chat";
import MessageItem from "./MessageItem.vue";
import ChatInput from "./ChatInput.vue";
import ModelSelector from "./ModelSelector.vue";

const chatStore = useChatStore();
const { messages, providers, currentProvider, currentModel, hasMessages } =
  storeToRefs(chatStore);

const { stream, abort, isStreaming, error } = useSSE();
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

const handleStop = () => {
  abort();
};

const handleClear = () => {
  chatStore.clearMessages();
};

const handleProviderChange = (provider: string) => {
  chatStore.setProvider(provider);
};

const handleModelChange = (model: string) => {
  chatStore.setModel(model);
};
</script>

<template>
  <div class="flex h-full flex-col bg-[var(--bg-color)]">
    <!-- Header with Model Selector -->
    <div
      class="flex items-center justify-between border-b border-[var(--border-color)] bg-white px-4 py-3"
    >
      <ModelSelector
        :providers="providers"
        :current-provider="currentProvider"
        :current-model="currentModel"
        @update:current-provider="handleProviderChange"
        @update:current-model="handleModelChange"
      />

      <NButton
        v-if="hasMessages"
        size="small"
        quaternary
        type="error"
        @click="handleClear"
      >
        清空对话
      </NButton>
    </div>

    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto">
      <!-- Empty State -->
      <div v-if="!hasMessages" class="flex h-full items-center justify-center">
        <NEmpty description="开始一段新对话" />
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
    <div class="border-t border-[var(--border-color)] bg-white">
      <div class="mx-auto max-w-3xl">
        <ChatInput
          :disabled="isStreaming"
          :loading="isStreaming"
          @send="handleSend"
        />
      </div>

      <!-- Stop Button -->
      <div v-if="isStreaming" class="border-t bg-gray-50 p-2 text-center">
        <NButton size="small" type="warning" @click="handleStop">
          停止生成
        </NButton>
      </div>
    </div>
  </div>
</template>
