import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'multi-agent-five-principles.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:18px 24px;text-align:center;min-width:130px;font-weight:700;font-size:15px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.arrow-sym{font-size:22px;color:#94a3b8}
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
<h1>多 Agent 不是万能的！搞懂这 5 个原则，少走 1 年弯路！</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">多 Agent</span>
  <span class="tag tag-green">单 Agent</span>
  <span class="tag tag-orange">工程稳定性</span>
  <span class="tag tag-purple">Claude Code</span>
</div>
<p class="subtitle">本文解决的核心问题是：当复杂任务出现时，团队为何本能地堆砌多 Agent，以及从工程稳定视角判断——什么场景该用单 Agent、什么场景才值得拆多 Agent，以及若必须拆分应遵循哪五条原则。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">AI 系统建设递进路径</h3>
  <div class="diagram">
    <div class="node-green">规则系统<br><span style="font-size:12px;font-weight:400">规则明确优先</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">Workflow+LLM<br><span style="font-size:12px;font-weight:400">企业首选落点</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">单 Agent<br><span style="font-size:12px;font-weight:400">长链路决策</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">多 Agent<br><span style="font-size:12px;font-weight:400">拆分收益明确时</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「人类靠分工搞定复杂任务，AI 也该一样」—— 人类分工解决能力分散，技术拆分解决工程控制；看着像一回事，设计差得很远。换几个 Prompt 角色名不等于真正的多 Agent。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Agent 与多 Agent 的工程定义</h3>
  <p><strong>在讲什么问题：</strong>什么叫真正的 Agent？什么叫有价值的多 Agent？</p>
  <p><strong>核心机制：</strong>Agent = 以模型为决策核心、工具为执行手段、状态为粘合层的任务执行单元（目标+状态+工具+反馈闭环）。多 Agent = 同一目标下多个相对独立决策单元，通过串行/并行/分层/自由裁决协同。</p>
  <p><strong>关键理解：</strong>真正有价值的差异在边界：工具是否不同、权限是否不同、输入上下文是否不同、评价标准是否不同、失败模式是否不同——若都没变只是换角色名，复杂度涨了能力结构没拉开。</p>
  <p><strong>典型场景：</strong>单 Agent 适合中短链路需统一判断；串行多 Agent 适合规则清晰的信息链；并行适合多路检索；分层适合平台型编排。</p>
  <p><strong>边界说明：</strong>自由多 Agent（节点自由裁决）适合创意脑暴但评价标准难设计、成本高，不宜作为企业首选。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】五种多 Agent 形态</h3>
  <table>
    <tr><th>对比维度</th><th>单 Agent</th><th>串行多 Agent</th><th>并行多 Agent</th><th>分层多 Agent</th><th>自由多 Agent</th></tr>
    <tr><td>上下文连续性</td><td>高，责任集中</td><td>低，交接损耗大</td><td>中，需合并</td><td>中，调度层风险</td><td>低，难追踪</td></tr>
    <tr><td>核心优势</td><td>链路易追踪</td><td>步骤边界清楚</td><td>吞吐高、并发</td><td>治理与权限分层</td><td>高不确定性输出</td></tr>
    <tr><td>主要劣势</td><td>长链路上下文负担</td><td>错误易级联</td><td>合并与冲突处理难</td><td>调度层易成单点</td><td>评价难、成本高</td></tr>
    <tr><td>适用场景</td><td>持续决策型任务</td><td>规则清晰处理链</td><td>多路检索/多候选</td><td>复杂任务编排平台</td><td>创意脑暴</td></tr>
    <tr><td>一句话结论</td><td>默认优先选项</td><td>慎用，交接成本高</td><td>并发而非组织协作</td><td>需成熟调度层</td><td>非生产首选</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】多 Agent 为何现在普遍不太行</h3>
  <p><strong>坑 1 — 决策连续性断裂：</strong>后一个 Agent 看到的是「二手信息」（摘要/截断），隐性判断传几次就变味；每步合理但整体不一致。</p>
  <p><strong>坑 2 — 交接成本被低估：</strong>真正成本在任务拆分、状态同步、摘要生成、冲突裁决、链路排障，不在模型调用次数。</p>
  <p><strong>坑 3 — 复杂度涨收益没跟上：</strong>路由、上下文治理、冲突判定、监控定位——变成维持协同本身，而非推进业务。</p>
  <p><strong>坑 4 — 基础层不扎实就上多 Agent：</strong>任务建模、状态管理、验证闭环、边界控制没做好，多 Agent 是复杂度放大器。</p>
  <div class="quote">原文：「一个模糊的任务交给一个 Agent 结果可能不稳定；拆成五段交给五个 Agent，只会得到五段更难追责的不稳定结果。」</div>
  <p><strong>严重程度：</strong>致命——采购审批案例中，分类归错则全链跑偏，各节点日志很多但根因定位极慢。</p>
</div>

