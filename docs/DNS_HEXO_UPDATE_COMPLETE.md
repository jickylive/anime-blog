# ✅ ESA DNS 和 Hexo 配置更新完成

**更新时间:** 2026-02-27  
**配置状态:** ✅ 完成

---

## 📊 更新内容

### 1. Hexo URL 配置

**_config.yml:**
```yaml
url: https://www.hxfund.cn/blog
root: /blog/
```

**变更:** `hxfund.cn/blog` → `www.hxfund.cn/blog`

### 2. ESA DNS 解析配置

| 域名 | 类型 | 记录值 | 状态 |
|------|------|--------|------|
| `hxfund.cn` | CNAME | qxu1606470020.my3w.com | ⚠️ 待配置 |
| `www.hxfund.cn` | CNAME | qxu1606470020.my3w.com | ⚠️ 待配置 |
| `api.hxfund.cn` | A | 120.25.77.136 | ✅ ECS |
| `blog.hxfund.cn` | CNAME | qxu1606470020.my3w.com | ✅ 已有 |

### 3. 静态文件生成

- ✅ 433 个文件已生成
- ✅ URL 已更新为 `www.hxfund.cn/blog`
- ✅ 所有链接已更新

---

## 🌐 DNS 配置步骤

### 步骤 1: 登录阿里云控制台

访问：https://dns.console.aliyun.com

### 步骤 2: 添加/修改 DNS 记录

#### 主域名 hxfund.cn

```
主机记录：@
记录类型：CNAME
记录值：qxu1606470020.my3w.com
TTL: 10 分钟
```

#### www.hxfund.cn

```
主机记录：www
记录类型：CNAME
记录值：qxu1606470020.my3w.com
TTL: 10 分钟
```

### 步骤 3: ESA 控制台配置

访问：https://esa.console.aliyuncs.com

#### 添加加速域名

1. **hxfund.cn**
   - 业务类型：静态加速
   - 源站类型：源站域名
   - 源站地址：qxu1606470020.my3w.com

2. **www.hxfund.cn**
   - 业务类型：静态加速
   - 源站类型：源站域名
   - 源站地址：qxu1606470020.my3w.com

#### 配置 HTTPS

1. 上传 SSL 证书
2. 开启强制 HTTPS 跳转
3. 配置 HTTP/2

---

## ✅ 验证配置

### 检查生成的文件

```bash
cd /root/anime-blog

# 验证 URL
grep -r "www.hxfund.cn/blog" public/ | head -3

# 预期输出：
# public/about/index.html:<link rel="canonical" href="https://www.hxfund.cn/blog/about/"/>
```

### 检查 DNS 解析

```bash
# 检查 DNS
dig hxfund.cn +short
dig www.hxfund.cn +short

# 预期输出：
# qxu1606470020.my3w.com.
```

### 检查网站访问

```bash
# 检查主站
curl -I https://www.hxfund.cn

# 检查博客
curl -I https://www.hxfund.cn/blog

# 预期输出：HTTP/1.1 200 OK
```

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
    ├── index.html      # https://www.hxfund.cn/blog/
    ├── css/
    ├── js/
    ├── archives/
    ├── tags/
    └── atom.xml
```

---

## 🚀 部署流程

### 自动部署

```bash
cd /root/anime-blog

# 提交更改
git add .
git commit -m "更新：ESA DNS 配置和 URL 更新"
git push origin main

# 查看部署状态
# https://github.com/jickylive/anime-blog/actions
```

### 手动部署

```bash
cd /root/anime-blog

# 生成文件
npx hexo clean && npx hexo generate

# 部署
npm run deploy
```

---

## 📋 检查清单

### DNS 配置
- [ ] hxfund.cn CNAME 已添加
- [ ] www.hxfund.cn CNAME 已添加
- [ ] ESA 加速域名已配置
- [ ] HTTPS 证书已上传

### Hexo 配置
- [x] URL 已更新为 www.hxfund.cn/blog
- [x] root 已配置为 /blog/
- [x] 静态文件已生成
- [ ] 部署已完成

### 验证
- [ ] DNS 解析生效
- [ ] https://www.hxfund.cn 可访问
- [ ] https://www.hxfund.cn/blog 可访问
- [ ] CDN 加速正常

---

## ⏱️ 生效时间

| 项目 | 时间 |
|------|------|
| DNS 生效 | 10 分钟 - 1 小时 |
| CDN 生效 | 5-10 分钟 |
| 全球传播 | 最长 72 小时 |

---

## 🔧 故障排查

### DNS 不生效

```bash
# 清除本地 DNS 缓存
sudo systemd-resolve --flush-caches

# 检查 DNS 传播
# https://www.whatsmydns.net/
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

### 404 错误

1. 检查文件是否在 `/htdocs/public/blog/`
2. 检查 .htaccess 配置
3. 清除浏览器缓存

---

## 📝 相关文档

| 文档 | 用途 |
|------|------|
| `ESA_DNS_UPDATE.md` | 📖 DNS 配置详细指南 |
| `HYBRID_DEPLOYMENT_COMPLETE.md` | 🏗️ 混合部署说明 |
| `DEPLOYMENT_ARCHITECTURE.md` | 📊 架构说明 |
| `BLOG_DEPLOYMENT_GUIDE.md` | 📘 博客部署指南 |

---

## ✅ 总结

**配置状态:**

| 项目 | 状态 |
|------|------|
| Hexo URL 更新 | ✅ |
| 静态文件生成 | ✅ |
| DNS 配置指南 | ✅ |
| ESA 配置指南 | ✅ |
| 部署工作流 | ✅ |

**下一步:**
1. 登录阿里云配置 DNS
2. 配置 ESA 加速域名
3. 推送代码部署
4. 验证网站访问

---

**配置更新完成！** 🎉
