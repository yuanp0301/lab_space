<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    class="flex flex-col items-start gap-2 rounded-xl bg-white p-4 text-left shadow-sm transition-all hover:shadow-md hover:bg-brand-50 border border-[var(--border-color)] w-full"
    @click="$emit('click')"
  >
    <div
      class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-lg"
    >
      {{ icon }}
    </div>
    <h3 class="font-medium text-[var(--text-primary)]">{{ title }}</h3>
    <p class="text-sm text-[var(--text-secondary)] line-clamp-2">
      {{ description }}
    </p>
  </button>
</template>
