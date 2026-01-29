.PHONY: help install dev up down backend frontend lint test clean

help:
	@echo "AI Lab - Available Commands"
	@echo ""
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Start development servers"
	@echo "  make up         - Start with Docker Compose"
	@echo "  make down       - Stop Docker containers"
	@echo "  make backend    - Start backend only"
	@echo "  make frontend   - Start frontend only"
	@echo "  make lint       - Run linters"
	@echo "  make test       - Run tests"
	@echo "  make clean      - Clean build artifacts"

install:
	cd backend && poetry install
	cd frontend && pnpm install

dev:
	@echo "Starting development servers..."
	$(MAKE) -j2 backend frontend

backend:
	cd backend && poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	cd frontend && pnpm dev

up:
	docker-compose up -d

down:
	docker-compose down

lint:
	cd backend && poetry run ruff check .
	cd frontend && pnpm lint

test:
	cd backend && poetry run pytest
	cd frontend && pnpm test

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true
