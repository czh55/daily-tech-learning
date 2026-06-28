import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'stop-saving-tokens.svg');

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
<h1>别再省 Token 了！硅谷新共识：浪费算力才是唯一捷径</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">AI 开发范式</span>
  <span class="tag tag-green">Agent 工程</span>
  <span class="tag tag-orange">硅谷观点</span>
  <span class="tag tag-purple">Vibe Coding</span>
</div>
<p class="subtitle">本文解决的核心问题是：在 AI 辅助开发时代，开发者应该把稀缺资源押在「省 Token」还是「省时间」上，以及由此衍生的工程角色与护城河如何重构。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">暴力并行<br/>多模型试错</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">软件工厂<br/>1000x 工程师</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Vibe Coding<br/>意志传递</div>
    <span class="arrow-sym">→</span>
    <div class="node">积木经济<br/>护城河分化</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「写好 Prompt 就能驾驭大模型」—— 硅谷顶级创始人认为模型进化速度远超人类摸索提示词技巧的速度，过度打磨 Prompt 是刻舟求剑。</p>
</div>

<div class="card">
  <h3>【模板 A】暴力并行策略：用算力换时间</h3>
  <p><strong>在讲什么问题：</strong>面对复杂系统工程，是否值得花数小时润色一条「完美 Prompt」？</p>
  <p><strong>核心机制：</strong>Max Hodak 的策略是写几句甚至带语法错误的大白话意图，同时丢给 Codex、Claude、Gemini，谁先给出可用结果就用谁。</p>
  <p><strong>关键理解：</strong>Token 再贵也比人类时间便宜——「浪费词元，拯救时间」是底层秘密。模型研究你怎么说话，比你研究它怎么理解快得多。</p>
  <p><strong>典型场景：</strong>架构探索、多方案原型、不确定最佳实现路径的系统设计。</p>
  <p><strong>边界说明：</strong>不适合强合规审计场景（需完整留痕）、不适合单次调用成本极高的超长上下文任务、不适合对输出一致性有硬性 SLA 的生产流水线。</p>
  <div class="quote">原文：「词元再贵，也比人类的时间便宜。浪费词元，拯救时间，这就是全部的秘密。」</div>
  <div class="relation"><strong>与精细 Prompt 工程的区别：</strong>后者优化单次质量，前者优化探索速度；二者可组合——先用暴力并行找方向，再对胜出方案做约束。</div>
</div>

<div class="card">
  <h3>【模板 A】软件工厂：从写代码到造工厂</h3>
  <p><strong>在讲什么问题：</strong>AI 时代如何衡量工程师价值？10x 还是 1000x？</p>
  <p><strong>核心机制：</strong>Vercel 创始人 Gumo 提出：未来程序员的工作不是交付具体业务代码 B，而是建造能自动裂变产出 B 到 Z 的 AI 软件工厂（The Software Factory）。</p>
  <p><strong>关键理解：</strong>数字世界人与人的差距不是 10 倍而是 1000 倍；AI 编排让高阶系统设计能力被指数级放大。</p>
  <p><strong>怎么落地：</strong>① 定义可复用的 Agent 流水线 ② 配置自省/评估环节 ③ 让工厂自动处理样板代码与配置对齐 ④ 人只介入架构决策与品味判断。</p>
  <p><strong>边界说明：</strong>工厂范式对「一次性脚本」「极小规模 MVP」过重；需要团队有基本的 CI/CD 与规范驱动开发基础。</p>
  <div class="highlight"><strong>落地建议：</strong>把重复 3 次以上的开发流程写成 Agent 工作流（CLAUDE.md + Hooks + Skills），先自动化最痛的「配置对齐」环节。</div>
</div>

