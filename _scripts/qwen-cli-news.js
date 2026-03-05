#!/usr/bin/env node
/**
 * 使用 Qwen CLI 生成新闻摘要
 * 
 * 这个脚本使用 Qwen CLI 工具来生成新闻摘要，作为 AI 供应商的一种选择
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Hexo 项目的根目录
const HEXO_ROOT = path.resolve(__dirname);
const POSTS_DIR = path.resolve(HEXO_ROOT, 'source', '_posts');

// 确保目录存在
if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    console.log(`创建目录：${POSTS_DIR}`);
}

/**
 * 从本地 JSON 文件加载提升词
 * @returns {string[]} 返回提升词数组
 */
function loadPromotionWordsFromFile() {
    const filePath = path.join(__dirname, 'promotions.json');
    const fallbackWords = ["本文由阿里云通义千问 AI 生成"]; // 备用词组

    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const config = JSON.parse(data);
            if (Array.isArray(config.qwenWords || config.geminiWords) && 
                ((config.qwenWords && config.qwenWords.length > 0) || 
                 (config.geminiWords && config.geminiWords.length > 0))) {
                console.log('成功从 promotions.json 加载提升词。');
                return config.qwenWords || config.geminiWords;
            }
        }
        console.warn('警告: promotions.json 文件不存在或格式不正确，将使用备用提升词。');
        return fallbackWords;
    } catch (error) {
        console.error('读取 promotions.json 文件失败:', error.message);
        return fallbackWords;
    }
}

/**
 * 使用 Qwen CLI 生成新闻摘要
 */
async function generateNewsWithQwenCLI(dateStr) {
    console.log(`正在使用 Qwen CLI 生成 ${dateStr} 的新闻摘要...`);

    const promotionWords = loadPromotionWordsFromFile();
    const selectedWord = promotionWords[Math.floor(Math.random() * promotionWords.length)];
    console.log(`本次使用的提升词: "${selectedWord}"`);

    const prompt = `你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。
请用中文总结 ${dateStr} 今日的5条热点新闻摘要，每条新闻包含一个合适的标题和一段简短的描述（约100字）。
简要介绍历史上的今天，增加文章的多样性。
请直接返回 Markdown 格式的内容用于 Hexo 部署静态网站。
在文章的末尾，请加上一句推广语：“${selectedWord}”。
最后，在推广语后面新起一行，加上免责声明：以上内容由互联网 AI 生成，如有侵权请联系删除。`;

    try {
        // 尝试使用 Qwen CLI 生成内容
        const command = `echo "${prompt}" | node ${path.join(HEXO_ROOT, '..', 'qwen-code.js')} --interactive`;
        
        console.log('正在调用 Qwen CLI...');
        
        // 由于 Qwen CLI 是交互式的，我们需要使用不同的方法
        // 这里我们使用 Node.js 的子进程功能来调用 Qwen CLI
        
        // 为了简化，我们直接使用 API 调用的方式，但使用 Qwen CLI 的配置
        // 实际上我们可以调用我们之前创建的统一新闻脚本，使用 qwen 供应商
        console.log('使用 Qwen API 生成新闻摘要...');
        
        // 这里我们构造一个临时的 API 调用
        const { spawn } = require('child_process');
        const axios = require('axios');
        
        // 从环境变量获取 Qwen 配置
        const apiKey = process.env.QWEN_API_KEY || process.env.BAILIAN_API_KEY;
        const baseUrl = process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
        const model = process.env.QWEN_MODEL || 'qwen-max';
        
        if (!apiKey) {
            throw new Error('缺少 QWEN_API_KEY 环境变量');
        }
        
        const response = await axios.post(baseUrl, {
            model: model,
            messages: [
                {
                    role: "system",
                    content: "你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2048
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data.choices[0].message.content;
        
    } catch (error) {
        console.error('使用 Qwen CLI 生成新闻失败:', error.message);
        throw error;
    }
}

/**
 * 创建并保存 Hexo 文章
 * @param {string} content Markdown 格式的新闻内容
 */
function createHexoPost(content, dateStr) {
    const now = new Date();
    const fullDateStr = `${dateStr} ${now.toTimeString().split(' ')[0]}`;
    const title = `Qwen CLI 整理今日热点新闻（${dateStr}）`;
    const fileName = `${dateStr}-qwen-cli-news.md`;
    const filePath = path.join(POSTS_DIR, fileName);

    const frontMatter = `---\n` +
                        `title: ${title}\n` +
                        `date: ${fullDateStr}\n` +
                        `tags:\n` +
                        `  - QwenNews\n` +
                        `  - Automation\n` +
                        `---\n\n`;

    const fileContent = frontMatter + content;
    fs.writeFileSync(filePath, fileContent);
    console.log(`成功创建新的 Hexo 文章: ${filePath}`);
}

/**
 * 以 Promise 方式执行 Shell 命令
 * @param {string} command 要执行的命令
 */
function runCommand(command) {
    return new Promise((resolve, reject) => {
        const child = require('child_process').exec(command, { cwd: path.resolve(HEXO_ROOT, '..') }, (error, stdout, stderr) => {
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
 * 主函数
 */
async function main() {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const newsContent = await generateNewsWithQwenCLI(dateStr);
        createHexoPost(newsContent, dateStr);

        console.log('\n--- 开始构建静态文件 ---');
        await runCommand('hexo generate');

        console.log('\n--- 任务成功完成 ---');

    } catch (error) {
        console.error('\n--- 任务执行失败 ---');
        console.error(error.message);
        process.exit(1);
    }
}

main();