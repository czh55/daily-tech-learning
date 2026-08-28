import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'rob-pike-usenix-flame-award-2026.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-color:#a78bfa;color:#6b21a8}
.arrow-sym{font-size:18px;color:#94a3b8}
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
<h1>Rob Pike 获 USENIX Flame 终身成就奖：UTF-8、Plan 9 与 Go 如何串联半部计算机史</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">USENIX Flame</span>
  <span class="tag tag-green">Rob Pike</span>
  <span class="tag tag-orange">UTF-8</span>
  <span class="tag tag-purple">Plan 9</span>
  <span class="tag tag-red">Go 语言</span>
</div>
<p class="subtitle">本文解决的核心问题是：USENIX 为何将 2026 年 Flame 终身成就奖颁给 Rob Pike，以及他在操作系统、编程语言、用户界面、软件工具与文本表示五大领域留下的奠基性成果如何串联起从 Unix 黄金年代到云原生时代的技术脉络。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Rob Pike 技术贡献演化关系图</h3>
  <div class="diagram">
    <div class="node">贝尔实验室<br>Unix 遗产</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">UTF-8<br>文本表示</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Blit / Plan 9<br>图形与「一切皆文件」</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">Sam / Acme<br>编辑器范式</div>
    <span class="arrow-sym">→</span>
    <div class="node">Go 语言<br>云原生基础设施</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">从文本编码到并发语言：四十余年持续输出的系统级创造力</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Go 语言之父」等于 Rob Pike 的全部贡献。实际上 Pike 在 UTF-8、Plan 9、Blit 图形终端、Sam/Acme 编辑器及《The Practice of Programming》等著作上的奠基性工作，均早于 Go 且影响范围更广；Flame 奖表彰的是横跨五大领域的罕见广度，而非单一语言成就。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】USENIX Flame 终身成就奖</h3>
  <p><strong>在讲什么问题：</strong>操作系统与系统软件领域最高荣誉之一，每年仅颁给一位（或一组）对整个行业产生深远影响的人物。</p>
  <p><strong>核心机制：</strong>USENIX 官方定义表彰「在 USENIX 社区中作出卓越智识贡献与服务、且未在其他场合获得充分认可」的人物；历届名单浓缩计算机系统发展史。</p>
  <p><strong>关键理解：</strong>2026 年授奖词强调 Pike 工作具有「罕见的广度与持久的影响力」，横跨操作系统、编程语言、用户界面、软件工具乃至文本表示方式五大领域。</p>
  <p><strong>典型场景：</strong>评估一位系统领域研究者是否达到「奠基性」而非「增量性」贡献时，可参考历届名单（Kernighan、Berners-Lee、Gosling 等）。</p>
  <p><strong>边界说明：</strong>Flame 奖侧重 USENIX 社区视角的系统软件贡献，不代表应用层或商业产品成功的唯一标尺。</p>
  <div class="quote">「能在五个不同方向上都留下奠基性成果的人，放眼整个计算机科学界也屈指可数。」</div>
  <div class="relation"><strong>相关概念：</strong>与图灵奖（更广的 CS 贡献）不同，Flame 更聚焦操作系统与系统软件社区。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】UTF-8：一张餐巾纸上的文本编码革命</h3>
  <p><strong>在讲什么问题：</strong>全球互联网文本编码的事实标准，支撑网页、邮件、聊天、数据库中几乎所有多语言与 emoji 符号。</p>
  <p><strong>核心机制：</strong>1992 年 Pike 与 Ken Thompson 在新泽西餐厅餐垫纸上勾勒：兼容 ASCII、变长表示全球文字、字节流可自恢复、任意位置可判断字符边界。</p>
  <p><strong>关键理解：</strong>设计极其优雅，至今仍是互联网文本编码首选；中文、日文、阿拉伯文、emoji 均依赖此方案。</p>
  <p><strong>典型场景：</strong>任何跨语言文本存储、传输、解析场景。</p>
  <p><strong>边界说明：</strong>UTF-8 解决字符表示，不解决排序、分词、输入法等业务层问题。</p>
  <div class="highlight"><strong>落地建议：</strong>新项目默认 UTF-8 编码；处理遗留系统时优先迁移至 UTF-8 而非维护多套编码表。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Plan 9 与 Unix 的「一切皆文件」理念</h3>
  <table>
    <tr><th>对比维度</th><th>Unix</th><th>Plan 9</th><th>一句话结论</th></tr>
    <tr><td>核心理念</td><td>一切皆文件</td><td>将理念贯彻得更彻底</td><td>Plan 9 是贝尔实验室对 Unix 的「重新出发」</td></tr>
    <tr><td>资源抽象范围</td><td>主要本地资源</td><td>网络、图形界面、远程机器资源统一为文件系统</td><td>Plan 9 把分布式资源纳入同一命名空间</td></tr>
    <tr><td>图形交互</td><td>字符终端为主</td><td>Blit 图形终端早期探索</td><td>Pike 主导的 Blit 为 Unix 图形化交互开门</td></tr>
    <tr><td>编辑器范式</td><td>Vi/Emacs 主流</td><td>Sam、Acme 探索「鼠标操作文本、文本驱动命令」</td><td>未走主流路线，但影响极客圈经典</td></tr>
    <tr><td>现代影响</td><td>直接延续至今</td><td>理念渗透至 Go、分布式系统</td><td>Plan 9 更多作为思想实验而非主流 OS</td></tr>
  </table>
</div>

<div class="card">
  <h3>【概念拆解卡】Go 语言：为并发与云计算时代而生</h3>
  <p><strong>在讲什么问题：</strong>2007 年前后 Pike 与 Thompson、Griesemer 在 Google 设计的新语言，解决 C++ 编译慢、复杂度高、难以优雅表达多核并发的问题。</p>
  <p><strong>核心机制：</strong>borrowing 自 CSP 理论的 goroutine 与 channel 并发模型；语法简洁、编译极快、原生支持并发。</p>
  <p><strong>关键理解：</strong>「不要通过共享内存来通信，而要通过通信来共享内存」——这句被无数 Gopher 奉为圭臬的话，概括了 Go 并发哲学。</p>
  <p><strong>典型场景：</strong>Docker、Kubernetes、etcd、Prometheus 等云原生基础设施关键项目均用 Go 编写。</p>
  <p><strong>边界说明：</strong>Go 擅长系统服务与并发后端，并非所有场景的最优解（如极致数值计算、前端、嵌入式极致资源约束）。</p>
  <div class="quote">「Don't communicate by sharing memory; share memory by communicating.」</div>
</div>

<div class="card">
  <h3>【心法/原则卡】软件工程思维：两本经典著作的传承</h3>
  <p><strong>原则：</strong>编程不仅是语法，更是「如何思考程序、如何设计可维护代码、如何在工具间组合出更强大能力」。</p>
  <p><strong>为什么重要：</strong>Pike 与 Kernighan 合著《The UNIX Programming Environment》（1984）与《The Practice of Programming》（1999），影响不止一代程序员对软件工程的理解。</p>
  <p><strong>怎么落地：</strong>① 读经典时关注设计思维而非语法；② 工具组合优于单点炫技；③ 可维护性优先于短期 hack。</p>
  <p><strong>适用边界：</strong>著作年代较早，部分具体工具已过时，但思维框架仍适用。</p>
  <div class="relation"><strong>相关概念：</strong>与 Kernighan 的 C 语言教材传统一脉相承，强调「实践中的编程」而非语言特性罗列。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】理解 Pike 贡献时的常见误区</h3>
  <p><strong>坑 1：只认 Go 不认 UTF-8/Plan 9</strong>——把 Pike 简化为「Go 之父」忽略其更早、更广的奠基工作。<strong>解法：</strong>按 USENIX 五大领域逐一梳理。<strong>严重程度：</strong>小心（认知片面）。</p>
  <p><strong>坑 2：Plan 9 失败论</strong>——因未成为主流 OS 而否定其价值。<strong>解法：</strong>区分「市场成功」与「思想影响」。<strong>严重程度：</strong>可忽略（若只关心就业技术栈）。</p>
  <p><strong>坑 3：忽视 Bell Labs 语境</strong>——脱离 Thompson、Ritchie、Kernighan 同僚背景理解 Pike。<strong>解法：</strong>将其置于 Unix 黄金年代脉络中阅读。<strong>严重程度：</strong>小心（理解深度不足）。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「实用主义」派 / 云原生怀疑论者</p>
  <p class="rebuttal-text">Flame 奖表彰的是历史广度，不是当下统治力——Plan 9 从未普及、Acme 用户寥寥，Go 之外 UTF-8 早已成为公共基础设施，把终身成就绑在一门 2009 年才发布的语言上，不过是 Gopher 圈的自嗨叙事。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>USENIX 2026 Flame 奖表彰 Rob Pike 在操作系统、编程语言、用户界面、软件工具、文本表示五大领域的罕见广度与持久影响</li>
    <li>UTF-8（1992）与 Ken Thompson 共同设计，至今为互联网文本编码事实标准</li>
    <li>Blit、Plan 9、Sam、Acme 探索图形交互与「一切皆文件」的极致实践</li>
    <li>Go 语言（2009）以 goroutine/channel 并发模型成为云原生基础设施核心语言</li>
    <li>与 Kernighan 合著两本经典，传承「如何思考软件」的工程思维</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>观看 Rob Pike 获奖感言视频，了解其自述的技术脉络</li>
    <li>阅读 UTF-8 原始设计文档，理解变长编码与 ASCII 兼容的优雅之处</li>
    <li>若学 Go，深入理解 channel 并发模型而非仅会用 goroutine</li>
    <li>选读《The Practice of Programming》中关于代码设计与工具组合章节</li>
    <li>将 Pike 贡献置于 Bell Labs → Google 时间线中，避免「Go 之父」单一标签</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>Rob Pike 的价值不在于「发明了 Go」，而在于四十余年间从文本编码到操作系统再到编程语言，持续以系统级思维解决基础设施问题——Flame 奖是对这种跨时代技术创造力的致敬，而非对单一产品的商业成功背书。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
