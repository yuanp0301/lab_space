<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  active?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors"
    :class="[
      active
        ? 'bg-brand-50 text-brand-600 font-medium'
        : 'text-[var(--text-secondary)] hover:bg-gray-100',
    ]"
    @click="$emit('click')"
  >
    <span class="text-base">{{ icon }}</span>
    <span class="truncate">{{ label }}</span>
  </button>
</template>
