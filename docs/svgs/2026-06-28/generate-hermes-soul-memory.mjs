import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'hermes-soul-memory.svg');

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
<h1>Hermes SOUL.md 人设工程 + 三层记忆深度解析</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Hermes Agent</span>
  <span class="tag tag-green">SOUL.md</span>
  <span class="tag tag-orange">记忆系统</span>
  <span class="tag tag-purple">人设工程</span>
</div>
<p class="subtitle">本文解决的核心问题是：如何用 SOUL.md、MEMORY.md、USER.md 三层 Markdown 文件在约 1,300 Token 的永久记忆预算内定义 Agent 人格、环境事实与用户画像，并理解冻结快照模式、10 层提示词拼装顺序及 9 种外部记忆提供商的选型边界。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-orange">SOUL.md<br><span style="font-size:13px;font-weight:400">身份层 #1 槽位</span></div>
    <span class="arrow-sym">+</span>
    <div class="node">AGENTS.md<br><span style="font-size:13px;font-weight:400">项目上下文</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">冻结快照<br><span style="font-size:13px;font-weight:400">MEMORY + USER</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">Skills 索引<br><span style="font-size:13px;font-weight:400">按需加载</span></div>
    <span class="arrow-sym">↔</span>
    <div class="node-orange">外部记忆<br><span style="font-size:13px;font-weight:400">9 选 1 并行</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「memory add 写入后 Agent 立刻按新记忆行事」—— Hermes 采用冻结快照模式，会话内系统提示词在启动时拍一次照，中途写入只落盘到文件，要到下次会话才进入提示词；当前轮 Agent 通过工具返回值感知刚写的内容。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】三层记忆文件分工</h3>
  <p><strong>在讲什么问题：</strong>三个 Markdown 文件如何分工承载「永远在场」的记忆预算。</p>
  <p><strong>核心机制：</strong>SOUL.md 占系统提示词 #1 号槽位定义人格语气；MEMORY.md（上限 2,200 字符）存环境事实与项目约定；USER.md（上限 1,375 字符）存用户画像与沟通偏好。三者合计约 1,300 Token，会话启动时冻结注入。</p>
  <p><strong>关键理解：</strong>人设跟 Hermes 实例走（~/.hermes/），不跟项目目录走；项目规范放 AGENTS.md，临时指令放对话消息。</p>
  <p><strong>典型场景：</strong>换项目时 SOUL.md 不变、AGENTS.md 随目录切换；跨会话记住「用户偏好 TypeScript」写入 USER.md。</p>
  <p><strong>边界说明：</strong>内置记忆容量小，只适合核心事实；大规模历史检索靠 session_search 或外部记忆提供商。</p>
  <div class="quote">「SOUL.md 决定 Agent 用什么腔调说话，MEMORY.md 决定 Agent 知道你的电脑装了什么，USER.md 决定 Agent 知道你喜欢简洁还是详细。」</div>
  <div class="relation"><strong>相关概念：</strong>MEMORY 是情景记忆（发生了什么），USER 是语义记忆（你是谁）；与 session_search 的 Tier 2 检索层互补。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】SOUL.md 四段式人设编写</h3>
  <p><strong>标签：</strong>跨项目持久人格 / 系统提示词首位</p>
  <p><strong>核心思路：</strong>只写真正改变默认行为的内容，按 Identity → Style → Avoid → Defaults 四段组织，30 秒能读完。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 判断指令是否「换项目也生效」——是则放 SOUL.md，否则放 AGENTS.md</p>
  <p>2. 用四段式写具体可操作策略（如「遇到坏主意要反驳」「明确说出置信度」）</p>
  <p>3. 可选：hermes plugins install LeventeNagy/soul-forge 用 Soul Forge 可视化生成</p>
  <p>4. 保存到 ~/.hermes/SOUL.md，经安全扫描后下次会话生效</p>
  <p><strong>选型条件：</strong>需要临时角色切换用 /personality 预设（14 种内置），退出即恢复 SOUL.md 基线。</p>
  <div class="pitfall"><strong>避坑：</strong>不要把项目路径、仓库规范、一次性任务写进 SOUL.md；超过 20,000 字符会被截断；含提示词注入或凭据会被 scan 阻止。</div>
  <div class="highlight"><strong>落地：</strong>写完后开新会话验证语气；用 /personality 对比临时模式与 SOUL 基线差异。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】SOUL.md vs /personality vs AGENTS.md</h3>
  <table>
    <tr><th>对比维度</th><th>SOUL.md</th><th>/personality 预设</th><th>AGENTS.md</th></tr>
    <tr><td>定位</td><td>持久基线人格</td><td>会话级临时模式</td><td>项目级上下文</td></tr>
    <tr><td>生命周期</td><td>跨所有会话</td><td>退出即消失</td><td>进入目录时加载</td></tr>
    <tr><td>优先级</td><td>系统提示词 #1</td><td>覆盖 SOUL.md</td><td>上下文层（低于身份）</td></tr>
    <tr><td>适合内容</td><td>语气、风格、默认行为</td><td>海盗/侦探等角色扮演</td><td>代码规范、架构、路径</td></tr>
    <tr><td>存储位置</td><td>~/.hermes/SOUL.md</td><td>内存 / config 预设</td><td>项目目录</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】内置记忆 vs 外部记忆提供商</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>核心偏好与机器环境</td><td>内置 MEMORY + USER</td><td>~1,300 Token 永久在场、零配置</td><td>全塞外部提供商</td><td>丢失简洁性与启动速度</td></tr>
    <tr><td>跨会话用户建模</td><td>Honcho（方言式推理）</td><td>双层上下文 + 用户/AI 表示卡</td><td>仅靠 MEMORY 堆条目</td><td>2,200 字符很快满</td></tr>
    <tr><td>查找历史对话细节</td><td>session_search（FTS5）</td><td>无限容量、按需 ~20ms 查询</td><td>把日志写入 MEMORY</td><td>挤占永久预算、违反条目规范</td></tr>
    <tr><td>大规模结构化事实</td><td>Mem0 / Zep 等外部商</td><td>与内置并行、单提供商激活</td><td>同时开多个外部商</td><td>Hermes 约束同时只能一个</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】记忆写入与容量管理</h3>
  <p><strong>坑名：</strong>会话中途写入记忆却期望系统提示词立刻变化</p>
  <p><strong>原因：</strong>冻结快照为提示词缓存优化，会话内系统提示词不变</p>
  <p><strong>原文说法：</strong>「当 Agent 通过 memory add 写入新条目时，更改持久化到磁盘，但不影响当前已构建的系统提示词。」</p>
  <p><strong>解法：</strong>关键事实写入后开新会话；或依赖工具返回值让 Agent 当轮感知</p>
  <p><strong>严重程度：</strong>小心（行为符合设计但易误解）</p>
  <div class="pitfall"><strong>坑名：</strong>MEMORY 超 80% 仍盲目 add → 返回满容量错误<br><strong>解法：</strong>先 merge 冗余条目或 remove 过时项；条目要紧凑信息密集，禁存代码块与易重发现事实<br><strong>严重程度：</strong>致命（工具直接失败）</div>
