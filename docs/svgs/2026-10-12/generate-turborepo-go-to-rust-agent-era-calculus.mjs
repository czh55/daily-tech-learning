import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'turborepo-go-to-rust-agent-era-calculus.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#fff7ed,#ffedd5);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#9a3412,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-orange{background:#ffedd5;color:#9a3412}.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#9a3412;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fff7ed;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#9a3412;border-left:4px solid #ea580c}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ffedd5,#fed7aa);border:2px solid #fdba74;border-radius:16px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#9a3412}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#9a3412,#ea580c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#9a3412;border-bottom:2px solid #cbd5e1}
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
<h1>Turborepo Go→Rust：ROI 争议与 Agent 时代重算账本</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">Vercel / Turborepo</span>
  <span class="tag tag-blue">语言迁移</span>
  <span class="tag tag-green">增量移植</span>
  <span class="tag tag-purple">AI Agent</span>
</div>
<p class="subtitle">本文解决的核心问题是：在用户机器上跑的构建工具，为何在 Go 仍快且好写的前提下仍要迁到 Rust，以及当「人类手写迁移成本」被 Agent 海啸改写后，团队应如何重估语言选型的 ROI 与终点假设。</p>

<div class="map">
  <h3 style="font-size:20px;color:#9a3412;margin-bottom:12px;text-align:center">迁移主线：动机 → 策略 → 踩坑 → 复盘</h3>
  <div class="diagram">
    <div class="node">2023 选型错位<br>数据中心 vs 用户 OS</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">增量移植<br>global turbo 破冰</div>
    <span class="arrow-sym">→</span>
    <div class="node-blue">双二进制<br>JSON FFI</div>
    <span class="arrow-sym">→</span>
    <div class="node">2026 Rauch<br>ROI 仍有争议</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「跟风 Rust / 嫌 Go 慢」。Vercel 当年选 Go 是追随 esbuild、追求迭代速度；迁 Rust 是因为<strong>设计优先级</strong>（简洁 vs 编译期正确性）与「装在用户机器上的软件」风险模型不匹配，而非单纯 benchmark。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Go 与 Rust 在 Turbo 场景为何「优先级错位」</h3>
  <p><strong>在讲什么问题：</strong>数据中心服务 vs 用户侧 CLI/构建工具，对错误的容忍度完全不同。</p>
  <p><strong>关键理解：</strong>Go 擅长 goroutine 网络服务、Context、可回滚部署；偏好简洁导致部分错误延后到运行时。Rust 用 <code>cfg</code> 等在编译期拒绝跨平台幻觉（如 Unix 权限在 Windows 上「设了也没用」）。</p>
  <p><strong>和其他概念关系：</strong>与 CGO 引入 zstd 等原生库后「全局工具链污染」、Turbopack 合并后重复造轮子，共同推高迁移压力。</p>
  <p><strong>怎么落地用：</strong>评估产品是否「用户机器一等公民」：若是，把「编译期可证明的不变量」写进选型权重，而非只看团队 Go 熟练度。</p>
  <p><strong>边界说明：</strong>纯内部服务、快速试错原型仍可能 Go 更优；本文论点针对强 OS/分发/正确性约束的开发者工具链。</p>
  <div class="quote">Rauch：迁移完成，但 ROI 在公司内部「相当有争议」——决策落地不等于账本闭合。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】增量移植而非推倒重写</h3>
  <p><strong>核心思路：</strong>用全新小功能（global turbo）先打通 Rust 工具链，再逐模块迁移 CLI 解析等，避免「大爆炸」重写。</p>
  <p><strong>操作步骤：</strong>1）v1.7 起发布 Go+Rust 混合版 → 2）新功能 Rust 先行 → 3）旧模块按边界切片迁移 → 4）跨平台问题暴露后再调整架构（双二进制）。</p>
  <p><strong>选型条件：</strong>大型存量 CLI、不能停服迭代时选增量；绿地且团队 Rust 成熟可考虑一次性重写（Turbo 未选此路）。</p>
  <p><strong>避坑：</strong>不要假设单二进制永远可行——Windows UNC 路径、Alpine musl/glibc 差异会逼出进程边界。</p>
  <div class="highlight"><strong>落地：</strong>迁移里程碑用「可发布混合版本」验收，而不是「Rust 行数占比」 KPI。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】跨平台与 CGO 的隐性税</h3>
  <p><strong>坑名：</strong>Windows 工具链 + UNC 路径、Alpine 上 glibc/musl 混用导致发布地狱。</p>
  <p><strong>原因：</strong>单一 Go 二进制假设在「全平台开发者笔记本」上不成立；CGO 让「纯 Go」幻想破灭。</p>
  <p><strong>解法：</strong>拆成 Go 与 Rust 两个二进制，用 JSON 传参做边界——牺牲进程内 FFI 简洁，换可预测发布矩阵。</p>
  <p><strong>严重程度：</strong>致命（若不拆，会在长尾平台拖死发布节奏）。</p>
  <div class="pitfall"><strong>坑名：</strong>用 Go 的跨平台 API 掩盖语义空洞（文件权限即典型）。Rust 逼你显式平台分支，前期更痛，交付前更少「静默错误」。</div>
