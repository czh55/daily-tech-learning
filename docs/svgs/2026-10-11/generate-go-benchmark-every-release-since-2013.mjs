import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-benchmark-every-release-since-2013.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfeff,#e0f2fe);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#0e7490,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-orange{background:#ffedd5;color:#9a3412}.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #06b6d4}
.card h3{font-size:22px;font-weight:700;color:#0e7490;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#ecfeff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#0e7490;border-left:4px solid #06b6d4}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#cffafe,#a5f3fc);border:2px solid #22d3ee;border-radius:16px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#0e7490}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#0e7490,#06b6d4);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#0e7490;border-bottom:2px solid #cbd5e1}
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
<h1>Go 1.2→1.27 全版本 Benchmark：升级收益到底在哪</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Praneos Labs</span>
  <span class="tag tag-green">Benchmarks Game</span>
  <span class="tag tag-orange">Runtime / SSA</span>
  <span class="tag tag-purple">能耗模型</span>
</div>
<p class="subtitle">本文解决的核心问题是：在 26 个 Go 小版本、同一硬件与同一批程序上，升级带来的 11.5% 整体提速究竟来自编译器还是 runtime，以及你的业务代码属于「map/GC 受益型」还是「数值循环原地踏步型」，从而判断该不该立刻升 Go 1.27。</p>

<div class="map">
  <h3 style="font-size:20px;color:#0e7490;margin-bottom:12px;text-align:center">13 年性能演进三阶段</h3>
  <div class="diagram">
    <div class="node">Go 1.2<br>基线</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">1.5–1.7<br>SSA 编译器</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">1.8–1.23<br>GC 低延迟</div>
    <span class="arrow-sym">→</span>
    <div class="node">1.24–1.27<br>Swiss map 等</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「Go 比 C 慢好几倍 = 语言设计不行」。Benchmarks Game 上 C 程序大量手写 SIMD；标量对比下 Go 与 C 差距已收敛到 0%–30%，个别任务甚至反超，差距主因在向量化而非 GC。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Praneos 全版本 Benchmark 在测什么</h3>
  <p><strong>在讲什么问题：</strong>官方 Release Notes 与双版本对比无法回答「13 年累计收益」。</p>
  <p><strong>关键理解：</strong>12 个 Benchmarks Game 程序（含纯 Go 版 pidigits/regex-redux）、26 个补丁版本、GCP c3-standard-8、每轮清页缓存、5 轮共 1560 次运行，输出与参考逐字节一致，steal time 为 0。</p>
  <p><strong>和其他概念关系：</strong>测的是<strong>吞吐量</strong>，看不到 Go 1.8–1.23 主攻的亚毫秒 GC 停顿收益。</p>
  <p><strong>怎么落地用：</strong>克隆 <code>github.com/nrnjn42/go-bench</code>，约 5 小时、约 2 美元即可复现；升级决策前先对照自己代码是否 map/分配密集。</p>
  <p><strong>边界说明：</strong>数值循环（n-body、mandelbrot、spectral-norm）自 Go 1.7 SSA 后机器码几乎不变，别指望升版本救 CPU 热点循环。</p>
  <div class="quote">几何平均：Go 1.27 比 1.23 快 11.5%，比 1.2 快约 41%。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】复现与自测流程</h3>
  <p><strong>核心思路：</strong>用同一源码在多版本 <code>go</code> 间切换，固定硬件与清缓存策略，避免「换机器」污染结论。</p>
  <p><strong>操作步骤：</strong>1）从 Go module proxy 拉取 go1.2.2…go1.27.1 并校验 sumdb → 2）对 5 个用到新 API 的程序做一行兼容改写且验证输出一致 → 3）5 轮 × 12 程序 × 26 版本计时 → 4）对照开源仓库原始数据。</p>
  <p><strong>选型条件：</strong>需要「历史纵向」证据选全版本跑批；只需「该不该升 1.27」可只看 1.23 vs 1.27 分程序表。</p>
  <p><strong>避坑：</strong>勿把几何平均 11.5% 当成每个服务都能白捡；reverse-complement 在 1.27 变慢 3.1% 且峰值内存 +29%，升级后要盯内存曲线。</p>
  <div class="highlight"><strong>落地：</strong>生产升级前用 pprof/alloc 看 map 与 GC 占比；map 密集或分配热点服务优先试点 1.27。</div>
</div>

<div class="card">
  <h3>【决策/选型表】Go 1.23 → 1.27 谁该先升</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>大量 <code>map</code>、k-mer 类计数</td><td>尽快升 1.24+</td><td>k-nucleotide −57.5%（Swiss Table）</td><td>停在 1.23 等「再观察」</td><td>已知 runtime 红利，拖延等于白扔 CPU</td></tr>
    <tr><td>分配/GC 重的树结构服务</td><td>升 1.27</td><td>binary-trees −30.7%，仅 1.27 就占 14%</td><td>只看 P99 延迟指标</td><td>本 benchmark 不反映延迟优化，需另测 trace</td></tr>
    <tr><td>纯浮点数值内核</td><td>编译器/算法优化优先</td><td>n-body 等 ±1%，版本无关</td><td>指望升 Go 救性能</td><td>SSA 后编译器对这类循环久无大变</td></tr>
    <tr><td>大整数 / <code>math/big</code></td><td>升 1.25+</td><td>纯 Go pidigits −15.9%</td><td>混用 GMP cgo 版对比</td><td>测试里 GMP 路径收益不同</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】吞吐量跃迁 vs GC 低延迟 vs SIMD 差距</h3>
  <table>
    <tr><th>维度</th><th>Go 1.5–1.7 编译器期</th><th>Go 1.8–1.23 平静期</th><th>Go vs C（排行榜）</th><th>一句话</th></tr>
    <tr><td>主要投入</td><td>自举 + SSA 后端</td><td>GC 停顿、延迟</td><td>C 手写 SIMD</td><td>不同阶段优化目标不同</td></tr>
    <tr><td>本 benchmark 可见收益</td><td>相对 1.27 约 1.21→1.0 量级</td><td>吞吐量仅 ~3%</td><td>Go 落后数倍</td><td>「慢」常被向量指令放大</td></tr>
    <tr><td>业务感知</td><td>老代码全面变快</td><td>延迟更稳、吞吐平淡</td><td>标量对比 0–30% 差距</td><td>别用 Game 排名否定 Go</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】升级与读数据的常见误区</h3>
  <p><strong>坑名：</strong>把 11.5% 平均提速写进所有微服务的 SLA。</p>
  <p><strong>原因：</strong>几何平均掩盖极端赢家（map 程序腰斩）与不动项（数值循环）。</p>
  <p><strong>解法：</strong>按工作负载分类压测；内存敏感服务单独看 RSS 峰值。</p>
  <p><strong>严重程度：</strong>小心</p>
  <div class="pitfall"><strong>坑名：</strong>用 2017 年「Go 能耗 = 3.23× C」否定今天。作者用原论文程序在 1.8 vs 1.27 重测后，能耗比已显著收敛（模型估算，非实测功耗）。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】能耗：跑得久比占核少更费电</h3>
  <p><strong>原则：</strong>在 van Kempen 2024 模型下，空闲机约 287 W 基底功耗，<strong>elapsed 时间</strong>对能耗解释力高于单纯 CPU-seconds。</p>
  <p><strong>怎么落地：</strong>缩短端到端耗时（含 1.27 的 11.5% 省电估算）比「少占一个核但跑更久」更省电。</p>
  <p><strong>适用边界：</strong>模型 R²=0.97 仍是估算；异构集群、动态调频需实测 RAPL 校验。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：延迟敏感型后端 / 「别信 Benchmark Game」派</p>
  <p class="rebuttal-text">七年吞吐量几乎不动、测试又全是合成小程序，拿 11.5% 说服人升生产版本，是把 runtime 赌桌上的 map 红利当成全行业普适真理。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Go 1.27 相对 1.23 几何平均快 11.5%，相对 1.2 快约 41%；红利集中在 1.5–1.7 编译器与 1.24–1.27 runtime。</li>
    <li>map 密集、GC/分配重的程序收益最大；纯数值循环自 1.7 后基本不动。</li>
    <li>与 C 的差距在排行榜上被 SIMD 放大，标量对比已大幅收敛。</li>
    <li>升级可能带来内存副作用（如 reverse-complement +29% 峰值内存），需监控。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>用 alloc/map profile 判断服务是否属于「Swiss Table 受益型」。</li>
    <li>在预发对 1.23 vs 1.27 跑自己的基准与内存峰值对比。</li>
    <li>数值热点优先改算法或向量化，而非只升 Go 版本。</li>
    <li>需要可审计证据时复现 go-bench 开源流水线。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>Go 版本升级不是均匀加速包：它是<strong>分阶段、分工作负载</strong>的 runtime 与编译器债偿还；读懂自己的代码形态，比背 Release Note 数字更重要。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
