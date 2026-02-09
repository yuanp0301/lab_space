import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/teaching-analysis",
    name: "TeachingAnalysis",
    component: () => import("@/views/TeachingInterpretation.vue"),
  },
  {
    path: "/course-design",
    name: "CourseDesign",
    component: () => import("@/views/CourseDesign.vue"),
  },
  {
    path: "/knowledge-system",
    name: "KnowledgeSystem",
    component: () => import("@/views/KnowledgeSystem.vue"),
  },
  {
    path: "/material-library",
    name: "MaterialLibrary",
    component: () => import("@/views/MaterialLibrary.vue"),
  },
  {
    path: "/slide-generator",
    name: "SlideGenerator",
    component: () => import("@/views/SlideGenerator.vue"),
  },
  {
    path: "/assignment-design",
    name: "AssignmentDesign",
    component: () => import("@/views/HomeworkDesign.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
