/**
 * 抓取正文清洗 + 一句话总结校验（防止「本文永久链接」等元数据误入 subtitle）
 */

/** 应从正文中剔除的 boilerplate 行（整行或片段匹配） */
export const BOILERPLATE_PATTERNS = [
  /本文永久链接/i,
  /permalink/i,
  /^大家好，我是\s*Tony\s*Bai[。．.]?$/i,
  /^大家好，我是Tony Bai[。．.]?$/,
  /^扫描下方二维码/i,
  /^原「Gopher部落」/,
  /^商务合作方式：/,
  /^©\s*\d{4}/,
  /^Related posts:/i,
  /^资料链接：?\s*$/,
  /^还在为「/,
  /^我的新专栏/,
];

/** subtitle 无效模式（命中任一则需重写） */
export const BAD_SUBTITLE_PATTERNS = [
  /本文永久链接/,
  /https?:\/\//,
  /本文围绕核心问题展开，提炼关键理解、实践路径与常见误区/,
  /^本文解决的核心问题是：本文/,
  /^本文解决的核心问题是：大家好/,
  /永久链接/,
];

const PREFIX = '本文解决的核心问题是：';

export function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#8211;|&amp;|&lt;|&gt;|&quot;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isBoilerplateLine(line) {
  const t = line.trim();
  if (!t || t.length < 4) return true;
  if (/^https?:\/\//.test(t)) return true;
  return BOILERPLATE_PATTERNS.some((re) => re.test(t));
}

/** 从 HTML 或纯文本提取可用段落（已去 boilerplate） */
export function extractParagraphs(raw) {
  const text = raw.includes('<') ? stripHtml(raw) : raw;
  return text
    .split(/(?<=[。！？])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 20 && !isBoilerplateLine(s));
}

export function isBadSubtitle(text) {
  if (!text || typeof text !== 'string') return true;
  const body = text.replace(/^本文解决的核心问题是：/, '').trim();
  if (body.length < 15) return true;
  return BAD_SUBTITLE_PATTERNS.some((re) => re.test(text));
}

/** 从正文推断一句话总结（不含前缀） */
export function inferCoreProblem(paragraphs, title = '') {
  const question = paragraphs.find((p) => /[？?]/.test(p) && p.length >= 15 && p.length <= 120);
  if (question) {
    let q = question.replace(/[？?]+$/, '').trim();
    return `${q}？`;
  }

  const intro = paragraphs.slice(0, 3).join('').slice(0, 100);
  if (intro.length >= 20) {
    const trimmed = intro.length > 95 ? intro.slice(0, 95) + '……' : intro;
    return trimmed.endsWith('。') || trimmed.endsWith('……') ? trimmed : `${trimmed}。`;
  }

  if (title) {
    const short = title.replace(/[：:!！?？].*$/, '').slice(0, 40);
    return `读者应如何理解「${short}」一文的核心论点与可行动启示。`;
  }

  return '读者应从原文中提炼核心论点、实践路径与需警惕的误区。';
}

export function formatSubtitle(coreProblem) {
  const body = coreProblem.replace(/^本文解决的核心问题是：/, '').trim();
  return `${PREFIX}${body}`;
}

/** 从 Tony Bai 等 WordPress 页面 HTML 提取 post-content */
export function extractPostContentHtml(html) {
  const m = html.match(/<div class="post-content">([\s\S]*?)<\/div>\s*<(?:ul class="post-meta"|div class="post-tags")/i);
  return m ? m[1] : html;
}

export async function fetchArticleParagraphs(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'daily-tech-learning-bot/1.0' },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const content = extractPostContentHtml(html);
  return extractParagraphs(content);
}

export function buildSubtitleFromArticle({ paragraphs, title }) {
  const core = inferCoreProblem(paragraphs, title);
  const subtitle = formatSubtitle(core);
  if (isBadSubtitle(subtitle)) {
    throw new Error('生成的 subtitle 仍无效');
  }
  return subtitle;
}
