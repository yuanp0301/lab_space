import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/AppLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/pages/index.vue"),
      },
      {
        path: "chat",
        name: "chat",
        component: () => import("@/pages/chat/index.vue"),
      },
      {
        path: "experiments",
        name: "experiments",
        component: () => import("@/pages/experiments/index.vue"),
      },
      {
        path: "experiments/:id",
        name: "experiment-detail",
        component: () => import("@/pages/experiments/[id].vue"),
      },
      {
        path: "experiments/html-assistant",
        name: "html-assistant",
        component: () => import("@/pages/experiments/html-assistant.vue"),
      },
      {
        path: "experiments/dream-image",
        name: "dream-image",
        component: () => import("@/pages/experiments/dream-image.vue"),
      },
      {
        path: "experiments/audio",
        name: "audio",
        component: () => import("@/pages/experiments/audio.vue"),
      },
      {
        path: "experiments/pdf-to-word",
        name: "pdf-to-word",
        component: () => import("@/pages/experiments/[id].vue"),
      },
      {
        path: "experiments/chart-assistant",
        name: "chart-assistant",
        component: () => import("@/pages/experiments/[id].vue"),
      },
      {
        path: "experiments/prompt-market",
        name: "prompt-market",
        component: () => import("@/pages/experiments/[id].vue"),
      },
      {
        path: "experiments/knowledge-base",
        name: "knowledge-base",
        component: () => import("@/pages/experiments/[id].vue"),
      },
      {
        path: "experiments/image-upscale",
        name: "image-upscale",
        component: () => import("@/pages/experiments/[id].vue"),
      },
      {
        path: "experiments/ai-matting",
        name: "ai-matting",
        component: () => import("@/pages/experiments/[id].vue"),
      },
      {
        path: "experiments/image-to-desc",
        name: "image-to-desc",
        component: () => import("@/pages/experiments/[id].vue"),
      },
      {
        path: "experiments/public-gallery",
        name: "public-gallery",
        component: () => import("@/pages/experiments/[id].vue"),
      },
      {
        path: "experiments/my-works",
        name: "my-works",
        component: () => import("@/pages/experiments/[id].vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
