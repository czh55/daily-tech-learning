import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'multiplayer-ai-manifesto.svg');

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
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#1e40af}`;

const body = `
<h1>团队共享同一个 Agent：Superconductor 创始人一份宣言，说透了「多人 AI」的五条铁律</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">多人 AI</span>
  <span class="tag tag-green">Agent 协作</span>
  <span class="tag tag-orange">语境税</span>
  <span class="tag tag-purple">Multiplayer AI Workspace</span>
</div>
<p class="subtitle">本文解决的核心问题是：AI 办公为何从 Slack/Google Docs 式共享协作倒退成孤岛式私聊框——以及 Sergey Karayev 提出的五条原则与五个落地陷阱，如何为 Agentic 办公的下一阶段划定北极星。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">多人 AI 五条原则关系图</h3>
  <div class="diagram">
    <div class="node">永不复制粘贴<br>共享同一会话</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">开着门工作<br>共享最佳实践</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">持续进化<br>Skill 沉淀</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">人不是路由器<br>Agent 幕僚长</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">底层支撑：没有任何项目从零开始（云端托管 + 可唤醒上下文）</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Claude/ChatGPT 团队版已经是多人 AI 了」。宣言明确：团队版只是共享 Prompt 模板和集成配置，无法像 Slack 那样加入同事的 Agent 对话——上下文仍锁死在孤立、不可检索的短生命周期会话里。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】语境税与协作倒退</h3>
  <p><strong>在讲什么问题：</strong>团队协作软件从邮件→Slack→Google Docs 一路「越来越会共享」，但 AI 却让我们开历史倒车——每人一个私有对话框。</p>
  <p><strong>核心机制：</strong>每一次「复制—粘贴—重新讲背景」的人工中转，产生看不见但真实存在的 context tax（语境税）；Agent 对话框是「密室」，结论和弯路默认只有发起者知道。</p>
  <p><strong>关键理解：</strong>哈佛商学院对 776 名宝洁员工的实验证明：「团队 + AI」组合拿到顶尖 10% 方案的比例最高；AI 不只是工具，而是打破专业壁垒的 cybernetic teammate（赛博队友）。</p>
  <p><strong>典型场景：</strong>Priya 用 Claude 写报告 → Slack 转 Marcus → Marcus 丢进 ChatGPT 加工 → 邮件发回——四轮中转，背景重复四次。</p>
  <p><strong>边界说明：</strong>把 Agent 拉进 Slack 群（如 Claude Tag）是可行起点，但大量工作发生在邮件、Docs、GitHub、Salesforce 等 Slack 之外——真正的多人 AI 需从每个工作界面接入同一会话。</p>
  <div class="quote">原文：「每一次复制粘贴式的人工中转，都在支付看不见的语境税。」</div>
</div>

<div class="card">
  <h3>【心法/原则卡】多人 AI 宣言五条铁律</h3>
  <p><strong>原则一 Never copy-and-paste：</strong>Agent 长在工作现场，所有参与者直接和同一个 Agent 对话，工具权限与团队成员对齐。</p>
  <p><strong>原则二 Work with the door open：</strong>共享会话让最佳实践快速扩散；Shopify CEO 称此为「车间式学习」——River 只能在公开 Slack 频道访问。</p>
  <p><strong>原则三 Continuously improve：</strong>好 Prompt 应被全团队学到；纠正自动沉淀为可复用 Skill；反复执行的工作流应自动生成 benchmark 并跟踪得分。</p>
  <p><strong>原则四 People are not routers：</strong>Agent 已知答案不应再问人；追进度、转发答案由 Chief of Staff Agent 完成，人只做高价值决策。</p>
  <p><strong>原则五 Nothing starts from scratch：</strong>云端托管会话，项目可原地续做；每份产出背后有可唤醒的 Agent 会话；新人第一天即生产力在线。</p>
  <div class="highlight"><strong>落地建议：</strong>对照五条原则审计当前团队 AI 工作流——从「每人一个私聊框」迁移到「共享会话 + 云端托管 + Skill 沉淀」三步走。</div>
  <p><strong>适用边界：</strong>五条是北极星，截至目前没有任何平台能同时满足全部五条——Superconductor、Buzz、Claude Tag、Viktor 各探索不同切片。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】单人 AI vs 多人 AI Workspace</h3>
  <table>
    <tr><th>对比维度</th><th>单人 AI（现状）</th><th>多人 AI（目标）</th><th>一句话结论</th></tr>
    <tr><td>会话归属</td><td>个人设备 / 私聊框</td><td>云端托管，团队共享</td><td>合盖即停摆 vs 随时接入</td></tr>
    <tr><td>上下文传递</td><td>复制粘贴人工中转</td><td>同一会话直接追问</td><td>语境税 vs 零损耗协作</td></tr>
    <tr><td>经验沉淀</td><td>锁在个人会话里</td><td>Prompt/Skill 全团队复用</td><td>各自摸索 vs 持续进化</td></tr>
    <tr><td>权限模型</td><td>设备主人全部权限</td><td>最低共享面收窄</td><td>个人权限 ≠ 企业安全</td></tr>
    <tr><td>产出可追溯</td><td>短生命周期不可检索</td><td>数月后可唤醒续做</td><td>从零开始 vs 原地接力</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】多人 AI 落地路径选型</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>研发团队 Coding Agent</td><td>Superconductor 类多人共用平台</td><td>手机/网页管理团队 Claude Code / Codex 任务</td><td>每人本地跑 Agent</td><td>无法接入、合盖停摆、权限隐患</td></tr>
    <tr><td>快速起步 Slack 协作</td><td>Claude Tag 等 @Agent 接口</td><td>最易实现，宣言认可为起点</td><td>当作完整方案</td><td>大量工作在 Slack 之外</td></tr>
    <tr><td>受监管 / GDPR 行业</td><td>云端沙箱 + 完整审计日志</td><td>必须回答四问：谁执行、谁发起、访问了什么、改了什么</td><td>靠人工回忆复盘</td><td>审计人员需要黑匣子记录</td></tr>
    <tr><td>多模型偏好团队</td><td>模型无关架构</td><td>Claude/ChatGPT/开源各有所爱，最强模型几周易主</td><td>绑死单一厂商</td><td>2026.6 Anthropic 一夜暂停 Claude 访问的前车之鉴</td></tr>
  </table>
  <div class="relation"><strong>YC 方向印证：</strong>「Software for Agents」与「Company Brain」核心判断一致——模型能力非瓶颈，稀缺的是公司上下文能否沉淀并持续喂给每个 Agent。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】多人 AI 落地五个坑</h3>
  <p><strong>坑一 Agent 跑在笔记本上：</strong>团队无法接入，合盖停摆，且继承设备主人全部访问权限——安全隐患。解法：云端托管。</p>
  <p><strong>坑二 不给 Agent 建防火墙：</strong>恶意邮件/文档可诱导 prompt injection 泄露敏感数据。解法：每个 Agent 访问范围明确限定，需受控云端沙箱。</p>
  <p><strong>坑三 权限取并集而非交集：</strong>新同事加入已有敏感信息的共享会话时，Agent 应只用所有成员都有权访问的集成和数据。严重程度：致命。</p>
  <p><strong>坑四 绑死单一模型厂商：</strong>最强模型称号几周易主，绝大多数任务用不上最强。2026.6 Anthropic 配合出口管制一夜暂停 Claude 访问——全公司工作流受影响。</p>
  <p><strong>坑五 治理审计当可选项：</strong>一年后仍须回答四问（谁执行、谁发起、访问了什么、改了什么）。受监管行业完全没有商量余地。</p>
  <div class="pitfall"><strong>不可退让的一点：</strong>无论自建、开源还是采购，必须拥有自己的数据——团队沉淀的经验、Skill 与评测集应真正属于你，而非锁死在平台里。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Superconductor 式多人 Agent 工作流</h3>
  <p><strong>方法名：</strong>云端多人共用 Coding Agent + Chief of Staff 幕僚长 · 标签：Agentic 办公 / 团队协作</p>
  <p><strong>核心思路：</strong>所有 Claude/Codex 会话跑在云端，团队随时加入；会议中 Agent 后台派生子任务；幕僚长 Agent 汇总待审批事项并推进卡点。</p>
  <p><strong>操作步骤：</strong>1) 将 Agent 从个人设备迁移到云端沙箱 → 2) 为每个 Agent 配置访问防火墙 → 3) 按最低共享面设置权限 → 4) 启用公开频道/共享会话（Shopify River 模式）→ 5) 建立 Skill 沉淀与 benchmark 自动追踪 → 6) 部署审计日志满足治理四问</p>
  <div class="highlight"><strong>落地建议：</strong>Shopify 一个月内八分之一代码合并请求由 River 参与——从公开频道 AI 协作开始，逐步扩展到 Docs/GitHub/Salesforce 全工作界面。</div>
  <div class="quote">Richard Hamming 佐证：关门办公短期效率高，十年后你可能已不清楚什么才是真正值得做的问题——私聊 AI 同理。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：隐私倡导者 · 「思考空间应私密」派</p>
  <p class="rebuttal-text">把 AI 对话全公开共享，短期消灭语境税，长期却让每个人失去安全的探索空间——真正的高价值思考恰恰发生在关门的办公室里。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>AI 协作正经历逆向进化：从共享办公退回孤岛式私聊，每次复制粘贴都在交语境税。</li>
    <li>哈佛商学院实验证明「团队 + AI」产出最优；Shopify River 一个月参与八分之一代码合并，验证公开协作可行性。</li>
    <li>宣言五条原则（不复制粘贴、开门工作、持续进化、人不是路由器、不从零开始）是北极星，尚无平台全部满足。</li>
    <li>落地五坑：笔记本部署、无防火墙、权限并集、单一厂商绑定、审计缺失——云端沙箱 + 最低共享面 + 数据所有权不可退让。</li>
    <li>Agentic AI 下一站竞争焦点是「房间」而非「框」——所有人和所有 Agent 能随时推门进去共事的 Multiplayer AI Workspace。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>审计团队当前 AI 工作流：统计每周复制粘贴中转次数，量化语境税成本。</li>
    <li>选取一个试点项目，将 Agent 会话迁移到云端托管，邀请团队成员加入同一会话。</li>
    <li>为 Agent 配置访问防火墙和最低共享面权限，禁止跑在个人笔记本上处理敏感数据。</li>
    <li>建立 Prompt/Skill 沉淀机制：好经验自动复用，纠正自动转 Skill，反复工作流自动生成 benchmark。</li>
    <li>部署审计日志，确保一年后能回答「谁执行、谁发起、访问了什么、改了什么」四问。</li>
  </ol>
  <p><strong>关键认知转变：</strong>过去一年行业把精力花在「让单个 Agent 更聪明」，但 Agentic 办公的真正瓶颈是「一群人和一群 Agent 如何在同一空间共事」——竞争焦点从更强的对话框，转向所有参与者能随时推门进去的房间。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
