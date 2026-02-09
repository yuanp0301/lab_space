import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  Material,
  GeneratedSlide,
  GeneratedSlideData,
  GenerateFromDesignRequest,
} from "@/types/slide.types";
import { slideGenerateApi } from "@/api/slide-generate.api";

// 为了向后兼容，导出别名
export type Slide = GeneratedSlide;
export type SlideData = GeneratedSlideData;
export type { Material };

export const useSlidesStore = defineStore("slides", () => {
  const slideData = ref<SlideData | null>(null);
  const isLoading = ref(false);
  const currentSlideIndex = ref(0);
  const generationMode = ref<"template" | "manual">("template");

  // 加载课件数据
  const loadSlides = async (username: string, lessonTitle: string) => {
    isLoading.value = true;
    try {
      const data = await slideGenerateApi.loadSlides(username, lessonTitle);
      slideData.value = data;
    } catch (error) {
      console.error("加载课件失败:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 基于模版生成课件
  const generateFromTemplate = async (
    templateId: string,
    lessonTitle: string,
    username: string,
    grade?: string,
    subject?: string,
    requirements?: string,
  ) => {
    isLoading.value = true;
    try {
      const data = await slideGenerateApi.generateFromTemplate({
        templateId,
        lessonTitle,
        username,
        grade,
        subject,
        requirements,
      });
      slideData.value = data;
    } catch (error) {
      console.error("生成课件失败:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 根据设计思路生成课件
  const generateFromDesign = async (params: GenerateFromDesignRequest) => {
    isLoading.value = true;
    try {
      const data = await slideGenerateApi.generateFromDesign(params);
      slideData.value = data;
    } catch (error) {
      console.error("生成课件失败:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 更新单个页面
  const updateSlide = (slideId: string, updates: Partial<Slide>) => {
    if (!slideData.value) return;

    const slide = slideData.value.slides.find((s) => s.id === slideId);
    if (slide) {
      Object.assign(slide, updates);
      slideData.value.updateTime = new Date().toISOString();
    }
  };

  // 添加页面
  const addSlide = (slide: Slide, position?: number) => {
    if (!slideData.value) return;

    if (position !== undefined) {
      slideData.value.slides.splice(position, 0, slide);
    } else {
      slideData.value.slides.push(slide);
    }
    slideData.value.updateTime = new Date().toISOString();
  };

  // 删除页面
  const deleteSlide = (slideId: string) => {
    if (!slideData.value) return;

    slideData.value.slides = slideData.value.slides.filter(
      (s) => s.id !== slideId,
    );
    slideData.value.updateTime = new Date().toISOString();
  };

  // 设置当前页面
  const setCurrentSlide = (index: number) => {
    currentSlideIndex.value = index;
  };

  // 保存课件
  const saveSlides = async () => {
    if (!slideData.value) {
      throw new Error("没有课件数据可以保存");
    }

    slideData.value.updateTime = new Date().toISOString();

    try {
      await slideGenerateApi.saveSlides(slideData.value);
    } catch (error) {
      console.error("保存失败:", error);
      throw error;
    }
  };

  return {
    slideData,
    isLoading,
    currentSlideIndex,
    generationMode,
    loadSlides,
    generateFromTemplate,
    generateFromDesign,
    updateSlide,
    addSlide,
    deleteSlide,
    setCurrentSlide,
    saveSlides,
  };
});
