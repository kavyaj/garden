// Runs after `astro build`. Fails the build on:
//   - any internal link, image or asset that points at nothing
//   - any link to a page without its trailing slash (GitHub Pages would 301 it, and Search Console flags that)
//   - any page over budget: 150KB transferred (gzip) on first load, fonts excluded
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST = 'dist';
const BUDGET = 150 * 1024;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

/** "/notes" → dist/notes/index.html, "/brand/kj-mark-paper.svg" → dist/brand/kj-mark-paper.svg. */
function resolve(url) {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  const base = path.join(DIST, clean);
  for (const c of [base, path.join(base, 'index.html'), base + '.html']) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

const gz = (file) => zlib.gzipSync(fs.readFileSync(file), { level: 9 }).length;

/** Local URLs a file pulls in: href/src attributes, and url() in CSS. */
function localRefs(text) {
  const out = new Set();
  for (const m of text.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)) out.add(m[1]);
  for (const m of text.matchAll(/url\((["']?)(\/(?!\/)[^)"']*)\1\)/g)) out.add(m[2]);
  return out;
}

const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const broken = [];
const slashless = [];
const rows = [];

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const loads = new Set([page]);
  const queue = [...localRefs(html)].map((u) => ({ u, from: page }));

  while (queue.length) {
    const { u, from } = queue.shift();
    const file = resolve(u);
    if (!file) {
      broken.push(`${path.relative(DIST, from)} → ${u}`);
      continue;
    }
    if (file.endsWith('index.html') && !u.split(/[?#]/)[0].endsWith('/') && !/http-equiv="refresh"/i.test(html)) {
      slashless.push(`${path.relative(DIST, from)} → ${u}`);
    }
    // Links to other pages don't count toward this page's weight.
    if (file.endsWith('.html') || loads.has(file)) continue;
    // Icons only load in the tab, and og:image never loads in the page.
    if (/favicon|apple-touch|kj-mark-512|kj-avatar/.test(file)) continue;
    loads.add(file);
    if (/\.(css|svg|js)$/.test(file)) {
      for (const r of localRefs(fs.readFileSync(file, 'utf8'))) queue.push({ u: r, from: file });
    }
  }

  const total = [...loads].reduce((a, f) => a + gz(f), 0);
  rows.push({ page: '/' + path.relative(DIST, page).replace(/\\/g, '/').replace(/index\.html$/, ''), files: loads.size, total });
}

console.log('\nPage weight (gzip, fonts excluded, budget 150KB):');
for (const r of rows.sort((a, b) => b.total - a.total)) {
  const flag = r.total > BUDGET ? '  OVER BUDGET' : '';
  console.log(`  ${(r.total / 1024).toFixed(1).padStart(6)}KB  ${String(r.files).padStart(2)} files  ${r.page}${flag}`);
}

const over = rows.filter((r) => r.total > BUDGET);
if (broken.length) {
  console.error(`\n${broken.length} broken internal link(s):`);
  for (const b of broken) console.error('  ' + b);
}
if (slashless.length) {
  console.error(`\n${slashless.length} link(s) to a page without the trailing slash:`);
  for (const s of slashless) console.error('  ' + s);
}
if (broken.length || slashless.length || over.length) process.exit(1);
console.log('\nNo broken links, no redirecting links. Every page under budget.');
