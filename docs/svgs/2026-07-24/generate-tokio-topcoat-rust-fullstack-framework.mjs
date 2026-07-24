import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'tokio-topcoat-rust-fullstack-framework.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#b45309,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#c2410c;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fdba74;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#9a3412}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-purple{background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-color:#c4b5fd;color:#6b21a8}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#c2410c;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Topcoat：Tokio 官方全栈框架如何用「无 WASM」路线补齐 Rust Web 拼图？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">Topcoat</span>
  <span class="tag tag-blue">Rust 全栈</span>
  <span class="tag tag-green">SSR 优先</span>
  <span class="tag tag-purple">行为本地化</span>
</div>
<p class="subtitle">本文解决的核心问题是：Tokio 团队为何在 AI 编程时代押注「服务端渲染 + $(...) 跨编译 JS」而非 WASM 全栈路线，以及已引入 Rust 的团队应如何判断 Topcoat 是否值得纳入技术雷达。</p>

<div class="map">
  <h3 style="font-size:20px;color:#c2410c;margin-bottom:12px;text-align:center">Tokio 全栈技术线：从运行时到毛坯房</h3>
  <div class="diagram">
    <div class="node-blue">Tokio<br><span style="font-size:11px;font-weight:400">异步运行时</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-blue">Axum<br><span style="font-size:11px;font-weight:400">HTTP 路由/API</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Toasty<br><span style="font-size:11px;font-weight:400">异步 ORM</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">Topcoat<br><span style="font-size:11px;font-weight:400">全栈响应式 Web</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">交互路径：SSR 首屏 → $(...) 浏览器端闭包 → #[shard] 服务端局部刷新</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Topcoat 要取代 Axum / Leptos」——Axum 仍是 API 地基，Topcoat 补的是响应式全栈样板；它也不是 WASM 框架的升级版，而是 HTMX / Phoenix LiveView 理念在 Rust 类型系统里的系统化重实现。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Topcoat 与 Rust 全栈拼图</h3>
  <p><strong>在讲什么问题：</strong>Rust Web 生态长期「路由器好用、全栈缺位」，Tokio 官方如何补齐最后一块？</p>
  <p><strong>核心机制：</strong>Topcoat = 模块化、电池齐全的全栈响应式框架；view! 宏写 HTML+Rust，#[page]/#[component] 标记路由与组件，Router::builder().discover() 从目录结构推导路由树，与 Axum（API）、Toasty（ORM）形成组合拳而非重复造轮子。</p>
  <p><strong>关键理解：</strong>Carl Lerche 判断 AI 正在抹平语言学习门槛，选型权重从「语言易用度」转向「生态丰富度」——Topcoat 服务的是已因性能/可靠性引入 Rust、想减少 Node.js 工具链碎片化的存量团队。</p>
  <p><strong>典型场景：</strong>已有 Rust 后端/CLI 的团队做管理后台、内部工具，不想为 Web 再引入一整套 JS 构建链。</p>
  <p><strong>边界说明：</strong>v0 早期实验阶段，明确预告破坏性变更；鉴权、邮件、WebSocket、topcoat new 脚手架等生产必备能力仍在 Roadmap，不适合扛核心生产系统。</p>
  <div class="quote">原文：Topcoat 不是要从 Node.js/Django 手里抢走每一个初创公司，而是帮已用 Rust 的团队留在同一语言生态里。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】$(...) 无 WASM 响应式交互</h3>
  <p><strong>方法名：</strong>服务端渲染 + $(...) 跨编译 JS <span class="tag tag-green" style="font-size:11px">SSR 优先</span></p>
  <p><strong>核心思路：</strong>全部标记语言在服务端渲染，交互逻辑写在 $(...) 闭包里——既在首屏求值，也被编译成浏览器端 JS，全程享受 Rust 类型检查，无需 WASM 打包与跨边界序列化。</p>
  <p><strong>操作步骤：</strong>① signal 声明客户端状态 ② @click=$(|_e| open.set(!open.get())) 绑定事件 ③ :hidden=$(!open.get()) 绑定属性 ④ 需服务端参与时用 #[shard] 暴露 API 端点，参数变化时局部重渲染片段。</p>
  <p><strong>选型条件：</strong>简单开关、表单搜索、局部刷新类交互选 Topcoat；拖拽、复杂状态机、重度动画仍应选 Leptos/Dioxus 或纯 JS 前端。</p>
  <div class="pitfall"><strong>避坑：</strong>官方承认客户端响应式系统仍处早期，复杂交互可能力不从心——可借助内置 HTMX / Alpine.js 集成补足，而非硬扛 $(...) 做一切。</div>
  <div class="highlight"><strong>落地建议：</strong>用 asset! 宏声明静态资源，构建时 CLI 自动哈希；UI 组件通过 topcoat ui 以 shadcn/ui 模式复制源码到项目，Tailwind 样式可随意改。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Topcoat vs WASM 框架 vs HTMX 系</h3>
  <table>
    <tr><th>对比维度</th><th>Topcoat</th><th>Leptos / Dioxus</th><th>HTMX / Phoenix LiveView</th><th>一句话结论</th></tr>
    <tr><td>渲染模型</td><td>SSR 优先，$(...) 编译为轻量 JS</td><td>WASM 客户端应用，细粒度交互</td><td>HTML 片段 + 属性指令驱动</td><td>Topcoat 是「类型安全的 HTMX」而非 WASM 竞品</td></tr>
    <tr><td>心智负担</td><td>全程服务端语境，无打包体积优化</td><td>需处理 WASM 目标、代码分裂、序列化</td><td>纯 HTML 属性，无编译期类型检查</td><td>Topcoat 用类型系统换 WASM 复杂度</td></tr>
    <tr><td>与 Axum 关系</td><td>互补，常同项目并用</td><td>可组合但独立生态</td><td>通常搭配任意后端</td><td>Topcoat 是 Tokio 版图延伸，分发渠道现成</td></tr>
    <tr><td>复杂 UI 能力</td><td>早期有限，Roadmap 待补齐</td><td>强，适合高交互 SPA</td><td>中等，服务端片段刷新</td><td>交互天花板目前低于 WASM 路线</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】行为本地化与请求级 Memoization</h3>
  <p><strong>原则：</strong>让组件自己拿数据、自己管鉴权——逻辑保持局部化，人类和 AI 推理小范围代码时都更可靠。</p>
  <p><strong>为什么重要：</strong>传统中间件鉴权「可能生效也可能不生效」；数据从外层一层层 props 传递会让调用链过长、重复查询频发。</p>
  <p><strong>怎么落地：</strong>① 组件内直接 load_user(cx, user_id) ② #[memoize] 保证同请求同参数只查库一次 ③ require_auth(cx) 写进组件入口，未登录直接 redirect ④ 通过 cx 上下文传递实现类似 hooks 的组合，但无 hooks 规则限制。</p>
  <p><strong>适用边界：</strong>适合页面级/组件级边界清晰的应用；跨切面横切关注点仍需团队约定，不能假设 memoize 能替代全局缓存策略。</p>
  <div class="quote">原文：Locality of behavior as the guiding principle——无论人类还是 AI，在推理小范围代码时表现都更好。</div>
