/**
 * 按 index.json + 最新 SKILL 规范批量重生成全部 SVG
 * 用法: node scripts/regenerate-all-svgs.mjs [--force] [--limit N] [--date YYYY-MM-DD]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { buildSvg } from '../svg-auto-height.mjs';
import {
  extractParagraphs,
  extractPostContentHtml,
  buildSubtitleFromArticle,
  isBoilerplateLine,
  stripHtml,
  fetchJuejinMarkdown,
  markdownToPlain,
  extractSectionsFromMarkdown,
  isEmptyShellSvg,
} from '../article-content-utils.mjs';

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const INDEX = path.join(REPO, 'index.json');
const force = process.argv.includes('--force');
const juejinOnly = process.argv.includes('--juejin-only');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;
const dateFilter = process.argv.find((a) => a.startsWith('--date='))?.split('=')[1];

const CARD_TYPES = ['概念拆解卡', '方法/工具卡', '避坑清单卡', '决策/选型表', '跨概念对比表', '心法/原则卡'];

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-orange{background:#ffedd5;color:#9a3412}.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:12px;padding:14px 20px;text-align:center;min-width:120px;font-weight:700;font-size:14px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:20px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}`;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function authorFromUrl(url) {
  if (url.includes('tonybai.com')) return 'Tony Bai';
  if (url.includes('xiangyugongzuoliu.com')) return '翔宇工作流';
  if (url.includes('juejin.cn')) return url.includes('3140624091453053') ? '大模型真好玩' : '乘风gg';
  if (url.includes('gogoSandy')) return '风雨中的小七';
  if (url.includes('sio2zyh')) return 'SIo_2';
  return 'AI 技术';
}

function tagsFor(author) {
  const map = {
    'Tony Bai': ['Go/AI 技术', '工程实践', '深度解读'],
    '翔宇工作流': ['AI 编程', '自动化', '实战教程'],
    '大模型真好玩': ['大模型', 'Agent 实战', '开源项目'],
    '乘风gg': ['AI 架构', '前端工程', 'Prompt 工程'],
    '风雨中的小七': ['NLP', 'Agent 开发', '算法工程'],
    'SIo_2': ['大模型', '推理优化', '工程实践'],
  };
  return map[author] ?? ['AI 技术', '工程实践', '深度总结'];
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; daily-tech-learning/1.0)' },
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function trimSectionBody(body) {
  const cutMarkers = ['资料链接', '商务合作', '还在为', '原「Gopher部落', 'Related posts', '© 20', '扫描下方二维码'];
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
    extractParagraphs(content).slice(0, 5).forEach((p, i) => {
      sections.push({ title: `要点 ${i + 1}`, body: p });
    });
  }
  return sections.slice(0, 5);
}

function pickQuote(body) {
  const sentences = body.split(/(?<=[。！？])/).map((s) => s.trim()).filter(Boolean);
  return sentences.slice(0, 2).join('') || body.slice(0, 200);
}

function firstSentence(body) {
  return body.split(/(?<=[。！？])/)[0]?.trim() || body.slice(0, 120);
}

function hashTitle(title) {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (Math.imul(31, h) + title.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickVariant(title, variants) {
  return variants[hashTitle(title) % variants.length];
}

/** 仅根据标题判断是否为 Go 语言主题（避免 Google 误匹配 Go） */
function isGoLanguageTopic(title) {
  const stripped = title.replace(/Google/gi, '');
  if (
    /Go 语言|Golang|goroutine|go\.mod|Go 1\.|Go 的|Go 官方|Go 提案|Go 生态|Go 后端|Go 性能|Go 正则|Go 栈|Go 迁移|Go 并发|Go 模块|Go 命令|Go 泛型|Go 代码|Go 程序员|Go 与 Rust|Go vs|投向 Go|倒戈.*Go|切换.*Go|地道.*Go|写 Go|用 Go|idiomatic Go/i.test(
      title,
    )
  ) {
    return true;
  }
  return /\bGo\b/.test(stripped);
}

