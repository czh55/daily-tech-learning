import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'claude-code-hermes-mcp.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:140px;font-weight:700;font-size:15px;color:#1e40af}
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
<h1>Claude Code + Hermes MCP 消息桥接实战：任务完成自动通知手机</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Claude Code</span>
  <span class="tag tag-green">Hermes MCP</span>
  <span class="tag tag-orange">Hooks</span>
  <span class="tag tag-purple">消息通知</span>
</div>
<p class="subtitle">本文解决的核心问题是：Claude Code 长跑任务时用户离开终端如何收到完成通知，以及 Hooks 原生推送、Channels 官方双向、Hermes MCP 反向桥接三种方案在通知方向、平台支持、Codex 兼容与部署复杂度上的选型差异与完整配置路径。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-orange">长任务无人值守</div>
    <span class="arrow-sym">→</span>
    <div class="node">三种通知方案</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">Hooks 极简</div>
    <span class="arrow-sym">/</span>
    <div class="node">Channels 双向</div>
    <span class="arrow-sym">/</span>
    <div class="node-green">Hermes 多平台</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「三种方案互斥只能选一个」—— 原文明确三者可共存：Hooks 做本地声音提示、Channels 做 Telegram 双向控制、Hermes MCP 做 Discord 品牌频道分发，触发机制不同不会产生重复通知。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】三种 Claude Code 通知架构</h3>
  <p><strong>在讲什么问题：</strong>AI 编程 Agent 异步执行长任务时，如何把「任务完成」信号推送到用户手机。</p>
  <p><strong>核心机制：</strong>Hooks 用 Stop 事件触发本地 Shell 脚本单向推送；Channels 用 Bun 插件将外部消息推入 Claude 会话实现双向；Hermes MCP 让 Claude 通过 SSH stdio 调用远程 Hermes 的 messages_send 主动发消息。</p>
  <p><strong>关键理解：</strong>通知方向决定架构——Hooks/ Hermes 是 Agent→用户，Channels 是用户⇆Agent；Hermes 是唯一 Codex 兼容且支持微信的方案。</p>
  <p><strong>典型场景：</strong>SEO 审计 30 分钟、代码重构 20 分钟等用户需离开终端的长任务。</p>
  <p><strong>边界说明：</strong>短任务（小于 2 分钟）无需配置通知；Channels 依赖会话存活，不是 24/7 后台服务。</p>
  <div class="quote">原文：「Claude Code 跑了 20 分钟你不在电脑前，怎么知道它完成了？」</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Hermes MCP 反向桥接七步配置</h3>
  <p><strong>方法名：</strong>SSH stdio + hermes mcp serve</p>
  <p><strong>核心思路：</strong>Claude Code 启动 ssh 子进程连接远程 Hermes，JSON-RPC over stdin/stdout 调用 messages_send 向 Discord/Telegram/微信推送。</p>
  <p><strong>操作步骤：</strong>1. pipx install hermes-agent 并 hermes gateway start → 2. 配置 SSH 免密登录 → 3. ~/.claude.json 添加 mcpServers.hermes（command: ssh, args 含 hermes mcp serve）→ 4. settings.json 白名单 mcp__hermes → 5. 可选配置 Codex config.toml → 6. 验证 channels_list → 7. 任务指令加「完成后通知我 Discord」。</p>
  <p><strong>选型条件：</strong>需 Codex 通知、多品牌频道隔离、微信端收消息、或 24/7 常驻 Hermes 时选此方案。</p>
  <div class="highlight"><strong>落地建议：</strong>messages_send 的 target 格式为 platform:identifier（如 discord:#总部），首次用 channels_list 确认可用通道；Codex 设 startup_timeout_sec 为 15-20 秒应对 SSH 冷启动。</div>
  <div class="pitfall"><strong>避坑：</strong>stop_hook_active 为 true 时 Hook 脚本必须 exit 0，否则无限循环；连续阻塞 8 次 Claude Code 会强制覆盖 Hook。</div>
  <div class="quote">原文：「Hermes MCP 反向桥接是当前 Codex 唯一可用的按需通知方案。」</div>
</div>

