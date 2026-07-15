import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'deepagents-code-memory-state.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.diagram{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:90px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
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
<h1>DeepAgents Code 记忆与状态管理</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">DeepAgents</span>
  <span class="tag tag-green">LangGraph</span>
  <span class="tag tag-orange">Checkpoint</span>
  <span class="tag tag-purple">AGENTS.md</span>
</div>
<p class="subtitle">本文解决的核心问题是：生产级编码智能体如何在单次会话内通过检查点、缓存与异步 IO 实现无损状态恢复，又如何在跨会话层面用分层 AGENTS.md、记忆注入模板与防护中间件沉淀长期知识，同时应对上下文窗口上限与记忆文件被污染的安全风险。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">短期状态 vs 长期记忆</h3>
  <div class="diagram">
    <div class="node-orange">LangGraph Checkpoint<br><span style="font-size:11px;font-weight:400">SQLite + aiosqlite</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">sessions.py 缓存层<br><span style="font-size:11px;font-weight:400">多级缓存降写入</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">ResumeStateMiddleware<br><span style="font-size:11px;font-weight:400">model_spec + tokens</span></div>
    <span class="arrow-sym">|</span>
    <div class="node">AGENTS.md 分层<br><span style="font-size:11px;font-weight:400">用户级 + 项目级</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">MemoryMiddleware<br><span style="font-size:11px;font-weight:400">注入 + 防护</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「LangGraph 有 Checkpoint 就等于生产级会话恢复」——原生检查点只存 messages，不记 model_spec 与 context_tokens；高频实时写库还会成为性能瓶颈，DeepAgents Code 用中间件补元信息、用缓存层减 IO。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】状态管理架构</h3>
  <p><strong>在讲什么问题：</strong>智能体不是一次性消费品，必须把对话与运行环境持久化并随时恢复，且不能因 Token 暴涨或模型切换导致恢复后行为失真。</p>
  <p><strong>核心机制：</strong>以 LangGraph checkpoints 表为基石，每次执行结束异步落盘 SQLite；sessions.py 提供 list_threads/get_thread/delete_thread，并对消息数、初始提示、最近线程列表设多级缓存（键为 checkpoint_id）。</p>
  <p><strong>关键理解：</strong>ResumeStateMiddleware 在每个检查点额外持久化 _context_tokens 与 _model_spec，恢复时能精确还原模型环境与上下文占用，避免「消息在但模型错了」的隐性故障。</p>
  <p><strong>典型场景：</strong>用户用 deepseek 聊 20 轮后关终端，次日 /threads 恢复同一 thread_id，UI 渲染 42 条历史并自动切回 deepseek、状态栏显示 85K/200K tokens。</p>
  <p><strong>边界说明：</strong>检查点损坏、模型 Provider 不可用、远程沙箱已清理三类边界有明确降级：报错提示、回退默认模型并警告、提示重建沙箱。</p>
  <div class="quote">原文：LangGraph 原生的检查点机制存在两个明显不足：信息维度单一；实时写入开销大。DeepAgents Code 用中间件补全元信息，用分层缓存加异步持久解决。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】会话恢复五步法与上下文压缩</h3>
  <p><strong>操作步骤：</strong>① list_threads 查 checkpoints 表得 ThreadInfo ② 用户选择线程 ③ 注入 thread_id ④ LangGraph 读最新快照（含 _model_spec/_context_tokens）⑤ 重建 UI 并切换模型。</p>
  <p><strong>手动压缩 /offload：</strong>offload.py 检查 Token 阈值，调用 Summarization 中间件，OffloadResult 返回 messages_offloaded、tokens_before/after、pct_decrease。</p>
  <p><strong>保留策略三选一：</strong>messages（最后 N 条）、tokens（最后 N token）、fraction（上下文窗口比例），与 Summarization 中间件一脉相承。</p>
  <p><strong>自动压缩：</strong>Summarization 中间件在接近窗口阈值时自动摘要早期对话，与 /offload 手动路径互补。</p>
  <div class="highlight"><strong>落地：</strong>长会话场景先确认 ResumeStateMiddleware 已启用；接近窗口上限时优先 /offload 并查看 pct_decrease；多模型切换务必依赖检查点中的 _model_spec 而非用户手动记模型名。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】短期状态 vs 长期记忆</h3>
  <table>
    <tr><th>对比维度</th><th>短期状态（Checkpoint）</th><th>长期记忆（AGENTS.md）</th><th>一句话结论</th></tr>
    <tr><td>存储载体</td><td>SQLite checkpoints 表</td><td>分层 Markdown 文件</td><td>会话连续 vs 跨会话进化</td></tr>
    <tr><td>核心组件</td><td>sessions.py + ResumeStateMiddleware</td><td>MemoryMiddleware + ManagedMemoryGuardMiddleware</td><td>工程层分工明确</td></tr>
    <tr><td>恢复内容</td><td>消息列表 + 模型 + Token 计数</td><td>用户偏好与项目约定</td><td>状态恢复不等于经验沉淀</td></tr>
    <tr><td>写入方式</td><td>每次执行结束自动检查点</td><td>edit_file、Onboarding、/remember 技能</td><td>长期记忆需行为规约防污染</td></tr>
    <tr><td>安全风险</td><td>库损坏、沙箱失效</td><td>恶意 AGENTS.md 提示注入</td><td>记忆模板声明「参考数据非系统指令」</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】记忆注入与保护区</h3>
  <p><strong>提示注入：</strong>MEMORY_SYSTEM_PROMPT 用 agent_memory 标签包裹内容，memory_guidelines 明确记忆是磁盘参考数据，与用户当前要求冲突时以用户为准。</p>
  <p><strong>无关信息污染：</strong>模板规定何时更新（用户说「记住我的邮箱」）与何时不更新（临时闲聊），避免 AGENTS.md 膨胀。</p>
  <p><strong>系统保留区被改：</strong>Onboarding 写入的名称区块用 HTML 注释标记；ManagedMemoryGuardMiddleware 拦截 write_file/edit_file，仅回滚保护区块并反馈错误，其余修改保留。</p>
  <p><strong>注入顺序陷阱：</strong>memory_sources 用户级在前、项目级在后，拼接时项目级更靠后，模型优先采纳项目约定而非全局偏好。</p>
  <div class="pitfall"><strong>严重程度：小心。</strong>若关闭 enable_memory 或未装 ManagedMemoryGuard，智能体可能覆盖 Onboarding 保留区或把恶意第三方写入的 AGENTS.md 当作不可违抗指令。</div>
