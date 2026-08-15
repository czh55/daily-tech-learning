import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'rust-rewrite-blazingly-fast-or-hyped-rustikon-2026.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#fff7ed,#fef3c7);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#9a3412,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-brown{background:#fef3c7;color:#92400e}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#9a3412;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fff7ed;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#9a3412;border-left:4px solid #f97316}
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fdba74;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#9a3412}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#9a3412,#ea580c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#fff7ed;padding:12px 16px;text-align:left;font-weight:700;color:#9a3412;border-bottom:2px solid #fdba74}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Rust重写运动，到底是真香还是被吹爆？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">RIIR</span>
  <span class="tag tag-brown">Rustikon 2026</span>
  <span class="tag tag-blue">性能实测</span>
  <span class="tag tag-green">重写决策</span>
  <span class="tag tag-red">翻车案例</span>
</div>
<p class="subtitle">本文解决的核心问题是：面对「用 Rust 重写」这股从 2022 年兴起的 RIIR 热潮，工程团队该如何区分真实红利与迷因炒作——Rustikon 2026 演讲用 uutils、PNG 库等实测数据证明部分场景确有数倍提速，但 bat 管道模式比 cat 慢 60 倍、工期常被低估 2 到 3 倍、Cloudflare 到 sudo-rs 都曾引入新 bug；Linux/Windows 内核接纳是标杆，Prisma 与 LogLog 则体面退场，重写从来不是非黑即白的口号而是需要测试套件与许可证一并权衡的工程决策。</p>

<div class="map">
  <h3 style="font-size:20px;color:#9a3412;margin-bottom:12px;text-align:center">RIIR 重写决策全景：动机 → 类型 → 收益与代价 → 是否动手</h3>
  <div class="diagram">
    <div class="node">动机<br>内存安全<br>性能/并发<br>开发者喜爱</div>
    <span class="arrow-sym">→</span>
    <div class="node-blue">三类重写<br>Drop-in<br>平行替代<br>自我重写</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">真红利<br>sort 4×<br>PNG 2×<br>multi-call 瘦身</div>
    <span class="arrow-sym">⇄</span>
    <div class="node-red">隐藏代价<br>新 bug<br>学习曲线<br>工期×2-3</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">决策<br>关键软件?<br>测试套件<br>扩展优先</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">迷因热度或已褪去，但重写热情未减；最大成就仍是 Linux 与 Windows 内核对 Rust 的接纳</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「用 Rust 重写就一定更快更安全」。实测表明 bat 非交互模式比 cat 慢 60 倍、lsd 因额外系统调用变慢；写 Rust 不等于自动免疫 bug，sudo-rs 密码回显、async-tar RCE 都是前车之鉴。性能提升部分来自「没有历史包袱的重写」本身，而非 Rust 独有魔法。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】RIIR 运动与三种重写类型</h3>
  <p><strong>在讲什么问题：</strong>GitHub issue 里「为什么不用 Rust 重写」从 2022 年前后成梗（RIIR），三年过去这场运动是真香还是被过度炒作（blazingly hyped）？</p>
  <p><strong>核心机制：</strong>演讲将项目归纳为三类——① Drop-in 替代：完全兼容原二进制（uutils、sudo-rs、Youki、PNG/tar 库）；② 平行替代品：解决同类问题但交互不同（ripgrep、bat、Typst、Polars）；③ 自我重写：项目内部主动用 Rust 替换旧栈（Codex CLI、Fish、Cloudflare 基础设施）。</p>
  <p><strong>关键理解：</strong>划分并不绝对，有些项目横跨多类；运动最大两项成就是 Linux 与 Windows 内核对 Rust 的接纳，让 Rust 跑在全球数十亿设备上。</p>
  <p><strong>典型场景：</strong>关键基础设施、GNU 工具链替代品、需要内存安全策略的 Android 裸机代码——Android 数据显示不安全代码行数与漏洞数量呈线性相关。</p>
  <p><strong>边界说明：</strong>若项目不需要极致安全与性能（如微软 TypeScript 编译器选 Go），或团队技能栈与迭代节奏不匹配（Prisma 回归 TS、LogLog 游戏工作室三年退场），强行 RIIR 得不偿失。</p>
  <div class="quote">「Rust 已连续多年蝉联 Stack Overflow 最受喜爱语言——很多重写的起点可能就是一句朴素的『为什么不呢』。」</div>
  <div class="relation"><strong>相关概念：</strong>与「扩展式引入新语言」相对——整体推倒重来要重新面对老 bug，最后 5% 行为对齐往往决定整个重写值不值（Hyper/Curl 集成在 95% 处放弃）。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】性能红利从哪来：三个实测与两个反例</h3>
  <p><strong>核心思路：</strong>用真实项目数据说明 Rust 重写为何有时更快，同时警惕「重写必然提速」的幻觉。</p>
  <p><strong>操作步骤（正向案例）：</strong>① uutils sort 比 GNU coreutils 快近 4 倍——并行处理在 Rust 里更易写且更安全，但部分红利来自「无历史包袱的新项目」；② PNG 解码快近 2 倍——filter 阶段靠编译器自动向量化替代手写 SIMD，deflate 阶段做流式解压让数据更多留在 CPU 缓存；③ 二进制体积用 multi-call binary（busybox 老思路）把 uutils 从 73MB 压到 14MB，反超 GNU coreutils。</p>
  <p><strong>反例必记：</strong>bat 非交互管道模式比 cat 慢 60 倍；lsd 因展示更多信息触发大量额外系统调用而变慢——好在社区较快修复，说明光靠语言写不出快代码，还得有人真的做性能工程。</p>
  <div class="highlight"><strong>落地：</strong>重写后必须用真实工作负载压测（含管道/非交互路径），不能只看 benchmark 峰值；体积敏感场景提前评估 multi-call 或裁剪 panic 信息、Debug trait、静态链接策略。</div>
  <div class="pitfall"><strong>避坑：</strong>把「重写红利」全部归因于 Rust 语言特性——并行与向量化部分来自重新设计，C 项目若同样推倒重来也可能获得类似空间。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】重写隐藏代价：bug、工期、学习曲线</h3>
  <p><strong>坑 1：写 Rust 等于零 bug</strong>——Cloudflare ML 评分组件 unwrap 事故、uutils 日期格式破坏兼容、sudo-rs 密码超时回显、Linux binder 驱动首个 Rust CVE（unsafe 块竞态）、async-tar Termageddon RCE。<strong>解法：</strong>复用原版测试套件（uutils 用 GNU coreutils 测试逼近 100% 行为对齐）。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 2：工期预估过于乐观</strong>——小型数月、中型 1-2 年、大型 2-5 年，实际常多 2-3 倍，最后 5%-10% 细节对齐最难啃。<strong>解法：</strong>预算按 2-3 倍预留，把行为一致性验证纳入里程碑而非收尾杂项。<strong>严重程度：</strong>致命（项目取消）。</p>
  <p><strong>坑 3：低估学习曲线</strong>——借用检查器、生命周期、async 是真实门槛；Google 调查约 2/3 开发者两个月后才有信心贡献，个体差异大。<strong>解法：</strong>动手前确认团队愿意学或已有 Rust 能力。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑 4：许可证换血引发用户流失</strong>——沿用原许可最省事；改 GPL 可能吓跑专有产品集成方，改更宽松又可能被批「大公司白嫖」。<strong>解法：</strong>重写前单独评估许可策略，无标准答案但不可忽略。<strong>严重程度：</strong>小心。</p>
