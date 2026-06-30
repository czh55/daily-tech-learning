import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'hermes-agent-monetization-guide.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:130px;font-weight:700;font-size:16px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:24px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Hermes Agent 变现指南：7 种可落地的 AI Agent 商业模式详解</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Hermes Agent</span>
  <span class="tag tag-green">AI 副业</span>
  <span class="tag tag-orange">商业模式</span>
  <span class="tag tag-purple">开源变现</span>
</div>
<p class="subtitle">本文解决的核心问题是：Hermes Agent 软件成本为零的前提下，如何用七种经过验证的商业模式把部署与运营能力转化为稳定收入，以及每种模式的定价、成本结构和起步路径。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-green">Apache-2.0 开源<br><span style="font-size:13px;font-weight:400">软件成本≈0</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">极低运营成本<br><span style="font-size:13px;font-weight:400">¥30-50/月</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">7 种变现模式<br><span style="font-size:13px;font-weight:400">客服/频道/代运营</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">高毛利结构<br><span style="font-size:13px;font-weight:400">75-99%</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「开源免费 = 没法赚钱」—— Hermes 的 Apache-2.0 免授权费，变现来自部署服务、运维维护和行业方案，而非卖软件本身。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Hermes 变现的底层逻辑</h3>
  <p><strong>在讲什么问题：</strong>为什么开源 Agent 框架能支撑高毛利商业模型？</p>
  <p><strong>核心机制：</strong>软件成本为零（Apache-2.0），运营成本极低（本机部署月费 ¥30-50），客户付费金额扣除获客成本后几乎全是利润。</p>
  <p><strong>关键理解：</strong>利润空间 ≈ 客户付费 − 获客成本；对标商业产品（企点 ¥4,500/年、Intercom $24,252/年）定价低 50-99%，双方仍双赢。</p>
  <p><strong>典型场景：</strong>本地商家 AI 客服、私域 SCRM 替代、白标授权。</p>
  <p><strong>边界说明：</strong>变现靠服务能力而非卖许可证；技术门槛因模式而异（频道运营低，白标高）。</p>
  <div class="quote">「翔宇跑一个多平台、多品牌、24 小时在线的 AI Agent 系统，月成本不到一杯咖啡钱。」</div>
  <div class="relation"><strong>相关概念：</strong>与 Coze/Dify 对比——后者需付平台月费，Hermes 同等报价下毛利率高 20-30 个百分点。</div>
</div>

