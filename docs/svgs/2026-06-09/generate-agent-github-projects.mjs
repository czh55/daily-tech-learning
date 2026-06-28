import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'agent-github-projects.svg');

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
<h1>智能体从入门到精通：6个必学GitHub开源项目</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">AI Agent</span>
  <span class="tag tag-green">开源学习路径</span>
  <span class="tag tag-orange">数字员工</span>
  <span class="tag tag-purple">作者：大模型真好玩</span>
</div>
<p class="subtitle">本文解决的核心问题是：面对 OpenClaw 40 万行代码的 intimidation，程序员如何按难度梯度从 100 行 demo 走到工业级 Agent，真正从「调 API 使用者」变成「智能体构建者」。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">Hello-Agents<br/>系统教程</div>
    <span class="arrow-sym">→</span>
    <div class="node">nanoAgent<br/>115 行</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">mini-swe<br/>100 行 bash</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Nanobot<br/>4000 行</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Hermes<br/>进化 Agent</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">OpenClaw<br/>40 万行</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「会用 LangChain 调 API = 会智能体」—— 知其然不知其所以然是程序员大忌；真正搞懂有时从 100 行循环或 4000 行可读项目开始，而非直接啃 40 万行。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Agent 本质：思考-行动-观察循环</h3>
  <p><strong>在讲什么问题：</strong>智能体底层到底在干什么，和「对话框问答」有何不同？</p>
  <p><strong>核心机制：</strong>ReAct 无限循环——模型决定调用哪个工具 → 执行 → 结果追加到对话历史 → 直到任务完成。</p>
  <p><strong>关键理解：</strong>nanoAgent 115 行用 Function Calling 实现 execute_bash/read_file/write_file，即 OpenClaw/Claude Code 工具调用的同一原理。</p>
  <p><strong>怎么落地：</strong>① 读 agent.py 单文件 ② 自己加一个工具 ③ 处理「工具不存在」的健壮错误返回。</p>
  <p><strong>边界说明：</strong>115 行 demo 无记忆/多渠道/安全沙箱——生产需 Nanobot 级以上架构。</p>
  <div class="highlight"><strong>落地建议：</strong>花 1 小时读完 nanoAgent，手写一个带 3 个工具的最小 ReAct loop，再考虑 LangChain。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】mini-swe-agent：极简主义 SWE-bench 68%</h3>
  <p><strong>方法名：</strong>100 行 Agent + bash 通用接口</p>
  <p><strong>核心思路：</strong>模型变强后，复杂工具调用接口不再必要——每步输出思考 + bash 命令，执行结果追加历史。</p>
  <p><strong>操作步骤：</strong>① 克隆 mini-swe-agent ② 读 Agent/Model/Environment 模块划分 ③ 在 SWE-bench Verified 对比原版 12% → 68%。</p>
  <p><strong>避坑：</strong>功能堆叠≠更强——「能删就删」是核心设计哲学。</p>
  <div class="relation"><strong>与 nanoAgent 的区别：</strong>后者用 Function Calling；前者用 bash 作为 universal interface，模块耦合更低。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Nanobot：4000 行生产级最小可行架构</h3>
  <p><strong>方法名：</strong>港大 Data Intelligence Lab 轻量 OpenClaw 替代</p>
  <p><strong>核心思路：</strong>相比 OpenClaw 40 万行缩减 99%，保留 Agent 循环、工具、Telegram/WhatsApp、定时任务、上下文压缩、持久记忆。</p>
  <p><strong>操作步骤：</strong>① 一次性通读 4000 行 ② 研究消息拆分/邮箱循环防护/沙箱 ③ 跑 WebUI 多会话。</p>
  <p><strong>选型条件：</strong>想写「真正能跑、能接 IM、能长期记忆」的数字员工 → Nanobot；只想懂原理 → nanoAgent。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Hermes Agent：会自己进化的长期系统</h3>
  <p><strong>在讲什么问题：</strong>与一次性执行器 OpenClaw 的本质差异？</p>
  <p><strong>核心机制：</strong>历史会话存本地 DB → 全文检索 + 模型摘要 → 任务完成后抽象为 Skill（步骤/陷阱/验证）→ 下次直接复用。</p>
  <p><strong>关键理解：</strong>四个环节：环境感知 → 技能编译 → 效果评估 → 迭代优化。</p>
  <p><strong>怎么落地（读大型项目）：</strong>① 用 Claude Code 分析整体设计 ② 选一个特性（如记忆机制）画流程图 ③ 定位关键代码精读 ④ 联想工作中可借鉴点。</p>
  <p><strong>边界说明：</strong>不必理解每一行——针对性学设计思路即可。</p>
