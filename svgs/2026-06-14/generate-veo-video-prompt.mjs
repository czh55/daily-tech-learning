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
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:12px;padding:12px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:18px;color:#94a3b8}
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
<h1>Google Veo 3.1 视频提示词完全指南：八层框架</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Veo 3.1</span>
  <span class="tag tag-green">提示词工程</span>
  <span class="tag tag-orange">AI 视频</span>
  <span class="tag tag-purple">同步音频</span>
</div>
<p class="subtitle">本文解决的核心问题是：同样使用 Veo 3.1，如何用统一的八层提示词框架稳定产出电影级画面（含同步音频），而非模糊抖动的废片。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">八层框架递进关系</h3>
  <div class="diagram">
    <div class="node">①素材声明</div><span class="arrow-sym">→</span>
    <div class="node">②镜头标签</div><span class="arrow-sym">→</span>
    <div class="node-green">③景别主体<br/>④动作</div><span class="arrow-sym">→</span>
    <div class="node-orange">⑤运镜<br/>⑥光影</div><span class="arrow-sym">→</span>
    <div class="node">⑦音频三层</div><span class="arrow-sym">→</span>
    <div class="node-green">⑧全局收尾</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「提示词越长越好」—— 单镜头最佳 100-150 词，超过 200 词后半段易被忽略；低于 50 词模型会随机脑补。核心是写得准，不是写得长。</p>
</div>

<div class="card">
  <h3>【模板 A】Veo 3.1 是什么：能力与边界</h3>
  <p><strong>定性：</strong>Google DeepMind 文本转视频模型，2026 年写实度与场景一致性领先，原生同步生成对话口型+音效+环境音。</p>
  <p><strong>输出规格：</strong>4/6/8 秒片段，720p/1080p，16:9 或 9:16；支持 T2V、素材转视频、首尾帧转场。</p>
  <p><strong>访问路径：</strong>Vertex AI（企业 API）/ Google Flow（专业编辑）/ Gemini App（基础）/ AI Studio（原型）。</p>
  <p><strong>边界说明：</strong>擅长写实与一致性；超长叙事需拆多片段；复杂多动作单提示词易冲突。</p>
  <div class="relation"><strong>与可灵/Seedance 关系：</strong>各家模型能力趋同，但 Veo 3.1 在写实渲染、时间戳多镜头、同步音频上有差异化优势。</div>
</div>

<div class="card">
  <h3>【模板 B】八层统一框架操作手册</h3>
  <p><strong>核心思路：</strong>把 Google 五要素、十要素、音频三层、多镜头工作流合并为一个结构，单镜头只写「镜头 1」，多镜头扩展到 2-4 个时间戳段。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. <strong>素材声明</strong>（有图时）：明确每张参考图角色（角色/场景/首尾帧）</p>
  <p>2. <strong>镜头标签</strong>：「镜头 1：」或 [00:00-00:02] 时间戳（Veo 独有能力，最多 4 连续镜头）</p>
  <p>3. <strong>景别+主体</strong>：2-3 个具体静态特征，禁 beautiful/nice 等模糊词</p>
  <p>4. <strong>动作</strong>：身体部位级描述+幅度速度；一提示词一主动作</p>
  <p>5. <strong>运镜</strong>：每镜头仅一个运镜，格式「缓慢推进（dolly in）」；可用「推进 5%」精确控制</p>
  <p>6. <strong>光影</strong>：光源方向+色温（如 5600K）+氛围元素；用伦勃朗光等术语</p>
  <p>7. <strong>音频三层</strong>：角色 says: "台词" / SFX: 音效 / Ambient: 环境音</p>
  <p>8. <strong>全局收尾</strong>（写一次）：风格锚点 + 负面提示词（描述性名词，不用「不要」） + 质量后缀（1080p 16:9 8秒）</p>
  <div class="highlight"><strong>落地：</strong>层顺序不可换——Veo 对前部权重更高，素材声明和主体必须靠前。</div>
</div>