</div>

<div class="card">
  <h3>【决策/选型表】什么场景值得用 Rust 重写</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>关键基础设施 + 内存不安全语言 + 高可靠</td><td>认真评估整体或渐进重写</td><td>Android 数据：不安全代码与漏洞线性相关；Linux/Win 内核已验证路径</td><td>跟风 RIIR 梗</td><td>缺测试与工期规划会在 95% 处崩盘</td></tr>
    <tr><td>GNU 工具链替代品</td><td>Drop-in + 原版测试套件</td><td>uutils 示范：行为对齐可量化</td><td>只追求 benchmark 数字</td><td>管道/边缘路径可能像 bat 一样暴雷</td></tr>
    <tr><td>编译器/ORM 等业务逻辑重</td><td>优先扩展或选匹配栈（Go/TS）</td><td>MS TS 编译器选 Go；Prisma 回归 TS（部署、体积、团队技能）</td><td>为「安全」强行 Rust</td><td>不需要的复杂度拖慢交付</td></tr>
    <tr><td>游戏等大量互引用对象</td><td>谨慎：Rust 迭代慢</td><td>LogLog 三年退场：借用检查器与游戏对象图冲突</td><td>指望 Rust 游戏社区快速出成品</td><td>社区偏引擎讨论而非发布游戏</td></tr>
    <tr><td>现有项目加新能力</td><td>扩展式引入 Rust 模块</td><td>比推倒重来简单，不必重踩老 bug</td><td>一次性全量重写</td><td>最后 5% 对齐成本常被低估 2-3 倍</td></tr>
    <tr><td>二进制体积极敏感</td><td>multi-call + 裁剪策略</td><td>uutils 73MB→14MB 可反超 GNU</td><td>默认静态链接大包直接上线</td><td>panic 信息、泛型单态化、Debug trait 膨胀体积</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】三类重写 vs 典型收益与风险</h3>
  <table>
    <tr><th>维度</th><th>Drop-in 替代</th><th>平行替代品</th><th>自我重写</th><th>一句话结论</th></tr>
    <tr><td>兼容要求</td><td>行为须与原版严格一致</td><td>可改交互与 UX</td><td>旧版本可停止维护</td><td>兼容要求越高，最后 5% 越致命</td></tr>
    <tr><td>性能预期</td><td>有 uutils/PNG 级红利也可能倒退</td><td>bat/lsd 曾暴雷后修复</td><td>取决于架构能否重构</td><td>无「必然更快」定律</td></tr>
    <tr><td>测试策略</td><td>必须复用原版测试套件</td><td>可自定基准但需真实负载</td><td>内部回归 + 渐进迁移</td><td>测试套件是重写是否值的裁判</td></tr>
    <tr><td>代表案例</td><td>uutils、sudo-rs、Youki</td><td>ripgrep、Typst、Polars</td><td>Fish、Codex CLI、Cloudflare</td><td>内核级成功在 Linux/Windows，工具级成败参半</td></tr>
    <tr><td>退场案例</td><td>Hyper→libcurl 95% 放弃</td><td>—</td><td>Prisma、LogLog</td><td>体面退场说明 Rust 非万能解</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】扩展优先、测试先行、认真权衡</h3>
  <p><strong>原则：</strong>RIIR 从来不是非黑即白的选择题，而是一次次需要测试套件、工期、许可证与团队能力一并纳入的工程决策。</p>
  <p><strong>为什么重要：</strong>迷因或许褪色，但重写热情未减；盲目跟风会在 bat 式性能倒退、sudo-rs 式安全疏漏、Hyper 式 95% 烂尾中付出真金白银。</p>
  <p><strong>怎么落地：</strong>① 先确认值得做：团队懂 Rust 或愿学、编译器覆盖目标平台、体积可接受；② 优先扩展而非整体重写；③ 准备扎实测试套件确保行为严格一致；④ 许可证策略提前对齐用户预期。</p>
  <p><strong>适用边界：</strong>非关键、非性能敏感、团队栈不匹配时，Go/TS 等「够用」选择（如微软 TS 编译器）往往是更理性的工程判断，而非怯懦。</p>
  <div class="quote">「这些都是有资金、有资源、认真对待的大项目尚且会犯的错误——写 Rust 不等于自动免疫 bug。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Rust 布道者 / 「内存安全就是未来」派</p>
  <p class="rebuttal-text">Linux 与 Windows 内核已接纳、Android 强制不安全语言退潮——关键软件栈的迁移惯性一旦形成，观望者错过的不是一次重写窗口而是十年招聘与供应链话语权，Prisma 与 LogLog 只是边缘场景的噪音。</p>
