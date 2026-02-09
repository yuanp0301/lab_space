<template>
  <div>
    <!-- AI助手浮动按钮（收起状态） -->
    <Transition name="fab">
      <div v-if="!dialogVisible" class="ai-assistant-fab" @click="toggleDialog">
        <div class="fab-icon">
          <el-icon :size="28"><ChatDotRound /></el-icon>
        </div>
        <div class="fab-pulse"></div>
      </div>
    </Transition>

    <!-- AI对话窗口（展开状态） -->
    <Transition name="slide-fade">
      <div v-if="dialogVisible" class="ai-dialog-panel">
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">🤖</div>
            <div class="header-text">
              <div class="title">AI 教学助手</div>
              <div class="subtitle">智能辅助您的课程设计</div>
            </div>
          </div>
          <button class="close-btn" @click="toggleDialog">
            <el-icon :size="20"><Close /></el-icon>
          </button>
        </div>

        <div class="dialog-content">
          <!-- 消息历史 -->
          <div class="message-list" ref="messageListRef">
            <div v-if="messages.length === 0" class="empty-state">
              <div class="empty-icon">💭</div>
              <p>您好！我是AI教学助手</p>
              <p class="empty-hint">有什么我可以帮助您的吗？</p>
            </div>

            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="message"
              :class="msg.role"
            >
              <div class="message-avatar">
                {{ msg.role === "user" ? "👤" : "🤖" }}
              </div>
              <div class="message-content">
                <div class="message-text">{{ msg.content }}</div>
              </div>
            </div>

            <div v-if="isLoading" class="message assistant">
              <div class="message-avatar">🤖</div>
              <div class="message-content loading">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span class="loading-text">AI正在思考中...</span>
              </div>
            </div>
          </div>

          <!-- 输入框 -->
          <div class="input-area">
            <el-input
              v-model="inputText"
              type="textarea"
              :rows="3"
              placeholder="输入您的问题，比如：如何设计一个吸引学生的导入环节？"
              @keydown.enter.prevent="sendMessage"
              class="input-field"
            />
            <el-button
              type="primary"
              @click="sendMessage"
              :loading="isLoading"
              :disabled="!inputText.trim()"
              class="send-btn"
            >
              <el-icon v-if="!isLoading"><Promotion /></el-icon>
              发送
            </el-button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import {
  ChatDotRound,
  Loading,
  Close,
  Promotion,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { chatWithAI, type AIMessage } from "@/utils/aiService";
import { useRoute } from "vue-router";

const route = useRoute();
const dialogVisible = ref(false);
const inputText = ref("");
const messages = ref<AIMessage[]>([]);
const isLoading = ref(false);
const messageListRef = ref<HTMLElement>();

const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return;

  const userMessage = inputText.value.trim();
  messages.value.push({
    role: "user",
    content: userMessage,
  });

  inputText.value = "";
  isLoading.value = true;

  // 滚动到底部
  await nextTick();
  scrollToBottom();

  try {
    // 获取当前页面上下文
    const context = `当前页面：${getPageContext()}`;

    const response = await chatWithAI(
      userMessage,
      messages.value.slice(0, -1), // 不包括刚添加的用户消息
      context,
    );

    messages.value.push({
      role: "assistant",
      content: response,
    });

    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("AI调用失败:", error);
    ElMessage.error("抱歉，AI助手暂时无法响应，请稍后再试");
  } finally {
    isLoading.value = false;
  }
};

const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
};

const getPageContext = () => {
  const pageName: Record<string, string> = {
    "/teaching-analysis": "教学解读模块",
    "/course-design": "课程设计模块",
    "/knowledge-system": "知识点体系模块",
    "/material-library": "素材库模块",
    "/slide-generator": "课件生成模块",
    "/assignment-design": "作业设计模块",
  };
  return pageName[route.path] || "首页";
};
</script>

<style scoped lang="scss">
// 浮动按钮（收起状态）
.ai-assistant-fab {
  position: fixed;
  bottom: 36px;
  right: 36px;
  width: 70px;
  height: 70px;
  cursor: pointer;
  z-index: 1000;

  .fab-icon {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 12px 48px rgba(6, 182, 212, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid rgba(255, 255, 255, 0.2);

    &:hover {
      transform: scale(1.15) rotate(5deg);
      box-shadow:
        0 16px 64px rgba(6, 182, 212, 0.7),
        0 0 0 1px rgba(255, 255, 255, 0.3),
        inset 0 2px 4px rgba(255, 255, 255, 0.4);
    }

    &:active {
      transform: scale(1.05) rotate(0deg);
    }
  }

  .fab-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(6, 182, 212, 0.4);
    animation: pulse 2.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.3);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

// 对话面板（展开状态）
.ai-dialog-panel {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  width: 440px;
  height: 720px;
  max-height: calc(100vh - 80px);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 24px;
  box-shadow:
    0 30px 80px rgba(6, 182, 212, 0.25),
    0 0 0 1px rgba(6, 182, 212, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1001;
  border: 1px solid rgba(255, 255, 255, 0.6);

  .dialog-header {
    padding: 24px 28px;
    background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-icon {
        font-size: 32px;
        filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.3));
      }

      .header-text {
        .title {
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 2px;
        }

        .subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
      }

      &:active {
        transform: rotate(90deg) scale(0.9);
      }
    }
  }

  .dialog-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(56, 189, 248, 0.3);
      border-radius: 3px;

      &:hover {
        background: rgba(56, 189, 248, 0.5);
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #64748b;

      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      p {
        margin: 4px 0;
        font-size: 15px;
      }

      .empty-hint {
        font-size: 13px;
        color: #94a3b8;
      }
    }

    .message {
      display: flex;
      margin-bottom: 16px;
      animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      &.user {
        flex-direction: row-reverse;

        .message-avatar {
          margin-left: 10px;
        }

        .message-content {
          background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.25);
        }
      }

      &.assistant {
        .message-avatar {
          margin-right: 10px;
        }

        .message-content {
          background: white;
          color: #0c4a6e;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(186, 230, 253, 0.3);

          &.loading {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }
      }

      .message-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
      }

      .message-content {
        max-width: 75%;
        padding: 12px 16px;
        border-radius: 12px;

        .message-text {
          word-break: break-word;
          white-space: pre-wrap;
          line-height: 1.6;
          font-size: 14px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;

          span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #38bdf8;
            animation: typing 1.4s infinite;

            &:nth-child(2) {
              animation-delay: 0.2s;
            }

            &:nth-child(3) {
              animation-delay: 0.4s;
            }
          }
        }

        .loading-text {
          font-size: 13px;
          color: #0284c7;
        }
      }
    }
  }

  .input-area {
    padding: 16px 20px;
    background: white;
    border-top: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    :deep(.el-textarea__inner) {
      resize: none;
      border: 1px solid #bae6fd;
      border-radius: 8px;
      padding: 12px;
      font-size: 14px;
      transition: all 0.3s;

      &:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
      }
    }

    .send-btn {
      align-self: flex-end;
      background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
      border: none;
      border-radius: 8px;
      padding: 10px 24px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(56, 189, 248, 0.25);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(56, 189, 248, 0.35);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// 动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

// Transition动画
.fab-enter-active,
.fab-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-50%) translateX(100px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(100px) scale(0.9);
}
</style>
