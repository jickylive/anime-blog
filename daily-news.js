// daily-news.js

// 移除 dotenv 的自动加载，让我们可以控制加载时机

// require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');

// --- 用户配置 ---
// 优先读取环境变量中的 GEMINI_API_KEY
let  GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let  PROXY_API_KEY = process.env.PROXY_API_KEY;

// 如果 GEMINI_API_KEY 在环境变量中未找到，则尝试从 .env 文件加载
if (!GEMINI_API_KEY) {
    // 只有当没有设置环境变量时，才去加载 .env 文件
    require('dotenv').config(); 
    GEMINI_API_KEY = process.env.GEMINI_API_KEY; // 重新尝试从加载后的环境变量中读取
    PROXY_API_KEY = process.env.PROXY_API_KEY;   // 重新尝试从加载后的环境变量中读取
}

// 检查 API Key 是否设置
if (!GEMINI_API_KEY) {
    console.error('错误：未检测到 GEMINI_API_KEY。请在流水线环境变量或 .env 文件中设置该值。');
    process.exit(1); // 退出脚本
}
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${GEMINI_API_KEY}`;

// Hexo 项目的根目录
const HEXO_ROOT = __dirname;
// 文章要保存的目录
const POSTS_DIR = path.join(HEXO_ROOT, 'source', '_posts');

/**
 * 以 Promise 方式执行 Shell 命令
 * @param {string} command 要执行的命令
 */
function runCommand(command) {
    return new Promise((resolve, reject) => {
        // 在项目根目录执行命令
        exec(command, { cwd: HEXO_ROOT }, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行命令时出错: ${command}\n${stderr}`);
                return reject(error);
            }
            console.log(stdout);
            resolve(stdout);
        });
    });
}

/**
 * 调用 Gemini API 获取新闻摘要
 */
async function getNewsSummary(dateStr) {// 接受 dateStr 作为参数
    // 不再在函数内部计算日期
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = (now.getMonth() + 1).toString().padStart(2, '0');
    // const day = now.getDate().toString().padStart(2, '0');    
    // const dateStr = `${year}-${month}-${day}`;

    console.log(`正在调用 Gemini API 获取${dateStr}新闻摘要...`);
    try {
        const response = await axios.post(GEMINI_API_URL, {
            contents: [{
                parts: [{
                    text: `你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。` + 
                    `请用中文总结${dateStr}今日的5条热点新闻摘要，每条新闻包含一个合适的标题和一段简短的描述（约100字）。` +
                    `请直接返回 Markdown 格式的内容用于hexo部署静态网站。` + 
                    `文尾加入免责声明：以上内容互联网AI生成，如有侵权请联系删除。`
                }]
            }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const content = response.data.candidates[0].content.parts[0].text;
        console.log('成功获取新闻摘要。');
        return content;

    } catch (error) {
        if (error.response) {
            console.error('调用 Gemini API 失败:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('调用 Gemini API 失败:', error.message);
        }
        throw new Error('获取新闻失败');
    }
}

/**
 * 创建并保存 Hexo 文章
 * @param {string} content Markdown 格式的新闻内容
 */
function createHexoPost(content, dateStr) {// 接受 dateStr 作为参数
    const now = new Date();
    // 不再在函数内部计算日期
    // const year = now.getFullYear();
    // const month = (now.getMonth() + 1).toString().padStart(2, '0');
    // const day = now.getDate().toString().padStart(2, '0');    
    // const dateStr = `${year}-${month}-${day}`;

    const fullDateStr = `${dateStr} ${now.toTimeString().split(' ')[0]}`;

    const title = `今日热点新闻（${dateStr}）`;
    const fileName = `${dateStr}-daily-news.md`;
    const filePath = path.join(POSTS_DIR, fileName);

    const frontMatter = `---\n` +
            `title: ${title}\n` +
            `date: ${fullDateStr}\n` +
            `tags:\n` +
            `  - DailyNews\n` +
            `  - Automation\n` +
            `---\n\n`;

    const fileContent = frontMatter + content;
    fs.writeFileSync(filePath, fileContent);
    console.log(`成功创建新的 Hexo 文章: ${filePath}`);
}

/**
 * 主函数
 */
async function main() {
    try {
        // ======================= 在 main 中计算一次日期 =======================
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        // ====================================================================

        const newsContent = await getNewsSummary(dateStr);
        createHexoPost(newsContent,dateStr);

        // console.log('\n--- 开始构建静态文件 ---');
        // await runCommand('npx hexo generate');
        
        // console.log('\n--- 开始部署网站 ---');
        // // await runCommand('hexo deploy');

        console.log('\n--- 任务成功完成 ---');

    } catch (error) {
        console.error('\n--- 任务执行失败 ---');
        console.error(error.message);
        // 退出进程并返回错误码，方便自动化脚本识别
        process.exit(1); 
    }
}

main();
