import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'big-tech-switching-to-go.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:160px;font-weight:700;font-size:16px;color:#1e40af}
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
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>2026年，大厂重构核心系统为何集体投向 Go？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 语言</span>
  <span class="tag tag-green">系统重构</span>
  <span class="tag tag-orange">大厂实践</span>
  <span class="tag tag-purple">工程选型</span>
</div>
<p class="subtitle">本文解决的核心问题是：当业务规模膨胀、运行成本成为首要驱动力时，大厂为何在核心系统重构中集体选择 Go，以及「移植 vs 重写」和「影子测试」如何降低迁移风险。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">运行成本<br/>成为首要驱动力</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Go 黄金分割点<br/>效率 × 性能</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Port 平滑移植<br/>Shadow Testing</div>
    <span class="arrow-sym">→</span>
    <div class="node">算力优化<br/>10x 构建 / 95% 实例削减</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「大厂选 Go 是技术跟风」—— 真实驱动力是运行账单与 P99 延迟，而非语言热度。微软选 Go 而非 C#/Rust 的核心原因是「保持 Same behavior &amp; structure 的 Port」，不是 Go 比 Rust 更快。</p>
</div>

<div class="card">
  <h3>【模板 A】Port vs Rewrite：重构的第一道决策</h3>
  <p><strong>在讲什么问题：</strong>系统迁移时，是翻译现有代码还是推倒重来？</p>
  <p><strong>核心机制：</strong>Port（移植）保持原有代码结构和行为，逐行翻译；Rewrite（重写）抛弃旧设计从零开始，风险极高。</p>
  <p><strong>关键理解：</strong>Anders Hejlsberg 选 Go 移植 TS 编译器，是因为旧编译器是函数式+GC 风格——C# 的 OOP 范式几乎等于重写，Rust 无 GC 需彻底重设内存生命周期，同样背离 Port 初衷。</p>
  <p><strong>怎么落地：</strong>评估旧代码范式 → 若目标是「保行为提性能」选 Port 目标语言 → 优先选与旧代码结构相似且有 GC 的语言。</p>
  <p><strong>边界说明：</strong>若旧架构本身已不可维护（Reddit 单体），则必须 Rewrite 为微服务，但仍可 Port 局部模块逻辑。</p>
  <div class="quote">原文：Port 是「翻译现有代码，保持原有结构和行为」；Rewrite 是「抛弃旧代码，从零重新设计」。</div>
  <div class="relation"><strong>与 Rust 的关系：</strong>Rust 适合从零设计内存安全系统；Port 场景下 Rust 的学习曲线和所有权模型反而是阻力。</div>
</div>

<div class="card">
  <h3>【模板 A】微软 TS 编译器：10x 构建速度的 Port 范本</h3>
  <p><strong>在讲什么问题：</strong>C# 之父为何不用 C# 移植自家 TS 编译器？</p>
  <p><strong>核心机制：</strong>2025 年 3 月宣布 Port 到 Go，2026 年 4 月 TS 7 Beta 发布；Go 的 GC + 编译型 + 与 TS 函数式风格结构相似，实现平滑翻译。</p>
  <p><strong>关键理解：</strong>编译构建速度提升 10 倍，编辑器加载从 9.5 秒降至 1.2 秒——性能跨越在不改架构的前提下完成。</p>
  <p><strong>怎么落地：</strong>工具链/编译器类项目优先考虑 Port 路径；用 Go 的 idiomatic 结构映射旧代码模块，而非强行 OOP 化。</p>
  <p><strong>边界说明：</strong>若团队零 Go 经验且 deadline 极紧，Port 仍需要学习成本；不适合需要极致零 GC 停顿的实时系统。</p>
  <div class="highlight"><strong>落地建议：</strong>编译器/CLI 工具若受 Node/Python 启动慢困扰，评估 Port 到 Go 的 ROI——微软案例证明 10x 构建加速可行。</div>
</div>

<div class="card">
  <h3>【模板 B】Reddit 影子测试：零故障上线方法论</h3>
  <p><strong>方法名：</strong>Shadow Testing（双轨并行对比）<span class="tag tag-green" style="margin-left:8px">微服务迁移</span></p>
  <p><strong>核心思路：</strong>Python 单体与 Go 微服务同时接收相同写入，Go 写隔离 Test DB，后台持续 Compare &amp; Debug，确认无误后切流量。</p>
  <p><strong>操作步骤：</strong>① 四大特性（评论/账户/帖子/子社区）拆为 Go 微服务 ② 双轨接收 User Input ③ Go 写 Test DB，Python 写 Production DB ④ 对比输出修复 Bug ⑤ 100% 切流量。</p>
  <p><strong>选型条件：</strong>核心系统替换、不能承受「一刀切」上线风险时必选。</p>
  <p><strong>避坑：</strong>切忌直接切流量；必须隔离 DB 避免污染生产数据。</p>
  <p><strong>对比相邻方法：</strong>vs 金丝雀发布——Shadow 在切流量前已完成全量输出对比，更稳健但资源双倍。</p>
  <div class="quote">原文：重构后关键写入 P99 延迟砍半，高可用性大幅提升。</div>
</div>

