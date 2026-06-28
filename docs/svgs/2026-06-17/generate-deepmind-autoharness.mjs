import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'deepmind-autoharness.svg');

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
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:160px;font-weight:700;font-size:16px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:24px;color:#94a3b8}
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
<h1>DeepMind 亮出王炸：别再手写 Agent Harness 了，AI 已经学会自己写了！</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Agent Harness</span>
  <span class="tag tag-green">AutoHarness</span>
  <span class="tag tag-orange">DeepMind</span>
  <span class="tag tag-purple">人机协同</span>
</div>
<p class="subtitle">本文解决的核心问题是：当大模型在规则博弈中近八成败于「犯规」而非技不如人时，DeepMind 的 AutoHarness 如何用「AI 自写代码护栏」替代手工 Harness，以及人类工程师应转向环境设计与评估体系构建。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-orange">裸奔 LLM<br/>语言强 / 规则弱</div>
    <span class="arrow-sym">→</span>
    <div class="node">Code Harness<br/>规则校验器</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">AutoHarness<br/>试错→批评→精炼</div>
    <span class="arrow-sym">→</span>
    <div class="node">环境设计 + Evals<br/>人类新角色</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「AutoHarness 意味着手写 Harness 立刻过时」—— 原文明确，极高安全要求与复杂业务领域仍需人类专家经验；变化的是重心从「亲手写规则」转向「设计能自学习规则的环境与评估标准」。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Agent Harness 与 AutoHarness</h3>
  <p><strong>在讲什么问题：</strong>大模型为何需要外部「驾驭系统」，以及 DeepMind 如何让 AI 自己生成这套系统。</p>
  <p><strong>核心机制：</strong>Harness 是给「毛坯大脑」装配的规则护栏；AutoHarness 让模型根据环境反馈，迭代生成含 propose_action() 与 is_legal_action() 的 Python 校验代码。</p>
  <p><strong>关键理解：</strong>模型擅长模仿「像正确答案的文本」，却不天然遵守当前状态下的硬规则——护栏把概率生成约束在合法动作空间内。</p>
  <p><strong>典型场景：</strong>棋类对战、文本游戏、任何有明确合法性判定的 Agent 决策环境。</p>
  <p><strong>边界说明：</strong>依赖环境能提供清晰、即时的合法/非法反馈；模糊语义、多步审批、合规审计链难以仅靠自动迭代收敛。</p>
  <div class="quote">原文：「大模型本身只是一个毛坯大脑，你必须为它手工打造一套精密的外部骨骼（Harness），它才能真正干活。」</div>
  <div class="relation"><strong>与 ReAct 循环的关系：</strong>ReAct 解决「怎么想、怎么调工具」；Harness 解决「想出来的动作是否合法」——二者叠加才构成完整 Agent 栈。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】AutoHarness 四步自我进化闭环</h3>
  <p><strong>方法名：</strong>Code-as-Harness 迭代精炼</p>
  <p><strong>核心思路：</strong>用并行环境试错 + LLM 批评家/精炼器，把错误反馈转化为代码补丁，树搜索式逼近 100% 合法动作校验。</p>
  <p><strong>操作步骤：</strong>1. 基础模型生成初始策略代码（含合法走步函数）→ 2. 10 路并行环境运行，非法步或执行错误即终止并采集反馈 → 3. 批评家整理错误，精炼器 LLM 改写代码 → 4. 重新投入环境，循环直至收敛。</p>
  <p><strong>选型条件：</strong>规则可程序化判定、反馈信号明确、可承受十余次迭代的算力成本时优先于手工 Harness。</p>
  <div class="highlight"><strong>落地建议：</strong>为业务 Agent 先抽象「最小可试错沙箱」：定义动作 API、合法判定函数、结构化错误码，再让模型在沙箱内自写 is_legal_action 类校验逻辑。</div>
  <div class="pitfall"><strong>避坑：</strong>环境反馈含糊（如「操作失败」无原因）会导致精炼器盲改；必须像 DeepMind 游戏环境一样给出可定位的错误信息。</div>
  <div class="quote">原文：「在 145 个不同的文本游戏中，AutoHarness 平均只需要 14.5 次迭代，就能生成达到 100% 准确率的合法走步校验器。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】微调 vs 手写 Harness vs AutoHarness</h3>
  <table>
    <tr><th>对比维度</th><th>模型微调</th><th>手写 Harness</th><th>AutoHarness</th><th>一句话结论</th></tr>
    <tr><td>规则遵守</td><td>概率性内化，难保证 100%</td><td>人类硬编码，可精确</td><td>迭代至环境反馈收敛</td><td>要确定性护栏别只靠微调</td></tr>
    <tr><td>成本与速度</td><td>数据+算力极高，迭代慢</td><td>每换场景重写，脆弱</td><td>平均 14.5 次迭代/游戏</td><td>AutoHarness 规模化更优</td></tr>
    <tr><td>泛化能力</td><td>可能损害其他任务</td><td>场景绑定强</td><td>依赖环境抽象质量</td><td>通用能力 vs 规则精度需权衡</td></tr>
    <tr><td>人机分工</td><td>数据标注者</td><td>规则手工艺人</td><td>环境设计师+评估者</td><td>人的价值上移到 Evals</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】裸奔 Agent 的三类典型失败</h3>
  <p><strong>坑名：</strong>非法动作泛滥——Kaggle 国际象棋赛中 Gemini 2.5 Flash 78% 败局源于 Illegal Moves。</p>
  <p><strong>原因：</strong>模型按训练数据概率模仿「像合法走法」的文本，未绑定当前棋盘状态约束。</p>
  <div class="quote">原文：「它会尝试让马走直线，或者把兵横着走。」</div>
  <p><strong>解法：</strong>部署前必须为 Agent 装配 Harness 或 AutoHarness 生成的 is_legal_action 校验层，禁止裸模型直接输出动作。</p>
  <p><strong>严重程度：</strong>致命——无护栏时大模型 Pro 对局胜率仅 38.2%，装备护栏的小模型 Flash 胜率达 56.3%。</p>
  <div class="pitfall"><strong>延伸坑：</strong>以为「模型越大越不需要护栏」——实验表明 Flash+Harness 可碾压裸奔的 Pro，Harness 价值与模型规模正交。</div>
