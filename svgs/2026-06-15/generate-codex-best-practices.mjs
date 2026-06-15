import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'codex-best-practices.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:16px 22px;text-align:center;min-width:120px;font-weight:700;font-size:14px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:22px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 12px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Codex 最佳实践：从 AGENTS.md 到自动化部署的完整实战指南</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Codex</span>
  <span class="tag tag-green">Agent 配置</span>
  <span class="tag tag-orange">安全沙箱</span>
  <span class="tag tag-purple">自动化</span>
</div>
<p class="subtitle">本文解决的核心问题是：很多人装好 Codex 就开始用，从未认真配置九大模块（AGENTS.md、沙箱、Profile、MCP、Hooks、Skills、headless 等），导致代理不知道项目约定、权限弹窗不断、任务不验证就交付——如何系统性升级到生产可用。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">AGENTS.md<br/>项目记忆</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">沙箱+Profile<br/>安全隔离</div>
    <span class="arrow-sym">→</span>
    <div class="node">MCP+Hooks<br/>工具+强制</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">Skills+headless<br/>复用+CI</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「AGENTS.md 写进禁止事项就够了」—— AGENTS.md 是建议，Hooks 是强制；复杂场景中 Codex 可能为走捷径忽略 AGENTS.md，但 PreToolUse 钩子物理上拦不住危险命令。</p>
</div>

<div class="card">
  <h3>【模板 A】AGENTS.md：Codex 的项目指令链</h3>
  <p><strong>在讲什么问题：</strong>Codex 如何知道你的编码规范和项目约定？</p>
  <p><strong>核心机制：</strong>三层发现：~/.codex/ 全局 → Git 根目录向下逐层 → fallback 读取 CLAUDE.md/CURSOR.md。子目录越深优先级越高，类似 CSS 选择器。</p>
  <p><strong>关键理解：</strong>控制在 10 条核心要点以内——指令越长遵循度越低（Claude Code 社区实测同样规律）。</p>
  <p><strong>怎么落地：</strong>写技术栈 + 构建/测试命令 + 编码约定 + 3-5 条禁止事项；长规范用文件路径引用；密钥用环境变量。</p>
  <p><strong>边界说明：</strong>不应写完整风格指南、密钥明文、模糊鸡汤（「写出优雅代码」）；AGENTS.override.md 用于临时调试覆盖。</p>
  <div class="highlight"><strong>落地建议：</strong>让 Codex 审计现有 AGENTS.md——「删掉这条你不会犯错就标记可删」，精简到 10 条以内。</div>
</div>

<div class="card">
  <h3>【模板 D】沙箱 × 审批组合决策表</h3>
  <table>
    <tr><th>场景</th><th>沙箱模式</th><th>审批策略</th><th>核心理由</th><th>不推荐组合</th></tr>
    <tr><td>日常开发</td><td>workspace-write</td><td>on-request</td><td>最安全日常组合</td><td>danger + never</td></tr>
    <tr><td>快速迭代</td><td>workspace-write</td><td>never</td><td>等同 --full-auto</td><td>无沙箱裸跑</td></tr>
    <tr><td>知识库批量操作</td><td>danger-full-access</td><td>never</td><td>全磁盘+无审批最高效</td><td>日常开发用此组合</td></tr>
    <tr><td>审阅外部代码</td><td>workspace-write</td><td>untrusted</td><td>每步确认安全第一</td><td>never 审批</td></tr>
  </table>
  <div class="relation"><strong>网络限制应对：</strong>workspace-write 默认禁网 → 推荐将联网操作封装为 MCP 工具（MCP 进程在沙箱外），而非直接开 danger 模式。</div>
</div>

<div class="card">
  <h3>【模板 B】五套 Profile 场景切换</h3>
  <p><strong>核心思路：</strong>一条 codex --profile 命令切换模型+推理深度+沙箱+审批全套参数。</p>
  <p><strong>操作步骤：</strong>1. 在 config.toml [profiles.*] 定义五套 2. default-55 日常主力 3. kb-full 知识库全权限 4. mini 轻量查询 5. ci CI/CD 无人值守。</p>
  <table>
    <tr><th>Profile</th><th>模型</th><th>沙箱</th><th>审批</th><th>适用</th></tr>
    <tr><td>default-55</td><td>gpt-5.5 high</td><td>workspace-write</td><td>on-request</td><td>日常代码修改</td></tr>
    <tr><td>kb-full</td><td>gpt-5.5 high</td><td>danger-full-access</td><td>never</td><td>跨目录批量文档</td></tr>
    <tr><td>mini</td><td>gpt-5.4-mini low</td><td>read-only</td><td>默认</td><td>快速问答检索</td></tr>
    <tr><td>ci</td><td>gpt-5.4 medium</td><td>workspace-write</td><td>never</td><td>GitHub Actions 自动化</td></tr>
  </table>
  <div class="pitfall"><strong>Fast Mode 避坑：</strong>1.5 倍速度但 2.5 倍积分——适合改样式/调参数，复杂架构设计不建议开。</div>
