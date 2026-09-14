import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-cgo-without-c-toolchain.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:12px 16px;text-align:center;min-width:88px;font-weight:700;font-size:12px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:16px;color:#94a3b8}
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
<h1>Go 核心团队放大招：cgo 不用 C 编译器也能跑</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">#81450</span>
  <span class="tag tag-green">Binding 文件</span>
  <span class="tag tag-orange">C ABI</span>
  <span class="tag tag-purple">交叉编译</span>
  <span class="tag tag-red">CUDA / TensorRT</span>
</div>
<p class="subtitle">本文解决的核心问题是：在只调用预编译 C 库（.so/.a）时，Go 能否像纯 Go 一样摆脱 gcc/clang——提案 #81450 如何把 cgo 拆成「开发期生成 binding」与「构建期 Go+汇编 trampoline」，以及哪些场景仍然离不开 C 编译器。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">cgo 双路径演进</h3>
  <div class="diagram">
    <div class="node">传统 cgo<br>解析 C + 编胶水</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">痛点<br>无 C 工具链无法 build</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Binding cgo<br>check-in 元数据</div>
    <span class="arrow-sym">→</span>
    <div class="node">Go 理解 C ABI<br>直链预编译库</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">Go 1.20 纯 Go 去 C → Go 1.21 工具链构建去 C → #81450 特定 cgo 包去 C</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「cgo 不用 C 编译器 = Go 彻底告别 C」。提案明确区分：只是调用已编译库时不再需要 gcc；只要 import "C" 里还有真实 C 源码要编译，C 编译器仍是刚需。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Binding 文件与两阶段 cgo</h3>
  <p><strong>在讲什么问题：</strong>当前 cgo 即使只调 libm.so，也会生成 C 胶水并用 gcc 编译，交叉编译与 CI 常被 C 工具链绑架。</p>
  <p><strong>核心机制：</strong>包作者用 <code>cgo -gen-binding</code>（可选借助 C 编译器 + DWARF）生成可 check-in 的 Go 语法 binding；终端用户 <code>go build</code> 时 cgo 只读 binding，按目标平台 C ABI 生成 Go+汇编 trampoline，链接既有 .so/.a。</p>
  <p><strong>关键理解：</strong>把「理解 C 声明」从每次构建挪到开发期一次；C 编译从运行时依赖降级为可选开发依赖。</p>
  <p><strong>典型场景：</strong>调用 CUDA、TensorRT、OpenSSL、厂商 SDK 等预编译原生库，尤其需要 linux/arm64、darwin/arm64 多平台 binding 分文件 + <code>//go:build</code> 约束。</p>
  <p><strong>边界说明：</strong>不能把 x86 的 .so 自动变 ARM；只消除「交叉 C 编译器生成胶水」，不消除「目标架构库必须存在」。</p>
  <div class="quote">原文：它不是让 Go「不用 C 了」，而是让 Go 在「只调用已经编译好的 C」时，不再需要再次编译 C。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】传统 cgo vs Binding-based cgo</h3>
  <table>
    <tr><th>维度</th><th>传统 cgo</th><th>Binding-based cgo</th><th>一句话</th></tr>
    <tr><td>构建依赖</td><td>gcc/clang + 头文件</td><td>仅 Go 工具链</td><td>终端用户零 C 环境</td></tr>
    <tr><td>C 声明来源</td><td>每次解析 preamble</td><td>checked-in binding.go</td><td>声明变版本化元数据</td></tr>
    <tr><td>胶水代码</td><td>C 目标文件</td><td>Go + 汇编 trampoline</td><td>编译器栈统一</td></tr>
    <tr><td>含 C 源码包</td><td>支持</td><td>不支持</td><td>两条路径并存</td></tr>
    <tr><td>跨平台</td><td>交叉 C 工具链地狱</td><td>按平台 binding 目录</td><td>预处理前移到作者侧</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】ABI 与 binding 维护</h3>
  <p><strong>坑 1 — 误以为消灭所有 cgo：</strong>静态 C 函数写在 preamble 里仍要 C 编译器。严重程度：致命（架构误判）。</p>
  <p><strong>坑 2 — 复杂 C 类型：</strong>位域、联合体、#pragma pack、回调到 Go 的函数指针，工程量大，易踩内存布局错位。严重程度：小心。</p>
  <p><strong>坑 3 — binding 与上游 API 漂移：</strong>结构体字段变更可能编译期不报错，运行时段错误。解法：有 C 工具链时 go test 重生成 binding 与 check-in 版本 diff。</p>
  <p><strong>坑 4 — runtime/cgo 仍含 C：</strong>若未「去 C 化」，闭环失败；且 CGO_CFLAGS 对纯 Go 化 runtime/cgo 失效，sanitizer 场景待方案。</p>
  <div class="pitfall"><strong>落地：</strong>优先从「标量 + 指针 + 简单 struct」API 试点；多平台维护成本按库评估，别假设社区会自动生成全平台 binding。</div>
