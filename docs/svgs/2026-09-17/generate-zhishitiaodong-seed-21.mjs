import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'zhishitiaodong-seed-21.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#1e40af}`;

const body = `
<h1>知识跳动：三轮对话搭出的 AI 学习闭环</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Trae IDE</span>
  <span class="tag tag-green">doubao-seed-2.1-pro-0915</span>
  <span class="tag tag-orange">FastAPI + React</span>
  <span class="tag tag-purple">多模态调试</span>
</div>
<p class="subtitle">本文解决的核心问题是：在热点知识更新极快的时代，如何用大白话需求驱动 Trae 与 Seed-2.1-pro-0915，在约三轮迭代内交付带调研、PPT 课件、闯关测验、复盘与扩展推荐的 Web 学习系统「知识跳动」，并验证模型在多轮上下文与截图自检 UI 上的工程能力。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">五步学习法闭环</h3>
  <div class="diagram">
    <div class="node">规划路径</div><span class="arrow-sym">→</span>
    <div class="node">PPT 讲课</div><span class="arrow-sym">→</span>
    <div class="node-green">闯关测验</div><span class="arrow-sym">→</span>
    <div class="node">复盘报告</div><span class="arrow-sym">→</span>
    <div class="node">扩展推荐</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">外加：悬浮问答、多知识库、学习历史断点续学</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「三轮零 Bug」等于模型可替代产品设计与测试。作者仍先手工定义学习闭环与八项能力；模型强在接得住迭代、重构与看图改 UI，需求边界与评测标准仍须人先想清楚。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】知识跳动系统能力边界</h3>
  <p><strong>在讲什么问题：</strong>碎片化学习不成体系、啃书跟不上热点，需要 AI 把「调研—授课—检验—复盘—拓展」串成可重复的产品体验。</p>
  <p><strong>核心机制：</strong>Python FastAPI + LangChain DeepAgents 接火山引擎 API；用户输入主题或上传 PDF/Word/PPT/Markdown 入向量库，生成按天拆分的学习计划与 PPT，答题即时解析，薄弱点驱动联网扩展。</p>
  <p><strong>关键理解：</strong>效果取决于提示词里是否写清角色、技术栈、八大能力与环境变量；第一轮先跑通闭环，后两轮补持久化与前后端分离。</p>
  <p><strong>典型场景：</strong>快速搞懂一个新概念（如 RSI），深度调研模式约十分钟出规划与课件。</p>
  <p><strong>边界说明：</strong>深度调研耗时长；知识准确性依赖模型与检索，复杂体系需分多天计划而非一次讲完。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】三轮 Trae 迭代路径</h3>
  <p><strong>标签：</strong>Vibe Coding · 上下文记忆 · 骨架重构</p>
  <p><strong>操作步骤：</strong>1) 首轮提示词定义「编程专家」角色、FastAPI+DeepAgents+Seed 模型、八大能力与 API 配置 → 2) 第二轮要求学习历史持久化、多命名知识库可选 → 3) 第三轮要求 Vite+React 前后端分离并参考指定站点视觉，强调功能零丢失 → 4) 每轮后人工评测再提增量需求。</p>
  <p><strong>选型条件：</strong>字节 Trae + 火山 doubao-seed-2.1-pro-0915；需自备 API Key 与 base_url。</p>
  <div class="highlight"><strong>落地：</strong>第二轮模型主动处理重启恢复与旧数据兼容——未明说但必要的工程细节可依赖强模型补全。</div>
  <div class="pitfall"><strong>避坑：</strong>第三轮「动骨架」最易改崩功能；应明确要求回归测试全部老能力，作者反馈重构后功能一项未少。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】传统学习 vs 知识跳动</h3>
  <table>
    <tr><th>维度</th><th>找书啃读</th><th>刷短视频</th><th>知识跳动</th><th>一句话</th></tr>
    <tr><td>结构化</td><td>高</td><td>低</td><td>计划+PPT 分页</td><td>兼顾体系与节奏</td></tr>
    <tr><td>反馈速度</td><td>慢</td><td>无检验</td><td>闯关即时解析</td><td>游戏化巩固</td></tr>
    <tr><td>热点同步</td><td>滞后</td><td>快但碎</td><td>联网调研与扩展</td><td>适合追新概念</td></tr>
    <tr><td>人力成本</td><td>个人阅读</td><td>低</td><td>作者称十几分钟等价小团队一日</td><td>工具摊平制作成本</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】多模态 Coding 与产品逻辑</h3>
  <p><strong>坑 1 — 只看日志不看界面：</strong>布局、配色、按钮语义错误代码不报错。Seed-2.1-pro-0915 通过自启服务、浏览器截图、自检 CSS 发现「未生成 PPT 却出现下载按钮」类问题。严重程度：小心。</p>
  <p><strong>坑 2 — 切换主题丢进度：</strong>未持久化学习历史会导致半成品消失；需第二轮显式要求历史与断点续学。严重程度：致命（体验）。</p>
  <p><strong>坑 3 — 单一知识库：</strong>多主题资料混放降低出题质量；应支持命名多库并按题勾选。严重程度：小心。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】元能力比「会不会写代码」更值钱</h3>
  <p><strong>原则：</strong>大模型填平「点子到可用物」之间的编程山，但「学什么、怎么学、如何证明自己学会」的元能力反而更稀缺。</p>
  <p><strong>为什么重要：</strong>获取结构化知识成本骤降后，判断学习路径与复盘质量成为人的主战场。</p>
  <p><strong>怎么落地：</strong>先纸面写清学习闭环再喂模型；用 Trae 分轮交付；开源项目 TangBaron/knowledge-jump 可本地复现评测。</p>
  <p><strong>适用边界：</strong>演示案例偏产品构建叙事，生产环境仍需安全审计、密钥管理与内容合规。</p>
  <div class="quote">原文：工具负责把路铺平、把反馈给足，而真正迈开腿往前走的，永远是你自己。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：计算机基础教育者 · 「先学原理」派</p>
  <p class="rebuttal-text">十几分钟生成的课件和闯关题容易制造「学会错觉」，没有亲手推导和作业批改，元能力再重要也抵不过基础不牢带来的长期幻觉。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>知识跳动将规划、PPT、测验、复盘、扩展、知识库、悬浮问答与历史续学合成八项核心能力。</li>
    <li>Trae + Seed-2.1-pro-0915 经三轮对话完成从 SSR 到 FastAPI+Vite/React 的重构，总耗时约三小时。</li>
    <li>模型亮点在多轮上下文、大白话需求理解，以及「写代码→截图→看图→改代码」的多模态 UI 自检。</li>
    <li>作者立场：工具降低制作成本，学习与判断仍依赖使用者元能力。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>克隆 GitHub 开源仓库本地部署，用自有 API Key 复现一轮主题学习。</li>
    <li>写需求前先画出五步闭环，再一次性列出能力与栈，减少返工轮次。</li>
    <li>重构类需求强制声明「功能不得减少」并逐页验收 PPT/答题/历史。</li>
    <li>对深度调研模式预留十分钟级等待与进度 UI 预期。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「我会不会写代码」转向「我能否把学习体验拆成可验证的闭环并让模型连续交付」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
