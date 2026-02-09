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
    class="group flex gap-4 py-6"
    :class="isUser ? 'flex-row-reverse' : 'flex-row'"
  >
    <!-- Avatar -->
    <div class="flex-shrink-0">
      <div class="relative">
        <div
          v-if="!isUser"
          class="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-lg opacity-30"
        ></div>
        <NAvatar
          :size="44"
          round
          :style="{
            background: isUser
              ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
              : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            position: 'relative',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }"
        >
          {{ isUser ? "U" : "AI" }}
        </NAvatar>
      </div>
    </div>

    <!-- Message Content -->
    <div
      class="max-w-[78%] rounded-2xl px-6 py-4 shadow-md transition-all duration-200 group-hover:shadow-lg"
      :class="[
        isUser
          ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white'
          : 'bg-white border-2 border-[var(--border-light)]',
      ]"
    >
      <!-- Image attachments -->
      <div v-if="imageBlocks.length > 0" class="mb-4 flex flex-wrap gap-3">
        <img
          v-for="(img, idx) in imageBlocks"
          :key="idx"
          :src="`data:${img.media_type};base64,${img.data}`"
          class="max-h-56 rounded-xl object-cover shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          alt="Uploaded image"
        />
      </div>

      <!-- Text content -->
      <div
        class="whitespace-pre-wrap break-words text-[15px] leading-relaxed font-medium"
        :class="isUser ? 'text-white' : 'text-[var(--text-primary)]'"
      >
        {{ displayContent }}
      </div>
    </div>
  </div>
</template>