<div class="card">
  <h3>【模板 F】Vibe Coding 心法：你一直是氛围架构师</h3>
  <p><strong>原则：</strong>优秀 CTO/架构师几十年来一直在做 Vibe Coding——通过文档与沟通传递意志、品味与边界，让团队（现在是 Agent）补细节。</p>
  <p><strong>为什么重要：</strong>若仍亲自写每一行 API 调用，等于用直升机运砖——浪费了 AI 带来的杠杆。</p>
  <p><strong>怎么落地：</strong>输入大方向与硬约束（如「这里要 PostgreSQL 事务一致性，别用 MongoDB」），让 Agent 疯狂搬砖；你负责 Taste &amp; Judgment。</p>
  <p><strong>适用边界：</strong>安全关键系统仍需人工审查核心路径；新人团队需先建立共同「品味」才能有效 Vibe。</p>
  <div class="quote">原文：「现在，人类只是把传递意志的对象，从初级程序员换成了 AI 智能体。」</div>
</div>

<div class="card">
  <h3>【模板 E】开发策略对比：省 Token vs 浪费算力</h3>
  <table>
    <tr><th>对比维度</th><th>省 Token 精细 Prompt</th><th>暴力并行浪费算力</th><th>一句话结论</th></tr>
    <tr><td>优化目标</td><td>单次调用成本</td><td>端到端交付时间</td><td>时间比 Token 更稀缺</td></tr>
    <tr><td>适用阶段</td><td>生产稳定流程</td><td>探索与原型</td><td>探索期别抠 Token</td></tr>
    <tr><td>风险</td><td>错过模型能力进化</td><td>账单短期上升</td><td>用预算上限控风险</td></tr>
    <tr><td>产出形态</td><td>单一路径高质量</td><td>多路径快速筛选</td><td>先广后深</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 D】AI 时代护城河选型表</h3>
  <table>
    <tr><th>场景</th><th>推荐壁垒</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>通用 SaaS 功能</td><td>高质量积木集成</td><td>AI 会重复造轮子，可靠中间件是杠杆</td><td>从零写邮件系统</td><td>AI 一键生成，无差异化</td></tr>
    <tr><td>硬核物理创新</td><td>Hard Tech 实体</td><td>脑机接口、超音速飞机 AI 难虚拟化</td><td>纯代码模拟</td><td>无法替代物理验证</td></tr>
    <tr><td>个人开发者</td><td>软件工厂 + 品味</td><td>1000x 杠杆在编排不在搬砖</td><td>比拼代码行数</td><td>AI 让行数贬值</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 C】避坑清单</h3>
  <p><strong>坑：沉迷提示词课程而忽视并行试错</strong></p>
  <p><strong>原因：</strong>模型迭代速度超过人类总结的 Prompt 框架生命周期。</p>
  <p><strong>解法：</strong>设月度 API 预算上限，在此范围内默认多模型并行，而非无限打磨单条 Prompt。</p>
  <p><strong>严重程度：</strong>小心——长期会浪费最昂贵的时间资源。</p>
  <div class="pitfall"><strong>另一个坑：</strong>把「垃圾代码万岁」误解为不需要架构约束。原文强调的是探索期容忍废弃代码，生产环境仍需软件工厂与积木复用。</div>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>硅谷共识：Token 便宜、时间昂贵，探索期应并行砸算力而非精雕细琢 Prompt</li>
    <li>工程师价值从「写代码速度」转向「建造 AI 软件工厂」</li>
    <li>Vibe Coding 本质是资深架构师一直做的事，只是执行者从人变成 Agent</li>
    <li>护城河分化为 Hard Tech 物理底座与高质量可复用技术积木</li>
    <li>Agent 让你「再也不会卡在依赖配置和编译报错里」——创造力被解放</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>为下一个复杂任务同时开 3 个模型会话，用大白话描述意图，比谁先出可用方案</li>
    <li>识别团队内重复 3 次以上的流程，写成 Agent 工作流而非继续手工搬砖</li>
    <li>设定 API 月度预算上限，在上限内默认「浪费 Token」策略</li>
    <li>列出项目依赖的「技术积木」（DB、Queue、Serverless），确保 Agent 复用而非重造</li>
    <li>观看 Naval Podcast 原片（YouTube: aiyf-5jmYf0）对照自身工作流</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「泥瓦匠砌砖」到「直升机上的建造者」——稀缺的不是会写代码，而是系统大局观、品味与编排 AI 工厂的能力。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
