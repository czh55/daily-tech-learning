import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'agentic-coding-expertise.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.diagram{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:160px;font-weight:700;font-size:16px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
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
<h1>Anthropic 40万大样本揭秘：AI 时代为什么「专家」身价暴涨？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Agentic Coding</span>
  <span class="tag tag-green">专家溢价</span>
  <span class="tag tag-orange">Anthropic 白皮书</span>
  <span class="tag tag-purple">职业转型</span>
</div>
<p class="subtitle">本文解决的核心问题是：基于 Anthropic 对 40 万次 Claude Code 真实会话的实证分析，AI 究竟是专家经验的放大器还是掘墓人，以及决定开发者 AI 时代身价的到底是语法熟练度还是领域常识与纠偏能力。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">人类 70% 定目标</div>
    <span class="arrow-sym">+</span>
    <div class="node-green">AI 80% 执行搬砖</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">领域常识 Guardrails</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">专家成功率 91%</div>
    <span class="arrow-sym">vs</span>
    <div class="node-red">新手 15%</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「AI 会写代码了，程序员迟早被替代」—— 白皮书显示人类仍掌控 70% 的规划决策，AI 只是执行义肢；真正被边缘化的是只会翻译 PRD 为语法、缺乏领域常识的初级码农，而非拥有情境品味的专家。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Agentic Coding 人机分工模型</h3>
  <p><strong>在讲什么问题：</strong>Anthropic 如何定义智能体编码时代人类与 AI 的权力边界。</p>
  <p><strong>核心机制：</strong>研究人员用机器学习分类器对 40 万次 Claude Code 会话的每个动作归类，发现人类主导「What to do」（规划、业务逻辑、系统规范）占 70% 决策，AI 主导「How to do it」（命令调用、文件修改、语法选择、测试脚本）占 80% 工作。</p>
  <p><strong>关键理解：</strong>大模型不是取代程序员，而是成为不知疲倦的执行义肢——人类出脑子（Framer），AI 出体力（Executor），这是工业级开发的黄金分工。</p>
  <p><strong>典型场景：</strong>使用 Claude Code 进行功能开发、重构、测试与部署的全流程协作。</p>
  <p><strong>边界说明：</strong>若团队把 AI 当黑盒、人类零参与规划，则分工模型失效，产出质量急剧下降。</p>
  <div class="quote">原文：「人类出脑子（Framer），AI 出体力（Executor），这种分工正在成为现代软件开发的黄金标准。」</div>
  <div class="relation"><strong>与「专家溢价」的关系：</strong>分工模型解释了为何专家在规划端的价值被放大——AI 越强，能执行的部分越多，「定标画框」的人类决策就越稀缺。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】L1 萌新 vs L5 专家使用 Claude Code</h3>
  <table>
    <tr><th>对比维度</th><th>L1 萌新</th><th>L5 专家</th><th>一句话结论</th></tr>
    <tr><td>高难度任务成功率</td><td>15%（宽松指标 39%）</td><td>91%</td><td>专业度决定 AI 辅助天花板</td></tr>
    <tr><td>单次指令 AI 行动数</td><td>平均 4.9 次</td><td>平均 11.7 次</td><td>专家一条指令触发更长链式推理</td></tr>
    <tr><td>单次产出词数</td><td>约 607 词</td><td>约 3,200 词</td><td>AI 愿意为专家干更多活</td></tr>
    <tr><td>Prompt 特征</td><td>无领域术语，报错无感知</td><td>行业黑话 + 预判 AI 易犯错误</td><td>精确 Guardrails 让 AI hill-climbing</td></tr>
    <tr><td>AI 犯错时</td><td>无能为力，眼睁睁看胡说</td><td>瞬间纠偏，牵 AI 过泥潭</td><td>纠偏能力是专家核心溢价</td></tr>
  </table>
  <div class="highlight"><strong>落地建议：</strong>用 Anthropic 五级分类器自测段位——对照 L4/L5 典型 Prompt 改写自己的指令，加入业务边界限制（Guardrails）和情境品味（Situated Taste），避免模糊提问触发「误解→垃圾代码→报错→放弃」死循环。</div>
</div>

