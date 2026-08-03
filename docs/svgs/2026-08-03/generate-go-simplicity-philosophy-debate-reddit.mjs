import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-simplicity-philosophy-debate-reddit.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.arrow-sym{font-size:18px;color:#94a3b8}
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
<h1>Go 正在背离初心？一条 Reddit 热帖，暴露了 Go 社区最深的分歧：简单，到底能坚持多久？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 语言哲学</span>
  <span class="tag tag-green">泛型 · 迭代器</span>
  <span class="tag tag-orange">Reddit 社区争论</span>
  <span class="tag tag-purple">特性膨胀</span>
  <span class="tag tag-red">AI 时代可读性</span>
</div>
<p class="subtitle">本文解决的核心问题是：泛型和迭代器相继落地之后，Go 究竟是在兑现「够用就好」的承诺合理补课，还是正在背离「只有一种明显写法」的极简哲学、滑向复杂化老路。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Go 简单性争论的核心概念关系</h3>
  <div class="diagram">
    <div class="node">极简承诺<br>可读 · 单一解法</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">新特性落地<br>泛型 1.18 · 迭代器 1.23</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">社区分裂<br>补课 vs Python 化</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">工程现实<br>认知负载 · 向后兼容 · AI 审查</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">两派共享「简单是资产」的价值观，分歧在于新特性是在守护还是透支这份资产</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：Go 从来就「只有一种写法」。实际上集合可用 map[T]struct{} 或 map[T]bool，并发可用 atomic 或 mutex——真正的哲学是克制，而非绝对唯一。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Go「简单」到底指什么</h3>
  <p><strong>在讲什么问题：</strong>r/golang 热帖追问 Go 是否偏离初心——每个新特性是否都在把语言从「极简」往外推。</p>
  <p><strong>核心机制：</strong>Go 卖的不是功能强大，而是「够用就好、别添乱」；承诺任何人能在短时间内读懂任意 Go 代码，因为有效写法数量被刻意压低。</p>
  <p><strong>关键理解：</strong>楼主担忧的不是特性设计差，而是趋势——能力更强但也更复杂，两头都没讨到好。</p>
  <p><strong>典型场景：</strong>老 Gopher 跳进陌生代码库审查 PR、应届生 onboarding 大型 monorepo。</p>
  <p><strong>边界说明：</strong>「简单」不等于「功能残缺」；支持派引用 Einstein 式表述——as simple as it needs to be, but not simpler。</p>
  <div class="quote">原文：「我担心的不是这些特性设计得不好，而是每一个新特性，都在把 Go 从最初吸引很多用户的那个极简语言，往外推一点点。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】支持派 vs 反对派核心论点</h3>
  <table>
    <tr><th>对比维度</th><th>支持派（补课）</th><th>反对派（口子一开）</th><th>一句话结论</th></tr>
    <tr><td>历史诊断</td><td>早年简单过头，缺泛型/迭代器</td><td>无特性时 Docker/Prometheus 已成功</td><td>同一事实可解读为欠账或过度扩张</td></tr>
    <tr><td>认知负载</td><td>统一官方方案好过各写一套</td><td>每加特性抬高新人门槛</td><td>争论焦点是「统一」是否抵消「增量复杂度」</td></tr>
    <tr><td>向后兼容</td><td>必要代价，Go 仍最保守</td><td>slices/maps 导致上游依赖适配事故</td><td>泛型间接冲击了兼容承诺</td></tr>
    <tr><td>实践频率</td><td>四年泛型日常很少手写</td><td>塞满泛型的库可读性像意大利面</td><td>「库作者特性」vs「业务代码污染」需区分</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】泛型与迭代器该怎么用</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>业务 CRUD / HTTP 边界</td><td>interface + 具体类型</td><td>多数特性是给库作者用的；主动够泛型可能是 code smell</td><td>在 any 边界硬套泛型抽象</td><td>传输层 any↔具体类型，泛型常是「没苗头硬要用」</td></tr>
    <tr><td>减少重复容器逻辑</td><td>适度泛型或标准库 slices/maps</td><td>给 any 转换加类型安全、减重复</td><td>为抽象而抽象</td><td>sqlc 等生成器说明很多问题更适合内置容器</td></tr>
    <tr><td>并行遍历两序列（zip）</td><td>iter.Pull 转 pull 再组合</td><td>官方提供 Zip 实现路径</td><td>假设 push 迭代器可直接双开</td><td>push 模型无法同时驱动两个迭代器</td></tr>
    <tr><td>团队保守、可读优先</td><td>继续「精简版 Go」语法</td><td>不喜欢可以不用新特性</td><td>强推全库泛型改造</td><td>破坏「跳进任意仓库不被吓懵」的初衷</td></tr>
  </table>
  <div class="highlight"><strong>落地建议：</strong>评审时问「去掉泛型这行代码还成立吗？」；迭代器优先用 range 与标准库 iter，避免自造野生迭代模式。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】迭代器 Push 模型与 iter.Pull</h3>
  <p><strong>核心思路：</strong>Go 1.23 迭代器是 push-based（range-over-func），统一遍历入口，但并行组合需额外机制。</p>
  <p><strong>操作步骤：</strong>① 识别 API 返回 iter.Seq → ② 需 zip/并行时用 iter.Pull 转 pull → ③ 用 defer stop() 释放 → ④ 在 yield 循环里组合多路数据。</p>
  <p><strong>选型条件：</strong>官方统一迭代语义，防止社区多套不兼容实现悄悄出错。</p>
  <div class="pitfall"><strong>避坑：</strong>iter.Pull 背后要 goroutine + 持久调用栈，成本远高于 C++ 可内联的 pull 迭代器；无 goroutine 无法实现 Python zip 式并行遍历。</div>
  <p><strong>对比相邻方法：</strong>早年要么 eager 全量遍历，要么手写笨拙 .Next()；现在有丑陋但统一的官方路径。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】特性膨胀与 AI 时代的审查</h3>
  <p><strong>坑名：</strong>「全体一致才合并」门槛名存实亡，新特性像白菜一样便宜</p>
  <p><strong>原因：</strong>社区期望与早期 Google 内部共识已变化；泛型方法 1.27 落地进一步增加写法维度。</p>
  <p><strong>原文说法：</strong>「代码审查以后要变得非常难搞」——读代码的人 increasingly 是 AI，但 LLM 训练数据滞后，迭代器推出一年多仍倾向手写循环。</p>
  <p><strong>解法：</strong>用代码所有权缩小 review 范围；把生产可观测性当作比纯走查更可靠的反馈；人类博客/文档仍是教会模型新特性的管道。</p>
  <p><strong>严重程度：</strong>小心——短期是审查负担与风格分裂，长期是「语言是否容易读懂」权重的重新定义。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】新特性准入的克制原则</h3>
  <p><strong>原则：</strong>新特性必须证明自己带来的价值能覆盖引入的复杂度与功能重叠——Go 核心目标仍是尽可能简单。</p>
  <p><strong>为什么重要：</strong>没有语言一开始就计划变成 Perl；杂质随时间自然积累，维护者也会推翻当年决策（如 context API）。</p>
  <p><strong>怎么落地：</strong>像对待「集合两种写法」一样，允许等价方案共存，在实践中摸索偏好，而非幻想禁掉一种。</p>
  <p><strong>适用边界：</strong>高赞和解式总结——Go 没有背离哲学，只是在为曾经选择保守路线付账；账单是否划算还需几个版本验证。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Rust/TypeScript 表达力派 · 「既然要复杂不如换语言」</p>
  <p class="rebuttal-text">半拥抱泛型又拒绝泛型方法的完整表达力，结果是能力更强、写法更多、却拿不到 Rust 级类型安全——两头不靠，还不如一开始就把表达力做满。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>147 赞、60+ 评论的 Reddit 帖暴露 Gopher 对「简单」的深层焦虑：泛型与迭代器是补课还是变质，尚无共识。</li>
    <li>技术战场在「泛型是否 code smell」与「push 迭代器工程代价」；实践上多数业务代码仍可坚持 interface 精简语法。</li>
    <li>「只有一种写法」是美化式误读；真正哲学是克制——新特性须证明价值覆盖复杂度。</li>
    <li>AI 生成代码加剧审查难度，新特性普及速度受训练数据滞后制约，人类文档仍不可替代。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>读一份你依赖的第三方库：泛型主要用于库边界还是渗透到业务层？</li>
    <li>遍历逻辑统一用 range + 标准 iter，禁止团队内多套野生迭代器。</li>
    <li>Code review  checklist 增加「是否为了炫技引入泛型/新语法」。 </li>
    <li>关注 Go 1.27 泛型方法落地后团队风格指南是否需要更新。</li>
    <li>参与 r/golang 或本地 Gopher 讨论，用真实项目案例而非假设性风险辩论。</li>
  </ol>
  <p><strong>关键认知转变：</strong>Go 的简单性争论不是信仰之战的输赢，而是同一价值观下的账单清算——你更在意补齐能力的痛苦，还是守住可读性的痛苦。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
