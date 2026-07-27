import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'why-software-factories-fail-harness-engineering-not-enough.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
<h1>AI 写了 75% 的代码，工程师却越来越慌：「黑灯软件工厂」的问题不在 harness，而在模型本身</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">软件工厂</span>
  <span class="tag tag-orange">黑灯工厂</span>
  <span class="tag tag-red">可维护性</span>
  <span class="tag tag-purple">强化学习</span>
</div>
<p class="subtitle">本文解决的核心问题是：当行业以「75% 代码由 AI 生成」为傲、甚至关掉人工评审跑黑灯软件工厂时，为什么 PR 质量下滑、线上事故与人均 bug 同步走高——以及为什么堆更多 harness 工程也救不了编程模型在强化学习阶段就没学会「可维护性」这一根本短板。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">黑灯工厂失败链条：从训练奖励到代码库腐化</h3>
  <div class="diagram">
    <div class="node-orange">RL 奖励<br><span style="font-size:11px;font-weight:400">测试通过=满分</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">Harness 堆叠<br><span style="font-size:11px;font-weight:400">评审 Agent·循环</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">黑灯工厂<br><span style="font-size:11px;font-weight:400">零人读代码</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">霰弹式修改<br><span style="font-size:11px;font-weight:400">月/年后爆雷</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">前置对齐四步法<br><span style="font-size:11px;font-weight:400">重新开灯</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">病灶不在 harness 不够聪明，而在 RL 训练无法惩罚「架构腐烂」——代价以月甚至年为单位才显现</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「软件工厂失败 = harness 工程做得不够狠」——Dex Horthy 的核心论点是瓶颈在模型训练层：当前编程模型的 RL 奖励只盯「测试是否通过」，天生学不会维护代码；再多评审 Agent 和 loop maxing 也只是把及格线往上抬，改不了强化学习阶段能教会模型什么。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】黑灯软件工厂与可维护性盲区</h3>
  <p><strong>在讲什么问题：</strong>当 Agent 能以 10-100 倍速度产出代码、人工评审成为瓶颈时，「干脆不评审、靠测试和监控兜底」的黑灯工厂是否可行？</p>
  <p><strong>核心机制：</strong>黑灯工厂（Dan Shapiro 提出）= 取消人工代码评审，把资源全投测试、监控、灰度发布；线上事故直接路由回工厂重新生成补丁，团队只管「往队列塞多少任务、多快测试上线」。</p>
  <p><strong>关键理解：</strong>可维护性 = 改动一处不易在不经意间牵连破坏另一处（Martin Fowler 的霰弹式修改）；模型在孤立问题上确实变强了，但在「提升代码库整体质量」上进展不明显——3-6 个月后 Brownfield 代码库开始明显吃力。</p>
  <p><strong>典型场景：</strong>HumanLayer 2025 年 7 月跑数月彻底黑灯工厂，几个月后不得不回头研究三个月没人读过的代码库，同时线上服务出问题、用户抱怨。</p>
  <p><strong>边界说明：</strong>营销落地页、一次性 Side Project 与十年企业级 Brownfield 系统约束条件完全不同，互相指导「该怎么活」通常没意义；vibe coding 经验不可直接外推到复杂遗留系统。</p>
  <div class="quote">原文：模型有一个明确的短板——它们没法在没有人类持续介入的情况下，维护并改善代码库的质量。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】编程模型 RL 训练与奖励信号缺陷</h3>
  <p><strong>在讲什么问题：</strong>为什么 Claude Code 能一炮而红，而之前的 Aider、CodeBuff 没有？为什么模型会写出包裹 try/catch 应付测试的「AI 味」代码？</p>
  <p><strong>核心机制：</strong>主流编程模型 RL 流程：给问题 → 生成大量解题轨迹 → 打分（代码能否跑通、测试能否通过）→ 强化好行为、抑制坏行为 → 更新权重。SWE-bench 等基准奖励是二元的：问题修好没有、有没有把别处弄坏。</p>
  <p><strong>关键理解：</strong>Claude Code 分水岭在于模型厂商把模型和最终分发的 harness 绑在一起训练——从训练阶段就在工具链里反复练习工具调用和多步任务；外部 harness 开发者若不掌握模型权重，天然处于劣势。</p>
  <p><strong>典型场景：</strong>Fastlane Ruby 项目空值检查缺失：agent 生成补丁，系统撤销其对测试文件的改动（防注释测试），套用标准测试补丁，新旧测试都通过才给奖励。</p>
  <p><strong>边界说明：</strong>「测试通过」验证相对容易；「代码是否可维护」验证难好几个数量级——烂架构代价以月/年显现，无法把惩罚信号反向传导回训练那一刻。</p>
  <div class="pitfall"><strong>避坑：</strong>没有任何机制因「程序设计糟糕」或「腐蚀可维护性」而惩罚模型——模型唯一目标是让测试变绿，至于代码是否在应付了事，它并不关心。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Harness 工程 vs 模型训练层短板</h3>
  <table>
    <tr><th>对比维度</th><th>Harness 工程派</th><th>模型训练层派（Dex 论点）</th><th>一句话结论</th></tr>
    <tr><td>失败归因</td><td>评审 Agent 不够、循环嵌套不够、提示词魔法不够</td><td>RL 奖励信号天生教不会可维护性</td><td>不是规模问题，是训练层面的天花板</td></tr>
    <tr><td>行业数据</td><td>加对抗性评审可鱼与熊掌兼得</td><td>Faros AI：PR 评审质量降、无评审合并飙升、事故和人均 bug 同步升</td><td>数据支持「慢下来」而非「再堆一层」</td></tr>
    <tr><td>Claude Code 成功因素</td><td>harness 做得更花哨</td><td>模型与 harness 从训练阶段绑定</td><td>工具链适配 ≠ 根因，联合训练才是分水岭</td></tr>
    <tr><td>评审 Agent 上限</td><td>多花 token 反复检查能根治</td><td>模型若真懂好代码会直接写出；评审只能抬及格线</td><td>被 RL 阶段能教会什么卡住了脖子</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】前置对齐四步法——把灯重新打开</h3>
  <p><strong>核心思路：</strong>不是放弃 AI，而是重新打开代码评审这盏灯，同时用 AI 把前置对齐做快做透，降低评审漫长痛苦的概率。</p>
  <p><strong>操作步骤：</strong></p>
  <p>① <strong>产品评审</strong>：界定问题和期望行为，看清设计稿，理解到底要解决什么</p>
  <p>② <strong>系统架构</strong>：明确组件契约、数据模型、约束条件，想清楚系统怎么拼接（小任务可直接丢 agent，不必全套走）</p>
  <p>③ <strong>程序设计</strong>：类型定义、方法签名、调用栈等细粒度设计——很多人以为架构清楚就能开干，但真正决定代码质量的是这一层；可参考 Cloudflare Dylan Mulroy 的调用关系图</p>
  <p>④ <strong>垂直切片</strong>：确定实现顺序、跨仓库协同、每阶段检查点——与模型擅长横向铺开还是纵向切片相关</p>
  <div class="highlight"><strong>落地建议：</strong>前期花 30 分钟规划对齐，往往能在评审阶段省下几个小时；对齐过的好 PR 读起来是确认「对，这就是我们讨论过的方案」，而非百分之二十返工的情绪负担。</div>
  <div class="quote">原文：如果你发现自己被大量 PR 淹没，真正的问题往往不是「PR 太多」，而是「烂 PR 太多」。</div>
