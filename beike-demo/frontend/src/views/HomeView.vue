<template>
  <div class="home-view">
    <!-- 课程简介卡片 - 紧凑版 -->
    <div class="course-intro-card">
      <div class="intro-layout">
        <!-- 左侧：课程名称 -->
        <div class="intro-left">
          <span class="title-icon">📖</span>
          <div class="title-content">
            <h1 class="course-title">秋天的怀念</h1>
            <p class="course-author">史铁生</p>
          </div>
        </div>

        <!-- 右侧：信息卡片 -->
        <div class="intro-right">
          <div class="info-item">
            <div class="info-icon">✍️</div>
            <div class="info-content">
              <div class="info-label">作者</div>
              <div class="info-text">
                史铁生（1951-2010），当代作家，21岁瘫痪后坚持创作
              </div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">📝</div>
            <div class="info-content">
              <div class="info-label">主题</div>
              <div class="info-text">
                回忆母亲的关怀与鼓励，表达怀念与愧疚，以"看菊花"为线索展现母爱
              </div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">🎯</div>
            <div class="info-content">
              <div class="info-label">重点</div>
              <div class="info-text">
                <span class="tag">理解母爱</span>
                <span class="tag">情感变化</span>
                <span class="tag">细节描写</span>
                <span class="tag">生命意义</span>
              </div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">💎</div>
            <div class="info-content">
              <div class="info-label">价值</div>
              <div class="info-text">
                感受亲情、学会感恩、培养面对困境的勇气
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 资源展示区域 -->
    <div class="resources-section">
      <!-- 第一组：课程设计案例 -->
      <div class="resource-group">
        <div class="group-header">
          <div class="group-icon">📋</div>
          <h2 class="group-title">课程设计案例</h2>
        </div>
        <div class="resource-grid">
          <div class="resource-card" @click="goToCourseDesign">
            <div class="resource-icon">🎯</div>
            <h3 class="resource-name">情景任务式</h3>
            <p class="resource-desc">以任务驱动，情境化教学</p>
            <div class="resource-arrow">→</div>
          </div>
          <div class="resource-card" @click="goToCourseDesign">
            <div class="resource-icon">📚</div>
            <h3 class="resource-name">大单元教学</h3>
            <p class="resource-desc">整体设计，系统化教学</p>
            <div class="resource-arrow">→</div>
          </div>
          <div class="resource-card" @click="goToCourseDesign">
            <div class="resource-icon">🔬</div>
            <h3 class="resource-name">探究式</h3>
            <p class="resource-desc">引导探究，自主发现</p>
            <div class="resource-arrow">→</div>
          </div>
          <div class="resource-card" @click="goToCourseDesign">
            <div class="resource-icon">🚀</div>
            <h3 class="resource-name">项目式</h3>
            <p class="resource-desc">项目驱动，实践应用</p>
            <div class="resource-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- 第二组：优先课件 -->
      <div class="resource-group">
        <div class="group-header">
          <div class="group-icon">🎬</div>
          <h2 class="group-title">优先课件</h2>
        </div>
        <div class="resource-grid">
          <div class="resource-card" @click="goToSlideGenerator">
            <div class="resource-icon">📊</div>
            <h3 class="resource-name">课件一</h3>
            <p class="resource-desc">《秋天的怀念》完整课件</p>
            <div class="resource-arrow">→</div>
          </div>
          <div class="resource-card" @click="goToSlideGenerator">
            <div class="resource-icon">📊</div>
            <h3 class="resource-name">课件二</h3>
            <p class="resource-desc">情境任务式教学课件</p>
            <div class="resource-arrow">→</div>
          </div>
          <div class="resource-card" @click="goToSlideGenerator">
            <div class="resource-icon">📊</div>
            <h3 class="resource-name">课件三</h3>
            <p class="resource-desc">互动式教学课件</p>
            <div class="resource-arrow">→</div>
          </div>
          <div class="resource-card" @click="goToSlideGenerator">
            <div class="resource-icon">📊</div>
            <h3 class="resource-name">课件四</h3>
            <p class="resource-desc">多媒体融合课件</p>
            <div class="resource-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- 第三组：优质资源 -->
      <div class="resource-group">
        <div class="group-header">
          <div class="group-icon">⭐</div>
          <h2 class="group-title">优质资源</h2>
        </div>
        <div class="resource-grid resource-grid-5">
          <div class="resource-card" @click="goToCourseDesign">
            <div class="resource-icon">📝</div>
            <h3 class="resource-name">教学设计</h3>
            <p class="resource-desc">完整教学设计方案</p>
            <div class="resource-arrow">→</div>
          </div>
          <div class="resource-card" @click="goToCourseDesign">
            <div class="resource-icon">📄</div>
            <h3 class="resource-name">讲义</h3>
            <p class="resource-desc">教师授课讲义</p>
            <div class="resource-arrow">→</div>
          </div>
          <div class="resource-card" @click="goToSlideGenerator">
            <div class="resource-icon">🎯</div>
            <h3 class="resource-name">课件</h3>
            <p class="resource-desc">精美教学课件</p>
            <div class="resource-arrow">→</div>
          </div>
          <div class="resource-card" @click="goToKnowledgeSystem">
            <div class="resource-icon">📋</div>
            <h3 class="resource-name">知识清单</h3>
            <p class="resource-desc">系统化知识梳理</p>
            <div class="resource-arrow">→</div>
          </div>
          <div class="resource-card" @click="goToAssignmentDesign">
            <div class="resource-icon">✍️</div>
            <h3 class="resource-name">课后练习</h3>
            <p class="resource-desc">分层练习设计</p>
            <div class="resource-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goToCourseDesign = () => {
  router.push("/course-design");
};

