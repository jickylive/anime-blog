# GitHub Actions 配置说明

## 📁 文件结构

```
.github/
├── workflows/
│   ├── deploy.yml          # 主部署工作流
│   └── ci.yml              # CI 检查工作流（可选）
├── dependabot.yml          # Dependabot 自动更新
└── ISSUE_TEMPLATE/         # Issue 模板（可选）
```

---

## 🚀 deploy.yml 工作流

### 触发条件

| 事件 | 说明 |
|------|------|
| `push to main` | 推送到 main 分支自动部署 |
| `push to dev` | 推送到 dev 分支触发构建 |
| `pull_request` | PR 到 main 分支触发检查 |
| `workflow_dispatch` | 手动触发部署 |

### 工作流程

```
1. Checkout → 2. Setup Node → 3. Cache → 4. Install → 5. Build → 6. Deploy
```

### 并发控制

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true  # 取消进行中的部署
```

---

## 🔐 必需的 Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中配置：

| Secret | 说明 | 示例 |
|--------|------|------|
| `ESA_SSH_KEY` | SSH 私钥 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `ESA_HOST` | ESA 服务器 IP | `120.25.77.136` |
| `ESA_USER` | SSH 用户名 | `root` |
| `ESA_PORT` | SSH 端口 | `22` |
| `ESA_TARGET` | 部署目标路径 | `/var/www/html` |
| `ESA_TOKEN` | ESA API Token | `your_esa_token` |

### 配置步骤

1. 访问 https://github.com/jickylive/anime-blog/settings/secrets/actions
2. 点击 "New repository secret"
3. 添加上述 Secrets

---

## 📊 工作流状态

### 查看部署状态

1. 访问 https://github.com/jickylive/anime-blog/actions
2. 查看最新的工作流运行状态
3. 点击具体运行查看详细日志

### 部署环境

配置部署环境以获得更详细的部署跟踪：

1. 访问 https://github.com/jickylive/anime-blog/settings/environments
2. 创建 "production" 环境
3. 配置环境特定的 Secrets

---

## 🔧 自定义配置

### 添加测试步骤

```yaml
- name: Run tests
  run: |
    npm test
```

### 添加代码检查

```yaml
- name: Lint code
  run: |
    npm run lint
```

### 多环境部署

```yaml
strategy:
  matrix:
    environment: [staging, production]
```

---

## ⚠️ 故障排查

### 常见问题

#### 1. 部署失败

```bash
# 检查 SSH 密钥
ssh-add -l

# 测试 SSH 连接
ssh -i ~/.ssh/id_rsa user@host
```

#### 2. 构建失败

```bash
# 本地测试构建
npm install
npm run build
```

#### 3. 缓存问题

```yaml
# 清除缓存
- name: Clear cache
  run: rm -rf node_modules
```

---

## 📈 优化建议

### 1. 构建速度

- ✅ 使用缓存（已配置）
- ✅ 使用 `npm ci` 代替 `npm install`
- ✅ 限制 fetch-depth

### 2. 安全性

- ✅ 使用 OIDC 代替长期凭证
- ✅ 限制权限范围
- ✅ 定期轮换 Secrets

### 3. 可靠性

- ✅ 配置超时
- ✅ 添加重试机制
- ✅ 配置通知

---

## 🔔 通知配置

### 邮件通知

```yaml
on:
  workflow_run:
    workflows: ["Deploy to Aliyun ESA"]
    types: [completed]
```

### Slack/Discord 通知

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "部署 ${{ job.status }}"
      }
```

---

## 📝 最佳实践

1. **使用特定版本** - 避免使用 `@latest`
2. **最小权限原则** - 只授予必要的权限
3. **定期更新** - 保持 Actions 版本最新
4. **测试工作流** - 在推送前本地测试
5. **文档化** - 维护工作流文档

---

## 🔗 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [SSH Deploy Action](https://github.com/easingthemes/ssh-deploy)
- [Actions Cache](https://docs.github.com/en/actions/using-workflows/caching-dependencies)
