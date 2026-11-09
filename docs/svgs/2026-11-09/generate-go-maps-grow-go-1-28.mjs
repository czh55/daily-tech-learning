import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'go-maps-grow-go-1-28.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:48px 60px;color:#1e293b}
h1{font-size:32px;font-weight:900;background:linear-gradient(135deg,#047857,#0d9488);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-green{background:#d1fae5;color:#047857}.tag-teal{background:#ccfbf1;color:#0f766e}.tag-slate{background:#f1f5f9;color:#334155}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #059669}
.card h3{font-size:22px;font-weight:700;color:#047857;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#d1fae5,#6ee7b7);border:2px solid #34d399;border-radius:14px;padding:10px 14px;text-align:center;min-width:72px;font-weight:700;font-size:11px;color:#047857}
.node-em{background:linear-gradient(135deg,#ccfbf1,#5eead4);border-color:#2dd4bf;color:#0f766e}
.arrow-sym{font-size:14px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#047857,#0d9488);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
th{background:#d1fae5;padding:10px 12px;text-align:left;font-weight:700;color:#065f46;border-bottom:2px solid #6ee7b7}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#eff6ff;border:2px solid #2563eb;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#1e40af;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#1d4ed8;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#1e3a8a}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>已有 map 也能预扩容：maps.Grow 与 Copy 智能化</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-green">Go 1.28</span>
  <span class="tag tag-teal">#81698</span>
  <span class="tag tag-slate">maps 包</span>
</div>
<p class="subtitle">本文解决的核心问题是：当目标 map 已存在且不能重建时，如何避免向 HTTP Header、ReverseProxy 合并路径上反复触发渐进式扩容——Proposal #81698 用 maps.Grow(m,n) 表达「再增 n 个元素」的容量意图，并让 maps.Copy 在 src 更大时自动预扩容，基准最高约快 57%、分配约减半。</p>

<div class="map">
  <h3 style="font-size:20px;color:#047857;margin-bottom:12px;text-align:center">容量意图链：make 提示 → 原地 Grow → Copy</h3>
  <div class="diagram">
    <div class="node">make(hint)</div><span class="arrow-sym">→</span>
    <div class="node node-em">maps.Grow(m,n)</div><span class="arrow-sym">→</span>
    <div class="node">maps.Copy</div><span class="arrow-sym">→</span>
    <div class="node node-em">少次扩容</div>
  </div>
  <p style="text-align:center;font-size:14px;color:#64748b;margin-top:12px">n = 新增元素数，语义接近 Rust HashMap::reserve(additional)</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">误解：Grow 保证以后绝不扩容、或能查 cap。实际上它是尽力而为的 hint，不暴露真实容量；不能缩小 map；n&lt;0 或向 nil 且 n&gt;0 会 panic，Grow(nil,0) 安全。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】maps.Grow 语义</h3>
  <p><strong>在讲什么问题：</strong>create 时有 make hint，原地 bulk 写入却只能忍受 runtime 渐进扩容？</p>
  <p><strong>关键理解：</strong>Go 1.28 起 func Grow[M ~map[K]V](m M, n int) 为已有 map 预留至少容纳 n 个<strong>新增</strong>元素的空间，等价于 make 的 len(m)+n 提示；引用语义就地生效，无返回值。</p>
  <p><strong>和其他概念关系：</strong>maps.Clone / 重建 map 会复制全表；Grow 适合第三方持有的 dst（net/http Header 等）。</p>
  <p><strong>怎么落地用：</strong>merge 前 maps.Grow(dst, len(src)) 再 maps.Copy；未创建 map 仍优先 make(map[K]V, hint)。</p>
  <p><strong>边界说明：</strong>连续 Grow(m,1000) 再 Grow(m,10) 不会缩小；拒绝 #52157 式 cap 查询是为避免虚假保证。</p>
  <p><strong>原文依据：</strong>Proposal #81698 已于 2026-11-07 标记 completed。</p>
</div>

<div class="card">
  <h3>【方法/工具卡】maps.Copy 自动预扩容</h3>
  <p><strong>核心思路：</strong>当 len(src)&gt;len(dst) 时，Copy 内部先 grow(dst, len(src)-len(dst))，再遍历写入；小 map（不超过一个 group）跳过以免多余开销。</p>
  <p><strong>操作步骤：</strong>① 判断批量写入规模 → ② 可选显式 Grow → ③ Copy 或手写循环 → ④ 压测热路径验证分配次数。</p>
  <p><strong>选型条件：</strong>ReverseProxy/TimeoutHandler/CGI Header 合并、libhoney-go 式大批量导入；两 map 同 key 全集或同 size 无重叠 key 时优化基本无感。</p>
  <p><strong>避坑：</strong>不要用 Grow 替代 make；不要假定 n 后零扩容；重叠 key 时按 len(src) 估容量而非 len(src) 盲目全量 reserve 过度——实现用 len(src)-len(dst) 减过度分配。</p>
  <p><strong>对比相邻方法：</strong>自建新 map 再手工拷贝旧表：多一轮分配与遍历；裸循环插入：多次渐进扩容。</p>
  <p><strong>原文引用：</strong>CL 839065 在 AMD Ryzen 5 5600X 上空 map 复制 64 键 -57.12%。</p>
</div>

<div class="card">
  <h3>【跨概念对比表】map 容量手段</h3>
  <table>
    <tr><th>维度</th><th>make(hint)</th><th>maps.Grow</th><th>重建+Clone</th><th>结论</th></tr>
    <tr><td>时机</td><td>创建时</td><td>已存在 map</td><td>可替换引用时</td><td>原地场景用 Grow</td></tr>
    <tr><td>语义</td><td>总容量提示</td><td>+n 新增</td><td>全新桶表</td><td>Grow 不返新指针</td></tr>
    <tr><td>持有方</td><td>自建</td><td>调用方 dst</td><td>需换掉旧引用</td><td>HTTP dst 只能 Grow</td></tr>
    <tr><td>保证</td><td>hint</td><td>尽力 hint</td><td>确定新表</td><td>皆非绝对零扩容</td></tr>
    <tr><td>典型收益</td><td>基线</td><td>大 bulk 写</td><td>内存尖峰</td><td>Copy 自动化常见路径</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】Grow / Copy 使用陷阱</h3>
  <p><strong>坑名：</strong>把 n 当总容量。<strong>原因：</strong>API 定义 n 为新增数。<strong>解法：</strong>用 len(待写入) 或 len(src)-len(dst)。<strong>严重程度：</strong>小心。</p>
  <p><strong>坑名：</strong>对 nil map Grow 正 n。<strong>原因：</strong>与写 nil map 同规。<strong>解法：</strong>先 make 或 Grow(nil,0)。<strong>严重程度：</strong>致命（panic）。</p>
  <p><strong>坑名：</strong>期望 cap 可见。<strong>原因：</strong>#52157 未采纳。<strong>解法：</strong>只表达意图，用 benchmark 验证。<strong>严重程度：</strong>可忽略。</p>
  <p><strong>坑名：</strong>小 map 过度优化。<strong>原因：</strong>Copy 对小表跳过 presize。<strong>解法：</strong>无需手调 Grow。<strong>严重程度：</strong>可忽略。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】隐藏实现、保留意图</h3>
  <p><strong>原则：</strong>给开发者表达「还要加多少」的把手，不把 bucket 容量暴露成可依赖不变量。</p>
  <p><strong>为什么重要：</strong>map 扩容策略属 runtime 内部细节；虚假 cap 契约会束缚未来优化（#56182 渐进式 vs 一次扩）。</p>
  <p><strong>怎么落地：</strong>Go 1.28 升级后审查 merge/Header 工具函数，一行 Grow 或依赖智能 Copy。</p>
  <p><strong>适用边界：</strong>非热路径、元素极少时收益微乎其微；勿为微优化牺牲可读性。</p>
  <p><strong>原文支撑：</strong>「提供必要的控制能力，但尽可能隐藏底层实现细节。」</p>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：「map 够用就行」派 / 反对膨胀标准库</p>
  <p class="rebuttal-text">多数业务 map 极小，标准库再加 Grow 只是安慰剂——真正瓶颈在网络与业务逻辑，手工 make 合理 hint 或偶尔扩容完全可接受，不必为边缘 proxy 场景堆 API。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结</strong></p>
  <ol>
    <li>#81698 接受并完成，Go 1.28 将提供 maps.Grow(m,n) 服务已有 map 的批量写入场景。</li>
    <li>n 表新增元素；不缩小、无 cap API；负 n 与 nil+n&gt;0 panic。</li>
    <li>maps.Copy 在 src 更大时自动 presize，小 map 跳过，避免无谓开销。</li>
    <li>CL 839065：空/大 map 复制耗时最多降约 57%，内存与分配次数约减半。</li>
    <li>设计延续 hint 哲学，不替代 make，补全 HTTP Header、ReverseProxy 等原地合并痛点。</li>
  </ol>
  <p><strong>行动清单</strong></p>
  <ol>
    <li>在 merge 辅助函数中试用 maps.Grow(dst, len(src)) + maps.Copy。</li>
    <li>对 ReverseProxy Header 合并路径做升级前后 benchmark。</li>
    <li>Go 1.28 rc 发布后确认 maps 包文档中的尽力而为表述。</li>
    <li>审查是否误用重建 map 规避扩容，可改为 Grow 原地写。</li>
    <li>阅读 CL 819620 / 839065 核对 Copy 的 len(src)-len(dst) 逻辑。</li>
  </ol>
  <p><strong>关键认知转变</strong></p>
  <p>map 性能优化从「只能在 make 时猜容量」转为「在已知下一批写入量时，用 Grow 或智能 Copy 把意图交给 runtime」——一行声明换更少渐进扩容，而非暴露内部 cap。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg);
console.log(`Wrote ${OUT} (${height}px)`);