</div>

<div class="card">
  <h3>【模板 B】MCP + Hooks 强制安全体系</h3>
  <p><strong>方法名：</strong>MCP 工具连接 + Hooks 自动化触发</p>
  <p><strong>操作步骤：</strong>1. 全局安装 MCP 到固定路径（禁用 npx 动态下载）2. 密钥放独立 env 文件（chmod 600）3. 启用 hooks=true 4. 配置时间注入/危险命令拦截/完成验证三个核心钩子。</p>
  <p><strong>选型条件：</strong>必装 brave-search + context7；需要联网但保持沙箱时用 MCP 封装；PreToolUse 拦截 rm -rf/mkfs/dd 等。</p>
  <div class="highlight"><strong>落地建议：</strong>Stop 钩子挂验证脚本——测试没通过就阻止停止，是 headless 无人值守模式的核心。</div>
  <div class="quote">通俗讲：MCP 像 AI 工具的 USB-C 接口——一个 MCP 服务器写一次，Codex、Claude Code、Cursor 都能用。</div>
</div>

<div class="card">
  <h3>【模板 E】AGENTS.md vs Hooks vs Skills 对比</h3>
  <table>
    <tr><th>对比维度</th><th>AGENTS.md</th><th>Hooks</th><th>Skills</th><th>一句话结论</th></tr>
    <tr><td>约束力度</td><td>建议（可忽略）</td><td>强制（物理拦截）</td><td>按需触发工作流</td><td>安全靠 Hooks 不靠文档</td></tr>
    <tr><td>触发方式</td><td>会话启动自动加载</td><td>事件节点自动执行</td><td>/skill-name 或自动匹配</td><td>三者互补非替代</td></tr>
    <tr><td>适用内容</td><td>项目约定/禁止事项</td><td>危险命令拦截/时间注入</td><td>修 Issue/写 PR 等 SOP</td><td>长规范下沉到 Skill</td></tr>
    <tr><td>格式要求</td><td>10 条以内</td><td>fail-open 设计</td><td>SKILL.md &lt;50 行</td><td>过长则执行失败率上升</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 C】Codex 配置避坑清单</h3>
  <p><strong>坑：MCP 用 npx 动态下载导致启动卡顿 2-5 秒</strong></p>
  <p><strong>解法：</strong>全局安装到固定路径，config.toml 直接指向可执行文件。</p>
  <p><strong>坑：密钥明文写在 config.toml 或 .zshrc</strong></p>
  <p><strong>解法：</strong>config.toml 只写 env_vars 白名单，明文值放 chmod 600 的独立 env 文件。</p>
  <p><strong>坑：Skill 的 description 以方括号开头</strong></p>
  <p><strong>解法：</strong>YAML 会误读为数组导致静默跳过——用引号包裹。</p>
  <p><strong>严重程度：</strong>密钥泄露致命；MCP 卡顿和 Skill 格式问题属小心级别。</p>
</div>

<div class="card">
  <h3>【模板 B】headless 自动化（codex exec）</h3>
  <p><strong>操作步骤：</strong>1. codex exec --full-auto "任务" 最简调用 2. 加 --json 输出 NDJSON 事件流 3. 加 -o 写最终回复到文件 4. resume session_id 恢复中断任务。</p>
  <p><strong>CI/CD 要点：</strong>必须用 API Key 认证（非 OAuth）；加 --full-auto + --json + --ephemeral；禁止在 CI 用 OAuth 浏览器授权。</p>
  <div class="relation"><strong>反向能力：</strong>运行 codex mcp 可将 Codex 暴露为 MCP 服务器——在 Claude Code 中通过 MCP 调用 Codex，两代理各取所长。</div>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Codex 九大模块缺一不可：AGENTS.md 记忆、沙箱+Profile 安全、MCP 扩展、Hooks 强制、Skills 复用、headless 自动化</li>
    <li>AGENTS.md 控制在 10 条以内，可与 CLAUDE.md 通过 fallback 共享一份指令</li>
    <li>安全核心：workspace-write 日常 + MCP 封装联网；危险操作靠 PreToolUse 钩子而非文档建议</li>
    <li>五套 Profile 一键切换场景，避免每次手改 config.toml</li>
    <li>codex exec + --full-auto 是 CI/CD 和批量自动化的标准入口</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>审计并精简项目 AGENTS.md 到 10 条核心要点</li>
    <li>在 config.toml 创建 default-55 / kb-full / mini / ci 四套 Profile</li>
    <li>全局安装 brave-search + context7 MCP，密钥迁移到 chmod 600 的 env 文件</li>
    <li>配置三个核心 Hooks：时间注入、危险命令拦截、Stop 验证</li>
    <li>创建一个 fix-issue Skill（&lt;30 行 SKILL.md）作为第一个可复用工作流</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>从「装好 Codex 就能用」到「Codex 是需工程化配置的 Agent 系统」——配置质量决定 80% 的使用体验。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
