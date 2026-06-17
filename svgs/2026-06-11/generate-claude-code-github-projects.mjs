import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'claude-code-github-projects.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:16px 20px;text-align:center;min-width:120px;font-weight:700;font-size:14px;color:#1e40af}
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
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>别拿Claude Code当对话框：这6个GitHub项目让你吃透代码智能体</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Claude Code</span>
  <span class="tag tag-green">代码智能体</span>
  <span class="tag tag-orange">Harness Engineering</span>
  <span class="tag tag-purple">作者：大模型真好玩</span>
</div>
<p class="subtitle">本文解决的核心问题是：如何把 Claude Code 从「问问题改代码的对话框」升级为多智能体工程团队，并按从易到难路径彻底理解代码智能体的工作原理。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">用好<br/>ECC + gstack</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">手搓<br/>learn-claude-code</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">框架<br/>deepagents-cli</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">开源替代<br/>OpenCode</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">源码<br/>claw-code</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Claude Code = 终端版 ChatGPT」—— 真正威力在多智能体协作（规划/架构/审查/安全分工）和 Harness Engineering（Skills/Rules/Hooks/Commands），而非基础问答。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Everything Claude Code：从实习生到专家团队</h3>
  <p><strong>方法名：</strong>Anthropic 黑客松冠军 Affaan Mustafa 的配置体系（非代码库）</p>
  <p><strong>核心思路：</strong>拆分单一 Agent 为规划/架构/代码审查/安全等子代理，各做擅长的事，避免大模型复杂任务幻觉与能力退化。</p>
  <p><strong>操作步骤：</strong>① 配置 Skills 外挂领域知识 ② Commands 压缩 Prompt（/plan、/code-review、/tdd）③ Rules 立规矩（禁硬编码 Key）④ Hooks 触发自动流程。</p>
  <p><strong>选型条件：</strong>已用 Claude Code/Codex/Cursor 但缺乏工程化思维 → 先 ECC；零基础 → 先 learn-claude-code。</p>
  <p><strong>避坑：</strong>配置体系可跨模型复用——别绑定单一 LLM。</p>
  <div class="highlight"><strong>落地建议：</strong>克隆 ECC 仓库，先配 /plan + /code-review 两个 Slash 命令，体验多 Agent 分工。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】gstack：YC CEO 的虚拟工程团队</h3>
  <p><strong>方法名：</strong>Garry Tan 开源的角色扮演技能包（Markdown 配置）</p>
  <p><strong>核心思路：</strong>不让一个 Agent 同时扮演 PM/架构师/程序员/QA/运维——拆角色，各有一套提示词和行为模式。</p>
  <p><strong>操作步骤：</strong>① 克隆 gstack ② 运行安装脚本 ③ 在 Claude Code 调用 /ceo /eng-manager /engineer /review /qa /release。</p>
  <p><strong>对比相邻方法：</strong>ECC 偏完整 Harness 体系；gstack 偏角色 Slash 命令，零外部依赖，学 CEO 如何设定角色约束。</p>
  <div class="relation"><strong>与 OpenClaw/Hermes 的共性：</strong>多智能体协同是 2026 最耀眼技术——gstack 是最轻量的入门样本。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】learn-claude-code：20 课递进手搓框架</h3>
  <p><strong>在讲什么问题：</strong>生产级代码智能体如何从骨架长成完整系统？</p>
  <p><strong>核心机制：</strong>第 1 课 01_agent_loop.py 不到 50 行实现最小循环；后续逐层叠加工具调用、任务规划、子 Agent、上下文压缩、多 Agent 协作。</p>
  <p><strong>关键理解：</strong>第 5 课——复杂任务必须显式计划；第 8 课——上下文不是数据库，必须管理和压缩。</p>
  <p><strong>怎么落地：</strong>每课一个可运行 Python 文件，只新增一个机制，条理极清晰。</p>
  <p><strong>边界说明：</strong>教学项目非生产框架——学完可转 deepagents-cli 或直接 LangChain。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】deepagents-cli (dcode)：LangChain 官方生产参考</h3>
  <p><strong>方法名：</strong>基于 DeepAgents + LangGraph 的 Claude Code 模仿 CLI</p>
  <p><strong>核心思路：</strong>架构比 Claude Code 更清晰——Checkpoint 恢复、时间旅行调试、子 Agent 并行、MCP 协议接入。</p>
  <p><strong>操作步骤：</strong>① MIT 协议可随意改 ② 99.4% Python ③ 研究内置工具/子 Agent 调度/代码沙箱实现。</p>
  <p><strong>选型条件：</strong>LangChain 技术栈团队快速搭生产级代码 Agent → dcode；想纯原理 → learn-claude-code。</p>
</div>

