import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'does-code-cleanliness-affect-coding-agents.svg');

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
<h1>代码整洁度与 Coding Agent Token 成本</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">SonarSource 研究</span>
  <span class="tag tag-green">Coding Agent</span>
  <span class="tag tag-orange">Token 成本</span>
  <span class="tag tag-purple">代码质量</span>
</div>
<p class="subtitle">本文解决的核心问题是：同一份任务交给同一个 Coding Agent，代码库「整洁度」不同会不会改变干活成本——SonarSource 用 6 组最小对照对、33 个任务、660 次试验证明：通过率几乎不变，但 token 消耗和反复读文件却实打实地不同。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">整洁度 → Agent 行为链</h3>
  <div class="diagram">
    <div class="node">代码整洁度<br><span style="font-size:11px;font-weight:400">SonarQube 量化</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">任务通过率<br><span style="font-size:11px;font-weight:400">91.3% vs 92.1%</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Token Footprint<br><span style="font-size:11px;font-weight:400">输入 -7.1%</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">文件重复访问<br><span style="font-size:11px;font-weight:400">-34%</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">API 账单<br><span style="font-size:11px;font-weight:400">人类信用卡</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">Claude Code (Sonnet 4.6) · 公开+私有仓库各半 · 任务只描述外部 I/O 不点名文件</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「AI 又不嫌代码丑，能跑通就行」——如果只盯 SWE-bench 通过率，这话成立；但 Agent 已在 12.8 万 GitHub 项目留下痕迹，单任务平均约 400 万 token，整洁度决定的是绕路和回头成本，不是能不能做完。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】最小对照对 (Minimal Pair)</h3>
  <p><strong>在讲什么问题：</strong>现实中找不到「除整洁度外完全相同」的两份代码库，研究者必须人工造出可对照的实验材料。</p>
  <p><strong>核心机制：</strong>两份代码库架构相同、依赖相同、测试行为相同，唯一差异是 SonarQube 违规数与认知复杂度；Slopify 管线做旧、Vibeclean 管线翻新，每步改完都跑测试，破坏行为的改动被拒绝。</p>
  <p><strong>关键理解：</strong>这样才能把 Agent 行为差异归因到「整洁度」单一变量，而不是架构漂移或测试覆盖不同。</p>
  <p><strong>典型场景：</strong>评估 Lint/重构对 AI 编程助手的影响；对比 Commons BCEL、Netflix Genie、CKAN 等公开库与 SonarSource 私有库。</p>
  <p><strong>边界说明：</strong>仅覆盖 6 组库、33 个手工任务、Claude Code 一套组合——不能外推到所有语言栈和所有 Agent 框架。</p>
  <div class="quote">原文：「你几乎找不到两个除了整洁度之外完全一样的代码库。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】整洁 vs 脏乱代码上的 Agent 表现</h3>
  <table>
    <tr><th>对比维度</th><th>干净代码库</th><th>脏乱代码库</th><th>一句话结论</th></tr>
    <tr><td>任务通过率</td><td>91.3%</td><td>92.1%</td><td>能不能做完，几乎无差别</td></tr>
    <tr><td>输入 token</td><td>基准</td><td>多约 7.1%</td><td>脏乱代码让 Agent 往上下文塞更多无关内容</td></tr>
    <tr><td>输出 token</td><td>基准</td><td>多约 8.5%</td><td>工具调用、代码、推理全线膨胀</td></tr>
    <tr><td>推理字符</td><td>基准</td><td>多约 11.1%</td><td>脏乱代码上 Agent「想」得更多</td></tr>
    <tr><td>文件重复访问</td><td>基准</td><td>多约 34%</td><td>改完又回头读，像「心里没底」的信号</td></tr>
    <tr><td>读过文件数</td><td>略多 +3.2%</td><td>较少</td><td>干净版第一遍读更广，读完就下决心</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】什么场景该优先投资代码整洁度</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>跨模块功能开发（14 个任务赛道）</td><td>模块边界清晰 + Lint 门禁</td><td>输入 token -10.7%，重复访问 -50.8%，收益最大</td><td>放任模块耦合增长</td><td>Agent 要在屎山里跨边界摸索，绕路成本最高</td></tr>
    <tr><td>单文件「上帝方法」热点改动</td><td>消灭复杂度，而非机械拆函数</td><td>拆而不简会把逻辑摊到更多文件，导航成本可能上升</td><td>为过 Sonar 指标硬拆 10 个小函数</td><td>Genie 案例：干净版反而多用 8% 输入 token</td></tr>
    <tr><td>团队日常 Agent 辅助开发</td><td>启用 SonarQube / ESLint / Ruff 等静态分析</td><td>整洁度从「给人看」变成「给 Agent 省钱」的量化机制</td><td>只靠注释堆砌可读性</td><td>注释消融实验证明：结构清晰比注释量更关键</td></tr>
    <tr><td>评估 Agent 选型或模型升级</td><td>同时看通过率与 token footprint</td><td>SWE-bench 只盯 Pass rate 会漏掉账单差异</td><td>仅用 benchmark 通过率做决策</td><td>同一任务跑 10 次，最贵与最便宜可差 2.5 倍以上</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Agent 时代的整洁度误区</h3>
  <p><strong>坑名：</strong>以为「拆了大函数 = 整洁 = Agent 一定更省」——翻新管线把 200 行 switch 拆成十个 helper，复杂度只是搬家。</p>
  <p><strong>原因：</strong>认知热点任务上 token footprint 基本不变；Agent 在干净版打开更多文件、每文件改更少行，总导航成本未必下降。</p>
  <p><strong>解法：</strong>重构时追问「复杂度是消灭了还是摊薄了」；跨模块场景优先清晰边界和命名，单点热点优先简化逻辑而非切块。</p>
  <p><strong>严重程度：</strong>小心——不会阻止任务完成，但可能让「整洁」标签反而增加 token。</p>
  <div class="pitfall"><strong>统计方差陷阱：</strong>27 个非校准任务里 16 个干净版更省、11 个脏版更省；数据集层面 -7.1% 是平均趋势，单次重构结果可能完全相反。</div>
  <div class="pitfall"><strong>模型泛化陷阱：</strong>实验仅用 Claude Code + Sonnet 4.6；Haiku 4.5 通过率太低无法读出 footprint 差异，结论不宜直接套到其他模型。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】整洁代码的新记账方式</h3>
  <p><strong>原则：</strong>代码整洁度在 Agent 时代不过时，只是记账对象从「同事 review 体验」变成了「AI 绕路成本」。</p>
  <p><strong>为什么重要：</strong>22%~29% 的 GitHub 项目已有 Coding Agent 活动痕迹；整洁度几乎不影响「能不能做完」，却决定「要花多少钱、绕多少路、有没有把握」。</p>
  <p><strong>怎么落地：</strong>① 上 Lint/静态分析门禁；② 跨模块改动前理清边界与命名；③ 重构巨型函数时消灭复杂度；④ 用 SonarQube 等指标量化整洁度而非凭感觉。</p>
  <p><strong>适用边界：</strong>样本仅 6 库 33 任务；不能替代「该不该为业务速度牺牲质量」的产品决策，但提供了可量化的成本侧论据。</p>
  <div class="highlight"><strong>注释消融：</strong>拉平两侧注释量后，省 token 优势反而更明显（一例从 +1.2% 变为 -18.0%），证明效应来自结构清晰而非「注释少」。</div>
  <div class="quote">原文：「一个可预测、命名清晰的方法名，胜过一堆注释。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「能跑就行」派 / 只盯 SWE-bench 通过率的评测党</p>
  <p class="rebuttal-text">通过率 91% 和 92% 几乎一样，说明屎山照样能交付——为 Lint 和重构停迭代一周，省下的 7% token 未必抵得过机会成本，尤其小团队一年 Agent 调用量可能还不到统计显著阈值。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>SonarSource 660 次试验：整洁度几乎不影响 Agent 任务通过率，但显著影响 token 与重复读文件</li>
    <li>输入 token -7.1%、输出 -8.5%、文件重复访问 -34%——脏乱代码让 Agent 多绕路、多回头、多「犯嘀咕」</li>
    <li>跨模块改动收益最大；单点「上帝方法」若只拆不简，干净版未必更省</li>
    <li>注释消融排除干扰后，结构清晰才是核心变量</li>
    <li>研究局限：6 库、Claude 单栈、方差大——是统计趋势而非每次必省的简单等式</li>
  </ol>
  <p style="margin-top:16px"><strong>行动清单：</strong></p>
  <ol>
    <li>为常用 Agent 项目启用 SonarQube / ESLint / Ruff 等静态分析，把整洁度纳入 CI</li>
    <li>规划跨模块功能时优先梳理模块边界与命名，这是 Agent 收益最大的场景</li>
    <li>重构巨型函数前问一句：复杂度是消灭了还是只是切成更多块</li>
    <li>评估 Agent 时除通过率外记录 token 与工具调用次数，别被 SWE-bench 单一指标误导</li>
    <li>阅读 arXiv:2605.20049 原文，按自己代码库规模估算年化账单差异</li>
  </ol>
  <p style="margin-top:16px"><strong>关键认知转变：</strong>「写干净代码」的理由从「方便人类」扩展到「降低 Agent 计算成本」——AI 真看不出丑，但会为丑多绕路，这笔账算在人类信用卡上。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
