import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-vs-rust-ai-age.svg');

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
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>在 AI 编码时代，为什么我们依然选择 Go 而不是 Rust？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go</span>
  <span class="tag tag-orange">Rust</span>
  <span class="tag tag-green">AI 编程</span>
  <span class="tag tag-purple">技术选型</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 AI 已能帮你写出可编译的 Rust 代码时，为什么 Reddit 资深架构师仍认为 Go 的「简单与无聊」才是 AI 时代后端微服务的更优选型，以及这一判断背后的可读性、并发运行时与依赖生态三条工程逻辑。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-orange">AI 降低写代码门槛</div>
    <span class="arrow-sym">→</span>
    <div class="node">读/维护成本飙升</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Go 低认知负载</div>
    <span class="arrow-sym">+</span>
    <div class="node">GMP 抢占调度</div>
    <span class="arrow-sym">+</span>
    <div class="node-green">富标准库</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「AI 能写 Rust 了，Rust 学习曲线就不再是选型障碍」—— 原文强调 AI 消灭的是「写」的门槛，却成倍抬高「读、Review、On-Call 排查」成本；编译通过不等于团队能在凌晨三点读懂 AI 生成的泛型嵌套与生命周期标注。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】AI 时代「写易读难」悖论</h3>
  <p><strong>在讲什么问题：</strong>AI 编程工具改变了语言选型的核心矛盾——从「会不会写」转向「能不能快速读懂和维护」。</p>
  <p><strong>核心机制：</strong>大模型为通过 Rust 编译器，倾向生成复杂泛型、宏与 Trait 绑定；Go 语言刻意限制表达复杂度，AI 产出的 Go 代码与人工代码风格一致。</p>
  <p><strong>关键理解：</strong>编写代码是一时的，Code Review 与 On-Call 排查才是永恒的；在 AI Slop 指数级爆发的未来，「一眼看穿」比「写得快」更稀缺。</p>
  <p><strong>典型场景：</strong>中大型后端微服务、需要多人协作与轮值 On-Call 的团队项目。</p>
  <p><strong>边界说明：</strong>若团队 Rust 专家充足、且业务确需内存级控制（内核、HFT、边缘设备），此论点不适用。</p>
  <div class="quote">原文：「如果你打算让 AI 写完所有代码且你从不检查，那么 Rust 是完美的……前提是，你是那个在凌晨 3 点值班、随时准备被报警电话叫醒去排查问题的人。」</div>
  <div class="relation"><strong>与「编译通过就能运行」的关系：</strong>Rust 编译器守住类型与内存安全，但逻辑漏洞与 async 死锁仍可能上线；Go 的护城河不在编译器刚性，而在人类可读性与运行时容错。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Go GMP vs Rust Tokio 并发模型</h3>
  <table>
    <tr><th>对比维度</th><th>Go GMP 抢占式</th><th>Rust Tokio 协作式</th><th>一句话结论</th></tr>
    <tr><td>调度方式</td><td>运行时强制抢占，烂循环不会让出也能被中断</td><td>协程必须主动 yield，阻塞调用锁死 Event Loop</td><td>AI 乱写代码时 Go 更抗造</td></tr>
    <tr><td>编译器防护</td><td>不检测 async 块内同步阻塞</td><td>类型安全但不检测运行时阻塞调用</td><td>Rust 编译通过≠并发安全</td></tr>
    <tr><td>AI 生成风险</td><td>服务变慢但不易整体卡死</td><td>async 内夹带 sync I/O 可瞬间死锁微服务</td><td>AI 难感知系统上下文时 Rust 隐患更大</td></tr>
    <tr><td>适用上限</td><td>通用后端、云原生微服务</td><td>极致性能、零成本抽象场景</td><td>默认后端选 Go，极限场景选 Rust</td></tr>
  </table>
  <div class="highlight"><strong>落地建议：</strong>若团队用 AI 生成 Rust async 代码，强制 CI 加入 tokio-console 与 blocking 检测 lint；Go 侧则重点审查 goroutine 泄漏与 context 传递。</div>
</div>