const goToSlideGenerator = () => {
  router.push("/slide-generator");
};

const goToKnowledgeSystem = () => {
  router.push("/knowledge-system");
};

const goToAssignmentDesign = () => {
  router.push("/assignment-design");
};
</script>

<style scoped lang="scss">
.home-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.course-intro-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px 40px;
  box-shadow:
    0 12px 40px rgba(6, 182, 212, 0.12),
    0 0 0 1px rgba(6, 182, 212, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(6, 182, 212, 0.25);
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #06b6d4 0%, #0ea5e9 50%, #22d3ee 100%);
    box-shadow: 0 2px 12px rgba(6, 182, 212, 0.4);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(6, 182, 212, 0.03) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  .intro-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 32px;
    align-items: center;

    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .intro-left {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 24px 28px;
    background: linear-gradient(
      135deg,
      rgba(224, 242, 254, 0.7) 0%,
      rgba(186, 230, 253, 0.5) 100%
    );
    border-radius: 16px;
    border: 2px solid rgba(6, 182, 212, 0.3);
    box-shadow:
      0 8px 24px rgba(6, 182, 212, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
        circle at 20% 50%,
        rgba(6, 182, 212, 0.1) 0%,
        transparent 50%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow:
        0 12px 32px rgba(6, 182, 212, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 1);
      border-color: rgba(6, 182, 212, 0.4);

      &::before {
        opacity: 1;
      }

      .title-icon {
        transform: scale(1.1) rotate(-5deg);
      }
    }

    .title-icon {
      font-size: 56px;
      flex-shrink: 0;
      filter: drop-shadow(0 4px 12px rgba(6, 182, 212, 0.4));
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 1;
    }

    .title-content {
      position: relative;
      z-index: 1;

      .course-title {
        font-size: 32px;
        font-weight: 800;
        background: linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 6px 0;
        line-height: 1.2;
        letter-spacing: -0.5px;
      }

      .course-author {
        font-size: 16px;
        color: #0284c7;
        font-weight: 600;
        margin: 0;
        opacity: 0.9;
      }
    }
  }

  .intro-right {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }

    .info-item {
      display: flex;
      gap: 14px;
      padding: 18px 20px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(240, 253, 255, 0.8) 100%
      );
      backdrop-filter: blur(10px);
      border-radius: 12px;
      border: 1px solid rgba(6, 182, 212, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow:
        0 4px 12px rgba(6, 182, 212, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, #06b6d4 0%, #0ea5e9 100%);
        transform: scaleY(0);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(6, 182, 212, 0.05) 0%,
          transparent 70%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow:
          0 12px 24px rgba(6, 182, 212, 0.15),
          0 0 0 1px rgba(6, 182, 212, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 1);
        border-color: rgba(6, 182, 212, 0.4);
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 1) 0%,
          rgba(240, 253, 255, 0.95) 100%
        );

        &::before {
          transform: scaleY(1);
        }

        &::after {
          opacity: 1;
        }

        .info-icon {
          transform: scale(1.1) rotate(5deg);
        }
      }

      .info-icon {
        font-size: 32px;
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          135deg,
          rgba(6, 182, 212, 0.1) 0%,
          rgba(14, 165, 233, 0.1) 100%
        );
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        filter: drop-shadow(0 2px 8px rgba(6, 182, 212, 0.2));
      }

      .info-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;

        .info-label {
          font-size: 13px;
          font-weight: 700;
          color: #06b6d4;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }

        .info-text {
          font-size: 14px;
          color: #075985;
          line-height: 1.6;
          position: relative;
          z-index: 1;

          .tag {
            display: inline-block;
            padding: 4px 10px;
            margin: 2px 4px 2px 0;
            background: linear-gradient(
              135deg,
              rgba(6, 182, 212, 0.15) 0%,
              rgba(14, 165, 233, 0.15) 100%
            );
            border: 1px solid rgba(6, 182, 212, 0.3);
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            color: #0284c7;
            transition: all 0.2s ease;

            &:hover {
              background: linear-gradient(
                135deg,
                rgba(6, 182, 212, 0.25) 0%,
                rgba(14, 165, 233, 0.25) 100%
              );
              border-color: rgba(6, 182, 212, 0.5);
              transform: translateY(-1px);
            }
          }
        }
      }
    }
  }
}

