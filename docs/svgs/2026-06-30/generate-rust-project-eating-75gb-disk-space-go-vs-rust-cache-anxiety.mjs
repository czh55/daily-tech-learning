import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'rust-project-eating-75gb-disk-space-go-vs-rust-cache-anxiety.svg');

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
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:130px;font-weight:700;font-size:16px;color:#1e40af}
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
<h1>一个 Rust 项目吃掉 75GB 硬盘？聊聊 Go 与 Rust 的"缓存焦虑"与拯救指南</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Rust</span>
  <span class="tag tag-green">Go</span>
  <span class="tag tag-orange">编译缓存</span>
  <span class="tag tag-purple">工程效率</span>
</div>
<p class="subtitle">本文解决的核心问题是：现代编译器为换取秒级增量编译，为何会把本地硬盘吃到几十甚至上百 GB，以及 Rust 与 Go 在缓存机制上的根本差异和各自可落地的拯救方案。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-orange">编译速度焦虑<br><span style="font-size:13px;font-weight:400">时间成本</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">空间换时间<br><span style="font-size:13px;font-weight:400">缓存膨胀</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Rust target/<br><span style="font-size:13px;font-weight:400">局部孤岛</span></div>
    <span class="arrow-sym">vs</span>
    <div class="node-green">Go GOCACHE<br><span style="font-size:13px;font-weight:400">全局+GC</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">分布式缓存<br><span style="font-size:13px;font-weight:400">sccache/GOCACHEPROG</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「硬盘满了 = 项目配置有问题」—— Reddit 上 75GB target 目录在社区老手眼中属正常范围，真正的问题是默认缓存策略未针对多项目/长期开发优化。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Rust target/ 空间黑洞</h3>
  <p><strong>在讲什么问题：</strong>为什么单个 Rust 工作区能膨胀到 75GB 甚至 1TB？</p>
  <p><strong>核心机制：</strong>Cargo 默认按项目局部管理编译产物，每个项目的 target/ 独立存储依赖编译结果、增量文件和调试符号。</p>
  <p><strong>关键理解：</strong>三重叠加——① 10 个项目各编译一遍 tokio/serde（孤岛效应）；② dev/release/多 Rustc 版本的构件不自动清理（环境矩阵）；③ debug 符号可达二进制 10 倍体积。</p>
  <p><strong>典型场景：</strong>大型 workspace、频繁切换工具链版本、长期增量开发不清理。</p>
  <p><strong>边界说明：</strong>小型单 crate 项目 target 通常可控；问题在「多项目 × 长周期 × 多 profile」组合时爆发。</p>
  <div class="quote">「如果你有 10 个独立的项目都依赖了 tokio 和 serde，那么这 10 个项目会各自在自己的 target/ 目录下把这两个庞然大物重新编译一遍。」</div>
  <div class="relation"><strong>相关概念：</strong>与 Go 全局 pkg/mod + GOCACHE 形成鲜明对比——Go 共享依赖源码，Rust 默认不跨项目共享编译产物。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】Go 全局缓存与自动老化</h3>
  <p><strong>在讲什么问题：</strong>Go 也会吃硬盘，但为何很少出现几百 GB 惨案？</p>
  <p><strong>核心机制：</strong>~/go/pkg/mod 全局共享依赖源码（只增不减）；GOCACHE 存编译后的 .a 文件，并自带 GC——超 5 天未访问的条目自动删除。</p>
  <p><strong>关键理解：</strong>Go 用「全局共享 + 自动老化」平衡空间与时间；Rust 用「局部极致缓存」换取单项目编译速度，代价是磁盘无上限增长。</p>
  <p><strong>典型场景：</strong>多项目共用同一 go.mod 依赖版本时，硬盘只存一份源码。</p>
  <p><strong>边界说明：</strong>pkg/mod 历史版本不会自动清理，长期仍会膨胀；需手动 go clean -modcache。</p>
  <div class="highlight"><strong>落地：</strong>硬盘告急时执行 <code>go clean -cache</code>（清编译缓存）或 <code>go clean -modcache</code>（清依赖源码，需重新下载）。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Rust 缓存拯救三板斧</h3>
  <p><strong>标签：</strong>Rust 多项目开发 / CI 优化</p>
  <p><strong>核心思路：</strong>在「全删重来」和「放任膨胀」之间找精准清理与跨项目共享。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 日常维护：<code>cargo sweep --time 30</code> 删除 30 天未访问的僵尸文件</p>
  <p>2. 跨项目共享：安装 sccache，让多个 Rust 项目共享 tokio 等依赖的编译结果</p>
  <p>3. 架构级：<code>~/.cargo/config.toml</code> 配置全局 <code>build.target-dir</code>，多仓库共用一个大池子</p>
  <p>4. 核弹选项：<code>cargo clean</code> 或 kondo 一键清理 Rust+Node+Go 构建垃圾</p>
  <p><strong>选型条件：</strong>偶尔编译慢选 cargo clean；多项目长期开发选 sccache + 全局 target-dir。</p>
  <div class="pitfall"><strong>避坑：</strong>cargo clean 后下次编译可能耗时几十分钟——爽一时痛一天；旧 Rustc 版本构件用 cargo sweep --installed 精准清理，别一刀切。</div>
  <div class="quote">「cargo-sweep 可以用 cargo sweep --installed 清理旧版本编译器残留；sccache 能在多个不相关 Rust 项目之间共享相同依赖编译结果。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Go GOCACHEPROG 分布式缓存</h3>
  <p><strong>标签：</strong>大型团队 / CI/CD / 微服务</p>
  <p><strong>核心思路：</strong>Go 1.24 稳定的 GOCACHEPROG 协议允许用外部程序接管缓存读写，把编译缓存写到 Redis/S3 而非本地硬盘。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 实现符合 GOCACHEPROG 接口的外部缓存程序</p>
  <p>2. 设置环境变量 GOCACHEPROG 指向该程序</p>
  <p>3. 全公司开发者 + CI 共享同一远程缓存池——一人编译底层库，全员受益</p>
  <p><strong>选型条件：</strong>单机开发用默认 GOCACHE 足够；10+ 人团队或频繁 CI 构建时值得投入。</p>
  <div class="highlight"><strong>落地：</strong>社区已有 gomodfs 等工具用 FUSE 挂载 zip 格式依赖包，避免 pkg/mod 解压带来的 inode 开销。</div>
  <div class="relation"><strong>对比相邻方法：</strong>与 sccache 类似但更深——Go 在语言层面开放协议，Rust 依赖社区工具。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Rust vs Go 缓存机制</h3>
  <table>
    <tr><th>对比维度</th><th>Rust (Cargo)</th><th>Go Modules</th><th>一句话结论</th></tr>
    <tr><td>缓存位置</td><td>项目局部 target/</td><td>全局 ~/go/pkg/mod + GOCACHE</td><td>Rust 孤岛，Go 共享</td></tr>
    <tr><td>依赖复用</td><td>默认不跨项目共享编译产物</td><td>同版本依赖只存一份源码</td><td>Go 多项目更省空间</td></tr>
    <tr><td>自动清理</td><td>无，需 cargo clean/sweep</td><td>GOCACHE 5 天未用自动删</td><td>Go 有内置 GC</td></tr>
    <tr><td>增量编译</td><td>极激进，多 profile 叠加</td><td>全局 .a 缓存</td><td>Rust 增量更吃空间</td></tr>
    <tr><td>分布式方案</td><td>sccache（社区）</td><td>GOCACHEPROG（官方协议）</td><td>Go 官方更前瞻</td></tr>
    <tr><td>典型膨胀</td><td>75GB-1TB target</td><td>少见超百 GB</td><td>Rust 更需要主动治理</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】缓存问题怎么救？</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>Rust 偶尔磁盘满</td><td>cargo clean</td><td>瞬间释放，简单直接</td><td>频繁 clean</td><td>每次全量重编译浪费大量时间</td></tr>
    <tr><td>Rust 多项目长期开发</td><td>sccache + 全局 target-dir</td><td>跨项目复用 + 精准清理</td><td>放任 target 增长</td><td>最终需要买 2TB 硬盘专写 Rust</td></tr>
    <tr><td>Go 本地硬盘告急</td><td>go clean -cache</td><td>安全清空编译缓存</td><td>删 pkg/mod 源码</td><td>需重新联网下载所有依赖</td></tr>
    <tr><td>Go 大团队 CI</td><td>GOCACHEPROG + 远程缓存</td><td>打破单机硬盘桎梏</td><td>每人本地大缓存</td><td>无法共享，重复编译浪费</td></tr>
    <tr><td>全栈多语言项目</td><td>kondo 一键清理</td><td>Rust+Node+Go 递归扫描</td><td>手动逐个清理</td><td>容易遗漏 node_modules 或 target</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】缓存治理常见误区</h3>
  <p><strong>坑名：</strong>把 cargo clean 当日常习惯</p>
  <p><strong>原因：</strong>清完爽一时，下次编译几十分钟进度条——时间成本远超硬盘成本。</p>
  <p><strong>原文说法：</strong>「这属于典型的爽一时，痛一天。」</p>
  <p><strong>解法：</strong>用 cargo-sweep 按时间/版本精准清理，保留热路径缓存。</p>
  <p><strong>严重程度：</strong>小心——不会损坏项目，但严重拖慢开发节奏。</p>
  <div class="pitfall"><strong>另一坑：</strong>忽视 Go pkg/mod 只增不减——历史版本依赖会堆积，需定期 go clean -modcache 或探索 gomodfs 挂载方案。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】空间与时间的永恒博弈</h3>
  <p><strong>原则：</strong>编译器宁愿被骂「硬盘杀手」，也要缓存一切中间状态——程序员时间比 SSD 贵得多。</p>
  <p><strong>为什么重要：</strong>不理解这层博弈就会陷入「删缓存→编译慢→再加缓存→磁盘满」的循环。</p>
  <div class="quote">「编译器是聪明的。它知道程序员的薪水（时间）比固态硬盘要昂贵得多。」</div>
  <p><strong>怎么落地：</strong>建立缓存治理 SOP——定期 du -sh 检查、按场景选精准清理工具、团队级考虑分布式缓存。</p>
  <p><strong>适用边界：</strong>云原生分布式编译成熟后，单机硬盘限制将被打破；当前阶段仍需主动管理。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：极简主义开发者 / 「小项目何必折腾缓存」派</p>
  <p class="rebuttal-text">分布式缓存和全局 target 配置本身也是工程复杂度——对单人小项目，定期 cargo clean 加一块大硬盘，比维护 sccache 集群和 GOCACHEPROG 服务更省总成本。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Rust target/ 局部缓存 + 增量编译 + 调试符号三重叠加，是多项目磁盘膨胀的主因</li>
    <li>Go 用全局共享依赖 + GOCACHE 自动 5 天老化，空间治理更克制</li>
    <li>Rust 自救靠 cargo-sweep、sccache、全局 target-dir；Go 前沿靠 GOCACHEPROG 远程缓存</li>
    <li>cargo clean 是核弹不是日常药；精准清理优于全删重来</li>
    <li>本质是「空间换时间」——治理目标是平衡二者而非消灭缓存</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>终端执行 <code>du -sh target/ ~/.cargo/ ~/go/pkg/mod $(go env GOCACHE)</code> 摸清家底</li>
    <li>Rust 项目安装 cargo-sweep，配置 <code>cargo sweep --time 30</code> 定期任务</li>
    <li>多 Rust 仓库评估 sccache 或全局 build.target-dir</li>
    <li>Go 团队调研 GOCACHEPROG 接入 Redis/S3 共享编译缓存</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「缓存膨胀 = 出 bug 了」转向「缓存膨胀 = 编译器在帮你买时间，需要主动治理而非恐慌删除」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
