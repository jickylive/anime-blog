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
| [daily-news.js](./daily-news.js) | Gemini AI 新闻生成 | `node daily-news.js` |
| [daily-news-proxy.js](./daily-news-proxy.js) | 通过代理调用 Gemini | `node daily-news-proxy.js` |
| [copilot-news.js](./copilot-news.js) | Azure OpenAI 新闻生成 | `node copilot-news.js` |

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

# AI 服务
GEMINI_API_KEY=your_key
PROXY_API_KEY=your_proxy_key
WORKER_URL=https://your-worker.workers.dev
```

---

## 🔗 相关文档

- [部署指南](../docs/DEPLOYMENT.md)
- [README.md](../README.md)
