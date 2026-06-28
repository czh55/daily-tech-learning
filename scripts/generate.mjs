#!/usr/bin/env node
/**
 * 每日技术增量学习 — 生成脚本
 * ====================================
 * 用法：
 *   node scripts/generate.mjs --prepare     # 判重 + 写入 .daily/context.json
 *   node scripts/generate.mjs --finalize    # 扫描当日 SVG，更新 index 并生成语音
 *   node scripts/generate.mjs --status      # 查看今日状态
 *   node scripts/generate.mjs --sync        # 同步 data/index.json → docs/index.json
 *   node scripts/generate.mjs --list        # 列出博主源
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DATA = path.join(ROOT, 'data');
const DOCS = path.join(ROOT, 'docs');
const DAILY = path.join(ROOT, '.daily');
const CONTEXT_FILE = path.join(DAILY, 'context.json');
const INDEX_FILE = path.join(DATA, 'index.json');
const DOCS_INDEX = path.join(DOCS, 'index.json');
const SOURCES_FILE = path.join(DATA, 'sources.json');
const SVGS = path.join(DOCS, 'svgs');

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    prepare: false,
    finalize: false,
    status: false,
    sync: false,
    list: false,
    dryRun: false,
    force: false,
    skipAudio: false,
    date: todayStr(),
  };
  for (const a of args) {
    if (a === '--prepare') opts.prepare = true;
    else if (a === '--finalize') opts.finalize = true;
    else if (a === '--status') opts.status = true;
    else if (a === '--sync') opts.sync = true;
    else if (a === '--list') opts.list = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--force') opts.force = true;
    else if (a === '--skip-audio') opts.skipAudio = true;
    else if (a.startsWith('--date=')) opts.date = a.slice(7);
  }
  if (!opts.prepare && !opts.finalize && !opts.status && !opts.sync && !opts.list) {
    opts.prepare = true;
  }
  return opts;
}

function syncDocsIndex() {
  if (!fs.existsSync(INDEX_FILE)) {
    console.error(`未找到 ${path.relative(ROOT, INDEX_FILE)}`);
    return false;
  }
  fs.mkdirSync(DOCS, { recursive: true });
  fs.copyFileSync(INDEX_FILE, DOCS_INDEX);
  console.log(`✓ 已同步 ${path.relative(ROOT, INDEX_FILE)} → ${path.relative(ROOT, DOCS_INDEX)}`);
  return true;
}

function entryForDate(index, dateStr) {
  return index.find((d) => d.date === dateStr) ?? null;
}

function listSvgsForDate(dateStr) {
  const dir = path.join(SVGS, dateStr);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.svg')).sort();
}

function slugFromSvg(filename) {
  return filename.replace(/\.svg$/, '');
}

function inferTitleFromSvg(svgPath) {
  const content = fs.readFileSync(svgPath, 'utf8');
  const m = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (m) return m[1].replace(/<[^>]+>/g, '').trim();
  return slugFromSvg(path.basename(svgPath));
}

function readPendingArticles(dateStr) {
  if (!fs.existsSync(CONTEXT_FILE)) return [];
  const ctx = loadJson(CONTEXT_FILE);
  if (ctx.date !== dateStr || ctx.skipped) return [];
  return ctx.articles ?? [];
}

function buildTodayFiles(dateStr) {
  const svgs = listSvgsForDate(dateStr);
  const pending = readPendingArticles(dateStr);
  const pendingBySlug = new Map(pending.map((a) => [a.slug, a]));

  return svgs.map((filename) => {
    const slug = slugFromSvg(filename);
    const rel = `svgs/${dateStr}/${filename}`;
    const meta = pendingBySlug.get(slug);
    const abs = path.join(SVGS, dateStr, filename);
    return {
      path: rel,
      title: meta?.title ?? inferTitleFromSvg(abs),
      source: meta?.source ?? '',
    };
  });
}

function prepare(dateStr, dryRun = false, force = false) {
  const svgs = listSvgsForDate(dateStr);
  if (svgs.length > 0 && !force) {
    console.log(`今日 (${dateStr}) 已有 ${svgs.length} 个 SVG，跳过`);
    const context = {
      date: dateStr,
      skipped: true,
      reason: 'already_generated',
      svgCount: svgs.length,
    };
    if (!dryRun) {
      fs.mkdirSync(DAILY, { recursive: true });
      saveJson(CONTEXT_FILE, context);
    }
    return false;
  }

  const sources = loadJson(SOURCES_FILE);
  const context = {
    date: dateStr,
    skipped: false,
    sources,
    articles: [],
    svgDir: `docs/svgs/${dateStr}`,
    generateScriptImport: '../../../scripts/svg-auto-height.mjs',
    promptTemplate: 'prompts/svg-generation-prompt.md',
    notes: [
      'Agent 需抓取各博主今日新文章，写入 articles 数组后生成 SVG',
      'articles 项格式: { slug, title, source, authorId }',
    ],
  };

  console.log(`准备生成：${dateStr}`);
  console.log(`博主源：${sources.length} 个（见 data/sources.json）`);
  console.log(`SVG 输出目录：docs/svgs/${dateStr}/`);
  console.log(`规范文件：prompts/svg-generation-prompt.md`);
  console.log('');
  console.log('Agent 下一步：');
  console.log('  1. 抓取各博主今日文章 URL');
  console.log('  2. 更新 .daily/context.json 的 articles 数组');
  console.log('  3. 按规范生成 SVG 与 generate-*.mjs 脚本');
  console.log('  4. node scripts/generate.mjs --finalize');

  if (dryRun) {
    console.log('\n[Dry-run] 跳过文件写入');
    return true;
  }

  fs.mkdirSync(DAILY, { recursive: true });
  saveJson(CONTEXT_FILE, context);
  console.log(`\n✓ 已写入 ${path.relative(ROOT, CONTEXT_FILE)}`);
  return true;
}

function generateAudioForDate(dateStr, skipAudio = false) {
  if (skipAudio) {
    console.log('跳过语音生成（--skip-audio）');
    return true;
  }
  const script = path.join(ROOT, 'scripts/generate_svg_audio.py');
  if (!fs.existsSync(script)) {
    console.warn('未找到 generate_svg_audio.py，跳过语音');
    return false;
  }
  console.log(`生成语音讲解：${dateStr}`);
  const r = spawnSync('python3', [script, '--date', dateStr, '--missing'], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  return r.status === 0;
}

function finalize(dateStr, force = false, skipAudio = false) {
  const svgs = listSvgsForDate(dateStr);
  if (svgs.length === 0) {
    console.error(`今日 (${dateStr}) 无 SVG 文件，无法 finalize`);
    return false;
  }

  const files = buildTodayFiles(dateStr);
  const index = fs.existsSync(INDEX_FILE) ? loadJson(INDEX_FILE) : [];
  const existing = entryForDate(index, dateStr);

  if (existing && !force) {
    const sameCount = existing.files?.length === files.length;
    if (sameCount) {
      console.log(`今日 (${dateStr}) index 已存在 ${files.length} 条记录，跳过（可用 --force 覆盖）`);
      syncDocsIndex();
      return true;
    }
  }

  const filtered = index.filter((d) => d.date !== dateStr);
  filtered.unshift({ date: dateStr, files });
  saveJson(INDEX_FILE, filtered);
  console.log(`✓ 已更新 ${path.relative(ROOT, INDEX_FILE)}（${files.length} 篇）`);
  syncDocsIndex();
  generateAudioForDate(dateStr, skipAudio);
  return true;
}

function showStatus(dateStr) {
  const svgs = listSvgsForDate(dateStr);
  const index = fs.existsSync(INDEX_FILE) ? loadJson(INDEX_FILE) : [];
  const entry = entryForDate(index, dateStr);

  if (entry) {
    console.log(`今日 (${dateStr}) 已入库：${entry.files.length} 篇`);
    for (const f of entry.files) {
      console.log(`  - ${f.title}`);
      console.log(`    ${f.path}${f.source ? ` [${f.source}]` : ''}`);
    }
  } else if (svgs.length > 0) {
    console.log(`今日 (${dateStr}) 有 ${svgs.length} 个 SVG，尚未 finalize`);
    for (const s of svgs) console.log(`  - svgs/${dateStr}/${s}`);
  } else {
    console.log(`今日 (${dateStr}) 尚未生成`);
  }
}

function listSources() {
  const sources = loadJson(SOURCES_FILE);
  console.log(`=== 博主源（共 ${sources.length} 个）===\n`);
  for (const s of sources) {
    console.log(`  ${s.name}`);
    console.log(`    ${s.url}`);
    if (s.fetchHint) console.log(`    提示：${s.fetchHint}`);
    console.log('');
  }
}

function main() {
  const opts = parseArgs();

  if (opts.sync) {
    process.exit(syncDocsIndex() ? 0 : 1);
  }
  if (opts.list) {
    listSources();
    return;
  }
  if (opts.status) {
    showStatus(opts.date);
    return;
  }
  if (opts.finalize) {
    process.exit(finalize(opts.date, opts.force, opts.skipAudio) ? 0 : 1);
  }
  if (opts.prepare) {
    const ok = prepare(opts.date, opts.dryRun, opts.force);
    if (fs.existsSync(CONTEXT_FILE)) {
      const ctx = loadJson(CONTEXT_FILE);
      if (ctx.skipped) process.exit(0);
    }
    process.exit(ok ? 0 : 1);
  }
}

main();
