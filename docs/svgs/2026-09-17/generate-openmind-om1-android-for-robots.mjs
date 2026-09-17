import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'openmind-om1-android-for-robots.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#0f766e,#14b8a6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #14b8a6}
.card h3{font-size:22px;font-weight:700;color:#0f766e;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #6ee7b7;border-radius:16px;padding:12px 16px;text-align:center;min-width:88px;font-weight:700;font-size:12px;color:#065f46}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#0f766e,#14b8a6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#0f766e;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#0f766e}`;

const body = `
<h1>OpenMind OM1：具身智能的「连接层」与 Go 运行时</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">OM1 Runtime</span>
  <span class="tag tag-blue">NLDB 自然语言总线</span>
  <span class="tag tag-orange">硬件无关 HAL</span>
  <span class="tag tag-purple">Go 边缘部署</span>
</div>
<p class="subtitle">本文解决的核心问题是：在具身智能被拆成模型、本体、仿真等多层分工之后，OpenMind OM1 究竟站在技术栈哪一层、与 LeRobot 和 ROS2 如何分工，以及用自然语言数据总线与多 LLM 协同把「感知—决策—动作」串成可跨机器人复用的 Agent 运行时。</p>

<div class="map">
  <h3 style="font-size:20px;color:#0f766e;margin-bottom:12px;text-align:center">五层栈：OM1 卡在第③层连接「思考」与「执行」</h3>
  <div class="diagram">
    <div class="node-orange">① 具身大模型<br>VLA/世界模型</div>
    <span class="arrow-sym">↓</span>
    <div class="node-orange">② 仿真/训练<br>Isaac·Gazebo</div>
    <span class="arrow-sym">↓</span>
    <div class="node">③ OM1<br>Agent Runtime</div>
    <span class="arrow-sym">↓</span>
    <div class="node-blue">④ ROS2/Zenoh<br>中间件</div>
    <span class="arrow-sym">↓</span>
    <div class="node-blue">⑤ 本体 HAL<br>步态·舵机</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：装上 OM1 机器人就会走路。官方明确 OM1 不替代底层 HAL——没有运动控制与标定，仍需 RL、仿真或自研 VLA；OM1 是在已有执行能力上叠加多模态 AI 编排，不是具身智能模型本身。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】自然语言数据总线 NLDB</h3>
  <p><strong>在讲什么问题：</strong>多传感器与多 LLM 之间用什么中间表示通信，才能让人类可读、LLM 可推理、又能在约 1Hz 融合节奏下跑通行为。</p>
  <p><strong>核心机制：</strong>视觉/语音/电量等先经 captioning 转成自然语言片段，由 State Fuser 压成情境描述，再喂给决策 LLM；论文论证即使总线约 40 bits/s 仍可得可用行为。</p>
  <p><strong>关键理解：</strong>反直觉地用「人话」而非张量做总线，换来可调试、可审计的「内心独白」，代价是信息压缩与延迟需与 Fast Action LLM 分层配合。</p>
  <p><strong>典型场景：</strong>家庭/社会场景下需要理解意图的多机人形或服务机器人上层认知环。</p>
  <p><strong>边界说明：</strong>50–500Hz 步态稳定控制仍在独立控制回路，OM1 主循环通常 1Hz 级，管的是注意力与工作记忆而非电机闭环。</p>
  <div class="quote">原文：最基础的系统由四个 LLM 通过自然语言总线通信，即使数据融合周期只有 1Hz，依然能在多种任务上跑出不错的机器人行为。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】OM1 vs LeRobot vs ROS2</h3>
  <table>
    <tr><th>维度</th><th>OM1</th><th>LeRobot</th><th>ROS2</th><th>一句话</th></tr>
    <tr><td>核心职责</td><td>AI 运行时 + 硬件抽象</td><td>教机器人学技能</td><td>机器人通信与执行基建</td><td>分工而非替代</td></tr>
    <tr><td>是否训练模型</td><td>否，调度编排</td><td>是，策略/模仿学习</td><td>否</td><td>OM1 站在已具备智能之上</td></tr>
    <tr><td>跨硬件承诺</td><td>JSON5 换插件</td><td>偏训练管线</td><td>节点与话题标准</td><td>OM1 类比 Android 应用层</td></tr>
    <tr><td>实现语言</td><td>Go（Python 已 deprecated）</td><td>Python 生态</td><td>C++/多语言</td><td>OM1 选 Go 为边缘运行时</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】Gazebo 仿真跑通 Unitree Go2</h3>
  <p><strong>标签：</strong>零硬件入门 · ROS2 Humble · Zenoh 桥</p>
  <p><strong>操作步骤：</strong>1) Ubuntu 22.04 装 ROS2 Humble 与 CycloneDDS 相关包 → 2) <code>git clone OpenMind/OM1-sim</code>，<code>rosdep install</code>，<code>colcon build</code>，uv 装 Python 侧 → 3) <code>ros2 launch go2_gazebo_sim go2_launch.py</code> → 4) <code>zenoh-bridge-ros2dds</code> 连配置 → 5) 设置 <code>OM_API_KEY</code>，<code>CONFIG=unitree_go2_autonomy USE_SIM=true make dev</code> → 6) 用 <code>teleop_twist_keyboard</code> 验证链路。</p>
  <p><strong>选型条件：</strong>无实体狗、要先验证 NLDB→LLM→动作；有 NVIDIA GPU 可换 Isaac Sim 官方文档路线。</p>
  <div class="pitfall"><strong>避坑：</strong>官方支持 Gazebo/Isaac Sim，无原生 MuJoCo 集成；别期待 OM1 单独承担 MuJoCo 式 RL 训练场景。</div>
  <div class="highlight"><strong>落地：</strong>OM1 不知道控制的是真机还是仿真——这正是 hardware agnostic 设计要验证的点。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】安卓类比与工程现实</h3>
  <p><strong>坑 1 — 把 OM1 当 VLA：</strong>不会凭空学会走路。解法：先建好 HAL/控制栈再叠 OM1。严重程度：致命。</p>
  <p><strong>坑 2 — 忽视形态差异：</strong>四足与人形运动学是两物种，HAL 能屏蔽多少要看落地而非架构图。严重程度：小心。</p>
  <p><strong>坑 3 — 仍用 Python 主线：</strong>新开发已全面 Go，Python 版本 deprecated。严重程度：小心（维护与部署）。</p>
  <p><strong>坑 4 — 单 LLM 扛全链路：</strong>典型需 Fast Action（约 300ms）、Core（约 2s）、Mentor 复盘分工，并受 system_governance 约束。</p>
</div>

<div class="card">
  <h3>【决策/选型表】何时引入 OM1</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>已有 ROS2/Zenoh 与 HAL</td><td>评估 OM1 作上层 Agent</td><td>解耦模型与机身</td><td>用 OM1 替代运动控制</td><td>职责越界</td></tr>
    <tr><td>从零训练行走策略</td><td>LeRobot + 仿真训练</td><td>OM1 不教技能</td><td>只装 OM1</td><td>无执行基础</td></tr>
    <tr><td>边缘 Jetson 部署</td><td>Go 单二进制 OM1</td><td>低延迟、小内存</td><td>继续 Python 运行时</td><td>官方已弃维护</td></tr>
    <tr><td>多机协作愿景</td><td>关注 FABRIC 协议演进</td><td>超越单机 Android 类比</td><td>仅当手机 OS 理解路线</td><td>路线含 App Store/Web3 层</td></tr>
  </table>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：ROS2 资深集成商 · 「中间件已够」派</p>
  <p class="rebuttal-text">再叠一层 NLDB 和多 LLM 只会把 1Hz 认知环上的延迟与故障面放大，工业现场要的是确定性 DDS 与硬实时控制，不是把传感器编成段落给云端大模型读。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>OM1 是模块化 AI Runtime/HAL，站在栈第③层，与 LeRobot（学技能）、ROS2（执行通信）互补。</li>
    <li>NLDB + State Fuser + 多 LLM 角色分工构成核心流水线；JSON5 多模式配置实现跨机身复用 Agent 逻辑。</li>
    <li>Python→Go 重写面向边缘延迟、并发与单二进制部署；主循环约 1Hz，与底层高频控制分离。</li>
    <li>OpenMind 路线从 Runtime 延伸到 Robot App Store 与 FABRIC，「安卓」类比在形态差异与 Web3 治理上存在边界。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>对照自家机器人是否已有 HAL，再评估 OM1 是否只补认知编排层。</li>
    <li>用 OM1-sim + Gazebo Go2 跑通 Zenoh 桥与 <code>USE_SIM=true</code> 开发链路。</li>
    <li>阅读 JSON5 中 modes/transition_rules，设计可切换人格状态而非单 prompt 硬编码。</li>
    <li>规划 Fast/Core/Mentor 三类 LLM 的部署位置与 API Key（OpenMind Portal）。</li>
  </ol>
  <p><strong>关键认知转变：</strong>具身智能软件入门不必从某个 VLA 训练细节切入，从「连接层运行时」理解 NLDB 与 HAL 边界，往往更符合系统工程师视角。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
