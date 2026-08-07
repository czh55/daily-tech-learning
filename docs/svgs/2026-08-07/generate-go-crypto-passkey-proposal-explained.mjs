import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-crypto-passkey-proposal-explained.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#0d9488,#14b8a6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #14b8a6}
.card h3{font-size:22px;font-weight:700;color:#0f766e;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#ccfbf1;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#115e59;border-left:4px solid #14b8a6}
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ecfdf5,#ccfbf1);border:2px solid #5eead4;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#115e59}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#0f766e;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Go 密码学前掌门人亲自提案：crypto/passkey 要把「免密登录」这件事一次性做对</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">Go 标准库</span>
  <span class="tag tag-blue">WebAuthn / Passkey</span>
  <span class="tag tag-orange">crypto/passkey</span>
  <span class="tag tag-purple">passkey-record</span>
  <span class="tag tag-red">无状态 API</span>
</div>
<p class="subtitle">本文解决的核心问题是：两年前用 Go 接 Passkey 还得自己搭会话、适配各家存储接口，Filippo Valsorda 提出的 crypto/passkey 能否用「无状态、无回调、无接口」把中小型网站的免密登录门槛压到「存一个字符串」？</p>

<div class="map">
  <h3 style="font-size:20px;color:#0f766e;margin-bottom:12px;text-align:center">Passkey 接入演进：痛点 → 提案解法 → 存储模型</h3>
  <div class="diagram">
    <div class="node-red">2024 生态<br>第三方库 · 会话状态 · 存储接口各异</div>
    <span class="arrow-sym">→</span>
    <div class="node">crypto/passkey<br>无状态 RelyingParty<br>ParseResponse 显式流</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">passkey-record<br>单行不透明字符串<br>仅按 user_id 索引</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">提案仍处 golang/go#80663 评审阶段，面向 95% 消费级 Web，非超大规模平台</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：Passkey 是新协议、或 crypto/passkey 会取代所有 WebAuthn 库。Passkey 本质是 WebAuthn 可发现凭据的消费级命名；官方包定位是中小型站点服务端 API，大企业仍可能需要 attestation、多租户等完整能力。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Passkey 与 WebAuthn 凭据模型</h3>
  <p><strong>在讲什么问题：</strong>密码可被记住、输入、撞库、钓鱼；短信/TOTP/魔法链接只是打补丁，认证核心仍是可被窃取的字符串。</p>
  <p><strong>核心机制：</strong>设备生成公私钥对，私钥永不离开设备；登录时网站发 challenge，设备签名且把 origin 签入断言，网站用公钥验签——钓鱼站拿不到能在真实站点复用的签名。</p>
  <p><strong>关键理解：</strong>每个站点独立密钥对，天然防重用；浏览器/系统（iCloud 钥匙串、Google 密码管理器、Windows Hello）负责同步与跨设备 hybrid 传输。</p>
  <p><strong>典型场景：</strong>消费级 Web/App 注册与登录「一次生物识别、零密码输入」。</p>
  <p><strong>边界说明：</strong>不解决账号恢复策略、企业设备 attestation 合规、Legacy 浏览器全覆盖——提案进一步为 95% 场景砍掉 attestation 与签名计数器校验。</p>
  <div class="quote">原文：「Passkey 不是一个新协议，而是 WebAuthn 可发现凭据的消费级马甲名。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】crypto/passkey 注册与登录流</h3>
  <p><strong>核心思路：</strong>RelyingParty 是纯配置对象，库内零 I/O、零回调、零存储接口——应用自己管 challenge 与数据库。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 注册：<code>NewRegistration(user, existingRecords)</code> → 前端 <code>navigator.credentials.create()</code> → <code>Register(responseJSON)</code> 得 record 字符串入库。</p>
  <p>2. 登录：前端 <code>navigator.credentials.get()</code> → <code>ParseResponse(responseJSON)</code> 得 Response（含 UnauthenticatedUserID）→ 按 ID 查 records → <code>Login(response, records)</code> 验签。</p>
  <p><strong>选型条件：</strong>Go 中小型站点、愿接受单 Origin 配置、不需要 attestation 的企业证明链。</p>
  <p><strong>避坑：</strong>登录前 UnauthenticatedUserID 不可信，只能用来查 Passkey 列表，绝不能直接当已登录用户——方法名刻意保留 Unauthenticated 前缀。</p>
  <div class="highlight"><strong>落地建议：</strong>建表 <code>passkeys(user_id, record)</code> 仅对 user_id 建索引；User ID 用 <code>crypto/rand.Text()</code> 生成不透明随机串，终身不变且勿与邮箱/用户名混用。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】passkey-record 不透明存储格式</h3>
  <p><strong>在讲什么问题：</strong>传统 WebAuthn 库逼开发者理解认证器数据结构并实现存储接口，迁移与跨语言互操作困难。</p>
  <p><strong>核心机制：</strong>类似 PHC 密码哈希的前缀化单行字符串，形如 <code>$webauthn$v=1$transports=...$&lt;base64&gt;</code>，规范已提交 c2sp.org，应用整串存取、无需解析内部字段。</p>
  <p><strong>关键理解：</strong>登录总是「先按 user_id 拉出全部 record 再逐条比对」，故无需 credential_id 唯一索引，也规避跨账号主键碰撞攻击——这是反直觉但扎实的简化。</p>
  <p><strong>和其他概念关系：</strong>比 go-webauthn 等库的 SessionData/WebAuthnUser 接口更薄；比「自己拼 JSON 存凭据」更标准化、可跨实现迁移。</p>
  <div class="relation"><strong>原文依据：</strong>「应用侧只需要把这个字符串当成一个整体存进数据库，不需要关心里面到底装了什么。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】密码 vs Passkey vs 第三方 Go 库 vs crypto/passkey</h3>
  <table>
    <tr><th>对比维度</th><th>传统密码</th><th>Passkey</th><th>2024 第三方库</th><th>crypto/passkey 提案</th></tr>
    <tr><td>凭据形态</td><td>可记忆字符串</td><td>设备内私钥 + 服务端公钥</td><td>协议层结构体 + 自定义存储</td><td>单行 passkey-record 字符串</td></tr>
    <tr><td>钓鱼抗性</td><td>弱</td><td>origin 绑定签名</td><td>取决于集成质量</td><td>强制单 Origin 配置</td></tr>
    <tr><td>状态管理</td><td>会话/哈希</td><td>challenge 一次性</td><td>库常要求 Session 缓存</td><td>无状态，应用自管 challenge</td></tr>
    <tr><td>接入复杂度</td><td>低</td><td>协议理解成本高</td><td>中（接口适配）</td><td>低（无回调无接口）</td></tr>
    <tr><td>一句话结论</td><td colspan="4">Passkey 换安全模型；官方包换的是「谁负责会话与存储胶水层」</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】什么场景怎么接 Passkey</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>中小型 Go Web 新站</td><td>关注 crypto/passkey，按提案建表</td><td>目标用户就是这类站点，API 极简</td><td>等提案定稿前完全不设计表结构</td><td>存储模型大概率稳定，提前按 user_id+record 设计成本低</td></tr>
    <tr><td>多子域/多信任级别来源</td><td>每个 Origin 单独建 RelyingParty 实例</td><td>避免低信任子域 XSS 截获断言在高信任域重放</td><td>配置「允许 origin 列表」一把梭</td><td>提案点名云主机租户子域冒充控制台登录的典型风险</td></tr>
    <tr><td>企业需设备证明链</td><td>完整 WebAuthn 库 + attestation</td><td>提案明确不支持 attestation</td><td>强行用 crypto/passkey 做合规审计</td><td>消费级 Passkey 生态几乎不用 attestation</td></tr>
    <tr><td>已有 go-webauthn 生产系统</td><td>维持现状，评估 record 格式迁移</td><td>提案未正式发布，迁移有成本</td><td>未评估就全量重写</td><td>Issue 仍可能改 API，尤其多来源设计仍在收集反馈</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Origin、回调与协议取舍</h3>
  <p><strong>坑名：</strong>把 UnauthenticatedUserID 直接当登录成功</p>
  <p><strong>原因：</strong>WebAuthn 响应在验签前携带的用户标识不可信，误用等于鉴权前信任客户端数据。</p>
  <p><strong>原文说法：</strong>「在验证通过之前是不可信的——它只能被用来查一下这个用户都有哪些 Passkey 记录。」</p>
  <p><strong>解法：</strong>必须先 ParseResponse，查库取 records，再 Login 验签通过后才建立会话。</p>
  <p><strong>严重程度：</strong>致命。</p>
  <div class="pitfall"><strong>坑 2 — 回调查库：</strong>GO-2024-3321 教训表明把未验证数据传给库回调会导致错误判断；提案因此放弃回调，改 ParseResponse + 应用侧查库。</div>
  <div class="pitfall"><strong>坑 3 — 多 Origin 列表：</strong>同一 RP ID 下不同信任级别来源共用凭据，低信任 XSS 可重放断言到高信任门户——必须为每个 Origin 独立 RelyingParty。</div>
  <div class="pitfall"><strong>坑 4 — 强校验签名计数器：</strong>主流 Passkey 提供商不维护 counter，强行校验会误杀合法登录；提案选择不校验，接受克隆检测能力弱化。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】为 95% 场景做减法</h3>
  <p><strong>原则：</strong>三个「不」——无状态、无回调、无接口；库不做 I/O，就不到处塞 context.Context。</p>
  <p><strong>为什么重要：</strong>2024 年做 Passkey Demo 容易，做「对」需要深度理解 WebAuthn；官方要把复杂度从「懂协议」降到「按套路存字符串」。</p>
  <p><strong>怎么落地：</strong>注册用 NewRegistration/Register；登录用 ParseResponse/Login；披露单 Origin；User ID 用 rand.Text()；放弃 attestation 与 counter 换真实世界可用性。</p>
  <p><strong>适用边界：</strong>提案仍处评审，Amazon/Google 级平台、需 attestation 的企业场景不在首发目标内。</p>
  <div class="quote">原文：「为真实世界里 95% 的场景做减法，而不是追求协议层面的大而全。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：企业安全合规官 · 「协议完整性优先」派</p>
  <p class="rebuttal-text">砍掉 attestation 与签名计数器、还鼓励不按 credential_id 建唯一索引——对消费站省事，对企业就是主动放弃设备真伪与克隆检测，一条标准库 API 撑不起「一次性做对」的承诺。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Filippo Valsorda 提案在 Go 标准库新增 crypto/passkey，定位中小型站点无状态服务端 API，尚处 golang/go#80663 评审。</li>
    <li>核心创新是 passkey-record 单行不透明格式 + 仅 user_id 索引存储，配合显式 ParseResponse 流规避回调信任漏洞（GO-2024-3321）。</li>
    <li>注册/登录 API 清晰：NewRegistration→Register、ParseResponse→查库→Login；UnauthenticatedUserID 验签前不可信。</li>
    <li>刻意取舍：单 Origin、无 attestation、无 counter 校验，为 95% 消费级 Web 降维。</li>
    <li>相对 2024 第三方库，省掉会话与存储接口胶水，但多信任级别来源需多 RelyingParty 实例而非 origin 白名单。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>跟踪 Issue #80663 与 godoc-play 交互文档，关注多来源设计反馈。</li>
    <li>新表按 passkeys(user_id, record) + user_id 索引预设计，User ID 用 crypto/rand.Text()。</li>
    <li>每个可信 Origin 独立配置 RelyingParty，勿用单一 origin 列表混用信任级别。</li>
    <li>登录实现严格 ParseResponse → 查 records → Login，禁止提前信任 UnauthenticatedUserID。</li>
    <li>系统学习可查阅 passkeys.dev、webauthn.guide 与 c2sp.org/passkey-record 规范草案。</li>
  </ol>
  <p><strong>关键认知转变：</strong>Passkey 接入难点不在「会不会调 WebAuthn」，而在会话、存储与信任边界怎么切——官方包用放弃回调与强制显式流，把安全责任从库内黑盒拉回应用可见的每一步。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
