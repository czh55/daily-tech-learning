import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'inside-openai-codex-sandbox.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#0f172a,#1e293b);padding:48px 60px;color:#e2e8f0}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#38bdf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-agent{background:#1e3a5f;color:#7dd3fc}.tag-sandbox{background:#312e81;color:#c4b5fd}.tag-harness{background:#334155;color:#cbd5e1}
.card{background:#1e293b;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.25);border-left:5px solid #0ea5e9}
.card h3{font-size:22px;font-weight:700;color:#7dd3fc;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#cbd5e1;margin-bottom:10px}
.map{background:#0f172a;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.3);border:1px solid #334155}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:16px 0}
.node{background:linear-gradient(135deg,#1e3a5f,#1e293b);border:2px solid #0284c7;border-radius:14px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#bae6fd}
.node-em{background:linear-gradient(135deg,#0369a1,#4c1d95);border-color:#38bdf8;color:#f0f9ff}
.arrow-sym{font-size:14px;color:#64748b}
.conclusion{background:linear-gradient(135deg,#0c4a6e,#312e81);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#1e3a5f;padding:10px 12px;text-align:left;font-weight:700;color:#7dd3fc;border-bottom:2px solid #0ea5e9}
td{padding:10px 12px;border-bottom:1px solid #334155;color:#cbd5e1;vertical-align:top}
.correction{background:#422006;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#fcd34d;margin-bottom:8px}
.rebuttal{background:#0c4a6e;border:2px solid #0284c7;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#7dd3fc;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#38bdf8;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#e0f2fe}
.subtitle{font-size:17px;color:#94a3b8;margin-bottom:32px;line-height:1.6}
.highlight{background:#1e3a5f;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#bae6fd;border-left:4px solid #0ea5e9}
code{background:#334155;padding:2px 6px;border-radius:4px;font-size:14px;color:#f1f5f9}`;

const body = `
<h1>Codex Sandbox：Agent 的执行安全基础设施</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-agent">纵深防御</span>
  <span class="tag tag-sandbox">原生 OS 隔离</span>
  <span class="tag tag-harness">Harness 决策</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 AI Agent 获得 Shell 权限后，如何不靠 Prompt 自律，而在 Harness + 操作系统层面用文件系统与网络两条硬边界限制「能读什么、能改什么、能连哪里」，并让权限申请与授予彻底分离。</p>

<div class="map">
  <h3 style="font-size:20px;color:#7dd3fc;margin-bottom:12px;text-align:center">一条命令的安全路径</h3>
  <div class="diagram">
    <div class="node">用户任务</div><span class="arrow-sym">→</span>
    <div class="node">Agent Loop</div><span class="arrow-sym">→</span>
    <div class="node-em">Harness 裁决</div><span class="arrow-sym">→</span>
    <div class="node-em">Sandbox 执行</div><span class="arrow-sym">→</span>
    <div class="node">子进程树继承</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#94a3b8;margin-top:12px">模型只表达意图；真正 spawn 的是 Harness，并附带 Permission Profile + 可选 Network Proxy。</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#fde68a;font-size:16px">误解：给 Agent 装 Docker 就安全了。原文强调<strong>真实开发环境</strong>（Xcode、本地 DB、私有工具链）无法整包搬进容器；Codex 在宿主机上用 Seatbelt / Bubblewrap+seccomp / MXC 做<strong>进程级</strong>强制隔离。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】纵深防御 vs System Prompt</h3>
  <p><strong>在讲什么问题：</strong>Prompt 只能「劝」模型别作恶，无法从内核阻止读 SSH 密钥、改 Git Hooks、外传 API Key。</p>
  <p><strong>关键理解：</strong>Sandbox 限制进程实际能访问的文件与网络；Harness 负责把模型工具调用映射到受控执行。</p>
  <p><strong>关系：</strong>对齐/训练仍重要，但 Agent Runtime 必须是一等安全设施——模型能力决定「能做什么」，沙箱决定「犯错时破坏上限」。</p>
  <p><strong>落地：</strong>默认 <code>:workspace</code> 可改代码但保护 <code>.git</code>、<code>.codex</code>；网络默认关，需要时再开代理白名单。</p>
  <p><strong>边界：</strong>沙箱不保证行为符合用户意图，也不覆盖宿主机被污染、代理未覆盖的外传通道。</p>
  <p><strong>原文依据：</strong>「不要把安全寄托在模型是否遵守指令上。」</p>
</div>

<div class="card">
  <h3>【跨概念对比表】Docker 容器 vs 原生 Sandbox</h3>
  <table>
    <tr><th>维度</th><th>Docker / VM</th><th>原生 Sandbox（Codex）</th><th>结论</th></tr>
    <tr><td>环境保真</td><td>需复制工具链</td><td>直接用宿主 Xcode/本地服务</td><td>本地 Agent 偏原生</td></tr>
    <tr><td>隔离粒度</td><td>容器边界</td><td>单命令进程树 + OS 机制</td><td>命令级更贴 Harness</td></tr>
    <tr><td>典型场景</td><td>多租户云端、不可信代码</td><td>个人机器上的编码 Agent</td><td>场景互补非替代</td></tr>
    <tr><td>跨平台</td><td>镜像统一</td><td>抽象 Sandbox API 屏蔽 Seatbelt/bwrap/MXC</td><td>Harness 写一次</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】两条边界：文件系统 × 网络</h3>
  <p><strong>核心思路：</strong>读取权限与外发权限分开管——读到密钥 ≠ 能上传。</p>
  <p><strong>文件系统：</strong><code>read</code> / <code>write</code> / <code>deny</code>；工作区外常保留只读以满足编译器读 SDK。</p>
  <p><strong>网络：</strong>禁止 / 全开 / 代理+域名规则（拒绝优先于允许）。</p>
  <p><strong>步骤：</strong>① 选 Permission Profile → ② 必要时 <code>network_proxy</code> + domains → ③ Harness 调用 <code>spawn_command_under_sandbox</code>。</p>
  <p><strong>避坑：</strong>代理域名控制不是完整 DLP；要叠审批与其他防护。</p>
</div>

<div class="card">
  <h3>【决策/选型表】权限请求三模式</h3>
  <table>
    <tr><th>模式</th><th>含义</th><th>谁批准</th><th>不适用</th></tr>
    <tr><td>use_default</td><td>当前 Profile 默认权</td><td>无需额外</td><td>需突破工作区写保护时</td></tr>
    <tr><td>with_additional_permissions</td><td>沙箱内增量权限</td><td>Harness/用户审批</td><td>模型自行批准（禁止）</td></tr>
    <tr><td>require_escalated</td><td>脱离当前沙箱</td><td>显式人工或策略</td><td>无人值守全自动</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】进程树与 MCP 盲区</h3>
  <p><strong>子进程逃逸：</strong>只约束首个 Shell 不够——<code>go test</code> 拉起的编译器/脚本必须继承同一 Sandbox。</p>
  <p><strong>工具权限：</strong>工具/MCP Server 不能默认继承全盘权限；<code>codex sandbox</code> 可为 stdio MCP 单独定文件/网络策略。</p>
  <p><strong>企业治理：</strong>用户可配 Profile，但不能突破组织底线；Permission Profile 在 config.toml 复用。</p>
  <p><strong>严重程度：</strong>改 <code>.git</code> hooks、自改 <code>.codex</code> 策略 → 致命。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】Agent Runtime 是一等基础设施</h3>
  <p><strong>原则：</strong>申请权与授予权分离——模型可「要网络」，不能「批网络」。</p>
  <p><strong>落地：</strong>自建 Agent 工具可参考统一 Sandbox API：命令 + cwd + env + profile + proxy。</p>
  <p><strong>边界：</strong>不要把所有 Agent 塞进同一权限级；本地环境本身也可能是攻击面。</p>
  <p><strong>原文支撑：</strong>操作系统级沙箱已从可选功能升级为 Agent Runtime 的一等基础设施。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「云端 Agent 全用 K8s Job + 无特权容器就够了」</p>
  <p class="rebuttal-text">本地编码 Agent 必须触摸真实工具链与模拟器，整包容器化要么牺牲能力要么把高危操作放回宿主机却不设进程树级强制约束——那正是 Codex 拒绝「只上 Docker」的工程理由。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>安全靠 Harness+内核强制执行，不靠 Prompt 口头约束。</li>
    <li>文件与网络双边界解耦，默认保护 .git/.codex，网络可走代理白名单。</li>
    <li>子进程树继承 + 权限申请/授予分离，防 Shell 与 MCP 权限膨胀。</li>
    <li>原生跨平台 Sandbox 服务真实开发环境；容器仍适合云端强隔离。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>审视自家 Agent：工具执行路径是否有独立于模型的权限裁决层。</li>
    <li>为「读敏感配置」与「出网」分别设策略，默认 deny outbound。</li>
    <li>stdio MCP/插件进程单独 Profile，禁止继承 Agent 全盘写权限。</li>
    <li>在配置里固化 Permission Profile，避免每次会话手工点批准。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「把 Agent 关进聪明 Prompt」到「把每次命令关进可审计的 OS 沙箱」——智能决定自动化上限，沙箱决定事故下限。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');