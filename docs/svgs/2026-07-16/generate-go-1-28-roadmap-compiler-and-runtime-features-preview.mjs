import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-1-28-roadmap-compiler-and-runtime-features-preview.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
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
<h1>Go 1.28 路线图首度曝光：Cgo 告别 C 工具链？泛型容器将入标准库？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 1.28</span>
  <span class="tag tag-green">编译器/运行时</span>
  <span class="tag tag-orange">SIMD</span>
  <span class="tag tag-purple">泛型容器</span>
</div>
<p class="subtitle">本文解决的核心问题是：基于 Go 编译器与运行时团队 #43930 会议纪要，Go 1.28 候选特性清单究竟指向哪些方向——语言人体工程学、高性能计算与新兴平台、编译器/运行时基础设施三条主线各自包含什么、尚处何种阶段、以及开发者应如何理性看待这份「讨论稿」而非当作已冻结的发布说明。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Go 1.28 规划：三条主线与关键议题</h3>
  <div class="diagram">
    <div class="node">语言/标准库<br><span style="font-size:11px;font-weight:400">复合字面量·Struct Tag·泛型容器</span></div>
    <span class="arrow-sym">+</span>
    <div class="node-orange">高性能/新平台<br><span style="font-size:11px;font-weight:400">SIMD·Wasm栈切换·免C工具链Cgo</span></div>
    <span class="arrow-sym">+</span>
    <div class="node-green">编译器/运行时<br><span style="font-size:11px;font-weight:400">分片计数器·导出数据·Green Tea GC·runtime.free</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">纪要来源：golang/go#43930（2026-07-14 期）——候选清单，非最终特性冻结</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「会议纪要列出的条目 = Go 1.28 一定会交付」——正确理解是：这是团队内部讨论的候选快照，部分条目带问号、多数仍处提案或 GOEXPERIMENT 阶段，需跟踪 issue 状态与 freeze 公告，而非按发布说明规划生产迁移。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Go 1.28 规划的三条主线</h3>
  <p><strong>在讲什么问题：</strong>Go 1.27 收尾后，编译器/运行时团队把下一阶段工作归为三类：让人写得更爽、让 Go 在新场景跑得更快、让工具链在大代码库/多核下更可扩展。</p>
  <p><strong>核心机制：</strong>第一条主线是语言人体工程学（类型推断复合字面量 #12854、结构化 Struct Tag #74472、泛型容器 #60630 等）；第二条瞄准 SIMD/archsimd、Wasm stack-switching、Cgo 预编译产物；第三条聚焦分片计数器 #73667、泛型实例化导出数据 #56718/#79592、Green Tea GC 后续瓶颈、编译器插入 runtime.free #74299。</p>
  <p><strong>关键理解：</strong>纪要经过筛选，略去 Google 内部特定需求；性能仪表盘 randlayout 调整、基准套件刷新等「度量基础」工作决定后续优化能否被准确衡量，虽不直接面向用户却影响整个周期节奏。</p>
  <p><strong>典型场景：</strong>Protobuf 生成类型减少样板代码、高并发计数器避免缓存行争用、交叉编译 Cgo 依赖包、大型泛型 monorepo 构建提速、Wasm 边缘计算性能追赶原生。</p>
  <p><strong>边界说明：</strong>「泛型容器」条目自带问号；SVE 可变长度向量尚无用户级 API 方案；Wasm 栈切换依赖 Wasm 标准落地，短期难见用户可见特性。</p>
  <div class="quote">「Go 1.28 规划条目列表——尚处于讨论阶段的候选特性清单，并不代表最终一定会进入 Go 1.28 正式版。」——Tony Bai 引 #43930 纪要</div>
</div>

