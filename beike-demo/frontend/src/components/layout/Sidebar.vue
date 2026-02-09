<template>
  <aside class="app-sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">📚</span>
        <span class="logo-text">备课助手</span>
      </div>
      <div class="subtitle">秋天的怀念</div>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-item-text">{{ item.label }}</span>
        <span v-if="item.star" class="star">⭐</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info" v-if="userStore.username">
        <div class="avatar">{{ userStore.username.charAt(0) }}</div>
        <span class="username">{{ userStore.username }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const userStore = useUserStore();

const menuItems = [
  {
    path: "/",
    icon: "🏠",
    label: "首页",
  },
  {
    path: "/teaching-analysis",
    icon: "📖",
    label: "教学解读",
  },
  {
    path: "/course-design",
    icon: "📝",
    label: "课程设计",
    star: true,
  },
  {
    path: "/slide-generator",
    icon: "🎬",
    label: "课件生成",
    star: true,
  },
  {
    path: "/knowledge-system",
    icon: "📊",
    label: "知识点体系",
  },
  {
    path: "/material-library",
    icon: "🎨",
    label: "素材库",
  },
  {
    path: "/assignment-design",
    icon: "✍️",
    label: "作业设计",
  },
];

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<style scoped lang="scss">
.app-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #0a3d5c 0%, #0c4a6e 50%, #0a3d5c 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 4px 0 40px rgba(0, 0, 0, 0.3);
  position: relative;
  backdrop-filter: blur(10px);

  // 毛玻璃光效
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(6, 182, 212, 0.6) 0%,
      rgba(6, 182, 212, 0.2) 50%,
      rgba(6, 182, 212, 0.6) 100%
    );
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  }

  // 顶部光晕效果
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: radial-gradient(
      ellipse at top,
      rgba(6, 182, 212, 0.15) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  .sidebar-header {
    padding: 36px 24px 28px;
    border-bottom: 1px solid rgba(6, 182, 212, 0.2);
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    position: relative;

    .logo {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;

      .logo-icon {
        font-size: 36px;
        filter: drop-shadow(0 0 12px rgba(6, 182, 212, 0.8));
        animation: iconGlow 3s ease-in-out infinite;
      }

      .logo-text {
        font-size: 22px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 1px;
        text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
      }
    }

    .subtitle {
      font-size: 13px;
      color: #7dd3fc;
      padding-left: 50px;
      font-weight: 400;
      opacity: 0.9;
    }
  }

  @keyframes iconGlow {
    0%,
    100% {
      filter: drop-shadow(0 0 12px rgba(6, 182, 212, 0.8));
    }
    50% {
      filter: drop-shadow(0 0 20px rgba(6, 182, 212, 1));
    }
  }

  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: 20px 0;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #06b6d4 0%, #0284c7 100%);
      border-radius: 3px;

      &:hover {
        background: linear-gradient(180deg, #22d3ee 0%, #06b6d4 100%);
      }
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    margin: 6px 16px;
    border-radius: 12px;

    // 悬停背景光效
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 70%;
      width: 4px;
      background: linear-gradient(180deg, #06b6d4 0%, #0ea5e9 100%);
      border-radius: 0 4px 4px 0;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.8);
    }

    // 悬停光晕
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      background: radial-gradient(
        circle,
        rgba(6, 182, 212, 0.3) 0%,
        transparent 70%
      );
      border-radius: 50%;
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      background: rgba(6, 182, 212, 0.15);
      color: #22d3ee;
      transform: translateX(8px);
      box-shadow: 0 4px 20px rgba(6, 182, 212, 0.2);

      &::after {
        width: 100%;
        height: 100%;
        opacity: 1;
      }
    }

    &.active {
      background: linear-gradient(
        135deg,
        rgba(6, 182, 212, 0.25) 0%,
        rgba(14, 165, 233, 0.2) 100%
      );
      color: #ffffff;
      box-shadow:
        0 8px 32px rgba(6, 182, 212, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);

      &::before {
        opacity: 1;
      }

      .menu-icon {
        filter: drop-shadow(0 0 8px rgba(6, 182, 212, 1));
        transform: scale(1.1);
      }
    }

    .menu-icon {
      font-size: 22px;
      margin-right: 14px;
      min-width: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .menu-item-text {
      font-size: 15px;
      flex: 1;
      font-weight: 500;
    }

    .star {
      margin-left: 10px;
      font-size: 14px;
      filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.8));
      animation: starTwinkle 2s ease-in-out infinite;
    }
  }

  @keyframes starTwinkle {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(0.9);
    }
  }

  .sidebar-footer {
    padding: 20px 24px;
    border-top: 1px solid rgba(6, 182, 212, 0.2);
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);

    .user-info {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px;
      background: rgba(6, 182, 212, 0.15);
      border-radius: 12px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      box-shadow:
        0 4px 20px rgba(6, 182, 212, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(6, 182, 212, 0.25);
        border-color: rgba(6, 182, 212, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(6, 182, 212, 0.3);
      }

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 18px;
        box-shadow:
          0 0 20px rgba(6, 182, 212, 0.6),
          inset 0 2px 4px rgba(255, 255, 255, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.2);
      }

      .username {
        font-size: 15px;
        color: #ffffff;
        font-weight: 600;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>
