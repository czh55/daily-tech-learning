import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'accepted-unimplemented-go-proposals.svg');

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
<h1>Go 语言十年「欠账清单」</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go Proposal</span>
  <span class="tag tag-green">开源治理</span>
  <span class="tag tag-orange">技术债务</span>
  <span class="tag tag-purple">向后兼容</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 golang/go 仓库里挂着 171 个「Proposal-Accepted」却长期未合入的 Issue 时，这些「欠账」究竟欠了多久、欠在哪、为什么「已批准」不等于「即将发布」，以及 Go 用户和贡献者应如何利用这份公开透明的路线图。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Go 提案从共识到落地的生命周期</h3>
  <div class="diagram">
    <div class="node">社区提案<br><span style="font-size:11px;font-weight:400">golang/go Issue</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">公开讨论<br><span style="font-size:11px;font-weight:400">每周例会审阅</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Accepted<br><span style="font-size:11px;font-weight:400">共识达成 ≠ 排期</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">Backlog 107<br><span style="font-size:11px;font-weight:400">无人认领常态</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Go1.27/1.28<br><span style="font-size:11px;font-weight:400">14 个已排期</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">统计基准：2026 年 7 月 · 筛选条件 state:open label:"Proposal-Accepted"</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「提案被 Accepted 就意味着下个版本会实现」——官方定位是 Accepted 后 Issue 从「要不要做」变成「记录实现进度」，但谁来做、何时做取决于核心团队认领或社区 CL；63% 挂在 Backlog，本质是「暂无人力，欢迎社区认领」。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】171 个 Accepted 未实现提案</h3>
  <p><strong>在讲什么问题：</strong>golang/go 仓库有 171 个官方标记为 Accepted 却长期未合入代码的提案，最古老 #5901（encoding/json 自定义 marshal 规则）已积压 13 年。</p>
  <p><strong>核心机制：</strong>Go 提案机制公开透明：任何人可提交，经讨论和每周例会审阅后给出 Accepted/Declined；Accepted 只代表共识达成，实现进度完全公开可查。</p>
  <p><strong>关键理解：</strong>超半数（约 50%）积压 5 年以上不是个案而是常态；越边缘的 x/* 仓库和越依赖社区贡献的 crypto 领域，积压越严重——这不是「Go 团队拖延」的简单叙事，而是共识、排期、兼容性、人力四重约束叠加的结果。</p>
  <p><strong>典型场景：</strong>等待某 Go 新特性时查 Issue 状态；寻找低门槛开源贡献入口；评估语言演进节奏。</p>
  <p><strong>边界说明：</strong>文章基于 2026 年 7 月 GitHub 快照，版本发布时间以官方发布说明为准；未关闭不代表无进展（如寄存器 ABI 已落地但其他架构未完成）。</p>
  <div class="quote">原文：「被批准」不等于「被实现」——但 Go 的特殊之处在于，它的提案库是完全公开、有据可查的，这让我们第一次可以完整地把这堆「技术欠账」翻出来。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Milestone 标签含义对照</h3>
  <table>
    <tr><th>对比维度</th><th>Backlog (107)</th><th>Go1.27/1.28 (14)</th><th>Unreleased (22)</th><th>一句话结论</th></tr>
    <tr><td>排期确定性</td><td>暂无明确排期</td><td>已排入具体大版本</td><td>代码已有未随版发布</td><td>看 Milestone 而非只看 Accepted</td></tr>
    <tr><td>实现状态</td><td>多数无人认领</td><td>短期内会落地</td><td>等发布窗口或决策</td><td>Unreleased 离上线最近</td></tr>
    <tr><td>贡献门槛</td><td>help wanted 可认领</td><td>核心团队主导</td><td>等 GODEBUG 转正</td><td>Backlog 是社区贡献最佳切入点</td></tr>
    <tr><td>典型风险</td><td>可能永远挂着</td><td>可能延期到下一版</td><td>默认行为切换卡产品决策</td><td>ErrInsecurePath 即代码写完卡开关</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】五个经典「钉子户」拆解路径</h3>
  <p><strong>① #12854 类型推断复合字面量（2015）：</strong>279 条评论，已排入 Go 1.28——十年语法改进终于要还的正面案例。</p>
  <p><strong>② #55356 ErrInsecurePath（2022）：</strong>CL 449937 已合入但默认关闭，需 GODEBUG=zipinsecurepath=0 才启用安全检查；Docker 镜像 tar 含绝对路径，贸然默认开启会大面积破坏现有程序。</p>
  <p><strong>③ #26492 go build -static（2018）：</strong>技术难度不大，缺跨平台测试人力；42 条评论全是社区互传魔法参数组合，标签 help wanted 八年无人交作业。</p>
  <p><strong>④ #62244 flaky test Retry（Brad Fitzpatrick）：</strong>FixPending 状态，争论重试语义细节（子测试失败父测试能否重试、是否掩盖数据竞争）导致接受与落地隔着数年。</p>
  <p><strong>⑤ #40724 寄存器传参（292 条评论）：</strong>Go 1.17 已在 amd64/arm64 落地，Issue 未关因 386/MIPS 等架构 ABI 未完成——「未关闭」可能是进展最快的那批。</p>
  <div class="highlight"><strong>实操：</strong>GitHub 搜索 <code>state:open label:"Proposal-Accepted"</code>，按 Milestone 筛选 Go1.27/Go1.28 获取短期确定项；按 label:help wanted 找可认领的低门槛任务。</div>
</div>

<div class="card">
  <h3>【决策/选型表】等待特性 vs 主动贡献</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>等某 Accepted 特性上线</td><td>查 Milestone 是否 Go1.27/1.28</td><td>挂着具体版本号才是短期会落地的那批</td><td>只看 Accepted 标签就等</td><td>中位数横跨好几个大版本，兼容性改动尤甚</td></tr>
    <tr><td>想给 Go 做贡献</td><td>认领 Backlog + help wanted 提案</td><td>共识已达成，比从零提案门槛低得多</td><td>重复提已有 Accepted 提案</td><td>浪费审阅资源，Issue 会指向已有讨论</td></tr>
    <tr><td>评估安全修复是否生效</td><td>查 GODEBUG 开关默认值和版本说明</td><td>代码合入 ≠ 程序里已生效</td><td>假设 Accepted+CL 合并即默认启用</td><td>ErrInsecurePath 默认仍关闭观察兼容性</td></tr>
    <tr><td>静态编译 Docker 镜像</td><td>手写 ldflags 参数组合（暂等 -static）</td><td>#26492 八年未落地，社区方案更可靠</td><td>等 go build -static 官方封装</td><td>help wanted 无人认领，短期无望</td></tr>
    <tr><td>判断 Go 是否在「还账」</td><td>跟踪 Go 1.26/1.27 GODEBUG 清理节奏</td><td>近几个版本明显加快历史开关转正</td><td>用 171 数字断言机制失速</td><td>Go1.27 排 6 个、Go1.28 排 8 个历史遗留</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】解读提案状态的常见误区</h3>
  <p><strong>坑名：</strong>把 Accepted 等同于「即将发布」，上线计划落空后抱怨 Go 团队拖延。</p>
  <p><strong>原因：</strong>Accepted 只记录共识，Backlog 占 63% 是官方诚实的「暂无人力」标注，不是排期承诺。</p>
  <p><strong>解法：</strong>关注 Milestone 标签；Backlog/Unplanned 当愿望清单，Go1.xx 才是短期确定项。</p>
  <p><strong>严重程度：</strong>致命——影响技术选型和版本升级决策。</p>
  <div class="pitfall"><strong>代码已合入 ≠ 行为已变更：</strong>涉及默认行为改变的提案会走 GODEBUG 软着陆，可能挂 NeedsDecision 数年；升级 Go 版本后务必查 release notes 和 GODEBUG 变更。</div>
  <div class="pitfall"><strong>x/* 和 crypto 积压最严重：</strong>31 个 x/* 提案不在核心团队 KPI 内，22 个密码学提案需大量向后兼容评估，别指望这些领域快速落地。</div>
  <div class="pitfall"><strong>Issue 未关闭可能是好事：</strong>大提案拆成几十个 CL 分批合入，寄存器 ABI 已在 Go 1.17 落地但 Issue 因其他架构未完成而开着——用最近评论时间和 CL 状态判断真实进展。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】公开欠账清单的价值</h3>
  <p><strong>原则：</strong>171 看起来触目惊心，但它是公开、透明、随时可验证进度的路线图——闭源语言和框架里完全看不到这份清单。</p>
  <p><strong>为什么重要：</strong>Go 提案机制被认为运行良好，恰恰因为它把「没做完」的事摆在明面上而非悄悄雪藏；对贡献者而言，Accepted+Backlog 是比从零提案低得多的参与门槛。</p>
  <p><strong>怎么落地：</strong>① 等特性先查 Milestone；② 贡献优先认领 help wanted 的 Backlog 项；③ 跟踪 Go 1.27/1.28 release notes 中历史遗留清理；④ 安全相关升级后验证 GODEBUG 默认值。</p>
  <p><strong>适用边界：</strong>统计快照会随 Issue 关闭/重标而变化；涉及具体版本发布时间以 go.dev 官方信息为准。</p>
  <div class="quote">原文：Go 的提案机制之所以被认为运行良好，恰恰是因为它把这些「没做完」的事情摆在明面上，而不是悄悄雪藏。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：追求极速迭代的 Rust/TypeScript 拥趸 / 「开源治理范本」怀疑派</p>
  <p class="rebuttal-text">13 年未实现的 json 自定义 marshal、8 年没人做的 -static 封装，说明 Accepted 标签已成空头支票，公开清单只是把拖延包装成透明。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>171 个 Accepted 未实现提案中，超 50% 积压 5 年以上，63% 挂 Backlog 暂无排期</li>
    <li>欠账最多集中在 x/* 扩展库（31）、cmd/go（22）、crypto（22）等边缘或高审查领域</li>
    <li>「已批准」= 共识达成 + 进度记录，≠ 排期承诺；看 Milestone 比看 Accepted 更准确</li>
    <li>行为变更类提案走 GODEBUG 软着陆，代码合入后可能仍卡产品决策数年</li>
    <li>Go 1.27/1.28 已排入 14 个历史遗留，近版本 GODEBUG 清理节奏明显加快</li>
  </ol>
  <p style="margin-top:16px"><strong>行动清单：</strong></p>
  <ol>
    <li>打开 GitHub 搜索 state:open label:"Proposal-Accepted"，按你关心的包名过滤</li>
    <li>等待的特性：确认 Milestone 是否为 Go1.27/Go1.28，否则按跨版本规划</li>
    <li>想贡献：优先 help wanted 标签的 Backlog 提案（如 go build -static）</li>
    <li>升级 Go 版本后：检查 GODEBUG 变更和安全相关提案的默认开关状态</li>
    <li>跟踪 #12854 等已排期提案，验证 Go 1.28 发布时是否如期落地</li>
  </ol>
  <p style="margin-top:16px"><strong>关键认知转变：</strong>「Accepted 未实现」不是治理失败，而是 Go 把技术债公开化的治理方式——对使用者是路线图，对贡献者是低门槛入口；真正的判断标准不是数字大小，而是 Milestone 排期、CL 活跃度和 GODEBUG 转正节奏是否在加速。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
