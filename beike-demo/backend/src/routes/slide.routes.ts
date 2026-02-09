import express from "express";
import multer from "multer";
import { slideService } from "../services/slide.service";
import { templateService } from "../services/template.service";
import {
  slideGeneratorService,
  GenerateSlideRequest,
} from "../services/slide-generator.service";
import { CourseDesign } from "../models/course-design.model";

const router = express.Router();

// 配置multer用于文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * 获取课件设计完整数据
 * GET /api/slides/design?fileName=xxx
 */
router.get("/design", async (req, res) => {
  try {
    const fileName = req.query.fileName as string;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "缺少fileName参数",
      });
    }

    const design = await slideService.getCourseSlideDesign(fileName);

    res.json({
      success: true,
      data: design,
    });
  } catch (error) {
    console.error("获取课件设计数据失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "服务器错误",
    });
  }
});

/**
 * 分页查询幻灯片
 * GET /api/slides/page?fileName=xxx&page=1&pageSize=9&type=xxx
 */
router.get("/page", async (req, res) => {
  try {
    const fileName = req.query.fileName as string;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 9;
    const type = req.query.type as string;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "缺少fileName参数",
      });
    }

    const result = await slideService.getSlidesByPage(fileName, {
      page,
      pageSize,
      type,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("分页查询幻灯片失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "服务器错误",
    });
  }
});

/**
 * 根据页码获取单个幻灯片
 * GET /api/slides/detail?fileName=xxx&page=P1
 */
router.get("/detail", async (req, res) => {
  try {
    const fileName = req.query.fileName as string;
    const pageNumber = req.query.page as string;

    if (!fileName || !pageNumber) {
      return res.status(400).json({
        success: false,
        message: "缺少必要参数",
      });
    }

    const slide = await slideService.getSlideByPage(fileName, pageNumber);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "未找到指定页面",
      });
    }

    res.json({
      success: true,
      data: slide,
    });
  } catch (error) {
    console.error("获取幻灯片详情失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "服务器错误",
    });
  }
});

/**
 * 清除缓存
 * POST /api/slides/cache/clear
 */
router.post("/cache/clear", (req, res) => {
  try {
    const fileName = req.body.fileName as string | undefined;
    slideService.clearCache(fileName);

    res.json({
      success: true,
      message: fileName ? `已清除${fileName}的缓存` : "已清除所有缓存",
    });
  } catch (error) {
    console.error("清除缓存失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "服务器错误",
    });
  }
});

/**
 * 获取课件模板列表
 * GET /api/slides/templates
 */
router.get("/templates", (req, res) => {
  try {
    const templates = templateService.getAllTemplates();

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error("获取模板列表失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "服务器错误",
    });
  }
});

/**
 * 保存课件
 * POST /api/slides/save
 */
router.post("/save", async (req, res) => {
  try {
    const slideData = req.body;

    if (!slideData || !slideData.username || !slideData.lessonTitle) {
      return res.status(400).json({
        success: false,
        message: "缺少必要参数",
      });
    }

    const result = await slideService.saveGeneratedSlides(slideData);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("保存课件失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "服务器错误",
    });
  }
});

/**
 * 加载课件
 * GET /api/slides/load?username=xxx&lessonTitle=xxx
 */
router.get("/load", async (req, res) => {
  try {
    const username = req.query.username as string;
    const lessonTitle = req.query.lessonTitle as string;

    if (!username || !lessonTitle) {
      return res.status(400).json({
        success: false,
        message: "缺少必要参数",
      });
    }

    const data = await slideService.loadGeneratedSlides(username, lessonTitle);

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("加载课件失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "服务器错误",
    });
  }
});

/**
 * 获取课件列表
 * GET /api/slides/list?username=xxx
 */
router.get("/list", async (req, res) => {
  try {
    const username = req.query.username as string;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "缺少username参数",
      });
    }

    const list = await slideService.getSlidesList(username);

    res.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("获取课件列表失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "服务器错误",
    });
  }
});

/**
 * 基于模板生成课件
 * POST /api/slides/generate/from-template
 */
