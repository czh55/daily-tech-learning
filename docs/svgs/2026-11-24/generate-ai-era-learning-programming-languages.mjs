import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'ai-era-learning-programming-languages.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#1a1028,#241a35);padding:48px 60px;color:#e2e8f0}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#f472b6,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-ai{background:#4c1d95;color:#ddd6fe}.tag-learn{background:#831843;color:#fbcfe8}.tag-rust{background:#1e293b;color:#94a3b8}
.card{background:#1e293b;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.35);border-left:5px solid #a78bfa}
.card h3{font-size:22px;font-weight:700;color:#c4b5fd;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#cbd5e1;margin-bottom:10px}
.map{background:#0f172a;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.4);border:1px solid #334155}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:16px 0}
.node{background:linear-gradient(135deg,#4c1d95,#5b21b6);border:2px solid #a78bfa;border-radius:14px;padding:12px 16px;text-align:center;min-width:88px;font-weight:700;font-size:12px;color:#ede9fe}
.node-em{background:linear-gradient(135deg,#831843,#9d174d);border-color:#f472b6;color:#fce7f3}
.arrow-sym{font-size:14px;color:#64748b}
.conclusion{background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#4c1d95;padding:10px 12px;text-align:left;font-weight:700;color:#ddd6fe;border-bottom:2px solid #a78bfa}
td{padding:10px 12px;border-bottom:1px solid #334155;color:#cbd5e1;vertical-align:top}
.correction{background:#422006;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#fcd34d;margin-bottom:8px}
.rebuttal{background:#1e1b4b;border:2px solid #818cf8;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#c7d2fe;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#a5b4fc;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#ede9fe}
.subtitle{font-size:17px;color:#94a3b8;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>AI 时代的新语言学习悖论</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-ai">AI 编程</span>
  <span class="tag tag-learn">认知科学</span>
  <span class="tag tag-rust">会用/看懂/能写</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 AI 让拿到一门新语言的代码变得极廉价时，为什么「传统意义上的学会」（不依赖 AI 从空白文件独立设计、编写、调试）反而可能更难；以及程序员应如何把 AI 当教练而非替身，保住看懂与能写的上限。</p>

<div class="map">
  <h3 style="font-size:20px;color:#c4b5fd;margin-bottom:12px;text-align:center">能力路径与 AI 的打断点</h3>
  <div class="diagram">
    <div class="node">需求描述</div><span class="arrow-sym">→</span>
    <div class="node-em">会用（AI 代劳）</div><span class="arrow-sym">⇢</span>
    <div class="node">看懂代码</div><span class="arrow-sym">⇢</span>
    <div class="node-em">能写（古法）</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#94a3b8;margin-top:12px">过去：语法→类型→执行 与能力同步形成；今天：可先获得结果再补认知，第三层不会自动出现。</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#fde68a;font-size:16px">误解：会用 AI 生成项目 = 已掌握语言。作者标准是从空白目录独立实现、遇编译错误能自己定位——关 AI 后能否做到才是试金石。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】会用 / 看懂 / 能写</h3>
  <p><strong>在讲什么：</strong>三层编程语言能力，AI 最容易推高第一层。</p>
  <p><strong>关键理解：</strong>会用=描述需求+跑通项目；看懂=追踪控制流与抽象；能写=内化直觉与肌肉记忆。</p>
  <p><strong>关系：</strong>层与层不自动进阶；AI 可助第一层、部分第二层，第三层需刻意练习。</p>
  <p><strong>落地：</strong>用「关 AI + 空白文件写小程序」定期自测处于哪一层。</p>
  <p><strong>边界：</strong>若业务只需验收 AI 产出，第一层可能够用；但无法独立审代码则难掌控生产力。</p>
  <p><strong>原文：</strong>「三个层次之间并不存在必然的自动进阶关系。」</p>
</div>

<div class="card">
  <h3>【跨概念对比表】AI 学习 vs 传统学习</h3>
  <table>
    <tr><th>维度</th><th>传统手写路径</th><th>重度依赖 AI</th><th>结论</th></tr>
    <tr><td>认知参与</td><td>试错→编译反馈→建模</td><td>外包修复与解释</td><td>生成效应需主动生成才有记忆</td></tr>
    <tr><td>编译错误</td><td>教学信号（尤其 Rust）</td><td>直接让 AI 改</td><td>跳过则缺少心智模型搭建</td></tr>
    <tr><td>读代码</td><td>查文档+上下文推导</td><td>一键解释，流畅易错觉</td><td>听懂解释≠自己分析过</td></tr>
    <tr><td>角色</td><td>语言直接表达思想</td><td>自然语言描述意图</td><td>语言从思维工具滑向 AI 实现工具</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】生成效应与认知负荷</h3>
  <p><strong>原则：</strong>主动生成、回忆和组织信息比被动读 AI 答案更利长期记忆。</p>
  <p><strong>反面：</strong>所有困难被 AI 预先消除→认知参与不足，学不到东西。</p>
  <p><strong>落地：</strong>新知识点先自己写（哪怕编译不过）再请 AI 查漏补缺；错误先读懂再要提示而非代修。</p>
  <p><strong>边界：</strong>生产环境可让 AI 写代码，但学习场景要保留「过脑」环节。</p>
  <p><strong>原文：</strong>「当 AI 替我们完成了所有需要主动思考、尝试和犯错的环节，我们究竟还学到了什么？」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】AI 时代学新语言四原则</h3>
  <p><strong>① 先尝试再求助：</strong>不第一时间要完整项目。</p>
  <p><strong>② 不急着消灭编译错误：</strong>理解原因后再要提示。</p>
  <p><strong>③ 读真实开源：</strong>权衡与历史兼容比 AI 规整示例更接近工程。</p>
  <p><strong>④ 定期无 AI 练习：</strong>CLI/HTTP/数据结构小项目自检。</p>
  <p><strong>教练模式：</strong>让 AI 出题、审查、模拟严师，避免代写全部练习。</p>
  <p><strong>目标重划：</strong>未必人人成专家，但至少独立看懂并判断 AI 代码是否合理。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】AI 辅助学习的陷阱</h3>
  <p><strong>流畅解释错觉：</strong>AI 条理清晰的翻译让你以为已读懂 Rust 生命周期与 Trait 系统。</p>
  <p><strong>读代码耐心丧失：</strong>遇陌生语法即外包，长期削弱工程师核心能力。</p>
  <p><strong>生产力≠能力：</strong>更快交付不自动把经验搬进大脑。</p>
  <p><strong>萨丕尔-沃尔夫延伸：</strong>以自然语言+AI 为主路径，思维习惯与「语言使用者」不同。</p>
  <p><strong>严重程度：</strong>无法独立审代码 = 对 AI 产出失控，属长期职业风险。</p>
</div>

<div class="card">
  <h3>【决策/选型表】学习场景怎么用 AI</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>避免</th></tr>
    <tr><td>学新概念</td><td>手写再对比 AI 方案</td><td>直接生成完整模块</td></tr>
    <tr><td>遇编译错误</td><td>先读错误信息自推</td><td>整段粘贴「帮修」</td></tr>
    <tr><td>读陌生开源</td><td>自己划类型/调用链再核对</td><td>只读 AI 摘要不下场</td></tr>
    <tr><td>生产交付</td><td>AI 生成 + 人审架构与安全</td><td>无「看懂」能力纯验收</td></tr>
    <tr><td>能力体检</td><td>每月无 AI 日写可运行小程序</td><td>只用「会用」层撑业绩</td></tr>
  </table>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「生产力优先派」——既然 AI 已能 100% 生成，学语法是浪费，程序员应全转需求与验收。</p>
  <p class="rebuttal-text">不会独立看懂与推理的实现，就无法判断安全边界、性能陷阱与架构债，验收员比肩上的「需求描述者」更容易被错误代码与幻觉拖着走。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>AI 降低获码门槛，却可能打断「同步形成」的能力路径。</li>
    <li>会用、看懂、能写须刻意分层培养，第三层无捷径。</li>
    <li>手写与编译错误是学习资产；读真项目是看懂的上策。</li>
    <li>角色正从语言使用者滑向需求描述者，中间层变厚。</li>
    <li>目标可调整为至少能看懂并评判 AI 代码。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>为本月设一次「无 AI 日」完成小功能并记录卡点。</li>
    <li>学新语言时先实现最小可编译版本再展开 AI 协作。</li>
    <li>读经典开源（非 AI 生成示例）并自画模块图。</li>
    <li>遇 Rust/复杂类型：禁止第一步就「解释这段代码」。</li>
    <li>用关 AI+空白文件自检是否达到「能写」底线。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「AI 让我更会一门语言」到「AI 可能让我只会使用语言结果」——生产力暴涨时更要守住独立思考与看懂代码的能力。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);