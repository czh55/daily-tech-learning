# 每日技术增量学习 — 完整 Automation Prompt

> 本文档为 Cursor Automation 的完整 prompt 备份。  
> SVG 生成细节以仓库根目录 `SKILL.md` 为准；本文档与之同步（含「反驳」模块）。

---

## 名称

每日技术增量学习

## 描述

每天自动抓取 AI/大模型领域顶级博主的最新文章，按仓库根目录 `SKILL.md` 规范生成深度总结 SVG，提交到 GitHub Pages，日积月累构建知识库。

## 触发

每天上午 9:00（cron: `0 9 * * *`）

## 工具

启用 Shell、GitHub 读写（仓库 `daily-tech-learning`）

---

## 执行流程

### 步骤 0：读取规范

**首先阅读仓库根目录的 `SKILL.md` 文件，所有后续的 SVG 生成必须严格遵循该文件中的全部规范**——包括六点硬性质量要求、六种卡片模板（A-F）、文首总览区结构、**反驳区**、结论区三段式、CSS 样式、脚本模板和质量自检清单。SVG 生成使用 `./svg-auto-height.mjs`（也在仓库根目录）。

### 步骤 1：环境准备

`git pull` 拉取最新代码。

### 步骤 2：判重

检查 `svgs/<今天日期>/` 目录是否已存在且包含 SVG 文件。若已存在则跳过本次运行。

### 步骤 3：抓取文章列表

用 WebFetch 逐个抓以下博主主页，提取**今天**发布的最新文章 URL：

| 博主 | 主页 URL |
|------|----------|
| Tony Bai | https://tonybai.com/ |
| 翔宇工作流 | https://xiangyugongzuoliu.com/ |
| 李继刚 | https://www.lijigang.com/ |
| 老石谈芯 | https://shilicon.com/ |
| SIo_2 | https://www.cnblogs.com/sio2zyh |
| 风雨中的小七 | https://www.cnblogs.com/gogoSandy |
| 乘风gg | https://juejin.cn/user/4248168658899741/posts |
| 大模型真好玩 | https://juejin.cn/user/3140624091453053 |

超时的平台记录原因后跳过。今天没有任何新文章则不提交。

### 步骤 4：批量生成 SVG

对每篇文章：

1. WebFetch 抓取原文全文
2. 按 `SKILL.md` 规范：判断文章类型 → 选 3-5 种卡片模板 → 分析内容 → **撰写反驳区**
3. 编写 `.mjs` 脚本（`import { buildSvg } from '../../svg-auto-height.mjs'`），存放到 `svgs/<今天日期>/` 目录
4. `node` 执行脚本生成 `.svg`
5. 按 `SKILL.md` 质量自检清单逐项验证

### 步骤 5：更新索引

更新 `index.json`，在最前面插入今日条目：

```json
{
  "date": "YYYY-MM-DD",
  "files": [
    {
      "path": "svgs/YYYY-MM-DD/xxx.svg",
      "title": "文章标题",
      "source": "https://原文 URL"
    }
  ]
}
```

### 步骤 6：提交推送

```bash
git add svgs/ index.json
git commit -m "每日学习: YYYY-MM-DD — N 篇文章"
git push
```

---

## 失败处理

- 今天无新文章 → 不 commit
- 部分博主抓取失败 → 只提交成功部分，commit message 注明跳过
- 全部失败 → 记录原因，不提交

---

## Git 操作要求

1. 在当前分支完成 commit 并 push
2. 用 `gh pr create` 创建 PR：`base=main`，`head=当前分支`
3. 用 `gh pr merge --merge --auto` 立即合并到 main
4. 确认 main 上已有 `svgs/` 和 `index.json` 后再结束

---

## 更新 index.json 时

1. 先读取现有 `index.json`，保留所有历史条目，**禁止覆盖整文件**
2. 在数组最前面插入当日新条目
3. 每条记录必须包含：`path`、`title`、`source`（抓取时的原文 URL）
4. 只处理当天新发布的文章，不要重跑历史日期

---

## SVG 生成规范摘要（详见 SKILL.md）

### 核心输出要求（六点）

1. **不罗列名词**：每张卡回答「在讲什么 → 关键理解 → 关系 → 怎么用 → 原文依据」
2. **必须有落地建议**：可立刻执行的操作步骤、配置、命令
3. **必须有避坑总结**：原文或推导的「不要 / 注意 / 误区」
4. **必须有选型/决策指南**：多方案时做对照表
5. **必须阐明方法边界**：适用上限与下限
6. **必须有对比分析**：多概念时做维度 × 概念矩阵

