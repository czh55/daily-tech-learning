import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'loops-md-notes-on-agents-that-run-for-days.svg');

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
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:120px;font-weight:700;font-size:16px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
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
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Andrej Karpathy 解析 Loop Engineering：构建「数日级」长程 Agent 的 9 条黄金法则</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Loop Engineering</span>
  <span class="tag tag-green">Agent Harness</span>
  <span class="tag tag-orange">Karpathy</span>
  <span class="tag tag-purple">长程 Agent</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 Agent 任务复杂度提升、运行时间拉长到数天级别时，为什么单纯调 Prompt 会失效，以及如何用「循环工程」——把控制流、状态持久化与多角色分离设计为一等公民——让 Agent 稳定交付可用产品。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-orange">Prompt 时代<br><span style="font-size:13px;font-weight:400">一次性写完即弃</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">Loop 一等公民<br><span style="font-size:13px;font-weight:400">Gather→Reason→Act→Verify</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">三角色分离<br><span style="font-size:13px;font-weight:400">Planner/Generator/Evaluator</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">磁盘状态<br><span style="font-size:13px;font-weight:400">contract.md 等</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">瓶颈迁移<br><span style="font-size:13px;font-weight:400">Coding→Planning→Taste</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「模型不够聪明才导致 Agent 失败」—— Karpathy 指出瓶颈早已不在模型智商，而在 Harness 设计太差；模型能写代码、能审查，却无法自行决定何时停、何时推倒重来、结果写到哪里。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Loop Engineering vs Prompt Engineering</h3>
  <p><strong>在讲什么问题：</strong>为什么凌晨三点还在调 System Prompt 的开发者仍停留在「提示词时代」？</p>
  <p><strong>核心机制：</strong>Prompt 是写完一次就扔的静态指令；Loop 是你睡觉时仍在后台运行的系统——收集、推理、行动、验证、重复（Gather, Reason, Act, Verify, Repeat）。</p>
  <p><strong>关键理解：</strong>当模型已能无人监督遵循复杂流程，Prompt 的杠杆效应见顶；拉开差距的是 Procedure（流程），不是措辞。</p>
  <p><strong>典型场景：</strong>任务需运行数小时到数天、需断点恢复、需多轮生成-评估博弈时，必须写循环而非写 Prompt。</p>
  <p><strong>边界说明：</strong>简单单次问答、短链路 Demo 仍可用 Prompt；长程、有状态、需验收的生产系统必须用 Loop。</p>
  <div class="quote">原文：「如果你发现自己凌晨三点还在反复调试某一个 Prompt，那你还停留在提示词时代。请关掉那个 Playground 标签页，开始写循环吧。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】三角色分离 + 磁盘状态 + 合同协商</h3>
  <p><strong>核心思路：</strong>把「既当裁判又当选手」的自我评分彻底拆开，用磁盘文件固定真相，用可测试断言合同约束验收。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. <strong>三角色三窗口：</strong>Planner 写 Spec 不碰代码；Generator 写代码不自评；Evaluator 从第一秒就假设「代码肯定有 Bug」。</p>
  <p>2. <strong>先协商合同：</strong>Generator 提出「如何算完成」，Evaluator 反驳，通过磁盘 Markdown 拉锯至 27 条左右可测试断言（10 条太少易放水）。</p>
  <p>3. <strong>状态写磁盘：</strong>维护 feature_list.json、progress.md、contract.md、log.md（追加格式 ## [YYYY-MM-DD] op | title）。</p>
  <p>4. <strong>允许推倒重来：</strong>新一代模型在死胡同时会删库重来——有干净 Evaluator + 磁盘合同时，第 11 次迭代可交付完好版本。</p>
  <p><strong>选型条件：</strong>需要可审计、可恢复、防上下文腐化时用磁盘；纯聊天式短会话仍可用内存上下文。</p>
  <div class="pitfall">避坑：角色混用导致模型谄媚，循环悄无声息收敛出 Slop；上下文窗口会压缩、退化、撒谎，磁盘文件不会。</div>
  <div class="highlight">落地检验：若无法用三个文件向模型描述清楚当前状态，说明系统状态设计过于复杂。</div>
</div>