<div class="card">
  <h3>【模板 E】提示词长度与权重对比</h3>
  <table>
    <tr><th>维度</th><th>单镜头 (100-150词)</th><th>多镜头 (200-300词)</th><th>结论</th></tr>
    <tr><td>信息密度</td><td>3-6 句精准描述</td><td>每时间段独立迷你提示词</td><td>准 &gt; 长</td></tr>
    <tr><td>失败模式</td><td>&lt;50词随机脑补</td><td>&gt;200词后半忽略</td><td>控制区间</td></tr>
    <tr><td>权重分布</td><td>前部景别主体最关键</td><td>镜头间需变化节奏</td><td>重要内容写前面</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 C】避坑清单</h3>
  <p><strong>坑：对话不用 says: 格式</strong> — 触发画面内字幕。<strong>解法：</strong>侦探 says: "你的故事有漏洞。"<strong>严重程度：小心。</strong></p>
  <p><strong>坑：一提示词多运镜</strong> — 模型在运动模式间摇摆，画面不稳定。<strong>解法：</strong>每镜头只写一个运镜。<strong>严重程度：致命。</strong></p>
  <p><strong>坑：负面提示词写「不要建筑」</strong> — 否定指令反而强化该元素。<strong>解法：</strong>用「城市背景，人造建筑，暗沉氛围」描述性排除。<strong>严重程度：小心。</strong></p>
  <p><strong>坑：抽象情绪词</strong> — 「悲伤的男人」无效。<strong>解法：</strong>外化为动作：低下头，肩膀微抖，眼眶泛红。<strong>严重程度：小心。</strong></p>
  <div class="pitfall"><strong>8 秒对话规则：</strong>单个 8 秒片段对话控制 1-2 句；不想要某种声音要显式写「无音乐」「没有观众声」。</div>
</div>

<div class="card">
  <h3>【模板 D】工作流与平台选型</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>快速单镜头迭代</td><td>八层框架省略第①层</td><td>纯文本 T2V 直接从镜头标签开始</td><td>照搬十要素全写</td><td>信息冗余冲突</td></tr>
    <tr><td>品牌多镜头短片</td><td>时间戳 [00:00-00:02] 标签</td><td>单次生成最多 4 连续镜头</td><td>单提示词塞多场景</td><td>动作冲突</td></tr>
    <tr><td>精确 A→B 转场</td><td>首尾帧模式+第①层声明</td><td>提示词只描述「从 A 到 B 怎么变」</td><td>纯文本硬描述</td><td>一致性差</td></tr>
    <tr><td>不会写提示词</td><td>元提示词让 Claude/GPT 生成</td><td>AI 按八层结构输出</td><td>随机试错</td><td>浪费生成额度</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 F】音频三层心法</h3>
  <p><strong>原则：</strong>Veo 音频是与画面同步生成的，不是后期配音——这是被低估的核心优势。</p>
  <p><strong>为什么重要：</strong>多数教程只讲画面，忽略音频三层导致「哑片感」或意外字幕。</p>
  <p><strong>怎么落地：</strong>每镜头独立写对话层（says:）+ 音效层（SFX:）+ 环境音层（Ambient:）；发音难念的词用拼音标注（foh-fur）。</p>
  <p><strong>适用边界：</strong>极短 4 秒片段音频信息宜精简；复杂交响乐场景需显式排除不需要的层次。</p>
  <div class="quote">Veo 专属技巧：摄像机定位后加 (thats where the camera is) 可显著提升机位理解准确度。</div>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>Veo 3.1 差距在提示词不在模型——八层框架统一单镜头与多镜头场景</li>
    <li>最佳词数：单镜头 100-150，多镜头 200-300；前部权重最高</li>
    <li>画面：具体名词材质 &gt; 模糊形容词；动作外化情绪；一镜头一运镜一主动作</li>
    <li>音频：says:/SFX:/Ambient: 三层同步设计，对话用冒号防字幕</li>
    <li>负面提示词用描述性名词排除，禁用「不要 XXX」</li>
  </ol>
  <p style="margin-top:20px;opacity:0.95"><strong>行动清单：</strong></p>
  <ol>
    <li>下载八层框架模板，用下一个视频任务填空式写作</li>
    <li>把现有废片提示词对照检查：词数、运镜数量、情绪是否外化</li>
    <li>用元提示词让 Claude 将你的创意转为八层结构 Veo 提示词</li>
    <li>测试时间戳多镜头 [00:00-00:02] 格式做 8 秒品牌短片</li>
    <li>在第八层固定你的风格锚点（如 35mm 胶片 + 伦勃朗光）形成品牌一致性</li>
  </ol>
  <p style="margin-top:20px;opacity:0.95"><strong>关键认知转变：</strong>视频提示词不是「描述梦想画面」，而是「给 AI 导演写拍摄表」—— 层序即优先级，精准约束比华丽辞藻更重要。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
