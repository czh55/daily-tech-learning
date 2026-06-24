import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'hermes-skill-evolution.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.diagram{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:140px;font-weight:700;font-size:16px;color:#1e40af}
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
<h1>Hermes Skill 自我进化系统：让 AI 助手越用越聪明</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Hermes Agent</span>
  <span class="tag tag-green">Skill 系统</span>
  <span class="tag tag-orange">自我进化</span>
  <span class="tag tag-purple">Token 优化</span>
</div>
<p class="subtitle">本文解决的核心问题是：Hermes Agent 如何通过程序性记忆（Skill）实现创建、使用、修补、淘汰的完整自我进化循环，以及开发者应如何利用渐进式披露、Curator 自动维护和 agentskills.io 开放标准构建越用越聪明的 AI 助手。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-orange">复杂任务<br><span style="font-size:13px;font-weight:400">5+ 工具调用</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">skill_manage<br><span style="font-size:13px;font-weight:400">创建 SKILL.md</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">渐进式披露<br><span style="font-size:13px;font-weight:400">L0/L1/L2</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">自动修补<br><span style="font-size:13px;font-weight:400">patch 优先</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Curator<br><span style="font-size:13px;font-weight:400">归档/合并</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Hermes Skills Hub = 提示词市场」—— 每个 Skill 是包含指令、脚本、参考文件和资源的完整能力包，遵循 agentskills.io 开放标准；Skill 文件可跨 Agent 移植，但自主创建和 Curator 维护是 Hermes 独有机制。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】程序性记忆 vs 对话历史</h3>
  <p><strong>在讲什么问题：</strong>Hermes Skill 与 Claude Code Skill、Cursor Rules、OpenAI Custom GPT Actions 的本质区别。</p>
  <p><strong>核心机制：</strong>Skill 记住的不是「发生过什么」，而是「怎么做一件事」—— Agent 从执行过程中自主提炼解法，保存为 SKILL.md，后续自动加载并持续修补。</p>
  <p><strong>关键理解：</strong>Claude Code Skill 需人编写，Cursor Rules 是静态配置；Hermes Skill 是 Agent 自主创建 + 自我改进的程序性记忆。</p>
  <p><strong>典型场景：</strong>多步骤 CI/CD 配置、踩坑后找到的绕路方案、用户纠正后的正确做法、偶然发现的高效工作流。</p>
  <p><strong>边界说明：</strong>简单一次性问答不值得沉淀；需 5+ 工具调用的复杂任务或明确纠错/踩坑才触发创建。</p>
  <div class="quote">「Hermes 的 Skill 是 Agent 的程序性记忆——它记住的不是发生过什么，而是怎么做一件事。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】skill_manage 六操作与四种触发条件</h3>
  <p><strong>标签：</strong>Skill 生命周期管理</p>
  <p><strong>核心思路：</strong>Agent 通过 skill_manage 工具精细管理 Skill，patch 为首选（只传改动省 token）。</p>
  <p><strong>操作步骤：</strong>① 判断触发条件（复杂任务/踩坑纠错/用户纠正/非平凡工作流）；② create 新建 SKILL.md；③ 后续用 patch 针对性修补；④ 大规模调整用 edit；⑤ 补充资源用 write_file；⑥ 废弃用 delete。</p>
  <p><strong>选型条件：</strong>修补首选 patch，整体重构才用 edit，确认无用才 delete。</p>
  <p><strong>避坑：</strong>不是每次对话都创建——只有 Agent 判断值得长期保存才触发。</p>
  <div class="highlight"><strong>落地：</strong>用户纠正 Agent 做法时，Agent 会将正确做法固化为 Skill——这是用户偏好向 Agent 能力的直接转化。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】渐进式披露三级加载</h3>
  <p><strong>在讲什么问题：</strong>155+ Skill 如何不撑爆上下文窗口。</p>
  <p><strong>核心机制：</strong>Level 0 会话启动加载目录索引（约 3000 token）；Level 1 按需 skill_view 加载完整 SKILL.md；Level 2 深度参考加载 references/ 子文件。未使用 Skill 零 token 开销。</p>
  <p><strong>关键理解：</strong>配合 tool_search 将 72 工具 Schema 从 19,210 token 降到 2,200 token（减 89%），两层配合突破上下文限制。</p>
  <p><strong>典型场景：</strong>模型上下文窗口有限但需挂载大量 Skill 和工具的长会话。</p>
  <p><strong>边界说明：</strong>SKILL.md 主体应控制在 500 行/5000 token 内，详细资料放子目录——否则 Level 1 加载成本失控。</p>
  <div class="relation"><strong>相关概念：</strong>与 RAG 向量检索不同——Hermes 用结构化目录 + 按需展开，而非语义相似度召回。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Hermes Skill vs Claude Code Skill vs Cursor Rules</h3>
  <table>
    <tr><th>对比维度</th><th>Hermes Skill</th><th>Claude Code Skill</th><th>Cursor Rules</th><th>一句话结论</th></tr>
    <tr><td>创建方式</td><td>Agent 自主提炼 + 用户指导</td><td>人编写或市场安装</td><td>开发者手动维护</td><td>Hermes 唯一具备自我进化闭环</td></tr>
    <tr><td>记忆类型</td><td>程序性记忆（怎么做）</td><td>标准作业流程</td><td>静态配置规则</td><td>Hermes 记住解法而非对话</td></tr>
    <tr><td>自动维护</td><td>Curator 7 天审查归档</td><td>无自动清理</td><td>无自动清理</td><td>无 Curator 的 Skill 库必然膨胀</td></tr>
    <tr><td>加载策略</td><td>三级渐进式披露</td><td>按需加载</td><td>全量注入</td><td>Hermes 在规模上最优</td></tr>
    <tr><td>格式标准</td><td>agentskills.io 开放标准</td><td>高度兼容</td><td>私有格式</td><td>Skill 文件可跨运行时移植</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】Skill vs Tool 与 Curator 配置</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>封装 CLI 使用流程</td><td>做 Skill</td><td>指令 + Shell + 现有工具即可表达</td><td>做 Tool</td><td>过度工程，维护成本高</td></tr>
    <tr><td>浏览器自动化/API 密钥集成</td><td>做 Tool</td><td>需端到端认证、二进制/流式处理</td><td>做 Skill</td><td>Skill 无法处理复杂集成逻辑</td></tr>
    <tr><td>高频交互用户</td><td>Curator interval 72h、stale 14 天</td><td>缩短清理周期防 Skill 膨胀</td><td>默认 168h/30 天</td><td>几周后近似重复 Skill 污染目录</td></tr>
    <tr><td>关键生产 Skill</td><td>hermes curator pin 锁定</td><td>阻止 Curator 误归档</td><td>依赖默认清理</td><td>30 天未用即标 stale</td></tr>
    <tr><td>社区 Skill 安装</td><td>优先 official/trusted 源</td><td>内置信任 + 安全扫描</td><td>盲目装 community 源</td><td>dangerous 标记可阻止但需人工判断</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Skill 系统常见陷阱</h3>
  <p><strong>坑名：</strong>Skill 库无限膨胀污染上下文。</p>
  <p><strong>原因：</strong>每次解决问题都保存 Skill，几周后大量狭窄近似重复文件堆积。</p>
  <p><strong>原文说法：</strong>用不了几周，大量狭窄的近似重复 Skill 就会污染目录、浪费 token。</p>
  <p><strong>解法：</strong>启用 Curator 自动清理；高频用户缩短 interval_hours 和 stale_after_days。</p>
  <p><strong>严重程度：</strong>致命（Token 成本与延迟爆炸）。</p>
  <div class="pitfall"><strong>另一坑：</strong>用户指导创建的 Skill 被 Curator 误删——实际上 Curator 故意不碰用户指导 Skill，只管理 agent_created 标记的。严重程度：可忽略（设计已隔离）。</div>
  <div class="pitfall"><strong>再一坑：</strong>SKILL.md 写得过大导致 Level 1 加载成本失控。严重程度：小心（违反 500 行/5000 token 约束）。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】自我进化的核心纪律</h3>
  <p><strong>原则：</strong>Skill 是教 Agent 怎么用已有工具做事，Tool 是给 Agent 造一把新工具——先判断再动手。</p>
  <p><strong>为什么重要：</strong>把一切都做成 Tool 会过度工程；把需要 API 集成的能力做成 Skill 会功能残缺。</p>
  <p><strong>原文支撑：</strong>大多数常见场景不需要从零写 Skill——155+ 内置 + 70+ 可选 Skill 覆盖 17 个分类，先搜再用。</p>
  <p><strong>怎么落地：</strong>① hermes skills search 查现有；② 无则 mkdir + SKILL.md 写 YAML 前置声明；③ description 字段决定 Level 0 是否激活；④ 用 patch 而非 edit 维护。</p>
  <p><strong>适用边界：</strong>探索性一次性任务不必沉淀；重复 3 次以上的工作流才值得 Skill 化。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：极简主义 Agent 派 / 「上下文即一切」信奉者</p>
  <p class="rebuttal-text">Skill 自我进化不过是把 Prompt 工程外包给 Agent 自动堆叠——155 个 Skill 即 155 份隐性偏见，Curator 合并归档时必然丢失边缘场景解法；与其维护一套会膨胀的程序性记忆，不如每次用干净上下文 + 强模型推理，自我进化的 Skill 库终将成为不可审计的技术债。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Hermes Skill 是程序性记忆，Agent 自主创建、加载、修补，形成完整进化循环。</li>
    <li>四种触发条件：复杂任务（5+ 工具）、踩坑纠错、用户纠正、非平凡工作流。</li>
    <li>渐进式披露 L0/L1/L2 + tool_search 将上下文开销控制在可接受范围。</li>
    <li>Curator 每 7 天 + 空闲 2 小时后自动清理，用户指导 Skill 受保护。</li>
    <li>agentskills.io 开放标准实现跨 Agent 可移植，9 个安装源 + 四级安全信任体系。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>检查 ~/.hermes/skills/ 目录，评估是否需启用 Curator 或缩短清理间隔。</li>
    <li>对关键生产 Skill 执行 hermes curator pin 锁定防误删。</li>
    <li>写新 Skill 前先 hermes skills search 查 155+ 内置是否有现成方案。</li>
    <li>SKILL.md 的 description 字段精心撰写——它决定 Agent 是否激活该 Skill。</li>
    <li>用 patch 而非 edit 维护已有 Skill，节省 token 并保持变更可追溯。</li>
  </ol>
  <p><strong>关键认知转变：</strong>Skill 不是提示词片段而是可进化的能力包——价值不在「存了多少条规则」，而在「创建→使用→修补→淘汰」循环能否让 Agent 从自己的执行经验中持续提炼，越用越聪明。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
