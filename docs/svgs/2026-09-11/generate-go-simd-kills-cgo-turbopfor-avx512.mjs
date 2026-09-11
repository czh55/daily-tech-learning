import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-simd-kills-cgo-turbopfor-avx512.svg');

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
<h1>Go SIMD 杀疯了：纯 Go 重写 TurboPFor，删光最后一行 cgo 并反超 C 库</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go SIMD</span>
  <span class="tag tag-green">simd/archsimd</span>
  <span class="tag tag-orange">TurboPFor</span>
  <span class="tag tag-purple">AVX512</span>
  <span class="tag tag-red">性能优化</span>
</div>
<p class="subtitle">本文解决的核心问题是：Debian Code Search 作者如何用 Go 1.26/1.27 实验性 simd/archsimd 包，把服役 7 年的 TurboPFor cgo 依赖彻底替换为纯 Go，并在标量优化、AVX2 垂直布局与 AI 发现的「位置汇编计数」三波加速后反超历史 cgo 版本。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">DCS TurboPFor 性能演进路径</h3>
  <div class="diagram">
    <div class="node">朴素定长编码<br>起点</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">标量优化<br>76% C 性能<br>PGO/复用/泛型特化</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">AVX2 垂直布局<br>约 3× 加速</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">位置汇编计数<br>AI 发现 · 再 ×2</div>
    <span class="arrow-sym">→</span>
    <div class="node">反超 cgo<br>7 IPC / 8 上限</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">编码瓶颈在「扫描选块类型」而非编码本身——这一发现决定了后续 SIMD 优化的方向</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Go 性能优化必须先上 SIMD」。作者实测表明，在动用向量指令前，仅靠缓冲区复用（+11%）、泛型位宽特化（+40%~64%）就能把纯 Go 推到 C 版本的 76% 以上——大量性能来自减少分配、让编译器把循环「焊死」成常量代码，而非一上来就写汇编。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】simd/archsimd：Go 官方实验性 SIMD 入口</h3>
  <p><strong>在讲什么问题：</strong>Go 1.26 之前想用 SIMD 只能走汇编、cgo 或代码生成器，维护成本极高。</p>
  <p><strong>核心机制：</strong>Go 1.26 引入实验性 <code>simd/archsimd</code> 包，构建时设 <code>GOEXPERIMENT=simd</code> 启用；支持 amd64 下 128/256/512 位向量类型（如 <code>Uint32x8</code>）及 <code>Add</code>、<code>Load</code>、<code>Store</code> 等操作，API 尚未稳定。</p>
  <p><strong>关键理解：</strong>第一次让开发者用「看得懂的 Go 代码」直接调用 AVX2/AVX512，无需 cgo 交叉编译包袱，同时保留运行时 CPU 特性探测 + 标量回退的三文件构建标签模式。</p>
  <p><strong>典型场景：</strong>整数压缩/解压、批量常量填充、位图统计等数据并行密集计算。</p>
  <p><strong>边界说明：</strong>实验性 API 可能变更；目前仅 amd64；无法像 clang 那样精确到 Zen 4 等具体 CPU 型号；部分热路径仍有边界检查开销。</p>
  <div class="quote">原文：Go 1.26 引入了实验性的 simd/archsimd 包，Go 1.27 上这套能力已足够扎实，可支撑生产项目验证。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】TurboPFor 与 DCS 的 7 年 cgo 心结</h3>
  <p><strong>在讲什么问题：</strong>Debian Code Search 倒排索引需要极高效压缩海量整数列表，为何被迫依赖 C 库 7 年？</p>
  <p><strong>核心机制：</strong>DCS 用 TurboPFor 格式压缩文档 ID 整数列表；多年来通过 cgo 调用 C 语言 powturbo/TurboPFor 库获取 SIMD 级性能，与「纯 Go 项目」设计初衷冲突。</p>
  <p><strong>关键理解：</strong>编码器真正开销大头是扫描输入值、统计各位宽下异常值数量的直方图（决定用 bitpacking / exceptions / constant 哪种块类型），而非编码本身——这为「位置汇编计数」优化埋下伏笔。</p>
  <p><strong>典型场景：</strong>局部索引增量编码、索引合并、查询时高并发解码三类场景，API 设计为 BlockEncoder + StreamEncoder 复用缓冲区。</p>
  <p><strong>边界说明：</strong>对标移植回 C 的同等 AVX512 优化后，Go 仍慢约 1.4 倍；VB 异常处理、全位宽定价等路径仍可进一步 SIMD 化但会牺牲可读性。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】Go 获取 SIMD 的四条路径</h3>
  <table>
    <tr><th>对比维度</th><th>手写 Go 汇编</th><th>Avo 等代码生成</th><th>cgo 调 C 库</th><th>simd/archsimd</th><th>一句话结论</th></tr>
    <tr><td>可读性</td><td>极差，只适合极小函数</td><td>中等，仍本质上是汇编</td><td>需维护 C 代码</td><td>高，纯 Go 向量 API</td><td>长期维护首选 archsimd</td></tr>
    <tr><td>交叉编译</td><td>受 GOARCH 限制</td><td>同汇编</td><td>复杂，需 C 工具链</td><td>Go 原生交叉编译</td><td>纯 Go 项目应优先摆脱 cgo</td></tr>
    <tr><td>性能上限</td><td>可达硬件极限</td><td>同手写汇编</td><td>clang 可精确调 CPU</td><td>接近但仍有 1.4× 差距</td><td>极致性能仍可能需 C/clang</td></tr>
    <tr><td>维护成本</td><td>高</td><td>中高</td><td>高（双语言）</td><td>低（实验性风险除外）</td><td>DCS 选 archsimd 是为删光 cgo</td></tr>
    <tr><td>适用场景</td><td>标准库级热点（如 IndexByte）</td><td>crypto 等固定算法</td><td>遗留 C 库接入</td><td>新项目高性能数值计算</td><td>按团队能力与项目约束选型</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】三波优化实战流程</h3>
  <p><strong>方法名：</strong>标量榨干 → SIMD 向量化 → AI 辅助微观优化 · 标签：可度量、可回退</p>
  <p><strong>核心思路：</strong>先搭准测量工具（GOAMD64、benchstat、taskset 绑核、perf 硬件计数器），再逐波优化并用 benchstat 对比每个 commit。</p>
  <p><strong>操作步骤：</strong>1) 设 <code>GOAMD64=v4</code>（需 AVX512）+ <code>GOEXPERIMENT=simd</code> → 2) 结构体预分配缓冲区消除 makeslice（+11%）→ 3) 泛型 <code>bitWidthT</code> 把位宽焊成编译期常量（+40%~64%）→ 4) 三文件构建标签实现 AVX2/512 运行时探测 → 5) 256 值垂直布局 SIMD 解码（约 3×）→ 6) GF2P8AFFINEQB 位置汇编计数优化扫描阶段（再 ×2）</p>
  <div class="highlight"><strong>落地命令：</strong><code>GOEXPERIMENT=simd GOAMD64=v4 go test -bench=. ./pfordec</code>；用 <code>golang.org/x/perf/cmd/benchstat</code> 对比优化前后；<code>perf stat</code> 查看 IPC 是否逼近 8 上限。</div>
  <div class="pitfall"><strong>避坑：</strong>PGO 可能负优化——Zen 5 上热循环 64 字节对齐后，宏融合 CMPQ+JGE 恰好落在 32 字节边界，Go 为修 Intel SKX102 勘误插入 NOP，拖慢指令派发瓶颈循环（-13%）。</div>
