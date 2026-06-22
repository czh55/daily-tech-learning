import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-cncf-dominance.svg');

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
<h1>屠榜 CNCF！为什么在云原生时代，Go 语言能把 Java、C++ 和 Rust 堵在门外？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">云原生</span>
  <span class="tag tag-green">Go 语言</span>
  <span class="tag tag-orange">CNCF 生态</span>
  <span class="tag tag-purple">技术选型</span>
</div>
<p class="subtitle">本文解决的核心问题是：在 CNCF 生态中 Docker、Kubernetes、Prometheus 等 90% 以上核心项目均用 Go 编写的背景下，Go 究竟靠什么历史路径与工程权衡击败 Java、C++、Rust 成为云原生基础设施的默认语言，以及你在选型时应如何判断 Go 的适用边界。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">历史引力<br><span style="font-size:13px;font-weight:400">Borg→K8s / Docker</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">生态坍缩</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">黄金分割点<br><span style="font-size:13px;font-weight:400">性能×Devex</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">工程特质<br><span style="font-size:13px;font-weight:400">GMP/静态二进制</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">CNCF 统治</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Go 统治 CNCF 纯粹因为 Google 偏心」—— 历史机遇只是起点，真正锁定王座的是 Go 在 128MB Sidecar 内存账单、静态二进制部署、低认知负载开源贡献三方面的结构性优势，这些优势在 K8s 规模化运维场景下被反复放大。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】云原生生态的地心引力</h3>
  <p><strong>在讲什么问题：</strong>为什么 CNCF 全景图中 Go 项目占比接近垄断，这种统治是偶然还是必然。</p>
  <p><strong>核心机制：</strong>Google 内部 Borg（C++）开源为 Kubernetes 时曾尝试 Java 但因 JVM 沉重而放弃，同期孵化的 Go 因高并发与简洁成为重写 K8s 的天选之子；2013 年 Docker 为快速构建轻量 CLI 选择 Go 静态二进制；当 Docker 与 K8s 两颗「太阳」均用 Go 编写后，Etcd、Prometheus、Helm 等卫星项目为与 runtime 和 Client 库无缝通信只能义无反顾选择 Go，生态引力完成史诗级坍缩。</p>
  <p><strong>关键理解：</strong>技术生态的地心引力一旦形成便无法阻挡，后来者即便性能更优也难以撼动已固化的 Client 库与 API 约定。</p>
  <p><strong>典型场景：</strong>编写 K8s Operator、Prometheus Exporter、服务网格 Sidecar、Etcd 客户端等 CNCF 周边工具。</p>
  <p><strong>边界说明：</strong>地心引力解释的是基础设施层默认语言，不意味着应用业务层、数据科学、前端也必须选 Go。</p>
  <div class="quote">「Google 创造了项目 Borg 和 Go 语言，这绝非巧合。CNCF 的大厦就是建立在这个强大的基因组合之上的。」</div>
  <div class="relation"><strong>相关概念：</strong>与「语言纯粹性能竞赛」不同，生态锁定是网络效应；与 Java Spring 企业生态类似，但 Go 锁定的是基础设施而非业务应用层。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Go 对四大语言的降维打击</h3>
  <table>
    <tr><th>对比维度</th><th>Go</th><th>Java/C#</th><th>C/C++</th><th>Rust</th><th>一句话结论</th></tr>
    <tr><td>Sidecar 内存</td><td>十几到 128MB</td><td>空载 200MB+</td><td>可控但危险</td><td>较低</td><td>百 Pod Sidecar 场景 Java 直接榨干节点</td></tr>
    <tr><td>部署形态</td><td>单一静态二进制</td><td>JVM/CLR 依赖链</td><td>动态链接地狱</td><td>静态但编译慢</td><td>CGO_ENABLED=0 丢进 scratch 镜像即可</td></tr>
    <tr><td>内存安全</td><td>GC 自动管理</td><td>GC 安全</td><td>野指针/溢出</td><td>编译期保证</td><td>云原生底座不能承受 C++ 级漏洞</td></tr>
    <tr><td>开源参与门槛</td><td>25 关键字，几天上手</td><td>中等</td><td>高</td><td>借用检查器极高</td><td>K8s 用 Rust 写绝不会有今天繁荣生态</td></tr>
    <tr><td>向后兼容</td><td>Go 1.0 代码 Go 1.26 直接编译</td><td>版本碎片化</td><td>ABI 风险</td><td>edition 迁移</td><td>十年基础设施需要「不折腾」确定性</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】Go 云原生静态二进制构建</h3>
  <p><strong>标签：</strong>容器部署 · 跨平台编译</p>
  <p><strong>核心思路：</strong>用 CGO_ENABLED=0 交叉编译出无动态依赖的单一二进制，直接放入 scratch 镜像实现十几兆极简容器。</p>
  <p><strong>操作步骤：</strong>① 设置 CGO_ENABLED=0 GOOS=linux GOARCH=amd64；② 执行 go build 产出静态二进制；③ 基于 scratch 或 distroless 构建镜像；④ 在 macOS 上可用 GOOS=linux GOARCH=mipsle 直接编译路由器 MIPS 二进制，无需安装交叉编译器。</p>
  <p><strong>选型条件：</strong>需要 Sidecar、Exporter、CLI 工具等轻量常驻进程且要求极简部署时首选 Go。</p>
  <div class="pitfall"><strong>避坑：</strong>开启 CGO 后会引入 glibc 等动态依赖，scratch 镜像中直接运行会报找不到共享库——基础设施工具务必 CGO_ENABLED=0。</div>
  <div class="quote">「在 Go 中，通过简单的 CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build，你就能得到一个完全不依赖系统任何动态链接库的、孤立的静态二进制文件。」</div>