router.post("/generate/from-template", async (req, res) => {
  try {
    const params = req.body;

    if (!params.templateId || !params.lessonTitle || !params.username) {
      return res.status(400).json({
        success: false,
        message: "缺少必要参数（templateId、lessonTitle、username）",
      });
    }

    const slideData = await slideService.generateSlidesFromTemplate(params);

    res.json({
      success: true,
      data: slideData,
    });
  } catch (error) {
    console.error("基于模板生成课件失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "服务器错误",
    });
  }
});

/**
 * 基于设计思路生成课件
 * POST /api/slides/generate/from-design
 */
router.post("/generate/from-design", async (req, res) => {
  try {
    const params = req.body;

    if (!params.designFileName || !params.templateId || !params.username) {
      return res.status(400).json({
        success: false,
        message: "缺少必要参数（designFileName、templateId、username）",
      });
    }

    const slideData = await slideService.generateSlidesFromDesign(params);

    res.json({
      success: true,
      data: slideData,
    });
  } catch (error) {
    console.error("基于设计思路生成课件失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "服务器错误",
    });
  }
});

/**
 * 基于课程设计生成课件（流式响应 - AI生成）
 * POST /api/slides/generate/from-course-design-stream
 * Body: { courseDesign: CourseDesign }
 */
router.post("/generate/from-course-design-stream", async (req, res) => {
  try {
    const { courseDesign } = req.body;

    if (!courseDesign) {
      return res.status(400).json({
        success: false,
        message: "缺少必要参数：courseDesign",
      });
    }

    // 设置SSE响应头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    // 发送流式数据
    await slideGeneratorService.generateFromCourseDesignStream(
      courseDesign as CourseDesign,
      (chunk) => {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      },
    );

    // 发送完成标记
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (error) {
    console.error("基于课程设计生成课件失败:", error);
    const errorChunk = {
      type: "error",
      message: error instanceof Error ? error.message : "生成课件失败",
    };
    res.write(`data: ${JSON.stringify(errorChunk)}\n\n`);
    res.end();
  }
});

/**
 * 基于需求生成课件（流式响应 - AI生成）
 * POST /api/slides/generate/from-requirements-stream
 * Body: GenerateSlideRequest
 */
router.post("/generate/from-requirements-stream", async (req, res) => {
  try {
    const request: GenerateSlideRequest = req.body;

    if (!request.lessonTitle) {
      return res.status(400).json({
        success: false,
        message: "缺少必要参数：lessonTitle",
      });
    }

    // 设置SSE响应头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    // 发送流式数据
    await slideGeneratorService.generateFromRequirementsStream(
      request,
      (chunk) => {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      },
    );

    // 发送完成标记
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (error) {
    console.error("基于需求生成课件失败:", error);
    const errorChunk = {
      type: "error",
      message: error instanceof Error ? error.message : "生成课件失败",
    };
    res.write(`data: ${JSON.stringify(errorChunk)}\n\n`);
    res.end();
  }
});

/**
 * 基于文档生成课件（流式响应 - AI生成）
 * POST /api/slides/generate/from-document-stream
 * FormData: file, documentType, lessonTitle (optional)
 */
router.post(
  "/generate/from-document-stream",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "缺少文件",
        });
      }

      // 设置SSE响应头
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      // 读取文件内容
      let fileContent = "";
      try {
        fileContent = req.file.buffer.toString("utf-8");
      } catch (error) {
        fileContent = req.file.originalname || "";
      }

      const documentType = req.body.documentType || "txt";

      // 如果FormData中有documentContent，优先使用
      if (req.body.documentContent) {
        fileContent = req.body.documentContent;
      }

      // 发送流式数据
      await slideGeneratorService.generateFromDocumentStream(
        fileContent,
        documentType,
        req.body.lessonTitle,
        (chunk) => {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        },
      );

      // 发送完成标记
      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      res.end();
    } catch (error) {
      console.error("基于文档生成课件失败:", error);
      const errorChunk = {
        type: "error",
        message: error instanceof Error ? error.message : "生成课件失败",
      };
      res.write(`data: ${JSON.stringify(errorChunk)}\n\n`);
      res.end();
    }
  },
);

export default router;
