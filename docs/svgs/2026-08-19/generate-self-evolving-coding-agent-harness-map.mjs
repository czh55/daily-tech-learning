import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'self-evolving-coding-agent-harness-map.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f0f4ff,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#312e81,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #6366f1}
.card h3{font-size:22px;font-weight:700;color:#312e81;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#eef2ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#3730a3;border-left:4px solid #6366f1}
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:2px solid #a5b4fc;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#312e81}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#312e81,#6366f1);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#eef2ff;padding:12px 16px;text-align:left;font-weight:700;color:#312e81;border-bottom:2px solid #a5b4fc}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Harness 不是一次性脚手架：自进化 Coding Agent 系统如何越跑越强</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Coding Agent</span>
  <span class="tag tag-purple">自进化</span>
  <span class="tag tag-green">Harness 工程</span>
  <span class="tag tag-orange">综述解读</span>
  <span class="tag tag-red">SWE-bench</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 ReAct 循环、工具注册表、上下文压缩等 Harness 约定都是人工写死时，Coding Agent 能否把每次编码交互中的可执行反馈（单测、编译诊断、CI 日志）转化为对未来行为的持久改动——南京大学综述《Self-Evolving Coding Agents》用五维分类、三种时机、三类证据给出了一张可对照的工程地图。</p>

<div class="map">
  <h3 style="font-size:20px;color:#312e81;margin-bottom:12px;text-align:center">自进化 Coding Agent 坐标系：改什么 × 何时改 × 靠什么改</h3>
  <div class="diagram">
    <div class="node">五维进化对象<br>框架·记忆·技能<br>模型·工作流</div>
    <span class="arrow-sym">×</span>
    <div class="node-green">三种时机<br>任务内·任务后<br>阶段性</div>
    <span class="arrow-sym">×</span>
    <div class="node-orange">三类证据<br>结果·环境<br>轨迹衍生</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">持久资产<br>跨任务复用<br>而非单次修补</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">普通 Coding Agent 用反馈修当前 Bug；自进化 Agent 攒反馈变成穿越到下一任务的资产</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「给 Agent 加记忆模块 = 自进化」。仅当软件工程经验被反馈进决定未来行为的组件（记忆策略、技能库、工作流拓扑甚至脚手架代码），且改动可跨任务持久，才算自进化 Coding Agent——单纯把对话历史存起来不算。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】自进化 Coding Agent：与普通 Coding Agent 的边界</h3>
  <p><strong>在讲什么问题：</strong>「Coding Agent」「通用自进化 Agent」「自进化 Coding Agent」三个概念常被混用，论文先划清边界再谈技术。</p>
  <p><strong>核心机制：</strong>Coding Agent 在 SWE 环境里行动但部署后模型/提示词/工具/记忆基本固定；通用自进化 Agent 跨场景改提示词/记忆/策略；二者交集的关键差异是反馈来源——仓库、单测、CI、编译诊断等可执行软件制品，比纯文本评价更具体也更易过拟合某仓库。</p>
  <p><strong>关键理解：</strong>普通 Agent 用反馈修补当前 Bug；自进化 Agent 把反馈攒成能穿越到下一任务的资产（记忆、技能、工作流、甚至脚手架本身）。</p>
  <p><strong>典型场景：</strong>同一仓库反复修相似 Issue 时，应从历史轨迹提炼定位策略而非每次从零探索。</p>
  <p><strong>边界说明：</strong>面向 SWE 数据的后训练（如 SWE-RL）若未闭环在 Agent 自身演化尝试上，更准确定位是「模型优化」而非严格自进化。</p>
  <div class="quote">「普通 Coding Agent 只是在『用』反馈修补当前这个 Bug，自进化 Coding Agent 是在『攒』反馈，把它变成能穿越到下一个任务的资产。」</div>
  <div class="relation"><strong>相关概念：</strong>Reflexion / ExpeL 属于通用自进化；SWE-agent / OpenHands 属于固定 Harness 的 Coding Agent。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】五维进化对象：改什么、风险在哪</h3>
  <table>
    <tr><th>维度</th><th>代表工作</th><th>改动对象</th><th>核心风险</th><th>一句话结论</th></tr>
    <tr><td>框架自进化</td><td>SICA、Darwin Gödel Machine</td><td>Agent 实现代码、提示词方案</td><td>有害修改可搞垮整个循环或钻评测空子</td><td>最激进，需验证+回滚+鲁棒性检查</td></tr>
    <tr><td>记忆自进化</td><td>SWE-Exp、Repository Memory</td><td>经验库、仓库时间结构摘要</td><td>噪声日志/脆弱补丁生成「坏记忆」</td><td>关键在「存得对」而非「存得多」</td></tr>
    <tr><td>技能与工具</td><td>CODESKILL、Live-SWE-Agent</td><td>任务级技能、动态创建编辑器/搜索工具</td><td>技能过度仓库特化</td><td>记录「下次该怎么做」而非「发生了什么」</td></tr>
    <tr><td>模型自进化</td><td>Self-play SWE-RL、Agent-RLVR</td><td>策略、奖励模型、验证器</td><td>训练信号未真正闭环则只是后训练</td><td>环境从评测工具变为学习闭环一部分</td></tr>
    <tr><td>工作流拓扑</td><td>EvoMAC、AgentConductor</td><td>角色分工、通信 DAG</td><td>过拟合基准、协调开销膨胀</td><td>从「人工划定何时委派」到「系统自己学会」</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】三种进化时机 × 三类证据：正交坐标轴</h3>
  <p><strong>核心思路：</strong>分类法回答「改什么」，时机与证据两条轴回答「什么时候改、靠什么改」。</p>
  <p><strong>操作步骤：</strong>① 判定当前需求是任务内即时纠偏（测试失败即调策略）还是任务后沉淀（轨迹→记忆/技能）还是阶段性跨代更新（大批轨迹后改模型/变体档案）；② 为每档选择证据类型——结果证据选优、环境反馈定位卡点、轨迹衍生证据抽象经验；③ 三者组成证据供应链，非互相替代。</p>
  <p><strong>选型条件：</strong>任务内→Live-SWE-Agent 在线建工具、SEMAG 动态协作；任务后→SWE-Exp/CODESKILL/GSkill；阶段性→Darwin Gödel Machine、Self-play SWE-RL。</p>
  <div class="highlight"><strong>落地：</strong>Hand-rolled Harness 的 Context Compaction 解决「装不下」（任务内压缩）；Repository Memory / SWE-Exp 解决「不用重新学」（任务后持久记忆）——二者互补而非替代。</div>
  <div class="pitfall"><strong>避坑：</strong>结果证据擅长选优但粗粒度；单靠 pass rate 看不出提升来自记忆还是工作流还是模型——评测需暴露进化过程本身。</div>
  <div class="quote">「结果证据擅长『选优』，环境反馈擅长『即时纠偏』，轨迹衍生证据擅长『沉淀经验』。」</div>
</div>

<div class="card">
  <h3>【决策/选型表】Harness 工程决策：从「感觉需要」到「按图索骥」</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>上下文窗口不够</td><td>任务内 Compaction + 任务后 Repository Memory</td><td>压缩丢信息 vs 提炼跨会话资产互补</td><td>只靠无限拉长 Context</td><td>装不下时仍会丢关键轨迹</td></tr>
    <tr><td>重复性命令/测试失败</td><td>CODESKILL 事件驱动技能库</td><td>从失败轨迹自动挖掘应对策略</td><td>人工穷举 Error Recovery 模板</td><td>静态规则库无法覆盖新模式</td></tr>
    <tr><td>复杂 Issue 需多角色协作</td><td>AgentConductor / SEMAG 动态拓扑</td><td>简单任务少协作、难任务才拉起密集 DAG</td><td>固定 Subagent 委派规则</td><td>无法按任务难度伸缩协作开销</td></tr>
    <tr><td>评测会自我修改的 Agent</td><td>追踪变体档案 + 报告 Token/检索开销</td><td>防基准过拟合与「钻空子」</td><td>只看单次 pass rate</td><td>筛选机制本身可能被过拟合</td></tr>
    <tr><td>允许 Agent 改自己代码</td><td>验证+回滚+拦截「高危自我修改」</td><td>误导性反馈影响未来所有行为</td><td>仅拦截 bash 高危命令</td><td>Middleware 需覆盖脚手架级修改</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】综述泼的四大冷水</h3>
  <p><strong>坑 1：可复现性与基准过拟合</strong>——Agent 随运行/仓库/模型版本变化，用基准选自我修改对泄露和噪声极敏感。<strong>解法：</strong>维护可比较变体档案、跨仓库泛化测试。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 2：反馈可靠性与工具依赖</strong>——测试、CI、学习出的奖励模型都不完美；改工具/工作流时一次误导反馈污染未来所有行为。<strong>解法：</strong>审计进化过程、约束可修改范围。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 3：记忆腐化与多智能体协调</strong>——经验库陈旧、失败轨迹污染、协作拓扑成本膨胀。<strong>解法：</strong>记忆检索前做质量过滤、定期淘汰。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑 4：评测短视</strong>——pass rate 不反映可维护性/安全性/长期可靠性。<strong>解法：</strong>单独报告效率开销与跨场景迁移。<strong>严重程度：</strong>小心。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】手工 Harness 是边界，自进化是下一步</h3>
  <p><strong>原则：</strong>ReAct、工具注册表、Context Compaction、错误自愈等手工实践先趟出 framework/memory/skill 的进化对象边界；自进化研究要在边界清晰后，把「何时改、靠什么改、怎么验证」系统化。</p>
  <p><strong>为什么重要：</strong>专栏讨论「怎么把 Harness 做对」，综述讨论「做对之后怎么自己变得更对」——二者是递进关系而非替代。</p>
  <p><strong>怎么落地：</strong>① 对照五维分类评估现有模块属于哪类进化对象；② 为每类选定时机档位与证据类型；③ 评测脚本除测版本好坏，还要测筛选自我修改是否过拟合。</p>
  <p><strong>适用边界：</strong>方向仍年轻，进化过程本身需可验证、可审计、可约束——「学会进化」不等于「可信进化」。</p>
  <div class="quote">「这不代表专栏里的工程实践过时了——恰恰相反，进化对象的边界正是靠手工 Harness 先趟出来的。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：务实 Harness 工程师 / 「先把静态版跑稳」派</p>
  <p class="rebuttal-text">框架自进化与动态工作流搜索的验证、回滚和 Token 开销远超多数团队承受力——在静态 Harness 尚未稳定通过 SWE-bench 之前，追逐自进化更像用复杂性掩盖基础工程债。</p>
</div>

<div class="conclusion">
  <h2>结论与行动</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>自进化 Coding Agent 的核心是把可执行 SWE 反馈转化为跨任务持久改动，而非单次 Bug 修补。</li>
    <li>五维分类（框架/记忆/技能/模型/工作流）+ 三种时机 + 三类证据构成完整坐标系。</li>
    <li>手工 Context Compaction 与记忆自进化互补：前者解「装不下」，后者解「不用重新学」。</li>
    <li>评测自进化系统需暴露进化过程、报告开销、测跨仓库泛化——光看 pass rate 不够。</li>
    <li>四大挑战（可复现、反馈可靠性、记忆腐化、评测短视）决定方向能否走向可信。</li>
  </ol>
  <p style="margin-top:16px"><strong>行动清单：</strong></p>
  <ol>
    <li>阅读综述原文（arXiv:2608.03392）与 Awesome 仓库，按五维对照现有 Harness 模块。</li>
    <li>若已有错误恢复模板，评估能否升级为 CODESKILL 式事件驱动技能自动挖掘。</li>
    <li>在 Benchmark 脚本中增加变体追踪与 Token/检索开销字段，防自我修改过拟合。</li>
    <li>为 Middleware 增加「高危自我修改」拦截规则，覆盖脚手架/工具级变更。</li>
    <li>任务结束后试点 Repository Memory：把成功/失败轨迹提炼为可检索经验而非仅压缩丢弃。</li>
  </ol>
  <p style="margin-top:16px"><strong>关键认知转变：</strong>Harness 不是发版之间无记忆的一次性脚手架——记忆策略、错误恢复、协作拓扑都可以从「工程师手动迭代」升级为「执行反馈自动驱动」的进化对象，但前提是进化过程本身可验证、可约束。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
