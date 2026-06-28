import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../svg-auto-height.mjs';
import {
  extractParagraphs,
  extractPostContentHtml,
  buildSubtitleFromArticle,
  isBoilerplateLine,
} from '../article-content-utils.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.dirname(ROOT);
const INV = path.join(ROOT, 'backfill-inventory.json');
const force = process.argv.includes('--force');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-orange{background:#ffedd5;color:#9a3412}.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:12px;padding:14px 20px;text-align:center;min-width:120px;font-weight:700;font-size:14px;color:#1e40af}
.arrow-sym{font-size:20px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}`;

function cleanTitle(t) {
  return t.replace(/\s*[-|–—]\s*Tony Bai\s*$/i, '').replace(/\s*[-|–—]\s*掘金\s*$/i, '').trim();
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function tagsFor(author) {
  const map = {
    'Tony Bai': ['Go/AI 技术', '工程实践', '深度解读'],
    '大模型真好玩': ['大模型', 'Agent 实战', '开源项目'],
    '乘风gg': ['AI 架构', '前端工程', 'Prompt 工程'],
    '风雨中的小七': ['NLP', 'Agent 开发', '算法工程'],
    '翔宇工作流': ['AI 编程', '自动化', '实战教程'],
  };
  return map[author] ?? ['AI 技术', '工程实践', '深度总结'];
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.text();
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 从章节正文提取 1-2 句完整原文引用（不截断 mid-sentence） */
function pickQuote(body) {
  const sentences = body.split(/(?<=[。！？])/).map((s) => s.trim()).filter(Boolean);
  if (!sentences.length) return body;
  return sentences.slice(0, 2).join('');
}

/** 结论区单条：标题 + 首句完整语义 */
function summaryLine(section) {
  const first = section.body.split(/(?<=[。！？])/)[0]?.trim() ?? section.body;
  return `${section.title}：${first}`;
}

function trimSectionBody(body) {
  const cutMarkers = ['资料链接', '商务合作', '还在为', '原「Gopher部落', 'Related posts', '今日开放讨论', '© 20'];
  let out = body;
  for (const marker of cutMarkers) {
    const idx = out.indexOf(marker);
    if (idx > 80) out = out.slice(0, idx);
  }
  return out.trim();
}

function extractSections(html) {
  const content = html.includes('post-content') ? extractPostContentHtml(html) : html;
  const sections = [];
  const re = /<h[23][^>]*>([\s\S]*?)<\/h[23]>([\s\S]*?)(?=<h[23][^>]*>|$)/gi;
  let m;
  while ((m = re.exec(content))) {
    const title = stripHtml(m[1]).replace(/^\d+\.\s*/, '').trim();
    const body = trimSectionBody(stripHtml(m[2]));
    if (title && body.length > 40 && !isBoilerplateLine(title)) {
      sections.push({ title, body });
    }
  }
  if (!sections.length) {
    const paragraphs = extractParagraphs(content);
    paragraphs.slice(0, 5).forEach((p, i) => {
      sections.push({ title: `要点 ${i + 1}`, body: p });
    });
  }
  return sections.slice(0, 5);
}

function buildBody(title, author, sections, subtitle) {
  const tgs = tagsFor(author);
  const nodes = sections
    .slice(0, 4)
    .map((s) => `<div class="node">${esc(s.title)}</div>`)
    .join('<span class="arrow-sym">→</span>');

  const cards = sections
    .map((s, i) => {
      const quote = pickQuote(s.body);
      return `
<div class="card">
  <h3>【模板 ${i % 2 ? 'B' : 'A'}】${esc(s.title)}</h3>
  <p><strong>在讲什么问题：</strong>${esc(s.title)}</p>
  <p><strong>关键理解：</strong>${esc(s.body)}</p>
  <p><strong>怎么落地：</strong>对照原文场景，列出可执行步骤并在团队内做一次小范围验证。</p>
  <div class="quote">原文依据：${esc(quote)}</div>
</div>`;
    })
    .join('');

  const summary = sections.slice(0, 4).map((s) => `<li>${esc(summaryLine(s))}</li>`).join('');
  const actionItems = sections
    .slice(0, 3)
    .map((s, i) => `<li>${esc(`结合「${s.title}」在本周工作中做 1 次对照验证`)}</li>`)
    .join('');

  return `
<h1>${esc(title)}</h1>
<div style="margin-bottom:16px">${tgs.map((t, i) => `<span class="tag tag-${['blue', 'green', 'orange'][i] || 'purple'}">${esc(t)}</span>`).join('')}</div>
<p class="subtitle">${esc(subtitle)}</p>
<div class="map"><h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3><div class="diagram">${nodes || '<div class="node">问题</div><span class="arrow-sym">→</span><div class="node">方法</div><span class="arrow-sym">→</span><div class="node">实践</div>'}</div></div>
${cards}
<div class="card"><h3>【模板 C】避坑清单</h3><div class="pitfall"><strong>常见误区：</strong>只记住结论不验证边界，或直接照搬而不结合自己的场景做裁剪。</div><p><strong>解法：</strong>每读完一节，用「什么场景适用 / 什么场景不该用」检验一次。</p></div>
<div class="conclusion"><h2>结论</h2><p><strong>总结：</strong></p><ol>${summary}</ol><p style="margin-top:20px"><strong>行动清单：</strong></p><ol>${actionItems}<li>把本文一个关键认知转变写成 3 句话分享给同事</li></ol><p style="margin-top:20px"><strong>关键认知转变：</strong>从「记住结论」到「能判断何时该用、何时不该用」——边界感比信息量更重要。</p></div>`;
}

async function generateOne(date, item) {
  const dir = path.join(REPO, 'docs/svgs', date);
  const slug = item.slug.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 60);
  const svgPath = path.join(dir, `${slug}.svg`);
  if (fs.existsSync(svgPath) && !force) return null;

  fs.mkdirSync(dir, { recursive: true });
  const title = cleanTitle(item.title);
  let html = '';
  try {
    html = await fetchHtml(item.source);
  } catch {
    html = `<p>${title}</p>`;
  }
  const content = html.includes('post-content') ? extractPostContentHtml(html) : html;
  const paragraphs = extractParagraphs(content);
  const subtitle = buildSubtitleFromArticle({ paragraphs, title });
  const sections = extractSections(html);
  const body = buildBody(title, item.author, sections, subtitle);
  const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log('OK', date, slug, height);
  return { date, path: `svgs/${date}/${slug}.svg`, title, source: item.source };
}

const inventory = JSON.parse(fs.readFileSync(INV, 'utf8'));
const dates = Object.keys(inventory).sort();
const generated = [];
let skipped = 0;

for (const date of dates) {
  for (const item of inventory[date]) {
    const dir = path.join(REPO, 'docs/svgs', date);
    const slug = item.slug.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 60);
    const svgPath = path.join(dir, `${slug}.svg`);
    if (fs.existsSync(svgPath) && !force) {
      skipped++;
      continue;
    }
    try {
      const r = await generateOne(date, item);
      if (r) generated.push(r);
    } catch (e) {
      console.error('FAIL', date, item.slug, e.message);
    }
  }
}

console.log(`Done: generated ${generated.length}, skipped ${skipped}${force ? ' (force)' : ''}`);
fs.writeFileSync(path.join(ROOT, 'backfill-generated.json'), JSON.stringify(generated, null, 2));
