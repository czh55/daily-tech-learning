import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'writing-idiomatic-go.svg');

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
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>写地道的 Go 语言，是否能让你成为了一个更好的开发者？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 语言</span>
  <span class="tag tag-green">软件工程</span>
  <span class="tag tag-orange">Idiomatic Go</span>
  <span class="tag tag-purple">认知升级</span>
</div>
<p class="subtitle">本文解决的核心问题是：刻意「无聊」的 Go 语法约束，能否反向重塑程序员的工程思维，并在离开 Go 后依然写出更干净、更可维护的代码。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">显式错误处理<br/>直面失败</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">极简克制<br/>反过度设计</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">隐式接口<br/>组合优于继承</div>
    <span class="arrow-sym">→</span>
    <div class="node">可读性优先<br/>工程素养</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Go 无聊、样板代码多 = 语言落后」—— Reddit 高赞共识是，这种「自我阉割」恰恰是训练高级后端架构师的模拟器，而非语法缺陷。</p>
</div>

<div class="card">
  <h3>【模板 A】显式错误处理：从假装看不见到直面毁灭</h3>
  <p><strong>在讲什么问题：</strong>为什么 Go 强迫每个调用点写 <code>if err != nil</code>，而 Java/Python 用 try-catch 看起来更清爽？</p>
  <p><strong>核心机制：</strong>函数返回 (Value, error) 双元组，逼迫开发者在每个可能失败节点立刻决策：包装返回、降级重试还是熔断。</p>
  <p><strong>关键理解：</strong>异常语言制造「失败被完美控制」的幻觉；生产环境未捕获 Runtime Exception 才是系统崩溃主因。</p>
  <p><strong>怎么落地：</strong>① 用 <code>fmt.Errorf("...: %w", err)</code> 包装上下文 ② 禁止空 catch/except ③ 回写其他语言时用 Result/Tuple 显式解包。</p>
  <p><strong>边界说明：</strong>不适合需要统一异常拦截框架的 GUI 快速原型；对极高频热路径需权衡错误分配开销。</p>
  <div class="quote">原文：「基于异常的语言给我们制造了一种『异常被完美控制』的幻觉。这其实是极不负责任的。」</div>
  <div class="relation"><strong>与 try-catch 的区别：</strong>Go 把控制流显式化；异常把失败路径隐式化——前者训练「失败是常规状态」的工程意识。</div>
</div>

<div class="card">
  <h3>【模板 F】极简克制：治好架构妄想症</h3>
  <p><strong>原则：</strong>Go 故意压缩语言特性——没有继承、没有操作符重载、没有隐藏控制流，逼迫你放弃形式炫技。</p>
  <p><strong>为什么重要：</strong>3-5 年经验开发者易过度设计：十几层继承、几十种设计模式——Go 的「只有一种最笨写法」强制回归本质。</p>
  <p><strong>怎么落地：</strong>写代码前先问三问：① 实习生 30 秒能看懂吗？② 复杂度真的必要吗？③ 数据流向清晰吗？</p>
  <p><strong>适用边界：</strong>需要元编程/DSL 表达力的领域（复杂模板库）Go 并非最优；业务 CRUD 和微服务是主战场。</p>
  <div class="quote">Reddit 用户：「我开始怀念 Go 那种『只有一种最笨、最直接的写法』的无聊感。」</div>
</div>

<div class="card">
  <h3>【模板 A】隐式接口与组合：Accept interface, return struct</h3>
  <p><strong>在讲什么问题：</strong>如何在不建 giant Class 树的前提下实现松耦合？</p>
  <p><strong>核心机制：</strong>结构体子类型（鸭子类型）——函数只关心「能不能 Read」，不关心具体类型；返回最具体的 struct。</p>
  <p><strong>关键理解：</strong>输入端轻量解耦、输出端具体干净，天然导向 Ports &amp; Adapters / 六边形架构。</p>
  <p><strong>怎么落地：</strong>① 小接口（io.Reader 级别）② 用 embedding 组合而非继承 ③ 测试时用 mock 实现同一接口。</p>
  <p><strong>边界说明：</strong>隐式接口可能导致「意外实现」——大型项目需通过包边界和 lint 约束；不适合需要名义类型强隔离的场景。</p>
  <div class="highlight"><strong>落地建议：</strong>重构现有 OOP 代码时，先找「行为边界」抽接口，再 flatten 继承树为 struct 组合。</div>
