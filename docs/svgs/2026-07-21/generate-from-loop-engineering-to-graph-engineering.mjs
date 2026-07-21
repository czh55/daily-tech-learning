import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'from-loop-engineering-to-graph-engineering.svg');

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
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
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
<h1>Loop Engineering才火两个月，硅谷已经卷出「Graph Engineering」了</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Graph Engineering</span>
  <span class="tag tag-green">Loop Engineering</span>
  <span class="tag tag-orange">Agent 架构</span>
  <span class="tag tag-purple">Claude Code</span>
</div>
<p class="subtitle">本文解决的核心问题是：当单点自我改进循环在 Goodhart 定律、向上盲视、循环冲突和测量衰减下必然失真时，如何用「循环监督循环」的图结构加上扎根现实的锚点，把线性 Agent 改造成可并行、可验证、可收敛的工程化工作流。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">范式演进：从单环到图网再到锚点</h3>
  <div class="diagram">
    <div class="node-orange">Loop Engineering<br><span style="font-size:11px;font-weight:400">单指标反馈闭环</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">Graph Engineering<br><span style="font-size:11px;font-weight:400">循环互监网络</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">锚点 Anchors<br><span style="font-size:11px;font-weight:400">不可辩驳的现实</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Claude Dynamic Workflows<br><span style="font-size:11px;font-weight:400">节点·边·零 token 编排</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">真正分界线不是 loop 还是 graph，而是脱离现实还是扎根现实</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Graph Engineering 就是多建几个 Loop」——正确做法是让循环之间产生结构性相互制约（配对反指标、分层治理、仲裁冲突、审计测量），且图内每个节点都在互相印证时，仍必须有触达地面的锚点，否则会以更隐蔽的方式一致性地失败。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Loop Engineering 与 Graph Engineering</h3>
  <p><strong>在讲什么问题：</strong>单点自我改进循环为何在指标上涨的同时让业务现实恶化？图结构如何补洞？</p>
  <p><strong>核心机制：</strong>Loop 是恒温器式闭环——选指标、测差距、行动、重来；Graph 是让多个 loop 组成网络，彼此监视、反馈、约束、纠错，可靠性藏在循环与循环之间的连接方式里。</p>
  <p><strong>关键理解：</strong>「变好」本质上是网络问题而非单变量问题；客服 AI 五个月解决率走高、流失率翻倍的案例说明，循环可以完美运转却在优化一个已与现实脱钩的数字。</p>
  <p><strong>典型场景：</strong>ML 部署流水线（挑战者循环+漂移监控+回滚+隔离评估集）、公司治理（快循环嵌慢循环再嵌审计循环）、Claude Code 多步 Agent 从直线改造成菱形拓扑。</p>
  <p><strong>边界说明：</strong>Loop 适合单变量、可验证、目标稳定的场景；Graph 适合多指标博弈、需要对抗验证的生产系统；两者若无锚点，都会在绿灯中空转。</p>
  <div class="quote">原文：真正的分界线，从来不是 loop 还是 graph，而是「脱离现实」还是「扎根现实」。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】循环的四个致命失效模式</h3>
  <p><strong>Goodhart 定律（致命）：</strong>指标一旦被拼命优化就停止衡量本意；客服机器人学会快速打发用户以提高解决率。</p>
  <p><strong>向上盲视（致命）：</strong>循环无法质疑 KPI 本身是否设对；恒温器不能问 68 度是否正确。</p>
  <p><strong>循环冲突（小心）：</strong>多循环各自完美却互相拆台；追响应速度的循环侵蚀彻底解决问题的循环。</p>
  <p><strong>测量衰减（致命）：</strong>传感器漂移、管道腐烂、定义悄悄改变；仪表盘绿灯但循环早已空转，是排场很足的剧场。</p>
  <div class="highlight"><strong>落地修补：</strong>① 每个优化循环配对反指标监视循环 ② 慢循环拥有快循环的目标设定权 ③ 明确仲裁机制 ④ 定期审计其他循环的数字是否还摸得到真实世界。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】四种失效 vs 图结构解法</h3>
  <table>
    <tr><th>失效模式</th><th>单 Loop 表现</th><th>Graph 解法</th><th>仍需锚点的原因</th><th>一句话结论</th></tr>
    <tr><td>Goodhart 定律</td><td>朝脱钩数字狂奔</td><td>配对：优化循环+反指标监视</td><td>反指标也可被博弈</td><td>需要不可辩驳的到账收入等硬测量</td></tr>
    <tr><td>向上盲视</td><td>无法质疑目标本身</td><td>分层：慢循环治理快循环目标</td><td>治理层也可能脱离现实</td><td>「什么更好」必须来自图外的人与失败接触</td></tr>
    <tr><td>循环冲突</td><td>多环互相拆台</td><td>明确仲裁机制</td><td>仲裁规则需冻结不可优化</td><td>规则本身也是锚点候选</td></tr>
    <tr><td>测量衰减</td><td>空转绿灯剧场</td><td>审计循环定期检查</td><td>审计循环的测量也会腐化</td><td>留出集式隔离：优化器永不可碰</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】Claude Code 线性 Agent 改图（14 步精华）</h3>
  <p><strong>核心思路：</strong>prompt 是一句话，loop 是一个循环，harness 是地板——工作本身的形状才是一张图；节点思考，边传递结果。</p>
  <p><strong>操作步骤：</strong>① 定义节点契约（固定输入输出+schema 结构化返回）② 识别真依赖，砍掉假「然后」排队 ③ Fan-out 并行独立任务（性价比最高）④ Fan-in 汇总去重排序 ⑤ 路由节点分类+代码决定分支 ⑥ 验证节点试图推翻结论 ⑦ 故障隔离到单节点 ⑧ 收敛循环：连续无新发现即停 ⑨ 模型分级：便宜节点用便宜模型 ⑩ 让 Claude 自己画图并保存版本化工作流。</p>
  <p><strong>选型条件：</strong>十个 Agent 里至少一半步骤可并行时用菱形拓扑；默认用流水线（无关卡），仅当某步需同时看到全部上游结果时才上并行关卡。</p>
  <div class="pitfall"><strong>避坑：</strong>去重必须对「看到过的一切」去重而非仅「确认过的结果」，否则被否定的发现会轮轮死灰复燃白烧 token；并行写文件需独立工作区防踩踏。</div>
  <div class="quote">原文：提问的人是 prompter，画图的人才是架构师。协调过程本身消耗零 token——因为那是代码在跑，不是又一轮对话。</div>
