import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'pansnap-website-introduction.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#047857,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-green{background:#d1fae5;color:#065f46}.tag-amber{background:#fef3c7;color:#92400e}.tag-slate{background:#e2e8f0;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #10b981}
.card h3{font-size:22px;font-weight:700;color:#047857;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:16px 0}
.node{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #6ee7b7;border-radius:14px;padding:12px 14px;text-align:center;min-width:88px;font-weight:700;font-size:11px;color:#065f46}
.node-em{background:linear-gradient(135deg,#047857,#059669);border-color:#34d399;color:#ecfdf5}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#065f46,#059669);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#ecfdf5;padding:10px 12px;text-align:left;font-weight:700;color:#047857;border-bottom:2px solid #a7f3d0}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fff1f2;border:2px solid #e11d48;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#be123c;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#e11d48;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#881337}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
.highlight{background:#ecfdf5;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#065f46;border-left:4px solid #10b981}
.pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}`;

const body = `
<h1>PanSnap：冰箱照片 → 一桌可开火晚餐</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">学员实践</span>
  <span class="tag tag-amber">生活 AI 小切口</span>
  <span class="tag tag-slate">绍明 / 翔宇</span>
</div>
<p class="subtitle">PanSnap 把「今晚吃什么」做成闭环产品：识食材、按人数配一桌菜、合并采购清单、分步配图与菜谱书导出——第一份菜单免注册即可试，是「小场景做完整」的起步范本。</p>

<div class="map">
  <h3 style="font-size:20px;color:#047857;margin-bottom:12px;text-align:center">用户闭环</h3>
  <div class="diagram">
    <div class="node">冰箱照/食材</div><span class="arrow-sym">→</span>
    <div class="node">一桌菜单</div><span class="arrow-sym">→</span>
    <div class="node-em">采购单+步骤图</div><span class="arrow-sym">→</span>
    <div class="node">菜谱书</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：又是菜谱搜索。PanSnap 输出的是<strong>按一餐搭配、按人数算量、可去超市的合并清单</strong>，不是灵感链接列表。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】产品边界</h3>
  <p><strong>在讲什么问题：</strong>库存食材 → 可执行晚餐方案。</p>
  <p><strong>关键理解：</strong>Slogan「有什么食材，就做什么菜」划清范围：不替用户逛超市，从现有输入推到开火。</p>
  <p><strong>怎么落地用：</strong>pansnap.app/zh；首份免注册；人数 1–7+、多菜系/口味/忌口可设。</p>
  <p><strong>边界说明：</strong>主攻晚餐一桌；过敏与营养需用户自行判断。</p>
  <p><strong>原文依据：</strong>步骤带编号与实拍风小图，完整版每步有图。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】降低门槛的配置层</h3>
  <p><strong>操作步骤：</strong>① 拍照或输入边角料 ② 用餐人数/菜品数/菜系/口味（有默认可不改）③ 生成菜单 ④ 用汇总采购单购物 ⑤ 按步骤开火 ⑥ 存菜谱书/分享。</p>
  <p><strong>选型条件：</strong>清冰箱、 picky 小孩、30 分钟上桌等约束设一次长期生效。</p>
  <p><strong>避坑：</strong>忽略忌口预设会导致每份菜单都要重调——初次多花时间设约束更省。</p>
  <p><strong>对比菜谱 App：</strong>PanSnap 按「一餐」算配比与去重采购，而非单菜收藏。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】菜谱搜索 vs PanSnap</h3>
  <table>
    <tr><th>维度</th><th>传统搜索</th><th>PanSnap</th></tr>
    <tr><td>输入</td><td>菜名/关键词</td><td>冰箱视觉/食材列表</td></tr>
    <tr><td>输出</td><td>分散灵感</td><td>同桌菜单+采购单</td></tr>
    <tr><td>分量</td><td>自理</td><td>按人数缩放</td></tr>
    <tr><td>上手</td><td>常要账号</td><td>首份免注册</td></tr>
  </table>
</div>

<div class="card">
  <h3>【心法/原则卡】学员产品化路径</h3>
  <p><strong>原则：</strong>识别/搭配/写步骤各是一次调用，产品价值在串联+清单合并+排版导出+试用积分规则。</p>
  <p><strong>为什么：</strong>翔宇鼓励先解决每天都要碰的小问题，再挑战 ohmymv 级多模态。</p>
  <p><strong>怎么落地学：</strong>选一个自有痛点，做到「别人打开就能用」再谈技术难度。</p>
  <p><strong>边界：</strong>案例文非开源架构说明。</p>
</div>

<div class="card">
  <h3>【决策/选型表】何时用 PanSnap</h3>
  <table>
    <tr><th>场景</th><th>推荐</th><th>不推荐</th><th>原因</th></tr>
    <tr><td>库存清完</td><td>拍冰箱</td><td>固定拿手菜</td><td>需要搭配与用量</td></tr>
    <tr><td>带娃 picky</td><td>设忌口/口味</td><td>单次随机生成</td><td>约束应持久</td></tr>
    <tr><td>学 AI 产品</td><td>拆解其闭环</td><td>只抄 UI</td><td>闭环在后台串联</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】</h3>
  <p><strong>坑名：</strong>把 AI 菜谱当专业营养建议。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>不做忌口默认值。<strong>解法：</strong>首次配置保存。<strong>严重程度：</strong>小心。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「这种小工具没技术含量」</p>
  <p class="rebuttal-text">技术含量不在单次识图，而在把一餐作为单位做配比、采购去重、图谱导出与商业化规则——这正是多数 AI demo 缺的那一段，也是 PanSnap 能当学员第一步的原因。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>PanSnap = 极高频痛点 + 极小上手摩擦 + 全链路交付。</li>
    <li>与 ohmymv 同属绍明路线：切口不同，「可拿走的结果」一致。</li>
    <li>AI 编程学员应学闭环而非单点 API。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>试 pansnap.app/zh 体验免注册首单。</li>
    <li>为自己选题画「输入→交付物」五步图，对标 PanSnap。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「我会调模型」转为「我把每天都能用的一小段生活/工作流做成产品」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');