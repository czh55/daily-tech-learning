import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-example-arbitrary-signatures.svg');

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
<h1>终结十年纠结：Go 新提案允许 Example 支持任意函数签名</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 语言</span>
  <span class="tag tag-green">文档生态</span>
  <span class="tag tag-orange">Issue #79808</span>
  <span class="tag tag-purple">测试框架</span>
</div>
<p class="subtitle">本文解决的核心问题是：Go Example 函数十年来的签名限制如何迫使开发者写出违背 idiomatic 风格的文档代码，以及 Issue #79808 如何通过「文档渲染与测试执行解耦」一次性终结 #21111 与 #64993 的长期争论。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">十年签名限制<br/>无参无返回值</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">被迫 log.Fatal<br/>不良示范传染</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">#79808 解耦<br/>Rendering ≠ Execution</div>
    <span class="arrow-sym">→</span>
    <div class="node">任意签名展示<br/>复杂签名手动 Test</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「放开签名后 go test 会自动运行所有 Example」—— 有参数或返回值的 Example 一律不自动运行；若写了 // Output: 注释会直接编译期报错，防止混淆。</p>
</div>

<div class="card">
  <h3>【模板 A】十年疮疤：Example 签名限制的代价</h3>
  <p><strong>在讲什么问题：</strong>为什么官方文档示例被迫写 log.Fatal/panic？</p>
  <p><strong>核心机制：</strong>当前 Example 必须无参无返回值；真实 Go 代码几乎都会 return error，但文档里只能 log.Fatal(err)。</p>
  <p><strong>关键理解：</strong>新手读官方文档会误以为业务代码应直接 Fatal——示例成了不良编码习惯的传染源，与 Go 优雅错误处理哲学背道而驰。</p>
  <p><strong>典型场景：</strong>os.ReadFile、网络调用等任何返回 error 的 API 文档示例。</p>
  <p><strong>边界说明：</strong>旧规则下 // Output: 注释仍可用于无参 Example 的自动验证；复杂签名场景完全无法展示。</p>
  <div class="quote">原文：「我们真正希望展示的地道写法是 return err，但现行规则行不通。」</div>
  <div class="relation"><strong>与 Test 函数的区别：</strong>Example 面向文档展示，Test 面向验证；旧规则强行让 Example 承担两者导致签名扭曲。</div>
</div>

<div class="card">
  <h3>【模板 A】Issue #79808：Rendering 与 Execution 解耦</h3>
  <p><strong>在讲什么问题：</strong>neild 如何用极简方案终结两场十年战役？</p>
  <p><strong>核心机制：</strong>只要函数名符合 Example/ExampleXxx 且首字母大写，go doc 和 pkgsite 无条件展示——无论签名如何。</p>
  <p><strong>关键理解：</strong>之前讨论陷入死胡同是因为混谈了「文档如何展示」与「测试如何运行」；解耦后规则极简，无编译器黑魔法。</p>
  <p><strong>怎么落地：</strong>① 写 return error 的 Example_returning_an_error() ② 写带 *testing.T 的 ExampleFunc_taking_a_t ③ 需要自动验证时写配套 Test 手动调用。</p>
  <p><strong>边界说明：</strong>复杂签名 Example 不会自动跑；带 // Output: 的复杂签名直接编译错误。</p>
  <div class="highlight"><strong>落地建议：</strong>迁移文档示例时，把 log.Fatal 改回 return err；需要测试覆盖的写 TestExample_xxx 包装调用。</div>
</div>

<div class="card">
  <h3>【模板 B】新规则操作手册</h3>
  <p><strong>方法名：</strong>任意签名 Example + 手动 Test 配套<span class="tag tag-green" style="margin-left:8px">#79808</span></p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 命名 Example 或 ExampleXxx（首字母大写）→ pkgsite 自动展示</p>
  <p>2. 无参无返回值 + // Output: → go test 仍自动运行验证</p>
  <p>3. 有参/返回值 → testing 包不自动运行</p>
  <p>4. 需测试时写 TestExample_xxx(t) 手动调用 Example 函数</p>
  <p><strong>选型条件：</strong>展示 error 返回、testing.T 参数、synctest 虚拟时钟等现代测试 API 时必选新写法。</p>
  <p><strong>避坑：</strong>复杂签名 Example 末尾禁止写 // Output:，否则编译期报错。</p>
  <div class="quote">场景 B 示例：func ExampleFunc_taking_a_t(t *testing.T) { ... t.Fatal(err) }</div>
</div>

