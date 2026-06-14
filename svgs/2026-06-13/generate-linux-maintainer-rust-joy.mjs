import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'linux-maintainer-rust-joy.svg');

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
<h1>Linux 内核顶级维护者：写了 35 年 C，是 Rust 让我重新找回了编程的乐趣</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Linux 内核</span>
  <span class="tag tag-green">Rust for Linux</span>
  <span class="tag tag-orange">Greg K-H</span>
  <span class="tag tag-purple">系统编程</span>
</div>
<p class="subtitle">本文解决的核心问题是：Linux 内核这位 C 语言守护神为何从 Rust 怀疑论者转为正式拥抱，以及 Rust 如何通过「社会学信任」和「倒逼 C 接口澄清」让整个内核工程变得更好。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">社会学信任<br/>8 年 out-of-tree</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Rust 绑定<br/>倒逼 C 澄清</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">驱动最难<br/>定制 alloc</div>
    <span class="arrow-sym">→</span>
    <div class="node">Klint 编译期<br/>禁眠检查</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「写驱动比写内核核心简单」—— Greg 纠正：驱动是树叶但疯狂消费树干养分，写 Rust 驱动需先为所有依赖 C 模块写绑定，驱动才是最难的。</p>
</div>

<div class="card">
  <h3>【模板 A】信任重构：最大挑战是社会学，不是技术</h3>
  <p><strong>在讲什么问题：</strong>Linux 引入新语言，技术障碍真的是第一位吗？</p>
  <p><strong>核心机制：</strong>内核运转基于对人的信任——不是信任代码不出错，而是信任出问题时你会守在电脑前修。</p>
  <p><strong>关键理解：</strong>C++ 等语言曾试图入门但倡导者写完就走；Rust 社区 8 年 out-of-tree 驱动证明长期维护承诺。</p>
  <p><strong>怎么落地：</strong>引入新栈时先 small PR + 长期 on-call 承诺，而非一次性 big bang 迁移。</p>
  <p><strong>边界说明：</strong>信任需时间积累——不适合「投完代码就撤」的咨询式贡献；Greg 宣布 Rust 实验已结束，已是正式项目。</p>
  <div class="quote">Greg：「我们信任你，不是信任你的代码不会出错；而是信任当代码出错时，你会守在电脑前把它修好。」</div>
</div>

<div class="card">
  <h3>【模板 A】Rust 绑定倒逼 C 接口变清晰</h3>
  <p><strong>在讲什么问题：</strong>Rust 进入内核后，不碰 Rust 的 C 程序员也受益吗？</p>
  <p><strong>核心机制：</strong>C 指针 <code>struct device *get_device_info(void)</code> 语义模糊——所有权？可变？谁释放？写 Rust wrapper 时编译器强制澄清。</p>
  <p><strong>关键理解：</strong>Greg 看到难用 C 接口后直接改 C 让它更简单——「即便 Rust 今天消失，C 代码库也因 Rust 来过而更安全清晰。」</p>
  <p><strong>怎么落地：</strong>① 为新 API 写 Rust/TS 绑定前先文档化 ownership ② 重构模糊指针返回为明确生命周期 API。</p>
  <div class="highlight"><strong>落地建议：</strong>跨语言项目中，用更严格语言（Rust/TypeScript）的绑定需求反向审计 C/legacy 接口语义。</div>
</div>

<div class="card">
  <h3>【模板 B】内核级 Rust：不能用 std alloc</h3>
  <p><strong>方法名：</strong>定制 kernel alloc + Gfp flags 映射</p>
  <p><strong>核心思路：</strong>内核 malloc 不是简单要内存——中断上下文不能睡眠、特定 NUMA 节点、特定 memory bucket。</p>
  <p><strong>操作步骤：</strong>① 剥离 std ② 重写 kernel alloc ③ 映射 Gfp flags 到 Rust API ④ 为每个 C 子系统写 binding。</p>
  <p><strong>避坑：</strong>直接搬用户态 Rust 标准库 alloc——在中断/NUMA 场景必崩。</p>
  <div class="relation"><strong>与 Tokio 异步的区别：</strong>Alice 来自 Tokio 团队，但内核 Rust 是完全不同的 no_std、无 sleep 约束世界。</div>
</div>