</div>

<div class="card">
  <h3>【决策/选型表】何时值得从 Go 迁到 Rust（工具链视角）</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>用户本机 CLI / 构建器</td><td>倾向 Rust（或 C++ 等系统语言）</td><td>编译期平台约束、OS 语义真实</td><td>仅因「Rust 时髦」</td><td>人类迁移税可能吞掉收益（Vercel 已承认 ROI 争议）</td></tr>
    <tr><td>内部 API / 快速迭代服务</td><td>保留 Go</td><td>回滚成本低、团队速度</td><td>为「统一语言」强行迁</td><td>错位优先级，迭代优势被抹平</td></tr>
    <tr><td>重 CGO / 原生压缩库</td><td>评估 Rust 或隔离子进程</td><td>CGO 破坏纯 Go 工具链假设</td><td>继续堆 CGO 不加边界</td><td>发布与调试成本指数上升</td></tr>
    <tr><td>Agent 可写大部分移植代码</td><td>重算 ROI 公式</td><td>「对人类最好」≠「对业务最好」</td><td>假设 Rust 是终点</td><td>Rauch 明示更绿的牧场可能在 Agent 原生工具链</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】数据中心 Go vs 用户侧 Rust vs Agent 时代变量</h3>
  <table>
    <tr><th>维度</th><th>Go（Turbo 早期）</th><th>Rust（迁移后）</th><th>Agent 时代</th><th>一句话</th></tr>
    <tr><td>错误发现时机</td><td>运行时 + 回滚</td><td>编译期 + 平台 cfg</td><td>生成代码可批量移植</td><td>「快写」与「少静默错」权衡位移</td></tr>
    <tr><td>迭代成本</td><td>低</td><td>高（人类）</td><td>迁移成本曲线可能下移</td><td>ROI 争议可能随 Agent 缓解或加剧（质量债）</td></tr>
    <tr><td>分发形态</td><td>单二进制理想</td><td>常需多二进制协作</td><td>工具链可能非 Rust 终点</td><td>架构比口号重要</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】「计算公式变了」怎么落到团队决策</h3>
  <p><strong>原则：</strong>语言迁移的账本 = 正确性收益 + 发布可预测性 − 人类迁移税 ± Agent 自动化折扣。</p>
  <p><strong>怎么落地：</strong>复盘时同时记录「已完成」与「争议点」；新迁移用增量切片 + 可观测跨平台矩阵，而非信仰驱动。</p>
  <p><strong>适用边界：</strong>小团队无发布矩阵痛苦时，不必复制 Vercel 路径；CEO 公开争议本身说明没有银弹答案。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Go 基础设施派 / 「ROI 争议就是迁错了」</p>
  <p class="rebuttal-text">双二进制加 JSON 传参把工程复杂度外溢到运维与调试，若 Agent 写 Rust 一样会堆 unsafe 与平台分支，只是把「运行时 panic」换成「编译不过」的另一种债。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Turborepo 迁 Rust 源于「用户机器软件」与 Go 设计优先级错位，叠加 CGO 与 Turbopack 合并现实。</li>
    <li>策略是增量移植，跨平台踩坑后以双二进制 + JSON 边界收束。</li>
    <li>2026 年 CEO 复盘：迁移完成但 ROI 内部仍有争议，且 Rust 未必是终极工具链。</li>
    <li>Agent 时代应重算「对人类最好」与「对业务最好」，而非复制 2023 年的恐惧或狂热。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>列出产品是否「用户本机一等公民」，据此加权编译期约束 vs 迭代速度。</li>
    <li>若已用 CGO，审计发布矩阵与 Alpine/Windows 长尾案例。</li>
    <li>大迁移采用可发布混合版本里程碑，避免大爆炸重写。</li>
    <li>在 PR/复盘模板中显式记录 ROI 争议点，供下一轮 Agent 辅助移植评估。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>语言选型不是「谁更快」的擂台，而是<strong>错误在何时爆炸、由谁承担</strong>的合约；当写代码的主体从人变成 Agent，这份合约的条款需要整条重写。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
