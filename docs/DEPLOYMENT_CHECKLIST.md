# 🚀 部署清单

**项目:** hxfund.cn 博客  
**更新时间:** 2026-02-27

---

## ✅ 已完成配置

### 1. Hexo 更新
- [x] Hexo 7.3.0 → 8.1.1
- [x] 插件全部更新到最新
- [x] 主题已是最新
- [x] 生成测试通过

### 2. 代码优化
- [x] daily-news-proxy.js bug 修复
- [x] daily-news.js 环境变量优化
- [x] npm 安全漏洞修复（36→31）
- [x] 代码语法验证通过

### 3. GitHub Actions
- [x] deploy.yml 优化
- [x] ci.yml 新增
- [x] dependabot.yml 配置
- [x] 工作流文档创建

### 4. ESA 配置
- [x] ESA 权限已授权
- [x] 域名绑定验证
- [x] CDN 加速正常
- [x] HTTPS 证书正常
- [x] 缓存刷新 API 可用

### 5. 环境配置
- [x] .env 文件已创建
- [x] Secrets 配置说明
- [x] 健康检查脚本
- [x] 部署脚本优化

---

## 📋 部署前检查

### GitHub Secrets 配置

访问：https://github.com/jickylive/anime-blog/settings/secrets/actions

- [ ] `ESA_SSH_KEY` - SSH 私钥
- [ ] `ESA_HOST` - 服务器 IP（120.25.77.136）
- [ ] `ESA_USER` - SSH 用户名（root）
- [ ] `ESA_PORT` - SSH 端口（22）
- [ ] `ESA_TARGET` - 部署路径（/var/www/html）
- [ ] `ESA_TOKEN` - ESA API Token

### 本地测试

```bash
cd /root/anime-blog

# 1. 运行健康检查
./health-check.sh

# 2. 清理并生成
npx hexo clean && npx hexo generate

# 3. 本地预览
npm run server
```

### Git 提交

```bash
# 添加所有更改
git add .

# 提交
git commit -m "更新：Hexo 升级、代码优化、GitHub Actions 配置"

# 推送到 GitHub
git push origin main
```

---

## 🚀 部署流程

### 方式一：GitHub Actions 自动部署（推荐）

1. **推送代码**
   ```bash
   git push origin main
   ```

2. **查看部署状态**
   - 访问：https://github.com/jickylive/anime-blog/actions
   - 查看 "Deploy to Aliyun ESA" 工作流

3. **验证部署**
   ```bash
   # 测试主站
   curl -I https://www.hxfund.cn
   
   # 刷新缓存（如需要）
   curl -X POST "https://esapush.aliyuncs.com/push" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"type": "refresh", "objects": ["https://www.hxfund.cn/*"]}'
   ```

### 方式二：本地手动部署

```bash
cd /root/anime-blog

# 1. 安装依赖
npm install

# 2. 生成静态文件
npx hexo clean && npx hexo generate

# 3. 部署
npm run deploy
# 或
./deploy.sh
```

### 方式三：手动触发工作流

1. 访问：https://github.com/jickylive/anime-blog/actions/workflows/deploy.yml
2. 点击 "Run workflow"
3. 选择环境（production）
4. 点击 "Run workflow"
5. 等待完成并查看日志

---

## 📊 验证清单

### 网站访问
- [ ] https://www.hxfund.cn - 主站正常
- [ ] https://hxfund.cn - 重定向正常
- [ ] https://api.hxfund.cn - Waline API（待配置）
- [ ] https://ecs.hxfund.cn - ECS 服务（待启动）

### 功能测试
- [ ] 首页加载正常
- [ ] 文章列表正常
- [ ] 文章详情正常
- [ ] 分类/标签正常
- [ ] 搜索功能正常
- [ ] RSS 订阅正常

### 性能检查
- [ ] 首屏时间 < 3s
- [ ] CDN 命中
- [ ] 图片懒加载
- [ ] 缓存正常

---

## ⚠️ 待完成事项

### 高优先级
1. **配置 GitHub Secrets** - 部署必需
2. **启动 ECS 服务** - ecs.hxfund.cn 502
3. **Waline 部署** - api.hxfund.cn 404

### 中优先级
1. **SSL 证书更新** - hxfund.cn 已过期
2. **测试评论功能** - Waline 集成
3. **监控配置** - 访问统计

### 低优先级
1. **主题更新** - v2.8.2 → v2.9.0（可选）
2. **SEO 优化** - 结构化数据
3. **性能优化** - 图片压缩

---

## 📝 回滚方案

### 快速回滚

```bash
# 1. 恢复配置
cp _config.yml.backup _config.yml
cp package.json.backup package.json

# 2. 安装旧版本
npm install hexo@7.3.0 --save

# 3. 重新生成
hexo clean && hexo generate

# 4. 部署旧版本
npm run deploy
```

### Git 回滚

```bash
# 查看提交历史
git log --oneline -10

# 回滚到特定提交
git reset --hard <commit-hash>

# 强制推送
git push -f origin main
```

---

## 🔧 故障排查

### 部署失败

1. **检查 GitHub Actions 日志**
   - 访问：https://github.com/jickylive/anime-blog/actions
   - 查看失败的运行
   - 查看详细错误信息

2. **常见问题**
   - SSH 密钥错误 → 重新生成并配置
   - 源站不可达 → 检查服务器状态
   - 缓存刷新失败 → 验证 Token

### 网站访问异常

```bash
# 测试 ESA 连接
curl -I https://www.hxfund.cn

# 测试源站
curl -I http://120.25.77.136

# 检查 DNS
dig www.hxfund.cn
```

### 构建失败

```bash
# 清理缓存
npx hexo clean

# 重新安装依赖
npm ci

# 重新生成
npx hexo generate --bail
```

---

## 📞 支持资源

### 文档
- [Hexo 文档](https://hexo.io/zh-cn/docs/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [阿里云 ESA 文档](https://help.aliyun.com/product/64603.html)

### 报告文件
- `CODE_REVIEW_REPORT.md` - 代码检查报告
- `FIX_REPORT.md` - 修复完成报告
- `HEXO_UPDATE_REPORT.md` - Hexo 更新报告
- `GITHUB_ACTIONS_FULL_REPORT.md` - Actions 完整报告
- `ESA_VERIFICATION.md` - ESA 验证报告

---

## ✅ 部署确认

部署完成后，请确认：

- [ ] 网站可正常访问
- [ ] 所有内容显示正确
- [ ] 性能指标正常
- [ ] 无控制台错误
- [ ] 移动端显示正常

---

**准备就绪！可以开始部署了。** 🎉
