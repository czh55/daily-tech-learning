import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'enterprise-ai-coding-harness-8-skills.svg');

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
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:12px 14px;text-align:center;min-width:80px;font-weight:700;font-size:12px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:16px;color:#94a3b8}
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
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px}`;

const body = `
<h1>企业级 AI Coding 的 Harness 工程实战：8 个 Skill 串起全链路</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Harness 工程</span>
  <span class="tag tag-green">8 Skill 全链路</span>
  <span class="tag tag-orange">OpenSpec · SDD</span>
  <span class="tag tag-purple">团队 AI 协作</span>
  <span class="tag tag-red">spec 单目录</span>
</div>
<p class="subtitle">本文解决的核心问题是：当开发侧已把 AI 嵌入工作流、产品测试仍停留在口头沟通与手工点点点时，如何用 8 个 Skill 把需求→设计→开发→测试→验收→Bug 修复的产出标准化、收拢到同一 spec 目录，让环节之间自动流转而非各自为战。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">八 Skill 固定依赖链</h3>
  <div class="diagram">
    <div class="node">product</div><span class="arrow-sym">→</span>
    <div class="node">api</div><span class="arrow-sym">+</span>
    <div class="node">ui</div><span class="arrow-sym">→</span>
    <div class="node-green">page</div><span class="arrow-sym">→</span>
    <div class="node-green">test</div><span class="arrow-sym">→</span>
    <div class="node-orange">qa</div><span class="arrow-sym">→</span>
    <div class="node-orange">review</div><span class="arrow-sym">⇄</span>
    <div class="node-purple">bugfix</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">下游消费上游产出；qa/bugfix 是真实业务摩擦后补上的关键 Skill</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「个人 Cursor 提效够用了」。问题不在某个环节卡住，而是环节交接面站在不同角度表达——产品 PRD、AI 代码、测试 Excel 格式术语全不一致，扯皮成本比编码更高。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】五个团队级 AI Coding 痛点</h3>
  <p><strong>在讲什么问题：</strong>个人提效≠团队提效；框架六步走完了，落地仍卡在交接面。</p>
  <p><strong>核心机制：</strong>① 非开发岗位跟不上 ② 环节衔接断裂 ③ 需求反复返工（AI 第三版开始「改不动」）④ AI 识别不了变更范围 ⑤ 经验跟人走不跟项目走。</p>
  <p><strong>关键理解：</strong>解法不是更多文档，是把每个环节产出固定下来并自动流转——需求评审产出、接口对接产出、测试用例产出全部标准化。</p>
  <p><strong>典型场景：</strong>测试拿 Excel 说「12 功能点覆盖率不到一半，还有 2 个忘了写」——开发解释十分钟测试放弃的那一刻，作者开始写 Skill。</p>
  <p><strong>边界说明：</strong>Skill 是基础，多 Agent 并行是加速器——顺序不能反，先跑稳 3-5 个需求再拆并行。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】spec 单目录收拢（OpenSpec 思路）</h3>
  <p><strong>方法名：</strong>spec/changes/&lt;feature&gt;/ 单目录 · 标签：规范驱动、可追踪、Review 友好</p>
  <p><strong>核心思路：</strong>每个需求的全部 Skill 输出收进同一目录，.spec.yaml 追踪各 skill 状态 pending→completed。</p>
  <p><strong>操作步骤：</strong>1) 复制 .spec.template.yaml → 2) 各 Skill 末尾写入 product.md/api.md/... → 3) 更新 .spec.yaml 状态 → 4) 完成后归档到 archive/日期-feature/</p>
  <div class="highlight"><strong>落地建议：</strong>进度不用问人，打开 .spec.yaml 就知道卡在哪；Review 时所有上下文在一个目录，不用追着问「接口文档发哪了」。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】每个 Skill 的三条共同设计</h3>
  <p><strong>设计一：先读 CLAUDE.md，不可跳过。</strong> AI 不知道的事不会主动问；不喂约束就按训练数据「通用实践」来——最早 ui Skill 没加这条，生成全用 antd 原生而非项目封装组件。</p>
  <p><strong>设计二：有明确决策点，停下来等人。</strong> 全自动在企业场景是灾难。product 发现功能已做过→停；api 字段不清→标 [待确认] 不猜；bugfix 信息不全→暂停补充。</p>
  <p><strong>设计三：末尾挂「常见坑速查表」。</strong> 现象→原因→处理三列；review 发现新坑就补，下一个人加载 Skill 时自动变约束。bugfix 表例：修完引入新 Bug→回三步检查法逐条过边界。</p>
