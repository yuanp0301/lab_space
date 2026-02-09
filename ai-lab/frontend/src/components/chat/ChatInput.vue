<script setup lang="ts">
import { ref } from "vue";
import { NInput, NButton, NUpload, useMessage } from "naive-ui";
import type { UploadFileInfo } from "naive-ui";
import { filesApi, type UploadResponse } from "@/api/files";
import type { ContentBlock } from "@/api/chat";

const emit = defineEmits<{
  send: [content: string | ContentBlock[]];
}>();

defineProps<{
  disabled?: boolean;
  loading?: boolean;
}>();

const message = useMessage();
const inputValue = ref("");
const attachedImages = ref<UploadResponse[]>([]);
const isUploading = ref(false);

const handleSend = () => {
  const text = inputValue.value.trim();
  if (!text && attachedImages.value.length === 0) return;

  if (attachedImages.value.length > 0) {
    const content: ContentBlock[] = [];

    for (const img of attachedImages.value) {
      content.push({
        type: "image",
        data: img.base64,
        media_type: img.content_type,
      });
    }

    if (text) {
      content.push({ type: "text", text });
    }

    emit("send", content);
  } else {
    emit("send", text);
  }

  inputValue.value = "";
  attachedImages.value = [];
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

const handleUpload = async ({ file }: { file: UploadFileInfo }) => {
  if (!file.file) return;

  isUploading.value = true;
  try {
    const result = await filesApi.upload(file.file);
    attachedImages.value.push(result);
  } catch {
    message.error("上传失败");
  } finally {
    isUploading.value = false;
  }
};

const removeImage = (index: number) => {
  attachedImages.value.splice(index, 1);
};
</script>

<template>
  <div class="p-4">
    <!-- Attached images preview -->
    <div v-if="attachedImages.length > 0" class="mb-3 flex flex-wrap gap-2">
      <div
        v-for="(img, index) in attachedImages"
        :key="img.id"
        class="relative group"
      >
        <img
          :src="`data:${img.content_type};base64,${img.base64}`"
          class="h-16 w-16 rounded-lg object-cover border border-[var(--border-color)]"
          alt="Attached image"
        />
        <button
          class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          @click="removeImage(index)"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Input Container -->
    <div
      class="flex items-end gap-3 rounded-2xl border border-[var(--border-color)] bg-white p-3 shadow-sm focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400"
    >
      <!-- Upload Button -->
      <NUpload
        :show-file-list="false"
        accept="image/*"
        :custom-request="({ file }) => handleUpload({ file })"
        :disabled="disabled || isUploading"
      >
        <button
          class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          :class="{ 'opacity-50': disabled || isUploading }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
      </NUpload>

      <!-- Input Field -->
      <div class="flex-1">
        <NInput
          v-model:value="inputValue"
          type="textarea"
          placeholder="发送消息... (Shift+Enter 换行)"
          :autosize="{ minRows: 1, maxRows: 6 }"
          :disabled="disabled"
          :bordered="false"
          class="!bg-transparent"
          @keydown="handleKeydown"
        />
      </div>

      <!-- Send Button -->
      <NButton
        type="primary"
        :loading="loading"
        :disabled="
          disabled || (!inputValue.trim() && attachedImages.length === 0)
        "
        class="!rounded-lg"
        @click="handleSend"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </template>
      </NButton>
    </div>
  </div>
</template>
