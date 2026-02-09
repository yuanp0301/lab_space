<script setup lang="ts">
import { computed } from "vue";
import { NSelect, NSpace } from "naive-ui";
import type { ProviderInfo } from "@/api/chat";

const props = defineProps<{
  providers: ProviderInfo[];
  currentProvider: string;
  currentModel: string;
}>();

const emit = defineEmits<{
  "update:currentProvider": [value: string];
  "update:currentModel": [value: string];
}>();

const providerOptions = computed(() =>
  props.providers.map((p) => ({
    label: p.label,
    value: p.name,
  })),
);

const modelOptions = computed(() => {
  const provider = props.providers.find(
    (p) => p.name === props.currentProvider,
  );
  return (
    provider?.models.map((m) => ({
      label: m,
      value: m,
    })) || []
  );
});
</script>

<template>
  <div class="flex items-center gap-3">
    <NSelect
      :value="currentProvider"
      :options="providerOptions"
      placeholder="选择服务"
      size="small"
      style="width: 140px"
      @update:value="(v) => emit('update:currentProvider', v)"
    />
    <NSelect
      :value="currentModel"
      :options="modelOptions"
      placeholder="选择模型"
      size="small"
      style="width: 180px"
      @update:value="(v) => emit('update:currentModel', v)"
    />
  </div>
</template>