<div class="card">
  <h3>【决策/选型表】何时人类介入 vs 让循环自治</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>构建失败（编译报错）</td><td>让循环自行重试/推倒重来</td><td>Build Failures 不需要人类插手</td><td>人工每次修编译错误</td><td>打断循环自愈，无法暴露 Harness 缺陷</td></tr>
    <tr><td>合同本身定错</td><td>人类介入修订 contract.md</td><td>验收标准错误会导致全链路跑偏</td><td>继续让 Generator 硬改</td><td>在错误目标上优化只会更快产出垃圾</td></tr>
    <tr><td>主观体验验收</td><td>Evaluator 四维度加权打分</td><td>设计/原创性/工艺/功能性可量化</td><td>纯靠 Generator 自评</td><td>模型向错误品味指标收敛</td></tr>
    <tr><td>调试循环行为</td><td>读 Trace 用 grep 定位分歧点</td><td>与读 stack trace 同一块肌肉</td><td>盲目做下一次实验</td><td>仅凭玄学 Vibe 调优</td></tr>
    <tr><td>新模型发布</td><td>对照删减 Harness 冗余逻辑</td><td>Harness 为弥补模型缺陷而存在</td><td>只加不减的 Harness</td><td>说明已看不懂也不再阅读自己的控制代码</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】长程 Agent 常见失效模式</h3>
  <p><strong>坑名：</strong>上下文腐化 + 自我谄媚——运行数小时后 Agent 把一小时前的话藏在自生成摘要后面。</p>
  <p><strong>原因：</strong>状态塞进 Context Window 而非磁盘；Generator 与 Evaluator 角色未分离。</p>
  <div class="quote">原文：「LLM 的上下文窗口是会撒谎的。它们会发生信息压缩、会随着对话变长而退化。」</div>
  <p><strong>解法：</strong>Write to Disk, Not to Context；崩溃后仅靠三个文件即可断点续跑。</p>
  <p><strong>严重程度：</strong>致命——「Demo 很惊艳，落地就抓狂」的主因。</p>
  <div class="pitfall"><strong>老模型陷阱：</strong>给坏代码层层打补丁成考古遗迹；新模型 + 干净 Evaluator 会果断删库重来——不要打断重启行为。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】瓶颈永远在移动</h3>
  <p><strong>原则：</strong>设计循环的唯一目的，是让下一个瓶颈清晰暴露——你永远没有「大功告成」的那天。</p>
  <p><strong>为什么重要：</strong>Coding 不再是瓶颈 → Planning 成瓶颈 → Verification 自动化后 → Taste 成瓶颈；每次迁移都需重构更轻的 Harness。</p>
  <p><strong>原文支撑：</strong>「如果你的系统运行得无比顺滑、毫无阻碍，那只能说明你观察得还不够仔细。」</p>
  <p><strong>怎么落地：</strong>给主观体验建四维度评分 + 好/坏参考站校准；读完整 Transcript 而非盲试；新模型发布时删掉模型已能自主搞定的逻辑。</p>
  <p><strong>适用边界：</strong>品味指标需小心制定——模型不会凭空创造品味，只会向你描述的指标收敛。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「Prompt 极简主义」派 / 快速 Demo 倡导者</p>
  <p class="rebuttal-text">三角色、磁盘合同、27 条断言是过度工程——多数产品一周上线、用户只在乎功能有没有，为「数日级 Agent」设计的 Harness 会把简单任务拖成运维负担。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Agent 落地失败根因多在 Harness 而非模型智商——控制流、状态持久化、多角色博弈是一等公民。</li>
    <li>标准循环五动词：Gather → Reason → Act → Verify → Repeat；Karpathy 9 条法则皆其注脚。</li>
    <li>Planner / Generator / Evaluator 必须分离，合同前置为可测试断言，状态落盘而非塞进上下文。</li>
    <li>允许循环推倒重来；构建失败不必人工介入，合同定错才需人类。</li>
    <li>瓶颈从 Coding 迁移到 Planning、Verification、Taste——Harness 应随模型进化只减不加。</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>为当前 Agent 项目建立 feature_list.json、progress.md、contract.md、log.md 四文件状态协议。</li>
    <li>拆出独立 Evaluator 上下文，系统提示首句写入「这代码肯定有 Bug，你的任务是找证据」。</li>
    <li>下次 Agent 跑偏时，把完整 Transcript 重定向到文件，grep 定位「判断开始分歧」的瞬间再改 Prompt。</li>
    <li>在写第一行代码前，让 Generator 与 Evaluator 就「完成定义」在磁盘上拉锯至至少 20 条断言。</li>
    <li>新模型发布后对照审视 Harness，删除模型已能自主完成的控制逻辑。</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「Prompt 工程师」进化为「系统级循环工程师」——技术形式在变，工程本质未变：管理复杂性，消除不确定性；下次 Agent 频频跑偏时，停下调 Prompt 的手，审视支撑它的那条循环。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
