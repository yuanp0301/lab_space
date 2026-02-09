<script setup lang="ts">
import { ref } from "vue";
import { NButton, NInput, NSelect, NUpload } from "naive-ui";

const selectedModel = ref("Nano Banana Pro");
const imageDescription = ref("");

const exampleImages = [
  { id: 1, url: "https://via.placeholder.com/300x300?text=Example+1" },
  { id: 2, url: "https://via.placeholder.com/300x300?text=Example+2" },
  { id: 3, url: "https://via.placeholder.com/300x300?text=Example+3" },
];

const handleGenerate = () => {
  // TODO: 调用API生成图片
  console.log("生成图片:", imageDescription.value);
};
</script>

<template>
  <div class="flex h-full flex-col bg-white">
    <!-- Header -->
    <div class="border-b border-[var(--border-light)] px-8 py-6 bg-white">
      <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-2">
        Nano Banana Pro
      </h1>
      <p class="text-[var(--text-secondary)]">轻量快速、风格简约</p>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-8 py-6">
      <!-- Example Images -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div
          v-for="img in exampleImages"
          :key="img.id"
          class="aspect-square rounded-xl overflow-hidden border border-[var(--border-light)] bg-gray-100"
        >
          <img
            :src="img.url"
            alt="Example"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Input Section -->
      <div class="max-w-3xl">
        <div class="flex items-center gap-3 mb-4">
          <NSelect
            v-model:value="selectedModel"
            :options="[{ label: 'Nano Banana Pro', value: 'Nano Banana Pro' }]"
            style="width: 200px"
            size="large"
          />
          <NButton size="large" class="!text-purple-600 hover:!bg-purple-50">
            <template #icon>
              <span>📤</span>
            </template>
            上传参考图
          </NButton>
        </div>

        <div>
          <NInput
            v-model:value="imageDescription"
            type="textarea"
            placeholder="请详细描述您要生成的图片,如:一只猫在草地上玩耍。"
            :autosize="{ minRows: 10, maxRows: 18 }"
            class="rounded-xl border-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>