<div class="card">
  <h3>【对比分析卡】六个项目对比：用好 vs 懂原理</h3>
  <table>
    <tr><th>对比维度</th><th>ECC / gstack</th><th>learn-claude-code</th><th>deepagents / OpenCode</th><th>claw-code</th><th>一句话结论</th></tr>
    <tr><td>目标</td><td>用好多 Agent</td><td>手搓理解</td><td>生产/开源架构</td><td>官方源码存档</td><td>分两阶段学习</td></tr>
    <tr><td>形态</td><td>配置/MD 技能包</td><td>20 课 Python</td><td>完整 CLI 框架</td><td>51 万行 TS</td><td>配置 → 代码 → 源码</td></tr>
    <tr><td>难度</td><td>低（配置即用）</td><td>简单递进</td><td>中/困难</td><td>极难</td><td>严格按序</td></tr>
    <tr><td>独特价值</td><td>Harness Engineering</td><td>每机制一层</td><td>Client-Server 分离</td><td>唯一官方实现</td><td>先工具后原理</td></tr>
  </table>
</div>

<div class="card">
  <h3>【对比分析卡】代码智能体学习路径选型</h3>
  <table>
    <tr><th>场景</th><th>推荐项目</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>日常 Claude Code 提效</td><td>ECC + gstack</td><td>多角色分工 + Slash 命令</td><td>只用基础问答</td><td>浪费 80% 能力</td></tr>
    <tr><td>彻底搞懂 Agent Loop</td><td>learn-claude-code 20 课</td><td>50 行起步逐层叠加</td><td>直接读 51 万行</td><td>认知过载</td></tr>
    <tr><td>LangChain 生产落地</td><td>deepagents-cli</td><td>Checkpoint/MCP/子 Agent</td><td>纯教学 demo</td><td>缺生产基础设施</td></tr>
    <tr><td>Claude Code 替代方案</td><td>OpenCode</td><td>75+ LLM 热切换，6 种 Agent</td><td>闭源绑定 Anthropic</td><td>模型/vendor lock-in</td></tr>
    <tr><td>研究官方内部设计</td><td>instructkr/claw-code</td><td>npm 泄露源码公共存档</td><td>跳过前 5 项</td><td>无基础读不懂</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Claude Code 对话框误区与源码劝退</h3>
  <p><strong>坑：把 Claude Code 当对话框，问几个问题改几行代码</strong></p>
  <p><strong>原因：</strong>未激活多智能体协作和 Harness 工程化配置。</p>
  <p><strong>解法：</strong>第一部分先 ECC/gstack；第二部分再原理项目。</p>
  <p><strong>严重程度：</strong>小心——效率远低于团队级用法。</p>
  <div class="pitfall"><strong>另一个坑：</strong>直接挑战 instructkr/claw-code 51 万行。作者明确建议先学完前五个项目；OpenCode 的 TS+Bun+Go 混合架构也需中等以上基础。</div>
  <div class="pitfall"><strong>OpenCode 注：</strong>Anthropic 2026 年 3 月对其发律师函——说明开源替代已足够威胁闭源工具，但也需注意法律与合规边界。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Geohot 式 Agent 怀疑派</p>
  <p class="rebuttal-text">多 Agent 分工和 Harness 配置再精细，也无法 overnight 消除自主编码 Agent 的 Token 账单与错误决策半径——对已经用 Claude Code 基础问答提效的团队，折腾 ECC/gstack 的 ROI 未必划算。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>文章分两部分：用好（ECC + gstack 多 Agent）→ 懂原理（4 个 GitHub 项目递进）</li>
    <li>Harness Engineering 核心：Skills 知识库 + Commands 快捷指令 + Rules 强制规则 + Hooks 自动流程</li>
    <li>gstack 六角色覆盖产品→架构→开发→审查→QA→发布全链路</li>
    <li>原理路径：50 行 Agent Loop → DeepAgents 生产框架 → OpenCode 客户端-服务端 → 官方源码</li>
    <li>工作中仍可用 LangChain，但高级用户应能自己写一个程序员智能体</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>克隆 Everything Claude Code，配置 /plan 和 /code-review Slash 命令</li>
    <li>安装 gstack，用 /ceo 和 /eng-manager 评审下一个功能需求</li>
    <li>跑 learn-claude-code 第 1 课 01_agent_loop.py，理解最小循环</li>
    <li>LangChain 栈团队 fork deepagents-cli，研究 Checkpoint 与子 Agent 并行</li>
    <li>前五项完成后再评估是否挑战 OpenCode 或 claw-code 源码</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「AI 编程助手 = 对话框」到「虚拟工程团队 + 可手搓的 Agent 架构」—— Claude Code 的上限取决于你的 Harness 工程化程度，而非模型本身。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
