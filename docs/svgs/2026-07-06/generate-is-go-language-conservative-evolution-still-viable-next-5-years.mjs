import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'is-go-language-conservative-evolution-still-viable-next-5-years.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#0f766e,#14b8a6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #14b8a6}
.card h3{font-size:22px;font-weight:700;color:#0f766e;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #6ee7b7;border-radius:16px;padding:16px 20px;text-align:center;min-width:110px;font-weight:700;font-size:14px;color:#065f46}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:20px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#0f766e,#14b8a6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#0f766e;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Go 对语言演化的保守态度，在未来 5 年是否仍然正确呢？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">Go 语言演进</span>
  <span class="tag tag-blue">Ops-maximalist</span>
  <span class="tag tag-orange">厨房水槽困境</span>
  <span class="tag tag-purple">长期主义</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 Rust、TypeScript、C++ 不断堆语法糖时，Go 1.27 仍只做 GC 与运行时优化——这种「保守」究竟是阻碍发展，还是 AI 时代代码泛滥下最该坚守的工程策略。</p>

<div class="map">
  <h3 style="font-size:20px;color:#0f766e;margin-bottom:12px;text-align:center">语言设计哲学的两条路线</h3>
  <div class="diagram">
    <div class="node-blue">Dev-maximalist<br><span style="font-size:12px;font-weight:400">Rust / Kotlin / C#</span></div>
    <span class="arrow-sym">vs</span>
    <div class="node">Ops-maximalist<br><span style="font-size:12px;font-weight:400">Go</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">权衡轴<br><span style="font-size:12px;font-weight:400">编写体验 ↔ 运维协作</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「语言特性越多 = 越先进」——特性叠加的认知边界成本呈指数上升，C++ 有 37 种方式做同一件事，团队协作摩擦远大于编写时的舒适。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】厨房水槽困境与复杂性复利</h3>
  <p><strong>在讲什么问题：</strong>主流语言为何越变越丰富，而 Go 刻意克制？</p>
  <p><strong>核心机制：</strong>无限制接纳特性的反模式叫「厨房水槽」——把所有好主意全塞进语言；每多一种写法，Code Review 就从业务逻辑滑向语法审美辩论。</p>
  <p><strong>关键理解：</strong>新特性不应只因「好主意」就引入，而必须以唯一正确的方式自然融入现有生态——泛型在 Go 里被否决十年后才落地，正是这一哲学的体现。</p>
  <p><strong>典型场景：</strong>大型团队、开源社区、云原生基础设施——代码被阅读维护的次数远大于被编写次数。</p>
  <p><strong>边界说明：</strong>探索范式前沿、追求表达力的极客项目仍需要 Rust/C++；Go 不追求「美丽」，追求可预测与可协作。</p>
  <div class="quote">原文：「C++ 确实从不破坏现有代码，但它却为你提供了 37 种实现同一个功能的方法。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Dev-maximalist vs Ops-maximalist</h3>
  <table>
    <tr><th>对比维度</th><th>Dev-maximalist（Rust/Kotlin/C#）</th><th>Ops-maximalist（Go）</th><th>一句话结论</th></tr>
    <tr><td>核心驱动力</td><td>优化编写体验与表达力</td><td>牺牲部分编写舒适换运维体验</td><td>取舍不同，非优劣</td></tr>
    <tr><td>认知负载</td><td>陡峭学习曲线、复杂类型系统</td><td>语法笨拙但统一（显式 error）</td><td>Go 降低协作成本</td></tr>
    <tr><td>编译与部署</td><td>往往较慢、依赖复杂</td><td>秒级编译、单一静态二进制</td><td>Go 适合高频迭代基础设施</td></tr>
    <tr><td>告警值班场景</td><td>需揣摩宏/继承/模板</td><td>三年前离职同事的代码仍可读</td><td>Ops 价值在维护期爆发</td></tr>
    <tr><td>生态断裂风险</td><td>TS/JS 去年写法今年过时</td><td>十年老代码仍可用新编译器</td><td>稳定性带来依赖不腐烂</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】保守演进的长期主义红利</h3>
  <p><strong>原则：</strong>断舍离——抵御盲目添加特性的诱惑，是喧嚣技术洪流中的长期主义修养。</p>
  <p><strong>为什么重要：</strong>向后兼容的复利：外部依赖不会因语言新语法被迫发版，「几年没更新」可能是已完备而非被遗弃。</p>
  <p><strong>怎么落地：</strong>团队选型时问：这段代码 5 年后谁在读？告警时初级工程师能否 10 分钟看懂？</p>
  <p><strong>适用边界：</strong>需要最前沿抽象或极致零成本抽象的系统层，仍应选 Rust/C++，Go 甘当「无聊但坚不可摧的螺丝钉」。</p>
  <div class="highlight">深耕底层：当别家讨论语法糖，Go 团队在优化 GMP 调度、Green Tea GC、协程泄露监控——这些才是高并发场景真正的算力节省。</div>
  <div class="quote">原文：「代码被阅读和维护的次数，远大于被编写的次数。」</div>
</div>

<div class="card">
  <h3>【决策/选型表】未来 5 年该押注哪种语言哲学</h3>
  <table>
    <tr><th>场景</th><th>推荐取向</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>CNCF/微服务/基础架构</td><td>Go 式保守 + 运行时深耕</td><td>协作可读、部署简单、pprof 开箱即用</td><td>追逐最新语法糖的语言</td><td>团队摩擦与生态断裂成本高</td></tr>
    <tr><td>AI 辅助编程普及</td><td>行为可预测、同质化代码风格</td><td>AI 生成代码需被快速审查</td><td>表达力极强但风格分裂的语言</td><td>初级工程师难以把关 AI 产出</td></tr>
    <tr><td>系统编程/极致性能安全</td><td>Rust/C++ 等 Dev-maximalist</td><td>需要零成本抽象与类型安全边界</td><td>强行用 Go 模拟所有范式</td><td>违背语言设计目标</td></tr>
    <tr><td>前端/全栈快速迭代</td><td>TypeScript 等丰富生态</td><td>表达力与工具链匹配业务节奏</td><td>用 Go 写复杂 UI 逻辑</td><td>不是 Go 的主战场</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】特性清单思维的陷阱</h3>
  <p><strong>坑名：</strong>用「特性对比清单」选型，忽视维护期认知成本。</p>
  <p><strong>原因：</strong>编写时的舒适是显性收益，协作摩擦与生态断裂是隐性且复利增长的负债。</p>
  <p><strong>解法：</strong>把「五年后能否无痛编译」「离职同事代码能否值班读懂」纳入选型权重。</p>
  <p><strong>严重程度：</strong>小心（对小型项目影响小，对基础设施团队致命）。</p>
  <div class="pitfall">坑名：认为 Go 1.27 无语法革新 = 停滞——GC、内存分配、协程监控等底层优化才是生产环境真正的护城河。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Rust 拥趸 / 「表达力即生产力」派</p>
  <p class="rebuttal-text">AI 生成代码的速度已让「可读性」贬值——编译器与类型系统替你兜底的 Rust，反而能让 AI 在更强约束下少犯内存与并发错误，保守语法才是 AI 时代的累赘。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Go 的保守不是停滞，而是把工程价值沉淀在稳定性、消除歧义与底层性能上。</li>
    <li>Dev-maximalist 优化编写，Ops-maximalist 优化协作与运维——云原生场景后者更匹配。</li>
    <li>特性叠加带来厨房水槽困境，认知边界成本指数增长，团队协作摩擦被低估。</li>
    <li>AI 时代代码生成加速，系统复杂性上升，可预测、同质化的基础设施语言反而更稀缺。</li>
    <li>世界需要极客语言探索前沿，也需要 Go 这样甘愿无聊的螺丝钉——两者并存而非替代。</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>团队技术选型时增加「五年可维护性」与「告警可读性」评估维度。</li>
    <li>阅读 Go 1.27 发布说明，关注 GC/运行时而非仅盯语法变更。</li>
    <li>参与 r/golang 类似讨论，用 Trade-off 框架而非特性清单辩论语言演进。</li>
    <li>基础设施项目优先统一代码风格，减少「多种写法争艳」的 Review 内耗。</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>语言演进「快」不等于项目「强」——在代码泛滥的 AI 时代，坚如磐石、任何人生成代码都能被快速审查的语言，才是基础设施的稀缺品。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