<div class="card">
  <h3>【决策/选型表】AI 时代开发者能力投资方向</h3>
  <table>
    <tr><th>场景</th><th>推荐投资</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>日常 CRUD 翻译 PRD</td><td>转向业务理解与架构规划</td><td>纯编写工作被 AI 以 25% 年化增速吞噬</td><td>继续堆语法熟练度</td><td>与 AI 比速度毫无优势</td></tr>
    <tr><td>AI 生成千行代码 Review</td><td>建立代码审计与纠偏能力</td><td>未来高级工程师核心是 Code Auditor</td><td>盲信 AI 产出直接合并</td><td>锁竞争、并发 Bug 藏在完美外观下</td></tr>
    <tr><td>通用后端开发</td><td>深耕垂直领域（金融/医疗/安全）</td><td>领域专家编码成功率 90-97%，超越纯码农</td><td>做「只会增删改查」的通用程序员</td><td>非软件行业专家正降维打击</td></tr>
    <tr><td>跨行业 AI 编码</td><td>积累业务逻辑与情境品味</td><td>会计师描述对账规则比懂 Python 的初级程序员产出更可靠</td><td>只学编程语法不学业务</td><td>业务层面代码大概率是 Slop</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】AI 编码时代三大职业陷阱</h3>
  <p><strong>坑 1：误以为 AI 会取代所有程序员</strong></p>
  <p><strong>原因：</strong>只看到 AI 写代码速度，忽视人类仍掌控 70% 规划决策。</p>
  <p><strong>原文说法：</strong>「大模型并不是在取代程序员，而是成为了一个不知疲倦、效率极高的执行义肢。」</p>
  <p><strong>解法：</strong>从「How 写代码」转向「What 定目标」，成为定标画框的人。</p>
  <p><strong>严重程度：</strong>致命（方向错误导致被淘汰）</p>
  <div class="pitfall"><strong>坑 2：模糊 Prompt 触发 AI 死循环</strong> — 无领域常识的提问让 AI 陷入误解→垃圾代码→报错→再生成→用户放弃。严重程度：致命。</div>
  <div class="pitfall"><strong>坑 3：盲信 AI 生成的「完美代码」</strong> — 看似完美的千行代码可能隐藏锁竞争或并发 Bug，新手无法识别。严重程度：致命（生产事故）。</div>
  <div class="pitfall"><strong>坑 4：停留在通用 CRUD 技能</strong> — 法律/金融/管理领域专家用 AI 编码成功率 95-97%，正在干掉不会审计的程序员。严重程度：小心（中长期边缘化）。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】领域常识是最坚固的技术壁垒</h3>
  <p><strong>原则：</strong>决定代码质量的不再是编程语法熟练度，而是业务逻辑与情境品味的理解深度。</p>
  <p><strong>为什么重要：</strong>AI 降低了写代码门槛，却让垃圾代码（Slop）遍地都是；7 个月内 Claude Code 任务经济价值暴涨约 25%，低价值纯编写工作被快速吞噬。</p>
  <div class="quote">原文：「业务逻辑与情境品味（Situated Taste），正在成为 AI 时代最坚固的技术壁垒。而单纯的语法编写，已经彻底沦为了廉价的机器工。」</div>
  <p><strong>怎么落地：</strong>① 深入理解业务与数据库底层设计；② 训练在数秒内揪出 AI 代码中隐藏 Bug 的审计能力；③ 选定一个垂直领域（医疗/金融/安全/芯片/网络）持续深耕。</p>
  <p><strong>适用边界：</strong>若你已是 L5 领域专家且能精准纠偏 AI，此原则对你已是日常；若仍停留在 L1-L2，需先提升 Prompt 专业度与验证能力。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：AI 民主化倡导者 / 「工具平权」派</p>
  <p class="rebuttal-text">Anthropic 的 40 万样本恰恰证明 AI 正在拉平入门门槛——新手成功率 15% 到 39% 意味着大量原本写不出代码的人已经能产出可运行软件；专家 91% 的溢价可能只是当前模型尚弱的暂时现象，当推理能力再跃迁一代，Guardrails 和纠偏的价值会被更强的自主 Agent 内化，今日的专家溢价不过是模型不够聪明时的过渡红利。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>人机分工清晰：人类 70% 定目标，AI 80% 执行搬砖，程序员角色从码农转向工作流指挥家。</li>
    <li>专家溢价实证：L5 成功率 91% vs L1 的 15%，专家单条指令触发 AI 11.7 次行动与 3,200 词产出。</li>
    <li>领域常识壁垒：法律/金融/管理专家编码成功率 90-97%，非软件行业正降维打击纯码农。</li>
    <li>经济价值重构：7 个月内 AI 完成任务价值涨 25%，低价值纯编写工作被快速吞噬。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>对照 Anthropic L1-L5 分类器，评估自己当前段位并改写 3 条典型 Prompt 加入领域术语与 Guardrails。</li>
    <li>本周内建立 AI 代码审计清单：合并前必须人工检查并发、锁竞争与业务逻辑漏洞。</li>
    <li>选定一个垂直领域（金融/医疗/安全等），制定 90 天深耕计划，积累无法被文本化的行业直觉。</li>
    <li>将日常工作重心从「翻译 PRD 为代码」转向「定义系统规范与架构权衡」。</li>
  </ol>
  <p><strong>关键认知转变：</strong>AI 不是专家经验的掘墓人，而是放大器——它像高压水枪冲刷代码工程淤泥，让拥有业务品味与领域常识的金子闪耀；决定身价的不再是敲击键盘的速度，而是脑海中沉淀的行业直觉与工程审美。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
