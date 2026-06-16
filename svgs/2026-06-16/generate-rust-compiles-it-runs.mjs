import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'rust-compiles-it-runs.svg');

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
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>为什么说「编译通过，就能运行」？Google 专家 Alice 揭秘 Rust 的工程美学与底层逻辑</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Rust 工程</span>
  <span class="tag tag-green">类型系统</span>
  <span class="tag tag-orange">编译器约束</span>
  <span class="tag tag-purple">语言治理</span>
</div>
<p class="subtitle">本文解决的核心问题是：Rust「编译即正确」这句工程神话背后，类型系统、所有权模型、Doc Tests 与 Edition 机制如何协同，把生产期暴雷的隐式错误提前在开发期榨干。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">类型系统<br/>Option / Result</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">所有权 + 借用检查<br/>数据结构先行</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Doc Tests<br/>文档即测试</div>
    <span class="arrow-sym">→</span>
    <div class="node">Edition + RFC<br/>民主演进</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Rust 安全 = 没有 unsafe」—— Alice 指出 unsafe 不是关闭检查的后门，而是用安全 API 封装底层特权的封装箱；业务代码 unsafe 使用率应为 0%，不等于语言不安全。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】「编译即正确」的底层机制</h3>
  <p><strong>在讲什么问题：</strong>为什么 Rust 能通过编译器刚性约束，让「编译通过」接近「可正确运行」？</p>
  <p><strong>核心机制：</strong>消灭 null（用 Option 强制解包）、错误即值（Result + ? 操作符强制处理）、Doc Tests 让文档示例自动进 CI。</p>
  <p><strong>关键理解：</strong>不靠开发者自律，而用编译器钢性约束把 NPE、未处理错误、过时文档示例在开发期拦截。</p>
  <p><strong>典型场景：</strong>高并发后端、不容许内存泄漏的微服务、防御性系统底层。</p>
  <p><strong>边界说明：</strong>Web 前端快速试错、频繁变更 UI 的场景，TypeScript 仍更轻量灵活。</p>
  <div class="quote">原文：「它不依赖开发者的细心和自律，而是用编译器的钢性约束，把所有可能在生产环境中暴雷的隐式错误，提前在开发期彻底榨干。」</div>
  <div class="relation"><strong>与 Java 异常的区别：</strong>Java 可抛可不抛、可忘 catch；Rust 忘记处理 Result 直接编译失败。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】新手撞墙期：改数据结构而非改代码</h3>
  <p><strong>方法名：</strong>所有权图谱重构法</p>
  <p><strong>核心思路：</strong>与借用检查器肉搏时，停止局部打补丁，先画清数据所有权 DAG。</p>
  <p><strong>操作步骤：</strong>1. 识别循环引用（Book↔Page）2. 重构为树或 DAG 3. 多所有者共享改用 Arc::clone 4. 再写业务逻辑。</p>
  <p><strong>选型条件：</strong>遇到借用冲突、生命周期报错反复出现时优先用，而非加 clone 或 unsafe 绕过。</p>
  <div class="highlight"><strong>落地建议：</strong>从 TypeScript/Java 迁 Rust 时，落笔前先画「谁拥有谁、谁借给谁」的所有权图，再写 struct 定义。</div>
  <div class="pitfall"><strong>避坑：</strong>不断修改局部代码逻辑通过编译是方向错误；循环引用在无 GC 语言会导致释放死锁。</div>
  <div class="quote">原文：「几乎所有新手都犯了一个根本性的方向错误：他们试图通过不断修改局部代码逻辑来通过编译，而真正的解法往往是修改数据结构。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Rust vs Java/TS/C++ 可靠性对比</h3>
  <table>
    <tr><th>对比维度</th><th>Rust</th><th>Java/TS/C++</th><th>一句话结论</th></tr>
    <tr><td>空值处理</td><td>无 null，Option 强制检查</td><td>null / undefined 运行时暴雷</td><td>消灭「十亿美元错误」</td></tr>
    <tr><td>错误处理</td><td>Result 值返回，? 强制传播</td><td>异常可忽略、GC 隐式</td><td>错误不能被遗忘</td></tr>
    <tr><td>文档质量</td><td>Doc Tests 自动跑示例</td><td>README 示例常过时</td><td>文档与代码强制同步</td></tr>
    <tr><td>内存模型</td><td>所有权 + 借用，无 GC</td><td>GC 或手动管理</td><td>编译期消灭 UAF/泄漏</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】何时选 Rust</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>高并发后端 / 微服务</td><td>Rust</td><td>类型安全 + 无 GC 停顿</td><td>纯脚本快速原型</td><td>所有权学习曲线陡峭</td></tr>
    <tr><td>音视频解码 / 内核驱动</td><td>Rust + 局部 unsafe</td><td>get_unchecked 跳过边界检查换性能</td><td>业务层滥用 unsafe</td><td>破坏安全封装线</td></tr>
    <tr><td>Web 前端快速迭代</td><td>TypeScript</td><td>试错成本低、生态成熟</td><td>强行上 Rust WASM</td><td>变更频率与编译成本不匹配</td></tr>
    <tr><td>语言大版本升级</td><td>Rust Edition 机制</td><td>不同 Edition crate 可混编</td><td>Python 2→3 式割裂</td><td>生态长期分裂阵痛</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】RFC + Edition：无独裁者的语言演进</h3>
  <p><strong>原则：</strong>特性进语言前，先在 RFC 里把用户体验和替代方案论证到极致。</p>
  <p><strong>为什么重要：</strong>Guide-level explanation 逼迫提案者从新手教程视角审视特性，而非堆砌实现细节。</p>
  <p><strong>怎么落地：</strong>大特性走 RFC（含 Alternatives & Prior Art）→ Edition 承载破坏性语法变更 → 旧代码保持旧 Edition 编译。</p>
  <p><strong>适用边界：</strong>小修复不必 RFC；Edition 切换需团队统一工具链版本规划。</p>
  <div class="quote">原文：「这种精密的后向兼容机制，确保了 Rust 既能保持激进的技术进化，又绝对不会把老用户丢在半路上。」</div>