<div class="card">
  <h3>【跨概念对比表】三条主线 vs 关注人群</h3>
  <table>
    <tr><th>对比维度</th><th>语言/标准库人体工程</th><th>高性能/新平台</th><th>编译器/运行时基础设施</th></tr>
    <tr><td>代表议题</td><td>复合字面量、Struct Tag、有序 Map/Set</td><td>archsimd/portable simd、Wasm 栈切换、免 C 工具链 Cgo</td><td>分片计数器、导出数据重构、Green Tea GC、runtime.free</td></tr>
    <tr><td>用户可见度</td><td>高——直接改变日常写法与标准库选型</td><td>中——需 GOEXPERIMENT 或等待标准成熟</td><td>低——多数体现为构建更快、GC 更稳、内存更省</td></tr>
    <tr><td>成熟度</td><td>部分提案讨论超十年，Struct Tag 仍 on hold</td><td>archsimd 已 GOEXPERIMENT=simd；Wasm 等标准</td><td>runtime.free 有设计文档；导出数据属硬骨头</td></tr>
    <tr><td>一句话结论</td><td>减少语法噪声与重复造轮子</td><td>缩小与 C++/Rust 在算力与部署场景的差距</td><td>压榨多核与大型泛型代码库的极限性能</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】runtime.free 与 archsimd 实验路径</h3>
  <p><strong>方法名：</strong>编译器主动释放（runtime.freegc）+ 架构相关 SIMD 内建（simd/archsimd）</p>
  <p><strong>核心思路：</strong>编译器在静态证明对象不再使用时插入释放调用，提前归还分配器、减轻 GC 扫描；SIMD 走「低层 archsimd + 高层 portable simd」两层方案，Go 1.26 起 AMD64，1.27 RC 扩至 Wasm/ARM64。</p>
  <p><strong>操作步骤：</strong>① 关注 GOEXPERIMENT=runtimefreegc 与 GOEXPERIMENT=simd 原型；② 大型服务压测对比 GC 停顿与构建产物体积；③ 数据处理热点尝试 archsimd 内建替代手写汇编；④ 跟踪 go.dev/design/74299-runtime-freegc 阈值（默认 16B，或对齐栈分配 32B 阈值）变更。</p>
  <p><strong>选型条件：</strong>短生命周期大对象、GC 扫描压力大时 runtime.free 收益高；需跨平台 SIMD 时优先等 portable simd #78902，单架构极致性能用 archsimd。</p>
  <div class="pitfall"><strong>避坑：</strong>小于阈值的对象主动释放可能得不偿失；archsimd 会阻止异步抢占、不利内联小内核——低层 API 需审慎用于热路径。</div>
  <div class="quote">「如果对象太小，主动释放带来的运行时开销可能反而超过它节省下来的 GC 扫描成本。」——#74299 设计文档</div>
</div>

