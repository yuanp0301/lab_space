# AI Lab (AI 实验场)

AI 能力验证的实验场，用于 Demo 展示，覆盖 LLM、多模态、Agent、传统 ML/CV 等综合实验。

## 技术栈

- **后端**: Python + FastAPI
- **前端**: Vue 3 + TypeScript + Vite + Naive UI + TailwindCSS

## 快速开始

### 环境要求

- Python 3.11+
- Node.js 18+
- pnpm (前端包管理器)
- Poetry (后端包管理器，可通过 `pip install poetry` 安装)
- Docker & Docker Compose (可选，用于容器化部署)

### 方式一：使用 Makefile（推荐）

项目提供了便捷的 Makefile 命令，可以快速启动服务：

```bash
# 安装所有依赖（后端 + 前端）
make install

# 同时启动后端和前端服务（并行运行）
make dev

# 单独启动后端服务
make backend

# 单独启动前端服务
make frontend

# 使用 Docker Compose 启动（需要先配置 .env 文件）
make up

# 停止 Docker 容器
make down
```

### 方式二：手动启动

#### 后端启动

1. **安装依赖**

```bash
cd backend
poetry install
```

2. **配置环境变量**

在 `backend` 目录下创建 `.env` 文件，配置必要的 API Keys：

```bash
# 环境配置
ENVIRONMENT=development

# API Keys（根据需要使用）
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
AIMINDSKY_API_KEY=your_aimindsky_api_key

# Ollama 配置（如果使用本地 Ollama）
OLLAMA_BASE_URL=http://localhost:11434

# AIMindSky 配置
AIMINDSKY_BASE_URL=https://api.aimindsky.com/v1

# 默认提供商和模型
DEFAULT_PROVIDER=anthropic
DEFAULT_ANTHROPIC_MODEL=claude-sonnet-4-20250514
DEFAULT_OPENAI_MODEL=gpt-4o
DEFAULT_OLLAMA_MODEL=llama3.2
DEFAULT_AIMINDSKY_MODEL=gpt-4o

# CORS 配置
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# 文件上传配置
MAX_UPLOAD_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads
```

3. **启动服务**

```bash
# 开发模式（自动重载）
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 或使用 Makefile
make backend
```

后端服务启动后：

- API 服务地址：http://localhost:8000
- API 文档（Swagger）：http://localhost:8000/docs
- API 文档（ReDoc）：http://localhost:8000/redoc
- 健康检查：http://localhost:8000/health

#### 前端启动

1. **安装依赖**

```bash
cd frontend
pnpm install
```

2. **启动开发服务器**

```bash
pnpm dev
```

前端服务启动后：

- 访问地址：http://localhost:5173
- 开发服务器会自动代理 `/api` 请求到后端 `http://localhost:8000`

### 方式三：Docker Compose 启动

1. **配置环境变量**

确保 `backend/.env` 文件已配置（参考后端启动步骤）

2. **启动服务**

```bash
# 启动所有服务（后端 + 前端）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 或使用 Makefile
make up    # 启动
make down  # 停止
```

Docker 启动后：

- 后端服务：http://localhost:8000
- 前端服务：http://localhost:5173

**注意**：Docker 模式下，前端通过环境变量 `VITE_API_URL=http://localhost:8000` 配置后端地址。如果需要修改，请更新 `docker-compose.yml` 中的环境变量。

## 开发工具

项目提供了便捷的开发命令（通过 Makefile）：

```bash
# 代码检查
make lint        # 运行后端和前端代码检查

# 测试
make test        # 运行后端和前端测试

# 清理
make clean       # 清理构建产物和缓存文件

# 查看帮助
make help        # 显示所有可用命令
```

### 后端开发

```bash
cd backend

# 代码格式化检查
poetry run ruff check .

# 运行测试
poetry run pytest
```

### 前端开发

```bash
cd frontend

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```
ai-lab/
├── backend/          # FastAPI 后端
│   ├── app/
│   │   ├── api/      # API 路由
│   │   ├── experiments/  # 实验模块
│   │   ├── providers/    # LLM 提供商实现
│   │   └── schemas/      # 数据模型
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/         # Vue 3 前端
│   ├── src/
│   │   ├── api/      # API 客户端
│   │   ├── components/   # Vue 组件
│   │   ├── pages/        # 页面
│   │   └── stores/       # Pinia 状态管理
│   ├── Dockerfile
│   └── package.json
├── shared/           # 共享资源
│   └── prompts/      # 提示词模板
├── docker-compose.yml
└── Makefile
```

## 常见问题

### 后端启动问题

**Q: 启动后端时提示找不到 poetry？**  
A: 需要先安装 Poetry：`pip install poetry` 或 `curl -sSL https://install.python-poetry.org | python3 -`

**Q: 启动时提示端口被占用？**  
A: 修改 `backend/.env` 中的 `PORT` 配置，或使用其他端口启动：

```bash
poetry run uvicorn app.main:app --reload --port 8001
```

**Q: API 请求返回 CORS 错误？**  
A: 检查 `backend/.env` 中的 `CORS_ORIGINS` 配置，确保包含前端地址（默认已包含 `http://localhost:5173`）

### 前端启动问题

**Q: pnpm 命令不存在？**  
A: 安装 pnpm：`npm install -g pnpm` 或使用 corepack：`corepack enable && corepack prepare pnpm@latest --activate`

**Q: 前端无法连接到后端？**  
A:

1. 确保后端服务已启动（http://localhost:8000）
2. 检查 `frontend/vite.config.ts` 中的代理配置
3. 如果使用 Docker，检查 `docker-compose.yml` 中的 `VITE_API_URL` 环境变量

### Docker 启动问题

**Q: Docker 容器启动失败？**  
A:

1. 确保 `backend/.env` 文件已创建并配置
2. 检查端口是否被占用：`lsof -i :8000` 和 `lsof -i :5173`
3. 查看容器日志：`docker-compose logs -f`

**Q: Docker 中前端无法访问后端？**  
A: 在 Docker 环境中，前端应使用服务名 `backend` 而不是 `localhost`。检查 `docker-compose.yml` 中的 `VITE_API_URL` 配置。

## 添加新实验

```python
from app.experiments.base import BaseExperiment, ExperimentConfig
from app.experiments.registry import register_experiment

@register_experiment
class NewExperiment(BaseExperiment):
    config = ExperimentConfig(
        id="new-experiment",
        name="新实验",
        description="描述",
        category="llm",
    )

    async def execute(self, input_data, **kwargs):
        # 实现逻辑
        pass
```

## License

MIT
