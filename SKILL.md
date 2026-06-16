# 网页文章 → SVG 深度总结

输入为网页 URL（新闻、技术博客、教程、观点文），输出为**可纵向滚动的复习 SVG**。使用 `foreignObject` 内嵌 HTML/CSS。

## 核心输出要求（最重要）

SVG 质量取决于是否做到以下六点，缺一不可：

### 1. 不罗列名词，每张卡回答五个问题
每张卡片必须包含：**在讲什么问题 → 关键理解是什么 → 和其他概念什么关系 → 怎么落地用 → 原文依据/例子**。禁止出现"XX 是 XX 的缩写"这类空洞卡片。

### 2. 必须有落地建议
每个要点向下追问"所以呢？"——提取原文中可立刻执行的操作步骤、配置方法、命令序列。若无显式建议，从作者态度和案例中推断。

### 3. 必须有避坑总结
主动挖掘原文中的"不要"、"注意"、"踩过的坑"、"常见误区"。没有显式避坑内容时，根据作者立场推导"什么情况下不该用这个方法"。

### 4. 必须有选型/决策指南
当文章涉及多个方法/工具/方案时，生成决策对照表：什么场景选哪个、判断依据是什么、各自边界在哪。不要只并列介绍。

### 5. 必须阐明方法边界
每种方法/概念要说清楚：**适用场景的上限和下限**——什么时候能用、什么时候超出能力范围、和相邻方法的交界线在哪。

### 6. 必须有对比分析
两个以上概念并存时，强制做横向对比：维度 × 概念矩阵，点出关键差异。

---

## 六种内容卡片模板（按需组合）

根据文章类型，从以下模板中选取。每张卡片独立可读，有标题、有展开、有关联。

### 模板 A：概念拆解卡
```
标题：是什么 + 一句话定性
核心机制：用 2-3 句大白话解释怎么运作
关键理解：为什么这样设计（深层原因）
典型场景：什么时候用它
边界说明：什么时候不该用它
原文依据：引原文关键句
相关概念：和 X 的区别/联系
```

### 模板 B：方法/工具卡
```
方法名 + 标签（适用场景标签）
核心思路：一句话
操作步骤：1→2→3→4 流程
选型条件：什么情况下选它而非别的
避坑：原文提到的陷阱或反模式
对比相邻方法：和 Y 的关键差异
原文引用
```

### 模板 C：避坑清单卡
```
坑名：一句话描述现象
原因：为什么会踩
原文说法：作者原话
解法：怎么避免或修复
严重程度：致命/小心/可忽略
```

### 模板 D：决策/选型表
```
场景 | 推荐方案 | 核心理由 | 不推荐的方案 | 为什么不行
（至少覆盖 3 个不同场景）
```

### 模板 E：跨概念对比表
```
对比维度 | 概念A | 概念B | 概念C | 一句话结论
（至少 3 维度 × 2 概念）
```

### 模板 F：心法/原则卡
```
原则：一句可记住的话
为什么重要：反面案例
原文支撑
怎么落地：具体操作
适用边界：什么情况例外
```

---

## 文首总览区要求

无论文章类型，文首必须包含：

1. **标题** + 2-4 个分类标签
2. **一句话概括**：用"本文解决的核心问题是……"开头，**必须根据正文实质撰写，禁止直接使用抓取到的元数据**
3. **核心概念关系图**：用 HTML/CSS div+flex 绘制节点+箭头图，展示文章主题下各概念的依赖/递进/并列关系
4. **认知纠偏**（如原文存在常见误解）：在关系图下方用醒目样式标注

---

## 结论区要求

固定三段式：
1. **总结**：3-5 条要点提炼，合并同类项
2. **行动清单**：读完这篇文章后可以立刻做的 3-5 件事
3. **关键认知转变**（如有）：这篇文章改变了什么固有认知

---

## 处理流程

### 单篇文章
```
1. WebFetch 抓取原文
2. 阅读并标注：提取核心论点、方法、数据、坑点、作者态度
3. 选择卡片模板组合（从上面六种中选取合适的 3-5 种）
4. 写 Node .mjs 脚本生成 SVG（import { buildSvg } from './svg-auto-height.mjs'）
5. 执行脚本，验证 SVG 完整可滚动
```

### 多篇文章（批量）
当有多个 URL 时，可以并行处理：
```
1. 为每篇文章生成独立的 SVG
2. 全部完成后输出汇总表（文件路径 + 高度 + 主题）
```

### 更新 index.json
```
1. 先读取现有 index.json，保留所有历史条目
2. 在数组最前面插入当日新条目（不要覆盖整文件）
3. 每条记录格式：
   { "path": "svgs/YYYY-MM-DD/slug.svg", "title": "文章标题", "source": "原文 URL" }
4. source 为抓取时的原文链接，供首页 [原文] 尾标使用
```

---

## SVG 生成技术要求

