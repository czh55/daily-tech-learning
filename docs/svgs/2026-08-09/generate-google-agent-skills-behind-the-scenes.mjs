import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'google-agent-skills-behind-the-scenes.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
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
<h1>1.5万星背后：Google首次揭秘Agent Skills是怎么「造」出来的</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Agent Skills</span>
  <span class="tag tag-green">开源治理</span>
  <span class="tag tag-orange">持续评测</span>
  <span class="tag tag-purple">远程 MCP</span>
  <span class="tag tag-red">质量工程</span>
</div>
<p class="subtitle">本文解决的核心问题是：google/skills 在 1.5 万星热度下如何同时开放多产品线贡献与守住 Agent 体验底线——Google Cloud 用统一目录结构、上线前三重自动检查、提交时+每周持续评测、2×2 准确率/效率矩阵，以及 Repo Maintainer + Skill Owner 双层责任制，把 Skill 从「一次性文档」升级为可运营的产品。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">Google Agent Skills 质量流水线</h3>
  <div class="diagram">
    <div class="node">内部构建<br>+评测</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">CI 三重检查<br>Linter/链接/结构</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">提交时评测<br>用例+打分标准</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">自动化导出<br>脱敏上 GitHub</div>
    <span class="arrow-sym">→</span>
    <div class="node-red">每周例行评测<br>防悄悄退化</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">架构原则：优先远程 MCP 工具，CLI/API 仅作兜底；Skill Owner 对长期质量负责</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：Skill 就是「把提示词写长一点」。官方定义是结构化、可被 Agent 读取的领域经验包——含最佳实践、边界情况与操作步骤；含糊指令、失效链接、漏写边界会直接拖垮整条 Agent 链路。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Agent Skill 到底是什么</h3>
  <p><strong>在讲什么问题：</strong>多团队抢着往开源仓库塞知识，但质量参差会放大 Agent 幻觉与误操作风险。</p>
  <p><strong>核心机制：</strong>Skill 不是提示词碎片，而是机器可读的结构化指令包，把某领域最佳实践、边界与步骤打包成 Agent 可调用的经验。</p>
  <p><strong>关键理解：</strong>热度（1.5 万星）带来的是治理压力，不是「写完就完」——开放与质量必须工程化并行。</p>
  <p><strong>典型场景：</strong>Cloud、Ads 等多产品线想把领域知识沉淀成可复用 Agent 能力。</p>
  <p><strong>边界说明：</strong>公开仓库只导出通过验证、已脱敏的部分；内部 DevRel Skills 服务内部工作流，不直接等同对外 Skill。</p>
  <div class="quote">「任何一处瑕疵都会拖累整个 Agent 的使用体验。」——Remigiusz Samborski 对质量风险的判断</div>
  <div class="relation"><strong>相关概念：</strong>与 MCP 是互补关系——Skill 偏「知道怎么做」，远程 MCP 偏「能调用什么工具」；架构上优先 MCP 把鉴权/IAM 交给基础设施。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】上线前三重自动化关卡</h3>
  <p><strong>核心思路：</strong>合并前用 CI/CD 把格式、链接、结构三类低级错误清零，避免脏数据进入主库。</p>
  <p><strong>操作步骤：</strong>① Linter 校验 frontmatter、行数、目录与命名 → ② 链接检查器逐 URL 测 404/幻觉链接 → ③ AI 辅助结构校验指令是否遵循规定模式与防护规则。</p>
  <p><strong>选型条件：</strong>适合所有即将合并的 Skill；不能替代提交时的人工/半自动评测。</p>
  <div class="pitfall"><strong>避坑：</strong>以为过了 Linter 就等于「能提升 Agent」——三重检查只保证结构健康，准确率与效率要靠评测矩阵验证。</div>
  <div class="highlight"><strong>落地：</strong>贡献前本地先跑同类检查，减少在 PR 里反复修链接与 frontmatter。</div>
</div>

