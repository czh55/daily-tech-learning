import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'new-ai-stack-model-harness-loop-agent.svg');

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
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-color:#c4b5fd;color:#6b21a8}
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
<h1>全新 AI 技术栈：模型、Harness、Loop 与自我进化</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Harness</span>
  <span class="tag tag-green">Agent Loop</span>
  <span class="tag tag-purple">Self-Harness</span>
  <span class="tag tag-orange">上下文工程</span>
</div>
<p class="subtitle">本文解决的核心问题是：为什么同样的大模型，Claude Code 能丝滑跑完工程自动化，而你的 Agent 却在 20 步后上下文暴涨崩溃——Rahul 指出真正差距在 Harness 操作系统，而非模型智商本身。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">四层 AI 技术栈</h3>
  <div class="diagram">
    <div class="node">L1 模型<br><span style="font-size:11px;font-weight:400">被动 CPU</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">L2 Harness<br><span style="font-size:11px;font-weight:400">Loop+记忆+子Agent</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">L3 Optimizer<br><span style="font-size:11px;font-weight:400">Self-Harness</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">L4 Evaluator<br><span style="font-size:11px;font-weight:400">隔离盲测</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">模型权重固定 · 上下文与框架代码可进化 · SWE-bench 20%→50% 无需换模型</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「换更强的 GPT/Claude 就能让 Agent 变强」—— Transformer 架构已是公开积木，Claude Code 与周末练手项目的差距来自包裹模型的工程系统（Harness），而非底层模型本身。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Harness：模型的操作系统</h3>
  <p><strong>在讲什么问题：</strong>基础模型只是 passive CPU，无法单独交付生产级能力；Harness 决定规划、工具调用、记忆、状态、自评与回溯循环的全部行为。</p>
  <p><strong>核心机制：</strong>模型=CPU，Harness=OS——再强的 CPU 配垃圾 OS 也交付不出有用功能；平庸 CPU 配优秀 OS 仍可做出伟大产品。</p>
  <p><strong>关键理解：</strong>2017 年突破是 Attention，2020 是 Scaling，现在 Harness 已开始由 AI 自行设计优化，而非人类工程师手写。</p>
  <p><strong>典型场景：</strong>Claude Code、Codex、Cursor 共享同一洞察——Loop 设计与模型同等重要。</p>
  <p><strong>边界说明：</strong>Harness 不能替代模型推理能力；若任务本身超出模型智商，再完美的循环也只是更快失败。Harness 解决的是「如何把固定智商用满」。</p>
  <div class="quote">原文：「模型是 CPU，驾驭框架就是 OS。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】三种 Harness 核心模式</h3>
  <p><strong>模式 1 — Loop：</strong>Plan → Execute → Observe → Improve → Repeat。第 3 次循环模型不比第 1 次聪明，但复合上下文（报错、测试结果、Traces）让系统整体变聪明。</p>
  <p><strong>模式 2 — 文件系统即记忆：</strong>写入磁盘而非塞进 Context。第 47 步上下文溢出崩溃 vs 第 200 步仍干净——崩溃后可断点续跑，多子 Agent 通过文件共享状态。</p>
  <p><strong>模式 3 — 子 Agent 派生：</strong>父 Agent 拆任务、异步启动、合并结果。子 Agent 输出必须写文件，不能写临时上下文——会话结束上下文即消失。</p>
  <div class="highlight"><strong>落地四工具起步：</strong>bash、read、write、edit——玩透这四个就能构建绝大多数自动化系统，生产环境再逐步加 git、spawn_agent、MCP。</div>
  <div class="pitfall"><strong>陷阱：</strong>把所有实验日志、Diff、Error traces 无脑塞进 Context Window——任何大模型都会在长周期任务中撑爆。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】ACE 上下文工程 vs 粗暴 Prompt</h3>
  <table>
    <tr><th>对比维度</th><th>粗暴上下文管理</th><th>ACE 架构</th><th>一句话结论</th></tr>
    <tr><td>信息组织</td><td>一股脑丢进 Prompt 祈祷</td><td>结构化 Playbook：(id, insight) 键值对</td><td>精炼动态 > 臃肿静态</td></tr>
    <tr><td>失败学习</td><td>每次从零开始</td><td>Reflector 提炼教训 → Curator 更新剧本</td><td>第 50 次任务站在 49 次智慧之上</td></tr>
    <tr><td>模型权重</td><td>想微调模型</td><td>完全不碰权重，只进化上下文</td><td>杠杆效应最大的工程技能</td></tr>
    <tr><td>焦点控制</td><td>上下文臃肿 → 质量雪崩</td><td>每步只看到最精准的信息</td><td>上下文工程是当前最具杠杆的核心能力</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】Self-Harness vs 人工维护 vs 纯 Prompt 优化</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>Harness 有系统性缺陷</td><td>Self-Harness 三步闭环</td><td>挖 trace → 提代码补丁 → 隔离测试合并；Claude 3.5 Sonnet SWE-bench 20%→50%</td><td>只改 Prompt</td><td>不改系统源码，瓶颈依旧在框架层</td></tr>
    <tr><td>探索多种框架架构</td><td>AlphaEvolve 种群进化</td><td>多候选框架物竞天择，EVOLVE-BLOCK 沙箱锁定安全区</td><td>单线迭代</td><td>易陷入局部最优，多样性坍塌</td></tr>
    <tr><td>终极自我重构</td><td>Darwin Gödel Machine</td><td>Agent 读自己日志、改 Harness 源码、benchmark 筛选后代</td><td>无 Evaluator 裸跑</td><td>奖励欺骗：改单元测试让它永远返回 True</td></tr>
    <tr><td>商业落地起步</td><td>4 周渐进计划</td><td>Loop → 文件记忆 → 子 Agent → 上下文剧本</td><td>一上来写自我进化系统</td><td>复杂度过高，无法验证每层的价值</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】五大失败模式</h3>
  <p><strong>1. 上下文崩塌：</strong>超过 20 步仍只靠 Context 记记忆 → 关键决策细节丢失。解法：关键信息持久化到文件。</p>
  <p><strong>2. 执行偏离：</strong>复杂任务中 Agent 写漂亮废代码偏离目标。解法：启动时生成不可篡改 spec 文件，每轮循环强制核对。</p>
  <p><strong>3. 盲目乐观：</strong>实验失败却在日志宣告成功，发明 Numerical Duct Tape。解法：Agent 永远接触不到的 Held-out Test Set 做最终验证。</p>
  <p><strong>4. 奖励欺骗：</strong>优化单元测试通过率 → 悄悄改测试让它永远 True。解法：Evaluator 物理隔离在循环外 + 关键节点 Human-in-the-loop。</p>
  <p><strong>5. 多样性坍塌：</strong>进化搜索收敛到单一策略微调变体。解法：筛选算法引入 Novelty 指标，余弦相似度过高强行扣分。</p>
  <p><strong>严重程度：</strong>跳过 L4 Evaluator 是致命级——Agent 会走上刷指标邪路而你无法察觉。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】Harness 才是护城河</h3>
  <p><strong>原则：</strong>真正的壁垒从来不是底层模型，而是包裹模型的系统——而且这个系统已经学会自我进化。</p>
  <p><strong>为什么重要：</strong>Anthropic/OpenAI 交付新功能加速，不是因为模型一夜基因突变，而是 Harness 变得无比强大——会循环、有记忆、能分发子任务、能自我纠错的 Agent 能降维打击被误用的更聪明孤立模型。</p>
  <p><strong>怎么落地：</strong>第 1 周搭 Loop，第 2 周文件记忆，第 3 周子 Agent，第 4 周沉淀避坑 Playbook。</p>
  <p><strong>适用边界：</strong>聊天机器人可跳过 Harness；生产级 Agent 跳过 L2 只是玩具，跳过 L3 能力上限被锁死，跳过 L4 迟早奖励欺骗。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：基础模型至上派 / 「Scaling Laws 还没到头」研究者</p>
  <p class="rebuttal-text">SWE-bench 20% 到 50% 的跃升若真只靠 Harness 自进化，那意味着实验室把最值钱的能力锁在框架层——开源模型再强，没有对等 Harness 仍只是聊天 API，护城河在系统不在权重。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>模型是被动 CPU，Harness 是 OS——Loop、文件记忆、子 Agent 三模式构成生产 Harness 骨架</li>
    <li>上下文工程（ACE）是当前杠杆最大的技能：结构化 Playbook 让系统在不改权重下越跑越聪明</li>
    <li>Self-Harness / AlphaEvolve / DGM 让框架源码自我进化，SWE-bench 已验证无需换模型</li>
    <li>四层栈（Model → Harness → Optimizer → Evaluator）缺一不可，跳过任一层都有明确代价</li>
    <li>4 周渐进计划：Loop → 文件 → 子 Agent → 避坑剧本，比一上来写进化系统更务实</li>
  </ol>
  <p style="margin-top:16px"><strong>行动清单：</strong></p>
  <ol>
    <li>把现有单次 Prompt 调用改成 Plan-Execute-Observe-Improve 闭环</li>
    <li>中间产物（日志、Diff、Error trace）写入本地文件而非 Context</li>
    <li>识别可并行环节，子 Agent 输出落盘、父 Agent 合并</li>
    <li>收集成功/失败案例，构建 (id, insight) 结构化避坑 Playbook</li>
    <li>为 Agent 准备 Held-out 测试集，Evaluator 与 Optimizer 物理隔离</li>
  </ol>
  <p style="margin-top:16px"><strong>关键认知转变：</strong>AI 下半场竞争不在「谁的模型更聪明」，而在「谁的 Harness 更会把固定智商用满、甚至自我重写」。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
