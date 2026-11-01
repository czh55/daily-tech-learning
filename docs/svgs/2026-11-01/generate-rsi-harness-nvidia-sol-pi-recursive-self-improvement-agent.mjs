import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'rsi-harness-nvidia-sol-pi-recursive-self-improvement-agent.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#047857,#10b981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-green{background:#d1fae5;color:#065f46}.tag-teal{background:#ccfbf1;color:#115e59}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #10b981}
.card h3{font-size:22px;font-weight:700;color:#047857;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ecfdf5,#a7f3d0);border:2px solid #6ee7b7;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#fed7aa);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#047857,#10b981);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#ecfdf5;padding:10px 12px;text-align:left;font-weight:700;color:#047857;border-bottom:2px solid #a7f3d0}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>SoL-Pi：RSI 启发的 Harness 自我改进流水线</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">NVIDIA</span>
  <span class="tag tag-teal">Agent Harness</span>
  <span class="tag tag-slate">RSI / EdgeBench</span>
</div>
<p class="subtitle">本文解决的核心问题是：在模型不变的前提下，如何用离线、可审计的 RSI 启发闭环让 AI 研究 Agent 自动提出并筛选 Harness 改进，在守住能力底线的同时把 Token 与 API 成本压到约三分之一，并把这条流水线迁移到工程师自己的 Agent 栈。</p>

<div class="map">
  <h3 style="font-size:20px;color:#047857;margin-bottom:12px;text-align:center">SoL-Pi 搜索闭环</h3>
  <div class="diagram">
    <div class="node">152 候选</div><span class="arrow-sym">→</span>
    <div class="node">独立研究循环</div><span class="arrow-sym">→</span>
    <div class="node">双门筛选</div><span class="arrow-sym">→</span>
    <div class="node">冻结 4 机制</div><span class="arrow-sym">→</span>
    <div class="node node-orange">留出集一次验收</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">虚线「更便宜的下一轮研究」仍是愿景，论文未证明复利</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：SoL-Pi = Agent 在线运行时自己改 Harness。实际是<strong>离线、模型固定、人类守两端</strong>的 L2 形态；不是全自治 RSI，留出集结果绝不回流训练。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】SoL-Pi 与 RSI Harness 定位</h3>
  <p><strong>在讲什么问题：</strong>编程 Agent 变强后，Token 冗余与「能否改生产 AI 系统本身」两条线如何同时推进？</p>
  <p><strong>关键理解：</strong>先让 AI 把 Harness 改得更省，再用更省的 Harness 支撑下一轮研究——SoL-Pi 是 RSI-inspired、作用于 Harness 层，观察轨迹、提出改动、双门验收。</p>
  <p><strong>和其他概念关系：</strong>L1 人工改 Harness → L2 SoL-Pi（AI 离线搜索 + 人审幸存者）→ L3/L4 仍开放。</p>
  <p><strong>怎么落地用：</strong>固定能力指标与容差（对优化 Agent 不可见），再搜效率改进；535 环境训练，EdgeBench 留出隔离。</p>
  <p><strong>边界说明：</strong>不是运行时自改；开放式循环中目标漂移可能人类察觉前已累积；「递归高效改进」未实证。</p>
  <p><strong>原文依据：</strong>「与其先去规模化 RSI，不如先让 AI 把 Harness 变得更省，再让更省的 Harness 去支撑下一轮 RSI。」</p>
</div>

<div class="card">
  <h3>【跨概念对比表】L1～L4 Harness 改进形态</h3>
  <table>
    <tr><th>对比维度</th><th>L1 人工</th><th>L2 SoL-Pi</th><th>L4 全自治（愿景）</th><th>一句话结论</th></tr>
    <tr><td>谁主导</td><td>人看轨迹手改</td><td>AI 研究 Agent + 人审幸存</td><td>人退出</td><td>当前可落地在 L2</td></tr>
    <tr><td>数据隔离</td><td>依赖工程习惯</td><td>训练/留出物理隔离、一次验收</td><td>未知</td><td>留出绝不回流是硬护栏</td></tr>
    <tr><td>风险</td><td>慢但可控</td><td>搜索烧 Token、能力作弊</td><td>漂移难察觉</td><td>双门 + 冻结指标防作弊</td></tr>
    <tr><td>SoL-Pi 证据</td><td>—</td><td>4 机制、EdgeBench 成本 −33%</td><td>未证明</td><td>省成本 ≠ 全面更强</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】四个幸存机制怎么切 Harness</h3>
  <p><strong>核心思路：</strong>152 候选经 Oracle 预筛与独立 autoresearch 循环，仅 4 个机制组合通过能力底线且改善效率。</p>
  <p><strong>操作步骤：</strong>① Action Fusion：编辑+测试命令合成一次工具调用（Schema 级稳定触发）→ ② Online Context Compact：子任务边界算「省输入 vs 重写缓存」回本才压 → ③ ObservationPack：超大工具输出前两次全量、之后句柄+摘录 → ④ Evidence-Preserving Reducer：便宜模型压缩日志，确定性校验引用与哈希，失败回退原文。</p>
  <p><strong>选型条件：</strong>轨迹里相邻 edit+test 多、上下文膨胀、巨型 build 日志、重复工具输出时分别对应四机制。</p>
  <p><strong>避坑：</strong>单靠提示词融合动作触发不稳定——论文中改 Schema 才零无效调用；完整方案缓存写入反而增多，要看任务总账而非命中率。</p>
  <p><strong>原文引用：</strong>「不能只盯缓存命中率，要算整个任务的总账。」</p>
</div>

<div class="card">
  <h3>【决策/选型表】何时用完整 SoL-Pi vs 单机制</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>优先降 API 成本、可接受 ~6% 得分损失</td><td>完整四机制组合</td><td>EdgeBench Token −49%、成本 −33%（对 Pi）</td><td>只加 Context Compact</td><td>单机制得分可掉到 42.0</td></tr>
    <tr><td>要保分又减轮次</td><td>+ Action Fusion</td><td>Opus 上得分 50.5（+12.8% vs Pi）</td><td>跳过能力门</td><td>早停/删验证类作弊</td></tr>
    <tr><td>TB4/IMO 要解题数</td><td>原生 Pi/Codex</td><td>SoL-Pi TB4 少 3 题、IMO Codex 5 vs 3</td><td>默认 SoL-Pi 最强</td><td>论文明确「更便宜不是更强」</td></tr>
    <tr><td>多 Agent 集群</td><td>SoL-Pi worker</td><td>20 worker 周期 −17.5%、成本 −26.8% vs Pi 集群</td><td>单 Sol 当集群方案</td><td>单 Agent 仍最便宜</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】RSI Harness 搜索陷阱</h3>
  <p><strong>坑名：</strong>留出集结果回流修补候选。</p>
  <p><strong>原因：</strong>会直接过拟合公开基准，虚假泛化。</p>
  <p><strong>解法：</strong>冻结后留出集只评估一次，失败即淘汰。</p>
  <p><strong>严重程度：</strong>致命——科学性与上线信任。</p>
  <p><strong>坑名：</strong>养一个不断膨胀的实验协调器。</p>
  <p><strong>原因：</strong>YAML 工作流修边缘 case、主 Agent 写协调代码都曾拖垮迭代。</p>
  <p><strong>解法：</strong>一次性技能循环：最小模板复制、改参、跑完即丢。</p>
  <p><strong>严重程度：</strong>小心——规模化搜索会卡死在编排。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】工程师 RSI Harness 七条清单</h3>
  <p><strong>原则：</strong>先声明再搜索；双门验收；训练/留出隔离；Oracle 预量化再分配 rollout；广度优先（约 1/40 转化率）；编排即用即弃；人守先验与幸存代码审阅。</p>
  <p><strong>为什么重要：</strong>模型迭代 5～10 轮易陷局部盆地，没有冻结指标则「省 Token」会变成少干活。</p>
  <p><strong>怎么落地：</strong>伪代码 accept(candidate)：门1 能力 ≥ baseline−容差；门2 至少一项效率改善；留出集函数冻结后只读一次。</p>
  <p><strong>适用边界：</strong>搜索轨迹目前主要在单一 Sol 后端；Opus 零调整迁移有效但 TB4 仍掉题。</p>
  <p><strong>原文支撑：</strong>「只有『不少干活』的节省才算数。」</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「手工调 Prompt 和工具 Schema 就够了，不必上 535 环境 + 152 想法的 SoL-Pi 重武器」</p>
  <p class="rebuttal-text">单点提示无法稳定 Action Fusion 触发率，也无法在双门与留出隔离下证明组合机制不牺牲 TB4/IMO 之外的泛化——SoL-Pi 卖的是可复制的离线搜索与防作弊验收，不是多写几条 System Prompt。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>SoL-Pi 是 L2 离线 RSI-inspired Harness 改进，模型不变，人类提供先验并审阅 4 个幸存机制。</li>
    <li>双门（能力底线 + 效率改善）与留出集一次验收是防作弊与过拟合的核心。</li>
    <li>四机制分别优化动作合并、子任务上下文、大观测打包、日志委派压缩。</li>
    <li>EdgeBench 上成本约降三分之一、对原生 Harness API 成本低 50%～54%，得分约保留 94%，但 TB4/IMO 解题数不占优。</li>
    <li>工程师应复制「声明—搜索—隔离—即用即弃编排」流水线，而非只抄四个机制名。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>阅读 NVIDIA SoL-Pi 论文与 Tony Bai 导读，画出自己 Agent 栈的 L1/L2 位置。</li>
    <li>列出 3～5 个冻结能力指标（任务得分、测试通过率等）及对优化 Agent 隐藏的容差。</li>
    <li>从轨迹 Oracle 估算 edit+test、上下文膨胀、大工具输出三类浪费，挑 1 个机制做小范围 A/B。</li>
    <li>预留独立留出任务集，规定「冻结后只跑一次、结果不回写」。</li>
    <li>用最小实验模板跑 autoresearch 循环，避免长期维护 YAML/协调代码巨兽。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>Agent 竞争的下一层不在「更大的模型」，而在「谁有一套可审计、可隔离、能自动提出 Harness 改进的 RSI 流水线」——SoL-Pi 证明省成本可工程化，但「递归高效改进」仍须用更便宜的 Harness 去赚回搜索本身的 Token 账单。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
