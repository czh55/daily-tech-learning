import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-concurrency-concurrent-ml-events.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#eff6ff,#dbeafe);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#1d4ed8,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1d4ed8}.tag-indigo{background:#e0e7ff;color:#4338ca}.tag-slate{background:#f1f5f9;color:#334155}.tag-violet{background:#ede9fe;color:#6d28d9}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1d4ed8;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#eff6ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#1e40af;border-left:4px solid #60a5fa}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#dbeafe,#bfdbfe);border:2px solid #93c5fd;border-radius:14px;padding:10px 12px;text-align:center;min-width:72px;font-weight:700;font-size:10px;color:#1d4ed8}
.node-warn{background:linear-gradient(135deg,#fef3c7,#fde68a);border-color:#fbbf24;color:#92400e}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#eff6ff;padding:10px 14px;text-align:left;font-weight:700;color:#1d4ed8;border-bottom:2px solid #93c5fd}
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
<h1>CML：把通信操作变成可组合的事件值</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Concurrent ML</span>
  <span class="tag tag-indigo">Go select</span>
  <span class="tag tag-slate">CSP</span>
  <span class="tag tag-violet">goroutine 泄漏</span>
</div>
<p class="subtitle">本文解决的核心问题是：Go 的 channel/select 把「通信描述」与「执行」绑死在语法里，导致封装、组合、取消与泄漏治理都要靠约定和 goroutine 补丁——CML 用 30 年前的事件模型说明：把通信做成一等值后，选择/超时/取消/后置处理才能统一抽象。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1d4ed8;margin-bottom:12px;text-align:center">事件（描述）→ sync（执行）→ handle/choice/guard（组合）</h3>
  <div class="diagram">
    <div class="node">put-evt<br>recv-evt</div><span class="arrow-sym">→</span>
    <div class="node">choice-evt</div><span class="arrow-sym">→</span>
    <div class="node">sync</div><span class="arrow-sym">→</span>
    <div class="node-warn">nack<br>取消</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：reflect.Select 已让 Go 等价于 CML。它只解决分支数量动态，通信仍无法作为值独立存在、返回、再叠加超时。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】事件 vs Go select</h3>
  <p><strong>在讲什么问题：</strong>为何不能把「向 ch 发送」封装成函数返回值供上层再选择。</p>
  <p><strong>关键理解：</strong><code>channel-put-evt</code> 不发送，<code>sync</code> 才提交；Go 里语句到达即执行。</p>
  <p><strong>怎么落地：</strong>封装并发 API 时延迟启动——别把 goroutine/请求在构造时就跑起来。</p>
  <p><strong>边界说明：</strong>不能把整套 CML 运行时搬进 Go；学术模型≠生产迁移。</p>
  <p><strong>原文依据：</strong>「在 select 里，ch1 &lt;- 5 是动作描述；拿出来就立刻变成执行。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】三大组合子</h3>
  <p><strong>handle-evt：</strong>提交后的 post-commitment，对应 select 的 case 体，可挂在事件上封装转换。</p>
  <p><strong>choice-evt：</strong>「二选一」本身也是值，可再与 timeout-evt 组合；sync 前 HTTP 请求未发出。</p>
  <p><strong>guard-evt：</strong>提交前 setup（如每次新建 resp channel），调用者 API 不变。</p>
  <div class="highlight">对比 Go「起两个 goroutine 抢最快 URL」：goroutine 一启动就在干活，不是延迟选择。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Go vs CML 取消与泄漏</h3>
  <table>
    <tr><th>维度</th><th>Go</th><th>CML</th><th>一句话</th></tr>
    <tr><td>取消</td><td>context 逐层传递约定</td><td>nack-guard-evt 内建</td><td>Go 顶层传递，CML 事件自决</td></tr>
    <tr><td>超时+转换</td><td>onePlus+select 易泄漏丢消息</td><td>handle-evt 未选中不取消息</td><td>Wingo 2016 认错案例</td></tr>
    <tr><td>阻塞线程</td><td>goroutine 常驻</td><td>不可达阻塞线程可被 GC</td><td>Go 1.27 goroutineleak 仅诊断</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】onePlus 超时陷阱</h3>
  <p><strong>坑名：</strong><code>select</code> 超时先触发，<code>onePlus</code> 内 goroutine 仍阻塞，数字消失+泄漏。</p>
  <p><strong>解法：</strong>转换逻辑与超时写在同一 select（关注点混杂），或重新设计延迟执行。</p>
  <p><strong>严重程度：</strong>数据丢失为致命；泄漏为小心（可用 goroutineleak profile）。</p>
</div>

<div class="card">
  <h3>【决策/选型表】Go 工程师怎么用这篇</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>避开</th></tr>
    <tr><td>库 API 设计</td><td>延迟执行+显式 Start</td><td>对齐「事件先于 sync」</td><td>构造即起 goroutine</td></tr>
    <tr><td>线上慢涨内存</td><td>Go 1.27 goroutineleak</td><td>可达性检测泄漏</td><td>以为 profile=自动回收</td></tr>
    <tr><td>取消语义</td><td>ctx + 明确关闭 done</td><td>Go 惯例可落地</td><td>指望 nack 语义自动出现</td></tr>
    <tr><td>极致组合并发</td><td>Racket/专用运行时</td><td>CML 完整语义</td><td>硬改 Go 语言</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】描述与执行分离</h3>
  <p><strong>原则：</strong>通信操作表示为独立于执行的值，选择/取消/前后置才同一抽象。</p>
  <p><strong>落地：</strong>四条启发——延迟执行、转换与等待分离、每条 goroutine 有退出路径、跑 goroutineleak。</p>
  <p><strong>边界：</strong>全局变量可达的 channel 泄漏 profile 识别不了。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「Go 够简单，CML 是学术炫技」</p>
  <p class="rebuttal-text">简单若意味着无法封装通信与必然 goroutine 补丁，规模上来泄漏和丢消息成本会反超你省下的语法复杂度。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>Go select 是语法点，CML 事件是值，组合空间更大。</li>
    <li>handle/choice/guard 统一超时、取消与后置处理。</li>
    <li>Wingo 案例说明封装转换+超时的结构性风险。</li>
    <li>Go 1.27 goroutineleak 是诊断，CML 是语义级回收。</li>
    <li>借鉴思路即可，不必迁到 Racket。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>审查库里「返回 channel 即启动 goroutine」的 API。</li>
    <li>用 goroutineleak profile 扫一遍长期运行服务。</li>
    <li>读 Nikhil 原文与 Wingo 两篇认错文对照 select 边界。</li>
    <li>新并发功能先画「描述→执行→取消」三阶段再写代码。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「channel/select 就是并发终点」转为「它们是一个更大设计空间里被语法固定的一个点」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Wrote', OUT, 'height', height);
