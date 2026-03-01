# 📦 部署文档索引

本目录包含所有与部署相关的文档。

---

## 🚀 快速开始

### 主要部署指南

| 文档 | 说明 |
|------|------|
| [BLOG_DEPLOYMENT_GUIDE.md](./BLOG_DEPLOYMENT_GUIDE.md) | 完整部署指南（推荐首先阅读） |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | 部署验证清单 |
| [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) | 部署架构图 |

---

## 📋 部署方式

### 方式一：GitHub Actions（推荐）

```bash
git add .
git commit -m "更新内容"
git push origin main
```

相关文档：
- [.github/workflows/README.md](../.github/workflows/README.md) - 工作流说明
- [DEPLOY.md](./DEPLOY.md) - 快速部署命令

### 方式二：本地手动部署

```bash
./deploy.sh
# 或
npm run deploy
```

### 方式三：Docker 部署

```bash
docker-compose up -d
```

---

## 🔧 配置文件

| 文件 | 说明 |
|------|------|
| `_config.yml` | Hexo 主配置 |
| `_config.deploy.yml` | 部署配置 |
| `.env` | 环境变量（需手动创建） |
| `.env.example` | 环境变量模板 |

---

## 🌐 DNS 配置

- [DNS 设置指南](./DNS_SETUP.md)
- [ESA 配置指南](./ESA_SETUP.md)

---

## ✅ 验证与监控

- [健康检查](../scripts/health-check.sh)
- [部署验证清单](./DEPLOYMENT_CHECKLIST.md)

---

## 📝 更新记录

- [HEXO_UPDATE_REPORT.md](./HEXO_UPDATE_REPORT.md) - Hexo 更新报告
- [CODE_REVIEW_REPORT.md](./CODE_REVIEW_REPORT.md) - 代码审查报告

---

## 🔗 相关资源

- [Hexo 官方文档](https://hexo.io/zh-cn/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [阿里云 ESA](https://help.aliyun.com/product/52638.html)
