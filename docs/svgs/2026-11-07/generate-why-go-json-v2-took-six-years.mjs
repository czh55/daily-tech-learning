import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'why-go-json-v2-took-six-years.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#dbeafe,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-sky{background:#e0f2fe;color:#0369a1}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#dbeafe,#93c5fd);border:2px solid #60a5fa;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#1e40af}
.node-em{background:linear-gradient(135deg,#e0f2fe,#7dd3fc);border-color:#0ea5e9;color:#0369a1}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#dbeafe;padding:10px 12px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #93c5fd}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Go encoding/json/v2：六年重构换来了什么？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 1.27</span>
  <span class="tag tag-sky">jsontext</span>
  <span class="tag tag-slate">Go1 兼容</span>
</div>
<p class="subtitle">本文解决的核心问题是：一个在生态中导入量排名前五的标准库 JSON 包，为何不能「修 Bug」而必须花六年另起 v2，以及 json/v2 与 jsontext 分层、实验期到稳定期时间线对大型基础设施演进的启示。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">时间线：2020 → Go 1.27 稳定</h3>
  <div class="diagram">
    <div class="node">原型 2020</div><span class="arrow-sym">→</span>
    <div class="node node-em">社区 Proposal</div><span class="arrow-sym">→</span>
    <div class="node">Go 1.25 实验</div><span class="arrow-sym">→</span>
    <div class="node node-em">1.27 稳定</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">Daniel Martí 与 Joe Tsai 双线：标准库局限 vs protojson 需要</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：JSON 很简单，重写是拖延。实际上障碍是<strong>Go 1 兼容性承诺</strong>下既有行为即契约——大小写宽松匹配、nil slice 序列化等「缺陷」已嵌入无数生产系统。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】为何不能原地修 encoding/json</h3>
  <p><strong>在讲什么问题：</strong>旧版 json 的设计债能否用补丁偿还？</p>
  <p><strong>关键理解：</strong>问题含严格性不足、API 难扩展、流式处理弱、性能结构瓶颈；任意行为变更可能 break 依赖方。</p>
  <p><strong>和其他概念关系：</strong>v2 与 v1 通过共享底层实现长期共存，而非大爆炸替换。</p>
  <p><strong>怎么落地用：</strong>新服务优先评估 json/v2；遗留系统保持 v1 直至有明确迁移收益。</p>
  <p><strong>边界说明：</strong>生态第三方库、代码生成器迁移节奏未必跟得上 Go 版本。</p>
  <p><strong>原文依据：</strong>「有些问题不是修复几个 Bug 就能解决的，而是需要重新设计 API。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】json/v2 + jsontext 两层</h3>
  <p><strong>核心思路：</strong>把<strong>语法层</strong>（jsontext：流式读写、Token）与<strong>语义层</strong>（v2：映射 struct、选项）拆开，便于 protojson 等共用底层。</p>
  <p><strong>操作步骤：</strong>① 读 Go 官方博客《A new Go API for JSON》→ ② 在非关键服务试 import json/v2 → ③ 对照 v1 行为差异表跑回归 → ④ 渐进替换热路径或新生成代码。</p>
  <p><strong>选型条件：</strong>需要更严格 JSON、更好流式、或可预测序列化语义的新项目。</p>
  <p><strong>避坑：</strong>假设 v2 与 v1 输出字节级一致——这正是不能原地改 v1 的原因。</p>
  <p><strong>对比相邻方法：</strong>社区 jsoniter、sonic 等第三方——标准库 v2 目标是统一实现减少碎片。</p>
  <p><strong>原文引用：</strong>六年交付的不只是一个新 JSON 库，更是标准库演进方法论。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】v1 vs v2 关切点</h3>
  <table>
    <tr><th>维度</th><th>encoding/json v1</th><th>json/v2 + jsontext</th><th>结论</th></tr>
    <tr><td>兼容性</td><td>历史行为冻结</td><td>新语义可更严格</td><td>并行而非替换</td></tr>
    <tr><td>架构</td><td>一体 API</td><td>语法/语义分层</td><td>易扩展、可共享</td></tr>
    <tr><td>流式</td><td>有限</td><td>jsontext 强化</td><td>大 JSON / 管道友好</td></tr>
    <tr><td>迁移</td><td>默认</td><td>显式 opt-in</td><td>团队需计划窗口</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】何时迁移 v2</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>2026 起新 Go 服务</td><td>评估 v2 默认</td><td>1.27 已稳定</td><td>盲目 v1「习惯」</td><td>错过流式与严格性</td></tr>
    <tr><td>依赖宽松匹配遗留 API</td><td>暂留 v1</td><td>行为契约</td><td>强行换 v2 无测</td><td>静默产出差异</td></tr>
    <tr><td>Protobuf JSON 互操作</td><td>关注共享 jsontext</td><td>Joe Tsai 动机线</td><td>各写一套 parser</td><td>重复与安全面</td></tr>
    <tr><td>性能敏感网关</td><td>benchmark 后决定</td><td>结构优化在底层</td><td>假设必快 N 倍</td><td>工作负载相关</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】标准库迁移</h3>
  <p><strong>坑名：</strong>认为「稳定」等于「与 v1 相同」。<strong>原因：</strong>v2 故意修正语义。<strong>解法：</strong>黄金文件测试对比输出。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>全公司一刀切升级 Go 版本。<strong>原因：</strong>依赖树未就绪。<strong>解法：</strong>按模块滚动，保留 v1 构建标签期。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>忽视六年里的社区 Proposal 讨论。<strong>原因：</strong>重复踩已决议的设计取舍。<strong>解法：</strong>读官方时间线图与 proposal 评论。<strong>严重程度：</strong>可忽略。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】大型基础设施演进</h3>
  <p><strong>原则：</strong>被海量依赖的组件，演进路径是<strong>新 API + 共享实现 + 漫长实验</strong>，不是勇敢 break。</p>
  <p><strong>为什么重要：</strong>Go 导入量前五的包动一根线牵动百万模块。</p>
  <p><strong>怎么落地：</strong>在自己维护的「准标准库」级组件上预演：v2 包名、兼容层、多年实验旗标。</p>
  <p><strong>适用边界：</strong>内部小库仍可快速 break；边界随下载量上升而硬化。</p>
  <p><strong>原文支撑：</strong>六年沉淀的是工程文化：兼容性、社区协作、分层架构一并交付。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「够用就行」/ 第三方 JSON 库忠实用户</p>
  <p class="rebuttal-text">六年磨一剑的标准库 v2 对已在 sonic 或 jsoniter 上押注的团队只是增加认知分裂——除非官方把生态工具链默认切到 v2，多数人仍会停留在 v1 又一个六年。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>encoding/json 的历史包袱与 Go1 承诺使「修旧库」不可行，催生并行 v2。</li>
    <li>2020–2026 时间线覆盖原型、公开讨论、Go 1.25 实验与 1.27 稳定。</li>
    <li>jsontext 与 json/v2 分层统一底层，服务流式与 protojson 等场景。</li>
    <li>迁移关键是行为差异测试与渐进 opt-in，而非一夜之间替换。</li>
    <li>案例价值在于标准库级重构的节奏与治理，不止 JSON 本身。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>阅读 go.dev 博客《A new Go API for JSON》与官方时间线图。</li>
    <li>在分支上对核心 struct 跑 v1/v2 序列化 golden test。</li>
    <li>新模块默认 Go 1.27+ 并记录选用 v2 的 API 面。</li>
    <li>跟踪 Daniel Martí / Joe Tsai 相关 talk 了解 jsontext 细节。</li>
    <li>把「不能改行为只能新包」原则写进自家公共库治理文档。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>最「简单」的 JSON 在超大规模生态里也会变成六年级的架构课——兼容性、分层与社区节奏与算法优化同等重要。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