<div class="card">
  <h3>【模板 B】Lovable &amp; Uber：算力成本的硬数据</h3>
  <p><strong>在讲什么问题：</strong>高并发 IO 场景下 Python/Node 的账单有多痛？</p>
  <p><strong>核心机制：</strong>Lovable 一条聊天指令触发 50+ HTTP 并发；4.2 万行 Python 重写 Go 后实例 200→10（95% 削减）。Uber 从 Python/Node 收敛至 Go，节省 97% 算力。</p>
  <p><strong>怎么落地：</strong>①  profiling 并发 IO 热点 ② 用 Goroutine+Channel 替换多线程/多进程 ③ 压测对比单实例 QPS ④ 按新容量缩减实例数。</p>
  <p><strong>边界说明：</strong>CPU 密集型计算（非 IO）Go 优势缩小；团队无 Go 经验时重写成本需计入 ROI。</p>
  <div class="relation"><strong>与 Python 的关系：</strong>Python 早期开发爽感强，但规模扩大后硬件成本指数上升——Go 是 IO 密集型后端的务实收敛点。</div>
</div>

<div class="card">
  <h3>【模板 E】后端语言选型对比</h3>
  <table>
    <tr><th>对比维度</th><th>Go</th><th>Rust</th><th>Python/Node</th><th>一句话结论</th></tr>
    <tr><td>开发效率</td><td>高，GC 免手动内存</td><td>低，所有权学习曲线陡</td><td>最高，动态语言</td><td>Go 是效率与性能折中</td></tr>
    <tr><td>Port 友好度</td><td>高，结构相似 GC 代码</td><td>低，需重设生命周期</td><td>—</td><td>Port 场景 Go 完胜 Rust</td></tr>
    <tr><td>并发模型</td><td>Goroutine 轻量</td><td>async/线程</td><td>GIL/事件循环瓶颈</td><td>高并发 IO 首选 Go</td></tr>
    <tr><td>运行成本</td><td>接近原生，实例少</td><td>最优但开发慢</td><td>实例数膨胀</td><td>账单驱动选 Go</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 D】系统重构选型决策表</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>编译器/工具链提速</td><td>Port 到 Go</td><td>保结构 10x 构建加速</td><td>Port 到 Rust</td><td>内存模型需完全重写</td></tr>
    <tr><td>单体拆微服务</td><td>Go 重写 + Shadow Testing</td><td>Goroutine 抗并发 + 零故障切换</td><td>直接切流量</td><td>生产 Bug 不可控</td></tr>
    <tr><td>AI 编排 50+ API 并发</td><td>Python → Go 重写</td><td>Lovable 200→10 实例实证</td><td>继续堆 Python 实例</td><td>账单线性膨胀</td></tr>
    <tr><td>内存安全从零设计</td><td>Rust</td><td>极致安全与性能</td><td>Go Port</td><td>Go 无编译期所有权</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 F】Go 黄金分割点心法</h3>
  <p><strong>原则：</strong>Go 处于「开发效率」与「运行性能」的黄金分割点——不像 Rust 那样陡峭，又有接近原生的速度和冠绝的轻量并发。</p>
  <p><strong>为什么重要：</strong>项目初期动态语言爽感掩盖运行成本；规模扩大后账单和 P99 成为重构首要驱动力。</p>
  <p><strong>怎么落地：</strong>监控实例数与 P99 → 超阈值时评估 Go 迁移 → 优先 Port 保行为，必要时 Rewrite 微服务。</p>
  <p><strong>适用边界：</strong>不适合需要极致零 GC 或编译期内存安全的场景；团队完全无系统语言经验时需培训预算。</p>
  <div class="quote">原文：「运行成本正成为系统重构的首要驱动力。」</div>
</div>

<div class="card">
  <h3>【模板 C】避坑清单</h3>
  <p><strong>坑：把 Port 当 Rewrite 做</strong> — 强行 OOP 化函数式代码，等于双倍风险。<strong>解法：</strong>保持 Same behavior &amp; structure。<strong>严重程度：致命。</strong></p>
  <p><strong>坑：核心系统「一刀切」上线</strong> — 未对比双系统输出。<strong>解法：</strong>Reddit 式 Shadow Testing。<strong>严重程度：致命。</strong></p>
  <p><strong>坑：为追语言热度选 Rust Port</strong> — 内存生命周期需完全重设计。<strong>解法：</strong>Port 选 GC 语言，Rewrite 才考虑 Rust。<strong>严重程度：小心。</strong></p>
  <div class="pitfall"><strong>另一个坑：</strong>误以为 Go 适合所有场景——CPU 密集计算、强实时零 GC 系统仍需 Rust/C++ 或专项优化。</div>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>大厂集体投 Go 的驱动力是运行成本与 P99 延迟，不是跟风</li>
    <li>Port vs Rewrite 是重构第一决策——微软 TS 编译器证明 Port 到 Go 可 10x 提速</li>
    <li>Reddit Shadow Testing 是核心系统零故障上线的最佳实践</li>
    <li>Lovable 200→10 实例、Uber 97% 算力节省验证 Go 在 IO 并发的 ROI</li>
    <li>Go 是开发效率与运行性能的黄金分割点，Rust 适合从零而非 Port</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>盘点当前服务实例数与 P99，识别 IO 并发热点</li>
    <li>下次重构前先画 Port vs Rewrite 决策树，明确是否保原有结构</li>
    <li>核心系统迁移设计 Shadow Testing 双轨方案，隔离 Test DB</li>
    <li>对编译器/CLI 工具评估 Port 到 Go 的构建速度 ROI</li>
    <li>观看微软 TS→Go 演讲（YouTube: -Z813pHqSFI）对照自身场景</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「选最潮语言」到「在业务发展、团队认知和机器成本之间找最优解」——Go 是大厂多次工程实践后给出的最务实答案。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