- 使用 `import { buildSvg } from './svg-auto-height.mjs'` 自动测高（仓库根目录有该文件）
- 宽度固定 `1320`，高度由 buildSvg 自动测量（已含 50% 缓冲）
- 字体 `"PingFang SC","Microsoft YaHei",sans-serif`
- 脚本输出到 `svgs/YYYY-MM-DD/` 目录下
- 脚本命名为 `generate-{主题slug}.mjs`
- rsvg-convert / Inkscape 不能正确渲染 foreignObject，勿用

### 脚本模板

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from './svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, '主题名.svg');

const CSS = `/* CSS here */`;

const body = `<!-- HTML content here -->`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
```

### 参考 CSS（精华版）

```css
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;background:linear-gradient(135deg,#f8fafc,#e2e8f0);padding:48px 60px;color:#1e293b}
h1{font-size:38px;font-weight:900;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
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
.diagram{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;padding:20px 0}
.node{background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #93c5fd;border-radius:16px;padding:20px 28px;text-align:center;min-width:160px;font-weight:700;font-size:16px;color:#1e40af}
.node-green{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;color:#065f46}
.node-orange{background:linear-gradient(135deg,#fff7ed,#ffedd5);border-color:#fdba74;color:#9a3412}
.arrow-sym{font-size:24px;color:#94a3b8}
.conclusion{background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border-radius:20px;padding:36px;margin-top:24px}
.conclusion h2{font-size:26px;margin-bottom:16px}
.conclusion p{font-size:16px;line-height:1.8;opacity:0.95}
.conclusion ol li{font-size:16px;line-height:2;opacity:0.95;margin-left:20px}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15px}
th{background:#f1f5f9;padding:12px 16px;text-align:left;font-weight:700;color:#1e40af;border-bottom:2px solid #cbd5e1}
td{padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#475569;vertical-align:top}
.correction{background:#fef3c7;border:2px solid #f59e0b;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center}
.correction h3{color:#92400e;margin-bottom:8px}
.subtitle{font-size:17px;color:#64748b;margin-bottom:32px;line-height:1.6}
```

---

## 文章类型识别与策略

根据抓取后的内容，自动判断类型并侧重不同卡片模板：

| 文章类型 | 识别特征 | 优先模板 | 侧重 |
|---------|---------|---------|------|
| 技术教程 | 含代码、步骤、命令 | B(方法卡)+C(避坑)+D(选型) | 落地操作 |
| 观点/趋势文 | 含"我认为"、趋势判断 | A(概念拆解)+F(心法)+E(对比) | 认知转变 |
| 工具介绍 | 介绍某产品/工具 | B(方法卡)+D(选型)+C(避坑) | 上手路径 |
| 理论/方法论 | 含学术框架、模型 | A(概念拆解)+E(对比)+F(心法) | 边界与关系 |
| 综述/盘点 | 含列表、分类 | D(选型表)+E(对比表)+A(概念拆解) | 全景对比 |

---

## 正文清洗与一句话总结（必做）

WebFetch 抓取后、写 subtitle 前，**必须先剔除以下 boilerplate**，不得写入总结：

| 类型 | 典型内容 | 处理方式 |
|------|----------|----------|
| 永久链接 | `本文永久链接 – https://...` | 整段丢弃 |
| 作者开场 | `大家好，我是Tony Bai。` | 丢弃 |
| 页脚推广 | 二维码、知识星球、商务合作、© 版权 | 丢弃 |
| 占位句 | `本文围绕核心问题展开，提炼关键理解…` | 禁止作为总结 |

**一句话总结写法：**

1. 阅读正文前 3-5 段（跳过上述 boilerplate 后）
2. 提炼「读者最该搞懂什么」——可用原文中的设问句（如「为什么…？」）
3. 写成：`本文解决的核心问题是：……`（15 字以上，不含 URL）

**生成后必查（命中任一则不合格）：**

- subtitle 含 `本文永久链接`、`永久链接`、`https://`
- subtitle 仅为泛化占位句
- 「本文解决的核心问题是：」后面紧跟 URL 或「本文…」

仓库提供 `article-content-utils.mjs`（`isBadSubtitle`、`extractParagraphs`、`buildSubtitleFromArticle`）供脚本校验；批量修复历史文件运行 `node fix-bad-subtitles.mjs`。

---

## 质量自检清单

生成 SVG 前自查：

- [ ] 一句话总结不含链接/永久链接/占位句，且基于正文实质
- [ ] 每张卡片能回答"在问什么、关键理解、怎么用"
- [ ] 至少包含 1 处落地建议（可执行的操作步骤）
- [ ] 至少包含 1 处避坑总结（不该做什么）
- [ ] 涉及多方法时有选型/决策表
- [ ] 每个概念都说明了适用边界
- [ ] 多概念间有对比表
- [ ] 文首有概念关系图
- [ ] 结论区有三段式（总结+行动+认知转变）
- [ ] SVG 高度正常、XML 无错配标签
