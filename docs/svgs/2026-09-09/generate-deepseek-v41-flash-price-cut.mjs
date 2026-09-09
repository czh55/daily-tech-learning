import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'deepseek-v41-flash-price-cut.svg');

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
<h1>DeepSeek V4.1 Flash 降价：9 月 10 日正午起缓存命中砍六成，Agent 长上下文才是最大赢家</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">DeepSeek V4.1 Flash</span>
  <span class="tag tag-green">API 降价</span>
  <span class="tag tag-orange">缓存命中</span>
  <span class="tag tag-purple">原生多模态</span>
  <span class="tag tag-red">国产 Flash 大战</span>
</div>
<p class="subtitle">本文解决的核心问题是：DeepSeek 在 9 月 10 日前后发布 V4.1 Flash 并同步下调 API 价格，过渡期 V4 Pro 请求如何被路由到 Flash 按 Flash 价计费，新价格表各档降幅几何，临时体验模型与正式版的差异，以及你的调用结构（Agent、长上下文、多模态）如何决定实际省钱幅度。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">V4.1 Flash 发布与降价三条主线</h3>
  <div class="diagram">
    <div class="node">9/10 发布<br>V4.1 Flash</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">过渡期<br>Pro→Flash 路由</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">正午降价<br>命中 -60%</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">国产 Flash<br>军备竞赛</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">9 月 10 日正午起：缓存命中 ¥0.02/M（-60%）、缓存未命中 ¥1.00/M（-33%）、输出 ¥4.00/M（-11%）</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「全线降价 60%，账单立刻腰斩」。实际上降幅按计费维度拆分——缓存命中砍得最狠（-60%），输出 token 仅降 11%；短问答、无缓存复用的调用体感有限，Agent 多轮长上下文、高缓存命中率才是最大受益者。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】V4.1 Flash 发布与 Pro→Flash 过渡路由</h3>
  <p><strong>在讲什么问题：</strong>DeepSeek 约 9 月 10 日正式发布 V4.1 Flash，并在过渡期将 V4 Pro 请求自动路由到 Flash，按 Flash 价格计费。</p>
  <p><strong>核心机制：</strong>新模型定位「高速低成本」——官方临时体验模型 <code>deepseek-v4.1-flash-expires-on-0910</code> 限 20 并发、实测 350+ tokens/s；正式版上线后 Pro 用户无需改 endpoint 即可享受过渡降价。</p>
  <p><strong>关键理解：</strong>降价不是单纯调表，而是「新模型 + 路由策略 + 分档计费」组合拳——把 Pro 流量平滑迁移到 Flash 产能，同时用缓存命中价撬动 Agent 场景。</p>
  <p><strong>典型场景：</strong>日常编码助手、RAG 问答、多轮 Agent 工具调用——高重复 system prompt 与历史上下文可大量命中缓存。</p>
  <p><strong>边界说明：</strong>临时模型有并发上限且会过期；极致推理深度、超长复杂任务仍可能需要 Pro 级模型，Flash 是性价比甜点而非全能替代。</p>
  <div class="quote">过渡策略：V4 Pro 请求在切换窗口内被路由至 Flash，按 Flash 价格结算——用户侧零改造即可受益。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】9 月 10 日降价前后 API 价格与降幅</h3>
  <table>
    <tr><th>计费维度</th><th>降价前（约）</th><th>9/10 正午后</th><th>降幅</th><th>谁最受益</th></tr>
    <tr><td>缓存命中（输入）</td><td>¥0.05/M</td><td>¥0.02/M</td><td>-60%</td><td>Agent 多轮、长 system prompt 复用</td></tr>
    <tr><td>缓存未命中（输入）</td><td>¥1.50/M</td><td>¥1.00/M</td><td>-33%</td><td>每次全新上下文的短问答</td></tr>
    <tr><td>输出 token</td><td>¥4.50/M</td><td>¥4.00/M</td><td>-11%</td><td>长文生成、代码输出多的场景</td></tr>
  </table>
  <div class="relation"><strong>关系脉络：</strong>输入侧降价 &gt; 输出侧 → 重复上下文越多、命中缓存比例越高，总账单下降越明显。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】V4.1 Flash 原生多模态 vs 独立 vision-exp 模型</h3>
  <table>
    <tr><th>对比维度</th><th>V4.1 Flash 原生多模态</th><th>独立 vision-exp 模型</th><th>一句话结论</th></tr>
    <tr><td>架构</td><td>图文统一主干，单 endpoint</td><td>文本与视觉分拆部署</td><td>Flash 减少路由切换成本</td></tr>
    <tr><td>调用复杂度</td><td>同一模型 ID 处理图文</td><td>需选择/切换视觉专用模型</td><td>Agent 流水线更简洁</td></tr>
    <tr><td>延迟与吞吐</td><td>350+ tokens/s，20 并发（体验版）</td><td>视独立模型规格而定</td><td>Flash 强调速度档</td></tr>
    <tr><td>计费</td><td>纳入 Flash 统一价表</td><td>可能单独定价</td><td>多模态 Agent 成本更可预测</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】按调用结构最大化缓存命中省钱</h3>
  <p><strong>方法名：</strong>缓存友好型 Prompt 设计 + Flash 路由 · 标签：Agent / 长上下文 / 成本优化</p>
  <p><strong>核心思路：</strong>降价红利集中在「缓存命中」档——固定 system prompt、稳定工具定义、可复用历史轮次，让重复前缀尽可能命中缓存。</p>
  <p><strong>操作步骤：</strong>1) 将不变的指令与工具 schema 置于上下文前部并保持字节级稳定 → 2) 多轮 Agent 复用同一 thread，避免每轮重写 system → 3) 监控缓存命中率，低命中场景评估是否值得切 Flash → 4) 过渡期确认请求走 V4.1 Flash 路由 → 5) 对比降价前后账单按「命中/未命中/输出」三档拆分</p>
  <div class="highlight"><strong>落地建议：</strong>长上下文 Agent（如 10+ 轮工具调用）缓存命中占比高，降价体感可达 40–60%；单次短问答几乎只享受未命中 -33% 与输出 -11%，体感有限。</div>
  <div class="pitfall"><strong>避坑：</strong>动态拼接 system prompt（时间戳、随机 ID、每次变序的工具列表）会摧毁缓存命中，表面用 Flash 实际付满未命中价。</div>