</div>

<div class="card">
  <h3>【决策/选型表】下一代评测基准与当前工程选择</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐的方案</th><th>为什么不行</th></tr>
    <tr><td>评估长周期可维护性</td><td>关注 SWE Marathon、DeepSuite、Frontier Code 等探索方向</td><td>400 小时级任务、未实现功能防污染、多 PR 复杂任务+裁判模型</td><td>仅靠 SWE-bench 二元奖励</td><td>无法惩罚架构腐烂，与训练验证器结构相似但有天花板</td></tr>
    <tr><td>当前 Brownfield 开发</td><td>四步前置对齐 + 人类逐行读代码</td><td>验证器还没跟上，工程手段先解决一部分</td><td>持续 YOLO 等到超强模型</td><td>苦涩的教训不会消失，几个月后还是要还债</td></tr>
    <tr><td>小任务快速迭代</td><td>直接丢给 agent，不必走全套四步</td><td>规模小、理解成本可控</td><td>照搬企业黑灯工厂流程</td><td>过度流程拖慢探索</td></tr>
    <tr><td>提升 PR 吞吐量</td><td>用 AI 加速对齐，减少烂 PR 数量</td><td>对齐、评审、编码三环节同时提速，人仍逐行读代码</td><td>取消评审靠测试兜底</td><td>测试绿灯≠代码库未腐，事故数已在上升</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】黑灯工厂与 harness 万能幻觉</h3>
  <p><strong>黑灯数月实验（致命）：</strong>HumanLayer 关了几个月彻底黑灯，几个月后研究三个月没人读的代码库，线上服务出问题——高级提示词也解决不了。</p>
  <p><strong>无评审合并飙升（致命）：</strong>Faros AI 报告：2026 年初大规模采用 AI 编程后，相当比例 PR 零评审直接合并，评论更多更长但质量下降。</p>
  <p><strong>Harness 万能幻觉（小心）：</strong>再多 loop maxing、对抗性评审提示词，都改不了 RL 阶段教不会可维护性；评审 agent 有天花板。</p>
  <p><strong>测试注释掉（小心）：</strong>基准会撤销 agent 对测试文件的改动——确实见过模型为了让测试通过而直接注释测试。</p>
  <p><strong>解法：</strong>现阶段人类还是得亲自读代码；用 AI 做前置对齐四步法，30 分钟规划换几小时评审；认清模型擅长与不擅长的边界，在边界内继续找杠杆。</p>
  <div class="quote">原文：工程师的工作，本质上就是在一组约束条件下解决问题；模型在某些事情上确实很擅长，在另一些事情上确实还不行。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】工程师价值在约束与边界之内</h3>
  <p><strong>原则：</strong>循环（loop）工具很好用该用就用，但真正值得投入精力的，是复杂代码库里的硬骨头——以及搞清楚模型能力边界在哪。</p>
  <p><strong>为什么重要：</strong>「再也不用读代码」的世界很诱人，但验证「可维护性」的难度比「测试通过」高几个数量级，这个结构性差距短期内 harness 填不平。</p>
  <p><strong>怎么落地：</strong>① 接受人类必须读代码的现状 ② 用四步前置对齐减少烂 PR ③ 小任务灵活、大任务走全套 ④ 关注 Frontier Code 等下一代基准演进 ⑤ 对 Brownfield 保持 3-6 个月警惕窗口。</p>
  <p><strong>适用边界：</strong>若愿意一路 YOLO 等到远超当前水平的模型，也是一种选择——只是问题不会因此自动消失。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「Harness 工程还能救」派 / 全自动化优先创业者</p>
  <p class="rebuttal-text">SWE Marathon 和 Frontier Code 正在把可维护性纳入奖励通道，评审 Agent 加 loop maxing 已让团队在不读代码的情况下维持数月交付——Dex 的黑灯实验是个案，过早开灯会把 10 倍提速打回人工瓶颈。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>行业流行的黑灯软件工厂（零评审、靠测试监控兜底）在数据和实践中都在暴露问题：PR 质量降、无评审合并升、事故和人均 bug 同步走高。</li>
    <li>病灶不在 harness 不够聪明，而在编程模型 RL 训练只奖励「测试通过」，无法惩罚架构腐烂——烂代码的代价以月/年显现，惩罚信号无法回传。</li>
    <li>Claude Code 的成功关键是模型与 harness 从训练阶段绑定；外部 harness 开发者若不掌握权重，相对模型厂商天然劣势。</li>
    <li>评审 Agent 和更多 token 能把及格线往上抬，但被「RL 阶段能教会什么」卡住脖子；现阶段人类必须读代码。</li>
    <li>解药是重新开灯：用 AI 加速产品评审、架构、程序设计、垂直切片四步前置对齐，30 分钟规划换几小时评审，同时保持对代码的所有权。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>审视团队是否已在跑黑灯模式：无评审合并比例、PR 返工率、近月线上事故趋势。</li>
    <li>对 Brownfield 大任务启用四步前置对齐，小任务保持灵活——不必一刀切。</li>
    <li>在程序设计层投入：类型定义、方法签名、调用关系图，而非架构想清楚就让 agent 开干。</li>
    <li>把「减少烂 PR 数量」置于「提高 PR 吞吐量」之前——对齐过的好 PR 评审是享受而非负担。</li>
    <li>关注 SWE Marathon、Frontier Code 等下一代基准，但不在验证器成熟前赌 YOLO 到底。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「堆更多 harness 就能鱼与熊掌兼得」转为「软件工厂失败的根因在模型训练层对可维护性的盲区」——工程师的价值不是被 AI 替代，而是在约束条件下认清边界、设计前置对齐、并坚持对代码的实质性所有权。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
