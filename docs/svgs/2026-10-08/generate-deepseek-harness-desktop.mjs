import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'deepseek-harness-desktop.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#065f46,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #059669}
.card h3{font-size:22px;font-weight:700;color:#065f46;margin-bottom:12px}
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
.conclusion{background:linear-gradient(135deg,#065f46,#059669);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#065f46;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px}`;

const body = `
<h1>DeepSeek Harness 官方桌面端：安装、安全与插件</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">v0.2.0-rc.2</span>
  <span class="tag tag-blue">Electron</span>
  <span class="tag tag-orange">dsh-app://</span>
  <span class="tag tag-purple">插件入口</span>
</div>
<p class="subtitle">本文解决的核心问题是：官方桌面端相对 Web/npm 与社区套壳究竟补齐了什么——如何把 Node、pnpm、Python 打进安装包降低上手门槛；为何不用 localhost 端口而用进程管道与自定义协议提升安全；以及账号直登、内置 8 插件与第三方插件安装时的版本适配注意点。</p>

<div class="map">
  <h3 style="font-size:20px;color:#065f46;margin-bottom:12px;text-align:center">桌面端在 Harness 栈中的位置</h3>
  <div class="diagram">
    <div class="node-blue">同一套 Web UI</div>
    <span class="arrow-sym">+</span>
    <div class="node">Electron 壳</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">~/.dsh 数据<br>与 Web 共享</div>
    <span class="arrow-sym">→</span>
    <div class="node">插件 / MCP / Skill<br>（能力不变）</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「官方桌面端只是套壳」。作者强调套壳复用前端与 <code>~/.dsh</code> 数据目录是优势，但<strong>安全与发布绑定</strong>才是与社区版的核心差异——不是 UI 换皮。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】官方桌面端 vs 社区 localhost 方案</h3>
  <p><strong>在讲什么问题：</strong>为何已有大量社区桌面端仍需要官方版本。</p>
  <p><strong>核心机制：</strong>社区版多在本地起 HTTP 服务 + 窗口访问 localhost；官方用 <code>dsh-app://</code> 与分帧字节流 + Node IPC，Harness 对外界不可见、不开放端口。</p>
  <p><strong>关键理解：</strong>内网/公共 WiFi 下同网段设备理论上可探测 localhost 服务——官方方案针对的是<strong>暴露面</strong>，不是功能列表长短。</p>
  <p><strong>怎么落地用：</strong>公司内网或敏感环境优先官网下载 Windows/macOS 安装包（约 300–370MB，内置运行时）；工作区与会话从 Web 迁移后仍在 <code>~/.dsh</code>。</p>
  <p><strong>边界说明：</strong>AX/Substrate 级运行时不在本文范围；桌面端仍是 Harness 插件模型的入口。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】安装、登录与模型使用</h3>
  <p><strong>操作步骤：</strong>1）官网下载对应系统安装包并选择路径安装；2）左下角登录 DeepSeek 账号（可查余额、充值）；3）模型列表出现「账号模型」，用账户余额跑任务，无需单独申请开放平台 API Key；4）新用户约 6 元体验余额。</p>
  <p><strong>对比相邻方法：</strong>Web 端首次往往要先去开放平台拿 Key；npm 安装适合已熟悉前端的用户。</p>
  <p><strong>避坑：</strong>安装包大是因为捆绑 Node/pnpm/Python——磁盘与更新带宽要预留；9 月 29 日正式上架，代码在 9 月 14 日已静默合入 master。</p>
  <div class="highlight">稳定性：官方把 Electron、DSH 后端与 Node 运行时<strong>一体更新</strong>；社区版常只适配某一 Harness 版本，破坏性变更时易失配。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】插件列表与安装</h3>
  <p><strong>核心思路：</strong>左侧新增插件入口，内置 8 个官方插件（智能体团队、自动授权审查、自动化任务、语音输入、终端、Agent 循环、子智能体、网页搜索）。</p>
  <p><strong>操作步骤：</strong>右上角「添加插件」→ 输入包名（如 <code>dsh-plugin-whale-pet</code>）、GitHub 地址或本地目录 → 安装并启用；桌宠类插件可在界面右下角出现。</p>
  <p><strong>选型条件：</strong>需要多 Agent 分工时可开「智能体团队」——注意与社区 <code>agent teams</code> 插件不同，官方版暂无按成员单独设模型/审查的完整能力。</p>
  <p><strong>避坑：</strong>社区插件可能未适配 v0.2.0-rc.2，安装报错需等作者升级；工具/MCP/Skill 接入方式与 Web 端一致，创设模式 + 完全权限仍可自研插件。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】桌面端使用注意</h3>
  <p><strong>把官方智能体团队当成 agent teams 插件：</strong>能力集不同，审查与成员配置不全——严重程度：小心。</p>
  <p><strong>在 v0.2.0-rc.2 强装旧插件：</strong>常见构建/依赖错误——等适配或锁旧版 Harness——严重程度：致命（浪费时间）。</p>
  <p><strong>忽视数据目录：</strong>误删 <code>~/.dsh</code> 会丢工作区——严重程度：致命。</p>
  <p><strong>认为桌面端可替代进阶架构学习：</strong>作者预告后续讲完整架构——界面是入口，插件才是扩展关键——严重程度：可忽略。</p>
</div>

<div class="card">
  <h3>【决策/选型表】入口怎么选</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>非前端背景、要快上手</td><td>官方桌面端</td><td>免配环境、账号直登</td><td>仅 npm 源码安装</td><td>门槛高</td></tr>
    <tr><td>公司内网/安全审计</td><td>官方桌面端</td><td>无 localhost 暴露</td><td>社区 Electron+HTTP</td><td>同网段探测风险</td></tr>
    <tr><td>CI/无头自动化</td><td>CLI / Web API</td><td>桌面 GUI 非目标</td><td>强用桌宠插件</td><td>交互向能力</td></tr>
    <tr><td>追最新社区插件</td><td>关注版本矩阵</td><td>官方随 rc 升级</td><td>假设全插件即装即用</td><td>适配滞后</td></tr>
  </table>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：极简开发者 / 「Web 够用」派</p>
  <p class="rebuttal-text">三百兆安装包锁死 Electron 与运行时版本，升级节奏跟官方走；会配环境的人用 Web+Key 更轻，桌面端只是把运维成本换成磁盘和发布依赖。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>官方桌面端在复用 Web UI 与 <code>~/.dsh</code> 的前提下，主打低门槛安装、账号集成与无端口安全模型。</li>
    <li>与社区套壳差异在协议与一体化更新，而非功能清单多少。</li>
    <li>插件机制仍是核心：内置 8 插件 + 包名/Git/本地安装；能力扩展路径与 Web 一致。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>从内网敏感场景开始试点官方安装包，确认无 localhost 策略冲突。</li>
    <li>用账号模型跑小任务，对比以往 API Key 流程是否简化运维。</li>
    <li>安装前查插件是否标注支持 v0.2.0-rc.2。</li>
    <li>备份 <code>~/.dsh</code> 后再做大版本升级。</li>
  </ol>
  <p><strong>关键认知转变：</strong>从「选哪个桌面壳」转向「Harness 是否官方发行通道 + 插件生态是否跟得上 rc 节奏」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log(`Wrote ${OUT} (${height}px)`);