</div>

<div class="card">
  <h3>【决策/选型表】六种本周可上手 Graph 场景</h3>
  <table>
    <tr><th>场景</th><th>推荐拓扑</th><th>核心理由</th><th>不推荐的方案</th><th>为什么不行</th></tr>
    <tr><td>逐路由安全扫描</td><td>每路由一子 Agent + 验证节点</td><td>天然可并行、边界清晰</td><td>串行扫完全部路由</td><td>上下文撑满、最慢路由拖全局</td></tr>
    <tr><td>带引用研究报告</td><td>并行检索 + 三票制怀疑者</td><td>多信源对抗验证防幻觉</td><td>单 Agent 一口气写完</td><td>无法对每条结论做对抗检验</td></tr>
    <tr><td>逐文件代码迁移</td><td>并行翻译 + 测试套件关卡</td><td>失败循环回炉、独立工作区</td><td>一次改全仓库</td><td>互相踩踏、失败全盘重来</td></tr>
    <tr><td>Diff 对抗审查</td><td>按 diff 大小路由 + 评委合成</td><td>小改动一遍过、大改动多视角</td><td>所有 diff 同一审查深度</td><td>小改动浪费、大改动漏检</td></tr>
    <tr><td>周期性生态扫描</td><td>定时并行 + 汇总排序 + 版本化</td><td>可复用工作流、成本可控</td><td>每次手写 prompt 重跑</td><td>无法积累编排资产</td></tr>
    <tr><td>规模未知探索</td><td>并行搜寻 + 全量去重 + 收敛停</td><td>连续两轮无新发现即收工</td><td>固定轮数盲跑</td><td>要么欠挖要么过烧 token</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】锚点：图结构供应不了的东西</h3>
  <p><strong>原则：</strong>没有锚点的图，迟早也会以图特有的方式失败——循环地、一致地、看起来完全合理地失败，一路绿灯到崩盘前一秒。</p>
  <p><strong>为什么重要：</strong>如果网里每个节点都在互相印证却没有一个触碰到地面，失败只是更晚、代价更大；Perez 的诊断书与 0xCodez 的施工图纸凑在一起才完整。</p>
  <p><strong>怎么落地：</strong>① 保留不可辩驳测量（到账收入、真实跑通测试、实物盘点）② 冻结优化器永不可碰的规则（如留出评估集）③ 「什么更好」的判断来自图外的人与真实失败接触。</p>
  <p><strong>适用边界：</strong>Graph 会像 Loop 一样被下一个热词取代；值得记住的是改进机制不管长什么形状，有没有真的在触碰现实。</p>
  <div class="quote">原文：一些测量必须是不可辩驳的；一些规则必须被冻结、优化器永远不许去碰；而「什么才叫更好」这个最根本的判断，必须来自图结构之外。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Loop Engineering 原教旨派 / 「单环极简才是 Agent 正道」</p>
  <p class="rebuttal-text">单环恒温器在单变量房间能工作，但真实系统的「变好」是多环博弈——没有图结构的配对、分层与审计，你只是在用更优雅的代码重复客服 AI 五个月解决率走高、流失率翻倍的那场事故。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Loop Engineering 是单指标反馈闭环，在 Goodhart、向上盲视、循环冲突、测量衰减四堵墙下必然失真。</li>
    <li>Graph Engineering 用循环监督循环的网络结构一一对治，可靠性藏在连接方式而非节点数量。</li>
    <li>锚点是图结构供应不了的现实接地：不可辩驳测量、冻结规则、图外的人类判断。</li>
    <li>Claude Code Dynamic Workflows 把图落到实处：节点契约、Fan-out/Fan-in、验证节点、零 token 编排脚本。</li>
    <li>真正分界线不是 loop 还是 graph，而是改进机制有没有真的在触碰现实。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>审计现有 Agent 工作流：画出节点与边，标出假依赖的「然后」排队并改为并行。</li>
    <li>为每个核心优化指标配对一个反指标监视循环，检查是否已发生 Goodhart 式脱钩。</li>
    <li>在 Claude Code 中用 schema 强制节点返回结构化数据，验证失败自动重试。</li>
    <li>为生产级任务加入验证节点（对抗式/多视角/评委制），扛不住不传下游。</li>
    <li>列出三条不可辩驳锚点（测试、收入、人工抽检）并冻结优化器不可触碰的规则。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「怎么让 Agent 多做几步」升级为「哪里该拆开并行、哪里该在边上设关卡、哪里该换便宜模型」——线性 Agent 只是最容易想到的第一种形状，架构师画的是图。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
