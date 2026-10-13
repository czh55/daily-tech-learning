import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'ai-era-debug-constraint-satisfaction.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#eef2ff,#e0e7ff);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#312e81,#4f46e5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}.tag-green{background:#d1fae5;color:#065f46}.tag-orange{background:#ffedd5;color:#9a3412}.tag-purple{background:#ede9fe;color:#6b21a8}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #4f46e5}
.card h3{font-size:22px;font-weight:700;color:#3730a3;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#eef2ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#3730a3;border-left:4px solid #4f46e5}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eef2ff,#c7d2fe);border:2px solid #a5b4fc;border-radius:16px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#3730a3}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#312e81,#4f46e5);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#3730a3;border-bottom:2px solid #cbd5e1}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px}`;

const body = `
<h1>看不懂代码也能修 Bug：约束满足式 Agent 调试</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-purple">Cindy Sridharan</span>
  <span class="tag tag-blue">生产排障</span>
  <span class="tag tag-green">事实层 / 推导层</span>
  <span class="tag tag-orange">AI Agent</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 Agent 几分钟生成数千行代码、人类理解力跟不上时，如何不靠「读懂代码」也能约束 Agent 的根因分析，避免把听起来合理却错误的修复合并上线。</p>

<div class="map">
  <h3 style="font-size:20px;color:#3730a3;margin-bottom:12px;text-align:center">调试闭环：事实 → 对照 → 强信号 → 全量验证</h3>
  <div class="diagram">
    <div class="node">告警 / 遥测<br>丢给 Agent</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">事实层<br>工具采集不可篡改</div>
    <span class="arrow-sym">→</span>
    <div class="node-blue">对照 + 假设矩阵<br>挖强信号</div>
    <span class="arrow-sym">→</span>
    <div class="node">剔除假说<br>最后才读代码</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「根因分析条理清晰 = 可信」。三个真实案例里，Claude 首版结论都极像真相（TLS 每次重载证书、无限重试等），却被生产事实一票否决；<strong>先让 Agent 读代码</strong>更是反模式——代码只描述「可能发生什么」，不是「实际发生了什么」。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】理解力债务与「不可靠叙述者」</h3>
  <p><strong>在讲什么问题：</strong>手写代码是慢燃式决策积累；Agent 批量生成让工程师对系统只有浅理解，却要对 Agent 结论负责。</p>
  <p><strong>关键理解：</strong>代码状态空间巨大，Agent 还会自选片段阅读，极易从合理角度一路走偏；P99 升高人人能解释，是弱信号，DNS 5 个地址 vs 400 个才是强信号。</p>
  <p><strong>和其他概念关系：</strong>与约束满足框架、对照实验、假设×事实矩阵一体；对抗式评审只能排除假说，不能替代事实采集。</p>
  <p><strong>怎么落地用：</strong>接到 Agent 根因报告时，先问「哪些事实支持/否定它」，而不是「代码里有没有这条路径」。</p>
  <p><strong>边界说明：</strong>对你亲手写清状态机的小模块，人类领域知识仍可快速驳回 Agent；对陌生栈（如 macOS 内核）则更要依赖工具事实。</p>
  <div class="quote">延迟案例：9000 行逐行读过仍被说服；真正修复是 1 行 <code>DatabaseClient</code> → <code>ShardedDatabaseClient</code>，预发 2 分片 vs 生产 5×80 副本掩盖了路由错误。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】三步调试循环（对照 → 强信号 → 全量验证）</h3>
  <p><strong>核心思路：</strong>把调试建模为约束满足：事实层每条都是硬约束，推导层假说必须全部满足才保留。</p>
  <p><strong>操作步骤：</strong>1）定义<strong>变量</strong>（出事案例）与<strong>对照</strong>（仅差一个怀疑因素，如关功能开关）→ 2）收集只出现在变量侧的<strong>高保真信号</strong> → 3）画假设×事实矩阵，找仅少数假说能解释的<strong>强信号</strong> → 4）用事实层<strong>每一条</strong>（含噪声）验证候选假说，矛盾即丢弃。</p>
  <p><strong>选型条件：</strong>分布式、灰度、环境矩阵复杂时优先对照+强信号；「简单」OOM 附 heaptrack 时，若 Agent 二分查找提交连错，改为沿单一路径逐行追踪。</p>
  <p><strong>避坑：</strong>本地轻率复现若不能复现同一强信号，只是巧合叙事；SLO/SLI 常是症状弱信号。</p>
  <div class="highlight"><strong>落地：</strong>让 Agent 登生产机抓包/进程监控，并对照关开关路径——证书只加载一次即可推翻「每次 RPC 重载证书」。</div>
</div>

<div class="card">
  <h3>【避坑清单卡】Agent 排障常见陷阱</h3>
  <p><strong>坑名：</strong>信任首版根因分析并急于合并修复。</p>
  <p><strong>原因：</strong>叙事完整 ≠ 事实一致；人类理解不足以反驳。</p>
  <p><strong>解法：</strong>事实层先行；修复前用对照实验或矩阵证伪。</p>
  <p><strong>严重程度：</strong>致命。</p>
  <div class="pitfall"><strong>坑名：</strong>把对抗式评审当验证器——它只能排除弱假说，不能证明事实正确。</div>
  <div class="pitfall"><strong>坑名：</strong>OOM 案连错三次（无限重试、默认关闭的优化）——换策略为沿「无有效凭证」路径追踪，发现进程级缓存使「一次性」状态机被反复重入。</div>
</div>

<div class="card">
  <h3>【决策/选型表】何时用哪类排障动作</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>灰度后延迟齐升</td><td>对照开关 + 抓包/遥测矩阵</td><td>分离环境噪音，挖 DNS 类强信号</td><td>先全文读 9000 行</td><td>叙述者盲区，弱信号误导</td></tr>
    <tr><td>有复现步骤的 OOM</td><td>固定路径逐行追踪</td><td>避免二分乱猜提交</td><td>只信 heaptrack 表面故事</td><td>Agent 会连错多次</td></tr>
    <tr><td>无日志间歇挂起</td><td>sysdiagnose / 内核级数据 + Agent 检索</td><td>事实在 30MB 诊断包里</td><td>要求用户先复现再查</td><td>重启即毁现场</td></tr>
    <tr><td>所有假说都被事实否定</td><td>五招：复核采集、拆/并假设、组合互补假说</td><td>避免急于编新故事</td><td>立刻新编叙事</td><td>可能事实采错或假设粒度不对</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】事实层 vs 推导层 vs 先读代码</h3>
  <table>
    <tr><th>维度</th><th>事实层</th><th>推导层（Agent 假说）</th><th>先读代码</th><th>一句话</th></tr>
    <tr><td>来源</td><td>日志、抓包、profile、内核数据</td><td>假设、推论、故事</td><td>源码静态路径</td><td>只有事实层不可篡改</td></tr>
    <tr><td>作用</td><td>硬约束</td><td>待证伪候选</td><td>描述可能行为</td><td>代码是最后一步</td></tr>
    <tr><td>风险</td><td>采错机器/时间窗</td><td>听起来合理</td><td>自选片段走偏</td><td>弱信号当根因</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】Agent 原生软件工厂</h3>
  <p><strong>原则：</strong>为人优化高层决策点，为 Agent 优化细粒度事实采集；用「人工干预次数」衡量智能体基础设施成熟度。</p>
  <p><strong>怎么落地：</strong>流水线里默认挂载对照实验模板、假设矩阵、生产只读探针；合并修复前强制「事实清单」勾选。</p>
  <p><strong>适用边界：</strong>小脚本、单人模块仍可依赖深度代码理解；大规模 Agent 生成 + 生产矩阵时必须切换约束满足范式。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：传统「代码即真相」派 / 强调工程师必须完全理解提交</p>
  <p class="rebuttal-text">生产行为由配置、数据、拓扑与并发时序共同决定，死盯代码只会把 Agent 叙事换成人类叙事，照样挡不住预发与生产分片不一致这类环境型根因。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>AI 时代理解力债务使首版根因分析高度危险，三个生产 Bug 证明「合理故事」常错。</li>
    <li>调试 = 约束满足：事实层硬约束 + 推导层假说，矛盾即剔除。</li>
    <li>对照找信号、矩阵找强信号、全量事实验证；读代码放在最后。</li>
    <li>复现与对抗评审有边界，不能替代事实采集。</li>
    <li>软件工厂应向 Agent 可自动采集的事实基础设施演进。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>下次把告警交给 Agent 时，同时给出对照案例（如功能开关 off）与采集命令。</li>
    <li>要求输出假设×事实矩阵，标出强信号列。</li>
    <li>合并修复前列出「若错会被哪条事实推翻」。</li>
    <li>审计预发与生产拓扑差异（分片数、副本数）是否覆盖灰度路径。</li>
    <li>在团队模板里禁止「先通读代码再给根因」作为第一步。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>调试的对象从「代码叙述」转向「事实集合」——<strong>你不是要更快读懂 Agent 写的代码，而是要更快让错误假说无法同时满足所有事实。</strong></p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
