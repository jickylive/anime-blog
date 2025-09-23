@echo off
:: 设置项目路径
set PROJECT_PATH="e:\anime-blog-demo1"

:: 切换到项目根目录
cd /d %PROJECT_PATH%

:: 记录日志
echo [%date% %time%] Running daily news task... >> task.log

:: 1. 使用 node 执行新闻抓取脚本
node daily-news.js >> task.log 2>>&1

:: 2. 执行 hexo generate
echo [%date% %time%] Generating static files... >> task.log
hexo generate >> task.log 2>>&1

:: 3. 执行 hexo deploy
echo [%date% %time%] Deploying to website... >> task.log
hexo deploy >> task.log 2>>&1

echo [%date% %time%] Task finished. >> task.log
