import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'post-quantum-cryptographic-right-answers-2026.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#fef3c7,#fde68a);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#78350f,#b45309);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-orange{background:#ffedd5;color:#9a3412}.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #d97706}
.card h3{font-size:22px;font-weight:700;color:#92400e;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fffbeb;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#fffbeb,#fde68a);border:2px solid #fcd34d;border-radius:16px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#92400e}
.node-red{background:linear-gradient(135deg,#fef2f2,#fecaca);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#78350f,#b45309);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#92400e;border-bottom:2px solid #cbd5e1}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#ecfdf5;border:2px solid #10b981;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#065f46;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px}`;

const body = `
<h1>2029 前换血：Filippo 版密码学正确答案</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">后量子 PQ</span>
  <span class="tag tag-blue">TLS 1.3</span>
  <span class="tag tag-green">对称密码</span>
  <span class="tag tag-purple">ML-KEM / ML-DSA</span>
</div>
<p class="subtitle">本文解决的核心问题是：后量子迁移共识截止 2029 年时，不想当密码学家的开发者该如何抄作业——哪些算法可不动、哪些非对称必须全换，以及 TLS、备份与工程实践上的立即行动项。</p>

<div class="map">
  <h3 style="font-size:20px;color:#92400e;margin-bottom:12px;text-align:center">迁移紧迫性：先存储后解密 → 密钥交换最优先</h3>
  <div class="diagram">
    <div class="node">对称 AES/ChaCha<br>基本不动</div>
    <span class="arrow-sym">→</span>
    <div class="node-red">非对称全换<br>KEM / 签名 / HPKE</div>
    <span class="arrow-sym">→</span>
    <div class="node">TLS 栈 + ACME<br>restic 备份</div>
    <span class="arrow-sym">→</span>
    <div class="node">内存安全语言<br>+ 最强 LLM 审码</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#065f46;font-size:16px">误解：「量子计算机来了，256 位对称密钥也要加倍」。Grover 对对称威胁被 Filippo 明确降级——<strong>128 位暴力破解并不存在</strong>；真正大换血在非对称与 harvest-now-decrypt-later 下的密钥交换。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】密码学正确答案传统与 2026 巨变</h3>
  <p><strong>在讲什么问题：</strong>延续 Colin Percival → Ptacek → Latacora → Filippo 的「抄作业清单」，面向应用开发者而非密码学家。</p>
  <p><strong>关键理解：</strong>2024 版刚更新却又来一版，只因 PQ 时间线被拉到 2029；相对 2018 非对称答案全变，相对 2024 大部分也变。</p>
  <p><strong>怎么落地用：</strong>先抄速查表三行：密钥交换 X25519+ML-KEM-768、签名 ML-DSA-44、非对称加密 HPKE（X-Wing）或 PQ age。</p>
  <p><strong>边界说明：</strong>passkey 2026 仍非 PQ，作者认为可接受——攻击面主要是单站会话而非全网流量解密。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】对称侧：AEAD、STREAM 与大消息</h3>
  <p><strong>操作步骤：</strong>本地加密用 XAES-256-GCM 或 XChaCha20Poly1305（随机 nonce ≥128 位）；超大消息用 STREAM（如 Cobblestone-128），勿一次性把巨型明文丢进 AEAD。</p>
  <p><strong>选型条件：</strong>云上用 KMS；HMAC-SHA-256 仍是对称「签名」首选；哈希用 SHA-512/256，多对象用 SequenceHash。</p>
  <p><strong>避坑：</strong>普通 AES-GCM + 随机 nonce 仅当同一密钥下消息 ≤10⁹ 条；密码优先 passkey/OIDC，Argon2id 参数 m=64MiB,t=2,p=1。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】非对称迁移雷区</h3>
  <div class="pitfall"><strong>坑名：</strong>名字里没有 ML-KEM 或 X-Wing 的 KEM — 一律不用。</div>
  <div class="pitfall"><strong>坑名：</strong>继续 RSA、NaCl box、OpenPGP、未认证流密码。</div>
  <div class="pitfall"><strong>坑名：</strong>滥用非对称签名 — 能用 HMAC/随机会话令牌就换；JWT 非必要不用非对称。</div>
  <div class="pitfall"><strong>坑名：</strong>默认 OpenSSL — 作者不推荐；优先 rustls、Go crypto/tls、BoringSSL、AWS-LC、s2n-tls。</div>
</div>

<div class="card">
  <h3>【决策/选型表】场景速查（Filippo 2026）</h3>
  <table>
    <tr><th>场景</th><th>正确答案</th><th>备注</th></tr>
    <tr><td>密钥交换（TLS/SSH）</td><td>X25519MLKEM768 / mlkem768x25519-sha256</td><td>最紧迫；纯 ML-KEM-768 若经典侧只多留一个月</td></tr>
    <tr><td>非对称加密</td><td>HPKE（MLKEM768-X25519）或 age1pq</td><td>PQ HPKE KEM 曾有多草案，filippo.io/hpke-pq</td></tr>
    <tr><td>数字签名</td><td>ML-DSA-44，external-μ，32B 种子</td><td>避免 HashML-DSA、组合签名</td></tr>
    <tr><td>在线备份</td><td>restic + 长随机密码</td><td>替代 Tarsnap（RSA 非对称层）</td></tr>
    <tr><td>网站 TLS</td><td>ALB/NLB 或上述库 + ACME</td><td>确认 TLS1.3 与 PQ 策略；RHEL9 需主动开启</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】经典 vs PQ 非对称（作者态度）</h3>
  <table>
    <tr><th>能力</th><th>经典（Ed25519/RSA 等）</th><th>PQ 推荐</th><th>结论</th></tr>
    <tr><td>密钥交换</td><td>X25519 等</td><td>混合 ML-KEM-768</td><td>流量可被存下来以后解密</td></tr>
    <tr><td>签名</td><td>Ed25519</td><td>ML-DSA-44</td><td>2026 起应规划迁移</td></tr>
    <tr><td>加密消息</td><td>NaCl box</td><td>HPKE / PQ age</td><td>终于有标准混合加密</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】工程与 2029 倒计时</h3>
  <p><strong>原则：</strong>对称扛住一半量子威胁；另一半靠非对称迁移 + 内存安全实现 + LLM 辅助审计（与「用内存安全语言」并列列入正确答案）。</p>
  <p><strong>怎么落地：</strong>今天三件事——查 TLS 是否 X25519MLKEM768（OpenSSL≥3.5）；盘点签名能否改 HMAC/令牌；Rust/Go 等 + 最强模型审密码相关代码。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「等标准完全稳定再迁」派</p>
  <p class="rebuttal-text">攻击者不必等你部署完成——现在抓下的 TLS 密文可在量子机实用后解密，拖延非 PQ 密钥交换等于主动扩大暴露窗口。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>2029 迁移共识下，非对称答案相对 2024 再次大修。</li>
    <li>对称算法与 Grover 恐慌可放下，重点在 KEM、签名、HPKE。</li>
    <li>TLS 库与备份工具选型同样是一次「大换血」。</li>
    <li>LLM 审码成为正式工程建议。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>验证生产 TLS 1.3 与 PQ 套件。</li>
    <li>列出所有非对称签名用途并削减。</li>
    <li>新证书与 SSH 规划 ML-DSA / 混合 KEM。</li>
    <li>备份方案评估 restic。</li>
    <li>用 LLM 扫一遍 crypto 边界代码。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>密码学正确答案从「十年一更的参考」变成「三年倒计时的强制路线图」——抄表即可，不必自研协议。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
