import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-passkey-record-crypto-passkey-api.svg');

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
<h1>Go 密码学维护者放大招：把 Passkey 存成一行字符串，还顺手为 Go 1.28 写好了 API</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Passkey</span>
  <span class="tag tag-green">WebAuthn</span>
  <span class="tag tag-orange">Go 1.28</span>
  <span class="tag tag-purple">crypto/passkey</span>
</div>
<p class="subtitle">本文解决的核心问题是：Passkey 防钓鱼价值巨大但服务端存储 schema 互不兼容时，如何借鉴密码哈希 PHC 字符串思路把 WebAuthn 凭证压缩成一行不透明 passkey record，并配合 crypto/passkey 无状态 API 与「Credential ID 不建索引」原则，实现可迁移、极简且安全的 Go 落地路径。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Passkey 落地链路</h3>
  <div class="diagram">
    <div class="node-orange">WebAuthn 复杂度<br><span style="font-size:11px;font-weight:400">各家 schema 不一</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">passkey record<br><span style="font-size:11px;font-weight:400">PHC 语法一行串</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">crypto/passkey<br><span style="font-size:11px;font-weight:400">注册/登录 API</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">不建 ID 索引<br><span style="font-size:11px;font-weight:400">免疫碰撞攻击</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">像对待 bcrypt 哈希一样对待 Passkey 凭证</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「必须对 Credential ID 做跨账号唯一性检查」——Filippo 指出碰撞攻击的前提是存在 Credential ID 索引；登录请求携带 userID、按用户查找 passkey record 时，其他账号是否有相同 ID 根本不重要。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】passkey record 一行字符串</h3>
  <p><strong>在讲什么问题：</strong>WebAuthn credential record 字段繁多，Google、Adam Langley 等给出的建表建议各不相同，换库换语言就要迁移数据。</p>
  <p><strong>核心机制：</strong>c2sp.org/passkey-record 借用 PHC 字符串语法（$webauthn$v=1$transports=...$），payload 复用 WebAuthn 已有的 authenticator data CBOR 编码，仅额外附加 transports 参数。</p>
  <p><strong>关键理解：</strong>应用层只需维护「用户账号 ↔ 多个 passkey record 不透明串」的关联，验证时把串交给库——与密码认证「一账号多哈希」同构。</p>
  <p><strong>典型场景：</strong>Go 服务端用 RelyingParty.NewRegistration/Register 完成注册，存一行 record；登录时 NewLogin → 缓存 request → Login 校验断言。</p>
  <p><strong>边界说明：</strong>浏览器交互复杂度无法消除；backed_up 状态因每次登录可能变化须单独存储更新；普通网站过度设计备份信号收益有限（多数仍保留邮箱重置）。</p>
  <div class="quote">原文：不要让攻击者决定你的 PRIMARY KEY，你就不会遇到 PRIMARY KEY 碰撞攻击。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】crypto/passkey 注册与登录流程</h3>
  <p><strong>核心思路：</strong>无状态 Go 包，返回的 JSON 可直接传给浏览器 parseCreationOptionsFromJSON / parseRequestOptionsFromJSON，接收 PublicKeyCredential.toJSON() 无需手动转换。</p>
  <p><strong>注册步骤：</strong>① RelyingParty.NewRegistration（传入用户信息与已有 record）② JSON 传浏览器 navigator.credentials.create() ③ RelyingParty.Register 校验 ④ 将返回的 passkey record 存入数据库。</p>
  <p><strong>登录步骤：</strong>① RelyingParty.NewLogin ② 以 RequestID 为 key 缓存 request（短 TTL）③ JSON 传 navigator.credentials.get() ④ Inspect 取 requestID 与 userID ⑤ 取用户 record 后 RelyingParty.Login。</p>
  <p><strong>应用层三件事：</strong>为每用户关联不透明永久 userID；存储 passkey record；缓存 NewLogin 产生的 request 挑战值。</p>
  <div class="pitfall"><strong>避坑：</strong>不要把 Credential ID 设为主键或建全局索引——这为 ID 碰撞攻击创造了前提；按 userID 查该用户名下 record 列表即可。</div>
  <div class="highlight"><strong>落地建议：</strong>元数据（昵称、创建/最后使用时间）自行存表，库不特殊处理；backed_up 单独字段并在每次登录后更新。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】Passkey 服务端常见误区</h3>
  <p><strong>Schema 碎片化（小心）：</strong>各框架自定义表结构导致换库即迁移；统一 passkey record 格式可跨语言保留凭证库。</p>
  <p><strong>Credential ID 全局唯一（致命若误用）：</strong>攻击者可在自己账号注册相同 ID 制造碰撞，前提是系统用 ID 索引查找；不建索引则攻击不存在。</p>
  <p><strong>backed_up 写入 record（小心）：</strong>record 不可变但 backed_up 每次登录可能变，必须独立存储更新。</p>
  <p><strong>过度依赖框架（可忽略小站）：</strong>把整个认证+DB 甩给框架不现实；无状态 API + 不透明串让应用层保持掌控。</p>
