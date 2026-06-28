import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'ai-knowledge-base.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:16px 24px;text-align:center;min-width:120px;font-weight:700;font-size:15px;color:#1e40af}
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
<h1>AI 知识库最佳实践：用纯文件系统构建 Agent 可用的知识库</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">知识库</span>
  <span class="tag tag-green">CLAUDE.md</span>
  <span class="tag tag-orange">Agent</span>
  <span class="tag tag-purple">文件系统</span>
</div>
<p class="subtitle">本文解决的核心问题是：在 1000+ 文件规模的 AI 编程工作场景中，如何用纯文件系统加 CLAUDE.md 多级路由替代向量数据库 RAG，让 Agent 在 3 秒内精确定位目标文件，以及 L0-L5 六层路由、8 顶层目录与 CLI 审计的完整搭建与运维方法。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-orange">Agent 需精确定位</div>
    <span class="arrow-sym">→</span>
    <div class="node">L0-L5 路由树</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">触发词匹配</div>
    <span class="arrow-sym">→</span>
    <div class="node">最多 3 跳定位</div>
    <span class="arrow-sym">+</span>
    <div class="node-green">CLI 审计归档</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「2026 年知识库必须上 RAG 向量数据库」—— 原文指出 Agent 知识库特征是结构化高、访问模式确定、精度要求极高；RAG 召回率 80% 在聊天可接受，在 Agent 执行型工作流里是灾难。1000 文件以内文件系统方案精度碾压 RAG。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】CLAUDE.md 多级路由系统</h3>
  <p><strong>在讲什么问题：</strong>如何让 AI Agent 在千级文件知识库中像翻目录一样精确找到目标，而非语义模糊搜索。</p>
  <p><strong>核心机制：</strong>用链式 CLAUDE.md 构建 L0-L5 导航树：L0 身份定义 → L1 全局触发词路由表 → L2-L3 域内索引 → L4-L5 操作指南与执行细节；Agent 从根出发按关键词匹配逐级深入。</p>
  <p><strong>关键理解：</strong>向量数据库像百度给「可能相关」结果；CLAUDE.md 路由像目录告诉你在第几层第几个抽屉，打开就是——确定性 100%。</p>
  <p><strong>典型场景：</strong>多品牌运营、60+ 工作流编排、多 Agent 协同的个人或小团队 AI 编程知识库。</p>
  <p><strong>边界说明：</strong>超过 10000 文件、高度非结构化内容（扫描件、客服对话）、语义模糊查询为主时，应引入 RAG 作为检索兜底。</p>
  <div class="quote">原文：「Claude Code 能在 3 秒内精确定位到任何一个文件，不用向量数据库，不用 RAG 管线。」</div>
  <div class="relation"><strong>与 Karpathy LLM Wiki 的关系：</strong>同源于结构化 Markdown + CLAUDE.md 协议，本方案扩展到 L0-L5 多级路由、CLI 18 命令与三层归档，适合 1000+ 文件生产级场景。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】从零搭建知识库六步流程</h3>
  <p><strong>方法名：</strong>纯文件系统 + CLAUDE.md 路由</p>
  <p><strong>核心思路：</strong>文件即正本，路由即文档，确定性胜过智能——CLI 做审计归档，Agent 管内容填充。</p>
  <p><strong>操作步骤：</strong>1. mkdir 8 个顶层目录（品牌/工作流/工具/业务/研究/规范/生活/收件箱）→ 2. 写根 CLAUDE.md（行为准则+触发词表+直读指引）→ 3. 每个一级目录写 L2 CLAUDE.md → 4. 建规范入口（Markdown/文件/CLAUDE.md 编写规范）→ 5. 配置凭据目录（通用/敏感分离）→ 6. 搭建 CLI 跑 audit structure/docs/redundant。</p>
  <p><strong>选型条件：</strong>文件 1000 以内、结构化程度高、需 git 版本控制与高精度 Agent 路由时选此方案。</p>
  <div class="highlight"><strong>落地建议：</strong>根 CLAUDE.md 行为准则放最前；触发词需唯一性+覆盖性，Agent 走错路由就补触发词；高频路径用直读指引平铺到 L1 跳过中间跳转。</div>
  <div class="pitfall"><strong>避坑：</strong>禁止新建「待处理/临时/待归位」中转桶——会变成垃圾堆；50MB PDF 直接放活跃路径 Agent 读不了，应转 Markdown 后原始文件归档 NAS。</div>
</div>

