import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'agent-sdk-pi-harness-taxonomy.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f5f3ff,#ede9fe);padding:48px 60px;color:#1e293b}
h1{font-size:30px;font-weight:900;background:linear-gradient(135deg,#5b21b6,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-orange{background:#ffedd5;color:#9a3412}.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #7c3aed}
.card h3{font-size:22px;font-weight:700;color:#5b21b6;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:stretch;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.layer{flex:1;min-width:200px;background:linear-gradient(180deg,#faf5ff,#f3e8ff);border:2px solid #c4b5fd;border-radius:16px;padding:16px;text-align:center}
.layer h4{color:#5b21b6;font-size:15px;margin-bottom:8px}
.layer p{font-size:13px;color:#6b7280;line-height:1.6}
.conclusion{background:linear-gradient(135deg,#5b21b6,#7c3aed);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 12px;text-align:left;font-weight:700;color:#5b21b6;border-bottom:2px solid #cbd5e1}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px}`;

const body = `
<h1>智能体四层坐标：SDK → 极简 → 成熟 Harness → 插件化 Harness</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-purple">抽象层级</span>
  <span class="tag tag-blue">LangChain</span>
  <span class="tag tag-green">Pi / OpenClaw</span>
  <span class="tag tag-orange">Claude Code</span>
</div>
<p class="subtitle">本文解决的核心问题是：面对 LangChain、Pi、DeepSeek Harness、Claude Code、Hermes 等名目，初学者该学哪一个——作者用「造智能体 vs 用智能体」与四层分类，把 SDK、极简内核、开箱成熟体、插件化 Harness 的协作方式一次对齐。</p>

<div class="map">
  <h3 style="font-size:20px;color:#5b21b6;margin-bottom:16px;text-align:center">抽象层级（由底向上）</h3>
  <div class="diagram">
    <div class="layer"><h4>SDK</h4><p>LangChain / LangGraph / DeepAgents<br>模块积木，你设计系统</p></div>
    <div class="layer"><h4>极简智能体</h4><p>Pi：read/write/edit/bash<br>&lt;1000 token，可 TS 扩展</p></div>
    <div class="layer"><h4>成熟 Harness</h4><p>Claude Code、Codex、Hermes、Qoder<br>开箱应用，少二次开发</p></div>
    <div class="layer"><h4>插件化 Harness</h4><p>DeepSeek Harness + Cordis 微内核<br>标准模式「用」+ 创设模式「造」</p></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「LangChain 就是一个能对话的智能体」。作者强调它是<strong>开发框架</strong>——模型、工具、状态、人机协同都由你接线；直接当 Chat 用会错位期待。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Harness 到底是什么</h3>
  <p><strong>在讲什么问题：</strong>成熟产品名里常带 Harness，和 SDK 有何不同。</p>
  <p><strong>关键理解：</strong>Harness 是通过扩展与约束，让大模型按用户意愿决策与调工具；Claude Code 是 Anthropic 给 Claude 的实现，Codex 是 OpenAI 的，Hermes 本身即 Harness 工程。</p>
  <p><strong>典型场景：</strong>多数爱好者「用」智能体完成编码与文件任务，而非在其上再开发新产品。</p>
  <p><strong>边界：</strong>要深度定制业务流程与数据面，应下沉到 SDK 或极简扩展路线，而非硬改成熟客户端。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】四类工具怎么选</h3>
  <table>
    <tr><th>类别</th><th>代表</th><th>你在做什么</th><th>控制力</th><th>上手成本</th></tr>
    <tr><td>SDK</td><td>LangChain 系</td><td>设计并搭建智能体系统</td><td>最高</td><td>学习曲线陡</td></tr>
    <tr><td>极简智能体</td><td>Pi</td><td>在极小内核上扩展 Skill/MCP/UI</td><td>高</td><td>中（需写扩展）</td></tr>
    <tr><td>成熟 Harness</td><td>Claude Code 等</td><td>直接当生产力工具用</td><td>低</td><td>最低</td></tr>
    <tr><td>插件化 Harness</td><td>DeepSeek Harness</td><td>既用标准插件又可创设扩展</td><td>中高</td><td>中（双模式）</td></tr>
  </table>
  <div class="highlight">OpenClaw 案例：在 Pi 极简之上扩展成「巨无霸」，验证「极简 + 可扩展」路径可行。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】DeepSeek Harness 插件化结构</h3>
  <p><strong>微内核 Cordis：</strong>不实现业务，只做依赖解析、热插拔、事件与生命周期。</p>
  <p><strong>标准模式：</strong>官方文件/命令/搜索等插件预装，接近成熟智能体体验。</p>
  <p><strong>创设模式：</strong>用户开发插件扩展能力——兼顾探索期原型与后期定制。</p>
  <p><strong>怎么落地：</strong>先判断自己是「用」还是「造」；探索期可 DeepSeek Harness，定制度需求再评估是否下沉 Pi/SDK。</p>
</div>

<div class="card">
  <h3>【决策/选型表】学习路径一句话</h3>
  <table>
    <tr><th>你的目标</th><th>起点</th><th>不推荐</th><th>原因</th></tr>
    <tr><td>定制智能体系统</td><td>LangChain</td><td>只学 Claude Code 快捷键</td><td>缺构建模块视野</td></tr>
    <tr><td>零开销+自研扩展</td><td>Pi</td><td>直接 fork 成熟客户端</td><td>改动面与升级成本高</td></tr>
    <tr><td>日常编码助手</td><td>多款成熟 Harness 试用</td><td>强行 LangGraph 搭聊天</td><td>过度工程</td></tr>
    <tr><td>用+造兼顾、原型期</td><td>DeepSeek Harness</td><td>忽视插件边界</td><td>内核与业务耦合混乱</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】选型常见误区</h3>
  <p><strong>把 SDK 当聊天机器人：</strong>LangChain 不负责「一个成品助手」——需自己编排——严重程度：小心。</p>
  <p><strong>在成熟 Harness 上硬做平台：</strong>二次开发不是主路径——严重程度：小心。</p>
  <p><strong>不看抽象层级跟风：</strong>OpenClaw 火就跳过 Pi 原理——扩展债难还——严重程度：可忽略（学习型）。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「只用一个全家桶」实践者</p>
  <p class="rebuttal-text">四层分类是教科书洁癖——团队只要 Claude Code 或只要 Dify 就能交付，拆 LangChain 与 Pi 是在给入门者增加选择焦虑。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>选型本质是选抽象层级：积木、极简内核、成品 Harness、插件化 Harness。</li>
    <li>LangChain 造系统；Pi 极简扩展；Claude Code 等直接用；DeepSeek Harness 双模式桥接用与造。</li>
    <li>先回答「造智能体还是用智能体」，再决定学哪条线的文档与实验。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>写下当前任务是产品化 Agent 还是个人效率，对应上表一行。</li>
    <li>若「用」：并行试用 2 款成熟 Harness 一周再定主工具。</li>
    <li>若「造」：用 LangChain 或 Pi 做最小闭环（单工具+单循环）再谈 MCP/多 Agent。</li>
    <li>关注 DeepSeek Harness 创设模式仅在有插件需求时投入，避免过早插件化。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「工具名轰炸」到「我在哪一层动手」——没有最好工具，只有与阶段匹配的抽象层级。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log(`Wrote ${OUT} (${height}px)`);