function buildArticleSpecificRebuttal(title, subtitle) {
  const core = subtitle.replace(/^本文解决的核心问题是：/, '').trim();
  const hook = core.length >= 15 ? core.slice(0, 55) : title.slice(0, 35);
  const roles = ['审慎派工程师', '遗留系统维护者', '曾踩过坑的 Tech Lead', '「先证伪再执行」派'];
  return {
    role: `${pickVariant(title, roles)} · 对本文核心论点`,
    text: `就算「${hook}」在纸面上成立，落到真实团队仍会撞上交付周期、遗留代码和组织惯性——原文对这三者的量化讨论不足，不宜无脑照搬。`,
  };
}

function buildRebuttal(title, subtitle) {
  const t = title;

  // ── 最具体规则优先，仅用标题匹配 ──

  if (/编译通过|Rust.*运行|Alice|工程美学|所有权|借用检查|Zig 之父|拒领上亿/i.test(t)) {
    return pickVariant(t, [
      {
        role: 'Java/Go 务实派 · 「够用就行」工程哲学',
        text: '编译通过只保证类型与内存安全，Heartbleed 级的逻辑漏洞和 async 死锁照样上线——你用编译器刚性换掉的，是 Java 生态二十年迭代速度和可招到的开发者池。',
      },
      {
        role: '「快速交付」派 CTO',
        text: 'Rust 的学习曲线和编译时间本身就是成本——当业务窗口只有三个月，「编译即正确」救不了产品上市速度。',
      },
    ]);
  }

  if (/Agent 横评|OpenClaw|Hermes|Codex 最佳|Claude Code.*GitHub|智能体.*GitHub|DeepAgents|OpenClaw|Harness/i.test(t)) {
    return pickVariant(t, [
      {
        role: 'OpenClaw 生态原教旨主义者 · 「集成广度即护城河」派',
        text: 'Hermes 的学习回路再聪明，也无法 overnight 复制 OpenClaw 25+ 频道原生集成和 ClawHub 四万 Skill 的网络效应——对已 all-in OpenClaw 的团队等于推倒重来。',
      },
      {
        role: 'Geohot 式 Agent 怀疑派',
        text: '自主 Agent 的 Token 成本与错误决策半径常被低估——Stars 和 demo 视频好看，生产环境里的死循环、权限事故和 $131/天账单才是真实账单。',
      },
      {
        role: '「一个工具打天下」保守派',
        text: '双修三修架构听起来完美，运维复杂度却线性叠加——多数团队连一个 Agent 网关都管不好，更别说编排层+执行层+编码层三层联动。',
      },
    ]);
  }

  if (/Veo|Runway|可灵|Kling|八层框架|视频提示|Prompt.*视频|Gen-4|提示词完全指南/i.test(t)) {
    return pickVariant(t, [
      {
        role: '「模型决定论」派 · 可灵/Veo 实践者',
        text: 'Gen-4.5 的 Elo 领先只说明 Runway 上限高——同一套八层框架搬到可灵或 Veo 上要重写大半，力-反应语法对安静对白镜头是 overkill。',
      },
      {
        role: '传统影视从业者',
        text: 'AI 视频再强也绕不开叙事结构和分镜逻辑——八层框架再精细，也比不上一个懂行的导演在片场喊「再来一条」。',
      },
    ]);
  }

  if (/SRE|运维.*AI|Actus|IRM|InvD|系统崩溃|可靠性.*AI|Google.*SRE/i.test(t)) {
    return pickVariant(t, [
      {
        role: '传统 SRE 守夜人',
        text: '把 L3/L4 自治交给 AI 之前，先回答谁为 Blast Radius 签字——自动化跑得再快，Actus 规则写错一次比人类手滑更致命。',
      },
      {
        role: '「人肉救火更靠谱」派',
        text: 'AI 写代码快 10 倍不等于故障可预测性快 10 倍——在证明 Evaluation Pipeline 可靠之前，把生产自治权交给 LLM 是赌博。',
      },
    ]);
  }

  if (/Token|算力|浪费.*算力|硅谷.*共识/i.test(t)) {
    return {
      role: 'FinOps 负责人 · 「能省则省」派',
      text: '「别省 Token」对研究型团队成立，对百万日活产品就是灾难——没有预算护栏的算力浪费，和没有测试的代码一样会拖垮公司。',
    };
  }

  if (/Rust.*Joy|Linux.*Rust|迁移.*Rust|Go 与 Rust|Rust.*后端|Rust.*中国|Rust.* hype/i.test(t)) {
    return pickVariant(t, [
      {
        role: '「C 永远够用」嵌入式老兵',
        text: 'Rust 在内核里的成功案例不能外推到业务 CRUD——大多数团队缺的不是内存安全，而是可维护的架构和清晰的领域模型。',
      },
      {
        role: 'Go 存量系统维护者',
        text: '重写为 Rust 的 ROI 极少算清楚——Greg KH 的乐趣是个人选择，你的公司可能更需要把现有 Go 服务跑稳而不是追逐语言时尚。',
      },
    ]);
  }

  if (/C\+\+|Java.*Go|过度架构|idiomatic|地道.*Go|写 Go 像 Java/i.test(t)) {
    return pickVariant(t, [
      {
        role: '「架构即文档」派',
        text: '所谓过度架构往往是事后判断——在需求剧烈变化期，多一层抽象可能是唯一让团队不崩溃的缓冲，极简主义不是万能药。',
      },
      {
        role: 'Java 企业架构师',
        text: 'Go 的「少即是多」在微服务爆炸时会变成「每个服务一套私有约定」——缺少 Java 级生态约束，大型组织照样会乱。',
      },
    ]);
  }

  if (/高考|裁员|替代.*工作|Layoff|学历|985/i.test(t)) {
    return pickVariant(t, [
      {
        role: '教育投资保守派',
        text: 'AI 替代叙事已反复出现又反复落空——完全押注「学历无用论」的人，往往在下一个技术周期来临时最先失业。',
      },
      {
        role: '劳动力经济学家',
        text: '囚徒困境模型假设公司理性，却忽略了监管、工会和舆论压力——「AI 裁员陷阱」在欧美可能成立，在中国语境需要不同参数。',
      },
    ]);
  }

  if (/Docker|部署|VPS|24\/7|Hermes.*Docker/i.test(t)) {
    return {
      role: '「本地先跑通」派',
      text: '24/7 Agent 网关听起来很酷，但 VPS 宕机、API 限流和密钥轮换的运维负担，往往比手动跑 Claude Code 更折磨人。',
    };
  }

  if (/AI 编程工具|Cursor|Windsurf|Codex vs|横评.*Cursor/i.test(t)) {
    return pickVariant(t, [
      {
        role: '「Vim 够用」老派开发者',
        text: '十维评分卡再精细，也掩盖不了一个事实——工具切换成本（配置、习惯、团队对齐）常常高于工具本身的能力差距。',
      },
      {
        role: '合规/涉密项目负责人',
        text: '三大工具横评忽略了一个维度：代码能不能出内网——对金融和政务客户，这往往比 SWE-bench 分数更先决。',
      },
    ]);
  }

  if (/后量子|Let's Encrypt|MTCs|RSA|加密|sumdb|供应链|量子/i.test(t)) {
    return pickVariant(t, [
      {
        role: '「密码迁移还早」派 CISO',
        text: '后量子迁移的紧迫性被厂商放大——在 Y2K 和 Heartbleed 之后，我们见过太多「不迁移就死」的恐吓，实际窗口往往比白皮书说的长。',
      },
      {
        role: 'Legacy 系统维护者',
        text: 'MTCs 再优雅，也解决不了「90% 流量还在 RSA 链路上」的现实——混合部署十年过渡期里，复杂度只会上升不会下降。',
      },
    ]);
  }

  if (/学习.*新技术|成长环|教程.*100 小时|维护者.*困境/i.test(t)) {
    return {
      role: '「项目驱动学习」派',
      text: '非直觉学习指南适合自驱力极强的人——对大多数工程师，没有真实 deadline 和 production bug 约束的「拉伸区练习」很容易变成舒适区摸鱼。',
    };
  }

  if (/Geohot|Agent.*灾难|昂贵.*软件/i.test(t)) {
    return {
      role: 'Agent 乐观主义者 · AutoGPT 早期信徒',
      text: 'Geohot 的炮轰忽略了样本偏差——他看到的是失败案例，而 quietly 用 Agent 省掉 30% 重复劳动的团队不会上 Hacker News 发帖。',
    };
  }

  if (isGoLanguageTopic(t)) {
    return pickVariant(t, [
      {
        role: 'Rust/系统编程原教旨主义者',
        text: 'Go 的「简单」很多时候是把复杂度推迟到运行时和运维侧——当性能热路径或安全边界收紧时，缺乏所有权模型会让你付出重写代价。',
      },
      {
        role: 'JVM 架构师 · 「并发模型更成熟」派',
        text: 'Go 的 goroutine 轻量但不免费——Uber 栈扩容、接口逃逸等案例说明，不写 Java 不代表没有 GC 和调度器的隐性税。',
      },
      {
        role: '「Boring Technology」倡导者',
        text: 'Go 提案再精彩，你的服务可能只需要 CRUD——追每个新语法糖的时间，不如把监控、告警和回滚做扎实。',
      },
      {
        role: 'Python 数据团队 Tech Lead',
        text: '大厂选 Go 重写的是基础设施，不是算法实验——把「Google 用 Go」当成全员转 Go 的理由，是幸存者偏差。',
      },
    ]);
  }

  if (/AI|大模型|LLM|GPT|Claude|Gemini|编程.*AI|AI.*编程/i.test(t)) {
    return pickVariant(t, [
      {
        role: '技术乐观主义批评者',
        text: '历史一再证明「这次不一样」会高估短期颠覆——对「' + t.slice(0, 20) + '」这类叙事，更该问：三年后还有多少结论站得住脚？',
      },
      {
        role: '「AI 辅助而非替代」派',
        text: '把「' + t.slice(0, 18) + '」当成行动指南的人，往往忽略了上下文窗口、幻觉率和责任归属这三个生产环境硬约束。',
      },
    ]);
  }

  return buildArticleSpecificRebuttal(title, subtitle);
}

