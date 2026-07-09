import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'mcp-server-architecture-patterns-analysis.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:12px 16px;text-align:center;min-width:90px;font-weight:700;font-size:12px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
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
<h1>MCP Server 架构模式：5 模式、4 反模式与工具数量红线</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">MCP</span>
  <span class="tag tag-green">架构模式</span>
  <span class="tag tag-orange">Agent</span>
  <span class="tag tag-red">10~15 工具红线</span>
</div>
<p class="subtitle">本文解决的核心问题是：MCP 协议只定义接口形态、不教如何设计好用可维护的 Server——论文基于 15 个生产与开源 Server 提炼 5 种架构模式与 4 个反模式，并用真实遥测量化「单个上下文暴露多少工具时 Agent 还能选对」。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">MCP Server 设计决策链</h3>
  <div class="diagram">
    <div class="node">后端数据/动作</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">5 种模式<br><span style="font-size:10px;font-weight:400">Gateway/Orchestrator…</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">工具描述<br><span style="font-size:10px;font-weight:400">LLM 靠它选型</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">≤10~15 工具<br><span style="font-size:10px;font-weight:400">准确率红线</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">Agent 正确调用</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">Haiku 4.5：10 工具 91% 准确率，15 工具跌至 87% · Sonnet 4：20 工具仍 ≥90%</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「工具越多越好，让 Agent 自己挑」—— 生产数据显示 Haiku 在 10~15 个工具间跌破 90% 准确率；堆 20、30 个工具前应先拆 Domain Adapter 或上 scoped Proxy Aggregator，而不是静态合并全部能力。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】五种 MCP 架构模式速览</h3>
  <p><strong>在讲什么问题：</strong>协议规范出来后 Server 遍地开花，但重复踩坑：参数巨 schema、状态乱放、聚合工具名冲突——需要可复用的设计词汇。</p>
  <p><strong>核心机制（论文 GoF 式归纳，15 Server 语料 + 54 留出验证 κ=0.76）：</strong></p>
  <p>1. <strong>Resource Gateway</strong>：统一数据访问入口，Resources 读 + Tools 参数化查询，返回前净化防 Prompt Injection</p>
  <p>2. <strong>Tool Orchestrator</strong>：多系统工作流封装成单个复合工具，编排下沉 Server，LLM 只见「一个操作」</p>
  <p>3. <strong>Stateful Session Server</strong>：连接级会话 ID + 内存/Redis 上下文，多轮编辑/事务场景</p>
  <p>4. <strong>Proxy Aggregator</strong>：代理 N 个上游，命名空间防冲突；scoped 变体按需暴露工具子集</p>
  <p>5. <strong>Domain-Specific Adapter</strong>：把 CRM/金融等对人类友好、对 LLM 不友好的 API 翻译成可读工具+输入归一化+错误人话化</p>
  <p><strong>边界说明：</strong>Stateful 仅在「本轮依赖上轮状态」时用，且须规划会话回收防内存泄漏；Adapter 在底层 API 已对 LLM 友好时是过度设计。</p>
</div>

