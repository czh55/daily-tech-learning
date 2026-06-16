import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'ai-agent-comparison.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:18px 24px;text-align:center;min-width:140px;font-weight:700;font-size:15px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:24px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 12px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>2026 年 8 大 AI Agent 横评：从 OpenClaw 到 Hermes，谁最适合你？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">AI Agent</span>
  <span class="tag tag-green">选型决策</span>
  <span class="tag tag-orange">安全对比</span>
  <span class="tag tag-purple">成本核算</span>
</div>
<p class="subtitle">本文解决的核心问题是：在 Claude Code、OpenClaw、Hermes 等八种 Agent 哲学各异的当下，如何按消息网关、自我进化、编码天花板、安全记录和真实成本五个硬约束选出匹配场景的方案，而非盲目追 GitHub Stars。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-orange">OpenClaw<br/>网关编排</div>
    <span class="arrow-sym">+</span>
    <div class="node-green">Hermes<br/>自我进化执行</div>
    <span class="arrow-sym">+</span>
    <div class="node">Claude Code<br/>编码天花板</div>
    <span class="arrow-sym">→</span>
    <div class="node">正交双修<br/>编排+执行+编码</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Stars 最高 = 最好」—— OpenClaw 353K Stars 但累计 138+ CVE、两个 CVSS 9.9；Hermes 189K 增速最快但行为会随学习回路变化。选型看场景匹配，不看关注度排名。</p>
</div>

<div class="card">
  <h3>【模板 A】三种 Agent 哲学拆解</h3>
  <p><strong>在讲什么问题：</strong>8 大 Agent 表面都是「AI 助手」，底层设计目标完全不同。</p>
  <p><strong>核心机制：</strong>Claude Code = 深度编码专注（SWE-bench 70-75%）；OpenClaw = 25+ 平台网关 + 确定性 Cron；Hermes = 完整学习回路 + 跨平台会话连续。</p>
  <p><strong>关键理解：</strong>三者正交——30% 经验用户双修/三修，而非二选一。</p>
  <p><strong>怎么落地：</strong>先回答「需要消息网关吗？」→ 需要则 Hermes/OpenClaw → 纯编码则 Claude Code/OpenCode/Codex。</p>
  <p><strong>边界说明：</strong>Hermes 自我进化意味着行为会变化，金融等确定性场景慎用；Claude Code 无网关、无跨会话记忆。</p>
  <div class="quote">原文：「不是『谁更好』，是『何时选谁』。OpenClaw 做编排，Hermes 做执行，Claude Code 做编码——三者正交。」</div>
</div>

<div class="card">
  <h3>【模板 D】首屏场景选型表</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>跨平台消息自动化</td><td>Hermes</td><td>自我进化 + 安全记录更优</td><td>仅看 Stars 选 OpenClaw</td><td>138+ CVE、13.5 万公网暴露实例</td></tr>
    <tr><td>Agent 随使用变强</td><td>Hermes</td><td>唯一完整学习回路</td><td>OpenClaw 静态 Skill</td><td>Skill 永远不自动改进</td></tr>
    <tr><td>编码天花板</td><td>Claude Code</td><td>SWE-bench 绝对领先</td><td>指望 Hermes 后端模型</td><td>编码能力 40-72% 取决于模型</td></tr>
    <tr><td>沙箱安全最高</td><td>Codex CLI</td><td>默认禁网 + 三档自治</td><td>裸奔 OpenClaw 公网部署</td><td>WebSocket 注入 + RCE 风险</td></tr>
    <tr><td>预算极低（5-20 元/月）</td><td>Hermes + GLM/DeepSeek</td><td>免费额度覆盖日常</td><td>Claude Code Max Plus</td><td>$200/月或 Opus 重度 $100+/天</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 E】安全维度硬数据对比</h3>
  <table>
    <tr><th>对比维度</th><th>Hermes</th><th>OpenClaw</th><th>Claude Code</th><th>一句话结论</th></tr>
    <tr><td>历史 CVE</td><td>1 低危（gateway）</td><td>138+（2× CVSS 9.9）</td><td>闭源不公开</td><td>公网敏感场景 OpenClaw 是硬约束</td></tr>
    <tr><td>恶意 Skill</td><td>低（155 内置为主）</td><td>高（341+ 已标记）</td><td>N/A</td><td>ClawHub 生态需严格审计</td></tr>
    <tr><td>沙箱隔离</td><td>Docker/Singularity/Modal</td><td>Docker 手动配置</td><td>内置沙箱</td><td>Codex 默认禁网最激进</td></tr>
    <tr><td>自我进化</td><td>完整学习回路</td><td>静态 Skill</td><td>无</td><td>复利 vs 可预测性 trade-off</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 B】双修架构落地步骤</h3>
  <p><strong>方法名：</strong>OpenClaw 编排 + Hermes 执行 + Claude Code 编码</p>
  <p><strong>核心思路：</strong>三层正交——编排层规划调度，执行层快速循环+学习，编码层处理复杂重构。</p>
  <p><strong>操作步骤：</strong>1. OpenClaw 负责 Cron 确定性触发和多频道路由 2. Hermes 执行可重复任务并记录学习回路 3. 编码任务委派 Claude Code，结果经 MCP 回传。</p>
  <p><strong>选型条件：</strong>20% 经验用户已采用；需要同时覆盖消息自动化、长期复利和编码天花板时。</p>
  <div class="highlight"><strong>落地建议：</strong>Hermes 跑 <code>hermes mcp serve</code>，让 Claude Code 通过 MCP 调用推送 Discord 通知；日常任务路由 GLM/DeepSeek 省 90% 成本。</div>
  <div class="pitfall"><strong>避坑：</strong>同一机器双 Bot 连同一 Discord 且 require_mention:false 会导致双重响应——停一个网关或强制 @提及。</div>
