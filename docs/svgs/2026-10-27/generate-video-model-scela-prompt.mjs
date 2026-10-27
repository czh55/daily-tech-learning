import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'video-model-scela-prompt.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f5f3ff,#ede9fe);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#6d28d9,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-violet{background:#ede9fe;color:#6d28d9}.tag-purple{background:#f3e8ff;color:#7e22ce}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #8b5cf6}
.card h3{font-size:22px;font-weight:700;color:#6d28d9;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#f5f3ff;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#5b21b6;border-left:4px solid #a78bfa}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ede9fe,#ddd6fe);border:2px solid #c4b5fd;border-radius:14px;padding:12px 14px;text-align:center;min-width:72px;font-weight:700;font-size:12px;color:#5b21b6}
.arrow-sym{font-size:16px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#6d28d9,#7c3aed);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f5f3ff;padding:10px 14px;text-align:left;font-weight:700;color:#6d28d9;border-bottom:2px solid #ddd6fe}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>视频模型结构化提示词：SCELA+ 与导演式指令</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-violet">AI 视频生成</span>
  <span class="tag tag-purple">Seedance / 豆包</span>
  <span class="tag tag-slate">提示词工程</span>
</div>
<p class="subtitle">本文解决的核心问题是：为什么「一个女孩在雨里哭」类一句话提示总显塑料感——如何用八要素与 SCELA+ 框架把选景、布光、机位、表演和氛围写成可执行的导演指令包，并掌握运镜参数化、光照五维、情绪外化与 30–200 词精简区间。</p>

<div class="map">
  <h3 style="font-size:20px;color:#6d28d9;margin-bottom:12px;text-align:center">SCELA+ 编写顺序（先舞台后表演）</h3>
  <div class="diagram">
    <div class="node">S<br>场景</div><span class="arrow-sym">→</span>
    <div class="node">C<br>角色</div><span class="arrow-sym">→</span>
    <div class="node">E<br>表情动作</div><span class="arrow-sym">→</span>
    <div class="node">L<br>镜头</div><span class="arrow-sym">→</span>
    <div class="node">A<br>氛围</div><span class="arrow-sym">→</span>
    <div class="node">+<br>光照/素材</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：画质不够或人物不像才像塑料。多数情况是提示词只交代「拍谁」没交代「怎么拍」，模型只能猜镜头与光影。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】导演指令包 vs 一句话描写</h3>
  <p><strong>关键理解：</strong>专业提示词用工业标准复刻影视流程——主体、场景、动作、镜头、风格、光照、情绪、氛围八要素缺一不可。</p>
  <p><strong>典型对比：</strong>「古风女子桃花树下」十次十样；补全运镜、黄金时刻光、留白构图、画幅与质感则可控。</p>
  <p><strong>边界说明：</strong>要素齐全仍受模型能力限制；不同平台（豆包 Seedance、即梦、可灵）各有偏好。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】SCELA+ 模块写法</h3>
  <p><strong>S 场景：</strong>地点+时代+天气+核心道具+空间层次（3–5 个具象元素）。</p>
  <p><strong>C 角色：</strong>特征锚点（核心+辅助特征+服装材质）。</p>
  <p><strong>E 表情动作：</strong>动作按起承转合；表情拆眼神、嘴角、微表情。</p>
  <p><strong>L 镜头：</strong>景别+运动+角度+焦点（如低角度仰拍、缓慢推进）。</p>
  <p><strong>A 氛围：</strong>通感调动多感官；<strong>+</strong> 补光照、特效、@ 参考图。</p>
  <div class="highlight">示例骨架：废弃游乐场黄昏生锈木马 → 银发少女泪痣牛仔外套 → 咬唇强忍泪缓步离开 → 远景俯拍推近至中景 → 铁锈味与设施嘎吱声 → 夕阳逆光 @图1。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】运镜与光照参数化</h3>
  <p><strong>运镜：</strong>写清方式（推/拉/摇/移/跟/环绕）+ 速度幅度 + 起止点；把「慢慢推」改成「匀速推近，3 秒完成」。</p>
  <p><strong>光照五维：</strong>主光位置（伦勃朗三角光等）→ 硬/柔 → 主补轮廓三层 → 色温情绪 → 介质与表面响应（丁达尔、灰尘、次表面散射）。</p>
  <p><strong>避坑：</strong>只写「移动一下镜头」会导致不动或乱晃。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】情绪外化与否定指令</h3>
  <p><strong>情绪：</strong>模型不认抽象「悲伤」，要写「眼眶泛红、泪水打转、嘴角颤抖、喉结滚动」。</p>
  <p><strong>Seedance 特性：</strong>尽量不写「不要」——改肯定表述：「手指自然弯曲五指分明」「仅单人出镜」。</p>
  <p><strong>数值化：</strong>15 秒切片 [0~3秒][4~6秒]；运动强度 7/10；复杂物理可写重力系数、布料柔韧度。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】初级 vs 专业提示词</h3>
  <table>
    <tr><th>维度</th><th>初级</th><th>专业</th><th>结论</th></tr>
    <tr><td>信息密度</td><td>主体+模糊场景</td><td>八要素+风格质感</td><td>减少模型猜测</td></tr>
    <tr><td>镜头</td><td>无</td><td>景别运动角度焦点</td><td>建立观看结构</td></tr>
    <tr><td>长度（Seedance）</td><td>过短或堆砌</td><td>30–200 词</td><td>过长注意力稀释</td></tr>
    <tr><td>面容描写</td><td>大段形容词</td><td>@图1 参考面容</td><td>一致性+省字数</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】技巧选用</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>15 秒叙事</td><td>多镜头起承转合</td><td>单镜难讲故事</td><td>一镜到底</td><td>节奏平</td></tr>
    <tr><td>冗余修饰过多</td><td>保留动作骨架</td><td>冗余&gt;38% 动作准确率降</td><td>面面俱到长文</td><td>超 200 词质量下滑</td></tr>
    <tr><td>需固定脸</td><td>@ 参考图</td><td>压缩提示词</td><td>重复面容形容词</td><td>占词数</td></tr>
    <tr><td>不会写专业词</td><td>video-prompt-director Skill</td><td>交互补参数</td><td>纯靠灵感</td><td>漏要素</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】视频提示词常见坑</h3>
  <p><strong>坑名：</strong>提示词里写「不要闪烁/不要多指」。</p>
  <p><strong>解法：</strong>Seedance 对否定指令弱，用正向稳定、单人、五指分明描述。</p>
  <p><strong>坑名：</strong>华丽长段描写面容与园林细节。</p>
  <p><strong>解法：</strong>精简为动作线+时间轴+@ 参考，实测可保持电影质感。</p>
  <p><strong>严重程度：</strong>否定指令为小心；严重超长为致命（响应率下降）。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「只要模型升级，提示词工程会被一键生成取代」</p>
  <p class="rebuttal-text">结构化提示是在用人类导演决策补齐模型歧义，能力越强越需要精确约束镜头与光影，否则只是更快地产出平均画面。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>塑料感多源于提示词缺八要素，而非单纯分辨率。</li>
    <li>SCELA+ 按剧组开工顺序组织信息，模型更易执行。</li>
    <li>运镜、光照、情绪外化、时间轴数值化是可操作杠杆。</li>
    <li>Seedance 宜 30–200 词，精简保留骨架，面容用 @ 图。</li>
    <li>Skill 可把流程产品化，降低非专业用户门槛。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>重写一条旧提示词：按 S→C→E→L→A→+ 填全再生成对比。</li>
    <li>把运镜改成「方式+速度+起止点」一句可执行描述。</li>
    <li>情绪句全部换成可见微表情与身体信号。</li>
    <li>删除所有「不要」，改为正向约束；检查词数是否落在 30–200。</li>
    <li>15 秒片段拆 3–5 段时间轴，试多镜头叙事。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「描述画面」转为「下发导演指令包」——结构化提示词本身就是 AI 视频创作的核心技术能力。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
