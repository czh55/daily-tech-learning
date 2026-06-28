import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'google-ai-in-sre.svg');

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
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:160px;font-weight:700;font-size:16px;color:#1e40af}
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
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>谷歌 SRE 重磅白皮书：当 AI 自动写出 10 倍代码，谁来阻止系统崩溃？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">SRE 运维</span>
  <span class="tag tag-green">AI Agent</span>
  <span class="tag tag-orange">系统可靠性</span>
  <span class="tag tag-purple">Go + MCP</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 AI 将代码产出与部署速度放大 4-10 倍时，传统人工 Code Review 和静态告警为何失效，以及谷歌如何用「决策与执行冷热解耦」构建下一代自愈式运维体系。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">AI 编码加速<br/>4-10x 产出</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">复杂度爆炸<br/>故障涌入 10x</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">IRM/InvD/Antigravity<br/>黄金数据 + 排障</div>
    <span class="arrow-sym">→</span>
    <div class="node">Actus 安全闸口<br/>L3/L4 自治</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「AI 写代码更快 = 运维可以照旧」—— 谷歌指出，代码提交量暴涨 10 倍意味着未知技术债和故障涌入速度也暴涨 10 倍，人类分钟级响应在微秒级故障蔓延面前毫无抵抗力。</p>
</div>

<div class="card">
  <h3>【模板 A】SRE AI 自治五级：从辅助到完全自治</h3>
  <p><strong>在讲什么问题：</strong>AI 在运维系统中能自主到什么程度？人类何时必须介入？</p>
  <p><strong>核心机制：</strong>谷歌定义 L0-L4 五级自治：L0/L1 人类是绝对消防员；L3 高度自治可无需确认执行变更；L4 完全自治。AI 编码加速迫使 SRE 必须向 L3/L4 推进。</p>
  <p><strong>关键理解：</strong>传统 SRE（SLO、错误预算、消除琐碎）建立在「人类写代码速度有限」的物理前提上，该前提已被 AI 打破。</p>
  <p><strong>怎么落地：</strong>① 评估当前运维处于哪一级 ② 为 L3 推进设计 Actus 安全闸口 ③ 用 IRM-Analyzer 积累黄金训练数据 ④ 人类转向定义安全边界而非冲进火场。</p>
  <p><strong>边界说明：</strong>L4 完全自治需 Actus + Evaluation Pipeline 成熟；金融/医疗等强合规场景短期内不宜跳过人类确认。</p>
  <div class="quote">原文：「一旦拥有自主执行权的 AI 智能体做出错误决策，其灾难半径（Blast Radius）将比人类操作失误大上千倍。」</div>
</div>

<div class="card">
  <h3>【模板 B】三大内部 AI 运维组件</h3>
  <p><strong>方法名：</strong>IRM-Analyzer + InvD + Antigravity CLI</p>
  <p><strong>核心思路：</strong>将人类救火轨迹结构化 → 自动生成排障图谱 → 用 Go+MCP 终端让 Agent 操作生产系统。</p>
  <p><strong>操作步骤：</strong>1. IRM-Analyzer 从 Slack/日志/监控提炼 Human Trajectory 2. InvD 收到告警后自动渲染故障拓扑图并建议隔离 3. Antigravity CLI 通过 MCP 创建 Bug、导出复盘、执行流量排干。</p>
  <p><strong>选型条件：</strong>需要训练 AI Operator 时优先建 IRM；需要缩短 MTTM 时部署 InvD（谷歌数据：MTTM 降 44%）；需要 Agent 与 Borg/日志交互时用 Antigravity。</p>
  <div class="highlight"><strong>落地建议：</strong>从现有事故复盘 Slack 频道开始，用 LLM 将混乱救火过程聚合成 Timeline（SLA 异常→Canary 排水→服务恢复验证），作为 AI Operator 训练集。</div>
  <div class="relation"><strong>与 Grafana 手工排障的区别：</strong>InvD 是「收到告警即生成图谱」，而非 SRE 手忙脚乱打开几十个仪表盘。</div>
</div>

<div class="card">
  <h3>【模板 F】Safety Trifecta：决策与执行冷热解耦</h3>
  <p><strong>原则：</strong>「不要让做决策的 AI，直接去碰你的服务器。」</p>
  <p><strong>为什么重要：</strong>LLM 会「抽风」——流量高峰误清空集群负载的 Blast Radius 远超人类失误。</p>
  <p><strong>怎么落地：</strong>AI Operator（思考脑）写 CoT 建议 → Actus（执行闸口）强制 dry_run、断路器、零信任 Agent Identity → 通过后才执行变更。</p>
  <p><strong>适用边界：</strong>Actus 规则需人类 SRE 持续维护；过度宽松等同裸奔，过度严格则退化为 L1。</p>
  <div class="quote">原文：「将『会犯错的 AI 思考脑』与『绝对遵守确定性安全规则的 Actus 控制面』进行冷热解耦，是谷歌敢于推进 L3/L4 自治的终极底气。」</div>
