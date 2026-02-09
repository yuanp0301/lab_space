<script setup lang="ts">
import { ref } from "vue";
import { NButton, NInput, NTabs, NTabPane, NSwitch } from "naive-ui";

const activeTab = ref("description");
const lyricDescription = ref(
  "一首充满活力与动感的嘻哈音乐,节奏饱满,歌词中流露着对自由与独立的追求,让人难以抑制地跟着节拍摇摆。",
);
const isPureMusic = ref(false);

const handleGenerate = () => {
  // TODO: 调用API生成音乐
  console.log("生成音乐:", lyricDescription.value);
};

const generatedMusic = ref({
  title: "活在天地之间",
  lyrics: `我不愿诀别这美好的人世
我愿活在普天下黎民之中
阳光沐浴的花木芬芳绚丽
让我消融于那活泼的精灵
人世间生命的游戏绵绵不绝
悲欢离合蕴含少眼泪畅笑
以芸芸众生的苦乐把歌曲谱写
我欲将万年不朽的广厦建造
纵使力不从心只要还活着
但愿在你们中间获得栖身之地`,
  videoUrl: "",
});
</script>

<template>
  <div class="flex h-full bg-white">
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col border-r border-[var(--border-light)]">
      <!-- Header -->
      <div class="border-b border-[var(--border-light)] px-8 py-6 bg-white">
        <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-2">
          生成音乐
        </h1>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-8 py-6">
        <!-- Tabs -->
        <NTabs v-model:value="activeTab" type="line" class="mb-6">
          <NTabPane name="description" tab="按描述生成" />
          <NTabPane name="lyrics" tab="按歌词生成" />
        </NTabs>

        <!-- Input Section -->
        <div class="max-w-2xl">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-[var(--text-primary)]">
              歌词描述
            </h3>
            <div class="flex items-center gap-2">
              <NButton size="small" class="!text-purple-600 hover:!bg-purple-50"
                >随机</NButton
              >
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
          </div>

          <NInput
            v-model:value="lyricDescription"
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 20 }"
            class="rounded-xl mb-4"
          />
          <div class="flex items-center justify-between mb-6">
            <span class="text-xs text-[var(--text-secondary)]"
              >{{ lyricDescription.length }}/500</span
            >
            <div class="flex items-center gap-2">
              <span class="text-sm text-[var(--text-secondary)]">纯音乐</span>
              <NSwitch v-model:value="isPureMusic" />
            </div>
          </div>

          <NButton
            type="primary"
            size="large"
            class="!bg-blue-600 hover:!bg-blue-700 !px-8 mb-4 !rounded-lg"
            @click="handleGenerate"
          >
            开始生成
          </NButton>

          <p class="text-xs text-[var(--text-secondary)]">
            音乐长度1-4分钟不等,每次生成2首,需要1-2分钟
          </p>
        </div>
      </div>
    </div>

    <!-- Right Panel -->
    <div
      class="w-[500px] flex flex-col border-l border-[var(--border-light)] bg-white"
    >
      <!-- Video Player -->
      <div class="border-b border-[var(--border-light)] p-6">
        <div
          class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4"
        >
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-6xl mb-2">🎵</div>
              <p class="text-sm text-[var(--text-secondary)]">
                生成音乐后将在此显示
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button class="p-2 hover:bg-gray-100 rounded">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
            <button class="p-2 hover:bg-gray-100 rounded">
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
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 hover:bg-gray-100 rounded">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <span class="text-sm text-[var(--text-secondary)]"
              >0:00 / 2:28</span
            >
            <button class="p-2 hover:bg-gray-100 rounded">
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
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Lyrics -->
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <h2 class="text-xl font-bold text-[var(--text-primary)] mb-4">
          活在天地之间
        </h2>
        <div class="space-y-3 text-[var(--text-secondary)] leading-relaxed">
          <p
            v-for="(line, index) in generatedMusic.lyrics.split('\n')"
            :key="index"
          >
            {{ line }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
