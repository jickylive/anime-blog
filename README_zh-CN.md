# 黄氏寻宗博客

基于 Hexo 的个人博客，用于记录和传承黄氏宗族文化。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![Hexo](https://img.shields.io/badge/Hexo-8.1.1-red.svg)

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装

```bash
npm install
```

### 本地开发

```bash
npm run server
```

访问 http://localhost:4000

### 构建

```bash
npm run build
```

---

## 📝 内容管理

### 创建文章

```bash
npx hexo new post "文章标题"
```

编辑生成的文件 `source/_posts/文章标题.md`：

```markdown
---
title: 文章标题
date: 2024-03-21 12:00:00
tags: [标签 1, 标签 2]
categories: [分类]
---

文章内容...
```

### 创建草稿

```bash
npx hexo new draft "草稿标题"
```

### 发布草稿

```bash
npx hexo publish "草稿标题"
```

---

## ⚙️ 配置

### 站点配置 (`_config.yml`)

```yaml
title: 黄氏寻宗
subtitle: 一个黄氏宗族历史记录网站
description: 黄氏宗族历史记录网站
author: jicky huang
language: zh-CN
timezone: Asia/Shanghai
```

### 主题配置 (`themes/defaultone/_config.yml`)

调整主题样式、菜单、颜色等配置。

---

## 📁 项目结构

```
anime-blog/
├── docs/                 # 项目文档
├── scripts/              # 自动化脚本
├── source/               # 博客源文件
│   ├── _posts/          # 文章
│   ├── _drafts/         # 草稿
│   └── about/           # 页面
├── themes/defaultone/    # 自定义主题
├── config/               # 配置文件
├── bin/                  # Shell 脚本
├── _config.yml           # Hexo 主配置
└── public/               # 生成的静态文件
```

---

## 📦 常用命令

### 开发

| 命令 | 说明 |
|------|------|
| `npm run server` | 启动本地开发服务器 |
| `npm run clean` | 清理缓存文件 |

### 构建

| 命令 | 说明 |
|------|------|
| `npm run build` | 生成静态文件到 public/ |
| `npx hexo generate` | 同上 |

### 部署

| 命令 | 说明 |
|------|------|
| `npm run deploy` | 部署到服务器 |
| `./bin/deploy.sh` | 运行部署脚本 |

### 自动化

| 命令 | 说明 |
|------|------|
| `npm run news` | 生成每日新闻 (Gemini API) |
| `npm run news:proxy` | 通过代理生成新闻 |
| `npm run news:copilot` | 使用 Azure OpenAI 生成新闻 |
| `./bin/health-check.sh` | 运行健康检查 |

---

## 🔗 文档导航

| 文档 | 说明 |
|------|------|
| [docs/README.md](docs/README.md) | 文档导航入口 |
| [docs/BLOG_DEPLOYMENT_GUIDE.md](docs/BLOG_DEPLOYMENT_GUIDE.md) | 完整部署指南 |
| [docs/DEPLOYMENT_ARCHITECTURE.md](docs/DEPLOYMENT_ARCHITECTURE.md) | 部署架构文档 |
| [CLAUDE.md](CLAUDE.md) | AI 助手配置指南 |
| [README_INDEX.md](README_INDEX.md) | 详细项目文档索引 |

---

## 🌐 部署目标

- **主域名:** https://blog.hxfund.cn
- **备用域名:** https://hxfund.cn/blog/
- **部署方式:** GitHub Actions + FTP / 阿里云 ESA

---

## 🎨 主题特性

- 响应式设计
- 支持暗黑模式
- Live2D 角色动画
- 粒子背景效果
- Waline 评论系统
- SEO 优化

主题基于 [hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine) 修改。

---

## 📞 支持

如有问题，请查看：

1. [部署指南](docs/BLOG_DEPLOYMENT_GUIDE.md)
2. [健康检查脚本](bin/health-check.sh)
3. GitHub Issues

---

**最后更新:** 2026-03-02
