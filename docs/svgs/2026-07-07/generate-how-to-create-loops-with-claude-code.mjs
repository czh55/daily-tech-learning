import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'how-to-create-loops-with-claude-code.svg');

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
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
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
<h1>如何使用 Claude Code 构建 AI 循环系统（Loops）</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Claude Code</span>
  <span class="tag tag-green">Loop Engineering</span>
  <span class="tag tag-orange">4文件系统</span>
  <span class="tag tag-purple">权限阶梯</span>
</div>
<p class="subtitle">本文解决的核心问题是：如何把 Claude Code 从「一锤子买卖」的一次性 Prompt 调用，升级为可跨会话断点续传、有强验证与失败退路的「睡后运行」自动化循环系统。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">循环六要素闭环</h3>
  <div class="diagram">
    <div class="node-orange">触发器<br><span style="font-size:11px;font-weight:400">Cron/手动/CI</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">上下文<br><span style="font-size:11px;font-weight:400">读 TASK/PROGRESS</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">行动<br><span style="font-size:11px;font-weight:400">写 outputs/</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">验证<br><span style="font-size:11px;font-weight:400">独立监工</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">状态更新<br><span style="font-size:11px;font-weight:400">PROGRESS.md</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">决策<br><span style="font-size:11px;font-weight:400">继续/停止/升级</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">4 文件系统：TASK.md · LOOP_INSTRUCTIONS.md · PROGRESS.md · outputs/</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「循环 = 重复问 Claude 同一个问题」或「/loop 命令本身就是魔法」—— 循环是可复用的工作流结构，/loop 只是定时器，真正生命力来自 4 文件结构、SOP、强验证与状态持久化。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Loop vs 一次性 Prompt</h3>
  <p><strong>在讲什么问题：</strong>为什么高频重复工作（日报、CI 排查、进度监控）不能用「每天重新润色 Prompt」解决？</p>
  <p><strong>核心机制：</strong>Claude 会话是临时性的；循环在聊天窗口外持久化状态，让模型读取上次发生的事并在断点处接棒。模型负责推理，循环提供运转框架。</p>
  <p><strong>关键理解：</strong>漏掉验证 → 盲目自信容忍垃圾产出；漏掉状态 → 每次从零开始；漏掉决策 → 沦为不知何时停下的死循环。</p>
  <p><strong>典型场景：</strong>每日项目审查、CI 失败排查、GitHub Issue 梳理、文档缺陷自查、周度回顾沉淀。</p>
  <p><strong>边界说明：</strong>一次性简单任务仍可用 One-shot；需跨天/跨会话记忆、有明确终止条件的重复工作才值得建 Loop。</p>
  <div class="quote">原文：「没有循环，每一次运行都是从零开始；而有了循环，Claude 能够读取上一次发生的事，并在上一次停下的地方完美接棒。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】极简 4 文件系统搭建</h3>
  <p><strong>核心思路：</strong>无需数据库和后台，用 4 个 Markdown 文件定义目标、SOP、记忆与产出。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 创建目录结构：<code>my-loop/TASK.md</code>、<code>LOOP_INSTRUCTIONS.md</code>、<code>PROGRESS.md</code>、<code>outputs/</code></p>
  <p>2. <strong>TASK.md</strong>：写高层次目标、预期输出、Scope 与禁止行为（Do Not 规则）</p>
  <p>3. <strong>PROGRESS.md</strong>：维护当前状态、上次运行记录、Open Items、Blockers、Needs Human Review、Next Run Should</p>
  <p>4. <strong>LOOP_INSTRUCTIONS.md</strong>：启动准备 → 标准操作流程 → 安全红线 → 异常失败策略（Failure Policy）</p>
  <p>5. 手动跑通 3-5 次模拟变更，确认断点续传后再部署 <code>/loop 24h</code></p>
  <div class="highlight"><strong>PROGRESS.md 铁律：</strong>决策依赖的信息保留在 PROGRESS；仅留档备份的记录移到 outputs/history/。永远膨胀的状态文件等同于无用。</div>
  <div class="pitfall">避坑：第一版循环必须有明确「禁止行为」——不是不信任 Claude，而是合格工程师的职业素养。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】强验证与 Worker/Verifier 分离</h3>
  <p><strong>核心思路：</strong>循环停下来不是因为模型「觉得写完了」，而是硬性约束条件通过了校验。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. Worker 会话：按 LOOP_INSTRUCTIONS 执行并更新 outputs/ 与 PROGRESS.md</p>
  <p>2. Verifier 会话（独立）：对照验证清单逐项体检，严禁修改任何文件</p>
  <p>3. 验证报告须含 5 项：通过项、失败项、被改文件列表、是否可安全接收、需人工确认的疑点</p>
  <p>4. 弱验证（「看起来行不行」）→ 强验证（「7 条指标全部 PASS 才标记 Accepted」）</p>
  <div class="pitfall">避坑：Claude 自信汇报完成、报告缺章节、PROGRESS 敷衍涂改、悄悄改了源码——这些致命失误往往在系统跑崩后才被发现。</div>
  <div class="quote">原文：「干活的与监工的，必须彻底分离。」</div>
