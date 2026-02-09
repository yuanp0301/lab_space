<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NInput, NButton, NSelect, NUpload } from "naive-ui";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/stores/chat";
import type { ContentBlock } from "@/api/chat";

const emit = defineEmits<{
  send: [content: string | ContentBlock[]];
}>();

const chatStore = useChatStore();
const { providers, currentProvider, currentModel, availableModels } =
  storeToRefs(chatStore);

const inputValue = ref("");
const isUploading = ref(false);

onMounted(() => {
  chatStore.fetchProviders();
});

const providerOptions = () => {
  return providers.value.map((p) => ({
    label: p.label || p.name,
    value: p.name,
  }));
};

const modelOptions = () => {
  return availableModels.value.map((m) => ({
    label: m,
    value: m,
  }));
};

const handleProviderChange = (value: string) => {
  chatStore.setProvider(value);
};

const handleModelChange = (value: string) => {
  chatStore.setModel(value);
};

const handleSend = () => {
  const text = inputValue.value.trim();
  if (!text) return;
  emit("send", text);
  inputValue.value = "";
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};
</script>

<template>
  <div class="w-full">
    <div
      class="group flex items-end gap-3 rounded-2xl border-2 border-[var(--border-light)] bg-white p-5 shadow-md focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100/50 focus-within:shadow-lg transition-all duration-200"
    >
      <!-- Model Selector -->
      <NSelect
        v-if="availableModels.length > 0"
        :value="currentModel"
        :options="modelOptions()"
        size="small"
        style="width: 180px"
        placeholder="选择模型"
        @update:value="handleModelChange"
      />

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <NUpload
          :show-file-list="false"
          accept="image/*"
          :disabled="isUploading"
        >
          <NButton
            quaternary
            circle
            size="medium"
            :loading="isUploading"
            class="hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            <template #icon>
              <span class="text-xl">🖼️</span>
            </template>
          </NButton>
        </NUpload>
        <NButton
          quaternary
          circle
          size="medium"
          class="hover:bg-purple-50 hover:text-purple-600 transition-all"
        >
          <template #icon>
            <span class="text-xl">📄</span>
          </template>
        </NButton>
        <NButton
          quaternary
          circle
          size="medium"
          class="hover:bg-pink-50 hover:text-pink-600 transition-all"
        >
          <template #icon>
            <span class="text-lg">🌐</span>
          </template>
        </NButton>
      </div>

      <!-- Input Field -->
      <div class="flex-1">
        <NInput
          v-model:value="inputValue"
          type="textarea"
          placeholder="Enter发送, Shift+Enter换行, 可直接粘贴或拖拽图片"
          :autosize="{ minRows: 1, maxRows: 4 }"
          :bordered="false"
          class="!bg-transparent"
          @keydown="handleKeydown"
        />
      </div>

      <!-- Send Button -->
      <NButton
        type="primary"
        :disabled="!inputValue.trim()"
        class="!rounded-xl !h-11 !px-6 !bg-gradient-to-r !from-indigo-500 !to-purple-500 hover:!from-indigo-600 hover:!to-purple-600 !shadow-lg hover:!shadow-xl !border-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleSend"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </template>
        <span class="ml-2 font-semibold">发送</span>
      </NButton>
    </div>
  </div>
</template>