<div class="card">
  <h3>【决策/选型表】开发者如何跟进各议题</h3>
  <table>
    <tr><th>场景</th><th>推荐关注</th><th>核心理由</th><th>暂不行动</th><th>为什么不行</th></tr>
    <tr><td>Protobuf/长类型名样板代码多</td><td>#12854 类型推断复合字面量</td><td>函数参数可直接写 <code>{A:1,B:2}</code> 省略类型名</td><td>现在就重构全库</td><td>提案未 Accepted，语法可能变</td></tr>
    <tr><td>高并发全局计数/指标</td><td>#73667 M 本地存储 / 分片计数器</td><td>解决 atomic 缓存行争用，官方原语优于 goroutine ID 取模</td><td>自研 sync.Map 包装</td><td>争用模式未根治，API 未稳定</td></tr>
    <tr><td>CI 为 Cgo 装 gcc 很痛苦</td><td>#38917 预编译 Cgo 产物</td><td>下游无 C 工具链也能构建，改善交叉编译</td><td>全面禁用 Cgo</td><td>Gio 等库仍依赖系统原生库</td></tr>
    <tr><td>大型泛型 monorepo 构建慢</td><td>#56718/#79592 导出数据重构</td><td>减少「路过」泛型实例化的重复编译与逃逸分析丢失</td><td>拆包回避泛型</td><td>损失类型安全，不治本</td></tr>
    <tr><td>浏览器/边缘 Wasm 部署</td><td>Wasm stack-switching 提案</td><td>摆脱 br_table 跳转表模拟，性能可从原生 ~20% 大幅提升</td><td>期待 1.28 用户 API</td><td>偏底层基础设施，依赖 Wasm 标准</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】读会议纪要的三条铁律</h3>
  <p><strong>坑名：</strong>把「规划讨论」当「特性承诺」</p>
  <p><strong>原因：</strong>纪要明确是候选清单，「泛型容器」甚至带问号；Struct Tag #74472 标注 on hold。</p>
  <p><strong>原文说法：</strong>「并不代表最终一定会进入 Go 1.28 正式版。」</p>
  <p><strong>解法：</strong>用 golang/go issue 状态 + release note freeze 节点做决策，生产规划至少等到 beta/rc。</p>
  <p><strong>严重程度：</strong>致命——过早押注实验语法导致大规模返工。</p>
  <div class="pitfall"><strong>坑名：</strong>忽视性能仪表盘的 randlayout 噪声——开启随机内存布局能发现虚假性能优势，但也会让基准结果误差区间变宽；团队倾向阶段性开启而非默认全开。</div>
  <div class="pitfall"><strong>坑名：</strong>Green Tea GC 切换后出现轻微回归——浮动垃圾减少会暴露运行时或用户代码中其他瓶颈，属预期排查对象而非算法失败。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】如何跟踪 Go 编译器路线图</h3>
  <p><strong>原则：</strong>跟 issue 状态，不跟标题党——#43930 是透明度窗口，不是产品路线图。</p>
  <p><strong>为什么重要：</strong>十年老提案（#12854）与 on hold 提案（#74472）同列议程，说明「列入讨论」≠「即将合并」。</p>
  <p><strong>怎么落地：</strong>① 订阅 #43930 评论；② 对感兴趣条目 star 对应 proposal issue；③ GOEXPERIMENT 特性在 staging 环境 A/B；④ 大型迁移等 release note 正式收录。</p>
  <p><strong>适用边界：</strong>小团队无需逐条跟进基础设施议题；语言语法与标准库容器类变更需全员知晓。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「Go 已经足够慢热，再堆 SIMD/Cgo/Wasm 是在分散精力，不如先把泛型容器和语法糖落地」</p>
  <p class="rebuttal-text">会议纪要本身把三条主线并列——人体工程学、高性能平台、编译器基础设施同等列入 1.28 议程；大型泛型代码库的重复编译与 GC 可扩展性不解决，语法糖省下的几行代码会被构建时间与停顿吃掉。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Go 1.28 候选特性分三条主线：语言/标准库人体工程、高性能计算与新平台（SIMD/Wasm/Cgo）、编译器/运行时可扩展性（分片计数器、导出数据、Green Tea GC、runtime.free）。</li>
    <li>用户可见亮点包括类型推断复合字面量、结构化 Struct Tag、标准库泛型有序容器、免 C 工具链 Cgo；基础设施侧着力解决泛型跨包重复编译与逃逸分析数据缺失。</li>
    <li>SIMD 走 archsimd + portable simd 两层，Wasm 性能破局依赖 stack-switching 标准；runtime.free 让编译器主动减负 GC。</li>
    <li>性能仪表盘 randlayout 与基准套件刷新是后续优化的度量基础，虽不面向终端用户却决定团队能否准确评估改动。</li>
    <li>整份清单是讨论快照，部分条目带问号或 on hold，须以 freeze 后 release note 为准。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>Star 并 watch golang/go#43930 与感兴趣的 proposal issue（如 #12854、#73667、#38917、#74299）。</li>
    <li>在 staging 环境试用 GOEXPERIMENT=simd 与 runtimefreegc，记录 GC 与构建指标基线。</li>
    <li>高并发计数场景评估现有 atomic 争用，预备迁移到官方分片/M 本地存储 API。</li>
    <li>Cgo 重度项目关注预编译产物方案，减少 CI 对 gcc/clang 的硬依赖。</li>
    <li>大型泛型 monorepo 跟踪 #56718 进展，避免在导出数据修复前盲目拆包。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>Go 1.28 不是「又一轮语法糖」，而是同时在补高性能计算（SIMD/Wasm）、跨平台构建（Cgo）、大型代码库编译效率三条长期短板——会议纪要的价值在于看见团队真实优先级，而非预测发布日期。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
