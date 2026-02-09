import express from "express";
import { slideService } from "../services/slide.service";

const router = express.Router();

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

export default router;
