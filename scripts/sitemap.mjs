// Runs after `astro build`. Writes dist/sitemap.xml from the pages that were actually built,
// so a new page is in the sitemap without anyone remembering to add it.
// Skips the 404 and redirect pages (like /gardener).
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const SITE = 'https://kavya.garden';

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const urls = walk(DIST)
  .filter((f) => f.endsWith('index.html'))
  .filter((f) => !/http-equiv="refresh"/i.test(fs.readFileSync(f, 'utf8')))
  .map((f) => '/' + path.relative(DIST, f).replace(/\\/g, '/').replace(/index\.html$/, ''))
  .sort();

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} pages`);
