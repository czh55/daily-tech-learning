import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-maps-same-proposal-accepted.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
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
<h1>为了一个函数名，Go官方吵了两个月：maps.Same提案近日正式通过</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 标准库</span>
  <span class="tag tag-green">maps.Same</span>
  <span class="tag tag-orange">提案 #78456</span>
  <span class="tag tag-purple">API 设计</span>
</div>
<p class="subtitle">本文解决的核心问题是：Go 的 map 明明是引用类型，为何不能用 == 判断「是否同一引用」、maps.Same 提案如何用一条 CMP 指令安全收编 reflect+unsafe 手搓模式，以及命名、nil/NaN 边界语义与泛型签名在委员会里经历了怎样的四轮拉锯才最终 accepted。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">maps.Same 提案的四条战线</h3>
  <div class="diagram">
    <div class="node">命名<br><span style="font-size:11px;font-weight:400">Identical → Same</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">边界语义<br><span style="font-size:11px;font-weight:400">nil 指针 · NaN 陷阱</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">泛型签名<br><span style="font-size:11px;font-weight:400">v1→v2→否决 v3</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">范围约束<br><span style="font-size:11px;font-weight:400">slices 排除在外</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">核心实现：maps.Same 比较 hmap 指针，编译后约一条 CMP 指令 · CL 794421 已提交</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「maps.Same 为真 = 两个 map 内容相等」——正确理解是：Same 只做引用同一性（指针）比较，与 maps.Equal 的内容相等语义完全不同；在含 NaN 键的 map 上，把 Same 当成 Equal 的优化捷径会产生反直觉结果。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】maps.Same 是什么</h3>
  <p><strong>在讲什么问题：</strong>Go 禁止对 map 使用 ==（除与 nil 比较外），但判断「x 和 y 是否指向同一份底层哈希表」在 union 短路、别名检测等场景有实际需求。</p>
  <p><strong>核心机制：</strong>在 maps 包新增 <code>Same[MX, MY ~map[K]V, K comparable, V any](x MX, y MY) bool</code>，内部用 unsafe.Pointer 读取 map 变量的指针表示并比较，编译后约一条 CMP 指令，对外暴露类型安全接口。</p>
  <p><strong>关键理解：</strong>map 在运行时是 hmap 指针，Same 收编了大家用 reflect.ValueOf(x).UnsafePointer() 手搓的模式——既丑且 reflect 开销大，而操作本身内存安全。</p>
  <p><strong>典型场景：</strong>实现 <code>union(x, y)</code> 时若 Same(x,y) 为真可直接返回 x，省掉深拷贝；泛型工具函数内部对两个类型形参实例化后的 map 做别名短路。</p>
  <p><strong>边界说明：</strong>只适用于 map，不涵盖 slice（值语义 len/cap 与引用语义交织，需单独立项）；不能把 Same 等同于内容相等。</p>
  <div class="quote">「Maps in Go are references yet the core language provides no safe way to ask whether they alias.」——提案文档注释</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Same vs Equal vs reflect 手搓</h3>
  <table>
    <tr><th>对比维度</th><th>maps.Same</th><th>maps.Equal（已有）</th><th>reflect.UnsafePointer</th></tr>
    <tr><td>比较对象</td><td>是否同一 hmap 引用</td><td>键值对内容是否相等</td><td>底层指针地址</td></tr>
    <tr><td>编译期安全</td><td>类型安全，标准库 API</td><td>类型安全</td><td>需 unsafe，易误用</td></tr>
    <tr><td>运行时开销</td><td>约一条 CMP</td><td>O(n) 遍历</td><td>reflect 调用链开销大</td></tr>
    <tr><td>NaN 键行为</td><td>指针相同即 true，≠ 内容相等</td><td>按 Go 相等规则</td><td>同 Same 语义但笨重</td></tr>
    <tr><td>一句话结论</td><td>别名检测专用</td><td>深比较专用</td><td>应被 Same 替代</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】maps.Same 落地用法</h3>
  <p><strong>方法名：</strong>maps.Same（原 Identical，#78456 accepted）</p>
  <p><strong>核心思路：</strong>在需要「同一引用」短路的分支用 Same，在需要「内容一致」时用 Equal，二者不可互换。</p>
  <p><strong>操作步骤：</strong>① 升级 Go 版本至包含 CL 794421 的发行版；② import "maps"；③ 将 reflect+unsafe 别名判断替换为 maps.Same(x,y)；④ 对 float 键 map 的 union/intersect 保留完整 Equal 路径，勿仅凭 Same 跳过比较。</p>
  <p><strong>选型条件：</strong>集合运算、缓存命中检测、避免重复拷贝时选 Same；需要值语义相等时选 Equal。</p>
  <div class="pitfall"><strong>避坑：</strong>含 NaN 键的 Set{NaN:{}} 调用 union(s,s) 时 Same 为真会提前返回，若误以为 Same 蕴含 Equal 会在优化逻辑里埋雷。</div>
  <div class="quote">「Beware that some shortcuts based on Same(x, y) may have surprising behavior for maps containing floating-point NaNs, since NaN != NaN.」——标准库文档警告</div>
