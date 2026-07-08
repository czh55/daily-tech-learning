import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'hermes-agent-cost-control.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#7c3aed,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #8b5cf6}
.card h3{font-size:22px;font-weight:700;color:#6d28d9;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:2px solid #c4b5fd;border-radius:16px;padding:12px 16px;text-align:center;min-width:90px;font-weight:700;font-size:12px;color:#6d28d9}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#6d28d9,#8b5cf6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#6d28d9;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Hermes Agent 成本控制实战</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-purple">Hermes Agent</span>
  <span class="tag tag-blue">Provider Routing</span>
  <span class="tag tag-green">Credential Pools</span>
  <span class="tag tag-orange">Tool Search</span>
</div>
<p class="subtitle">本文解决的核心问题是：如何把未做成本工程的 Hermes Agent 月费从 $200 压到 $5 以下——通过 Provider Routing 选最便宜子提供商、凭据池防限流中断、辅助模型独立配置防压缩风暴、Tool Search 砍掉 89% 工具 Schema 固定开销。</p>

<div class="map">
  <h3 style="font-size:20px;color:#6d28d9;margin-bottom:12px;text-align:center">三层韧性 + 五大降本杠杆</h3>
  <div class="diagram">
    <div class="node-green">凭据池<br><span style="font-size:10px;font-weight:400">多 Key 轮换</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">主模型降级<br><span style="font-size:10px;font-weight:400">fallback_providers</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">辅助任务降级<br><span style="font-size:10px;font-weight:400">auxiliary.*</span></div>
  </div>
  <div class="diagram" style="margin-top:16px">
    <div class="node-blue">Provider Routing</div>
    <div class="node">Tool Search</div>
    <div class="node-green">压缩流水线</div>
    <div class="node-orange">execute_code</div>
    <div class="node">Token 追踪</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Hermes 贵」—— Hermes 本身 MIT 开源免费，$137/周 的账单来自未做成本工程：72 个工具 Schema 每轮吃 19,210 Token，辅助压缩默认跟主模型走一条线，主模型限流时压缩连带崩溃丢上下文。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Provider Routing vs Fallback Providers</h3>
  <p><strong>在讲什么问题：</strong>OpenRouter 一张「车票」内部走哪条子提供商线路？和跨平台故障转移有何区别？</p>
  <p><strong>核心机制：</strong>Provider Routing 控制 OpenRouter 内部子提供商（Anthropic、Google、Bedrock 等）如何路由请求；Fallback Providers 是主模型整体失败时切换到完全不同的提供商。</p>
  <p><strong>关键理解：</strong>两个独立维度——同平台内路由优化 vs 跨平台故障转移，配置不要混为一谈。</p>
  <p><strong>典型场景：</strong>日常编码 <code>sort: "price"</code>；终端交互 <code>sort: "latency"</code>。</p>
  <p><strong>边界说明：</strong>仅 OpenRouter 生效；直连 Anthropic/DeepSeek 时无路由可言。Nous Portal 流量同样尊重 routing 且享 10% 折扣。</p>
  <div class="quote">原文：「你买了一张 OpenRouter 的车票，Provider Routing 决定走最便宜的、最快的、还是延迟最低的线路。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Provider Routing 六种排序策略</h3>
  <p><strong>操作步骤：</strong></p>
  <p>1. <code>sort</code>：price / throughput / latency 三选一</p>
  <p>2. <code>only</code> 白名单、<code>ignore</code> 黑名单、<code>order</code> 显式优先级</p>
  <p>3. <code>require_parameters: true</code> 确保子提供商支持全部请求参数</p>
  <p>4. <code>data_collection: "deny"</code> 关闭数据收集（隐私场景）</p>
  <div class="highlight"><strong>成本优化一行配置：</strong><code>provider_routing: { sort: "price" }</code> — 让 OpenRouter 自动选当前最便宜子提供商。</div>
  <div class="pitfall">避坑：Provider Routing 和 Fallback 是两套配置，别指望 Routing 能在主提供商整体挂掉时自动切平台。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Credential Pools 四种轮换策略</h3>
  <p><strong>核心思路：</strong>同一提供商注册多个 API Key，一个 Key 限流/配额耗尽时自动轮换，会话不中断、不切换提供商。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. <code>hermes auth add openrouter --api-key sk-or-v1-second-key</code></p>
  <p>2. 配置轮换策略：fill_first（默认，单主力多备份）/ round_robin / least_used / random</p>
  <p>3. 429 瞬时→同 Key 重试一次再轮换；402 配额耗尽→立即轮换（24h 冷却）</p>
  <p>4. 全部 Key 耗尽→触发 fallback_model 跨提供商降级</p>
  <div class="pitfall">避坑 GitHub #33088：fallback 和主提供商同平台（都走 OpenRouter）时，fallback 的 429 会消耗主池 Key——fallback 尽量配不同平台。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Tool Search + execute_code 两大 Token 杀手</h3>
  <p><strong>Tool Search（v0.16.0+）：</strong>72 工具 Schema 每轮约 19,210 Token → 延迟加载后约 2,200 Token，减少 89%。</p>
  <p><strong>配置：</strong><code>mode: auto</code>，<code>threshold: 0.1</code>（工具 Token 占上下文超 10% 才启用）；核心工具（terminal、read_file 等）永不延迟。</p>
  <p><strong>execute_code：</strong>中间工具结果永不进上下文，只有 print() 输出返回 Agent——批量 read_file 在沙箱内处理，Agent 只看最终统计。</p>
  <div class="pitfall">避坑：工具目录 Token 不到上下文 10% 时，Tool Search 反而因搜索/描述额外轮次增加总消耗——关掉它。</div>
  <div class="highlight"><strong>判断标准：</strong>工具少→关 Tool Search；工具多→开 auto + threshold 0.1。可与 Hermes Tool Slimmer（配置时预筛选）叠加。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】压缩风暴（Compression Storm）</h3>
  <p><strong>坑名：</strong>主模型限流（如 GLM 429）时，辅助压缩默认走 auto 探测链第一站=主模型提供商，压缩同样被限流，Agent 丢失整个对话上下文。</p>
  <p><strong>原因：</strong>auxiliary.compression 默认 auto 跟主模型走；用 Claude Opus 做压缩更是极度浪费。</p>
  <p><strong>解法：</strong>auxiliary.vision 和 auxiliary.compression 显式配置独立提供商——视觉用 Gemini Flash，压缩用 Flash 级模型（社区实测 Token 花费直降 85%+）。</p>
  <p><strong>严重程度：</strong>致命——不是丢一条消息，是丢全部上下文。</p>
  <div class="quote">反抖动保护：连续两次压缩各节省不到 10% Token 时 Hermes 自动停止压缩，避免「花了 2000 Token 生成摘要只省 8%」的负收益。</div>
</div>

<div class="card">
  <h3>【决策/选型表】辅助任务与委派模型选型</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>上下文压缩</td><td>Flash 级模型（deepseek-v4-flash）</td><td>总结文本不需 Pro 级推理</td><td>跟主模型 Opus</td><td>极度浪费 Token</td></tr>
    <tr><td>图片理解</td><td>auxiliary.vision 独立 Gemini Flash</td><td>免费额度大，不受主模型限流</td><td>auto 跟主模型</td><td>限流连带挂</td></tr>
    <tr><td>子代理委派</td><td>delegate_task + 便宜模型（gemini-flash）</td><td>子任务通常比主任务简单</td><td>与主模型同价</td><td>易被忽略的降本点</td></tr>
    <tr><td>3+ 连续工具调用</td><td>execute_code 沙箱批处理</td><td>中间结果不进上下文</td><td>逐个 tool_call</td><td>每次完整结果吃 Token</td></tr>
    <tr><td>简单格式转换</td><td>reasoning_effort: minimal</td><td>不需要深度推理 Token</td><td>默认 high reasoning</td><td>completion token 暴涨</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】delegate_task vs execute_code</h3>
  <table>
    <tr><th>对比维度</th><th>delegate_task</th><th>execute_code</th><th>一句话结论</th></tr>
    <tr><td>推理</td><td>完整 LLM 推理循环</td><td>仅 Python 代码执行</td><td>要推理用 delegate</td></tr>
    <tr><td>上下文</td><td>全新隔离对话</td><td>无对话，只有脚本</td><td>execute 更省 Token</td></tr>
    <tr><td>工具访问</td><td>所有非阻止工具 + 推理</td><td>7 个工具通过 RPC</td><td>批量处理选 execute</td></tr>
    <tr><td>并行性</td><td>默认 3 个并发子代理</td><td>单脚本（内部可多线程）</td><td>delegate 适合并行推理</td></tr>
    <tr><td>Token 成本</td><td>较高</td><td>较低（只返回 stdout）</td><td>有处理逻辑且不需推理→execute</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】翔宇五台机器实战策略</h3>
  <p><strong>原则：</strong>免费优先，按量兜底——主力 GLM Coding Plan Max（五台共享），额度耗尽切 DeepSeek 按量。</p>
  <p><strong>怎么落地：</strong>compression/vision/skills_hub/mcp 全部显式配置独立提供商；Tool Search auto + threshold 0.1；compression threshold 0.50 → target 0.20。</p>
  <p><strong>成本实绩：</strong>五台 Mac 月均 API 支出约 $3-5。行业数据：未优化与优化后部署成本可差 200 倍；CASTER 论文路由降本 72.4%。</p>
  <p><strong>适用边界：</strong>GLM 国内直连设 <code>GLM_BASE_URL</code> 跳过 3 秒自动探测，否则首条消息慢约 20 秒。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「直接用 Claude Code / 官方 API 极简派」</p>
  <p class="rebuttal-text">为省几十美元搭六层路由、凭据池和 Tool Search 配置，维护成本远超收益——多数开发者一周用量本就不该超过免费额度，成本工程是过度优化。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Hermes 账单高不是框架贵，是缺成本工程：工具 Schema、压缩跟主模型、无限流轮换</li>
    <li>三层韧性：凭据池 → 主模型 fallback → 辅助任务独立降级链</li>
    <li>Provider Routing（OpenRouter 内）+ Credential Pools 是路由降本的基础设施</li>
    <li>Tool Search 砍 89% 工具 Token；execute_code 让中间结果不进上下文</li>
    <li>压缩风暴：auxiliary.* 必须显式配置，Flash 做压缩，视觉独立 Gemini</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>配置 <code>provider_routing: { sort: "price" }</code>（OpenRouter 用户）</li>
    <li><code>hermes auth add</code> 添加备用 Key，设 round_robin / fill_first 策略</li>
    <li>auxiliary.compression 和 auxiliary.vision 显式指定 Flash 级独立提供商</li>
    <li>启用 Tool Search auto + threshold 0.1，工具少时关闭</li>
    <li>批量工具调用改用 execute_code，用 <code>hermes auth list</code> 和 TUI /agents 监控花费</li>
  </ol>
  <p><strong>关键认知转变：</strong>Agent 成本优化的战场不在「换更便宜的模型」一个点，而在路由、凭据、工具加载、压缩、执行方式五条线的系统化工程—— 未优化与优化后可差 200 倍。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
