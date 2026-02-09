import { defineStore } from "pinia";
import { ref } from "vue";

export type MaterialItem = {
  id: string;
  name: string;
  type: "image" | "audio" | "video" | "interactive";
  category: string;
  src: string;
  thumbnail?: string;
  description: string;
  tags: string[];
  style: string;
  适用环节: string[];
};

export const useMaterialsStore = defineStore("materials", () => {
  const materials = ref<MaterialItem[]>([]);
  const isLoading = ref(false);
  const selectedCategory = ref<string>("all");
  const searchKeyword = ref<string>("");

  // 加载素材库
  const loadMaterials = async () => {
    isLoading.value = true;
    try {
      // TODO: 从解析后的素材清单JSON加载
      // const response = await fetch('/config/materials.json')
      // materials.value = await response.json()

      // 临时模拟数据
      materials.value = [
        {
          id: "P-01",
          name: "作者青年健康照",
          type: "image",
          category: "作者肖像",
          src: "/data/resource/pic/P-01.jpg",
          description: "史铁生青年时期健康照片",
          tags: ["作者", "青年", "史铁生"],
          style: "纪实摄影",
          适用环节: ["导入", "背景介绍"],
        },
        {
          id: "A-01",
          name: "秋风落叶环境音",
          type: "audio",
          category: "环境音效",
          src: "/data/resource/audio/autumn-wind.mp3",
          description: "秋天落叶的环境音效",
          tags: ["环境音", "秋天", "落叶"],
          style: "自然音效",
          适用环节: ["导入", "情境营造"],
        },
      ];
    } catch (error) {
      console.error("加载素材失败:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // 搜索素材
  const searchMaterials = (keyword: string) => {
    searchKeyword.value = keyword;
  };

  // 按分类筛选
  const filterByCategory = (category: string) => {
    selectedCategory.value = category;
  };

  // 获取过滤后的素材
  const filteredMaterials = () => {
    let result = materials.value;

    if (selectedCategory.value !== "all") {
      result = result.filter((m) => m.category === selectedCategory.value);
    }

    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(keyword) ||
          m.description.toLowerCase().includes(keyword) ||
          m.tags.some((tag) => tag.toLowerCase().includes(keyword)),
      );
    }

    return result;
  };

  return {
    materials,
    isLoading,
    selectedCategory,
    searchKeyword,
    loadMaterials,
    searchMaterials,
    filterByCategory,
    filteredMaterials,
  };
});
