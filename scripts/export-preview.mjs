// Packs the built site (dist/) into one self-contained HTML file for sharing a preview:
// exports/kavya-wiki-preview.html. Open it by double-clicking; it works offline except for
// Google Fonts. Every page, stylesheet, scene layer and image is inside it.
//
// How: the file is a shell with one full-window iframe. Each page's HTML is stored as a string,
// shown through the iframe's srcdoc, and internal links tell the shell which page to show next
// (the address bar shows #/notes and so on, so Back works). Assets are stored once and spliced
// into a page when it's shown, so the scene files aren't repeated per page.
//
// Run with: npm run export
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const OUT = 'exports/kavya-wiki-preview.html';

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const MIME = { '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.css': 'text/css', '.js': 'text/javascript' };

/** "/notes/x" or "/notes/x/" → the page key "/notes/x"; dist/404.html → "/404". */
const pageKey = (file) => {
  const rel = '/' + path.relative(DIST, file).replace(/\\/g, '/');
  return rel.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
};

const pageFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const pageKeys = new Set(pageFiles.map(pageKey));

const assets = [];
const assetIndex = new Map();
function asset(url) {
  const file = path.join(DIST, decodeURIComponent(url));
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`Missing asset ${url}`);
  if (!assetIndex.has(file)) {
    const mime = MIME[path.extname(file)] ?? 'application/octet-stream';
    assetIndex.set(file, assets.length);
    assets.push(`data:${mime};base64,${fs.readFileSync(file).toString('base64')}`);
  }
  return `__A${assetIndex.get(file)}__`;
}

// Runs inside every page: internal links ask the shell to switch pages.
const linkScript = `<script>document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-go]');if(!a||e.metaKey||e.ctrlKey)return;e.preventDefault();parent.postMessage({go:a.getAttribute('data-go')},'*');});</script>`;

const pages = {};
for (const file of pageFiles) {
  let html = fs.readFileSync(file, 'utf8');

  // Stylesheets inline.
  html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="(\/[^"]+\.css)"[^>]*>/g, (_, url) => {
    let css = fs.readFileSync(path.join(DIST, url), 'utf8');
    css = css.replace(/url\((["']?)(\/(?!\/)[^)"']+)\1\)/g, (_m, _q, u) => `url(${asset(u)})`);
    return `<style>${css}</style>`;
  });
  // One image size is enough for a preview.
  html = html.replace(/\s(?:srcset|sizes)="[^"]*"/g, '');
  // External links already open in a new tab (src/middleware.ts), so they don't open inside the preview either.
  // Local URLs: pages become in-file links, files become assets.
  html = html.replace(/\b(src|href)="(\/(?!\/)[^"#?]*)([#?][^"]*)?"/g, (m, attr, url, rest = '') => {
    const key = url.replace(/\/$/, '') || '/';
    if (pageKeys.has(key)) return `href="#${key}" data-go="${key}"`;
    if (url === '/' || url.endsWith('/')) return m;
    return `${attr}="${asset(url)}"`;
  });
  html = html.replace('</body>', `${linkScript}</body>`);
  pages[pageKey(file)] = html;
}

const json = (v) => JSON.stringify(v).replace(/<\//g, '<\\/');
const shell = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>kavya.garden preview</title>
<style>html,body{margin:0;height:100%;background:#f0f0f0}iframe{position:fixed;inset:0;width:100%;height:100%;border:0;display:block}</style>
</head>
<body>
<iframe id="page" title="kavya.garden"></iframe>
<script type="application/json" id="pages">${json(pages)}</script>
<script type="application/json" id="assets">${json(assets)}</script>
<script>
var pages = JSON.parse(document.getElementById('pages').textContent);
var assets = JSON.parse(document.getElementById('assets').textContent);
var frame = document.getElementById('page');
function show() {
  var key = decodeURIComponent(location.hash.slice(1)) || '/';
  var html = pages[key] || pages['/404'];
  frame.srcdoc = html.replace(/__A(\\d+)__/g, function (_, i) { return assets[+i]; });
  var t = /<title>([^<]*)<\\/title>/.exec(html);
  document.title = (t ? t[1] : 'kavya.garden') + ' (preview)';
}
window.addEventListener('message', function (e) {
  if (e.data && typeof e.data.go === 'string') location.hash = e.data.go;
});
window.addEventListener('hashchange', show);
show();
</script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, shell);
console.log(`${OUT}: ${Object.keys(pages).length} pages, ${assets.length} assets, ${(fs.statSync(OUT).size / 1024 / 1024).toFixed(1)}MB`);
