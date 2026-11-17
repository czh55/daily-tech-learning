import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'ohmymv-website-introduction.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f5f3ff,#ede9fe);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#6d28d9,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-purple{background:#ede9fe;color:#5b21b6}.tag-pink{background:#fce7f3;color:#9d174d}.tag-slate{background:#e2e8f0;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #7c3aed}
.card h3{font-size:22px;font-weight:700;color:#6d28d9;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:16px 0}
.node{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:2px solid #c4b5fd;border-radius:14px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#5b21b6}
.node-em{background:linear-gradient(135deg,#6d28d9,#7c3aed);border-color:#a78bfa;color:#f5f3ff}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#5b21b6,#7c3aed);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f5f3ff;padding:10px 12px;text-align:left;font-weight:700;color:#6d28d9;border-bottom:2px solid #ddd6fe}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fff1f2;border:2px solid #e11d48;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#be123c;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#e11d48;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#881337}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
.highlight{background:#f5f3ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#5b21b6;border-left:4px solid #7c3aed}
.pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}`;

const body = `
<h1>ohmymv：一首歌 → 完整 AI MV 的产品切口</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-purple">学员实践</span>
  <span class="tag tag-pink">多模态视频</span>
  <span class="tag tag-slate">翔宇工作流</span>
</div>
<p class="subtitle">绍明（翔宇学员）上线 ohmymv：上传完整音轨 + 人物图，系统完成分镜、三视图定妆、词级对唇与 1080p 成片，并导出可二次精修的剪映工程——本文提炼其「整首歌一整部片」边界与从 demo 到可交付产品的工程要点。</p>

<div class="map">
  <h3 style="font-size:20px;color:#6d28d9;margin-bottom:12px;text-align:center">端到端 MV 流水线</h3>
  <div class="diagram">
    <div class="node">音轨+人物图</div><span class="arrow-sym">→</span>
    <div class="node">分镜/定妆</div><span class="arrow-sym">→</span>
    <div class="node-em">对唇+终剪</div><span class="arrow-sym">→</span>
    <div class="node">1080p+剪映工程</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：AI 视频产品 = 单镜头生成器。原文强调 ohmymv 不做几秒片段，而是<strong>整首歌对应整部片</strong>，难点在跨镜头人物一致、词级对齐与可交付工程文件。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】产品边界与 Slogan</h3>
  <p><strong>在讲什么问题：</strong>Suno/Udio 用户歌做完后如何零门槛得到可发布 MV。</p>
  <p><strong>关键理解：</strong>「把一整首歌，拍成一部电影」= 输入粒度是完整音轨，输出是连续叙事 MV，非幻灯片式镜头拼接。</p>
  <p><strong>怎么落地用：</strong>入口 ohmymv.com/zh；可先审片门禁看分镜再烧积分。</p>
  <p><strong>边界说明：</strong>面向有成品歌的创作者；不负责作曲；需接受 AI 生成审美与积分计费。</p>
  <p><strong>原文依据：</strong>首页 8 部三分多钟端到端示范，证明链路闭环非单点 demo。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】能力清单（首页公开承诺）</h3>
  <p><strong>核心思路：</strong>把「好看一帧」问题降维成「多镜头连续剧」工程题。</p>
  <p><strong>操作步骤：</strong>① 上传歌+人物 ② 按音乐结构拆 16 组多机位分镜 ③ 正/侧/背三视图锁相 ④ 词级音画对齐 ⑤ 自动或导演台模式 ⑥ 导出剪映/CapCut 多轨工程。</p>
  <p><strong>选型条件：</strong>需要口型对歌词、人物跨镜一致、还要自己精修时选 ohmymv 而非纯文生视频。</p>
  <p><strong>避坑：</strong>不审分镜一口气跑完易浪费积分——用审片门禁。</p>
  <p><strong>对比 PanSnap：</strong>同一学员路线，PanSnap 是日常小切口，ohmymv 是多模态最难的连贯性。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】单镜头工具 vs ohmymv</h3>
  <table>
    <tr><th>维度</th><th>片段型 AI 视频</th><th>ohmymv</th></tr>
    <tr><td>输入</td><td>短 prompt/短音频</td><td>整首歌+定妆图</td></tr>
    <tr><td>一致性</td><td>镜头间漂移常见</td><td>三视图+分镜调度</td></tr>
    <tr><td>交付</td><td>单 mp4</td><td>成片+剪映多轨</td></tr>
    <tr><td>模式</td><td>通常全自动</td><td>自动+导演台单镜重抽</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】从 demo 到产品的「交付到底」</h3>
  <p><strong>原则：</strong>生成环节可接模型，产品差在串联人声分离、对齐、一致性、合成、计费与退还规则。</p>
  <p><strong>为什么：</strong>翔宇视角：切口收窄、流程透明、样例可看、结果可拿走——与 AI 编程学员「做成别人能用的东西」同构。</p>
  <p><strong>怎么落地学：</strong>学员可先小场景（PanSnap）再啃多模态连贯；ohmymv 是难度跃迁参考而非第一步必做。</p>
  <p><strong>边界：</strong>营销文非技术白皮书；具体模型与 SLA 以站点为准。</p>
</div>

<div class="card">
  <h3>【避坑清单卡】使用与产品化</h3>
  <p><strong>坑名：</strong>跳过审片门禁。<strong>解法：</strong>分镜满意再往下跑。<strong>严重程度：</strong>小心（积分）。</p>
  <p><strong>坑名：</strong>以为导出视频就不能改。<strong>解法：</strong>拿剪映工程继续精修音轨/字幕/分镜轨。<strong>严重程度：</strong>可忽略。</p>
  <p><strong>坑名：</strong>把学员案例当通用技术方案。<strong>解法：</strong>借鉴「闭环交付」思路，自行验证成本与合规。<strong>严重程度：</strong>小心。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「直接堆最新视频大模型就行」</p>
  <p class="rebuttal-text">多镜 MV 的瓶颈很少在「再大一档模型」，而在调度、锁相、对唇、门禁与可编辑交付——没有流水线与计费退还设计，大模型只会产出能看不能用的长片素材堆。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>ohmymv 切口：整首歌→完整 1080p MV，强调连贯性与工程导出。</li>
    <li>难点：人物一致、词级对齐、分镜语言——非单镜好看。</li>
    <li>学员路径：PanSnap 小闭环 → ohmymv 高难多模态，方法论一致。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>有成品歌可试 ohmymv.com/zh，先走审片门禁。</li>
    <li>做 AI 产品者：画出自己的「音轨→多轨工程」数据流清单。</li>
    <li>学 AI 编程：对照 PanSnap/ohmymv 看哪一步只是 API、哪一步是产品化。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「调用视频模型」转为「为某一类创作者把最后一公里交付（可发布+可再编辑）设计进产品」。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');