import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'probabilistic-data-structures-in-go.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#0f1a14,#1a2e24);padding:48px 60px;color:#e2e8f0}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#34d399,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-go{background:#064e3b;color:#6ee7b7}.tag-sketch{background:#164e63;color:#a5f3fc}.tag-scale{background:#3b0764;color:#e9d5ff}
.card{background:#1e293b;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.35);border-left:5px solid #10b981}
.card h3{font-size:22px;font-weight:700;color:#6ee7b7;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#cbd5e1;margin-bottom:10px}
.map{background:#0f172a;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.4);border:1px solid #334155}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:16px 0}
.node{background:linear-gradient(135deg,#064e3b,#134e4a);border:2px solid #34d399;border-radius:14px;padding:12px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#a7f3d0}
.node-em{background:linear-gradient(135deg,#1e3a5f,#312e81);border-color:#38bdf8;color:#e0e7ff}
.arrow-sym{font-size:14px;color:#64748b}
.conclusion{background:linear-gradient(135deg,#059669,#0891b2);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#064e3b;padding:10px 12px;text-align:left;font-weight:700;color:#6ee7b7;border-bottom:2px solid #10b981}
td{padding:10px 12px;border-bottom:1px solid #334155;color:#cbd5e1;vertical-align:top}
.correction{background:#422006;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#fcd34d;margin-bottom:8px}
.rebuttal{background:#1e1b4b;border:2px solid #818cf8;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#c7d2fe;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#a5b4fc;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#ede9fe}
.subtitle{font-size:17px;color:#94a3b8;margin-bottom:32px;line-height:1.6}
.highlight{background:#064e3b;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#a7f3d0;border-left:4px solid #10b981}`;

const body = `
<h1>Go 概率性数据结构：Sketch 替代膨胀 Map</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-go">Go</span>
  <span class="tag tag-sketch">Bloom / HLL / CMS</span>
  <span class="tag tag-scale">亿级流式</span>
</div>
<p class="subtitle">本文解决的核心问题是：面对亿级去重、流式频次与 P99 分位数等场景，何时用 Bloom Filter、HyperLogLog、Count-Min Sketch、T-Digest 与 Top-K Sketch 等 Sketch 以固定 KB～MB 内存换取有界误差，而不是让 map 与全量延迟数组撑爆内存与 GC。</p>

<div class="map">
  <h3 style="font-size:20px;color:#6ee7b7;margin-bottom:12px;text-align:center">五类 Sketch 与业务问题映射</h3>
  <div class="diagram">
    <div class="node">成员可能存在?</div><span class="arrow-sym">→</span>
    <div class="node-em">Bloom</div><span class="arrow-sym">|</span>
    <div class="node">多少不同键?</div><span class="arrow-sym">→</span>
    <div class="node-em">HLL</div><span class="arrow-sym">|</span>
    <div class="node">频次?</div><span class="arrow-sym">→</span>
    <div class="node-em">CMS</div>
  </div>
  <div class="diagram">
    <div class="node">P99 延迟?</div><span class="arrow-sym">→</span>
    <div class="node-em">T-Digest</div><span class="arrow-sym">|</span>
    <div class="node">Top-K 热点?</div><span class="arrow-sym">→</span>
    <div class="node-em">Top-K</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#94a3b8;margin-top:12px">VictoriaLogs（Bloom）、DataFusion approx_distinct（HLL）、监控（T-Digest）已把它们当基建标配。</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#fde68a;font-size:16px">误解：概率结构等于「随机不准」。作者强调误差来自可证明的哈希与 sketch 模型；固定种子下结果可复现，业务需先接受假阳性或单向高估等明确误差类型。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】概率性数据结构 / Sketch</h3>
  <p><strong>在讲什么：</strong>不保存全量原始数据，只保留回答特定查询所需的紧凑摘要。</p>
  <p><strong>关键理解：</strong>用可声明的误差模型换内存；传统 Set 答「在或不在」，Bloom 答「一定不在或可能在」。</p>
  <p><strong>关系：</strong>与精确 map 对立；与 LSM、缓存、流式引擎中的预过滤层互补。</p>
  <p><strong>落地：</strong>先写清业务容忍的 FP 率、基数误差或分位数偏差，再选结构与参数。</p>
  <p><strong>边界：</strong>财务、库存等必须精确到个位时不能用近似替代。</p>
  <p><strong>原文：</strong>「我们能否不保存完整数据，只保留足以回答特定问题的信息？」</p>
</div>

<div class="card">
  <h3>【跨概念对比表】三种误差模型</h3>
  <table>
    <tr><th>类型</th><th>表现</th><th>典型结构</th><th>工程含义</th></tr>
    <tr><td>假阳性</td><td>不存在却判「可能存在」</td><td>Bloom Filter</td><td>可多做一次 DB/磁盘查询，不能当「一定在」</td></tr>
    <tr><td>假阴性</td><td>存在却判不存在</td><td>经典 Bloom 无</td><td>误判清零比特会导致 FN，故不支持删</td></tr>
    <tr><td>估算误差</td><td>数值接近真值</td><td>HLL、CMS、T-Digest</td><td>CMS 单向偏高：估算 ≥ 真实</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】Bloom Filter（成员查询）</h3>
  <p><strong>机制：</strong>k 个哈希置位 m 比特；任一位为 0 则必不存在，全 1 则可能存在。</p>
  <p><strong>步骤：</strong>① 预估 n 与目标误判率 p → ② m ≈ -n·ln(p)/(ln2)² → ③ go get github.com/nalgeon/unsure/bloom → ④ 缓存/LSM 前短路无效 I/O。</p>
  <p><strong>依据：</strong>百万 URL、1% FP 约 1.2MB；VictoriaLogs 用其跳无关日志块。</p>
  <p><strong>避坑：</strong>超设计 n 误判升；不支持删；要删用 Counting Bloom 或静态用 Binary Fuse。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】HyperLogLog（基数 UV）</h3>
  <p><strong>机制：</strong>哈希前导零 + 多寄存器；内存由精度 p 定，与元素个数无关。</p>
  <p><strong>落地：</strong>unsure/hll；Merge 后全局 UV 可在分片聚合（DataFusion approx_distinct）。</p>
  <p><strong>边界：</strong>不能枚举具体元素；标准误差约 1.04/√m。</p>
  <p><strong>原文案例：</strong>「SELECT approx_distinct(user_id) FROM access_logs」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Count-Min Sketch + Top-K</h3>
  <p><strong>CMS：</strong>d×w 矩阵多哈希，查询取行最小值；保证以 1-δ 概率：真实 ≤ 估算 ≤ 真实 + ε·N。</p>
  <p><strong>注意：</strong>误差相对总流量 N，低频键相对误差可能很大。</p>
  <p><strong>Top-K：</strong>HeavyKeeper 衰减 + 最小堆，适合流量倾斜；频次仍为估算。</p>
  <p><strong>落地：</strong>countmin.New(0.001, 0.01)；API/IP 分钟级窗口可用分片 Sketch 到期丢弃。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】T-Digest（P95/P99）</h3>
  <p><strong>机制：</strong>带权质心压缩分布，尾部用小质心保极端分位。</p>
  <p><strong>落地：</strong>unsure/tdigest Add + Quantile(0.99)；多机 Merge 得全局近似分位。</p>
  <p><strong>边界：</strong>近似非随机化概率保证；合并过多可能略损尾部精度。</p>
</div>

<div class="card">
  <h3>【决策/选型表】问题 → 结构</h3>
  <table>
    <tr><th>需求</th><th>推荐</th><th>主要限制</th><th>勿用当</th></tr>
    <tr><td>元素可能存在</td><td>Bloom / Binary Fuse（静态）</td><td>无删、超容误判升</td><td>精确 membership 证明</td></tr>
    <tr><td>不同元素个数</td><td>HyperLogLog</td><td>不能查单键</td><td>精确 COUNT DISTINCT 报表</td></tr>
    <tr><td>流式频次</td><td>Count-Min Sketch</td><td>不能枚举全部键</td><td>低频键高精度计费</td></tr>
    <tr><td>P99 延迟</td><td>T-Digest</td><td>合并降精度</td><td>保存每条原始 trace</td></tr>
    <tr><td>热门 Top-K</td><td>Top-K / HeavyKeeper</td><td>近似排名</td><td>均匀分布下的精确排序</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】生产接入 Checklist</h3>
  <p><strong>财务级精确：</strong>订单金额、库存禁止为省内存上 Sketch。</p>
  <p><strong>容量规划：</strong>Bloom/CMS 参数绑定预估规模，耗尽要有扩容或重建策略。</p>
  <p><strong>时间窗：</strong>多数 Sketch 不支持删；按分钟分片，过期丢旧摘要。</p>
  <p><strong>分布式合并：</strong>HLL/T-Digest Merge 需统一精度参数，注意误差累积。</p>
  <p><strong>对抗输入：</strong>可控哈希输入需安全哈希、容量上限，防冲突攻击。</p>
  <p><strong>基准：</strong>unsure 公布的是特定硬件数据；上线前对自己的分布做 Benchmark。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】先问是否必须保存全量</h3>
  <p><strong>原则：</strong>并非所有问题都要 map[string]uint64；明确可接受误差后，几 KB Sketch 可能足够。</p>
  <p><strong>反面：</strong>1 亿 UV 用 map[string]struct{} 带来指针、桶与 GC 的隐形放大。</p>
  <p><strong>落地：</strong>列表五种武器 + unsure 子包 bloom/countmin/hll/tdigest/topk；关注 Blocked Bloom 的 cache-line 友好布局。</p>
  <p><strong>边界：</strong>中小数据仍用 map 最简单可靠。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「精确 map 更简单、可调试、不会误导 SLO」</p>
  <p class="rebuttal-text">在十亿级流式场景里，精确结构带来的 OOM、Full GC 与跨区 Merge 成本往往先击穿 SLO，而用有界误差的 Sketch 做预筛与聚合才是可控工程——真正风险是未声明误差就当作精确数下单。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>五大 Sketch 分别覆盖成员、基数、频次、分位数与热点五类查询。</li>
    <li>假阳性、假阴性与单向估算误差须在需求阶段写进 SLA。</li>
    <li>unsure 提供 Go 实操入口，并强调缓存行级布局等工程优化。</li>
    <li>VictoriaLogs、DataFusion、监控栈证明这是基建而非常识题。</li>
    <li>时间窗、合并、对抗输入与 Benchmark 决定能否上生产。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>审计服务里不断增长的 map，标注是否可改为 Bloom/HLL/CMS。</li>
    <li>为缓存穿透路径试装 Bloom 短路，测量减少的 DB 命中。</li>
    <li>在分析 SQL 中对非财务指标试用 approx_distinct。</li>
    <li>监控 P99 用 T-Digest 替代全量延迟切片存储。</li>
    <li>用 go test bench 对比 unsure 与当前 map 方案的内存与 QPS。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「数据结构必须精确」到「在声明误差的前提下，用 Sketch 把内存与 I/O 从随数据量线性增长改为有界固定成本」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);