</div>

<div class="card">
  <h3>【决策/选型表】Go 调原生库的三条路</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>纯 Go 可实现</td><td>纯 Go</td><td>无 FFI 复杂度</td><td>cgo</td><td>调度与构建成本</td></tr>
    <tr><td>仅调预编译 .so/.a</td><td>未来 binding cgo</td><td>无 host C 工具链、交叉编译友好</td><td>传统 cgo</td><td>强迫装 gcc</td></tr>
    <tr><td>需嵌入/编译 C 源码</td><td>传统 cgo</td><td>唯一官方路径</td><td>binding-only</td><td>无 C 源码编译能力</td></tr>
    <tr><td>AI/GPU 运行时</td><td>binding + 分平台 lib</td><td>libcuda 等已预编译</td><td>在 CI 编 CUDA 胶水 C</td><td>工具链与镜像膨胀</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】包作者落地 binding 工作流</h3>
  <p><strong>标签：</strong>库维护者 · 多平台 · FFI</p>
  <p><strong>步骤：</strong>1) 保留 foo.h + 各平台预编译 lib → 2) 开发机执行 <code>go tool cgo -gen-binding</code> 生成 binding_linux_amd64.go 等 → 3) 用 <code>//go:build</code> 分平台 → 4) check-in binding 与库二进制 → 5) CI 加 binding 一致性校验 → 6) 文档声明支持的 ABI 版本。</p>
  <div class="highlight"><strong>注解：</strong><code>//cgo:binding C.compute</code> 把 Go 符号绑到 C 符号，工具链不再解析嵌套 #include 与宏。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】C ABI 成为 Go 工具链一等公民</h3>
  <p><strong>原则：</strong>把「外包给 gcc 理解 ABI」改为「Go 自己算 calling convention、对齐与 trampoline」——这是架构升级，不是少装一个包管理器里的 gcc。</p>
  <p><strong>怎么落地：</strong>关注 #81450 讨论（注解式 vs 独立命名空间）；新库集成优先评估是否「仅预编译库」可走 binding 路径。</p>
  <p><strong>适用边界：</strong>提案仍在早期，无里程碑；复杂 C 特性不必为 binding 路径重写一遍 C 前端。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：系统编程保守派 · 「binding 生态会烂尾」</p>
  <p class="rebuttal-text">多平台 binding 维护成本会压垮中小团队，ABI 静默错位比现在「编译失败」更阴险，不如继续要求官方 C 工具链保证声明与布局一致。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>#81450 目标清晰：预编译库场景下 cgo 无需 C 编译器，与 Go 1.20/1.21 去 C 路线一致。</li>
    <li>核心是 binding 文件 + Go/汇编 trampoline + runtime/cgo 去 C 化，让 C ABI 进入 Go 工具链能力面。</li>
    <li>含 C 源码的 cgo 不变；AI/GPU/SDK 集成是最大受益者，风险在 binding 生态与版本漂移。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>盘点项目 cgo：区分「只链 .so」与「编 C 源码」两类，后者别等 binding 方案。</li>
    <li>交叉编译流水线记录当前 C 工具链痛点，便于未来切换 binding 包结构。</li>
    <li>关注 golang/go#81450，参与 binding 校验与 API 设计反馈。</li>
  </ol>
  <p><strong>关键认知转变：</strong>未来 Go 原生集成是三轨并行——纯 Go、binding cgo、传统 cgo；选轨依据是「有没有 C 源码要编译」，而非「能不能忍受 gcc」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
