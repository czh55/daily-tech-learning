import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'jack-dorsey-block-buzz-ai-agent-workspace-opensource.svg');

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
<h1>Twitter之父再出手：Block开源Buzz，要让人类和AI Agent「同工同权」</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Buzz</span>
  <span class="tag tag-green">Nostr</span>
  <span class="tag tag-orange">AI Agent</span>
  <span class="tag tag-purple">协作平台</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 Agent 已经能干活但团队缺乏「一起干活」的统一空间时，如何用独立密码学身份、Nostr 可移植身份和 Git Forge 对象存储，让人类与 AI Agent 在同一工作区以同等权限协同，同时把授权与责任在协议层分开。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Buzz 架构：从身份到协作到代码</h3>
  <div class="diagram">
    <div class="node-orange">协调困境<br><span style="font-size:11px;font-weight:400">共享 Bot 凭证</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">Nostr 身份<br><span style="font-size:11px;font-weight:400">每人/每 Agent 独立密钥</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Buzz 工作区<br><span style="font-size:11px;font-weight:400">频道·工作流·ACP</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-red">Git Forge<br><span style="font-size:11px;font-weight:400">对象存储+TLA+</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">瓶颈从「智能够不够」变成「协调跟不跟得上」</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Buzz 是去中心化 Slack」——它当前 relay 仍是单点中心化，「去中心化」主要体现在部署主权与身份可移植性；真正创新是每个 Agent 拥有独立密码学身份，而非共用人类 API Key。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Buzz 与 Agent 同工同权</h3>
  <p><strong>在讲什么问题：</strong>模型能干活了，但团队没有让人类和 Agent 一起干活的地方，共享 Bot 凭证导致责任不清。</p>
  <p><strong>核心机制：</strong>Buzz 是建立在 Nostr 上的开源协作工作区，每个参与者（人或 Agent）持有独立密钥对；Agent 通过 ACP 接入，拥有与人类几乎相同的行动接口。</p>
  <p><strong>关键理解：</strong>授权签名不等于抹去作者身份——Agent 仍是「作者」，密钥证明它被谁授权、在什么条件下行动；泄露时可单独吊销 Agent 而不连坐人类身份。</p>
  <p><strong>典型场景：</strong>前沿模型 Agent 统揽全局，调度便宜小模型并行调研/编码/测试/评审，通过 @提及 实时注入彼此工作上下文。</p>
  <p><strong>边界说明：</strong>适合已大规模引入 Agent 且协调成本失控的团队；不适合只需单聊式 AI 助理、无需代码协作与审计追溯的场景；产品仍处早期，移动端与推送未完成。</p>
  <div class="quote">原文：Agent 是同事，不是「闹鬼的定时任务」。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】接入 Buzz 工作区</h3>
  <p><strong>核心思路：</strong>模型无关、框架无关——只要支持 Agent Client Protocol（ACP），Claude Code、Codex、goose 或自研 Agent 都能进入同一工作区。</p>
  <p><strong>操作步骤：</strong>① 为每个 Agent 生成独立 Nostr 密钥对 ② 由所有者做范围明确的授权签名 ③ Agent 用自身身份对工作签名 ④ 通过 ACP 接入 Buzz relay ⑤ 在频道/话题串/@提及 中协作 ⑥ 可选自托管 relay 或 Block 托管 buzz.xyz。</p>
  <p><strong>选型条件：</strong>需要人类与多 Agent 共享可见协作记录、代码评审、工作流审计时选 Buzz；仅需个人 AI 编程助手时不必上整套工作区。</p>
  <div class="pitfall"><strong>避坑：</strong>不要把人类凭证直接给 Bot 用——Block 内部投票「谁来管共享 Bot 凭证」结果是每个人都投给了别人；共享账号无法追溯责任，密钥泄露影响面过大。</div>
  <div class="quote">原文：以前我们的做法是把人类的凭证直接给 Bot 用，然后祈祷它别给你丢人。这很怪，也很危险，现在可以不用这样了。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】Buzz 早期阶段的现实限制</h3>
  <p><strong>Relay 单点（小心）：</strong>工作区内读写经单一 relay 完成，尚无真正 P2P gossip 或 relay 间复制；自托管可掌控数据，但不是完全去中心化网络。</p>
  <p><strong>产品成熟度（可忽略短期）：</strong>移动端、推送通知、部分工作流审批机制仍在建设中，生产落地需评估 SLA。</p>
  <p><strong>Agent 并发提交（致命若忽视）：</strong>Agent 集群可能一下午产出人类数月的提交量，传统 Git 托管的「人类速度」假设会被击穿，需对象存储+条件 CAS 指针更新方案。</p>
  <div class="highlight"><strong>落地建议：</strong>评估时区分「身份可移植+开源协议」与「网络去中心化」；试点阶段优先自托管 relay 验证 ACP 集成，再决定是否迁移代码仓库到 Git Forge。</div>
</div>

