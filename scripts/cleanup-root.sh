#!/bin/bash

# 🧹 Hexo 博客项目清理脚本
# 使用方法：./scripts/cleanup-root.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "  Hexo 博客根目录清理脚本"
echo "=========================================="
echo ""

cd "$PROJECT_ROOT"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 统计
MOVED_COUNT=0
SKIPPED_COUNT=0

# 需要移动到 docs/ 的文件
DOCS_FILES=(
    "BLOG_DEPLOYMENT_COMPLETE.md"
    "BLOG_DEPLOYMENT_GUIDE.md"
    "CODE_REVIEW_REPORT.md"
    "DEPLOY.md"
    "DEPLOYMENT_ARCHITECTURE.md"
    "DEPLOYMENT_CHECKLIST.md"
    "DNS_CHECK_REPORT.md"
    "DNS_HEXO_UPDATE_COMPLETE.md"
    "ESA_DNS_UPDATE.md"
    "ESA_VERIFICATION.md"
    "FIX_REPORT.md"
    "HEXO_UPDATE_REPORT.md"
    "HYBRID_DEPLOYMENT_COMPLETE.md"
    "OPTIMIZATION_COMPLETE.md"
)

# 需要移动到 scripts/ 的文件
SCRIPT_FILES=(
    "copilot-news.js"
    "daily-news.js"
    "daily-news-proxy.js"
    "deploy.sh"
    "dns-setup.sh"
    "generate_deploy_config.js"
    "health-check.sh"
    "run-daily-task.bat"
)

echo -e "${BLUE}正在检查需要移动的文档文件...${NC}"
echo ""

# 移动文档文件
for file in "${DOCS_FILES[@]}"; do
    if [ -f "$file" ]; then
        if [ -f "docs/$file" ]; then
            echo -e "${YELLOW}跳过${NC}: $file (docs/ 中已存在)"
            ((SKIPPED_COUNT++))
        else
            mv "$file" "docs/"
            echo -e "${GREEN}移动${NC}: $file → docs/"
            ((MOVED_COUNT++))
        fi
    fi
done

echo ""
echo -e "${BLUE}正在检查需要移动的脚本文件...${NC}"
echo ""

# 移动脚本文件（仅当 scripts/ 中不存在时）
for file in "${SCRIPT_FILES[@]}"; do
    if [ -f "$file" ]; then
        if [ -f "scripts/$file" ]; then
            echo -e "${YELLOW}跳过${NC}: $file (scripts/ 中已存在，可手动删除)"
            ((SKIPPED_COUNT++))
        else
            mv "$file" "scripts/"
            echo -e "${GREEN}移动${NC}: $file → scripts/"
            ((MOVED_COUNT++))
        fi
    fi
done

echo ""
echo "=========================================="
echo -e "${GREEN}✅ 清理完成${NC}"
echo "=========================================="
echo ""
echo "统计:"
echo -e "  移动文件：${GREEN}$MOVED_COUNT${NC}"
echo -e "  跳过文件：${YELLOW}$SKIPPED_COUNT${NC}"
echo ""

if [ $SKIPPED_COUNT -gt 0 ]; then
    echo -e "${YELLOW}提示:${NC} 以下文件在根目录和目标目录都存在，可以手动删除根目录的副本:"
    echo ""
    
    for file in "${DOCS_FILES[@]}"; do
        if [ -f "$file" ] && [ -f "docs/$file" ]; then
            echo "  - $file"
        fi
    done
    
    for file in "${SCRIPT_FILES[@]}"; do
        if [ -f "$file" ] && [ -f "scripts/$file" ]; then
            echo "  - $file"
        fi
    done
    
    echo ""
    echo "如需自动删除这些重复文件，请运行:"
    echo "  ./scripts/cleanup-root.sh --force"
    echo ""
fi

echo "整理后的目录结构:"
echo "  docs/    - 部署文档"
echo "  scripts/ - 脚本文件"
echo ""