</div>

<div class="card">
  <h3>【决策/选型表】DeepSeek Flash vs 国产竞品怎么选</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>已有 DeepSeek 集成、Agent 长上下文</td><td>切 V4.1 Flash + 优化缓存</td><td>命中价 -60%，路由零改造</td><td>死守 Pro 不调结构</td><td>错过最大降幅档位</td></tr>
    <tr><td>纯文本高速批量推理</td><td>对比 GLM-5.3-Flash 基准</td><td>智谱同档 Flash 价格战激烈</td><td>只看单一厂商标价</td><td>吞吐/限流/工具支持差异大</td></tr>
    <tr><td>企业多模态 + 生态绑定</td><td>评估腾讯 HY4 与 DeepSeek 原生多模态</td><td>HY4 生态与合规优势</td><td>盲目双开三个 Flash</td><td>运维与路由复杂度飙升</td></tr>
    <tr><td>8 月涨价后已迁 ChatGPT</td><td>用真实 workload 回测 Flash 账单</td><td>降价+路由可能逆转 TCO</td><td>因「背叛感」不再评估</td><td>错过可量化的成本回调</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】V4.1 Flash 降价与迁移陷阱</h3>
  <p><strong>坑名：</strong>把「-60%」当成全线降价宣传口径</p>
  <p><strong>原因：</strong>三档计费结构差异大，媒体标题常取最大降幅。</p>
  <p><strong>解法：</strong>按自己业务的命中/未命中/输出比例拆账，用真实日志估算而非看海报数字。</p>
  <p><strong>严重程度：</strong>小心（影响预算预期与选型决策）</p>
  <div class="pitfall"><strong>临时模型过期：</strong><code>deepseek-v4.1-flash-expires-on-0910</code> 会下线，生产环境需跟进正式模型 ID 与并发配额。</div>
  <div class="pitfall"><strong>20 并发上限：</strong>体验版限流，高并发服务需提前申请或做队列削峰。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】Flash 大战时代的 API 成本观</h3>
  <p><strong>原则：</strong>比单价更重要的是「你的调用结构 × 计费档位」——同一降价公告，Agent 开发者与单次问答用户的账单曲线完全不同。</p>
  <p><strong>为什么重要：</strong>GLM-5.3-Flash、腾讯 HY4、DeepSeek V4.1 Flash 同时入场，价格战从「谁更便宜」升级为「谁的计费模型更匹配你的 workload」。</p>
  <p><strong>怎么落地：</strong>1) 导出 30 天 API 账单按命中/未命中/输出拆分 → 2) 用降价后价表重算 → 3) 对竞品跑同 workload 基准 → 4) 优化 prompt 稳定性拉高命中率。</p>
  <p><strong>适用边界：</strong>极低调用量用户差异可忽略；百万级 token/月 的 Agent 团队必须做结构化成本分析。</p>
  <div class="quote">国产 Flash 军备竞赛的本质：不是再做一个便宜模型，而是用缓存命中价重新定义 Agent 经济的盈亏平衡点。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：8 月涨价后已迁 ChatGPT 的开发者 · 「信任已破产」派</p>
  <p class="rebuttal-text">先涨后降、过渡路由、临时模型过期——每一轮操作都在考验用户信任。既然 8 月涨价时已果断切到 ChatGPT，如今为几十个百分点降价再迁回来，等于承认自己被价格牵着鼻子走；迁移成本、生态锁定和「下次还会涨」的预期，远比账单上省下的钱更贵。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>DeepSeek V4.1 Flash 约 9 月 10 日发布，过渡期 V4 Pro 请求路由至 Flash 并按 Flash 价计费，用户侧可零改造受益。</li>
    <li>9 月 10 日正午降价：缓存命中 ¥0.02/M（-60%）、未命中 ¥1.00/M（-33%）、输出 ¥4.00/M（-11%）——降幅高度依赖调用结构。</li>
    <li>临时体验模型 <code>deepseek-v4.1-flash-expires-on-0910</code> 限 20 并发、350+ tokens/s；正式版支持原生多模态，无需独立 vision-exp 模型。</li>
    <li>国产 Flash 竞品（GLM-5.3-Flash、腾讯 HY4）同步加压，选型需按 workload 实测而非只看标价。</li>
    <li>Agent / 长上下文 / 高缓存命中率场景是最大赢家；短问答单次调用体感有限。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>导出近期 API 账单，按缓存命中、未命中、输出三档拆分并套用新价表重算。</li>
    <li>稳定 system prompt 与工具 schema 字节级不变，提升缓存命中率以吃到 -60% 档位。</li>
    <li>确认生产环境跟进正式 V4.1 Flash 模型 ID，替换即将过期的临时体验版。</li>
    <li>用同一 benchmark 对比 GLM-5.3-Flash、腾讯 HY4 与 DeepSeek Flash 的延迟与质量。</li>
    <li>8 月迁走 ChatGPT 的用户：用真实 workload 回测一次，用数据而非情绪决定是否回迁。</li>
  </ol>
  <p><strong>关键认知转变：</strong>「降价」不是统一打折，而是「Flash 速度档 + 缓存命中定价」——你的架构是否 Agent 化、上下文是否可复用，决定了这波红利到底是噱头还是真金白银。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