<div class="card">
  <h3>【模板 E】三场 Issue 对比</h3>
  <table>
    <tr><th>对比维度</th><th>#21111 (2017)</th><th>#64993 (2024)</th><th>#79808 大一统</th><th>结论</th></tr>
    <tr><td>诉求</td><td>允许返回 error</td><td>允许 *testing.T 入参</td><td>任意函数签名</td><td>一次解决全部</td></tr>
    <tr><td>状态</td><td>等 Go 2 搁置</td><td>与 #21111 纠缠</td><td>解耦 Rendering/Execution</td><td>极简务实</td></tr>
    <tr><td>自动运行</td><td>—</td><td>—</td><td>仅无参无返回值</td><td>复杂签名手动 Test</td></tr>
    <tr><td>设计哲学</td><td>局部补丁</td><td>局部补丁</td><td>彻底解耦</td><td>Go 实用主义典范</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 D】Example 写法选型表</h3>
  <table>
    <tr><th>场景</th><th>推荐写法</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>简单 fmt 输出验证</td><td>无参 Example + // Output:</td><td>go test 自动运行</td><td>写 Test 重复</td><td>丧失 Playable 文档</td></tr>
    <tr><td>展示 error 处理</td><td>Example_xxx() error</td><td>idiomatic return err</td><td>log.Fatal 妥协版</td><td>误导新手</td></tr>
    <tr><td>测试框架/synctest</td><td>Example_xxx(t *testing.T)</td><td>传递 testing 对象</td><td>Stub 伪造类</td><td>文档不可读</td></tr>
    <tr><td>需自动验证的复杂签名</td><td>Example + TestExample 配套</td><td>展示与执行分离</td><td>复杂签名 + // Output:</td><td>编译期报错</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 F】解耦心法：文档回归纯粹</h3>
  <p><strong>原则：</strong>文档展示与测试执行完全剥离——Example 负责「活文档」，Test 负责「验证」，不再互相绑架。</p>
  <p><strong>为什么重要：</strong>十年里代码为古板规则妥协，污染了 Go 错误处理的最佳实践传播。</p>
  <p><strong>怎么落地：</strong>审查 _test.go 中所有 Example，将 log.Fatal/panic 改回 return err；testing 框架示例改用 t 参数。</p>
  <p><strong>适用边界：</strong>提案尚未合并前旧规则仍生效；合并后需更新 CI 中 Example 相关 lint 规则。</p>
  <div class="quote">原文：「他们没有创造复杂的编译器黑魔法，而是通过解耦思路完美解决体验难题。」</div>
</div>

<div class="card">
  <h3>【模板 C】避坑清单</h3>
  <p><strong>坑：复杂签名 Example 仍写 // Output:</strong> — go test 编译期直接报错。<strong>解法：</strong>去掉 Output 注释，改用手动 Test。<strong>严重程度：致命。</strong></p>
  <p><strong>坑：以为所有 Example 都会自动跑</strong> — 有参/返回值的不运行。<strong>解法：</strong>写 TestExample_xxx 包装。<strong>严重程度：小心。</strong></p>
  <p><strong>坑：继续教新手 log.Fatal 处理 error</strong> — 提案通过后文档示例将回归 return err。<strong>解法：</strong>提前迁移现有 pkg 文档。<strong>严重程度：小心。</strong></p>
  <div class="pitfall"><strong>Stub 反模式：</strong>为绕过 *testing.T 限制写伪造类——#79808 通过后应全部删除，改用真实签名。</div>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>十年 Example 签名限制迫使 log.Fatal 污染官方文档，误导 error 处理最佳实践</li>
    <li>Issue #79808 通过 Rendering ≠ Execution 解耦，一次性终结 #21111 与 #64993</li>
    <li>任意签名均可展示；有参/返回值的不自动运行，禁止 // Output:</li>
    <li>需验证时写 TestExample_xxx 手动调用——展示与测试职责分离</li>
    <li>体现 Go 团队实用主义：不增运行时负担，极简规则解决问题</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>跟踪 Issue #79808 合并进度，关注 Go 版本发布说明</li>
    <li>审计项目中 _test.go 的 Example，列出 log.Fatal/panic 妥协清单</li>
    <li>为需展示 error 返回的 API 预写 Example_xxx() error 草稿</li>
    <li>测试框架文档示例改用 ExampleFunc_taking_a_t(t *testing.T) 格式</li>
    <li>Star/关注 golang/go #79808 参与社区讨论</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>Example 不是「必须能被 go test 自动跑的测试函数」，而是「pkgsite 上的活文档」—— 执行验证是 Test 的事，文档不必为测试框架扭曲签名。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
