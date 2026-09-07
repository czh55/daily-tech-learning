import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'physical-ai-gold-rush.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#1e40af}`;

const body = `
<h1>物理 AI 淘金热：为何机器人是下一个数万亿美元级的超级风口</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">物理 AI</span>
  <span class="tag tag-green">具身智能</span>
  <span class="tag tag-orange">VLA 大模型</span>
  <span class="tag tag-purple">Sim-to-Real</span>
</div>
<p class="subtitle">本文解决的核心问题是：当行业还在卷聊天套壳时，物理 AI 为何正从「机器人坟场」转向万亿美元风口——软件工程师如何在不造硬件的前提下，抓住 VLA 范式转移与四大高利润软件变现路径。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">物理 AI 技术栈与商业价值链</h3>
  <div class="diagram">
    <div class="node">数字 AI<br>对话框 / SaaS</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">VLA 大脑<br>像素+语言→动作</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">1000Hz 安全层<br>确定性兜底</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">四大软件变现<br>RaaS / 数据 / 垂直 / HITL</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">Sim-to-Real 飞轮：仿真环境 50 年试错 → 真实世界部署</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「机器人还是走不稳、动不动就翻车，离商业化还远」。作者指出：36 个月内已从「走不稳」快进至「因阴影误判而高速冲撞垃圾桶」——问题不是能不能动，而是控制范式已从硬编码 IK 转向端到端 Token 预测，商业窗口正在打开。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】物理 AI 与 VLA 范式转移</h3>
  <p><strong>在讲什么问题：</strong>AI 正从纯数字空间（聊天机器人、SaaS 套壳）历史性迈向具备自主行动能力的现实物理世界。</p>
  <p><strong>核心机制：</strong>视觉-语言-动作（VLA）模型以摄像头像素帧 + 自然语言提示为输入，端到端直接输出机械关节动作指令——将机器人控制重构为「下一个 Token 预测问题」，摒弃手写运动学逆解（IK）和传统 CV 硬编码。</p>
  <p><strong>关键理解：</strong>过去二十年软件吞噬世界，物理 AI 即将消化它；机器人曾是 VC 坟场（过度工程硬件、脆弱 C++ 脚本），但 VLA + Sim-to-Real 正在重写研发逻辑。</p>
  <p><strong>典型场景：</strong>机械臂抓取、四足巡检、人形机器人行走——任何需要感知-决策-执行闭环的物理任务。</p>
  <p><strong>边界说明：</strong>VLA 擅长开放域泛化，但工业级 99.99% 可靠性仍需海量物理数据 + 确定性安全层兜底；不能指望纯端到端模型独自承担合规与安全。</p>
  <div class="quote">原文：「我们终于彻底放弃了编写僵化死板的逻辑规则，转而开始将机器人控制视为一个下一个 Token 预测问题。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】数字 AI vs 物理 AI</h3>
  <table>
    <tr><th>对比维度</th><th>数字 AI</th><th>物理 AI</th><th>一句话结论</th></tr>
    <tr><td>输出空间</td><td>文本 / 图像 / 代码</td><td>连续 7-DOF 关节速度向量</td><td>从信息生成到物理行动</td></tr>
    <tr><td>控制方式</td><td>Prompt 工程</td><td>VLA 端到端 + 1000Hz 安全校验</td><td>大脑灵活，手脚需确定性兜底</td></tr>
    <tr><td>训练环境</td><td>互联网语料</td><td>仿真 50 年试错 + 真实遥测数据</td><td>Sim-to-Real 是核心飞轮</td></tr>
    <tr><td>失败代价</td><td>幻觉 / 错误回答</td><td>撞翻垃圾桶 / 倾倒 420 杯拿铁</td><td>物理世界容错极低</td></tr>
    <tr><td>商业重心</td><td>套壳应用 / API 调用</td><td>中间件 / 数据管线 / 垂直集成</td><td>软件利润率 &gt; 硬件制造</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】VLA + 确定性安全控制器架构</h3>
  <p><strong>方法名：</strong>VisionLanguageActionModel + RealtimeSafetyController · 标签：边缘部署 / 工业安全</p>
  <p><strong>核心思路：</strong>VLA 大脑负责感知与动作规划，1000Hz 高频安全层负责力传感器阈值校验与紧急阻尼缓冲。</p>
  <p><strong>操作步骤：</strong>1) 加载多模态具身基座模型（RT-2 / OpenVLA 风格）→ 2) <code>predict_action(image, prompt)</code> 输出 7-DOF 轨迹 → 3) 安全层 <code>validate_trajectory</code> 检测力传感器是否超 45N 阈值 → 4) 超限则动作速度瞬间降低 90% 触发柔顺保护 → 5) 通过校验后下发电机指令</p>
  <div class="highlight"><strong>落地建议：</strong>软件工程师无需机械博士学位——优先掌握三件事：微调开源 VLA 权重、用确定性高频控制器严密封装、向客户销售 ROI 而非金属玩具。</div>
  <div class="pitfall"><strong>避坑：</strong>不要跳过安全层直接部署 VLA 输出——五角大楼机器狗因阴影误判冲撞垃圾桶、东京咖啡臂空倒 420 杯拿铁，都是缺乏边缘校验的真实案例。</div>
</div>

<div class="card">
  <h3>【决策/选型表】四大高利润软件变现路径</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>有硬件但软件体验差</td><td>RaaS 通用 AI 中间件</td><td>宇树/优傲/库卡硬件强但软件弱</td><td>自建工厂造硬件</td><td>CapEx 天量，利润率低</td></tr>
    <tr><td>需要 99.99% 工业可靠性</td><td>物理数据 / 合成数据管线</td><td>万亿级遥测+触觉+边缘工况数据</td><td>只靠互联网预训练</td><td>开放域泛化 ≠ 工业合规</td></tr>
    <tr><td>高流失/高危险 B 端场景</td><td>垂直微自动化集成</td><td>光伏巡检、激光除草、船体清理</td><td>通用家庭保姆机器人</td><td>环境太开放，落地极难</td></tr>
    <tr><td>罕见边缘工况频发</td><td>Human-in-the-Loop 接管</td><td>5 秒人工介入优于死机失控</td><td>纯自主不求助</td><td>未标定障碍物等长尾无法覆盖</td></tr>
  </table>
  <p style="margin-top:12px"><strong>变现模式速查：</strong>RaaS 按台 $500–2000/月；数据按数据集包或 API 调用计费；垂直场景合同制 + 节省成本分成；HITL 按成功干预次数收费。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】物理 AI 创业与入局陷阱</h3>
  <p><strong>坑名：</strong>继续卷 ChatGPT 套壳应用</p>
  <p><strong>原因：</strong>数字 AI 红利窗口收窄，物理 AI 正在打开万亿美元自动化集群。</p>
  <p><strong>解法：</strong>转向为现实物理世界构建软件——中间件、数据、垂直集成、人机协同四选一。</p>
  <p><strong>严重程度：</strong>致命（错失范式窗口）</p>
  <div class="pitfall"><strong>好高骛远做通用家务机器人：</strong>环境开放、长尾无限，应找极其具体、脏乱、高流失的 B 端痛点。</div>
  <div class="pitfall"><strong>忽视 Sim-to-Real 差距：</strong>仿真训练不等于真实部署，需持续真实遥测数据闭环。</div>
  <div class="pitfall"><strong>纯端到端无安全兜底：</strong>VLA 灵活性与工业合规之间，1000Hz 确定性控制器不可省略。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】软件吞噬物理世界的入场法则</h3>
  <p><strong>原则：</strong>聪明资本涌向「核心软件系统 &gt; 数据中间件 &gt; 垂直应用层」，而非重资产硬件制造。</p>
  <p><strong>为什么重要：</strong>移动互联网 App 时代催生纯软件独角兽；物理 AI 时代将孕育首批万亿美元级自动化企业——但分一杯羹不需要机械工程博士学位。</p>
  <p><strong>怎么落地：</strong>1) 微调开源 VLA → 2) 确定性安全封装 → 3) 卖 ROI / 降本 / 安全合规，不卖金属玩具。</p>
  <p><strong>适用边界：</strong>适用于软件工程师与创业者选型；硬件 OEM 合作仍需理解电机、减速箱等供应链，但不必自建工厂。</p>
  <div class="quote">原文：「别再继续折腾无聊的 ChatGPT 套壳应用了。去为现实物理世界构建真正改变世界的软件吧。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：机器人 VC 老兵 · 「坟场论」派</p>
  <p class="rebuttal-text">机器狗撞垃圾桶、咖啡臂空倒六小时——这些不是「快进了」，而是端到端模型在物理世界根本不可靠的铁证，万亿美元叙事不过是新一轮泡沫包装。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>物理 AI 是数字 AI 之后的范式大转移：VLA 将机器人控制重构为 Token 预测，Sim-to-Real 让人形机器人在仿真中积累 50 年试错。</li>
    <li>真实翻车案例（机器狗误判、咖啡臂死循环）证明物理世界容错极低，1000Hz 确定性安全层是 VLA 部署的必要兜底。</li>
    <li>软件工程师无需造硬件：四大高利润路径为 RaaS 中间件、物理数据管线、垂直微自动化、Human-in-the-Loop 基础设施。</li>
    <li>避开通用家务机器人，聚焦具体 B 端高痛点场景；变现应卖商业价值（ROI、合规），而非金属外壳。</li>
    <li>移动互联网时代纯软件独角兽的经验，将在物理 AI 时代以更大规模重演。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>评估团队能力是否匹配四大软件路径之一，而非盲目入局硬件制造。</li>
    <li>在原型环境尝试加载开源 VLA 基座（RT-2 / OpenVLA 风格），理解 image + prompt → action 的端到端流程。</li>
    <li>为任何 VLA 部署设计 1000Hz 力传感器阈值校验与紧急阻尼逻辑，不可裸奔上线。</li>
    <li>调研 NVIDIA Isaac Sim 等仿真平台，规划 Sim-to-Real 数据飞轮。</li>
    <li>向潜在客户_pitch 时聚焦降本、安全合规、人力替代等可量化 ROI，而非技术炫技。</li>
  </ol>
  <p><strong>关键认知转变：</strong>机器人不再是「机械工程 + 脆弱脚本」的坟场叙事——当控制逻辑变成 Token 预测、训练变成仿真飞轮、利润集中在软件中间件时，软件工程师反而站在了物理 AI 浪潮的最有利位置。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
