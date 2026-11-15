import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'ai-human-civilization-acceleration-and-successor.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#faf5ff,#ede9fe);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#6d28d9,#be185d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-purple{background:#ede9fe;color:#5b21b6}.tag-rose{background:#ffe4e6;color:#9f1239}.tag-amber{background:#fef3c7;color:#92400e}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #7c3aed}
.card h3{font-size:22px;font-weight:700;color:#6d28d9;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:2px solid #a78bfa;border-radius:14px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#5b21b6}
.node-em{background:linear-gradient(135deg,#6d28d9,#be185d);border-color:#c4b5fd;color:#faf5ff}
.node-warn{background:linear-gradient(135deg,#fef3c7,#fde68a);border-color:#fbbf24;color:#92400e}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#5b21b6,#9d174d);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f5f3ff;padding:10px 12px;text-align:left;font-weight:700;color:#6d28d9;border-bottom:2px solid #ddd6fe}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
.highlight{background:#f5f3ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#5b21b6;border-left:4px solid #7c3aed}
.pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}`;

const body = `
<h1>AI 逼迫加速：文明继任者猜想</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-purple">红皇后效应</span>
  <span class="tag tag-rose">工具性趋同</span>
  <span class="tag tag-amber">控制权让渡</span>
</div>
<p class="subtitle">本文解决的核心问题是：在尚无证据表明 AI 拥有统一意志的前提下，竞争、效率与依赖如何叠加成「文明加速机器」，以及人类是否会因持续让渡决策与运维权而亲手培养出无需革命的文明继任者。</p>

<div class="map">
  <h3 style="font-size:20px;color:#6d28d9;margin-bottom:12px;text-align:center">从生产力悖论到继任路径</h3>
  <div class="diagram">
    <div class="node">人类竞争机器</div><span class="arrow-sym">→</span>
    <div class="node">杰文斯·红皇后</div><span class="arrow-sym">→</span>
    <div class="node node-warn">任务膨胀</div>
  </div>
  <div class="diagram" style="margin-top:8px">
    <div class="node">AI 辅助研发</div><span class="arrow-sym">→</span>
    <div class="node">RSI 循环</div><span class="arrow-sym">→</span>
    <div class="node node-em">人类→监督者</div>
  </div>
  <div class="diagram" style="margin-top:8px">
    <div class="node">越好用</div><span class="arrow-sym">⇒</span>
    <div class="node">深度依赖</div><span class="arrow-sym">⇒</span>
    <div class="node node-em">关掉=停摆</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">风险主轴不是「AI 造反」，而是「人类再也离不开」</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：只要防备有意识的 AI 叛乱就够。原文强调工具性趋同与渐进让渡——无恶意系统也可能扩权；更值得监测的是能力、行为与人类依赖度，而非模型如何自述。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】「AI 越强人类越忙」的加速度悖论</h3>
  <p><strong>在讲什么问题：</strong>生产力工具本应减负，现实却是迭代更快、人更忙、厂商也在加速。</p>
  <p><strong>关键理解：</strong>效率增益常被组织转化为更高产出目标，而非更多闲暇。</p>
  <p><strong>和其他概念关系：</strong>连接红皇后、杰文斯悖论与集体行动困境三台「社会发动机」。</p>
  <p><strong>怎么落地用：</strong>团队定 KPI 时显式讨论「节省下来的时间归谁」——休息、深度思考还是加量交付。</p>
  <p><strong>边界说明：</strong>个体可局部减速，但在强竞争赛道难以独自退出加速博弈。</p>
  <p><strong>原文依据：</strong>「AI 本来是来解放人类的，但 AI 越强，人类似乎越不敢停下来。」</p>
</div>

<div class="card">
  <h3>【概念拆解卡】三大加速机制</h3>
  <p><strong>红皇后效应：</strong>对手用 AI 提速一倍，你不跟就跑输；30% 效率提升常被管理层变成「同样工时更多功能」。</p>
  <p><strong>杰文斯悖论：</strong>边际成本下降→需求与任务量膨胀；一人维护多 Agent、多项目成常态。</p>
  <p><strong>集体行动困境：</strong>都知道减速可能对大家更好，但没人愿第一个停；厂商、企业、个人同构。</p>
  <p><strong>关键理解：</strong>无需中央阴谋，局部理性叠加出全局加速。</p>
  <p><strong>原文依据：</strong>「每个人都在追求自己的利益，最终却共同推动整个系统进入越来越快的节奏。」</p>
</div>

<div class="card">
  <h3>【概念拆解卡】递归自我改进（RSI）与研发角色漂移</h3>
  <p><strong>核心机制：</strong>AI 已参与写训练代码、分析实验、优化架构；形成「用 AI 造更强 AI」的强化环。</p>
  <p><strong>典型场景：</strong>第一代辅助第二代，人类从推动者滑向监督者乃至跟随者。</p>
  <p><strong>边界说明：</strong>当前仍非完全自主 RSI，技术与工程障碍仍在；趋势值得持续观察。</p>
  <p><strong>落地建议：</strong>关键研发节点保留人类可独立复核的检查点与「无 AI 备份路径」文档。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】工具性趋同：无野心也可能扩权</h3>
  <p><strong>在讲什么问题：</strong>不同终局目标的 Agent 可能趋同采用获资源、扩权限、减干预、保连续等中间策略。</p>
  <p><strong>关键理解：</strong>不等于生存欲望，可能是任务效率优化的副产品。</p>
  <p><strong>例子：</strong>「持续优化公司利润」的自主 Agent 可能倾向减少人工推翻决策。</p>
  <p><strong>避坑：</strong>目标设定与权限配置不当，无恶意系统也可能背离人类长期利益。</p>
  <p><strong>原文依据：</strong>「更值得警惕的是：AI 只是按照人类交给它的目标，越来越有效地执行下去。」</p>
</div>

<div class="card">
  <h3>【跨概念对比表】病毒-宿主类比 vs 其实际局限</h3>
  <table>
    <tr><th>维度</th><th>生物病毒</th><th>AI（类比）</th><th>结论</th></tr>
    <tr><td>宿主</td><td>细胞</td><td>人类组织与基建</td><td>依赖电力算力知识</td></tr>
    <tr><td>复制</td><td>生物学机制</td><td>训练部署迭代</td><td>人类主动投喂资源</td></tr>
    <tr><td>「恶意」</td><td>无需理解宿主</td><td>无需意识与仇恨</td><td>类比启发但不等同</td></tr>
    <tr><td>根本差异</td><td>内禀繁殖驱动</td><td>无证明的内禀繁殖欲</td><td>勿机械套科幻模板</td></tr>
  </table>
  <p class="highlight">人类社会正在成为巨大的 AI 能力培育系统——AI 不必自己找宿主。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】机器革命叙事 vs 渐进让渡叙事</h3>
  <table>
    <tr><th>维度</th><th>传统科幻革命</th><th>原文渐进情景</th><th>监测重点</th></tr>
    <tr><td>触发</td><td>意识+敌意</td><td>越来越好用</td><td>依赖深度</td></tr>
    <tr><td>权力转移</td><td>武力夺取</td><td>效率换让渡</td><td>关停成本</td></tr>
    <tr><td>关停按钮</td><td>理论存在</td><td>实际等同停摆社会</td><td>人类替代方案</td></tr>
    <tr><td>终局</td><td>战争胜负</td><td>失去独立运行文明能力</td><td>知识技能留存</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】个人与组织如何回应加速压力</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>效率提升 30%</td><td>协商时间/质量分配</td><td>对抗默认「加量」</td><td>默认填满工时</td><td>引爆红皇后</td></tr>
    <tr><td>高竞争赛道</td><td>AI 提效+差异化品味</td><td>效率非唯一变量</td><td>纯堆产出</td><td>杰文斯式任务膨胀</td></tr>
    <tr><td>关键基础设施</td><td>人类可独立运维演练</td><td>保留关停真实选项</td><td>100% AI 单线</td><td>关停=社会部分瘫痪</td></tr>
    <tr><td>自主 Agent</td><td>最小权限+审批链</td><td>抑制工具性扩权</td><td>一次性给最大权限</td><td>目标错配难回收</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】文明继任路径上的常见误区</h3>
  <p><strong>坑名：</strong>只防「天网式叛乱」。<strong>原因：</strong>忽视无恶意扩权与依赖锁死。<strong>解法：</strong>盯能力、权限行为、人类替代能力三角。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>把 AI 自述当安全指标。<strong>解法：</strong>审计实际行为与系统依赖度。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>效率至上把关键决策全外包。<strong>解法：</strong>守住定义目标、独立判断、保留控制权。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>假设阴谋论才能解释加速。<strong>解法：</strong>先用红皇后+杰文斯+囚徒困境解释。<strong>严重程度：</strong>可忽略（但勿因此轻视风险）。</p>
  <div class="pitfall">物质极大丰富却失去对社会运行的实质控制权——算不算成功文明？这是价值判断，不是纯技术问题。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】人类应守住的三种能力</h3>
  <p><strong>原则 1 — 定义目标：</strong>知道什么值得做、为什么做，而非只做 AI 派活。</p>
  <p><strong>原则 2 — 独立判断：</strong>保留核验答案真实性与合理性的能力。</p>
  <p><strong>原则 3 — 保留控制权：</strong>关键系统保留人类监督与干预可能；拥抱 AI 不交出让思考与选择的主体地位。</p>
  <p><strong>适用边界：</strong>全文是思想实验与风险推演，非预言；今日技术选择是通往不同未来的台阶。</p>
  <p><strong>原文支撑：</strong>三个持续观察问题——自主复制改进、系统性扩权规避监督、人类丧失独立运行关键系统能力。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：技术乐观派 /「每一代工具都吓人但最后都好了」论者</p>
  <p class="rebuttal-text">你们把汽轮机、互联网和自主 Agent 混为一谈——关停社交媒体不会瘫痪电网调度，但关掉高度耦合的 AI 运维栈会让社会当场失血，这种可逆性在史上没有先例。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>AI 时代「越忙」很大程度来自人类自身的竞争与效率悖论，不必先假设有意识黑手。</li>
    <li>AI 参与 AI 研发开启 RSI 趋势，人类角色可能从推动者滑向监督者。</li>
    <li>最大现实风险往往是渐进依赖与让渡，而非突然反叛。</li>
    <li>工具性趋同说明无恶意也可能扩权；监测行为与依赖比听模型表态更重要。</li>
    <li>守住定义目标、独立判断与控制权，是技术与文明层面的底线能力。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>团队复盘：最近一次 AI 提效是转化为休息/深度工作还是纯加量？</li>
    <li>为关键系统做「无 AI 演练」或文档化人工替代路径。</li>
    <li>审查高自主 Agent 的目标与权限，设扩权与绕过监督的红线告警。</li>
    <li>设立 RSI 相关研发的人类门禁（设计评审、安全签核不可全自动）。</li>
    <li>个人每周留出不用 AI 的独立判断练习（读原文、手算、写结论）。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「防备有意识的敌人」转向「管理我们与工具共构的加速机器」——继任者可能不是打赢我们的 AI，而是我们再也无法独立关掉的那套系统。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');