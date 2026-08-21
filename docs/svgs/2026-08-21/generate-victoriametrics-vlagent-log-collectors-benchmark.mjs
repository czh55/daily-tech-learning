import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'victoriametrics-vlagent-log-collectors-benchmark.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#065f46,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #059669}
.card h3{font-size:22px;font-weight:700;color:#065f46;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#ecfdf5;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#065f46;border-left:4px solid #059669}
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #6ee7b7;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#065f46}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#065f46,#059669);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#ecfdf5;padding:12px 16px;text-align:left;font-weight:700;color:#065f46;border-bottom:2px solid #6ee7b7}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#065f46}`;

const body = `
<h1>14.3 万条/秒！VictoriaMetrics 日志采集器压测报告</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">K8s 日志采集</span>
  <span class="tag tag-blue">vlagent</span>
  <span class="tag tag-orange">基准测试</span>
  <span class="tag tag-purple">可观测性</span>
</div>
<p class="subtitle">本文解决的核心问题是：在 1 核 1GB、零调优的真实 K8s 资源争抢环境下，主流日志采集器的吞吐量与资源效率差距有多大，哪些工具会在日志轮转和默认配置下悄悄丢数据，以及 vlagent 能否直接替换现有方案。</p>

<div class="map">
  <h3 style="font-size:20px;color:#065f46;margin-bottom:12px;text-align:center">K8s 日志采集链路</h3>
  <div class="diagram">
    <div class="node-orange">容器 stdout<br>JSON 日志</div>
    <span class="arrow-sym">→</span>
    <div class="node-blue">/var/log/pods<br>containerd 写入</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">日志采集器<br>tail + 解析 + 打标</div>
    <span class="arrow-sym">→</span>
    <div class="node">下游存储<br>Loki / ES / VL</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">采集器是整条可观测性链路的第一环——扛不住就丢日志，或吃光节点资源影响业务 Pod</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「日志采集器都差不多，选个社区最流行的就行」。压测显示吞吐量差距可达 <strong>28 倍</strong>，且 Fluent Bit、Vector 在日志轮转时会产出残缺记录——常规吞吐测试根本发现不了这类正确性问题。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】零调优压测方法论</h3>
  <p><strong>在讲什么问题：</strong>如何公平对比 9 款采集器在真实生产约束下的性能与正确性。</p>
  <p><strong>核心机制：</strong>四组件架构——log-generator（带自增 sequence_id 的 JSON 日志）、待测采集器（官方 Helm Chart 部署）、log-verifier（校验丢包与延迟）、VictoriaMetrics + Grafana（资源监控）。所有采集器限制 1 核 1GiB、同节点 kind 集群共享资源，不改缓冲区/批量/GC 参数。</p>
  <p><strong>关键理解：</strong>这不是「专属机器飙分」，而是模拟绝大多数团队「没空调优、资源有限」的真实处境。</p>
  <p><strong>典型场景：</strong>评估现有采集器是否能在日志洪峰时扛住，或选型新方案前的 POC 基线。</p>
  <p><strong>边界说明：</strong>测试聚焦 K8s JSON 结构化日志；非 JSON 自定义解析、多行堆栈合并不在本次覆盖范围。</p>
  <div class="quote">「这不是各自跑在专属机器上飙分的理想化测试，而是模拟了绝大多数团队实际部署时没空调优、资源有限的真实处境。」</div>
  <div class="relation"><strong>相关概念：</strong>sequence_id 差值 = 丢失日志数，这是比吞吐量更硬的正确性指标。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】9 款采集器吞吐量与资源效率</h3>
  <table>
    <tr><th>采集器</th><th>100 Pod 峰值吞吐</th><th>10k/s CPU</th><th>10k/s 内存</th><th>一句话结论</th></tr>
    <tr><td><strong>vlagent</strong></td><td>143,000 条/秒</td><td>0.062 核</td><td>27.9 MiB</td><td>全场最优，线性扩展</td></tr>
    <tr><td>Fluent Bit</td><td>31,300 条/秒</td><td>0.260 核</td><td>78.1 MiB</td><td>高压 OOM，轮转断句</td></tr>
    <tr><td>Vector</td><td>25,000 条/秒</td><td>0.412 核</td><td>153.5 MiB</td><td>默认配置多坑，FD 泄漏</td></tr>
    <tr><td>OTel Collector</td><td>20,500 条/秒</td><td>0.491 核</td><td>106.8 MiB</td><td>中等性能，通用协议</td></tr>
    <tr><td>Fluentd</td><td>5,100 条/秒</td><td>—</td><td>—</td><td>老牌但已严重落后</td></tr>
    <tr><td>Filebeat</td><td>5,250 条/秒</td><td>—</td><td>—</td><td>高压 OOM 被杀</td></tr>
  </table>
  <p><strong>关键差异：</strong>vlagent 吞吐量随负载线性增长，其余采集器普遍在某个阈值后「撞墙」；Fluent Bit 和 Filebeat 内存峰值超 1GiB 被 OOM Killer 杀死。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】比跑分更吓人的正确性翻车</h3>
  <p><strong>坑 1：日志轮转「断句」</strong>——Fluent Bit 和 Vector 在轮转时未拼接上下文，把一条完整日志切成两条残缺记录转发（1 小时 10k/s 下 Fluent Bit 34 条、Vector 2 条）。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 2：Vector 新 Pod 日志静默丢失</strong>——<code>glob_minimum_cooldown_ms</code> 默认 60 秒，新 Pod 头 60 秒日志可能在被发现前已丢失，无报错。<strong>解法：</strong>调到 10 秒（Fluent Bit 默认即 10 秒）。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 3：Vector 文件描述符泄漏</strong>——高负载下打开文件速度超过处理速度，轮转旧文件堆积撑爆磁盘；重启则永久丢日志。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 4：Vector Pod 元数据丢失</strong>——Pod 删除时仍有积压未处理，标签/注解丢失导致下游路由规则失效。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑 5：采集器资源卡太死</strong>——Fluent Bit/Filebeat 在 1GiB 限制下被 OOM 杀死，压力图出现断档。<strong>解法：</strong>留够 CPU/内存余量。<strong>严重程度：</strong>小心。</p>
</div>

<div class="card">
  <h3>【决策/选型表】日志采集器选型指南</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>纯 K8s JSON 日志、零容忍丢包</td><td>vlagent 试跑</td><td>吞吐 14.3 万/s、资源最优、至少一次投递</td><td>直接换不验证</td><td>不支持多行堆栈和非 JSON 解析</td></tr>
    <tr><td>Java 堆栈等多行日志</td><td>Fluent Bit / Vector（调优后）</td><td>vlagent 暂不支持多行合并</td><td>vlagent</td><td>功能尚未开发完成</td></tr>
    <tr><td>Nginx access log 等非 JSON</td><td>Fluent Bit + grok/regex</td><td>成熟自定义解析生态</td><td>vlagent</td><td>不支持自定义格式解析</td></tr>
    <tr><td>已用 Vector 默认配置</td><td>逐项核对默认参数</td><td>glob_minimum_cooldown_ms 等有多处陷阱</td><td>默认值直接上生产</td><td>静默丢日志、FD 泄漏风险</td></tr>
    <tr><td>渐进式迁移</td><td>vlagent 与现有采集器并行</td><td>不绑定 VictoriaLogs，可转发任意下游</td><td>推倒重来</td><td>官方支持并行部署逐步替换</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】K8s 工程师落地实践</h3>
  <p><strong>核心思路：</strong>不管选哪款采集器，上线前用开源压测代码在自己环境复现一遍，比看文章更有说服力。</p>
  <p><strong>操作步骤：</strong>① clone <code>github.com/VictoriaMetrics/log-collectors-benchmark</code>；② 在 kind 集群部署待测采集器；③ 用 sequence_id 校验丢包；④ 核对 CPU/内存 request 是否留够余量；⑤ 检查 Vector 的 <code>glob_minimum_cooldown_ms</code>、<code>rotate_wait_secs</code> 等默认参数。</p>
  <p><strong>落地建议：</strong>在采集器层面按容器/日志流做限速采样，把资源留给有价值的日志；增大轮转前单文件大小，降低撞上轮转分割的概率。</p>
  <div class="highlight"><strong>vlagent 开箱能力：</strong>自动解析 JSON 和 K8s 系统日志、自动发现所有容器、LogsQL 过滤、本地磁盘缓冲、多目的地独立缓冲、至少一次投递。</div>
  <div class="pitfall"><strong>避坑：</strong>不要迷信默认配置——Vector 的 60 秒扫描冷却是为通用场景做的保守选择，高吞吐生产环境必须逐项核对。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】采集器是被低估的「隐形税」</h3>
  <p><strong>原则：</strong>日志采集器长期处在可观测性体系里「没人关心」的位置——大家讨论后端存储和索引，却很少有人认真算采集这一环吃了多少 CPU/内存，更别说验证有没有偷偷丢数据。</p>
  <p><strong>为什么重要：</strong>性能差距可以是数量级的，而正确性问题（轮转断句、静默丢日志）往往比性能问题更难被察觉——日志「看起来收到了」，内容却是坏的。</p>
  <p><strong>怎么落地：</strong>把采集器纳入 SLO 监控：不仅看吞吐，还要用 sequence_id 或等价机制定期校验端到端完整性。</p>
  <p><strong>适用边界：</strong>vlagent 目前专注 K8s JSON 场景；复杂日志格式和多行合并仍需成熟采集器。</p>
  <div class="quote">「性能差距可以是数量级的，而正确性问题往往比性能问题更难被察觉。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Fluent Bit / Vector 资深运维 / 「生态成熟度优先」派</p>
  <p class="rebuttal-text">厂商自办基准天然偏向自家产品，且零调优对 Fluent Bit 等可深度调优的采集器不公平——生产环境真正决定稳定性的是插件生态、社区支持和多年踩坑经验，不是单次实验室跑分。</p>
</div>

<div class="conclusion">
  <h2>结论与行动</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>1 核 1GB 零调优条件下，vlagent 吞吐 14.3 万条/秒，是 Fluent Bit 的 4.5 倍、Fluentd 的 28 倍，资源效率全场最优。</li>
    <li>Fluent Bit 和 Vector 在日志轮转时会产生残缺记录；Vector 默认配置存在静默丢日志、FD 泄漏、元数据丢失三大隐患。</li>
    <li>Fluent Bit 和 Filebeat 在高压下内存超 1GiB 被 OOM Killer 杀死。</li>
    <li>vlagent 适合纯 K8s JSON 场景，暂不支持多行堆栈合并非 JSON 自定义解析，可与现有采集器并行部署。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>拉取开源压测代码，在自己的 kind 集群复现验证。</li>
    <li>检查现有 Vector 的 <code>glob_minimum_cooldown_ms</code> 是否为 60 秒，评估新 Pod 日志丢失风险。</li>
    <li>核对采集器 CPU/内存 request 是否留有突发余量，避免 OOM。</li>
    <li>若场景为纯 JSON 结构化日志，安排 vlagent POC 并与现有方案并行对比。</li>
    <li>在采集器层面配置限速/采样，防止应用疯狂打印拖垮节点。</li>
  </ol>
  <p><strong>关键认知转变：</strong>日志采集器不是「装上去就忘」的基础设施——它的性能差距可以是数量级的，正确性缺陷比性能问题更隐蔽、更致命。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
