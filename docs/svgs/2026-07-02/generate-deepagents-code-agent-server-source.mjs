import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'deepagents-code-agent-server-source.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:18px 22px;text-align:center;min-width:100px;font-weight:700;font-size:15px;color:#1e40af}
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
<h1>DeepAgents Code Agent Server 核心源码解读</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">DeepAgents</span>
  <span class="tag tag-green">LangChain</span>
  <span class="tag tag-orange">中间件</span>
  <span class="tag tag-purple">生产级 Agent</span>
</div>
<p class="subtitle">本文解决的核心问题是：作为 DeepAgents SDK 的官方参考实现，DeepAgents Code 的 Agent Server 如何通过 create_cli_agent 整合模型动态切换、三类工具注册、子智能体委派与六大中间件，回答生产级 CLI 编码智能体必须直面的四个核心工程问题。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node-orange">agent.py<br><span style="font-size:13px;font-weight:400">create_cli_agent</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">create_deep_agent<br><span style="font-size:13px;font-weight:400">SDK 核心</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">中间件层<br><span style="font-size:13px;font-weight:400">6+ Middleware</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">工具三来源<br><span style="font-size:13px;font-weight:400">内置/MCP/注入</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Backend 三模式<br><span style="font-size:13px;font-weight:400">沙箱/Shell/FS</span></div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「会用 create_deep_agent API 就等于能写生产级智能体」—— dcode 展示的是运行时模型切换、会话无损恢复、渐进式技能披露与 Backend 能力降级策略等工程约束下的成品，差距在架构而非单个函数调用。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Agent Server 四大核心问题</h3>
  <p><strong>在讲什么问题：</strong>生产级智能体服务端到底要解决哪些比「调个 model 参数」更棘手的事？</p>
  <p><strong>核心机制：</strong>agent.py 通过 create_cli_agent 整合 create_deep_agent，借助中间件、工具、子智能体机制回答：① 模型接入与运行时切换 ② 工具定义注册与安全调用 ③ 会话记忆跨轮次持久化 ④ 多智能体编排扩展能力边界。</p>
  <p><strong>关键理解：</strong>读源码应先想「生产级应具备什么功能」，再试用 dcode 带疑问探究实现——带问题读，每行代码有迹可循。</p>
  <p><strong>典型场景：</strong>CLI 编码助手需不重启会话切换 GPT-4 到 Claude、需 /threads 恢复后模型与 Token 计数一致、需 AGENTS.md 跨会话记忆。</p>
  <p><strong>边界说明：</strong>本文聚焦 Agent Server 核心层；状态管理/checkpoint 机制留待下篇专讲。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】运行时动态模型切换</h3>
  <p><strong>核心思路：</strong>Context 传递切换指令 + ConfigurableModelMiddleware 在每次模型调用前拦截替换，实现不中断会话的丝滑切换。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. context_schema=CLIContextSchema 定义运行时上下文（model、model_params、effective_model）。</p>
  <p>2. agent.stream() / astream() 的 context 参数携带 model_override（如 provider:model）。</p>
  <p>3. ConfigurableModelMiddleware.wrap_model_call 读取 context → model_matches_spec 判断 → create_model() 动态实例化。</p>
  <p>4. 合并 temperature/max_tokens；跨提供商时自动清理不兼容配置（如 Anthropic cache_control）。</p>
  <p>5. 更新系统提示 ### Model Identity 段，让新模型知晓自己身份。</p>
  <p><strong>选型条件：</strong>需会话内热切换时用 Middleware；固定模型可初始化时写死 model 参数。</p>
  <div class="highlight">落地价值：用户从 GPT-4o 切到 Claude 3.5 无需重启终端，context 经 textual_adapter 传入 astream 完整链路。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】三类工具来源 vs 三种 Backend 模式</h3>
  <table>
    <tr><th>对比维度</th><th>内置工具 (tools.py)</th><th>MCP 工具 (mcp_tools.py)</th><th>中间件注入</th><th>一句话结论</th></tr>
    <tr><td>典型能力</td><td>fetch_url、web_search、get_current_thread_id</td><td>用户自定义远程服务</td><td>execute、read_file、write_file、edit_file</td><td>手脚分工：基础+扩展+SDK 自动注入</td></tr>
    <tr><td>设计哲学</td><td>硬编码稳定 API</td><td>协议化插件扩展</td><td>FileSystem/Shell 中间件运行时注入</td><td>get_current_thread_id 让 Agent 按需获取自身上下文</td></tr>
  </table>
  <table style="margin-top:20px">
    <tr><th>Backend 模式</th><th>触发条件</th><th>能力</th><th>安全级别</th></tr>
    <tr><td>远程沙箱（最高）</td><td>sandbox != None</td><td>Modal/Daytona 隔离执行</td><td>不可信代码、云端资源</td></tr>
    <tr><td>LocalShell（默认）</td><td>enable_shell=True 无沙箱</td><td>文件读写 + Shell，inherit_env=False</td><td>本地开发默认</td></tr>
    <tr><td>纯 Filesystem（受限）</td><td>enable_shell=False</td><td>仅 read/write/edit，无 execute</td><td>只编辑不运行，最安全</td></tr>
  </table>
  <div class="relation">策略模式：沙箱 ＞ Shell+文件 ＞ 纯文件；统一 BackendProtocol 接口，中间件层不关心具体实现。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】六大代表性中间件</h3>
  <p><strong>LocalContextMiddleware：</strong>before_model 执行 Bash 检测脚本收集 Git 状态、项目结构、包管理器类型，附加环境快照到系统提示——让 Agent 「懂项目」而非通用助手。</p>
  <p><strong>ResumeStateMiddleware：</strong>after_model 提取 Token 用量和 model_spec 写入 ResumeState 私有状态，随 checkpoint 持久化——解决 /threads 恢复时模型信息丢失和 Token 重算开销。</p>
  <p><strong>MemoryMiddleware：</strong>从 ~/.deepagents/ 和 .deepagents/ 读 AGENTS.md，剥离 HTML 注释，包装为 agent_memory 标签注入——文件即记忆，跨会话生效。</p>
  <p><strong>SkillsMiddleware：</strong>渐进式披露——先注入技能摘要列表，用户 /skill_name 显式调用时才加载完整 SKILL.md 指令，避免系统提示被撑爆。</p>
  <p><strong>ConfigurableModelMiddleware：</strong>运行时模型热切换（见方法卡）。</p>
  <p><strong>FileSystemMiddleware 等：</strong>配合 Backend 提供 ls/read/write/edit/execute 能力。</p>
  <div class="quote">原文：「DeepAgents Code 并非对 DeepAgents API 的简单堆砌，而是一套精心设计的工程体系。」</div>
