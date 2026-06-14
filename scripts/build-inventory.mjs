import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const START = '2026-03-14';
const END = '2026-06-07';

const inRange = (d) => d >= START && d <= END;

async function fetchText(url, opts = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', ...opts.headers }, ...opts });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.text();
}

function slugFromSource(source) {
  const last = source.replace(/\/$/, '').split('/').pop();
  return last.replace(/\.html$/, '');
}

function addArticle(map, seen, date, title, source, author) {
  if (!inRange(date) || seen.has(source)) return;
  seen.add(source);
  if (!map[date]) map[date] = [];
  map[date].push({ title, source, author, slug: slugFromSource(source).slice(0, 60) });
}

async function loadTony(map, seen) {
  const xml = await fetchText('https://tonybai.com/sitemap.xml');
  for (const loc of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const url = loc[1];
    const m = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/);
    if (!m || !url.includes('tonybai.com')) continue;
    const date = `${m[1]}-${m[2]}-${m[3]}`;
    addArticle(map, seen, date, m[4].replace(/-/g, ' '), url, 'Tony Bai');
  }
}

async function loadJuejin(map, seen, userId, author) {
  let cursor = '0';
  while (true) {
    const res = await fetch(`https://api.juejin.cn/content_api/v1/article/query_list?user_id=${userId}&cursor=${cursor}&sort_type=2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify({ user_id: userId, cursor, sort_type: 2, limit: 20 }),
    });
    const data = await res.json();
    const items = data.data ?? [];
    if (!items.length) break;
    let stop = false;
    for (const item of items) {
      const info = item.article_info;
      const date = new Date(Number(info.ctime) * 1000).toISOString().slice(0, 10);
      if (date < START) { stop = true; break; }
      addArticle(map, seen, date, info.title, `https://juejin.cn/post/${info.article_id}`, author);
    }
    if (stop) break;
    cursor = String(Number(cursor) + items.length);
  }
}

async function enrichTonyTitles(map) {
  const tasks = [];
  for (const [date, items] of Object.entries(map)) {
    for (const item of items) {
      if (item.author !== 'Tony Bai') continue;
      tasks.push((async () => {
        try {
          const html = await fetchText(item.source);
          const m = html.match(/<title>([^<|]+)/);
          if (m) item.title = m[1].trim();
        } catch {}
      })());
    }
  }
  const batchSize = 10;
  for (let i = 0; i < tasks.length; i += batchSize) {
    await Promise.all(tasks.slice(i, i + batchSize));
    if ((i + batchSize) % 30 === 0) console.log(`titles ${Math.min(i + batchSize, tasks.length)}/${tasks.length}`);
  }
}

const map = {};
const seen = new Set();

await loadTony(map, seen);
await loadJuejin(map, seen, '3140624091453053', '大模型真好玩');
await loadJuejin(map, seen, '4248168658899741', '乘风gg');
console.log('articles before title enrich:', Object.values(map).flat().length);
await enrichTonyTitles(map);

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'backfill-inventory.json');
fs.writeFileSync(outPath, JSON.stringify(map, null, 2), 'utf8');
const days = Object.keys(map).sort();
console.log('days:', days.length, 'articles:', days.reduce((n, d) => n + map[d].length, 0));
console.log('saved', outPath);