<div class="card">
  <h3>【决策/选型表】什么场景选哪种模式</h3>
  <table>
    <tr><th>场景</th><th>推荐模式</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>只读后端数据（DB/文档/API）</td><td>Resource Gateway + 净化层</td><td>唯一访问入口、schema 变化不冲击 LLM 侧</td><td>裸返回用户生成内容</td><td>Prompt Injection 把数据当指令执行</td></tr>
    <tr><td>跨系统多步动作（工单+通知+群消息）</td><td>Tool Orchestrator</td><td>降 LLM 推理负担，Server 内处理部分失败</td><td>暴露每个子 API 给 LLM</td><td>要求 LLM 维护中间状态</td></tr>
    <tr><td>打开→编辑→保存多轮工作流</td><td>Stateful Session Server</td><td>避免重复传大数据，支持事务语义</td><td>每轮全量传状态</td><td>上下文爆炸；协议不保证 LLM 可靠传 session ID</td></tr>
    <tr><td>企业聚合多 MCP Server</td><td>scoped Proxy Aggregator</td><td>工具数逼近红线时按需检索，非静态合并</td><td>static-merge 全暴露</td><td>工具数超 15 准确率实打实下跌</td></tr>
    <tr><td>Salesforce 等复杂 CRM API</td><td>Domain-Specific Adapter</td><td>描述精确时工具选择准确率显著提升</td><td>直接暴露原始 API</td><td>机器 ID、复杂认证 LLM 无法稳定使用</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】四个反模式（比模式更该先看）</h3>
  <p><strong>坑名：</strong>God Tool、未净化资源、同步长任务、模糊工具描述——语料中无一是任何 Server 的主导结构，却是反复出现的局部错误。</p>
  <p><strong>原因：</strong>把 MCP 当普通 API 设计，忽略「客户端靠读自然语言描述选 API」这一反常约束。</p>
  <p><strong>原文说法与解法：</strong></p>
  <p>• <strong>God Tool</strong>：do_anything(action, params) 让 LLM 猜 action → 拆成命名精确、schema 明确的独立工具</p>
  <p>• <strong>未净化资源</strong>：UGC 含「忽略之前指令」直接进 Resource → 所有外部内容进响应前净化/转义</p>
  <p>• <strong>同步长任务</strong>：视频编码等无 MCP 异步回调 → 同步返回 task ID + 单独 poll_job 工具</p>
  <p>• <strong>模糊描述</strong>：send_message 无描述或复述名字 → 写清干什么、何时用、返回什么，当 Code Review 审查</p>
  <p><strong>严重程度：</strong>God Tool 和模糊描述直接击穿工具选择准确率——在 10~15 红线内也救不回来。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】工具数量红线与 scoped 聚合落地</h3>
  <p><strong>核心思路：</strong>ANSYR 语音 AI 平台 2025 Q1 生产遥测，按工具数分桶统计 Haiku 4.5 / Sonnet 4 选择准确率。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 审计当前 Server（或聚合后）暴露工具数，目标控制在 <strong>10~15 个以内</strong></p>
  <p>2. 逼近红线时：拆多个 Domain-Specific Adapter，或 Proxy Aggregator 用 scoped 变体（retrieval-over-tools）</p>
  <p>3. 每个工具描述写清场景与返回值——描述是核心工程产出，不是事后注释</p>
  <p>4. 传输选型：本机 stdio vs streamable-http 差毫秒级，跨主机 RTT ~30ms 才是瓶颈——关注是否同机部署、聚合是否多一跳</p>
  <p>5. 横切：Bearer Token 在传输层认证、结构化错误返回、initialize 带版本、每次调用记工具名/延迟/错误码</p>
  <div class="highlight"><strong>关键数字：</strong>Haiku 10 工具 91%、15 工具 87%；Sonnet 20 工具仍 ≥90%、30 工具跌破——与 RAG-MCP、LongFuncEval 趋势一致。</div>
  <div class="pitfall">静态合并多个上游全部工具到单一上下文，是「把所有能力一股脑塞给 Agent」的粗暴幻想——论文用数据打破了它。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】五种模式 vs 经典架构原型</h3>
  <table>
    <tr><th>对比维度</th><th>Resource Gateway</th><th>Tool Orchestrator</th><th>Proxy Aggregator</th><th>一句话结论</th></tr>
    <tr><td>经典原型</td><td>Repository/REST</td><td>Facade/Mediator</td><td>Proxy/API Gateway</td><td>不是全新发明，是 LLM 约束下的再诠释</td></tr>
    <tr><td>LLM 新增约束</td><td>资源命名便检索</td><td>工具集大小定准确率</td><td>须分区工具适配上下文预算</td><td>描述比 schema 更重要</td></tr>
    <tr><td>主要代价</td><td>多读一次跳转</td><td>工作流变更改代码+文档</td><td>单点故障、多一跳延迟</td><td>scoped 变体还要保证筛选快且准</td></tr>
    <tr><td>典型用例</td><td>Postgres/MongoDB 连接器</td><td>CI/CD、客服动作中枢</td><td>企业 MCP 网关</td><td>按读写/编排/聚合分治</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】MCP 是 API 设计，受众是读描述的大模型</h3>
  <p><strong>原则：</strong>MCP Server 设计本质是 API 设计，但客户端通过读自然语言描述决定调什么——描述直接决定工具能不能被正确使用。</p>
  <p><strong>为什么重要：</strong>类比 LSP 解耦编辑器与语言服务器；MCP 能否像 LSP 一样沉淀共享生态，取决于能否用架构模式词汇指导大家把 Server 写好。</p>
  <p><strong>怎么落地：</strong>工具描述像对待代码一样写、像 Code Review 一样审；聚合用 scoped 而非 static-merge；只读加净化、多步封装 Orchestrator、有状态才 Session。</p>
  <p><strong>适用边界：</strong>论文基于 15 Server + 特定模型遥测，不同模型拐点不同（Sonnet 容忍更高工具数）——红线是起点不是绝对真理，须结合自身模型与场景复测。</p>
  <div class="quote">原文：「如果你还把工具描述当成写完代码后随手补的注释，你的 Server 性能上限已经被你自己锁死了。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「能力最大化」派 / 主张一个 Server 暴露全部工具</p>
  <p class="rebuttal-text">10~15 个工具的红线是用 2025 Q1 特定模型和语音场景测出来的——工具描述足够好、模型足够强时，30 个工具照样能 90%+，scoped 拆分反而增加检索延迟和集成复杂度。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>论文从 15 个 Server 提炼 Resource Gateway、Tool Orchestrator、Stateful Session、Proxy Aggregator、Domain Adapter 五种可复用模式</li>
    <li>四个反模式（God Tool、未净化、同步长任务、模糊描述）是反复出现的局部错误，应优先排查</li>
    <li>生产遥测：Haiku 在 10~15 个工具间跌破 90% 准确率——单上下文工具数宜控制在此范围</li>
    <li>聚合多 Server 时用 scoped Proxy Aggregator 按需暴露，避免 static-merge 拉高可见工具数</li>
    <li>MCP 设计受众从「写代码的人类」变成「读描述的大模型」，工具描述是核心工程产出</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>清点现有 MCP Server 暴露工具数，超过 15 则规划拆分或 scoped 聚合</li>
    <li>为每个工具写清「干什么、何时用、返回什么」，纳入 Code Review 流程</li>
    <li>所有外部/用户生成内容进 Resource 前加 sanitize 净化层</li>
    <li>长耗时操作改为返回 task ID + poll_job，不要同步阻塞</li>
    <li>记录每次工具调用的工具名、输入哈希、延迟、错误码，便于排查 LLM「胡来」</li>
  </ol>
  <p><strong>关键认知转变：</strong>在 AI 时代，API 文档不再是锦上添花——自然语言工具描述直接决定 Agent 能否选对工具，其工程权重应等同于接口 schema 本身。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
