import express from "express";
import cors from "cors";
import path from "path";
import slideRoutes from "./routes/slide.routes";

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 提供data目录访问（上级目录）
app.use("/data", express.static(path.join(process.cwd(), "..", "data")));

// API路由
app.use("/api/slides", slideRoutes);

// 健康检查
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "接口不存在",
  });
});

// 错误处理
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("服务器错误:", err);
    res.status(500).json({
      success: false,
      message: err.message || "服务器内部错误",
    });
  },
);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Beike Demo Backend 服务器已启动`);
  console.log(`📡 监听端口: ${PORT}`);
  console.log(`🌐 API地址: http://localhost:${PORT}`);
  console.log(`💚 健康检查: http://localhost:${PORT}/health`);
});

export default app;