<div class="card">
  <h3>【决策/选型表】三种通知方案场景对照</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>5 分钟搞定桌面提醒</td><td>Hooks + notify.sh</td><td>零依赖，Stop 事件自动触发</td><td>Hermes MCP</td><td>部署过重，杀鸡用牛刀</td></tr>
    <tr><td>手机远程控制 Claude Code</td><td>Channels</td><td>Telegram/Discord 双向对话，权限远程审批</td><td>Hooks</td><td>仅单向推送，无法从手机回复</td></tr>
    <tr><td>Codex 长任务通知</td><td>Hermes MCP</td><td>Codex 不支持 Hooks 和 Channels</td><td>Hooks/Channels</td><td>Claude Code 专属功能</td></tr>
    <tr><td>多品牌 Discord 频道隔离</td><td>Hermes MCP</td><td>物理频道隔离 + channel_prompts 品牌路由</td><td>Channels</td><td>同一聊天窗口，品牌隔离弱</td></tr>
    <tr><td>微信端收通知</td><td>Hermes MCP</td><td>Channels 不支持微信</td><td>Channels</td><td>仅 Telegram/Discord/iMessage</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】Hooks vs Channels vs Hermes MCP</h3>
  <table>
    <tr><th>对比维度</th><th>Hooks</th><th>Channels</th><th>Hermes MCP</th><th>一句话结论</th></tr>
    <tr><td>通知方向</td><td>Agent→用户单向</td><td>用户⇆Agent 双向</td><td>Agent→多平台，可扩展双向</td><td>要控制选 Channels，要推送选 Hermes</td></tr>
    <tr><td>Codex 兼容</td><td>不支持</td><td>不支持</td><td>完全支持</td><td>Codex 用户只能走 Hermes</td></tr>
    <tr><td>部署复杂度</td><td>极低（一个 Shell 脚本）</td><td>低（Bun 插件）</td><td>较高（独立 Hermes + SSH）</td><td>按需求复杂度递进选型</td></tr>
    <tr><td>持久性</td><td>依赖会话存活</td><td>依赖会话存活</td><td>24/7 launchd 后台</td><td>开发机可关机，Hermes 常驻</td></tr>
    <tr><td>平台支持</td><td>任意（Shell 可达）</td><td>Telegram/Discord/iMessage</td><td>Discord/TG/微信/Slack 等 8 平台</td><td>多平台分发 Hermes 最全</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】通知方案常见故障</h3>
  <div class="pitfall"><strong>坑 1：Stop Hook 每轮都触发</strong> — Stop 在每轮响应后触发，非仅任务完成。解法：判断 stop_reason 仅 end_turn 时推送，或改用 Hermes 按需调用。严重程度：小心。</div>
  <div class="pitfall"><strong>坑 2：MCP 连接超时</strong> — SSH 未配免密或 Hermes 路径错误。解法：ssh user@host "hermes --version" 逐步验证。严重程度：致命。</div>
  <div class="pitfall"><strong>坑 3：首条消息延迟约 20 秒</strong> — SSH 冷启动 + 模型端点自动探测。解法：.env 显式设端点 URL，SSH ControlMaster 复用连接。严重程度：可忽略。</div>
  <div class="pitfall"><strong>坑 4：messages_send 成功但手机无消息</strong> — Hermes 网关未启动或 Bot Token 过期。解法：hermes gateway status + tail gateway.log。严重程度：致命。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Anthropic 官方生态拥护者 / 「Research Preview 不值得折腾」派</p>
  <p class="rebuttal-text">为了一个「任务完成了」的推送去部署 Hermes、配 SSH、维护 24/7 网关，复杂度远超收益——Claude Code on Web 和 Remote Control 已提供官方远程方案，Channels 虽为 Preview 但双向对话与权限审批是 Hermes 脚本堆不出来的正统体验，多引一层 Nous Research 开源组件只会增加故障面和密钥管理负担。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>三种方案按复杂度递进：Hooks 极简单向、Channels 官方双向、Hermes MCP 跨客户端多平台。</li>
    <li>Hermes MCP 是 Codex 唯一可用通知方案，且支持微信与多品牌频道隔离。</li>
    <li>三者可共存互补：Hooks 本地提示 + Channels 远程控制 + Hermes 品牌分发。</li>
    <li>长任务（大于 10 分钟）建议配置手机通知；Hermes 按需调用零日常开销。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>个人开发者：先在 ~/.claude/settings.json 配 Stop Hook + notify.sh，5 分钟验证桌面通知。</li>
    <li>需手机推送：Hook 脚本加 Telegram Bot API curl 调用，或部署 Hermes MCP。</li>
    <li>Codex 用户：在 ~/.codex/config.toml 配置 Hermes SSH stdio，startup_timeout_sec 设 15 秒。</li>
    <li>多品牌场景：Hermes 按频道配置 channel_prompts，任务指令指定目标 Discord 频道。</li>
  </ol>
  <p><strong>关键认知转变：</strong>通知不是「选最好的」，而是「按场景组合」——单向推送、双向控制、跨平台分发是三个正交需求，对应三种正交方案。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
