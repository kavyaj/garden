// Cuts each painted scene in src/scene/source/ into two parts:
//
//   1. Static layers (dabs, hedge, lawn, canopies) written to public/scene/<scene>.<hash>.svg.
//      They're identical on every page, so the browser caches them.
//   2. A small inline SVG holding only what moves (clouds, birds, gate leaves, the sway and bob
//      wrappers), with <image> tags pointing at the static layers. Written to src/scene/generated/.
//
// The sources are the painted output of the V1 mockups. To swap in a hand-painted layer later,
// replace the matching group in the source with an <image> and rerun `npm run gen`.
//
// Run with: node src/scene/paint.ts

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse, ser, attr, setAttr, refs, byId, type Node } from './svg.ts';

const SRC = 'src/scene/source';
const OUT_PUBLIC = 'public/scene';
const OUT_GEN = 'src/scene/generated';

// Moving things smaller than this stay inline whole; bigger ones become a wrapper around a cached image.
const INLINE_ANIMATED_MAX = 8000;
// Static runs smaller than this aren't worth a request.
const INLINE_STATIC_MAX = 3000;

const ANIM = new Set(['drift', 'birds', 'sway', 'bob', 'gate', 'spinslow']);

// Nudges to the mockup's clouds so no text ever sits on one (CLAUDE.md: never text on a cloud).
// Indexed by the cloud's order in the source. `high` clouds hide under 900px, where the nav wraps.
type CloudFix = { dx?: number; dy?: number; high?: boolean };
const CLOUDS: Record<string, CloudFix[]> = {
  // Strip clouds move into the open sky between the logo and the nav, each a little different.
  'sky-strip-notes': [{ dx: -509, high: true }],
  'sky-strip-quotes': [{ dx: -469, high: true }],
  'sky-strip-note': [{ dx: -569, high: true }],
  'sky-strip-gardener': [{ dx: -549, high: true }],
  'sky-strip-onrepeat': [{ dx: -509, high: true }],
  'sky-home': [{ dy: 34, high: true }, { high: true }, { high: true }],
  'sky-map': [{ dy: 34, high: true }, { high: true }],
};

function fixClouds(svg: Node, fixes: CloudFix[]): void {
  let i = 0;
  const walk = (parent: Node) => {
    parent.children = parent.children.map((n) => {
      if (!(attr(n, 'class') ?? '').split(/\s+/).includes('drift')) {
        walk(n);
        return n;
      }
      const fix = fixes[i++];
      if (!fix) return n;
      if (fix.high) setAttr(n, 'class', `${attr(n, 'class')} high`);
      if (!fix.dx && !fix.dy) return n;
      // Wrap rather than set transform: the drift animation owns the group's own transform.
      return { tag: 'g', attrs: `transform="translate(${fix.dx ?? 0} ${fix.dy ?? 0})"`, children: [n] };
    });
  };
  walk(svg);
}

function animated(n: Node): boolean {
  const cls = attr(n, 'class');
  return !!cls && cls.split(/\s+/).some((c) => ANIM.has(c.replace(/^g-/, '')));
}

function hasAnimated(n: Node): boolean {
  return animated(n) || n.children.some(hasAnimated);
}

/** Mockup class names → the design system's g-* names. Drops the mockup's stray class="False". */
function normaliseClasses(n: Node): void {
  const cls = attr(n, 'class');
  if (cls !== undefined) {
    const next = cls
      .split(/\s+/)
      .filter((c) => c && c !== 'False')
      .map((c) => (ANIM.has(c) ? `g-${c}` : c))
      .join(' ');
    setAttr(n, 'class', next || undefined);
  }
  n.children.forEach(normaliseClasses);
}

/** Wraps runs of 3+ siblings sharing a fill in one <g fill>, and trims leading zeros. */
function compact(markup: string): string {
  return markup.replace(/(?<![\d.])0\.(\d)/g, '.$1');
}

function groupFills(nodes: Node[]): Node[] {
  const out: Node[] = [];
  let i = 0;
  while (i < nodes.length) {
    const fill = attr(nodes[i], 'fill');
    let j = i;
    while (fill && j < nodes.length && attr(nodes[j], 'fill') === fill && !nodes[j].children.length) j++;
    if (fill && j - i >= 3) {
      const kids = nodes.slice(i, j).map((n) => {
        const c = { ...n, children: [] as Node[] };
        setAttr(c, 'fill', undefined);
        return c;
      });
      out.push({ tag: 'g', attrs: `fill="${fill}"`, children: kids });
      i = j;
    } else {
      const n = nodes[i];
      out.push({ ...n, children: groupFills(n.children) });
      i++;
    }
  }
  return out;
}

function hash(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
}

