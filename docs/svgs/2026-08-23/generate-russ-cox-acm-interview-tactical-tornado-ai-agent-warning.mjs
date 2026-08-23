import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'russ-cox-acm-interview-tactical-tornado-ai-agent-warning.svg');

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
<h1>ACM 专访 Russ Cox：AI Agent 与「终极战术龙卷风」</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Russ Cox</span>
  <span class="tag tag-orange">战术龙卷风</span>
  <span class="tag tag-green">自动化测试</span>
  <span class="tag tag-purple">理论构建</span>
  <span class="tag tag-red">AI Coding Agent</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 AI Agent 把代码产出速度放大数倍时，团队如何在「战术编程」与「战略编程」之间守住架构连贯性——以及为什么测试基础设施与头脑中的「设计理论」才是安全拥抱 Agent 的真正前提。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Russ Cox 专访核心逻辑链</h3>
  <div class="diagram">
    <div class="node">工程规模压力<br>Go 用约束换简单</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">健全测试<br>重构底气</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">AI Agent 高频改动<br>可安全接纳</div>
    <span class="arrow-sym">↘</span>
    <div class="node-red">缺乏战略把关<br>终极战术龙卷风</div>
    <span class="arrow-sym">→</span>
    <div class="node-red">理论缺失<br>程序之死</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">AI 是软件工程连续统的一环，不是可以跳过系统思维的范式革命</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「AI 会彻底改变软件工程范式」。Russ Cox 用 <strong>continuum（连续统）</strong> 反驳炒作叙事——近未来早已藏在现有研究与实践中，缺的是深度技术写作与清醒取舍，而非另一场宏大革命。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】战术龙卷风——高产背后的复杂度债务</h3>
  <p><strong>在讲什么问题：</strong>为什么「能快速写出能跑代码」的人（或工具）反而可能摧毁整个代码库。</p>
  <p><strong>核心机制：</strong>John Ousterhout 区分战术编程（不计代价先交差）与战略编程（打磨设计以应对未来需求）。战术龙卷风指能疯狂产出能跑但极其复杂、与系统格格不入的代码的工程师。</p>
  <p><strong>关键理解：</strong>缺乏判断力的管理者常把战术龙卷风当成最高产明星，却看不见复杂度与技术债最终由他人买单；AI Agent 产出速度是人类数倍，若无战略把关，制造技术债的效率同样指数级放大。</p>
  <p><strong>典型场景：</strong>管理层只看产出数字、催促「先用 AI 把功能堆出来」的团队。</p>
  <p><strong>边界说明：</strong>战术工作在原型验证、短期救火中有合理位置；失败模式是战术过多、战略投入长期不足。</p>
  <div class="quote">「如果管理者不够谨慎，AI agent 很可能会轻而易举地变成终极版的战术龙卷风。」——Russ Cox 借 Ousterhout 概念对 AI 编程热潮的警告</div>
  <div class="relation"><strong>相关概念：</strong>与「技术债」同源；与「vibe coding / slop」等流行说法描述的是同一类失控产出，但 Cox 强调的是管理层激励结构而非个人风格。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】理论构建与程序之死</h3>
  <p><strong>在讲什么问题：</strong>维护软件真正依赖的是什么——代码行还是团队脑子里的连贯理论。</p>
  <p><strong>核心机制：</strong>Peter Naur 1985 年论文《Programming as Theory Building》：程序维护的核心是团队关于「现实需求如何映射到设计与结构」的连贯理论；这套理论无法完整写下或传授，其价值体现在应对设计之初未预料的新需求。</p>
  <p><strong>关键理解：</strong>当拥有理论的团队解散，程序随之「死亡」——代码一行未变，却已失去灵魂；无长期记忆、不懂演化脉络的 AI Agent 会像精力充沛但缺判断力的新人，写出比需要更复杂的方案。</p>
  <p><strong>典型场景：</strong>原作者随口一句点出简单方案，而接手者已在系统里堆了大量改动。</p>
  <p><strong>边界说明：</strong>适用于需长期演化的业务系统；一次性脚本或明确边界的小工具不适用「程序之死」框架。</p>
  <div class="quote">「几乎每个工程师都有过：绞尽脑汁做大量改动，结果原作者一句话点出从未想到的简单方案。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】战术编程 vs 战略编程 vs AI Agent 介入</h3>
  <table>
    <tr><th>对比维度</th><th>战术编程</th><th>战略编程</th><th>无把关的 AI Agent</th></tr>
    <tr><td>首要目标</td><td>眼前功能尽快能跑</td><td>设计能从容应对未来需求</td><td>最大化 tokens 产出与 PR 数量</td></tr>
    <tr><td>复杂度走向</td><td>局部补丁、与系统格格不入</td><td>约束增加、整体可扩展</td><td>指数级技术债（速度 × 人类倍数）</td></tr>
    <tr><td>管理者误判</td><td>把龙卷风当明星</td><td>短期产出看似「慢」</td><td>「看起来很快做出来了」的错觉</td></tr>
    <tr><td>一句话结论</td><td>有适用场景但不可主导</td><td>长期系统的主旋律</td><td>放大战术倾向，需人守住战略层</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】测试基础设施——拥抱 AI Agent 的安全底座</h3>
  <p><strong>核心思路：</strong>自动化测试让团队几乎「零心理负担」地评估新编译器、升级依赖、重构甚至重写——也是接纳不熟悉系统的人或 Coding Agent 改动的前提。</p>
  <p><strong>操作步骤：</strong>① 为核心行为建立可随时重跑的自动化测试；② 在引入 Agent 前确保 CI 能拦住回归；③ 用测试覆盖率与变更风险分级决定哪些目录可开放 Agent 高频提交；④ 将「测试变绿」设为合并硬性门槛，而非事后人工扫雷。</p>
  <p><strong>选型条件：</strong>测试越健全，团队越能安全拥抱 Agent；测试薄弱时 Agent 只会加速不可控改动。</p>
  <p><strong>落地建议：</strong>把投资测试与投资 Agent 工具并列列入工程预算——Cox 直言软件工程里几乎所有事情都会随测试质量提升而变容易。</p>
  <div class="pitfall"><strong>避坑：</strong>无完善测试时靠人工逐一排查影响面——能用但完全不可扩展，Agent 高频提交会瞬间击穿这种模式。</div>
  <div class="quote">「好的测试体系，也让团队更容易接受来自不熟悉这套系统的工程师，或者 coding agent 提交的改动。」</div>
