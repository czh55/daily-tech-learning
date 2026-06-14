import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'kling-video-prompt-guide.svg');

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
<h1>可灵 3.0 视频提示词完全指南：八层框架 + 10 个模板 + 元提示词</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">可灵 3.0</span>
  <span class="tag tag-green">提示词工程</span>
  <span class="tag tag-orange">AI 视频</span>
  <span class="tag tag-purple">原生音频</span>
</div>
<p class="subtitle">本文解决的核心问题是：同样使用可灵 3.0，如何用统一的八层提示词框架稳定产出电影级画面（含原生多镜头叙事和音频对话），而非模糊抖动的废片。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:20px;text-align:center">八层框架递进关系</h3>
  <div class="diagram">
    <div class="node">①元素参考</div><span class="arrow-sym">→</span>
    <div class="node">②镜头标签</div><span class="arrow-sym">→</span>
    <div class="node-green">③景别主体<br/>④动作</div><span class="arrow-sym">→</span>
    <div class="node-orange">⑤运镜<br/>⑥光影</div><span class="arrow-sym">→</span>
    <div class="node">⑦音频</div><span class="arrow-sym">→</span>
    <div class="node-green">⑧全局收尾</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「提示词越长越好」—— 可灵上限 2500 字符但后半段遵循度递减；单镜头最佳 40-100 字，多镜头 80-200 字。核心是写得准，不是写得长。永远不要用「快速/fast」—— 几乎必然导致运动模糊。</p>
</div>

<div class="card">
  <h3>【模板 A】可灵 3.0 是什么：能力与边界</h3>
  <p><strong>在讲什么问题：</strong>可灵 3.0 相比其他 AI 视频模型的差异化能力？</p>
  <p><strong>核心机制：</strong>快手自研视频大模型，3.0 支持原生多镜头叙事（最多 6 镜头一次生成）、原生音频对话（中英日韩西+方言）、六轴摄像机控制、独立负面提示词框。</p>
  <p><strong>关键理解：</strong>输出 3-15 秒/片段，原生 4K，五种宽高比；三模型矩阵：VIDEO 3.0（通用）、3.0 Omni（元素参考增强）、O1（首尾帧专精）。</p>
  <p><strong>怎么落地：</strong>访问 kling.ai 网页/移动端、官方 API 或 fal.ai 第三方平台。</p>
  <p><strong>边界说明：</strong>高速大幅度动作易肢体变形；复杂多动作单提示词易冲突；积分消耗与输出质量直接挂钩。</p>
  <div class="relation"><strong>与 Veo 3.1 关系：</strong>八层框架结构相同；可灵用「镜头 1/2/3」标签（非时间戳），最佳字数更短（40-100 vs 100-150），支持独立负面提示词框和 P1-P4 多角色对话语法。</div>
</div>

<div class="card">
  <h3>【模板 B】八层统一框架操作手册</h3>
  <p><strong>核心思路：</strong>合并可灵官方五要素、社区五层叙事、3.0 多镜头叙事为八层结构；单镜头只写「镜头 1」，多镜头扩展到 2-6 个。</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. <strong>元素参考声明</strong>（有图时）：2-4 张参考图，明确角色/场景/物品锁定，可绑定音色</p>
  <p>2. <strong>镜头标签</strong>：「镜头 1：」「镜头 2：」分段（不用时间码，最多 6 镜头）</p>
  <p>3. <strong>景别+主体</strong>：景别 + 2-3 个具体静态特征，禁 beautiful/nice</p>
  <p>4. <strong>动作</strong>：身体部位级 + 幅度速度；情绪外化为身体细节；优先慢速连续小动作</p>
  <p>5. <strong>运镜</strong>：每镜头仅一个，格式「缓慢推进（dolly in）」；运镜与主体动作分开描述</p>
  <p>6. <strong>场景与光影</strong>：环境 + 光源方向/色温 + 氛围；命名真实光源（霓虹灯/黄金时段/伦勃朗光）</p>
  <p>7. <strong>音频</strong>：「音效：」前缀；多角色用 [角色 P1: 名, 音色]: "台词" 语法</p>
  <p>8. <strong>全局收尾</strong>（写一次）：风格锚点 + 正向约束 + 质量后缀（4K，16:9，12 秒）+ 独立负面提示词框</p>
  <div class="highlight"><strong>落地：</strong>层顺序不可换——可灵从左到右注意力递减，元素参考和主体必须靠前。</div>
