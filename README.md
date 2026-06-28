# Daily Tech Learning

每天自动抓取 AI/大模型领域顶级博主的最新文章，生成 SVG 深度总结卡片，部署到 GitHub Pages，日积月累构建知识库。

## 概述

基于 Cursor Automations 的全自动技术文章学习网站，每天早上 9:00 抓取博主新文并生成可纵向滚动的复习 SVG，部署到 GitHub Pages。

## 项目结构

```
daily-tech-learning/
├── docs/                       # GitHub Pages 根目录
│   ├── index.html              # 主页
│   ├── viewer.html             # SVG + 语音播放器
│   ├── index.json              # 索引（由 scripts 从 data/ 同步）
│   ├── .nojekyll
│   ├── audio/svgs/...          # 语音讲解 MP3
│   └── svgs/YYYY-MM-DD/        # SVG + generate-*.mjs
├── data/                       # 数据源（脚本读写）
│   ├── sources.json            # 博主源配置
│   └── index.json              # 文章索引
├── scripts/
│   ├── generate.mjs            # 主生成脚本（prepare/finalize/sync）
│   ├── generate_svg_audio.py   # SVG → edge-tts 语音讲解
│   ├── svg-auto-height.mjs     # SVG 高度自动测量
│   ├── article-content-utils.mjs
│   └── fix-bad-subtitles.mjs
├── prompts/
│   └── svg-generation-prompt.md  # SVG 生成完整规范
├── .cursor/automations/
│   ├── daily-trigger.txt       # Automation 触发语（一行）
│   └── daily-prompt.md         # Agent 完整执行步骤
└── .github/workflows/          # GitHub Pages 部署
```

与 `daily-algo`、`daily-lyric-learning` 一致：`data/` 放数据源，`docs/` 放网站，`scripts/` 负责生成与同步。

## 使用方式

### 本地预览

```bash
python3 -m http.server 8080 --directory docs
# 打开 http://localhost:8080
```

### 本地生成

```bash
# 判重并写入 .daily/context.json
node scripts/generate.mjs --prepare

# 预览（不写入）
node scripts/generate.mjs --prepare --dry-run

# 查看今日是否已生成
node scripts/generate.mjs --status

# 列出博主源
node scripts/generate.mjs --list

# Agent 生成 SVG 后，更新 index 并同步 docs
node scripts/generate.mjs --finalize

# 补全全部历史 SVG 语音
pip install -r requirements.txt
python3 scripts/generate_svg_audio.py --all --missing
```

### Cursor Automation（推荐）

1. 创建 Automation，cron: `0 9 * * *`
2. **Prompt 仅填一行**（与 daily-algo 一致）：

   ```
   读取 .cursor/automations/daily-prompt.md 并严格执行其中的所有步骤。
   ```

3. 完整步骤见 `.cursor/automations/daily-prompt.md`

Agent 执行流程：
1. `node scripts/generate.mjs --prepare` — 判重 + 准备 context
2. 抓取博主今日文章，按 `prompts/svg-generation-prompt.md` 生成 SVG
3. `node scripts/generate.mjs --finalize` — 更新 index + 同步 docs
4. `git push origin main`

GitHub Actions 自动部署 `docs/` 到 GitHub Pages。

## 部署到 GitHub Pages

进入仓库 **Settings → Pages** → Source 选择 **GitHub Actions**。

网站地址：`https://czh55.github.io/daily-tech-learning/`

## 博主源

Tony Bai · 翔宇工作流 · 李继刚 · 老石谈芯 · SIo_2 · 风雨中的小七 · 乘风gg · 大模型真好玩

配置见 `data/sources.json`。
