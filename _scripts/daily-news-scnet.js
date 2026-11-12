/**
 * 每日新闻生成器 - SCNet 版
 *
 * 采集真实新闻头条（Google 新闻 RSS + BBC 中文 RSS），调用 SCNet-Max
 * 摘要成 Hexo 文章，写到 source/_posts/YYYY-MM-DD-daily-news.md。
 *
 * 和旧版 daily-news.js 的区别：旧版没有任何新闻来源，是让模型凭空
 * 编 5 条新闻（会出现编造的事件和数字）；本版只对采集到的真实头条
 * 做摘要，不编造。任一 RSS 都拉不到、或模型返回空内容时直接失败
 * 退出，不写文章。
 *
 * 环境变量：
 *   SCNET_API_KEY  SCNet MaaS API Key（必填，GitHub Secrets）
 *   DRY_RUN=1      只采集并写占位文章，不调 API（本地测试用）
 *
 * 用法：
 *   node scripts/daily-news-scnet.js
 *   DRY_RUN=1 node scripts/daily-news-scnet.js
 */

const fs = require('fs');
const path = require('path');

const SCNET_API_URL = 'https://api.scnet.cn/api/llm/v1/chat/completions';
const SCNET_MODEL = 'SCNet-Max';
// SCNet-Max 是推理模型，推理会占掉大部分预算，正式回答需要留足余量。
const MAX_TOKENS = 8000;
const MAX_HEADLINES = 15;

const FEEDS = [
  { name: 'Google 新闻', url: 'https://news.google.com/rss?hl=zh-CN&gl=CN&ceid=CN:zh-Hans' },
  { name: 'BBC 中文', url: 'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml' },
];

const HEXO_ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(HEXO_ROOT, 'source', '_posts');

/** 北京时间日期 YYYY-MM-DD（Runner 是 UTC，不能直接用本地日期）。 */
function beijingDate() {
  const now = new Date(Date.now() + 8 * 3600 * 1000);
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function beijingDateTime() {
  const now = new Date(Date.now() + 8 * 3600 * 1000);
  const date = beijingDate();
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  const ss = String(now.getUTCSeconds()).padStart(2, '0');
  return `${date} ${hh}:${mm}:${ss}`;
}

function stripCdata(s) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function tagText(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decodeEntities(stripCdata(m[1]).trim()) : '';
}

/** 拉一个 RSS 源，返回 [{ title, link, source }]。 */
async function fetchFeed(feed) {
  const res = await fetch(feed.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36' },
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`${feed.name} RSS 请求失败: HTTP ${res.status}`);
  const xml = await res.text();
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  const items = [];
  for (const b of blocks) {
    const title = tagText(b, 'title');
    if (!title) continue;
    items.push({
      title,
      link: tagText(b, 'link'),
      source: tagText(b, 'source') || feed.name,
    });
  }
  console.log(`从${feed.name}采集到 ${items.length} 条头条`);
  return items;
}

/** 汇总去重，Google 新闻在前，BBC 补齐。 */
async function collectHeadlines() {
  const seen = new Set();
  const all = [];
  for (const feed of FEEDS) {
    try {
      const items = await fetchFeed(feed);
      for (const it of items) {
        const key = it.title.replace(/\s+/g, '');
        if (seen.has(key)) continue;
        seen.add(key);
        all.push(it);
        if (all.length >= MAX_HEADLINES) return all;
      }
    } catch (err) {
      console.error(`采集${feed.name}失败: ${err.message}`);
    }
  }
  return all;
}

function buildPrompt(dateStr, headlines) {
  const lines = headlines
    .map((h, i) => `${i + 1}. [${h.source}] ${h.title}${h.link ? `（${h.link}）` : ''}`)
    .join('\n');
  return `你是一个专业的中文新闻摘要助手。下面是 ${dateStr} 从 Google 新闻与 BBC 中文采集到的真实头条（标题与来源），请只根据这些材料，用中文写 5 条热点新闻摘要，每条包含一个标题和一段简短描述（约100字），并注明来源。\n` +
    `要求：\n` +
    `- 只写材料里有的新闻，不编造时间、地点、数字、人名和事件；不确定的细节宁可不写。\n` +
    `- 再简要介绍历史上的今天，增加文章的多样性。\n` +
    `- 只返回 Markdown 正文，不要解释，不要加开场白。\n` +
    `材料：\n${lines}`;
}

/** 调 SCNet-Max 摘要。返回 Markdown 正文，空内容时抛错。 */
async function summarizeWithScnet(prompt) {
  const apiKey = process.env.SCNET_API_KEY;
  if (!apiKey) throw new Error('未设置 SCNET_API_KEY，请在 GitHub Secrets 里添加');
  const res = await fetch(SCNET_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: SCNET_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: MAX_TOKENS,
    }),
    signal: AbortSignal.timeout(300000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`SCNet API 请求失败: HTTP ${res.status} ${text.slice(0, 200)}`);
  }
  const body = await res.json();
  const choice = body.choices && body.choices[0];
  const content = choice && choice.message && choice.message.content;
  console.log(`SCNet 返回 finish_reason=${choice && choice.finish_reason}，内容 ${content ? content.length : 0} 字`);
  if (!content || !content.trim()) {
    throw new Error('SCNet 返回内容为空（可能是推理占满了 token 预算），本次不写文章');
  }
  return content.trim();
}

function createHexoPost(content, dateStr) {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
  const fileName = `${dateStr}-daily-news.md`;
  const filePath = path.join(POSTS_DIR, fileName);
  const frontMatter =
    `---\n` +
    `title: 今日热点新闻（${dateStr}）\n` +
    `date: ${beijingDateTime()}\n` +
    `tags: [DailyNews, Automation]\n` +
    `categories: 新闻速递\n` +
    `---\n\n`;
  const footer = `\n\n以上内容由 SCNet-Max 生成，内容源自公开新闻聚合，如有侵权请联系删除。\n`;
  fs.writeFileSync(filePath, frontMatter + content + footer);
  console.log(`成功创建 Hexo 文章: ${filePath}`);
}

async function main() {
  const dateStr = beijingDate();
  console.log(`开始生成 ${dateStr} 的每日新闻...`);
  const headlines = await collectHeadlines();
  if (headlines.length === 0) {
    throw new Error('两个 RSS 源都采集失败，没有任何头条，本次不写文章');
  }
  console.log(`共采集到 ${headlines.length} 条不重复头条`);
  if (process.env.DRY_RUN === '1') {
    console.log('DRY_RUN=1，跳过 SCNet 调用，写占位文章');
    const placeholder = headlines.map((h, i) => `## ${i + 1}. ${h.title}\n\n来源：${h.source}\n`).join('\n');
    createHexoPost(`# ${dateStr}热点新闻摘要（占位，DRY_RUN）\n\n${placeholder}`, dateStr);
    return;
  }
  const prompt = buildPrompt(dateStr, headlines);
  const content = await summarizeWithScnet(prompt);
  createHexoPost(content, dateStr);
  console.log('--- 任务成功完成 ---');
}

// 只在直接运行时执行。Hexo 会自动加载 scripts/ 目录下的 JS，
// 所以本文件放在 _scripts/（不会被 Hexo 加载），这里再加一道保护，
// 即使被加载也不会在 hexo clean/generate 时擅自跑起来。
if (require.main === module) {
  main().catch((err) => {
    console.error('--- 任务执行失败 ---');
    console.error(err.message);
    process.exit(1);
  });
}
