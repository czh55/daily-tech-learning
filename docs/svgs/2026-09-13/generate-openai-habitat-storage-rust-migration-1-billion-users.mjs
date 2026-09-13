import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'openai-habitat-storage-rust-migration-1-billion-users.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
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
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>2 名工程师 + Codex，OpenAI 用 Rust 重写扛住 10 亿人的存储系统</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Habitat</span>
  <span class="tag tag-orange">Python → Rust</span>
  <span class="tag tag-purple">高并发调优</span>
  <span class="tag tag-green">AI 辅助迁移</span>
  <span class="tag tag-red">分布式存储</span>
</div>
<p class="subtitle">本文解决的核心问题是：在两年 1000 倍请求增长、Python 高并发踩遍 asyncio 调度、连接池 LIFO 亚稳态失败等坑之后，OpenAI 如何用「战略性技术负债 + 受限 API + 2 人 Codex 重写」把 Habitat 从客户端库演进为扛住 7000 万 QPS 的 Rust 服务。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Habitat 演进路径</h3>
  <div class="diagram">
    <div class="node">Python 客户端库<br>2024 年中</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">独立服务<br>运维事故倒逼</div>
    <span class="arrow-sym">→</span>
    <div class="node-red">Python 四场硬仗<br>调优撑到 2000 万 QPS</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Rust 重写<br>2 人 + Codex</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">7000 万 QPS<br>CPU 6× / 内存 15×</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">先解架构问题（库 vs 服务），再解语言问题（Python vs Rust），两个问题不能同时硬上</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「OpenAI 用 Rust 重写 = Python 不适合高并发，一开始就该选 Rust」。团队明确承认 Python 在 100 倍规模下不可接受，但刻意先用 Python 换速度、解除产品阻塞，并押注内部代码模型会让未来迁移可行——这是一次计算过的战略性技术负债，不是技术选型失误。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Habitat 与「战略性技术负债」</h3>
  <p><strong>在讲什么问题：</strong>Habitat 是 OpenAI 统一在线存储平台，支撑 ChatGPT/Codex/API 全部产品的数据读写，两年内从单库 Python 客户端成长为 7000 万 QPS、10 亿周活、500PB 数据的分布式系统。</p>
  <p><strong>核心机制：</strong>产品工程师通过受限 NoSQL API（对象+边，参考 Meta TAO）存取数据，Habitat 包办路由、鉴权、加密、序列化、连接池等脏活；故意不做任意 SQL，用可预测开销换可扩展性。</p>
  <p><strong>关键理解：</strong>团队明知 Python 低效，仍选择先立服务——最紧迫目标是解除产品阻塞、打稳平台基础，同时赌 Codex/GPT 未来能简化迁移；2026 Q2 2 名工程师一季完成 Rust 重写，赌注兑现。</p>
  <p><strong>典型场景：</strong>用户发一条 ChatGPT 消息可能触发数百次 Habitat 读写；任一次慢或失败直接体现在产品卡顿/崩溃上。</p>
  <p><strong>边界说明：</strong>受限 API 不适合需要复杂图遍历/联表的分析场景——这类需求走 CDC 同步到 Rockset 的「逃生通道」，在线存储与分析负载隔离。</p>
  <div class="quote">原文：我们也下了一个「计算好的赌注」：赌自己内部代码模型的飞速进步，会在未来大大简化这次技术栈迁移的路径。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】客户端库 vs 独立服务 vs Rust 重写</h3>
  <table>
    <tr><th>对比维度</th><th>Python 客户端库</th><th>Python 独立服务</th><th>Rust 重写服务</th><th>一句话结论</th></tr>
    <tr><td>发布协调</td><td>改一行要协调几十个团队</td><td>改一个服务，全产品受益</td><td>同左，效率再升 6×</td><td>库模式在规模下必然崩溃</td></tr>
    <tr><td>并发模型</td><td>本地直连，延迟低</td><td>asyncio + GIL，调度抖动数百毫秒</td><td>无 GIL，原生高效</td><td>服务化牺牲延迟换统一治理</td></tr>
    <tr><td>连接管理</td><td>各客户端各自连接池</td><td>LIFO 引发亚稳态失败</td><td>原生更高效 + Envoy 聚合</td><td>连接策略是隐藏杀手</td></tr>
    <tr><td>峰值吞吐</td><td>—</td><td>撑住 2000 万 QPS</td><td>7000 万 QPS，95% 流量</td><td>Python 是过渡而非终点</td></tr>
    <tr><td>迁移成本</td><td>—</td><td>—</td><td>2 人 + Codex 一季完成</td><td>AI 已能承接核心基建迁移</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Python 高并发四场硬仗</h3>
  <p><strong>坑 1 — asyncio 调度延迟：</strong>下游 Cosmos DB 已返回，请求却卡在等协程被重新调度；高 CPU 下事件循环抖动可达数百毫秒甚至数秒。并发不等于并行，GIL 让 CPU 密集任务与 I/O 争抢调度。</p>
  <p><strong>解法：</strong>专门监控 asyncio 事件循环繁忙程度，压低单进程并发、横向扩大量 worker 进程。</p>
  <p><strong>坑 2 — Statsig 整点卡顿：</strong>每分钟全 Pod 8 进程同时拉取巨大 feature flag 配置，集体卡顿解析，正在处理的请求被晾在一边。</p>
  <p><strong>解法：</strong>下发更小更精准的目标化配置、拉长刷新间隔、后台任务加随机 jitter。</p>
  <p><strong>坑 3 — 连接池 LIFO 亚稳态失败：</strong>aiohttp TCPConnector 默认 LIFO 复用最近连接，高并发客户端只打少数服务进程，尾部进程负载 5～10 倍均值；停掉突增客户端后部分进程仍亚健康直至手动重启。</p>
  <p><strong>解法：</strong>限制最大连接复用时长验证猜想，再将 LIFO 改为 FIFO 彻底打破恶性反馈循环。</p>
  <p><strong>坑 4 — 下游连接风暴：</strong>大量 Python 进程各自建连，日常发布批量重建连即可 CPU 抖动，连接泄漏可打爆 NAT 网关。</p>
  <p><strong>解法：</strong>Envoy 统一 HTTP/2 多路复用、连接池化与生命周期管理，集中限流熔断。</p>
  <div class="relation"><strong>严重程度：</strong>坑 3 最隐蔽（亚稳态需手动重启）；坑 1/4 在 Habitat 进程数量高出一个数量级时触发门槛极低。</div>
