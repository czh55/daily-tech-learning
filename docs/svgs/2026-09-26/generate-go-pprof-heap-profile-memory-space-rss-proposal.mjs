import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-pprof-heap-profile-memory-space-rss-proposal.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:12px 16px;text-align:center;min-width:88px;font-weight:700;font-size:12px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
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
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#0f172a}`;

const body = `
<h1>Go pprof 提案 #79179：heap profile 补上 RSS 与死堆</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">pprof</span>
  <span class="tag tag-green">memory_space</span>
  <span class="tag tag-purple">#79179</span>
  <span class="tag tag-orange">RSS / OOM 排障</span>
</div>
<p class="subtitle">本文解决的核心问题是：容器 RSS 已逼近 OOM 线而 <code>pprof.Lookup("heap")</code> 的 <code>inuse_space</code> 往往不到一半——死堆、协程栈、运行时元数据与非 Go 内存都不在默认堆里；提案 #79179 拟在现有 heap/alloc profile 中新增 <code>memory_space</code> 并设为默认视图，用一份 profile 串起 RSS → Go/非 Go → 堆/栈/运行时的分层归因。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">memory_space 分层（概念关系）</h3>
  <div class="diagram">
    <div class="node">RSS<br>（若可读）</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Go Memory</div>
    <span class="arrow-sym">+</span>
    <div class="node-orange">Non-Go<br>Memory</div>
    <span class="arrow-sym">→</span>
    <div class="node">Heap Live<br>/ Dead</div>
    <span class="arrow-sym">+</span>
    <div class="node">Stack<br>Runtime</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「heap profile 数字小说明没有内存泄漏」。在 <code>GOGC=100</code> 下存活堆常不足 RSS 一半；另一半可能是<strong>尚未清扫的死堆</strong>、栈、runtime、cgo/mmap，而非「神秘泄漏」。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】inuse_space 为什么对不上 RSS</h3>
  <p><strong>在讲什么问题：</strong>运维看 cgroup/K8s memory，开发看 pprof heap，两边数字长期「对不上账」。 </p>
  <p><strong>核心机制：</strong><code>inuse_space</code> 只统计仍被引用、尚未判垃圾的对象；死堆、mspan/mcache、goroutine 栈、可执行文件与 mmap、cgo 分配等不在此列。</p>
  <p><strong>关键理解：</strong>默认 <code>GOGC=100</code> 时堆可在 GC 前膨胀到存活对象约两倍，大量「已死未扫」内存不会出现在 heap profile 里。</p>
  <p><strong>典型场景：</strong>深夜 RSS 告警、<code>/debug/pprof/heap</code> 却只有不到 1GB 的「灵异事件」。 </p>
  <p><strong>边界说明：</strong>runtime/metrics 能细拆 <code>/memory/classes/...</code>，但零散；本提案目标是与调用栈归因缝合，不是替代 metrics API。</p>
  <div class="quote">提案原文：在默认设置（GOGC=100）下，存活堆通常占不到 Go 程序内存使用量的 50%。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】#79179 怎么用 memory_space</h3>
  <p><strong>核心思路：</strong>不新建独立 profile，给现有 <code>heap</code>/<code>alloc</code> 增加采样类型 <code>memory_space</code>，并让 <code>pprof.Lookup("heap")</code> 默认展示它。</p>
  <p><strong>操作步骤：</strong>① 照常抓 <code>/debug/pprof/heap</code> 或 <code>pprof.Lookup("heap").WriteTo</code>；② 在 pprof UI 查看升级后的层级树；③ 若仅见 Go Memory 根节点，读根上的 WARNING（RSS 不可用或 Go&gt;RSS）。</p>
  <p><strong>快照时刻：</strong>在最近一次标记终止（mark termination）对齐 runtime 指标与存活/死堆栈归因；RSS 在 STW 外尽快读取，接受轻微时间偏差。</p>
  <p><strong>选型条件：</strong>需要「从容器 memory 到调用栈」一条链路时用新默认视图；自动化 continuous profiling 若固定读 <code>inuse_space</code> 字段，行为可能不变。</p>
  <div class="highlight"><strong>落地前：</strong>关注 <a href="https://github.com/golang/go/issues/79179">issue #79179</a> 与原型 CL 770882；提案状态为「临时通过，待正式实现验证」，未合入主线前仍须三方对账 RSS + metrics + heap。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】读 memory_space 时的陷阱</h3>
  <p><strong>坑 1 — 把 RSS 与 Go 虚拟内存当同一口径：</strong>runtime 多统计虚拟 memory，RSS 是物理占用；方案用警告帧坦承鸿沟，勿强行相等。严重程度：致命（误判优化方向）。</p>
  <p><strong>坑 2 — Go Memory &gt; RSS：</strong>压舱石、大块预留未 touch 等会出现；profile 会退化为仅 Go 部分并告警。严重程度：小心。</p>
  <p><strong>坑 3 — 忽视死堆：</strong>认为死堆无优化价值；请求型服务里死堆与存活堆热点常相似，减抖动还能支撑更激进 <code>GOMEMLIMIT</code>。严重程度：小心。</p>
  <p><strong>坑 4 — 忽略 profile 体积：</strong>未压缩约 +30%、压缩约 +10%，样本可能因双采样类型集合不完全重合而接近翻倍；APM 需评估存储与传输。严重程度：小心。</p>
</div>

<div class="card">
  <h3>【决策/选型表】内存数据该看哪份</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>K8s OOM 前 5 分钟</td><td>RSS + 合入后的 memory_space heap</td><td>与 limit 同语言，且能分到 cgo/非 Go</td><td>仅 inuse_space</td><td>常不到 RSS 一半</td></tr>
    <tr><td>找分配热点函数</td><td>heap 中 Live/Dead 栈归因</td><td>死堆仍指向同类分配路径</td><td>只看 OS top</td><td>无调用栈</td></tr>
    <tr><td>精细容量规划</td><td>runtime/metrics classes</td><td>长期趋势与分类最全</td><td>单次 pprof 当唯一真相</td><td>口径与时刻不同</td></tr>
    <tr><td>持续剖析平台</td><td>固定 sample_type + 评估体积增幅</td><td>不依赖 default_sample_type 的客户端更安全</td><td>未评估就全量升级采集</td><td>成本与兼容性</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】RSS vs Go Memory vs inuse_space</h3>
  <table>
    <tr><th>维度</th><th>进程 RSS</th><th>Go Memory（runtime）</th><th>heap inuse_space</th><th>一句话</th></tr>
    <tr><td>谁关心</td><td>运维、cgroup、OOM</td><td>runtime 工程师</td><td>应用开发者查泄漏</td><td>同一进程三种「内存」叙事</td></tr>
    <tr><td>含死堆</td><td>间接（未归还页）</td><td>是</td><td>否</td><td>灵异差额的重要来源</td></tr>
    <tr><td>含 cgo/mmap</td><td>是（Non-Go）</td><td>部分在 Non-Go 差值</td><td>否</td><td>cgo 背锅要靠 Non-Go 帧</td></tr>
    <tr><td>调用栈归因</td><td>否</td><td>部分经 pprof 缝合</td><td>是（仅存活对象）</td><td>memory_space 要补的是「全景+栈」</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】十年磨一剑的 Go 可观测性</h3>
  <p><strong>原则：</strong>不一步做大而全 profile，而是在讨论与原型验证后，把复杂度 cautiously 放进标准库。</p>
  <p><strong>为什么重要：</strong>从 #13463、#15848 到今日 #79179，团队宁愿晚十年也要避免误导性数字（警告帧 &gt; 假装精确）。</p>
  <p><strong>怎么落地：</strong>star #79179；OOM 复盘时记录 RSS、metrics 截图与 heap 三份证据；合入后重训团队「默认 heap 即全景」心智。</p>
  <p><strong>适用边界：</strong>命名曾争论 <code>rss</code> vs <code>memory</code>，最终倾向与 K8s/docker「memory」生态一致；实现需「非 vibe-coded」正式 CL 才会定案。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「够用就行」的 inuse_space 派</p>
  <p class="rebuttal-text">更大更重的 heap profile 让持续剖析和边缘节点多付 10–30% 存储与带宽，而多数服务只需盯存活对象——为少数 RSS 对账场景让全体默认买单并不经济。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>痛点是 heap 默认视图与容器 RSS 长期脱节，死堆与非 Go 内存是主因。</li>
    <li>#79179 用 <code>memory_space</code> 扩展 heap/alloc，默认 API 不变、发现性拉满。</li>
    <li>层级树 RSS → Go/Non-Go → Heap/Stack/Runtime，异常时用 WARNING 而非假精确。</li>
    <li>评审 active、原则性通过，但须正式实现验证；体积与 GODEBUG/GOEXPERIMENT 退出通道仍在讨论。</li>
    <li>命名走向 <code>memory</code> 以对齐云原生指标语言，与 <code>/memory/classes</code> 一致。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>收藏 <a href="https://github.com/golang/go/issues/79179">#79179</a> 与 <a href="https://go-review.googlesource.com/c/go/+/770882">CL 770882</a>，合入后升级 Go 与剖析代理。</li>
    <li>下次 RSS 告警时同时保存 RSS、<code>runtime/metrics</code> 与 heap，练「三方对账」备将来对比。</li>
    <li>若运营 continuous profiling，评估 default_sample_type 与压缩后体积增幅。</li>
    <li>排查 cgo 嫌疑时，在提案落地后优先看 Non-Go Memory 帧而非猜 mmap。</li>
    <li>向团队同步：死堆火焰图同样值得优化，尤其在请求驱动型服务。</li>
  </ol>
  <p><strong>关键认知转变：</strong>heap profile 从来不是「进程用了多少内存」，只是「还活着的对象」；#79179 若落地，默认 heap 才更接近 SRE 眼中的 memory 故事。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log(`Wrote ${OUT} (${height}px)`);