</div>

<div class="card">
  <h3>【避坑清单卡】unsafe 与编译器误解</h3>
  <p><strong>坑：把 unsafe 当「关闭编译器」的后门</strong></p>
  <p><strong>原因：</strong>借用检查器在 unsafe 块内仍工作；unsafe 仅开放原始指针等特权操作。</p>
  <p><strong>解法：</strong>底层 unsafe 实现 + 公开安全 API 封装；企业业务代码 unsafe 率保持 0%。</p>
  <p><strong>严重程度：</strong>小心——误解会导致团队滥用 unsafe 毁掉安全叙事。</p>
  <div class="pitfall"><strong>另一个坑：</strong>大模型时代写代码门槛降低，但系统可靠性更脆弱——更需 Rust 这类编译期防线，而非放弃类型约束。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Java/Go 务实派 · 「够用就行」工程哲学</p>
  <p class="rebuttal-text">编译通过只保证类型与内存安全，Heartbleed 级的逻辑漏洞和 async 死锁照样上线——你用编译器刚性换掉的，是 Java 生态二十年迭代速度和可招到的开发者池。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>「编译即正确」本质是类型系统 + 所有权 + Doc Tests 把隐式错误前移消灭</li>
    <li>新手撞墙期应改数据结构（DAG/Arc），而非与借用检查器局部肉搏</li>
    <li>unsafe 是特权封装箱，不是安全后门；业务层应为 0%</li>
    <li>RFC 模版 + Edition 机制实现无 BDFL 的高效民主演进</li>
    <li>Rust 适合高可靠后端与系统层，不适合所有快速试错前端场景</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>观看 Alice Ryhl 访谈原视频，对照自己项目中的 null/异常处理痛点</li>
    <li>为下一个 Rust 模块先画所有权图，再写 struct 和函数签名</li>
    <li>在 crate 中启用 Doc Tests，让 /// 示例代码进入 cargo test CI</li>
    <li>审查业务代码 unsafe 使用，确保仅封装在安全 API 内部</li>
    <li>评估团队是否适合从 Go/TS 迁 Rust：优先高并发、高可靠路径</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「写完代码再调试、上线祈祷不崩」到「在编译器安全网中优雅降落，开发期扫清已知隐患」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
