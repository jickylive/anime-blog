# 📚 黄氏寻宗博客 - 项目文档

## 文档导航

### 快速开始
- [README.md](../README.md) - 项目简介和快速上手
- [快速部署](#部署指南) - 部署到服务器

### 核心文档
| 文档 | 说明 |
|------|------|
| [部署指南](./BLOG_DEPLOYMENT_GUIDE.md) | 完整的部署流程和配置说明 |
| [架构文档](./DEPLOYMENT_ARCHITECTURE.md) | 项目部署架构和技术栈 |

### 参考文档
| 文档 | 说明 |
|------|------|
| [CLAUDE.md](../CLAUDE.md) | AI 助手配置和开发指南 |
| [项目文档索引](./README_INDEX.md) | 详细的项目文档导航 |

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run server
# 访问 http://localhost:4000
```

### 3. 创建文章

```bash
npx hexo new post "文章标题"
# 编辑 source/_posts/文章标题.md
```

### 4. 构建部署

```bash
npm run build
npm run deploy
```

---

## 📁 项目结构

```
anime-blog/
├── docs/                 # 项目文档
├── scripts/              # 自动化脚本
│   ├── daily-news.js     # 每日新闻生成
│   └── ...
├── source/               # 博客源文件
│   ├── _posts/          # 文章
│   ├── _drafts/         # 草稿
│   └── about/           # 页面
├── themes/defaultone/    # 主题文件
├── config/               # 配置文件
│   ├── site.yml         # 站点配置
│   └── theme.yml        # 主题配置
├── _config.yml           # Hexo 主配置
└── public/               # 生成的静态文件
```

---

## ⚙️ 常用命令

| 命令 | 说明 |
|------|------|
| `npm run server` | 启动本地开发服务器 |
| `npm run build` | 生成静态文件 |
| `npm run clean` | 清理缓存 |
| `npm run deploy` | 部署到服务器 |
| `npm run news` | 生成每日新闻 |
| `./bin/health-check.sh` | 运行健康检查 |

---

## 🔐 安全提示

- 敏感信息（密码、API 密钥）应存储在 GitHub Secrets 中
- 不要将 `.env` 文件提交到版本控制
- 定期更新依赖，修复安全漏洞

---

**最后更新:** 2026-03-02
