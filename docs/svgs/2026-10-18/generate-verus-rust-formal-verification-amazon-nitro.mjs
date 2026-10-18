import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'verus-rust-formal-verification-amazon-nitro.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#fff7ed,#ffedd5);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#c2410c,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-orange{background:#ffedd5;color:#9a3412}.tag-amber{background:#fef3c7;color:#92400e}.tag-slate{background:#f1f5f9;color:#334155}.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#9a3412;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fff7ed;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#7c2d12;border-left:4px solid #f97316}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ffedd5,#fed7aa);border:2px solid #fdba74;border-radius:14px;padding:10px 12px;text-align:center;min-width:72px;font-weight:700;font-size:10px;color:#9a3412}
.node-warn{background:linear-gradient(135deg,#fee2e2,#fecaca);border-color:#f87171;color:#991b1b}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#9a3412,#ea580c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#fff7ed;padding:10px 14px;text-align:left;font-weight:700;color:#9a3412;border-bottom:2px solid #fdba74}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px}`;

const body = `
<h1>Verus：给 Rust 关键路径一张「数学身份证」</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">形式化验证</span>
  <span class="tag tag-amber">requires/ensures</span>
  <span class="tag tag-slate">幽灵代码擦除</span>
  <span class="tag tag-red">Nitro / unsafe</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 Rust 已守住内存与数据竞争底线后，如何在 Nitro 隔离引擎等「一错即灾难」的基础设施里，证明业务逻辑与并发协议在所有输入下都满足规约，而不是只覆盖测试用例。</p>

<div class="map">
  <h3 style="font-size:20px;color:#9a3412;margin-bottom:12px;text-align:center">规约写进 Rust → 求解器自动证明 → 幽灵擦除可 Cargo 发布 → unsafe/锁再补机器检查</h3>
  <div class="diagram">
    <div class="node">verus!<br>requires/ensures</div><span class="arrow-sym">→</span>
    <div class="node">SMT<br>秒级反馈</div><span class="arrow-sym">→</span>
    <div class="node">ghost<br>erasure</div><span class="arrow-sym">→</span>
    <div class="node-warn">unsafe<br>+锁不变式</div><span class="arrow-sym">→</span>
    <div class="node">Nitro<br>关键组件</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：Rust 够安全就不用形式化验证。原文强调「更安全 ≠ 绝对正确」——越界在 Rust 里会 panic，但正确程序本不该走到那一步；类型系统也证明不了算式结果与数据泄露。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】内存安全与「做对了」</h3>
  <p><strong>在讲什么问题：</strong>工业级 Rust（Firecracker、Nitro、无服务器 SQL）仍可能逻辑错误。</p>
  <p><strong>关键理解：</strong>Verus 要证的是「对所有可能输入满足数学规约」，测试只抽样。</p>
  <p><strong>怎么落地用：</strong>先列出「一旦错就付不起代价」的路径（隔离、密钥、支付），再决定是否写规约。</p>
  <p><strong>边界说明：</strong>普通 CRUD、原型不必全员 Verus；投入与故障代价成正比。</p>
  <p><strong>原文依据：</strong>「Rust 的类型系统也无法保证程序算出来的结果就是开发者预期的那个结果。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】规约写在源码里</h3>
  <p><strong>核心思路：</strong>用 <code>requires</code> / <code>ensures</code> 描述前置与后置；二分查找示例要求有序数组，且 <code>None</code> 时必须真不存在目标值。</p>
  <p><strong>操作步骤：</strong>1）在 <code>verus!</code> 块写规约 → 2）跑 Verus 验证器拿秒级反馈 → 3）未装验证器时靠 <code>verus_builtin_macros</code> 幽灵擦除，仍可用 Cargo 编译发布。</p>
  <p><strong>避坑：</strong>普通 <code>cargo run</code> 不会检查 <code>requires</code>（如 <code>add_one(9999)</code> 仍返回），规约不是运行时 assert。</p>
  <div class="highlight">无 <code>verus_keep_ghost</code> 时宏展开会 <code>EraseAll</code>，验证能力是可选叠加层，而非消费方硬门槛。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】unsafe 与并发锁</h3>
  <p><strong>核心思路：</strong>为编译器放弃的 unsafe 检查补数学证明；为锁附加不变式（持锁时数据满足性质，释放前须再证）。</p>
  <p><strong>选型条件：</strong>Nitro 等自定义高性能锁协议适合 Verus 证「锁实现本身正确」。</p>
  <p><strong>对比相邻方法：</strong>仅靠 Rust 类型系统无法证逻辑正确；仅靠测试无法穷尽并发交错。</p>
  <p><strong>原文依据：</strong>「证明并发代码在逻辑上是正确的」而不只是「无畏并发」层面的安全。</p>
</div>

<div class="card">
  <h3>【决策/选型表】何时值得上 Verus</h3>
  <table>
    <tr><th>场景</th><th>建议</th><th>判断依据</th></tr>
    <tr><td>VM 隔离、微内核、证书校验</td><td>优先形式化</td><td>故障不可接受；已有 Vest、Verdict、Anvil 等先例</td></tr>
    <tr><td>业务 Web API、脚本工具</td><td>测试 + 类型即可</td><td>规约编写与信任链成本高</td></tr>
    <tr><td>含 unsafe 的性能热点</td><td>局部 Verus 证明</td><td>把 UB 风险从「开发者自觉」升级为可检查</td></tr>
    <tr><td>快速迭代原型</td><td>延后</td><td>规约与证明随需求频繁变更</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】测试 vs 类型系统 vs Verus</h3>
  <table>
    <tr><th>维度</th><th>测试</th><th>Rust 类型</th><th>Verus</th></tr>
    <tr><td>保证范围</td><td>抽到的输入</td><td>内存/并发类 bug</td><td>规约下的全部输入</td></tr>
    <tr><td>反馈速度</td><td>跑用例</td><td>编译期</td><td>约秒级（求解器）</td></tr>
    <tr><td>人力模型</td><td>写用例</td><td>写类型合法代码</td><td>写规约 + 证明提示（可 AI 辅助）</td></tr>
    <tr><td>典型盲区</td><td>边界遗漏</td><td>业务逻辑错</td><td>规约写错、信任链假设</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】把 requires 当运行时断言</h3>
  <p><strong>坑名：</strong>以为违反 <code>requires</code> 会在生产环境 panic。</p>
  <p><strong>原因：</strong>幽灵擦除后规约不进二进制；验证只在 Verus 工具链发生。</p>
  <p><strong>解法：</strong>合并前跑 Verus CI；关键 crate 对消费方文档化「须验证通过」。</p>
  <p><strong>严重程度：</strong>对安全关键路径：致命误解。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】信任链四环</h3>
  <p><strong>原则：</strong>保证来自工具可靠、规约表达真实意图、对 std/运行时的假设成立、编译链可信。</p>
  <p><strong>怎么落地：</strong>开源生态（Vest、CapybaraKV、Atmosphere）从子系统逐步扩证明覆盖面。</p>
  <p><strong>适用边界：</strong>亚马逊承诺后续文章展开如何提升各环节信心——短期别假装「数学证明 = 零信任成本」。 </p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「形式化验证是学术玩具，工业界等不起」</p>
  <p class="rebuttal-text">若只盯着「人人给每个函数写证明」，确实不现实；但 Nitro 级系统已经在用 Verus 啃关键组件——争论点应是「哪些路径配数学身份证」，而不是「数学有没有用」。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Rust 内存安全是底线，正确性与防泄露需要规约级证明。</li>
    <li>Verus 把规约嵌进 Rust 源码，幽灵擦除兼顾验证与 Cargo 生态。</li>
    <li>秒级求解器 + AI 辅助降低证明人力，适合交互式开发。</li>
    <li>unsafe 与自定义锁是 Verus 的差异化战场，贴合 Nitro 类需求。</li>
    <li>开源项目已扩散；投入应聚焦「错不起」的关键路径。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>盘点系统中隔离、密钥、持久化日志等 Tier-0 模块，标出是否值得写规约。</li>
    <li>用官方二分查找 / <code>add_one</code> 示例本地跑通 Verus 与纯 Cargo 双路径。</li>
    <li>在 CI 中对选定 crate 增加 <code>verus</code> 验证步骤，禁止仅依赖运行时测试。</li>
    <li>为 unsafe 块写最小 <code>ensures</code>，先证「不 UB」再扩业务性质。</li>
    <li>阅读 Amazon Science 原文与 verus-lang 仓库，评估与现有 Rust 模块的接入点。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「编译通过 ≈ 可以上线」转为「关键路径要有可机器检查的数学规约，测试只作抽样信心」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