function paintScene(file: string): void {
  const name = path.basename(file, '.svg');
  const raw = fs.readFileSync(file, 'utf8');
  const svg = parse(raw.slice(raw.indexOf('<svg'))).children[0];
  if (CLOUDS[name]) fixClouds(svg, CLOUDS[name]);
  normaliseClasses(svg);

  const viewBox = attr(svg, 'viewBox')!;
  const [, , w, h] = viewBox.split(/\s+/).map(Number);
  const par = attr(svg, 'preserveAspectRatio') ?? 'xMidYMid meet';
  const defsNode = svg.children.find((c) => c.tag === 'defs');
  const body = svg.children.filter((c) => c.tag !== 'defs');

  const defsFor = (markup: string, root: Node): string => {
    // Pull in every referenced def (and anything it references in turn) that isn't already in the markup.
    const have = new Set([...markup.matchAll(/id="([\w-]+)"/g)].map((m) => m[1]));
    const want = [...refs(markup)].filter((id) => !have.has(id));
    const out: string[] = [];
    while (want.length) {
      const id = want.shift()!;
      if (have.has(id)) continue;
      const n = (defsNode && byId(defsNode, id)) ?? byId(root, id);
      if (!n) continue;
      have.add(id);
      const s = ser(n);
      out.push(s);
      for (const r of refs(s)) if (!have.has(r)) want.push(r);
    }
    return out.length ? `<defs>${out.join('')}</defs>` : '';
  };

  const layers: string[] = [];
  const writeLayer = (nodes: Node[], wrappers: Node[]): string => {
    let inner = groupFills(nodes).map(ser).join('');
    for (const wr of [...wrappers].reverse()) inner = `<${wr.tag} ${wr.attrs}>${inner}</${wr.tag}>`;
    const content = compact(defsFor(inner, svg) + inner);
    const doc = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${viewBox}" width="${w}" height="${h}">${content}</svg>`;
    const fname = `${name}.${hash(doc)}.svg`;
    fs.writeFileSync(path.join(OUT_PUBLIC, fname), doc);
    layers.push(fname);
    return `<image href="/scene/${fname}" width="${w}" height="${h}"/>`;
  };

  const inlineNode = (n: Node, wrappers: Node[]): string => {
    let s = ser({ ...n, children: groupFills(n.children) });
    for (const wr of [...wrappers].reverse()) s = `<${wr.tag} ${wr.attrs}>${s}</${wr.tag}>`;
    return s;
  };

  // Walks siblings. `wrappers` are static ancestors whose attributes (filter, clip) still need applying.
  const emit = (nodes: Node[], wrappers: Node[]): string => {
    let out = '';
    let run: Node[] = [];
    const flush = () => {
      if (!run.length) return;
      const size = run.map(ser).join('').length;
      out += size < INLINE_STATIC_MAX ? run.map((n) => inlineNode(n, wrappers)).join('') : writeLayer(run, wrappers);
      run = [];
    };
    for (const n of nodes) {
      if (!hasAnimated(n)) {
        run.push(n);
        continue;
      }
      flush();
      const size = ser(n).length;
      if (size < INLINE_ANIMATED_MAX) {
        out += inlineNode(n, wrappers);
      } else if (animated(n)) {
        // Inline wrapper keeps the motion (and the page's reduced-motion rule); its contents go to files.
        let open = `<${n.tag} ${n.attrs}>`;
        let close = `</${n.tag}>`;
        for (const wr of [...wrappers].reverse()) {
          open = `<${wr.tag} ${wr.attrs}>` + open;
          close += `</${wr.tag}>`;
        }
        out += open + emit(n.children, []) + close;
      } else {
        out += emit(n.children, [...wrappers, n]);
      }
    }
    flush();
    return out;
  };

  let inline = emit(body, []);
  inline = defsFor(inline, svg) + inline;

  // Ids must be unique per page, and the sky and the garden share a page.
  for (const id of new Set([...inline.matchAll(/id="([\w-]+)"/g)].map((m) => m[1]))) {
    inline = inline
      .replaceAll(`id="${id}"`, `id="${name}-${id}"`)
      .replaceAll(`url(#${id})`, `url(#${name}-${id})`)
      .replaceAll(`href="#${id}"`, `href="#${name}-${id}"`);
  }
  inline = compact(inline);

  fs.writeFileSync(
    path.join(OUT_GEN, `${name}.json`),
    JSON.stringify({ viewBox, preserveAspectRatio: par, width: w, height: h, inner: inline, layers }, null, 1)
  );
  const layerBytes = layers.reduce((a, f) => a + fs.statSync(path.join(OUT_PUBLIC, f)).size, 0);
  console.log(
    `${name.padEnd(20)} inline ${(inline.length / 1024).toFixed(1).padStart(6)}KB  ${layers.length} layer file(s) ${(layerBytes / 1024).toFixed(1).padStart(6)}KB`
  );
}

fs.rmSync(OUT_PUBLIC, { recursive: true, force: true });
fs.mkdirSync(OUT_PUBLIC, { recursive: true });
fs.mkdirSync(OUT_GEN, { recursive: true });
for (const f of fs.readdirSync(SRC).filter((f) => f.endsWith('.svg')).sort()) paintScene(path.join(SRC, f));