</div>

<div class="card">
  <h3>【心法/原则卡】用约束换简单——Go 与 AI 时代的同一逻辑</h3>
  <p><strong>原则：</strong>面对复杂问题，工程师第一反应常是复杂方案；若肯简化问题本身，往往得到开销更低、同样好用、更易维护的简单方案——Go 禁止循环依赖即是「宁可在设计阶段多限制，也不要规模扩大后被灵活性反噬」。</p>
  <p><strong>为什么重要：</strong>反面案例是 C++/Java 构建系统被循环依赖折磨，社区堆砌复杂工程方案；十几年后 Go 生态在依赖管理上仍更清爽。</p>
  <p><strong>怎么落地：</strong>对 Agent 同样施加约束——明确禁止的模式（如跨层循环依赖、绕过接口的捷径）、强制走的设计评审点，而不是无限 prompt「随便写」。</p>
  <p><strong>适用边界：</strong>Go 诞生于 Google 海量代码与数千工程师规模；小团队可适度灵活，但 Agent 放大规模效应时约束价值上升。</p>
  <div class="highlight"><strong>Go 诞生驱动力：</strong>不是语言实验，而是 2007 年前后 Google 面对海量代码、成百上千工程师、成千上万台机器时，现有环境每一维度都跟不上规模的工程规模问题。</div>
</div>

