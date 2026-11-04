import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-zero-heap-allocation-noalloc.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#eff6ff,#f0fdf4);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#1d4ed8,#15803d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#dcfce7;color:#166534}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #2563eb}
.card h3{font-size:22px;font-weight:700;color:#1d4ed8;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#dbeafe,#93c5fd);border:2px solid #60a5fa;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#1e40af}
.node-gr{background:linear-gradient(135deg,#dcfce7,#86efac);border-color:#4ade80;color:#166534}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1d4ed8,#15803d);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#dbeafe;padding:10px 12px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #93c5fd}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Go noalloc：零堆分配作为工程约束</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">noalloc</span>
  <span class="tag tag-green">bounded / Region</span>
  <span class="tag tag-slate">逃逸分析</span>
</div>
<p class="subtitle">本文解决的核心问题是：Go 热路径上如何把「口头约定不要堆分配」变成 CI 可执行的规则——noalloc 通过解析逃逸分析与调用链检查函数及其 callee 是否引入堆分配，并配合 bounded 固定容量容器与 Region 内存预算，在实验阶段为网络/序列化等场景提供可验证的零堆分配约束（不消除 GC、非实时保证）。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1d4ed8;margin-bottom:12px;text-align:center">Go 内存优化层次</h3>
  <div class="diagram">
    <div class="node">逃逸分析</div><span class="arrow-sym">→</span>
    <div class="node">sync.Pool</div><span class="arrow-sym">→</span>
    <div class="node">Arena(搁置)</div><span class="arrow-sym">→</span>
    <div class="node">Memory Regions(讨论中)</div><span class="arrow-sym">→</span>
    <div class="node node-gr">noalloc 工程约束</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：零堆分配 = 零 GC / 更高性能 / 实时性保证。<strong>实际</strong>仍可能有栈分配、锁、CPU 开销；作者基准中 noalloc JSON 零分配但慢于 sonic/goccy——价值在可验证约束而非全面最快。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】noalloc 检查什么</h3>
  <p><strong>在讲什么问题：</strong>代码演进后如何防止热路径悄悄引入堆分配？</p>
  <p><strong>关键理解：</strong>对标记 //go:noalloc 的函数，工具解析 go build -gcflags=-m 逃逸输出并沿调用链传播；动态调用、不可追踪 callee 保守视为可能分配。</p>
  <p><strong>和其他概念关系：</strong>逃逸分析是编译器单次函数视角；noalloc 是跨函数链路的 CI 规则；sync.Pool 降压力但不保证零分配。</p>
  <p><strong>怎么落地用：</strong>在协议解析/encode 热路径函数加约束 → CI 跑 noalloc check → 配合 heap/cpu profile 确认 GC 是否真瓶颈再投入。</p>
  <p><strong>边界说明：</strong>非形式化证明；依赖 Go 版本与 -m 输出稳定性；allowlist 需人负责正确性。</p>
  <p><strong>原文依据：</strong>「这个函数必须零堆分配，任何修改都必须通过自动检查。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】bounded + Region 内存预算</h3>
  <p><strong>核心思路：</strong>bounded 提供固定容量 slice/map 等，溢出需显式策略；Region 在作用域内借还 chunk，释放后禁止再用（非 goroutine-safe）。</p>
  <p><strong>操作步骤：</strong>① profile 确认 GC/分配热点 → ② 热路径声明 noalloc → ③ 用 bounded 容器替代会扩容的结构 → ④ 请求级 Region 预借 chunk → ⑤ CI 固定 Go 版本跑检查。</p>
  <p><strong>选型条件：</strong>低延迟服务、序列化、资源受限环境；非热路径不必上。</p>
  <p><strong>避坑：</strong>每元素借还 Pool chunk 可能比分配更慢；Region 跨 goroutine 共享会数据竞争。</p>
  <p><strong>对比相邻方法：</strong>相对 Arena 显式 API，Region 设想是作用域隐式归属；相对 Rust ownership，noalloc 仍是 GC 语言上的约束层。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】常见 Go 减分配手段</h3>
  <table>
    <tr><th>对比维度</th><th>逃逸分析</th><th>sync.Pool</th><th>noalloc</th><th>一句话结论</th></tr>
    <tr><td>保证强度</td><td>编译器尽力</td><td>无严格保证</td><td>调用链零堆分配规则</td><td>只有 noalloc 适合写进 CI 门禁</td></tr>
    <tr><td>维护成本</td><td>低</td><td>中</td><td>高（容量/Region 纪律）</td><td>约束越硬代码越显式</td></tr>
    <tr><td>生态成熟度</td><td>生产</td><td>生产</td><td>实验（AI 生成代码）</td><td>观望为主，挑单点试点</td></tr>
    <tr><td>与 GC 关系</td><td>减少堆对象</td><td>减少分配速率</td><td>减少堆对象</td><td>都不等于关掉 GC</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】何时用 noalloc 思路</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>已 profile 证明 GC 是瓶颈的热路径</td><td>noalloc + bounded</td><td>可执行约束</td><td>全局零分配</td><td>复杂度爆炸、收益递减</td></tr>
    <tr><td>普通 CRUD 服务</td><td>默认 Go + 偶发 Pool</td><td>GC 足够成熟</td><td>强行 noalloc</td><td>可读性与性能双输</td></tr>
    <tr><td>JSON 极致吞吐</td><td>sonic/goccy 等</td><td>作者基准更快</td><td>以为零分配即最快</td><td>CPU/算法仍主导</td></tr>
    <tr><td>长期维护库</td><td>固定工具链 + CI 检查</td><td>-m 输出随版本变</td><td>升级 Go 不回归测试</td><td>检查静默失效</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】noalloc 工程陷阱</h3>
  <p><strong>坑名：</strong>把静态分析当数学证明。<strong>原因：</strong>动态调用、错误 allowlist。<strong>解法：</strong>当严格 lint，关键路径仍要 benchmark + profile。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>固定容量无溢出策略。<strong>原因：</strong>bounded 不会自动扩容。<strong>解法：</strong>定义 drop/错误/分片策略并测试。<strong>严重程度：</strong>致命——线上 silent 丢数据。</p>
  <p><strong>坑名：</strong>Release Region 后仍持有引用。<strong>原因：</strong>借出内存失效。<strong>解法：</strong>作用域纪律 + 代码审查。<strong>严重程度：</strong>致命。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】性能约定可执行化</h3>
  <p><strong>原则：</strong>先 profile 证明 GC/分配是瓶颈，再把「热路径零堆分配」写进 CI，而不是全员禁止 new。</p>
  <p><strong>为什么重要：</strong>Go 生产力来自 GC；只在关键 1% 路径施加硬约束，才符合 Uber/VictoriaLogs 类实践精神。</p>
  <p><strong>怎么落地：</strong>go test + pprof 基线 → 标记 2–3 个函数 noalloc → 升级 Go 时重跑检查。</p>
  <p><strong>适用边界：</strong>项目仍实验阶段，生产大面积依赖需自担风险。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「GC 足够好」派 / 业务交付优先</p>
  <p class="rebuttal-text">在多数 Web 与微服务里，瓶颈是 IO 和数据库而不是堆分配——给热路径套上 noalloc 与 bounded 溢出分支，会把团队拖进固定容量与 Region 纪律的维护泥潭，profile 里根本看不到回报。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>堆分配关注分配速率、存活规模与指针密度；先 profile 再优化。</li>
    <li>逃逸分析、Pool、Arena、Memory Regions 与 noalloc 分层互补，非互斥。</li>
    <li>noalloc 核心价值：跨调用链零堆分配 CI 约束 + bounded/Region 配套。</li>
    <li>零分配 ≠ 最快 ≠ 无 GC；实验项目，工具链版本敏感。</li>
    <li>Go 不必变 Rust，但关键路径需要可执行的「不要产生垃圾」规则。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>对疑似热点跑 cpu/heap profile，确认 GC 占比后再考虑 noalloc。</li>
    <li>读 github.com/theconsensuslabs/noalloc 与一个可运行示例，在分支上试跑 check。</li>
    <li>固定 CI 的 Go 版本，升级时重跑逃逸输出对比。</li>
    <li>若用 bounded/Region，写清单：溢出策略、goroutine 边界、释放后禁引用。</li>
    <li>跟踪 Go Memory Regions 讨论(#70257)，评估未来标准库是否吸收 Region 思路。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>Go 性能工程从「凭经验少 new」走向「热路径堆分配像 lint 一样失败即阻断合并」——noalloc 是把口头纪律工具化的尝试。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
