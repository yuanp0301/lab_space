<script setup lang="ts">
import { computed } from "vue";
import { NAvatar } from "naive-ui";
import type { StoredMessage } from "@/stores/chat";

const props = defineProps<{
  message: StoredMessage;
}>();

const isUser = computed(() => props.message.role === "user");

const displayContent = computed(() => {
  const content = props.message.content;
  if (typeof content === "string") {
    return content;
  }
  return content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");
});

const imageBlocks = computed(() => {
  const content = props.message.content;
  if (typeof content === "string") {
    return [];
  }
  return content.filter((block) => block.type === "image");
});
</script>

<template>
  <div
    class="flex gap-4 py-4"
    :class="isUser ? 'flex-row-reverse' : 'flex-row'"
  >
    <!-- Avatar -->
    <div class="flex-shrink-0">
      <NAvatar
        :size="36"
        round
        :style="{
          backgroundColor: isUser ? '#4F8CFF' : '#6B7280',
        }"
      >
        {{ isUser ? "U" : "AI" }}
      </NAvatar>
    </div>

    <!-- Message Content -->
    <div
      class="max-w-[80%] rounded-2xl px-4 py-3"
      :class="[
        isUser
          ? 'bg-brand-400 text-white'
          : 'bg-white border border-[var(--border-color)]',
      ]"
    >
      <!-- Image attachments -->
      <div v-if="imageBlocks.length > 0" class="mb-3 flex flex-wrap gap-2">
        <img
          v-for="(img, idx) in imageBlocks"
          :key="idx"
          :src="`data:${img.media_type};base64,${img.data}`"
          class="max-h-48 rounded-lg object-cover"
          alt="Uploaded image"
        />
      </div>

      <!-- Text content -->
      <div
        class="whitespace-pre-wrap break-words text-sm leading-relaxed"
        :class="isUser ? 'text-white' : 'text-[var(--text-primary)]'"
      >
        {{ displayContent }}
      </div>
    </div>
  </div>
</template>
