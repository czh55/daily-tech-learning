import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'rust-ai-coding-agent-token-efficiency-danluu.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#b45309,#ea580c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #ea580c}
.card h3{font-size:22px;font-weight:700;color:#c2410c;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#fff7ed,#ffedd5);border:2px solid #fdba74;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#9a3412}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-blue{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-color:#93c5fd;color:#1e40af}
.node-purple{background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-color:#a78bfa;color:#6b21a8}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#c2410c;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>Token 效率鄙视链被打脸：Rust 才是 AI 编程时代的隐藏赢家？</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-orange">AI Coding</span>
  <span class="tag tag-blue">Token 效率</span>
  <span class="tag tag-green">Danluu 评测</span>
  <span class="tag tag-purple">Rust</span>
  <span class="tag tag-red">内存安全</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 Coding Agent 的任务从 Rosetta Code 式小题升级为 Zstd 解码器、Pandoc 文档转换这类真实工程挑战后，「动态语言更省 Token、静态语言拖累 AI」这条流行鄙视链是否仍然成立，以及 Rust 被冤枉的评测 Bug 与 C/C++ 内存安全的隐藏成本如何改写语言选型账本。</p>

<div class="map">
  <h3 style="font-size:20px;color:#c2410c;margin-bottom:12px;text-align:center">AI 编程语言效率争议演化关系图</h3>
  <div class="diagram">
    <div class="node">流行结论<br>Rosetta Code<br>70~109 Token</div>
    <span class="arrow-sym">→</span>
    <div class="node-blue">Danluu 硬核评测<br>Zstd RFC<br>Pandoc TDD</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">结论反转<br>ultra 档位静态语言反超<br>流行度正相关</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">隐藏变量<br>符号链接 Bug<br>内存安全返工成本</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">从「玩具题常识」到「工程题证据」：评测设计决定结论，安全水位决定真实成本</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Rust 所有权模型让 AI 写代码更费劲、更费 Token」。实际上 mame/ai-coding-lang-bench 中 Rust 的失败源于测试脚本把可执行文件路径写错成 <code>../../minigit</code>（应为 <code>../minigit</code>），与语言无关；修复后用 Rust 自身二进制重跑直接满分。此前「Rust 拖后腿」的结论是被评测基础设施 Bug 带偏的。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】Rosetta Code 式评测为何撑不起大结论</h3>
  <p><strong>在讲什么问题：</strong>搜索引擎和 AI 摘要里「动态语言 Token 成本更低」的结论，源头是几篇用极简单题（平均 70~109 Token 可解）做的跨语言对比。</p>
  <p><strong>核心机制：</strong>这类题目本质是打印输出型练习，消耗的 Token 主要在 I/O 而非工程判断；Danluu 称之为「算不上真正的编程问题」。</p>
  <p><strong>关键理解：</strong>「土办法」在小题上效果显著，一旦涉及架构取舍、边界处理、测试驱动，优势迅速缩水甚至消失——这和他在提示词技巧评测中的观察一致。</p>
  <p><strong>典型场景：</strong>社交媒体转发的「AI 最爱语言排行榜」、基于单一批题目的语言选型决策。</p>
  <p><strong>边界说明：</strong>小题评测并非完全无用，但只能反映「低算力、低复杂度」下的表面 Token 消耗，不能外推到生产级 Agent 任务。</p>
  <div class="quote">「一道 70 个 Token 就能解决的题目，本质上算不上什么真正的编程问题。」</div>
  <div class="relation"><strong>相关概念：</strong>与 J 语言（70 Token）、Clojure（109 Token）的「稠密语言神话」同属被简单任务放大的假象。</div>
</div>

<div class="card">
  <h3>【方法/工具卡】Danluu 两组硬核工程评测</h3>
  <p><strong>核心思路：</strong>用真实工程任务替代玩具题，分别测试 Agent 在无网络沙箱中实现 zstd RFC 完整解码器，以及基于 Pandoc ProgramBench 的 TDD 式文档转换器复现。</p>
  <p><strong>操作步骤：</strong></p>
  <p>① Zstd 评测：把 RFC+勘误表交给 Agent，测试用例保密，分 medium / ultra 两档算力；</p>
  <p>② Pandoc 评测：Agent 可见部分公开测试，留出集 holdout 单独打分防背答案；</p>
  <p>③ 横轴看成本（Token/时间），纵轴看正确率，对比静态 vs 动态语言集群；</p>
  <p>④ 补充分析：语言 GitHub 流行度与实测表现的相关系数。</p>
  <p><strong>选型条件：</strong>评估「某语言是否适合 AI 编程」时，应优先参考多任务、多算力档位的工程评测，而非单一批 Rosetta Code 题。</p>
  <p><strong>避坑：</strong>单一评测里某语言表现差，往往是局部技术细节（如 Clojure byte 转换 128~255 区间异常）而非语言整体不适配。</p>
  <div class="highlight"><strong>落地建议：</strong>团队自建 Agent 语言评测时，至少准备两档算力预算和两类不同风格任务（RFC 实现 + TDD 重构），避免「一题定生死」。</div>
</div>

<div class="card">
  <h3>【跨概念对比表】medium 档位 vs ultra 档位的结论反转</h3>
  <table>
    <tr><th>对比维度</th><th>medium 算力档位</th><th>ultra 算力档位</th><th>一句话结论</th></tr>
    <tr><td>动态 vs 静态语言</td><td>动态语言整体位于左上角（低成本高正确率）</td><td>静态语言更多进入表现最优集群</td><td>「动态更省 Token」只在低预算下勉强成立</td></tr>
    <tr><td>冷门稠密语言（J 等）</td><td>小题上看似极优</td><td>真实任务普遍偏差</td><td>训练数据稀缺直接反映在 Agent 表现上</td></tr>
    <tr><td>汇编语言</td><td>—</td><td>Pandoc 任务表现明显更差</td><td>连人类工程师都极难用汇编写 Pandoc 量级项目</td></tr>
    <tr><td>评测任务类型</td><td>Zstd RFC 实现</td><td>Pandoc TDD 复现</td><td>两组任务结论一致：无强静态/动态相关性</td></tr>
    <tr><td>语言流行度</td><td>弱到中等正相关</td><td>弱到中等正相关</td><td>Rust 等主流语言因训练数据充足而受益</td></tr>
  </table>
</div>

<div class="card">
  <h3>【概念拆解卡】符号链接 Bug 如何冤枉 Rust 所有权模型</h3>
  <p><strong>在讲什么问题：</strong>mame/ai-coding-lang-bench 曾报告 600 次运行中仅 Rust 和 Haskell 失败，作者推测「Rust 所有权模型增加 AI 认知负担」。</p>
  <p><strong>核心机制：</strong>测试脚本期望执行 <code>../minigit</code>，发布版却写成 <code>../../minigit</code>（路径不存在）；某 Go Agent 发现后自行 <code>ln -sf</code> 符号链接，导致后续所有语言实际跑的都是 Go 二进制。</p>
  <p><strong>关键理解：</strong>Rust 的失败与所有权无关，纯粹是执行了不存在的文件路径；用 Rust 自身可执行文件重跑后满分通过。</p>
  <p><strong>典型场景：</strong>跨语言 Agent 基准测试、开源评测被社交媒体二次传播时。</p>
  <p><strong>边界说明：</strong>这不能证明 Rust 在所有 Agent 任务上都最优，但足以推翻「所有权模型天生拖累 AI」的强论断。</p>
  <div class="pitfall"><strong>评测陷阱：</strong>Danluu 自己搭建环境踩了 100+ 个类似坑——构建脚本说明不一致、Rust 环境缺 rustfmt/Clippy、汇编声称有 GDB 实际不可用等，任何一个都足以让某语言成绩失真。</div>
</div>

<div class="card">
  <h3>【概念拆解卡】内存安全——被忽视的 Token 隐藏成本</h3>
  <p><strong>在讲什么问题：</strong>大多数「哪种语言更省 Token」比较只算生成成本，不算达到同等安全水位所需的返工。</p>
  <p><strong>核心机制：</strong>Danluu 让 Agent 检查 Pandoc 评测生成的 C/C++ 代码内存安全：几乎所有 C 程序、除一个外全部 C++ 程序存在内存安全问题（如截断 LaTeX 表格时越界读取），几十秒 Prompt 即可检出。</p>
  <p><strong>关键理解：</strong>把 C/C++ 修到接近 Rust 安全水位需要大量额外 Token，且修复后信心仍不如 Rust——这部分成本此前被完全忽略。</p>
  <p><strong>典型场景：</strong>Agent 生成 C/C++ 原型后需人工审计、安全敏感系统选型。</p>
  <p><strong>边界说明：</strong>并非所有任务都需要 Rust 级安全；但涉及不可信输入解析时，隐藏返工成本可能让 Rust 账本反超。</p>
  <div class="highlight"><strong>落地建议：</strong>评估 Agent 语言效率时，把「生成 Token + 安全审计/修复 Token」合并计算，而非只看首轮输出长度。</div>
</div>

<div class="card">
  <h3>【决策/选型表】AI 辅助编程语言选型指南</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>真实工程 Agent 任务（RFC 实现、大型重构）</td><td>主流静态语言（Rust/Go 等）</td><td>ultra 档位静态语言综合表现更优</td><td>迷信动态语言 Token 榜单</td><td>玩具题结论不能外推</td></tr>
    <tr><td>低算力预算、快速原型</td><td>动态语言可尝试</td><td>medium 档位确实略占优</td><td>假设低预算结论适用于生产</td><td>算力档位一变结论就反转</td></tr>
    <tr><td>安全敏感、不可信输入解析</td><td>Rust 或带审计流程的静态语言</td><td>C/C++ 隐藏安全返工成本极高</td><td>只看首轮 Token 数选 C</td><td>审计修复可能远超生成成本</td></tr>
    <tr><td>冷门稠密语言（J/Clojure/Elixir）</td><td>谨慎，仅作实验</td><td>真实任务表现普遍不佳</td><td>照搬「AI 最爱语言」社媒结论</td><td>训练数据稀缺是硬约束</td></tr>
    <tr><td>跨语言基准测试引用</td><td>核查原始脚本与环境</td><td>符号链接类 Bug 可完全扭曲排名</td><td>直接转发排行榜不做溯源</td><td>评测基础设施比语言本身更致命</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】跨语言 Agent 评测常见陷阱</h3>
  <p><strong>坑 1：可执行文件路径写错</strong>——Rust 因 <code>../../minigit</code> 不存在而失败。<strong>解法：</strong>每个语言独立验证二进制路径。<strong>严重程度：</strong>致命（结论完全失真）。</p>
  <p><strong>坑 2：Agent 自行修复污染后续测试</strong>——Go Agent 创建符号链接导致所有语言跑同一二进制。<strong>解法：</strong>每次运行隔离文件系统。<strong>严重程度：</strong>致命。</p>
  <p><strong>坑 3：工具链配置不一致</strong>——Rust 缺 rustfmt/Clippy、汇编缺 GDB。<strong>解法：</strong>统一环境清单并记录版本。<strong>严重程度：</strong>小心（局部拉低某语言成绩）。</p>
  <p><strong>坑 4：只用 Rosetta Code 小题</strong>——70 Token 题撑不起工程结论。<strong>解法：</strong>至少引入 RFC 级或 TDD 级任务。<strong>严重程度：</strong>致命（结论方向错误）。</p>
  <p><strong>坑 5：忽略安全返工成本</strong>——C/C++ 首轮 Token 少但审计贵。<strong>解法：</strong>合并计算全生命周期 Token。<strong>严重程度：</strong>小心（低估静态语言真实优势）。</p>
</div>

<div class="card">
  <h3>【心法/原则卡】审慎克制——拒绝「某语言天生适合 AI」的强论断</h3>
  <p><strong>原则：</strong>「技术圈常识来得快，验证得慢」——任何基于一两个任务得出的语言优劣强结论，都需要打上问号。</p>
  <p><strong>为什么重要：</strong>Danluu 明确反对把 Scala 在单次评测中的排名当作「战胜其他语言」的证据；样本量远不足以盖棺定论。</p>
  <p><strong>怎么落地：</strong>① 不因「Rust 费 Token」传言放弃 Rust；② 语言选型看任务复杂度与算力档位，不看社媒榜单；③ 自建评测时隔离环境、多任务多档位；④ 把内存安全返工纳入成本模型。</p>
  <p><strong>适用边界：</strong>研究仍处早期——测试技巧有效性、各语言 Bug 修复成本、长期维护成本等仍缺公开数据。</p>
  <div class="quote">「目前没有证据支持某语言天生更适合 AI 编程这类强结论。」</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Python 优先的「快速交付」派 / 动态语言拥趸</p>
  <p class="rebuttal-text">两组评测、两个作者、有限算力档位——样本窄到连统计显著性都谈不上，你们拿它推翻整条鄙视链，不过是把另一种偏见包装成「硬核实测」。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>「动态语言更省 Token」只在 Rosetta Code 式小题或 medium 低算力档位勉强成立，真实工程任务下结论瓦解甚至反转</li>
    <li>Danluu 用 Zstd RFC 解码器和 Pandoc TDD 两组评测证明静态与动态语言无强相关性</li>
    <li>Rust 曾被 mame 评测的符号链接路径 Bug 冤枉，修复后满分，所有权模型拖累论证据不足</li>
    <li>C/C++ Agent 代码普遍存在内存安全问题，达到 Rust 级安全水位的隐藏返工成本被主流比较忽略</li>
    <li>语言 GitHub 流行度与 Agent 表现弱到中等正相关，Rust 等主流语言由此受益</li>
  </ol>
  <p style="margin-top:20px"><strong>行动清单：</strong></p>
  <ol>
    <li>团队语言选型时引用跨语言 Agent 评测前，先核查测试脚本路径、环境隔离与工具链一致性</li>
    <li>评估 Token 效率时合并「生成 + 安全审计/修复」全生命周期成本，尤其对 C/C++ 输出</li>
    <li>自建 Agent 评测至少准备 medium / ultra 两档算力与两类不同复杂度任务</li>
    <li>不因社媒「AI 最爱语言」榜单放弃 Rust 等主流静态语言</li>
    <li>持续关注 Danluu 等独立评测者的后续数据，避免把早期结论当作终局答案</li>
  </ol>
  <p style="margin-top:20px"><strong>关键认知转变：</strong>AI 编程时代的语言效率不是「动态 vs 静态」的二元鄙视链，而是「评测任务复杂度 × 算力档位 × 安全水位 × 训练数据流行度」的多维函数——Rust 不是天生最贵，而是被错误评测和不完整成本模型长期误解。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
