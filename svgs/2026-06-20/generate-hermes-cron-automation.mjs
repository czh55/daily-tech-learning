import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'hermes-cron-automation.svg');

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
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:140px;font-weight:700;font-size:16px;color:#1e40af}
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
<h1>Hermes Agent Cron 定时自动化：任务链 + 预运行门控 + 零成本触发</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Hermes Agent</span>
  <span class="tag tag-green">Cron 自动化</span>
  <span class="tag tag-orange">wakeAgent 门控</span>
  <span class="tag tag-purple">context_from</span>
</div>
<p class="subtitle">本文解决的核心问题是：如何在 Hermes Agent 中构建可串联、可门控、可零 Token 运行的定时自动化流水线——用 context_from 链接多阶段任务、用 wakeAgent 实现高频轮询零成本跳过、用 no-agent 模式处理纯脚本看门狗。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">Cron 调度</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">wakeAgent 门控</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Agent / no-agent</div>
    <span class="arrow-sym">→</span>
    <div class="node">context_from 链</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">多平台投递</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Cron 任务各自独立，串联只能靠手动读文件」—— Hermes 的 context_from 会在下游任务触发时自动注入上游最近一次成功输出，无需硬编码路径；wakeAgent 门控让 99% 无变更的 tick 零 LLM 调用。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Hermes Cron 三大机制</h3>
  <p><strong>在讲什么问题：</strong>Cron 任务默认隔离无记忆，高频轮询烧钱，纯监控不需要 AI——三大痛点如何一次解决。</p>
  <p><strong>核心机制：</strong>① context_from：任务 B 触发时自动读取任务 A 最近成功输出作为提示词前缀，实现采集→筛选→发布流水线；② wakeAgent 门控：预检查脚本在 Agent 启动前输出 JSON 决定跳过或唤醒，零 Token 静默；③ no-agent 模式：调度器直接运行脚本，有输出才投递，零 LLM 调用。</p>
  <p><strong>关键理解：</strong>三种机制共用同一调度器、生命周期管理与投递路由，不需要为不同模式维护不同工具链。</p>
  <p><strong>典型场景：</strong>每日 AI 新闻三级流水线、SSL 证书 14 天到期告警、竞品仓库变更自动分析、内存/磁盘看门狗。</p>
  <p><strong>边界说明：</strong>context_from 链条建议 3-5 级以内；上游未执行过时下游无额外上下文但正常运行；需要语义理解/总结/分析的任务不能用 no-agent。</p>
  <div class="relation"><strong>相关概念：</strong>与 n8n 等可视化工作流互补——Hermes Cron 深度集成 Agent 推理与消息平台投递，适合已部署 Hermes 的 AI 原生运营场景。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】context_from 三级流水线实战</h3>
  <p><strong>标签：</strong>任务链 · 多阶段自动化</p>
  <p><strong>核心思路：</strong>用名称引用串联隔离会话，上游输出自动成为下游上下文前缀。</p>
  <p><strong>操作步骤：</strong>① 7:00 创建「AI News Collector」采集 HN 前 10 条 AI/ML 新闻；② 7:30 创建「AI News Triage」设 context_from="AI News Collector"，评分筛选 ≥7 分条目；③ 8:00 创建「AI News Brief」设 context_from="AI News Triage"，生成推文草稿，无合格新闻以 [SILENT] 开头抑制投递。</p>
  <p><strong>选型条件：</strong>需要「采集→处理→发布」多阶段且每阶段逻辑不同、需 AI 推理时选用 Agent + context_from。</p>
  <div class="pitfall"><strong>避坑：</strong>context_from 读取的是上游最近一次成功输出，不会等待同一 tick 内正在运行的上游——调度时间必须错开（如 7:00/7:30/8:00）。</div>
  <div class="highlight"><strong>落地：</strong>多任务扇入用 context_from=["task-a","task-b"] 列表，输出按顺序拼接。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】wakeAgent 零成本门控</h3>
  <p><strong>标签：</strong>高频轮询 · Token 节约</p>
  <p><strong>核心思路：</strong>预检查脚本 stdout 最后一行输出 JSON，{"wakeAgent": false} 跳过 Agent，{"wakeAgent": true, "context": {...}} 唤醒并传数据。</p>
  <p><strong>操作步骤：</strong>① 编写门控脚本到 ~/.hermes/scripts/（文件变更检测、外部标志位 touch、SQLite 新行数检查三食谱）；② Cron 任务配置预运行脚本；③ 脚本判断无新状态时输出 wakeAgent:false，有变化时更新状态并 wakeAgent:true。</p>
  <p><strong>对比相邻方法：</strong>无门控每 5 分钟轮询月调 8640 次 Agent；有门控日均 2 次真实变更约 60 次，减少 99.3% 调用。</p>
  <div class="quote">门控脚本开销通常在 10ms 以内完成，wakeAgent 缺省默认为 true。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Agent 模式 vs no-agent 模式</h3>
  <table>
    <tr><th>对比维度</th><th>标准 Agent 模式</th><th>no-agent 模式</th><th>一句话结论</th></tr>
    <tr><td>LLM 调用</td><td>每次 tick 可能推理</td><td>零 Token、零模型消费</td><td>脚本能算清结果就用 no-agent</td></tr>
    <tr><td>适用任务</td><td>语义理解、总结、分析</td><td>阈值告警、健康检查、SSL 监控</td><td>判断标准是输出是否需要推理</td></tr>
    <tr><td>输出规则</td><td>Agent 响应投递</td><td>exit 0 + 非空 stdout 投递，空 stdout 静默</td><td>非零退出码始终投递错误告警</td></tr>
    <tr><td>调度管理</td><td colspan="2">同一调度器，暂停/恢复/列表/日志/投递通用</td><td>无需维护两套工具链</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】Cron 自动化方案选型</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>每日新闻采集→筛选→发布</td><td>三级 context_from + [SILENT]</td><td>各阶段需不同 AI 推理，链式传上下文</td><td>单任务塞全部逻辑</td><td>提示词臃肿、难以调试</td></tr>
    <tr><td>每 5 分钟竞品监控</td><td>wakeAgent 门控 + Agent</td><td>99% tick 无变更，零成本跳过</td><td>无门控直接调 Agent</td><td>月账单爆炸（8640 次/月）</td></tr>
    <tr><td>内存/磁盘/SSL 监控</td><td>no-agent 纯脚本</td><td>阈值比较无需推理，零 Token</td><td>Agent 判断阈值</td><td>浪费模型调用</td></tr>
    <tr><td>一次性提醒</td><td>相对延迟 30m/2h/1d</td><td>简单直接</td><td>Cron 五段式</td><td>过度配置</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Cron 自动化常见陷阱</h3>
  <p><strong>坑名：</strong>通知轰炸——定时任务每隔几小时推送「一切正常」。</p>
  <p><strong>原因：</strong>未使用 [SILENT] 抑制或无门控导致空 tick 也投递。</p>
  <p><strong>原文说法：</strong>「每隔几小时收到一条一切正常的消息，很快就会把通知渠道变成噪声源。」</p>
  <p><strong>解法：</strong>提示词末尾要求无事项时以 [SILENT] 开头回复；no-agent 模式空 stdout 自动静默；wakeAgent:false 跳过 Agent。</p>
  <p><strong>严重程度：</strong>小心——用户很快屏蔽通知渠道，真正告警也被忽略。</p>
  <div class="pitfall"><strong>另一坑：</strong>门控脚本放错路径或含 ../ 遍历——Hermes 只接受 ~/.hermes/scripts/ 下脚本且拒绝路径遍历，严重程度：致命（任务静默失败）。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：n8n / Temporal 工作流工程师</p>
  <p class="rebuttal-text">把流水线塞进 Cron 加 JSON 门控是在用聊天机器人调度器硬扛编排——没有可视化 DAG、没有幂等重试与死信队列，context_from 链条一长就沦为不可观测的黑盒，生产级自动化应交给专业工作流引擎而非 Hermes 定时任务。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Hermes Cron 支持斜杠命令、CLI、自然语言三种等价创建方式，调度格式覆盖相对延迟、间隔、五段 Cron、ISO 时间戳。</li>
    <li>context_from 用名称引用串联隔离会话，实现采集→筛选→发布三级流水线，多任务扇入用列表拼接。</li>
    <li>wakeAgent 门控让高频轮询 99% 无变更 tick 零 LLM 调用，月成本可减少 99.3%。</li>
    <li>no-agent 模式用纯脚本处理阈值告警类任务，与 Agent 任务共用调度器与投递路由。</li>
    <li>[SILENT] 前缀抑制空通知，避免通知渠道变成噪声源。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>用 hermes cron create "0 9 * * *" 创建第一个每日定时任务，--deliver telegram 验证投递。</li>
    <li>搭建三级 AI 新闻流水线：Collector(7:00) → Triage(7:30, context_from) → Brief(8:00, context_from + [SILENT])。</li>
    <li>为高频监控任务编写 wakeAgent 门控脚本到 ~/.hermes/scripts/ 并 chmod +x。</li>
    <li>将内存/磁盘/SSL 类看门狗迁移到 --no-agent 模式，验证空 stdout 静默与非零退出码告警。</li>
    <li>用 hermes cron list 审计全部任务，暂停不再需要的无门控高频 Agent 轮询。</li>
  </ol>
  <p><strong>关键认知转变：</strong>定时自动化不是「每隔多久问 AI 一次」，而是分层决策——脚本能判断的用门控或 no-agent，只有真正需要推理的 tick 才唤醒 Agent，把 Token 花在刀刃上。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
