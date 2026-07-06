import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'hermes-agent-home-assistant.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#7c3aed,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #7c3aed}
.card h3{font-size:22px;font-weight:700;color:#6d28d9;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:2px solid #c4b5fd;border-radius:16px;padding:16px 20px;text-align:center;min-width:110px;font-weight:700;font-size:14px;color:#6d28d9}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:20px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#6d28d9,#8b5cf6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#6d28d9;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Hermes Agent + Home Assistant：用 AI 语音管家控制全屋智能家居</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-purple">Hermes Agent</span>
  <span class="tag tag-blue">Home Assistant</span>
  <span class="tag tag-green">语音管家</span>
  <span class="tag tag-orange">智能家居</span>
</div>
<p class="subtitle">本文解决的核心问题是：如何让 AI Agent 不止于「开灯」式语音中继，而是通过 REST 主动控制 + WebSocket 被动监听 + 记忆与技能学习，成为能推理「我要睡了」并执行整套睡前例程的 24 小时智能家居管家。</p>

<div class="map">
  <h3 style="font-size:20px;color:#6d28d9;margin-bottom:12px;text-align:center">Hermes + HA 双通道架构</h3>
  <div class="diagram">
    <div class="node">用户入口<br><span style="font-size:12px;font-weight:400">语音/Telegram/CLI</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Hermes Agent<br><span style="font-size:12px;font-weight:400">推理+记忆+Skill</span></div>
    <span class="arrow-sym">⇄</span>
    <div class="node-orange">Home Assistant<br><span style="font-size:12px;font-weight:400">4000+ 品牌设备</span></div>
    <span class="arrow-sym">←</span>
    <div class="node">WebSocket 事件<br><span style="font-size:12px;font-weight:400">传感器/报警被动触发</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「连上 HA 就是 AI 智能家居」——Alexa/Siri 本质是命令中继；Hermes 的差距在 Agent 架构：工具调用、持久记忆、技能学习、跨平台 Gateway 四能力同时作用于家居场景。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】REST 主动控制 vs WebSocket 被动响应</h3>
  <p><strong>在讲什么问题：</strong>一个 Token 如何激活 Hermes 对全屋设备的完整控制能力？</p>
  <p><strong>核心机制：</strong>REST（ha_* 工具）是「你对管家说开灯」；WebSocket Gateway 是「管家盯着门窗传感器，异常时主动开走廊灯并推送 Telegram」。</p>
  <p><strong>关键理解：</strong>两种模式互补才构成完整 AI 管家——仅有语音控制是主动模式，缺少事件驱动的被动自动化。</p>
  <p><strong>典型场景：</strong>远程 Telegram 查安全状态；前门打开自动开灯并通知；Cron 早晚例程。</p>
  <p><strong>边界说明：</strong>Gateway 默认不转发任何事件，必须配置 watch_domains/entities，否则所有状态变化被静默丢弃。</p>
  <div class="quote">原文：「Alexa 只能执行开灯，Hermes 能理解我要睡了——记得关客厅灯、调卧室 20%、降恒温器，并保存为睡前例程技能。」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】三步接入 + ha_* 四工具</h3>
  <p><strong>核心思路：</strong>HA Profile 创建 Long-Lived Token → 写入 ~/.hermes/.env 的 HASS_TOKEN/HASS_URL → config.yaml 配置 Gateway 事件过滤 → hermes gateway 启动。</p>
  <p><strong>操作步骤：</strong>1. ha_list_entities 发现设备 → 2. ha_get_state 查详情 → 3. ha_list_services 看可用操作 → 4. ha_call_service 执行控制（核心写操作）。</p>
  <p><strong>选型条件：</strong>需要多步推理（「家里安全吗」= 查门窗+报警+锁具+汇总）时选 Hermes；仅需固定 Intent 匹配时用 HA OpenAI Conversation 更轻。</p>
  <div class="highlight">零成本语音：faster-whisper 本地 STT + Edge TTS（zh-CN-XiaoxiaoNeural）中文效果已相当自然。</div>
  <div class="pitfall">安全：shell_command、python_script、hassio 等六域被硬编码封锁；实体 ID 正则校验防注入；后续将加审批闸门与白名单。</div>
  <div class="quote">原文：「这不是简单命令中继——Agent 自主决定查哪些设备、什么顺序、最后生成人类可读安全报告。」</div>
</div>

<div class="card">
  <h3>【决策/选型表】AI 智能家居方案怎么选</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>记得习惯、会学习、跨平台入口</td><td>Hermes + HA</td><td>三层记忆+Skill 自动沉淀+20+ 消息平台</td><td>纯 Alexa Routines</td><td>无推理、无记忆、设备生态封闭</td></tr>
    <tr><td>仅自然语言控灯/空调</td><td>HA + home-llm</td><td>轻量本地化、资源消耗极低</td><td>上完整 Hermes</td><td>过度工程</td></tr>
    <tr><td>HA 内部语音、Intent 模板够用</td><td>HA + OpenAI Conversation</td><td>深度 HA 集成、配置简单</td><td>Hermes 外部 Agent</td><td>多一跳运维</td></tr>
    <tr><td>米家设备统一 AI 控制</td><td>米家→Xiaomi Miot Auto→HA→Hermes</td><td>无需换设备，HA 桥接即可</td><td>等小爱同学开放 API</td><td>生态封闭、无 Agent 能力</td></tr>
    <tr><td>Apple 用户 iMessage 控非 HomeKit 设备</td><td>Hermes + BlueBubbles + Apple Skill</td><td>iMessage 入口 + HA 全品牌</td><td>纯 HomeKit + Siri</td><td>设备限于 HomeKit 生态</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】Hermes vs HA + OpenAI Conversation</h3>
  <table>
    <tr><th>对比维度</th><th>Hermes Agent</th><th>HA + OpenAI Conversation</th><th>一句话结论</th></tr>
    <tr><td>AI 层机制</td><td>LLM 原生工具调用，自主推理</td><td>Intent 模板匹配+分发</td><td>Hermes 主动推理，后者被动匹配</td></tr>
    <tr><td>记忆</td><td>三层持久记忆</td><td>每次对话独立</td><td>偏好可沉淀</td></tr>
    <tr><td>多步编排</td><td>「检查安全」自动多工具链</td><td>预定义动作组合</td><td>复杂场景 Hermes 独挡</td></tr>
    <tr><td>入口</td><td>Telegram/Discord/CLI/iMessage 等</td><td>HA Assist 内部</td><td>Hermes 跨平台统一</td></tr>
    <tr><td>LLM 绑定</td><td>30+ 提供商含本地 Ollama</td><td>依赖 OpenAI</td><td>Hermes 成本与隐私更灵活</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】生产部署常见陷阱</h3>
  <p><strong>坑名：</strong>Gateway 未配置 watch_domains，启动有警告但所有事件被丢弃。</p>
  <p><strong>原因：</strong>默认不转发任何 HA 事件，必须显式声明监听域或实体。</p>
  <p><strong>解法：</strong>从 climate、binary_sensor、alarm_control_panel 三域起步，用 ignore_entities 屏蔽 CPU/内存等噪音传感器。</p>
  <p><strong>严重程度：</strong>致命（被动自动化完全失效）。</p>
  <div class="pitfall">坑名：修改 .env 后不重启 Gateway——环境变量只在进程启动时读取，Token 或 URL 变更必须重启。</div>
  <div class="pitfall">坑名：watch_all=true 接收全部状态——噪音过大，应用 cooldown_seconds:30 限制同一实体事件频率。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：home-llm 极简派 / 「够用就行」智能家居用户</p>
  <p class="rebuttal-text">独立 Agent + 外部 Gateway 是多一层故障点——家里灯控这种硬实时场景，微调小模型嵌在 HA 里毫秒响应，比绕一圈 LLM 推理更可靠也更省电。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Hermes 与 Alexa 的本质差异不在模型聪明，而在 Agent 架构：工具调用、记忆、技能学习、跨平台 Gateway。</li>
    <li>REST 主动控制 + WebSocket 被动监听双通道，一个 HASS_TOKEN 同时激活四工具与 Gateway。</li>
    <li>ha_* 工具集 + 安全封锁六域 + Cron 自然语言定时，覆盖从语音到自动化的完整闭环。</li>
    <li>米家设备经 Xiaomi Miot Auto 桥接 HA 即可被 Hermes 统一控制，无需更换硬件。</li>
    <li>选型上：要 AI 管家选 Hermes，仅控灯/空调选 home-llm，HA 内部够用选 OpenAI Conversation。</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>在 HA Profile 创建 Long-Lived Token，写入 ~/.hermes/.env 并 curl 验证连接。</li>
    <li>config.yaml 配置 watch_domains 与 ignore_entities，启动 hermes gateway 确认 HA 平台在线。</li>
    <li>用 faster-whisper + Edge TTS 搭建零成本中文语音回路，Telegram 或 Discord /voice join 实测。</li>
    <li>创建一条 Cron 夜间安全检查任务（查门窗+报警+锁具），投递到 telegram。</li>
    <li>米家用户通过 HACS 安装 Xiaomi Miot Auto，验证 ha_list_entities 能发现设备。</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>智能家居的 AI 升级不是「把 Alexa 换成 GPT」——而是把语音中继器升级为能记忆、能学习、能主动响应事件的 Agent 管家。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
