# GitHub Actions 检查报告

**检查时间:** 2026-02-27  
**仓库:** https://github.com/jickylive/anime-blog

---

## 📊 配置状态

| 文件 | 状态 | 用途 |
|------|------|------|
| `.github/workflows/deploy.yml` | ✅ 已优化 | 主部署工作流 |
| `.github/workflows/ci.yml` | ✅ 新增 | CI 检查工作流 |
| `.github/dependabot.yml` | ✅ 已配置 | 依赖自动更新 |
| `.github/WORKFLOWS_GUIDE.md` | ✅ 新增 | 配置指南 |

---

## 🚀 deploy.yml 工作流

### 触发条件

| 事件 | 分支 | 说明 |
|------|------|------|
| `push` | main | 自动部署到生产环境 |
| `push` | dev | 触发构建测试 |
| `pull_request` | main | PR 检查 |
| `workflow_dispatch` | - | 手动触发部署 |

### 工作流程

```
┌─────────────┐
│   Checkout  │
└──────┬──────┘
       ↓
┌─────────────┐
│ Setup Node  │
└──────┬──────┘
       ↓
┌─────────────┐
│ Cache deps  │
└──────┬──────┘
       ↓
┌─────────────┐
│   Install   │
└──────┬──────┘
       ↓
┌─────────────┐
│    Build    │
└──────┬──────┘
       ↓
┌─────────────┐
│   Deploy    │
└──────┬──────┘
       ↓
┌─────────────┐
│ Purge Cache │
└─────────────┘
```

### 优化内容

#### 1. 并发控制
```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true  # 取消进行中的部署
```

#### 2. 缓存优化
```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
```

#### 3. 权限控制
```yaml
permissions:
  contents: read
  deployments: write
```

#### 4. 超时保护
```yaml
timeout-minutes: 15
```

#### 5. 手动触发
```yaml
workflow_dispatch:
  inputs:
    environment:
      type: choice
      options:
        - production
        - staging
```

---

## 🔐 必需的 Secrets

在 GitHub 配置 Secrets：

**访问:** https://github.com/jickylive/anime-blog/settings/secrets/actions

| Secret | 必需 | 说明 | 获取方式 |
|--------|------|------|----------|
| `ESA_SSH_KEY` | ✅ | SSH 私钥 | `ssh-keygen -t ed25519` |
| `ESA_HOST` | ✅ | 服务器 IP | 阿里云控制台 |
| `ESA_USER` | ✅ | SSH 用户名 | 通常 `root` |
| `ESA_PORT` | ⚠️ | SSH 端口 | 默认 `22` |
| `ESA_TARGET` | ⚠️ | 部署路径 | 默认 `/var/www/html` |
| `ESA_TOKEN` | ✅ | ESA API Token | ESA 控制台 |

### 配置 SSH 密钥

```bash
# 1. 生成密钥
ssh-keygen -t ed25519 -C "github-actions" -f github_actions_key

# 2. 复制私钥到 GitHub Secrets
cat github_actions_key

# 3. 复制公钥到服务器
ssh-copy-id -i github_actions_key.pub root@your-server
```

---

## 📋 CI.yml 工作流

### 用途

- 代码质量检查
- 安全审计
- 构建验证

### 触发条件

- 推送到非 main 分支
- PR 到 main 分支

### 检查项目

1. **依赖安装** - `npm ci`
2. **安全审计** - `npm audit`
3. **构建测试** - `hexo generate`
4. **产物验证** - 检查 `public/index.html`

---

## 🔄 Dependabot 配置

### 更新策略

| 类型 | 频率 | 时间 | 限制 |
|------|------|------|------|
| npm | 每周 | 周一 9:00 | 10 个 PR |
| GitHub Actions | 每周 | 周一 9:00 | 5 个 PR |

### 分组更新

```yaml
groups:
  hexo-packages:
    patterns:
      - "hexo*"
  security-patches:
    update-types:
      - "patch"
      - "minor"
```

---

## ✅ 验证结果

### YAML 语法
```
✅ deploy.yml - 语法正确
✅ ci.yml - 语法正确
✅ dependabot.yml - 语法正确
```

### 工作流文件
```
✅ .github/workflows/deploy.yml
✅ .github/workflows/ci.yml
✅ .github/dependabot.yml
```

### Git 配置
```
✅ Remote: origin
✅ URL: https://github.com/jickylive/anime-blog.git
```

---

## 📝 使用指南

### 自动部署

```bash
# 推送到 main 分支自动部署
git add .
git commit -m "更新内容"
git push origin main
```

### 手动部署

1. 访问 https://github.com/jickylive/anime-blog/actions/workflows/deploy.yml
2. 点击 "Run workflow"
3. 选择环境（production/staging）
4. 点击 "Run workflow"

### 查看状态

1. 访问 https://github.com/jickylive/anime-blog/actions
2. 查看最新运行状态
3. 点击查看详情和日志

---

## ⚠️ 故障排查

### 部署失败

#### 1. SSH 连接失败
```bash
# 测试 SSH 连接
ssh -i /path/to/key user@host
```

#### 2. 构建失败
```bash
# 本地测试构建
npm install
npx hexo clean && npx hexo generate
```

#### 3. 权限问题
```yaml
# 检查 Secrets 配置
# Settings → Secrets → 确认所有必需的 Secret 已配置
```

### 缓存问题

```yaml
# 清除缓存
- name: Clear cache
  run: rm -rf node_modules
```

---

## 📊 工作流优化建议

### 已实现
- ✅ 并发控制
- ✅ 依赖缓存
- ✅ 权限最小化
- ✅ 超时保护
- ✅ 手动触发
- ✅ 环境配置
- ✅ 构建产物上传

### 可选添加
- [ ] Slack/Discord 通知
- [ ] 测试覆盖率报告
- [ ] 性能基准测试
- [ ] 自动回滚机制
- [ ] 多环境部署

---

## 🔗 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [SSH Deploy Action](https://github.com/easingthemes/ssh-deploy)
- [Actions Cache](https://docs.github.com/en/actions/using-workflows/caching-dependencies)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)

---

## ✅ 总结

**GitHub Actions 配置完成！**

| 项目 | 状态 |
|------|------|
| 部署工作流 | ✅ 已优化 |
| CI 工作流 | ✅ 新增 |
| Dependabot | ✅ 已配置 |
| 文档 | ✅ 已创建 |
| Secrets 说明 | ✅ 已完成 |

**下一步:** 在 GitHub 配置 Secrets 并测试工作流。
