import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'victorialogs-go-performance.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#eff6ff,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#1d4ed8,#4338ca);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1d4ed8}.tag-indigo{background:#e0e7ff;color:#4338ca}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1d4ed8;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#eff6ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#1e40af;border-left:4px solid #60a5fa}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#dbeafe,#bfdbfe);border:2px solid #93c5fd;border-radius:14px;padding:12px 16px;text-align:center;min-width:90px;font-weight:700;font-size:13px;color:#1e40af}
.node-alt{background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-color:#c4b5fd;color:#5b21b6}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1d4ed8,#4338ca);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#eff6ff;padding:10px 14px;text-align:left;font-weight:700;color:#1d4ed8;border-bottom:2px solid #bfdbfe}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>VictoriaLogs 为什么这么快？Go 性能边界的工程实践</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">VictoriaLogs</span>
  <span class="tag tag-indigo">Go 性能工程</span>
  <span class="tag tag-slate">日志存储</span>
</div>
<p class="subtitle">本文解决的核心问题是：面对海量持续写入的日志负载，高性能系统应优先从架构上减少「必须处理的数据量」，而非一味微优化热路径；并以 VictoriaLogs 的 LSM-tree、时间分区、流局部性、Bloom Filter 与列式编码为例，说明如何把这一原则落到 Go 实现与剖析实践。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1d4ed8;margin-bottom:12px;text-align:center">四层优化：从布局到运行时</h3>
  <div class="diagram">
    <div class="node">数据架构<br>LSM / 分区 / 流</div><span class="arrow-sym">→</span>
    <div class="node-alt">查询路径<br>稀疏索引 / Bloom</div><span class="arrow-sym">→</span>
    <div class="node">列式编码<br>差分 / 字典 / 压缩</div><span class="arrow-sym">→</span>
    <div class="node-alt">Go 运行时<br>分配 / Profile</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：goroutine 够多、字符串匹配够快就能扛住日志洪峰。真正瓶颈往往是「读了多少无关数据」——索引与布局的收益常大于再抠 5% 的 regexp 性能。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】先少干活，再跑得快</h3>
  <p><strong>原则：</strong>性能首先是架构问题，其次才是代码问题。</p>
  <p><strong>为什么重要：</strong>一亿条里只有一千条匹配时，优化匹配函数仍要碰一亿条；用过滤器跳过整块数据则直接缩小工作量。</p>
  <p><strong>怎么落地：</strong>设计查询前先问「能否用时间、流、Bloom 排除整块？」再考虑函数级优化。</p>
  <p><strong>适用边界：</strong>过滤收益取决于字段分布与查询模式，不能假设任何查询都能跳过 99% 数据。</p>
  <p><strong>原文支撑：</strong>「真正高性能的系统，不是把每一件事都做得更快，而是从架构上减少必须做的事。」</p>
</div>

<div class="card">
  <h3>【概念拆解卡】LSM-tree 与日志写入</h3>
  <p><strong>在讲什么问题：</strong>持续追加写入如何避免每次落盘都做昂贵随机整理。</p>
  <p><strong>关键理解：</strong>先缓冲、再后台合并；合并还能把同时间/同流数据拉近，改善后续查询局部性。</p>
  <p><strong>典型场景：</strong>高吞吐 ingest、历史分区只读居多。</p>
  <p><strong>边界说明：</strong>合并吃 CPU/磁盘带宽；合并跟不上写入仍会积压。</p>
  <p><strong>相关概念：</strong>时间分区缩小扫描范围；流局部性提升压缩率。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】时间分区与日志流局部性</h3>
  <p><strong>关键理解：</strong>按天分区让「查最近十分钟」不必扫全年；流（service/instance 等）让相关行物理邻近。</p>
  <p><strong>怎么落地用：</strong>排查故障默认带时间窗；流键选择要平衡过滤能力与基数。</p>
  <p><strong>避坑：</strong>把过多高基数字段塞进流标识会导致流数量爆炸、存储与合并成本上升。</p>
  <div class="highlight">因果链：更合理组织 → 更好局部性 → 更少无关读 → 更低查询成本。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】稀疏索引 + Bloom Filter</h3>
  <p><strong>核心思路：</strong>索引不必逐条致密；Bloom 用「一定不存在 / 可能存在」快速跳过整块。</p>
  <p><strong>操作步骤：</strong>1) 时间稀疏索引定位候选块；2) Bloom 排除不可能含关键词的块；3) 仅对剩余块做列读取与匹配。</p>
  <p><strong>避坑：</strong>假阳性只会多读，假阴性会破坏正确性——实现必须保证无假阴性。</p>
  <p><strong>对比相邻：</strong>致密倒排索引定位更细，但写入与存储成本更高。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】行存 vs 列存（日志场景）</h3>
  <table>
    <tr><th>维度</th><th>整行 JSON 字符串</th><th>列式字段块</th><th>一句话</th></tr>
    <tr><td>只统计 level=error</td><td>解析整行</td><td>主要读 level 列</td><td>查询字段越少收益越大</td></tr>
    <tr><td>编码策略</td><td>统一文本</td><td>时间差分、字典、IP 二进制等</td><td>按类型选编码再压缩</td></tr>
    <tr><td>成本</td><td>实现简单</td><td>块布局与解码 CPU</td><td>需权衡压缩率与解压开销</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】专用编码与压缩协同</h3>
  <p><strong>操作步骤：</strong>差分时间戳、字典编码 level、IPv4 存四字节 → 再通用压缩减 I/O。</p>
  <p><strong>选型条件：</strong>字段重复度高、查询常只触少数列时优先列式+专用编码。</p>
  <p><strong>边界说明：</strong>难压缩或频繁全列扫描时，压缩 CPU 可能抵消磁盘收益。</p>
