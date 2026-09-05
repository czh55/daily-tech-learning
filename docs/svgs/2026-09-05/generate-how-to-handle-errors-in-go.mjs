import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'how-to-handle-errors-in-go.svg');

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
<h1>JetBrains 官方深度指南：如何在 Go 中优雅地处理错误？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 错误处理</span>
  <span class="tag tag-green">errors.Is/As/AsType</span>
  <span class="tag tag-orange">errors.Join</span>
  <span class="tag tag-purple">WithCancelCause</span>
</div>
<p class="subtitle">本文解决的核心问题是：在 Go 坚持「错误即普通值」而非 try-catch 异常流的哲学下，如何用包装链、类型断言、多错误合并与 Context 根因传递，把层层 if err != nil 写成可观测、可恢复、可排障的工程体系。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Go 错误处理工具链：从返回值到并发根因</h3>
  <div class="diagram">
    <div class="node">error 接口<br>Error() string</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">fmt.Errorf %w<br>包装 + Unwrap</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Is / As / AsType<br>链上类型匹配</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">Join + WithCancelCause<br>多错误 / 取消根因</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">panic/recover 仅用于不可恢复灾难，业务失败沿调用链显式回传</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Go 错误处理就是满屏 if err != nil，不如 Java try-catch 优雅」。实际上 Go 把错误留在控制流内，调用方一眼可见错误去向；真正的问题是忽略错误、不包装上下文、或滥用 panic 兜底——这些在任何语言里都会变成调试噩梦。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】error 接口与「错误即值」</h3>
  <p><strong>在讲什么问题：</strong>Go 为何不抛异常，以及 error 类型为何极简却可无限扩展。</p>
  <p><strong>核心机制：</strong><code>error</code> 仅含 <code>Error() string</code>；函数遇错与正常返回值一并返回，调用方用 <code>if err != nil</code> 检查。自定义类型实现该接口即可携带结构化字段。</p>
  <p><strong>关键理解：</strong>错误是控制流的一部分，不是旁路异常——阅读函数签名即可预判错误如何向上传递，无需猜测内部是否 panic。</p>
  <p><strong>典型场景：</strong>文件 I/O、网络调用、数据校验等可预见失败。</p>
  <p><strong>边界说明：</strong>OOM 等不可恢复底层故障可 panic；用户输入无效、文件缺失、网络超时等可预见失败必须当 error 处理。</p>
  <div class="quote">原文：「Go 将错误视为程序正常控制流的组成部分。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】错误包装与类型断言三板斧</h3>
  <p><strong>方法名：</strong>fmt.Errorf %w + errors.Is/As/AsType · 标签：结构化错误链</p>
  <p><strong>操作步骤：</strong>1) 遇错用 <code>fmt.Errorf("open failed: %w", err)</code> 包装，禁止字符串拼接压平类型 → 2) 哨兵错误用 <code>errors.Is(err, fs.ErrNotExist)</code> → 3) 结构化字段用 <code>errors.AsType[*fs.PathError](err)</code>（Go 1.26 优先）→ 4) 批量读文件用 <code>errors.Join</code> 聚合，通过 <code>Unwrap() []error</code> 解包切片</p>
  <div class="highlight"><strong>落地建议：</strong>新代码优先 AsType 免反射 panic；库代码只返回错误不打日志，让调用方决定 slog/log 策略；Join 后的错误不能靠单层 Unwrap，需类型断言调用 <code>Unwrap() []error</code>。</div>
  <div class="relation"><strong>对比相邻方法：</strong>As 需预声明指针变量且可能运行时 panic；AsType 编译期类型检查、性能更好。字符串拼接 <code>errors.New("x:"+err.Error())</code> 会丢失底层类型信息。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】errors.Is vs As vs AsType</h3>
  <table>
    <tr><th>维度</th><th>errors.Is</th><th>errors.As</th><th>errors.AsType[E]</th><th>一句话结论</th></tr>
    <tr><td>匹配目标</td><td>哨兵错误值相等</td><td>某具体错误类型</td><td>泛型指定类型 E</td><td>Is 判「是不是那个错」，As/AsType 取结构化字段</td></tr>
    <tr><td>类型安全</td><td>值比较</td><td>需传指针，易传错</td><td>编译期检查</td><td>新代码优先 AsType</td></tr>
    <tr><td>性能</td><td>轻量</td><td>反射</td><td>无反射</td><td>热路径多类型检查用 AsType</td></tr>
    <tr><td>典型用途</td><td>fs.ErrNotExist</td><td>提取 PathError</td><td>连续 if-else 多类型分支</td><td>三者互补，非替代关系</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】何时包装、何时 Join、何时 panic</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>函数收到下层错误且能补充上下文</td><td>fmt.Errorf %w 包装</td><td>保留类型链 + 附加调用路径信息</td><td>直接 return err 或字符串拼接</td><td>排查时看不到是哪一层失败</td></tr>
    <tr><td>批量操作部分失败</td><td>errors.Join 收集后继续</td><td>一次返回全部失败项</td><td>遇第一个错就 return</td><td>丢失其余文件的失败信息</td></tr>
    <tr><td>goroutine 级联取消</td><td>context.WithCancelCause + Cause(ctx)</td><td>追溯取消根因而非仅 Canceled</td><td>只看 ctx.Err()</td><td>不知道是超时还是业务主动取消</td></tr>
    <tr><td>硬编码正则编译失败</td><td>regexp.MustCompile panic</td><td>绝不应在运行时发生</td><td>用 recover 兜所有业务错</td><td>破坏控制流透明度，中间层无处理逻辑</td></tr>
    <tr><td>网络瞬时故障</td><td>检查 net.OpError.Temporary() 重试</td><td>区分临时 vs 永久错误</td><td>一律 fail fast</td><td>错过可恢复窗口</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】七大工程陷阱</h3>
  <p><strong>坑名：</strong>用 _ 丢弃错误或在库内私自打日志</p>
  <p><strong>原因：</strong>早期忽略引发连锁故障；库打日志与调用方日志策略冲突。</p>
  <p><strong>解法：</strong>始终检查 err；库只返回 error，应用层用 slog 记录；GoLand/linter 高亮未处理错误。</p>
  <p><strong>严重程度：</strong>致命</p>
  <div class="pitfall"><strong>defer 顺序：</strong>必须在 err 检查通过后再 <code>defer f.Close()</code>，否则 nil 句柄解引用 panic。</div>
  <div class="pitfall"><strong>log.Fatal：</strong>直接 os.Exit，跳过所有 defer 清理——生产环境慎用。</div>
  <div class="pitfall"><strong>I/O 半读：</strong>Read 返回 (n, err) 时利用 n 从断点续传，勿把 io.EOF 当失败。</div>
  <div class="pitfall"><strong>宽泛错误信息：</strong>「database error」无上下文——应带操作名、路径、已写字节数等结构化字段。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】panic 边界与 defer 资源治理</h3>
  <p><strong>原则：</strong>错误沿调用链显式回传直到有上下文的层处理；panic 仅限不可恢复灾难；资源用 defer 统一释放。</p>
  <p><strong>为什么重要：</strong>顶层 recover 兜 panic 会让中间函数的错误处理逻辑全部失效，且 Go 无 throws 声明——读者无法预知 panic 来源。</p>
  <p><strong>怎么落地：</strong>HTTP handler 用 defer+recover 隔离单请求 panic；业务逻辑一律 return error；打开文件/连接后立即在 err==nil 分支设 defer Close。</p>
  <p><strong>适用边界：</strong>用户输入、文件缺失、网络超时绝不 panic；OOM 等系统级故障可以 panic 让进程重启。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Java/Python 资深开发者 · 「显式错误检查太啰嗦，应该统一 try-catch」</p>
  <p class="rebuttal-text">try-catch 把错误藏进非局部跳转，调用栈中间层默不作声——Go 的啰嗦换来的是每条错误路径在源码里可见、可测、可附加上下文，这正是高并发服务要的确定性。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Go 错误是值而非异常：error 接口 + 末尾返回 + if 检查构成基础范式。</li>
    <li>%w 包装保留错误链；Is/As/AsType 分层匹配哨兵值与结构化类型；Join 聚合多失败；WithCancelCause 传递取消根因。</li>
    <li>panic/recover 严格限于 MustCompile 类硬编码失效、HTTP 请求隔离、OOM 等不可恢复场景。</li>
    <li>网络/I/O 需区分临时错误与已处理字节数；自定义错误类型可携带 Path/Op 等结构化元数据。</li>
    <li>工程红线：不丢错误、不裸传无上下文、库不打日志、defer 在 err 检查之后。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>审计代码库中 <code>_, err :=</code> 与裸 <code>return err</code>，改为 %w 包装并附带函数名/操作上下文。</li>
    <li>新错误类型检查迁移到 <code>errors.AsType[T]</code>，消除 As 的反射 panic 风险。</li>
    <li>批量操作改用 errors.Join，并实现 Unwrap []error 遍历全部失败项。</li>
    <li>并发任务引入 WithCancelCause，日志中记录 context.Cause(ctx) 而非仅 Canceled。</li>
    <li>引入第三方库前检查其错误是否透传、是否吞错、是否带上下文。</li>
  </ol>
  <p><strong>关键认知转变：</strong>if err != nil 不是 Go 的缺陷而是设计选择——把错误留在控制流里，配合包装链与现代工具（Join、AsType、CancelCause），比隐式异常更能支撑大规模分布式系统的可观测性与确定性排障。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
