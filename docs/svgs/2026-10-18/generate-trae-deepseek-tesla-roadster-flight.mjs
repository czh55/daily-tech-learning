import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'trae-deepseek-tesla-roadster-flight.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfeff,#e0f2fe);padding:48px 60px;color:#1e293b}
h1{font-size:30px;font-weight:900;background:linear-gradient(135deg,#0369a1,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-sky{background:#e0f2fe;color:#0369a1}.tag-cyan{background:#cffafe;color:#155e75}.tag-rose{background:#ffe4e6;color:#9f1239}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #0ea5e9}
.card h3{font-size:22px;font-weight:700;color:#0369a1;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#ecfeff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#0c4a6e;border-left:4px solid #38bdf8}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#e0f2fe,#bae6fd);border:2px solid #7dd3fc;border-radius:14px;padding:10px 12px;text-align:center;min-width:72px;font-weight:700;font-size:10px;color:#0369a1}
.node-alt{background:linear-gradient(135deg,#fce7f3,#fbcfe8);border-color:#f9a8d4;color:#9d174d}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#0369a1,#0ea5e9);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f0f9ff;padding:10px 14px;text-align:left;font-weight:700;color:#0369a1;border-bottom:2px solid #bae6fd}
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
<h1>同题复现 Roadster 飞行：TRAE vs DeepSeek 视频模型实测</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-sky">文生视频</span>
  <span class="tag tag-cyan">DeepSeek-Harness</span>
  <span class="tag tag-rose">逐帧对比</span>
  <span class="tag tag-slate">约 1 小时实测</span>
</div>
<p class="subtitle">本文解决的核心问题是：在马斯克 Roadster「汽车飞天」名场面这一固定创意下，TRAE+Seed 与 DeepSeek-Harness+DeepSeek-V4.1-Flash-1017 谁更贴近参考镜头——作者用 108 帧逐帧对比，在约 1 小时内完成同题 PK（正文受掘金 WAF 限制，以下依据公开摘要与作者惯用评测框架整理）。</p>

<div class="map">
  <h3 style="font-size:20px;color:#0369a1;margin-bottom:12px;text-align:center">统一提示词/参考镜头 → 双栈出片 → 108 帧对齐 → 主观+结构对比 → 结论</h3>
  <div class="diagram">
    <div class="node">同题<br>Prompt</div><span class="arrow-sym">→</span>
    <div class="node">TRAE<br>+ Seed</div><span class="arrow-sym">|</span>
    <div class="node-alt">DS-Harness<br>+ V4.1-Flash</div><span class="arrow-sym">→</span>
    <div class="node">108 帧<br>对比</div><span class="arrow-sym">→</span>
    <div class="node">谁翻车<br>谁封神</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：文生视频只要「像真的」就够。同题复现评测强调的是<strong>与参考名场面的一致性</strong>（车体、运动轨迹、镜头语言），而不是单看某一帧炫不炫。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】同题 PK 在测什么</h3>
  <p><strong>在讲什么问题：</strong>热点事件（Roadster 飞行）下，两套 AI 视频栈能否复现同一视觉叙事。</p>
  <p><strong>关键理解：</strong>控制变量是「创意与镜头目标」，变化的是工具链（TRAE vs DeepSeek-Harness）与底模（Seed vs V4.1-Flash-1017）。</p>
  <p><strong>怎么落地用：</strong>先锁 prompt、时长、画幅与参考帧，再比输出，避免「各说各话」。</p>
  <p><strong>边界说明：</strong>单次 1 小时实测是体验向基准，不是严格学术复现；换 prompt 排名可能变。</p>
  <p><strong>原文依据：</strong>摘要写明「108 帧逐帧对比」「1 小时实测」「Trae+Seed 与 DeepSeek-1017 同题 PK」。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】双栈工作流</h3>
  <p><strong>核心思路：</strong>一条链路走 TRAE 编排 + Seed 视频能力；另一条走 DeepSeek-Harness 插件化智能体 + DeepSeek-V4.1-Flash-1017 生成。</p>
  <p><strong>操作步骤：</strong>1）写清场景（Roadster 起飞/飞行姿态）→ 2）分别出片 → 3）抽 108 关键帧对齐时间轴 → 4）对比形变、物理违和、文字/logo 稳定性。</p>
  <p><strong>选型条件：</strong>已深度使用 Harness/Cordis 生态的读者更适合复现 DeepSeek 侧；TRAE 侧适合 IDE 一体化出片流程。</p>
  <p><strong>避坑：</strong>不同工具默认分辨率、帧率、后处理不同，对比前须归一化或注明差异。</p>
</div>

<div class="card">
  <h3>【决策/选型表】评测维度建议</h3>
  <table>
    <tr><th>维度</th><th>看什么</th><th>翻车信号</th></tr>
    <tr><td>主体一致性</td><td>车型轮廓、颜色、比例</td><td>帧间突变、车变物体</td></tr>
    <tr><td>运动物理</td><td>起飞加速度、抛物线</td><td>悬浮抽搐、背景不同步</td></tr>
    <tr><td>镜头语言</td><td>是否与参考名场面节奏接近</td><td>随机变焦、主体出画</td></tr>
    <tr><td>工程效率</td><td>1 小时内能否走完双栈</td><td>反复抽卡仍无法对齐参考</td></tr>
    <tr><td>工具链</td><td>Harness 是否减少手工调参</td><td>插件/模型版本不一致导致不可比</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】TRAE 栈 vs DeepSeek 栈（评测视角）</h3>
  <table>
    <tr><th>维度</th><th>TRAE + Seed</th><th>DeepSeek-Harness + V4.1-Flash-1017</th></tr>
    <tr><td>入口</td><td>IDE/一体化创作流</td><td>Harness 智能体 + 模型 API</td></tr>
    <tr><td>可控性</td><td>依赖产品内工作流与 Seed 能力</td><td>可接插件、脚本化批处理</td></tr>
    <tr><td>复现成本</td><td>需相同 TRAE/Seed 版本</td><td>需锁定 Harness profile 与模型 build（1017）</td></tr>
    <tr><td>适合谁</td><td>快速试创意、少写代码</td><td>已玩 DSH、要把视频生成纳入 Agent 流水线</td></tr>
  </table>
  <p><strong>说明：</strong>具体胜负以原文视频与逐帧截图为准，本卡只固化对比框架。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】逐帧对比的陷阱</h3>
  <p><strong>坑名：</strong>帧数对齐了，但时间轴语义没对齐（慢动作 vs 实时）。</p>
  <p><strong>原因：</strong>生成视频 GOP、时长、补帧策略不同，硬凑 108 帧会冤枉某一侧。</p>
  <p><strong>解法：</strong>按「事件节点」（离地、最高点、掠过镜头）分段再抽帧；记录各片真实 fps 与时长。</p>
  <p><strong>严重程度：</strong>对结论可信度：高。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】热点复现型评测</h3>
  <p><strong>原则：</strong>借公共视觉记忆（Roadster 飞天）降低观众理解成本，把争论收敛到「谁更像参考」而非抽象画质分。</p>
  <p><strong>怎么落地：</strong>公开 prompt、模型版本、抽帧方法与失败片段，让读者能复跑或反驳。</p>
  <p><strong>适用边界：</strong>娱乐向热点不适合推导通用 SOTA；仅反映当时当模型当工具链。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「一次短视频 PK 就能定义最强模型」</p>
  <p class="rebuttal-text">Roadster 同题更像「工具链可玩性展示 + 主观镜头对标」，把结论推广到所有文生视频场景会过度外推——价值在于教你怎样设对照实验，而非颁永久冠军。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>作者用 Roadster 飞行名场面做固定创意，双栈同题出片并做 108 帧对比。</li>
    <li>TRAE+Seed 与 DeepSeek-Harness+V4.1-Flash-1017 代表两种「Agent/IDE + 视频模型」组合路径。</li>
    <li>约 1 小时实测强调工程可完成性，而不只是单帧惊艳。</li>
    <li>评测应看主体一致、运动合理、镜头节奏与工具链可复现性。</li>
    <li>掘金正文需浏览器侧阅读才能看到完整翻车/封神细节与成片。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>复现前锁定两侧模型版本号（含 1017 build）与 TRAE/Seed 版本。</li>
    <li>写下单一中文/英文 prompt，禁止两侧偷偷改词。</li>
    <li>按事件节点抽帧，再汇总为 108 帧矩阵对比表。</li>
    <li>记录失败类型（形变、物理、闪烁）占比，而不只写「更好」。 </li>
    <li>若走 DeepSeek 侧，用 Harness 固定 profile 保证插件与模型一致。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从文生视频「抽卡赏味」转为「同题可复现实验」——工具链与底模要成对写进实验记录。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
