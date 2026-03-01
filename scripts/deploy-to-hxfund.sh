#!/bin/bash
# Hexo 博客部署脚本 - 部署到 www.hxfund.cn/blog/
# 用法：./scripts/deploy-to-hxfund.sh

set -e

echo "🚀 开始部署 Hexo 博客到 www.hxfund.cn/blog/"

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 检查必要的环境变量
check_env() {
    local missing=0
    for var in "$@"; do
        if [ -z "${!var}" ]; then
            echo "❌ 缺少环境变量: $var"
            missing=1
        fi
    done
    if [ $missing -eq 1 ]; then
        echo "💡 请检查 .env 文件配置"
        exit 1
    fi
}

check_env FTP_HOST FTP_USER FTP_PASS

# 生成静态文件
echo "📦 生成 Hexo 静态文件..."
npx hexo clean
npx hexo generate

# 使用 lftp 部署（推荐，支持断点续传）
if command -v lftp &> /dev/null; then
    echo "📤 使用 lftp 部署到虚拟主机..."
    lftp -c "set ftp:ssl-allow no; \
             open -u $FTP_USER,$FTP_PASS $FTP_HOST; \
             cd /htdocs/public/blog; \
             mirror --reverse --delete --only-newer ../public/; \
             bye"
else
    # 使用 curl 部署
    echo "📤 使用 curl 部署到虚拟主机..."
    
    # 遍历 public 目录并上传文件
    find public -type f | while read file; do
        remote_path="/htdocs/public/blog/${file#public/}"
        echo "  📁 上传：$remote_path"
        curl -T "$file" "ftp://$FTP_HOST$remote_path" \
             -u "$FTP_USER:$FTP_PASS" \
             --create-dirs \
             --silent \
             --retry 3
    done
fi

echo "✅ 部署完成！"
echo "🌐 访问地址：https://www.hxfund.cn/blog/"