<div class="card">
  <h3>【决策/选型表】七种变现模式怎么选？</h3>
  <table>
    <tr><th>模式</th><th>月收入预估</th><th>启动成本</th><th>技术门槛</th><th>适合谁</th></tr>
    <tr><td>本地商家 AI 客服</td><td>¥3,000-15,000</td><td>¥200-500/月</td><td>中</td><td>想稳定现金流的实施者</td></tr>
    <tr><td>Telegram 付费频道</td><td>$400-1,450</td><td>$0-20/月</td><td>低</td><td>非技术背景试水</td></tr>
    <tr><td>公众号代运营</td><td>¥5,000-15,000</td><td>¥200-500/月</td><td>低-中</td><td>有运营经验者</td></tr>
    <tr><td>Skill 技能包出售</td><td>$150-2,000</td><td>$0</td><td>中</td><td>开发者快速正反馈</td></tr>
    <tr><td>私域运营开源替代</td><td>节省 ¥10,000+/年/客</td><td>¥200-500/月</td><td>中-高</td><td>有信任基础的实施者</td></tr>
    <tr><td>AI Agent 外包接单</td><td>$3,000-15,000</td><td>$0-20/月</td><td>中-高</td><td>自由职业开发者</td></tr>
    <tr><td>白标授权</td><td>€2,500+（10 客户）</td><td>$0-20/月</td><td>高</td><td>全栈想做规模化</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】本地商家 AI 客服部署</h3>
  <p><strong>标签：</strong>最稳变现路径 / 餐饮·培训·零售</p>
  <p><strong>核心思路：</strong>帮商家部署 24 小时 AI 前台，接管微信/Telegram 常见咨询，定价低于商业产品 50-70%。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 选定餐饮或培训行业，搭建行业 Demo Bot</p>
  <p>2. 带平板扫街拜访，当场演示「几点关门」「怎么加盟」等问答</p>
  <p>3. 免费试用一周，转化签约（基础版 ¥3,000-5,000 + ¥500/月维护）</p>
  <p>4. 老客户转介绍，返一个月维护费激励口碑</p>
  <p><strong>选型条件：</strong>咨询量大、问题重复率高、老板忙不过来的本地商家。</p>
  <div class="highlight"><strong>落地：</strong>毛利率 75-92%；VPS ¥35-140/月 + GLM Coding Plan 额度内 API 接近零成本。</div>
  <div class="pitfall"><strong>避坑：</strong>不要线上投广告获客——现场演示转化率比发传单高一个数量级。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Skill 技能包三层变现</h3>
  <p><strong>标签：</strong>门槛最低 / 见效最快</p>
  <p><strong>核心思路：</strong>Skill 是 Markdown 格式任务定义（SKILL.md），写一次卖无数次。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 第一层：单 Skill 定价 $3-10，上架 SkillHQ.dev（卖家分成 85%）</p>
  <p>2. 第二层：打包行业套件（如电商客服 Skill 套件）定价 $100-500</p>
  <p>3. 第三层：通过 AgentGate 封装为按调用收费的 API</p>
  <p><strong>选型条件：</strong>有 2-4 小时开发时间，想最快见到收入正反馈。</p>
  <div class="quote">「Hermes 内置 155+ Skill + 88K+ Hub Skill 生态，在已有 Skill 基础上做垂直定制，而不是从零开始。」</div>
  <div class="pitfall"><strong>避坑：</strong>Skill 市场尚处早期，流量有限——适合作跳板建立品牌，天花板明显，需过渡到定制开发或外包。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Hermes vs 付费替代品成本</h3>
  <table>
    <tr><th>替代品</th><th>年成本</th><th>Hermes 年成本</th><th>年省</th><th>节省比例</th></tr>
    <tr><td>腾讯企点标准版</td><td>¥4,500</td><td>¥0-2,400</td><td>¥2,100-4,500</td><td>47-100%</td></tr>
    <tr><td>Intercom Fin</td><td>$24,252</td><td>$0-240</td><td>$24,012+</td><td>99%</td></tr>
    <tr><td>有赞 CRM 专业版</td><td>¥12,800</td><td>¥0-2,400</td><td>¥10,400+</td><td>81-100%</td></tr>
    <tr><td>Stammer.ai 白标</td><td>$5,964</td><td>$0</td><td>$5,964</td><td>100%</td></tr>
    <tr><td>Zapier Team</td><td>$5,382</td><td>$60-240</td><td>$5,142+</td><td>95-99%</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】变现路上的关键陷阱</h3>
  <p><strong>坑名：</strong>公众号代运营 100% 纯 AI 生成内容</p>
  <p><strong>原因：</strong>2026 年各平台集体打击纯 AI 代笔，内容会被标记降权。</p>
  <p><strong>原文说法：</strong>「平台态度很明确：鼓励工具辅助创作，反对完全自动化替代真人创作。」</p>
  <p><strong>解法：</strong>定位为策略师+质量控制者，AI 负责初稿和排版，人负责选题把关和审稿润色。</p>
  <p><strong>严重程度：</strong>致命——账号降权直接断收入来源。</p>
  <div class="pitfall"><strong>另一坑：</strong>私域替代过度承诺企业微信能力——Hermes 企微原生集成替代程度仅约 60%，主阵地是企微的客户需提前评估缺口。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】三条启动路线</h3>
  <p><strong>原则：</strong>选对起点比选对终点更重要——从自身技术背景和时间投入出发。</p>
  <p><strong>路线 A（非技术）：</strong>Telegram 付费频道起步 → 进阶公众号代运营（月费 ¥3,000-5,000）。</p>
  <p><strong>路线 B（有开发能力）：</strong>Skill 出售试水 → 进阶 Upwork 外包接单（$2,000-5,000/单）。</p>
  <p><strong>路线 C（全栈规模化）：</strong>本地商家 AI 客服积累案例 → 进阶白标授权（10 客户 ≈ €2,500/月）。</p>
  <div class="highlight"><strong>落地：</strong>私域替代从已有 AI 客服客户自然延伸——运行两三个月后提出「省掉有赞年费」，信任是一步步积累的。</div>
  <p><strong>适用边界：</strong>白标需独立运维多客户实例；Skill 市场流量有限不宜作唯一收入来源。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：SaaS 平台拥护者 / 「开源要自己扛运维」派</p>
  <p class="rebuttal-text">Hermes 省下的平台费会转化成你的运维负债——客户要 SLA、数据备份和故障响应，单人扛不住时，Coze 和 Dify 的月费其实是买了托管可靠性。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Hermes Apache-2.0 零授权费 + 月运营成本 ¥30-50，是高毛利变现的底层逻辑</li>
    <li>七种模式覆盖从低门槛（频道/Skill）到高规模化（白标/外包）全谱系</li>
    <li>本地商家 AI 客服是最稳路径；Skill 出售是最快正反馈</li>
    <li>对标商业产品可节省 47-99% 成本，定价空间充足</li>
    <li>变现核心是服务能力——部署、运维、行业方案，而非卖软件</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>根据技术背景选定路线 A/B/C，确定第一种变现模式</li>
    <li>搭建一个行业 Demo Bot，录制演示视频备用</li>
    <li>非技术路线：开 Telegram 频道，Hermes 自动化内容生产</li>
    <li>开发路线：花 2-4 小时写一个 Skill 上架 SkillHQ.dev 试水</li>
    <li>定价前核实最新竞品价格（数据采集 2026-06-10，行业变化快）</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「开源 = 免费没商业价值」转向「开源 = 利润空间最大化，变现来自把 Agent 能力交付给不会自建的客户」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