<div class="card">
  <h3>【决策/选型表】什么项目适合 Agent / 多 Agent</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>规则明确、步骤固定</td><td>规则系统 / Workflow+LLM</td><td>成本最低、落地可行性最高</td><td>直接上多 Agent</td><td>交接成本远大于收益</td></tr>
    <tr><td>长链路+工具调用+可验证</td><td>单 Agent + 工具链</td><td>上下文连续，有闭环可迭代</td><td>按角色名硬拆</td><td>决策连续性断裂</td></tr>
    <tr><td>上下文污染、子任务可并行</td><td>多 Agent（信息隔离/并发）</td><td>拆分为隔离信息或并发执行</td><td>为「显得专业」而拆</td><td>复杂度涨、收益不明</td></tr>
    <tr><td>工具/权限/评价标准明显不同</td><td>多 Agent（职责边界清晰）</td><td>检索/执行/验证真正分离</td><td>同模型换 Prompt 名</td><td>假多 Agent，无系统意义</td></tr>
    <tr><td>开放战略、高风险核心工程</td><td>人工主导 + Agent 辅助</td><td>评价模糊或责任不可审计</td><td>自主执行权全交 Agent</td><td>局部合理、全局危险</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】必须做多 Agent 时的 5 条原则</h3>
  <p><strong>原则 1 — 按系统边界拆，不按角色名拆：</strong>先看哪部分需不同权限/工具/输入视角/并行/独立验证，再定 Planner/Reviewer 等角色。</p>
  <p><strong>原则 2 — 高耦合决策留在一个连续执行体：</strong>全局策略、高风险动作、风格一致性、强依赖历史状态的决策、例外路径不宜过早拆散。</p>
  <p><strong>原则 3 — 中间态结构化，不靠自然语言转述：</strong>用 TaskState（objective、verified_facts、unresolved_questions、candidate_actions、rollback_point 等）替代长文本互传。</p>
  <p><strong>原则 4 — 生成与验证分离：</strong>一节点生成动作，另一节点验证结果；流程：生成→执行→验证→裁决，职责隔离而非角色越多越好。</p>
  <p><strong>原则 5 — 可观测、可追踪、可回滚：</strong>能还原谁做的决定、基于什么上下文、调了哪些工具、出错能否退回安全状态。</p>
  <div class="highlight">Claude Code 真正值得借鉴的不是「支持多 Agent」，而是 progress file、git commit 回退、端到端测试验证——决定下限的是执行系统，不是角色数量。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】克制复杂度</h3>
  <p><strong>原则：</strong>更现实的建设顺序是 Workflow+LLM 打牢 → 单 Agent 做深 → 只在拆分收益非常明确时引入多 Agent。</p>
  <p><strong>为什么重要：</strong>适合 Agent 的项目有明确特征：链路长、需持续决策、有工具、有验证闭环、状态可管理、风险可约束——缺一则先补基础层。</p>
  <p><strong>怎么落地：</strong>采购审批案例优先方案 A（单 Agent + 事实层 facts + decide + execute + verify + persist），而非六个角色各管一角的方案 B。</p>
  <p><strong>适用边界：</strong>多 Agent 落地可行性评为「中」——只有拆分收益能覆盖交接与治理成本时才进入。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「多 Agent 架构师」/ 追求组织感的产品团队</p>
  <p class="rebuttal-text">复杂任务天然需要分工——采购、风控、审批本就是多角色协作，强行塞进单 Agent 会让上下文爆炸、无法并行，多 Agent 是工程上唯一可扩展的路径。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>多 Agent 不是银弹——人类分工与技术拆分的动机不同，换角色名不等于系统能力拉开。</li>
    <li>当前多 Agent 普遍不稳的根因是决策连续性断裂、交接成本被低估、基础层不扎实。</li>
    <li>建设顺序应为规则 → Workflow+LLM → 单 Agent → 多 Agent，多数企业应先落在 Workflow+LLM。</li>
    <li>仅在上下文污染、子任务可并行、职责边界明确（工具/权限/评价不同）时考虑拆分。</li>
    <li>若必须做多 Agent，五条原则：按边界拆、高耦合决策不拆、中间态结构化、生成验证分离、可观测可回滚。</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>审视当前「多 Agent」设计：工具、权限、评价标准是否真正不同，还是同模型换 Prompt 名。</li>
    <li>为单 Agent 补齐任务建模、状态持久化、验证闭环、人工接管条件四项基础层。</li>
    <li>Agent 间交接改用 TaskState 结构化字段，禁止仅靠自然语言摘要传递关键决策语境。</li>
    <li>借鉴 Claude Code：进度写 progress file、动作可 git 回退、用端到端测试而非模型猜状态。</li>
    <li>新需求立项时先问：拆分收益能否覆盖交接与治理成本？不能则保持单 Agent 或 Workflow。</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「结构上像不像一个组织」转向「工程上能不能稳定运行」——决定 Agent 上限的是模型，决定下限的是执行系统；急于拆分角色前，先确认业务痛点是否真的需要用更高工程复杂度来换取。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