function buildCorrection(title) {
  if (/Rust|编译通过/.test(title)) {
    return '常见误解：「Rust 安全 = 没有 unsafe」—— unsafe 是特权封装箱，不是关闭检查的后门；业务代码 unsafe 率应为 0%。';
  }
  if (/Agent|Stars|横评/.test(title)) {
    return '常见误解：「GitHub Stars 最高 = 最好」—— 应综合看 CVE 记录、场景匹配和真实成本，而非关注度排名。';
  }
  if (/提示词|Prompt|八层/.test(title)) {
    return '常见误解：「JSON 格式提示词更结构化」—— Runway 等模型忽略 JSON 结构，真正起作用的是自然语言描述本身。';
  }
  return '常见误解：只记住结论不验证边界——读完应能回答「什么场景适用、什么场景不该用」，而非背诵作者态度。';
}

function cardTypeFor(index, section, total) {
  if (index === 0) return '概念拆解卡';
  if (index === 1) return '方法/工具卡';
  if (section.title.includes('坑') || section.title.includes('不要') || section.title.includes('避')) return '避坑清单卡';
  if (index === total - 1 && total >= 3) return '心法/原则卡';
  return CARD_TYPES[index % CARD_TYPES.length];
}

function buildCard(section, index, total) {
  const type = cardTypeFor(index, section, total);
  const quote = pickQuote(section.body);
  const first = firstSentence(section.body);

  if (type === '避坑清单卡') {
    return `
<div class="card">
  <h3>【避坑清单卡】${esc(section.title)}</h3>
  <p><strong>坑名：</strong>${esc(first)}</p>
  <p><strong>原因：</strong>${esc(section.body.slice(0, 300))}</p>
  <p><strong>解法：</strong>对照原文边界说明，在团队中建立「什么场景不该用」的检查清单。</p>
  <p><strong>严重程度：</strong>小心——不验证边界时容易照搬结论。</p>
  <div class="quote">原文：${esc(quote)}</div>
</div>`;
  }

  if (type === '决策/选型表' && index >= 2) {
    return `
<div class="card">
  <h3>【决策/选型表】${esc(section.title)}</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>原文主场景</td><td>按作者方案执行</td><td>${esc(first)}</td><td>跳过验证直接照搬</td><td>忽略边界导致踩坑</td></tr>
    <tr><td>资源/预算受限</td><td>裁剪到最小可行子集</td><td>先验证核心价值假设</td><td>全量一次性上线</td><td>失败成本高、回滚难</td></tr>
    <tr><td>团队经验不足</td><td>小范围试点 + 对照实验</td><td>降低 Blast Radius</td><td>直接替换现有流程</td><td>组织惯性被低估</td></tr>
  </table>
</div>`;
  }

  if (type === '跨概念对比表' && index >= 2) {
    return `
<div class="card">
  <h3>【跨概念对比表】${esc(section.title)}</h3>
  <table>
    <tr><th>对比维度</th><th>原文方案</th><th>传统做法</th><th>一句话结论</th></tr>
    <tr><td>核心目标</td><td>${esc(first.slice(0, 80))}</td><td>维持现状/渐进改良</td><td>差异在是否愿意重构前提假设</td></tr>
    <tr><td>适用边界</td><td>原文强调的场景</td><td>通用但效率较低</td><td>选型取决于约束而非热度</td></tr>
    <tr><td>落地成本</td><td>需配套流程/工具</td><td>学习曲线较平缓</td><td>短期贵、长期看 ROI</td></tr>
  </table>
</div>`;
  }

  if (type === '心法/原则卡') {
    return `
<div class="card">
  <h3>【心法/原则卡】${esc(section.title)}</h3>
  <p><strong>原则：</strong>${esc(first)}</p>
  <p><strong>为什么重要：</strong>${esc(section.body.slice(0, 250))}</p>
  <p><strong>怎么落地：</strong>把原则写成团队 checklist，在 code review 或设计评审中强制过一遍。</p>
  <p><strong>适用边界：</strong>资源极度受限或一次性原型场景可适度放宽。</p>
  <div class="quote">原文支撑：${esc(quote)}</div>
</div>`;
  }

  if (type === '方法/工具卡') {
    return `
<div class="card">
  <h3>【方法/工具卡】${esc(section.title)}</h3>
  <p><strong>核心思路：</strong>${esc(first)}</p>
  <p><strong>操作步骤：</strong>1. 阅读原文场景 2. 提取可执行动作 3. 小范围试点 4. 对照原文指标验收</p>
  <p><strong>选型条件：</strong>当团队面临与原文类似约束时优先采用。</p>
  <div class="highlight"><strong>落地建议：</strong>本周选 1 个与「${esc(section.title)}」相关的任务做对照验证。</div>
  <div class="pitfall"><strong>避坑：</strong>不要跳过边界说明直接照搬工具链或配置。</div>
  <div class="quote">原文引用：${esc(quote)}</div>
</div>`;
  }

  return `
<div class="card">
  <h3>【概念拆解卡】${esc(section.title)}</h3>
  <p><strong>在讲什么问题：</strong>${esc(section.title)}</p>
  <p><strong>核心机制：</strong>${esc(first)}</p>
  <p><strong>关键理解：</strong>${esc(section.body)}</p>
  <p><strong>典型场景：</strong>当团队讨论与本文主题相关的技术选型或工程决策时。</p>
  <p><strong>边界说明：</strong>需结合自己的规模、栈和合规要求裁剪，不可无脑复制。</p>
  <div class="quote">原文依据：${esc(quote)}</div>
</div>`;
}

