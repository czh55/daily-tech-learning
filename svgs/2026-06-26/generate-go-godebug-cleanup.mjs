import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-godebug-cleanup.svg');

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
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:140px;font-weight:700;font-size:16px;color:#1e40af}
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
<h1>偿还十年技术债：Go 1.27 GODEBUG 强力清理计划</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Go 1.27</span>
  <span class="tag tag-green">GODEBUG</span>
  <span class="tag tag-orange">兼容性</span>
  <span class="tag tag-red">技术债</span>
</div>
<p class="subtitle">本文解决的核心问题是：Go 在 Go 1 兼容性承诺与 GODEBUG 临时开关无限膨胀之间如何破局——Issue #76163 将 GODEBUG 分为四类并强制最多 2 年保质期，Go 1.27 更以编译期阻断和启动期 Panic 铁腕执行清理，让运行时不再被历史分支拖垮。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">Go 1 兼容性<br><span style="font-size:13px;font-weight:400">2012 起基石</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">GODEBUG 临时开关<br><span style="font-size:13px;font-weight:400">指数级膨胀</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">Issue #76163<br><span style="font-size:13px;font-weight:400">四类分级政策</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Go 1.27 执行<br><span style="font-size:13px;font-weight:400">编译阻断+启动 Panic</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">runtime.SetGODEBUG<br><span style="font-size:13px;font-weight:400">显式 API 替代</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「GODEBUG 只是环境变量，删了也不影响编译」—— 实际上每个 GODEBUG 选项都在 Runtime 内留下一条兼容分支，测试矩阵呈排列组合爆炸，且 Go 1.27 起对已删除选项设非默认值会直接编译失败或启动 Panic。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】GODEBUG 与 #76163 四类分级</h3>
  <p><strong>在讲什么问题：</strong>Go 为平滑升级引入的 GODEBUG 机制如何从「临时续命」变成十年技术债，官方如何用四类分级强制退场。</p>
  <p><strong>核心机制：</strong>核心行为变更时提供 GODEBUG 标记（如 panicnil=1）让旧程序继续运行；#76163 将选项分为四类：已删归档（Cat1）、有期限临时（Cat2）、无期限强制转 Cat2 并赋 2 年保质期（Cat3）、永久保留如 netdns（Cat4）。</p>
  <p><strong>关键理解：</strong>除极少数 Cat4 永久项，任何临时开关最多存活 4 个大版本（不少于 2 年），到期不改代码的旧系统将被编译器审判。</p>
  <p><strong>典型场景：</strong>升级 Go 1.27 前审计 go.mod 的 godebug 块和源码 //go:debug 注释，清理已 Slated for removal 的非默认值。</p>
  <p><strong>边界说明：</strong>Cat4 永久标记除非有高层级提案并提供无痛替代，否则严禁删除；Cat1 名称永久保留在内部清单禁止复用。</p>
  <div class="quote">「除了极少数系统底层所需的永久性选项，任何为了平稳升级而引入的 GODEBUG 标记，都只有最多 2 年的保质期。」</div>
  <div class="relation"><strong>相关概念：</strong>与 Feature Flag / Deprecation Policy 同源——Go 选择语言级强制而非仅靠文档警告。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Go 1.27 强制净化三防线</h3>
  <p><strong>标签：</strong>升级 Go 1.27 / 清理 GODEBUG / 生产迁移</p>
  <p><strong>核心思路：</strong>在编译、启动、运行三阶段分层拦截已删除的 GODEBUG 旧行为，同时引入显式 API 取代 os.Setenv。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 审计 go.mod 中 godebug 块：保留已删选项的最终默认值可编译，设非默认值（如 gotypesalias=0）会 go build 失败</p>
  <p>2. 检查环境变量 GODEBUG：export GODEBUG=asynctimerchan=1 等已删旧值会在 parsegodebug 阶段启动 Panic</p>
  <p>3. 迁移到 runtime.SetGODEBUG(name, value)：非法或已删选项直接 panic；用 GetGODEBUG 查询当前值</p>
  <p>4. 运行 go vet：对 os.Setenv("GODEBUG", ...) 报 Deprecated 警告，推动代码改造</p>
  <p><strong>选型条件：</strong>需要程序内动态调 GODEBUG 时用 SetGODEBUG；第三方库通过 os.Setenv 修改时运行时会静默忽略以避免线上雪崩。</p>
  <div class="pitfall"><strong>避坑：</strong>不要指望 os.Setenv 在启动后还能恢复旧行为——对已删选项会被忽略；也不要在 go.mod 保留旧非默认值指望「还能跑」。</div>
  <div class="quote">Robert Griesemer：提案通过不会阻碍 Go 1.27 发布，因 CL 784221、CL 788340 的底层防御代码早已合并。</div>
</div>

