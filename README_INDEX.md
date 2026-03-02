# 📝 Hexo 博客项目文档索引

> 黄氏家族寻宗博客 - 部署与开发文档

---

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动本地服务器
npm run server

# 访问 http://localhost:4000
```

### 快速部署

```bash
# 方式 1: 使用部署脚本
./scripts/deploy.sh

# 方式 2: 使用 npm 命令
npm run deploy

# 方式 3: Git 推送（GitHub Actions 自动部署）
git add .
git commit -m "更新内容"
git push origin main
```

---

## 📁 目录结构

```
anime-blog/
├── docs/              # 📚 部署文档
│   ├── DEPLOYMENT.md
│   ├── BLOG_DEPLOYMENT_GUIDE.md
│   └── ...
├── scripts/           # 🔧 脚本文件
│   ├── deploy.sh
│   ├── health-check.sh
│   ├── daily-news.js
│   └── ...
├── source/            # 📝 博客内容
│   ├── _posts/       # 文章
│   ├── _drafts/      # 草稿
│   └── about/        # 页面
├── themes/            # 🎨 主题
├── config/            # ⚙️ 配置
├── .github/           # CI/CD
│   └── workflows/
└── public/            # 📦 构建输出
```

---

## 📚 文档索引

### 部署文档 (`docs/`)

| 文档 | 说明 |
|------|------|
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | 部署文档索引 |
| [BLOG_DEPLOYMENT_GUIDE.md](./docs/BLOG_DEPLOYMENT_GUIDE.md) | 完整部署指南 |
| [DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md) | 部署验证清单 |
| [DEPLOYMENT_ARCHITECTURE.md](./docs/DEPLOYMENT_ARCHITECTURE.md) | 部署架构图 |
| [DEPLOY.md](./docs/DEPLOY.md) | 快速部署命令 |

### 脚本文件 (`scripts/`)

| 脚本 | 说明 |
|------|------|
| [deploy.sh](./scripts/deploy.sh) | 部署主脚本 |
| [health-check.sh](./scripts/health-check.sh) | 健康检查 |
| [dns-setup.sh](./scripts/dns-setup.sh) | DNS 配置辅助 |
| [daily-news.js](./scripts/daily-news.js) | AI 新闻生成 |
| [README.md](./scripts/README.md) | 脚本使用说明 |

### GitHub Actions (`.github/workflows/`)

| 工作流 | 说明 |
|--------|------|
| `deploy-blog.yml` | 博客部署（主要） |
| `deploy-full.yml` | 完整部署 |
| `daily-news-updater.yml` | 每日新闻更新 |
| `ci.yml` | 持续集成 |

---

## 🔧 npm 命令

| 命令 | 说明 |
|------|------|
| `npm run server` | 启动本地服务器 |
| `npm run build` | 生成静态文件 |
| `npm run clean` | 清理缓存 |
| `npm run deploy` | 部署到服务器 |
| `npm run news` | 生成每日新闻 |
| `npm run check` | 运行健康检查 |
| `npm run dns` | DNS 配置检查 |

---

## ⚙️ 配置说明

### 环境变量

创建 `.env` 文件（参考 `.env.example`）：

```bash
# FTP 部署
FTP_HOST=<你的 FTP 主机>
FTP_USER=<你的 FTP 用户名>
FTP_PASSWORD=<你的 FTP 密码>
FTP_PORT=21
FTP_REMOTE=/htdocs/public

# AI 服务（可选）
GEMINI_API_KEY=<你的 Gemini API 密钥>
PROXY_API_KEY=<你的代理 API 密钥>
WORKER_URL=https://your-worker.workers.dev
```

> ⚠️ **安全提示:** 敏感信息应存储在 GitHub Secrets 中，不要提交到版本控制系统。

### 配置文件

| 文件 | 说明 |
|------|------|
| `_config.yml` | Hexo 主配置 |
| `_config.deploy.yml` | 部署配置 |
| `config/site.yml` | 站点配置 |
| `config/theme.yml` | 主题配置 |

---

## 🌐 部署目标

- **主域名:** https://blog.hxfund.cn
- **备用域名:** https://hxfund.cn/blog/
- **部署方式:** GitHub Actions + FTP / 阿里云 ESA

---

## ✅ 验证清单

部署后请检查：

- [ ] DNS 解析生效
- [ ] HTTPS 访问正常
- [ ] 首页显示正常
- [ ] 文章列表正常
- [ ] 图片/CSS/JS 加载正常
- [ ] 移动端适配正常
- [ ] 评论系统正常

---

## 🔗 相关资源

- [Hexo 官方文档](https://hexo.io/zh-cn/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [阿里云 DNS](https://dns.console.aliyun.com)
- [主题文档](https://github.com/EvanNotFound/hexo-theme-redefine)

---

## 📞 支持

如有问题，请查看：

1. [部署故障排查指南](./docs/BLOG_DEPLOYMENT_GUIDE.md#故障排查)
2. [健康检查脚本](./scripts/health-check.sh)
3. GitHub Issues

---

**最后更新:** 2026-03-01
