# 🏗️ 部署架构说明

**更新时间:** 2026-03-02

---

## 📊 部署架构

```
┌─────────────────────────────────────────┐
│          用户访问                        │
└─────────────────┬───────────────────────┘
                  │
                  ↓
        ┌─────────────────┐
        │  阿里云 ESA CDN │
        └────────┬────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ↓                 ↓
┌───────────────┐ ┌───────────────┐
│ blog.hxfund.cn│ │ api.hxfund.cn │
│ (Hexo 博客)   │ │ (后端 API)    │
└───────┬───────┘ └───────┬───────┘
        │                 │
        ↓                 ↓
┌───────────────┐ ┌───────────────┐
│  虚拟主机     │ │  ECS 主机     │
│ /htdocs/blog/ │ │ /root/hxfund/ │
└───────────────┘ └───────────────┘
```

---

## 📁 目录结构

### 虚拟主机

```
/htdocs/
└── blog/               # Hexo 博客
    ├── index.html
    ├── css/
    ├── js/
    ├── images/
    ├── archives/
    └── atom.xml
```

### ECS 主机

```
/root/
├── hxfund/             # 后端服务
│   ├── server/
│   ├── public/
│   └── package.json
└── logs/
```

---

## 🌐 DNS 解析

| 域名 | 类型 | 记录值 | 说明 |
|------|------|--------|------|
| `blog.hxfund.cn` | CNAME | 虚拟主机 | Hexo 博客 |
| `api.hxfund.cn` | A | ECS IP | 后端 API |

---

## 🔐 GitHub Secrets

访问：https://github.com/jickylive/anime-blog/settings/secrets/actions

### FTP 部署

| Secret | 说明 |
|--------|------|
| `FTP_HOST` | FTP 主机地址 |
| `FTP_USER` | FTP 用户名 |
| `FTP_PASS` | FTP 密码 |
| `FTP_PORT` | FTP 端口 |

---

## 🔗 相关文档

- [部署指南](./BLOG_DEPLOYMENT_GUIDE.md) - 完整的部署流程
- [README](../README.md) - 项目简介

---

**最后更新:** 2026-03-02
