// daily-news.js
// 环境变量加载优化版本

// 统一在文件开头加载一次 .env
require('dotenv').config({ override: true, path: path.join(__dirname, '.env') });

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');

// --- 环境变量配置 ---
// 统一从环境变量读取（已在上一步加载 .env 文件）
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PROXY_API_KEY = process.env.PROXY_API_KEY;
const WORKER_URL = process.env.WORKER_URL;

// 配置验证
function validateEnv() {
    const required = ['GEMINI_API_KEY', 'PROXY_API_KEY', 'WORKER_URL'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error(`❌ 错误：缺少必需的环境变量：${missing.join(', ')}`);
        console.error('请在 .env 文件中设置这些值');
        process.exit(1);
    }
    
    console.log('✅ 环境变量验证通过');
}

// 执行验证
validateEnv();

// 设置 API URL 和请求头
const GEMINI_API_URL = `${WORKER_URL}/google-ai-studio/v1beta/models/gemini-2.5-flash:generateContent`;
const requestHeaders = {
    'Authorization': `Bearer ${PROXY_API_KEY}`,
    'Content-Type': 'application/json'
};

console.log(`将通过 Cloudflare 代理调用 Gemini API`);

// Hexo 项目的根目录
const HEXO_ROOT = path.resolve(__dirname);
// 文章要保存的目录
const POSTS_DIR = path.resolve(HEXO_ROOT, 'source', '_posts');

// 确保目录存在
if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    console.log(`创建目录：${POSTS_DIR}`);
}

// --- 新增代码开始 ---
/**
 * 从本地 JSON 文件加载提升词
 * @returns {string[]} 返回提升词数组
 */
function loadPromotionWordsFromFile() {
    const filePath = path.join(__dirname, 'promotions.json');
    const fallbackWords = ["本文由 Google Gemini AI 生成"]; // 备用词组

    try {
        // 使用同步读取，因为这是脚本启动时的初始化步骤，简单明了
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const config = JSON.parse(data);
            // 确保 geminiWords 存在且是一个非空数组
            if (Array.isArray(config.geminiWords) && config.geminiWords.length > 0) {
                console.log('成功从 promotions.json 加载提升词。');
                return config.geminiWords;
            }
        }
        console.warn('警告: promotions.json 文件不存在或格式不正确，将使用备用提升词。');
        return fallbackWords;
    } catch (error) {
        console.error('读取 promotions.json 文件失败:', error.message);
        return fallbackWords; // 出错时返回备用词组
    }
}
// --- 新增代码结束 ---

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
    // --- 修改点：加载并随机选择一个提升词 ---
    const promotionWords = loadPromotionWordsFromFile();
    const selectedWord = promotionWords[Math.floor(Math.random() * promotionWords.length)];
    console.log(`本次使用的提升词: "${selectedWord}"`);

    // --- 修改点：将提升词注入到 Prompt 中 ---    
    const promptText = `你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。` + 
                     `请用中文总结 ${dateStr} 今日的5条热点新闻摘要，每条新闻包含一个合适的标题和一段简短的描述（约100字）。` +
                     `简要介绍历史上的今天，增加文章的多样性。` +
                     `请直接返回 Markdown 格式的内容用于 Hexo 部署静态网站。` +
                     `在文章的末尾，请加上一句推广语：“${selectedWord}”。` + // 注入动态提升词
                     `最后，在推广语后面新起一行，加上免责声明：以上内容由互联网 AI 生成，如有侵权请联系删除。`;
    
    try {
        const response = await axios.post(GEMINI_API_URL, {
            contents: [{
                parts: [{
                    text: promptText // 使用包含提升词的新 Prompt
                }]
            }]
        }, { headers: requestHeaders
        });

        // Gemini API 响应的数据结构可能略有不同，特别是通过代理时。确保路径正确。
        // 根据您使用的代理实现，路径可能为 response.data.candidates[0]...
        // 或者如果代理直接透传，则路径不变。以下是标准路径。
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const content = response.data.candidates[0].content.parts[0].text;
            console.log('成功获取新闻摘要。');
            return content;
        } else {
            console.error('API 返回了非预期的格式:', JSON.stringify(response.data, null, 2));
            throw new Error('获取新闻内容失败，API 响应格式不正确。');
        }

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

// 只在直接执行时运行，而不是被 require 时
if (require.main === module) {
  main();
}
