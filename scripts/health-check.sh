#!/bin/bash

# Hexo 博客健康检查脚本
# 使用方法：./scripts/health-check.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "  Hexo 博客健康检查"
echo "=========================================="
echo ""

cd "$PROJECT_ROOT"

# 检查 Node.js 版本
echo -n "Node.js 版本: "
NODE_VERSION=$(node -v)
if [[ $NODE_VERSION == v18* ]] || [[ $NODE_VERSION == v20* ]]; then
    echo -e "${GREEN}$NODE_VERSION${NC} ✅"
else
    echo -e "${YELLOW}$NODE_VERSION${NC} ⚠️  建议使用 v18 或 v20"
fi

# 检查 npm 版本
echo -n "npm 版本：   "
npm -v
echo ""

# 检查 .env 文件
echo "检查配置文件..."
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env 文件不存在${NC}"
    echo "   请复制 .env.example 为 .env 并填入配置"
    exit 1
else
    echo -e "${GREEN}✅ .env 文件存在${NC}"
fi

# 检查必需文件
echo ""
echo "检查必需文件..."
REQUIRED_FILES=("_config.yml" "package.json" "themes/defaultone/_config.yml")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ $file 不存在${NC}"
        exit 1
    else
        echo -e "${GREEN}✅${NC} $file"
    fi
done

# 检查主题版本
echo ""
echo "检查主题版本..."
if [ -d "themes/defaultone/.git" ]; then
    cd themes/defaultone
    THEME_VERSION=$(git describe --tags 2>/dev/null || echo "unknown")
    echo -e "主题版本：${YELLOW}$THEME_VERSION${NC}"
    cd "$PROJECT_ROOT"
else
    echo -e "${YELLOW}⚠️  主题不是 git 仓库${NC}"
fi

# 检查 npm 依赖
echo ""
echo "检查 npm 依赖..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules 不存在，运行 npm install 安装依赖${NC}"
    # npm install
else
    VULN_COUNT=$(npm audit 2>&1 | grep -c "vulnerabilities" || echo "0")
    if [ "$VULN_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  发现安全漏洞，运行 npm audit fix 修复${NC}"
    else
        echo -e "${GREEN}✅ 依赖状态良好${NC}"
    fi
fi

# 检查 git 状态
echo ""
echo "检查 Git 状态..."
if git status --porcelain | grep -q "modified"; then
    echo -e "${YELLOW}⚠️  有未提交的修改${NC}"
    git status --short | head -5
else
    echo -e "${GREEN}✅ Git 工作区干净${NC}"
fi

# 检查 public 目录
echo ""
echo "检查生成文件..."
if [ ! -d "public" ]; then
    echo -e "${YELLOW}⚠️  public 目录不存在，运行 hexo generate 生成${NC}"
else
    FILE_COUNT=$(find public -type f | wc -l)
    echo -e "${GREEN}✅${NC} public 目录有 $FILE_COUNT 个文件"
fi

# 检查磁盘空间
echo ""
echo "检查磁盘空间..."
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}')
echo -e "磁盘使用率：${YELLOW}$DISK_USAGE${NC}"

# 总结
echo ""
echo "=========================================="
echo -e "${GREEN}✅ 健康检查完成${NC}"
echo "=========================================="
echo ""
echo "建议操作:"
echo "  1. 运行 'npm install' 安装依赖"
echo "  2. 运行 'npm audit fix' 修复安全漏洞"
echo "  3. 运行 'hexo clean && hexo generate' 重新生成"
echo ""
