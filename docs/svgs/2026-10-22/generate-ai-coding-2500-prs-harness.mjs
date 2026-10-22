import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'ai-coding-2500-prs-harness.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#fff7ed,#ffedd5);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#c2410c,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-orange{background:#ffedd5;color:#c2410c}.tag-amber{background:#fef3c7;color:#92400e}.tag-slate{background:#f1f5f9;color:#334155}.tag-rose{background:#ffe4e6;color:#be123c}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #f97316}
.card h3{font-size:22px;font-weight:700;color:#c2410c;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fff7ed;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#9a3412;border-left:4px solid #fb923c}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#ffedd5,#fed7aa);border:2px solid #fdba74;border-radius:14px;padding:10px 12px;text-align:center;min-width:72px;font-weight:700;font-size:10px;color:#c2410c}
.node-alt{background:linear-gradient(135deg,#fce7f3,#fbcfe8);border-color:#f9a8d4;color:#be185d}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{background:#fff7ed;padding:10px 14px;text-align:left;font-weight:700;color:#c2410c;border-bottom:2px solid #fdba74}
td{padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>一个月 2500 PR：信任、Harness 与米其林厨房</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">AI Coding</span>
  <span class="tag tag-amber">Harness</span>
  <span class="tag tag-slate">Dune 架构</span>
  <span class="tag tag-rose">Grok Bot</span>
</div>
<p class="subtitle">本文解决的核心问题是：单人如何在不牺牲质量的前提下把 AI Agent 用到「月合并两千 PR」的量级——答案不是更猛的模型，而是信任前置：验证技能让 Agent 看见结果，编码技能与五层约束让错误模式技术上不可能，外循环 Grok Bot 接监控、内循环 Cursor 云 Agent 用同一套厨房设备做菜。</p>

<div class="map">
  <h3 style="font-size:20px;color:#c2410c;margin-bottom:12px;text-align:center">外循环（告警→决策）→ 云 Agent → ControlGlass 验证 → PR</h3>
  <div class="diagram">
    <div class="node">Sentry<br>Slack</div><span class="arrow-sym">→</span>
    <div class="node-alt">Grok Bot</div><span class="arrow-sym">→</span>
    <div class="node">Cursor<br>Agent</div><span class="arrow-sym">→</span>
    <div class="node">Dune+lint</div><span class="arrow-sym">→</span>
    <div class="node">ControlGlass</div>
  </div>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：PR 数量是 KPI。Lauren 强调 2000+ 是信任提升后的副产品；不信任时规模化只会产出低质量 PR 与回归。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】信任两阶段</h3>
  <p><strong>在讲什么问题：</strong>何时能从 1 对 1 盯对话升级到规模化派 Agent。</p>
  <p><strong>关键理解：</strong>只有相信 Agent 离场也能做对，才敢并行；中间隔的是可验证的 Harness。</p>
  <p><strong>怎么落地：</strong>先写验证技能（Agent 能跑应用、看指标/截图），再写编码技能（资深工程师流程入库）。</p>
  <p><strong>原文依据：</strong>「只有当你信任 Agent 能在你不在场时产出高质量工作，你才能真正规模化。」</p>
</div>

<div class="card">
  <h3>【方法/工具卡】ControlGlass + 功能地图</h3>
  <p><strong>CLI：</strong>技能目录内固定调用，CDP 跑性能追踪，hill climbing 有分数就能自迭代。</p>
  <p><strong>功能地图：</strong>物化记忆——功能、入口、快捷键、DOM 路径，解 Slack 三张问号截图。</p>
  <p><strong>边界：</strong>只管正确性；性能与代码质量靠 pstack 等编码技能 + lint。</p>
  <div class="highlight">验证回答「做对了吗」；编码技能回答「做得好吗」。 </div>
</div>

<div class="card">
  <h3>【决策/选型表】信任五层金字塔</h3>
  <table>
    <tr><th>层级</th><th>手段</th><th>强度</th><th>纠正 Agent 时优先想</th></tr>
    <tr><td>①</td><td>架构/导入依赖图（Dune）</td><td>最强</td><td>能否让错误不可能发生</td></tr>
    <tr><td>②</td><td>静态分析、CI</td><td>次强</td><td>能否自动执行</td></tr>
    <tr><td>③</td><td>规则、bug bot、技能</td><td>中</td><td>Agent 可能忽略</td></tr>
    <tr><td>④</td><td>代码质量技能</td><td>较弱</td><td>靠执行意愿</td></tr>
    <tr><td>⑤</td><td>风格指南人工 review</td><td>最弱</td><td>PR 量大时不可行</td></tr>
  </table>
</div>

<div class="card">
  <h3>【跨概念对比表】两张「地图」</h3>
  <table>
    <tr><th>维度</th><th>功能地图</th><th>导入依赖图</th></tr>
    <tr><td>面向</td><td>Agent 理解业务/UI</td><td>代码架构边界</td></tr>
    <tr><td>位置</td><td>技能目录</td><td>框架/构建系统</td></tr>
    <tr><td>回答问题</td><td>应用怎么用</td><td>文件能否互相引用</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Dune 禁注释与「花园」</h3>
  <p><strong>坑名：</strong>注释成为 Agent 的「收工信号」，复制天性让 workaround 疯长。</p>
  <p><strong>解法：</strong>禁注释逼逻辑写清；设园丁角色拔杂草；标准：这段代码被复制你会高兴吗？</p>
  <p><strong>铺砌路径：</strong>一件事一种常规做法，反模式立刻写 lint 阻止扩散。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】米其林厨房 vs 软件工厂</h3>
  <p><strong>原则：</strong>主厨时间花在厨房设置（工具、框架、培训），不是亲自炒每道菜。</p>
  <p><strong>外循环：</strong>Grok Bot 聚合 Slack/Sentry/DataDog，routines 自动起云 Agent。</p>
  <p><strong>内循环：</strong>Cursor 里 Agent 吃 Dune、lint、技能、ControlGlass 同一套 Harness。</p>
  <p><strong>闭环示例：</strong>性能告警→复现→功能地图定位→改代码→ControlGlass 前后数字→PR。</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「堆 Agent 数量就能赢」</p>
  <p class="rebuttal-text">没有验证与架构约束的规模化等于批量制造回归；2500 PR 的前提是厨房先建成米其林级，而不是流水线加班。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>信任无捷径，靠验证技能 + 五层约束 + Dune 铺砌路径。</li>
    <li>ControlGlass 让 Agent 自证；功能地图补业务上下文。</li>
    <li>园丁心态：代码库每一部分都应值得被 Agent 复制。</li>
    <li>外循环接监控决策，内循环用同一 Harness 交付 PR。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>为最常修的应用写「能跑起来+截图/指标」的验证 CLI 技能。</li>
    <li>把资深工程师调试流程收成编码技能进仓库。</li>
    <li>纠正 Agent 时按金字塔从架构/lint 往上想，别只改 prompt。</li>
    <li>指定园丁角色定期清反模式并补 lint。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>从「我是人肉代理搬 DevTools 数据」转为「我设计厨房，Agent 是厨师」。 </p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Wrote', OUT, 'height', height);
