import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'anthropic-scion-agent-scale-source-control.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#064e3b,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-orange{background:#ffedd5;color:#9a3412}.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #059669}
.card h3{font-size:22px;font-weight:700;color:#047857;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#ecfdf5;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#065f46;border-left:4px solid #10b981}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ecfdf5,#a7f3d0);border:2px solid #6ee7b7;border-radius:16px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#065f46}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#064e3b,#059669);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#047857;border-bottom:2px solid #cbd5e1}
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
<h1>智能体规模下重写源码管理：Anthropic Scion</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">Scion</span>
  <span class="tag tag-blue">Monorepo</span>
  <span class="tag tag-purple">Agent 规模</span>
  <span class="tag tag-orange">变更集</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 AI 写代码速度远超人类、日合并从约 2500 次涨到 3 万次以上时，为人类离线克隆设计的 Git 为何成为瓶颈，以及「永远在线的客户端」应如何重塑版本控制、CI 与工程师角色。</p>

<div class="map">
  <h3 style="font-size:20px;color:#047857;margin-bottom:12px;text-align:center">瓶颈转移：写代码 → 版本控制 / 构建 / CI</h3>
  <div class="diagram">
    <div class="node">Agent 高频提交</div>
    <span class="arrow-sym">→</span>
    <div class="node-blue">Git 镜像 / 浅克隆续命</div>
    <span class="arrow-sym">→</span>
    <div class="node">Scion：服务端计算<br>瘦客户端 + 内容寻址</div>
    <span class="arrow-sym">→</span>
    <div class="node">API 化 bisect / 回滚<br>可选稀疏工作副本</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「Git 不行了，全行业该换 Scion」。Anthropic 明确 Scion 非 Git 通用替代品、不打算开源；Git 对绝大多数仓库仍是最优解，问题出在<strong>超大 monorepo + 永远在线的 Agent/CI 客户端</strong>把 Git 当中心化系统用时的流量与维护成本。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】变更集与 Git 提交的本质差异</h3>
  <p><strong>在讲什么问题：</strong>传统 commit 指向目录树；Scion 的 changeset 是 WAL 条目，记录相对父节点的文件变更列表 + 内容寻址 blob 指针。</p>
  <p><strong>关键理解：</strong>提交在服务端完成、无 push、无 packfile 接收锁；成本只与改动大小相关，与仓库总历史量解耦。</p>
  <p><strong>和其他概念关系：</strong>blame、路径历史等由<strong>派生数据</strong>递归计算，可随时新增索引类型而不改客户端协议。</p>
  <p><strong>怎么落地用：</strong>多数团队继续优化 Git 浅克隆/稀疏检出；仅当日合并与检出 PB 级流量成为硬瓶颈时再对标 Piper/Sapling/Scion 思路。</p>
  <p><strong>边界说明：</strong>依赖离线完整克隆、强分支/标签工作流的团队，Scion 模型不适用。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Scion 六条设计原则（落地对照）</h3>
  <p><strong>核心思路：</strong>默认客户端永远在线；服务端不对称承担历史、blame、合并、变基；一切水平扩展、无单点物化仓库。</p>
  <p><strong>操作步骤：</strong>1）CI 优先问服务端 diff，避免全量检出 → 2）稀疏/虚拟化工作副本只拉必要目录 → 3）用 RPC 暴露与 CLI 同等的查询供自动化 bisect → 4）三层缓存（客户端 / 区域 scion-cache / 上游）隔离故障域。</p>
  <p><strong>选型条件：</strong>日千万级检出、主分支历史近百 GB、客户端几乎全是 Agent 与 CI 时。</p>
  <p><strong>避坑：</strong>镜像越多快照越滞后；在部分克隆上维持 blame 会越来越贵。</p>
  <div class="highlight"><strong>效果（原文数据）：</strong>基础设施 CPU/内存约为原 Git 镜像体系的 1/200；检出快两个数量级；仅 CI 节省约 25% CPU；缓存层命中率 &gt;99%。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】智能体规模下的流程陷阱</h3>
  <p><strong>坑名：</strong>仍用人类时代的合并队列全局锁思维。</p>
  <p><strong>原因：</strong>成千上万变更在测试期并行合并时，「排队串行」与吞吐目标冲突。</p>
  <p><strong>解法：</strong>Anthropic 转向合并后与部署前的自动化测试，接受更高冲突率并由 Agent 快速修冲突——需配套测试与回滚。</p>
  <p><strong>严重程度：</strong>对日 3 万合并：致命若不改流程。</p>
  <div class="pitfall"><strong>坑名：</strong>对抗式代码评审过度谨慎，导致 Agent 对内部服务堆叠无效校验——工程师需对 Claude 说「不」，审意图而非逐行读码。</div>
</div>

<div class="card">
  <h3>【决策/选型表】超大 monorepo 源码管理路线</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>中小仓库 + 人类为主</td><td>Git + 托管平台</td><td>生态成熟、离线友好</td><td>自研 VCS</td><td>ROI 为负</td></tr>
    <tr><td>超大单仓、云客户端</td><td>借鉴 Piper / Sapling / Scion 思路</td><td>中心化服务 + 极小本地副本</td><td>无限堆 Git 镜像</td><td>磁盘与快照滞后</td></tr>
    <tr><td>Agent 写码、人定设计</td><td>Harness + superfan 组件守护</td><td>遥测/日志 Agent 盯单组件</td><td>只靠传统告警</td><td>维度太薄</td></tr>
    <tr><td>摄取管线性能</td><td>让强模型重写热点路径</td><td>Mythos 重写摄取：内存降 20×、快 4×</td><td>仅人力微调</td><td>与合并增速不匹配</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】Git 分布式 vs Scion 在线中心化</h3>
  <table>
    <tr><th>维度</th><th>Git</th><th>Scion</th><th>一句话</th></tr>
    <tr><td>客户端</td><td>完整克隆、可离线</td><td>瘦客户端、有界缓存</td><td>Agent 时代「离线优势」变负担</td></tr>
    <tr><td>提交</td><td>本地 commit + push</td><td>服务端无锁 changeset</td><td>无 push 争用</td></tr>
    <tr><td>检出</td><td>packfile 大块传输</td><td>按对象可缓存 RPC</td><td>稀疏检出为默认能力</td></tr>
    <tr><td>适用面</td><td>通用</td><td>Anthropic 级 monorepo</td><td>非全行业模板</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】智能体规模软件工厂</h3>
  <p><strong>原则：</strong>写代码趋近零成本后，为人类速度设计的 VCS、构建、CI、评审会依次成瓶颈。</p>
  <p><strong>怎么落地：</strong>审计 CI 耗时有多少在拉代码；问 Agent 数量翻 10 倍时哪环先塌；关注 Anthropic 向 Git 生态反哺的服务端 RPC、协商协议改进。</p>
  <p><strong>适用边界：</strong>7 人 5 个月迁移依赖极强算力与内部定制；普通公司应优化现有链而非复制 Scion。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Git 保守派 / 「镜像加稀疏检出够用」</p>
  <p class="rebuttal-text">当每天数千万次检出乘以数十 GB 工作副本时，优化镜像只是续命，无法把提交成本从仓库总量解耦，Agent 吞吐仍会被 packfile 与锁吃掉。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>瓶颈已从写代码转向为人类规模设计的基础设施。</li>
    <li>Scion 用在线瘦客户端、变更集、派生数据与三层缓存应对日 3 万合并。</li>
    <li>工程师价值在设计取舍与约束 Agent，而非与 Claude 比写码。</li>
    <li>合并队列与评审范式在 Agent 规模下需重想。</li>
    <li>Scion 非 Git 替代品，但预示 6–12 个月内更多团队会遇到同类问题。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>统计 CI 拉取代码耗时占比。</li>
    <li>评估 monorepo 镜像数量与主干滞后时间。</li>
    <li>为高频 Agent 任务设计服务端 diff API，减少全量检出。</li>
    <li>评审流程区分「审意图」与「读每一行」。 </li>
    <li>跟踪 Git 社区服务端架构讨论，而非盲目自研 VCS。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>版本控制的第一性问题从「如何分布式共享历史」变成「如何让永远在线的 Agent 廉价、安全地提交与验证变更」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
