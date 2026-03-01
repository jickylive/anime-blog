#!/bin/bash

# Hexo 博客部署脚本
# 使用方法：./deploy.sh

set -e

echo "=========================================="
echo "Hexo 博客部署脚本"
echo "=========================================="
echo ""

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件，正在创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑填入 FTP 密码"
    echo ""
    echo "然后重新运行：$0"
    exit 1
fi

# 检查 _config.deploy.yml 文件
if [ ! -f "_config.deploy.yml" ]; then
    echo "⚠️  未找到 _config.deploy.yml 文件，正在创建..."
    echo "deploy:" > _config.deploy.yml
    echo "  type: ftpsync" >> _config.deploy.yml
    echo "  host: \${FTP_HOST}" >> _config.deploy.yml
    echo "  user: \${FTP_USER}" >> _config.deploy.yml
    echo "  pass: \${FTP_PASSWORD}" >> _config.deploy.yml
    echo "  remote: /htdocs/public" >> _config.deploy.yml
    echo "  port: 21" >> _config.deploy.yml
    echo "  clear: false" >> _config.deploy.yml
    echo "  verbose: true" >> _config.deploy.yml
    echo "✅ 已创建 _config.deploy.yml 文件"
fi

# 安装依赖
echo "[1/4] 安装依赖..."
npm install

# 清理
echo "[2/4] 清理缓存..."
npx hexo clean

# 生成
echo "[3/4] 生成静态文件..."
npx hexo generate

# 部署
echo "[4/4] 部署到服务器..."
npx hexo deploy

echo ""
echo "=========================================="
echo "✅ 部署完成!"
echo "=========================================="
