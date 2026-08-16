import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'taxi-drivers-alzheimers-rust-mental-map.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfdf5,#dbeafe);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#065f46,#1e40af);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-green{background:#d1fae5;color:#065f46}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #059669}
.card h3{font-size:22px;font-weight:700;color:#065f46;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#ecfdf5;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#065f46;border-left:4px solid #10b981}
.card .relation{background:#eff6ff;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#1e40af}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #6ee7b7;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#065f46}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#065f46,#1e40af);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#ecfdf5;padding:12px 16px;text-align:left;font-weight:700;color:#065f46;border-bottom:2px solid #6ee7b7}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>出租车司机极少得阿尔兹海默症，那手写 Rust 代码的程序员呢？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">流行病学</span>
  <span class="tag tag-blue">认知储备</span>
  <span class="tag tag-orange">Rust 所有权</span>
  <span class="tag tag-purple">心智地图</span>
  <span class="tag tag-red">脑洞推演</span>
</div>
<p class="subtitle">本文解决的核心问题是：900 万份美国死亡证明显示出租车司机阿尔兹海默症死亡率最低，关键不在「开车」而在持续更新脑内空间地图——Tony Bai 由此推演手写 Rust 时维护所有权/借用/生命周期关系图是否也算同类认知锻炼，并诚实拆解类比哪里站得住、哪里只是尚未验证的思想实验。</p>

<div class="map">
  <h3 style="font-size:20px;color:#065f46;margin-bottom:12px;text-align:center">从出租车空间地图到 Rust 内存关系图：类比链条</h3>
  <div class="diagram">
    <div class="node">实证发现<br>出租/救护车司机<br>痴呆死亡率最低</div>
    <span class="arrow-sym">→</span>
    <div class="node-blue">机制假设<br>持续实时<br>空间导航建图</div>
    <span class="arrow-sym">⇄</span>
    <div class="node-orange">类比对象<br>手写 Rust<br>所有权关系图</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">共通循环<br>状态→冲突→<br>重建→循环</div>
    <span class="arrow-sym">→</span>
    <div class="node-red">边界<br>零样本<br>非医学结论</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">真正可能起保护作用的或许是「认知复杂度」本身，而非某个具体职业或语言</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「出租车司机不得痴呆 → 写 Rust 也能防痴呆」。公交/货运司机并无同样保护效应，说明不是「开车」而是「不依赖导航的实时空间推理」；且 Rust 推论目前零流行病学样本，不能把类比当健康建议。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】出租车研究：保护效应来自动态地图而非方向盘</h3>
  <p><strong>在讲什么问题：</strong>2024 年研究分析 2020–2022 年美国近 900 万份死亡证明、443 种职业，为何出租车和救护车司机阿尔兹海默症死亡率最低？</p>
  <p><strong>核心机制：</strong>调整后出租/救护车司机患病率约 1%，全体平均约 1/60；公交、货运司机无同样效应——起作用的并非「坐在方向盘后」，而是持续、实时、不依赖导航软件的空间定位：「建图—更新—重建」循环。</p>
  <p><strong>关键理解：</strong>2023 年机器学习研究还显示，仅凭居住环境空间复杂度（街道密度、路口、路径丰富度）即可 84% 准确率预测邮编区发病率——街道越「绕」，大脑被迫锻炼越多。</p>
  <p><strong>典型场景：</strong>需随时确认「我在哪、目的地在哪、路况变了怎么改」的即兴导航，而非固定路线重复驾驶。</p>
  <p><strong>边界说明：</strong>研究基于美国死亡证明与空间导航职业，不能直接外推到屏幕前的抽象符号操作或任意脑力劳动。</p>
  <div class="quote">「不是开车本身在保护大脑，是大脑里那张不断被重新计算的地图在保护大脑。」</div>
  <div class="relation"><strong>相关概念：</strong>认知储备（cognitive reserve）——长期高强度认知活动可能积累缓冲能力，延缓病理性损伤下的功能衰退。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】Rust 所有权：编译器强制维护的内存关系图</h3>
  <p><strong>在讲什么问题：</strong>为何作者单拎 Rust 而非「程序员整体」来类比出租车司机的心智地图？</p>
  <p><strong>核心机制：</strong>GC 语言（Java/Python/JS/Go）把「内存去哪了」从程序员脑中拿走，类似导航软件代劳路线；Rust 则要求任何时刻清楚每块内存「属于谁、谁在借、借用活多久」——所有权、借用、生命周期三件套。</p>
  <p><strong>关键理解：</strong>编译器不替你记关系，只在违反时报错；你被迫持续维护「资源归属—借用链—有效期」动态图，与出租车「当前状态→检测冲突→重新建模→循环」结构相似。</p>
  <p><strong>典型场景：</strong>多模块共享数据、同时存在只读与可变借用时，必须在脑内核对整张关系图才能通过编译。</p>
  <p><strong>边界说明：</strong>写分布式 Java 维护并发时序图、写 Haskell 维护类型链，认知负荷未必更轻——不能单独把「防痴呆」功劳记给 Rust。</p>
  <div class="highlight"><strong>落地：</strong>若希望体验这种「不可外包的心智建模」，刻意手写 Rust 而非全交给 AI 生成，并在每次 borrow checker 报错时当作「关系图不一致」信号，主动重画结构而非堆 unsafe。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】出租车司机空间地图 vs Rust 程序员内存图</h3>
  <table>
    <tr><th>维度</th><th>出租车司机</th><th>手写 Rust 程序员</th><th>一句话结论</th></tr>
    <tr><td>推理类型</td><td>动态空间图，非背固定路线</td><td>动态所有权图，非背语法规则</td><td>都是「实时更新」而非「一次性记忆」</td></tr>
    <tr><td>双视角任务</td><td>第一人称定位 + 全局路线</td><td>局部一行代码 + 全局所有权结构</td><td>都涉及局部/全局视角切换</td></tr>
    <tr><td>能否外包</td><td>导航软件代劳则锻炼大减</td><td>GC/AI 代劳则脑内地图可模糊</td><td>保护效应可能来自「不能自动化」部分</td></tr>
    <tr><td>实证基础</td><td>900 万份死亡证明</td><td>零样本，纯类比</td><td>类比有趣但远非医学结论</td></tr>
    <tr><td>负面因素</td><td>久坐、夜班、压力</td><td>久坐、睡眠不足、高压交付</td><td>高强度脑力≠必然有保护性机制</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】这个类比的四条明显漏洞</h3>
  <p><strong>坑 1：样本完全不存在</strong>——出租司机有流行病学统计，「Rust 程序员患病率更低」是零数据纯推测。<strong>解法：</strong>别把脑洞当健康指南。<strong>严重程度：</strong>致命（误导决策）。</p>
  <p><strong>坑 2：认知负荷高≠大脑保护</strong>——程序员久坐、缺觉、长期压力同样伤害大脑，可能抵消「心智建图」好处。<strong>解法：</strong>分开讨论「职业健康」与「认知储备」。</p>
  <p><strong>坑 3：其他语言也在复杂建模</strong>——分布式 Java、Haskell 类型链负荷未必更轻，单独归因 Rust 是幸存者偏差。<strong>解法：</strong>谈「认知复杂度」而非「语言圣杯」。</p>
  <p><strong>坑 4：真实空间 vs 屏幕抽象</strong>——原研究明确问：屏幕空间推理是否等同真实街道？尚无答案，平移到 IDE 所有权图跳过了未验证环节。<strong>解法：</strong>标注「思想实验」而非「已证实」。</p>
</div>

<div class="card">
  <h3>【决策/选型表】什么活动更可能接近「认知锻炼」</h3>
  <table>
    <tr><th>场景</th><th>推荐做法</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>想提升日常空间推理</td><td>少开导航、主动认路</td><td>研究指向不可外包的实时建图</td><td>全程依赖导航</td><td>把认知负荷交给工具</td></tr>
    <tr><td>想保持编程认知复杂度</td><td>手写核心逻辑、自己维护架构图</td><td>认知储备来自主动建模</td><td>全量 AI 生成后不看</td><td>关系推理被自动化吃掉</td></tr>
    <tr><td>选语言防痴呆</td><td>不存在可靠答案</td><td>无 Rust 程序员流行病学数据</td><td>为健康选 Rust</td><td>把类比当医学建议</td></tr>
    <tr><td>借 checker 报错崩溃时</td><td>重画所有权结构</td><td>报错=关系图不一致信号</td><td>无脑加 unsafe 绕过</td><td>失去「强制清醒」的训练价值</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】认知复杂度比选语言更靠谱</h3>
  <p><strong>原则：</strong>真正可能起保护作用的，不是具体职业或语言，而是持续、不能自动化、不能外包给工具的心智建模——「古法」手写代码可能比写的是 Rust 还是 Go 更关键。</p>
  <p><strong>为什么重要：</strong>大脑喜欢的不是「知道答案」，而是「持续解题」；固定地图记熟锻炼有限，必须不断重算、随时被打破重建的动态关系图才有训练意味。</p>
  <p><strong>怎么落地：</strong>① 工作中保留需主动推理关系的任务（架构、并发、内存/数据流）；② 限制 AI/GC/导航对核心认知的完全代劳；③ 把编译错误视为「地图不一致」而非纯粹障碍。</p>
  <p><strong>适用边界：</strong>本文不构成医学建议；能否防痴呆需未来流行病学验证，目前只是认真拆解过的脑洞。</p>
  <div class="quote">「下次编译器又因为借用检查报错而把你搞崩溃的时候，你至少可以安慰自己一句——这可能是在给大脑做免费的体检。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：神经流行病学研究者 / 「关联不等于因果」派</p>
  <p class="rebuttal-text">出租司机数据再漂亮也只是观察性关联——职业自选择、健康工人效应、未测量的生活方式混杂一样能解释低发病率，把同一逻辑平移到 Rust 程序员连可检验的队列都不存在。</p>
</div>

<div class="conclusion">
  <h2>结论与行动</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>900 万份死亡证明显示出租/救护车司机阿尔兹海默症死亡率最低，关键变量是持续实时空间导航，而非「开车」本身。</li>
    <li>手写 Rust 维护所有权关系图，与「建图—更新—重建」循环在结构上有趣相似，但零直接证据，且真实空间导航与屏幕抽象操作是否共用神经回路尚无定论。</li>
    <li>类比有四条明显漏洞：无样本、负荷≠保护、其他语言同样复杂、空间到符号的跳跃未验证。</li>
    <li>更站得住脚的推论是「认知复杂度 / 认知储备」——主动建模、不外包给工具的心智活动，才可能类似锻炼。</li>
    <li>全文定位是思想实验与脑洞，不是可执行的健康或语言选型建议。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>阅读 BMJ 2024 职业死亡证明原文（doi:10.1136/bmj-2024-082194），区分关联与因果，避免把出租司机故事简化成「多开车防痴呆」。</li>
    <li>若写 Rust，在 borrow checker 报错时暂停堆 unsafe，先重画模块间的所有权/借用关系图再改代码。</li>
    <li>日常保留一项「不能全交给工具」的认知任务：认路少开导航、核心逻辑手写、架构变更自己推演数据流。</li>
    <li>不把本文当选 Rust 的理由；语言选型仍应基于工程约束，而非未验证的脑健康猜想。</li>
    <li>关注睡眠、运动与久坐等已知脑健康因素——它们可能抵消或放大任何「心智建图」的潜在好处。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「某种职业/语言能防痴呆」转向「持续、不可外包的动态关系推理可能有助于认知储备」——Rust 借用检查器的价值首先是工程安全，至于脑健康，目前只能当作编译报错时的心理安慰剂。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
