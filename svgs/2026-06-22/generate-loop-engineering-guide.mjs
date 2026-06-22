import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'loop-engineering-guide.svg');

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
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:140px;font-weight:700;font-size:16px;color:#1e40af}
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
<h1>循环工程 Loop Engineering 指南：一个 Skill 解决终止条件设计难题</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">循环工程</span>
  <span class="tag tag-green">Agent 自动化</span>
  <span class="tag tag-orange">终止条件</span>
  <span class="tag tag-purple">需求工程</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 AI 编程从单次 Prompt 演进到多轮自动迭代时，如何为循环设计可验证的终止条件，让 Agent 知道「什么时候该停」，从而避免在代码与内容类任务中无限空转，并把循环工程的本质还原为需求工程的精确度问题。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">Prompt</div>
    <span class="arrow-sym">→</span>
    <div class="node">Context</div>
    <span class="arrow-sym">→</span>
    <div class="node">Harness</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Loop</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">需求工程</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「循环失败是因为 Prompt 写得不够好」—— 作者拆解 136 个开源循环后发现，措辞清晰的模板照样失败，根因是终止条件缺失或模糊；「优化到满意」不是终止条件，谁满意、怎么算满意必须事先定义。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】循环工程与终止条件</h3>
  <p><strong>在讲什么问题：</strong>2026 年 AI 编程第四阶段「循环工程」的核心难题是什么，以及它和前三阶段（Prompt、Context、Harness）的本质区别。</p>
  <p><strong>核心机制：</strong>循环工程让 AI 自己跑、自己验、自己停；前三个阶段优化「怎么做得更好」，循环工程优化「怎么知道做完了」。麻省理工研究显示 AI 代码量增长约 180% 但真正上线交付只增长约 30%，鸿沟就是「没人定义什么叫做完了」。</p>
  <p><strong>关键理解：</strong>「怎么让 Agent 自己停」翻译过来就是「你到底想让它做到什么程度」——这是需求工程问题，不是提示词技巧问题。</p>
  <p><strong>典型场景：</strong>Claude Code /goal 自动验代码、/loop 迭代改文章、修测试直到全绿的多轮 Agent 工作流。</p>
  <p><strong>边界说明：</strong>一次性决策或无迭代空间的任务不适合循环，应直接给出替代方案而非强行套循环。</p>
  <div class="quote">「没有终止条件的循环，不是自动化，是让 AI 在黑暗中无限打转。」</div>
  <div class="relation"><strong>相关概念：</strong>Harness 提供工具与环境，Loop 提供反复执行与停止判断；终止条件缺失时 Harness 越完善只会越快产出错误。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】循环设计器四步 Skill</h3>
  <p><strong>标签：</strong>Claude Code Skill · 终止条件设计</p>
  <p><strong>核心思路：</strong>用四步流程把「想清楚要什么」结构化，输出含完整终止条件、可直接复制运行的循环方案。</p>
  <p><strong>操作步骤：</strong>① 理解任务：读文件与项目结构，判断是否适合循环；② 自动调研：搜索最佳实践、检查现有验证命令、按严重程度排列问题；③ 研讨确认：给用户选择题（做到什么程度、什么不能改、最多几轮、自动停还是每轮改一点）；④ 生成方案：两套并行（自动停 + 每轮改一点），标注推荐，每套不少于 800 字且首行可执行命令。</p>
  <p><strong>选型条件：</strong>任务有迭代空间但你不确定终止标准时，用 Skill 代替自己硬写「优化到满意」。</p>
  <div class="pitfall"><strong>避坑：</strong>版本一的「六问模式」把「怎么判断做完」抛给用户——用户要是知道就不需要工具了，设计负担不能转嫁给用户。</div>
  <div class="quote">「整个过程不需要写代码，不需要懂专业术语。」</div>
</div>

