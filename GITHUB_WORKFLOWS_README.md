# Anime Blog - GitHub Actions 工作流说明

## 概述

该项目的CI/CD系统经过优化，采用模块化工作流设计，分别处理不同的任务，提高效率和可维护性。

## 工作流结构

### 1. `main-workflow.yml` - 主工作流
- **触发条件**：定时任务（每日）、main分支更新、手动触发
- **功能**：完整的端到端流程，包含AI内容生成、构建和部署
- **用途**：综合性的全功能工作流，适用于需要完整执行所有步骤的场景

### 2. `daily-ai-content.yml` - 每日AI内容生成
- **触发条件**：定时任务（每天北京时间早8点）
- **功能**：运行`daily-news.js`脚本生成AI内容
- **用途**：自动化每日内容生成

### 3. `build-static.yml` - 静态页面构建
- **触发条件**：main分支更新、手动触发
- **功能**：生成Hexo静态页面
- **用途**：专门处理站点构建任务，输出artifact供其他工作流使用

### 4. `deploy-aliyun-ftp.yml` - 阿里云FTP部署
- **触发条件**：构建工作流完成后、手动触发
- **功能**：将构建的静态文件部署到阿里云FTP主机的/blog子目录
- **用途**：部署到阿里云FTP服务器

### 5. `deploy-github-pages.yml` - GitHub Pages部署
- **触发条件**：构建工作流完成后、手动触发
- **功能**：将构建的静态文件部署到GitHub Pages
- **用途**：发布到GitHub Pages作为备用站点

## 触发规则

### 定时任务
- 每日AI内容生成：每天北京时间早8点 (`0 0 * * *`)
- 该时间选择是因为是低峰时段，且便于后续处理

### 分支更新
- `main` 分支更新会触发构建流程
- 特定文件路径更改才会触发构建：
  - `source/**` - Hexo源文件
  - `public/**` - 已生成的页面
  - `package*.json` - 依赖文件
  - `_config*.yml` - 配置文件
  - `daily-news.js` - AI内容生成脚本

### 手动触发
所有工作流都支持手动触发，并提供相应的参数选项。

## 参数说明

### main-workflow.yml
- `action_type`: 操作类型（ai-generation, build-only, deploy-only, full-deploy, github-pages-only）

### daily-ai-content.yml
- `force_run`: 强制运行AI内容生成

### build-static.yml
- `rebuild_all`: 重新构建全部页面

### deploy-aliyun-ftp.yml
- `target_environment`: 目标环境（production, staging）

### deploy-github-pages.yml
- `force_deploy`: 强制部署

## 安全措施

- 所有部署都通过GitHub Environments配置，确保安全凭据的管理
- 使用最小权限原则配置工作流权限
- 通过并发控制防止同时运行冲突的任务

## 优势

1. **模块化设计**：每个工作流职责单一，易于维护
2. **减少重复**：消除了多个相似部署流程的冗余
3. **高效利用资源**：只在需要时运行特定任务
4. **灵活性强**：支持多种触发方式和参数
5. **错误隔离**：单个工作流失败不会影响其他任务