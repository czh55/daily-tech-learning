import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'mcp-2026-07-28-stateless-core-claude.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f0f4ff,#e8ecf8);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#4338ca,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #6366f1}
.card h3{font-size:22px;font-weight:700;color:#4338ca;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:2px solid #a5b4fc;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#4338ca}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#4338ca,#6366f1);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#4338ca;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>刚刚，MCP协议迎来「史上最大更新」：State彻底消失，Claude率先适配支持</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">MCP 2026-07-28</span>
  <span class="tag tag-green">无状态协议</span>
  <span class="tag tag-orange">MRTR</span>
  <span class="tag tag-purple">OAuth/CIMD</span>
  <span class="tag tag-red">扩展框架</span>
</div>
<p class="subtitle">本文解决的核心问题是：MCP 协议为何在 SDK 月下载逼近 5 亿、连接器超 950 个的规模下，必须把核心从有状态双向流改成无状态 HTTP 请求/响应，以及开发者应如何迁移握手、会话、elicitation 与鉴权相关实现。</p>

<div class="map">
  <h3 style="font-size:20px;color:#4338ca;margin-bottom:12px;text-align:center">MCP 2026-07-28：从传输层会话到自描述请求</h3>
  <div class="diagram">
    <div class="node-red">旧：initialize 握手<br><span style="font-size:11px;font-weight:400">Mcp-Session-Id 粘性路由</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">自描述 _meta 请求<br><span style="font-size:11px;font-weight:400">任意 LB 轮询</span></div>
    <span class="arrow-sym">+</span>
    <div class="node-green">MRTR 多轮往返<br><span style="font-size:11px;font-weight:400">替代反向双向流</span></div>
    <span class="arrow-sym">+</span>
    <div class="node-orange">扩展框架<br><span style="font-size:11px;font-weight:400">Apps · Tasks · EMA</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">SEP-2575/2567 移除会话 · SEP-2322 MRTR · Claude 率先跟进适配</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「无状态 = MCP 服务器不能记业务状态」——正确理解是：传输层不再藏隐式会话；跨调用状态由服务器铸造显式 handle 交给模型传递，比黑盒 Session-Id 更可观测、更可组合。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】有状态 MCP 的生产痛点与无状态改造目标</h3>
  <p><strong>在讲什么问题：</strong>早期 MCP 要求 initialize/initialized 握手 + Mcp-Session-Id 会话，服务器还能反向发起 elicitation/sampling/roots，导致负载均衡必须粘性路由、共享 Redis 会话、网关需解析 JSON 体才能鉴权限流。</p>
  <p><strong>核心机制：</strong>2026-07-28 把状态从传输层拿掉——每个请求自描述协议版本、客户端身份与能力（_meta），可选 server/discover 探能力，不再强制握手。</p>
  <p><strong>关键理解：</strong>协议火了（Tier1 SDK 月下载近 5 亿），但运维复杂度成了规模化瓶颈；这次修订是「从少年到成年」的架构还债，而非功能堆砌。</p>
  <p><strong>典型场景：</strong>Serverless/边缘一键扩容 MCP 服务、多实例无共享存储部署、网关按 HTTP 头做路由限流。</p>
  <p><strong>边界说明：</strong>需要长连接双向流的 legacy HTTP+SSE 已弃用；深度依赖会话 ID 的旧实现迁移成本最高。</p>
  <div class="quote">「把 MCP 从一个有状态的双向协议，改造成彻底的无状态请求/响应协议。」——MCP 官方博客</div>
</div>

<div class="card">
  <h3>【方法/工具卡】MRTR 替代服务器反向请求</h3>
  <p><strong>方法名：</strong>Multi Round-Trip Requests（SEP-2322）</p>
  <p><strong>核心思路：</strong>服务器不再反向发起请求，而是在响应中标 resultType: input_required 并附问题；客户端收集用户输入后，带着 inputResponses 重新发起原始调用。</p>
  <p><strong>操作步骤：</strong>① 识别原 elicitation/sampling/roots 反向流逻辑；② 改为检测 input_required 响应；③ 收集输入后重发同 method 调用并填 inputResponses；④ 在无状态 Supabase MCP 等场景验证高风险操作前确认。</p>
  <p><strong>选型条件：</strong>需要用户确认、缺参补全、且服务器本身无状态运行——MRTR 是官方无状态路径，不再依赖常驻双向流。</p>
  <div class="pitfall"><strong>避坑：</strong>仍假设服务器能「主动 push」到客户端——无状态核心下必须客户端驱动多轮，调度逻辑要改到客户端循环。</div>
  <div class="quote">Supabase 产品负责人：无状态 MCP 长期无法轻松接入 elicitation，MRTR 让他们能在删数据前跟用户确认。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】旧会话模型 vs 2026-07-28 无状态模型</h3>
  <table>
    <tr><th>对比维度</th><th>旧有状态 MCP</th><th>2026-07-28 无状态</th><th>一句话结论</th></tr>
    <tr><td>连接建立</td><td>initialize + initialized 握手</td><td>每请求 _meta 自描述，可选 discover</td><td>握手非必需，冷启动更快</td></tr>
    <tr><td>负载均衡</td><td>粘性路由 + 共享会话存储</td><td>普通轮询即可</td><td>横向扩容像普通 HTTP 服务</td></tr>
    <tr><td>二次确认</td><td>elicitation 等反向双向流</td><td>MRTR input_required 多轮</td><td>客户端驱动，适合 Serverless</td></tr>
    <tr><td>网关鉴权</td><td>解析 JSON 才知道 method</td><td>Mcp-Method + Mcp-Name 请求头</td><td>WAF/限流可直接按头路由</td></tr>
    <tr><td>业务状态</td><td>隐式 Session-Id</td><td>显式 handle 由模型传递</td><td>模型可见、可组合，非黑盒</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】迁移与集成怎么排优先级</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>硬编码 Mcp-Session-Id</td><td>改为自描述 _meta + 显式 handle</td><td>会话头已移除（SEP-2575/2567）</td><td>继续依赖粘性路由</td><td>与无状态核心冲突，无法 Serverless 扩容</td></tr>
    <tr><td>elicitation/sampling/roots</td><td>MRTR + inputResponses</td><td>反向流已不可用</td><td>自建 WebSocket 旁路</td><td>偏离标准，客户端兼容性差</td></tr>
    <tr><td>资源未找到错误处理</td><td>匹配 -32602 Invalid Params</td><td>错误码对齐 JSON-RPC（SEP-2164）</td><td>仍匹配 -32002</td><td>升级后逻辑失效</td></tr>
    <tr><td>企业 IdP 接入</td><td>OAuth 2.0/OIDC + EMA 扩展</td><td>Issuer 校验、凭证绑定、CIMD 方向</td><td>继续依赖 DCR 为主路径</td><td>DCR 已标记弃用，未来移除</td></tr>
    <tr><td>新能力试水</td><td>扩展框架（Apps/Tasks/EMA）</td><td>先扩展验证再考虑并入核心</td><td>直接改核心规范</td><td>违背生命周期与一致性测试门槛</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】升级 2026-07-28 必查项</h3>
  <p><strong>坑名：</strong>客户端仍匹配 -32002 资源未找到</p>
  <p><strong>原因：</strong>错误码改为 JSON-RPC 标准 -32602。</p>
  <p><strong>解法：</strong>全文搜索 -32002，改为 -32602 或按 Invalid Params 语义处理。</p>
  <p><strong>严重程度：</strong>致命——错误分支静默失效。</p>
  <div class="pitfall"><strong>坑名：</strong>新项目仍基于 Roots/Sampling/Logging——已弃用（SEP-2577），至少 12 个月缓冲但 logging/setLevel 在 2026-07-28 路径上直接被拒；日志改用 _meta 的 io.modelcontextprotocol/logLevel。</div>
  <div class="pitfall"><strong>坑名：</strong>列表接口不读 ttlMs/cacheScope——浪费带宽且 prompt 缓存断线后不稳定；tools/list 等现支持客户端缓存策略。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】扩展框架与生命周期政策</h3>
  <p><strong>原则：</strong>新能力先扩展、后核心；弃用至少 12 个月缓冲，一致性测试门槛（SEP-2484）是 Final 提案的前提。</p>
  <p><strong>为什么重要：</strong>避免每次大版本「伤筋动骨」；MCP Apps、Tasks、EMA 已在扩展框架转正。</p>
  <p><strong>怎么落地：</strong>跟踪扩展版本号；Claude 连接器目录提交按新文档流程；Bedrock AgentCore Gateway 等已支持 UpdateGateway 一键升级。</p>
  <p><strong>适用边界：</strong>仅做本地实验可滞后；生产多实例、企业鉴权、目录上架应优先对齐 2026-07-28。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：资深分布式架构师 / 「会话才是正确抽象」派</p>
  <p class="rebuttal-text">把会话砍掉只是把状态管理成本转嫁给应用层和客户端 MRTR 循环——对深度依赖服务器主动 push、长链路编排的复杂 Agent，无状态 HTTP 未必比精心设计的会话层更省总复杂度。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>MCP 2026-07-28 是协议史上最大修订：无状态核心、移除握手与会话、自描述 _meta 请求。</li>
    <li>MRTR 用 input_required + inputResponses 替代 elicitation/sampling/roots 反向流，利好无状态 Serverless 部署。</li>
    <li>请求头路由、列表 ttlMs/cacheScope、错误码 -32602 等「边角」改动对网关与客户端缓存落地很关键。</li>
    <li>扩展框架收纳 MCP Apps、Tasks、EMA；OAuth 加固并弃用 DCR 转向 CIMD；Roots/Sampling/Logging 弃用但有缓冲期。</li>
    <li>Claude 率先适配，生态伙伴反馈聚焦降复杂度、可扩容、易接入。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>审计代码中 Mcp-Session-Id、initialize 握手与 -32002 硬编码。</li>
    <li>将 elicitation 等反向逻辑改为 MRTR 客户端多轮循环。</li>
    <li>网关配置 Mcp-Method/Mcp-Name 头路由与限流规则。</li>
    <li>评估 OAuth Issuer 校验与 CIMD 迁移路径，停止以 DCR 为长期方案。</li>
    <li>计划提交 Claude 连接器目录时对照 2026-07-28 官方提交流程与 SDK 分级测试。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>MCP 正从「能跑的双向实验协议」变为可横向扩容的生产级 HTTP 工作负载；状态不应藏在传输层黑盒里，而应么显式 handle 交给模型，要么由扩展与生命周期机制温和演进。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
