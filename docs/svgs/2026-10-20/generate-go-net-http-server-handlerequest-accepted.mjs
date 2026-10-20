import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-net-http-server-handlerequest-accepted.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#eef2ff,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#3730a3,#4f46e5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-indigo{background:#e0e7ff;color:#3730a3}.tag-violet{background:#ede9fe;color:#5b21b6}.tag-slate{background:#f1f5f9;color:#334155}.tag-amber{background:#fef3c7;color:#92400e}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #6366f1}
.card h3{font-size:22px;font-weight:700;color:#4338ca;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#eef2ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#3730a3;border-left:4px solid #818cf8}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#e0e7ff,#c7d2fe);border:2px solid #a5b4fc;border-radius:14px;padding:10px 12px;text-align:center;min-width:72px;font-weight:700;font-size:10px;color:#3730a3}
.node-warn{background:linear-gradient(135deg,#fef3c7,#fde68a);border-color:#fbbf24;color:#92400e}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#3730a3,#4f46e5);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#eef2ff;padding:10px 14px;text-align:left;font-weight:700;color:#3730a3;border-bottom:2px solid #a5b4fc}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px}`;

const body = `
<h1>HandleRequest：把 http.Server「看不见的那层路」变成官方 API</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-indigo">Go net/http</span>
  <span class="tag tag-violet">提案 #77441</span>
  <span class="tag tag-slate">HTTP/3</span>
  <span class="tag tag-amber">API 设计</span>
</div>
<p class="subtitle">本文解决的核心问题是：当请求不是由标准库从连接上读出来（HTTP/3、自定义协议、集成测试），如何让第三方实现与测试复用 Server 内部那层 OPTIONS 兜底、DefaultServeMux 回退与 panic 恢复，而不再复制一份易漂移的中间件逻辑。</p>

<div class="map">
  <h3 style="font-size:20px;color:#4338ca;margin-bottom:12px;text-align:center">连接读请求 → Server 内部处理层 → 你的 ServeMux/中间件 → 叶子 Handler</h3>
  <div class="diagram">
    <div class="node">TCP/UDP<br>读字节</div><span class="arrow-sym">→</span>
    <div class="node-warn">Server<br>内部层</div><span class="arrow-sym">→</span>
    <div class="node">OPTIONS*</div><span class="arrow-sym">→</span>
    <div class="node">Mux</div><span class="arrow-sym">→</span>
    <div class="node">Handler</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：HandleRequest 是给业务开发者挂中间件的新入口。实际定位是「我已有一个 *Request，请按这个 Server 收到它来处理」——全球协议实现者可能不到 10 人，另一大用途是集成测试。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Server 内部处理层</h3>
  <p><strong>在讲什么问题：</strong>用户 Handler 之前，Server 还有一层「看不见」的逻辑，平时只有从连接读请求才能触发。</p>
  <p><strong>关键理解：</strong>HTTP/2 并入前曾复制过这层逻辑；HTTP/3 若再复制，既重复劳动又行为不一致。</p>
  <p><strong>典型场景：</strong>在 UDP/QUIC 上读出请求后，委托 <code>srv.HandleRequest(w, r)</code> 与 HTTP/1、HTTP/2 对齐。</p>
  <p><strong>边界说明：</strong>不监听端口、不替代 <code>http.Serve</code>；不应塞进 <code>Server.Handler</code> 当 Handler 用。</p>
  <p><strong>原文依据：</strong>「当请求不是由 net/http.Server 自己从连接上读出来的，怎么让它享受 Server 内部那层处理逻辑？」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】HandleRequest 契约</h3>
  <p><strong>签名：</strong><code>func (*Server) HandleRequest(ResponseWriter, *Request) error</code></p>
  <p><strong>操作语义：</strong>① 未禁用时对 <code>OPTIONS *</code> 返回 200、Content-Length 0 ② <code>Handler==nil</code> 走 <code>DefaultServeMux</code> ③ panic 恢复并记日志 ④ panic 返回 error（<code>ErrAbortHandler</code> 特例透传）。</p>
  <p><strong>怎么落地：</strong>协议库在构造好 <code>*Request</code> 后一行委托；测试用 <code>httptest.NewRecorder</code> 断言 OPTIONS 与 panic 行为。</p>
  <div class="highlight">命名从 ServeHTTP 改为 HandleRequest，且带 error 返回值，刻意不满足 <code>http.Handler</code>，避免被误挂到生产路径。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】三种调用形态</h3>
  <table>
    <tr><th>方式</th><th>测到什么</th><th>局限</th></tr>
    <tr><td><code>handler.ServeHTTP(rec, req)</code></td><td>叶子 Handler 逻辑</td><td>跳过 Server 层 OPTIONS/panic/默认 Mux</td></tr>
    <tr><td><code>srv.HandleRequest(rec, req)</code></td><td>完整 Server 语义</td><td>仍需自己构造 Request；不读连接</td></tr>
    <tr><td><code>Preprocess(h) Handler</code>（讨论过未采纳）</td><td>包装任意 Handler</td><td>与「固定用 Server 自己的 Handler」目标不同</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】我该用哪种测试/集成路径？</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th></tr>
    <tr><td>单函数 Handler 单元测</td><td>直接 <code>ServeHTTP</code></td><td>快、隔离</td><td>HandleRequest（过重）</td></tr>
    <tr><td>断言 OPTIONS * / panic 恢复</td><td><code>HandleRequest</code></td><td>走官方 Server 路径</td><td>手写复制 OPTIONS 逻辑</td></tr>
    <tr><td>自研 HTTP/3 服务</td><td>读流后 <code>HandleRequest</code></td><td>与标准库演进同步</td><td>复制 neild 描述的三段中间件</td></tr>
    <tr><td>业务中间件链</td><td>自己的 <code>ServeMux</code> 包装</td><td>HandleRequest 不接收 Handler 参数</td><td>把 HandleRequest 当 Handler 挂 Server</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】把 HandleRequest 当生产 Handler</h3>
  <p><strong>坑名：</strong>看到名字像 <code>ServeHTTP</code> 就把它挂进 <code>Server.Handler</code> 或对外暴露。</p>
  <p><strong>原因：</strong>社区评审明确担心「误用于生产」；它是一次性处理已构造请求，不是监听入口。</p>
  <p><strong>解法：</strong>仅协议实现与集成测试调用；业务路由仍用 Mux/中间件栈。</p>
  <p><strong>严重程度：</strong>致命（架构误用）/ 测试场景为小心（需断言返回的 error）。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】先命名边界，再公开内部步骤</h3>
  <p><strong>原则：</strong>不发明新概念，只把已有内部步骤命名并公开；扩展 panic 细节留待 <code>HandlerPanicError</code> 等未来类型。</p>
  <p><strong>为什么重要：</strong>Server 字段大多配置「字节→Request」；少量配置「Request→Handler」——只暴露后一步，抽象自洽。</p>
  <p><strong>怎么落地：</strong>关注 #77440 可插拔 HTTP/3 与 x/net 实验实现（目前 hold）；HandleRequest 是先落地的基础拼图。</p>
  <p><strong>适用边界：</strong>CrossOriginProtection 等 Server 级默认行为未来增多时，统一走此入口；具体合入版本以发布说明为准。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「标准库就该提供 Preprocess 式 Handler 包装，更 Go 惯用」</p>
  <p class="rebuttal-text">本提案要的是「像这个 Server 真收到了请求」的固定语义，必须绑死 Server 自己的 Handler 与 OPTIONS/panic 规则，返回可复用 Handler 反而会鼓励绕开官方路径再抄一遍。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>#77441 接受：一行 API 解决 HTTP/3 与测试对 Server 内部层的复用，避免 HTTP/2 式的复制教训。</li>
    <li>HandleRequest 通过改名与 error 返回值，与 http.Handler 刻意脱钩，降低误用。</li>
    <li>行为覆盖 OPTIONS *、DefaultServeMux 兜底、panic 恢复与 ErrAbortHandler 语义。</li>
    <li>未来 Server 级默认策略（如 CrossOriginProtection）可集中挂在此入口。</li>
    <li>多数业务开发者短期无感；测试与基础设施作者应纳入工具箱。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>为关键 HTTP 服务补一条用 <code>HandleRequest</code> 的 OPTIONS * 与 panic 集成测试。</li>
    <li>若维护自定义传输层，评估是否用委托替代自写 OPTIONS/panic 逻辑。</li>
    <li>阅读提案 #77441 与评审纪要 #33502，跟踪合入 Go 版本。</li>
    <li>关注 #73626 跨站保护与 #77440 HTTP/3 可插拔方案的时间线。</li>
    <li>代码评审时拒绝把 HandleRequest 塞进 <code>Server.Handler</code> 链。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「net/http 只有 ServeHTTP 一条故事线」转为「连接读请求」与「Request 进 Handler」是两条可独立暴露的边界——HTTP/3 时代后者必须先官方化。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