</div>

<div class="card">
  <h3>【模板 B】多角色对话与六轴摄像机</h3>
  <p><strong>在讲什么问题：</strong>可灵 3.0 独有的 P1-P4 对话和六轴控制怎么用？</p>
  <p><strong>操作步骤：</strong></p>
  <p>1. 每个角色唯一标签 P1-P4，全程一致（禁止混用「他/她」）</p>
  <p>2. 先描述动作再说对话：「侦探猛拍桌面。[角色 P1: 侦探，愤怒地]: "真相到底是什么？"」</p>
  <p>3. 六轴 API：Horizontal/Vertical/Pan/Tilt/Roll/Zoom 各 -10 到 10</p>
  <p><strong>避坑：</strong>角色标签不一致导致音色错乱和人物混淆。<strong>严重程度：致命。</strong></p>
  <div class="quote">3.0 支持方言：「用粤语说」「带东北口音」—— 同场景可多语言混合。</div>
</div>

<div class="card">
  <h3>【模板 E】可灵 vs Veo 提示词对比</h3>
  <table>
    <tr><th>对比维度</th><th>可灵 3.0</th><th>Veo 3.1</th><th>结论</th></tr>
    <tr><td>单镜头最佳字数</td><td>40-100 字</td><td>100-150 词</td><td>可灵更精炼</td></tr>
    <tr><td>多镜头标签</td><td>镜头 1/2/3（最多 6）</td><td>[00:00-00:02] 时间戳（最多 4）</td><td>格式不同结构同</td></tr>
    <tr><td>音频语法</td><td>音效：+ P1-P4 对话</td><td>says:/SFX:/Ambient:</td><td>可灵结构化对话更强</td></tr>
    <tr><td>负面提示词</td><td>独立输入框</td><td>正向描述性排除</td><td>可灵更直观</td></tr>
    <tr><td>输出规格</td><td>3-15 秒原生 4K</td><td>4/6/8 秒 720p/1080p</td><td>可灵时长更灵活</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 D】场景与模板选型表</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>核心理由</th><th>不推荐</th><th>为什么</th></tr>
    <tr><td>快速单镜头迭代</td><td>八层省略第①层</td><td>纯 T2V 从镜头标签开始</td><td>2500 字符堆满</td><td>后半段被忽略</td></tr>
    <tr><td>品牌多镜头短片</td><td>2-6 镜头标签 + Think in Shots</td><td>视角变化越丰富叙事越有层次</td><td>单提示词塞多场景</td><td>动作冲突</td></tr>
    <tr><td>精确 A→B 转场</td><td>VIDEO O1 首尾帧 + 第①层</td><td>提示词只描述变化过程</td><td>纯文本硬描述</td><td>一致性差</td></tr>
    <tr><td>产品/美食/时尚</td><td>10 模板直接复制改主体</td><td>3 镜头叙事已验证</td><td>从零随机试错</td><td>浪费积分</td></tr>
    <tr><td>不会写提示词</td><td>元提示词让 Claude/GPT 生成</td><td>AI 按八层结构输出</td><td>随机试错</td><td>浪费生成额度</td></tr>
  </table>
</div>

<div class="card">
  <h3>【模板 A】10 个精选模板速览</h3>
  <p><strong>在讲什么问题：</strong>最高频 10 场景的标准八层写法？</p>
  <p><strong>核心机制：</strong>每个模板 3 镜头多镜头叙事 + 独立负面提示词，覆盖：</p>
  <p>1. 产品广告（orbit 环绕 + 苹果主题演讲光）2. 美食餐饮（9:16 色调递进）3. 短剧微电影（P1-P4 对话弧线）4. 音乐视频（节拍同步递进）5. 品牌宣传片 6. 房地产展示 7. 教育知识 8. 时尚美妆（9:16 伦勃朗光）9. 旅行风光（crane 航拍过渡）10. 动作特效（慢动作降速）</p>
  <p><strong>怎么落地：</strong>复制模板 → 替换主体/场景细节 → 调整负面提示词 → 生成。</p>
  <p><strong>边界说明：</strong>模板是起点非终点；同一主体需固定第⑧层风格锚点形成品牌一致性。</p>
  <div class="highlight"><strong>落地建议：</strong>先从模板 1（产品）或模板 3（短剧）练手，掌握三镜头叙事节奏后再自定义。</div>
