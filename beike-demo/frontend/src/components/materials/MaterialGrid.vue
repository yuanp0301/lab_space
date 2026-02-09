<template>
  <div class="material-grid">
    <el-row :gutter="16">
      <el-col
        v-for="material in materials"
        :key="material.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <MaterialCard
          :material="material"
          @use="$emit('use', $event)"
          @preview="$emit('preview', $event)"
          @click="$emit('select', $event)"
        />
      </el-col>
    </el-row>

    <el-empty
      v-if="materials.length === 0"
      description="暂无素材"
      :image-size="120"
    />
  </div>
</template>

<script setup lang="ts">
import MaterialCard from "./MaterialCard.vue";
import type { MaterialItem } from "@/stores/materials";

defineProps<{
  materials: MaterialItem[];
}>();

defineEmits<{
  use: [material: MaterialItem];
  preview: [material: MaterialItem];
  select: [material: MaterialItem];
}>();
</script>

<style scoped lang="scss">
.material-grid {
  .el-col {
    margin-bottom: 16px;
  }
}
</style>