</div>

<div class="conclusion">
  <h2>结论与行动</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>RIIR 从 2022 年梗至今热情未减，最大标杆是 Linux/Windows 内核接纳，而非社交媒体口号。</li>
    <li>重写分 Drop-in、平行替代、自我重写三类，性能红利真实存在（uutils sort 4×、PNG 2×）但非必然（bat 慢 60×）。</li>
    <li>隐藏代价包括新 bug、2-3 倍工期膨胀、学习曲线与许可证再谈判；Hyper/Curl、Prisma、LogLog 证明体面退场同样常见。</li>
    <li>multi-call binary 等工程技巧可缓解体积问题，但解决不了行为对齐与测试覆盖。</li>
    <li>是否重写取决于是否关键软件、是否内存不安全、是否有并行与可靠性硬需求——否则需自行权衡。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>评估现有项目：若属关键基础设施且用 C/C++，对照 Android 漏洞数据与内核案例做重写可行性评审。</li>
    <li>动手前确认团队 Rust 能力、目标平台编译器支持、二进制体积预算，工期按官方估计的 2-3 倍预留。</li>
    <li>优先选「用 Rust 扩展新模块」而非全量推倒；若做 Drop-in，立即对接原版测试套件（学 uutils）。</li>
    <li>压测须覆盖管道/非交互等真实路径，避免只盯 benchmark 峰值。</li>
    <li>观看 Rustikon 2026 演讲《Blazingly Fast or Blazingly Hyped?》原文视频，用实测数据校准团队讨论而非梗图。</li>
  </ol>
  <p><strong>关键认知转变：</strong>「用 Rust 重写」不是信仰充值而是工程赌注——真正的分水岭不是语言选择，而是你有没有测试套件、工期纪律和许可证策略来承受最后那 5% 的对齐成本。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
