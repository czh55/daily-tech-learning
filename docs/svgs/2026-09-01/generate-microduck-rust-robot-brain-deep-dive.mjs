import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'microduck-rust-robot-brain-deep-dive.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#b45309,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #f59e0b}
.card h3{font-size:22px;font-weight:700;color:#b45309;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#fffbeb,#fef3c7);border:2px solid #fcd34d;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#b45309}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#b45309,#f59e0b);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#b45309;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>一只机器鸭子，用 Rust 写了个「大脑」：拆解 Hugging Face 爆款机器人 Microduck</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">Microduck · Pollen Robotics</span>
  <span class="tag tag-blue">Rust 零框架</span>
  <span class="tag tag-green">PPO · sim2real</span>
  <span class="tag tag-purple">具身智能</span>
  <span class="tag tag-red">Unix Socket JSON-RPC</span>
</div>
<p class="subtitle">本文解决的核心问题是：一只 399 美元的双足机器鸭如何在资源受限的 RK3566 板上，用纯 Rust 七个守护进程撑起工业级控制与 OTA 可靠性，同时用 MuJoCo+PPO 训练出的策略经 sim2real 迁移到真实硬件上「会走路、会起身、会踢球」。</p>

<div class="map">
  <h3 style="font-size:20px;color:#b45309;margin-bottom:12px;text-align:center">Microduck 双栈架构：Rust 控制面 × RL 行为面</h3>
  <div class="diagram">
    <div class="node">仿真训练<br>mjlab + PPO</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">ONNX 策略<br>61 维观测热切换</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">robotd 50Hz<br>意图→安全执行</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">7 守护进程<br>JSON-RPC/NDJSON</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">「灵魂」在 microduck_rl，「神经中枢」在 microduck 主仓库——两套工程体系共同支撑「好玩又能打」</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「开源机器人 = ROS 堆栈」。Microduck 刻意不用任何应用框架，七个进程用 Unix Socket JSON-RPC 协作——在 ROS 遍地的机器人圈里，这是相当硬核的工程取舍。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Microduck 产品定位</h3>
  <p><strong>在讲什么问题：</strong>Reachy Mini 是会交互的桌面 AI；Microduck 是「会行动的物理 AI」——核心循环是仿真训练→真机部署→观察失败→再训练。</p>
  <p><strong>核心机制：</strong>25 cm 高、约 800 g、15 舵机、摄像头+深度+双 IMU，售价 399 美元；小尺寸让「摔倒」变成可承受的学习成本而非事故。</p>
  <p><strong>关键理解：</strong>学习动作本身很「糟糕」——必须不断尝试、摔倒、再尝试；做小便轻，失败通常只是「一只小鸭子躺在地板上」，还能自己爬起来。</p>
  <p><strong>典型场景：</strong>个人开发者在家做双足运动实验；社区在出厂行为之上叠加新策略。</p>
  <p><strong>边界说明：</strong>出厂行为只是起点，不是能力上限；严肃工业负载或大型人形仍需要更大平台。</p>
  <div class="quote">原文：「Reachy Mini 是『会交互的 AI』平台；Microduck 是『会行动的 AI』平台。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】七守护进程分工与急救通道</h3>
  <p><strong>方法名：</strong>纯 Rust 多进程控制面 · 标签：嵌入式、高可靠、零框架</p>
  <p><strong>核心思路：</strong>一块板子七个进程，Unix Socket 通信；只有 robotd 能碰电机，configd/updaterd/btd 必须在 robotd 崩溃后仍可访问。</p>
  <p><strong>操作步骤：</strong>1) 客户端发「意图」而非直接电机指令 → 2) robotd 50Hz 安全层裁决 → 3) updaterd 整体替换发布+健康门禁 → 4) 失败自动回滚</p>
  <table>
    <tr><th>进程</th><th>职责</th><th>为何独立</th></tr>
    <tr><td>robotd</td><td>电机、运动学、策略、安全</td><td>唯一碰 15 舵机+IMU 串口</td></tr>
    <tr><td>configd</td><td>WiFi、身份、手柄配对</td><td>robotd 挂了仍需配网</td></tr>
    <tr><td>updaterd</td><td>签名校验、切换、回滚</td><td>系统最先开发的模块</td></tr>
    <tr><td>btd/padd</td><td>蓝牙/手柄透传</td><td>无状态纯传输</td></tr>
    <tr><td>mediad/tofd</td><td>音视频/WebRTC、深度传感</td><td>感知与媒体栈</td></tr>
  </table>
  <div class="highlight"><strong>落地建议：</strong>OTA 采用「完整目录 releases/&lt;版本&gt;/ + current 符号链接」，健康检查失败自动换回旧版；启动计数器兜底重启死循环。</div>
</div>