<div class="card">
  <h3>【决策/选型表】知识库方案选型</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>1000 文件内 Agent 工作流</td><td>文件系统 + CLAUDE.md</td><td>确定性路由近 100% 命中，git 原生版本控制</td><td>纯 RAG</td><td>召回率 70-85%，错文件=错误操作</td></tr>
    <tr><td>海量非结构化文档检索</td><td>RAG + 向量数据库</td><td>语义相似度适合模糊查询</td><td>纯关键词路由</td><td>无法处理「大概记得内容」类查询</td></tr>
    <tr><td>个人笔记整理（数十文件）</td><td>Karpathy LLM Wiki 单层 CLAUDE.md</td><td>轻量够用，LLM 自动整理</td><td>L0-L5 多级路由</td><td>过度工程，维护成本大于收益</td></tr>
    <tr><td>2000+ 文件混合场景</td><td>CLAUDE.md 路由 + CLI 向量索引兜底</td><td>路由主干确定性，检索层补充</td><td>纯向量替代路由</td><td>embedding 黑箱不可调试</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】文件系统路由 vs RAG 向量库</h3>
  <table>
    <tr><th>对比维度</th><th>文件 + CLAUDE.md</th><th>RAG + 向量库</th><th>一句话结论</th></tr>
    <tr><td>精度</td><td>确定性路由，命中率近 100%</td><td>依赖 embedding，召回 70-85%</td><td>Agent 执行场景文件系统胜</td></tr>
    <tr><td>可调试性</td><td>人可直接读 CLAUDE.md 理解逻辑</td><td>embedding 空间不可解释</td><td>出问题能定位到具体路由条目</td></tr>
    <tr><td>维护成本</td><td>人工维护 CLAUDE.md 索引</td><td>维护 embedding pipeline</td><td>小规模人维护更可控</td></tr>
    <tr><td>适用规模</td><td>1-1000 文件（热区 200-300）</td><td>1000-100000+ 文件</td><td>按规模选主干方案</td></tr>
    <tr><td>迁移成本</td><td>复制文件夹即完成</td><td>换模型需重建向量索引</td><td>文件即正本无黑箱</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】知识库治理常见陷阱</h3>
  <div class="pitfall"><strong>坑 1：不知道放哪就新建目录</strong> — 三个月后 20 个模糊目录 Agent 每次纠结。解法：严守 8 顶层归位表，找不到位置说明分类需调整而非加目录。严重程度：致命。</div>
  <div class="pitfall"><strong>坑 2：新增文件忘记更新 CLAUDE.md</strong> — Agent 永远找不到新工作流。解法：修改后必须同步上下游索引，跑 audit docs 自验。严重程度：致命。</div>
  <div class="pitfall"><strong>坑 3：把判断逻辑藏进 CLI</strong> — CLI 是工具不是大脑，「归档到哪里」是 Agent 判断，CLI 只执行 archive 命令。严重程度：小心。</div>
  <div class="pitfall"><strong>坑 4：活跃区文件无限膨胀</strong> — 归档是第一等公民，活跃文件控制在 800 以内，大体量放 NAS。严重程度：小心。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】文件即正本，确定性胜过智能</h3>
  <p><strong>原则：</strong>路由靠 CLAUDE.md 层级结构，检索靠 rg/BM25 兜底；CLI 做确定性审计，Agent 管内容生成。</p>
  <p><strong>为什么重要：</strong>当工具足够简单时，复杂性才不会反噬你——你能看清每一步路由，能用 cat 读每一个文件。</p>
  <div class="quote">原文：「对于个人或小团队的 AI 编程工作场景，纯文件系统 + CLAUDE.md 路由是当前最实用的知识库方案。」</div>
  <p><strong>怎么落地：</strong>人管结构（目录、触发词、CLAUDE.md），Agent 管内容（填充、生成、按工作流执行）；每周结构+文档审计，每月冗余审计。</p>
  <p><strong>适用边界：</strong>语义模糊查询为主、非结构化海量文档场景需混合 RAG。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：RAG 架构师 / 「向量检索是 2026 标配」派</p>
  <p class="rebuttal-text">手动维护 200 多个触发词和 L0-L5 六级 CLAUDE.md，本质是把 embedding 模型的语义理解能力退化成了 brittle 的关键词匹配——Agent 走错了路由你补一个词，规模到 5000 文件时这套人肉索引必然崩溃，而现代 RAG 加 rerank 在结构化文档上召回率已超 95%，维护成本还随文件自动增长而非线性爆炸。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Agent 知识库的核心需求是精确路由而非语义模糊搜索，1000 文件内文件系统方案精度碾压 RAG。</li>
    <li>L0-L5 六级 CLAUDE.md 路由 + 8 顶层目录 + 触发词表，Agent 最多 3 跳定位目标。</li>
    <li>CLI 做确定性审计归档，判断逻辑留给 Agent；归档是第一等公民控制活跃文件量。</li>
    <li>规模化分四阶段：种子期（10-50）→ 成长期（50-200）→ 治理期（200-500）→ 稳态期（500-1000+）。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>今天：建 8 顶层目录 + 写根 CLAUDE.md（行为准则 + 触发词路由表）。</li>
    <li>本周：散落文件归位 + 写 2-3 条核心规范 + Claude Code 对话测试路由是否可达。</li>
    <li>第一月：搭建 CLI（至少 search + archive）+ 建立周审计习惯 + 写第一条工作流验证。</li>
    <li>持续：每次新增文件同步 CLAUDE.md，Agent 走错路由立即补触发词。</li>
  </ol>
  <p><strong>关键认知转变：</strong>知识库不是「最酷的方案」而是「最可控的方案」——向量数据库有科技感，但 cat/rg/git 才是 Agent 工作流真正需要的确定性基础设施。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
