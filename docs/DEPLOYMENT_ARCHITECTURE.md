# 🏗️ 完整部署架构说明

**更新时间:** 2026-02-27  
**架构:** 虚拟主机 + ECS 混合部署

---

## 📊 部署架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    用户访问                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
            ┌─────────────────┐
            │  阿里云 ESA CDN │
            │  (边缘加速)     │
            └────────┬────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ↓            ↓            ↓
┌───────────────┐ ┌───────────┐ ┌───────────┐
│ www.hxfund.cn │ │hxfund.cn/ │ │api.hxfund.│
│ (主站前端)    │ │  blog     │ │   cn      │
│               │ │ (Hexo)    │ │ (后端 API)│
└───────┬───────┘ └─────┬─────┘ └─────┬─────┘
        │               │             │
        │               │             │
        ↓               ↓             ↓
┌───────────────────┐ ┌───────────┐ ┌───────────┐
│  虚拟主机         │ │ 虚拟主机  │ │  ECS 主机  │
│  qxu1606470020    │ │ /htdocs/  │ │120.25.77  │
│  /htdocs/public/  │ │ public/   │ │ /root/    │
│                   │ │  blog/    │ │  hxfund/  │
└───────────────────┘ └───────────┘ └───────────┘
```

---

## 📁 目录结构

### 虚拟主机 (qxu1606470020.my3w.com)

```
/htdocs/
└── public/
    ├── index.html          # 主站前端入口
    ├── css/                # 主站样式
    ├── js/                 # 主站脚本
    ├── images/             # 主站图片
    └── blog/               # Hexo 博客（子目录）
        ├── index.html      # 博客入口
        ├── css/
        ├── js/
        ├── images/
        ├── archives/
        ├── tags/
        ├── categories/
        └── atom.xml
```

### ECS 主机 (120.25.77.136)

```
/root/
├── hxfund/                 # 后端服务
│   ├── server/
│   ├── public/
│   ├── package.json
│   └── pm2.config.js
├── docker/
│   ├── proxy/              # Nginx 反向代理
│   ├── hxfund/             # Docker 配置
│   └── ...
└── logs/
```

---

## 🌐 域名解析

| 域名 | 类型 | 记录值 | 说明 |
|------|------|--------|------|
| `hxfund.cn` | A | 120.25.77.136 | 主域名 → ECS |
| `www.hxfund.cn` | CNAME | hxfund.cn | www 重定向 |
| `api.hxfund.cn` | A | 120.25.77.136 | API 服务 → ECS |
| `blog.hxfund.cn` | CNAME | qxu1606470020.my3w.com | 博客子域 → 虚拟主机 |

---

## 🚀 部署方式

### 方式一：GitHub Actions 自动部署

```yaml
# .github/workflows/deploy-full.yml
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      deploy_target:
        options: [all, blog-only, backend-only]
```

**部署流程:**
1. 推送代码到 main 分支
2. GitHub Actions 自动触发
3. 构建 Hexo 静态文件
4. 构建后端服务
5. FTP 部署博客到 `/htdocs/public/blog/`
6. SSH 部署后端到 ECS `/root/hxfund/`
7. 刷新 ESA 缓存

### 方式二：本地手动部署

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

## 🔐 GitHub Secrets 配置

访问：https://github.com/jickylive/anime-blog/settings/secrets/actions

### 虚拟主机 FTP

| Secret | 值 | 说明 |
|--------|-----|------|
| `FTP_HOST` | qxu1606470020.my3w.com | FTP 主机 |
| `FTP_USER` | qxu1606470020 | FTP 用户名 |
| `FTP_PASS` | Qq803200 | FTP 密码 |
| `FTP_PORT` | 21 | FTP 端口 |

### ECS 后端

| Secret | 说明 |
|--------|------|
| `ECS_SSH_KEY` | SSH 私钥 |
| `ECS_HOST` | 120.25.77.136 |
| `ECS_USER` | root |
| `ECS_PORT` | 22 |

### ESA CDN

| Secret | 说明 |
|--------|------|
| `ESA_SSH_KEY` | SSH 私钥 |
| `ESA_HOST` | ESA 服务器 |
| `ESA_TOKEN` | ESA API Token |

---

## 📋 部署清单

### Hexo 博客配置

- [x] `url: https://hxfund.cn/blog`
- [x] `root: /blog/`
- [x] 部署目录：`/htdocs/public/blog/`

