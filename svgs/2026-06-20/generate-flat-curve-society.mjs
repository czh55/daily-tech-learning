import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'flat-curve-society.svg');

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
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:160px;font-weight:700;font-size:16px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
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
<h1>大模型正在见顶！传奇架构师：欢迎来到「平坦曲线时代」</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">平坦曲线</span>
  <span class="tag tag-green">AI 素养</span>
  <span class="tag tag-orange">Token 洁癖</span>
  <span class="tag tag-purple">Steve Yegge</span>
</div>
<p class="subtitle">本文解决的核心问题是：当大模型能力进入平台期、公开可调用的智力长期止步于当前水平时，开发者和创业者应如何从「追逐模型跃迁」转向「提升团队 AI 素养与 Token 成本管理」，在稳定地基上建设可持续十年的系统。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">核心概念关系图</h3>
  <div class="diagram">
    <div class="node">双重视界</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">能力平台期</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">AI 素养决胜</div>
    <span class="arrow-sym">→</span>
    <div class="node">Token 洁癖</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">务实建设</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「模型还在指数增长，现在学的一切很快会被下一代 GPT 作废」—— Steve Yegge 指出辨识视界决定了超人智能等同于不可验证，公开模型能力将长期平台化；平坦曲线不是坏消息，而是让系统工程师终于能脚踏实地安营扎寨。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】平坦曲线与双重视界模型</h3>
  <p><strong>在讲什么问题：</strong>为什么大模型进化曲线在今年开始变平，以及这种「见顶」对行业意味着什么。</p>
  <p><strong>核心机制：</strong>Steve Yegge 提出双重视界：需求视界指 90% 日常任务已被中轻量模型（如 Sonnet）触顶，普通问题撑不开模型差异；辨识视界指人类能验证的最难答案才是能力上限——当模型智力超越人类极限，超人智能等同于不可验证，安全与政治博弈会像管制浓缩铀一样封锁顶尖能力。</p>
  <p><strong>关键理解：</strong>公开、自由、低成本可调用的模型能力将长期止步于当前平台期，这不是技术停滞而是可验证性与安全约束的必然结果。</p>
  <p><strong>典型场景：</strong>用现有 Sonnet/Opus 级别模型做多 Agent 编排、系统级开发、CI/CD 集成，未来数年能力基线可预期。</p>
  <p><strong>边界说明：</strong>地狱级复杂工程（如大型 React 客户端重构）顶尖模型仍会犯错；不要指望下一次发布会带来跨代智力跃迁来拯救架构债务。</p>
  <div class="quote">「当模型的智力超越人类极限时，超人智能就等同于不可验证。」</div>
  <div class="relation"><strong>相关概念：</strong>与「Scaling Law 永无止境」叙事对立；与 Anthropic 专家溢价论互补——模型平台化后竞争焦点从「谁更聪明」转向「谁更会用好现有智力」。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】平坦曲线时代的行业洗牌</h3>
  <table>
    <tr><th>对比维度</th><th>指数增长幻想期</th><th>平坦曲线时代</th><th>一句话结论</th></tr>
    <tr><td>产品策略</td><td>「周末用 AI 重写一切」</td><td>在坚固土地上安营扎寨</td><td>投机重写遗留单体不可接受</td></tr>
    <tr><td>SaaS vs 自建</td><td>「SaaS 已死，人人 AI 自建」</td><td>SaaS 强势回归</td><td>Token 与维护成本无底洞，可预测 SaaS 更理智</td></tr>
    <tr><td>竞争焦点</td><td>谁的模型更聪明</td><td>谁的团队 AI 素养更高</td><td>Netflix 实验证明 10 小时可培训到多 Agent 协作</td></tr>
    <tr><td>开发心态</td><td>技术栈焦虑、随时降维打击</td><td>营地建设（Campground Craft）</td><td>务实系统工程师的黄金时代刚开始</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】Netflix 三大 AI 素养梯队</h3>
  <p><strong>原则：</strong>未来竞争不是模型智商竞赛，而是团队「AI 素养」——你有多懂如何高效、廉价地使用 AI。</p>
  <p><strong>为什么重要：</strong>无素养团队无节制烧 Token 产出 Slop；有素养团队用 10 小时培训即可让 96% 员工六周后保持高协作惯性。</p>
  <p><strong>梯队划分：</strong>第一梯队（Beginners）刚脱离 AI 文盲，单点 Prompt、需人类紧盯；第二梯队（Baseline）每日 1200-1500 万 Token，可放手 2-4 个 Agent 异步工作；第三梯队（Power Users）每日 5000 万+ Token，融入系统开发、Bug 搜索与 CI/CD。</p>
  <p><strong>怎么落地：</strong>第一周安排 5 小时集中培训到第二梯队，再 5 小时晋升超级用户；用 Token 消耗量与使用习惯监控员工段位。</p>
  <p><strong>适用边界：</strong>适用于已有基础 AI 工具链的企业；纯手工团队需先解决工具接入与权限问题。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】Token 洁癖与智能路由</h3>
  <p><strong>标签：</strong>词元成本管理 · 平坦曲线时代必修课</p>
  <p><strong>核心思路：</strong>初级阶段 AI 素养表现为消耗多少 Token，高级阶段表现为节约多少浪费——用最少的 Token 压榨最大业务成果。</p>
  <p><strong>操作步骤：</strong>① 识别「愚蠢自动搬砖」：git status、找文件名等 1 秒手打操作禁止交给 Agent（整目录上下文上传可瞬间浪费 10 万 Token）；② 建立智能路由：90% 愚蠢简单问题路由最便宜/免费模型，仅复杂推理升级到昂贵顶级模型；③ 审计团队日常 Token 账单，设定人均消耗基线。</p>
  <p><strong>选型条件：</strong>平坦曲线下模型能力可预期，粗放烧 Token 的 Vibe Coding 正在破产，适合需要长期控制 API 成本的团队。</p>
  <div class="pitfall"><strong>避坑：</strong>让 Agent 执行一行 shell 命令却上传整个项目目录——每次浪费几美分，积少成多；无门控高频轮询同理。</div>
  <div class="quote">「如果你用手打一行命令只要 1 秒，就请用手打！别让 Agent 去干。」</div>
