import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const inv = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/backfill-inventory.json'), 'utf8'));
const gen = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/backfill-generated.json'), 'utf8'));

function cleanTitle(t) {
  return t.replace(/\s*[-|–—]\s*Tony Bai\s*$/i, '').trim();
}

// Map path -> {title, source}
const meta = new Map();
for (const g of gen) meta.set(g.path, { title: cleanTitle(g.title), source: g.source });

// existing index entries (Jun 8-14 manual)
const existing = JSON.parse(fs.readFileSync(path.join(ROOT, 'index.json'), 'utf8'));
for (const day of existing) {
  for (const f of day.files) {
    if (!meta.has(f.path)) meta.set(f.path, { title: f.title, source: f.source });
  }
}

// scan all svg files
const svgsDir = path.join(ROOT, 'svgs');
const byDate = {};
for (const date of fs.readdirSync(svgsDir).sort().reverse()) {
  const dir = path.join(svgsDir, date);
  if (!fs.statSync(dir).isDirectory()) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
  if (!files.length) continue;
  byDate[date] = files.map(f => {
    const p = `svgs/${date}/${f}`;
    const m = meta.get(p);
    if (m) return { path: p, title: m.title, source: m.source };
    // fallback from inventory by slug match
    const slug = f.replace('.svg', '');
    const items = inv[date] ?? [];
    const item = items.find(i => i.slug.startsWith(slug) || slug.startsWith(i.slug.slice(0, 40)));
    return { path: p, title: item ? cleanTitle(item.title) : slug, source: item?.source ?? '' };
  });
}

const index = Object.keys(byDate).sort().reverse().map(date => ({ date, files: byDate[date] }));
fs.writeFileSync(path.join(ROOT, 'index.json'), JSON.stringify(index, null, 2), 'utf8');
console.log('index:', index.length, 'days,', index.reduce((n,d)=>n+d.files.length,0), 'articles');
