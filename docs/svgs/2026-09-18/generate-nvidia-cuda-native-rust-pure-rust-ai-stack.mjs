import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'nvidia-cuda-native-rust-pure-rust-ai-stack.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#fff7ed,#ffedd5);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#c2410c,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#c2410c;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fdba74;border-radius:16px;padding:12px 16px;text-align:center;min-width:88px;font-weight:700;font-size:12px;color:#9a3412}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#fff7ed;padding:12px 16px;text-align:left;font-weight:700;color:#c2410c;border-bottom:2px solid #fdba74}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#c2410c}`;

const body = `
<h1>CUDA 原生 Rust：双轨内核与「纯 Rust AI 栈」的地址空间之墙</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">cuda-oxide</span>
  <span class="tag tag-blue">cutile-rs</span>
  <span class="tag tag-green">编译期 GPU 安全</span>
  <span class="tag tag-purple">地址空间</span>
</div>
<p class="subtitle">本文解决的核心问题是：英伟达开源 cuda-oxide（SIMT）与 cutile-rs（Tile）两条路线如何把 GPU 内核的内存别名与数据竞争前移到编译期消灭，以及为何 r/rust 热议的「纯 Rust AI 技术栈」仍被地址空间、厂商锁定与算子生态挡在门外。</p>

<div class="map">
  <h3 style="font-size:20px;color:#c2410c;margin-bottom:12px;text-align:center">从「绑定写 kernel」到「类型系统管住 GPU」的递进关系</h3>
  <div class="diagram">
    <div class="node">旧模式<br>Host Rust + C/C++ PTX</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">cuda-oxide<br>SIMT + DisjointSlice</div>
    <span class="arrow-sym">∥</span>
    <div class="node-blue">cutile-rs<br>Tile + partition</div>
    <span class="arrow-sym">→</span>
    <div class="node">别名/竞争<br>编译期拒绝</div>
    <span class="arrow-sym">≠</span>
    <div class="node-orange" style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b">地址空间<br>语言层未解</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：英伟达「官方 CUDA Rust」等于纯 Rust AI 栈已就绪。原文与 Reddit 讨论均强调——Burn/CubeCL 等中立路线早已存在；本次更多是官方认证与 kernel 层安全，而非训练框架、算子库与跨厂商可移植性一并到位。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】原生 kernel vs 传统 bindings</h3>
  <p><strong>在讲什么问题：</strong>过去 Rust 碰 CUDA 只能 host 端写 Rust、kernel 仍用 C/C++ 编译 PTX；现在 kernel 本体也能用 Rust 直编 PTX。</p>
  <p><strong>核心机制：</strong>两条并行模型——SIMT（线程级，cuda-oxide）与 Tile（数据块级，cutile-rs），共同目标是把借用检查延伸到 device 代码。</p>
  <p><strong>关键理解：</strong>官方建议优先 Tile（架构细节交给编译器），需精细控制线程/共享内存再下沉 SIMT。</p>
  <p><strong>典型场景：</strong>推理侧自定义算子、希望消灭「测试全绿、生产炸」的 GPU 别名 bug。</p>
  <p><strong>边界说明：</strong>两项目均早期阶段，紧贴 CUDA；不解决跨厂商地址空间抽象。</p>
  <div class="quote">原文：kernel 本身也能用 Rust 写，直接编译成 PTX——和以往「绑定」路线本质不同。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】cuda-oxide vs cutile-rs</h3>
  <table>
    <tr><th>维度</th><th>cuda-oxide（SIMT）</th><th>cutile-rs（Tile）</th><th>一句话</th></tr>
    <tr><td>编程粒度</td><td>写一个线程做什么</td><td>写一个 tile 做什么</td><td>灵活 vs 受限</td></tr>
    <tr><td>工具链</td><td>锁定 nightly + 自带 LLVM</td><td>stable 1.89+，无自定义 LLVM</td><td>Tile 门槛更低</td></tr>
    <tr><td>CUDA 版本</td><td>12.x+、clang/libclang</td><td>13.3</td><td>依赖不同</td></tr>
    <tr><td>安全机制</td><td>DisjointSlice + launch_contract</td><td>所有权 + partition 跨 launch</td><td>逐次校验 vs 构造保证</td></tr>
    <tr><td>共享内存</td><td>支持，多需 unsafe</td><td>编译器接管</td><td>SIMT 更可控</td></tr>
    <tr><td>成熟度</td><td>早期 alpha</td><td>crates.io，Grout/mistral.rs 已用</td><td>Tile 更靠前</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】两条路线的上手路径</h3>
  <p><strong>cuda-oxide（SIMT）：</strong>1) Linux + CC 8.0+ GPU + CUDA 12.x + clang → 2) 安装锁定 nightly，<code>cargo oxide doctor</code> 体检 → 3) <code>#[kernel]</code> 函数经 Pliron IR 降到 PTX，host/device 同文件一条命令编译 → 4) 用 <code>DisjointSlice</code> 拆可变借用，<code>#[launch_contract]</code> 校验 block/grid 再走安全 launch。</p>
  <p><strong>cutile-rs（Tile）：</strong>1) CC 8.0+、CUDA 13.3、stable Rust → 2) <code>cargo add cutile</code> → 3) host 端 <code>.partition([128])</code> 定 grid 并转移所有权 → 4) <code>#[cutile::module]</code> 首次调用 JIT Tile IR → 5) 全程惰性直到 <code>.sync_on(&stream)</code> 唯一同步点。</p>
  <div class="highlight"><strong>落地：</strong>输出缓冲区当输入传回 SIMT kernel 会直接编译失败——别名从运行期幽灵 bug 变成写代码即报错。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】社区泼冷水三层</h3>
  <p><strong>坑 1 — 以为英伟达从零发明：</strong>Burn+CubeCL 已在多后端推理，路线不同不等于更先进。严重程度：可忽略（认知）。</p>
  <p><strong>坑 2 — 死等「纯 Rust」才上线：</strong>llama.cpp/mistral.rs 证明推理 C++、系统层 Rust 可并存。严重程度：小心（拖延交付）。</p>
  <p><strong>坑 3 — 忽视地址空间：</strong>global/shared/constant 互不重叠，Rust 主线无一等公民；两项目绕开而非解开。严重程度：致命（跨厂商 AI 栈）。</p>
  <p><strong>坑 4 — SIMT 共享内存：</strong>cuda-oxide 仍大量 unsafe；别假设「全安全 GPU Rust」。严重程度：小心。</p>
</div>

<div class="card">
  <h3>【决策/选型表】GPU Rust 路线怎么选</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>快速试 Tile、stable 工具链</td><td>cutile-rs</td><td>partition 构造安全、已上架 crates.io</td><td>强依赖 nightly 的 SIMT</td><td>运维成本高</td></tr>
    <tr><td>精细线程/共享内存调优</td><td>cuda-oxide</td><td>SIMT 灵活度高</td><td>纯 Tile</td><td>表达能力受限</td></tr>
    <tr><td>厂商中立训练/多后端</td><td>继续评估 Burn/CubeCL</td><td>非 CUDA 锁定</td><td>仅押官方双轨</td><td>仍绑英伟达语义</td></tr>
    <tr><td>去 CUDA 化训练</td><td>务实接受 CUDA 或 Vulkan 消费级</td><td>训练侧几乎无 OpenCL 正式后端</td><td>指望 Vulkan 扛 H100 级 FLOPs</td><td>距 cuBLAS/CUTLASS 差距大</td></tr>
    <tr><td>生产就绪今天上线</td><td>成熟推理栈 + 局部 Rust GPU 试验</td><td>两项目均非生产就绪声明</td><td>全栈替换 PyTorch</td><td>算子覆盖与性能鸿沟</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】「CUDA 支持 Rust」≠「纯 Rust AI 栈」</h3>
  <p><strong>原则：</strong>编译期抓住别名与竞争是里程碑；语言级地址空间与厂商性能语义才是 AI 栈最后一堵墙。</p>
  <p><strong>为什么重要：</strong>指针同值在不同地址空间可能完全不是同一块内存——用 64 位高位打标签也挡不住 SM 边界与 kernel 参数空间差异。</p>
  <p><strong>怎么落地：</strong>系统团队关注官方路线图（Rust/C++/Python 前端互操作）；业务团队按场景混用 Rust host + 成熟推理引擎，而非等待乌托邦栈。</p>
  <p><strong>适用边界：</strong>英伟达巩固 Rust GPU「官方地位」对基础设施是信号；中立栈与锁定栈将长期并存。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：CUDA 生态「够用就行」派 · 资深推理工程师</p>
  <p class="rebuttal-text">编译期拦住别名救不了 H100 上算子性能与 CUTLASS 十年的积累，为 Rust 叙事重写 kernel 只会拖慢交付，推理层继续 C++/CUDA 才是理性默认。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>cuda-oxide 与 cutile-rs 首次让 Rust kernel 直编 PTX，Tile 优先、SIMT 备精细控制。</li>
    <li>DisjointSlice、launch_contract、partition 把 GPU 别名/竞争前移到编译失败，叙事下沉到 device 层。</li>
    <li>社区三层讨论：中立栈已有、CUDA 锁定难避、地址空间是语言硬骨头。</li>
    <li>cutile-rs 更成熟（Grout/mistral.rs）；cuda-oxide 仍 alpha，共享内存多 unsafe。</li>
    <li>对国内 AI 基础设施团队：Rust 写系统层更现实，但「纯栈」与「官方 CUDA Rust」仍是两件事。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>用 <code>cargo oxide doctor</code> 或 cutile 最小 partition 示例验证本机 CUDA/Rust 版本矩阵。</li>
    <li>对照现有推理路径：哪些算子值得用 Tile 试编译期安全，哪些继续 ONNX/Torch。</li>
    <li>阅读 Fearless Concurrency on the GPU 论文与 NV 博客，理解 launch_contract 与 partition 语义差异。</li>
    <li>跟踪 Burn/CubeCL 与 NV 双轨路线图，避免押单一路线锁死招聘与部署。</li>
  </ol>
  <p><strong>关键认知转变：</strong>GPU 内存安全进编译器是进步；「纯 Rust AI 栈」的瓶颈从 bindings 转向了地址空间与跨厂商性能语义——英伟达下场解决的是前者的一块，不是全部。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log(`Wrote ${OUT} (${height}px)`);
