import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'rust-ai-borrow-checker-appeasement-debt.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#fff7ed,#fef2f2);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#c2410c,#dc2626);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-rust{background:#ffedd5;color:#9a3412}.tag-ai{background:#fee2e2;color:#991b1b}.tag-slate{background:#e2e8f0;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#c2410c;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:16px 0}
.node{background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fdba74;border-radius:14px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#9a3412}
.node-em{background:linear-gradient(135deg,#c2410c,#dc2626);border-color:#fb923c;color:#fff7ed}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#9a3412,#dc2626);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#fff7ed;padding:10px 12px;text-align:left;font-weight:700;color:#c2410c;border-bottom:2px solid #fed7aa}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fff1f2;border:2px solid #e11d48;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#be123c;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#e11d48;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#881337}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
.highlight{background:#fff7ed;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#9a3412;border-left:4px solid #ea580c}
.pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#0f172a}`;

const body = `
<h1>借用检查器迎合型技术债：AI 迁 Rust 的暗伤</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-rust">Borrow-checker appeasement debt</span>
  <span class="tag tag-ai">Claude TS→Rust 迁移</span>
  <span class="tag tag-slate">r/rust 实录</span>
</div>
<p class="subtitle">本文回答：当 AI 把 1.2 万行 TypeScript 游戏引擎迁到 Rust 且 3091 项确定性测试全绿时，为何仍可能出现架构、性能与可维护性的系统性倒退——以及如何用目标驱动与架构约束把「技术债生产自动化」刹住。</p>

<div class="map">
  <h3 style="font-size:20px;color:#c2410c;margin-bottom:12px;text-align:center">AI 的局部解题路径</h3>
  <div class="diagram">
    <div class="node">借用冲突</div><span class="arrow-sym">→</span>
    <div class="node-em">Clone / mem::take</div><span class="arrow-sym">→</span>
    <div class="node">编译通过</div>
  </div>
  <div class="diagram" style="margin-top:8px">
    <div class="node">19 个类</div><span class="arrow-sym">→</span>
    <div class="node-em">单文件 12349 行 Game</div><span class="arrow-sym">→</span>
    <div class="node">测试仍 100%</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：编译通过 + 确定性回放全绿 = 迁移成功。原文强调借用检查器只证明<strong>语言规则</strong>，不证明架构合理、热路径无多余分配或模块边界清晰。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Borrow-checker appeasement debt</h3>
  <p><strong>在讲什么问题：</strong>AI 用迎合借用检查器的局部技巧消除报错，却牺牲 Rust 倡导的合理所有权与工程设计。</p>
  <p><strong>关键理解：</strong>不违反 Rust 规则，但偏离「认真划分状态边界」的设计意图；把每次 borrow 报错当成编译题而非架构信号。</p>
  <p><strong>和其他概念关系：</strong>区别于传统 C++ 内存安全债；更接近「意大利面式语言翻译」——语法换新、结构未重塑。</p>
  <p><strong>怎么落地用：</strong>审计 AI Rust 时单独建维度表：语法/功能/确定性/架构/性能/可维护性，后三项不能从测试推断。</p>
  <p><strong>边界说明：</strong>合理场景下 Clone、mem::take 仍合法；债发生在热循环 175 次 clone、巨型单文件等系统性滥用。</p>
  <p><strong>原文依据：</strong>「AI 没有违反 Rust 的规则……逐渐偏离了 Rust 原本希望开发者采用的工程设计方式。」</p>
</div>

<div class="card">
  <h3>【跨概念对比表】质量六维 vs AI 迁移后表现</h3>
  <table>
    <tr><th>维度</th><th>AI 迁移后</th><th>人类重构后启示</th></tr>
    <tr><td>语法/类型</td><td>通过</td><td>必要但不充分</td></tr>
    <tr><td>功能/确定性</td><td>3091/3091 哈希一致</td><td>可保持的同时优化架构</td></tr>
    <tr><td>架构</td><td>单 Game 巨石</td><td>拆 3 crate + 子结构</td></tr>
    <tr><td>性能</td><td>热循环大量 clone；渲染每帧拷缓冲</td><td>模拟 1.9×、渲染 2.6–3×</td></tr>
    <tr><td>可维护性</td><td>19 个 impl Game 块</td><td>cargo check 8.5s→0.77s</td></tr>
  </table>
</div>

<div class="card">
  <h3>【概念拆解卡】案例中的四类迎合手法</h3>
  <p><strong>压扁 OOP：</strong>19 类 → 一个 12,349 行 <code>game.rs</code>，消灭多对象可变借用冲突。</p>
  <p><strong>热路径 Clone：</strong>约 175 次 clone/collect，把借用冲突当局部题。</p>
  <p><strong>mem::take 转移：</strong>临时掏空字段再塞回，状态机难推理。</p>
  <p><strong>渲染管线：</strong>每帧 clone 全像素缓冲 + 每帧 4 线程 scope（900 帧约 3840 线程），4 核机上拖垮模拟。</p>
  <p><strong>合理替代：</strong>GameMap/WorldState/NavState 分治、Arena 索引、可复用环形缓冲——人类重构已验证且测试仍全绿。</p>
  <p><strong>原文依据：</strong>「900 帧视频累计产生了约 5.9GB 的堆内存分配。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】AGENTS.md 与架构硬约束</h3>
  <p><strong>核心思路：</strong>AI 缺默认工程品味，须把 Rust 惯用法写进 Agent 可读规则并尽量自动化。</p>
  <p><strong>操作步骤：</strong>① 在 CLAUDE.md/AGENTS.md 写清 Newtype、少 Arc、Channel 共享、禁热循环无理由堆分配 → ② Clippy/自定义 Lint + Criterion 基准 → ③ CI 性能预算与架构规则 → ④ 独立审查 Agent（新上下文）。</p>
  <p><strong>选型条件：</strong>大模型迁移、长时 Agent 会话、缺少人类架构 owner 时必做。</p>
  <p><strong>避坑：</strong>规则只躺在长 Markdown 里不生效；写代码 Agent 自我验收会沿原错误架构继续「优化」。</p>
  <p><strong>对比：</strong>功能 TDD 验行为；架构约束驱动验结构与性能意图。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】从「做什么」到「怎样才算做好」</h3>
  <p><strong>原则：</strong>迁移指令必须捆绑成功标准：性能不低于原版、热路径分配需论证、模块体量上限、Benchmark 进 CI、重构需独立审查。</p>
  <p><strong>为什么：</strong>「迁移到 Rust」对 AI 只意味着消错；对人类意味着安全 + 性能 + 可演进。</p>
  <p><strong>怎么落地：</strong>先让 Agent 输出架构方案并追问冲突，再写码；关键决策人类签收。</p>
  <p><strong>边界：</strong>小脚本/原型可放宽；确定性模拟、渲染管线、长生命周期系统不可放宽。</p>
  <p><strong>原文支撑：</strong>社区观点——「不要只告诉 AI 做什么，还要告诉它怎样才算做好。」</p>
</div>

<div class="card">
  <h3>【决策/选型表】审查与 Agent 工作流</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>大体积 AI 首稿</td><td>独立审查 Agent + 人审架构</td><td>打破生成者惯性</td><td>仅 rerun 测试</td><td>掩盖 appeasement 模式</td></tr>
    <tr><td>Rust 热循环</td><td>Benchmark + 分配审计</td><td>借用检查器看不见 clone 成本</td><td>见错就 clone</td><td>复利性能债</td></tr>
    <tr><td>多 Agent 团队</td><td>20% 时间维护工作流规则</td><td>代码生产机器需运维</td><td>只堆模型能力</td><td>工作流决定下限</td></tr>
    <tr><td>语言迁移</td><td>重塑状态边界</td><td>避免「意大利面 Rust」</td><td>1:1 语法翻译</td><td>历史教训在 AI 时代加速重演</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】AI 时代技术债自动化</h3>
  <p><strong>坑名：</strong>测试全绿当签收。<strong>原因：</strong>测试不评架构。<strong>解法：</strong>六维质量表 + 性能预算。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>把 borrow 报错当编译题。<strong>解法：</strong>报错时先画所有权图再改结构。<strong>严重程度：</strong>致命（热路径）。</p>
  <p><strong>坑名：</strong>单文件万行「能跑就行」。<strong>解法：</strong>crate/模块上限写进 AGENTS.md。<strong>严重程度：</strong>小心→致命随团队扩大。</p>
  <p><strong>坑名：</strong>生成与审查同一上下文。<strong>解法：</strong>新会话审查 + 人拍板关键拆分。<strong>严重程度：</strong>小心。</p>
  <div class="pitfall">代码生成速度已反超工程判断力时，技术债从偶发错误变成系统性副产品——须用自动化约束对冲自动化产出。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「有 AI 就不用懂 Rust，能编译就行」</p>
  <p class="rebuttal-text">借用检查器正是要逼你思考所有权；若用 clone 堆出生成的「合法垃圾」，你得到的是更慢、更难改的遗留系统——而且 AI 一天能造一整年的债。懂 Rust 工程实践不是为了炫技，而是为了把约束写进 Agent，否则它永远选最容易过编译的那条路。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Reddit 实录：Claude 迁 Rust 测试全绿，却出现巨石文件、175 次热循环 clone、渲染海量分配——借用检查器迎合型技术债。</li>
    <li>人类重构：3 crate + 状态重划 + 缓冲复用 → 1.9× 模拟、~3× 渲染，确定性不变。</li>
    <li>防范重心从功能测试扩展到目标驱动、架构约束自动化、独立审查。</li>
    <li>换语言/换 AI 不自动消灭债；生成加速要求审查与规则同步加速。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>为 Rust Agent 项目起草 AGENTS.md：热循环分配、模块边界、Channel vs Arc 优先级。</li>
    <li>对 AI 首稿跑 Criterion/分配 profiler，设 CI 回归阈值。</li>
    <li>大迁移拆阶段：架构方案评审 → 实现 → 新上下文代码审查。</li>
    <li>审计存量 AI Rust：单列「clone/行」与最大文件行数指标。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「让 AI 写出能编译的 Rust」转为「让 AI 在明确性能与架构目标下，生产经独立审查、可长期演进的 Rust」——否则 Rust 修掉的是 C++ 四十年的债，AI 却在更短时间内制造下一代债。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');