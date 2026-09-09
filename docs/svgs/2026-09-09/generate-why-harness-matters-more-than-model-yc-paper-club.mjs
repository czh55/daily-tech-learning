import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'why-harness-matters-more-than-model-yc-paper-club.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#1e40af}`;

const body = `
<h1>同一套 Claude Opus 权重，裸跑 30% 而 Harness 95%：YC Paper Club 说 Agent 胜负手不在模型而在运行时</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">YC Paper Club</span>
  <span class="tag tag-green">Agent Harness</span>
  <span class="tag tag-orange">ARC-AGI</span>
  <span class="tag tag-purple">运行时层</span>
  <span class="tag tag-red">模型 vs 系统</span>
</div>
<p class="subtitle">本文解决的核心问题是：当底层模型权重完全相同时，为什么裸跑 Claude Opus 在 ARC-AGI 上只有约 30%，加上 Harness 能冲到 95%，NVIDIA AVO 甚至做到 100%——以及 Harness 作为模型与世界之间的运行时层，六年演化脉络、V1 静态与 V2 自修改架构差异，以及 Prime Agent、Open Jarvis、QM YC 等实战案例对工程落地的启示。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Harness 三层定位：模型与世界之间的运行时层</h3>
  <div class="diagram">
    <div class="node">世界<br>API / 文件 / 浏览器</div>
    <span class="arrow-sym">↔</span>
    <div class="node-green">Harness 运行时层<br>工具 · 记忆 · 循环 · 权限</div>
    <span class="arrow-sym">↔</span>
    <div class="node-orange">模型<br>Claude Opus 同权重</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">同一权重：裸跑 30% → Harness 95% → NVIDIA AVO 100%（ARC-AGI）</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「换更强的模型就能解决 Agent 能力瓶颈」。YC Paper Club 用同一套 Claude Opus 权重证明：裸循环约 30%，加上 Harness 可达 95%，NVIDIA AVO 做到 100%——差距不在权重，而在工具调用、记忆管理、执行循环与权限边界这套运行时层。六年演化从 GPT-2 裸循环到 RLM，Harness 才是复利最大的投资方向。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Harness 是什么：模型与世界之间的运行时层</h3>
  <p><strong>在讲什么问题：</strong>为什么同一套 Claude Opus 权重，裸跑 ARC-AGI 约 30%，加 Harness 能到 95%，NVIDIA AVO 甚至 100%？</p>
  <p><strong>核心机制：</strong>Harness 是夹在模型与世界之间的运行时层，负责工具调用、记忆管理、执行循环（loop）、权限边界——模型只负责「想」，Harness 负责「做」与「记住」。</p>
  <p><strong>关键理解：</strong>模型权重是常量，Harness 是变量；同一权重下，Harness 质量决定 Agent 能否把推理转化为可验证的行动。</p>
  <p><strong>典型场景：</strong>多步推理任务、需要外部工具验证的 benchmark、长时运行自主 Agent。</p>
  <p><strong>边界说明：</strong>Harness 不能替代模型基础能力，但在当前模型世代，运行时层的工程投入往往比换更大模型带来更确定的收益。</p>
  <div class="quote">原文核心数据：同一 Claude Opus 权重 — 裸跑 ~30%，Harness ~95%，NVIDIA AVO 100%。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】裸模型 vs V1 静态 Harness vs V2 自修改 Harness</h3>
  <table>
    <tr><th>对比维度</th><th>裸模型循环</th><th>V1 静态 Harness</th><th>V2 自修改 Harness</th><th>一句话结论</th></tr>
    <tr><td>ARC-AGI（同权重）</td><td>~30%</td><td>~95%</td><td>持续进化中</td><td>运行时层决定上限</td></tr>
    <tr><td>工具与记忆</td><td>无</td><td>人工设计固定管线</td><td>系统自我优化管线</td><td>从手工到自适应</td></tr>
    <tr><td>代表技术</td><td>GPT-2 裸循环</td><td>ReAct / Reflexion / MemGPT</td><td>DSPy / Darwin machines / Continual Harness</td><td>六年演化脉络</td></tr>
    <tr><td>维护成本</td><td>低但能力封顶</td><td>高（每次换模型要重调）</td><td>前期高、长期复利</td><td>投资方向在 Harness</td></tr>
    <tr><td>演化阶段</td><td>2019 few-shot</td><td>2022–2024 CoT + tools</td><td>2025+ 自修改运行时</td><td>复利最大的层</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】六年 Harness 演化脉络：从 GPT-2 到 RLM</h3>
  <p><strong>方法名：</strong>Agent Harness 演化时间线 · 标签：few-shot → CoT → tools → 自修改</p>
  <p><strong>核心思路：</strong>每一代突破不是换模型，而是在运行时层叠加新能力：记忆、技能库、反思循环、状态卸载。</p>
  <p><strong>操作步骤：</strong>1) GPT-2 裸循环（基线）→ 2) few-shot 提示工程 → 3) Chain-of-Thought 推理链 → 4) 工具调用（function calling）→ 5) MemGPT 长时记忆 → 6) Voyager 技能库积累 → 7) ReAct / Reflexion 行动-反思循环 → 8) RLM 递归语言模型</p>
  <div class="highlight"><strong>落地建议：</strong>评估自家 Agent 栈时，先画清当前处于哪一代 Harness，再决定是补工具层、记忆层还是自修改层，而非盲目追更大参数模型。</div>
  <div class="relation"><strong>V1 → V2 跃迁：</strong>V1 静态 Harness 人工设计管线；V2 自修改 Harness（DSPy、Darwin machines、Continual Harness）让系统自己优化运行时策略。</div>
</div>

<div class="card">
  <h3>【决策/选型表】三大实战案例：Prime Agent · Open Jarvis · QM YC</h3>
  <table>
    <tr><th>案例</th><th>核心 Harness 设计</th><th>关键数据/机制</th><th>适用场景</th></tr>
    <tr><td>Prime Agent</td><td>L1/L2/L3 分层记忆（类比 CPU 缓存）+ 持久子 Agent</td><td>7 天实验孵化 633 个 Agent</td><td>长时运行、多 Agent 协作</td></tr>
    <tr><td>Open Jarvis</td><td>本地栈 + 云端优化本地 Harness</td><td>800 倍成本降低</td><td>隐私敏感、成本敏感部署</td></tr>
    <tr><td>QM YC</td><td>四代迭代 + Postgres 状态卸载 + grind 工具</td><td>「不要太早放弃」——grind 工具让 Agent 持续尝试</td><td>复杂任务、需要韧性的自主执行</td></tr>
  </table>
  <div class="pitfall"><strong>避坑：</strong>QM YC 教训 — 状态全放上下文窗口会快速膨胀；Postgres 状态卸载 + grind 工具（不轻易放弃）是 Harness 工程化的关键细节。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】投资 Harness 而非盲目追模型的工程原则</h3>
  <p><strong>原则：</strong>模型权重趋同的时代，差异化来自运行时层 — 工具、记忆、循环、权限的工程质量。</p>
  <p><strong>为什么重要：</strong>YC Paper Club 用同权重实验证明 30% → 95% → 100% 的跃迁完全由 Harness 驱动；六年演化显示每一代复利最大的是系统层而非参数层。</p>
  <p><strong>怎么落地：</strong>1) 审计当前 Agent 栈的 Harness 世代 → 2) 优先补工具调用与记忆管理 → 3) 引入状态卸载（如 Postgres）避免上下文膨胀 → 4) 设计 grind 机制防止过早放弃 → 5) 探索 V2 自修改 Harness（DSPy 等）实现长期复利。</p>
  <p><strong>适用边界：</strong>适用于已有基础模型能力、需要把推理转化为可靠行动的场景；基础推理能力不足时仍需升级模型。</p>
  <div class="quote">Open Jarvis 启示：云端不必跑大模型，优化本地 Harness 同样能实现 800 倍成本降低。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：模型 Scaling 派 · 「更大参数才是终极答案」</p>
  <p class="rebuttal-text">Harness 的 95% 只是 benchmark 上的工程技巧 — 真正通用的智能仍需要模型内在推理能力的质变。把资源砸在运行时层是在回避根本问题：当下一代模型原生具备工具调用、长记忆与自我反思，今天精心设计的 Harness 将全部作废，唯有 Scaling Law 才是确定性最高的投资。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>同一 Claude Opus 权重：裸跑 ARC-AGI ~30%，Harness ~95%，NVIDIA AVO 100% — 胜负手在运行时层而非模型权重。</li>
    <li>Harness = 工具 + 记忆 + 循环 + 权限，六年从 GPT-2 裸循环演化到 RLM；V1 静态正被 V2 自修改（DSPy、Darwin machines、Continual Harness）取代。</li>
    <li>Prime Agent（L1/L2/L3 记忆 + 633 Agent/7 天）、Open Jarvis（本地栈 800 倍降本）、QM YC（Postgres 状态卸载 + grind 工具）验证了 Harness 工程化的三条路径。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>画出当前 Agent 栈的 Harness 世代定位，识别缺失的工具层、记忆层或状态管理层。</li>
    <li>引入分层记忆（L1/L2/L3）与状态卸载（Postgres 等），避免上下文窗口膨胀导致的能力退化。</li>
    <li>设计 grind 机制 — 让 Agent 在失败时持续尝试而非过早放弃。</li>
    <li>评估 V2 自修改 Harness（DSPy 等）是否适合你的场景，为长期复利做准备。</li>
    <li>在模型选型时同步评估 Harness 成熟度，而非单独追更大参数。</li>
  </ol>
  <p><strong>关键认知转变：</strong>「Agent 能力 = 模型能力」是过时公式 — 正确公式是「Agent 能力 = 模型能力 × Harness 质量」；当模型权重趋同，Harness 才是差异化与复利最大的投资方向。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