</div>

<div class="card">
  <h3>【决策/选型表】/loop vs /goal 与权限阶梯</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>每日监控、日报生成</td><td><code>/loop 24h</code></td><td>基于时间触发，到期再跑</td><td><code>/goal</code></td><td>目标触发适合「不达标不停」场景</td></tr>
    <tr><td>修复 Bug 直到测试全过</td><td><code>/goal</code> 条件表达式</td><td>基于状态/目标触发，不达目标不停</td><td>固定间隔 /loop</td><td>时间到了但目标未达成会空转</td></tr>
    <tr><td>第一个循环系统</td><td>权限阶梯 L1-L2（只读/outputs 草稿）</td><td>即使 L1-L2 也有巨大价值：汇总信息无需碰重要文件</td><td>一上来开放 Slack/合并 Master</td><td>幻觉一旦发生是毁灭性车祸</td></tr>
    <tr><td>本地循环稳定后</td><td>逐步加 GitHub/Slack（先只读再草拟）</td><td>每增一工具扩大破坏半径，须详尽 Tool Permissions Policy</td><td>未列出的工具擅自使用</td><td>后台做出意料之外的事</td></tr>
    <tr><td>测试节奏观察</td><td><code>/loop 15m</code></td><td>短间隔便于盯过程</td><td>未手动验证就部署自动调度</td><td>五大死穴之首</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】摧毁循环系统的 5 大致命死穴</h3>
  <p><strong>坑名：</strong>手动测试未通过就部署自动调度，或无状态/无验证/无失败策略。</p>
  <p><strong>原因：</strong>把「觉得更强大」当终止条件——无客观 Checklist、无状态记录、无验证机制。</p>
  <div class="quote">原文反面教材：「每天持续优化产品战略文档，直到觉得它变得更强大。」—— 要么一事无成，要么把不想改的文件改得面目全非。</div>
  <p><strong>解法：</strong>① 手动跑通 3-5 次 ② 配置 PROGRESS.md ③ 引入独立 Verifier ④ 写 Failure Policy ⑤ 从 L1-L2 权限起步，证明稳定后再升级。</p>
  <p><strong>严重程度：</strong>致命——过早接入太多工具会使出错时破坏半径指数级扩大。</p>
  <div class="pitfall">优秀循环特征：明确定时计划、严格限制范围、可预测输出文件、绝对安全权限边界——差距不在模型智商，而在系统设计。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】引入循环前后的世界线</h3>
  <table>
    <tr><th>对比维度</th><th>引入循环前</th><th>引入循环后</th><th>一句话结论</th></tr>
    <tr><td>记忆</td><td>会话结束上下文清空</td><td>PROGRESS.md 跨会话传递</td><td>状态在聊天窗外</td></tr>
    <tr><td>行为控制</td><td>每次重新润色 Prompt</td><td>LOOP_INSTRUCTIONS 如法律控死行为</td><td>审输出不审 Prompt</td></tr>
    <tr><td>质量保障</td><td>肉眼跟踪文件变化</td><td>独立 Verifier + 硬性 Checklist</td><td>瓶颈转向审查验证</td></tr>
    <tr><td>自动化</td><td>人工重复体力劳动</td><td>读取→执行→验证→更新→停止闭环</td><td>睡后仍在运转</td></tr>
    <tr><td>权限</td><td>无边界或全开</td><td>6 级权限阶梯渐进放权</td><td>成熟工程化体现</td></tr>
  </table>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「YAGNI 极简派」/ 反对过度流程的敏捷倡导者</p>
  <p class="rebuttal-text">四个 Markdown 加双会话验证是官僚化——多数团队真正需要的是能跑的脚本和 Cron，不是给 AI 写 SOP 手册，文件越多维护成本越高、循环本身就成了新债务。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>循环 ≠ 重复 Prompt，而是触发器→上下文→行动→验证→状态→决策的六要素闭环</li>
    <li>4 文件系统（TASK / INSTRUCTIONS / PROGRESS / outputs）零架构成本即可落地</li>
    <li>PROGRESS.md 是控制面板不是档案馆；Worker 与 Verifier 必须分离</li>
    <li>权限从 L1-L2 起步，手动验证 3-5 次后再 /loop 自动调度</li>
    <li>系统瓶颈从「如何生成」转向「如何审查验证」—— 你设计的是无需肉身盯防的自动化系统</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>在项目目录创建 4 文件结构，复制文中 TASK / PROGRESS / LOOP_INSTRUCTIONS 模板</li>
    <li>用 Claude Code 手动触发一次每日审查循环，检查 outputs 与 PROGRESS 更新</li>
    <li>模拟 3 次项目变更后重跑，确认断点续传</li>
    <li>开独立 Verifier 会话做强验证，对照 7 条硬性指标</li>
    <li>稳定后配置 <code>/loop 24h</code>，第一周人工复审每次输出</li>
  </ol>
  <p><strong>关键认知转变：</strong>调 Prompt 是教 AI「说一句话」，建 Loop 是教 AI「打一份工」—— 从 AI 使用者进化为系统架构师。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