</div>

<div class="card">
  <h3>【决策/选型表】GOAMD64 与 SIMD 构建策略</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>2026 年一般服务器项目</td><td><code>GOAMD64=v3</code></td><td>覆盖 AVX2、POPCNT 等，bits 函数走硬件指令</td><td>默认 v1</td><td>查表实现慢一截</td></tr>
    <tr><td>DCS 类 AVX512 密集计算</td><td><code>GOAMD64=v4</code> + simd</td><td>Zen 4/5 开发机与服务器均支持 AVX512</td><td>仅 v3</td><td>无法用 512 位向量与 VBMI/GFNI</td></tr>
    <tr><td>需兼容旧 CPU 的发行版</td><td>运行时探测 + 标量回退</td><td><code>constant_amd64.go</code> 三文件模式</td><td>硬编码 hasAVX2=true</td><td>旧机器直接 SIGILL</td></tr>
    <tr><td>编码器扫描瓶颈</td><td>位置汇编计数 SIMD</td><td>每值从 12 条指令降至 1.5 条</td><td>标量双层循环 scan</td><td>瓶颈在直方图而非编码</td></tr>
    <tr><td>追求绝对极致 vs C</td><td>对等移植到 clang</td><td>Go 仍慢 1.4×，clang 可精确到 CPU 型号</td><td>关边界检查</td><td>作者明确拒绝牺牲内存安全</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Go SIMD 优化中的四个暗坑</h3>
  <p><strong>坑 1 — PGO 对齐副作用：</strong>编译器给热循环打 PCALIGNMAX(64,31) 后，特定指令排列触发 SKX102 勘误修复 NOP，性能反而下降 13%。</p>
  <p><strong>坑 2 — 盲目上 SIMD：</strong>未做标量优化就写向量代码，错过缓冲区复用和泛型特化带来的 76% 基线——大量红利在编译期常量折叠。</p>
  <p><strong>坑 3 — 忽略测量噪声：</strong>未用 taskset 绑核、未用 benchstat 多轮对比，会把 GC 和核心迁移噪声当成优化效果。</p>
  <p><strong>坑 4 — 对标 C 的五个差距：</strong>部分标量路径未 SIMD 化、边界检查、中栈内联 NOP 填充、无法针对 Zen 4 定制、局部代码生成细节（如循环自增多一条指令）。</p>
  <div class="relation"><strong>严重程度：</strong>坑 1 在开启 PGO 时必须验证；坑 2 是方法论错误；坑 4 说明「反超 cgo 历史版本」≠「追平 clang 极致优化」。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】AI 辅助性能优化：审阅而非 vibe coding</h3>
  <p><strong>原则：</strong>把 AI 当不知疲倦的 objdump 阅读器和模式发现器，人类负责理解、确认与把关。</p>
  <p><strong>为什么重要：</strong>Claude Fable 5 从编码瓶颈分析中识别出「位置汇编计数」正交变换，引用三篇论文选定 GF2P8AFFINEQB 路线——人类极难在反汇编海洋里关联 GF2P8AFFINEQB 与 Green Tea GC 的同一指令。</p>
  <p><strong>怎么落地：</strong>给 AI 可衡量目标（如「扫描阶段再快一倍」）；AI 给出建议后亲自审阅确认；不 vibe coding 整个项目；用 perf IPC 验证是否逼近硬件上限（最终 7 IPC / 8 理论上限）。</p>
  <p><strong>适用边界：</strong>适合有清晰 benchmark 和可回滚 commit 的性能工程；不适合无测试覆盖的「感觉更快了」式优化。</p>
  <div class="quote">原文：他没有 vibe coding 整个项目，而是在 AI 给出优化建议后亲自审阅、理解、确认。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：C/clang 性能极客 · 「实验性 API + 1.4× 差距，生产环境别赌」</p>
  <p class="rebuttal-text">simd/archsimd 尚未稳定，对标 clang 同技巧移植仍慢 1.4 倍；边界检查、中栈内联 NOP、无法精确到 Zen 4 的指令选择都是 Go 编译器硬伤——删 cgo 换来的是维护便利，不是算力天花板，关键路径仍该留 C。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Go 1.26/1.27 的 simd/archsimd 让 DCS 删光 7 年 cgo，纯 Go 重写 TurboPFor 并在多波优化后反超历史 cgo 版本。</li>
    <li>标量阶段（缓冲区复用 + 泛型位宽特化）即可达 C 性能 76% 以上，不必一上来就写向量代码。</li>
    <li>AVX2 256 值垂直布局带来约 3× 加速；AI 发现的 GF2P8AFFINEQB 位置汇编计数把扫描瓶颈再砍一半。</li>
    <li>最终 IPC 达 7/8 理论上限，但对等 clang 优化仍慢 1.4×——Go 赢在可维护性与内存安全，非绝对算力。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>在目标环境验证 <code>GOEXPERIMENT=simd</code> + <code>GOAMD64=v3/v4</code> 是否可用，用三文件构建标签实现标量回退。</li>
    <li>性能优化前先搭 benchstat + taskset + perf 测量基线，每个优化单独 commit 对比。</li>
    <li>优先消除热路径内存分配和编译期未知分支，再考虑 SIMD 向量化。</li>
    <li>编码类瓶颈先分析「扫描 vs 编码」开销占比，再决定是否投入位置汇编计数类高级技巧。</li>
    <li>若用 AI 辅助优化，设定可度量目标并人工审阅每条建议，避免无测试的 vibe coding。</li>
  </ol>
  <p><strong>关键认知转变：</strong>「Go 高性能 = 必须 cgo/汇编」被打破——simd/archsimd 让纯 Go 在整数压缩等场景达到接近硬件极限的 IPC，同时保留交叉编译与内存安全；但「反超自家 cgo」与「追平 clang 极致」仍是两个层次的目标。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