</div>

<div class="card">
  <h3>【模板 E】错误处理范式对比</h3>
  <table>
    <tr><th>对比维度</th><th>异常驱动 (Java/Python)</th><th>显式 error (Go)</th><th>一句话结论</th></tr>
    <tr><td>失败可见性</td><td>隐式，靠文档/经验</td><td>编译期强制处理路径</td><td>Go 让失败无处躲藏</td></tr>
    <tr><td>控制流</td><td>非本地跳转</td><td>就地决策</td><td>显式更易 debug</td></tr>
    <tr><td>代码密度</td><td>业务逻辑更「干净」</td><td>样板 if err 增多</td><td>密度换可预测性</td></tr>
    <tr><td>跨语言迁移</td><td>习惯依赖全局 catch</td><td>养成 Result 思维</td><td>Go 训练可迁移</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 D】何时用 Go idioms 反哺其他语言</h3>
  <table>
    <tr><th>场景</th><th>推荐做法</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>后端 API 服务</td><td>显式错误 + 扁平结构</td><td>可预测、易 on-call</td><td>深层继承 + 全局异常</td><td>生产 debug 噩梦</td></tr>
    <tr><td>快速脚本原型</td><td>保留语言原生异常</td><td>速度优先</td><td>强行套用 Go 样板</td><td>过度工程</td></tr>
    <tr><td>跨模块重构</td><td>小接口 + 组合</td><td>降低修改爆炸半径</td><td>建复杂 Taxonomy</td><td>父类改动级联崩溃</td></tr>
    <tr><td>团队 onboarding</td><td>统一 boring 风格</td><td>可读性 &gt; 个人炫技</td><td>每人一套「聪明写法」</td><td>3AM 报警无人能懂</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 C】避坑清单</h3>
  <p><strong>坑：把 Go 的 boring 误解为可以写 sloppy 代码</strong></p>
  <p><strong>原因：</strong>idiomatic 强调的是可读性和一致性，不是降低质量标准。</p>
  <p><strong>解法：</strong>遵循 Effective Go、用 golangci-lint，错误必须 wrap 上下文。</p>
  <p><strong>严重程度：</strong>小心——风格统一但逻辑混乱仍会在生产爆雷。</p>
  <div class="pitfall"><strong>另一个坑：</strong>认为「精妙难懂 = 高水平」。原文强调：Idiomatic Go 设计目标是让<strong>下一个开发者</strong>易读，而非让当前开发者写得爽。</div>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Go 是高标准「驾驶模拟器」：显式错误、极简语法、组合接口硬性训练工程意识</li>
    <li>Reddit 大厂架构师共识：写 idiomatic Go 确实让人成为更好的整体开发者</li>
    <li>核心价值不在 Go 本身，而在「失败常规化、可读性优先、反过度设计」的可迁移思维</li>
    <li>离开 Go 后写 C++/Java/Python 也会更干净——认知已被重新格式化</li>
    <li>衡量职业素养的终极指标是可预测性与可读性，而非代码精妙度</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>选一个小模块用 Go 重写，刻意练习每个 error 的就地处理决策</li>
    <li>在现有 Python/TS 项目中引入 Result/Tuple 显式错误，禁止空 except</li>
    <li>审计一处继承树，尝试 flatten 为 interface + struct 组合</li>
    <li>Code Review 时加一问：「新人 30 秒能看懂数据流吗？」</li>
    <li>阅读 Reddit 原帖讨论（r/golang）对照自身坏毛病清单</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「语言特性越多越好」到「约束是 feature」——最好的代码是 boring 但可预测的代码。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