</div>

<div class="card">
  <h3>【决策/选型表】子智能体本地 vs 远程委派</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>快速定义专用能力</td><td>agents_dir/{name}/AGENTS.md 本地子智能体</td><td>Markdown 即配置，随改随用</td><td>全塞主 Agent Prompt</td><td>上下文过长、职责不清</td></tr>
    <tr><td>复用远程团队 Agent</td><td>config.toml async_subagents</td><td>远程平台能力共享，与 custom_subagents 合并</td><td>重复部署相同逻辑</td><td>维护成本高、版本漂移</td></tr>
    <tr><td>复杂任务委派</td><td>主 Agent 通过 task 工具调用子 Agent</td><td>SDK 原生 SubAgent 机制避免单窗口膨胀</td><td>单 Agent 硬扛全流程</td><td>长上下文性能与质量双降</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】读生产级 Agent 源码陷阱</h3>
  <p><strong>坑名：</strong>逐文件逐行啃代码迷失细节——没有宏观问题锚点。</p>
  <p><strong>原因：</strong>生产级代码量是 API 教程的数十倍，缺少「应具备什么功能」的前置思考。</p>
  <p><strong>解法：</strong>先列四大核心问题 → 实际试用 dcode → 带体感疑问读 agent.py 各模块。</p>
  <p><strong>严重程度：</strong>可忽略（学习方法问题）——但会导致「背 API 不懂架构」。</p>
  <div class="pitfall"><strong>会话恢复陷阱：</strong>LangGraph checkpoint 只存 messages 不存 model_spec——恢复大上下文模型会话时若默认用小窗口模型会导致截断；必须用 ResumeStateMiddleware 补全。</div>
  <div class="pitfall"><strong>技能撑爆上下文：</strong>一次性加载全部 SKILL.md 会撑爆系统提示——SkillsMiddleware 渐进式披露是必选项。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「够用就行」派 / 轻量 Agent 框架拥护者</p>
  <p class="rebuttal-text">六层中间件加三模式 Backend 是过度设计——多数团队只需 LangGraph 加几个 Tool，dcode 的复杂度会把简单编码助手拖成难维护的「中间件意大利面」。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Agent Server 核心在 agent.py 的 create_cli_agent，整合 SDK 回答模型切换、工具、记忆、多 Agent 四大问题。</li>
    <li>运行时模型切换 = CLIContext + ConfigurableModelMiddleware.wrap_model_call，跨提供商自动清理不兼容配置。</li>
    <li>工具三来源（内置/MCP/中间件注入）+ 子智能体双轨（本地 AGENTS.md + 远程 async_subagents）。</li>
    <li>六大中间件覆盖环境感知、会话恢复、长期记忆、技能按需加载、模型热切换、文件系统交互。</li>
    <li>Backend 能力降级：沙箱 ＞ LocalShell ＞ 纯 Filesystem，策略模式无缝切换安全级别。</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>克隆 DeepAgents Code，先跑通 CLI 再打开 agent.py，对照四大核心问题标注模块。</li>
    <li>实验 context 传 model_override，观察 ConfigurableModelMiddleware 如何更新 Model Identity。</li>
    <li>在 agents_dir 下新建子智能体 AGENTS.md，验证 custom_subagents 自动加载。</li>
    <li>用 /threads 恢复会话，检查 ResumeState 是否正确还原 _model_spec 和 _context_tokens。</li>
    <li>对比 enable_shell=True/False 两种 Backend 下 execute 工具的可用性差异。</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「会用 create_deep_agent」到「理解每条中间件背后的工程约束」——状态管理与记忆机制是智能体开发最核心也最棘手的环节，dcode 是带问题读源码的最佳标本。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
