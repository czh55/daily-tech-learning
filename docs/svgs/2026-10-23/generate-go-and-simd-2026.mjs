import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-and-simd-2026.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfdf5,#dbeafe);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#047857,#2563eb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-green{background:#d1fae5;color:#065f46}.tag-blue{background:#dbeafe;color:#1d4ed8}.tag-violet{background:#ede9fe;color:#6d28d9}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #10b981}
.card h3{font-size:22px;font-weight:700;color:#047857;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#ecfdf5;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#065f46;border-left:4px solid #34d399}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#d1fae5,#a7f3d0);border:2px solid #6ee7b7;border-radius:14px;padding:14px 20px;text-align:center;min-width:120px;font-weight:700;font-size:14px;color:#065f46}
.arrow-sym{font-size:20px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#047857,#2563eb);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#ecfdf5;padding:10px 14px;text-align:left;font-weight:700;color:#047857;border-bottom:2px solid #6ee7b7}
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
<h1>Go 1.26/1.27 实验性 SIMD：从向量寄存器到 9 倍点积</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">GOEXPERIMENT=simd</span>
  <span class="tag tag-blue">simd / archsimd</span>
  <span class="tag tag-violet">amd64</span>
</div>
<p class="subtitle">本文解决的核心问题是：普通 Go 循环为何吃不满 CPU 向量单元——以及如何用 Load/Operate/Store 生命周期、archsimd 与可移植 simd 包、FMA/掩码/尾部处理在 Go 里写出可维护的 SIMD 并拿到数量级加速。</p>

<div class="map">
  <h3 style="font-size:20px;color:#047857;margin-bottom:12px;text-align:center">SIMD 标准生命周期</h3>
  <div class="diagram">
    <div class="node">Load<br>切片→通道</div><span class="arrow-sym">→</span>
    <div class="node">Operate<br>垂直同操作</div><span class="arrow-sym">→</span>
    <div class="node">Store / 水平归约</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：SIMD 就是编译器自动向量化普通 for 循环。在 Go 里仍需显式实验包与构建标志，且通道间彼此隔离，不能在一个向量里混加法和乘法。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】通道（Lanes）与向量寄存器</h3>
  <p><strong>在讲什么问题：</strong>为何一条指令能处理多对 float32。</p>
  <p><strong>关键理解：</strong>256 位寄存器可切成 8×float32 通道；每通道只与对位通道运算（垂直操作），数据不跨通道泄漏。</p>
  <p><strong>怎么落地：</strong>构建加 <code>GOEXPERIMENT=simd</code>，Go 1.27.0+，本文聚焦 amd64。</p>
  <p><strong>边界说明：</strong>包仍实验，API 可能变；不适合所有业务逻辑，适合大批量同质数值计算。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】archsimd vs simd</h3>
  <table>
    <tr><th>维度</th><th>simd/archsimd</th><th>simd</th><th>结论</th></tr>
    <tr><td>类型</td><td>Float32x8 等固定宽度</td><td>Float32s 运行时 Len()</td><td>底层控硬件 vs 可移植</td></tr>
    <tr><td>编译</td><td>ARM 无 256 位则编不过</td><td>启动时按 CPU 选宽度</td><td>库用 simd，极致调优用 archsimd</td></tr>
    <tr><td>步长</td><td>硬编码 i+=8</td><td>i+=v.Len()</td><td>循环逻辑一致</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】核心操作与点积路径</h3>
  <p><strong>操作步骤：</strong>广播把标量填满通道 → FMA（MulAdd）合并乘加 → 比较生成掩码 → Blend 做向量级 if → 尾部用 Partial Load 处理不足一整向量长度。</p>
  <p><strong>选型条件：</strong>图像/音频/ML 风格逐元素同操作用 SIMD；少量分支密集逻辑仍用标量。</p>
  <p><strong>避坑：</strong>连续八次 GetElem 提取单通道会抹平向量化收益；优先向量 Store 或水平加总。</p>
  <div class="highlight">文中点积实战相对朴素循环约 9 倍加速——前提是热路径长度足够、对齐与尾部处理正确。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】实验特性与汇编时代</h3>
  <p><strong>坑名：</strong>未开 GOEXPERIMENT 或版本不足导致包不可用。</p>
  <p><strong>解法：</strong>CI 与本地统一 Go 1.27+ 与实验标志；升级前锁定依赖文档。</p>
  <p><strong>坑名：</strong>误以为 midway 多重编译可完全隐藏平台差异——archsimd 仍绑定指令集。</p>
  <p><strong>严重程度：</strong>可忽略（未启用则无影响）；致命（生产误开实验 API 后升级断裂）。</p>
</div>

<div class="card">
  <h3>【决策/选型表】何时手写汇编 vs 官方 SIMD 包</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>避开</th></tr>
    <tr><td>可维护向量循环</td><td>simd 可移植包</td><td>常规 Go 语法+编译器 intrinsics</td><td>复制粘贴汇编</td></tr>
    <tr><td>极限调优单函数</td><td>archsimd 固定宽度</td><td>与硬件示意图一一对应</td><td>在 ARM 上硬写 x8</td></tr>
    <tr><td>短数组/频繁分支</td><td>标量 Go</td><td>向量启动成本吃不掉</td><td>强行 SIMD</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】垂直同质、水平谨慎</h3>
  <p><strong>原则：</strong>一条 SIMD 指令 = 多份相同操作；生命周期始终是加载→运算→写回。</p>
  <p><strong>怎么落地：</strong>先写正确标量版，再按 8（或 Len）对齐主循环，最后单独处理 tail。</p>
  <p><strong>适用边界：</strong>编译器内建与 midway 是实现细节，业务代码应依赖包 API 而非假设具体指令。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「Go 就该保持简单，SIMD 让语言变复杂」</p>
  <p class="rebuttal-text">当图像、推理预处理已占满 CPU，拒绝一等向量抽象只会把复杂度推给更难测的汇编，而不是消灭复杂度。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>SIMD 用宽寄存器多通道并行执行同一运算。</li>
    <li>archsimd 固定宽度，simd 运行时适配 CPU。</li>
    <li>Load/Operate/Store 是几乎所有向量代码的骨架。</li>
    <li>FMA、掩码、混合、尾部处理是实战四件套。</li>
    <li>实验包 + GOEXPERIMENT 是当前使用前提。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>安装 Go 1.27 并以 GOEXPERIMENT=simd 编译试跑 archsimd 加法示例。</li>
    <li>把热路径循环改为 v.Len() 步长的 simd 可移植版。</li>
    <li>对点积或逐元素乘加做 benchmark 对比标量。</li>
    <li>检查 tail 是否用 partial load 而非多次 GetElem。</li>
    <li>关注官方 issue，实验 API 变更前勿锁死公共库接口。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「Go 做不了 SIMD 只能汇编」转为「用官方实验包把向量生命周期写进普通 Go，由编译器生成 intrinsics」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Wrote', OUT, 'height', height);