</div>

<div class="card">
  <h3>【决策/选型表】平坦曲线下的建设策略</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>企业遗留单体改造</td><td>渐进式重构 + 人工审计</td><td>模型无跨代跃迁，AI 重写维护成本不可接受</td><td>周末一键 AI 重写</td><td>崩溃风险与 Slop 维护无底洞</td></tr>
    <tr><td>内部小工具需求</td><td>采购成熟 SaaS</td><td>可预测成本、高确定性</td><td>全员 Vibe Coding 自建</td><td>Token + 维护双无底洞</td></tr>
    <tr><td>日常开发辅助</td><td>多 Agent 路由 + Token 洁癖</td><td>能力平台期，效率差在用法不在模型</td><td>凡事用最贵 Opus</td><td>成本与收益严重不匹配</td></tr>
    <tr><td>团队能力建设</td><td>10 小时 AI 素养培训</td><td>Netflix 验证 5+5 小时可达 Power User</td><td>等待下一代模型</td><td>公开能力长期平台化</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】平坦曲线时代常见误区</h3>
  <p><strong>坑名：</strong>持续押注「下一次发布会拯救一切」的技术栈焦虑。</p>
  <p><strong>原因：</strong>过去两三年创业者活在随时海啸的沙滩上，误以为模型会无限指数增长。</p>
  <p><strong>原文说法：</strong>「脚下土地每时每刻都在剧烈晃动、随时面临降维打击的感觉，让整个行业陷入了长期的精神衰弱。」</p>
  <p><strong>解法：</strong>接受 Sonnet/Opus 级别将保持行业主流数年，转向数据库优化、用户体验、多 Agent 路由等营地建设。</p>
  <p><strong>严重程度：</strong>小心——不致命但会持续消耗团队士气与建设节奏。</p>
  <div class="pitfall"><strong>另一坑：</strong>无节制消耗 Token 产出平庸垃圾代码（Slop）——平坦曲线下粗放开发正在快速破产，严重程度：致命（直接侵蚀利润与代码质量）。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Scaling Law 信仰者 / 大模型实验室激进派</p>
  <p class="rebuttal-text">辨识视界只是当前人类监督能力的临时天花板，合成数据、形式化验证与 AI 监督 AI 正在把可验证边界往上推——把平台期当成永久地平线是低估了算力、算法与自我改进闭环的复利，平坦曲线不过是又一次「AI 寒冬」式的短视误判。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>大模型公开能力因双重视界（尤其辨识视界）进入长期平台期，指数增长幻想破灭。</li>
    <li>「周末 AI 重写一切」与「SaaS 已死」两大幻觉同时破产，务实建设与成熟 SaaS 回归。</li>
    <li>竞争焦点从模型智商转向团队 AI 素养，Netflix 验证 10 小时培训即可打造多 Agent 协作能力。</li>
    <li>Token 洁癖与智能路由是平坦曲线时代的系统级控制艺术，拒绝愚蠢自动搬砖。</li>
    <li>平坦曲线是务实系统工程师的历史性解放，可开始修建运行十年的工匠精神系统。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>本周审计团队 Token 账单，找出 git status 类愚蠢 Agent 调用并改为手打。</li>
    <li>设计 90/10 智能路由：简单任务走便宜模型，复杂推理才升级 Opus。</li>
    <li>安排 10 小时 AI 素养培训，目标让全员达到 Netflix 第二梯队（日耗 1200 万 Token 级多 Agent 协作）。</li>
    <li>暂停任何「等下一代模型再重构」的借口，选定一个子系统本周开始渐进式营地建设。</li>
    <li>重新评估自建 vs SaaS，对 Token 维护双高场景优先采购可预测 SaaS。</li>
  </ol>
  <p><strong>关键认知转变：</strong>模型见顶不是末日而是礼物——游戏规则终于稳定，属于浮躁投机者的时代结束，属于在平坦草原上修建未来软件大厦的务实工程师的时代才刚刚开始。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
