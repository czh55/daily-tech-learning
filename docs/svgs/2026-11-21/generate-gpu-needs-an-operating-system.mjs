import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'gpu-needs-an-operating-system.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#020617,#0f172a);padding:48px 60px;color:#e2e8f0}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#22d3ee,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-gpu{background:#164e63;color:#67e8f9}.tag-os{background:#312e81;color:#c4b5fd}.tag-llm{background:#14532d;color:#86efac}
.card{background:#1e293b;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.35);border-left:5px solid #06b6d4}
.card h3{font-size:22px;font-weight:700;color:#67e8f9;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#cbd5e1;margin-bottom:10px}
.map{background:#0f172a;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.4);border:1px solid #334155}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:16px 0}
.node{background:linear-gradient(135deg,#164e63,#1e3a8a);border:2px solid #0891b2;border-radius:14px;padding:12px 14px;text-align:center;min-width:80px;font-weight:700;font-size:11px;color:#a5f3fc}
.node-em{background:linear-gradient(135deg,#4c1d95,#1d4ed8);border-color:#818cf8;color:#ede9fe}
.arrow-sym{font-size:14px;color:#64748b}
.conclusion{background:linear-gradient(135deg,#0e7490,#4338ca);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#164e63;padding:10px 12px;text-align:left;font-weight:700;color:#67e8f9;border-bottom:2px solid #06b6d4}
td{padding:10px 12px;border-bottom:1px solid #334155;color:#cbd5e1;vertical-align:top}
.correction{background:#422006;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#fcd34d;margin-bottom:8px}
.rebuttal{background:#1e1b4b;border:2px solid #6366f1;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#a5b4fc;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#818cf8;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#e0e7ff}
.subtitle{font-size:17px;color:#94a3b8;margin-bottom:32px;line-height:1.6}
.highlight{background:#164e63;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#a5f3fc;border-left:4px solid #22d3ee}`;

const body = `
<h1>GPU OS：把推理时空闲算力收回来</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-gpu">OpenInfer</span>
  <span class="tag tag-os">六层调度</span>
  <span class="tag tag-llm">Decode 访存瓶颈</span>
</div>
<p class="subtitle">本文解决的核心问题是：大模型推理时 Tensor Core 大量闲置并非「卡不够强」，而是 Decode 访存受限且缺乏微秒级抢占与多维资源治理；OpenInfer 提出 GPU OS（Slack 预算、可暂停 Kernel、准入控制），实验在 Kimi K2 前台下约回收 24% 算力、延迟仅增 1.6%——但真实训练/评估后台仍受显存与缓存竞争制约。</p>

<div class="map">
  <h3 style="font-size:20px;color:#67e8f9;margin-bottom:12px;text-align:center">大模型推理：Prefill 并行 vs Decode 等带宽</h3>
  <div class="diagram">
    <div class="node-em">Prompt Prefill</div><span class="arrow-sym">→</span>
    <div class="node">矩阵密集</div><span class="arrow-sym">→</span>
    <div class="node-em">逐 Token Decode</div><span class="arrow-sym">→</span>
    <div class="node">读权重等待</div><span class="arrow-sym">→</span>
    <div class="node-em">Tensor Core 空转</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#94a3b8;margin-top:12px">论文实测 Qwen3.5-397B Tensor Core 活跃约 7%、Kimi K2 约 6–11%——瓶颈在算术强度跟不上 Ridge，而非峰值 FLOPS。</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#fde68a;font-size:16px">误解：买更多 GPU 就能填满算力。原文强调小 Batch Decode 是 Memory-bound，且现有 MIG/Green Context/Stream Priority <strong>不能微秒抢占</strong>——后台 Kernel 可能让前台延迟放大 10 倍（极端实验 1ms 后台 → AMD MI300X 上或等 200ms）。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Slack：前台性能余量即后台预算</h3>
  <p><strong>在讲什么：</strong>如何在保证在线 SLO 的前提下塞进后台任务？</p>
  <p><strong>关键理解：</strong>若推理基准 40ms、允许延迟涨 6%，则 Slack = 42.4 − 40 = <strong>2.4ms</strong>；GPU OS 在此预算内调度后台，而非固定分区静态切卡。</p>
  <p><strong>关系：</strong>类比 CPU 时间片，但 GPU 需同时治理 SM、显存带宽、L2、设备内存、PCIe/NVLink、功耗。</p>
  <p><strong>落地：</strong>为每条在线路径定义 p99 延迟 × (1+ε) 为硬约束，后台准入由 Cost Model（L4）+ Admission（L5）裁决。</p>
  <p><strong>边界：</strong>Slack 过小或波动大时不应塞训练；仅适用于可预测的前台负载曲线。</p>
  <p><strong>原文：</strong>「在不突破预算的情况下，尽可能多地安排后台工作。」</p>
</div>

<div class="card">
  <h3>【跨概念对比表】MIG / Green Context / Stream Priority vs GPU OS</h3>
  <table>
    <tr><th>维度</th><th>MIG</th><th>Green Context</th><th>Stream Priority</th><th>GPU OS 目标</th></tr>
    <tr><td>粒度</td><td>固定实例分区</td><td>限制 SM 数量</td><td>队列优先级</td><td>Kernel 片段级动态分配</td></tr>
    <tr><td>抢占</td><td>重分区常需重置 GPU</td><td>无真抢占</td><td>低优 Kernel 难被中断</td><td>5–20μs 级暂停恢复</td></tr>
    <tr><td>带宽/缓存</td><td>部分隔离</td><td>不完全解决竞争</td><td>基本不管</td><td>Resource Governor 全栈 QoS</td></tr>
    <tr><td>适用</td><td>租户硬隔离</td><td>粗力度前后台切分</td><td>简单优先级</td><td>前台 SLO + 后台填缝</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】六层 GPU OS 架构</h3>
  <p><strong>L0 芯片：</strong>快速暂停信号、内存优先级、动态分区硬件原语。</p>
  <p><strong>L1 Kernel 规范：</strong>短片段、可暂停点、状态保存、资源声明（算力/带宽/缓存）。</p>
  <p><strong>L2 On-GPU Scheduler：</strong>片段映射到 SM。</p>
  <p><strong>L3 Resource Governor：</strong>限制后台对 L2/显存/传输的干扰。</p>
  <p><strong>L4 Cost Model + L5 Admission：</strong>预测对前台影响，决定后台能否入场及配额。</p>
  <p><strong>编译器角色：</strong>Triton/CUTLASS 需自动生成多分区版本与安全暂停点——程序员手工不切现实。</p>
</div>

<div class="card">
  <h3>【决策/选型表】后台工作负载与回收预期</h3>
  <table>
    <tr><th>后台类型</th><th>论文回收（Green Context，6% Slack）</th><th>前台延迟</th><th>选型建议</th></tr>
    <tr><td>合成寄存器 GEMM</td><td>约 23% SM</td><td>约 +5.1%</td><td>验证调度机制上限</td></tr>
    <tr><td>真实 FP8 GEMM</td><td>约 9%</td><td>约 +4.7%</td><td>更接近算子，仍受缓存竞争</td></tr>
    <tr><td>Resident Kernel + 16 请求</td><td>约 24%</td><td>约 +1.6%</td><td>研究型潜力，非通用训练</td></tr>
    <tr><td>完整训练/评估</td><td>论文未无损验证</td><td>风险更高</td><td>需独立验证带宽隔离</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】把论文数字当生产承诺</h3>
  <p><strong>坑 1：</strong>只看 SM 回收率，忽略 L2/DRAM 争用 → 前台 p99 仍劣化。<strong>解法：</strong>监控带宽与缓存 miss，不单看 Tensor Core%。</p>
  <p><strong>坑 2：</strong>后台 Kernel 不可暂停 → 抢占失效。<strong>解法：</strong>强制片段化编译 + 驻留循环自调度（Resident Kernel 研究路径）。</p>
  <p><strong>坑 3：</strong>24% 回收来自合成任务。<strong>解法：</strong>用真实 FP8/训练 step 复现实验再定 SLO。</p>
  <p><strong>坑 4：</strong>L4/L5 尚未完整实现。<strong>解法：</strong>生产先用 Green Context + 严格准入，等待厂商微秒抢占与显存优先级。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】竞争点从「卡数」到「利用率操作系统」</h3>
  <p><strong>原则：</strong>硬件够强后，胜败在能否让每张卡多角色、可让渡、可观测。</p>
  <p><strong>反面：</strong>24×7 独占推理实例 + 夜间空转训练集群 = 重复资本支出。</p>
  <p><strong>落地：</strong>白天在线推理保 Slack；夜间提高后台配额；新请求触发抢占链。</p>
  <p><strong>边界：</strong>预印本，跨模型通用性与真实训练共置仍待证；需芯片/OS/编译器/框架四方协同。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「多买 GPU 比改软件栈便宜」</p>
  <p class="rebuttal-text">当 Tensor Core 活跃个位数、卡价与电费已封顶时，线性加卡无法消解 Decode 访存天花板；且缺抢占的粗暴共置会直接把 p99 打穿。论文表明在约束内可挖约四分之一算力——忽视 OS 层等于长期为闲置 SM 付租金。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>推理闲置主因是 Decode 访存瓶颈，不是峰值算力不足。</li>
    <li>现有分区/优先级机制不足以微秒抢占与全栈资源 QoS。</li>
    <li>GPU OS 用 Slack + 可暂停 Kernel + 六层治理回收后台算力，实验约 24%@+1.6% 延迟（研究场景）。</li>
    <li>真实训练共置仍需硬件抢占、显存优先级与成本模型成熟。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>用 Nsight 等区分 Tensor Core 活跃率与整卡利用率，确认是否 Memory-bound。</li>
    <li>为在线服务定义 Slack（如 +6% p99）并禁止无暂停长 Kernel 与前台共卡。</li>
    <li>试点 Green Context 双区 + 合成/真实 GEMM 复现 9–23% 回收曲线。</li>
    <li>跟踪编译器片段化与厂商微秒抢占路线图，避免自建不可维护调度 hack。</li>
    <li>将 24% 视为机制上限警示，而非训练混布 SLA。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「堆 GPU 数量」转向「为 GPU 安装操作系统级调度」——让昂贵算力在推理缝隙里安全打工，而不是在访存等待中摸鱼。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');