</div>

<div class="card">
  <h3>【决策/选型表】四条战线的设计取舍</h3>
  <table>
    <tr><th>争议点</th><th>最终决策</th><th>核心理由</th><th>被否决方案</th><th>为什么不行</th></tr>
    <tr><td>函数命名</td><td>maps.Same</td><td>避免与 types.Identical 混淆，呼应 os.SameFile</td><td>Identical / IsAliased</td><td>易被误解为深度相等或类型同一性</td></tr>
    <tr><td>两个 nil map</td><td>Same(nil,nil) = true</td><td>与 m==nil 语义一致，map 即指针</td><td>nil 不算 Same</td><td>与语言既有 nil 比较矛盾</td></tr>
    <tr><td>泛型签名</td><td>共享 K、V 的 v2</td><td>保留编译期类型检查，覆盖主要场景</td><td>v3 独立 K1/V1/K2/V2</td><td>可能静默永远 false，等 #77052 再议</td></tr>
    <tr><td>slices 扩展</td><td>排除在本提案外</td><td>slice 值语义+引用语义交织，无唯一答案</td><td>len 与 &amp;s[0] 判断</td><td>空切片 panic，x 与 x[:5] 语义模糊</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】使用 maps.Same 的三条铁律</h3>
  <p><strong>坑名：</strong>把 Same 当 Equal 的快捷替代</p>
  <p><strong>原因：</strong>NaN != NaN，指针相同不等于键值内容逻辑相等。</p>
  <p><strong>原文说法：</strong>官方在文档中保留完整 union(s,s) 与 Set{NaN:{}} 的反直觉示例。</p>
  <p><strong>解法：</strong>优化短路前明确「我只关心别名」；涉及 float 键时双重检查。</p>
  <p><strong>严重程度：</strong>小心——逻辑正确性在特定数据集上翻车。</p>
  <div class="pitfall"><strong>坑名：</strong>期待 v3 超宽签名立刻落地——委员会已搁置，需等 #77052 证据。</div>
  <div class="pitfall"><strong>坑名：</strong>自行给 slices 包仿写 Same——空切片 &amp;s[0] panic，部分重叠无标准答案。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】Go 标准库 API 的设计哲学</h3>
  <p><strong>原则：</strong>一个提案只解决一个明确问题——哪怕 slices.Same 看起来顺手，也不塞进 map 提案。</p>
  <p><strong>为什么重要：</strong>标准库 API 向后兼容几十年，三行函数也要在命名、边界、签名上吵数月。</p>
  <p><strong>怎么落地：</strong>① 跟踪 golang/go#78456 与 CL 794421；② 新代码优先 maps.Same 替代 reflect 手搓；③ 参与提案评论时区分 identity vs equality。</p>
  <p><strong>适用边界：</strong>日常业务若只做深比较，继续用 maps.Equal 即可，不必强行引入 Same。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「为个指针比较吵两个月是小题大做，直接用 unsafe 一行搞定」</p>
  <p class="rebuttal-text">标准库一旦收录就要兼容数十年，reflect 手搓虽能跑却散布 unsafe 知识、性能差且难统一语义——Same 的价值正是把安全别名检测变成人人可维护的一等公民。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>maps.Same 为 #78456 提案核心，用指针比较解决 map 引用同一性检测，编译后约零开销，已 accepted 且 CL 794421 进入实现。</li>
    <li>函数由 Identical 改名为 Same，避免与 types.Identical 及「深度相等」混淆；两个 nil map 判定为 Same 以契合 m==nil 语义。</li>
    <li>含 NaN 键的 map 上不可把 Same 当作 Equal 的优化替代，官方文档保留完整警告示例。</li>
    <li>泛型签名从 v1 演进到共享 K/V 的 v2，更灵活的 v3 被搁置待 #77052；slices 类似函数被明确排除在本提案外。</li>
    <li>整场讨论体现 Go 团队「想清楚了再落笔」的标准库治理风格。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>Star/watch golang/go#78456，关注 CL 794421 合入的 Go 版本。</li>
    <li>代码库中搜索 reflect.ValueOf.*UnsafePointer 的 map 别名判断，计划迁移为 maps.Same。</li>
    <li>审查集合运算（union/intersect）中对 float 键 map 的短路逻辑，确认未误用 Same 替代 Equal。</li>
    <li>团队内区分 Same（别名）与 Equal（内容）的使用场景，写入 code review checklist。</li>
    <li>若需要 slice 别名检测，等待未来独立提案而非自行 unsafe 仿写。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>maps.Same 不是「又给 map 加个 ==」，而是把「引用同一性」从不可表达、只能 reflect 手搓的灰色地带，收编为标准库里语义清晰、性能无损的一等操作——Go 的审慎不在于函数行数，而在于几十年 API 契约的精确性。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