</div>

<div class="card">
  <h3>【决策/选型表】SDD 工具选型：为何 OpenSpec</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>存量项目增量改造</td><td>OpenSpec</td><td>propose→apply→archive 轻量；npm 30 秒安装</td><td>Spec-Kit 七阶段门控</td><td>像瀑布，对存量太重</td></tr>
    <tr><td>小团队敏捷</td><td>OpenSpec + 自研 Skill</td><td>不绑 GitHub 生态；Claude/Cursor 兼容好</td><td>Superpowers 作主流程</td><td>偏工具配置层，非协作主引擎</td></tr>
    <tr><td>新项目大团队合规</td><td>Spec-Kit</td><td>七阶段门控严谨</td><td>OpenSpec 单独硬扛</td><td>流程约束可能不够</td></tr>
    <tr><td>多项目 Skill 分发</td><td>sync.sh 统一推送</td><td>手动拷贝两个月必分叉</td><td>每项目手改 Skill</td><td>A 项目修了防重复，B 还在踩旧坑</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】四个底座机制</h3>
  <table>
    <tr><th>机制</th><th>做什么</th><th>真实翻车现场</th><th>一句话</th></tr>
    <tr><td>SDD 闭环</td><td>CLAUDE.md→生成→Review→补规范</td><td>AI 没用 CustomSkeleton→规范没写是规范缺失不是 AI 错</td><td>每次跑偏是发现规范漏洞的机会</td></tr>
    <tr><td>不清晰就停</td><td>不许猜、不许脑补</td><td>接口字段推断错→联调全炸</td><td>决策点兜住 AI 不会补位处</td></tr>
    <tr><td>文档驱动防幻觉</td><td>先读 Context7 官方文档</td><td>代码从训练数据瞎编</td><td>从真实文档锚定而非记忆</td></tr>
    <tr><td>spec 单目录</td><td>产出不散落</td><td>三个月后找不到需求对应文档</td><td>上下文不丢失是可追踪前提</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】三条血泪铁律</h3>
  <p><strong>坑1 · Characterization Test：</strong>改造老模块前先记录现有代码实际输出转断言；跳过则测试全绿但上线炸——最阴险，因为你测错东西了。</p>
  <p><strong>坑2 · 预期值必须字面量：</strong><code>expect(price).toBe("1.00")</code>，不能在被测逻辑里重算 expected——算法有 bug 时 expected 跟着错，测试永远绿。</p>
  <p><strong>坑3 · 每批只做 1-3 个：</strong>一次生成 20 个组件/测试，一半跑不通整批不可信；慢就是快。</p>
  <p><strong>禁区（不做什么）：</strong>无 PRD 凭空拆任务；引入栈外依赖；顺手重构范围外代码；用 AI「没问题」代替人手验证；为一次性操作建 Skill。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Vibe Coding 拥护者 · 「流程会扼杀 AI 速度」</p>
  <p class="rebuttal-text">八个 Skill 加决策点停下来的功夫，够 vibe 两轮全栈上线——企业里返工三次的需求变更和测试扯皮，才是真的速度杀手。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>团队 AI Coding 瓶颈在环节交接面，不在单点编码速度——标准化产出+spec 单目录是核心解法。</li>
    <li>8 Skill 是真实业务摩擦长出来的：qa 补测试断层，bugfix 补「根因说不清不许动手」。</li>
    <li>三条共同设计（读 CLAUDE.md、决策点、坑表）比具体步骤更重要，是稳定运行的底层逻辑。</li>
    <li>OpenSpec 适合存量增量改造；Skill 跑稳后再考虑多 Agent 并行。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>先只做一个 Skill——痛点最重的：需求不清做 product，UI 差做 ui，Bug 反复做 bugfix。</li>
    <li>Markdown 放 .claude/skills/：触发条件 + 步骤（标决策点）+ 常见坑。</li>
    <li>建 spec/changes/ 单目录，哪怕只收两三个文件，用 yaml 标进度。</li>
    <li>第一版别追求完美，review 会告诉你漏了什么；CLAUDE.md 是约束来源，Skill 管流程。</li>
    <li>多项目用 sync.sh 统一推送，避免手动拷贝分叉。</li>
  </ol>
  <p><strong>关键认知转变：</strong>Harness 不是让 AI 跑得慢，是让 AI 跑得对——笼子里的 AI 不是更弱，是更可靠。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