</div>

<div class="card">
  <h3>【决策/选型表】优化优先级</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>海量历史扫全库</td><td>时间分区 + 流过滤</td><td>先缩小数据面</td><td>只优化 regexp</td><td>数据量不变</td></tr>
    <tr><td>关键词检索</td><td>Bloom + 块级跳过</td><td>排除整块</td><td>每条 decode 再 match</td><td>CPU/IO 线性于总量</td></tr>
    <tr><td>聚合少数字段</td><td>列式读取</td><td>对齐物理读与逻辑需求</td><td>总是读整行</td><td>浪费带宽与解码</td></tr>
    <tr><td>Go 服务热点不明</td><td>pprof 基准后再改</td><td>避免臆测优化</td><td>全局 sync.Pool</td><td>可能增常驻内存</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Go 侧性能误区</h3>
  <p><strong>坑名：</strong>为低频路径疯狂减分配，忽略每秒百万次的解析函数。</p>
  <p><strong>解法：</strong>结合调用频率 × 单次成本排序热点；先架构消成本再抠实现。</p>
  <p><strong>坑名：</strong>无脑 sync.Pool / 大 Buffer 复用。</p>
  <p><strong>解法：</strong>测量后使用；注意大数组常驻与 unsafe 字符串生命周期。</p>
  <p><strong>严重程度：</strong>错误优化方向为「小心」；数据竞争与错误结果为致命。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】集群组件与扩展</h3>
  <p><strong>关键理解：</strong>vlinsert 接入、vlstorage 存查、vlselect 汇总；水平扩展不能替代单节点少读数据。</p>
  <p><strong>边界说明：</strong>节点数增加受网络、分片均衡与单点瓶颈限制；无效扫描只会线性放大资源浪费。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「Elasticsearch/Loki 生态成熟，自研列式+LSM 是过度设计」</p>
  <p class="rebuttal-text">VictoriaLogs 的路线是用更激进的跳过无关数据和列式编码换磁盘与查询成本，运维与查询 DSL 迁移成本才是真实门槛，不是峰值 QPS 纸面数据。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>日志性能上限由数据如何组织决定，微优化建立在「少读少解码」之上。</li>
    <li>LSM + 按天分区 + 流局部性构成写入与查询的第一道杠杆。</li>
    <li>稀疏时间索引与 Bloom Filter 进一步跳过不可能匹配的块。</li>
    <li>列式存储与专用编码让物理 I/O 对齐查询字段，并与压缩协同。</li>
    <li>Go 侧用 Profile 驱动分配与复用决策；集群扩展不能代替单节点效率。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>为日志查询强制默认时间窗，并审视流键基数是否可控。</li>
    <li>对热点 ingest/查询路径做 CPU 与 alloc Profile，列出 top 函数再改。</li>
    <li>评估「只读少数列」的查询能否改存储布局或中间格式。</li>
    <li>基准测试同时看吞吐、分配、P99 与磁盘 I/O，不单看 ns/op。</li>
    <li>读 VictoriaLogs Key Concepts / FAQ，对照自家日志 schema 做差距分析。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「把热函数再快一点」转为「让系统根本不必触碰那 90% 无关日志」——这才是 VictoriaLogs 给 Go 开发者的性能课。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