</div>

<div class="card">
  <h3>【决策/选型表】云原生组件语言选型</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>K8s Operator / CRD 控制器</td><td>Go + client-go</td><td>与 API Server 生态原生契合，社区样例最多</td><td>Java Operator SDK</td><td>JVM 内存与启动时间在控制面不划算</td></tr>
    <tr><td>每 Pod 挂载的 Sidecar 代理</td><td>Go 或 Rust</td><td>Go 内存极低；Rust 适合极致性能 Proxy</td><td>Java Sidecar</td><td>单节点百 Sidecar 内存账单不可接受</td></tr>
    <tr><td>高频冷启动 Serverless</td><td>Rust / Go</td><td>Rust 冷启动与性能更优；Go 开发效率更高</td><td>Python/Node 重型依赖</td><td>镜像体积与依赖链拖慢冷启动</td></tr>
    <tr><td>业务微服务 CRUD</td><td>按团队栈选择</td><td>CNCF 统治不约束应用层</td><td>强行全栈 Go</td><td>业务层选型应看团队而非基础设施惯性</td></tr>
    <tr><td>需要十年兼容的基础设施库</td><td>Go</td><td>Go 1 兼容性承诺是 CNCF 信任基石</td><td>频繁 breaking change 的语言</td><td>Etcd 级项目无法承受频繁迁移成本</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】Worse is Better 的云原生实践</h3>
  <p><strong>原则：</strong>在云原生基础设施层，「做更少，得更多」的 Worse is Better 哲学胜过追求语法表达力或极致性能。</p>
  <p><strong>为什么重要：</strong>若 K8s 用 Rust 编写，借用检查器会把 90% 潜在贡献者挡在门外，开源生态繁荣度直接决定项目生命力。</p>
  <p><strong>原文支撑：</strong>Go 被吐槽语法简陋、GC 不如手动管理，却在并发与高可用最严苛的云原生黄金领域达成近乎绝对统治。</p>
  <p><strong>怎么落地：</strong>写基础设施时优先简单可维护的 Go 方案；性能热点再用 Rust 写 Proxy 等局部组件，而非全盘重写。</p>
  <p><strong>适用边界：</strong>高频交易、内核驱动、极致延迟场景 Go 的 GC 仍是上限；此时 Rust/C++ 才是正解。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】误判 Go 统治范围的常见陷阱</h3>
  <p><strong>坑名：</strong>因为 CNCF 全是 Go 就把所有新项目无脑定为 Go。</p>
  <p><strong>原因：</strong>混淆了基础设施层生态锁定与应用业务层选型自由度。</p>
  <p><strong>原文说法：</strong>文章讨论焦点是 Docker、K8s、Istio、Prometheus 等分布式底座，而非所有后端服务。</p>
  <p><strong>解法：</strong>底座与 Sidecar 跟 Go 生态；业务服务按团队能力、领域模型和数据栈独立决策。</p>
  <p><strong>严重程度：</strong>小心——不会立刻崩溃，但会在非 I/O 密集型场景付出不必要的开发成本。</p>
  <div class="pitfall"><strong>另一坑：</strong>在需要亚毫秒延迟或零 GC 停顿的路径上用 Go 硬扛——此时 Rust 才是服务网格 Proxy 等细分领域的合理挑战者，严重程度：致命（性能 SLA 无法达标）。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Rust 基础设施派 / 极致性能优先的 CNCF 贡献者</p>
  <p class="rebuttal-text">生态惯性不等于技术最优：Envoy 与 eBPF 已在数据面证明 Rust/C 可以比 Go Sidecar 更轻更快，历史路径依赖会让整个云原生栈长期背负 GC 停顿与弱表达力的税，所谓统治只是迁移成本太高而非 Go 真的最适合每一个 CNCF 组件。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Go 统治 CNCF 是 Borg→K8s、Docker 选型与生态引力坍缩的历史必然，而非一时风潮。</li>
    <li>Go 站在系统性能与开发效率（Devex）的黄金分割点：128MB Sidecar、静态二进制、内存安全、低认知负载四重优势叠加。</li>
    <li>GMP 协程、跨平台编译、Go 1 向后兼容是云原生 I/O 密集与十年维护场景的「量身定制」特质。</li>
    <li>Rust 可在服务网格 Proxy、Serverless 冷启动等细分领域挑战 Go，但难以撼动 K8s 核心生态。</li>
    <li>基础设施层跟 Go、业务层独立选型，是读懂这篇文章后的正确行动框架。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>若团队维护 K8s Operator 或 Exporter，直接采用 Go + 官方 client 库，不要重复造多语言轮子。</li>
    <li>编写 Sidecar 类组件时实测内存占用，目标控制在 128MB 以内，用 CGO_ENABLED=0 构建 scratch 镜像。</li>
    <li>评估新项目时区分「底座组件」与「业务服务」，仅前者默认 Go。</li>
    <li>性能热点路径做 Rust/Go 原型对比后再决策，避免教条主义。</li>
    <li>阅读 Reddit r/golang 原帖与 CNCF Landscape，建立对生态密度的直观感知。</li>
  </ol>
  <p><strong>关键认知转变：</strong>Go 的「枯燥无聊」不是缺陷而是 CNCF 级基础设施的核心竞争力——降低全球开发者参与门槛，比单点极致性能更能造就繁荣生态。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
