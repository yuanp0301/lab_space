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
  <div class="w-full max-w-3xl mx-auto">
    <div
      class="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[var(--border-color)]"
    >
      <!-- Input Row -->
      <div class="flex items-end gap-3">
        <!-- Model Selector -->
        <div class="flex items-center gap-2">
          <NSelect
            :value="currentProvider"
            :options="providerOptions()"
            size="small"
            style="width: 120px"
            placeholder="选择服务"
            @update:value="handleProviderChange"
          />
          <NSelect
            v-if="availableModels.length > 0"
            :value="currentModel"
            :options="modelOptions()"
            size="small"
            style="width: 160px"
            placeholder="选择模型"
            @update:value="handleModelChange"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-1">
          <NUpload
            :show-file-list="false"
            accept="image/*"
            :disabled="isUploading"
          >
            <NButton quaternary circle size="small" :loading="isUploading">
              <template #icon>
                <span>📷</span>
              </template>
            </NButton>
          </NUpload>
          <NButton quaternary circle size="small">
            <template #icon>
              <span>📄</span>
            </template>
          </NButton>
          <NButton quaternary circle size="small">
            <template #icon>
              <span>🔍</span>
            </template>
          </NButton>
        </div>

        <!-- Input Field -->
        <div class="flex-1">
          <NInput
            v-model:value="inputValue"
            type="textarea"
            placeholder="给 AI 助手发送消息..."
            :autosize="{ minRows: 1, maxRows: 4 }"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Send Button -->
        <NButton
          type="primary"
          :disabled="!inputValue.trim()"
          @click="handleSend"
        >
          发送
        </NButton>
      </div>
    </div>
  </div>
</template>