### 六种卡片模板（按需组合 3-5 种）

| 模板 | 用途 |
|------|------|
| A 概念拆解卡 | 是什么、机制、边界、原文依据 |
| B 方法/工具卡 | 步骤、选型、避坑、对比相邻方法 |
| C 避坑清单卡 | 坑名、原因、解法、严重程度 |
| D 决策/选型表 | 场景 × 推荐 × 不推荐 × 理由 |
| E 跨概念对比表 | 维度 × 概念矩阵 |
| F 心法/原则卡 | 原则、反面案例、落地、边界 |

### 文首总览区（必做）

1. 标题 + 2-4 个分类标签
2. 一句话概括：`本文解决的核心问题是：……`（基于正文，禁止元数据/链接/占位句）
3. 核心概念关系图（HTML/CSS div+flex）
4. 认知纠偏（如有常见误解）

### 反驳区（必做）

- **位置**：所有内容卡片之后、结论区之前
- **与认知纠偏区别**：纠偏纠正读者误解；反驳呈现**对立者对核心论点的最强一击**
- **结构**：
  - `对立视角：XXX`（人物/学派/行业惯例/历史先例）
  - **一句话**精简反驳（逻辑 / 反例 / 历史类比，15-40 字为宜，完整句子不截断）
- **禁止**：strawman、多段展开、与纠偏重复

```html
<div class="rebuttal">
  <h3>反驳</h3>
  <p class="rebuttal-role">对立视角：Java 资深架构师 / 「够用就行」派</p>
  <p class="rebuttal-text">编译通过只保证类型与内存安全，Heartbleed 级的逻辑漏洞和 async 死锁照样上线——你用编译器刚性换掉的，是 Java 生态二十年迭代速度和招聘池。</p>
</div>
```

### 结论区（三段式）

1. **总结**：3-5 条要点
2. **行动清单**：读完可立刻做的 3-5 件事
3. **关键认知转变**（如有）

### SVG 技术要点

- `import { buildSvg } from '../../svg-auto-height.mjs'`
- 宽度 `1320`，高度自动测量
- 脚本：`svgs/YYYY-MM-DD/generate-{slug}.mjs`
- 输出：`svgs/YYYY-MM-DD/{slug}.svg`
- 字体：`"PingFang SC","Microsoft YaHei",sans-serif`
- 参考 CSS 见 `SKILL.md`（含 `.rebuttal` 样式）

### 正文清洗（写 subtitle 前）

丢弃：永久链接、作者开场白、页脚推广、占位句。  
禁止：subtitle 含 URL、`…` 截断、泛化占位句。

### 质量自检清单

- [ ] 一句话总结基于正文实质，无链接/占位句
- [ ] 卡片与结论无 `…` 截断
- [ ] 至少 1 处落地建议 + 1 处避坑
- [ ] 多方法有选型表；多概念有对比表
- [ ] 文首有关系图
- [ ] **结论区前有反驳区**（对立视角 + 一句话，非 strawman）
- [ ] 结论区三段式完整
- [ ] SVG 高度正常、XML 无错配

---

## 文章类型 → 模板策略

| 文章类型 | 优先模板 | 侧重 |
|---------|---------|------|
| 技术教程 | B + C + D | 落地操作 |
| 观点/趋势文 | A + F + E | 认知转变 |
| 工具介绍 | B + D + C | 上手路径 |
| 理论/方法论 | A + E + F | 边界与关系 |
| 综述/盘点 | D + E + A | 全景对比 |

---

## 脚本模板

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSvg } from '../../svg-auto-height.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, '主题名.svg');

const CSS = `/* 见 SKILL.md 参考 CSS，须含 .rebuttal 等类 */`;

const body = `<!-- 文首 → 卡片 → 反驳 → 结论 -->`;

const { svg, height } = await buildSvg({ css: CSS, body, width: 1320 });
fs.writeFileSync(OUT, svg, 'utf8');
console.log('Generated:', OUT, 'height:', height, 'px');
```

---

## 文档关系

| 文件 | 用途 |
|------|------|
| `AUTOMATION-PROMPT.md` | 本文件：Automation 完整 prompt 备份 |
| `SKILL.md` | SVG 生成权威规范（步骤 0 必读） |
| `svg-auto-height.mjs` | 自动测高与 SVG 输出 |
| `article-content-utils.mjs` | subtitle 校验工具 |
| `index.json` | 首页索引与 [原文] 链接 |

---

*最后更新：2026-06-16（含「反驳」模块）*
