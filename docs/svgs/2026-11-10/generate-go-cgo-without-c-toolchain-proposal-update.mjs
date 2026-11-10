import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-cgo-without-c-toolchain-proposal-update.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfeff,#cffafe);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#0e7490,#0891b2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-cyan{background:#cffafe;color:#0e7490}.tag-sky{background:#e0f2fe;color:#0369a1}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #0891b2}
.card h3{font-size:22px;font-weight:700;color:#0e7490;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#cffafe,#a5f3fc);border:2px solid #67e8f9;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#0e7490}
.node-em{background:linear-gradient(135deg,#e0f2fe,#bae6fd);border-color:#38bdf8;color:#0369a1}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#0e7490,#0891b2);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#cffafe;padding:10px 12px;text-align:left;font-weight:700;color:#0e7490;border-bottom:2px solid #67e8f9}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>cgo 去 C 工具链：Cherry Mui 提案评审设计落地</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-cyan">Go / cgo</span>
  <span class="tag tag-sky">#81450</span>
  <span class="tag tag-slate">Proposal Review</span>
</div>
<p class="subtitle">本文解决的核心问题是：在只调用预编译 C 动态库时，如何把 C 编译器从终端用户构建依赖里拿掉——通过 Binding 文件描述 ABI、cmd/go 自动选新模式，以及 runtime/cgo 的 Go 化与 CGO_ENABLED=auto 交叉编译策略。</p>

<div class="map">
  <h3 style="font-size:20px;color:#0e7490;margin-bottom:12px;text-align:center">两阶段职责拆分</h3>
  <div class="diagram">
    <div class="node">开发期</div><span class="arrow-sym">→</span>
    <div class="node node-em">C 工具链 gen-binding</div><span class="arrow-sym">→</span>
    <div class="node">Binding 入库</div><span class="arrow-sym">→</span>
    <div class="node node-em">构建期纯 Go 胶水</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">GCC/Clang 退化为库维护者工具，非最终用户必备</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：新模式等于 Go 自动把 x86 的 .so 变成 ARM64。实际上目标架构的预编译 C 库仍需自备；新机制解决的是胶水生成与链接元数据，不是替 C 库做跨架构编译。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】cmd/go 自动模式选择</h3>
  <p><strong>在讲什么问题：</strong>何时走「cgo without C toolchain」而非传统 cgo？</p>
  <p><strong>关键理解：</strong>包级判断——无 .c/.S；有 import "C" 且 //cgo:binding 或 //export；且未设 CGO_CFLAGS → 新路径。</p>
  <p><strong>和其他概念关系：</strong>含真 C 源码的包仍要旧 cgo；依赖链里任一传统包仍可能拉起 CC。</p>
  <p><strong>怎么落地用：</strong>预编译库集成项目去掉包内 C 源，改 Binding + 动态库路径。</p>
  <p><strong>边界说明：</strong>渐进共存，非一次性废弃传统 cgo。</p>
  <p><strong>原文依据：</strong>Cherry Mui 2026-11-04 Proposal Review 精简设计。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】四类 Binding 指令</h3>
  <p><strong>核心思路：</strong>用 //cgo:binding 映射类型/常量/变量/函数；//cgo:dynamic_library 把 .so 变一等对象；//cgo:variadic 与 //cgo:funcptr 覆盖 printf 式与回调。</p>
  <p><strong>操作步骤：</strong>① go tool cgo -gen-binding（可仍用 CC）→ ② 提交 Binding → ③ 构建侧 -dynlibdir 搜库 → ④ 函数绑定可写 ["libfoo.so"]。</p>
  <p><strong>选型条件：</strong>仅调预编译 .so/.dylib 用新路径；需编译 C 源码或 .S 用传统 cgo。</p>
  <p><strong>避坑：</strong>Binding 与升级后 C API 不同步会 silent 错；倾向显式库名，省略用 _ 仅限特殊场景。</p>
  <p><strong>对比相邻方法：</strong>手写 dlopen/dlsym 灵活但易漏 DT_NEEDED；Binding 意在类型安全与链接信息一致。</p>
  <p><strong>原文引用：</strong>struct 未来可能要求嵌入 structs.HostLayout 以对齐 C 布局。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】runtime/cgo 与 Library API</h3>
  <p><strong>核心思路：</strong>runtime/cgo 改 Go+汇编，去掉自身 C 源；提供 Library.Open/Close/IsLoaded 统一动态库生命周期。</p>
  <p><strong>操作步骤：</strong>//cgo:dynamic_library 变量嵌入 Library 类型 → 业务 API 包在 Loaded 库上封装。</p>
  <p><strong>选型条件：</strong>与 //cgo:binding 联用；接口仍为原型，签名可能变。</p>
  <p><strong>避坑：</strong>C TSAN 插桩路径可能需回退旧 cgo 或新 build tag。</p>
  <p><strong>原文依据：</strong>「不只让胶水去 C 化，还要让 cgo 运行时自身去 C。」</p>
</div>

<div class="card">
  <h3>【决策/选型表】CGO_ENABLED 与交叉编译</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>避免</th><th>后果</th></tr>
    <tr><td>交叉编译 Binding 项目</td><td>CGO_ENABLED=auto（未来默认）</td><td>不需 ARM64 交叉 CC</td><td>假设自动变库架构</td><td>运行期缺 .so</td></tr>
    <tr><td>含 C 源码包</td><td>传统 cgo + CC</td><td>必须编译 C</td><td>强行 binding-only</td><td>构建失败</td></tr>
    <tr><td>本地有 CC 的 CI</td><td>go test 校验 Binding</td><td>防 API 漂移</td><td>只手写不校验</td><td>布局/签名错位</td></tr>
    <tr><td>函数/全局绑定</td><td>显式 ["libfoo.so"]</td><td>保证动态依赖元数据</td><td>省略库名</td><td>编译过、链接缺 NEEDED</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】尚未拍板的风险点</h3>
  <p><strong>坑名：</strong>Binding 与真实 C API 不一致。<strong>原因：</strong>可手写可入库。<strong>解法：</strong>有 CC 时 test 重生成 diff。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>漏写动态库名。<strong>原因：</strong>链接元数据静默缺失。<strong>解法：</strong>强制库名或 _ 标记。<strong>严重程度：</strong>致命（运行期）。</p>
  <p><strong>坑名：</strong>以为已进正式 Go 版本。<strong>原因：</strong>仍 Proposal Review。<strong>解法：</strong>跟踪 #81450。<strong>严重程度：</strong>小心。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】重划 Go 与 C ABI 边界</h3>
  <p><strong>原则：</strong>C 工具链从「每个调用者的构建依赖」降级为「库作者可选的开发工具」。</p>
  <p><strong>为什么重要：</strong>GPU/AI 原生库、Rust/C++ 预编译产物接入 Go 时，交叉 CC 与 sysroot 常为最大摩擦。</p>
  <p><strong>怎么落地：</strong>跟踪 Matloob CL；新项目按 Binding 形态设计 FFI 层。</p>
  <p><strong>适用边界：</strong>仍要编译 C 或复杂 TSAN 场景走旧路；cgo 不消失，只是路径分叉。</p>
  <p><strong>原文支撑：</strong>「cgo 不会消失，但它可能不再意味着你必须安装 C 编译器。」</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：纯 Go 原教旨 / 维护 Binding 成本的怀疑者</p>
  <p class="rebuttal-text">再多指令和 Library 类型只是给 cgo 打补丁——syscall 加手工 unsafe 或换 Wasm/Pure Go 重写才是正道，Binding 漂移与 TSAN 黑洞会让团队维护成本高于装一个 CC。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>#81450 进入 Proposal Review，Cherry Mui 明确 cmd/go、cmd/cgo、runtime/cgo 三处改动。</li>
    <li>无 C 源 + Binding/export 且未设 CGO_CFLAGS → 无 CC 构建路径，与传统 cgo 包级共存。</li>
    <li>//cgo:binding、dynamic_library、variadic、funcptr 扩展完整 C API 描述能力。</li>
    <li>runtime/cgo Go 化 + Library API；CGO_ENABLED=auto 有望简化交叉编译（库本体仍须目标架构）。</li>
    <li>TSAN、Binding 校验、显式动态库名为落地前待决工程点。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>订阅 golang/go#81450 与 Matloob 相关 CL。</li>
    <li>盘点依赖预编译 .so 的模块，评估去掉包内 C 胶水源的可行性。</li>
    <li>在 CI 设计「有 CC 时 Binding 一致性」检查草稿。</li>
    <li>交叉编译脚本预留 CGO_ENABLED=auto，勿假设必须 ARM64-gcc。</li>
    <li>阅读 Tony Bai 2026-09-14 一文对照提案演进。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>cgo 议题从「能不能不要 C 编译器」升级为「Go 工具链如何系统描述并调用 C ABI」——Binding 是新的边界契约，而不只是一次构建优化。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
