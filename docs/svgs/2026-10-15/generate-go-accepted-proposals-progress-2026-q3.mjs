import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-accepted-proposals-progress-2026-q3.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#eff6ff,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#1e3a8a,#2563eb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-orange{background:#ffedd5;color:#9a3412}.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #2563eb}
.card h3{font-size:22px;font-weight:700;color:#1d4ed8;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#eff6ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#1e40af;border-left:4px solid #3b82f6}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#bfdbfe);border:2px solid #93c5fd;border-radius:16px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#a7f3d0);border-color:#6ee7b7;color:#065f46}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e3a8a,#2563eb);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#1d4ed8;border-bottom:2px solid #cbd5e1}
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
<h1>Go Accepted 提案：三个月复盘与进展标尺</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Proposal-Accepted</span>
  <span class="tag tag-green">开源治理</span>
  <span class="tag tag-purple">Gerrit / CL</span>
  <span class="tag tag-orange">技术债</span>
</div>
<p class="subtitle">本文解决的核心问题是：三个月前曝光的 171 个「已接受未落地」Go 提案，在 2026 年 7–10 月窗口内究竟有多少真实工程进展，以及如何用 L1–L4 标尺区分「Issue 有动静」与「代码已交付」。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1d4ed8;margin-bottom:12px;text-align:center">共识 → 实现 → 合入 → 关闭</h3>
  <div class="diagram">
    <div class="node">Proposal-Accepted<br>方向共识</div>
    <span class="arrow-sym">→</span>
    <div class="node">L1 讨论重启<br>L2 里程碑</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">L3 Gerrit CL<br>可审查实现</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">L4 Issue 关闭<br>版本发布说明</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「开放 Accepted 从 171 变 172，说明没还债」。总数微增可能来自<strong>新接受提案</strong>与<strong>老单未关</strong>并存；是否消化积压要看<strong>老提案 CL/关闭率</strong>与<strong>接受到合入周期</strong>，不能只看单季 Issue 更新数（约 31%）。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】L1–L4 进展标尺</h3>
  <p><strong>在讲什么问题：</strong>GitHub「最近更新」混有评论、标签、自动化，无法代表实现进度。</p>
  <p><strong>关键理解：</strong>L1=重新关注；L2=进入如 Go 1.28 里程碑；L3=出现可核查的 Gerrit CL；L4=实现合入且 Issue 关闭。Go 主流程在 Gerrit，CL 比 Issue 评论更硬。</p>
  <p><strong>和其他概念关系：</strong><code>FixPending</code>、里程碑标签介于 L2–L3，<strong>不等于</strong>已发布。</p>
  <p><strong>怎么落地用：</strong>跟踪关心的提案时，先搜关联 CL，再看里程碑与发布说明。</p>
  <p><strong>边界说明：</strong>标尺不保证线性；方案变更可能从 L3 退回讨论。</p>
  <div class="highlight"><strong>原文数据（至 2026-10-12）：</strong>开放 Accepted 约 172 个；近 90 天约 53 个有更新（约 31%）。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】参与已接受提案的四步</h3>
  <p><strong>核心思路：</strong>Accepted 表示设计方向已有共识，贡献者应补实现、测试、兼容与文档，而非重开设计战。</p>
  <p><strong>操作步骤：</strong>1）读提案与近期讨论，确认设计未变 → 2）在 Gerrit/Issue 查是否已有 CL，避免重复 → 3）看里程碑、<code>FixPending</code>、Backlog 判断阶段 → 4）方案仍模糊时先在 Issue 与维护者对齐再写码。</p>
  <p><strong>选型条件：</strong>想贡献 Go 时，优先选 Accepted 且缺 CL 的项，比从零提案更易聚焦工程。</p>
  <p><strong>避坑：</strong>见 <code>Proposal-Accepted</code> 就开工，可能撞车或违背兼容性要求。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】把「有动静」当「快落地」</h3>
  <p><strong>坑名：</strong>用单季 31% Issue 更新率推断「Go 正在大规模加速还债」。 </p>
  <p><strong>原因：</strong>更新可能仅是标签、里程碑或「Any updates？」，无 CL 无合入。</p>
  <p><strong>解法：</strong>同时盯关闭数、关联 CL 数、老提案年龄分布、接受到合入时长。</p>
  <p><strong>严重程度：</strong>对排期与对外承诺：致命。</p>
  <div class="pitfall"><strong>坑名：</strong>把进入 Go 1.28 里程碑当成特性已可用——#12854 复合字面量类型推断仍取决于评审与语言变更流程。</div>
</div>

<div class="card">
  <h3>【决策/选型表】开发者如何读提案状态</h3>
  <table>
    <tr><th>你看到的状态</th><th>推荐预期</th><th>核心理由</th><th>别做</th><th>为什么不行</th></tr>
    <tr><td>仅 Accepted + Backlog</td><td>长期等待</td><td>无版本承诺</td><td>按下个小版本规划依赖</td><td>可能数年不动</td></tr>
    <tr><td>进入 Go 1.28 等里程碑</td><td>持续跟踪开发分支</td><td>有排期信号</td><td>假设已 GA</td><td>FixPending ≠ 合入</td></tr>
    <tr><td>有关联 CL 在审</td><td>读 CL 与讨论</td><td>L3 可验证</td><td>只看 Issue 标题</td><td>实现细节在 Gerrit</td></tr>
    <tr><td>Issue 已关闭 + 发布说明</td><td>可规划迁移/采用</td><td>L4 闭环</td><td>忽略弃用窗口</td><td>如 h2c 需改依赖</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】三个典型案例（推进方式）</h3>
  <table>
    <tr><th>维度</th><th>#12854 复合字面量推断</th><th>#72039 弃用 h2c</th><th>#64047 execabs 迁移</th><th>一句话</th></tr>
    <tr><td>等待/周期</td><td>约十年（2015 起）</td><td>接受后约半年闭环</td><td>工具链类，进行中</td><td>语法债慢、清理可快</td></tr>
    <tr><td>当前层级</td><td>L2→L3（1.28 + FixPending）</td><td>L4（2026-10-05 关闭）</td><td>L3 待核实 CL</td><td>同清单不同节奏</td></tr>
    <tr><td>用户影响</td><td>未来语法更简</td><td>应迁出 x/net/http2/h2c</td><td>exec 相关 API 演进</td><td>还债含删能力</td></tr>
    <tr><td>证据类型</td><td>里程碑标签</td><td>维护者确认实现完成</td><td>近期 CL 活动</td><td>结论要跟证据</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】Accepted 只代表方向</h3>
  <p><strong>原则：</strong>被接受是社区共识，工程实现、兼容性与维护才是硬仗；技术债靠可维护代码与删除冗余能力偿还，不只靠新特性 headline。</p>
  <p><strong>为什么重要：</strong>误判进展会导致团队错误押注语言特性或拖延迁移（如 h2c）。</p>
  <p><strong>怎么落地：</strong>收藏关心的 Issue；订阅 Gerrit 查询；读 Release Notes 而非只看 Accepted 标签。</p>
  <p><strong>适用边界：</strong>单季数据不足以证明「整体加速」，需多季跟踪关闭率与老单年龄。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「Go 治理失灵」派 / 只看开放 Accepted 总数的人</p>
  <p class="rebuttal-text">若十年语法债能进具体版本计划、弃用包能在数月内闭环，说明机制仍在交付；用单季 Issue 数否定整体，忽略了 Accepted 本就是公开待办而非沉默否决。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>约 31% 开放 Accepted 在近 90 天有更新，但不等于 31% 已实现。</li>
    <li>用 L1–L4 + Gerrit CL 区分信号强度，避免被 GitHub 更新时间误导。</li>
    <li>#12854 进入 Go 1.28 是重磅进展信号，仍非已发布特性。</li>
    <li>#72039 展示「接受 → 实现 → 关闭」的完整还债路径。</li>
    <li>是否整体加速需多指标、多季度验证，当前证据支持「部分推进」而非「全面提速」。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>列出你依赖的开放 Accepted 提案，标注里程碑与 CL 链接。</li>
    <li>检查是否仍使用 <code>golang.org/x/net/http2/h2c</code>，规划迁到标准库能力。</li>
    <li>贡献前在 Gerrit 搜索提案编号，避免重复 CL。</li>
    <li>对外 Roadmap 写「已 Accepted」时改为「已进里程碑/已有 CL」分级表述。</li>
    <li>每季度复算：开放数、关闭数、&gt;5 年老提案占比。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>看 Go 演进应问「它什么时候会变成代码」，而不是「它什么时候被点头同意」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