</div>

<div class="card">
  <h3>【模板 F】光影与动作心法</h3>
  <p><strong>原则：</strong>光影描述的投资回报率最高—— 每词质量提升超过任何其他元素；动作优先慢速连续小动作。</p>
  <p><strong>为什么重要：</strong>「美丽的电影光线」无效；「主光从左上方 45 度打来，黄金时段逆光捕捉灰尘颗粒」有效十倍。</p>
  <p><strong>怎么落地：</strong>运镜术语直接用：dolly in/out、tracking shot、orbit、crane up/down；负面提示词框固定 5-8 个：warping/morphing/distorted faces/extra fingers/jittery motion。</p>
  <p><strong>适用边界：</strong>负面提示词超过 8 个画面可能僵硬；需要速度感用物理细节描述而非「快速」一词。</p>
  <div class="quote">错误：「快速飞车追逐」→ 正确：「黑色轿车猛冲过狭窄街道，轮胎在湿沥青上尖啸，悬挂在急弯中压缩」</div>
</div>

<div class="card">
  <h3>【模板 C】避坑清单</h3>
  <p><strong>坑：提示词中使用「快速/fast」</strong> — 运动模糊+时间不一致。<strong>解法：</strong>用物理细节描述速度。<strong>严重程度：致命。</strong></p>
  <p><strong>坑：一镜头多运镜</strong> — 画面抖动混乱。<strong>解法：</strong>每镜头只写一个运镜。<strong>严重程度：致命。</strong></p>
  <p><strong>坑：运镜和动作混写</strong> — 「镜头环绕旋转，跳舞的女人」。<strong>解法：</strong>先写动作再单独写运镜。<strong>严重程度：小心。</strong></p>
  <p><strong>坑：多角色标签不一致</strong> — P1 和「他」混用导致音色错乱。<strong>解法：</strong>全程 P1-P4 唯一标签。<strong>严重程度：致命。</strong></p>
  <div class="pitfall"><strong>抽象情绪词：</strong>「悲伤的男人」无效 → 外化：「低下头，肩膀微抖，眼眶泛红，手指攥紧衣角」。</div>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>可灵 3.0 差距在提示词不在模型—— 八层框架统一单镜头与 6 镜头叙事</li>
    <li>最佳字数：单镜头 40-100，多镜头 80-200；前部权重最高</li>
    <li>画面：具体名词材质 &gt; 模糊形容词；慢动作 &gt; 快速；一镜头一运镜一主动作</li>
    <li>音频：P1-P4 结构化对话 + 音效：前缀；可灵 2.6+ 原生音频同步生成</li>
    <li>独立负面提示词框 5-8 个词；10 模板 + 元提示词加速上手</li>
  </ol>
  <p style="margin-top:20px;opacity:0.95"><strong>行动清单：</strong></p>
  <ol>
    <li>下载八层框架模板，用下一个视频任务填空式写作</li>
    <li>从 10 模板中选一个最接近的场景复制粘贴试生成</li>
    <li>用元提示词让 Claude 将你的创意转为八层结构可灵提示词</li>
    <li>固定第⑧层风格锚点（如 35mm 柯达暖色调 + 伦勃朗光）形成品牌一致性</li>
    <li>在负面提示词框设置基础 5-8 词清单，每项目复用</li>
  </ol>
  <p style="margin-top:20px;opacity:0.95"><strong>关键认知转变：</strong>视频提示词不是「描述梦想画面」，而是「给 AI 导演写拍摄表」—— 层序即优先级，精准约束比华丽辞藻更重要；可灵是自带摄影团队+录音棚+剪辑室的 AI 导演。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
