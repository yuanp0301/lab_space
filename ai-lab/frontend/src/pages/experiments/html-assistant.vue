<script setup lang="ts">
import { ref } from "vue";
import { NButton, NInput, NUpload, NTabs, NTabPane, NEmpty } from "naive-ui";
import type { UploadFileInfo } from "naive-ui";

const activeTab = ref("preview");
const pageDescription = ref("");
const htmlCode = ref("");
const previewUrl = ref("");

const handleGenerate = () => {
  // TODO: 调用API生成HTML
  console.log("生成页面:", pageDescription.value);
};

const handleUpload = () => {
  // TODO: 处理ZIP上传
  console.log("上传ZIP");
};

const recentGenerations = ref([
  {
    id: "1",
    title:
      "生成一个掷骰子的游戏,骰子有两个,掷出来的结果是两个骰子的点数之和。1、2个玩家,在开始前,每人可以选点数之和为多少,算自己赢。2、玩家决...",
    date: "2026/01/08",
    status: "成功",
  },
]);
</script>

<template>
  <div class="flex h-full bg-white">
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col border-r border-[var(--border-light)]">
      <!-- Header -->
      <div class="border-b border-[var(--border-light)] px-8 py-6 bg-white">
        <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-2">
          创建HTML页面
        </h1>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-8 py-6">
        <!-- Action Buttons -->
        <div class="flex gap-3 mb-6">
          <NButton
            type="primary"
            size="large"
            class="!bg-purple-600 hover:!bg-purple-700 !px-6 !rounded-lg"
          >
            AI创建
          </NButton>
          <NButton size="large" class="!px-6 !rounded-lg"> ZIP上传 </NButton>
        </div>

        <!-- Description Input -->
        <div class="mb-6">
          <label
            class="block text-sm font-medium text-[var(--text-primary)] mb-2"
          >
            描述您想要的页面
          </label>
          <NInput
            v-model:value="pageDescription"
            type="textarea"
            placeholder="例如:创建一个现代化的产品展示页面,包含导航栏、英雄区域、产品特性卡片和页脚..."
            :autosize="{ minRows: 8, maxRows: 15 }"
            class="rounded-xl border-2"
          />
          <p class="mt-2 text-xs text-[var(--text-secondary)]">
            按Enter 发送,Shift+Enter 换行
          </p>
        </div>

        <!-- Generate Button -->
        <div class="mb-6">
          <NButton
            size="large"
            class="!bg-gray-200 hover:!bg-gray-300 !text-gray-700 !px-8 !rounded-lg"
            @click="handleGenerate"
          >
            生成页面
          </NButton>
        </div>

        <!-- Upload Image -->
        <div class="mb-6">
          <label
            class="block text-sm font-medium text-[var(--text-primary)] mb-2"
          >
            上传图片
          </label>
          <NUpload :show-file-list="false" accept="image/*" class="w-full">
            <div
              class="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div class="text-4xl mb-2">👤☁️</div>
              <p class="text-sm text-[var(--text-secondary)] text-center">
                支持JPG、PNG、GIF、WebP格式,最大50MB
              </p>
            </div>
          </NUpload>
        </div>

        <!-- Recent Generations -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-[var(--text-primary)]">
              最近生成
            </h3>
            <button class="text-gray-400 hover:text-gray-600">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="item in recentGenerations"
              :key="item.id"
              class="border border-[var(--border-light)] rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <p class="text-sm text-[var(--text-primary)] mb-2 line-clamp-2">
                {{ item.title }}
              </p>
              <div
                class="flex items-center justify-between text-xs text-[var(--text-secondary)]"
              >
                <span>{{ item.date }}</span>
                <span class="text-green-600 font-medium">{{
                  item.status
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel -->
    <div
      class="w-[500px] flex flex-col border-l border-[var(--border-light)] bg-white"
    >
      <!-- Tabs -->
      <div class="border-b border-[var(--border-light)] px-6">
        <NTabs v-model:value="activeTab" type="line" class="!text-purple-600">
          <NTabPane name="preview" tab="预览" />
          <NTabPane name="source" tab="<>源代码" />
        </NTabs>
      </div>

      <!-- Action Buttons -->
      <div class="border-b border-[var(--border-light)] px-6 py-3 flex gap-2">
        <NButton size="small" class="!text-purple-600 hover:!bg-purple-50"
          >AI优化</NButton
        >
        <NButton size="small" class="!text-purple-600 hover:!bg-purple-50"
          >新窗口打开</NButton
        >
        <NButton size="small" class="!text-purple-600 hover:!bg-purple-50"
          ><分享</NButton
        >
        <NButton size="small" class="!text-purple-600 hover:!bg-purple-50"
          >下载ZIP</NButton
        >
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-6">
        <div
          v-if="!htmlCode"
          class="flex flex-col items-center justify-center h-full text-center"
        >
          <div class="text-6xl mb-4">📄</div>
          <p class="text-[var(--text-secondary)]">
            请输入页面描述或上传ZIP文件开始创建
          </p>
        </div>
        <div v-else>
          <iframe
            v-if="activeTab === 'preview'"
            :srcdoc="htmlCode"
            class="w-full h-full border border-[var(--border-light)] rounded-lg"
          ></iframe>
          <pre
            v-else
            class="bg-gray-50 p-4 rounded-lg text-sm overflow-auto"
          ><code>{{ htmlCode }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
