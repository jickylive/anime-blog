# ✅ 混合部署配置完成

**更新时间:** 2026-02-27  
**部署架构:** 虚拟主机 + ECS 混合部署

---

## 📊 配置状态

| 组件 | 位置 | 状态 |
|------|------|------|
| **主站前端** | 虚拟主机 `/htdocs/public/` | ✅ 已有 |
| **Hexo 博客** | 虚拟主机 `/htdocs/public/blog/` | ✅ 已配置 |
| **后端 API** | ECS `/root/hxfund/` | ⚠️ 待部署 |
| **CDN 加速** | 阿里云 ESA | ✅ 已配置 |

---

## 🔧 已完成的配置

### 1. Hexo URL 配置

**_config.yml:**
```yaml
url: https://hxfund.cn/blog
root: /blog/
```

### 2. 部署配置

**_config.deploy.yml:**
```yaml
deploy:
  type: ftpsync
  host: ${FTP_HOST}
  user: ${FTP_USER}
  pass: ${FTP_PASSWORD}
  port: ${FTP_PORT}
  remote: ${FTP_REMOTE}  # /htdocs/public/blog
```

### 3. 环境变量

**.env:**
```bash
# FTP 部署（虚拟主机子目录）
FTP_HOST=qxu1606470020.my3w.com
FTP_USER=qxu1606470020
FTP_PASSWORD=Qq803200
FTP_PORT=21
FTP_REMOTE=/htdocs/public/blog

# ECS 后端
ECS_SSH_KEY=your_ssh_private_key
ECS_HOST=120.25.77.136
ECS_USER=root
ECS_PORT=22
```

### 4. GitHub Actions

**deploy-full.yml:**
- ✅ Hexo 博客构建
- ✅ 后端服务构建
- ✅ FTP 部署到 `/htdocs/public/blog/`
- ✅ SSH 部署到 ECS `/root/hxfund/`
- ✅ ESA 缓存刷新

---

## 📁 目录结构

### 虚拟主机

```
/htdocs/public/
├── index.html          # 主站前端
├── css/
├── js/
├── images/
└── blog/               # Hexo 博客
    ├── index.html
    ├── css/
    ├── js/
    ├── archives/
    ├── tags/
    └── atom.xml
```

### ECS 主机

```
/root/
├── hxfund/             # 后端服务
│   ├── server/
│   ├── public/
│   └── package.json
├── docker/
│   ├── proxy/          # Nginx 代理
│   └── ...
└── logs/
```

---

## 🚀 部署流程

### GitHub Actions 自动部署

```bash
cd /root/anime-blog

# 1. 提交更改
git add .
git commit -m "部署：混合架构配置"
git push origin main

# 2. 查看部署状态
# https://github.com/jickylive/anime-blog/actions
```

### 本地手动部署

```bash
# 部署 Hexo 博客
cd /root/anime-blog
npx hexo clean && npx hexo generate
npm run deploy

# 部署后端服务
cd /root/hxfund
npm install --only=production
pm2 restart hxfund-api
```

---

## ✅ 验证清单

### Hexo 博客

```bash
# 检查生成的文件
ls -la public/

# 验证 URL 配置
grep -r "hxfund.cn/blog" public/ | head -3

# 预期输出：
# public/index.html:<link rel="canonical" href="https://hxfund.cn/blog/">
```

### 虚拟主机

```bash
# FTP 连接
ftp qxu1606470020.my3w.com

# 检查目录
ls /htdocs/public/
ls /htdocs/public/blog/
```

### ECS 后端

```bash
# SSH 连接
ssh root@120.25.77.136

# 检查服务
pm2 status
pm2 logs hxfund-api
```

---

## 🌐 DNS 解析

| 域名 | 类型 | 记录值 | 说明 |
|------|------|--------|------|
| `hxfund.cn` | A | 120.25.77.136 | 主域名 → ECS |
| `www.hxfund.cn` | CNAME | hxfund.cn | www 重定向 |
| `api.hxfund.cn` | A | 120.25.77.136 | API → ECS |
| `blog.hxfund.cn` | CNAME | qxu1606470020.my3w.com | 博客 → 虚拟主机 |

---

## 📋 GitHub Secrets

访问：https://github.com/jickylive/anime-blog/settings/secrets/actions

### 必需配置

| Secret | 值 | 用途 |
|--------|-----|------|
| `FTP_HOST` | qxu1606470020.my3w.com | 虚拟主机 FTP |
| `FTP_USER` | qxu1606470020 | FTP 用户名 |
| `FTP_PASS` | Qq803200 | FTP 密码 |
| `ECS_SSH_KEY` | your_key | ECS SSH 私钥 |
| `ECS_HOST` | 120.25.77.136 | ECS 服务器 IP |
| `ESA_TOKEN` | your_token | ESA API Token |

---

## 📊 部署架构

```
                    用户访问
                       │
                       ↓
              ┌────────────────┐
              │ 阿里云 ESA CDN │
              └───────┬────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ↓            ↓            ↓
┌─────────────┐ ┌──────────┐ ┌──────────┐
│www.hxfund.cn│ │hxfund.cn/│ │api.hxfund│
│ (主站前端)  │ │  blog    │ │  .cn     │
└──────┬──────┘ └────┬─────┘ └────┬─────┘
       │             │            │
       │             │            │
       ↓             ↓            ↓
┌─────────────┐ ┌───────────┐ ┌──────────┐
│  虚拟主机   │ │ 虚拟主机  │ │ ECS 主机  │
│/htdocs/pubic│ │/htdocs/   │ │/root/    │
│             │ │ public/   │ │ hxfund/  │
│             │ │  blog/    │ │          │
└─────────────┘ └───────────┘ └──────────┘
```

---

## 🔧 故障排查

### 博客 404

1. 检查文件是否在 `/htdocs/public/blog/`
2. 检查 `.htaccess` 配置
3. 清除浏览器缓存

### API 502

```bash
# 检查服务状态
pm2 status

# 查看日志
pm2 logs hxfund-api

# 重启服务
pm2 restart hxfund-api
```

### ESA 缓存

```bash
# 刷新缓存
curl -X POST "https://esapush.aliyuncs.com/push" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"type": "refresh", "objects": ["https://hxfund.cn/blog/*"]}'
```

---

## 📝 常用命令

### Hexo 博客

```bash
cd /root/anime-blog

# 本地预览
npm run server

# 生成文件
npm run build

# 部署
npm run deploy
```

### 后端服务

```bash
cd /root/hxfund

# 查看状态
pm2 status

# 重启
pm2 restart hxfund-api
```

### Docker 服务

```bash
cd /root/docker/proxy

# 查看状态
docker ps

# 重启
docker-compose restart
```

---

## 📁 相关文档

| 文档 | 用途 |
|------|------|
| `DEPLOYMENT_ARCHITECTURE.md` | 🏗️ 完整架构说明 |
| `BLOG_DEPLOYMENT_GUIDE.md` | 📘 博客部署指南 |
| `DEPLOYMENT_CHECKLIST.md` | 📋 部署检查清单 |
| `.github/workflows/deploy-full.yml` | 🚀 完整部署工作流 |

---

## ✅ 总结

**配置完成状态:**

| 项目 | 状态 |
|------|------|
| Hexo 子目录配置 | ✅ |
| FTP 部署配置 | ✅ |
| ECS 后端配置 | ✅ |
| GitHub Actions | ✅ |
| ESA CDN 配置 | ✅ |

**下一步:**
1. 配置 GitHub Secrets
2. 推送代码触发部署
3. 验证所有服务

---

**混合部署配置完成！** 🎉
