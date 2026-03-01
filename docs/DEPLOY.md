# 🚀 Hexo 博客部署指南

## 📋 部署方式

### 方式一：本地 FTP 部署（当前）

1. 复制 `.env.example` 为 `.env`
2. 编辑 `.env` 填入 FTP 密码
3. 复制 `_config.deploy.yml.example` 为 `_config.deploy.yml`
4. 运行部署命令：

```bash
npm install
npx hexo clean
npx hexo generate
npx hexo deploy
```

---

### 方式二：GitHub Actions 自动部署到阿里云 ESA（推荐）

#### 1. 配置 GitHub Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 添加：

```
ESA_SSH_KEY: <你的 SSH 私钥>
ESA_HOST: <ESA 服务器 IP>
ESA_USER: <SSH 用户名>
ESA_PORT: 22
ESA_TARGET: /var/www/html
ESA_TOKEN: <ESA API Token>
```

#### 2. 配置阿里云 ESA

1. 登录 [阿里云 ESA 控制台](https://esa.console.aliyun.com)
2. 创建加速域名 `www.hxfund.cn`
3. 配置源站信息
4. 获取 API Token 用于缓存刷新

#### 3. 自动部署

推送代码到 main 分支自动触发部署：

```bash
git add .
git commit -m "更新内容"
git push origin main
```

---

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 启动本地服务器
npx hexo server

# 访问 http://localhost:4000

# 生成静态文件
npx hexo generate

# 清理缓存
npx hexo clean
```

---

## 📝 Waline 评论配置

1. 确保 `https://api.hxfund.cn` Waline 服务正常运行
2. 在 LeanCloud 控制台创建应用
3. 部署 Waline 云引擎
4. 绑定自定义域名 `api.hxfund.cn`

---

## ⚠️ 注意事项

- `.env` 和 `_config.deploy.yml` 包含敏感信息，不要提交到 Git
- 已添加到 `.gitignore`，自动忽略