<div class="card">
  <h3>【决策/选型表】GODEBUG 四类标记怎么处理</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>go.mod 含已删 GODEBUG 名</td><td>保留最终默认值或删除该行</td><td>Go 1.27 允许保留名称若值为最终默认</td><td>设为旧非默认值 0</td><td>编译期直接报错拒绝 build</td></tr>
    <tr><td>生产环境变量注入旧开关</td><td>移除 GODEBUG 或更新到新默认行为</td><td>启动期 parsegodebug 会 Panic Abort</td><td>指望运维脚本悄悄 export</td><td>程序一行业务代码都跑不到就崩溃</td></tr>
    <tr><td>应用代码需运行时调开关</td><td>runtime.SetGODEBUG + GetGODEBUG</td><td>类型安全、非法值立刻 panic、官方推荐路径</td><td>继续 os.Setenv("GODEBUG")</td><td>已 Deprecated，go vet 警告且语义混乱</td></tr>
    <tr><td>第三方库 Setenv 改 GODEBUG</td><td>升级库版本或 fork 修复</td><td>运行时对 os.Setenv 已删项静默忽略，旧行为不会恢复</td><td>假设 Setenv 能续命</td><td>你以为开了旧模式，实际已被忽略</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】GODEBUG 清理 vs 传统 Deprecation</h3>
  <table>
    <tr><th>对比维度</th><th>Go GODEBUG #76163</th><th>典型语言 Deprecation</th><th>一句话结论</th></tr>
    <tr><td>强制执行</td><td>编译失败 + 启动 Panic</td><td>多为编译警告或文档</td><td>Go 把「软弃用」升级为「硬切断」</td></tr>
    <tr><td>时间盒</td><td>Cat3 强制 2 年（4 版本）</td><td>往往无硬性 deadline</td><td>Go 给技术债设了法定保质期</td></tr>
    <tr><td>第三方库影响</td><td>os.Setenv 静默忽略保稳定</td><td>通常各库自行适配</td><td>Go 在铁腕与线上稳定间做了分层妥协</td></tr>
    <tr><td>永久例外</td><td>Cat4 如 netdns 需高层提案</td><td>核心 API 长期保留</td><td>极少数底层开关仍可与语言同寿</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】升级 Go 1.27 的 GODEBUG 雷区</h3>
  <p><strong>坑名：</strong>go.mod 里 gotypesalias=0 导致 CI 全线编译失败</p>
  <p><strong>原因：</strong>编译期 Barrier 拒绝已删选项的非默认值</p>
  <p><strong>原文说法：</strong>「只有当你试图将其设为旧的非默认值时，编译才会失败」</p>
  <p><strong>解法：</strong>改为最终默认值 1 或删除该 godebug 行，在 release notes 查 Slated for removal 列表</p>
  <p><strong>严重程度：</strong>致命</p>
  <div class="pitfall"><strong>坑名：</strong>K8s/Docker 镜像 ENTRYPOINT 注入 GODEBUG 旧值 → 启动即 Panic<br><strong>解法：</strong>扫描 Deployment 环境变量和启动脚本，与 #76163 四类清单对照<br><strong>严重程度：</strong>致命</div>
</div>

<div class="card">
  <h3>【心法/原则卡】有限兼容 vs 无限妥协</h3>
  <p><strong>原则：</strong>向后兼容是美德，无底线兼容会让底座在分支中腐烂——必须学会对历史包袱说不。</p>
  <p><strong>为什么重要：</strong>每一个 GODEBUG 分支都让编译器测试成为排列组合噩梦，拖慢核心算法升级和安全修复。</p>
  <p><strong>原文支撑：</strong>「擦干冗余的分支，还系统以最初的简单。这，正是 Go 语言历经大浪淘沙后，依然坚如磐石的终极秘密。」</p>
  <p><strong>怎么落地：</strong>为企业内层服务建立类似 Cat1–Cat4 的分级弃用策略：临时开关必须带删除日期，到期前一个版本公告，到期编译/启动硬失败。</p>
  <p><strong>适用边界：</strong>面向外部开发者的公共 API 仍需更长过渡期；Cat4 级底层行为变更需标准委员会级评审。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：遗留系统维护者 / 「Never break userspace」派</p>
  <p class="rebuttal-text">你们用编译失败和启动 Panic 清 GODEBUG，等于把十年间靠临时开关撑住的银行核心、电信计费、工控网关一次性推上改造悬崖——Go 1 承诺的「无需修改即可编译运行」在关键基础设施上已被你们自己亲手击穿，2 年保质期对需要五证联审的行业连需求评审都跑不完。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Issue #76163 将 GODEBUG 分为四类，临时开关最多 2 年（4 版本）必须退场</li>
    <li>Go 1.27 已落地编译期阻断、启动期 Panic、os.Setenv 静默忽略三层机制（CL 784221/788340）</li>
    <li>runtime.SetGODEBUG/GetGODEBUG 取代 os.Setenv，go vet 对旧写法报 Deprecated</li>
    <li>go.mod 可保留已删选项的最终默认值，非默认值会编译失败</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>grep 全仓库 go.mod、godebug、//go:debug、GODEBUG 环境变量</li>
    <li>对照 Go 1.27 release notes 中 Slated for removal 列表逐项迁移</li>
    <li>CI 升级到 Go 1.27 RC 跑一遍 build + 集成测试捕获启动 Panic</li>
    <li>将应用内 GODEBUG 修改迁移到 runtime.SetGODEBUG</li>
    <li>为团队制定内部分级弃用策略文档，避免再造无期限临时开关</li>
  </ol>
  <p><strong>关键认知转变：</strong>GODEBUG 不是「永久逃生舱」，而是带保质期的过渡协议——Go 1 兼容 promise 仍在，但「不改代码永远续命旧行为」的时代结束了。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
