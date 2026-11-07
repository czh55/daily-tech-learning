import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'anthropic-components-of-agent-memory.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ede9fe,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#5b21b6,#3730a3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-violet{background:#ede9fe;color:#5b21b6}.tag-indigo{background:#e0e7ff;color:#3730a3}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #7c3aed}
.card h3{font-size:22px;font-weight:700;color:#6d28d9;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ede9fe,#c4b5fd);border:2px solid #a78bfa;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#5b21b6}
.node-em{background:linear-gradient(135deg,#e0e7ff,#93c5fd);border-color:#6366f1;color:#3730a3}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#5b21b6,#3730a3);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#ede9fe;padding:10px 12px;text-align:left;font-weight:700;color:#5b21b6;border-bottom:2px solid #c4b5fd}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Anthropic Agent Memory：四层架构与 Dreaming</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-violet">长期 Agent</span>
  <span class="tag tag-indigo">Dreaming</span>
  <span class="tag tag-slate">记忆质量</span>
</div>
<p class="subtitle">本文解决的核心问题是：上下文关闭后 Agent 如何避免「每次都是新人」，以及 Anthropic 如何用会话日志、记忆笔记、知识 Wiki、自动注入层与 Dreaming 整理机制，把记忆从「堆更多历史」变成「持续纠错与重组的经验系统」。</p>

<div class="map">
  <h3 style="font-size:20px;color:#6d28d9;margin-bottom:12px;text-align:center">四层记忆自下而上</h3>
  <div class="diagram">
    <div class="node">原始会话日志</div><span class="arrow-sym">↑</span>
    <div class="node node-em">记忆笔记</div><span class="arrow-sym">↑</span>
    <div class="node">知识 Wiki</div><span class="arrow-sym">↑</span>
    <div class="node node-em">自动注入上下文</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">工作时积累 → Dreaming 消化 → 下次带着更好知识出发</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：Agent Memory = 向量库 + RAG 塞满聊天记录。Anthropic 强调<strong>记忆是持续组织与改进知识的系统</strong>，且质量胜过数量（Pokémon 实验：记太多的模型反而更差）。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Agent Memory vs 外部存储</h3>
  <p><strong>在讲什么问题：</strong>跨天开发时，前一天踩坑与 API 用法如何继承？</p>
  <p><strong>关键理解：</strong>有文件/向量库不等于 Agent 会<strong>在正确时刻检索并相信</strong>正确信息；需要分层表示与整理机制。</p>
  <p><strong>和其他概念关系：</strong>RAG 偏检索已有库；Dreaming 偏<strong>改造与维护</strong>库本身。</p>
  <p><strong>怎么落地用：</strong>保留不可变原始日志 + 可版本化 Markdown 笔记 + 项目 Wiki 链接图 + 少量高优先级注入块。</p>
  <p><strong>边界说明：</strong>注入层过多会挤占任务上下文；维基与笔记需 Dreaming 或人工修剪防腐化。</p>
  <p><strong>原文依据：</strong>「Agent Memory 不应该只是一个存储历史信息的地方，而应该是一套持续组织和改进知识的系统。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Dreaming（梦境整理）</h3>
  <p><strong>核心思路：</strong>类比睡眠期海马体重放：Agent 空闲时后台重读原始日志，合并、纠错、升维到 Wiki。</p>
  <p><strong>操作步骤：</strong>① 在线阶段全量记录工具调用与用户轮次 → ② 触发空闲窗口启动 Dreaming job → ③ 对比笔记与日志发现矛盾 → ④ 更新 Wiki 与注入清单 → ⑤ 新会话优先读结构化层。</p>
  <p><strong>选型条件：</strong>多日任务、企业文档分析、需要避免重复犯错的 Coding Agent。</p>
  <p><strong>避坑：</strong>只保留摘要丢弃日志——总结错将无法溯因。</p>
  <p><strong>对比相邻方法：</strong>定时 RAG 重建索引只聚类文本，不负责「承认昨天记错了」。</p>
  <p><strong>原文引用：</strong>工作时积累经验，休息时消化经验，下次工作时带着更好的知识重新出发。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】四层职责</h3>
  <table>
    <tr><th>层次</th><th>内容</th><th>为何需要</th><th>风险</th></tr>
    <tr><td>原始日志</td><td>输入输出、工具 I/O</td><td>笔记错了可回溯</td><td>体积大，不能全注入</td></tr>
    <tr><td>记忆笔记</td><td>会话提炼的 Markdown</td><td>廉价复用经验</td><td>模型自总结可能幻觉</td></tr>
    <tr><td>知识 Wiki</td><td>互链知识页</td><td>复杂任务导航</td><td>维护不及时会过时</td></tr>
    <tr><td>自动注入</td><td>极高频关键事实</td><td>省检索 Token</td><td>过多则污染注意力</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】记忆策略</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>强模型长程探索（游戏、调研）</td><td>精选笔记 + Dreaming</td><td>Pokémon：贪记全细节更差</td><td>每场战斗单独建文件</td><td>噪声淹没信号</td></tr>
    <tr><td>企业多文档问答</td><td>Wiki + 注入核心政策</td><td>实验显示结构化记忆助复杂任务</td><td>仅平铺 chunk RAG</td><td>缺关系与纠错</td></tr>
    <tr><td>单次问答 Bot</td><td>会话内上下文即可</td><td>无跨会话价值</td><td>上全套四层</td><td>工程过度</td></tr>
    <tr><td>能力较强模型</td><td>让模型自决记什么</td><td>优于僵化「只记失败」规则</td><td>微管理每条记忆格式</td><td>限制模型判断自由度</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】记忆工程</h3>
  <p><strong>坑名：</strong>记忆越多越好。<strong>原因：</strong>Pokémon 对比实验。<strong>解法：</strong>重要性过滤 + Dreaming 合并。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>无原始日志。<strong>原因：</strong>错误笔记固化。<strong>解法：</strong>日志只追加不删，笔记可改。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>把 Memory 当一次写入。<strong>原因：</strong>无 Dreaming 则错误永久化。<strong>解法：</strong>后台整理与对照实验（DB 问答等）。<strong>严重程度：</strong>小心。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】竞争点在经验管理</h3>
  <p><strong>原则：</strong>下一场 Agent 竞争从「谁能存更多」转向「谁更善于管理和利用经验」。</p>
  <p><strong>为什么重要：</strong>长期自主 Agent 的瓶颈是跨会话学习，不是单次推理智商。</p>
  <p><strong>怎么落地：</strong>按四层建目录约定；为 Dreaming 预留算力窗口；用真实多日语料评测重复错误率。</p>
  <p><strong>适用边界：</strong>短会话客服仍以 prompt + KB 为主；Dreaming 需离线周期。</p>
  <p><strong>原文支撑：</strong>小结直指经验管理能力是 Agent 的下一赛场。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：无状态架构 / 每次冷启动派</p>
  <p class="rebuttal-text">四层记忆与 Dreaming 把系统复杂度、隐私留存和「记错还注入」的风险全扛在运维上——对多数产品，可预测的短会话加检索比养一条会做梦的长期记忆更便宜也更安全。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Agent 跨会话短板不是缺存储，而是缺组织、纠错与复用经验的能力。</li>
    <li>四层架构：日志为真源，笔记为摘要，Wiki 为地图，注入为高频捷径。</li>
    <li>Dreaming 在空闲期重放经历，区别于传统 RAG 的静态检索。</li>
    <li>记忆质量重于数量；强模型适合自主判断记什么。</li>
    <li>Pokémon、数据库与企业文档实验支撑「整理机制」比「堆历史」关键。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>为 Coding Agent 划分 logs/、notes/、wiki/ 与 inject.md 四类目录。</li>
    <li>实现最小 Dreaming：夜间 job 读当日日志并重写 notes 索引。</li>
    <li>评测指标加入「同一错误重复次数」而不仅是任务成功率。</li>
    <li>阅读 Anthropic《The components of agent memory》原文对照四层图。</li>
    <li>限制自动注入条数与 Token 上限，防挤占任务上下文。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>好的 Agent 记忆像人类学习：保留可溯源经历、在安静时整合、敢于修正昨天的自己——而不是把聊天记录当硬盘分区。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
