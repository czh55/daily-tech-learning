import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'uber-ai-software-factory-cost-optimization.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
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
<h1>起底Uber AI软件工厂：智能体用量暴涨9.4倍，账单却纹丝不动</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">AI 软件工厂</span>
  <span class="tag tag-green">成本方程式</span>
  <span class="tag tag-orange">MCP CLI 化</span>
  <span class="tag tag-purple">Code-Mode</span>
  <span class="tag tag-red">Context Graph</span>
</div>
<p class="subtitle">本文解决的核心问题是：当智能体周请求量暴涨 9.4 倍、70% PR 由 AI 主导时，Uber 如何把总 AI 支出锁在 4 月以来的水平——不是靠少用，而是把总花费拆成六个可度量变量，并在模型路由、Token 减重、请求效率、组织可见性四条杠杆上逐项消灭零价值消耗。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Uber 成本方程式：六个变量的因果链</h3>
  <div class="diagram">
    <div class="node">用户数<br>× 人均会话</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">每会话轮次<br>× 每轮请求</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">每请求 Token<br>× 单 Token 价</div>
    <span class="arrow-sym">=</span>
    <div class="node-purple">总花费</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">前两项是 Uber 希望做大的「采用度」；中间三项是浪费藏身之处；Price/Token 靠基准测试选帕累托最优模型</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「AI 用量涨 7 倍，账单必然爆炸」。Uber 用固定模型版本的对照实验证明：每千次请求成本降 34%、每会话成本降 52%——成本失控是工程问题，不是用量与价格的宿命线性关系。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】软件工厂四层架构与成本可控性</h3>
  <p><strong>在讲什么问题：</strong>为什么 Uber 把 AI 使用场景分成四个层级，且越往上越能拿捏成本与质量。</p>
  <p><strong>核心机制：</strong>从专用工具 → 交互式 Harness → 托管智能体 → 自治智能体，任务边界越明确、评测基准越可建，模型选型越能走帕累托前沿而非「一个旗舰模型打天下」。</p>
  <p><strong>关键理解：</strong>3600+ Agent Skills、日执行 3 万+ 次、70% PR 由 AI 主导——增长发生在托管/自治层，团队能完全掌控 Harness、路由与运营开销。</p>
  <p><strong>典型场景：</strong>uReview 全量 PR 评审、CI 失败自愈、on-call 分诊——边界清晰、可批量评测的 SDLC 环节。</p>
  <p><strong>边界说明：</strong>交互式终端会话需求五花八门，逐个优化难；战略方向是把人类驱动流程迁移到托管智能体舰队。</p>
  <div class="quote">原文：「运营一支专属评测基准 + 帕累托最优模型武装到位的托管智能体舰队，天然更省钱，也更容易规模化。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】MCP CLI 化 + Tool Search + Code-Mode</h3>
  <p><strong>方法名：</strong>Token 减重三板斧 · 标签：MCP 网关、Shell 执行、脚本批处理</p>
  <p><strong>核心思路：</strong>标准 MCP 预加载 100+ 工具 Schema 约 5–7 万 Token 且每轮重发；CLI 化让 Schema 零进上下文，Tool Search 按需加载，Code-Mode 把轮询/翻页压进子进程只回摘要。</p>
  <p><strong>操作步骤：</strong>1) 1000+ MCP 映射为 CLI 命令经统一网关 → 2) 模型先搜索工具目录再加载定义 → 3) 高频 Server 部署 25+ Code-Mode 技能默认走脚本路径 → 4) SaaS MCP 同样 CLI 化并写专属技能封装工作流</p>
  <p><strong>选型条件：</strong>话痨型协议（SQL 轮询 2–5 次）、批量 N 轮交互、第三方 SaaS 49 工具 2.2 万 Token Schema——优先 Code-Mode。</p>
  <div class="highlight"><strong>落地建议：</strong>核算团队 MCP 预加载 Token；把内部工具网关 CLI 化；为 TOP 访问 MCP 写 Python 循环技能，中间状态不进模型视野。</div>
  <div class="quote">原文：「SELECT * 宽表查询 LLM 工具模式 143 万 Token vs Code-Mode 900 Token，约 100% 节省。」</div>
