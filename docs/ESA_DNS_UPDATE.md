# 🌐 ESA DNS 解析配置指南

**更新时间:** 2026-02-27  
**目标:** 将 hxfund.cn 和 www.hxfund.cn 指向虚拟主机

---

## 📋 DNS 解析配置

### 登录阿里云控制台

访问：https://dns.console.aliyun.com

### 添加/修改 DNS 记录

#### 1. 主域名 hxfund.cn

| 配置项 | 值 |
|--------|-----|
| 主机记录 | @ |
| 记录类型 | CNAME |
| 记录值 | qxu1606470020.my3w.com |
| TTL | 10 分钟 |

#### 2. www.hxfund.cn

| 配置项 | 值 |
|--------|-----|
| 主机记录 | www |
| 记录类型 | CNAME |
| 记录值 | qxu1606470020.my3w.com |
| TTL | 10 分钟 |

---

## 🔧 ESA 控制台配置

### 登录 ESA 控制台

访问：https://esa.console.aliyuncs.com

### 配置加速域名

#### 1. 添加 hxfund.cn

- **域名:** hxfund.cn
- **业务类型:** 静态加速
- **源站类型:** 源站域名
- **源站地址:** qxu1606470020.my3w.com
- **端口:** 80

#### 2. 添加 www.hxfund.cn

- **域名:** www.hxfund.cn
- **业务类型:** 静态加速
- **源站类型:** 源站域名
- **源站地址:** qxu1606470020.my3w.com
- **端口:** 80

### 配置 HTTPS 证书

1. 进入域名管理
2. 选择 hxfund.cn
3. 点击"HTTPS 配置"
4. 上传 SSL 证书或使用免费证书
5. 开启"强制 HTTP 跳转 HTTPS"

---

## 📝 虚拟主机配置

### 登录虚拟主机控制面板

访问虚拟主机管理后台

### 域名绑定

1. 进入"域名管理"
2. 添加绑定域名：
   - hxfund.cn
   - www.hxfund.cn
3. 确认网站根目录：`/htdocs/public`

### 子目录配置

确认以下目录结构：

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
    └── ...
```

---

## ✅ 验证步骤

### 1. 检查 DNS 解析

```bash
# 检查主域名
dig hxfund.cn +short

# 检查 www
dig www.hxfund.cn +short

# 预期输出：
# qxu1606470020.my3w.com.
```

### 2. 检查网站访问

```bash
# 检查主站
curl -I https://www.hxfund.cn

# 检查博客
curl -I https://www.hxfund.cn/blog

# 预期输出：HTTP/1.1 200 OK
```

### 3. 检查 CDN 状态

```bash
# 检查 Via 头
curl -I https://www.hxfund.cn | grep -i via

# 预期输出包含：Via: kunlun/...
```

---

## ⏱️ DNS 生效时间

| 阶段 | 时间 | 说明 |
|------|------|------|
| DNS 生效 | 10 分钟 - 1 小时 | 阿里云 DNS 更新 |
| CDN 生效 | 5-10 分钟 | ESA 缓存更新 |
| 全球传播 | 最长 72 小时 | 全球 DNS 传播 |

---

## 🔍 故障排查

### DNS 不生效

```bash
# 清除本地 DNS 缓存
# Linux
sudo systemd-resolve --flush-caches

# Windows
ipconfig /flushdns

# macOS
sudo dscacheutil -flushcache
```

### CDN 缓存问题

```bash
# 刷新 ESA 缓存
curl -X POST "https://esapush.aliyuncs.com/push" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "refresh",
    "objects": [
      "https://www.hxfund.cn/",
      "https://www.hxfund.cn/blog/*"
    ]
  }'
```

### 虚拟主机 403/404

1. 检查文件是否在正确目录
2. 检查文件权限
3. 检查 .htaccess 配置

---

## 📊 完整 DNS 配置

| 域名 | 类型 | 记录值 | 说明 |
|------|------|--------|------|
| `hxfund.cn` | CNAME | qxu1606470020.my3w.com | 主域名 → 虚拟主机 |
| `www.hxfund.cn` | CNAME | qxu1606470020.my3w.com | www → 虚拟主机 |
| `api.hxfund.cn` | A | 120.25.77.136 | API → ECS |
| `blog.hxfund.cn` | CNAME | qxu1606470020.my3w.com | 博客子域 → 虚拟主机 |

---

## 🚀 Hexo 配置更新

### _config.yml

```yaml
url: https://www.hxfund.cn/blog
root: /blog/
```

### 重新生成

```bash
cd /root/anime-blog
npx hexo clean && npx hexo generate
```

### 部署

```bash
# 自动部署
git push origin main

# 或手动部署
npm run deploy
```

---

## 📋 检查清单

- [ ] DNS 记录已添加
- [ ] ESA 加速域名已配置
- [ ] HTTPS 证书已上传
- [ ] 虚拟主机域名已绑定
- [ ] 文件目录结构正确
- [ ] Hexo 配置已更新
- [ ] 静态文件已生成
- [ ] 部署已完成
- [ ] 网站可正常访问

---

## 🔗 相关文档

- `HYBRID_DEPLOYMENT_COMPLETE.md` - 混合部署说明
- `DEPLOYMENT_ARCHITECTURE.md` - 架构说明
- `BLOG_DEPLOYMENT_GUIDE.md` - 博客部署指南

---

**DNS 配置准备就绪！** 🎉