<div class="card">
  <h3>【决策/选型表】通信协议为何选 Unix Socket JSON-RPC</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>板内 IPC</td><td>Unix Socket + NDJSON + serde</td><td>文件权限即访问控制；SO_PEERCRED 审计</td><td>TCP 0.0.0.0</td><td>手滑可能把固件更新暴露到公网</td></tr>
    <tr><td>跨 BLE/WebRTC</td><td>同一 serde 消息类型复用</td><td>类型一致，不绑 D-Bus</td><td>D-Bus 类型系统</td><td>无法直接复用到其他传输</td></tr>
    <tr><td>CPU 密集任务</td><td>spawn_blocking 隔离</td><td>签名校验/解压不卡 IPC</td><td>留在 tokio worker</td><td>更新时 status 查询失去响应</td></tr>
    <tr><td>对比过的方案</td><td>自研 LinesCodec 分帧</td><td>对比过 jsonrpsee/varlink/zbus/axum/tonic</td><td>随手拉大框架</td><td>依赖数失控，30 依赖已够跨通道复用</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】控制系统 vs 强化学习流水线</h3>
  <table>
    <tr><th>维度</th><th>Rust 控制面 (microduck)</th><th>RL 训练面 (microduck_rl)</th><th>一句话结论</th></tr>
    <tr><td>语言/运行时</td><td>纯 Rust + tokio，无 GC</td><td>Python + mjlab + rsl_rl</td><td>执行要确定性，训练要迭代速度</td></tr>
    <tr><td>核心输出</td><td>安全执行意图、OTA 可靠性</td><td>ONNX 策略、61 维观测契约</td><td>部署接口稳定比仿真细节更重要</td></tr>
    <tr><td>精细建模</td><td>进程隔离、回滚门禁</td><td>电压控制律、齿轮间隙、域随机化</td><td>sim2real 差距大半来自执行器精度</td></tr>
    <tr><td>行为切换</td><td>robotd 加载策略</td><td>走路/起身/踢球/轮滑热切换</td><td>统一观测让运行时策略可互换</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】sim2real 与部署陷阱</h3>
  <p><strong>坑名：</strong>仿真用理想 PD，真机电压/摩擦/间隙全不同</p>
  <p><strong>原因：</strong>小舵机+轻机身尺度下，执行器模型误差主导 sim2real 差距。</p>
  <p><strong>原文说法：</strong>「宁可牺牲仿真速度，也要把理想 PD 换成真实电压控制律。」</p>
  <p><strong>解法：</strong>BAM M6 执行器模型 + 域随机化；Backlash 孪生任务建模 ±1° 齿轮间隙，观测维度不变。</p>
  <p><strong>严重程度：</strong>致命——策略在仿真里走得漂亮，真机一上就摔。</p>
  <div class="pitfall" style="background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444">
    <strong>另一坑：</strong>把 CPU 密集操作（zstd/tar/签名校验）放在异步 worker——会导致更新过程中 IPC 卡死，status 查询无响应。
  </div>
</div>

<div class="card">
  <h3>【心法/原则卡】为什么网红机器人选 Rust</h3>
  <p><strong>原则：</strong>资源有限板子上跑 50Hz 实时环，内存安全与无 GC 停顿是硬指标。</p>
  <p><strong>为什么重要：</strong>走路机器人涉及可控电机与安全；类型系统在编译期挡掉悬垂指针类错误。</p>
  <p><strong>怎么落地：</strong>控制平面 tokio 异步等待，CPU 密集丢 spawn_blocking；手写 JSON-RPC 控制依赖数量。</p>
  <p><strong>适用边界：</strong>RL 训练仍用 Python 生态——Rust 管「不能随便崩」的执行面，不替代研究迭代。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：ROS 生态拥护者 · 「不用框架是自找麻烦」</p>
  <p class="rebuttal-text">七个手写进程在团队扩张和异构传感器接入时，会重演微服务早期的集成地狱——ROS2 的成熟工具链和社区包，才是机器人软件该走的正道。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Microduck 爆火背后是双栈工程：Rust 零框架控制面（七进程、JSON-RPC、OTA 回滚）+ PPO sim2real 行为面（精细执行器建模、61 维热切换）。</li>
    <li>架构核心约束：仅 robotd 触电机；configd/updaterd/btd 构成 robotd 崩溃后的急救通道。</li>
    <li>通信选 Unix Socket NDJSON 是安全与复用性的权衡，而非「为了 Rust 而 Rust」。</li>
    <li>小尺寸双足降低学习动作的成本，让社区能在出厂行为上持续叠加。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>克隆 github.com/pollen-robotics/microduck 与 microduck_rl，对照架构文档与 infer_policy.py 理解热切换。</li>
    <li>在 Hugging Face Space 仿真器试驾，建立对行为策略的直觉。</li>
    <li>若做嵌入式控制：画出「谁能碰硬件」边界，OTA 必须带健康门禁与回滚。</li>
    <li>若做 sim2real：优先建模执行器（电压、摩擦、间隙），而非先堆网络容量。</li>
    <li>学习系统级 Rust：从 Unix Socket 权限模型与 tokio/spawn_blocking 拆分开刀。</li>
  </ol>
  <p><strong>关键认知转变：</strong>可爱和便宜是表象；「好玩又能打」来自控制系统可靠性与 RL 迁移工程的双重扎实，而非单一「会聊天的 AI」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
