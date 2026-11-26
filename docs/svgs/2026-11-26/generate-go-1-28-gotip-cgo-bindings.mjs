import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-1-28-gotip-cgo-bindings.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#0c1222,#162032);padding:48px 60px;color:#e2e8f0}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#38bdf8,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-go{background:#0c4a6e;color:#7dd3fc}.tag-cgo{background:#312e81;color:#c7d2fe}.tag-bind{background:#134e4a;color:#5eead4}
.card{background:#1e293b;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.35);border-left:5px solid #38bdf8}
.card h3{font-size:22px;font-weight:700;color:#7dd3fc;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#cbd5e1;margin-bottom:10px}
.map{background:#0f172a;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.4);border:1px solid #334155}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:16px 0}
.node{background:linear-gradient(135deg,#1e3a5f,#1e40af);border:2px solid #38bdf8;border-radius:14px;padding:12px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#e0f2fe}
.node-em{background:linear-gradient(135deg,#134e4a,#115e59);border-color:#2dd4bf;color:#ccfbf1}
.arrow-sym{font-size:14px;color:#64748b}
.conclusion{background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#1e3a8a;padding:10px 12px;text-align:left;font-weight:700;color:#bfdbfe;border-bottom:2px solid #3b82f6}
td{padding:10px 12px;border-bottom:1px solid #334155;color:#cbd5e1;vertical-align:top}
.correction{background:#172554;border:2px solid #3b82f6;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#93c5fd;margin-bottom:8px}
.rebuttal{background:#1e1b4b;border:2px solid #818cf8;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#c7d2fe;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#a5b4fc;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#ede9fe}
.subtitle{font-size:17px;color:#94a3b8;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Go 1.28 cgo bindings：消费者构建摆脱 GCC</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-go">Go 1.28 / gotip</span>
  <span class="tag tag-cgo">CGO_ENABLED=bindings</span>
  <span class="tag tag-bind">//cgo:func · type · var</span>
</div>
<p class="subtitle">本文解决的核心问题是：Go 库调用预编译 C 动态库时，如何把 C 编译器依赖从每个消费者的 go build 中移走，并通过 Binding 声明、Seed 生成与角色分工，在 gotip 上实测 CC=/bin/false 仍能成功构建。</p>

<div class="map">
  <h3 style="font-size:20px;color:#7dd3fc;margin-bottom:12px;text-align:center">cgo bindings 工作流</h3>
  <div class="diagram">
    <div class="node">C 库预编译 .so</div><span class="arrow-sym">→</span>
    <div class="node-em">bindseed + -gen-binding</div><span class="arrow-sym">→</span>
    <div class="node">bind.go 入库</div><span class="arrow-sym">→</span>
    <div class="node-em">go build 无 GCC</div><span class="arrow-sym">→</span>
    <div class="node">运行时 dlopen</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#94a3b8;margin-top:12px">C 编译器仍在库作者/维护者侧；消费者只需 Go 工具链 + 动态库 + rpath。</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#bfdbfe;font-size:16px">误解：bindings 等于全世界再也不需要 C 编译器。实际只是<strong>消费者日常构建</strong>不调用 GCC；编 C 库、生成 Binding 时仍可能要 C 工具链解析 ABI。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】cgo bindings 与传统 cgo</h3>
  <p><strong>在讲什么：</strong>传统 cgo 在 go build 时生成 C 代码并调 GCC/Clang；bindings 把绑定工作前移，用预编译动态库 + 声明式 Binding 生成 Go/汇编桩代码。</p>
  <p><strong>关键理解：</strong>成本从「每个下游装 C 工具链」转为「封装库作者一次性维护 Binding + 分发 .so」。</p>
  <p><strong>关系：</strong>与 AI/GPU 等强依赖原生库的场景直接相关；与纯 syscall 的轻量化 FFI 是不同路径。</p>
  <p><strong>落地：</strong>GOEXPERIMENT=cgobindings + CGO_ENABLED=bindings；build tag 上 cgo=false、cgobindings=true。</p>
  <p><strong>边界：</strong>Go 1.28 开发分支实验特性，功能冻结前 API 仍可能变；仅验证过 linux/amd64 示例。</p>
  <p><strong>原文：</strong>「让 Go 程序在构建时不再依赖 C 编译器，也能调用预先编译好的 C 库。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】三类 //cgo pragma 与 structs.HostLayout</h3>
  <p><strong>核心思路：</strong>//cgo:func、//cgo:type、//cgo:var 把 Go 符号映射到 C 符号并指明动态库名（如 "libmathx.so"）。</p>
  <p><strong>操作步骤：</strong>① 预编译 lib/*.so；② 写 bind.go 或 bindseed.go；③ #cgo LDFLAGS 配 -Wl,-rpath；④ 绑定 struct 时嵌入 structs.HostLayout；⑤ gotip build。</p>
  <p><strong>避坑：</strong>//cgo:var 对应变量须非导出，对外用 helpers.go 包装；Struct 缺 HostLayout 会导致 ABI 不对齐。</p>
  <p><strong>验证：</strong>CC=/bin/false gotip build 成功即证明构建链路未调 C 编译器。</p>
  <p><strong>原文引用：</strong>「绑定 C Struct 时，Go 结构体必须嵌入 structs.HostLayout。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】bindseed 与 go tool cgo -gen-binding</h3>
  <p><strong>方法名：</strong>开发期生成 Binding（非 go build 步骤）</p>
  <p><strong>流程：</strong>bindseed.go 加 //go:build ignore → 在包目录执行 gotip tool cgo -gen-binding bindseed.go → 产出带 //go:build linux && amd64 的 bind.go → helpers 单独维护。</p>
  <p><strong>选型：</strong>希望保留导出字段名 X/Y 时在 seed 写清 Go 类型；否则生成器可能用小写 C 风格字段。</p>
  <p><strong>避坑：</strong>\${SRCDIR} 要求命令在 mathx/ 包目录执行，或 -srcdir= 显式指定。</p>
  <p><strong>对比手写：</strong>手写适合小 API；大 API 用 seed+CI 防 ABI 漂移。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】传统 cgo vs cgo bindings</h3>
  <table>
    <tr><th>对比维度</th><th>传统 cgo</th><th>cgo bindings</th><th>一句话结论</th></tr>
    <tr><td>消费者 go build</td><td>需要 GCC/Clang</td><td>不需要（实验已证 CC=/bin/false）</td><td>CI/新人环境显著简化</td></tr>
    <tr><td>交付物</td><td>常带 C 源码或让下游编译</td><td>预编译 .so + bind.go</td><td>更像发布 SDK</td></tr>
    <tr><td>Binding 维护者</td><td>隐含在 cgo 注释里</td><td>显式 bind.go/seed</td><td>责任前移到封装作者</td></tr>
    <tr><td>运行时</td><td>动态/静态链 C 库</td><td>仍需 .so 与 rpath</td><td>构建减负≠零原生依赖</td></tr>
    <tr><td>build tag</td><td>cgo</td><td>cgobindings</td><td>双模式库需条件编译</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】谁维护 Binding、绑定多少 API</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th></tr>
    <tr><td>官方 Go SDK</td><td>C 厂商或合作方维护 bind+CI</td><td>最了解 ABI</td><td>假定消费者本地 cgo</td></tr>
    <tr><td>社区 Go 封装库</td><td>封装作者维护 seed</td><td>已筛选对外 API 子集</td><td>绑定整个 C 头文件</td></tr>
    <tr><td>数百符号大库</td><td>AST/存量 cgo 扫描 + 人工审核 + CI diff</td><td>原文给出五级流水线</td><td>全手写 pragma</td></tr>
    <tr><td>仅体验新特性</td><td>gotip + GOEXPERIMENT</td><td>与 1.28 同步演进</td><td>生产直接押注未发布行为</td></tr>
    <tr><td>需 Windows/macOS</td><td>关注生成器平台 tag</td><td>示例含 linux && amd64</td><td>假定单平台 bind 通用</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】实验与生态陷阱</h3>
  <p><strong>以为 -gen-binding 扫整个 .h：</strong>输入是带 pragma 的 Go seed，不是裸头文件。<strong>解：</strong>先列符号再生成。</p>
  <p><strong>把生成 step 塞进用户 go build：</strong>-gen-binding 是开发期工具。<strong>严重度：</strong>致命（破坏可重现构建）。</p>
  <p><strong>忽略 rpath/LDFLAGS：</strong>构建成功但运行时找不到 .so。<strong>解：</strong>与容器镜像内库路径一并设计。</p>
  <p><strong>//cgo:var 导出：</strong>编译规则不允许。<strong>解：</strong>helpers.go 提供 CallCount() 一类 API。</p>
  <p><strong>成本低估：</strong>大 C API 的 seed 维护是持续劳动，并非「一次生成就永久免费」。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】成本集中而非成本消失</h3>
  <p><strong>原则：</strong>cgo bindings 的本质是把 N 个消费者的 C 工具链依赖，集中为封装维护者的一次（可 CI 化）适配。</p>
  <p><strong>为什么重要：</strong>GPU/AI 库分发时，「装不上 gcc」仍是 onboarding 首要障碍。</p>
  <p><strong>怎么落地：</strong>绑定「Go 封装真正用到的 API 子集」；预编译多平台 .so 与 bind 平台 tag 对齐。</p>
  <p><strong>边界：</strong>C 库作者未必愿意维护 Go；社区分工仍是常态。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「纯 Go 派」——继续抵制 cgo，用 syscall/手动汇编/Wasm 替代一切 C 依赖。</p>
  <p class="rebuttal-text">bindings 不消除运行时与 ABI 耦合，大型 GPU 栈仍要随厂商 .so 分发，只是换了个更干净的安装故事，架构上并未回到无 cgo 的理想国。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>gotip + GOEXPERIMENT=cgobindings 已可体验；CGO_ENABLED=bindings 改变消费者构建路径。</li>
    <li>//cgo:func/type/var + 预编译动态库是核心契约；Struct 必须 HostLayout。</li>
    <li>CC=/bin/false 构建成功是「构建期无 GCC」的强证据；运行时仍需 .so。</li>
    <li>bindseed + -gen-binding 是维护者工作流，生成物应入库而非让用户生成。</li>
    <li>Binding 维护成本集中到 Go 封装作者，大 API 需子集化与自动化辅助。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>安装 gotip 并 export GOEXPERIMENT=cgobindings、CGO_ENABLED=bindings 跑通 mathx 示例。</li>
    <li>用 CC=/bin/false 做一次对照构建，确认环境无隐式 gcc 调用。</li>
    <li>若有现存 cgo 封装，列出实际 C 符号子集，评估 seed 规模。</li>
    <li>在 CI 加入 -gen-binding 产出 diff，防止 C ABI 升级时静默断裂。</li>
    <li>跟踪 Go 1.28 正式发布与 Cherry Mui 提案合入后的平台矩阵。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「cgo = 每个开发者机器上都要有 gcc」到「cgo = 库作者发布 Binding + 二进制，消费者只用 Go 工具链编译」——这是分发模型的变化，不是 FFI 从世界上消失。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);