<div class="card">
  <h3>【决策/选型表】团队如何分级使用 AI Coding Agent</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>测试覆盖完善的核心模块</td><td>Agent 辅助 + CI 门禁</td><td>回归可自动发现，符合 Cox 拥抱前提</td><td>无测试直接全量 Agent 改</td><td>改动速度超过人工审查能力</td></tr>
    <tr><td>管理层催交付、缺架构把关</td><td>限制 Agent 范围 + 战略评审</td><td>防止终极战术龙卷风</td><td>以 PR 数量/KPI 衡量 Agent 产出</td><td>激励结构与代码质量背离</td></tr>
    <tr><td>遗留系统、理论已断裂</td><td>先重建测试与文档化「理论」</td><td>Naur：无理论则程序已「死」</td><td>让 Agent 在黑洞代码库自由发挥</td><td>产出更复杂、更脱离演化脉络</td></tr>
    <tr><td>原型与短期验证</td><td>战术性使用 Agent 快速试错</td><td>战术编程有合理场景</td><td>把原型代码直接并入主干</td><td>战术债务进入长期系统</td></tr>
    <tr><td>评估「AI 范式革命」</td><td>连续统视角拆解具体问题</td><td>Cox：未来已在现有研究与实践中</td><td>全押或全拒的宏大叙事</td><td>跳过测试、架构等可验证环节</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Agent 协作中的典型失控信号</h3>
  <p><strong>坑 1：修好一个 bug、弄垮整个设计范式</strong>——HN 网友共鸣的战术龙卷风日常。<strong>原因：</strong>缺战略层审查。<strong>解法：</strong>变更需对照架构原则评审。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 2：管理者只看「有没有做出来」</strong>——HN 争议点：比代码质量更在意交付表象。<strong>解法：</strong>引入技术债与复杂度指标，而非仅统计行数/PR。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 3：无测试承接 Agent 高频提交</strong>——人工排查不可扩展。<strong>解法：</strong>先补测试再放量 Agent。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 4：指望 Agent 继承无法传授的「理论」</strong>——缺长期记忆与演化理解。<strong>解法：</strong>人维护设计文档、ADR 与关键决策上下文。<strong>严重程度：</strong>小心。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：增长导向的产品负责人 / 「先 ship 再重构」派</p>
  <p class="rebuttal-text">在窗口期竞争里，战略编程的「从容」往往是奢侈——客户和市场不会等测试体系完美才让你上线；用 Agent 换速度是理性选择，事后重构的成本若低于错失机会，战术龙卷风反而是最优战术。</p>
</div>

<div class="conclusion">
  <h2>结论与行动</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Russ Cox 借 ACM 专访把 AI Agent 风险说具体：缺乏战略把关时，Agent 是产出速度人类数倍的「终极战术龙卷风」。</li>
    <li>软件维护依赖 Naur 所说的连贯「设计理论」，无长期记忆的 Agent 会加速「程序之死」——代码仍在，灵魂已失。</li>
    <li>健全自动化测试是安全接纳 Agent 改动的硬前提；测试质量决定团队能多大程度拥抱高频 AI 提交。</li>
    <li>Go「用约束换简单」的哲学适用于 Agent 时代：在设计阶段施加约束，避免规模扩大后被复杂度反噬。</li>
    <li>AI 是工程连续统而非范式革命——用系统思维与可验证问题应对，而非追逐炒作叙事。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>审计当前测试能否支撑「零心理负担」重构；薄弱处优先补测再扩大 Agent 使用范围。</li>
    <li>为 Agent 设定架构红线（如禁止循环依赖、分层边界），写入 prompt 与 CI 规则。</li>
    <li>评审机制关注复杂度与技术债，不单看 PR 数量或交付速度。</li>
    <li>用 ADR 或设计文档沉淀「理论」，弥补 Agent 无法完整继承的演化上下文。</li>
    <li>区分战术与战略工作：原型可用 Agent 快跑，入主干的变更必须经过战略层审查。</li>
  </ol>
  <p><strong>关键认知转变：</strong>AI 极大提升产出速度，但能否守住系统战略层仍取决于人——愿不愿意投资测试、建立理论、在效率与复杂度间清醒取舍；龙卷风跑得再快，废墟仍要人来清理。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
