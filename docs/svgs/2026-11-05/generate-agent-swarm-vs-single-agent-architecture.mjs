import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'agent-swarm-vs-single-agent-architecture.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ede9fe,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#5b21b6,#3730a3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-violet{background:#ede9fe;color:#5b21b6}.tag-indigo{background:#e0e7ff;color:#3730a3}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #7c3aed}
.card h3{font-size:22px;font-weight:700;color:#6d28d9;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ede9fe,#c4b5fd);border:2px solid #a78bfa;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#5b21b6}
.node-em{background:linear-gradient(135deg,#e0e7ff,#93c5fd);border-color:#6366f1;color:#3730a3}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#5b21b6,#3730a3);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#ede9fe;padding:10px 12px;text-align:left;font-weight:700;color:#5b21b6;border-bottom:2px solid #c4b5fd}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Agent Swarm 与 Single Agent：两条并行的架构路</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-violet">上下文并行</span>
  <span class="tag tag-indigo">Subagent 合并</span>
  <span class="tag tag-slate">协调成本</span>
</div>
<p class="subtitle">本文解决的核心问题是：在上下文窗口、推理算力与 Agent 间协调成本都有限的前提下，何时应把能力留在单一执行循环里，何时值得拆成 Subagent、持久化 Agent 乃至 Swarm 式横向协作——以及如何用端到端评测在「合并」与「拆分」之间做可测量的架构决策。</p>

<div class="map">
  <h3 style="font-size:20px;color:#6d28d9;margin-bottom:12px;text-align:center">信息流动：瓶颈与解法</h3>
  <div class="diagram">
    <div class="node">单上下文上限</div><span class="arrow-sym">→</span>
    <div class="node node-em">压缩 / 外置 / Subagent</div><span class="arrow-sym">→</span>
    <div class="node">持久化多上下文</div><span class="arrow-sym">⇄</span>
    <div class="node node-em">过度拆分则协调税</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">Hallerite 扩上下文并行；Anthropic 在模型已能单循环时主张 fold 回主 Agent</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：Single Agent 与 Agent Swarm 是互斥阵营、必须站队。实际上两者讨论<strong>同一权衡的不同侧面</strong>——前者强调减少不必要的上下文边界，后者强调不要把所有工作记忆挤进一个窗口。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】上下文并行 vs 计算并行</h3>
  <p><strong>在讲什么问题：</strong>多 Agent 的价值是否等于「多开几个模型一起跑」？</p>
  <p><strong>关键理解：</strong>独立上下文可同时保留多份「工作记忆」；持久化 Agent 让已建立的代码理解、排除过的假设可被反复调用，而不只是任务结束就销毁的 Subagent。</p>
  <p><strong>和其他概念关系：</strong>计算并行适合互不依赖的子任务；上下文并行适合同一领域知识被多任务反复引用。</p>
  <p><strong>怎么落地用：</strong>识别团队是否反复为「前端/安全/数据层」重建调查上下文——若是，评估长期存活的专业 Agent 或共享记忆，而非每次 spawn 临时 Subagent。</p>
  <p><strong>边界说明：</strong>持久化 Agent 仍面临压缩、知识过时、状态同步；不是「永远准确的全知分身」。</p>
  <p><strong>原文依据：</strong>「多 Agent 不只是把计算并行化，也可以把上下文并行化。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Single Agent 循环 + Skills / 渐进式披露</h3>
  <p><strong>核心思路：</strong>一个执行循环持续看到原始工具结果并修正计划，按需加载 Skills 与 Tools，而非每跨 Agent 边界就交接摘要。</p>
  <p><strong>操作步骤：</strong>① 梳理 Subagent 是否连续调用、共享同一批数据 → ② 将流程与领域规则写入 Skills，实时数据走 Tools → ③ 短说明 + 按需展开详细 Skill 正文 → ④ 保留并行工具调用与外部记忆，但不默认拆上下文。</p>
  <p><strong>选型条件：</strong>工作流前后步骤强依赖同一中间结论、模型已能在单循环内规划与纠错时优先单 Agent。</p>
  <p><strong>避坑：</strong>把「架构图画得专业」当成拆分理由；Anthropic 观察到部分多 Agent Token 为单 Agent 3～10 倍、延迟约 2 倍（场景相关，非普适定律）。</p>
  <p><strong>对比相邻方法：</strong>树状 Subagent 编排 vs 单循环——后者减少摘要链路上的信息损失，前者适合硬隔离权限与验证。</p>
  <p><strong>原文引用：</strong>「除非确实需要独立上下文，否则优先让同一个 Agent 保持对任务全过程的理解。」</p>
</div>

<div class="card">
  <h3>【跨概念对比表】Compaction / 外置记忆 / Subagent / 持久化 Agent</h3>
  <table>
    <tr><th>机制</th><th>解决什么</th><th>主要损失</th><th>一句话结论</th></tr>
    <tr><td>Compaction</td><td>窗口上限</td><td>总结时不知未来何细节关键</td><td>长任务可用，但每次总结都是下注</td></tr>
    <tr><td>外部记忆</td><td>细节留存</td><td>「文件在」≠ Agent 知何时读；理解不随文件迁移</td><td>需检索策略与元数据</td></tr>
    <tr><td>临时 Subagent</td><td>主上下文免污染</td><td>任务结束上下文丢弃，重复调查</td><td>问题明确后再派调查员</td></tr>
    <tr><td>持久化 Agent</td><td>可复用专业上下文</td><td>压缩、过时、占用与同步</td><td>Swarm 方向的核心构件</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】任务特征 → 架构倾向</h3>
  <table>
    <tr><th>场景</th><th>推荐方向</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>连续工作流、前后共享大量中间信息</td><td>单 Agent 循环</td><td>减少交接摘要损失</td><td>每步独立 Subagent</td><td>协调税 &gt; 隔离收益</td></tr>
    <tr><td>多条独立研究/验证路径</td><td>多 Agent 并行</td><td>边界清晰、只交换结论</td><td>强行单上下文塞满探索</td><td>污染主 Agent 注意力</td></tr>
    <tr><td>独立权限、审批、验证隔离</td><td>专业 Subagent</td><td>安全与合规边界</td><td>为「简化架构」合并退款/高危操作</td><td>丢掉权限边界</td></tr>
    <tr><td>跨分支反复需要同一专业知识</td><td>持久化 Agent / 共享状态</td><td>避免树状根节点瓶颈</td><td>纯树状逐级上报</td><td>根上下文再次成为瓶颈</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】多 Agent 工程化</h3>
  <p><strong>坑名：</strong>为组织图拆分 Agent。<strong>原因：</strong>每增 Agent 增提示词、上下文、接口与评测面。<strong>解法：</strong>先问「获得了单 Agent 无法经济获得的能力吗」。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>把 Compaction 当无损续命。<strong>原因：</strong>间歇性故障线索可能在总结时被当噪声丢弃。<strong>解法：</strong>关键调查路径保留原始日志引用或外置索引。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>架构大改无基准。<strong>原因：</strong>Agent 随机性掩盖单次侥幸成功。<strong>解法：</strong>10+ 真实任务样例、比质量/成本/延迟、一次只动一块。<strong>严重程度：</strong>致命。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】优化信息流动，而非崇拜 Agent 数量</h3>
  <p><strong>原则：</strong>竞争焦点是「以更低协调成本，让正确信息在正确时间到达正确 Agent」。</p>
  <p><strong>为什么重要：</strong>树状编排规模变大时，专业知识困在分支、根节点协调再次吃满上下文；Mesh/Swarm 探索横向求助，但去中心化也有通信与责任模糊成本。</p>
  <p><strong>怎么落地：</strong>从单 Agent 起步；仅在可测量收益处引入多 Agent；合并的是<strong>不必要的上下文边界</strong>，不是权限/验证/安全边界。</p>
  <p><strong>适用边界：</strong>模型能力持续上升时，过于僵硬编排可能限制新模型自行规划——架构应可随评测结果 fold 与 unfold。</p>
  <p><strong>原文支撑：</strong>「两者并不矛盾……是构建高效 AI 系统时可以灵活组合的工程工具。」</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：多 Agent 平台厂商 / 「组织即架构」派</p>
  <p class="rebuttal-text">把 Subagent 全 fold 回主循环会在合规审计、职责分离和故障追责上把「一个超级上下文」变成单点黑箱——协调成本降下来，治理与可解释性可能一起崩盘。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Agent 架构争论的底层是上下文容量、信息损失与协调成本的权衡，不是数量崇拜。</li>
    <li>Compaction、外置记忆、Subagent、持久化 Agent 各解决不同瓶颈，且都有信息损失或维护代价。</li>
    <li>Anthropic 主张在污染、真并行、专业化隔离三类场景才值得独立上下文；否则优先单循环 + Skills/Tools。</li>
    <li>大规模系统可能需 Swarm 式共享状态与横向协作，但应与层级编排动态组合，而非二选一。</li>
    <li>端到端评测（质量、Token、延迟、失败率）是合并/拆分的唯一可靠依据。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>列出当前 Subagent 调用链：是否连续、是否共享数据——优先合并高频连续对。</li>
    <li>建立 10+ 条真实任务基准，记录 fold 前后成功/失败翻转与 Token、耗时。</li>
    <li>对反复需要的领域上下文，试点持久化 Agent 或共享 Git/任务状态，而非重复 spawn。</li>
    <li>保留退款、发布、高危工具等权限 Subagent，不因「架构简化」取消边界。</li>
    <li>阅读 Hallerite《On the Nature of the Swarm》与 Anthropic fold 文章，对照自家编排是树状、单循环还是混合。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>高效 Agent 系统既不是包办一切的巨型 Agent，也不是互相转发摘要的小 Agent 群——而是知道哪些信息必须同上下文、哪些工作可并行、哪些记忆值得长期保留。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
