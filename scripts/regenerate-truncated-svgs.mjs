#!/usr/bin/env node
/**
 * 重新生成含批量截断标记（… / 重读原文标记 3 处）的 SVG
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.dirname(ROOT);
const index = JSON.parse(fs.readFileSync(path.join(REPO, 'index.json'), 'utf8'));
const inventory = JSON.parse(fs.readFileSync(path.join(ROOT, 'backfill-inventory.json'), 'utf8'));

const TRUNC_MARKERS = [
  '重读原文标记 3 处可立刻实践的操作',
  '关键理解：</strong>[^<]{220}…',
  '原文依据：[^<]{120}…',
];

function isTruncatedSvg(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('重读原文标记 3 处可立刻实践的操作')) return true;
  // 批量脚本旧版句末截断：字段以单字符 … 紧接闭合标签结尾
  if (/关键理解：<\/strong>[^<]*…<\/p>/.test(content)) return true;
  if (/原文依据：[^<]*…<\/div>/.test(content)) return true;
  if (/class="subtitle">[^<]*…<\/p>/.test(content)) return true;
  if (/conclusion[\s\S]*?<li>[^<]{40,}…<\/li>/.test(content)) return true;
  return false;
}

const toRegen = new Set();
for (const day of index) {
  for (const f of day.files) {
    const abs = path.join(REPO, f.path);
    if (fs.existsSync(abs) && isTruncatedSvg(abs)) {
      toRegen.add(f.path);
    }
  }
}

console.log(`待重新生成: ${toRegen.size} 个 SVG`);

// 仅保留 inventory 中需要重跑的条目
const filtered = {};
for (const [date, items] of Object.entries(inventory)) {
  const list = items.filter((item) => {
    const slug = item.slug.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 60);
    return toRegen.has(`svgs/${date}/${slug}.svg`);
  });
  if (list.length) filtered[date] = list;
}

const tmpInv = path.join(ROOT, '.regen-inventory.json');
fs.writeFileSync(tmpInv, JSON.stringify(filtered, null, 2));

// 临时替换 inventory 并 force 生成
const origInv = path.join(ROOT, 'backfill-inventory.json');
const backup = fs.readFileSync(origInv, 'utf8');
fs.writeFileSync(origInv, fs.readFileSync(tmpInv, 'utf8'));

const batchScript = path.join(ROOT, 'batch-generate-svgs.mjs');
const patched = fs.readFileSync(batchScript, 'utf8').replace(
  "const INV = path.join(ROOT, 'backfill-inventory.json');",
  "const INV = path.join(ROOT, '.regen-inventory.json');"
);
const tmpBatch = path.join(ROOT, '.batch-regen.mjs');
fs.writeFileSync(tmpBatch, patched);

const result = spawnSync('node', [tmpBatch, '--force'], {
  cwd: ROOT,
  stdio: 'inherit',
  env: process.env,
});

fs.writeFileSync(origInv, backup);
fs.unlinkSync(tmpInv);
fs.unlinkSync(tmpBatch);

if (result.status !== 0) process.exit(result.status ?? 1);

// 验证
let remaining = 0;
for (const p of toRegen) {
  if (isTruncatedSvg(path.join(REPO, p))) remaining++;
}
console.log(`验证完成: 仍有截断标记 ${remaining} 个`);
if (remaining > 0) process.exit(1);
