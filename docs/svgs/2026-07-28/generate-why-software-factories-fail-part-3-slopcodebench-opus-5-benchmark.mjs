import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'why-software-factories-fail-part-3-slopcodebench-opus-5-benchmark.svg');

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
<h1>上次说「没有靠谱的尺子」，这次 Dex Horthy 找到了一把——Opus 5 实测通过率只有 24%</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">SlopCodeBench</span>
  <span class="tag tag-orange">软件工厂</span>
  <span class="tag tag-red">可维护性基准</span>
  <span class="tag tag-purple">Opus 5</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 Dex Horthy 在系列第一篇承认「没有好的基准能衡量模型维护代码库的能力」之后，SlopCodeBench 这把新尺子到底量出了什么——以及 Opus 5 在 17 个检查点的严格通过率仅 24% 意味着什么，行业能否据此放心「关灯」跑软件工厂。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Part 3 逻辑链：从缺尺子到可量化信号</h3>
  <div class="diagram">
    <div class="node-orange">Part 1<br><span style="font-size:11px;font-weight:400">缺可维护性基准</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">SlopCodeBench<br><span style="font-size:11px;font-weight:400">检查点渐进需求</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">严格通过 24%<br><span style="font-size:11px;font-weight:400">Opus 5 六小时实测</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">Slop Meter<br><span style="font-size:11px;font-weight:400">90%+ 行触劣化规则</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">降级接手实验<br><span style="font-size:11px;font-weight:400">弱模型续写强模型代码</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">信号已出现：模型还不能无人值守关灯，但行业终于有了可追踪的刻度尺</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「SWE-bench 刷分高 = 模型能维护 Brownfield 代码库」——SCB 用检查点机制证明：传统基准一次性摊开问题，与真实「需求逐步浮现」完全不是一回事；严格通过要求新功能全绿且历史回归全绿，最强 Opus 5 也只有 24%。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】SlopCodeBench 与检查点机制</h3>
  <p><strong>在讲什么问题：</strong>现有编程基准为何测不出「模型能不能长期维护同一份代码库」？</p>
  <p><strong>核心机制：</strong>威斯康星大学 Gabe Orlanski 实验室 2026 年 3 月发布的长周期编程基准 SlopCodeBench（SCB）：每道题设计多个检查点，模型一开始不知道完整需求，随代码演进不断接收新需求更新，在已有代码上持续迭代——模拟真实功能从雏形到完善的过程。</p>
  <p><strong>关键理解：</strong>传统基准（哪怕更大更复杂）本质仍是「一次性把问题摊开」；SCB 专治 Part 1 点名的痛点：需求逐步演进 vs 孤立考题。</p>
  <p><strong>典型场景：</strong>circuit_eval（简单 8 关）、database_migration（中等 5 关）、dynamic_config_service_api（困难 4 关）——Dex 从中抽三题共 17 检查点实测。</p>
  <p><strong>边界说明：</strong>论文发布时最强 GPT-5.4 严格通过 11%、Opus 4.6 仅 17%——基准远未被打穿；目前检测器主要支持 Python，跨语言对照尚不完整。</p>
  <div class="quote">原文：SCB 想解决的正是 Dex 在第一篇里点名批评的那个毛病——把整个问题一次性摊开给模型看。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】严格通过（Strict Pass）</h3>
  <p><strong>在讲什么问题：</strong>SCB 用什么标准判断「这一关算不算过」？</p>
  <p><strong>核心机制：</strong>严格通过 = 本检查点新增功能测试全绿，且从之前所有检查点继承下来的回归测试也必须全部通过。若第 4 关搞砸了遗留缺陷，后面哪怕新功能漂亮，只要旧伤未愈后续全算不通过。</p>
  <p><strong>关键理解：</strong>这与真实项目里「一个隐藏的坏设计会持续拖累后面所有迭代」同构——不是「这道题解出来就行」，而是「代码库还能不能接着维护」。</p>
  <p><strong>典型场景：</strong>9 次测试跑动中没有任何模型在任何一道题上从头到尾全部通关，连标着「简单」的 circuit_eval 也不行。</p>
  <p><strong>边界说明：</strong>比 SWE-bench「一次性修好一个问题」更贴近长周期维护，但仍依赖确定性行为验证器——不能替代人类对架构品味的判断。</p>
  <div class="pitfall"><strong>避坑：</strong>不要把「某检查点新功能过了」等同于「模型维护住了代码库」——严格通过才计入，Dex 实测 17 关里 Opus 5 只过了 4 关。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】传统基准 vs SlopCodeBench</h3>
  <table>
    <tr><th>对比维度</th><th>SWE-bench 类传统基准</th><th>SlopCodeBench</th><th>一句话结论</th></tr>
    <tr><td>问题呈现</td><td>一次性摊开完整问题</td><td>检查点渐进披露需求</td><td>SCB 更接近真实需求浮现过程</td></tr>
    <tr><td>评判粒度</td><td>单题二元：修好没有</td><td>多检查点 + 全历史回归</td><td>严格通过惩罚遗留技术债</td></tr>
    <tr><td>最强模型成绩</td><td>部分模型已较高通过率</td><td>GPT-5.4 11%、Opus 4.6 17%、Dex 测 Opus 5 24%</td><td>长周期维护仍是硬骨头</td></tr>
    <tr><td>质量侧写</td><td>主要看过不过</td><td>Slop Meter 41 项指标六类描摹</td><td>SCB 同时量化「代码变烂」轨迹</td></tr>
    <tr><td>适用评价</td><td>模型能否一次性解决软件问题</td><td>模型能否长期维护代码库</td><td>颗粒度不同，不可互相替代</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】Dex 六小时真人测评设计</h3>
  <p><strong>核心思路：</strong>不只看论文数字，用子集实测把前沿模型拉到同一场检查点赛跑里，全程人工盯盘六小时。</p>
  <p><strong>操作步骤：</strong></p>
  <p>① 从 SCB 题库抽三道题（简单/中等/困难），共 17 检查点</p>
  <p>② 三模型并行：Opus 5、Sonnet 5、Opus 4.8</p>
  <p>③ 每检查点全新上下文窗口，相同提示词，统一 Claude Code harness</p>
  <p>④ 记录严格通过率、Slop Meter 指标、token 成本</p>
  <p>⑤ 对比论文基线（Opus 4.6 17%）与实测 Opus 5（24%）</p>
  <div class="highlight"><strong>落地建议：</strong>若团队要自测 Agent 长周期维护能力，可复制「多检查点 + 严格回归 + 统一 harness」框架，不必等官方 leaderboard；Dex 建议下次把 9 次跑动完全并行，六小时可压到一到两小时。</div>
  <div class="quote">原文：Dex 全程盯了六个小时——这不是无人值守黑灯工厂，而是有人开灯的对照实验。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】Slop Meter 与代码劣化探测器</h3>
  <p><strong>在讲什么问题：</strong>除了「过没过」，SCB 如何量化「代码在变烂」？</p>
  <p><strong>核心机制：</strong>每检查点结束后用 41 项指标描摹质量变化，大致六类：体量（行数/函数数/增量删改）、复杂度（圈复杂度分布与嵌套深度）、重复度（克隆行占比）、分解质量（死代码/包装函数）、规则违规（静态检查与「测试劣化规则」命中）、依赖图（传播成本/循环依赖/熵）。</p>
  <p><strong>关键理解：</strong>三道题上平均触发率：Opus 4.8 98%、Opus 5 93%、Sonnet 5 89% 的代码行至少命中一条劣化规则；「啰嗦」行占比从第一关约 65% 涨到第八关约 80%。</p>
  <p><strong>典型场景：</strong>跨语言实验：Opus 5 关灯生成代码每千行触发的劣化规则数，是 HumanLayer 经仔细人工评审的 TypeScript 代码库的 11 倍以上。</p>
  <p><strong>边界说明：</strong>Dex 坦言还不完全相信 lint 规则能精确量化「能不能维护」——指标方向大体靠谱，但判定可能偏严，规则数量跨语言尚不对等。</p>
  <div class="pitfall"><strong>避坑：</strong>高通过率若伴随生产代码量膨胀（Opus 5 相对 Opus 4.8 约 1.8 倍）和函数数暴涨（约 2000 个 vs 拆小函数策略），可能是「写更多代码换分数」而非真维护住了架构。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】三模型维护策略分化</h3>
  <table>
    <tr><th>对比维度</th><th>Opus 5</th><th>Opus 4.8 / Sonnet 5</th><th>一句话结论</th></tr>
    <tr><td>严格通过率</td><td>24%（4/17）</td><td>6%（各 1/17，同题第一关）</td><td>最强仍只在开局站稳，越往后缺陷累积</td></tr>
    <tr><td>复杂度策略</td><td>平均复杂度最低，约 2000 函数「拆小」</td><td>改大已有函数；Opus 4.8 八关复杂度涨 70%，单函数圈复杂度达 93</td><td>低复杂度分数可能靠函数爆炸换出来</td></tr>
    <tr><td>重复率轨迹</td><td>2.41%→2.64% 几乎持平</td><td>Opus 4.8 4.6%→16.8%，第三关附近拐点</td><td>新需求与最初设计打架时重复率飙升</td></tr>
    <tr><td>成本曲线</td><td>—</td><td>Sonnet 5 首关最贵，维护阶段反而最省</td><td>框架搭好后维护型任务成本结构会变</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】如何解读 SCB 信号与工程选择</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐的方案</th><th>为什么不行</th></tr>
    <tr><td>评估能否关灯工厂</td><td>盯 SCB 类渐进基准严格通过率 + Slop Meter 趋势</td><td>Dex：未来模型在隔离训练集外的类似基准上跑到 80%+ 会让他更放心</td><td>只看 SWE-bench 刷分</td><td>一次性解题与长周期维护不是同一能力</td></tr>
    <tr><td>当前生产 Brownfield</td><td>人类介入 + Part 2 前置对齐四步法</td><td>24% 严格通过印证「今天还不能无人值守关灯」</td><td>赌 Opus 5 已够强直接黑灯</td><td>遗留缺陷会连锁拖垮后续检查点</td></tr>
    <tr><td>验证强模型代码质量</td><td>「降级接手」实验：强模型搭前 N 关，弱模型续写</td><td>弱模型能否读懂续写，间接反映前 N 关代码是否干净</td><td>只靠强模型自评或评审 Agent</td><td>指标可被钻空子，接手实验更贴近真实协作</td></tr>
    <tr><td>跨语言团队</td><td>等 SCB 检测器移植到 TS 等语言后再对标</td><td>当前 Python 规则 200+ 条，Dex 临时 TS 规则仅 76 条</td><td>用不完整规则集做绝对排名</td><td>跨语言对照尚未严格校验</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】基准误读与代码劣化信号</h3>
  <p><strong>全题通关幻觉（致命）：</strong>9 次跑动没有任何模型在任何题上从头到尾通关——不要把「简单题」等同于「模型能维护」。</p>
  <p><strong>单关通过误导（致命）：</strong>新功能绿了但历史回归红了，严格通过仍算失败——真实项目里这就是技术债滚雪球。</p>
  <p><strong>复杂度分数游戏（小心）：</strong>Opus 5 靠海量小函数压低平均复杂度，函数数是 Opus 4.8 的约 5 倍——低复杂度不等于好架构。</p>
  <p><strong>劣化规则全绿错觉（小心）：</strong>90%+ 代码行触发劣化探测器——「能跑」与「能维护」差距巨大。</p>
  <p><strong>解法：</strong>把 SCB 当持续追踪尺子而非一次考试；关注严格通过率曲线和 Slop Meter 六类指标趋势；在验证器成熟前保持人类读代码；尝试降级接手实验作为补充信号。</p>
  <div class="quote">原文：Dex 说自己在靠感觉念叨代码库劣化将近一年，这次终于有了数据支撑。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】有尺子了，但离放心关灯还差得远</h3>
  <p><strong>原则：</strong>「什么时候模型够强」不如「有没有靠谱信号告诉它正在变强」——SCB 提供后者，但 24% 说明还没到可以放心关灯的那一天。</p>
  <p><strong>为什么重要：</strong>Part 1 诊断病灶、Part 2 给前置对齐处方、Part 3 用数字把直觉钉死——三篇形成闭环，答案依然不算乐观。</p>
  <p><strong>怎么落地：</strong>① 团队选型模型时加入 SCB 类长周期指标 ② 设定内部「80% 严格通过」式门槛再讨论减评审 ③ 跑降级接手实验 ④ 并行化测评降本 ⑤ 把成本/token 维度纳入未来评判（强模型或许能啃烂代码，但好架构应更省 token）。</p>
  <p><strong>适用边界：</strong>SCB 仍可能被训练集污染或规则被模型针对性优化——Dex 强调基准须隔离于训练集之外。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「基准刷分派」/ 坚信下一代模型即将通关 SCB</p>
  <p class="rebuttal-text">24% 只是 Opus 5 在 17 个检查点、六小时小样本上的成绩——SWE-bench 也曾被认为打不穿，模型代际跃迁后指标会跳变，用当下低分否定黑灯工厂是静态思维。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Dex 在 Part 1 承认缺可维护性基准，Part 3 用 SlopCodeBench 填坑：检查点渐进需求 + 严格通过（新功能与全历史回归）+ Slop Meter 41 项指标。</li>
    <li>六小时实测：Opus 5 严格通过 24%（4/17），Sonnet 5 与 Opus 4.8 仅 6%；没有任何模型在任何题上全通关。</li>
    <li>代码劣化信号扎眼：90%+ 行触发劣化规则，啰嗦行占比随检查点从约 65% 涨到约 80%；Opus 5 关灯代码劣化触发率是人类评审 TS 代码库的 11 倍以上（对照尚不完美）。</li>
    <li>三模型策略分化：Opus 5 拆小函数压复杂度但函数数暴涨；Opus 4.8 改大函数致复杂度飙 70%。高通过率常伴随代码量膨胀约 1.8 倍。</li>
    <li>更有前瞻的验证思路：「降级接手」——强模型搭前 N 关，弱模型能否续写下一关，反向检验代码是否真可维护。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>评估模型/agent 时加入 SCB 或同类长周期基准，不要只看 SWE-bench 一次性解题分数。</li>
    <li>内部设定「严格通过率 + Slop Meter 趋势」双指标，Dex 个人门槛是类似 SCB 上 80%+ 才更放心减人类评审。</li>
    <li>设计「强模型搭建、弱模型接手」对照实验，作为评审 Agent 之外的硬信号。</li>
    <li>关注检查点越往后失败是否因遗留缺陷连锁——映射到自家 PR 是否也在累积未修技术债。</li>
    <li>测评跑法可全并行化（Dex 复盘：六小时可压到一至两小时），定期复跑跟踪代际进步。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「没有尺子只能凭感觉说模型学不会可维护性」转为「有了 SlopCodeBench 这把刻度尺，数据印证直觉但依然严峻」——行业可以诚实记录进步幅度，但 24% 意味着今天仍不能无人值守关灯；尺子本身比乐观或悲观的猜测更有价值。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
