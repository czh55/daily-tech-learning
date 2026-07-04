import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'build-gin-simple-over-easy.svg');

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
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:16px 20px;text-align:center;min-width:110px;font-weight:700;font-size:14px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:20px;color:#94a3b8}
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
<h1>别把「容易」当「简单」：Gin 框架 88k Star 背后的架构哲学</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Gin</span>
  <span class="tag tag-green">Go Web</span>
  <span class="tag tag-orange">Simple Over Easy</span>
  <span class="tag tag-purple">开源治理</span>
</div>
<p class="subtitle">本文解决的核心问题是：在 AI 时代人人追逐「一秒写微服务」的当下，Gin 为何能十年统治 Go Web 生态——答案不在功能堆砌，而在 Manu Martínez-Almeida 用「简单胜于容易」做出的三次架构克制。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Gin 制胜三板斧递进关系</h3>
  <div class="diagram">
    <div class="node-orange">Simple Over Easy<br><span style="font-size:12px;font-weight:400">拒绝反射魔法</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Radix 路由 + 零分配<br><span style="font-size:12px;font-weight:400">性能降维打击</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">十年零破坏性更新<br><span style="font-size:12px;font-weight:400">信任红利</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「框架越易上手、特性越多越好」—— Martini 的 Easy 靠反射藏魔法，异常时控制流不可追踪；Gin 的 Simple 要求多写几行显式代码，但生产环境可 Step into 源码 Debug。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Easy vs Simple</h3>
  <p><strong>在讲什么问题：</strong>2014 年 Martini 统治 Go Web 时，Gin 为何选择与「容易」决裂？</p>
  <p><strong>核心机制：</strong>Easy 在底层隐藏运动部件（反射依赖注入）；Simple 是概念清晰透明，开发者多写显式代码换取可追踪性。</p>
  <p><strong>关键理解：</strong>Rob Pike「Simplicity is Complicated」——看似容易往往包裹毒药；真正简单意味着热路径上没有魔法。</p>
  <p><strong>典型场景：</strong>需要路由参数、JSON 渲染，又不想手写 net/http 全部管道代码时选 Gin。</p>
  <p><strong>边界说明：</strong>若追求极致 DI、ORM 一体化、一行启动全栈，Gin 刻意不讨好你——它填补 net/http 与 Martini 之间的中庸地带。</p>
  <div class="quote">原文：「看似容易（Easy）的软件，往往是因为它在底层替你隐藏了太多的魔法和运动部件。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】gin.Context 显式请求生命周期</h3>
  <p><strong>核心思路：</strong>请求路径绝对禁止反射，用唯一对象 gin.Context 贯穿请求全生命周期。</p>
  <p><strong>操作步骤：</strong>1. gin.Default() 创建引擎 → 2. r.GET 注册路由，handler 接收 *gin.Context → 3. c.Param 显式取路径参数 → 4. c.JSON 一次调用完成响应。</p>
  <p><strong>选型条件：</strong>需要可调试、可步入源码的生产服务，而非 Demo 丝滑感。</p>
  <div class="pitfall">避坑：不要把 Martini 式反射 DI 搬进 Gin 中间件——违背设计初衷，异常时堆栈不可追踪。</div>
  <div class="quote">原文：「没有依赖注入，没有隐藏逻辑……你可以直接通过 IDE 步入源码进行 Debug。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Martini 正则路由 vs Gin Radix 树</h3>
  <table>
    <tr><th>对比维度</th><th>Martini（Easy）</th><th>Gin（Simple）</th><th>一句话结论</th></tr>
    <tr><td>路由语言</td><td>正则表达式列表，灵活</td><td>仅静态段/命名参数/通配符</td><td>克制换确定性</td></tr>
    <tr><td>查找复杂度</td><td>O(n·m)，路由越多越慢</td><td>O(k)，与注册数无关</td><td>万级路由仍恒定</td></tr>
    <tr><td>请求路径</td><td>反射绑定 Handler</td><td>显式 gin.Context</td><td>性能+可调试双赢</td></tr>
    <tr><td>内存/GC</td><td>每请求反射开销</td><td>sync.Pool 复用 Context，热路径零分配</td><td>延迟不因 GC 波动</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】十年 API 契约</h3>
  <p><strong>原则：</strong>合入任何公开 API 前自问：「我愿意在未来十年一直维护它吗？」</p>
  <p><strong>为什么重要：</strong>频繁 Breaking Changes 给作者成就感，但摧毁用户信任；Go1 兼容承诺是 Gin 效仿的范本。</p>
  <p><strong>怎么落地：</strong>拒绝只为省 5 个字符输入却破坏命名的 PR；每个公开函数视为陌生人建公司的地基。</p>
  <p><strong>适用边界：</strong>基础库/框架适用；快速迭代的内部工具可放宽，但别误用到对外 SDK。</p>
  <div class="quote">Manu 忠告：「设计一个你能想象维护十年的 API，并让其底层极其简单透明。」</div>
</div>

<div class="card">
  <h3>【避坑清单卡】设计 Web 框架时别踩的坑</h3>
  <p><strong>坑名：</strong>把「容易」当卖点堆反射魔法。</p>
  <p><strong>原因：</strong>正常时丝滑，异常时 Hard to trace，且每请求重复反射拖垮性能。</p>
  <p><strong>解法：</strong>热路径零反射，用显式 Context 传递状态。</p>
  <p><strong>严重程度：</strong>致命（Martini 已入历史尘埃，Fyve 社交网络亦然）。</p>
  <div class="pitfall">坑名：路由用正则列表——请求来了遍历「是你吗？」，相当于框架内寄生第二门语言。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Spring / NestJS「全家桶」派</p>
  <p class="rebuttal-text">十年不破坏 API 等于十年背着历史包袱——现代业务要的是 ORM、鉴权、GraphQL 开箱即用，Gin 只剩路由壳子还得自己拼。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Gin 的 88k Star 来自 Simple Over Easy，不是功能最多。</li>
    <li>gin.Context + 禁反射 = 可调试 + 高性能的组合拳。</li>
    <li>Radix 树 + sync.Pool 把查找和 GC 都压到「做得更少」。</li>
    <li>十年零破坏性更新换来的信任，比炫酷大版本更难复制。</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>审查自己项目热路径：有没有「方便但不可追踪」的反射/魔法？</li>
    <li>设计新 API 时用「十年维护测试」过滤 PR。</li>
    <li>路由层保持语言极小——能树化就别上正则列表。</li>
    <li>读 Gin 源码中 Context 池化与 Radix 实现，对照自己服务 GC 曲线。</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>伟大系统不是「最容易写」的，而是「最简单透明、可长期维护」的——AI 生成代码越快，这层纪律越值钱。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
