import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'build-mcp-in-golang.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfeff,#eef2ff);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#0e7490,#4338ca);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-go{background:#ccfbf1;color:#0f766e}.tag-mcp{background:#e0e7ff;color:#3730a3}.tag-slate{background:#e2e8f0;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #0891b2}
.card h3{font-size:22px;font-weight:700;color:#0e7490;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:16px 0}
.node{background:linear-gradient(135deg,#ecfeff,#cffafe);border:2px solid #67e8f9;border-radius:14px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#0e7490}
.node-em{background:linear-gradient(135deg,#0e7490,#4338ca);border-color:#22d3ee;color:#f0fdfa}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#0e7490,#4338ca);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#ecfeff;padding:10px 12px;text-align:left;font-weight:700;color:#0e7490;border-bottom:2px solid #a5f3fc}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#f0f9ff;border:2px solid #0284c7;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#0369a1;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#0284c7;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#0c4a6e}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
.highlight{background:#ecfeff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#0e7490;border-left:4px solid #0891b2}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#0f172a}`;

const body = `
<h1>用 Go 构建 MCP：把既有后端开放给 Agent</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-go">Go MCP SDK</span>
  <span class="tag tag-mcp">适配层而非重写</span>
  <span class="tag tag-slate">企业订单系统连载</span>
</div>
<p class="subtitle">本文解决的核心问题是：当企业内部已有成熟 REST/领域服务时，如何用 MCP 在不动业务核心的前提下，为 AI Host 提供可发现、可治理、可审计的工具面，并在 CLI 与 Shell 同样流行的 Agent 时代判断 MCP 的真实价值边界。</p>

<div class="map">
  <h3 style="font-size:20px;color:#0e7490;margin-bottom:12px;text-align:center">一次 Tool 调用的责任链</h3>
  <div class="diagram">
    <div class="node">AI Host</div><span class="arrow-sym">→</span>
    <div class="node">MCP Client</div><span class="arrow-sym">→</span>
    <div class="node-em">MCP 适配层</div><span class="arrow-sym">→</span>
    <div class="node">领域服务 / 仓储</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">Tools / Resources / Prompts 暴露在协议侧；订单、库存、工单逻辑留在原有 Go 服务内。</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：上 MCP = 重写后端。原文强调在<strong>既有应用服务外</strong>加薄适配层，把 MCP 请求映射到已有能力，再把结果结构化回给模型。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】MCP 解决的不是「有没有 API」</h3>
  <p><strong>在讲什么问题：</strong>传统 API 为人与程序设计；Agent 需要发现能力、理解参数语义、在权限内组合多步调用。</p>
  <p><strong>关键理解：</strong>MCP 标准化 Host–Client–Server 交互；Server 用 Tools（动作）、Resources（可读上下文）、Prompts（任务模板）描述能力。</p>
  <p><strong>关系：</strong>REST 仍服务人类/UI；MCP 是 AI 消费层的「插座标准」，可与 CLI Bridge 共存（如 OpenClaw）。</p>
  <p><strong>落地：</strong>从 <code>get_order</code> 只读 Tool 起步，再扩库存、工单、写操作与租户隔离。</p>
  <p><strong>边界：</strong>不替代领域建模；只管协议映射、契约与安全壳。</p>
  <p><strong>原文依据：</strong>「API 能被程序调用，不等于 AI 应用就能可靠地使用它。」</p>
</div>

<div class="card">
  <h3>【跨概念对比表】CLI 工具箱 vs MCP 能力总线</h3>
  <table>
    <tr><th>维度</th><th>CLI / Shell</th><th>MCP</th><th>结论</th></tr>
    <tr><td>抽象层次</td><td>OS 级组合、管道</td><td>跨语言结构化 RPC</td><td>互补非替代</td></tr>
    <tr><td>企业场景</td><td>难以开放裸 Shell</td><td>明确边界、可审计</td><td>生产必选 MCP 壳</td></tr>
    <tr><td>参数/结果</td><td>文本流，模型自解析</td><td>JSON Schema 类型化</td><td>降低误用率</td></tr>
    <tr><td>远程/多租户</td><td>SSH 耦合重</td><td>stdio / Streamable HTTP</td><td>按部署选型传输</td></tr>
    <tr><td>组合方式</td><td>本地 Agent 极轻</td><td>可被 CLI Backend 经 Bridge 调用</td><td>可叠加使用</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】Go 适配层的工程习惯</h3>
  <p><strong>核心思路：</strong>接口隔离领域与协议；官方 SDK 承载协议，团队专注映射与治理。</p>
  <p><strong>步骤：</strong>① 定义领域接口（订单查询）→ ② 实现 MCP Tool 映射 + 输入输出 struct → ③ context 贯穿超时/取消 → ④ 协议级集成测试（非只测函数）→ ⑤ 选 stdio（本地）或 HTTP（远程）。</p>
  <p><strong>选型：</strong>已有 Go 单体/微服务团队优先 Go MCP SDK，复用 CI、观测与部署栈。</p>
  <p><strong>避坑：</strong>勿把每个 REST endpoint 机械包成 Tool——先问用户任务、副作用、权限。</p>
  <p><strong>对比：</strong>第一个 Tool 返回数据只证明链路通；生产从成功调用<strong>之后</strong>才开始（授权、幂等、限流）。</p>
</div>

<div class="card">
  <h3>【决策/选型表】Tool / Resource / Prompt</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>查订单状态</td><td>Tool</td><td>明确动作、副作用可控</td><td>Resource</td><td>模型难自主触发读取节奏</td></tr>
    <tr><td>业务知识库切片</td><td>Resource</td><td>只读上下文供给</td><td>巨型 Tool 描述</td><td>Discovery 成本高</td></tr>
    <tr><td>标准工单话术</td><td>Prompt 模板</td><td>可复用任务框架</td><td>自由生成</td><td>一致性差</td></tr>
    <tr><td>取消订单</td><td>Tool + 幂等键 + 确认</td><td>写操作需审计</td><td>裸 Tool 无授权</td><td>模型重复调用风险</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】专栏强调的 14 讲生产议题</h3>
  <p><strong>契约：</strong>名称/描述/Schema 影响模型误用率——需人审 + 集成测试。</p>
  <p><strong>身份：</strong>租户与用户上下文必须从 Host 传到 Server，禁止默认全网可见。</p>
  <p><strong>写操作：</strong>幂等、确认、审计三件套；重复取消/建单由协议层兜底。</p>
  <p><strong>可靠性：</strong>超时、取消、并发、限流、下游故障要有统一错误语义。</p>
  <p><strong>观测：</strong>按 Tool 维度打点，否则无法做 Agent SLO。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】REST 已在，为何还要 MCP？</h3>
  <p><strong>原则：</strong>AI 更强不会自动给后端长出「可被 Agent 安全使用」的接口——工程师仍要设计知识边界与安全壳。</p>
  <p><strong>落地：</strong>虚构订单系统连载：查询 → 多工具面 → 写操作治理 → 部署观测，全在同一仓库演进。</p>
  <p><strong>边界：</strong>本地可运行最小服务即可入门；企业 Copilot/客服再叠授权与远程 HTTP。</p>
  <p><strong>原文支撑：</strong>「如何把现有 Go 业务能力以标准化、可治理的方式开放给 AI Agent，仍是真实且重要的工程问题。」</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「给 Agent 一个 curl 脚本 + API Key 就够了」</p>
  <p class="rebuttal-text">裸 REST 让模型自拼 URL、自猜错误码，在写操作与多租户场景下几乎无法做统一授权与幂等；等到事故复盘时你会发现缺的正是 MCP 那层可描述的契约与可审计的 Tool 边界。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>MCP 是 AI 消费既有后端的适配协议，不是替换 Go 业务代码。</li>
    <li>CLI 与 MCP 分层不同，企业场景靠 MCP 提供治理；本地 Agent 可 Bridge 组合。</li>
    <li>工程难点在契约、传输、身份、写操作幂等与协议测试，而非注册第一个 Tool。</li>
    <li>14 讲订单系统路线覆盖从心智模型到生产交付的完整路径。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>盘点一个只读查询 API，设计最小 Tool Schema 与描述（防误用）。</li>
    <li>在 Go 项目里划出 <code>internal/mcp</code> 适配包，领域接口零依赖 SDK。</li>
    <li>为写操作起草幂等键与审计字段，再暴露 Tool。</li>
    <li>补一条 MCP 协议级集成测试（stdio 启停 + tools/list + tools/call）。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「给模型更多 API 文档」转为「用 MCP 把能力变成类型化、可治理的 Tool 面」——后端竞争力在于谁能把业务安全地接到 Agent，而不在于模型会不会写代码。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');