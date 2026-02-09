import express from "express";
import multer from "multer";
import { courseDesignService } from "../services/course-design.service";
import {
  GenerateCourseDesignRequest,
  GenerateFromDocumentRequest,
} from "../models/course-design.model";

const router = express.Router();

// 配置multer用于文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * 获取表格版课程设计模版（前端格式）
 * GET /api/course-design/template/table/frontend
 */
router.get("/template/table/frontend", async (req, res) => {
  try {
    const template = await courseDesignService.getTableTemplate();
    const frontendData = courseDesignService.convertToFrontendFormat(template);
    res.json({
      success: true,
      data: frontendData,
    });
  } catch (error) {
    console.error("获取表格版模版失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "获取表格版模版失败",
    });
  }
});

/**
 * 获取完整版课程设计模版（前端格式）
 * GET /api/course-design/template/detailed/frontend
 */
router.get("/template/detailed/frontend", async (req, res) => {
  try {
    const template = await courseDesignService.getDetailedTemplate();
    const frontendData = courseDesignService.convertToFrontendFormat(template);
    res.json({
      success: true,
      data: frontendData,
    });
  } catch (error) {
    console.error("获取完整版模版失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "获取完整版模版失败",
    });
  }
});

/**
 * 获取表格版课程设计模版
 * GET /api/course-design/template/table
 */
router.get("/template/table", async (req, res) => {
  try {
    const template = await courseDesignService.getTableTemplate();
    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("获取表格版模版失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "获取表格版模版失败",
    });
  }
});

/**
 * 获取完整版课程设计模版
 * GET /api/course-design/template/detailed
 */
router.get("/template/detailed", async (req, res) => {
  try {
    const template = await courseDesignService.getDetailedTemplate();
    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("获取完整版模版失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "获取完整版模版失败",
    });
  }
});

/**
 * 根据文档生成课程设计（流式响应）
 * POST /api/course-design/generate/from-document-stream
 * FormData: file, documentType
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
        // 尝试以UTF-8读取（适用于文本文件）
        fileContent = req.file.buffer.toString("utf-8");
      } catch (error) {
        // 如果读取失败，使用文件名作为标识
        fileContent = req.file.originalname || "";
      }

      const documentType = req.body.documentType || "txt";

      // 如果FormData中有documentContent，优先使用（前端可能已经读取了文本内容）
      if (req.body.documentContent) {
        fileContent = req.body.documentContent;
      }

      // 发送流式数据
      await courseDesignService.generateFromDocumentStream(
        {
          documentContent: fileContent,
          documentType,
          lessonTitle: req.body.lessonTitle,
          generateOptions: req.body.generateOptions
            ? JSON.parse(req.body.generateOptions)
            : undefined,
        },
        (chunk) => {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        },
      );

      // 发送完成标记
      res.write(`data: ${JSON.stringify({ type: "complete" })}\n\n`);
      res.end();
    } catch (error) {
      console.error("从文档生成课程设计失败:", error);
      const errorChunk = {
        type: "error",
        message: error instanceof Error ? error.message : "生成课程设计失败",
      };
      res.write(`data: ${JSON.stringify(errorChunk)}\n\n`);
      res.end();
    }
  },
);

/**
 * 根据文档生成课程设计
 * POST /api/course-design/generate/from-document
 * Body: GenerateFromDocumentRequest
 */
router.post("/generate/from-document", async (req, res) => {
  try {
    const request: GenerateFromDocumentRequest = req.body;

    // 验证请求参数
    if (!request.documentContent || !request.documentType) {
      return res.status(400).json({
        success: false,
        message: "缺少必要参数：documentContent 和 documentType",
      });
    }

    const courseDesign =
      await courseDesignService.generateFromDocument(request);

    res.json({
      success: true,
      data: courseDesign,
    });
  } catch (error) {
    console.error("从文档生成课程设计失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "生成课程设计失败",
    });
  }
});

/**
 * 根据需求生成课程设计
 * POST /api/course-design/generate/from-requirements
 * Body: GenerateCourseDesignRequest
 */
router.post("/generate/from-requirements", async (req, res) => {
  try {
    const request: GenerateCourseDesignRequest = req.body;

    // 验证请求参数
    if (!request.lessonTitle) {
      return res.status(400).json({
        success: false,
        message: "缺少必要参数：lessonTitle",
      });
    }

    const courseDesign =
      await courseDesignService.generateFromRequirements(request);

    res.json({
      success: true,
      data: courseDesign,
    });
  } catch (error) {
    console.error("从需求生成课程设计失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "生成课程设计失败",
    });
  }
});

/**
 * 清除缓存
 * POST /api/course-design/cache/clear
 * Body: { templateType?: 'table' | 'detailed' }
 */
router.post("/cache/clear", (req, res) => {
  try {
    const { templateType } = req.body;
    courseDesignService.clearCache(templateType);
    res.json({
      success: true,
      message: "缓存已清除",
    });
  } catch (error) {
    console.error("清除缓存失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "清除缓存失败",
    });
  }
});

/**
 * 保存课程设计
 * POST /api/course-design/save
 * Body: { username: string, courseData: FrontendCourseData }
 */
router.post("/save", async (req, res) => {
  try {
    const { username, courseData } = req.body;

    if (!username || !courseData) {
      return res.status(400).json({
        success: false,
        message: "缺少必要参数：username 和 courseData",
      });
    }

    const savePath = await courseDesignService.saveCourseDesign(
      username,
      courseData,
    );

    res.json({
      success: true,
      message: "课程设计已保存",
      data: {
        savePath,
        updateTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("保存课程设计失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "保存课程设计失败",
    });
  }
});

/**
 * 加载用户的课程设计
 * GET /api/course-design/load/:username
 * Query: filename (可选，不提供则加载最新的)
 */
router.get("/load/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { filename } = req.query;

    const courseData = await courseDesignService.loadCourseDesign(
      username,
      filename as string | undefined,
    );

    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: "未找到课程设计",
      });
    }

    res.json({
      success: true,
      data: courseData,
    });
  } catch (error) {
    console.error("加载课程设计失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "加载课程设计失败",
    });
  }
});

/**
 * 列出用户的所有课程设计
 * GET /api/course-design/list/:username
 */
router.get("/list/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const courseList =
      await courseDesignService.listUserCourseDesigns(username);

    res.json({
      success: true,
      data: courseList,
    });
  } catch (error) {
    console.error("列出课程设计失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "列出课程设计失败",
    });
  }
});

/**
 * 删除指定的课程设计
 * DELETE /api/course-design/delete/:username/:filename
 */
router.delete("/delete/:username/:filename", async (req, res) => {
  try {
    const { username, filename } = req.params;

    await courseDesignService.deleteCourseDesign(username, filename);

    res.json({
      success: true,
      message: "课程设计已删除",
    });
  } catch (error) {
    console.error("删除课程设计失败:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "删除课程设计失败",
    });
  }
});

export default router;