.resources-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.resource-group {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px 40px;
  box-shadow:
    0 12px 40px rgba(6, 182, 212, 0.1),
    0 0 0 1px rgba(6, 182, 212, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(6, 182, 212, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #06b6d4 0%, #0ea5e9 50%, #22d3ee 100%);
    box-shadow: 0 2px 12px rgba(6, 182, 212, 0.4);
  }

  .group-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;

    .group-icon {
      font-size: 28px;
      filter: drop-shadow(0 2px 8px rgba(6, 182, 212, 0.3));
    }

    .group-title {
      font-size: 22px;
      font-weight: 700;
      color: #0c4a6e;
      margin: 0;
      background: linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .resource-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    position: relative;
    z-index: 1;

    // 第三组优质资源特殊处理（5个卡片）
    &.resource-grid-5 {
      grid-template-columns: repeat(5, 1fr);
      
      @media (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
      }
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  .resource-card {
    padding: 24px 20px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(240, 253, 255, 0.85) 100%
    );
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1.5px solid rgba(6, 182, 212, 0.2);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    box-shadow:
      0 6px 20px rgba(6, 182, 212, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 140px;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #06b6d4, #0ea5e9, #22d3ee);
      transform: scaleX(0);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 12px rgba(6, 182, 212, 0.5);
    }

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: radial-gradient(
        circle,
        rgba(6, 182, 212, 0.1) 0%,
        transparent 70%
      );
      transform: translate(-50%, -50%);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 50%;
      opacity: 0;
    }

    &:hover {
      transform: translateY(-6px) scale(1.02);
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(224, 242, 254, 0.95) 100%
      );
      box-shadow:
        0 16px 40px rgba(6, 182, 212, 0.2),
        0 0 0 1px rgba(6, 182, 212, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 1);
      border-color: rgba(6, 182, 212, 0.4);

      &::before {
        transform: scaleX(1);
      }

      &::after {
        width: 200px;
        height: 200px;
        opacity: 1;
      }

      .resource-icon {
        transform: scale(1.15) rotate(5deg);
      }

      .resource-arrow {
        opacity: 1;
        transform: translateX(4px);
      }
    }

    &:active {
      transform: translateY(-3px) scale(1.01);
    }

    .resource-icon {
      font-size: 48px;
      margin-bottom: 12px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      filter: drop-shadow(0 3px 10px rgba(6, 182, 212, 0.3));
      position: relative;
      z-index: 1;
    }

    .resource-name {
      font-size: 16px;
      font-weight: 700;
      color: #0c4a6e;
      margin: 0 0 8px 0;
      position: relative;
      z-index: 1;
    }

    .resource-desc {
      font-size: 13px;
      color: #075985;
      line-height: 1.5;
      margin: 0;
      position: relative;
      z-index: 1;
      opacity: 0.85;
    }

    .resource-arrow {
      position: absolute;
      bottom: 16px;
      right: 20px;
      font-size: 20px;
      color: #06b6d4;
      font-weight: 700;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
    }
  }
}
</style>
