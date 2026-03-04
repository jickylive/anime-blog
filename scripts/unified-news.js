require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');

// Determine AI provider from environment variable (defaults to 'gemini')
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';

// Load configurations based on provider
let config = {};
switch (AI_PROVIDER.toLowerCase()) {
    case 'gemini':
        config = {
            apiKey: process.env.GEMINI_API_KEY,
            proxyApiKey: process.env.PROXY_API_KEY,
            workerUrl: process.env.WORKER_URL,
            apiUrl: process.env.WORKER_URL ? 
                `${process.env.WORKER_URL}/google-ai-studio/v1beta/models/gemini-2.5-flash:generateContent` : 
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
            providerName: 'Gemini'
        };
        break;
    case 'azure':
        config = {
            apiKey: process.env.AZURE_OPENAI_KEY,
            endpoint: process.env.AZURE_OPENAI_ENDPOINT,
            deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
            apiUrl: process.env.AZURE_OPENAI_ENDPOINT ? 
                `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview` : 
                '',
            providerName: 'Azure OpenAI'
        };
        break;
    case 'openai':
        config = {
            apiKey: process.env.OPENAI_API_KEY,
            apiUrl: 'https://api.openai.com/v1/chat/completions',
            providerName: 'OpenAI'
        };
        break;
    default:
        console.error(`不支持的 AI 提供商: ${AI_PROVIDER}. 支持的选项: gemini, azure, openai`);
        process.exit(1);
}

// Validate required environment variables
function validateConfig() {
    const required = [];
    
    switch (AI_PROVIDER.toLowerCase()) {
        case 'gemini':
            required.push('GEMINI_API_KEY', 'PROXY_API_KEY', 'WORKER_URL');
            break;
        case 'azure':
            required.push('AZURE_OPENAI_KEY', 'AZURE_OPENAI_ENDPOINT', 'AZURE_OPENAI_DEPLOYMENT');
            break;
        case 'openai':
            required.push('OPENAI_API_KEY');
            break;
    }
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error(`❌ 错误：缺少必需的环境变量：${missing.join(', ')}`);
        console.error('请在 .env 文件中设置这些值');
        process.exit(1);
    }
    
    console.log(`✅ ${config.providerName} 环境变量验证通过`);
}

validateConfig();

// Hexo 项目的根目录
const HEXO_ROOT = path.resolve(__dirname);
// 文章要保存的目录
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
    const fallbackWords = ["本文由 AI 生成"]; // 备用词组

    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const config = JSON.parse(data);
            if (Array.isArray(config.geminiWords) && config.geminiWords.length > 0) {
                console.log('成功从 promotions.json 加载提升词。');
                return config.geminiWords;
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
 * 以 Promise 方式执行 Shell 命令
 * @param {string} command 要执行的命令
 */
function runCommand(command) {
    return new Promise((resolve, reject) => {
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
async function getGeminiNewsSummary(dateStr) {
    console.log(`正在调用 ${config.providerName} API 获取${dateStr}新闻摘要...`);
    
    const promotionWords = loadPromotionWordsFromFile();
    const selectedWord = promotionWords[Math.floor(Math.random() * promotionWords.length)];
    console.log(`本次使用的提升词: "${selectedWord}"`);

    const promptText = `你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。` +
                     `请用中文总结 ${dateStr} 今日的5条热点新闻摘要，每条新闻包含一个合适的标题和一段简短的描述（约100字）。` +
                     `简要介绍历史上的今天，增加文章的多样性。` +
                     `请直接返回 Markdown 格式的内容用于 Hexo 部署静态网站。` +
                     `在文章的末尾，请加上一句推广语：“${selectedWord}”。` +
                     `最后，在推广语后面新起一行，加上免责声明：以上内容由互联网 AI 生成，如有侵权请联系删除。`;

    try {
        const response = await axios.post(config.apiUrl, {
            contents: [{
                parts: [{
                    text: promptText
                }]
            }]
        }, { 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.proxyApiKey}`
            }
        });

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
            console.error('调用 API 失败:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('调用 API 失败:', error.message);
        }
        throw new Error('获取新闻失败');
    }
}

/**
 * 调用 Azure OpenAI 获取新闻摘要
 */
async function getAzureNewsSummary(dateStr) {
    console.log(`正在调用 ${config.providerName} API 获取${dateStr}新闻摘要...`);
    
    try {
        const response = await axios.post(
            config.apiUrl,
            {
                messages: [
                    {
                        role: "system",
                        content: "你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。"
                    },
                    {
                        role: "user",
                        content: `请用简洁、分点的 Markdown 风格整理 ${dateStr} 今日5条热点新闻，每条包含标题和100字左右描述。`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    'api-key': config.apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response) {
            console.error('Azure OpenAI API 错误:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Azure OpenAI API 错误:', error.message);
        }
        throw new Error('获取 Azure OpenAI 新闻失败');
    }
}

/**
 * 调用 OpenAI 获取新闻摘要
 */
async function getOpenAINewsSummary(dateStr) {
    console.log(`正在调用 ${config.providerName} API 获取${dateStr}新闻摘要...`);
    
    try {
        const response = await axios.post(
            config.apiUrl,
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。"
                    },
                    {
                        role: "user",
                        content: `请用简洁、分点的 Markdown 风格整理 ${dateStr} 今日5条热点新闻，每条包含标题和100字左右描述。`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response) {
            console.error('OpenAI API 错误:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('OpenAI API 错误:', error.message);
        }
        throw new Error('获取 OpenAI 新闻失败');
    }
}

/**
 * 获取新闻摘要（根据配置的提供商）
 */
async function getNewsSummary(dateStr) {
    switch (AI_PROVIDER.toLowerCase()) {
        case 'gemini':
            return await getGeminiNewsSummary(dateStr);
        case 'azure':
            return await getAzureNewsSummary(dateStr);
        case 'openai':
            return await getOpenAINewsSummary(dateStr);
        default:
            throw new Error(`不支持的 AI 提供商: ${AI_PROVIDER}`);
    }
}

/**
 * 创建并保存 Hexo 文章
 * @param {string} content Markdown 格式的新闻内容
 */
function createHexoPost(content, dateStr) {
    const now = new Date();
    const fullDateStr = `${dateStr} ${now.toTimeString().split(' ')[0]}`;
    const title = `${config.providerName} 整理今日热点新闻（${dateStr}）`;
    const fileName = `${dateStr}-${AI_PROVIDER.toLowerCase()}-news.md`;
    const filePath = path.join(POSTS_DIR, fileName);

    const frontMatter = `---\n` +
                        `title: ${title}\n` +
                        `date: ${fullDateStr}\n` +
                        `tags:\n` +
                        `  - ${config.providerName}News\n` +
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
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const newsContent = await getNewsSummary(dateStr);
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