import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'ai-coding-not-side-hustle.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#faf5ff,#f3e8ff);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#7c3aed,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #a855f7}
.card h3{font-size:22px;font-weight:700;color:#7c3aed;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#faf5ff,#ede9fe);border:2px solid #c4b5fd;border-radius:16px;padding:12px 16px;text-align:center;min-width:88px;font-weight:700;font-size:12px;color:#7c3aed}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#7c3aed;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>工程师的 AI 杠杆：放大写代码，而非重学副业</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-purple">AI Coding</span>
  <span class="tag tag-blue">职业策略</span>
  <span class="tag tag-green">资产复用</span>
  <span class="tag tag-orange">副业祛魅</span>
</div>
<p class="subtitle">本文解决的核心问题是：AI 热潮下程序员该不该跟风 AI 短剧/口播/绘画副业——作者用「只会工具、不懂业务流就做不出东西」点破换行成本，主张把 AI 用在最熟的软件工程上形成乘法收益，并与手里有业务流的人合作解决真实痛点，而不是从零学一门内容创作行当。</p>

<div class="map">
  <h3 style="font-size:20px;color:#7c3aed;margin-bottom:12px;text-align:center">时间投入 → 产出模型</h3>
  <div class="diagram">
    <div class="node-orange">AI 内容副业<br>加法模型</div>
    <span class="arrow-sym">vs</span>
    <div class="node-green">AI 编程<br>乘法模型</div>
    <span class="arrow-sym">←</span>
    <div class="node">多年工程<br>资产复用</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「会用剪映/生图工具 = 能做好 AI 副业」。原文强调视频是<strong>艺术创作 + 平台运营</strong>业务流，与程序员原有技术栈关联度低；工具会了，分镜与流量逻辑仍要从零补。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】工具能力 vs 业务流</h3>
  <p><strong>在讲什么问题：</strong>教程堆满、工具装全，却做不出成片——瓶颈不在 AI 剪辑会不会，而在不懂影视分镜与内容业务。</p>
  <p><strong>核心机制：</strong>任何副业 = 领域知识 × 执行工具 × 分发运营；缺中间一项，AI 只加速空转。</p>
  <p><strong>关键理解：</strong>程序员最熟的业务流首先是<strong>写代码与交付软件</strong>，其次才是跨界行业流。</p>
  <p><strong>典型场景：</strong>把两天排期的改动用 AI Coding 半天收尾，腾出时间再探索别的方向。</p>
  <p><strong>边界说明：</strong>若你本就是内容从业者，AI 放大老本行同样成立——本文针对的是「纯工程背景跟风换行」。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】AI 副业路径 vs AI 编程</h3>
  <table>
    <tr><th>维度</th><th>短剧/数字人/绘画副业</th><th>AI 编程</th><th>一句话</th></tr>
    <tr><td>核心能力</td><td>内容、审美、流量、运营</td><td>软件工程、架构、业务理解</td><td>能力栈是否可复用</td></tr>
    <tr><td>原有资产</td><td>很低，新业务从零</td><td>极高，多年积累全用上</td><td>决定学习曲线</td></tr>
    <tr><td>收益模型</td><td>加法：一份时间一份产出</td><td>乘法：放大现有项目资产</td><td>同样一小时杠杆不同</td></tr>
    <tr><td>成功案例画像</td><td>本就写文案、剪片子、懂推流</td><td>工程师缩短交付、提质量</td><td>成功多是放大而非转行</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】主业增效的三步</h3>
  <p><strong>核心思路：</strong>不急着换行，先把 AI 嵌进现有交付链。</p>
  <p><strong>操作步骤：</strong>① 选团队里重复度高、规格清晰的编码任务（测试、脚手架、重构）；② 用 AI Coding 工具缩短「改动—验证」循环；③ 用省下的时间做深度工作或稳妥探索；④ 记录交付周期变化，用数据说服自己而非跟风口。</p>
  <p><strong>选型条件：</strong>任务有明确验收（编译、测试、CI）时 AI 收益最稳；纯创意且无反馈环的任务慎用全自动。</p>
  <p><strong>避坑：</strong>把「能摸鱼」当唯一 KPI 却忽视代码审查与安全——提速不以债为代价。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】仍想做副业：找业务流合伙人</h3>
  <p><strong>核心思路：</strong>你有技术，对方有行业痛点与流程，互补而非单枪匹马学运营。</p>
  <p><strong>操作步骤：</strong>① 找身边电商/运营等朋友深聊日常最烦的三件事（手工录单、库存对不上、客服复读）；② 选一件可用脚本/小工具/Agent 半自动化的痛点；③ 做小 MVP 验证是否真省时间；④ 谈清分成与维护责任。</p>
  <p><strong>对比相邻方法：</strong>比自学短视频更快落地，但依赖信任与领域洞察，不是纯技术炫技。</p>
  <div class="quote">「你有技术，他有业务，一拍即合」——副业可以是合作制，而非个人全能化。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】跟风 AI 副业</h3>
  <p><strong>工具幻觉：</strong>装了一堆生成器却缺分镜与选题。原因：混淆工具与业务。解法：先跟从业者跑一周流程。严重程度：小心。</p>
  <p><strong>换行冲动：</strong>斜杠青年除外，多数工程师换行成本极高。解法：先 AI 放大主业。严重程度：小心。</p>
  <p><strong>卖课叙事：</strong>看到的「AI 暴富」常是内容从业者放大老本行。解法：核对作者背景是否同赛道。严重程度：可忽略（若当普适路径则小心）。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】先乘法，再加法</h3>
  <p><strong>原则：</strong>用 AI 把你已经擅长的事放大，比从零学一门新行当划算得多。</p>
  <p><strong>为什么重要：</strong>同样一份时间，副业路径要先补一整套新能力，AI Coding 直接复用工程栈。</p>
  <p><strong>怎么落地：</strong>本周选一个真实工单，用 AI 辅助完成并记录耗时；暂不买新课程，先巩固交付链。</p>
  <p><strong>适用边界：</strong>立志做内容创业且愿长期投入者，应系统学业务流而非只学工具——与工程师默认路径不同。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「个人 IP + AI 内容」变现派</p>
  <p class="rebuttal-text">工程师把时间全砸在主业增效，天花板仍是工资；内容副业虽从零起步，一旦账号资产起来，收益与自由度都非写代码可比。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>AI 工具会了不等于能做出副业成果，业务流才是短板。</li>
    <li>程序员默认最强业务流是软件交付，AI Coding 复用存量能力。</li>
    <li>副业多为加法，AI 编程对工程资产是乘法杠杆。</li>
    <li>成功案例往往是放大老本行，而非零基础换赛道。</li>
    <li>若要做副业，找有业务流的人合作比单干学运营更务实。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>列出本周三项可验收的编码任务，用 AI Coding 完成并记录前后耗时。</li>
    <li>暂停一项「跟风」工具采购，直到能说清对应业务流步骤。</li>
    <li>约一位非技术朋友聊 30 分钟，记下三个可自动化的烦人事。</li>
    <li>团队内分享一篇「AI 增效」案例，强调审查与测试未省略。</li>
    <li>若确有兴趣做内容，先跟从业者跑流程再决定是否投入。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「AI 时代我该搞什么副业」到「我已有哪条业务流值得被 AI 放大」——杠杆点在熟悉度，不在热搜词。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log(`Wrote ${OUT} (${height}px)`);
