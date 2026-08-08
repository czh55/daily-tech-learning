import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-proposal-process-overhaul-2026.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
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
<h1>Go 核心团队公开新提案流程设计：加权投票、多轨评审，能拯救积压的近千个提案吗？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 提案流程</span>
  <span class="tag tag-green">开源治理</span>
  <span class="tag tag-orange">Triage 分诊</span>
  <span class="tag tag-purple">多轨道评审</span>
  <span class="tag tag-red">排队论 SITA</span>
</div>
<p class="subtitle">本文解决的核心问题是：Go 提案 backlog 年增 23%、中位等待超两年且优先级不透明，Austin Clements 提出的 Incoming→Ready→Active→Decided 四阶段流程，能否用 Triage 小组、加权社区投票、领域轨道与时间盒争议度分级，把「入口堵、排队无规则、出口烂尾」系统性拆开而不变成新的官僚瓶颈？</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">新提案流程：四阶段 × 四大机制</h3>
  <div class="diagram">
    <div class="node">Incoming<br>新入提案</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Triage 3–5人<br>异步投票分诊</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Ready + 加权投票<br>排审查优先级</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">Active 多轨道<br>时间盒按争议度</div>
    <span class="arrow-sym">→</span>
    <div class="node-red">Decided<br>Final Review 一致性</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">社区投票只影响「何时审查」，最终接受/拒绝仍由专家委员会共识决定</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：emoji 点赞等于「投票定生死」。官方 FAQ 明确社区票仅调优先级，approver 一票 5 分、普通用户 1 分是为防 Sybil 与带节奏；没有点踩是为避免负面刷屏压制有价值争议。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Go 提案 backlog 到底卡在哪</h3>
  <p><strong>在讲什么问题：</strong>2015 年起的开放提案机制曾支撑 Go 务实演进，但十年累积后入口、排队、出口三处同时失灵。</p>
  <p><strong>核心机制：</strong>积压年增 23%，中位年龄超两年；无正式优先级，谁先被看全凭运气；Triage 靠志愿者硬扛且易引争议；已接受提案长期未实现形成 frontlog；单一评审委员会人少领域广，专业匹配不足。</p>
  <p><strong>关键理解：</strong>这不是「再加人手」能解的——Brooks 定律下加人反而拖慢；需要可预测、可扩展的流程重构。</p>
  <p><strong>典型场景：</strong>你提 issue 两年无回音、或提案被接受后代码里永远见不到。</p>
  <p><strong>边界说明：</strong>改革针对 golang/go 提案治理，不直接解决实现资源分配与 release 排期。</p>
  <div class="quote">「入口在堵、排队没有规则、出口后也可能烂尾。」——Austin Clements 对现状的概括</div>
  <div class="relation"><strong>相关概念：</strong>frontlog（已接受未实现）与 backlog（待评审）是两条不同积压线，吞吐提升可能加剧前者。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】正式化 Triage 小组：给初筛定规矩</h3>
  <p><strong>核心思路：</strong>3–5 人专职异步投票做「体检」，可逆、轻量，不是终审。</p>
  <p><strong>操作步骤：</strong>① 成员独立投票（投票前看不到他人票，防羊群效应）→ ② 三选一：关闭票（需 2/3 且至少 2 票）、进入评审票（附 track/优先级/争议度，1/3 且至少 2 票，机制向放行倾斜）、要求补充信息（30 天无回应转关闭）→ ③ 被关闭可申诉重回队列。</p>
  <p><strong>选型条件：</strong>适合过滤明显不值得评审的提案；不适合替代领域专家的技术终裁。</p>
  <div class="pitfall"><strong>避坑：</strong>Triage 若滥用 write-in 关闭理由或耗时失控，会异化成「第二道提案委员会」——Austin 计划监控分诊耗时并定期审查 write-in。</div>
  <div class="highlight"><strong>落地：</strong>小众但重要的提案可在 Triage 直接标 high/next major 优先级，绕开纯人气投票。</div>
</div>