</div>

<div class="card">
  <h3>【模板 C】生产踩坑清单</h3>
  <p><strong>坑：自主 Agent Token 成本指数复利</strong></p>
  <p><strong>原因：</strong>每条消息发送完整对话历史，社区有 $131/天 Opus 极端案例。</p>
  <p><strong>解法：</strong>日常路由 GLM/DeepSeek 免费额度；复杂编码才切 Claude/GPT-5；控制会话长度。</p>
  <p><strong>严重程度：</strong>致命——预算失控可在数天内烧穿。</p>
  <div class="pitfall"><strong>另一个坑：</strong>Hermes Skill 自创建不设红线会建「野生 Skill」，与既有工作流产生平行路径；用 SOUL.md 限制自动创建范围。</div>
  <div class="pitfall"><strong>第三个坑：</strong>OpenClaw 记忆不可靠 + 更新破坏功能（305 赞帖）是迁移 Hermes 最大动力；可用 <code>hermes claw migrate</code> 单向迁移。</div>
</div>

<div class="card">
  <h3>【模板 F】选型心法：Stars 不等于质量</h3>
  <p><strong>原则：</strong>综合看 Stars 增速、CVE 记录、社区活跃度、场景匹配——不是谁 Star 多选谁。</p>
  <p><strong>为什么重要：</strong>OpenClaw 集成最广但安全债务最重；Hermes 复利化但行为不可预测。</p>
  <p><strong>怎么落地：</strong>按决策树：要网关？→ 要进化？→ Hermes；要 25+ 平台+Cron？→ OpenClaw；纯编码？→ Claude Code/OpenCode。</p>
  <p><strong>适用边界：</strong>金融交易等确定性输出场景优先 OpenClaw Cron 或 Claude Code 可预测行为。</p>
  <div class="quote">原文：「Stars 反映关注度，不反映质量。建议综合看：Stars 趋势 + CVE 记录 + 社区活跃度 + 是否匹配你的场景。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：OpenClaw 生态原教旨主义者 · 「集成广度即护城河」派</p>
  <p class="rebuttal-text">Hermes 的学习回路再聪明，也无法 overnight 复制 OpenClaw 25+ 频道原生集成和 ClawHub 四万 Skill 的网络效应——在安全债务面前换 Agent，对已经 all-in OpenClaw 的团队等于推倒重来。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>8 大 Agent 按哲学分三类：编码专注、网关编排、自我进化——场景决定选择</li>
    <li>Hermes 独有能力：学习回路、跨平台会话连续、MCP 反向服务、检查点回滚</li>
    <li>OpenClaw 优势是生态广度，劣势是 138+ CVE 和公网暴露风险</li>
    <li>成本关键变量是对话长度和模型路由，非软件本身价格</li>
    <li>20% 经验用户采用正交双修，而非单一 Agent 包办一切</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>用决策树回答：需要消息网关？需要自我进化？纯编码？</li>
    <li>查 CVE 记录和 Shodan 暴露数据，公网部署前做安全评估</li>
    <li>配置模型路由：日常 GLM/DeepSeek，复杂任务 Claude/GPT-5</li>
    <li>双 Bot 同平台时设置 require_mention:true 或停用一个网关</li>
    <li>为 Hermes 设置 SOUL.md 红线，限制自动 Skill 创建范围</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「选一个最好的 Agent」到「按编排、执行、编码三层正交组合，让各工具做最擅长的事」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