<div class="card">
  <h3>【模板 B】Klint：编译期「禁眠」检查</h3>
  <p><strong>方法名：</strong>Kernel Lint 编译器插件</p>
  <p><strong>核心思路：</strong>持有特定锁或处于中断上下文时绝不允许 sleep——C 犯错会死机极难 debug，Klint 编译期直接报错。</p>
  <p><strong>操作步骤：</strong>① 标注不可 sleep 上下文 ② Klint 扫描全路径 ③ 违规调用 → 编译错误。</p>
  <p><strong>对比相邻方法：</strong>Coccinelle 等 C 静态分析无法在不破坏可读性前提下达到同等覆盖。</p>
  <div class="quote">Greg：「Rust 帮我把繁琐、痛苦、容易出错的 meta-stuff 全部承担了……编译通过就可以百分之百专注业务逻辑。」</div>
</div>

<div class="card">
  <h3>【模板 E】C vs Rust 在内核中的角色对比</h3>
  <table>
    <tr><th>对比维度</th><th>C（35 年存量）</th><th>Rust（新正式成员）</th><th>一句话结论</th></tr>
    <tr><td>指针语义</td><td>签名中信息缺失</td><td>所有权强制显式</td><td>Rust 倒逼 C 澄清</td></tr>
    <tr><td>内存/调度错误</td><td>运行时 crash</td><td>Klint 编译期拦截</td><td>左移安全边界</td></tr>
    <tr><td>维护负担</td><td>meta-cognitive 开销高</td><td>编译器承担</td><td>Greg：编程重新变有趣</td></tr>
    <tr><td>迁移策略</td><td>全量不可替换</td><td>驱动/新模块渐进</td><td>融合而非革命</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 D】内核模块语言选型</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>新驱动开发</td><td>Rust for Linux</td><td>绑定生态已成熟，Klint 保护</td><td>裸 C 指针自由发挥</td><td>语义模糊 + 运行时 crash</td></tr>
    <tr><td>核心调度/内存</td><td>继续 C + 渐进接口澄清</td><td>存量巨大，风险极高</td><td>一次性 Rust 重写</td><td>不可承受的中断</td></tr>
    <tr><td>跨语言绑定</td><td>先改 C API 再写 wrapper</td><td>Greg 亲证有效</td><td>几百行 wrapper 硬扛烂 API</td><td>维护地狱</td></tr>
    <tr><td>引入新语言</td><td>8 年 out-of-tree 证明 + 长期维护</td><td>社会学信任 &gt; 语法炫技</td><td>写完就走</td><td>历史上 C++ 等失败模式</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 C】避坑清单</h3>
  <p><strong>坑：认为 Rust 进内核 = 立刻替换所有 C</strong></p>
  <p><strong>原因：</strong>数千万行 C 是钢铁巨塔，融合是渐进工程而非革命。</p>
  <p><strong>解法：</strong>新驱动/新子系统优先 Rust；存量 C 通过绑定倒逼接口改进。</p>
  <p><strong>严重程度：</strong>致命——激进全量迁移会动摇世界算力底座。</p>
  <div class="pitfall"><strong>另一个坑：</strong>把用户态 Rust 经验直接搬内核。no_std、Gfp flags、中断禁眠等约束完全不同——需专门学习 Rust for Linux 生态。</div>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Greg K-H（35 年 C 老炮）宣布 Rust 实验结束，已是 Linux 正式项目</li>
    <li>最大障碍是社会学信任：Rust 社区用 8 年 out-of-tree 工作赢得维护者信心</li>
    <li>Rust 绑定倒逼 C 接口澄清——即使 Rust 消失，C 代码库也已因之更好</li>
    <li>驱动是最难部分：需定制 alloc、全路径 binding、Klint 编译期安全检查</li>
    <li>Greg 最高评价：Rust 承担了 meta-stuff，让编程重新变得纯粹且快乐</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>收听 Rust in Production 播客 S06E04（corrode.dev / YouTube: HM-JM4DoYD4）</li>
    <li>审计项目中一个模糊指针/资源 API，尝试用严格类型语言绑定倒逼澄清</li>
    <li>若有内核/嵌入式方向，阅读 Rust for Linux 文档了解 no_std alloc 约束</li>
    <li>引入新语言/框架时，制定「长期维护 + 出 bug 守电脑前」的贡献者准则</li>
    <li>纠正团队偏见：驱动 ≠ 简单外围，是消费整棵树干养分的最难模块</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「C 是内核神圣不可侵犯的唯一语言」到「开放务实的工程文化——有更好的工具就拥抱，融合让 C 和 Rust 双赢」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