</div>

<div class="card">
  <h3>【决策/选型表】压缩与记忆策略选型</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>对话 Token 逼近上限</td><td>自动 Summarization + 必要时 /offload</td><td>双路径覆盖被动与主动压缩</td><td>硬截断早期消息</td><td>造成事实丢失或生成中断</td></tr>
    <tr><td>消息长度较均匀</td><td>保留策略 messages（最后 N 条）</td><td>配置简单，行为可预期</td><td>固定条数应对长短消息混杂</td><td>Token 占用波动大</td></tr>
    <tr><td>需精确控上下文</td><td>保留策略 tokens</td><td>直接对准窗口预算</td><td>仅按条数保留</td><td>单条超长消息可撑爆窗口</td></tr>
    <tr><td>多模型窗口差异大</td><td>保留策略 fraction</td><td>按比例自适应不同模型</td><td>写死绝对 Token 上限</td><td>换模型后策略失效</td></tr>
    <tr><td>跨项目通用偏好</td><td>用户级 ~/.deepagents/.../AGENTS.md</td><td>全局共享编码风格等</td><td>全部写入项目级</td><td>项目切换时偏好无法携带</td></tr>
    <tr><td>项目特有约定</td><td>项目级 .deepagents/AGENTS.md</td><td>pnpm 路径、迁移脚本位置等</td><td>写入用户级</td><td>污染其他项目环境</td></tr>
  </table>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：向量数据库长期记忆派 / 「AGENTS.md 太原始上不了生产」</p>
  <p class="rebuttal-text">分层 Markdown 加注入模板与 ManagedMemoryGuard 恰恰把可审计、可 diff、可防注入放在首位——生产级先要可靠恢复与明确边界，而非把记忆黑盒化进 embedding 检索。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>短期状态靠 LangGraph Checkpoint + sessions.py 异步 IO 与多级缓存，ResumeStateMiddleware 补全 model_spec 与 context_tokens。</li>
    <li>会话恢复五环节链路完整，边界场景（库损坏、模型不可用、沙箱失效）均有防御性设计。</li>
    <li>上下文压缩分自动 Summarization 与手动 /offload，保留策略支持 messages、tokens、fraction 三模式。</li>
    <li>长期记忆用分层 AGENTS.md + MemoryMiddleware 注入模板，项目级优先于用户级；ManagedMemoryGuard 锁定 Onboarding 保留区。</li>
    <li>整套设计是 LangChain 团队对生产级智能体可靠性、安全性与可扩展性的务实回应。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>检查 DeepAgents Code 是否启用 ResumeStateMiddleware 与 enable_memory，确认恢复后模型与 Token 栏一致。</li>
    <li>为长会话配置合适的 offload 保留策略（tokens 或 fraction 优先于纯 messages）。</li>
    <li>初始化用户级与项目级 AGENTS.md，把 pnpm/迁移路径等项目约定写入项目层。</li>
    <li>试用 /remember 技能沉淀架构决策，确认 ManagedMemoryGuard 未误拦合法编辑。</li>
    <li>在沙箱依赖场景恢复前验证远程环境仍存活，避免静默失败。</li>
  </ol>
  <p><strong>关键认知转变：</strong>智能体设计的核心一环是记忆与状态——没有持续记忆就无法进化；短期检查点解决「这次聊到哪」，长期 AGENTS.md 解决「下次能否更懂这个项目」，二者工程实现完全不同不可混用。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
