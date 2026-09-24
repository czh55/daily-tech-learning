import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'jev-engineering-for-coding-agents.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#eef2ff,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#312e81,#4338ca);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;line-height:1.35}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px;margin-bottom:6px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-indigo{background:#e0e7ff;color:#3730a3}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #6366f1}
.card h3{font-size:22px;font-weight:700;color:#4338ca;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:2px solid #a5b4fc;border-radius:16px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:12px;color:#3730a3}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-green{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-color:#86efac;color:#166534}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#312e81,#4f46e5);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#eef2ff;padding:12px 16px;text-align:left;font-weight:700;color:#4338ca;border-bottom:2px solid #a5b4fc}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf4ff;border:2px solid #a855f7;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#7e22ce;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#9333ea;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#581c87}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>用于编码智能体的 Jev 工程学</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-indigo">Coding Agent</span>
  <span class="tag tag-purple">Jev / TypeSafe</span>
  <span class="tag tag-blue">上下文工程</span>
  <span class="tag tag-orange">KV Cache</span>
</div>
<p class="subtitle">本文解决的核心问题是：当「仅追加式对话 + 全量工具 Schema + 盲目压缩」被 KV 缓存经济学绑架时，编码智能体为何会越路由越贵、越压缩越丢线索；以及如何用专用决策模型 Jev 把上下文从被动累积改成按查询精密装配，并重算路由与工具披露的真实账本。</p>

<div class="map">
  <h3 style="font-size:20px;color:#4338ca;margin-bottom:12px;text-align:center">显式状态语块 → Jev 决策 → 装配上下文 → 前沿/子模型/工具执行</h3>
  <div class="diagram">
    <div class="node">显式类型化<br>状态语块</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Jev<br>隐藏/路由/权限</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">查询感知<br>上下文装配</div>
    <span class="arrow-sym">→</span>
    <div class="node-blue">模型+工具<br>只读管道并发</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「便宜模型路由一定省钱」。笔记用 Opus/Sonnet 标价证明：只要上下文 X 大或执行期读取 Z 远大于输出 Y，<strong>混合路由总成本可高于全程前沿模型</strong>——省的是单价，烧的是重载上下文。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Jev：不写业务代码的决策中枢</h3>
  <p><strong>在讲什么问题：</strong>循环里真正该换的不是「再多一个工具」，而是<strong>每轮向模型投喂什么</strong>。</p>
  <p><strong>关键理解：</strong>Jev 接收结构化状态 + 决策问题，返回<strong>类型化</strong>答案（选项、分值、allow/ask/deny），运行时校验分流，无需解析自然语言。</p>
  <p><strong>和其他概念关系：</strong>前沿模型/子智能体/工具负责执行；Jev 负责「展示哪块语块、用哪条模型、开哪个工具、命令能否跑」——单会话可调用数千次。</p>
  <p><strong>怎么落地：</strong>把「下一轮上下文」拆成可寻址语块（目标、规则、历史操作、检索结果），为每类语块定义 hide/short/long/full 策略与阈值。</p>
  <p><strong>边界：</strong>Jev 不是万能规划器；若状态建模粗糙，类型化输出只会把错误决策自动化。</p>
  <p class="quote">原文：如果智能体仅仅是一个循环，核心杠杆在于每次循环流转时，框架究竟向模型投喂了什么。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】KV 缓存暴政与六大暗病</h3>
  <p><strong>思想实验：</strong>若模型<strong>没有</strong> KV Cache，上下文应是动态装配而非 append-only 聊天记录。</p>
  <p><strong>六大症状：</strong>① 路由失效（交还控制权触发全量重算）② 工具挤占系统提示 ③ 脱离查询的僵化压缩 ④ 子智能体难并行 ⑤ 会话污染只能整体重启 ⑥ 内置功能与窗口容量零和博弈。</p>
  <p><strong>Token 真相：</strong>真实会话里手写代码仅占 4%～10%，<strong>读文件与检索近 60%</strong>——提效突破口在召回与装配，不在多写两行代码。</p>
  <p><strong>落地：</strong>审计自家 Agent 日志，按 read/search/write 分类 token；优先优化检索共享与语块可见性，而非再加 MCP 服务器。</p>
  <p class="highlight">本周动作：统计一轮 bugfix 会话中「重读同一文件/同一 diff」次数，即为缓存暴政的账单。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】累积式上下文 vs 装配式上下文</h3>
  <table>
    <tr><th>对比维度</th><th>Append-only 聊天记录</th><th>Jev 式装配</th><th>一句话</th></tr>
    <tr><td>设计动因</td><td>复用缓存前缀极便宜</td><td>按当前查询选语块粒度</td><td>经济学 vs 信息密度</td></tr>
    <tr><td>压缩时机</td><td>静态摘要，易丢后续线索</td><td>查询感知，hide→full 四级</td><td>压缩应绑定意图</td></tr>
    <tr><td>子任务</td><td>裁剪/合并上下文极难</td><td>独立小切片 + 结构化回传</td><td>并行前提是可合并的状态</td></tr>
    <tr><td>工具箱</td><td>全量 Schema 常驻</td><td>Snippet-first，按需 Schema</td><td>工具多≠能力多</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】元注意力：语块可见性阶梯</h3>
  <p><strong>核心思路：</strong>每轮由 Jev 对语块打分：隐藏 / 简要 / 详细 / 全文，而非一次性压成摘要。</p>
  <p><strong>操作步骤：</strong>1）语块类型化（文件片段、命令输出、规则、检索包）→ 2）绑定当前用户意图 → 3）Jev 选可见级别 → 4）前沿模型只看见装配结果。</p>
  <p><strong>选型条件：</strong>排查复杂 bug、跨文件依赖时升 full；闲聊确认用 short/hide。</p>
  <p><strong>避坑：</strong>把「压缩免疫力」写进 AGENTS.md 且<strong>条件触发</strong>加载，避免规则被摘要吃掉。</p>
  <p class="quote">原文：在下一个问题提出之前就生成的静态摘要，几乎注定会漏掉后续排查所必须的关键线索。</p>
</div>

<div class="card">
  <h3>【决策/选型表】模型路由何时才划算</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>长上下文 + 多轮读盘</td><td>全程前沿或单通道共享检索</td><td>X、Z 大时混合路由 6.19 vs 纯 Opus 4.15（文内算例）</td><td>Opus→Sonnet→Opus 默认链</td><td>下游重载 X + 上游重读 Y+Z</td></tr>
    <tr><td>孤立小任务</td><td>轻量模型 + <strong>定制小上下文</strong></td><td>不丢完整 transcript</td><td>把全历史丢给 Sonnet</td><td>缓存失效 + 重处理</td></tr>
    <tr><td>只读审查/测试/进度站</td><td>后台管道共享一次检索</td><td>检索做一次，多 Agent 只读消费</td><td>每个子 Agent 各搜一遍</td><td>重复 Z，吞噬 60% 类 token</td></tr>
    <tr><td>高敏感路径</td><td>安全路由 + 文件敏感度评分</td><td>权限与 allow/ask/deny 类型化</td><td>仅靠自然语言「请勿删除」</td><td>不可校验、不可审计</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Harness 改造三坑</h3>
  <p><strong>坑 1 — 假路由：</strong>只看单 Token 单价，不算上下文重载与子结果回灌。</p>
  <p class="pitfall"><strong>解法：</strong>用 X/Y/Z 分布做一页 TCO 表，混合路径必须显式计入「Opus 重读 Sonnet 输出」。</p>
  <p><strong>坑 2 — 工具膨胀：</strong>MCP/Schema 堆满系统提示，模型在高基数工具集下选型变差。</p>
  <p class="pitfall"><strong>解法：</strong>渐进披露 + Skill 式短描述；与「Snippet-first, Schema on demand」对齐。</p>
  <p><strong>坑 3 — 假并行：</strong>子智能体各拉一份父上下文，检索与读盘重复 3～5 倍。</p>
  <p class="pitfall"><strong>解法：</strong>只读后台任务挂同一检索快照；写路径仍串行受策略约束。</p>
  <p><strong>严重程度：</strong>坑 1 在长会话中<strong>致命</strong>；坑 2、3 随工具数与团队规模放大。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】杠杆在「投喂什么」，不在 while 循环</h3>
  <p><strong>原则：</strong>编码 Agent 的 while 循环大同小异；差异化在 Harness 是否<strong>显式、类型化、可寻址</strong>地管理状态。</p>
  <p><strong>为什么重要：</strong>官方 First-party Agent 的打包优势可能随 API 计费习惯而缩水；<strong>原生掌控装配</strong>的能力无法插件化到别人循环里。</p>
  <p><strong>怎么落地：</strong>为 Jev 列决策表（上下文/缓存/路由/工具/权限/安全）；每新增功能问「这会常驻系统提示吗？能否条件加载？」</p>
  <p><strong>适用边界：</strong>笔记基于 TypeSafe 设计备忘录，非官方规范；落地需与现有 Cursor/Claude Code 产品形态对齐验证。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「先把 Agent 跑起来」的框架维护者</p>
  <p class="rebuttal-text">为 Jev 再建一层决策模型与类型化状态，工程复杂度与延迟会压过 KV 缓存省下的几毛钱——大多数团队连 transcript 压缩都没做对。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>「无 KV Cache」思想实验揭示：append-only、全量工具、静态压缩是<strong>同一经济学副产品</strong>，不是最佳架构。</li>
    <li>Jev 定位是高频、类型化的 Harness 决策层，把上下文变成查询感知的装配问题。</li>
    <li>路由是否省钱必须计入 X/Y/Z 与重处理；真实会话 token 大头在<strong>读与搜</strong>，不在写代码。</li>
    <li>渐进工具披露、条件规则、只读管道共享检索，是笔记给出的三条可并行落地的工程方向。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>拉一份最近 Coding Agent 会话的 token 分类（读/搜/写/对话），验证 60% 假设是否成立。</li>
    <li>列出系统提示中常驻工具 Schema 占窗口比例，试删一半改按需展开。</li>
    <li>为 bugfix 场景设计语块四级可见性规则（哪类输出必须 full 到下一轮）。</li>
    <li>评估一次「假混合路由」：cheap 模型吃全 transcript 时的总 bill vs 单模型。</li>
    <li>只读任务（lint/test/review）改为共享一次 codebase 检索结果再分叉。</li>
  </ol>
  <p><strong>关键认知转变：</strong>优化 Agent 的主战场从「选更强写代码模型」转向「每轮装配什么上下文、以什么粒度暴露状态」——循环可以抄，Harness 才是护城河。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log(`Wrote ${OUT} (${height}px)`);
