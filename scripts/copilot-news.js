require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Azure OpenAI 配置
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;

const POSTS_DIR = path.join(__dirname, 'source', '_posts');

/**
 * 调用 Azure OpenAI 获取整理后的新闻摘要
 */
async function getAzureOpenAINewsSummary() {
    // 检查环境变量
    if (!AZURE_OPENAI_KEY || !AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_DEPLOYMENT) {
        console.error('请设置 AZURE_OPENAI_KEY、AZURE_OPENAI_ENDPOINT 和 AZURE_OPENAI_DEPLOYMENT 环境变量。');
        throw new Error('Azure OpenAI 环境变量未设置');
    }

    console.log('正在调用 Azure OpenAI 整理新闻...');
    try {
        const url = `${AZURE_OPENAI_ENDPOINT}openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-15-preview`;
        const response = await axios.post(
            url,
            {
                messages: [
                    {
                        role: "system",
                        content: "你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。"
                    },
                    {
                        role: "user",
                        content: "请用简洁、分点的 Markdown 风格整理今日5条热点新闻，每条包含标题和100字左右描述，风格参考 GitHub Copilot 整理的技术文档。"
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    'api-key': AZURE_OPENAI_KEY,
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
 * 创建 Hexo 文章
 */
function createHexoPost(content) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const fullDateStr = `${dateStr} ${now.toTimeString().split(' ')[0]}`;
    const title = `Copilot 整理今日热点新闻（${dateStr}）`;
    const fileName = `${dateStr}-copilot-news.md`;
    const filePath = path.join(POSTS_DIR, fileName);

    const frontMatter = `---\ntitle: ${title}\ndate: ${fullDateStr}\ntags:\n  - CopilotNews\n  - Automation\n---\n\n`;
    fs.writeFileSync(filePath, frontMatter + content);
    console.log(`已创建: ${filePath}`);
}

/**
 * 主流程
 */
async function main() {
    try {
        const news = await getAzureOpenAINewsSummary();
        createHexoPost(news);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}

main();