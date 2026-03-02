# 黄氏寻宗博客

基于 Hexo 的个人博客，用于记录和传承黄氏宗族文化。

## 快速开始

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

### 构建

```bash
npm run build
```

## 项目结构

```
anime-blog/
├── source/_posts/      # 博客文章
├── source/_drafts/     # 草稿
├── themes/defaultone/  # 自定义主题
├── scripts/           # 自动化脚本
├── config/            # 配置文件
└── public/            # 生成的静态文件
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run server` | 启动本地开发服务器 |
| `npm run build` | 生成静态文件 |
| `npm run clean` | 清理缓存 |
| `npm run news` | 生成每日新闻 |
| `npm run news:proxy` | 通过代理生成新闻 |

## 创建新文章

```bash
npx hexo new post "文章标题"
```

文章 Front-matter 格式：

```yaml
---
title: 文章标题
date: 2024-03-21 12:00:00
tags: [标签 1, 标签 2]
categories: [分类]
---
```

## 配置

### 站点配置

编辑 `_config.yml`：

```yaml
title: 黄氏寻宗
subtitle: 一个黄氏宗族历史记录网站
description: 黄氏宗族历史记录网站
author: jicky huang
```

### 主题配置

编辑 `themes/defaultone/_config.yml` 调整主题样式和功能。

## 部署

本项目配置为部署到 `/blog/` 子目录。

```bash
npm run deploy
```

## 特性

- 响应式设计
- 支持暗黑模式
- Live2D 角色动画
- 粒子背景效果
- Waline 评论系统
- SEO 优化

## 许可证

主题基于 [hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine) 修改，遵循 GPL-3.0 许可证。
