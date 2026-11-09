import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'intelligent-ui-mcp-apps.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#faf5ff,#ede9fe);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#6d28d9,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-purple{background:#ede9fe;color:#5b21b6}.tag-violet{background:#ddd6fe;color:#6d28d9}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #8b5cf6}
.card h3{font-size:22px;font-weight:700;color:#5b21b6;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ede9fe,#c4b5fd);border:2px solid #a78bfa;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#4c1d95}
.node-em{background:linear-gradient(135deg,#fce7f3,#f9a8d4);border-color:#f472b6;color:#9d174d}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#6d28d9,#7c3aed);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#ede9fe;padding:10px 12px;text-align:left;font-weight:700;color:#4c1d95;border-bottom:2px solid #c4b5fd}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#ecfdf5;border:2px solid #10b981;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#047857;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#059669;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#065f46}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>对话框里开窗：Intelligent UI 与 MCP Apps</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-purple">OpenAI Intelligent UI</span>
  <span class="tag tag-violet">MCP Apps</span>
  <span class="tag tag-slate">gogoSandy #73</span>
</div>
<p class="subtitle">本文解决的核心问题是：AI 只能「念地图」式吐文本时，如何在聊天宿主内嵌入可交互 UI；拆解 MCP Apps 的 ui resourceUri、structuredContent 双轨输出，以及 callServerTool / sendMessage / updateModelContext 三条回传路径，并对比 lustereczko-mcp 现场 HTML 与 A2UI 预制组件路线。</p>

<div class="map">
  <h3 style="font-size:20px;color:#5b21b6;margin-bottom:12px;text-align:center">MCP App 双向流：宿主拉 UI ←→ 工具结果 ←→ 用户操作</h3>
  <div class="diagram">
    <div class="node">LLM 调工具</div><span class="arrow-sym">→</span>
    <div class="node node-em">_meta.ui</div><span class="arrow-sym">→</span>
    <div class="node">拉取 ui://</div><span class="arrow-sym">→</span>
    <div class="node node-em">iframe 渲染</div><span class="arrow-sym">↔</span>
    <div class="node">三路回传</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">content 给模型读摘要；structuredContent 给图表完整 JSON——明修栈道，暗度陈仓</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「嵌个 iframe 就是 Intelligent UI」。实际上能看不能动只完成一半；没有 resourceUri 门牌与宿主↔View 协议，点击筛选无法直达 MCP 或注入上下文。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Intelligent UI 拆成两问</h3>
  <p><strong>在讲什么问题：</strong>闭源 ChatGPT 推送的 Intelligent UI，底层对应哪类开放能力？</p>
  <p><strong>关键理解：</strong>① 预制 UI 如何进对话并双向交互（MCP Apps）② UI 能否由模型现场生成（lustereczko-mcp 空白画布 + display_ui_to_user）。</p>
  <p><strong>和其他概念关系：</strong>OpenAI 倾向原生组件库 + 编译器（类 A2UI）；MCP 生态走开放 ui:// 资源与 JSON 工具元数据。</p>
  <p><strong>怎么落地用：</strong>工具定义加 <code>_meta.ui.resourceUri</code>；返回同时带 content 与 structuredContent。</p>
  <p><strong>边界说明：</strong>早年 MCP Apps 不火因场景偏企业重交互；个人轻量仍多 SKILL 文本流。</p>
  <p><strong>原文依据：</strong>「AI 的能力通天，表达方式却被文本框锁死。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】两把钥匙与 To UI 数据</h3>
  <p><strong>核心思路：</strong>钥匙一：工具 _meta 声明 ui:// 地址，宿主执行函数时顺带拉 UI 包（HTML+JS）。钥匙二：structuredContent 喂图表/编辑器状态，content 仅摘要给 LLM。</p>
  <p><strong>操作步骤：</strong>① MCP 服务打包 UI 资源 ② 工具 JSON 写 resourceUri ③ 宿主实现 Apps 协议 ④ UI 读 structuredContent 渲染。</p>
  <p><strong>选型条件：</strong>BI 筛选、PPTX 批注、地图框选等强交互；宿主需支持 MCP Apps（非仅纯文本 fallback）。</p>
  <p><strong>避坑：</strong>只返 content 时高级宿主退化为念数字；UI 与模型争用同一 JSON 会干扰推理。</p>
  <p><strong>示例：</strong>visualize_data → ui://charts/interactive。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】From UI 三路动作</h3>
  <table>
    <tr><th>API</th><th>路径</th><th>典型场景</th><th>特点</th></tr>
    <tr><td>callServerTool</td><td>绕过 LLM → MCP</td><td>图表点「华东区」重查</td><td>无幻觉、毫秒级</td></tr>
    <tr><td>sendMessage</td><td>组装 User Message → Agent</td><td>PPTX 框选+批注发送</td><td>模型看到真人式指令</td></tr>
    <tr><td>updateModelContext</td><td>静默注入上下文</td><td>地图框选西直门再问「好吃的」</td><td>不触发即时回复</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】预制 UI vs 现场生成</h3>
  <table>
    <tr><th>方案</th><th>UI 来源</th><th>优势</th><th>劣势</th></tr>
    <tr><td>MCP Apps 标准</td><td>程序员预制 ui://</td><td>稳定、可审计、双向协议成熟</td><td>每个场景要前端资产</td></tr>
    <tr><td>lustereczko-mcp</td><td>ui:// 返回空白画布 + LLM 填 HTML</td><td>极客、随问随写界面</td><td>安全与风格一致性难控</td></tr>
    <tr><td>OpenAI / A2UI</td><td>原生组件 + 流式编译</td><td>统一观感、流式体验</td><td>闭源、绑定宿主</td></tr>
    <tr><td>纯文本 SKILL</td><td>无 UI</td><td>轻量个人自动化</td><td>无法点选/地图/复杂表单</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】lustereczko「劫持」ui://</h3>
  <p><strong>原则：</strong>请求静态资源时不返预制 HTML，返空白画布；LLM 调用 display_ui_to_user 把刚写的 HTML/JS 糊上。</p>
  <p><strong>为什么重要：</strong>把 MCP App 从「预制菜」推进到「现炒」——对齐模型 Coding 能力爆发。</p>
  <p><strong>怎么落地：</strong>个人项目（如 pptx-skill）用 MCP-App 作 HTML 层编辑协议。</p>
  <p><strong>适用边界：</strong>作者更看好狂野方案，但企业仍可能优选 A2UI 式组件沙箱。</p>
  <p><strong>风向：</strong>GPT 全量 Intelligent UI 正在重塑用户习惯，图形化 AI 交互逼近爆发窗口。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】协议与产品现实</h3>
  <p><strong>坑名：</strong>iframe 无回传。<strong>原因：</strong>未实现 Apps 宿主协议。<strong>解法：</strong>三路 API 择一或组合。<strong>严重程度：</strong>致命（假交互）。</p>
  <p><strong>坑名：</strong>现场 HTML XSS。<strong>原因：</strong>LLM 生成可执行脚本。<strong>解法：</strong>沙箱、CSP、预制组件兜底。<strong>严重程度：</strong>致命（lustereczko 路线）。</p>
  <p><strong>坑名：</strong>场景误判。<strong>原因：</strong>个人低频重交互。<strong>解法：</strong>先 SKILL，企业流再上 Apps。<strong>严重程度：</strong>可忽略→小心。</p>
  <p><strong>坑名：</strong>只跟 OpenAI 走。<strong>原因：</strong>闭源 Intelligent UI 难迁移。<strong>解法：</strong>MCP 开放元数据优先。<strong>严重程度：</strong>小心（供应商锁定）。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：极简对话优先的产品派</p>
  <p class="rebuttal-text">在聊天里塞 iframe 与三路桥接会把宿主复杂度推回「小程序平台」——多数问答只需可靠文本与文件；Intelligent UI 是大象引领的习惯战，不代表开放 MCP Apps 必然成为默认集成方式。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Intelligent UI 表象是交互答案，实质是 MCP Apps 开放标准 + 宿主双向协议。</li>
    <li>resourceUri 与 structuredContent/content 分叉，让模型专注摘要、UI 吃全量数据。</li>
    <li>callServerTool、sendMessage、updateModelContext 覆盖直连接口、代发指令、静默上下文三态。</li>
    <li>lustereczko-mcp 用空白画布实现现场 UI，与 A2UI 预制流式路线形成光谱两端。</li>
    <li>OpenAI 全量推送正在催化场景，企业重交互与个人轻 SKILL 将长期并存。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>为下一个 MCP 工具设计 _meta.ui.resourceUri 与 structuredContent 字段。</li>
    <li>按交互类型选回传路径：BI 筛选用 callServerTool，批注发 Agent 用 sendMessage。</li>
    <li>评估宿主是否支持 Apps；不支持则 content fallback 仍要可读。</li>
    <li>重交互原型可试 lustereczko 画布，生产环境优先预制+沙箱。</li>
    <li>跟踪 MCP Apps 规范与 Intelligent UI 产品对齐，避免重复造 iframe 轮子。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>下一代人机交互应从「模型说什么」扩展到「模型住在哪里说话」——对话框是壳，ui:// 资源与 structuredContent 才是让 AI 从瞎子导航员变成能递地图的共事者。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