</div>

<div class="card">
  <h3>【决策/选型表】Harness 建设路径怎么选</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>规则清晰的游戏/仿真环境</td><td>AutoHarness 自动生成</td><td>145 游戏验证，迭代成本低</td><td>纯微调学规则</td><td>代价高且难 100% 合法</td></tr>
    <tr><td>金融/医疗/权限审批</td><td>人类手写 Harness + 人工审批</td><td>安全边界与审计链不可自动化试错</td><td>完全 AutoHarness</td><td>合规验收无法仅靠环境反馈</td></tr>
    <tr><td>成本敏感在线推理</td><td>Harness-as-Policy 纯代码策略</td><td>运行时零 LLM 调用，小模型代码可超 GPT-5.2-High 均分</td><td>每步调大模型</td><td>延迟与 Token 成本爆炸</td></tr>
    <tr><td>快速原型验证</td><td>手写最小 Harness + Evals</td><td>先跑通再考虑自动化合成</td><td>直接裸 Agent 上线</td><td>非法动作与死循环在生产才暴露</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】从「教它做事」到「教它学习」</h3>
  <p><strong>原则：</strong>把 AI 当能自我反思的初级程序员——提供测试用例与明确错误反馈，放手让它进化规则，而非手把手写每一行护栏。</p>
  <p><strong>为什么重要：</strong>人类终极护城河是定义「什么是好的 Harness」——环境设计与 Evals 架构，而非重复劳动写校验器。</p>
  <div class="quote">原文：「当 AI 能写 Harness 时，我们人类的终极护城河，就变成了定义什么是好的 Harness 的能力。」</div>
  <div class="highlight"><strong>怎么落地：</strong>① 将业务抽象为可安全试错的模拟环境 ② 建设批评家/裁判式多 Agent 评估链 ③ 为 Harness 定义 Token 成本、安全边界、跑分基准。</div>
  <p><strong>适用边界：</strong>递归自我改进仍处早期；复杂领域人类专家经验与 Safety Middleware 不可替代。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：企业安全合规团队 / 「护栏必须人审」派</p>
  <p class="rebuttal-text">145 个文本游戏里平均 14.5 次迭代就能收敛，换成支付清结算或多级审批的业务系统，没有人类写死的中间件、审计链和变更评审，AutoHarness 自生成的护栏根本过不了合规验收，更扛不住一次错误放行的资金损失。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>大模型语言能力强但规则遵守弱，无 Harness 时近八成棋局败于犯规而非策略差。</li>
    <li>AutoHarness 用试错→批评→精炼闭环，平均十余次迭代即可合成 100% 合法动作校验器。</li>
    <li>小模型+护栏可击败裸奔大模型，Harness-as-Policy 甚至能在单人游戏中超越顶级模型均分。</li>
    <li>工程师角色从规则手工艺人转向环境设计师与评估体系架构师。</li>
    <li>手写 Harness 不会立刻消失，但重心从授人以鱼变为授人以渔。</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>盘点现有 Agent 是否存在「裸奔」路径，为关键动作增加 is_legal 类校验层。</li>
    <li>为下一 Agent 项目设计最小可试错沙箱：结构化动作 API + 明确错误反馈。</li>
    <li>建立 Harness Evals：合法率、胜率、Token 成本、安全拦截率四类基准指标。</li>
    <li>阅读 AutoHarness 论文（arXiv:2603.03329），对照自家业务判断哪些场景可尝试自动合成护栏。</li>
    <li>高安全领域保留人工 Harness 与审批链，仅用 AutoHarness 思路优化内部仿真环境。</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>Harness Engineering 的价值不在「亲手写每一行规则」，而在「设计让 AI 能自己学规则的环境，以及判定好坏的评估体系」——这才是 AI 自我进化前夜人类架构师真正的壁垒。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