</div>

<div class="card">
  <h3>【决策/选型表】存储架构与语言迁移时机</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>产品阻塞、平台未稳</td><td>先用 Python 立服务，接受技术负债</td><td>速度优先，同时押注 AI 辅助未来迁移</td><td>一开始就追求完美 Rust 实现</td><td>两个问题（架构+语言）同时上会拖死交付</td></tr>
    <tr><td>协议升级需协调多团队</td><td>从库拆成独立服务</td><td>统一发布、可观测性、安全合规集中控制</td><td>继续客户端库 + feature flag 协调</td><td>几十个团队脆弱协调，出错概率线性上升</td></tr>
    <tr><td>在线读写 API 设计</td><td>受限 NoSQL（对象+边，无图遍历）</td><td>开销可预测，水平扩展简单</td><td>开放任意 SQL 查询</td><td>一条昂贵查询即可拖垮全库</td></tr>
    <tr><td>复杂分析/搜索需求</td><td>CDC 同步到 Rockset，团队自扩容</td><td>在线存储与分析负载隔离</td><td>在 Habitat 层支持复杂联表</td><td>扇出不可控，制造延迟悬崖</td></tr>
    <tr><td>Python 已撑到 2000 万 QPS、平台成熟</td><td>启动 Rust 重写，借助 Codex/GPT</td><td>CPU 6×、内存 15×，消灭 GIL/asyncio 根源</td><td>无限 Python 调优而不还债</td><td>100 倍规模下 Python 低效不可接受</td></tr>
    <tr><td>客户端连接池策略</td><td>FIFO 或 Envoy/Istio 集中管理</td><td>避免 LIFO 制造负载倾斜与亚稳态</td><td>默认 LIFO 不做评估</td><td>大多数场景合理，高并发服务是例外</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】连接池与 Envoy 调优实操路径</h3>
  <p><strong>方法名：</strong>连接池策略审计 + Envoy 连接聚合 · 标签：高并发、负载均衡</p>
  <p><strong>核心思路：</strong>客户端连接池的复用策略（LIFO/FIFO）会直接影响服务端进程间负载分布，错误策略可制造亚稳态失败；大量进程各自建连则引发惊群效应。</p>
  <p><strong>操作步骤：</strong>1) 检查 HTTP 客户端连接池默认策略（aiohttp 默认 LIFO）→ 2) 观察服务进程利用率方差，尾部是否 5～10 倍均值 → 3) 限制最大连接复用时长做 A/B 验证 → 4) 将 LIFO 改为 FIFO 或迁移到 Envoy HTTP/2 多路复用 → 5) 在 Envoy 层集中实施限流、熔断与连接生命周期管理 → 6) 为 feature flag/配置拉取加 jitter，避免全进程同步卡顿</p>
  <div class="highlight"><strong>落地建议：</strong>除 CPU/内存/网络/磁盘外，必须监控 asyncio 事件循环繁忙度；横向扩进程时同步评估下游 NAT/连接数上限，按峰值连接而非稳态吞吐量规划网络资源。</div>
  <div class="pitfall"><strong>避坑：</strong>不要以为「并发高 = 并行好」——asyncio 在 CPU 密集路由/加密/校验和场景下调度抖动是尾延迟元凶；也不要假设连接池默认值在所有规模下都安全。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】用约束换可扩展性的 Habitat 设计哲学</h3>
  <p><strong>原则：</strong>「简单、可预测、开销恒定」的请求系统，远比功能强大但开销不可控的系统更容易扩展、更不容易被误用。</p>
  <p><strong>为什么重要：</strong>写一条昂贵 SQL 太容易，人肉 review 在团队扩张后迅速失控；Habitat 让「贵」在客户端层面变得显眼，倒逼更高效设计。</p>
  <p><strong>怎么落地：</strong>对象与边放在同一存储分区以利水平扩展；图遍历效率低是刻意代价；复杂查询走 Rockset 逃生通道，把复杂度显式推给需要的客户端。</p>
  <p><strong>适用边界：</strong>适合在线读写、扇出可控的场景；不适合需要实时复杂图分析且不愿承担 CDC+Rockset 接入成本的团队。</p>
  <div class="quote">原文：那些可能带来不可预期扇出的请求，才是真正危险的——它们会让隔离、负载均衡都变得复杂，还会制造难以扩容应对的延迟悬崖。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「Day 1 Rust」派 · 基础设施洁癖主义者</p>
  <p class="rebuttal-text">战略性负债听起来理性，实则把两年调优血泪和亚稳态事故成本转嫁给运维；若 2024 年就选 Rust，7000 万 QPS 不必先拿 Python 当人肉压测。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Habitat 两年从 Python 库成长为 7000 万 QPS 分布式存储，核心转折是从客户端库拆成独立服务，解决多团队协调的运维地狱。</li>
    <li>团队明知 Python 在百倍规模不可接受，仍战略性先用 Python 换速度，并押注 Codex/GPT 简化迁移——2026 Q2 2 人一季 Rust 重写兑现赌注。</li>
    <li>Python 阶段四场硬仗（asyncio 调度、Statsig 整点卡顿、LIFO 亚稳态失败、连接风暴）是真实生产血泪，Rust 从语言层消灭至少三个根源。</li>
    <li>受限 NoSQL API + CDC/Rockset 逃生通道，用可预测性换可扩展性，把复杂查询复杂度显式推给客户端。</li>
    <li>Rust 版 CPU 效率 6 倍、内存 15 倍，已承接 95% 生产流量，Python 版数周内退役。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>审计现有 HTTP 客户端连接池策略，高并发服务评估 LIFO 是否制造负载倾斜，考虑 FIFO 或 Envoy 集中管理。</li>
    <li>为 feature flag/配置拉取加 jitter，避免全进程同步解析造成周期性尾延迟尖刺。</li>
    <li>监控 asyncio 事件循环繁忙度（Python 服务），并压低单进程并发、横向扩展 worker。</li>
    <li>设计存储 API 时优先「可预测开销」而非「功能强大」，为复杂查询预留隔离出口（如 CDC+分析引擎）。</li>
    <li>若计划语言级迁移，评估当前 AI 代码模型能力，将架构问题（库 vs 服务）与语言问题分阶段解决。</li>
  </ol>
  <p><strong>关键认知转变：</strong>极端增长下的工程智慧不是「一开始就选对语言」，而是清楚自己在赌什么、何时还债——先用 Python 解阻塞、用约束换扩展性，再在 AI 辅助下高效完成核心基建的语言级迁移，这比追求 Day 1 完美技术栈更接近真实大厂演进路径。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