function buildBody(title, author, sections, subtitle) {
  const tgs = tagsFor(author);
  const nodes = sections
    .slice(0, 4)
    .map((s, i) => {
      const cls = i === sections.length - 1 ? 'node node-green' : i === 1 ? 'node node-orange' : 'node';
      return `<div class="${cls}">${esc(s.title.slice(0, 20))}</div>`;
    })
    .join('<span class="arrow-sym">→</span>');

  const cards = sections.map((s, i) => buildCard(s, i, sections.length)).join('');
  const rebuttal = buildRebuttal(title, subtitle);
  const correction = buildCorrection(title);

  const summary = sections
    .slice(0, 5)
    .map((s) => `<li>${esc(firstSentence(s.body))}</li>`)
    .join('');
  const actions = sections
    .slice(0, 3)
    .map((s) => `<li>${esc(`结合「${s.title}」在本周做 1 次小范围对照验证`)}</li>`)
    .join('');

  return `
<h1>${esc(title)}</h1>
<div style="margin-bottom:16px">${tgs.map((t, i) => `<span class="tag tag-${['blue', 'green', 'orange'][i] || 'purple'}">${esc(t)}</span>`).join('')}</div>
<p class="subtitle">${esc(subtitle)}</p>
<div class="map"><h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3><div class="diagram">${nodes || '<div class="node">问题</div><span class="arrow-sym">→</span><div class="node">方法</div><span class="arrow-sym">→</span><div class="node">实践</div>'}</div></div>
<div class="correction"><h3>认知纠偏</h3><p style="color:#92400e;font-size:16px">${esc(correction)}</p></div>
${cards}
<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：${esc(rebuttal.role)}</p>
  <p class="rebuttal-text">${esc(rebuttal.text)}</p>
</div>
<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>${summary}</ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>${actions}<li>把本文一个关键认知转变写成 3 句话分享给同事</li></ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「记住结论」到「能判断何时该用、何时不该用」——边界感比信息量更重要。</p>
</div>`;
}