<div class="card">
  <h3>【决策/选型表】争议度分级与时间盒</h3>
  <table>
    <tr><th>争议度</th><th>特征</th><th>决策时长参考</th><th>周例会时间盒</th></tr>
    <tr><td>Trivial</td><td>定义清晰、无兼容性问题</td><td>数天</td><td>15 分钟</td></tr>
    <tr><td>Minor</td><td>局部改动、命名/签名细节</td><td>数周</td><td>20 分钟</td></tr>
    <tr><td>Substantial</td><td>新能力或新心智模型</td><td>数月</td><td>25 分钟</td></tr>
    <tr><td>Contentious</td><td>技术权衡重、生态影响大</td><td>数季度到数年</td><td>25 分钟</td></tr>
  </table>
  <p><strong>所以呢：</strong>借鉴排队论 SITA（按任务规模分区间分配），把重尾分布里的「大提案」与「小修补」分流，避免超市排队里一个大件堵死快速通道。</p>
  <div class="relation"><strong>与旧流程对比：</strong>过去所有提案挤单队列；现在按语言、Go 命令、工具链、安全等轨道并行，吞吐与专业匹配同步提升。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】旧流程 vs 新流程关键差异</h3>
  <table>
    <tr><th>维度</th><th>现行流程痛点</th><th>新提案设计</th><th>一句话结论</th></tr>
    <tr><td>优先级</td><td>无正式机制，靠运气与注意力</td><td>Triage 初始分 + 加权 emoji（50/25/10 基础分）</td><td>可预测性提升，但权重仍在打磨</td></tr>
    <tr><td>评审组织</td><td>单一委员会，Brooks 定律瓶颈</td><td>多领域轨道 + Final Review 只查设计一致性</td><td>专业度与吞吐兼得，一致性靠保险丝</td></tr>
    <tr><td>社区参与</td><td>点赞中位数仅 1，几乎无官方权重</td><td>approver 5 分 / 用户 1 分，仅调审查顺序</td><td>参与感增强，不等于民主决选</td></tr>
    <tr><td>决策公示</td><td>接受后可能石沉大海</td><td>Likely Accept/Decline 公示 5–7 天；frontlog 拟「冰箱」机制</td><td>出口烂尾被正视，但实现仍缺硬约束</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】社区已点名的三类风险</h3>
  <p><strong>坑 1：小众提案永远吃不到票</strong>——Windows 等细分场景天然关注度低。<strong>解法：</strong>Triage high 优先级权重足够大，不必依赖社交媒体式突击点赞。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑 2：Triage 变新瓶颈</strong>——write-in 关闭被滥用、分诊耗时上升。<strong>解法：</strong>监控指标 + 定期审查关闭理由。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑 3：frontlog 吞噬新评估</strong>——已接受未实现特性与新提案交互评估更难。<strong>解法：</strong>拟对 Accepted 加时间窗，超期进「冰箱」可快速重激活。<strong>严重程度：</strong>致命（若忽视会架空评审吞吐提升）。</p>
  <div class="pitfall"><strong>别踩：</strong>把社区 emoji 当成「拉票就能合并」——最终仍须赛道委员会专家共识，且无点踩不等于无争议。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】开放透明 + 专家决策不变，工程化的是协作</h3>
  <p><strong>原则：</strong>流程改革不推翻「任何人可提案、讨论公开、专家审慎决策」的宪法，而是在每一环加结构化规则与工具。</p>
  <p><strong>为什么重要：</strong>Go 曾靠近乎僵化稳定性转型务实演进；若协作机制跟不上提案量，语言演进会再次停滞。</p>
  <p><strong>怎么落地：</strong>关注 golang/go#80580 讨论；提提案时主动标注争议度与领域；用规范 emoji 表达优先级而非带节奏刷屏。</p>
  <p><strong>适用边界：</strong>机制再精巧也需一到两年实跑验证；多处标注为 open question，细节仍待社区打磨。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「少开会多写代码」的资深贡献者 / 担心流程膨胀派</p>
  <p class="rebuttal-text">你把评审拆成五轨道再加 Triage、Final Review 和加权投票，只是在 backlog 前面又叠了三层闸门——评审吞吐上去了，实现人手没增加，frontlog 只会更厚，提案流程越「健壮」用户越等不到代码落地。</p>
</div>

<div class="conclusion">
  <h2>结论与行动</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>积压量化曝光：年增 23%、中位等待超两年，Volunteer Triage 与单委员会是结构性瓶颈。</li>
    <li>四阶段生命周期 + 正式 Triage + 多轨道 + SITA 时间盒，目标是把不可预测排队变成可扩展工程流程。</li>
    <li>社区投票首次进入官方优先级公式，但只调「何时审查」，不调「是否接受」。</li>
    <li>frontlog、Triage 膨胀、小众提案公平性是社区最现实的担忧，部分已有回应仍待迭代。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>阅读 Austin Clements 原文讨论：<a href="https://github.com/golang/go/discussions/80580" style="color:#bfdbfe">golang/go#80580</a>，在 open question 处留下有论据的评论。</li>
    <li>若你持有待审提案：检查是否信息充分，避免落入「要求补充信息 → 30 天自动关闭」路径。</li>
    <li>参与社区优先级时：approver 身份权重更高，普通开发者可用规范 emoji 支持重要但冷门提案。</li>
    <li>评估自己提案时：提前自评争议度（trivial 到 contentious），选对赛道与时间预期。</li>
    <li>跟踪 frontlog「冰箱」机制进展——Accepted 长期未实现会影响你与他人的新提案交互评估。</li>
  </ol>
  <p><strong>关键认知转变：</strong>Go 提案危机本质是组织协作与重尾工作负载问题，不是「再找一个英雄志愿者」能扛住的；加权投票不是民粹化，而是用防刷设计把社区信号接入排队系统，同时把技术终裁留给分轨专家。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