</div>

<div class="card">
  <h3>【对比分析卡】六个项目难度与能力矩阵</h3>
  <table>
    <tr><th>对比维度</th><th>Hello-Agents / nanoAgent</th><th>mini-swe / Nanobot</th><th>Hermes / OpenClaw</th><th>一句话结论</th></tr>
    <tr><td>代码量</td><td>教程 / 115 行</td><td>100 行 / 4000 行</td><td>大型 / 40 万行</td><td>按量级递进</td></tr>
    <tr><td>核心能力</td><td>ReAct + Function Calling</td><td>bash 接口 + 生产细节</td><td>记忆/Skill/生态</td><td>每层加一种维度</td></tr>
    <tr><td>学习策略</td><td>通读 + 手写</td><td>模块划分 + 跑 benchmark</td><td>特性聚焦 + AI 辅助分析</td><td>大项目别从头硬啃</td></tr>
    <tr><td>生产可用</td><td>否（教学）</td><td>基准/轻量可用</td><td>工业级</td><td>工作仍可用 LangChain</td></tr>
  </table>
</div>

<div class="card">
  <h3>【对比分析卡】学习路径选型表</h3>
  <table>
    <tr><th>场景</th><th>推荐项目</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>完全零基础</td><td>Hello-Agents → nanoAgent</td><td>系统教程 + 1 小时搞懂循环</td><td>直接 OpenClaw</td><td>40 万行劝退</td></tr>
    <tr><td>被 LangChain 搞晕</td><td>mini-swe-agent</td><td>100 行看清 bash 接口思路</td><td>继续堆框架抽象</td><td>只知用不知原理</td></tr>
    <tr><td>要做 IM 数字员工</td><td>Nanobot</td><td>4000 行完整功能可读</td><td>从 nano 直接跳 OpenClaw</td><td>缺生产细节过渡</td></tr>
    <tr><td>工业架构/design pattern</td><td>Hermes → OpenClaw</td><td>记忆/Skill/四层架构</td><td>只看文档不调代码</td><td>无法内化设计</td></tr>
    <tr><td>工作中快速交付</td><td>LangChain/LangGraph</td><td>容错与生态成熟</td><td>每项目手搓框架</td><td>重复造轮子</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】OpenClaw 与大型项目阅读陷阱</h3>
  <p><strong>坑：OpenClaw 源码第一眼就关网页，转去 LangChain 自我安慰</strong></p>
  <p><strong>原因：</strong>缺缓坡路径，直接从 40 万行起步必然失败。</p>
  <p><strong>解法：</strong>严格按 6 项目顺序：115 行 → 100 行 bash → 4000 行 → 大型。</p>
  <p><strong>严重程度：</strong>小心——长期停留在 API 调用层，AI 时代竞争力不足。</p>
  <div class="pitfall"><strong>另一个坑：</strong>读 Hermes/OpenClaw 试图理解每一部分。作者建议：列设计思路 → 聚焦一个特性 → 画流程图 → 定位关键代码。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：OpenClaw 生态原教旨主义者 · 「集成广度即护城河」派</p>
  <p class="rebuttal-text">Hermes 的学习回路再聪明，也无法 overnight 复制 OpenClaw 25+ 频道原生集成和 ClawHub 四万 Skill 的网络效应——对已 all-in OpenClaw 的团队等于推倒重来。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>2026 是「智能体之年」—— 模型再强，不能干活就价值有限</li>
    <li>6 个项目构成从易到难的完整缓坡：教程 → 115 行 → bash Agent → 4000 行生产 → Hermes 进化 → OpenClaw 生态</li>
    <li>Agent 底层统一是 ReAct 循环 + 工具调用；差异在记忆、多渠道、Skill、架构分层</li>
    <li>OpenClaw 四层架构：Gateway → Agent 核心 → Skills 库 → Memory</li>
    <li>工作中仍可用 LangChain，但构建者必须懂原理</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>今天打开 Hello-Agents GitHub，跑通第一个示例</li>
    <li>用 1 小时读完 nanoAgent agent.py，手写 3 工具 ReAct loop</li>
    <li>克隆 mini-swe-agent，理解 bash-as-interface 与 68% SWE-bench</li>
    <li>通读 Nanobot 4000 行，画出模块划分图</li>
    <li>选 Hermes 记忆机制或 OpenClaw Gateway 层做特性聚焦精读</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「大模型使用者」到「智能体构建者」—— 搞懂原理有时从 100 行开始，而非从 40 万行结束。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