### 后端服务配置

- [ ] ECS 已安装 Node.js
- [ ] ECS 已安装 PM2
- [ ] 后端服务配置正确
- [ ] 数据库连接正常

### ESA 配置

- [ ] 域名已绑定
- [ ] HTTPS 证书已配置
- [ ] 缓存规则已设置
- [ ] 回源配置正确

---

## ✅ 验证步骤

### 1. 验证 Hexo 博客

```bash
# 访问博客
curl -I https://hxfund.cn/blog/

# 预期输出：HTTP/1.1 200 OK
```

### 2. 验证后端 API

```bash
# 访问 API
curl -I https://api.hxfund.cn/api/health

# 预期输出：HTTP/1.1 200 OK
```

### 3. 验证主站前端

```bash
# 访问主站
curl -I https://www.hxfund.cn/

# 预期输出：HTTP/1.1 200 OK
```

### 4. 验证文件结构

```bash
# FTP 连接
ftp qxu1606470020.my3w.com

# 检查目录
ls /htdocs/public/
ls /htdocs/public/blog/
```

---

## 🔧 故障排查

### 博客 404

1. 检查文件是否上传到 `/htdocs/public/blog/`
2. 检查 `.htaccess` 配置
3. 清除浏览器缓存

### API 502

1. 检查后端服务是否运行
   ```bash
   pm2 status
   ```
2. 检查日志
   ```bash
   pm2 logs hxfund-api
   ```
3. 重启服务
   ```bash
   pm2 restart hxfund-api
   ```

### ESA 缓存问题

```bash
# 手动刷新缓存
curl -X POST "https://esapush.aliyuncs.com/push" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"type": "refresh", "objects": ["https://hxfund.cn/blog/*"]}'
```

---

## 📊 性能优化

### 虚拟主机

- ✅ 启用 Gzip 压缩
- ✅ 配置浏览器缓存
- ✅ 图片压缩
- ✅ 使用 CDN

### ECS 后端

- ✅ PM2 集群模式
- ✅ Redis 缓存
- ✅ 数据库连接池
- ✅ 静态文件 CDN

### ESA CDN

- ✅ 静态资源缓存
- ✅ HTTPS 加速
- ✅ 智能压缩
- ✅ 图片优化

---

## 📝 常用命令

### Hexo 博客

```bash
cd /root/anime-blog

# 本地预览
npm run server

# 生成静态文件
npm run build

# 部署
npm run deploy
```

### 后端服务

```bash
cd /root/hxfund

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启服务
pm2 restart hxfund-api

# 停止服务
pm2 stop hxfund-api
```

### Docker 服务

```bash
cd /root/docker/proxy

# 查看状态
docker ps

# 重启服务
docker-compose restart

# 查看日志
docker logs proxy-web
```

---

## 🔗 相关文档

- `BLOG_DEPLOYMENT_GUIDE.md` - 博客部署指南
- `DEPLOYMENT_CHECKLIST.md` - 部署检查清单
- `.github/workflows/deploy-full.yml` - 完整部署工作流

---

## ✅ 总结

**部署架构:**

| 组件 | 位置 | 部署方式 |
|------|------|----------|
| 主站前端 | 虚拟主机 `/htdocs/public/` | FTP |
| Hexo 博客 | 虚拟主机 `/htdocs/public/blog/` | FTP |
| 后端 API | ECS `/root/hxfund/` | SSH + PM2 |
| CDN 加速 | 阿里云 ESA | API |

**下一步:**
1. 配置 GitHub Secrets
2. 测试部署流程
3. 验证所有服务

---

**部署架构配置完成！** 🎉
