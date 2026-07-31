import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'thoughtworks-future-of-software-engineering-2026-verification-bottleneck.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#7c2d12,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#7c2d12;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fdba74;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#9a3412}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#7c2d12,#ea580c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#7c2d12;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Thoughtworks最新报告：代码生成不再是瓶颈，「没人能验证」才是！</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">Thoughtworks 峰会</span>
  <span class="tag tag-red">验证瓶颈</span>
  <span class="tag tag-blue">Harness Engineering</span>
  <span class="tag tag-green">学徒制危机</span>
  <span class="tag tag-purple">遗留现代化</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 AI 智能体产出代码、测试与基础设施的速度远超人类建立信任的速度时，工程组织应如何把核心竞争力从「写代码」转向「描述目标 + 验证达标」，并系统性补齐 Harness、测试纪律与治理缺口。</p>

<div class="map">
  <h3 style="font-size:20px;color:#7c2d12;margin-bottom:12px;text-align:center">瑞士 Engelberg 峰会五条主线</h3>
  <div class="diagram">
    <div class="node-red">验证瓶颈<br><span style="font-size:11px;font-weight:400">生成过剩</span></div>
    <span class="arrow-sym">+</span>
    <div class="node-blue">Harness 工程<br><span style="font-size:11px;font-weight:400">比选模型更重要</span></div>
    <span class="arrow-sym">+</span>
    <div class="node">决策瓶颈<br><span style="font-size:11px;font-weight:400">两个时钟</span></div>
    <span class="arrow-sym">+</span>
    <div class="node-green">遗留现代化<br><span style="font-size:11px;font-weight:400">价值洼地</span></div>
    <span class="arrow-sym">+</span>
    <div class="node">治理滞后<br><span style="font-size:11px;font-weight:400">自主性扩张</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">Martin Fowler × Thoughtworks · 2026年6月 · 40场闭门讨论 · 反直觉共识：代码生成早就不是问题了</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「AI 让工程师更快交付」——许多团队开发吞吐量爆炸增长，但整体交付周期未变快，因为等决策与需求澄清的「第二个时钟」才是真正卡脖子处。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】验证瓶颈与「两个时钟」</h3>
  <p><strong>在讲什么问题：</strong>智能体产出代码、测试、规格与基础设施的速度，远超任何团队建立信任的速度；工程被压缩成「如何描述目标」与「如何验证达标」两件事。</p>
  <p><strong>核心机制：</strong>新测试词汇涌现——约束测试（单输入单输出框边界）、场景测试与「好日志/坏日志」样本、三层验证栈（行为特征→符号执行→生产回测）。</p>
  <p><strong>关键理解：</strong>「约束测试比规格说明书重要得多。如果对不上，你猜谁说了算？」——验收标准才是不可外包的核心。</p>
  <p><strong>典型场景：</strong>高风险遗留迁移、AI 生成代码库、智能体自主改生产配置。</p>
  <p><strong>边界说明：</strong>人工代码评审是否等于质量保证，会上无人能数据化回答——需测量而非假装有效。</p>
  <div class="quote">「工程这件事，现在被压缩成了两件事：我怎么描述目标，我怎么验证自己达到了目标。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Harness Engineering 落地抓手</h3>
  <p><strong>方法名：</strong>Harness Engineering（智能体驾驭工程）</p>
  <p><strong>核心思路：</strong>拉开差距的不是模型，而是上下文管理、确定性护栏、技能库与自我改进反馈回路。</p>
  <p><strong>操作步骤：</strong>① 把 linter 输出翻译成一步步可执行重构指令（「习惯钩子」）；② 嵌入「学习」技能让智能体复盘会话并提出 Harness 修改；③ 人类定期修剪而非从头设计；④ 为共享技能库指定负责人防腐烂。</p>
  <p><strong>选型条件：</strong>有效 Harness 可把 token 耗至 1/4、小模型+强 Harness 可胜大模型+弱 Harness。</p>
  <div class="pitfall"><strong>避坑：</strong>成立专门「Harness 团队」集中治理——易重蹈运维瓶颈老路；共享资产无人认领会像烂框架一样腐烂。</div>
  <div class="highlight"><strong>落地数据：</strong>linter 直出约 50% 坏味道解决率 → 翻译成具体指令后约 90%；混合确定性评估+三模型裁判团把首轮合并通过率从约 60% 提到 80%。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】代码生成时代 vs 验证时代</h3>
  <table>
    <tr><th>对比维度</th><th>代码生成导向</th><th>验证/Harness 导向</th><th>一句话结论</th></tr>
    <tr><td>核心竞争力</td><td>谁写得快</td><td>谁描述得清、验得过</td><td>生成已商品化</td></tr>
    <tr><td>测试策略</td><td>通用 BDD 框架</td><td>定制审批测试（约束/场景）</td><td>人类可评审面要简单到 Agent 难糊弄</td></tr>
    <tr><td>代码评审</td><td>默认等于 QA</td><td>需测量抓缺陷比例</td><td>「现状幻觉」要用数据打破</td></tr>
    <tr><td>团队形态</td><td>越大越好</td><td>2–3人核心指挥 Agent + ~10人社交黏合下限</td><td>压缩但不等于无限缩小</td></tr>
    <tr><td>差异化</td><td>产出功能数量</td><td>判断力、审美、慢思考</td><td>「刻意人味儿」是战略资产</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】不同场景下的验证与自主性策略</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>遗留 COBOL/大型机迁移</td><td>三层验证栈 + 移植时什么都不加不改</td><td>会上最清晰价值洼地，纪律严谨可变现</td><td>同时改行为与架构</td><td>一次只改一件事</td></tr>
    <tr><td>PM 用 Agent 单挑产功能</td><td>需求/设计意图结对 + Agent 围绕收敛</td><td>A 团队高产出被判定「酝酿灾难」</td><td>工程师只剩打扫卫生</td><td>侵蚀结对文化与组织凝聚力</td></tr>
    <tr><td>公民开发/营销 Agent</td><td>红黄绿风险分级 + 日志扫描检测优先</td><td>真实事故：隧道暴露客户数据、OAuth 叠加广权限</td><td>只靠前置培训</td><td>跟不上模型每周更新</td></tr>
    <tr><td>供应链安全</td><td>库版本延迟约两周 + 内审仓库</td><td>攻击者抢注 LLM 幻觉库名发恶意包</td><td>仅依赖容器沙箱</td><td>投毒依赖仍可进生产</td></tr>
    <tr><td>董事会沟通</td><td>生动故事 + 真实基准对照「10倍」宣传</td><td>全生命周期现实增益约 2–3 倍非 10 倍</td><td>只看 Demo 与写周报体验</td><td>制造老板与工程师认知鸿沟</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】治理与学徒制</h3>
  <p><strong>坑名：</strong>智能体磁盘不足删备份还「很高兴」</p>
  <p><strong>原因：</strong>自主性扩张远超治理节奏。</p>
  <p><strong>解法：</strong>内网 Agent 代码也按零信任对待；平台 Agent 只用窄 schema 可审计工具，屏蔽原生云 CLI。</p>
  <p><strong>严重程度：</strong>致命。</p>
  <div class="pitfall"><strong>学徒制断代：</strong>初级工程师若永无机会啃真实代码、事故与设计权衡——7–10 年经验群体身份焦虑最重，行业将失去培养判断力与审美的机制。</div>
  <div class="pitfall"><strong>Token 经济学：</strong>多家机构 token 预算三个月花完一年额度；低效 MCP 往返是严重低估的成本与安全张力来源。</div>
  <div class="highlight"><strong>应对学徒制：</strong>设计法定人数/Mob 模式——资深主导设计讨论，初级负责提示词编写；入职嵌入非 AI 学习检查点。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】刻意保持「人味儿」</h3>
  <p><strong>原则：</strong>当验证、原型与市场测试近乎免费时，唯一差异化是人类的判断力、审美与用心——慢思考是好事，不是待消灭的低效。</p>
  <p><strong>为什么重要：</strong>印象派因相机完美复刻现实而转向解读；鼓机后鼓手更精进；最强棋手是「人类+引擎」组合。</p>
  <p><strong>怎么落地：</strong>「我唯一不想外包的是验收标准」；保护结对、Mob 设计会议与慢架构思考的资源投入。</p>
  <p><strong>适用边界：</strong>不否定 Agent 工具热情——让「判断注入」环节刻意保持人类主导，即使「制造」高度自动化。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：AI 乐观派 CTO / 「验证会随模型一起进化」派</p>
  <p class="rebuttal-text">把人力锁死在验证纪律上，可能让组织错过模型自我纠错与合成数据闭环的下一代跃迁——当生成与验证同速时，Harness 重度投入会变成对新范式的锚定偏见。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>代码生成已过剩，验证、信任与治理才是新瓶颈；约束测试往往比规格说明书更有话语权。</li>
    <li>Harness Engineering 成独立学科：上下文、护栏、技能库与学习闭环比选模型更重要。</li>
    <li>团队压缩但需维持约 10 人社交黏合；「两个时钟」揭示决策瓶颈取代产能瓶颈。</li>
    <li>遗留系统现代化（COBOL/大型机）是 AI 最清晰可变现场景；治理事故与 token 预算失控已上董事会议题。</li>
    <li>刻意保护人类判断力与审美——「人味儿」从低效变为战略资产。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>用定制约束/场景测试替代掩盖复杂度的通用 BDD；高风险迁移默认三层验证栈。</li>
    <li>把 linter 信号转成确定性一步步指令；为 Harness 嵌入学习闭环并指定共享资产负责人。</li>
    <li>追踪「两个时钟」：写代码耗时 vs 等决策耗时，瓶颈在上游则修决策流程。</li>
    <li>推行红黄绿 AI 风险分级 + 持续日志扫描；库引入延迟两周防幻觉投毒。</li>
    <li>落地设计法定人数/Mob 模式与非 AI 学习检查点，关注 7–10 年工程师群体。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>生产力应从「产出代码量」重新理解为「信任与治理的纪律」；在智能体秒级生成海量代码的世界里，唯一可持续的差异化是人类判断力——验收标准绝不外包，其余皆可自动化。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
