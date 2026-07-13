import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'spf13-idiomatic-go.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:36px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-right:8px}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#ffedd5;color:#9a3412}
.tag-purple{background:#ede9fe;color:#6b21a8}
.tag-red{background:#fee2e2;color:#991b1b}
.card{background:#fff;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border-left:5px solid #3b82f6}
.card h3{font-size:22px;font-weight:700;color:#1e40af;margin-bottom:12px}
.card p{font-size:16px;line-height:1.8;color:#475569;margin-bottom:10px}
.card .highlight{background:#fef3c7;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#92400e;border-left:4px solid #f59e0b}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5;color:#991b1b}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}`;

const body = `
<h1>spf13 的 Idiomatic Go 信仰</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">go-skills</span>
  <span class="tag tag-green">Idiomatic Go</span>
  <span class="tag tag-orange">AI 编程智能体</span>
  <span class="tag tag-purple">Clear is better than clever</span>
</div>
<p class="subtitle">本文解决的核心问题是：当 Java/Spring Boot 式分层、worker pool 和重型 mock 被包装成「Go 最佳实践」并污染 AI 训练语料时，spf13 的 go-skills 如何用「清晰胜于巧妙」这条黄金法则，为 AI 和人类开发者划定一份可执行的地道 Go 工程标准。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">idiomatic Go 价值排序链</h3>
  <div class="diagram">
    <div class="node-red">Java 式包袱<br><span style="font-size:11px;font-weight:400">service/repository/mock</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">AI 反射生成<br><span style="font-size:11px;font-weight:400">Java-in-Go-syntax</span></div>
    <span class="arrow-sym">→</span>
    <div class="node">Clear &gt; Clever<br><span style="font-size:11px;font-weight:400">删抽象不增层</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">领域包 + 标准库<br><span style="font-size:11px;font-weight:400">扁平可预测</span></div>
    <span class="arrow-sym">→</span>
    <div class="node-green">go-spec-reviewer<br><span style="font-size:11px;font-weight:400">设计阶段检验</span></div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">Steve Francia (spf13) · Cobra/Viper/Hugo 作者 · 前 Google Go 核心团队</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「大项目就该照搬 golang-standards/project-layout 的 internal/service/repository 分层」——spf13 认为这不是 Go 模式，而是套了 Go 语法外壳的 Java 模式；对应用而言 internal/ 大多只是徒增路径深度，整洁架构式分层反而逼出循环导入和过度接口。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】go-skills 与「地道 Go」</h3>
  <p><strong>在讲什么问题：</strong>Go 流行后，Java/Spring Boot 的结构性包袱被搬进 Go 并包装成最佳实践，LLM 训练语料进一步放大这一趋势，AI 智能体默认生成 Java-in-Go-syntax。</p>
  <p><strong>核心机制：</strong>spf13 开源 go-skills Agent Skill 合集，面向 AI 编程智能体提供矫正教材；内含 go-spec-reviewer 等子技能，把 idiomatic Go 原则落成设计阶段可执行的检查表。</p>
  <p><strong>关键理解：</strong>idiomatic Go 不该是 code review 时才发现的问题，而应在设计阶段就被结构化检验；AI 能否写出地道代码，最终取决于人是否理解并坚持这套判断标准。</p>
  <p><strong>典型场景：</strong>用 Claude Code/Copilot 写 Go 微服务、CLI 工具；审查 AI 生成的项目结构和并发代码。</p>
  <p><strong>边界说明：</strong>文章聚焦工程哲学与代码组织，不深入 Agent Skill 工程机制本身；大型遗留系统迁移需结合团队现状渐进调整。</p>
  <div class="quote">原文：「随着 Go 越来越流行，开发者们正在把其他语言——尤其是 Java 和 Spring Boot——的结构性包袱搬进来，还把它们包装成最佳实践。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】Java 式分层 vs 领域包组织</h3>
  <table>
    <tr><th>对比维度</th><th>Java/Spring 式分层</th><th>spf13 领域包</th><th>一句话结论</th></tr>
    <tr><td>包命名</td><td>service/、repository/、controller/</td><td>auth/、billing/、jobs/、web/</td><td>按「做什么」命名，不按「哪一层」命名</td></tr>
    <tr><td>目录深度</td><td>internal 嵌套 + 多层分层</td><td>只深一层，main 做装配</td><td>扁平优先，循环依赖是边界划错信号</td></tr>
    <tr><td>接口策略</td><td>预先设计大接口 + mock 框架</td><td>消费者定义小接口（1–3 方法）</td><td>接口是被发现的，不是预先设计的</td></tr>
    <tr><td>并发模型</td><td>静态 worker pool + mutex</td><td>channel 编排 + errgroup.SetLimit</td><td>channel 编排执行，mutex 串行化执行</td></tr>
    <tr><td>测试风格</td><td>Ginkgo BDD + 重型 mock 生成</td><td>表驱动 + fake/stub + afero 内存 FS</td><td>Go 测试就该是写 Go 代码，不是引入 DSL</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】九条 idiomatic Go 落地路径</h3>
  <p><strong>① 包组织：</strong>单包起步 → internal/ 谨慎用 → 领域包只深一层；handler 和模板放 web/，jobs 创建与 worker 处理同包。</p>
  <p><strong>② 接口：</strong>先写具体类型；接口定义在消费者侧；入参小接口（io.Reader），出参具体结构体。</p>
  <p><strong>③ 错误：</strong>错误是值不是异常；fmt.Errorf 附加上下文；尽早返回，happy path 不缩进。</p>
  <p><strong>④ 并发：</strong>用 channel 传数据而非 mutex 护共享数据；限制并发用 errgroup.SetLimit；每个 goroutine 有明确关闭路径。</p>
  <p><strong>⑤ 测试：</strong>表驱动 + t.Run()；fake/stub 替代重型 mock；afero.NewMemMapFs() 消除磁盘 I/O；并发测试用 synctest 而非 time.Sleep。</p>
  <p><strong>⑥ 泛型：</strong>消除重复算法，不搭类型体系；禁止泛型 repository/service 基类。</p>
  <p><strong>⑦ 标准库：</strong>Go 1.21+ 用 slices/maps/cmp/errors.Join；Go 1.22+ ServeMux 原生路径参数；http.Server 必须设超时防 slow-loris。</p>
  <p><strong>⑧ CLI：</strong>Command-First 架构，Cobra/Viper 约定；测试用 cobra 的 ExecuteC() 而非编译二进制。</p>
  <p><strong>⑨ 审阅：</strong>go-spec-reviewer 按 Rob Pike / stdlib / spf13 三重视角检查设计文档。</p>
  <div class="highlight"><strong>标准库路由示例：</strong>mux.HandleFunc("GET /users/{id}", handler) —— 自 Go 1.22 起无需 gorilla/mux 或 chi 处理基础路由。</div>
</div>

<div class="card">
  <h3>【决策/选型表】何时该用什么方案</h3>
  <table>
    <tr><th>场景</th><th>推荐方案</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>微服务/简单工具起步</td><td>根目录单包或与 main.go 平级</td><td>只有真正需要新命名空间时才拆包</td><td>一上来就 project-layout 全套</td><td>徒增导航成本，无清晰度收益</td></tr>
    <tr><td>限制并发抓取 URL</td><td>errgroup.WithContext + SetLimit</td><td>标准库方案，语义清晰</td><td>手搓信号量或静态 worker pool</td><td>Go 调度器已够高效，pool 是反模式</td></tr>
    <tr><td>HTTP 路由（基础 CRUD）</td><td>net/http ServeMux (Go 1.22+)</td><td>原生方法级路由和路径参数</td><td>反射推荐 chi/gorilla/mux</td><td>LLM 训练数据滞后，中间件只是函数组合</td></tr>
    <tr><td>文件系统测试</td><td>接口 + afero.NewMemMapFs()</td><td>内存跑测试，消除 flaky I/O</td><td>业务深处硬编码 os 包</td><td>慢、不稳定，违背测试透明原则</td></tr>
    <tr><td>泛型使用</td><td>3+ 类型重复同一算法时泛化</td><td>Map[S,T] 消除重复逻辑</td><td>Repository[T] 泛型接口</td><td>本质仍是 Java 式多态，不是 Go 泛型</td></tr>
    <tr><td>CLI 应用测试</td><td>cobra ExecuteC() 直接调</td><td>不编译二进制，测试快且透明</td><td>编译出二进制再 exec 测试</td><td>慢、脆弱，spf13 明确列为反模式</td></tr>
  </table>
</div>

<div class="card">
  <h3>【避坑清单卡】AI 生成 Go 代码的高频陷阱</h3>
  <p><strong>坑名：</strong>LLM 反射推荐 gorilla/mux/chi 处理 trivial 路由，忽略 Go 1.22+ 标准库能力。</p>
  <p><strong>原因：</strong>训练数据滞后，第三方库示例远多于新标准库文档。</p>
  <p><strong>解法：</strong>路由选型前先查当前 Go 版本标准库能力；只有需要具名路由生成或正则约束时才上第三方框架。</p>
  <p><strong>严重程度：</strong>小心——功能可用但引入不必要依赖。</p>
  <div class="pitfall"><strong>http.ListenAndServe 无超时：</strong>AI 生成服务器几乎从不设 ReadTimeout/WriteTimeout/IdleTimeout，单慢客户端可永久占连接（slow-loris）。生产必配 http.Server 超时。</div>
  <div class="pitfall"><strong>测试里 time.Sleep 等 goroutine：</strong>永远不要用 sleep 等异步；该用 synctest、channel 或显式同步，否则 flaky test 缠身。</div>
  <div class="pitfall"><strong>utils/helpers/common 包：</strong>职责不清的症状，spf13 明确禁止；出现即该追问「这个函数到底属于哪个领域」。</div>
</div>

<div class="card">
  <h3>【心法/原则卡】Clear is better than clever</h3>
  <p><strong>原则：</strong>Go 代码应以最好的方式显得「无聊」——可预测、一致、新人打开文件第一眼就能看懂；拿不准时删掉抽象，而不是加一层。</p>
  <p><strong>为什么重要：</strong>这套排序（清晰 &gt; 标准库 &gt; 简单接口 &gt; 显式错误 &gt; channel 编排）在 Effective Go、标准库源码、GopherCon 演讲中一脉相承，go-skills 把它浓缩成 AI 和人类都能执行的 checklist。</p>
  <p><strong>怎么落地：</strong>① 新项目用 go-spec-reviewer 审设计文档；② 为 AI Agent 接入 go-skills；③ code review 时问「这层抽象能删吗」；④ 每个第三方依赖对比标准库方案论证必要性。</p>
  <p><strong>适用边界：</strong>超大型遗留 Java 迁移不能一夜拍平；团队已有成熟分层需渐进演进，但新代码应拒绝继续堆 Java 式抽象。</p>
  <div class="quote">原文：「When in doubt, delete the abstraction.」——拿不准的时候，删掉那层抽象，而不是加一层。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：企业级 Java 架构师 / 「大项目必须分层解耦」派</p>
  <p class="rebuttal-text">百万行微服务没有 service/repository 分层和 mock 框架，新人根本找不到入口，spf13 的扁平领域包只适合玩具 CLI，扛不住跨团队契约治理和依赖注入。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>spf13 go-skills 针对 AI 训练语料中的 Java-in-Go-syntax 伪最佳实践，提供结构化矫正教材</li>
    <li>黄金法则 Clear is better than clever 贯穿包组织、接口、错误、并发、测试、泛型、标准库、CLI 全链路</li>
    <li>领域包（auth/billing/jobs）取代 service/repository 分层，只深一层，main 做装配</li>
    <li>标准库优先：Go 1.21–1.25 的 slices/maps/cmp/ServeMux 已覆盖 LLM 常推荐的第三方方案</li>
    <li>go-spec-reviewer 把 idiomatic Go 前移到设计阶段，像 Rob Pike 审简洁、像 stdlib 审接口、像 spf13 审 CLI</li>
  </ol>
  <p style="margin-top:16px"><strong>行动清单：</strong></p>
  <ol>
    <li>阅读 github.com/spf13/go-skills，为常用 AI Agent 接入 go-skills 或 go-spec-reviewer</li>
    <li>审查现有 Go 项目：是否存在 utils/common 包、预先设计的大接口、静态 worker pool</li>
    <li>HTTP 服务检查是否使用 Go 1.22+ ServeMux 和 http.Server 超时配置</li>
    <li>测试迁移：表驱动 + fake/stub 替代 Ginkgo/重型 mock；文件操作用 afero 内存 FS</li>
    <li>code review 新增一问：「这层抽象能删吗？标准库有没有更简单的方案？」</li>
  </ol>
  <p style="margin-top:16px"><strong>关键认知转变：</strong>「Go 最佳实践」不等于 Java 分层换语法——真正的 idiomatic Go 是清晰、可预测、标准库优先；技术品味不能外包给模型，只能内化给人，go-skills 是矫正 AI 的教材，更是资深工程师的审查心法。</p>
</div>`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
