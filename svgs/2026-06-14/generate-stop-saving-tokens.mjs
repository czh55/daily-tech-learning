import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

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
.tag-red{background:#fee2e2;color:#991b1b}
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
  <span class="tag tag-purple">Vibe Coding</span>
  <span class="tag tag-green">软件工厂</span>
  <span class="tag tag-orange">积木经济</span>
</div>
<p class="subtitle">本文解决的核心问题是：在 AI 辅助开发时代，工程师应该把稀缺资源投在「省 Token」还是「省时间」——Naval 圆桌与 Vercel/Science 创始人的共识指向后者。</p>

<div class="map">
  <h3 style="text-align:center;color:#1e40af;margin-bottom:20px;font-size:20px">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">暴力破解<br/><small>多模型并行</small></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">软件工厂<br/><small>造生产代码的机器</small></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Vibe Coding<br/><small>意志传递而非写代码</small></div>
    <span class="arrow-sym">→</span>
    <div class="node">积木经济<br/><small>复用高鲁棒中间件</small></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p>「提示词技巧」不是护城河——大模型进化速度远快于人类摸索 Prompt 框架的速度。Max Hodak 直言无视 Ralph Wigum、OpenClaw 等脚手架技巧，直接用大白话同时砸向 Codex、Claude、Gemini。</p>
</div>

<div class="card">
  <h3>【A】暴力破解策略：Token 换时间的第一性原理</h3>
  <p><strong>在讲什么：</strong>面对复杂系统工程，是否值得花 3 小时润色一条完美 Prompt？</p>
  <p><strong>关键理解：</strong>模型研究你怎么说话，比你研究它怎么理解更快。省 Token 是在省最便宜、最可再生的资源。</p>
  <p><strong>核心机制：</strong>写几句带语法错误的大白话意图 → 同时发给 Codex + Claude + Gemini → 谁先给出正确结果就用谁。</p>
  <div class="quote">「词元再贵，也比人类的时间便宜。浪费词元，拯救时间，这就是全部的秘密。」— Max Hodak</div>
  <p><strong>怎么落地：</strong>① 同一问题并行调用 2-3 个模型 API；② 放弃「一条 Prompt 调到底」；③ 用 API 账单对比你省下的工程师小时成本。</p>
  <div class="pitfall"><strong>避坑：</strong>不要在个人学习/探索阶段过度抠 Token——那会让你卡在依赖配置和编译报错上数天，挫伤创造力（Max：有了 Agent 你 never get stuck anymore）。</div>
  <p><strong>边界：</strong>适用于探索性、架构性任务；生产环境高频调用仍需成本监控，但优化目标是吞吐与正确率而非单条 Prompt 字数。</p>
  <div class="relation"><strong>与提示词工程的关系：</strong>技巧是战术，暴力并行是战略——当模型周级迭代时，战术很快过时。</div>
</div>

<div class="card">
  <h3>【F】软件工厂心法：从写代码到造工厂</h3>
  <p><strong>原则：</strong>未来程序员的价值 = 能否建造自动化、自省的 AI 开发流水线，而非亲手交付业务代码 B。</p>
  <p><strong>为什么重要：</strong>传统 10x 工程师争议大，但 1000x（Eich、Carmack、Satoshi）在数字世界真实存在；AI 让「造工厂」成为新的 1000x 形态。</p>
  <div class="highlight">反面案例：只会机械搬砖、逐行写 API/数据库调用的工程师将迅速贬值；具备系统大局观的人瞬间拥有数十个虚拟技术团队。</div>
  <p><strong>怎么落地：</strong>① 定义架构边界（如「这里要 PostgreSQL 事务一致性，别用 MongoDB」）；② 让 Agent 在边界内疯狂产出 B→Z；③ 建立自省流水线（测试、评估、回滚）。</p>
  <p><strong>适用边界：</strong>需要 Taste &amp; Judgment 的架构决策仍属人类；工厂产出的垃圾代码可以容忍——先跑通再精炼。</p>
</div>

<div class="card">
  <h3>【B】Vibe Coding 落地：你一直是氛围架构师</h3>
  <p><strong>方法标签：</strong>意志传递 · CTO/架构师模式 · Agent 编排</p>
  <p><strong>核心思路：</strong>资深 CTO 从不写每一行 API，而是通过飞书/Jira/设计文档传递品味与边界——现在对象从初级程序员换成 AI Agent。</p>
  <p><strong>操作步骤：</strong>1. 输入大方向与架构约束 → 2. Agent 补充细节与实现 → 3. 人类做质量把关与方向修正 → 4. 迭代而非逐行编码。</p>
  <div class="quote">Naval：「人类只是把传递意志的对象，从初级程序员换成了 AI 智能体。」</div>
  <p><strong>选型条件：</strong>当你需要快速验证多个方案、而非精雕细琢单一模块时，Vibe Coding 优于传统 TDD 先行。</p>
  <div class="pitfall"><strong>避坑：</strong>没有架构直觉的「纯 Vibe」会产出大量不可维护代码——必须先有边界和品味，再放权给 Agent。</div>
</div>

<div class="card">
  <h3>【E】AI 时代护城河对比：硬科技 vs 高质量积木</h3>
  <table>
    <tr><th>对比维度</th><th>物理底座 / Hard Tech</th><th>高质量技术积木</th><th>一句话结论</th></tr>
    <tr><td>典型代表</td><td>脑机接口、超音速飞机</td><td>Redis、PostgreSQL、Vercel Serverless、Go 运行时</td><td>两端分化，中间平庸代码无壁垒</td></tr>
    <tr><td>AI 可替代性</td><td>低——需肉身与物理碰撞</td><td>中——AI 可生成，但难替代千万次锤炼的可靠性</td><td>别指望 AI 每次从第一性原理重造轮子</td></tr>
    <tr><td>Agent 应怎么做</td><td>人类主导</td><td>调用成熟 Queue/DB/中间件</td><td>重用人类文明沉淀的积木</td></tr>
    <tr><td>投资方向</td><td>前沿硬核研发</td><td>极致干净的高性能底层</td><td>代码廉价后，壁垒在「被高频调用的可靠性」</td></tr>
  </table>
  <div class="relation"><strong>原文依据：</strong>Mitchell Hashimoto「积木经济」— Agent 发邮件应调用成熟邮件系统，而非重构 SMTP 协议栈。</div>
</div>

<div class="card">
  <h3>【D】开发策略选型表</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>复杂系统首次攻关</td><td>多模型暴力并行</td><td>最快获得可行解，Token 成本 &lt; 工程师时间</td><td>单模型精雕细琢 Prompt</td><td>模型进化快于你的技巧积累</td></tr>
    <tr><td>团队规模化交付</td><td>建造软件工厂 + 规范驱动</td><td>指数级产出 B→Z 代码</td><td>每人手写业务代码</td><td>线性增长无法匹配需求</td></tr>
    <tr><td>Agent 需要发邮件/存数据</td><td>调用现有技术积木</td><td>高鲁棒、经千万次验证</td><td>让 Agent 从零实现</td><td>重复造轮子、安全与可靠性差</td></tr>
    <tr><td>个人探索 side project</td><td>Vibe Coding + 大把 Token</td><td>不再卡在配置/编译数日</td><td>省 Token 导致反复卡住</td><td>挫伤积极性，Max 20 年不写代码后靠 Agent 重获创造快乐</td></tr>
  </table>
</div>

<div class="card">
  <h3>【C】避坑清单：省 Token 背后的隐性成本</h3>
  <p><strong>坑 1：刻舟求剑学提示词课程</strong></p>
  <p>原因：中英文互联网充斥「完美 Prompt」收费课，但硅谷巨头视为低效。</p>
  <p>解法：把时间投在并行试错和架构边界定义上。</p>
  <p>严重程度：<strong>小心</strong>——不致命但持续浪费最贵资源（时间）。</p>
  <p><strong>坑 2：无架构直觉的纯 Agent 放权</strong></p>
  <p>原因：Vibe Coding 前提是具备系统大局观；否则产出垃圾代码山。</p>
  <p>解法：先写清技术约束（DB 选型、一致性要求），再让 Agent 搬砖。</p>
  <p>严重程度：<strong>致命</strong>——技术债指数级累积。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Token 比人类时间便宜——「浪费算力」是换取创造力的理性策略</li>
    <li>程序员价值从「写代码」转向「造软件工厂」和传递架构意志</li>
    <li>Vibe Coding 本质是 CTO 模式：边界给人，细节给 Agent</li>
    <li>护城河分化为 Hard Tech 与高质量积木，中间层代码无壁垒</li>
    <li>Agent 让你 never get stuck——解放人类成为 Builders 而非泥瓦匠</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>下次复杂任务：同时开 Codex + Claude + Gemini，比较谁先给出可用方案</li>
    <li>列出你项目中的「技术积木」（DB/Queue/Auth），禁止 Agent 重造</li>
    <li>写一份架构约束文档（类似 CLAUDE.md），定义 Agent 不可逾越的边界</li>
    <li>算一笔账：本月 API 费用 vs 若不用 AI 需多少工程师小时</li>
    <li>观看 Naval 圆桌原片：<a href="https://www.youtube.com/watch?v=aiyf-5jmYf0" style="color:#bfdbfe">youtube.com/watch?v=aiyf-5jmYf0</a></li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「我是省 Token 的 Prompt 工匠」→「我是挥霍算力、设计工厂的建造者」——泥瓦匠贬值，直升机上的巨擘升值。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
