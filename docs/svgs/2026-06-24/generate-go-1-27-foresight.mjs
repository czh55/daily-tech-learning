import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-1-27-foresight.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.diagram{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:160px;font-weight:700;font-size:16px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:24px;color:#94a3b8}
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
<h1>Go 1.27 新特性前瞻：泛型方法落地，标准库内建 UUID</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 语言</span>
  <span class="tag tag-green">标准库</span>
  <span class="tag tag-orange">性能优化</span>
  <span class="tag tag-purple">后量子加密</span>
</div>
<p class="subtitle">本文解决的核心问题是：Go 1.27 在语言特性、运行时性能、工具链与标准库四个维度分别补齐了哪些长期短板，以及开发者在升级 RC 版本时应如何评估泛型方法、encoding/json/v2、内建 uuid 包与后量子加密套件对现有工程的影响。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">泛型方法<br><span style="font-size:13px;font-weight:400">语言补全</span></div>
    <span class="arrow-sym">+</span>
    <div class="node-green">json/v2 + uuid<br><span style="font-size:13px;font-weight:400">标准库扩容</span></div>
    <span class="arrow-sym">+</span>
    <div class="node-orange">微小分配优化<br><span style="font-size:13px;font-weight:400">运行时</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">云原生工程底座<br><span style="font-size:13px;font-weight:400">全面升级</span></div>
    <span class="arrow-sym">+</span>
    <div class="node-green">ML-DSA/ML-KEM<br><span style="font-size:13px;font-weight:400">安全防御</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「泛型方法 = 接口也能泛型化」—— Go 1.27 明确禁止接口方法声明类型参数，且接口方法不能由泛型方法实现；泛型方法主要用于具体结构体的业务逻辑组织，而非动态多态。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】泛型方法（Generic Methods）</h3>
  <p><strong>在讲什么问题：</strong>自 Go 1.18 引入泛型以来，方法无法声明独立类型参数的最大遗憾如何在 1.27 被补齐。</p>
  <p><strong>核心机制：</strong>非泛型结构体的方法现在可拥有自己的类型参数 T，将原本只能写成包级泛型函数的代码收拢到类型命名空间内，例如 Converter.ConvertToString[T any](val T)。</p>
  <p><strong>关键理解：</strong>这是编译器抽象能力的补全，让泛型逻辑与数据类型绑定更自然，减少全局函数污染。</p>
  <p><strong>典型场景：</strong>为非泛型结构体编写可处理任意类型的转换、序列化、校验方法时。</p>
  <p><strong>边界说明：</strong>接口方法仍不允许类型参数；泛型方法不能用于实现接口方法——动态多态场景继续用接口 + 结构体级泛型。</p>
  <div class="quote">「方法现在可以拥有自己的类型参数了！你可以非常自然地将泛型函数收拢在特定数据类型的命名空间内。」</div>
  <div class="relation"><strong>相关概念：</strong>与包级泛型函数互补——前者组织业务逻辑，后者适合无接收者的工具函数。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】encoding/json/v2 正式落地</h3>
  <p><strong>在讲什么问题：</strong>历经数年论证的新一代 JSON 库如何从实验特性变为标准库正式成员。</p>
  <p><strong>核心机制：</strong>v2 默认拒绝非法 UTF-8 和重复键名；Unmarshal 性能飞跃，Marshal 与 v1 持平；v1 底层已切换为 v2 引擎，通过 Options 保持兼容模式。</p>
  <p><strong>关键理解：</strong>更严苛默认值提升安全性，性能红利集中在反序列化路径——高吞吐 API 服务受益最大。</p>
  <p><strong>典型场景：</strong>微服务 JSON 解析密集、需要严格输入校验的 API 网关。</p>
  <p><strong>边界说明：</strong>依赖宽松解析（重复键覆盖、脏 UTF-8 容忍）的旧代码需显式配置 v1 兼容 Options 或 GOEXPERIMENT=nojsonv2 回退。</p>
  <div class="highlight"><strong>落地：</strong>升级后先跑集成测试；若解析失败，检查是否传入含重复键或非法 UTF-8 的 JSON，用 v1 Options 过渡。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】协程泄露分析（Goroutine Leak Profile）</h3>
  <p><strong>标签：</strong>生产排障 / 可观测性</p>
  <p><strong>核心思路：</strong>复用 GC 标记能力，判定挂起在 Channel/Mutex 上且永远不可达的协程为「永久泄露」，零误报。</p>
  <p><strong>操作步骤：</strong>① 通过 runtime/pprof 生成 goroutineleak 报告；② 或访问 /debug/pprof/goroutineleak；③ 定位偏死锁协程；④ 结合堆栈修复 Channel 阻塞或锁竞争。</p>
  <p><strong>选型条件：</strong>生产环境在线排查僵尸协程、偏死锁时首选——Go 1.26 实验特性在 1.27 正式转正。</p>
  <p><strong>避坑：</strong>不要与普通 goroutine profile 混淆——leak profile 只报告 GC 判定不可达的挂起协程。</p>
  <div class="quote">「这是生产环境在线排查偏死锁的核弹级武器，真正做到了零误报。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Go 1.26 vs Go 1.27 关键升级</h3>
  <table>
    <tr><th>对比维度</th><th>Go 1.26</th><th>Go 1.27</th><th>一句话结论</th></tr>
    <tr><td>泛型能力</td><td>仅结构体/函数级类型参数</td><td>方法可声明独立类型参数</td><td>1.27 补齐泛型最后一块拼图</td></tr>
    <tr><td>JSON 处理</td><td>json/v2 实验特性</td><td>v2 正式版，v1 底层切换引擎</td><td>反序列化性能质变，默认更严格</td></tr>
    <tr><td>UUID 依赖</td><td>第三方 github.com/google/uuid</td><td>标准库内建 uuid 包</td><td>可删除第三方依赖，降低供应链风险</td></tr>
    <tr><td>协程排障</td><td>goroutineleak 实验特性</td><td>正式转正，/debug/pprof 可用</td><td>生产排障能力大幅增强</td></tr>
    <tr><td>加密安全</td><td>传统 RSA/ECDSA</td><td>ML-DSA + ML-KEM 后量子套件</td><td>面向量子计算威胁的前瞻布局</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】Go 1.27 新特性采用指南</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>非泛型结构体需泛型方法</td><td>Go 1.27 泛型方法</td><td>代码组织更自然，告别包级妥协函数</td><td>继续写包级泛型函数</td><td>命名空间污染，可读性差</td></tr>
    <tr><td>高吞吐 JSON API</td><td>encoding/json/v2 或默认 v1（已用 v2 引擎）</td><td>Unmarshal 性能飞跃</td><td>维持旧版宽松解析习惯</td><td>重复键/脏 UTF-8 将被拒绝</td></tr>
    <tr><td>新项目 UUID 生成</td><td>标准库 uuid 包</td><td>内建、高性能、零第三方依赖</td><td>继续引 google/uuid</td><td>多余依赖与版本冲突风险</td></tr>
    <tr><td>二进制体积极度敏感</td><td>GOEXPERIMENT=nosizespecializedmalloc</td><td>关闭微小分配优化，省约 60KB</td><td>默认开启且忽略体积</td><td>嵌入式场景 60KB 可能超标</td></tr>
    <tr><td>长期安全基础设施</td><td>crypto/mldsa + TLS ML-KEM</td><td>后量子加密先发优势</td><td>仅传统 RSA/ECDSA</td><td>量子计算逼近后面临失效风险</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Go 1.27 升级常见陷阱</h3>
  <p><strong>坑名：</strong>json/v2 默认拒绝重复键名导致旧 API 解析失败。</p>
  <p><strong>原因：</strong>v1 底层切换 v2 引擎，默认行为更严格。</p>
  <p><strong>原文说法：</strong>v2 包默认拒绝 JSON 对象中出现重复的键名。</p>
  <p><strong>解法：</strong>用 v1 Options 配置兼容模式，或 GOEXPERIMENT=nojsonv2 临时回退。</p>
  <p><strong>严重程度：</strong>致命（生产 API 大面积 500）。</p>
  <div class="pitfall"><strong>另一坑：</strong>泛型方法用于实现接口——编译器直接拒绝。严重程度：小心（设计阶段需调整架构）。</div>
  <div class="pitfall"><strong>再一坑：</strong>asynctimerchan GODEBUG 永久移除，time 通道永远无缓冲。严重程度：小心（依赖异步定时器通道的旧代码行为变化）。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】渐进式拥抱 Go 1.27</h3>
  <p><strong>原则：</strong>在保持大道至简的同时，用 RC 版本提前验证，而非等正式版踩坑。</p>
  <p><strong>为什么重要：</strong>json/v2 引擎切换和严格默认值是静默破坏性变更，无集成测试覆盖极易上线翻车。</p>
  <p><strong>原文支撑：</strong>Go 1.27 预计 2026 年 8 月正式发布，现在即可通过官方预览版或 Go Playground dev branch 体验。</p>
  <p><strong>怎么落地：</strong>① 下载 RC 在 CI 跑全量测试；② go fix 自动现代化陈旧写法；③ go mod tidy 享受双块布局；④ 生产启用 goroutineleak profile 监控。</p>
  <p><strong>适用边界：</strong>关键金融/安全系统可等 1.27.1 补丁版；探索性项目可立即尝鲜。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Rust 生态拥趸 / 「系统编程应追求零成本抽象」派</p>
  <p class="rebuttal-text">Go 1.27 的泛型方法和 json/v2 不过是追赶 Rust 五年前就有的能力——微小分配 1% 性能提升换 60KB 二进制膨胀，后量子加密更是过度工程；在云原生赛道 Go 的护城河是生态惯性而非技术领先，这些补丁改变不了「没有所有权系统就注定内存安全靠自觉」的根本短板。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>泛型方法补齐 Go 泛型最后短板，但接口方法仍不可用——主要用于结构体业务逻辑组织。</li>
    <li>encoding/json/v2 正式落地，Unmarshal 性能飞跃，默认更严格，v1 底层已切换引擎。</li>
    <li>标准库内建 uuid 包可删除 google/uuid 第三方依赖。</li>
    <li>微小分配优化提速 30%（小于 80 字节对象），整体约 1%；goroutineleak profile 正式转正。</li>
    <li>ML-DSA/ML-KEM 后量子加密套件为未来十年安全筑墙；实验性 simd 包开放硬件加速。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>下载 Go 1.27 RC，在 CI 管道跑全量集成测试，重点关注 JSON 解析路径。</li>
    <li>运行 go fix 检测并自动现代化项目中的陈旧写法。</li>
    <li>评估是否将 github.com/google/uuid 迁移为标准库 uuid 包。</li>
    <li>在生产环境启用 /debug/pprof/goroutineleak 监控僵尸协程。</li>
    <li>阅读 tip.golang.org/doc/go1.27 Release Notes 全文，标记团队需适配的破坏性变更。</li>
  </ol>
  <p><strong>关键认知转变：</strong>Go 1.27 不是「又一个小版本」——它是泛型补全、标准库收拢、后量子安全三线并进的能力扩容，升级评估应从「语言新语法」扩展到「JSON 引擎静默切换」和「加密套件前瞻布局」三个维度。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
