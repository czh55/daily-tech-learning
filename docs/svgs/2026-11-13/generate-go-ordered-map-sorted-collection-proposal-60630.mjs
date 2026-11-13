import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-ordered-map-sorted-collection-proposal-60630.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#00add8,#0891b2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-cyan{background:#cffafe;color:#0e7490}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #0891b2}
.card h3{font-size:22px;font-weight:700;color:#0e7490;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ecfeff,#cffafe);border:2px solid #67e8f9;border-radius:14px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#0e7490}
.node-em{background:linear-gradient(135deg,#0891b2,#0e7490);border-color:#22d3ee;color:#f0fdfa}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#0e7490,#0891b2);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 12px;text-align:left;font-weight:700;color:#0e7490;border-bottom:2px solid #cbd5e1}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
.highlight{background:#ecfeff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#0e7490;border-left:4px solid #06b6d4}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px}`;

const body = `
<h1>Go #60630：官方有序 Map/Set 进入 Accepted</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-cyan">collection/sorted</span>
  <span class="tag tag-blue">iter.Seq</span>
  <span class="tag tag-green">#69230 Set</span>
</div>
<p class="subtitle">本文解决的核心问题是：原生 map 不保证遍历顺序时，Go 如何用泛型+自定义比较函数+Go 1.23 迭代器，在 x/exp 中提供有序 Map/Set（Min/Max、Span 范围查询、Index/Nth），并与哈希 Set、heap 等拼成完整 Collection API 体系。</p>

<div class="map">
  <h3 style="font-size:20px;color:#0e7490;margin-bottom:12px;text-align:center">Collection API 拼图：从泛型到 sorted</h3>
  <div class="diagram">
    <div class="node">Go 1.18 泛型</div><span class="arrow-sym">→</span>
    <div class="node">1.23 iter.Seq</div><span class="arrow-sym">→</span>
    <div class="node">set #69230</div><span class="arrow-sym">→</span>
    <div class="node node-em">sorted Map/Set #60630</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">Accepted ≠ 已进标准库；先行 x/exp 再社区打磨</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：Accepted 等于明天就能 import 标准库 ordered.Map。实际是 golang.org/x/exp/collection/sorted 实验路径，实现与 API 仍可微调。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】原生 map 解决不了什么</h3>
  <p><strong>在讲什么问题：</strong>排序输出只是冰山一角，还有边界元素、区间、排名、反向遍历。</p>
  <p><strong>关键理解：</strong>手动 slices.Sort(keys) 无法高效维护动态集合上的范围与名次操作。</p>
  <p><strong>和其他概念关系：</strong>对标 Java TreeMap、Rust BTreeMap，Go 长期缺官方泛型有序容器。</p>
  <p><strong>怎么落地用：</strong>监控时间序列、排行榜、窗口聚合时评估 sorted.Map 而非每次全量排序。</p>
  <p><strong>边界说明：</strong>纯 KV 查找 dominance 仍是哈希 map O(1) 均摊。</p>
  <p><strong>原文依据：</strong>#60630 因缺少可遍历抽象拖延至 Go 1.23 迭代器落地。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】sorted.Map 核心 API 怎么用</h3>
  <p><strong>核心思路：</strong>构造时传入比较函数，Key 不必 cmp.Ordered，自定义结构体可按 Age 等字段排序。</p>
  <p><strong>操作步骤：</strong>① <code>sorted.NewMap(cmp.Compare[int], ...)</code>；② <code>for k,v := range m.All()</code> 正序，<code>Backward()</code> 逆序；③ <code>Min()/Max()</code>；④ <code>m.Span().From(lo).To(hi)</code> 区间；⑤ <code>Index</code>/<code>Nth</code> 查名次。</p>
  <p><strong>选型条件：</strong>需要有序索引、窗口扫描、Top-N 时选 sorted；高频点查改为主选 map。</p>
  <p><strong>避坑：</strong>比较函数须严格弱序一致，cmp 结果为 0 的 Key 视为等价。</p>
  <p><strong>对比相邻方法：</strong>第三方 treemap 缺少与 iter 生态、未来标准库路线图对齐。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】原生 map vs sorted.Map</h3>
  <table>
    <tr><th>维度</th><th>map</th><th>sorted.Map</th><th>结论</th></tr>
    <tr><td>遍历顺序</td><td>随机</td><td>按键排序</td><td>业务要顺序必选 sorted</td></tr>
    <tr><td>复杂度</td><td>O(1) 均摊查找</td><td>O(log N) 树结构</td><td>写多读少排序场景付 log 代价</td></tr>
    <tr><td>范围查询</td><td>自实现</td><td>Span API</td><td>时间戳窗口首选</td></tr>
    <tr><td>自定义序</td><td>不支持</td><td>比较函数</td><td>复杂 Key 友好</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】集合类型怎么选</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>缓存、计数器</td><td>map / collection/set</td><td>哈希快</td><td>sorted</td><td>无顺序需求</td></tr>
    <tr><td>定时事件表</td><td>sorted.Map</td><td>Span + Min</td><td>每次 Sort keys</td><td>动态维护昂贵</td></tr>
    <tr><td>优先队列</td><td>collection/heap</td><td>堆专精</td><td>sorted 当堆</td><td>语义不对</td></tr>
    <tr><td>实验新业务</td><td>x/exp sorted 试点</td><td>跟官方 API 演进</td><td>fork 老旧 treemap</td><td>迁移成本高</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】跟進提案时别踩坑</h3>
  <p><strong>坑名：</strong>依赖 map 遍历顺序做逻辑。<strong>原因：</strong>Go 刻意随机化。<strong>解法：</strong>显式排序或 sorted.Map。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>Accepted 就锁死 API 写生产依赖。<strong>原因：</strong>仍在 x/exp 打磨。<strong>解法：</strong>抽象接口+关注 release note。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>所有集合一律 sorted。<strong>原因：</strong>log N 与内存树开销。<strong>解法：</strong>按访问模式选型。<strong>严重程度：</strong>小心。</p>
  <div class="highlight">提案时间线：2023 提出 → 1.23 迭代器 → 2026-11-12 Accepted；语言特性与库 API 协同演进是 Go 风格。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】Collection API 的长期主义</h3>
  <p><strong>原则：</strong>先 x/exp 试错，哈希 set 与 sorted 各守其位，再考虑标准库晋升。</p>
  <p><strong>为什么重要：</strong>避免再出现「社区五个 treemap 互不兼容」碎片化。</p>
  <p><strong>怎么落地：</strong>新业务读 #60630/#69230，在分支上试用 sorted 并反馈 issue。</p>
  <p><strong>适用边界：</strong>极致性能自定义内存布局仍可能自研结构。</p>
  <p><strong>原文支撑：</strong>Austin Clements「No change in consensus, so accepted」标志设计共识收敛。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：极简 Go 派 / 「标准库够用了」开发者</p>
  <p class="rebuttal-text">再塞平衡树 Map 只会膨胀标准库认知负担，大多数人用 slices.Sort 就够了，官方有序容器是在替懒开发者买单且拖慢编译与二进制。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>#60630 Accepted，sorted.Map/Set 将提供排序遍历、Min/Max、Span、Index/Nth 等有序索引能力。</li>
    <li>依赖 Go 1.23+ iter.Seq 与自定义比较函数，Key 类型更灵活。</li>
    <li>与 #69230 set、hashed、heap 共同构成 x/exp Collection 体系。</li>
    <li>性能 trade-off：O(log N) 换有序语义，不可替代哈希 map 的点查场景。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>审计代码中「sort keys 再 range map」热点，标记可换 sorted.Map 的路径。</li>
    <li>在 Go 1.23+ 项目引入 golang.org/x/exp/collection/sorted 做 POC。</li>
    <li>阅读 #60630 最终 API 与比较函数契约，写单元测试覆盖 Span 边界。</li>
    <li>关注 set 与 sorted 包版本，规划与第三方 treemap 的迁移窗口。</li>
    <li>向团队同步：Accepted 是里程碑，生产采用仍看 x/exp 稳定性与 std 晋升时间表。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>Go 集合故事从「map+slice 手工拼」转向「官方泛型集合家族」——有序结构不再是 GitHub 野生依赖，而是与迭代器语言特性绑定的第一等公民。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
