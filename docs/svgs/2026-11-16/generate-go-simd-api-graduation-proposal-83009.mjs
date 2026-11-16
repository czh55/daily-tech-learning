import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-simd-api-graduation-proposal-83009.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e0f2fe);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#007d9c,#00add8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-cyan{background:#cffafe;color:#0e7490}.tag-slate{background:#e2e8f0;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #00add8}
.card h3{font-size:22px;font-weight:700;color:#007d9c;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ecfeff,#e0f2fe);border:2px solid #7dd3fc;border-radius:14px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#0369a1}
.node-em{background:linear-gradient(135deg,#007d9c,#00add8);border-color:#38bdf8;color:#f0f9ff}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#007d9c,#0284c7);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f0f9ff;padding:10px 12px;text-align:left;font-weight:700;color:#007d9c;border-bottom:2px solid #bae6fd}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fff1f2;border:2px solid #e11d48;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#be123c;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#e11d48;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#881337}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
.highlight{background:#f0f9ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#0369a1;border-left:4px solid #00add8}
.pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#0f172a}`;

const body = `
<h1>Go SIMD 要转正：#83009 与可执行 API 规范</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-cyan">Proposal #83009</span>
  <span class="tag tag-blue">simd / archsimd</span>
  <span class="tag tag-slate">可执行规范 #81819</span>
</div>
<p class="subtitle">本文解决的核心问题是：Go 如何把多年实验中的 SIMD 能力从「开实验开关赌一把」推进到可长期维护的正式 API，并用双层包划分、One name means one thing 与可执行规范形成跨架构一致的工程闭环。</p>

<div class="map">
  <h3 style="font-size:20px;color:#007d9c;margin-bottom:12px;text-align:center">从指令探索到 API 工程化</h3>
  <div class="diagram">
    <div class="node">GOEXPERIMENT=simd</div><span class="arrow-sym">→</span>
    <div class="node-em">规范覆盖 API 毕业</div><span class="arrow-sym">→</span>
    <div class="node">长期维护体系</div>
  </div>
  <div class="diagram" style="margin-top:8px">
    <div class="node">simd 可移植层</div><span class="arrow-sym">+</span>
    <div class="node">archsimd 硬件层</div><span class="arrow-sym">→</span>
    <div class="node-em">os / syscall 式分工</div>
  </div>
  <div class="diagram" style="margin-top:8px">
    <div class="node">Executable Spec</div><span class="arrow-sym">→</span>
    <div class="node">代码生成</div><span class="arrow-sym">→</span>
    <div class="node">文档 + 跨架构语义测试</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：#83009 等于「Go 一下子拥有全套 SIMD」。原文强调只毕业<strong>被可执行规范覆盖</strong>的操作；ARM64 SVE 暂不在本次 GA，且未覆盖能力仍留在实验态。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】#83009 到底在毕业什么</h3>
  <p><strong>在讲什么问题：</strong>多年实验后，哪些 SIMD API 已具备进入正式生命周期的条件。</p>
  <p><strong>关键理解：</strong>核心是 API 毕业而非重造 SIMD；只有纳入规范的子集脱离 <code>GOEXPERIMENT=simd</code>。</p>
  <p><strong>和其他概念关系：</strong>依赖 #81819 可执行规范作为毕业前提；配套 <a href="https://gist.github.com/aclements/7af2797931768bb5388225ef58055d53">API summary</a> 描述能力边界。</p>
  <p><strong>怎么落地用：</strong>关注 Go 发行说明与 issue 83009 评审进度；在稳定版落地前仍用实验开关练手并锁定依赖版本。</p>
  <p><strong>边界说明：</strong>全量 SIMD、SVE 专用路径、未规范覆盖的 archsimd 尖峰不在本轮。</p>
  <p><strong>原文依据：</strong>「只毕业那些已经被可执行规范覆盖的操作。」</p>
</div>

<div class="card">
  <h3>【概念拆解卡】双层 API：simd 与 simd/archsimd</h3>
  <p><strong>核心机制：</strong><code>simd</code> 向量长度无关、面向可移植数据处理；<code>simd/archsimd</code> 贴近机器指令、固定宽度、榨干特定 CPU。</p>
  <p><strong>关键理解：</strong>类比 <code>os</code> 与 <code>syscall</code>——日常写前者，极限性能再下潜后者。</p>
  <p><strong>典型场景：</strong>图像/向量流水线默认 simd；需要 AVX512 特有指令时用 archsimd。</p>
  <p><strong>怎么落地用：</strong>业务库只依赖 simd；性能热点包内隔离 archsimd，编译标签或 build tag 分架构。</p>
  <p><strong>边界说明：</strong>两层 API 不必一一对应同名函数；重叠处语义必须一致（见 One name 原则）。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】simd 可移植层 vs simd/archsimd 硬件层</h3>
  <table>
    <tr><th>维度</th><th>simd</th><th>simd/archsimd</th><th>结论</th></tr>
    <tr><td>向量宽度</td><td>长度无关抽象</td><td>架构固定宽度</td><td>可移植 vs 峰值</td></tr>
    <tr><td>目标用户</td><td>大多数数据处理</td><td>性能极客</td><td>默认选 simd</td></tr>
    <tr><td>平台</td><td>含软件回退</td><td>AMD64 AVX* / ARM NEON / Wasm</td><td>无硬件仍可跑 simd</td></tr>
    <tr><td>心智负担</td><td>不写 128/256/512</td><td>需懂指令与宽度</td><td>分层降复杂度</td></tr>
  </table>
</div>

<div class="card">
  <h3>【概念拆解卡】API summary 里的操作体系</h3>
  <p><strong>在讲什么问题：</strong>庞大 SIMD 面如何被结构化，而非指令堆砌。</p>
  <p><strong>关键理解：</strong>除 Math 外，Load/Store、Mask、Reduction、Shuffle、类型转换等构成完整数据管道。</p>
  <p><strong>怎么落地用：</strong>读 summary 按类别查操作；优化热点先画「加载→算→掩码→写回」数据流再选 API。</p>
  <p><strong>边界说明：</strong>逐 API 死记易陷细节；应按类别理解能力上限。</p>
  <p><strong>原文依据：</strong>Vec/Mask 分离、<code>LoadTPart</code>/<code>StoreArrayMasked</code> 处理尾部、Shuffle 与算术同等重要。</p>
  <div class="highlight">比较链示例：<code>mask := x.Less(y)</code> → <code>z := x.Masked(mask)</code>，控制面与数据面分离。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】One name means one thing</h3>
  <p><strong>原则：</strong>同名 API  wherever 出现，操作、签名、语义一致；不支持则可不提供，禁止「同名不同义」。</p>
  <p><strong>为什么重要：</strong>SIMD 跨架构指令差异大，若语义漂移，可移植代码将 silent wrong。</p>
  <p><strong>怎么落地：</strong>写跨平台库时只依赖语义稳定的重叠子集；arch 特化调用单独封装并文档化。</p>
  <p><strong>适用边界：</strong>不追求 API 集合完全相同，只追求重叠集合语义相同。</p>
  <p><strong>原文支撑：</strong><code>Add</code> 在各架构均表逐元素加法；缺指令则缺 API 而非改义。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】可执行 API 规范（#81819）</h3>
  <p><strong>核心思路：</strong>用 Go 编写规范，统一定义名称、类型签名、文档与纯 Go 参考实现。</p>
  <p><strong>操作步骤：</strong>① 规范描述操作 → ② 多架构生成器围绕同一源 → ③ 文档自动生成 → ④ 参考实现驱动语义测试。</p>
  <p><strong>选型条件：</strong>替代早期 simdgen+categories.yaml 无法约束类型/防架构信息泄漏的问题。</p>
  <p><strong>避坑：</strong>勿把规范当成「当前硬件清单」——可描述尚无硬件实现的操作，预留未来扩展。</p>
  <p><strong>对比相邻方法：</strong>相比 YAML 只约束命名，可执行规范能闭环验证并在 QEMU 上抓实现 Bug。</p>
  <p><strong>原文引用：</strong>「已经成为跨架构实现的验证工具。」</p>
</div>

<div class="card">
  <h3>【决策/选型表】本轮 GA 覆盖与回退策略</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>AMD64 生产</td><td>simd + 按需 archsimd AVX2/512</td><td>本轮明确覆盖 AVX 族</td><td>假设 SVE 已 GA</td><td>SVE 不在本次范围</td></tr>
    <tr><td>ARM64 服务</td><td>NEON 路径的 simd/archsimd</td><td>Proposal 表列 NEON</td><td>依赖 SVE 专用 API 上线</td><td>仍实验</td></tr>
    <tr><td>Wasm 边缘</td><td>Simd 规范子集</td><td>表列 Wasm SIMD</td><td>默认 archsimd 思维</td><td>Wasm 无传统 arch 包模型</td></tr>
    <tr><td>未知/弱 SIMD CPU</td><td>仅 simd 软件回退</td><td>其他平台有回退</td><td>硬编码 512 位宽度</td><td>违背长度无关设计</td></tr>
    <tr><td>实验新 API</td><td>继续 GOEXPERIMENT</td><td>未规范覆盖未毕业</td><td>无开关投入生产</td><td>兼容性未承诺</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】毕业前夕的设计与使用陷阱</h3>
  <p><strong>坑名：</strong>把 Proposal 当已发布 GA。<strong>原因：</strong>仍待评审。<strong>解法：</strong>跟踪 issue 83009 与发行说明。<strong>严重程度：</strong>致命（依赖管理）。</p>
  <p><strong>坑名：</strong><code>Equal</code> 语义与 Go 习惯冲突——返回 Mask 非 bool。<strong>解法：</strong>全局相等用 <code>x.Equal(y).All()</code> 或关注重命名讨论。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>Reshape 多步位操作繁琐。<strong>解法：</strong>关注 Bits128/256/512 简化提案；封装内部 helper。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>正式 API 后难改签名。<strong>解法：</strong>实验期把公共库面对齐规范重叠子集。<strong>严重程度：</strong>致命（长期维护）。</p>
  <p><strong>坑名：</strong>忽视 Load/Store 尾部。<strong>解法：</strong>显式用 <code>LoadTPart</code>、掩码存储处理 remain。<strong>严重程度：</strong>小心（性能与正确性）。</p>
  <div class="pitfall">一旦进入正式生命周期，命名与语义冻结成本极高——开放问题（Equal、Reshape）正是毕业前的最后一搏。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】categories.yaml 时代 vs 可执行规范时代</h3>
  <table>
    <tr><th>维度</th><th>simdgen + YAML</th><th>Executable Spec</th><th>结论</th></tr>
    <tr><td>类型约束</td><td>弱</td><td>强（签名在规范中）</td><td>减少生成器漂移</td></tr>
    <tr><td>文档</td><td>分散维护</td><td>统一生成</td><td>降低文档债</td></tr>
    <tr><td>验证</td><td>主要靠手写测试</td><td>参考实现 + 跨架构对比</td><td>可抓仿真器 Bug</td></tr>
    <tr><td>未来 API</td><td>受当前硬件限制</td><td>可声明未实现语义</td><td>为 SVE 等留位</td></tr>
  </table>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Rust/C++ 「 intrinsic 直接上」派</p>
  <p class="rebuttal-text">等 Go 把规范、毕业范围和 Equal 命名争完，你三轮 AVX 内核已上线——但 SIMD 的真战场是多年跨团队维护，没有可执行语义契约的「快」，常在第二家 CPU 上变成难以审计的 silent wrong。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>#83009 标志 Go SIMD 从实验指令走向可选正式 API 子集，前提是可执行规范覆盖。</li>
    <li>simd / archsimd 双层化解可移植与峰值性能的二选一。</li>
    <li>API summary 展示完整数据处理管道，不仅是 Add/Mul。</li>
    <li>One name means one thing 是跨架构的心理安全网。</li>
    <li>#81819 可执行规范统一生成、文档与语义验证，是工程亮点。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>订阅 <a href="https://github.com/golang/go/issues/83009">#83009</a> 与 <a href="https://github.com/golang/go/issues/81819">#81819</a> 讨论。</li>
    <li>用 API summary 给现有热点画数据流，标注可迁到 simd 的段落。</li>
    <li>实验环境 <code>GOEXPERIMENT=simd</code> 试跑 Mask/Load 尾部路径。</li>
    <li>公共库避免暴露 archsimd 到 API 表面，除非性能证明需要。</li>
    <li>在 Equal/Reshape 定案前，少写依赖其最终形态的抽象层。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「Go 什么时候能用 SIMD 指令」转为「Go 如何用规范和双层 API 把 SIMD 做成可维护基础设施」——毕业的是工程体系，不只是一组 intrinsics。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');