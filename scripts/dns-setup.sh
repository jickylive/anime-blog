#!/bin/bash

# DNS 解析配置脚本 - blog.hxfund.cn
# 此脚本用于辅助配置 DNS 解析

set -e

echo "=========================================="
echo "blog.hxfund.cn DNS 解析配置指南"
echo "=========================================="
echo ""

# 检查 dig 命令
if ! command -v dig &> /dev/null; then
    echo "⚠️  dig 命令未安装，跳过 DNS 检查"
else
    echo "检查当前 DNS 解析..."
    echo ""
    
    # 检查 A 记录
    echo "1. 检查 A 记录:"
    dig blog.hxfund.cn A +short 2>&1 || echo "   未找到 A 记录"
    echo ""
    
    # 检查 CNAME 记录
    echo "2. 检查 CNAME 记录:"
    dig blog.hxfund.cn CNAME +short 2>&1 || echo "   未找到 CNAME 记录"
    echo ""
    
    # 检查 ESA 相关记录
    echo "3. 检查 ESA 相关记录:"
    dig hxfund.cn NS +short 2>&1 || echo "   未找到 NS 记录"
    echo ""
fi

echo "=========================================="
echo "DNS 配置方案"
echo "=========================================="
echo ""

echo "方案 A: CNAME 记录（推荐）"
echo "----------------------------------------"
echo "主机记录：blog"
echo "记录类型：CNAME"
echo "记录值：your-esa-domain.aliyuncs.com"
echo "TTL: 10 分钟"
echo ""

echo "方案 B: A 记录"
echo "----------------------------------------"
echo "主机记录：blog"
echo "记录类型：A"
echo "记录值：ESA 分配的 IP"
echo "TTL: 10 分钟"
echo ""

echo "方案 C: 虚拟主机"
echo "----------------------------------------"
echo "主机记录：blog"
echo "记录类型：CNAME"
echo "记录值：qxu1606470020.my3w.com"
echo "TTL: 10 分钟"
echo ""

echo "=========================================="
echo "配置步骤"
echo "=========================================="
echo ""

echo "1. 登录 DNS 控制台"
echo "   - 阿里云：https://dns.console.aliyun.com"
echo "   - 其他服务商：请访问相应控制台"
echo ""

echo "2. 添加 DNS 记录"
echo "   - 点击'添加记录'"
echo "   - 选择记录类型（CNAME 或 A）"
echo "   - 填写上述配置信息"
echo "   - 点击'确认'"
echo ""

echo "3. 等待生效"
echo "   - DNS 生效时间：10 分钟 - 48 小时"
echo "   - 可使用 dig 命令检查"
echo ""

echo "4. 验证配置"
echo "   dig blog.hxfund.cn"
echo ""

echo "=========================================="
echo "ESA 配置（如使用 ESA）"
echo "=========================================="
echo ""

echo "1. 登录 ESA 控制台"
echo "   https://esa.console.aliyuncs.com"
echo ""

echo "2. 添加加速域名"
echo "   - 域名：blog.hxfund.cn"
echo "   - 业务类型：静态加速"
echo "   - 源站类型：源站域名/IP"
echo "   - 源站地址：虚拟主机地址或服务器 IP"
echo ""

echo "3. 配置 HTTPS 证书"
echo "   - 上传 SSL 证书或使用免费证书"
echo "   - 开启 HTTPS 强制跳转"
echo ""

echo "4. 配置缓存规则"
echo "   - 静态文件缓存时间：1 个月"
echo "   - HTML 文件缓存时间：0"
echo ""

echo "=========================================="
echo "验证命令"
echo "=========================================="
echo ""

echo "# 检查 DNS 解析"
echo "dig blog.hxfund.cn"
echo ""

echo "# 检查网站访问"
echo "curl -I https://blog.hxfund.cn"
echo ""

echo "# 检查 CDN 状态"
echo "curl -I https://blog.hxfund.cn | grep -i via"
echo ""

echo "=========================================="
echo "完成！"
echo "=========================================="
