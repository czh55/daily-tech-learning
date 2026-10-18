import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'rust-in-the-agentic-era-guardrails-proofs-and-design-languages.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#eef2ff,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#3730a3,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-indigo{background:#e0e7ff;color:#3730a3}.tag-violet{background:#ede9fe;color:#5b21b6}.tag-emerald{background:#d1fae5;color:#065f46}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #6366f1}
.card h3{font-size:22px;font-weight:700;color:#3730a3;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#eef2ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#312e81;border-left:4px solid #6366f1}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eef2ff,#c7d2fe);border:2px solid #a5b4fc;border-radius:14px;padding:10px 12px;text-align:center;min-width:72px;font-weight:700;font-size:10px;color:#312e81}
.node-green{background:linear-gradient(135deg,#ecfdf5,#a7f3d0);border-color:#6ee7b7;color:#065f46}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#3730a3,#6366f1);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#3730a3;border-bottom:2px solid #cbd5e1}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px}`;

const body = `
<h1>Agent 时代 Rust：护栏、证明与设计语言</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-indigo">Niko Matsakis</span>
  <span class="tag tag-violet">软件工厂三支柱</span>
  <span class="tag tag-emerald">lean-zip</span>
  <span class="tag tag-slate">反馈回路假说</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 Agent 接管「构造」与「优化」后，语言设计者为何仍有价值——以及 Rust 如何用类型护栏 + 证明系统，让人类把精力放在设计与可验证规格上。</p>

<div class="map">
  <h3 style="font-size:20px;color:#3730a3;margin-bottom:12px;text-align:center">设计（人）→ 构造/优化（Agent）→ 类型护栏 → 证明授权激进优化 → 设计语言战场</h3>
  <div class="diagram">
    <div class="node-green">Design<br>规格/不变量</div><span class="arrow-sym">→</span>
    <div class="node">Construction<br>Agent 写码</div><span class="arrow-sym">→</span>
    <div class="node">Optimization<br>旋钮+剖析</div><span class="arrow-sym">→</span>
    <div class="node">Proof<br>Verus/Kani</div><span class="arrow-sym">→</span>
    <div class="node-green">可读+<br>可验证</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：Agent 写码后语言设计过时。Niko 的结论是三层：人仍有角色、语言设计仍重要、Rust 是「很好的契合」但需进化——焦虑应转化为「让人机都易验证」的设计目标。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Rust 在 Agent 时代为何更热</h3>
  <p><strong>在讲什么问题：</strong>Meta 今年第一方 Rust 代码量约为过去 9 年总和两倍（仅次于 TS 增速）。</p>
  <p><strong>关键理解：</strong>试错成本降低 → 倾向选默认更快的语言；Rust 类型护栏让「能编译就大致正确」更接近现实。</p>
  <p><strong>怎么落地用：</strong>给 Agent 选语言时同时看迭代速度（Go）与缺陷拦截（Rust），按项目风险权衡。</p>
  <p><strong>边界说明：</strong>非 Rust 独霸；Go 在快速迭代场景仍有优势。</p>
  <p><strong>原文依据：</strong>Greg Brockman：Rust 是 Agent 的完美语言，因编译期拦住大量隐蔽 bug。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】软件工厂三支柱</h3>
  <p><strong>原则：</strong>设计（说清楚要什么）、构造（写出符合设计的代码）、优化（跑得快）——Rust 强项在后两者，设计仍是开放问题。</p>
  <p><strong>怎么落地：</strong>人类主责设计与审查接口；Agent 主责实现与性能旋钮（布局、分配、dial9 剖析异步阻塞）。</p>
  <p><strong>适用边界：</strong>「Markdown 驱动开发」是当前业界粗糙默认，不是终局。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】测试、类型、证明的分工</h3>
  <p><strong>核心思路：</strong>仿 Dijkstra：测试证 bug 存在；类型证某类 bug 不存在；仍不能证「程序正确」→ 需 Verus/Kani/Lean 等。</p>
  <p><strong>操作步骤：</strong>1）用类型拦住资源与并发类错误 → 2）用证明断言 panic 自由或输出正确 → 3）对 Agent 下达「可证明前提下任意优化」。</p>
  <p><strong>避坑：</strong>Agent 前几项测试漂亮、下一项离谱——说明逻辑被误解，不能只加测试不加类型/证明。</p>
  <div class="highlight">Verus 信任借用检查器的唯一性，简化 SMT——类型与证明是分工而非替代。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】lean-zip 实验该怎么读</h3>
  <table>
    <tr><th>指标</th><th>miniz_oxide</th><th>lean-zip（Lean+证明）</th><th>解读</th></tr>
    <tr><td>L6 压缩耗时</td><td>5.77s</td><td>4.57s（约快 30%）</td><td>证明后可放手让 Agent 激进改实现</td></tr>
    <tr><td>解压</td><td>更快</td><td>慢约 1.45×</td><td>不能宣称 Lean 全面更快</td></tr>
    <tr><td>工程成本</td><td>Rust 惯用写法易高性能</td><td>证明门槛高、内存更大</td><td>实验价值在「护栏换优化自由度」</td></tr>
  </table>
  <p><strong>原文依据：</strong>作者未宣称 Lean 比 Rust 快；对比并不完全对等，libdeflate 仍领先。</p>
</div>

<div class="card">
  <h3>【决策/选型表】Rust 进化三条路线</h3>
  <table>
    <tr><th>路线</th><th>目标</th><th>对 Agent 的意义</th></tr>
    <tr><td>If it compiles, it works</td><td>更强类型（视图类型、只读字段、日志隐私）</td><td>更多性质可机检</td></tr>
    <tr><td>低层够用高层清晰</td><td>保留性能旋钮，容忍 clone 噪音</td><td>人类读主干，Agent 写细节</td></tr>
    <tr><td>可扩展编译器</td><td>定理证明器、GPU 等接入</td><td>告别「野路子」锁编译器版本</td></tr>
  </table>
  <p><strong>北极星：</strong>「不再有 unsafe 代码」——不是删关键字，而是能证明所有 unsafe sound。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】设计战场与 Brooker 假说</h3>
  <p><strong>在讲什么问题：</strong>规格明确、反馈可自动化的系统软件，对 Agent 可能反而「更容易」；修图网站等需人类慢反馈的任务更难。</p>
  <p><strong>关键理解：</strong>Agent = 带反馈回路的 LLM；精确反馈越易得，任务越适合 Agent。</p>
  <p><strong>怎么落地用：</strong>投资「接口与实现分离」、专用建模语言，让人与 Agent 在不变量层迭代。</p>
  <p><strong>终局猜想：</strong>语言要对「人类读者 + Agent 作者 + 证明工具」同时友好。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】把 lean-zip 当成语言胜负</h3>
  <p><strong>坑名：</strong>用单次基准宣称「证明语言碾压 Rust」。 </p>
  <p><strong>原因：</strong>未对 miniz_oxide 做对称优化；内存与解压劣势被忽略。</p>
  <p><strong>解法：</strong>把实验读成「有定理即可外包优化给 AI」，而非选型唯一依据。</p>
  <p><strong>严重程度：</strong>对技术决策：小心以偏概全。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「反正 Agent 写码，人类不用懂 Rust」</p>
  <p class="rebuttal-text">当构造自动化后，稀缺的是可验证的设计与规格；不懂类型与证明边界的人，连该给 Agent 什么反馈、敢不敢授权优化都说不清——语言设计从「少敲键」转向「少误解」。 </p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Agent 降低试错成本，放大 Rust「默认快 + 护栏」优势，但非唯一选项。</li>
    <li>构造与优化可外包 Agent，设计仍是瓶颈与战场。</li>
    <li>类型 + 证明分工：前者简化后者，共同支撑「可证明的激进优化」。</li>
    <li>北极星是可证明 sound 的 unsafe 消失，遏制 Agent 挖洞时代的 CVE 潮。</li>
    <li>「能被验证」成为 Agent 时代最硬通货；想清楚比写出来更稀缺。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>为 Agent 工作流定义可机检的规格（类型、测试、证明）三层，而非只靠 Review。</li>
    <li>在性能敏感模块试点「证明通过才允许 Agent 改实现」的优化闭环。</li>
    <li>把接口与实现分离，优先审查 Agent 是否偷偷改契约。</li>
    <li>跟踪 Verus/Kani 与可扩展编译器路线，评估团队关键库的证明 ROI。</li>
    <li>培养「反馈回路设计」能力：让任务对 Agent 的反馈越精确，自动化越可靠。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「语言为人手书写优化」转为「语言为人机协同的可验证性与可读性优化」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
