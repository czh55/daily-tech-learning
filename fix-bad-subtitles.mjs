#!/usr/bin/env node
/**
 * 扫描并修复 SVG 中误用「本文永久链接」等元数据的一句话总结
 * 用法: node fix-bad-subtitles.mjs [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  isBadSubtitle,
  fetchArticleParagraphs,
  buildSubtitleFromArticle,
  extractParagraphs,
} from './article-content-utils.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes('--dry-run');

const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'index.json'), 'utf8'));
const sourceByPath = new Map();
for (const day of index) {
  for (const f of day.files) {
    sourceByPath.set(f.path, { source: f.source, title: f.title });
  }
}

function findBadSvgFiles(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...findBadSvgFiles(p));
    else if (ent.name.endsWith('.svg')) {
      const content = fs.readFileSync(p, 'utf8');
      const m = content.match(/<p class="subtitle">([\s\S]*?)<\/p>/);
      if (m && isBadSubtitle(m[1])) out.push(p);
    }
  }
  return out;
}

function replaceSubtitleInFile(filePath, newSubtitle) {
  let content = fs.readFileSync(filePath, 'utf8');
  const escaped = newSubtitle.replace(/&/g, '&amp;');
  content = content.replace(
    /<p class="subtitle">[\s\S]*?<\/p>/,
    `<p class="subtitle">${escaped}</p>`
  );
  fs.writeFileSync(filePath, content, 'utf8');
}

async function main() {
  const svgsDir = path.join(ROOT, 'svgs');
  const files = findBadSvgFiles(svgsDir);
  console.log(`发现 ${files.length} 个需修复的 SVG`);

  let ok = 0;
  let fail = 0;

  for (const abs of files.sort()) {
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
    const meta = sourceByPath.get(rel);
    const title = meta?.title ?? '';

    try {
      let paragraphs;
      if (meta?.source) {
        paragraphs = await fetchArticleParagraphs(meta.source);
      } else {
        throw new Error('index.json 中无 source');
      }

      const subtitle = buildSubtitleFromArticle({ paragraphs, title });
      console.log(`\n✓ ${rel}`);
      console.log(`  → ${subtitle.slice(0, 80)}${subtitle.length > 80 ? '…' : ''}`);

      if (!dryRun) replaceSubtitleInFile(abs, subtitle);
      ok++;
    } catch (e) {
      console.error(`\n✗ ${rel}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n完成: 修复 ${ok}, 失败 ${fail}${dryRun ? ' (dry-run)' : ''}`);
  if (fail > 0) process.exit(1);
}

main();
