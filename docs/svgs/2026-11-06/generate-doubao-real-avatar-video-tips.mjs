import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'doubao-real-avatar-video-tips.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#fff1f2,#fce7f3);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#9f1239,#be185d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-rose{background:#ffe4e6;color:#9f1239}.tag-pink{background:#fce7f3;color:#831843}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #e11d48}
.card h3{font-size:22px;font-weight:700;color:#9f1239;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ffe4e6,#fecdd3);border:2px solid #fb7185;border-radius:14px;padding:10px 14px;text-align:center;min-width:76px;font-weight:700;font-size:11px;color:#9f1239}
.node-em{background:linear-gradient(135deg,#fce7f3,#f9a8d4);border-color:#ec4899;color:#831843}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#9f1239,#be185d);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.85;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#ffe4e6;padding:10px 12px;text-align:left;font-weight:700;color:#9f1239;border-bottom:2px solid #fda4af}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#f0fdf4;border:2px solid #16a34a;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#14532d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#15803d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#166534}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>豆包真人分身：先建模再成片，与换脸不是一回事</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-rose">豆包 · 视频生成</span>
  <span class="tag tag-pink">生物特征 · 声纹</span>
  <span class="tag tag-slate">手机端流程</span>
</div>
<p class="subtitle">本文解决的核心问题是：怎样用豆包在<strong>不上镜实拍成片</strong>的前提下，先录制短视频完成活体与面部/声音建模，再通过「使用分身出镜」把专属模型接到分镜提示词里——以及为何这与传统「换脸」在数据流与穿帮风险上完全不同。</p>

<div class="map">
  <h3 style="font-size:20px;color:#9f1239;margin-bottom:12px;text-align:center">两条路线：换脸 vs 真人分身</h3>
  <div class="diagram">
    <div class="node">AI 换脸<br><span style="font-size:10px;font-weight:400">先有视频再贴脸</span></div>
    <span class="arrow-sym">✕</span>
    <div class="node node-em">身体口型情绪<br><span style="font-size:10px;font-weight:400">易穿帮</span></div>
    <span class="arrow-sym" style="min-width:24px"></span>
    <div class="node">真人分身<br><span style="font-size:10px;font-weight:400">先建特征库</span></div>
    <span class="arrow-sym">→</span>
    <div class="node node-em">再按提示词生成<br><span style="font-size:10px;font-weight:400">驱动台词与动作</span></div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">平台约束：仅本人创建、活体认证；禁未经授权人脸与敏感写实素材</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：「分身就是高级换脸」。正确理解是：换脸替换的是<strong>已有成片里别人的脸</strong>；分身是用你的生物特征<strong>重建可驱动形象</strong>再生成新视频，口型与表演仍由模型按提示约束合成。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】真人分身建的是什么</h3>
  <p><strong>在讲什么问题：</strong>出镜效果不像「贴一张脸」，而像「有一个懂你的数字演员」——前提是素材把脸和声的<strong>可学习结构</strong>交代清楚。</p>
  <p><strong>关键理解：</strong>系统抓取面部关键点、骨骼比例、微表情与肌肉动态，以及音色韵律；由 Seedance 等模型建专属分身，再在生成阶段驱动台词与表情。</p>
  <p><strong>和其他概念关系：</strong>与口播数字人、全身动捕不同，这里是消费级短视频录制 + 云端建模。</p>
  <p><strong>怎么落地用：</strong>按 App 指引做转头、朗读数字、微笑；环境安静、光均匀，减少 AI「猜轮廓」的概率。</p>
  <p><strong>边界说明：</strong>仍是生成内容，可能出现不像或僵硬的边角案例；平台合规与授权范围要单独遵守。</p>
  <p><strong>原文依据：</strong>「真人分身则是先有你，再生成视频：AI先建立你的虚拟形象特征库，再根据这个特征库和你的提示词描述去生成视频。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】豆包手机端：从创建到出镜</h3>
  <p><strong>核心思路：</strong>技能入口进「视频生成」→ 录制建模 →（可选）补自拍统一形象 → 新对话点亮「使用分身出镜」写分镜提示词。</p>
  <p><strong>操作步骤：</strong>① 更新 App ② 新对话 → 技能 → AI创作 → 视频生成 → 创建分身 ③ 选美颜/自然 → 朗读屏幕数字 → 立即创建 ④ 分身页可「补充自拍」（正脸、左右四分之三、侧面，环境一致）⑤ 新对话再次进视频生成，打开「使用分身出镜」⑥ 按时间轴写分镜与音效（文中有模板示例）⑦ 不满意走分身重建。</p>
  <p><strong>选型条件：</strong>需要本人反复出镜、但无法每次实拍时优先分身；纯素材混剪不需建模成本则不必开。</p>
  <p><strong>避坑：</strong>发布前作者提醒授权设「仅自己」、过滤敏感台词与谐音隐喻、打 AI 生成标识——否则账号风险。</p>
  <p><strong>对比相邻方法：</strong>实拍 + 剪辑耗时但物理真实；换脸快但动作语义不跟脸走。</p>
  <p><strong>原文引用：</strong>「豆包真人分身目前只在手机端开放……只能本人创建，必须通过活体认证。」</p>
</div>

<div class="card">
  <h3>【跨概念对比表】换脸 · 真人分身 · 纯文生视频</h3>
  <table>
    <tr><th>维度</th><th>AI 换脸</th><th>真人分身</th><th>纯提示词生成（无分身）</th></tr>
    <tr><td>输入</td><td>已有视频 + 目标脸</td><td>本人短视频 + 可选自拍</td><td>仅文本/参考图</td></tr>
    <tr><td>身体与表演</td><td>保留原片演员动作</td><td>模型按提示驱动「你的形象」</td><td>人物未必像你</td></tr>
    <tr><td>穿帮风险</td><td>大动作、侧脸、遮挡</td><td>素材差则「一眼假」</td><td>风格化或不像真人</td></tr>
    <tr><td>一句话结论</td><td>改「脸」不改「戏」</td><td>先买「长相+声音」再写「戏」</td><td>省事但难稳态像你</td></tr>
  </table>
</div>

<div class="card">
  <h3>【决策/选型表】拍摄与后期策略</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>古装/国风</td><td>清透底妆、眉细长、盘发露耳</td><td>作者明确古装妆发要点</td><td>厚妆磨皮到无纹理</td><td>「AI才认得出你的表情」</td></tr>
    <tr><td>职场现代</td><td>眉峰清晰、唇色偏深显干练</td><td>贴合角色气质</td><td>夸张油光与顶光死角</td><td>眼窝黑洞、五官信息丢光</td></tr>
    <tr><td>声音样本</td><td>安静小房间、均匀气息、语义停顿</td><td>学「你怎么说话」</td><td>喊麦式大声</td><td>韵律失真像念稿</td></tr>
    <tr><td>补自拍阶段</td><td>服饰发型与色调一致</td><td>跨素材一致性</td><td>一张自然一张重度美颜</td><td>跨图风格打架</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】从录制到发布</h3>
  <p><strong>坑名：</strong>光线杂乱 + 背景杂物。<strong>原因：</strong>特征库建立阶段信息量被噪声淹没。<strong>解法：</strong>柔光窗侧光、上午九到十一点或下午三到五点；微笑不露齿、平视镜头。<strong>严重程度：</strong>致命（成片假）。</p>
  <p><strong>坑名：</strong>配音环境嘈杂。<strong>原因：</strong>学不到稳定声纹。<strong>解法：</strong>密闭房间、收腹匀速发声。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>跳过合规自查直接发。<strong>原因：</strong>平台审核收紧。<strong>解法：</strong>授权仅自己、敏感词与标识。<strong>严重程度：</strong>致命（作者直说别把号搭进去）。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】给 AI 的是「信息完整的脸」</h3>
  <p><strong>原则：</strong>宁可保留皮肤纹理与真实光影，也不要追求过度修图的美颜假象。</p>
  <p><strong>为什么重要：</strong>分身要学的是稳定几何与表情动态，磨没纹理会让模型在生成阶段「猜」长相。</p>
  <p><strong>怎么落地：</strong>按文中光线与妆容分层检查；补自拍覆盖多角度但保持环境一致。</p>
  <p><strong>适用边界：</strong>强剧情特效或极端运动镜头，仍需评估模型能力上限，非素材好就能兜底。</p>
  <p><strong>原文支撑：</strong>「记住你要给AI的是一张信息完整的脸，而不是一张修得很好看的脸，这样生成的视频才能真实。」</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：隐私与合规审计方</p>
  <p class="rebuttal-text">生物特征与声纹一旦入云就超出「好玩视频」范畴：模型方如何留存、谁可二次调用、纠纷举证链是否透明——技术再真也绕不开授权与删除权落地。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>真人分身是「先建模再生成」，换脸是「先成片再贴脸」，失败模式完全不同。</li>
    <li>效果上限多半在素材：光、妆发、声学环境比「点一下魔法按钮」关键。</li>
    <li>手机端闭环：技能 → 创建分身 →（补自拍）→ 开「使用分身出镜」写分镜提示词。</li>
    <li>重建是分身质量的退路；发布链路必须过授权、敏感词与 AI 标识。</li>
    <li>消费级方案仍有平台约束与伦理合规边界，不能当免审通行证。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>按文中时段与窗侧柔光试录一段，检查眼窝与背景噪声。</li>
    <li>录数字台词时刻意做语义停顿与关键词重音，供声纹学习。</li>
    <li>补三张角度自拍前固定穿搭与场景白平衡。</li>
    <li>用文末分镜模板改一版自己的短剧情，先小声念通顺再提交生成。</li>
    <li>发文前核对授权范围、台词敏感点并打平台要求的 AI 标识。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>要想「像我」，关键不是堆美颜，而是让模型拿到<strong>连贯、可比对的生物特征样本</strong>；要想「敢发」，先把合规当成和后处理一样硬的一环。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
