import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-hate-where-its-moving-generics-iterators-debate.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
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
<h1>「我恨Go现在的样子」：泛型、迭代器杀入语言核心，两百条评论吵翻了 Reddit</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 语言演进</span>
  <span class="tag tag-green">泛型 · 迭代器 · Set 提案</span>
  <span class="tag tag-orange">Reddit r/golang</span>
  <span class="tag tag-purple">工程文化</span>
  <span class="tag tag-red">Java 化焦虑</span>
</div>
<p class="subtitle">本文解决的核心问题是：当泛型、range-over-func 迭代器和内置 Set 等提案相继推进时，Go 社区争论的焦点已从「特性该不该加」转向「语言提供的能力与团队被迫接受的复杂度，到底该由谁来负责」。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Go「简单主义」边界松动路径</h3>
  <div class="diagram">
    <div class="node">极简承诺<br>少即是多</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Go 1.18 泛型<br>边界首次打开</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">迭代器 + Set 提案<br>核心继续扩张</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">团队压力 · 审查文化<br>「简单」由谁定义</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">每一次「加东西」都会重演同一套剧本——只是这一次参与人数和情绪强度都更高</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「语言强迫所有人用新特性」。高赞反驳指出——Go 从未强制使用泛型，写了多年代码也只在少数排序场景用过；真正让「不用新特性」变难的，往往是团队协作与代码风格趋同压力，而非编译器。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Go 的护城河是「简单」而非性能</h3>
  <p><strong>在讲什么问题：</strong>Reddit 帖《I hate where Go is moving》12 小时内数百赞、200+ 评论，核心焦虑是 Go 正在「Java 化」。</p>
  <p><strong>核心机制：</strong>Go 最初卖的不是 Spring 式 DI 体系，而是「不用先学一堆库方法就能上手写代码」；护城河从来不是性能或并发模型，而是「简单」这个标签本身。</p>
  <p><strong>关键理解：</strong>楼主不满的不是可选值缺失这类历史问题，而是社区应对方式——自建 optional 包装类型遍地开花，又提出内置 Set 等集合类型提案，在他看来是把 Go 一步步改造成 Java。</p>
  <p><strong>典型场景：</strong>老 Gopher 审查含泛型抽象的新 PR；Java 背景开发者把工厂模式、多层抽象带进 Go 项目。</p>
  <p><strong>边界说明：</strong>「简单」不是语言语法一页纸能写完就万事大吉——它由使用者能力、习惯和代码审查文化共同撑起；语言层面克制挡不住工程文化膨胀。</p>
  <div class="quote">原文：「Go 的护城河，从来不是性能，也不是并发模型，而是『简单』本身。一旦这个标签开始松动，身份焦虑几乎是必然的。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】克制派 vs 演进派</h3>
  <table>
    <tr><th>对比维度</th><th>克制派（反对新特性）</th><th>演进派（支持演进）</th><th>一句话结论</th></tr>
    <tr><td>历史参照</td><td>C++ 为迎合所有人不停加特性，最后谁都不满意</td><td>泛型/迭代器是弥补历史缺陷、走向成熟的必经之路</td><td>同一 C++ 教训可解读为警示或过度类比</td></tr>
    <tr><td>技术代价</td><td>泛型导致方法不能作为 interface 一部分，需 JIT 或放弃值类型</td><td>324 赞评论：迭代器/泛型在数据流、DB 读取场景非常自然</td><td>争论在「为加特性而加特性」vs「解决真实痛点」</td></tr>
    <tr><td>使用自由</td><td>每加特性抬高新人门槛、写法维度增加</td><td>语言从未强迫使用泛型，用不用是开发者选择</td><td>个人自由与团队风格压力之间存在鸿沟</td></tr>
    <tr><td>真正敌人</td><td>特性膨胀本身</td><td>运行时反射的「魔法」比迭代器更破坏可读性</td><td>部分开发者认为该骂的是 reflection 而非 range-over-func</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】新特性该不该在项目里用</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>业务 HTTP/CRUD 边界</td><td>interface + 具体类型，保持 idiomatic 精简写法</td><td>多数新特性是给库作者和特定场景用的</td><td>为抽象而抽象地套泛型</td><td>增加审查负担却未减少样板代码</td></tr>
    <tr><td>数据流 / DB 逐行读取</td><td>range-over-func 迭代器或标准库 iter</td><td>演进派高赞场景：统一遍历语义、减少手写 .Next()</td><td>在简单 slice 遍历上硬上迭代器</td><td>复杂度收益不匹配，属于 over-engineering</td></tr>
    <tr><td>需要去重集合</td><td>先评估 map[T]struct{} 是否足够</td><td>Go 惯用 set 模式已存在数十年</td><td>内置 Set 提案一落地就全库迁移</td><td>提案尚未落地，过早绑定标准库形态</td></tr>
    <tr><td>多人协作、风格分裂</td><td>代码审查明确「地道 Go」边界 + 所有权缩小 review 范围</td><td>语言克制挡不住 Java 翻译腔式抽象层</td><td>把争论留给个人偏好、无团队共识</td><td>「不用新特性」在大型团队现实中很难坚持</td></tr>
  </table>
  <div class="highlight"><strong>落地建议：</strong>PR 评审时区分「特性本身」与「写法风格」——问「去掉泛型/迭代器这行，逻辑还成立吗？」；对 reflection 驱动的隐式行为保持更高警惕。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】Java 翻译腔与反射魔法</h3>
  <p><strong>坑名：</strong>Java 背景开发者把工厂、抽象层习惯带进 Go，把代码写成「Java 翻译版」</p>
  <p><strong>原因：</strong>公司从 Java 团队「发配」过来的开发者写惯设计模式；社区缺少一份清晰的「什么才是地道 Go 代码」参照标准。</p>
  <p><strong>原文说法：</strong>「真正让语言变得难用的，往往不是迭代器或泛型，而是运行时反射带来的魔法——那种让你没办法从头到尾顺着代码读下去的隐式行为。」</p>
  <p><strong>解法：</strong>代码审查聚焦可读性与 idiomatic 写法；务实派观点——Go 允许写烂代码，但从未规定必须写烂代码，烂是水平与审查不到位的问题。</p>
  <p><strong>严重程度：</strong>小心——比单次特性争论更持久地侵蚀「跳进任意仓库不被吓懵」的体验。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】简单活在语言里，还是活在代码里</h3>
  <p><strong>原则：</strong>Go 选择极其克制的渐进式演进——每个特性从提出到落地往往经历数年社区拉锯；慢是区别于 C++ 式功能军备竞赛的地方，但慢不代表不变。</p>
  <p><strong>为什么重要：</strong>用户规模从早期极客扩展到大规模工程团队后，原设计哲学无法原样保留；「变」注定冒犯一部分为「简单」而来的老用户。</p>
  <p><strong>原文支撑：</strong>「简单，要么活在语言本身里，要么活在开发者写的代码里。Go 现在做的事情，某种程度上只是把这条边界重新交还给了社区去协商。」</p>
  <p><strong>怎么落地：</strong>和事佬派观点——Go 项目规矩保守、改动克制、提前争取广泛认同；泛型用得好减样板代码，用不好也没人逼你用；参与社区提案讨论而非只在论坛吐槽。</p>
  <p><strong>适用边界：</strong>当用户规模与场景复杂度确实超出「一页纸语法」能覆盖的范围时，补课式演进有其合理性；但每加一个特性都应问「价值是否覆盖引入的复杂度」。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：演进派高赞评论 · 「简单是挡箭牌」</p>
  <p class="rebuttal-text">拿「保持简单」当借口反对一切新东西的人，往往只是不想花时间理解迭代器和泛型——Go 从未强迫你用，却把团队写烂代码的锅甩给语言在变。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Reddit 帖《I hate where Go is moving》引爆 200+ 评论，争论从泛型/迭代器/Set 提案具体特性，上升到「语言能力与被迫复杂度谁负责」。</li>
    <li>克制派担心 Java/C++ 式膨胀；演进派认为补课必要，且语言从不强迫使用新特性——分歧背后是团队风格压力 vs 个人选择自由。</li>
    <li>深层视角：反射魔法和 Java 翻译腔式工程文化，可能比 range-over-func 更实质地伤害 Go 可读性。</li>
    <li>Go 的演进路径仍是克制的渐进式——每一次边界松动都会重演固定剧本，只是这一次强度和参与面都更大。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>阅读 Reddit 原帖及高赞评论，区分「特性设计」与「工程文化」两类论点。</li>
    <li>在团队内明确 idiomatic Go 边界：何时用泛型/迭代器，何时坚持 interface + 具体类型。</li>
    <li>PR 审查时对 reflection 驱动行为设更高门槛，比单纯禁止新语法更有效。</li>
    <li>关注内置 Set 等提案进展，落地前不急于全库迁移——先用 map[T]struct{} 评估是否足够。</li>
    <li>参与 Go 提案讨论（proposal repo），用社区协商替代论坛隔空对骂。</li>
  </ol>
  <p><strong>关键认知转变：</strong>「Go 变复杂了」可能不如「写 Go 的人变复杂了」更接近真相——语言的简单从来由语法、使用者与审查文化三者共同定义，而非任何单一版本号能锁定。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
