# 🚀 Hexo 博客部署指南

**目标域名:** https://blog.hxfund.cn

---

## 📋 部署方式

| 方式 | 适用场景 | 推荐度 |
|------|----------|--------|
| GitHub Actions | 自动化部署 | ⭐⭐⭐⭐⭐ |
| 本地手动部署 | 首次部署/调试 | ⭐⭐⭐ |

---

## 方式一：GitHub Actions 自动部署

### 1. 配置 Secrets

访问：https://github.com/jickylive/anime-blog/settings/secrets/actions

添加以下 Secrets：

| Secret | 说明 |
|--------|------|
| `FTP_HOST` | FTP 主机地址 |
| `FTP_USER` | FTP 用户名 |
| `FTP_PASS` | FTP 密码 |
| `FTP_PORT` | FTP 端口（默认 21） |

### 2. 推送代码

```bash
git add .
git commit -m "更新博客内容"
git push origin main
```

### 3. 查看部署状态

访问：https://github.com/jickylive/anime-blog/actions

---

## 方式二：本地手动部署

### 1. 生成静态文件

```bash
cd /root/anime-blog
npx hexo clean && npx hexo generate
```

### 2. 部署到服务器

```bash
npm run deploy
# 或运行部署脚本
./bin/deploy.sh
```

---

## 🔧 配置说明

### 环境变量 (.env)

```bash
FTP_HOST=<你的 FTP 主机>
FTP_USER=<你的 FTP 用户名>
FTP_PASSWORD=<你的 FTP 密码>
FTP_PORT=21
FTP_REMOTE=/htdocs/public
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

---

## ✅ 验证清单

部署完成后，请确认：

- [ ] DNS 解析生效：`dig blog.hxfund.cn`
- [ ] HTTPS 访问正常：`curl -I https://blog.hxfund.cn`
- [ ] 首页显示正常
- [ ] 文章列表正常
- [ ] 图片/CSS/JS 加载正常
- [ ] 移动端显示正常

---

## 🔧 故障排查

### DNS 解析不生效

```bash
# 检查 DNS 解析
dig blog.hxfund.cn

# 清除本地 DNS 缓存（Linux）
sudo systemd-resolve --flush-caches
```

**等待时间:** DNS 生效通常需要 10 分钟到 48 小时

### FTP 连接失败

```bash
# 测试 FTP 连接
ftp <FTP_HOST>

# 或使用 lftp
lftp -u <FTP_USER> <FTP_HOST>
```

### GitHub Actions 失败

1. 查看工作流日志
2. 检查 Secrets 配置
3. 验证 FTP 凭据

### 404 错误

- 检查文件是否上传到正确目录
- 检查 index.html 是否存在
- 清除浏览器缓存

---

## 📝 常用命令

### 本地开发

```bash
npm run server      # 启动本地服务器
npm run build       # 生成静态文件
npm run clean       # 清理缓存
```

### 部署

```bash
npm run deploy      # 部署到服务器
./bin/deploy.sh     # 运行部署脚本
```

### 检查

```bash
./bin/health-check.sh   # 健康检查
./bin/dns-setup.sh      # DNS 检查
```

---

## 🔗 相关资源

- [Hexo 官方文档](https://hexo.io/zh-cn/)
- [FTP Deploy Action](https://github.com/SamKirkland/FTP-Deploy-Action)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**部署准备就绪！** 🎉
