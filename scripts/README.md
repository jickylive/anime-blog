# 📜 脚本文件索引

本目录包含所有自动化脚本和工具脚本。

---

## 🚀 部署脚本

| 脚本 | 说明 | 用法 |
|------|------|------|
| [deploy.sh](./deploy.sh) | Hexo 博客部署主脚本 | `./deploy.sh` |
| [dns-setup.sh](./dns-setup.sh) | DNS 解析配置辅助脚本 | `./dns-setup.sh` |
| [health-check.sh](./health-check.sh) | 健康检查脚本 | `./health-check.sh` |
| [cleanup-root.sh](./cleanup-root.sh) | 根目录清理脚本 | `./cleanup-root.sh` |

---

## 🤖 自动化脚本

### 新闻自动生成

| 脚本 | 说明 | 用法 |
|------|------|------|
| [unified-news.js](./unified-news.js) | 统一新闻生成脚本（支持多种AI提供商） | `node unified-news.js` |

### 使用不同AI提供商

| 命令 | 说明 |
|------|------|
| `npm run news` 或 `npm run news:gemini` | 使用 Google Gemini 生成新闻 |
| `npm run news:azure` | 使用 Azure OpenAI 生成新闻 |
| `npm run news:openai` | 使用 OpenAI 生成新闻 |
| `npm run news:qwen` | 使用阿里云通义千问生成新闻 |
| `npm run news:qwen-cli` | 使用 Qwen CLI 工具生成新闻 |

### 配置生成

| 脚本 | 说明 | 用法 |
|------|------|------|
| [generate_deploy_config.js](./generate_deploy_config.js) | 生成部署配置 | `node generate_deploy_config.js` |

---

## 🪟 Windows 脚本

| 脚本 | 说明 | 用法 |
|------|------|------|
| [run-daily-task.bat](./run-daily-task.bat) | Windows 定时任务脚本 | 双击运行或任务计划 |

---

## 🔧 使用示例

### 完整部署流程

```bash
# 1. 健康检查
./scripts/health-check.sh

# 2. 生成新闻（可选）
node scripts/daily-news.js

# 3. 部署
./scripts/deploy.sh
```

### 本地开发

```bash
# 启动本地服务器
npm run server

# 访问 http://localhost:4000
```

---

## 📝 环境变量

部分脚本需要环境变量支持，请确保 `.env` 文件已配置：

```bash
# FTP 部署
FTP_HOST=qxu1606470020.my3w.com
FTP_USER=qxu1606470020
FTP_PASSWORD=your_password

# AI 服务 - Google Gemini
GEMINI_API_KEY=your_key
PROXY_API_KEY=your_proxy_key
WORKER_URL=https://your-worker.workers.dev

# AI 服务 - Azure OpenAI
AZURE_OPENAI_KEY=your_azure_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=your_deployment_name

# AI 服务 - OpenAI
OPENAI_API_KEY=your_openai_key

# 选择 AI 提供商 (可选，默认为 gemini)
AI_PROVIDER=gemini # 可选值: gemini, azure, openai, qwen

# 阿里云通义千问配置 (可选)
QWEN_API_KEY=your_dashscope_api_key
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
QWEN_MODEL=qwen-max # 可选模型: qwen-max, qwen-plus, qwen-turbo, qwen-long 等
```

---

## 🔗 相关文档

- [部署指南](../docs/DEPLOYMENT.md)
- [README.md](../README.md)
