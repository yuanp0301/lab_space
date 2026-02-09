import { defineStore } from "pinia";
import { ref } from "vue";
import { courseDesignApi } from "@/api/course-design.api";

export type Section = {
  id: string;
  title: string;
  mainQuestion: string;
  subQuestions: string[];
  activities: string;
  knowledgePoints: string[];
  expectedOutcome: string;
  verification: string;
  duration: number;
};

export type Lesson = {
  title: string;
  sections: Section[];
};

export type CourseDesign = {
  lesson1: Lesson;
  lesson2: Lesson;
};

export type CourseData = {
  username: string;
  lessonTitle: string;
  updateTime: string;
  courseDesign: CourseDesign;
};

export const useCourseStore = defineStore("course", () => {
  const courseData = ref<CourseData | null>(null);
  const isLoading = ref(false);
  const currentView = ref<"table" | "card" | "timeline">("table");

  // 加载初始课程设计数据
  const loadCourseDesign = async (username?: string) => {
    isLoading.value = true;
    try {
      // 如果提供了用户名，尝试从后端加载
      if (username) {
        const data = await courseDesignApi.loadCourseDesign(username);
        if (data) {
          courseData.value = data;
          return;
        }
      }

      // 否则创建空白模板
      courseData.value = {
        username: username || "",
        lessonTitle: "秋天的怀念",
        updateTime: new Date().toISOString(),
        courseDesign: {
          lesson1: {
            title: "整体感知·初探张力",
            sections: [],
          },
          lesson2: {
            title: "细读品味·领悟升华",
            sections: [],
          },
        },
      };
    } catch (error) {
      console.error("加载课程设计失败:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // 更新某个环节
  const updateSection = (
    lessonIndex: 1 | 2,
    sectionId: string,
    updates: Partial<Section>,
  ) => {
    if (!courseData.value) return;

    const lesson =
      lessonIndex === 1
        ? courseData.value.courseDesign.lesson1
        : courseData.value.courseDesign.lesson2;
    const section = lesson.sections.find((s) => s.id === sectionId);

    if (section) {
      Object.assign(section, updates);
      courseData.value.updateTime = new Date().toISOString();
    }
  };

  // 添加环节
  const addSection = (lessonIndex: 1 | 2, section: Section) => {
    if (!courseData.value) return;

    const lesson =
      lessonIndex === 1
        ? courseData.value.courseDesign.lesson1
        : courseData.value.courseDesign.lesson2;
    lesson.sections.push(section);
    courseData.value.updateTime = new Date().toISOString();
  };

  // 删除环节
  const deleteSection = (lessonIndex: 1 | 2, sectionId: string) => {
    if (!courseData.value) return;

    const lesson =
      lessonIndex === 1
        ? courseData.value.courseDesign.lesson1
        : courseData.value.courseDesign.lesson2;
    lesson.sections = lesson.sections.filter((s) => s.id !== sectionId);
    courseData.value.updateTime = new Date().toISOString();
  };

  // 切换视图
  const setView = (view: "table" | "card" | "timeline") => {
    currentView.value = view;
  };

  // 保存到后端
  const saveCourseDesign = async (username: string) => {
    if (!courseData.value) return;

    courseData.value.username = username;
    courseData.value.updateTime = new Date().toISOString();

    try {
      await courseDesignApi.saveCourseDesign(username, courseData.value);
    } catch (error) {
      console.error("保存失败:", error);
      throw error;
    }
  };

  // 列出用户的所有课程设计
  const listCourseDesigns = async (username: string) => {
    try {
      return await courseDesignApi.listUserCourseDesigns(username);
    } catch (error) {
      console.error("列出课程设计失败:", error);
      return [];
    }
  };

  // 删除课程设计
  const deleteCourseDesign = async (username: string, filename: string) => {
    try {
      await courseDesignApi.deleteCourseDesign(username, filename);
    } catch (error) {
      console.error("删除课程设计失败:", error);
      throw error;
    }
  };

  return {
    courseData,
    isLoading,
    currentView,
    loadCourseDesign,
    updateSection,
    addSection,
    deleteSection,
    setView,
    saveCourseDesign,
    listCourseDesigns,
    deleteCourseDesign,
  };
});
