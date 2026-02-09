<template>
  <div class="app-container">
    <Sidebar />
    <main class="app-main">
      <router-view />
    </main>
    <AIAssistant />
  </div>
</template>

<script setup lang="ts">
import Sidebar from "@/components/layout/Sidebar.vue";
import AIAssistant from "@/components/layout/AIAssistant.vue";
</script>

<style scoped lang="scss">
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
  background: linear-gradient(135deg, #0a3d5c 0%, #0c4a6e 100%);
}

.app-main {
  flex: 1;
  overflow-y: auto;
  background:
    radial-gradient(
      circle at 20% 80%,
      rgba(6, 182, 212, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(14, 165, 233, 0.06) 0%,
      transparent 50%
    ),
    linear-gradient(to bottom right, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%);
  position: relative;

  // 装饰性几何图形
  &::before {
    content: "";
    position: absolute;
    top: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(
      circle,
      rgba(6, 182, 212, 0.1) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
    animation: float 20s ease-in-out infinite;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -150px;
    left: 10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(
      circle,
      rgba(14, 165, 233, 0.08) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
    animation: float 25s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%,
    100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(30px, -30px);
    }
    50% {
      transform: translate(-20px, 20px);
    }
    75% {
      transform: translate(40px, 10px);
    }
  }
}
</style>
