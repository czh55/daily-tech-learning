import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'veo-video-prompt-guide.svg');

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
.diagram{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:14px;padding:14px 20px;text-align:center;min-width:110px;font-weight:700;font-size:14px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:20px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#f1f5f9;padding:10px 14px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Google Veo 3.1 视频提示词完全指南：八层框架 + 10 模板 + 元提示词</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Veo 3.1</span>
  <span class="tag tag-purple">提示词工程</span>
  <span class="tag tag-green">AI 视频</span>
  <span class="tag tag-orange">八层框架</span>
</div>
<p class="subtitle">本文解决的核心问题是：同样用 Veo 3.1，为何有人出电影级画面、有人得到模糊废片——差距在提示词结构，本文提供统一八层框架覆盖单镜头到时间戳多镜头。</p>

<div class="map">
  <h3 style="text-align:center;color:#1e40af;margin-bottom:20px;font-size:20px">八层框架递进关系</h3>
  <div class="diagram">
    <div class="node">①素材声明</div>
    <span class="arrow-sym">→</span>
    <div class="node">②镜头标签</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">③景别主体<br/>④动作<br/>⑤运镜</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">⑥光影<br/>⑦音频三层</div>
    <span class="arrow-sym">→</span>
    <div class="node">⑧全局收尾</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p>提示词核心不是写得<strong>长</strong>，而是写得<strong>准</strong>。单镜头最佳 100-150 词；低于 50 词模型随机脑补，超过 200 词后半段被忽略。前部权重最高——顺序不可换。</p>
</div>

<div class="card">
  <h3>【A】八层统一框架：学一次终身复用</h3>
  <p><strong>是什么：</strong>整合 Google 五要素、Gemini 十要素、音频三层、三种高级工作流为一个结构；单镜头只写「镜头 1」，多镜头扩展到 2-4 个时间戳段。</p>
  <p><strong>关键理解：</strong>八层顺序 = 优先级。素材声明锁输入源 → 景别主体给视觉锚点 → 动作提供动态核心 → 运镜放主体后（否则主体渲染质量下降）。</p>
  <table>
    <tr><th>层级</th><th>名称</th><th>单镜头</th><th>多镜头</th></tr>
    <tr><td>1</td><td>素材声明</td><td>有素材时写</td><td>首尾帧/参考图角色分配</td></tr>
    <tr><td>2</td><td>镜头标签</td><td>镜头 1：</td><td>[00:00-00:02] 最多 4 段</td></tr>
    <tr><td>3-6</td><td>景别/动作/运镜/光影</td><td>每镜头写</td><td>每段独立迷你提示词</td></tr>
    <tr><td>7</td><td>音频三层</td><td>says:/SFX:/Ambient:</td><td>每镜头至少一层</td></tr>
    <tr><td>8</td><td>全局收尾</td><td>风格+负面+质量后缀</td><td>写一次</td></tr>
  </table>
  <div class="highlight"><strong>落地：</strong>主体用 2-3 个具体稳定特征——「穿炭灰西装、下颚分明」✓；「好看的男人」✗</div>
  <p><strong>边界：</strong>一个提示词只描述一个主要动作；多动作拆成时间戳多镜头。</p>
</div>

<div class="card">
  <h3>【B】音频三层 + 运镜铁律（Veo 差异化优势）</h3>
  <p><strong>方法标签：</strong>原生同步音频 · 对话口型 · 环境音设计</p>
  <p><strong>音频三层格式：</strong></p>
  <p>• 对话：角色 says: "台词"（冒号防字幕；不用冒号会生成画面内字幕）</p>
  <p>• 音效：SFX: 拳套击中沙袋闷响</p>
  <p>• 环境：Ambient: 空调低频嗡鸣</p>
  <p><strong>运镜铁律：</strong>每镜头只写一个运镜动作；运镜与主体动作分开描述。不确定时写「固定（static）」。</p>
  <div class="pitfall"><strong>避坑：</strong>同时写推拉+弧形环绕 → Veo 在运动模式间摇摆，结果不稳定。</div>
  <div class="quote">Veo 专属：「缓慢推进 5%」百分比控制幅度；摄像机位置后加 (thats where the camera is) 提升理解准确度。</div>
  <p><strong>光影 ROI 最高：</strong>「主光从左侧，暖色 5600K，光束中灰尘颗粒」&gt; 「美丽的电影光线」</p>
</div>

<div class="card">
  <h3>【D】模型选型：什么时候用 Veo</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>写实人物+品牌叙事</td><td>Veo 3.1</td><td>写实度最强、时间戳多镜头</td><td>Runway</td><td>Runway 适合帧级精修非首生成</td></tr>
    <tr><td>中文口型同步</td><td>即梦 Seedance 2.0</td><td>原生中文对话精度</td><td>Veo</td><td>Veo 对话以英语为主</td></tr>
    <tr><td>流体/碰撞物理</td><td>Sora 2</td><td>物理模拟优势</td><td>Veo</td><td>非 Veo 强项</td></tr>
    <tr><td>有 12 个参考素材组合</td><td>即梦多模态引用</td><td>@标签引用最多 12 文件</td><td>Veo 纯文本</td><td>素材转视频模式不同</td></tr>
    <tr><td>精修已有片段</td><td>Runway Gen-4.5</td><td>运动笔刷、导演模式</td><td>Veo 首生成</td><td>分工不同</td></tr>
  </table>
  <div class="relation"><strong>行业趋势：</strong>多模型协作——Veo 出写实叙事、即梦出氛围光影、Sora 出物理、Runway 精修。</div>
</div>

<div class="card">
  <h3>【E】Veo vs 即梦 vs Sora vs Runway 对比</h3>
  <table>
    <tr><th>维度</th><th>Veo 3.1</th><th>即梦 Seedance</th><th>Sora 2</th><th>Runway</th></tr>
    <tr><td>核心优势</td><td>写实度、场景一致性</td><td>氛围光影、中文理解</td><td>物理/流体模拟</td><td>精细控制、运动笔刷</td></tr>
    <tr><td>音频</td><td>原生同步三层</td><td>联合生成+口型</td><td>需后期</td><td>需后期</td></tr>
    <tr><td>独有能力</td><td>时间戳多镜头、首尾帧</td><td>多模态 @引用</td><td>物理世界模拟</td><td>运动笔刷</td></tr>
    <tr><td>词数建议</td><td>100-150 / 200-300</td><td>分镜脚本式</td><td>自然语言</td><td>参数+笔刷</td></tr>
  </table>
</div>

<div class="card">
  <h3>【B】三种高级工作流操作路径</h3>
  <p><strong>1. 首尾帧转场：</strong>Gemini 生成起止帧 → Veo Frames to Video 只描述「从 A 到 B 怎么变」，不重复帧内已有元素。</p>
  <p><strong>2. 素材转视频：</strong>上传角色/场景/物体参考图 → 每镜头只写动作和对话，一致性由参考图保证。</p>
  <p><strong>3. 时间戳提示词：</strong>[00:00-00:02] 格式，单次生成最多 4 个连续镜头，景别要有变化创造节奏。</p>
  <div class="highlight"><strong>落地：</strong>用本文 10 个模板（产品广告/美食/短剧/品牌等）作起点，附中英文版本可直接粘贴。</div>
</div>

<div class="card">
  <h3>【C】负面提示词与常见踩坑</h3>
  <p><strong>坑 1：用否定指令写负面提示</strong></p>
  <p>原因：「不要建筑」中的「建筑」反而强化模型关注。</p>
  <p>解法：用描述性名词——「城市背景，人造建筑，暗沉氛围」。</p>
  <p><strong>坑 2：对话不用 says: 格式</strong></p>
  <p>现象：画面内出现意外字幕。</p>
  <p>解法：角色 says: "台词"；顽固时末尾加 no subtitles 重复三次。</p>
  <p><strong>坑 3：抽象情绪词</strong></p>
  <p>解法：情绪外化——悲伤→「低头，肩膀微抖，眼眶泛红」；喜悦→「嘴角上扬，脚步轻快」。</p>
  <p>严重程度：前两项<strong>小心</strong>影响成片可用性；抽象词导致「模特脸」<strong>可忽略</strong>但质量下降。</p>
</div>

<div class="card">
  <h3>【F】元提示词：让 AI 帮你写 Veo 提示词</h3>
  <p><strong>原则：</strong>把元提示词粘贴到 Claude/GPT 对话开头 → 用一句话描述画面 → AI 输出 100-150 词（基础版）或 200-300 词（专业版时间戳）英文提示词。</p>
  <p><strong>为什么重要：</strong>降低学习门槛，保证八层结构一致性。</p>
  <p><strong>怎么落地：</strong>新手用基础版单镜头元提示词；有经验创作者用专业版（支持 2-4 镜头分镜、首尾帧模式）。</p>
  <p><strong>边界：</strong>元提示词只做提示词生成，不做剪辑建议；违法/暴力内容应拒绝。</p>
  <div class="relation"><strong>学习路径 ROI 排序：</strong>①光影描述 ②情绪外化 ③运镜词汇 ④音频三层 ⑤时间戳 ⑥首尾帧工作流</div>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Veo 3.1 写实度最强 + 原生同步音频，但提示词必须结构化</li>
    <li>八层框架统一单镜头与多镜头，顺序即优先级不可打乱</li>
    <li>100-150 词单镜头 / 200-300 词多镜头是最佳区间</li>
    <li>每镜一运镜、运镜与动作分离、光影描述 ROI 最高</li>
    <li>选模型看场景——中文口型选即梦，物理选 Sora，写实叙事选 Veo</li>
  </ol>
  <p style="margin-top:20px;opacity:0.95"><strong>行动清单：</strong></p>
  <ol>
    <li>用八层框架重写你最近一条废片提示词，把词数控制在 100-150</li>
    <li>下次写对话强制用 角色 says: "台词" 格式</li>
    <li>从 10 个模板中选一个最接近你需求的场景，改主体描述后直出</li>
    <li>把基础版元提示词存到 Claude/GPT，用自然语言快速迭代</li>
    <li>建立个人「主体描述模板」维持跨镜头角色一致性</li>
  </ol>
  <p style="margin-top:20px;opacity:0.95"><strong>关键认知转变：</strong>从「堆形容词碰运气」→「按拍摄表结构写提示词」——你不是在聊天，是在给写实度最强的 AI 导演下拍摄指令。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
