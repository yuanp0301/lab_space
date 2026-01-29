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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
