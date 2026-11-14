import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'ai-era-cloud-native-paradigm-reversed-agents-are-pets.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#1e40af,#0891b2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-orange{background:#ffedd5;color:#9a3412}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:14px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#1e40af}
.node-em{background:linear-gradient(135deg,#1e40af,#0891b2);border-color:#60a5fa;color:#f0f9ff}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#0e7490);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 12px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
.highlight{background:#eff6ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#1e40af;border-left:4px solid #3b82f6}
.pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}`;

const body = `
<h1>云原生范式反转：长期 Agent 是 Pet，不是 Cattle</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Steve Yegge</span>
  <span class="tag tag-green">Wheelhouse</span>
  <span class="tag tag-orange">组织治理</span>
</div>
<p class="subtitle">本文解决的核心问题是：为什么在 Kubernetes 式「可替换无状态」大行其道之后，承担长期职责的 AI Agent 反而需要 Pet 式身份、记忆与组织治理，以及企业应如何同时驾驭 Wheelhouse 与 Counting House 两套模式。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">从管计算资源到管数字员工</h3>
  <div class="diagram">
    <div class="node">云原生 Cattle</div><span class="arrow-sym">⇄ 反转</span>
    <div class="node node-em">长期 Agent · Pet</div><span class="arrow-sym">+</span>
    <div class="node">批量任务 Cattle</div>
  </div>
  <div class="diagram" style="margin-top:8px">
    <div class="node">Factory 流水线</div><span class="arrow-sym">↔</span>
    <div class="node node-green">Entourage 幕僚</div><span class="arrow-sym">→</span>
    <div class="node">Seat 身份层</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">Session 是一天，Seat 才是岗位；实现趋零后品味与判断成为瓶颈</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：凡是 Agent 都应无状态、随时杀掉重建。原文强调复杂创造与长期协作需要连续性；标准化大批量工单仍适合 Session 式 Cattle（Counting House）。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Pets vs Cattle 为何在 Agent 上反转</h3>
  <p><strong>在讲什么问题：</strong>十多年前用 Cattle 解决配置漂移与不可重建服务器；AI 长期协作者却需要名字、职责与历史。</p>
  <p><strong>关键理解：</strong>单次任务 Agent 像 Pod，可替换；架构、安全、产品等长期角色若每天销毁，损失的是上下文与协作关系。</p>
  <p><strong>和其他概念关系：</strong>云原生管无状态计算单元；AI 工厂管有记忆的数字员工。</p>
  <p><strong>怎么落地用：</strong>为长期角色建 Seat（岗位），与底层模型 Session 解耦；标准化工单仍走无状态流水线。</p>
  <p><strong>边界说明：</strong>纯批处理、边界清晰任务不要强行 Pet，否则治理成本爆炸。</p>
  <p><strong>原文依据：</strong>「我们曾经花了十多年让服务器变成 Cattle；现在，却开始重新把 Agent 养成 Pet。」</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Seat 与 Session 的分层</h3>
  <p><strong>核心机制：</strong>Session 是一次工作会话；Seat 是持久角色，可换模型而不丢身份。</p>
  <p><strong>典型场景：</strong>安全 Agent 今日下班、明日换模型仍继承职责与历史。</p>
  <p><strong>关键理解：</strong>未来架构应把身份、记忆与运行实例分离。</p>
  <p><strong>原文依据：</strong>「Session 是 Agent 的一天，Seat 才是 Agent 的身份。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Wheelhouse：从 Gas Town 到专属 AI 工厂</h3>
  <p><strong>标签：</strong>复杂遗留系统 · 游戏 Wyvern · 约 50 并行 Agent</p>
  <p><strong>操作步骤：</strong>① 从真实产品出发而非通用框架；② Agent 参与编码、CR、测试、Slack 平衡、Discord 玩家、邮件与互管；③ Harness 与业务深度绑定。</p>
  <p><strong>选型条件：</strong>探索性软件开发、长期领域上下文、需要 Entourage 讨论决策时选 Wheelhouse 路线。</p>
  <p><strong>避坑：</strong>不要先造可复制给所有人的通用 Harness，Yegge 强调与具体应用演化。</p>
  <p><strong>对比相邻方法：</strong>与 Counting House 相对，后者面向退款/工单等标准化大批量。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Factory + Entourage 双层次</h3>
  <p><strong>核心思路：</strong>Factory 执行 CI/CD 式交付；Entourage 是与管理者长期协作的核心 Agent 幕僚团。</p>
  <p><strong>操作步骤：</strong>新功能先与产品/架构 Agent 迭代方案，再下发 Factory 执行；机械化能力可平台化，幕僚团难标准化。</p>
  <p><strong>落地建议：</strong>把可审计的调度、发布、版本管理沉入 Factory；把项目偏好与目标留在 Entourage 配置与人机协作 ritual 里。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】Wheelhouse vs Counting House</h3>
  <table>
    <tr><th>维度</th><th>Wheelhouse</th><th>Counting House</th><th>一句话结论</th></tr>
    <tr><td>Agent 定位</td><td>长期数字员工</td><td>一次性执行器</td><td>创造 vs 吞吐</td></tr>
    <tr><td>身份</td><td>持久 Seat</td><td>无持久身份</td><td>Pet vs Cattle</td></tr>
    <tr><td>记忆</td><td>长期积累+治理</td><td>仅任务上下文</td><td>后者防漂移更简单</td></tr>
    <tr><td>自主权</td><td>较高</td><td>严格受限</td><td>与任务风险匹配</td></tr>
    <tr><td>任务类型</td><td>复杂探索</td><td>标准化大批量</td><td>企业两套并存</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】Session vs Seat</h3>
  <table>
    <tr><th>维度</th><th>Session</th><th>Seat</th><th>结论</th></tr>
    <tr><td>生命周期</td><td>短期</td><td>长期</td><td>模型升级不换岗</td></tr>
    <tr><td>记忆</td><td>当前+交接</td><td>累积工作记忆</td><td>防 Garbage Mountain 需淘汰</td></tr>
    <tr><td>职责</td><td>当前任务</td><td>长期职责</td><td>治理像管员工</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】该用 Pet 还是 Cattle Agent</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>架构/安全长期Owner</td><td>Seat + 记忆治理</td><td>连续性重于替换</td><td>每日新 Session</td><td>丢决策史</td></tr>
    <tr><td>客服退款批量单</td><td>Counting House Session</td><td>可度量、限权</td><td>长期 Pet</td><td>成本与合规</td></tr>
    <tr><td>一次性改 Bug</td><td>无状态 Agent</td><td>边界清晰</td><td>建 Seat</td><td>过度设计</td></tr>
    <tr><td>50 Agent 工厂</td><td>Factory+治理+人类节奏</td><td>防规则锁死</td><td>追求最大吞吐</td><td>人类判断成瓶颈</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Pet 化带来的组织风险</h3>
  <p><strong>坑名：</strong>角色认知混乱（Swallow vs 人类 CoS）。<strong>原因：</strong>Agent 有长期身份会质疑岗位。<strong>解法：</strong>明确职责边界文档与人类对照。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>过度解读管理者反馈（Lark「不够安静」）。<strong>解法：</strong>反馈分级：闲聊 vs 正式政策。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>随口抱怨被写入规范导致工厂锁死。<strong>解法：</strong>规则版本管理+定期修剪。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>记忆只写不删形成 Garbage Mountain。<strong>解法：</strong>筛选、遗忘、权限边界、负载监控。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>安全队列积压时全员盲等。<strong>解法：</strong>人类干预与例外通道。<strong>严重程度：</strong>致命。</p>
  <div class="pitfall">Pet 不是「更可爱就更好」，而是把组织管理复杂度重新请回工程师办公桌。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】Implementation free, taste expensive</h3>
  <p><strong>原则：</strong>实现成本趋零后，竞争点在品味、创造力与判断力。</p>
  <p><strong>为什么重要：</strong>Agent 能改遗留代码却难造优秀美术与叙事；玩家排斥平庸 AI 内容。</p>
  <p><strong>怎么落地：</strong>定义值得解决的问题 → 多方案生成 → 人类评估方向 → 反馈循环 → 验收体验。</p>
  <p><strong>适用边界：</strong>不盲目追求十倍产出；工厂节奏须匹配人类可承受的复杂决策带宽。</p>
  <p><strong>原文支撑：</strong>「Implementation becomes free, but taste becomes expensive.」</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：云原生 SRE / 「万物皆可水平扩展」派</p>
  <p class="rebuttal-text">给 Agent 养 Pet 只是把配置漂移搬进 prompt 和记忆堆，Seat 越多越不可重建，终会像十年前 named server 一样在事故里手拉手殉爆。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>云原生 Cattle 仍适合无状态计算与标准化 Agent 工单；长期复杂协作需要 Pet 式身份与记忆。</li>
    <li>Seat 将 Agent 从 Session 升格为岗位，模型实例可换而职责延续。</li>
    <li>AI 软件工厂 = Factory 执行 + Entourage 决策，且 Harness 应与具体产品共同演化。</li>
    <li>Pet 化引入角色、规则、记忆治理等「人的管理」问题，必须配套修剪与人工纠偏。</li>
    <li>品味与问题导向成为新瓶颈，吞吐不应超过人类判断能力。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>盘点团队中哪些 Agent 角色需要 Seat，哪些任务保持无状态 Session。</li>
    <li>为长期 Agent 设计身份、记忆分层与遗忘策略，避免 Garbage Mountain。</li>
    <li>区分 Factory 自动化与 Entourage 协作 ritual，别把临时口头抱怨写入永久规范。</li>
    <li>对标准化业务评估 Counting House 模式而非照搬 Wheelhouse。</li>
    <li>在代码实现交给 Agent 后，把时间投入到问题定义、方案品评与用户体验验收。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>软件工程正从管理可替换的计算资源，转向管理有记忆、有关系的数字员工；你的下一项核心技能可能是 AI 工厂的管理者而不仅是工具使用者。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');