</div>

<div class="card">
  <h3>【模板 E】传统 SRE vs AI 时代 SRE 对比</h3>
  <table>
    <tr><th>对比维度</th><th>传统 SRE</th><th>AI 时代 SRE（谷歌范式）</th><th>一句话结论</th></tr>
    <tr><td>核心价值</td><td>手速 + 救火经验</td><td>定义 Actus 策略与安全边界</td><td>从操作者变架构师</td></tr>
    <tr><td>响应时延</td><td>分钟/小时级</td><td>AI 微秒级检测 + Actus 执行</td><td>人类跟不上机器代码吞吐</td></tr>
    <tr><td>Code Review</td><td>人工逐行审查</td><td>AI 10x 产出使审查杯水车薪</td><td>需渐进式金丝雀 + 自动评估</td></tr>
    <tr><td>训练数据</td><td>口头经验传承</td><td>IRM 结构化 Human Trajectory</td><td>救火轨迹是黄金数据</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 D】企业 AI-SRE 落地选型表</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>刚引入 AI 编码</td><td>先建 Evaluation Pipeline</td><td>确保 AI Operator 上线前不退化</td><td>直接给 Agent 生产执行权</td><td>Blast Radius 不可控</td></tr>
    <tr><td>频繁线上救火</td><td>IRM-Analyzer + InvD</td><td>MTTM 可降 44%，数据可训练</td><td>继续纯人工 Grafana</td><td>响应速度跟不上部署频率</td></tr>
    <tr><td>Agent 需操作基础设施</td><td>Antigravity CLI + MCP + Actus</td><td>Go 是 Google Agent 通用语言</td><td>Agent 直接用开发者个人凭证</td><td>零信任原则被破坏</td></tr>
    <tr><td>10x 代码产出团队</td><td>敏感渐进式金丝雀发布</td><td>分流比例需自适应 AI 部署速度</td><td>沿用旧发布节奏</td><td>故障涌入速度同步 10x</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 C】避坑清单</h3>
  <p><strong>坑：让 AI Operator 直接持有服务器操作权限</strong></p>
  <p><strong>原因：</strong>LLM 决策非确定性，错误决策的 Blast Radius 比人类大上千倍。</p>
  <p><strong>解法：</strong>强制 Actus 中间层：dry_run 沙箱 → Agentic Circuit Breaker 限流 → 窄权限 Agent Identity。</p>
  <p><strong>严重程度：</strong>致命——流量高峰误操作可导致全集群灾难。</p>
  <div class="pitfall"><strong>另一个坑：</strong>以为 AI 编码加速可以不管运维。原文强调：故障和技术债涌入速度同样暴涨 10 倍，SRE 范式必须同步升级。</div>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>AI 将代码产出放大 4-10 倍，传统人工 Review 和静态告警已无法匹配故障涌入速度</li>
    <li>谷歌三大组件：IRM（黄金数据）、InvD（自动拓扑，MTTM -44%）、Antigravity CLI（Go+MCP 终端）</li>
    <li>核心安全哲学：AI Operator 决策 + Actus 执行冷热解耦，是推进 L3/L4 自治的前提</li>
    <li>人类 SRE 价值从「冲进火场」转向「设计自愈消防网」——定义 Safeguards 与 Evaluation Pipeline</li>
    <li>系统可靠性终极边界仍在心存敬畏、能设计严密安全闸口的系统架构师手中</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>阅读谷歌白皮书原文：sre.google/resources/practices-and-processes/ai-engineering-reliable-operations/</li>
    <li>梳理最近一次线上事故的 Slack/日志时间线，尝试用 LLM 结构化为 Human Trajectory</li>
    <li>评估团队当前 SRE AI 自治级别（L0-L4），明确向 L3 推进的阻塞项</li>
    <li>为 AI Agent 设计「决策脑」与「执行面」分离架构，禁止 Agent 直接使用个人凭证</li>
    <li>针对 AI 加速的部署频率，审查金丝雀发布策略是否足够敏感</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「AI 让开发更快所以运维可以不变」到「AI 负责疯狂奔跑，人类负责用优雅系统工程画出最安全的跑道」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
