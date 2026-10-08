import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'spec-harness-brownfield-workflow.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#fff7ed,#ffedd5);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#c2410c,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#c2410c;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fdba74;border-radius:16px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#9a3412}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#c2410c;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px}`;

const body = `
<h1>棕地前端：三层 Harness 融合 Spec Kit / OpenSpec / Superpowers</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">棕地 10 万行</span>
  <span class="tag tag-blue">Delta Spec</span>
  <span class="tag tag-green">铁律 Skill</span>
  <span class="tag tag-purple">CLAUDE.md 宪法</span>
</div>
<p class="subtitle">本文解决的核心问题是：在不能停工补文档的 React 老项目上，如何不拼装 Spec Kit+Superpowers 两套工具，而是取宪法思维、铁律纪律与 Delta Spec，叠成 Spec / Skill / Harness 三层与 WORKFLOW.md 裁剪规则，让增量需求约 50 分钟跑通且 review 在合入前拦住规范与实现缺口。</p>

<div class="map">
  <h3 style="font-size:20px;color:#c2410c;margin-bottom:12px;text-align:center">三层架构（自上而下）</h3>
  <div class="diagram">
    <div class="node-blue">Harness<br>CLAUDE.md + 组件分层表</div>
    <span class="arrow-sym">↓</span>
    <div class="node-green">Skill 层<br>8 Skill + 硬门控</div>
    <span class="arrow-sym">↓</span>
    <div class="node">Spec 层<br>Delta + 单目录收拢</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「把三个开源框架拼一起就行」。作者实测 Spec Kit+Superpowers 九步协同成立，但<strong>流程耗时翻倍 + 中间规范要手工粘贴</strong>，只适合超大规模团队；棕地小改动（50 行）走完全阶段门控 ROI 极差。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】三框架：拿走什么、丢掉什么</h3>
  <table>
    <tr><th>框架</th><th>保留</th><th>丢弃</th><th>丢弃原因</th></tr>
    <tr><td>Spec Kit</td><td>宪法式可验证约束</td><td>阶段门控、按功能分片规范</td><td>改动小则流程倒挂；棕地无 Delta</td></tr>
    <tr><td>Superpowers</td><td>MUST 铁律、反合理化闭环</td><td>14 Skill 全链、纯 brainstorming</td><td>Token 与子代理成本高；无规范累积；方向易偏</td></tr>
    <tr><td>OpenSpec</td><td>Delta Spec、单目录收拢</td><td>无纪律的 apply</td><td>企业场景不能靠 AI 自觉</td></tr>
  </table>
</div>

<div class="card">
  <h3>【概念拆解卡】brainstorming vs grill-me 方向校准</h3>
  <p><strong>在讲什么问题：</strong>为何扔掉 Superpowers 的 brainstorming，改用 Matt Pocock 式 grill-me 做 product Skill。</p>
  <p><strong>关键理解：</strong>brainstorming 适合绿地、模糊想法；grill-me 假设已有主干（PRD + 十万行代码），一次一问、长 design tree，细节密度高。</p>
  <p><strong>怎么落地用：</strong>企业棕地用「六维评审 + 逐层审问」产出 <code>product.md</code>，下游 api/ui/page 不再补方向性细节。</p>
  <p><strong>边界说明：</strong>只有念头、无文档时 grill-me 会把人问崩——别在探索期硬用。</p>
  <div class="quote">作者：TDD 再好，做出来的东西跟需求对不上也白搭。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】WORKFLOW 三种模式</h3>
  <p><strong>full：</strong>新功能/跨模块 → 完整 8 Skill 链 + <code>.spec.yaml</code> 追踪。</p>
  <p><strong>light：</strong>小改动、纯 review/补测 → 只跑必要 Skill，不建 YAML、不归档。</p>
  <p><strong>bugfix：</strong>Jira → 根因 → 最小修复，独立链路，不进 spec 进度。</p>
  <p><strong>操作步骤：</strong>在 <code>spec/WORKFLOW.md</code> 写清 Skill 依赖（api/ui 并行 → page → test/qa → review）；换项目时 CLAUDE.md 重写，WORKFLOW 可迁移。</p>
  <div class="highlight">组件 L0–L3 对照表：禁止直接用 antd 原生（L0），优先 L1 封装；review 发现漏登记则回流 CLAUDE.md，四个月表从十余行长到四十余行，误用降八成。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】用户角色筛选案例（Delta → Skill → review）</h3>
  <p><strong>Spec 层：</strong>只写 ADDED/MODIFIED（角色下拉、接口 <code>role</code> 参数、URL 同步）进 <code>spec/changes/user-role-filter/</code>。</p>
  <p><strong>Skill 层：</strong>api/ui 读 CLAUDE.md；接口不清标 <code>[待确认]</code> 停等人；page 组装后 test；每步更新 <code>.spec.yaml</code>。</p>
  <p><strong>Harness 层：</strong>review 三步（意图/质量/边界）；发现应使用 <code>RoleSelect</code> 而非原生 Select → 补宪法；发现漏 URL 同步 → 标 <code>[需修复]</code> 退回 page。</p>
  <p><strong>结果：</strong>全程约 50 分钟，合入前拦 2 个问题，归档到 <code>archive/日期-id/</code>。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】自建 Harness 常见坑</h3>
  <p><strong>小改动仍跑 full 八链：</strong>固定流程成本吃掉收益——用 light/bugfix——严重程度：小心。</p>
  <p><strong>铁律写成「请尽量」：</strong>RLHF 乐观偏见下无效——改成执行步骤硬门控——严重程度：致命。</p>
  <p><strong>只维护 CLAUDE.md 无 WORKFLOW：</strong>方法论与项目事实混淆——换库即失忆——严重程度：小心。</p>
  <p><strong>期待 OpenSpec apply 自证质量：</strong>必须叠 review+TDD 纪律——严重程度：致命。</p>
</div>

<div class="card">
  <h3>【决策/选型表】何时用哪套方法论</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>十万行棕地、有 PRD</td><td>本文三层 + grill-me</td><td>增量 Spec + 规范回流</td><td>Spec Kit 全阶段门控</td><td>1.5h 流程 vs 50 行改动</td></tr>
    <tr><td>个人绿地原型</td><td>Superpowers brainstorming</td><td>低启动成本</td><td>八 Skill 全链</td><td>Token 与子代理过重</td></tr>
    <tr><td>超大规模、能扛双倍流程</td><td>Spec Kit+Superpowers 组合</td><td>语义/物理两层隔离成立</td><td>十人团队硬套</td><td>胶水层人力填缝</td></tr>
    <tr><td>仅要 Delta 文档</td><td>OpenSpec 底座</td><td>40 分钟级增量</td><td>单独 OpenSpec apply</td><td>无企业级纪律</td></tr>
  </table>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：流程极简派 / 「AI 自觉就够」</p>
  <p class="rebuttal-text">八 Skill、YAML 追踪和组件四层表是另一套官僚软件工厂——团队真正需要的是删流程写代码，不是把 Superpowers 的 MUST 抄进更多 Markdown。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>三框架精髓可融为一层系统，消除「规范↔执行」手工胶水。</li>
    <li>棕地核心：Delta Spec 只写变化 + 铁律 Skill + CLAUDE.md 可验证宪法与组件分层表。</li>
    <li>方向校准用 grill-me 式审问，而非绿地 brainstorming；流程用 full/light/bugfix 裁剪。</li>
    <li>review 双向回流：规范缺口进 CLAUDE.md，实现缺口退回上游 Skill。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>在 <code>spec/WORKFLOW.md</code> 画出 Skill 链与三种模式触发条件。</li>
    <li>把「禁止 L0 原生组件」写成可 review 抓取的规则，并建 L1–L3 初表。</li>
    <li>选一个真实小需求跑通 Delta → api/ui/page → review，记录 <code>.spec.yaml</code>。</li>
    <li>对比单次改动耗时，决定默认 light 还是 full。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「选哪个 AI 流程框架」到「在同一仓库里把规范增量、执行纪律与可验证宪法焊成闭环」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log(`Wrote ${OUT} (${height}px)`);
