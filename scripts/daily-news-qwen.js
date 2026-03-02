/**
 * 每日新闻生成器 - 使用 hxfund Qwen AI
 *
 * 调用 hxfund 后端的 Qwen AI API 生成每日新闻博客文章
 * 使用方法：
 *   node scripts/daily-news-qwen.js
 *   node scripts/daily-news-qwen.js --topic "科技新闻"
 *
 * 依赖：
 *   - hxfund 后端 API 运行中
 *   - 配置 Qwen API Key (在 ~/.qwen-code/config.json)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

// ============================================
// 配置管理
// ============================================

const HEXO_ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(HEXO_ROOT, 'source', '_posts');
const CONFIG_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.qwen-code', 'config.json');

// hxfund Qwen API 配置
const QWEN_API_CONFIG = {
  baseURL: 'https://coding.dashscope.aliyuncs.com/v1',
  model: 'qwen3.5-plus',
  temperature: 0.7,
  systemPrompt: `你是一个专业的科技新闻编辑，负责为 Hexo 博客生成每日新闻摘要文章。

你的任务：
1. 根据用户提供的主题或关键词，生成一篇 800-1500 字的新闻摘要文章
2. 文章格式符合 Hexo博客文章规范，包含 Front-matter
3. 语言风格：专业但不失亲和力，适合技术博客读者
4. 结构清晰：包含标题、引言、正文（分小节）、总结
5. 在文章末尾添加 "本文由阿里云通义千问 AI 辅助生成" 的说明

文章 Front-matter 格式：
---
title: "文章标题"
date: YYYY-MM-DD HH:MM:SS
tags: [标签 1, 标签 2, 标签 3]
categories: [分类名称]
---

注意：
- 标题要吸引人但不过度夸张
-  tags 3-5 个，体现文章核心主题
- categories 一般为"每日新闻"或根据内容确定`
};

// ============================================
// 工具函数
// ============================================

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const saved = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      return { ...QWEN_API_CONFIG, ...saved };
    }
  } catch (error) {
    console.error('读取 Qwen 配置文件失败:', error.message);
  }
  return { ...QWEN_API_CONFIG };
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

function callQwenAPI(config, prompt) {
  return new Promise((resolve, reject) => {
    const url = new URL(config.baseURL + '/chat/completions');

    const messages = [
      { role: 'system', content: config.systemPrompt },
      { role: 'user', content: prompt }
    ];

    const requestBody = {
      model: config.model,
      messages: messages,
      temperature: config.temperature,
      stream: false
    };

    const data = JSON.stringify(requestBody);

    const options = {
      hostname: 'coding.dashscope.aliyuncs.com',
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        try {
          const result = JSON.parse(body);
          if (res.statusCode !== 200) {
            reject(new Error(result.error?.message || `HTTP ${res.statusCode}`));
            return;
          }
          const content = result.choices[0].message?.content;
          resolve({
            content: content,
            usage: result.usage || {}
          });
        } catch (e) {
          reject(new Error(`解析响应失败：${e.message}`));
        }
      });
    });

    req.on('error', (error) => reject(new Error(`网络错误：${error.message}`)));
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('请求超时 (60 秒)'));
    });
    req.write(data);
    req.end();
  });
}

// ============================================
// 主功能
// ============================================

async function generateDailyNews(topic = null) {
  console.log('\n' + '═'.repeat(60));
  console.log('  每日新闻生成器 - 使用 Qwen AI');
  console.log('═'.repeat(60) + '\n');

  const config = loadConfig();
  const dateInfo = getTodayDate();

  // 验证 API Key
  if (!config.apiKey) {
    console.log('❌ 错误：未配置 Qwen API Key');
    console.log('\n请先配置 API Key:');
    console.log('  1. 运行：node /root/hxfund/scripts/qwen-code.js --init');
    console.log('  2. 或手动编辑：~/.qwen-code/config.json');
    process.exit(1);
  }

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
  console.log('🤖 调用 Qwen AI 生成内容...\n');

  try {
    // 调用 Qwen API
    const result = await callQwenAPI(config, prompt);

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
    const fileName = `daily-news-${dateInfo.dateStr}.md`;
    const filePath = path.join(POSTS_DIR, fileName);

    // 写入文件
    const fileContent = `---
${frontMatter}
---

${content}

---
*本文内容由阿里云通义千问 AI 辅助生成，仅供参考。*
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
  let showHelp = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-h' || args[i] === '--help') {
      showHelp = true;
    } else if (args[i] === '-t' || args[i] === '--topic') {
      topic = args[++i];
    } else if (!args[i].startsWith('-')) {
      topic = args[i];
    }
  }

  return { showHelp, topic };
}

function printHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         每日新闻生成器 - 使用 Qwen AI                      ║
╚═══════════════════════════════════════════════════════════╝

用法：node scripts/daily-news-qwen.js [选项] [主题]

选项:
  -h, --help              显示帮助信息
  -t, --topic <主题>      指定新闻主题
                          (不指定则生成综合科技新闻)

示例:
  node scripts/daily-news-qwen.js
  node scripts/daily-news-qwen.js "AI 技术发展"
  node scripts/daily-news-qwen.js -t "开源动态"

前置条件:
  1. 配置 Qwen API Key:
     node /root/hxfund/scripts/qwen-code.js --init
  2. 确保有足够的 API 额度

输出:
  文章保存到：source/_posts/daily-news-YYYY-MM-DD.md
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
