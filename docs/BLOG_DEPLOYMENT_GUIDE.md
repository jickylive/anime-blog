# 📋 blog.hxfund.cn 部署指南

**部署时间:** 2026-02-27
**目标域名:** https://blog.hxfund.cn
**部署方式:** 虚拟主机 FTP / 阿里云 ESA

---

## 🚀 快速部署

### 方式一：GitHub Actions 自动部署（推荐）

```bash
# 1. 提交更改
cd /root/anime-blog
git add .
git commit -m "更新：部署到 blog.hxfund.cn"
git push origin main

# 2. 查看部署状态
# 访问：https://github.com/jickylive/anime-blog/actions
```

### 方式二：本地手动部署

```bash
cd /root/anime-blog

# 1. 生成静态文件
npx hexo clean && npx hexo generate

# 2. 部署
npm run deploy
# 或
./deploy.sh
```

---

## 🔧 配置说明

### Hexo 配置 (_config.yml)

```yaml
# URL 配置
url: https://blog.hxfund.cn
root: /
```

### 部署配置 (_config.deploy.yml)

```yaml
deploy:
  type: ftpsync
  host: ${FTP_HOST}
  user: ${FTP_USER}
  pass: ${FTP_PASSWORD}
  port: ${FTP_PORT}
  remote: ${FTP_REMOTE}
```

### 环境变量 (.env)

```bash
# FTP 部署配置（虚拟主机）
FTP_HOST=qxu1606470020.my3w.com
FTP_USER=qxu1606470020
FTP_PASSWORD=<你的 FTP 密码，请从 GitHub Secrets 获取>
FTP_PORT=21
FTP_REMOTE=/htdocs/public
```

> ⚠️ **安全提示:** FTP 密码已存储在 GitHub Secrets 中，不应在文档中明文显示。

---

## 🌐 DNS 解析配置

### 阿里云 ESA DNS 解析

