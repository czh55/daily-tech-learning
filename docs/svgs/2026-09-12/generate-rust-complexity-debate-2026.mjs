import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'rust-complexity-debate-2026.svg');

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
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
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
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Rust 要变成下一个 C++？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Rust</span>
  <span class="tag tag-orange">语言设计</span>
  <span class="tag tag-purple">复杂度预算</span>
  <span class="tag tag-green">RFC 流程</span>
  <span class="tag tag-red">社区辩论</span>
</div>
<p class="subtitle">本文解决的核心问题是：当命名参数、开放枚举、Move/Destroy/Forget 等十几项 RFC 密集推进时，Rust 社区如何用「三轴判断法」与 RFC 复杂度预算机制，在成功扩张与正交性失守之间守住「不变成下一个 C++」的底线。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Rust 复杂度争论的结构</h3>
  <div class="diagram">
    <div class="node-red">焦虑清单<br>十几项 RFC 叠加</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">三方拉锯<br>技术限制 / 反复杂 / 支持</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">三轴判断法<br>广泛·解锁·减法</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">官方回应<br>Josh Triplett</div>
    <span class="arrow-sym">→</span>
    <div class="node">RFC 闸门<br>复杂度预算</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">争论焦点不是单条提案对错，而是全部叠加后是否突破正交性临界点</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「提案多 = Rust 已经在变 C++」。C++ 的核心问题是同一问题反复造多个轮子、标准两千页且编译器互不兼容；Rust 支持者认为新特性大多解决彼此独立的新问题，且 RFC 流程与复杂度预算审查让大多数提案数年讨论、中途夭折——过去十年「塌方警报」年年响，正交性底牌尚未真正失守。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】「焦虑清单」与正交性危机</h3>
  <p><strong>在讲什么问题：</strong>Reddit r/rust 楼主并非反对某条提案，而是担心十几项特性全部落地后，Rust 会从「每一部分天然契合彼此」滑向语法膨胀。</p>
  <p><strong>核心机制：</strong>清单涵盖命名/默认参数、开放枚举、字段投影、Move/Destroy/Forget 三件套、FFI 函数重载、可变参数、Sized Hierarchy 等——若全部采纳，将新增大量关键字与保留字，破坏语言正交性。</p>
  <p><strong>关键理解：</strong>楼主真正恐惧的是「整体趋势」而非单点功能；他特别质疑为兼容 C/C++ 而牺牲 Rust 简洁性是否本末倒置。</p>
  <p><strong>典型场景：</strong>FFI 互操作、Drop 语义自定义、字节码解释器尾调用优化等各自有真实痛点，但叠加后心智负担呈指数级上升。</p>
  <p><strong>边界说明：</strong>多数提案仍在讨论或 RFC 阶段，尚未落地；单看清单会高估短期变化，低估 RFC 淘汰率。</p>
  <div class="quote">原文：Rust 最打动人的地方之一，恰恰是「语言的每一部分都天然契合彼此」——这种正交性一旦被打破，Rust 就有滑向「新时代 C++」的风险。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Rust 复杂度 vs C++ 复杂度</h3>
  <table>
    <tr><th>对比维度</th><th>C++ 历史路径</th><th>Rust 当前争论</th><th>一句话结论</th></tr>
    <tr><td>问题来源</td><td>同一问题反复造多个轮子</td><td>多为彼此独立的新长尾需求</td><td>性质不同，不能简单类比</td></tr>
    <tr><td>标准体量</td><td>近三十年膨胀至两千页</td><td>十年历史，RFC 仍高度克制</td><td>Rust 尚处早期，有预警窗口</td></tr>
    <tr><td>编译器生态</td><td>多套实现互不兼容</td><td>单一 rustc 主线</td><td>一致性风险目前较低</td></tr>
    <tr><td>社区机制</td><td>标准委员会长期博弈</td><td>RFC + 复杂度预算 + 长观察期</td><td>机制设计刻意防 C++ 式膨胀</td></tr>
    <tr><td>民意信号</td><td>—</td><td>2026 State of Rust：约 40% 希望优先简化</td><td>焦虑并非孤例，团队需回应</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】三轴判断法：评估新特性的普适标尺</h3>
  <p><strong>原则：</strong>判断新特性是否为「甜蜜的负担」，用三个维度量化——广泛 vs 狭窄、解锁能力 vs 语法糖、新增 vs 修补（做减法）。</p>
  <p><strong>为什么重要：</strong>高赞神评把情绪化争论拉回可讨论框架：一次性解决一类共性问题的「广」特性，比反复打补丁的「窄」特性更值得加；真正解锁此前做不到的能力才配得上复杂度。</p>
  <p><strong>怎么落地：</strong>对每条 RFC 自问三题——① 影响面是广泛共性还是单点补丁？② 是解锁新能力还是纯写法糖？③ 是在做加法还是在消除旧例外（减法）？</p>
  <p><strong>适用边界：</strong>框架适合社区讨论与 RFC 评论，不能替代基准测试与生产验证；对命名/默认参数等高赞评论者仍持保留态度。</p>
  <div class="highlight"><strong>实例对照：</strong>显式尾调用、可变参数 → 广泛且解锁能力，值得支持；命名/默认参数、闭包 use 语法糖 → 性价比要打问号。</div>
  <div class="quote">原文：有些看似「新特性」的提案，实际上是在「打补丁」——去掉了此前必须硬记在脑子里的例外情况，反而是在给语言做减法。</div>
</div>

