/**
 * 每日新闻生成器 - 支持多种 AI 供应商
 *
 * 调用多种 AI 服务生成每日新闻博客文章
 * 支持：Qwen, Gemini, Azure OpenAI, OpenAI
 * 使用方法：
 *   node scripts/daily-news-qwen.js
 *   node scripts/daily-news-qwen.js --topic "科技新闻" --provider qwen
 *
 * 依赖：
 *   - 配置相应 AI 服务的 API Key
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');
const { exec } = require('child_process');

// ============================================
// 配置管理
// ============================================

const HEXO_ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(HEXO_ROOT, 'source', '_posts');

// Determine AI provider from environment variable or command line (defaults to 'qwen')
let AI_PROVIDER = process.env.AI_PROVIDER || 'qwen';

// hxfund Qwen API 配置
const QWEN_API_CONFIG = {
  baseURL: process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  model: process.env.QWEN_MODEL || 'qwen-max',
  temperature: 0.7,
  systemPrompt: `你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。
请用中文总结今日的5条热点新闻摘要，每条新闻包含一个合适的标题和一段简短的描述（约100字）。
简要介绍历史上的今天，增加文章的多样性。
请直接返回 Markdown 格式的内容用于 Hexo 部署静态网站。
在文章的末尾，请加上一句推广语："本文由 AI 生成"。
最后，在推广语后面新起一行，加上免责声明：以上内容由互联网 AI 生成，如有侵权请联系删除。`
};

// Google Gemini API 配置
const GEMINI_API_CONFIG = {
  baseURL: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
  model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  temperature: 0.7,
  systemPrompt: `你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。`
};

// Azure OpenAI 配置
const AZURE_API_CONFIG = {
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
  model: process.env.AZURE_OPENAI_MODEL || 'gpt-4',
  temperature: 0.7,
  systemPrompt: `你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。`
};

// OpenAI 配置
const OPENAI_API_CONFIG = {
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  temperature: 0.7,
  systemPrompt: `你是一个专业的中文新闻摘要助手，善于用简洁、分点的 Markdown 风格整理信息。`
};

// ============================================
// 工具函数
// ============================================

function loadConfig() {
  // 根据 AI_PROVIDER 返回相应的配置
  switch (AI_PROVIDER.toLowerCase()) {
    case 'qwen':
      return {
        ...QWEN_API_CONFIG,
        apiKey: process.env.QWEN_API_KEY || process.env.BAILIAN_API_KEY,
        providerName: 'Qwen'
      };
    case 'gemini':
      return {
        ...GEMINI_API_CONFIG,
        apiKey: process.env.GEMINI_API_KEY,
        apiUrl: `${GEMINI_API_CONFIG.baseURL}/models/${GEMINI_API_CONFIG.model}:generateContent`,
        providerName: 'Gemini'
      };
    case 'azure':
      return {
        ...AZURE_API_CONFIG,
        apiKey: process.env.AZURE_OPENAI_KEY,
        apiUrl: `${AZURE_API_CONFIG.baseURL}openai/deployments/${AZURE_API_CONFIG.deployment}/chat/completions?api-version=2024-02-15-preview`,
        providerName: 'Azure OpenAI'
      };
    case 'openai':
      return {
        ...OPENAI_API_CONFIG,
        apiKey: process.env.OPENAI_API_KEY,
        apiUrl: `${OPENAI_API_CONFIG.baseURL}/chat/completions`,
        providerName: 'OpenAI'
      };
    default:
      console.error(`不支持的 AI 提供商: ${AI_PROVIDER}. 支持的选项: qwen, gemini, azure, openai`);
      process.exit(1);
  }
}

function validateConfig(config) {
  const required = [];
  
  switch (AI_PROVIDER.toLowerCase()) {
    case 'qwen':
      required.push('QWEN_API_KEY');
      break;
    case 'gemini':
      required.push('GEMINI_API_KEY');
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

function getTodayDate() {
  const now = new Date();
  return {
    dateStr: now.toISOString().split('T')[0],
    dateTime: now.toISOString().replace('T', ' ').substring(0, 19),
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    weekday: ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]
  };
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: HEXO_ROOT }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout);
    });
  });
}

async function callAIProvider(config, prompt) {
  const messages = [
    { role: 'system', content: config.systemPrompt },
    { role: 'user', content: prompt }
  ];

  switch (AI_PROVIDER.toLowerCase()) {
    case 'qwen':
      return await callQwenAPI(config, messages);
    case 'gemini':
      return await callGeminiAPI(config, prompt); // Gemini uses text instead of messages
    case 'azure':
      return await callAzureAPI(config, messages);
    case 'openai':
      return await callOpenAIAPI(config, messages);
    default:
      throw new Error(`不支持的 AI 提供商: ${AI_PROVIDER}`);
  }
}

async function callQwenAPI(config, messages) {
  try {
    const response = await axios.post(
      config.baseURL + '/chat/completions',
      {
        model: config.model,
        messages: messages,
        temperature: config.temperature,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    return {
      content: response.data.choices[0].message.content,
      usage: response.data.usage || {}
    };
  } catch (error) {
    throw new Error(`Qwen API 调用失败: ${error.message}`);
  }
}

async function callGeminiAPI(config, prompt) {
  try {
    const response = await axios.post(
      config.apiUrl,
      {
        contents: [{
          parts: [{
            text: config.systemPrompt + "\n\n" + prompt
          }]
        }],
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: 2048
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: config.apiKey
        },
        timeout: 60000
      }
    );

    if (response.data.candidates && response.data.candidates.length > 0) {
      return {
        content: response.data.candidates[0].content.parts[0].text,
        usage: response.data.usageMetadata || {}
      };
    } else {
      throw new Error('Gemini API 返回格式异常');
    }
  } catch (error) {
    throw new Error(`Gemini API 调用失败: ${error.message}`);
  }
}

async function callAzureAPI(config, messages) {
  try {
    const response = await axios.post(
      config.apiUrl,
      {
        model: config.model,
        messages: messages,
        temperature: config.temperature,
        max_tokens: 2048
      },
      {
        headers: {
          'api-key': config.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    return {
      content: response.data.choices[0].message.content,
      usage: response.data.usage || {}
    };
  } catch (error) {
    throw new Error(`Azure OpenAI API 调用失败: ${error.message}`);
  }
}

async function callOpenAIAPI(config, messages) {
  try {
    const response = await axios.post(
      config.apiUrl,
      {
        model: config.model,
        messages: messages,
        temperature: config.temperature,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    return {
      content: response.data.choices[0].message.content,
      usage: response.data.usage || {}
    };
  } catch (error) {
    throw new Error(`OpenAI API 调用失败: ${error.message}`);
  }
}

// ============================================
// 主功能
// ============================================

async function generateDailyNews(topic = null) {
  console.log('\n' + '═'.repeat(60));
  console.log(`  每日新闻生成器 - 使用 ${AI_PROVIDER.toUpperCase()} AI`);
  console.log('═'.repeat(60) + '\n');

  const config = loadConfig();
  validateConfig(config);
  
  const dateInfo = getTodayDate();

  // 构建提示词
  const dateStr = `${dateInfo.year}年${dateInfo.month}月${dateInfo.day}日 星期${dateInfo.weekday}`;

  let prompt = `请生成${dateStr}的每日新闻摘要文章。`;

  if (topic) {
    prompt += `\n\n主题聚焦：${topic}`;
    prompt += `\n\n请围绕"${topic}"这个主题，整理和生成相关的新闻内容。`;
  } else {
    prompt += `\n\n请涵盖以下领域的新闻：`;
    prompt += `\n- 科技前沿（AI、区块链、量子计算等）`;
    prompt += `\n- 互联网行业动态`;
    prompt += `\n- 开源项目和技术更新`;
    prompt += `\n- 数码产品发布`;
    prompt += `\n- 其他值得关注的技术新闻`;
  }

  prompt += `\n\n要求：
- 文章标题格式：【每日新闻】${dateInfo.year}-${dateInfo.month}-${dateInfo.day} + 主题
- 包含 3-5 条主要新闻
- 每条新闻简要说明核心内容
- 保持客观、准确的报道风格`;

  console.log('📅 生成日期:', dateStr);
  console.log('🎯 主题:', topic || '综合科技新闻');
  console.log(`🤖 调用 ${config.providerName} AI 生成内容...\n`);

  try {
    // 调用 AI 服务
    const result = await callAIProvider(config, prompt);

    console.log('✅ AI 生成完成');
    console.log(`📊 Token 用量：${result.usage?.total_tokens || 0}`);
    console.log(`📝 内容长度：${result.content.length} 字符\n`);

    // 解析 Front-matter 和正文
    const frontMatterMatch = result.content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    let frontMatter = '';
    let content = '';

    if (frontMatterMatch) {
      frontMatter = frontMatterMatch[1];
      content = frontMatterMatch[2];
    } else {
      // 如果没有 Front-matter，生成默认格式
      const title = `【每日新闻】${dateInfo.year}-${dateInfo.month}-${dateInfo.day}`;
      frontMatter = `title: "${title}"
date: ${dateInfo.dateTime}
tags: [每日新闻，科技，AI 生成]
categories: [每日新闻]`;
      content = result.content;
    }

    // 确保目录存在
    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
      console.log(`📁 创建目录：${POSTS_DIR}`);
    }

    // 生成文件名
    const fileName = `daily-news-${dateInfo.dateStr}-${AI_PROVIDER.toLowerCase()}.md`;
    const filePath = path.join(POSTS_DIR, fileName);

    // 写入文件
    const fileContent = `---
${frontMatter}
---

${content}

---
*本文内容由 ${config.providerName} AI 辅助生成，仅供参考。*
`;

    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`✅ 文章已保存：${filePath}`);

    // 显示生成的文章预览
    console.log('\n' + '═'.repeat(60));
    console.log('  文章预览 (前 500 字符)');
    console.log('═'.repeat(60) + '\n');
    console.log(content.substring(0, 500) + '...\n');

    return { filePath, content };

  } catch (error) {
    console.error('❌ 生成失败:', error.message);
    process.exit(1);
  }
}

// ============================================
// 命令行参数处理
// ============================================

function parseArgs() {
  const args = process.argv.slice(2);
  let topic = null;
  let provider = null;
  let showHelp = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-h' || args[i] === '--help') {
      showHelp = true;
    } else if (args[i] === '-t' || args[i] === '--topic') {
      topic = args[++i];
    } else if (args[i] === '--provider' || args[i] === '-p') {
      provider = args[++i];
    } else if (!args[i].startsWith('-')) {
      if (!topic) topic = args[i];
    }
  }

  if (provider) {
    AI_PROVIDER = provider.toLowerCase();
  }

  return { showHelp, topic, provider };
}

function printHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         每日新闻生成器 - 支持多种 AI 供应商               ║
╚═══════════════════════════════════════════════════════════╝

用法：node scripts/daily-news-qwen.js [选项] [主题]

选项:
  -h, --help              显示帮助信息
  -t, --topic <主题>      指定新闻主题
  -p, --provider <供应商> 指定 AI 供应商 (qwen, gemini, azure, openai)
                          (默认: qwen)

示例:
  node scripts/daily-news-qwen.js
  node scripts/daily-news-qwen.js "AI 技术发展"
  node scripts/daily-news-qwen.js -t "开源动态"
  node scripts/daily-news-qwen.js --provider gemini
  node scripts/daily-news-qwen.js -p qwen -t "云计算新闻"

前置条件:
  根据使用的 AI 供应商配置相应的 API Key:
  - Qwen: 配置 QWEN_API_KEY
  - Gemini: 配置 GEMINI_API_KEY
  - Azure: 配置 AZURE_OPENAI_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT
  - OpenAI: 配置 OPENAI_API_KEY

输出:
  文章保存到：source/_posts/daily-news-YYYY-MM-DD-[provider].md
`);
}

// ============================================
// 主程序
// ============================================

async function main() {
  const { showHelp, topic } = parseArgs();

  if (showHelp) {
    printHelp();
    return;
  }

  await generateDailyNews(topic);
}

// 只在直接执行时运行，而不是被 require 时
if (require.main === module) {
  main().catch((error) => {
    console.error('程序错误:', error.message);
    process.exit(1);
  });
}
