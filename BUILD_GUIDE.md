# Hexo 博客构建指南

## 构建脚本说明

本项目提供了多种构建选项以满足不同的需求：

### 基础构建
```bash
npm run build
```
使用 Hexo 默认的生成命令。

### 优化构建
```bash
npm run build:optimized
```
先清理再构建，确保干净的构建环境。

## 构建输出

构建完成后会生成以下文件：
- `public/` - 生成的静态文件

## 部署

构建完成后可以使用以下命令部署：

```bash
npm run deploy
```

或者使用特定的部署脚本：

```bash
./scripts/deploy-to-hxfund.sh
```

## 健康检查

在构建前可以运行健康检查：

```bash
npm run check
```

## 环境要求

- Node.js v18.x 或 v20.x
- npm v8+
- Hexo CLI (推荐全局安装)

## 故障排除

如果构建失败，请尝试：

1. 清理缓存：`npm run clean`
2. 更新依赖：`npm install`
3. 检查配置：`npm run check`
4. 重新构建：`npm run build`

## 自动化构建

可以在 CI/CD 中使用这些脚本：

```bash
# 完整的构建流程
npm run build:full

# 部署流程
npm run build:full && npm run deploy
```