<div class="card">
  <h3>【决策/选型表】三类社区态度与应对策略</h3>
  <table>
    <tr><th>场景</th><th>推荐立场</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>评估单条 RFC</td><td>用三轴判断法逐条打分</td><td>避免把「有用」与「该加进语言」混为一谈</td><td>因单点痛点就支持全盘接受</td><td>叠加效应才是正交性威胁</td></tr>
    <tr><td>FFI 相关提案</td><td>严格限定范围（如函数重载仅 FFI）</td><td>Josh Triplett 强调团队对复杂度极其谨慎</td><td>为兼容 C++ 无限扩展语法</td><td>牺牲简洁性换互操作是本末倒置</td></tr>
    <tr><td>命名/默认参数需求</td><td>结构体参数 + 默认字段值组合</td><td>已有能力自然延伸，不引入新语法面</td><td>直接引入 C++ 式命名参数</td><td>团队倾向不采纳整块新语法</td></tr>
    <tr><td>Move/Destroy/Forget 争论</td><td>看长期是否淘汰 std::pin</td><td>反复杂派认为长期是做减法</td><td>仅看短期类型系统变复杂</td><td>忽略「以复杂换简化」的路径</td></tr>
    <tr><td>参与社区讨论</td><td>引用 State of Rust 数据 + RFC 链接</td><td>40% 用户希望简化，需用证据说话</td><td>引战式「Rust 已死」</td><td>降低讨论质量，无助于 RFC 改进</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】语言成功后的四个复杂度陷阱</h3>
  <p><strong>坑 1 — 长尾需求绑架：</strong>每个长尾背后都有一小撮开发者真心觉得「不加没法用」，成功越大等待队列越长，叠加后可能突破临界点。</p>
  <p><strong>坑 2 — FFI 导向的语法膨胀：</strong>为对接日益过时的 C/C++ 而牺牲 Rust 简洁性，楼主直言本末倒置；函数重载若不限定 FFI 场景会重蹈 C++ 任意重载。</p>
  <p><strong>坑 3 — 把「提案讨论中」当「已落地」：</strong>清单吓人，但 RFC 数年观察、中途夭折比例极高；老贡献者称类似「塌方警报」几乎年年响却从未真正发生。</p>
  <p><strong>坑 4 — 忽视「做减法」型提案：</strong>view patterns 等旨在消除迁移劝退痛点；Move/Destroy/Forget 目标可能是未来淘汰 pin 复杂度——不能只看加法不看减法。</p>
  <div class="relation"><strong>严重程度：</strong>坑 1 是结构性悖论；坑 2 需语言团队严格 scope；坑 3 避免焦虑过载；坑 4 避免误杀有益 RFC。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】跟踪 Rust 语言演进的可执行路径</h3>
  <p><strong>方法名：</strong>RFC 雷达 + 三轴自检 · 标签：社区参与、理性评估</p>
  <p><strong>核心思路：</strong>不被动刷 Reddit 焦虑帖，主动订阅 RFC 仓库与 State of Rust 调查，用统一框架评论提案。</p>
  <p><strong>操作步骤：</strong>1) 关注 rust-lang/rfcs 与 lang-team 公告 → 2) 读提案时用三轴（广泛/解锁/减法）写评论 → 3) 区分 Josh Triplett 等成员的「个人发言」与团队立场 → 4) 对 Move/Destroy/Forget 等争议项追踪是否真能替代 pin → 5) 年度对照 State of Rust 简化诉求比例变化</p>
  <div class="highlight"><strong>落地建议：</strong>团队选型 Rust 时，把「已稳定特性」与「RFC 实验特性」分开评估；生产代码不赌未稳定语法；参与 RFC 评论时用具体用例而非空泛「太复杂」。</div>
  <div class="pitfall"><strong>避坑：</strong>不要把 Reddit 热帖等同于语言方向——RFC 流程才是实际闸门；也不要因「支持派」说「让 Rust 更复杂也就是更好」就忽视 40% 用户希望优先简化的民意。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：坚定支持派 · 「RFC 闸门救不了成功语言的熵增定律」</p>
  <p class="rebuttal-text">C++ 也曾有克制起点和委员会审查，照样三十年膨胀到两千页——用户基数越大长尾越多，RFC 再慢也只是在延迟临界点到来的时间，不是免疫。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>r/rust 焦虑帖列出十几项 RFC，核心恐惧是特性叠加破坏正交性，而非否定单点价值。</li>
    <li>社区分成技术限制派、反复杂化派、坚定支持派；高赞「三轴判断法」成为最接近共识的分析工具。</li>
    <li>语言团队成员 Josh Triplett 释疑：部分为做减法、部分严格限定 FFI、命名参数倾向用结构体组合替代。</li>
    <li>2026 State of Rust 约 40% 受访者希望优先简化；RFC 长周期与复杂度预算是 Rust 区别于 C++ 路径的关键机制。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>用三轴法（广泛/解锁/减法）评估你关心的 RFC，在 GitHub/Reddit 写具体用例评论而非情绪化站队。</li>
    <li>订阅 rust-lang/rfcs 与 State of Rust 年度报告，区分「讨论中」与「已稳定」特性后再做技术选型。</li>
    <li>团队规范：生产代码不依赖实验性 RFC 语法；FFI 需求优先评估现有 bindgen/结构体参数方案。</li>
    <li>参与 Move/Destroy/Forget 等争议讨论时，追问长期是否能淘汰 pin，避免只看短期类型复杂度。</li>
    <li>向新人解释 Rust 时，强调正交性与 RFC 克制文化，而非堆砌未来可能到来的语法清单。</li>
  </ol>
  <p><strong>关键认知转变：</strong>「Rust 会不会变 C++」的答案不在单条提案对错，而在社区能否持续用复杂度预算与三轴标尺，在成功带来的长尾需求与语言精巧之间找到动态平衡——警觉本身可能就是 Rust 区别于前辈的底牌。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
