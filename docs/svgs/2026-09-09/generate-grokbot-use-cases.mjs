import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'grokbot-use-cases.svg');

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:34px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.card .relation{background:#f0fdf4;padding:10px 14px;border-radius:10px;margin:8px 0;font-size:14px;color:#166534}
.card .pitfall{background:#fef2f2;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#991b1b;border-left:4px solid #ef4444}
.card .quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin:12px 0;font-size:15px;color:#475569;border:1px dashed #cbd5e1;font-style:italic}
.map{background:#fff;border-radius:20px;padding:36px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.diagram{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:14px 18px;text-align:center;min-width:100px;font-weight:700;font-size:13px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.node-purple{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border-color:#c4b5fd;color:#6b21a8}
.arrow-sym{font-size:18px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p,.conclusion ol li{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.rebuttal{background:#fdf2f8;border:2px solid #db2777;border-radius:16px;padding:28px 32px;margin-bottom:24px}
.rebuttal h3{color:#9d174d;margin-bottom:12px;font-size:22px;font-weight:700}
.rebuttal-role{font-size:14px;color:#be185d;font-weight:600;margin-bottom:10px}
.rebuttal-text{font-size:17px;line-height:1.8;color:#831843}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:14px;color:#1e40af}`;

const body = `
<h1>搜出来是「48 小时翻百倍」，点开清单却是邮件归类和填表——Grok Bot 九类真实场景与资源库</h1>
<div style="margin-bottom:16px">
  <span class="tag tag-blue">Grok Bot</span>
  <span class="tag tag-green">Agent 自动化</span>
  <span class="tag tag-orange">九类场景</span>
  <span class="tag tag-purple">开源资源</span>
</div>
<p class="subtitle">本文解决的核心问题是：Grok Bot 在公开用例索引里真实在跑的是哪九类活、每类有哪些可核对的工作量数字、以及面对营销声量与真实分布的落差，不同身份该从哪个场景起手、去哪里找可验证的模板与社区资源。</p>

<div class="map">
  <h3 style="font-size:20px;color:#1e40af;margin-bottom:12px;text-align:center">九类真实场景与 grokbot.dev 分布（2026-09-09 核对）</h3>
  <div class="diagram">
    <div class="node">邮件收件箱<br>195 条 Pulse</div>
    <span class="arrow-sym">→</span>
    <div class="node-green">浏览器杂务<br>无 API 系统</div>
    <span class="arrow-sym">→</span>
    <div class="node-orange">研究持久化<br>归档打标</div>
    <span class="arrow-sym">→</span>
    <div class="node-purple">会议/支持/编排<br>人留决策权</div>
  </div>
  <div class="diagram" style="margin-top:12px">
    <div class="node">内容流水线</div>
    <span class="arrow-sym">+</span>
    <div class="node-green">财务运营</div>
    <span class="arrow-sym">+</span>
    <div class="node-orange">个人事务 30 条</div>
    <span class="arrow-sym">≠</span>
    <div class="node-purple" style="border-color:#ef4444;color:#991b1b">交易/crypto 仅 2 条</div>
  </div>
  <p style="text-align:center;color:#64748b;font-size:15px;margin-top:12px">日常工作 34 · 个人 30 · 营销 22 · 工程 18 · 销售 9 · 财务 8 · 支持 6 · 交易几乎缺席</p>
</div>

<div class="correction">
  <h3>认知纠偏</h3>
  <p style="color:#92400e;font-size:16px">常见误解：「Grok Bot 最该用来搞自动交易/crypto 赚钱」。但 grokbot.dev 用例索引里交易和加密货币只有 2 条，日常工作 34、个人 30、营销 22、工程 18——声量最大的自动赚钱帖，和真实在跑的活，不是同一张图。判据应看工作量数字（处理了 625 条目、九万封邮件），而非收益数字（48 小时翻多少倍）。</p>
</div>

<div class="card">
  <h3>【概念拆解卡】邮件与收件箱——最该选的第一个场景</h3>
  <p><strong>在讲什么问题：</strong>为什么九类里邮件/收件箱是公认的最佳起手式。</p>
  <p><strong>核心机制：</strong>工作量可以极大，结果极容易检查——归错类一眼看得出来，代价接近于零。</p>
  <p><strong>关键理解：</strong>有用的是流程本身：按发件人归类、垃圾与敏感分开、分批处理、拿不准的留着不动——「拿不准就别动」比任何提示词技巧都管用。</p>
  <p><strong>典型场景：</strong>Grok Bot Pulse 邮件分类目前 195 条；Mike P 把约九万封邮件（跨两个 Gmail）交给 Bot，百万浏览背后是这套可复刻流程。</p>
  <p><strong>边界说明：</strong>别只盯收件箱清零，真正价值是可持续的分类与过滤规则，而非一次性大扫除。</p>
  <div class="quote">原文：「拿不准就别动——这条写进描述，比任何提示词技巧都管用。」</div>
</div>

<div class="card">
  <h3>【跨概念对比表】grokbot.dev 真实分布 vs 搜索叙事</h3>
  <table>
    <tr><th>分类</th><th>grokbot.dev 条目</th><th>gtemplate.net 公开 Bot</th><th>一句话结论</th></tr>
    <tr><td>日常工作</td><td>34</td><td>工作 357</td><td>最大真实集群</td></tr>
    <tr><td>个人事务</td><td>30</td><td>个人 225</td><td>声量低但用量高</td></tr>
    <tr><td>市场营销</td><td>22</td><td>创意 102</td><td>内容管线为主</td></tr>
    <tr><td>工程</td><td>18</td><td>—</td><td>编排而非写码</td></tr>
    <tr><td>交易/crypto</td><td>2</td><td>—</td><td>营销帖 ≠ 真实用例</td></tr>
    <tr><td>官方市场</td><td>—</td><td>69 模板 / 43 作者</td><td>精选可安装入口</td></tr>
  </table>
</div>

<div class="card">
  <h3>【方法/工具卡】浏览器杂务与研究持久化</h3>
  <p><strong>方法名：</strong>登录操作界面 · 标签：无 API 系统 / 持久归档</p>
  <p><strong>核心思路：</strong>Bot 是登录进去而非调接口，能触达老运营工具、供应商门户、遗留会计系统——传统自动化做不到的事。</p>
  <p><strong>操作步骤（浏览器）：</strong>1) 在现有老系统上试自动化 → 2) 量出哪里真的变快 → 3) 用证据决定是否换底层系统（顺序可颠倒）→ 4) 有插件的场景优先用插件（浏览器路线本身较脆）</p>
  <p><strong>操作步骤（研究）：</strong>单个问题用普通聊天更快；需活数周的研究系统才轮到 Bot——差别在「持久」：持续归档、打标签、总结和更新。</p>
  <div class="highlight"><strong>可核对实例：</strong>Price Foulger 两天填许可、预约检查、发保险通知；Gaurav Munjal 十年会议历史整理成人脉库，跑 2.5 小时录入约一千人（前三年）。</div>
  <div class="pitfall"><strong>避坑：</strong>浏览器自动化遇验证码/门户改版易断；研究类别指望 Bot 回答单个问题，价值在长期资料系统。</div>
</div>

<div class="card">
  <h3>【场景组合卡】会议 · 支持 · 编程编排（456 类）</h3>
  <p><strong>会议前后：</strong>烦人的在会前会后且散在多工具——Krista Letz 横跨 CRM、邮箱、Slack、Granola、Gong 产出每场简报；会后纪要带日期跟进清单。模板 Meeting Recap Deck 把记录变汇报幻灯片，不编造引语。</p>
  <p><strong>客服支持：</strong>读→查→应用规则→出结果的标准形状。Gergely Orosz 接客服邮箱+支付系统处理退款：识别请求→找交易→对照政策→执行或<strong>升级给人</strong>——第五步是安全阀，grokbot.dev 支持类仅 6 条但已「真的动了钱」。</p>
  <p><strong>编程周边：</strong>最值得抄的做法是让 Bot <strong>别写你的仓库</strong>。Kun Chen 的 Firstmate Bot 运营软件工厂，下属启动云端编程会话，<code>grok-ship</code> 开源架构分类处理 625 条目（331 问题 + 294 PR）；两层理由：共享云端电脑不被编译测试拖慢 + 合并判断留人手里。Grok Bot 不索引代码仓库。</p>
</div>

<div class="card">
  <h3>【场景组合卡】内容流水线 · 财务运营 · 个人事务（789 类）</h3>
  <p><strong>内容生产：</strong>它做流水线，不做主编。Ridark 七个命名 Bot 跑内容日历，首周 25 篇交 14 篇草稿，发布仍人点头。交给它：研究选题、复用素材、搬文件、维持管线；留给自己：定说什么、判断版本、拍板发不发。</p>
  <p><strong>财务运营：</strong>量在这里——每月几百张收据/工单/发票。官方费用角色写法：返回汇总和草稿，<strong>不要发送、不要修改报销</strong>；每条例外引用政策条款，总额对回原始数据。Haggle Bot 盘点订阅、起草还价，花钱签字等人。</p>
  <p><strong>个人事务：</strong>公开讨论声量最低但 grokbot.dev 30 条、gtemplate 225 个——规则清楚、重复发生、错了看得见。Lenny「Be Happier」Bot 每周从邮箱日历给三件具体事（10.6 万浏览）。</p>
  <div class="relation"><strong>共同特征：</strong>规则清楚、重复发生、错了看得见——完全符合该交出去的标准。</div>
</div>

<div class="card">
  <h3>【决策/选型表】从哪开始选第一个场景</h3>
  <table>
    <tr><th>你的身份</th><th>建议第一个场景</th><th>核心理由</th><th>不推荐</th><th>为什么不行</th></tr>
    <tr><td>个人用户</td><td>个人事务或收件箱</td><td>规则清楚、错了看得见、投入产出比高</td><td>crypto 自动交易</td><td>用例索引仅 2 条，收益不可验证</td></tr>
    <tr><td>有生意在跑</td><td>财务运营量最大一环</td><td>每月几百张单据，规则不变</td><td>让 Bot 直接发送/修改</td><td>有后果动作必须挡在外面</td></tr>
    <tr><td>做支持/客服</td><td>约束紧的退款/查询流程</td><td>读查规则出结果 + 升级阀</td><td>无人工升级阀</td><td>前四步再好也不能上线</td></tr>
    <tr><td>做内容</td><td>生产环节</td><td>研究/素材/管线可自动化</td><td>编辑决定权全交</td><td>决定说什么还差得远</td></tr>
    <tr><td>做开发</td><td>问题分类与信息整理</td><td>编排云端会话，合并留人</td><td>让 Bot 写仓库</td><td>拖慢共享电脑 + 无代码索引</td></tr>
  </table>
  <div class="highlight"><strong>共同起手式：</strong>范围小到全错了也不心疼，只整理不让它动手，跑顺了再逐步放宽。</div>
</div>

<div class="card">
  <h3>【资源清单卡】社区仓库与模板目录</h3>
  <table>
    <tr><th>资源</th><th>规模（2026-09-09）</th><th>适合谁</th></tr>
    <tr><td>grokbot.dev/use-cases</td><td>按分类列真实用例（非商店）</td><td>核对本文九类数字与原文出处</td></tr>
    <tr><td>官方市场</td><td>69 公开模板 / 43 作者 / 9 分类</td><td>要装就从官方域名装</td></tr>
    <tr><td>gtemplate.net</td><td>744 公开 Bot（工作 357 / 个人 225）</td><td>最大第三方目录，热度≠安装量</td></tr>
    <tr><td>grokmarket.io</td><td>489 模板 / 248 次 Add</td><td>看「有人真的点过 Add」</td></tr>
    <tr><td>RongleCat/awesome-grok-bot</td><td>263 星 / 703 条</td><td>中英日对照追踪官方文档</td></tr>
    <tr><td>grokbotskills.vercel.app</td><td>195 份技能剧本 / 11 分类</td><td>按任务翻 SKILL.md 作业手册</td></tr>
  </table>
  <div class="pitfall"><strong>别混淆：</strong>xai-org/plugin-marketplace 是 Grok Build 插件市场；rdmgator12/awesome-grok-connectors 是 grok.com 网页版连接器——都不是 Grok Bot 模板/插件目录。</div>
</div>

<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：crypto 自动交易 hype 派 · 「48 小时翻百倍」叙事</p>
  <p class="rebuttal-text">Grok Bot 的真正价值在于自动盯盘、链上套利、24/7 无人值守交易——邮件归类和填表只是保守玩家的玩法，错过 crypto 就是用错产品。公开用例里交易类只有 2 条，恰恰说明大多数人还没觉醒，先发优势窗口仍在。</p>
</div>

<div class="conclusion">
  <h2>结论</h2>
  <p><strong>总结：</strong></p>
  <ol>
    <li>grokbot.dev 真实分布以日常工作 34、个人 30、营销 22、工程 18 为主，交易/crypto 仅 2 条——营销声量最大的自动赚钱帖与可核对清单不是同一张图。</li>
    <li>九类场景各有可核对工作量数字：邮件 195 条 Pulse / 九万封、浏览器填表、研究 2.5 小时录入千人、grok-ship 625 条目、内容首周 14/25 草稿等。</li>
    <li>设计安全阀是共性：拿不准别动、升级给人、返回草稿不发送、政策条款可反查——有后果的动作必须挡在人外面。</li>
    <li>资源分三层：官方市场 69 模板可装、gtemplate 744 个第三方目录、awesome 系列仓库与 195 份技能剧本供抄配置。</li>
    <li>判据看工作量数字能否复核，而非收益数字——处理了 625 条目可质疑，48 小时翻多少倍无法验证。</li>
  </ol>
  <p><strong>行动清单：</strong></p>
  <ol>
    <li>从邮件/收件箱或与你身份匹配的第一场景起手，范围小到全错也不心疼。</li>
    <li>描述 Bot 时写全四样：去哪取信息、产出什么、结果长什么样、不许做什么。</li>
    <li>支持/财务类流程必须设人工升级阀，有后果动作（发送、改账、合并代码）留人审批。</li>
    <li>开发场景用 grok-ship 式编排：Bot 运营工厂，云端会话写码，合并判断回人。</li>
    <li>装模板前过一遍已知限制与安全边界，社区资源按陌生开源软件标准审一遍。</li>
  </ol>
  <p><strong>关键认知转变：</strong>「Grok Bot 能干什么」的答案不在搜索第一条爆款帖里，而在 grokbot.dev 可点开核对的九类真实场景——它是登录操作界面的持久 Agent，不是 crypto 印钞机；价值在可验证的工作量，不在不可验证的收益叙事。</p>
</div>
`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