登录 [阿里云 DNS 控制台](https://dns.console.aliyun.com) 添加解析：

#### 方案 A: CNAME 记录（推荐）

| 主机记录 | 记录类型 | 记录值 | TTL |
|----------|----------|--------|-----|
| blog | CNAME | your-esa-domain.aliyuncs.com | 10 分钟 |

#### 方案 B: A 记录

| 主机记录 | 记录类型 | 记录值 | TTL |
|----------|----------|--------|-----|
| blog | A | ESA 分配的 IP | 10 分钟 |

### 虚拟主机 DNS 解析

如果直接使用虚拟主机：

| 主机记录 | 记录类型 | 记录值 | TTL |
|----------|----------|--------|-----|
| blog | CNAME | qxu1606470020.my3w.com | 10 分钟 |
| 或 | A | 虚拟主机 IP | 10 分钟 |

---

## 🔐 GitHub Secrets 配置

访问：https://github.com/jickylive/anime-blog/settings/secrets/actions

### FTP 部署（必需）

| Secret | 说明 |
|--------|------|
| `FTP_HOST` | FTP 主机地址 |
| `FTP_USER` | FTP 用户名 |
| `FTP_PASS` | FTP 密码 |
| `FTP_PORT` | FTP 端口 (默认 21) |

### ESA 部署（可选）

| Secret | 说明 |
|--------|------|
| `ESA_SSH_KEY` | SSH 私钥 |
| `ESA_HOST` | ESA 服务器 IP |
| `ESA_USER` | SSH 用户名 |
| `ESA_PORT` | SSH 端口 |
| `ESA_TARGET` | 部署路径 |
| `ESA_TOKEN` | ESA API Token |

---

## 📁 目录结构

```
htdocs/
└── public/          # 网站根目录
    ├── index.html   # 首页
    ├── css/         # 样式文件
    ├── js/          # JavaScript 文件
    ├── images/      # 图片文件
    ├── archives/    # 归档页面
    ├── tags/        # 标签页面
    ├── categories/  # 分类页面
    └── atom.xml     # RSS 订阅
```

---

## ✅ 验证清单

### DNS 解析

```bash
# 检查 DNS 解析
dig blog.hxfund.cn

# 预期输出：
# blog.hxfund.cn.    CNAME    your-domain.aliyuncs.com.
# 或
# blog.hxfund.cn.    A        x.x.x.x
```

### 网站访问

```bash
# 测试 HTTP
curl -I http://blog.hxfund.cn

# 测试 HTTPS
curl -I https://blog.hxfund.cn

# 预期输出：HTTP/1.1 200 OK
```

### 文件验证

```bash
# FTP 连接测试
ftp qxu1606470020.my3w.com

# 检查文件是否存在
ls /htdocs/public/index.html
```

---

## 🔧 故障排查

### 1. DNS 解析不生效

```bash
# 清除本地 DNS 缓存
# Linux
sudo systemd-resolve --flush-caches

# 检查 DNS 传播
# https://www.whatsmydns.net/
```

**等待时间:** DNS 生效通常需要 10 分钟到 48 小时

### 2. FTP 连接失败

```bash
# 测试 FTP 连接
ftp qxu1606470020.my3w.com

# 或使用 lftp
lftp -u qxu1606470020 qxu1606470020.my3w.com
```

### 3. 404 错误

- 检查文件是否上传到正确目录 `/htdocs/public/`
- 检查 index.html 是否存在
- 清除浏览器缓存

### 4. GitHub Actions 失败

1. 查看工作流日志
2. 检查 Secrets 配置
3. 验证 FTP 凭据

---

## 📊 部署流程

```
┌─────────────┐
│  代码推送   │
│  (main)     │
└──────┬──────┘
       ↓
┌─────────────┐
│   Checkout  │
└──────┬──────┘
       ↓
┌─────────────┐
│ Setup Node  │
└──────┬──────┘
       ↓
┌─────────────┐
│   Install   │
└──────┬──────┘
       ↓
┌─────────────┐
│   Generate  │
└──────┬──────┘
       ↓
┌─────────────┐
│  FTP Deploy │
└──────┬──────┘
       ↓
┌─────────────┐
│   Verify    │
└─────────────┘
```

---

## 🎯 优化建议

### 1. 性能优化

- ✅ 启用 Gzip 压缩
- ✅ 启用浏览器缓存
- ✅ 使用 CDN 加速
- ✅ 图片压缩

### 2. SEO 优化

- ✅ 配置 sitemap.xml
- ✅ 配置 robots.txt
- ✅ 添加 meta 描述
- ✅ 结构化数据

### 3. 安全加固

- ✅ 使用 HTTPS
- ✅ 定期更新依赖
- ✅ 备份重要文件
- ✅ 监控访问日志

---

## 📝 常用命令

### 本地开发

```bash
# 启动本地服务器
npm run server

# 生成静态文件
npm run build

# 清理缓存
npm run clean
```

### 部署

```bash
# 完整部署
npm run deploy

# 或分步执行
npx hexo clean
npx hexo generate
npx hexo deploy
```

### 检查

```bash
# 健康检查
./bin/health-check.sh

# 检查 FTP 连接
ftp qxu1606470020.my3w.com

# 检查 DNS
dig blog.hxfund.cn
```

---

## 🔗 相关资源

- [Hexo 文档](https://hexo.io/zh-cn/)
- [FTP Deploy Action](https://github.com/SamKirkland/FTP-Deploy-Action)
- [阿里云 DNS](https://help.aliyun.com/product/29697.html)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## ✅ 部署确认

部署完成后，请确认：

- [ ] DNS 解析生效
- [ ] https://blog.hxfund.cn 可访问
- [ ] 首页显示正常
- [ ] 文章列表正常
- [ ] 文章详情正常
- [ ] 图片加载正常
- [ ] CSS/JS 加载正常
- [ ] 移动端显示正常

---

**部署准备就绪！** 🎉
