# 课件生成模块

## 功能概述

课件生成模块是一个完整的教学课件制作系统,支持从课程设计到课件生成的全流程。

## 核心组件

### 1. SlideGenerator.vue (主页面)

- 课件生成器入口页面
- 提供模板选择功能(6种预设模板风格)
- 支持编辑和预览模式切换
- 集成课件设计思路编辑
- 课件保存功能

**功能特性:**

- 🎨 6种课件模板:蓝色清新、橙色温暖、绿色自然、紫色典雅、红色热情、灰色现代
- ✏️ 编辑/预览模式无缝切换
- 📋 课件设计思路编辑
- 💾 课件保存到用户目录

### 2. SlideEditor.vue (编辑器)

- 左侧课件页面列表(支持拖拽排序)
- 右侧详细编辑区

**功能特性:**

- 📄 页面管理:添加、删除、拖拽排序
- 🖼️ 富文本内容编辑
- 🎬 素材管理:图片、视频、音频
- 🎨 背景图片设置
- ✨ 页面过渡效果配置
- 🏷️ 页面类型分类(标题页、讲解页、互动页等)

### 3. SlidePreview.vue (预览器)

- 全屏课件预览
- 支持键盘导航
- 课件导航抽屉

**功能特性:**

- ⌨️ 键盘导航支持:
  - 左箭头/PageUp: 上一页
  - 右箭头/PageDown/空格: 下一页
  - Home: 第一页
  - End: 最后一页
- 🖥️ 全屏模式
- 🧭 课件导航抽屉
- 📤 导出功能(待实现)

### 4. SlideDesignEditor.vue (设计思路编辑器)

- 基于35页课件设计思路的结构化编辑器
- 模块化课件设计

**功能特性:**

- 📊 基本信息配置(课程名称、总页数、风格)
- 📦 模块化结构设计:
  - 模块标题、类型、页数
  - 内容要点描述
  - 素材需求勾选
  - 教学活动规划
- 🎓 教学建议编辑(重点、难点、学情分析)
- ⚙️ AI生成选项配置
- 🔄 根据设计思路重新生成课件

## 数据结构

### Slide (课件页面)

```typescript
type Slide = {
  id: string; // 唯一标识
  title: string; // 页面标题
  content: string; // HTML内容
  bgImage?: string; // 背景图片URL
  materials: Material[]; // 素材列表
  transition?: string; // 过渡效果
  type?: string; // 页面类型
};
```

### Material (素材)

```typescript
type Material = {
  type: "image" | "audio" | "video"; // 素材类型
  src: string; // 素材URL
  position?: string; // 位置(如center, left, right)
};
```

### SlideData (课件数据)

```typescript
type SlideData = {
  username: string; // 教师姓名
  lessonTitle: string; // 课程标题
  updateTime: string; // 更新时间
  template: string; // 模板ID
  slides: Slide[]; // 页面列表
};
```

## 使用流程

### 1. 生成新课件

1. 点击"生成课件"按钮
2. 输入课程名称和教师姓名
3. 选择课件模板风格
4. 点击"开始生成"

### 2. 编辑课件

- 在左侧列表选择要编辑的页面
- 编辑标题、内容、背景图、素材等
- 支持拖拽调整页面顺序
- 添加/删除页面

### 3. 预览课件

- 点击"预览"按钮进入预览模式
- 使用键盘或鼠标导航
- 支持全屏查看

### 4. 使用设计思路

1. 点击"课件设计思路"按钮
2. 配置基本信息和课件模块
3. 填写教学建议
4. 点击"生成课件"根据设计思路生成完整课件

### 5. 保存课件

- 点击"保存"按钮
- 课件保存到 `data/users/{username}/课件内容.json`

## 待实现功能

### 后端API集成

- [ ] AI生成35页课件接口
- [ ] 根据设计思路生成课件接口
- [ ] 素材上传接口
- [ ] 课件保存和加载接口
- [ ] 素材库集成

### 高级功能

- [ ] 导出为PDF
- [ ] 导出为PPT
- [ ] 更多模板支持
- [ ] 富文本编辑器增强(集成编辑器如TinyMCE或Quill)
- [ ] 素材库浏览和选择
- [ ] AI生成配图
- [ ] 课件版本管理
- [ ] 课件分享和协作

### 用户体验优化

- [ ] 自动保存
- [ ] 撤销/重做
- [ ] 快捷键优化
- [ ] 移动端适配
- [ ] 拖拽上传文件
- [ ] 实时预览
- [ ] 主题切换

## 技术栈

- **Vue 3** - 组件框架
- **TypeScript** - 类型系统
- **Element Plus** - UI组件库
- **Pinia** - 状态管理
- **vuedraggable** - 拖拽功能
- **SCSS** - 样式预处理

## 目录结构

```
src/
├── components/
│   └── slides/
│       ├── SlideGenerator.vue      # 主页面
│       ├── SlideEditor.vue         # 编辑器
│       ├── SlidePreview.vue        # 预览器
│       ├── SlideDesignEditor.vue   # 设计思路编辑器
│       └── README.md              # 本文档
├── stores/
│   └── slides.ts                  # 课件状态管理
└── views/
    └── SlideGenerator.vue         # 路由页面
```

## 开发指南

### 添加新的课件模板

在 `SlideGenerator.vue` 的 `templates` 数组中添加新模板配置:

```typescript
{
  id: 'template-new',
  name: '新模板',
  color: '#FF6B6B',
  description: '适合xxx类课程',
}
```

### 添加新的页面类型

在 `SlideEditor.vue` 的页面类型选择器中添加新选项。

### 自定义过渡效果

在 `SlidePreview.vue` 的样式中添加新的过渡效果class。

## 参考文档

- [Element Plus](https://element-plus.org/)
- [Vue 3](https://vuejs.org/)
- [vuedraggable](https://github.com/SortableJS/vue.draggable.next)
- [课件设计思路文档](../../../../data/busi/6.%20《秋天的怀念》课件设计思路.md)

## 更新日志

### v1.0.0 (当前版本)

- ✅ 完成基础课件生成器页面
- ✅ 完成课件编辑器(支持拖拽排序)
- ✅ 完成课件预览器(支持键盘导航)
- ✅ 完成设计思路编辑器
- ✅ 集成Pinia状态管理
- ✅ 6种预设模板
- ✅ 素材管理功能
