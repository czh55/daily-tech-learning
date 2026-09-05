import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'deepseek-harness-agent-presets.svg');

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
<h1>DeepSeek Harness 入门很简单（二）——通用设置及 Agent 预设详解</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">DeepSeek Harness</span>
  <span class="tag tag-green">Agent 预设</span>
  <span class="tag tag-orange">插件架构</span>
  <span class="tag tag-purple">PTC 模式</span>
</div>
<p class="subtitle">本文解决的核心问题是：安装跑通 demo 之后，如何通过权限策略、模型接入、插件参数与四种 Agent 预设（标准/极简/PTC/创造）的组合，在功能覆盖、Token 开销与任务质量之间做出正确权衡。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Harness 配置层与 Agent 预设关系</h3>
  <div class="diagram">
    <div class="node">通用设置<br>权限/语言/Enter</div>
    <span class="arrow-sym">+</span>
    <div class="node-green">模型层<br>可插拔适配器</div>
    <span class="arrow-sym">+</span>
    <div class="node-orange">插件系统<br>165+ 内置插件</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">Agent 预设<br>工具集+Prompt+编排</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">预设本质是工具集、系统指令与上下文策略的参数组合，切换预设即切换智能体行为边界</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「标准模式最强，所有任务都该用标准」。实际上标准模式连问候都消耗约 1 万 Token 工具定义开销；简单任务用极简、批量自动化用 PTC、定制工作流用创造，才是 Harness 的设计意图。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Agent 预设与环境参数集合</h3>
  <p><strong>在讲什么问题：</strong>预设不是换个皮肤，而是决定 Agent 加载哪些工具、用什么系统 Prompt、如何管理上下文窗口。</p>
  <p><strong>核心机制：</strong>四套内置模板（标准/极简/PTC/创造）封装了工具注册表、任务编排逻辑与 Cordis 插件组合的差异化配置。</p>
  <p><strong>关键理解：</strong>三种模式的本质差异是当前会话加载了哪些工具与配置的不同组合——标准约 20+ 工具，极简仅终端+文件编辑器两个。</p>
  <p><strong>典型场景：</strong>全链路开发用标准；基准测试/轻量对话用极简；批量文件操作用 PTC；沉淀团队最佳实践用创造模式生成自定义预设。</p>
  <p><strong>边界说明：</strong>创造模式需 Full access 权限写入全局配置；插话发送是协作式打断，窗口错过会降级为排队。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】四种 Agent 预设横向对比</h3>
  <table>
    <tr><th>维度</th><th>标准模式</th><th>极简模式</th><th>PTC 模式</th><th>创造模式</th><th>一句话结论</th></tr>
    <tr><td>工具数量</td><td>20+ 全套</td><td>2 个（终端+编辑器）</td><td>1 个 run_code（内含全部能力）</td><td>标准 + 元工具</td><td>工具越多上下文开销越大</td></tr>
    <tr><td>问候 Token</td><td>~1 万</td><td>~1.2K</td><td>中等</td><td>高</td><td>简单对话别用标准</td></tr>
    <tr><td>3D 游戏案例耗时</td><td>33 分钟</td><td>23 分钟（质量低）</td><td>27 分钟（Token 1/3）</td><td>视任务而定</td><td>速度与质量需权衡</td></tr>
    <tr><td>行为风格</td><td>任务分解+多路径探索</td><td>思考-行动直连引擎</td><td>批处理代码串联工具</td><td>可自我改造预设</td><td>极简不做规划汇报</td></tr>
    <tr><td>适用任务</td><td>通用开发全链路</td><td>模型跑分/简单执行</td><td>批量重命名/自动化流程</td><td>复刻 Cursor Debug 等定制流</td><td>误用预设=效率/质量双输</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】权限与 Enter 键行为</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>日常开发读写项目文件</td><td>Workspace Write</td><td>可读写工作区、命令需审批，安全与效率平衡</td><td>默认 Full access</td><td>可读写任意路径，误操作风险高</td></tr>
    <tr><td>创造模式写全局预设</td><td>Full access</td><td>需写入 agent.cordis.yml / preset.yml</td><td>Read Only</td><td>无法生成自定义预设文件</td></tr>
    <tr><td>只读审计/演示</td><td>Read Only</td><td>无法修改文件或执行命令</td><td>任何写权限</td><td>存在数据被 Agent 改写风险</td></tr>
    <tr><td>Agent 忙碌时发新指令</td><td>排队发送（默认）</td><td>FIFO 不打断当前回合</td><td>频繁插话发送</td><td>可能等工具调用完成才生效，急停需点终止</td></tr>
    <tr><td>紧急纠正方向</td><td>插话发送</td><td>协作式打断当前回合</td><td>排队等待</td><td>错误方向可能跑完全程浪费 Token</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】创造模式定制 Debug Agent</h3>
  <p><strong>方法名：</strong>创造模式 + 自然语言预设生成 · 标签：团队最佳实践沉淀</p>
  <p><strong>核心思路：</strong>在标准能力上注入操作 Cordis 插件系统的元工具，让 Agent 读取现有预设、抓取参考文档、生成新 YAML 配置。</p>
  <p><strong>操作步骤：</strong>1) 模型选 DeepSeek-V4-Pro 推理 MAX → 2) 权限设 Full access → 3) 切换创造模式 → 4) 提交提示词描述目标工作流（如复刻 Cursor Debug 模式）→ 5) 检查生成的 agent.cordis.yml 与 preset.yml → 6) 新对话从模式选择器选用</p>
  <div class="highlight"><strong>落地建议：</strong>插件配置可调终端超时、Agent Loop 并发工具数、网页搜索 API 凭据；企业自托管模型用 Custom Provider 填 OpenAI 兼容端点。</div>
  <div class="quote">原文：创造模式类似 AGENTS.md/CLAUDE.md 约束智能体，但粒度更细、自动化更高，无需手动维护结构化文档。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】配置与预设误用</h3>
  <p><strong>坑名：</strong>所有任务默认标准模式导致 Token 账单爆炸</p>
  <p><strong>原因：</strong>20+ 工具定义每次推理都编码进系统提示词，简单问候也近 1 万 Token。</p>
  <p><strong>解法：</strong>按任务选预设；查看轨迹（Trace）面板审计上下文快照；PTC 批量任务可省 2/3 输入 Token。</p>
  <p><strong>严重程度：</strong>小心（成本）/ 可忽略（若不限预算）</p>
  <div class="pitfall"><strong>插话误解：</strong>插话非抢占式强杀——若打断窗口已过会自动降级排队，需手动点终止才能立即停止。</div>
  <div class="pitfall"><strong>极简模式质量：</strong>3D 游戏案例角色模型与贴图明显简化，追求视觉品质勿用极简。</div>
  <div class="pitfall"><strong>插件参数：</strong>终端超时过短会误杀长构建命令；并发工具数过高可能触发下游 API 限流。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Cursor/Copilot 重度用户 · 「预设切换太复杂，一个全能 Agent 就够了」</p>
  <p class="rebuttal-text">Harness 的插件化底座意味着「全能」= 每次推理背负 165 个插件的工具定义税——不按场景裁剪预设，省下的配置时间会在 Token 账单和响应延迟上加倍讨回来。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>通用设置五维：Agent 预设、三级权限、语言/主题、Enter 排队/插话行为。</li>
    <li>模型层可插拔，支持 DeepSeek 官方与 OpenAI 兼容自托管端点。</li>
    <li>165+ 插件构成 Everything is a Plugin 架构，关键参数含终端超时、并发工具数、搜索 API。</li>
    <li>标准=全能高开销；极简=跑分/轻量；PTC=批处理提效；创造=自然语言生成自定义预设。</li>
    <li>3D 游戏实测：标准 33min / 极简 23min（质量降） / PTC 27min（Token 约 1/3）。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>日常开发保持 Workspace Write，仅在创造预设时临时升 Full access。</li>
    <li>简单对话与模型评测切换极简模式，全链路开发用标准，批量操作用 PTC。</li>
    <li>打开轨迹面板对比不同预设的系统提示词与 Token 消耗。</li>
    <li>用创造模式将团队 Debug/Code Review 流程沉淀为可复用预设 YAML。</li>
    <li>下一章接入 MCP 工具与 Skill 系统前，先调好插件超时与并发参数。</li>
  </ol>
  <p><strong>关键认知转变：</strong>Harness 的竞争力不在「一个更强的模型」，而在预设+插件把 Agent 行为模块化——选对预设等于选对工具链宽度，比换模型更能控制成本与产出质量。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
