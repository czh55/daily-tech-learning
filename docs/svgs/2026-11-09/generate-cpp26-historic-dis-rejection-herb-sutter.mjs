import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'cpp26-historic-dis-rejection-herb-sutter.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#fff7ed,#ffedd5);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#9a3412,#c2410c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-orange{background:#ffedd5;color:#9a3412}.tag-amber{background:#fef3c7;color:#b45309}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#c2410c;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ffedd5,#fdba74);border:2px solid #fb923c;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#9a3412}
.node-em{background:linear-gradient(135deg,#fef3c7,#fcd34d);border-color:#f59e0b;color:#92400e}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#9a3412,#c2410c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#ffedd5;padding:10px 12px;text-align:left;font-weight:700;color:#9a3412;border-bottom:2px solid #fdba74}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fff1f2;border:2px solid #e11d48;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9f1239;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be123c;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#881337}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>C++26 DIS 否决之后，共识比档期更重要</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">Contracts</span>
  <span class="tag tag-amber">WG21 / ISO</span>
  <span class="tag tag-slate">Herb P4454</span>
</div>
<p class="subtitle">本文解决的核心问题是：2026 年 10 月 23 日 C++26 最终国际标准草案（DIS）因 Contracts 争议遭 ISO 成员国否决后，WG21 内 114∶12∶3 的技术多数与国家级否决之间的张力如何解开，以及 Bjarne P4334、Herb Sutter 六条路径 A–F 与 BDFL/委员会治理各意味着什么。</p>

<div class="map">
  <h3 style="font-size:20px;color:#c2410c;margin-bottom:12px;text-align:center">标准生死链：特性 → 委员会 → DIS</h3>
  <div class="diagram">
    <div class="node">P2900 Contracts</div><span class="arrow-sym">→</span>
    <div class="node node-em">WG21 114-12-3</div><span class="arrow-sym">→</span>
    <div class="node">ISO DIS 否决</div><span class="arrow-sym">→</span>
    <div class="node node-em">P4454 六路径</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">2026-11-16 Búzios 全体会议将决定 C++26 下一步</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「DIS 失败 = 只反对 Contracts」。实际上整份 C++26 草案一并被否，Reflection、std::execution、标准库强化等已完成功能也会拖延；又误以为 WG21 票数即国际标准——国家级 P 成员与「三分之二赞成、反对≤¼」规则才是另一套游戏。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】DIS 否决与 Contracts</h3>
  <p><strong>在讲什么问题：</strong>为何一项契约语法能让四十年 C++ 首次在 DIS 阶段翻车？</p>
  <p><strong>关键理解：</strong>Contracts（P2900）用 pre/post 等把接口约束写进语言；DIS 须满足 P 成员国 ≥⅔ 赞成且反对票 ≤¼。10 月 23 日 Disapproved，除已终止的 C++/CLI 外近乎空前。</p>
  <p><strong>和其他概念关系：</strong>Bjarne 等 P4334 指「根本缺陷」；Croydon（2026-03）全会仍保留 Contracts——技术路线与 ISO 程序层脱节。</p>
  <p><strong>怎么落地用：</strong>生产代码暂不赌未发布语义；跟踪 isocpp P4454/P4334，关注编译器对 ignore/observe/enforce 的一致实现。</p>
  <p><strong>边界说明：</strong>各国票仓细节非 ISO 官方公开统计，媒体票数宜作参考而非定案。</p>
  <p><strong>原文依据：</strong>「这是 C++ 历史上首次出现这样的情况。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Herb Sutter 六条出路（P4454）</h3>
  <p><strong>核心思路：</strong>语言创造者（Bjarne）与标准所有者（WG21+ISO+厂商生态）分歧时，对照历史经验枚举可执行分叉。</p>
  <p><strong>操作步骤（归纳）：</strong>A 放弃独立 C++26 并入 C++29 → B 移除 Contracts 再投 DIS → C 原设计改稿重投 → D 有限修补 Contracts → E 借各国国标发布 → F 调整 ISO/ANSI 路径。</p>
  <p><strong>选型条件：</strong>若争议集中在单一特性且库设计已耦合 B 成本高；若国际票反对因成熟度则 A/D 更审慎。</p>
  <p><strong>避坑：</strong>C 不回应核心疑虑等于重投翻车；B 会推翻已通过全会决策，撕裂支持者。</p>
  <p><strong>对比相邻方法：</strong>与 Python BDFL 单点裁断相比，六路径体现委员会必须在程序正义与工程审慎间显式权衡。</p>
  <p><strong>原文引用：</strong>Paths A–F 为社区归纳，非 WG21 既定决议。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】治理模式维度</h3>
  <table>
    <tr><th>维度</th><th>BDFL / 核心维护者</th><th>WG21+ISO 委员会</th><th>一句话结论</th></tr>
    <tr><td>决策链</td><td>Guido / Linus 式方向感</td><td>多国、多厂商公开投票</td><td>大生态难单人拍板</td></tr>
    <tr><td>速度</td><td>迭代快、风格一致</td><td>周期长、易陷僵局</td><td>C++26 DIS 是后者代价</td></tr>
    <tr><td>正当性</td><td>依赖领袖公信力交接</td><td>程序规则+国际认可</td><td>114-12-3 ≠ DIS 通过</td></tr>
    <tr><td>风险观</td><td>可押注个人判断</td><td>少数派可借 ISO 刹车</td><td>Contracts 折射「先上后修」vs「上前就验」</td></tr>
    <tr><td>生态现实</td><td>标准≈参考</td><td>GCC/Clang/MSVC 仍塑造真 C++</td><td>无统一标准亦会碎片化</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】DIS 失败后路径取舍</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>反对焦点在 Contracts 成熟度</td><td>B 或 D + 再 DIS</td><td>释放 Reflection/execution 等</td><td>C 裸重投</td><td>国际疑虑未消</td></tr>
    <tr><td>争议面已扩散到程序正当性</td><td>A 整体顺延 C++29</td><td>避免仓促定案几十年语义</td><td>E/F 单边国标</td><td>协调与认可成本高</td></tr>
    <tr><td>委员会多数坚持 P2900</td><td>D 有限语义修补</td><td>保留主体回应虚函数等质疑</td><td>忽视 P4334</td><td>创造者话语权影响采纳</td></tr>
    <tr><td>应用开发者</td><td>观望 + 不依赖草案特性</td><td>整包推迟</td><td>假设 C++26 按期发布</td><td>DIS 已失败</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】标准≠实现，慢即是快</h3>
  <p><strong>原则：</strong>影响数十年的基础语言设施，在国际层被否决时，重建共识比按期发版更保值。</p>
  <p><strong>为什么重要：</strong>Contracts 牵涉检查模式、跨 TU 一致性；仓促固化会拖累调试与正确性表达全生态。</p>
  <p><strong>怎么落地：</strong>11 月 16–21 日 Búzios 会议跟读纪要；用三编译器试验分支评估 P2900 行为差异。</p>
  <p><strong>适用边界：</strong>已稳定特性（C++23）不受此次 DIS 否定；危机的是 C++26 批次时间表。</p>
  <p><strong>原文支撑：</strong>「有时候，慢下来把问题解决清楚，比按时发布一个存在重大争议的标准更加重要。」</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Contracts 实务派 / 「多年全会已决」程序论者</p>
  <p class="rebuttal-text">WG21 已用 114 票锁定路线，让少数国家借 ISO 程序否决是把政治不确定性凌驾于可交付演进之上，Reflection 与 execution 被迫陪葬才是真正生态损失。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>2026-10-23 C++26 DIS 因 Contracts 等国际分歧被否，为 C++ 主标准罕见挫败。</li>
    <li>P4334 质疑基础缺陷；Croydon 114-12-3 与 DIS 结果揭示 WG21≠ISO 终裁。</li>
    <li>P4454 归纳 A–F 六路径，核心是在尊重全会决策与回应国际疑虑间取舍。</li>
    <li>Búzios（11-16）将讨论后续草案与共识重建；整包特性时间表一并后移。</li>
    <li>治理上 BDFL 与委员会各有利弊，超大语言只能在高审慎与演进速度间动态平衡。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>阅读 P4454R0、P4334R0 原文，列出反对方三条可验证技术疑虑。</li>
    <li>业务代码避免绑定未发布 C++26 特性，CI 锁定已发布标准版本。</li>
    <li>关注 Búzios 全会结论与 DIS 返工时间表。</li>
    <li>在团队内区分「ISO 标准 C++」与三家编译器实际方言。</li>
    <li>参与社区讨论时区分技术缺陷争论与程序正当性争论。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>C++ 演进应从「全会多数即定案」转为「国际 DIS 是最后一道工程审慎闸门」——创造者、委员会与国家成员同属所有者联盟，争议爆发时慢一点修共识，好过带着分裂语义按时印标准。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