<div class="card">
  <h3>【决策/选型表】持续评测：提交时 vs 每周例行</h3>
  <table>
    <tr><th>评测类型</th><th>触发时机</th><th>输入要求</th><th>目的</th></tr>
    <tr><td>提交时评测</td><td>新 Skill 上线前</td><td>作者提供提示词集合+打分标准+预期结果</td><td>证明「用了 Skill 的 Agent」优于「没用」</td></tr>
    <tr><td>每周例行评测</td><td>全库定期自动跑</td><td>沿用已登记评测集</td><td>API/模型/框架变化后尽早发现质量回退</td></tr>
  </table>
  <p><strong>所以呢：</strong>文档和 API 会变、底层模型也会变——今天好用的 Skill 明天可能悄悄失效，持续评测是防退化的保险丝。</p>
  <div class="relation"><strong>评测维度：</strong>准确率（回答质量/任务完成率）+ 效率（Token 与时间）；多 Agent 框架交叉跑以求统计显著性。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】2×2 矩阵：这个 Skill 值不值得留</h3>
  <table>
    <tr><th>准确率</th><th>效率</th><th>结论</th><th>行动</th></tr>
    <tr><td>高</td><td>高</td><td>又准又快，理想 Skill</td><td>推广、作模板</td></tr>
    <tr><td>高</td><td>低</td><td>准但贵/慢</td><td>优化指令长度与工具调用路径</td></tr>
    <tr><td>低</td><td>高</td><td>快但不可靠</td><td>危险——易引入幻觉式「高效错误」</td></tr>
    <tr><td>低</td><td>低</td><td>无效 Skill</td><td>拒绝合并或下线修复</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】规模化开放的三类典型风险</h3>
  <p><strong>坑 1：各团队标准走样</strong>——指令模糊、链接失效、边界漏写。<strong>解法：</strong>统一目录结构+命名+自动化检查。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 2：把 Skill 当一次性文档</strong>——API 变更后无人更新。<strong>解法：</strong>Skill Owner 制度，产品 API 变则 Owner 必须跟进。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 3：裸 CLI/API 调用泛滥</strong>——鉴权与 IAM 靠人肉约束。<strong>解法：</strong>架构原则「远程 MCP 优先」，CLI/API 仅兜底。<strong>严重程度：</strong>小心（安全与运维成本）。</p>
  <div class="pitfall"><strong>别踩：</strong>没有评测就合并——团队内部用 ADK 多智能体写 Skill 可以加速创作，但公开仓库仍须达标评测与脱敏导出。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】Skill 是产品，需要长期运营</h3>
  <p><strong>原则：</strong>标准化是规模化的地基；质量要前置把关也要持续监控；责任必须落到人。</p>
  <p><strong>为什么重要：</strong>开源热度会吸引贡献，但没有治理的仓库会快速失控，反而伤害开发者对 Agent 的信任。</p>
  <p><strong>怎么落地：</strong>设 Repo Maintainer（仓库健康+CI+架构统一）与 Skill Owner（单 Skill 长期维护）；内部用写作 Skill + ADK 多智能体降低作者负担。</p>
  <p><strong>适用边界：</strong>这套流程针对 google/skills 类「多产品线共建」场景；小团队私有 Skill 可简化，但「评测+Owner」不宜省。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「轻量提示词够用」的 Agent 快速迭代派</p>
  <p class="rebuttal-text">你们用 Linter、每周全库评测和 Owner 责任制把 Skill 做成云厂商级产品——贡献门槛和运维成本会吓退社区，1.5 万星的热度反而变成只有少数大厂能维护的「精装文档库」，中小团队仍会继续用随手写的 Prompt 赢速度。</p>
</div>

<div class="conclusion">
  <h2>结论与行动</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Agent Skills 诞生于 Next '26 前跨团队冲刺，热度超预期后治理成为核心议题。</li>
    <li>统一目录 + 远程 MCP 优先，把一致性与可治理性写进架构默认值。</li>
    <li>上线前三重检查 + 提交时/每周双轨评测，用 2×2 矩阵量化「又准又快」。</li>
    <li>Skill Owner 制度表明：流程之外必须有人对单份 Skill 的长期质量负责。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>阅读 google/skills 仓库目录规范，对照自己团队的 Skill/Prompt 资产是否结构一致。</li>
    <li>为新 Skill 准备评测用例：提示词、预期结果、准确率与效率对比基线。</li>
    <li>工具选型时优先评估远程 MCP 能否覆盖能力，再考虑 CLI/API 兜底。</li>
    <li>为每份对外 Skill 指定 Owner，绑定 API 变更与评测回退的响应责任。</li>
    <li>参考 Google Cloud 博文与 Remigiusz 推文，跟踪持续评测与导出脱敏实践细节。</li>
  </ol>
  <p><strong>关键认知转变：</strong>Agent 经验包的质量不是「写得好不好」的文学问题，而是可度量、可回归、可问责的工程问题——开放贡献与质量底线靠同一套流水线同时成立。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