</div>

<div class="card">
  <h3>【决策/选型表】Passkey 存储方案对比</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐的方案</th><th>为什么不行</th></tr>
    <tr><td>Go 新项目 Passkey</td><td>passkey record + crypto/passkey 草案</td><td>一行串、互操作、API 已设计完整</td><td>自建多字段 WebAuthn 表</td><td>与社区标准脱节、迁移成本高</td></tr>
    <tr><td>可发现凭证登录</td><td>RelyingParty.NewLogin 流程</td><td>认证器自带 userID，体验最佳</td><td>仅用户名+二次验证</td><td>失去 Passkey 一键登录优势</td></tr>
    <tr><td>二次验证/重确认</td><td>NewLoginForUser</td><td>API 明确支持非 discoverable 场景</td><td>强行用 discoverable 流程</td><td>交互模式不匹配</td></tr>
    <tr><td>多库/多语言迁移</td><td>PHC 格式不透明串</td><td>换 Passkey 库或后端语言可保留 DB</td><td>框架私有 blob 格式</td><td>供应商锁定</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】密码哈希 vs Passkey record</h3>
  <table>
    <tr><th>对比维度</th><th>密码哈希（bcrypt 等）</th><th>passkey record</th><th>一句话结论</th></tr>
    <tr><td>存储形态</td><td>PHC 一行不透明串</td><td>同样 PHC 语法一行串</td><td>应用层处理模式完全同构</td></tr>
    <tr><td>防钓鱼</td><td>不能（可被钓鱼站骗取）</td><td>协议层绑定源站，钓鱼失效</td><td>Passkey 是信息安全最重要进展之一</td></tr>
    <tr><td>一账号多条</td><td>通常一条（可多条历史）</td><td>天然支持多设备多 record</td><td>关联表设计类似</td></tr>
    <tr><td>可变状态</td><td>一般不变</td><td>backed_up 须单独维护</td><td>唯一需要额外字段的例外</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】像密码哈希一样思考 Passkey</h3>
  <p><strong>原则：</strong>Passkey 服务端复杂度中，有一部分可通过标准化可互操作存储格式抹平——让库处理验证，让应用只维护关联关系。</p>
  <p><strong>为什么重要：</strong>网络钓鱼无法靠教育解决，Passkey 从协议层让钓鱼失效；但实现体验若比密码哈希复杂十倍， adoption 会被拖慢。</p>
  <p><strong>怎么落地：</strong>① 关注 c2sp.org/passkey-record 与 Go crypto/passkey 提案反馈 ② 注册/登录走 RelyingParty 双流程 ③ userID 查找 record，不建 Credential ID 全局索引 ④ backed_up 独立字段按登录更新。</p>
  <p><strong>适用边界：</strong>API 尚未实现，需等社区反馈后可能进入 Go 1.28；生产前须跟踪提案状态。</p>
  <div class="quote">原文：Passkey 是目前唯一一个从协议层面就能杜绝钓鱼的方案——不是让人更小心，而是让这类攻击从根上失效。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：WebAuthn 规范保守派 / 「必须严格执行 Credential ID 跨账号唯一检查」</p>
  <p class="rebuttal-text">规范写 SHOULD 检查是因为默认假设你用 Credential ID 做索引查找——若登录流本就携带 userID 并按用户查 record，碰撞攻击前提消失，强行建全局唯一索引反而为攻击者开门。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Passkey 防钓鱼价值巨大，但服务端 schema 碎片化是落地摩擦源。</li>
    <li>passkey record 用 PHC 语法+authenticator data CBOR，一行串实现互操作与可迁移。</li>
    <li>crypto/passkey 草案给出完整注册/登录无状态 API，JSON 与浏览器原生接口无缝对接。</li>
    <li>Credential ID 不建索引即可免疫碰撞攻击——不要让攻击者决定 PRIMARY KEY。</li>
    <li>backed_up 是唯一须单独维护的可变状态；其余元数据应用层自管。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>阅读 c2sp.org/passkey-record 规范草案，评估现有 WebAuthn 表结构迁移成本。</li>
    <li>跟踪 crypto/passkey Go 提案，在 Go 1.28 提案窗口提交集成反馈。</li>
    <li>重构存储：用户表关联多行 passkey record 不透明串，而非拆散 WebAuthn 字段。</li>
    <li>移除 Credential ID 全局唯一索引，改为 userID → record 列表查找。</li>
    <li>为 backed_up 增加独立字段，在每次 Login 成功后更新。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「WebAuthn 是一堆复杂字段要精心设计表」升级为「Passkey 就是下一时代的密码哈希——一行不透明串，库负责验证，应用负责关联」。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
