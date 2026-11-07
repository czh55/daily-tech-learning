import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'when-ai-writes-code-who-proves-it-works.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#065f46,#047857);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-green{background:#d1fae5;color:#065f46}.tag-teal{background:#ccfbf1;color:#0f766e}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #059669}
.card h3{font-size:22px;font-weight:700;color:#047857;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#d1fae5,#6ee7b7);border:2px solid #34d399;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#065f46}
.node-em{background:linear-gradient(135deg,#ccfbf1,#5eead4);border-color:#14b8a6;color:#0f766e}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#065f46,#047857);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#d1fae5;padding:10px 12px;text-align:left;font-weight:700;color:#065f46;border-bottom:2px solid #6ee7b7}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>当 AI 写代码，谁来证明它正确？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">形式化验证</span>
  <span class="tag tag-teal">Lean</span>
  <span class="tag tag-slate">规格说明</span>
</div>
<p class="subtitle">本文解决的核心问题是：在 AI 能以分钟级生成海量代码的时代，测试与代码审查为何仍无法证明「没有 Bug」，形式化验证与机器可检查证明如何成为新的质量杠杆，以及工程师的价值是否正从「写实现」转向「定义可验证的正确性」。</p>

<div class="map">
  <h3 style="font-size:20px;color:#047857;margin-bottom:12px;text-align:center">从生成到可证：软件栈演进</h3>
  <div class="diagram">
    <div class="node">人类写代码</div><span class="arrow-sym">→</span>
    <div class="node node-em">AI 生成实现</div><span class="arrow-sym">→</span>
    <div class="node">测试 / 审查</div><span class="arrow-sym">⇄</span>
    <div class="node node-em">规格 + 形式化证明</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">Leo de Moura：测试能展示 Bug 存在，不能证明 Bug 不存在</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：CI 全绿、PR 被 AI 修好就等于「正确」。实际上测试只覆盖被执行路径；形式化验证针对的是<strong>对所有合法输入成立的性质</strong>，二者互补而非替代。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】测试 vs 形式化验证</h3>
  <p><strong>在讲什么问题：</strong>代码生成变便宜后，质量证明的瓶颈移到了哪里？</p>
  <p><strong>关键理解：</strong>测试是存在性证据（找到反例）；证明是全称性质（如对任意输入压缩再解压必还原）。压缩库案例：无数用例通过仍不能保证未测路径。</p>
  <p><strong>和其他概念关系：</strong>静态分析、审查、CI 属于工程护栏；形式化验证在关键模块上给数学级保证，但成本高、需规格。</p>
  <p><strong>怎么落地用：</strong>为支付、加密、共识、压缩等模块列出「必须全称成立」的不变式，评估是否值得 Lean/Coq/Verus 等投入；其余仍靠测试与审查。</p>
  <p><strong>边界说明：</strong>验证的是规格与模型假设下的正确性；规格写错、环境模型不全则「证对了也照常上线事故」。</p>
  <p><strong>原文依据：</strong>「Testing is great for showing the presence of bugs, but not their absence.」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Lean 与 AI 辅助的形式化</h3>
  <p><strong>核心思路：</strong>用依赖类型与证明助手表述性质，由机器检查证明；大模型正在降低「把自然语言意图翻译成形式化语句与证明草图」的门槛。</p>
  <p><strong>操作步骤：</strong>① 用自然语言/类型写出核心不变式 → ② 在 Lean 等环境中形式化 → ③ 人类或 AI 补全证明、机器检查 → ④ 实现与证明同步演进（或从规格生成实现再证）。</p>
  <p><strong>选型条件：</strong>安全关键、逻辑密集、回归代价极高的内核；不适合快速迭代的 UI 文案类需求。</p>
  <p><strong>避坑：</strong>把「能编译的 Lean 文件」当成已验证业务——未链接到真实部署路径的证明是装饰品。</p>
  <p><strong>对比相邻方法：</strong>仅模糊测试 / 属性测试（如 Hypothesis）介于两者之间：比单测强、比全形式化弱。</p>
  <p><strong>原文引用：</strong>专访主题即「当 AI 写代码，谁证明它有效」，答案指向形式化验证与自动形式化。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】质量手段维度</h3>
  <table>
    <tr><th>手段</th><th>证明什么</th><th>成本</th><th>一句话结论</th></tr>
    <tr><td>单元 / 集成测试</td><td>样例行为</td><td>低</td><td>默认标配，无法穷举</td></tr>
    <tr><td>静态分析 / Lint</td><td>某类缺陷模式</td><td>低～中</td><td>补盲道，非语义正确</td></tr>
    <tr><td>代码审查</td><td>人类判断</td><td>中</td><td>随 AI 代码量暴涨会瓶颈</td></tr>
    <tr><td>形式化验证</td><td>规格下全称性质</td><td>高</td><td>关键路径「证无 Bug」</td></tr>
    <tr><td>AI + 可检查证明</td><td>同上 + 生成加速</td><td>变化中</td><td>ImageNet 时刻类比：数据与工具就绪点</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】何时上形式化</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>加密、共识、调度内核</td><td>形式化 + 测试</td><td>单 Bug 代价极大</td><td>仅 E2E 测试</td><td>路径不可穷举</td></tr>
    <tr><td>业务 CRUD、活动页</td><td>测试 + 审查</td><td>迭代速度优先</td><td>全套 Lean</td><td>ROI 不成比例</td></tr>
    <tr><td>AI Agent 自主改多文件</td><td>规格 + 关键模块证 + CI</td><td>生成量巨大</td><td>只看 Agent 自报「测过了」</td><td>测试可能未覆盖交互</td></tr>
    <tr><td>库作者（压缩、解析）</td><td>属性 + 形式化核心lemma</td><td>用户依赖全称性质</td><td>只示例测试</td><td>边界输入海量的经典领域</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】Verified Software Stack 与规格优先</h3>
  <p><strong>原则：</strong>未来最有价值的 artifact 可能是<strong>规格说明与可机器检查的证明</strong>，实现可由 AI 反复生成与修补，只要仍满足证明。</p>
  <p><strong>为什么重要：</strong>代码生成边际成本趋零时，「什么是正确」比「谁敲键盘」更稀缺。</p>
  <p><strong>怎么落地：</strong>在架构评审中显式写出 3～5 条全称不变式；对其中 1 条选最小模块做 Lean/Verus 试点。</p>
  <p><strong>适用边界：</strong>IO、分布式、硬件浮点等需环境假设；证明栈要分层（Verified Stack），不能幻想一次证全栈。</p>
  <p><strong>原文支撑：</strong>文末讨论程序员价值从写代码转向定义正确性；写代码的时代变化刚开头。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】AI + 验证</h3>
  <p><strong>坑名：</strong>把测试通过当形式化等价物。<strong>原因：</strong>覆盖率幻觉。<strong>解法：</strong>关键性质单独列表并标注「测试 / 证明」。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>规格从 AI 幻觉来。<strong>原因：</strong>证明只守卫错误规格。<strong>解法：</strong>规格需业务方与工程师共签，证明与规格同库版本化。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑名：</strong>全栈形式化大跃进。<strong>原因：</strong>六年 JSON 级重构都需渐进。<strong>解法：</strong>从 Lemma 库、单包试点扩展。<strong>严重程度：</strong>小心。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：敏捷交付 / 「先上线再修」派</p>
  <p class="rebuttal-text">形式化验证的人月与人才池在多数产品线上会直接拖死交付节奏——AI 把实现变便宜的同时，也把「改一行就重证」的维护税放大到团队扛不住。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>AI 降低代码生成成本，却让「如何证明正确」成为新瓶颈。</li>
    <li>测试擅长发现反例，无法证明全称性质；形式化验证补的是后者。</li>
    <li>Lean 创始人认为 AI 正在让自动形式化与机器可检查证明更可行。</li>
    <li>工程师价值可能转向规格、性质与 Verified Software Stack 分层建设。</li>
    <li>实现可交替由人与 AI 产出，绑定在同一份可检查证明上更可持续。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>为你负责的核心模块写 3 条「必须对所有合法输入成立」的性质。</li>
    <li>收听 / 阅读 The Data Exchange 对 Leo de Moura 的专访全文作背景。</li>
    <li>选一个 &lt;500 行的纯函数模块，试属性测试或 Verus/Lean 微型证明。</li>
    <li>在 AI 编程流水线中要求：关键 PR 附不变式说明，不单贴测试截图。</li>
    <li>跟踪 AWS / Lean 社区在自动形式化上的工具链更新。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>软件工程的重点正从「写出能通过 CI 的代码」转向「拥有可演进、可机器检查的正确性陈述」——代码越来越像可替换的实现层。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
