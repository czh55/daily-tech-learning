import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'unsafe-rust-safety-boundary.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#1e1b2e,#312e81);padding:48px 60px;color:#e2e8f0}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#f97316,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-orange{background:#ffedd5;color:#9a3412}.tag-red{background:#fee2e2;color:#991b1b}.tag-purple{background:#ede9fe;color:#6b21a8}.tag-blue{background:#dbeafe;color:#1e40af}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.15);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#c2410c;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fff7ed;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#9a3412;border-left:4px solid #f97316}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.1)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#fff7ed,#fed7aa);border:2px solid #fdba74;border-radius:16px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#9a3412}
.node-green{background:linear-gradient(135deg,#ecfdf5,#a7f3d0);border-color:#6ee7b7;color:#065f46}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#7c2d12,#ea580c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#c2410c;border-bottom:2px solid #cbd5e1}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#cbd5e1;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#1e293b}`;

const body = `
<h1>Unsafe Rust：安全边界与未决语义</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">RustConf 2026</span>
  <span class="tag tag-red">Undefined Behavior</span>
  <span class="tag tag-purple">Pointer Provenance</span>
  <span class="tag tag-blue">安全关键系统</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 Rust 进入汽车、内核等安全关键领域时，Safe Rust 的承诺在 unsafe 边界外还剩多少，以及为何「测试通过」不能证明 Unsafe Rust 正确，语言尚未最终确定的语义会带来什么工程风险。</p>

<div class="map">
  <h3 style="font-size:20px;color:#c2410c;margin-bottom:12px;text-align:center">Safe 抽象 → unsafe 能力 → UB → 未决语义 → 形式化基础设施</h3>
  <div class="diagram">
    <div class="node-green">Safe Rust<br>所有权/借用</div>
    <span class="arrow-sym">→</span>
    <div class="node">unsafe<br>FFI/裸指针</div>
    <span class="arrow-sym">→</span>
    <div class="node">UB<br>优化前提</div>
    <span class="arrow-sym">→</span>
    <div class="node">Unsettled<br>规则未定</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Miri / Tree Borrows<br>可验证地图</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「Rust 是内存安全语言」= 所有 Rust 代码都安全。实际上安全保证以<strong>遵守 Safe 规则且 unsafe 块满足不变量</strong>为前提；且部分 unsafe 行为语言层面仍<strong>未最终确定</strong>，不等于编译器当前能跑。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Undefined Behavior 与测试的边界</h3>
  <p><strong>在讲什么问题：</strong>为何「我跑过测试了」在安全关键场景不够。</p>
  <p><strong>关键理解：</strong>UB 表示操作无合法下一状态；编译器可假设 UB 永不发生并跨函数优化。含 UB 的程序，其测试结果不能证明行为正确。</p>
  <p><strong>和其他概念关系：</strong>Safe Rust 在类型系统层消除大量 UB 来源；unsafe 把证明责任交还程序员。</p>
  <p><strong>怎么落地用：</strong>关键路径用 Miri 跑测试；发布前对 unsafe 模块做升级回归；把「无 UB」列为安全案例的显式验收项。</p>
  <p><strong>边界说明：</strong>逻辑错误、泄漏、栈溢出不属于 UB 范畴，Safe Rust 也不自动消除它们。</p>
  <div class="highlight"><strong>原文：</strong>Seacord 强调，包含 UB 的程序，其测试结果不能用来证明程序行为。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】Pointer Provenance（指针出处）</h3>
  <p><strong>在讲什么问题：</strong>为何「两个指针地址相同」仍可能语义不同。</p>
  <p><strong>关键理解：</strong>指针除地址外还有 provenance；访问是否 UB 取决于 address + provenance。别名分析需要知道哪些指针不可能别名。</p>
  <p><strong>典型场景：</strong>系统编程、与 C 互操作、内核驱动中的指针技巧与优化之间的张力。</p>
  <p><strong>边界说明：</strong>这是 unsafe 深水区；unsettled 区域里「今天能编译」不保证未来版本仍允许。</p>
  <div class="highlight"><strong>原文：</strong>鱼与熊掌难以兼得——保留所有历史底层技巧 vs 给编译器更强优化空间。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】把 Miri / 编译器当「语言规范」</h3>
  <p><strong>坑名：</strong>Miri 报过就算合规，或「当前 rustc 允许」即跨版本保证。</p>
  <p><strong>原因：</strong>Rust Reference、Miri、编译器行为、社区指南可能不一致；Miri 行为不自动等于语言规范。</p>
  <p><strong>解法：</strong>争议点查 Unsafe Code Guidelines 与专家讨论；安全关键代码避免依赖 unsettled 行为；升级工具链后重评 unsafe。</p>
  <p><strong>严重程度：</strong>对车规/航空：致命。</p>
  <div class="pitfall"><strong>坑名：</strong>用「搜索所有 unsafe」当审查闭环——Rust 2024 已收紧，但仍需记录 Safety Invariant 与封装边界。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Unsafe 子集与审查实践</h3>
  <p><strong>核心思路：</strong>只使用你明确知道安全要求且能验证的语言子集；unsafe 是「程序员证明不变量」，不是绕过编译器。</p>
  <p><strong>操作步骤：</strong>1）最小化 unsafe 范围 → 2）封装为 Safe API 并文档化不变量 → 3）Miri/测试覆盖 → 4）避免 unsettled 技巧 → 5）工具链升级后重审。</p>
  <p><strong>选型条件：</strong>Linux 内核等场景无法消灭 unsafe（文中约 10% 代码 unsafe，底层抽象可达 30%～50%）。</p>
  <p><strong>对比相邻方法：</strong>「不用 unsafe」在应用层可行，在 OS/FFI 场景不现实。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】权威信息来源</h3>
  <table>
    <tr><th>维度</th><th>Rust Reference</th><th>编译器行为</th><th>Miri</th><th>一句话</th></tr>
    <tr><td>角色</td><td>文档化语义</td><td>实现选择</td><td>动态检测 UB</td><td>三者可能分歧</td></tr>
    <tr><td>升级风险</td><td>文档滞后</td><td>可能更严格</td><td>规则跟进研究</td><td>unsettled 区最敏感</td></tr>
    <tr><td>车规可用性</td><td>需交叉验证</td><td>单独不够</td><td>辅助非终审</td><td>要统一规范愿景</td></tr>
    <tr><td>与 C 对比</td><td>分散</td><td>—</td><td>—</td><td>C 有标委会作权威汇聚点</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】你在哪类团队该怎么投入</h3>
  <table>
    <tr><th>场景</th><th>推荐策略</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>业务 Web/CLI</td><td>坚持 Safe + 少量审核过的 unsafe 封装</td><td>Safe 已覆盖主要风险</td><td>全员写裸指针</td><td>收益不成比例</td></tr>
    <tr><td>内核/嵌入式 FFI</td><td>unsafe 边界 + Miri + 形式化跟进</td><td>unsafe 不可避免</td><td>只靠 code review</td><td>unsettled 语义会反噬</td></tr>
    <tr><td>安全认证项目</td><td>跟踪 FLS/MiniRust/Tree Borrows</td><td>需要可审计定义</td><td>「能编译就行」</td><td>认证要回答为什么安全</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】下一阶段是「定义 unsafe」</h3>
  <p><strong>原则：</strong>Rust 下一场战役不是消灭 unsafe，而是让 unsafe 可定义、可验证、可审计。</p>
  <p><strong>为什么重要：</strong>安全关键系统要问「这段代码为什么安全」，必须先有清晰的 UB 与优化边界地图。</p>
  <p><strong>怎么落地：</strong>关注 Miri、Tree Borrows 等进展；团队内维护 unsafe 清单与不变量文档。</p>
  <p><strong>适用边界：</strong>普通应用开发者可把精力放在 Safe API；进入车规/内核才需深度跟进 unsettled 区。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「Rust 已足够成熟，直接替代 C 上车」派</p>
  <p class="rebuttal-text">Linux 里仍有大量比例 unsafe，且语言对不少底层行为尚未定论——用 Safe 的成功营销掩盖规范真空，会在认证与工具链升级时一次性结账。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Safe Rust 显著优于 C 的经典内存错误模型，但不覆盖泄漏、逻辑错误与栈溢出。</li>
    <li>UB 使「测试通过」不能作为 unsafe 正确性的证据。</li>
    <li>部分 Unsafe 语义仍 unsettled；今天能跑不等于未来保证。</li>
    <li>Pointer Provenance 等议题连接别名分析与优化，是规范工作的核心难点。</li>
    <li>工程方向是压缩 unsafe 边界、工具化验证，并建设统一的语言语义地图。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>盘点仓库中 unsafe 块，为每块写清 Safety Invariant 与调用约束。</li>
    <li>在 CI 中对关键 crate 增加 <code>cargo miri test</code>（适用处）。</li>
    <li>升级 rustc 时对 unsafe 模块做专项回归，而非只跑功能测试。</li>
    <li>争议行为对照 Reference 与 Miri，避免依赖未决技巧。</li>
    <li>若做安全关键交付，跟踪 Rust 形式化与内存模型项目进展并纳入合规材料。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「Rust 保证内存安全」转为「Safe 子集有强保证，unsafe 子集需要语言地图 + 人工证明 + 工具共担」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
