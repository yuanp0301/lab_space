import { defineStore } from "pinia";
import { ref } from "vue";

export type Material = {
  type: "image" | "audio" | "video";
  src: string;
  position?: string;
};

export type Slide = {
  id: string;
  title: string;
  content: string;
  bgImage?: string;
  materials: Material[];
  transition?: string;
  type?: string;
};

export type SlideData = {
  username: string;
  lessonTitle: string;
  updateTime: string;
  template: string;
  slides: Slide[];
};

export const useSlidesStore = defineStore("slides", () => {
  const slideData = ref<SlideData | null>(null);
  const isLoading = ref(false);
  const currentSlideIndex = ref(0);
  const generationMode = ref<"template" | "manual">("template");

  // 加载课件数据
  const loadSlides = async () => {
    isLoading.value = true;
    try {
      // TODO: 从解析后的JSON文件加载数据
      slideData.value = {
        username: "",
        lessonTitle: "秋天的怀念",
        updateTime: new Date().toISOString(),
        template: "template-blue-cold",
        slides: [],
      };
    } catch (error) {
      console.error("加载课件失败:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // 基于模版生成课件
  const generateFromTemplate = async (
    templateId: string,
    lessonTitle: string,
    username: string,
  ) => {
    isLoading.value = true;
    try {
      // TODO: 调用AI生成35页课件
      console.log("使用模版生成课件:", templateId, lessonTitle);

      // 临时模拟数据 - 生成基础课件结构
      slideData.value = {
        username: username,
        lessonTitle: lessonTitle,
        updateTime: new Date().toISOString(),
        template: templateId,
        slides: [
          {
            id: "slide-1",
            title: lessonTitle,
            content: `<h1>${lessonTitle}</h1><p>教师: ${username}</p>`,
            materials: [],
            transition: "fade",
            type: "title",
          },
          {
            id: "slide-2",
            title: "教学目标",
            content:
              "<h2>教学目标</h2><ul><li>知识与技能</li><li>过程与方法</li><li>情感态度价值观</li></ul>",
            materials: [],
            transition: "slide",
            type: "lecture",
          },
          {
            id: "slide-3",
            title: "课程内容",
            content: "<h2>课程内容</h2><p>点击编辑添加课程内容...</p>",
            materials: [],
            transition: "fade",
            type: "lecture",
          },
        ],
      };
    } catch (error) {
      console.error("生成课件失败:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 根据设计思路生成课件
  const generateFromDesign = async (designData: any) => {
    isLoading.value = true;
    try {
      // TODO: 调用AI根据设计思路生成课件
      console.log("根据设计思路生成课件:", designData);
      // 这里可以解析designData并生成完整的35页课件
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
  const saveSlides = async (username: string) => {
    if (!slideData.value) return;

    slideData.value.username = username;
    slideData.value.updateTime = new Date().toISOString();

    try {
      // TODO: 调用后端API保存到 data/users/{username}/课件内容.json
      console.log("保存课件:", slideData.value);
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