<div class="card">
  <h3>【决策/选型表】AI 时代后端语言选型</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>中大型微服务 + AI 辅助开发</td><td>Go</td><td>易读、秒级编译、GMP 容错、富标准库</td><td>Rust</td><td>AI 生成代码难 Review，Crate 依赖树膨胀</td></tr>
    <tr><td>OS 内核 / HFT / 边缘设备</td><td>Rust</td><td>内存安全与零成本抽象是硬需求</td><td>Go</td><td>GC 与运行时开销无法满足极限场景</td></tr>
    <tr><td>小团队快速 MVP</td><td>Go</td><td>3 天上手、10 倍开发效率、低维护成本</td><td>Rust</td><td>编译慢 + 依赖冲突让 AI 迭代体验差</td></tr>
    <tr><td>安全关键且专家充足</td><td>Rust</td><td>编译器守住安全底线，团队能读懂 AI 产出</td><td>纯 AI 无 Review</td><td>逻辑漏洞与 async 雷区编译器看不见</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】AI + Rust 生产环境四大雷区</h3>
  <p><strong>坑 1：AI Rust 代码「天书化」</strong></p>
  <p><strong>原因：</strong>模型为通过 Borrow Checker 堆砌高级语法。</p>
  <p><strong>原文说法：</strong>「面对这堆天书般的高级 Rust 代码，你根本无法在短时间内看清它的真实意图。」</p>
  <p><strong>解法：</strong>强制人工 Review AI 产出，或选型 Go 降低认知负载。</p>
  <p><strong>严重程度：</strong>致命（On-Call 无法排障）</p>
  <div class="pitfall"><strong>坑 2：async 块内同步阻塞</strong> — Tokio 协作式模型下 AI 夹带 sync 调用会锁死 Event Loop，编译器无法检测。严重程度：致命。</div>
  <div class="pitfall"><strong>坑 3：Crate Hell 依赖冲突</strong> — Rust 标准库贫瘠，Web 服务需 tokio/serde/reqwest 整树，AI 频繁生成版本冲突代码。严重程度：小心。</div>
  <div class="pitfall"><strong>坑 4：编译时间雪崩</strong> — 上百节点依赖 + Rust 本就慢编译，AI 快速迭代优势被抵消。严重程度：小心。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】90% 性能换 10% 心智负担</h3>
  <p><strong>原则：</strong>除非业务是内核/HFT/边缘设备，否则用 Go 换 10 倍效率与秒级编译，在商业世界性价比更高。</p>
  <p><strong>为什么重要：</strong>AI 让「简单」更昂贵——能一眼看穿、无痛维护的代码才是最稀缺资产。</p>
  <div class="quote">原文：「Go 语言那近乎固执的无聊与克制，并不是落后，而是其对人机协同软件工程最深邃的先见之明。」</div>
  <p><strong>怎么落地：</strong>新立项微服务默认 Go；仅在性能 profiling 证明 Go 不够且团队有 Rust 专家时再切换。</p>
  <p><strong>适用边界：</strong>需要极致内存控制或无 GC 延迟的场景除外。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Rust 生态布道者 / 「安全与性能不可妥协」派</p>
  <p class="rebuttal-text">AI 恰恰抹平了 Go 相对 Rust 的最大劣势——手写复杂度；当编译器替你守住内存安全、泛型与生命周期由模型生成时，你牺牲的是 10% 极限性能，换来的却是零 cost abstraction 与无 GC 延迟，中大型服务里真正拖垮 SLA 的往往是 GC 停顿和运行时不可预测性，而非读代码多花五分钟。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>AI 降低「写」的门槛，却成倍抬高「读与维护」成本，易读性成为比易写性更贵的资产。</li>
    <li>Go 的 GMP 抢占调度在 AI 生成「烂代码」时比 Rust Tokio 协作式模型更容错。</li>
    <li>Go 富标准库避免 Crate Hell，Rust 依赖树膨胀会拖慢 AI 迭代与编译。</li>
    <li>黄金法则：非内核/HFT/边缘场景，Go 的 10 倍效率与低维护成本性价比更高。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>评估团队下一个微服务项目：列出 On-Call 负担与 Review 人力，对照 Go/Rust 认知负载。</li>
    <li>若已用 AI 生成 Rust async 代码，本周内加 blocking 检测与 tokio-console 监控。</li>
    <li>制定 AI 代码 Review 规范：禁止无人工 Review 直接合并 AI 产出。</li>
    <li>非极限性能场景，新服务默认 Go，用 profiling 数据而非直觉决定是否上 Rust。</li>
  </ol>
  <p><strong>关键认知转变：</strong>AI 时代语言选型的核心问题从「哪个更好写」变成「哪个更好读、更好在凌晨三点排障」——Go 的「无聊」正是其最坚不可摧的壁垒。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