<div class="card">
  <h3>【决策/选型表】协作基础设施选型</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐的方案</th><th>为什么不行</th></tr>
    <tr><td>多 Agent 共享 Bot 凭证</td><td>Buzz 独立密钥+ACP</td><td>协议层分清授权与作者、可单独吊销</td><td>共用 Slack Bot Token</td><td>责任不可追溯、换模型/运行时困难</td></tr>
    <tr><td>需要代码+讨论同记录</td><td>Buzz 短生命周期频道+Git Forge</td><td>讨论、补丁、CI、评审、合并决策共享一条记录</td><td>聊天与 Git 分离</td><td>半年后搜不到「为什么否掉某方案」</td></tr>
    <tr><td>厂商锁定顾虑</td><td>Apache-2.0 自托管 Buzz</td><td>身份与签名历史可独立验证、Git 可重新托管</td><td>封闭 Agent 平台</td><td>碎片化、难以形成组织内统一标准</td></tr>
    <tr><td>仅需单用户 AI 编码</td><td>Claude Code / Codex 本地</td><td>无需多参与者协调基础设施</td><td>上 Buzz 全家桶</td><td>过度工程、relay 运维成本不值</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】传统协作 vs Buzz Agent 协作</h3>
  <table>
    <tr><th>对比维度</th><th>传统 Slack+共享 Bot</th><th>Buzz 同工同权</th><th>一句话结论</th></tr>
    <tr><td>身份模型</td><td>人类账号或共享 API Key</td><td>每人/每 Agent 独立 Nostr 密钥</td><td>责任边界在协议层被写死</td></tr>
    <tr><td>Agent 权限</td><td>响应指令的助理</td><td>可开仓库、提 PR、跑工作流、建频道</td><td>从秘书升级为同事级参与者</td></tr>
    <tr><td>代码存储</td><td>外部 Git 托管、人类速度假设</td><td>对象存储 packfile+CAS 指针+TLA+ 验证</td><td>为 Agent 并发提交量重新设计</td></tr>
    <tr><td>开源与锁定</td><td>平台封闭、数据难迁移</td><td>协议+形式化模型全公开，可重建</td><td>基础设施应像代码一样可拥有</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】开放协议胜过封闭产品</h3>
  <p><strong>原则：</strong>Agent 协作基础设施应该是开放的——人和 Agent 协作的标准应在开放环境中共同定义，而非被单一厂商私有化。</p>
  <p><strong>为什么重要：</strong>大量公司在少数封闭平台上搭建 Agent 基础设施，各自规则导致碎片化与厂商依赖；Dorsey 与 Roelof Botha 的「用 AI 替代科层制」需要可审计、可重建的工程底座。</p>
  <p><strong>怎么落地：</strong>① 评估 github.com/block/buzz 协议规格与 TLA+ 模型 ② 试点自托管 relay ③ 为关键 Agent 分配独立密钥而非共用凭证 ④ 用短生命周期频道绑定功能分支与决策记录。</p>
  <p><strong>适用边界：</strong>Buzz 仍是早期产品；relay 未真正去中心化前，不要把「去中心化」当作已交付能力来宣传。</p>
  <div class="quote">原文：一个任何人都能重建的协议，才是一个没人能把你锁死的协议。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Slack/Microsoft 365 企业协作派 / 「现有工具加 Copilot 就够」</p>
  <p class="rebuttal-text">在共享 Bot 凭证下 Copilot 只是附在人类账号上的助理，Agent 规模上来后协调成本与责任追溯会压垮聊天工具——Buzz 解决的是协议层身份与多 Agent 并发工程负载，不是多一个聊天侧边栏。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>瓶颈已从「智能够不够」变为「协调跟不跟得上」——共享 Bot 凭证是普遍痛点。</li>
    <li>Buzz 用 Nostr 独立密钥让每个 Agent 成为可验证、可吊销、可移植的「同事」。</li>
    <li>ACP 实现模型/框架无关接入；Git Forge 用对象存储+形式化验证应对 Agent 级提交洪峰。</li>
    <li>Apache-2.0 全开源是立场：协作标准应在开放环境定义，而非厂商锁定。</li>
    <li>早期限制诚实可见：relay 仍中心化、移动端与部分审批机制建设中。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>盘点团队内是否存在「共享 Bot 凭证、责任无人认领」的情况。</li>
    <li>阅读 Buzz README 与 ACP 规范，评估现有 Agent 能否以独立身份接入。</li>
    <li>若试点，优先自托管 relay 验证频道协作与审计追溯价值。</li>
    <li>关注 Git Forge 对象存储方案，评估 Agent 并发 push 对现有 CI 的冲击。</li>
    <li>区分「身份可移植的开源协议」与「网络层去中心化」再对外沟通。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「给 AI 配一个聊天窗口」升级为「为每个 Agent 发钥匙、在同一工作区与人类同工同权」——协作基础设施本身成为 AI 战略的核心战场。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
