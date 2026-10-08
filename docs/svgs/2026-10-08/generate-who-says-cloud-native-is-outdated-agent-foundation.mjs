import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'who-says-cloud-native-is-outdated-agent-foundation.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#eff6ff,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#1d4ed8,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1d4ed8;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#eff6ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#1e40af;border-left:4px solid #3b82f6}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:14px;padding:10px 12px;text-align:center;min-width:76px;font-weight:700;font-size:10px;color:#1d4ed8}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-color:#a78bfa;color:#6b21a8}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1d4ed8,#7c3aed);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#1d4ed8;border-bottom:2px solid #cbd5e1}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px}`;

const body = `
<h1>云原生未过时：Agent 逼出的「接口级地基重做」</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">K8s v1.33–1.37</span>
  <span class="tag tag-green">DRA / WAS</span>
  <span class="tag tag-orange">Gateway Payload</span>
  <span class="tag tag-purple">AX · OTel GenAI</span>
</div>
<p class="subtitle">本文解决的核心问题是：「云原生过时论」三条论据（Agent 不合 Pod、K8s 太重、Substrate 绕开控制面）为何只说对一半——过去 21 个月官方演进显示调度从 Pod 升维到 Workload、DRA 成 GPU 标准抽象、流量从 Header 走向 Payload 与 MCP，Sandbox/AX 分层而非推倒 K8s，Cilium 与 OpenTelemetry 为 Agent 补安全与证据链。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1d4ed8;margin-bottom:12px;text-align:center">一次 Agent 请求的栈（概念关系）</h3>
  <div class="diagram">
    <div class="node-orange">Gateway<br>Payload/MCP</div>
    <span class="arrow-sym">→</span>
    <div class="node">Sandbox /<br>Substrate·AX</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">DRA + WAS<br>资源/组调度</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">Cilium<br>边界策略</div>
    <span class="arrow-sym">→</span>
    <div class="node-blue">OTel<br>调用树证据</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「AX/Substrate 证明可以抛弃 Kubernetes」。事实：Substrate 仍把 K8s 当基础设施供给层，且用补丁对齐 Pod 证书；<strong>最激进的运行时也在向上游标准靠拢</strong>。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】过时论的三条依据与反证</h3>
  <p><strong>在讲什么问题：</strong>为何舆论唱衰与项目路线图相反。</p>
  <p><strong>依据 1：</strong>Agent 有状态、闲忙波动、不可信代码 → 反证：WAS/Gang、HPA 缩容到零、用户命名空间 GA、Agent Sandbox CRD。</p>
  <p><strong>依据 2：</strong>K8s 运维重 → 反证：Conformance 平台 18→31、Ingress NGINX 退役换 Gateway API 统一入口。</p>
  <p><strong>依据 3：</strong>新运行时绕开 K8s → 反证：控制面移出热路径 ≠ 离开云原生地盘；多数团队算力/网络/身份已长在云上。</p>
  <p><strong>结论句式：</strong>过时论说对「旧抽象不够」，答案是在地基上<strong>改造接口、加建楼层</strong>。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Kubernetes 调度与 DRA（v1.33–1.37）</h3>
  <p><strong>Workload 感知：</strong>CompositePodGroup、Gang Scheduling Beta（v1.37）——一组 Pod 同起同停，服务 JobSet/LeaderWorkerSet。</p>
  <p><strong>DRA：</strong>v1.34 GA；v1.37 Extended Resource GA、设备污点、PodGroup 共享 ResourceClaim Beta——渐进替代 Device Plugin 写法。</p>
  <p><strong>Agent 弹性：</strong>In-Place Resize GA、HPA 缩容到零 Beta、Memory QoS Beta 默认开。</p>
  <p><strong>操作注意：</strong>WAS API v1alpha1→2→3 连续破坏性变更，KEP-4671 Stable 目标 v1.38——<strong>预发验证后再生产</strong>。</p>
  <div class="pitfall">Ingress NGINX 2026 年 3 月停维：约半数环境曾依赖——迁移工具 Ingress2Gateway 1.0，流量标准压在 Gateway API。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】两条 Agent 运行时路线</h3>
  <table>
    <tr><th>维度</th><th>Agent Sandbox（SIG Apps）</th><th>AX + Agent Substrate（Google）</th><th>一句话</th></tr>
    <tr><td>抽象</td><td>Pod 内强隔离沙箱</td><td>Actor 多路复用到少量 Worker Pod</td><td>改进 Pod vs 移出热路径</td></tr>
    <tr><td>冷启动</td><td>WarmPool、缩容到零再恢复</td><td>快照挂起，&lt;1s 恢复</td><td>都针对空闲烧钱</td></tr>
    <tr><td>编排</td><td>SandboxTemplate/Claim</td><td>Task/Workspace/Gateway/Model</td><td>AX 像 kubectl 式作业编排</td></tr>
    <tr><td>成熟度</td><td>KubeCon 预览、上游 CRD</td><td>早期开发、README 非官方支持产品</td><td>生产谨慎</td></tr>
  </table>
  <p><strong>原文立场：</strong>AX 是作业编排，<strong>不是 Agent 框架</strong>；HN 批评运维负担成立，但不削弱「多数团队绕开云原生成本更高」。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】流量层与 CNCF「合同」</h3>
  <p><strong>Payload：</strong>AI Gateway WG——载荷处理（注入防护、MCP）、出站路由；Inference Extension GA；llm-d（CNCF Sandbox）做 Prefill/Decode 分离与前缀缓存感知（Vertex 案例 35%→70%）。</p>
  <p><strong>Conformance：</strong>KAR 对齐 v1.35 原语；验证范围扩到 Agent 工作负载；MCP/A2A 归 LF AAIF。</p>
  <p><strong>怎么落地：</strong>新入口用 Gateway API；评估 agentgateway/kagent CRD 时注意多为 v1alpha1。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】官方风险清单（原文摘录）</h3>
  <p><strong>WAS API 连变：</strong>勿直接上生产——严重程度：致命。</p>
  <p><strong>AI Gateway CRD 未合并：</strong>提案阶段——严重程度：小心。</p>
  <p><strong>AX/Substrate 早期 + GKE Standard 导向：</strong>——严重程度：小心。</p>
  <p><strong>OTel GenAI 约定 Development：</strong>属性名仍会变——严重程度：小心（但现在应按 gen_ai.* 插桩）。</p>
  <p><strong>Ingress NGINX 维护者集中：</strong>关键组件单点风险教训——严重程度：致命（历史）。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】五个判断 + Cilium/OTel 横切</h3>
  <p><strong>原则：</strong>分层而非替换；调度单元 Pod→Workload→Actor；网关看 Body；标准先行（Conformance）；可观测是证据链但未定型。</p>
  <p><strong>Cilium 1.20：</strong>Gateway ExternalAuth、ClusterNetworkPolicy、Tetragon FQDN/二进制策略——Agent 出站白名单与审计关联。</p>
  <p><strong>OpenTelemetry：</strong>2026 毕业；GenAI/MCP 语义约定拆仓快迭代——Agent 与 MCP 为一等公民，整体仍 Development。</p>
  <div class="quote">一次 Agent 请求：网关管入口，Sandbox/Substrate 管运行，DRA 与调度管资源，Cilium 管边界，OTel 管证据。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：裸机/Serverless 极简派</p>
  <p class="rebuttal-text">为长驻 Agent 把 K8s、CRD、Gateway 与 OTel 全栈搬上，运维税远超 Substrate 省下的那一秒唤醒——小团队真正该用的是托管 API，不是给 Pod 办户口。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>云原生在 Agent 时代是「接口重做」：调度、设备、流量、沙箱、观测五层都在演进。</li>
    <li>K8s v1.37 与 DRA/WAS 针对组调度与 GPU 标准化；Sandbox 与 AX 是互补路线而非二选一弃云。</li>
    <li>流量与治理从 Header/MCP 载荷、Conformance 到 Cilium/OTel，形成可审计闭环雏形。</li>
    <li>生产需对照原文风险清单：API 版本、alpha 组件、未定型语义约定。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>盘点是否仍依赖 Ingress NGINX，规划 Gateway API + Ingress2Gateway。</li>
    <li>GPU 工作负载评估 DRA 渐进迁移路径与设备污点策略。</li>
    <li>Agent 试点在预发验证 WAS/Gang 与缩容到零，勿跟 alpha API 进生产。</li>
    <li>按 gen_ai.* / MCP 约定插桩 OTel，并为属性变更留版本缓冲。</li>
    <li>跟踪 AI Conformance 与 KAR 对 Agent 工作负载的认证要求。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「云原生 vs Agent 二选一」到「Agent 时代地基被拆开重新分层，K8s 仍是多数团队的供给与标准锚点」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log(`Wrote ${OUT} (${height}px)`);