<div class="card">
  <h3>【决策/选型表】两种终止条件设计路径</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>修类型错误、跑测试、构建</td><td>/goal + 独立评估模型</td><td>有客观验证命令，退出码为零即完成</td><td>同一模型自评自改</td><td>跟让学生自己改卷子差不多</td></tr>
    <tr><td>改文章语气、优化标题、调排版</td><td>/loop + 动态评分维度</td><td>无客观命令，需 3-5 维度权重打分达标才停</td><td>「迭代到满意为止」</td><td>满意无定义，必然无限循环或过早停止</td></tr>
    <tr><td>首次尝试循环</td><td>小任务试水（如优化周报措辞）</td><td>三重安全网：最大 3-5 轮、锁定不可改文件、每轮只改 2-3 处</td><td>直接上生产级重构</td><td>没体验过终止机制就跑大任务风险极高</td></tr>
    <tr><td>套用通用评分模板</td><td>任务定制维度</td><td>「可读性」对技术文档和公众号含义完全不同</td><td>可读性/完整性/逻辑性通吃模板</td><td>终止条件需精确对，差一点就是跑偏和收工的区别</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】/goal 与 /loop 机制对比</h3>
  <table>
    <tr><th>对比维度</th><th>/goal（裁判模式）</th><th>/loop（渐进模式）</th><th>一句话结论</th></tr>
    <tr><td>适用任务</td><td>有验证命令的代码类</td><td>主观判断的内容类</td><td>先判断任务有没有一条命令能检查结果</td></tr>
    <tr><td>评估主体</td><td>独立评估模型（非执行模型）</td><td>用户每轮决定继续或停止</td><td>执行者与裁判必须分离才有客观性</td></tr>
    <tr><td>停止信号</td><td>目标条件达标自动停</td><td>维度打分过线或用户叫停</td><td>代码像考试对答案，内容像面试打评分表</td></tr>
    <tr><td>每轮改动量</td><td>按验证结果定向修</td><td>只改 2-3 处，不全文推翻</td><td>小步迭代防止震荡与上下文爆炸</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】循环工程三大真实踩坑</h3>
  <p><strong>坑名：</strong>「优化代码直到没有问题」式模糊终止条件。</p>
  <p><strong>原因：</strong>什么叫有问题没有客观定义，Agent 无法判断何时收工。</p>
  <p><strong>原文说法：</strong>「要么没写，要么写了等于没写。」</p>
  <p><strong>解法：</strong>绑定具体命令（tsc --noEmit 零错误、pytest 全绿）或拆出 3-5 个加权维度并设 80 分通过线。</p>
  <p><strong>严重程度：</strong>致命——直接导致 Token 空转与错误交付。</p>
  <div class="pitfall"><strong>坑二：</strong>声称 500 个 AI 同时干活却省略终止条件与门控细节——Reddit 直言「要么撒谎要么省略关键细节」，严重程度：致命。</div>
  <div class="pitfall"><strong>坑三：</strong>版本二「裁判模式」强行用于主观任务——找不到独立裁判能说了算的内容优化，应诚实承认无客观标准而走动态评分，严重程度：小心。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】循环工程本质是需求工程</h3>
  <p><strong>原则：</strong>提示词 5 分钟写完，「优化到什么程度」想一整晚——你对任务的理解深度决定循环上限。</p>
  <p><strong>为什么重要：</strong>同一篇文章在宽松标准（去 AI 味）两轮停改 6 处 vs 精确标准（标题悬念、节奏变化点、互动引导）改 16 处，工具相同结果天差地别。</p>
  <p><strong>原文支撑：</strong>麻省理工 180% 代码量 vs 30% 交付率的鸿沟，根源是没有把「你到底想要什么效果」当成正式工程问题。</p>
  <p><strong>怎么落地：</strong>循环前用 15 分钟写清：做到什么程度、什么不能动、最多几轮、用命令验还是用维度打分。</p>
  <p><strong>适用边界：</strong>需求本身极度模糊且用户拒绝参与研讨时，循环只会放大混乱，应先做单次对话澄清需求。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：全自动 Agent 乐观派 / 「循环越多越好」的 Vibe Coding 信徒</p>
  <p class="rebuttal-text">把循环失败全归咎于终止条件太模糊，低估了模型本身在长链路中的漂移与幻觉——就算你把评分维度写到像素级，多轮自我修改仍会累积偏离，很多时候与其设计完美循环不如人类每轮审一眼，自动化收益被验证成本和纠错成本吃掉。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>循环工程是 Prompt→Context→Harness 之后的第四阶段，核心难题是终止条件而非提示词措辞。</li>
    <li>136 个开源循环中 85% 仅适用代码类任务，内容类循环因缺客观验证而几乎空白。</li>
    <li>有验证命令走 /goal 独立裁判，无验证命令走 /loop 动态评分，不可强行一套机制覆盖所有场景。</li>
    <li>循环设计器四步 Skill 把需求澄清产品化，用选择题代替开放题降低用户负担。</li>
    <li>循环工程的本质是需求工程：没有可靠验证的循环只是更快地发布错误。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>复制文末循环设计器提示词到 Claude Code，用「优化一篇周报措辞」做第一次 3-5 轮小循环试水。</li>
    <li>审查现有 Agent 工作流，把所有「直到满意」「直到没问题」替换为具体命令或加权维度。</li>
    <li>代码类任务配置 /goal 并确认评估模型与执行模型分离。</li>
    <li>内容类任务先写 3-5 个评判维度（权重合计 100、通过线 80），每轮限制只改 2-3 处。</li>
    <li>给所有循环加上最大轮数上限和不可修改文件清单作为安全网。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「我怎么跟 AI 说话」升级到「我怎么定义做完」——循环时代竞争的不是 Prompt 技巧，而是把模糊需求变成可验证标准的工程能力。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