</div>

<div class="card">
  <h3>【心法/原则卡】冻结快照是为成本与一致性</h3>
  <p><strong>原则：</strong>记忆「拍快照」不是偷懒，是为提示词缓存命中、Token 成本降低约 75% 与会话内行为一致。</p>
  <p><strong>为什么重要：</strong>实时更新会让每轮系统提示词变化、缓存失效、全价重处理。</p>
  <p><strong>原文支撑：</strong>10 层拼装将 SOUL/工具指引放稳定层，MEMORY/USER 快照放易变层但会话内冻结。</p>
  <p><strong>怎么落地：</strong>调试人设改 SOUL.md 后开新会话；调 MEMORY 看容量头 80% 预警；项目规范写 AGENTS.md 而非重复存入 MEMORY。</p>
  <p><strong>适用边界：</strong>需要「写入立刻改变全局行为」的场景应改 SOUL/AGENTS 或结束当前会话，而非指望中途快照刷新。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：极简主义 Agent 架构师 / 「上下文即一切」派</p>
  <p class="rebuttal-text">你把 1,300 Token 的三文件记忆包装成生产级人设工程，却故意冻结快照、拒绝会话内实时注入——在需要即时纠正 Agent 行为的 Pair Programming 场景里，用户每写一条 memory 都要重开会话，这套「缓存优先」设计把工程便利当成了交互体验的代价。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>SOUL.md 占 #1 槽位定义跨项目人格；MEMORY/USER 合计约 1,300 Token 承载事实与画像</li>
    <li>冻结快照：会话启动拍一次照，中途 memory 写入落盘但不改已构建提示词</li>
    <li>10 层拼装分稳定层、上下文层、易变层，利于缓存与调试</li>
    <li>外部记忆 9 选 1 与内置并行；历史细节用 session_search FTS5</li>
    <li>SOUL 写语气边界，AGENTS 写项目规范，/personality 做临时角色</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>按四段式起草 ~/.hermes/SOUL.md，剔除项目路径与一次性指令</li>
    <li>用 memory add 写入 3-5 条紧凑环境事实，观察容量百分比</li>
    <li>在项目根建 AGENTS.md 放代码规范，验证切换目录时 SOUL 不变</li>
    <li>容量超 80% 时 merge/remove 后再 add</li>
    <li>需要大规模记忆时评估 Honcho 或 Mem0，确认只激活一个外部商</li>
  </ol>
  <p><strong>关键认知转变：</strong>记忆不是「实时数据库」而是「会话启动时的提示词配料」——理解冻结快照才能正确预期 memory 工具的生效时机。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