</div>

<div class="card">
  <h3>【决策/选型表】模型、缓存 TTL 与 Harness 默认值</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>托管智能体模型选型</td><td>真实 PR/任务建 benchmark → 帕累托前沿选模</td><td>uReview 换模 F1 升、单次评审成本大降</td><td>拍脑袋选旗舰</td><td>无法在成本-效果平面上定位最优</td></tr>
    <tr><td>交互式子智能体</td><td>默认路由便宜模型，主模型拆解+评估</td><td>子任务边界清晰，不需旗舰推理</td><td>子智能体也用 Opus 级</td><td>Requests/Turn 杠杆失控</td></tr>
    <tr><td>主会话 Prompt Cache TTL</td><td>1 小时（工程师常停顿 &gt;5 分钟）</td><td>避免 5 分钟 TTL 频繁失效全价重建</td><td>盲目用 5 分钟默认</td><td>1h 写入 2× 溢价，但停顿分布决定经济学</td></tr>
    <tr><td>子智能体 TTL</td><td>保留 5 分钟</td><td>短生命周期单一任务</td><td>与主会话同 TTL</td><td>浪费长缓存写入溢价</td></tr>
    <tr><td>交互式 Harness 默认</td><td>40 万 Token 压缩阈值 + 中等推理强度</td><td>平衡表现、缓存命中、输出 Token 倍数计费</td><td>开满 100 万上下文 + 高推理</td><td>重复输入与推理 Token 成本最高</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】MCP 直连 vs CLI 网关 vs Code-Mode</h3>
  <table>
    <tr><th>维度</th><th>标准 MCP 预加载</th><th>CLI + Tool Search</th><th>Code-Mode 脚本</th><th>一句话结论</th></tr>
    <tr><td>会话启动 Token</td><td>5–7 万 Schema 先入上下文</td><td>接近零（按需解析）</td><td>零中间轮询进上下文</td><td>隐性杀手在「用户还没打字」</td></tr>
    <tr><td>轮询型任务</td><td>每步一轮模型交互</td><td>仍可能多轮</td><td>Python 循环子进程跑完</td><td>小结果集也能省 50%+ 固定开销</td></tr>
    <tr><td>SaaS 多工具 Server</td><td>2–3 个 Server Schema 超编辑文件</td><td>CLI 映射 + 专属技能</td><td>封装常见工作流</td><td>厂商暴露全能力，客户必须二次封装</td></tr>
    <tr><td>适用边界</td><td>工具少、交互简单</td><td>千级工具库扩容</td><td>边界清晰可脚本化子任务</td><td>三者互补而非互斥</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】AI Context Graph 压低 Requests/Turn</h3>
  <p><strong>在讲什么问题：</strong>缺上下文的智能体不会快速失败，而是缓慢、反复、用越来越长的上下文搜索。</p>
  <p><strong>核心机制：</strong>2400 万节点、8000 万边、86 种节点类型，整合 30+ 内部系统——服务、团队、故障、PR、架构文档、表使用历史。</p>
  <p><strong>关键理解：</strong>有图谱：38 秒答对分析师常用表；无图谱：20 分钟、2 个子智能体、3 次报错、错误结论「数据集无法查询」。</p>
  <p><strong>怎么落地：</strong>数亿行代码 + 数千张表场景，优先把「找信息」结构化，再谈「写代码」。</p>
  <div class="relation">与 Prompt Cache 的关系：图谱减少无效搜索轮次，Cache 减少重复前缀付费——一个降 Requests/Turn，一个降 Tokens/Request。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】16 类浪费模式与治理反模式</h3>
  <p><strong>坑名：</strong>在用户输入前预加载 10 万 Token 系统指令与工具定义</p>
  <p><strong>原因：</strong>MCP Schema 预加载 + 臃肿系统 Prompt 叠加。</p>
  <p><strong>解法：</strong>CLI 化、Tool Search、会话分析仪表盘 trace 自动识别反模式。</p>
  <p><strong>严重程度：</strong>致命——每轮对话复利放大。</p>
  <div class="pitfall"><strong>40KB MCP 响应滞留上下文：</strong>后续每一轮都为它重复付费；应压缩或及时剔除。</div>
  <div class="pitfall"><strong>旗舰模型跑简单多轮会话：</strong>Session Analysis 标注「模型路由不合理」——应用更便宜模型完成。</div>
  <div class="pitfall"><strong>硬性配额封顶：</strong>工程师束手束脚；Uber 用状态栏实时计数 + 50%/80%/100% Slack 提醒 + 快速升档审批。</div>
  <div class="pitfall"><strong>无度量先优化：</strong>没有每千次请求成本、每会话成本、托管智能体单位产出成本，优化只能是拍脑袋。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】成本可见性与「工厂成熟度」</h3>
  <p><strong>原则：</strong>把模糊的「AI 太贵了」转化为可拆解、可量化、可逐项优化的工程问题。</p>
  <p><strong>为什么重要：</strong>7 倍周活、9.4 倍请求量与总支出持平并存——证明采用度与成本可解耦。</p>
  <p><strong>怎么落地：</strong>建立 Portfolio / Unit Economics / Model Economics / Driver Decomposition / Managed Agent Outcomes 五维监控；新托管智能体统一流程：定产出指标 → 建 benchmark → 帕累托选模。</p>
  <p><strong>适用边界：</strong>具体降本幅度因代码库规模、团队构成、工作流而异；方法论普适，数字不可照搬。</p>
  <div class="quote">原文：「AI 编程开销的失控，本质上是一个可以被工程化解决的问题——关键不在于死磕更低的单价，而在于系统性地消灭零价值 Token 消耗。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「先规模化再谈 ROI」派 · 国内赶 AI 编程 KPI 的管理层</p>
  <p class="rebuttal-text">Uber 有 3600 技能、统一网关和 2400 万节点图谱——中小团队照搬 CLI 化与 Context Graph 的前置工程成本，可能比先放任账单增长更拖慢交付。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>总花费 = 用户×会话×轮次×请求×Token×单价；中间三项是优化主战场，前两项应鼓励增长。</li>
    <li>Price/Token：真实工作 benchmark + 帕累托前沿选模；子智能体默认便宜模型是最大杠杆之一。</li>
    <li>Tokens/Request：40 万压缩阈值、Prompt Cache TTL 按停顿分布调、MCP CLI 化清零 Schema 预加载、Code-Mode 消灭轮询复利。</li>
    <li>Requests/Turn：AI Context Graph 把「找信息」从 20 分钟探索压到 38 秒精确查询。</li>
    <li>可见性：状态栏实时成本、16 类反模式仪表盘、分级预算而非硬封顶——文化与技术同为杠杆。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>建立每千次请求成本、每会话成本、托管智能体单位产出等细粒度指标，再启动优化。</li>
    <li>审计 MCP 预加载 Token；评估 CLI 网关 + Tool Search 改造 ROI。</li>
    <li>分析团队会话停顿分布，调整 Prompt Cache TTL（主会话 vs 子智能体可不同）。</li>
    <li>为 SQL/轮询/批量类工具编写 Code-Mode 技能，中间状态不进模型上下文。</li>
    <li>上线成本可见性：终端计数器或 trace 仪表盘，识别模型路由与上下文臃肿等浪费模式。</li>
  </ol>
  <p><strong>关键认知转变：</strong>用量暴涨与账单持平可以并存——AI 成本不是「少用」问题，而是「把零价值 Token 工程化消灭」问题；长期应把交互式流程迁移到可评测、可路由的托管智能体工厂层。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