</div>

<div class="card">
  <h3>【决策/选型表】何时考虑 Topcoat</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐的方案</th><th>为什么不行</th></tr>
    <tr><td>已用 Rust 做后端，需管理后台</td><td>Topcoat 技术预研</td><td>减少 Node.js 工具链碎片化，与 Axum/Toasty 同生态</td><td>为后台单独引入 React 全家桶</td><td>多语言维护成本高于性能收益</td></tr>
    <tr><td>高交互 SPA（拖拽/动画/复杂状态机）</td><td>Leptos / Dioxus 或纯前端</td><td>Topcoat 客户端响应式仍早期</td><td>强行用 $(...) 实现一切</td><td>官方自己承认能力有限</td></tr>
    <tr><td>核心生产业务系统</td><td>观望至鉴权/脚手架落地</td><td>v0 破坏性变更 + Roadmap 大量未实现</td><td>现在直接扛主站</td><td>鉴权、WebSocket、SSE 等均未就绪</td></tr>
    <tr><td>纯 API 微服务</td><td>继续用 Axum</td><td>Topcoat 解决的是全栈样板，不是路由层</td><td>用 Topcoat 只做 JSON API</td><td>定位错配，增加不必要抽象</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Topcoat 早期接入风险</h3>
  <p><strong>破坏性变更（致命）：</strong>README 明确「早期实验阶段，预计会有破坏性变更」——版本升级成本需提前预算。</p>
  <p><strong>生产基建空白（致命）：</strong>鉴权、邮件、校验、WebSocket、SSE、静态导出、流式 SSR、后台任务等均在 Roadmap，尚未落地。</p>
  <p><strong>脚手架缺失（小心）：</strong>topcoat new 尚未提供，上手门槛比 Hello World 看起来更高，适合愿意折腾的尝鲜团队。</p>
  <p><strong>社区体量小（可忽略短期）：</strong>约 1.3k star、第三方教程近乎零——但 Tokio 官方背书降低「作者弃坑」风险，TokioConf 会持续导流。</p>
  <div class="quote">原文：现阶段更适合 Rust 重度用户做技术预研、内部工具、非核心业务尝鲜，还不建议直接扛核心生产系统。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：JavaScript/TypeScript 全栈派 / 「Web 早已是 JS 主场」论者</p>
  <p class="rebuttal-text">AI 拉平语言门槛的前提是库生态足够厚——Topcoat 连鉴权脚手架都未落地，却要让团队放弃成熟 npm 生态，为「少一门语言」赌一个 v0 框架，组织摩擦成本可能远超维护双栈。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Topcoat 补全 Tokio → Axum → Toasty → Topcoat 全栈线，定位是「Rust 版 HTMX + Rails 式全家桶」，非 WASM 框架升级版。</li>
    <li>$(...) 把类型安全的 Rust 闭包跨编译为浏览器 JS，#[shard] 实现服务端局部刷新，心智模型接近 Phoenix LiveView。</li>
    <li>行为本地化 + #[memoize] + 组件内鉴权，面向 AI 时代「局部代码可推理」与减少重复查询。</li>
    <li>目标用户是已引入 Rust 的存量团队，打法是减少语言碎片化而非颠覆式换血。</li>
    <li>v0 阶段：观察鉴权、topcoat new、流式 SSR 半年内 Roadmap 落地速度，再评估生产可用性。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>若团队已有 Rust 基础设施，把 Topcoat 列入技术雷达，用内部工具做非核心尝鲜。</li>
    <li>评估现有 Web 需求：高交互 SPA 继续 WASM/JS 路线，管理后台类可试点 Topcoat。</li>
    <li>跟踪 github.com/tokio-rs/topcoat 的鉴权方案与脚手架发布。</li>
    <li>试用 $(...) + #[shard] 模式理解 SSR 局部刷新，必要时叠加 HTMX/Alpine 集成。</li>
    <li>核心生产系统等待 v0 实验期结束、破坏性变更频率下降后再决策。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「Rust 能不能做 Web」转为「已选 Rust 的团队，是否值得用官方全栈线消灭第二套 JS 工具链」——胜负手不在语言易学性，而在生态拼图是否足够开箱即用。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
