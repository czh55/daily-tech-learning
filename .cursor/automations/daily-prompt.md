# 每日技术增量学习 - Agent 完整 Prompt

你是「每日技术增量学习」项目的自动化 agent。确定性逻辑已内置于 `scripts/generate.mjs`，你负责抓取文章、生成 SVG 深度总结并提交。

## 执行步骤

### 1. 准备今日任务

```bash
node scripts/generate.mjs --prepare
```

- 若输出「今日已有 N 个 SVG，跳过」→ **停止，不要重复生成**
- 否则读取 `.daily/context.json` 和 `data/sources.json` 获取博主列表与输出路径

### 2. 抓取今日文章

逐个访问 `data/sources.json` 中的博主主页，提取**今天**发布的最新文章 URL：

| 提示 | 说明 |
|------|------|
| Tony Bai | curl 比 WebFetch 更稳定 |
| 翔宇工作流 | 检查 `article:published_time` meta |
| 乘风gg | 掘金 API `https://api.juejin.cn/content_api/v1/article/query_list` |
| 大模型真好玩 | 掘金 WAF 可能拦截，超时则跳过 |

超时的平台记录原因后跳过。今天没有任何新文章 → **停止，不 commit**。

将发现的文章写入 `.daily/context.json` 的 `articles` 数组：

```json
{ "slug": "topic-slug", "title": "文章标题", "source": "https://原文URL", "authorId": "tonybai" }
```

### 3. 生成 SVG 深度总结

对每篇文章：

1. 读取 `prompts/svg-generation-prompt.md` 作为完整生成规范（六点质量要求、六种卡片模板、反驳区、结论区三段式）
2. WebFetch 抓取原文全文，清洗 boilerplate 后撰写一句话总结
3. 判断文章类型 → 选 3-5 种卡片模板 → 分析内容 → **撰写反驳区**
4. 卡片 `<h3>` 必须使用**中文模板名**（如 `【概念拆解卡】主题`），禁止 `【模板 A】`
5. 编写 `.mjs` 脚本：

```javascript
import { buildSvg } from '../../../scripts/svg-auto-height.mjs';
```

   存放到 `docs/svgs/<今天日期>/`
6. `node docs/svgs/<今天日期>/generate-<slug>.mjs` 生成 `.svg`
7. 按规范中的质量自检清单逐项验证

### 4. 校验、更新索引并生成语音

```bash
node scripts/generate.mjs --finalize
```

确认 `data/index.json` 已更新且已同步到 `docs/index.json`。`--finalize` 会自动为当日 SVG 生成 edge-tts 语音讲解（`docs/audio/svgs/.../*.mp3`）。

也可单独生成：

```bash
pip install -r requirements.txt
python3 scripts/generate_svg_audio.py --date=YYYY-MM-DD
python3 scripts/generate_svg_audio.py --all --missing   # 补全历史
```

### 5. 提交并推送到 main

**必须直接在 `main` 分支提交并推送，不要创建功能分支，不要开 PR。**

```bash
git fetch origin main
git checkout main
git pull origin main
git add docs/ data/index.json .daily/context.json
git commit -m "Daily: YYYY-MM-DD — N 篇文章"
git push origin main
```

部分博主抓取失败时，commit message 注明跳过项。推送后 GitHub Actions 自动部署 `docs/` 到 GitHub Pages。

## 注意事项

- 不要修改 `data/sources.json` 中的博主配置（除非用户明确要求）
- 更新 `data/index.json` 时保留所有历史条目，**禁止覆盖整文件**
- 只处理当天新发布的文章，不要重跑历史日期
- SVG 宽度固定 1320，高度由 `buildSvg` 自动测量
- **所有变更必须直接提交到 `main` 分支**

## 异常处理

| 问题 | 处理 |
|------|------|
| 今日已有 SVG | `--prepare` 会跳过，无需操作 |
| 今日无新文章 | 不 commit |
| 部分博主超时 | 只提交成功部分，commit message 注明跳过 |
| `--finalize` 报无 SVG | 补全生成后重跑 finalize |
| subtitle 含永久链接/URL | 按 `scripts/article-content-utils.mjs` 重写 |
| `git push` 失败 | 检查网络，重试一次 |
| 语音生成失败 | `pip install -r requirements.txt`；可用 `--skip-audio` 跳过 |

## 项目结构

```
daily-tech-learning/
├── docs/                       # GitHub Pages 根目录
│   ├── index.html
│   ├── viewer.html             # SVG + 语音播放器
│   ├── index.json              # 由 scripts 从 data/ 同步
│   ├── .nojekyll
│   ├── audio/svgs/...          # 语音讲解 MP3
│   └── svgs/YYYY-MM-DD/        # SVG + generate-*.mjs
├── data/
│   ├── sources.json            # 博主源配置
│   └── index.json              # 索引数据源
├── scripts/
│   ├── generate.mjs            # 主脚本（prepare/finalize/sync）
│   ├── generate_svg_audio.py   # SVG → edge-tts 语音讲解
│   ├── svg-auto-height.mjs     # SVG 高度测量
│   └── article-content-utils.mjs
├── prompts/
│   └── svg-generation-prompt.md
└── .cursor/automations/
    ├── daily-trigger.txt
    └── daily-prompt.md
```

与 `daily-algo`、`daily-lyric-learning` 一致：`data/` 放数据源，`docs/` 放网站，`scripts/` 负责生成与同步。