async function fetchArticleContent(url) {
  if (url.includes('juejin.cn')) {
    const md = await fetchJuejinMarkdown(url);
    return { type: 'markdown', content: md };
  }
  const html = await fetchHtml(url);
  return { type: 'html', content: html };
}

async function regenerateOne(entry, date) {
  const svgPath = path.join(REPO, entry.path);
  const slug = path.basename(entry.path, '.svg');
  const dir = path.dirname(svgPath);
  const mjsPath = path.join(dir, `generate-${slug}.mjs`);
  const existingContent = fs.existsSync(svgPath) ? fs.readFileSync(svgPath, 'utf8') : '';

  if (fs.existsSync(mjsPath)) {
    const src = fs.readFileSync(mjsPath, 'utf8');
    if (src.includes('.rebuttal') && src.includes('【概念拆解卡】')) {
      execSync(`node ${JSON.stringify(`generate-${slug}.mjs`)}`, { cwd: dir, stdio: 'inherit' });
      console.log('MJS', date, slug);
      return { status: 'ok', height: 'mjs' };
    }
  }

  const title = entry.title.replace(/\s*[-|–—]\s*Tony Bai\s*$/i, '').trim();

  if (fs.existsSync(svgPath) && !force && !isEmptyShellSvg(existingContent)) return { status: 'skip' };

  fs.mkdirSync(dir, { recursive: true });

  let article;
  try {
    article = await fetchArticleContent(entry.source);
  } catch (e) {
    if (existingContent && !isEmptyShellSvg(existingContent)) {
      console.warn('FETCH FAIL keep existing', entry.path, e.message);
      return { status: 'skip', reason: 'fetch-fail-keep' };
    }
    console.error('FETCH FAIL', entry.path, e.message);
    return { status: 'fail', error: e.message };
  }

  let paragraphs;
  let subtitle;
  let sections;

  if (article.type === 'markdown') {
    paragraphs = extractParagraphs(markdownToPlain(article.content));
    sections = extractSectionsFromMarkdown(article.content, { trimSectionBody });
  } else {
    const html = article.content;
    const content = html.includes('post-content') ? extractPostContentHtml(html) : html;
    paragraphs = extractParagraphs(content);
    sections = extractSections(html);
  }

  try {
    subtitle = buildSubtitleFromArticle({ paragraphs, title });
  } catch {
    subtitle = `本文解决的核心问题是：读者应如何理解「${title.slice(0, 40)}」的核心论点与可行动启示。`;
  }

  const weakSections = sections.length <= 1 && sections.every((s) => s.title.startsWith('要点'));
  if (weakSections && existingContent && !isEmptyShellSvg(existingContent) && !force) {
    console.warn('WEAK SECTIONS keep existing', entry.path);
    return { status: 'skip', reason: 'weak-sections-keep' };
  }

  const author = authorFromUrl(entry.source);
  const body = buildBody(title, author, sections, subtitle);
  const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });

  if (height < 2500 && existingContent && !isEmptyShellSvg(existingContent) && !force) {
    console.warn('SKIP would downgrade', entry.path, height);
    return { status: 'skip', reason: 'would-downgrade' };
  }

  fs.writeFileSync(svgPath, svg, 'utf8');

  console.log('OK', date, slug, height);
  return { status: 'ok', height };
}

const index = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
let ok = 0,
  fail = 0,
  skip = 0,
  processed = 0;

for (const day of index) {
  if (dateFilter && day.date !== dateFilter) continue;
  for (const file of day.files) {
    if (juejinOnly && !file.source?.includes('juejin.cn')) continue;
    if (processed >= limit) break;
    processed++;
    const r = await regenerateOne(file, day.date);
    if (r.status === 'ok') ok++;
    else if (r.status === 'fail') fail++;
    else skip++;
  }
  if (processed >= limit) break;
}

console.log(`\nDone: ok=${ok} fail=${fail} skip=${skip} total=${processed}${force ? ' (force)' : ''}`);
