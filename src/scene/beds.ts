// Generated beds for the map's plots. A plot with nothing in it is the dashed "not planted yet"
// outline from the mockup; once its collection has an entry, it's painted as a bed here instead:
// a framed patch of soil, leaf dabs, and one flower per entry (up to nine).
// Seeded from the plot's key, so every build paints the same bed.

import unplanted from './map-unplanted.json' with { type: 'json' };

/** mulberry32: small, fast, seeded. */
export function prng(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const GREENS = ['#12664F', '#3E9E45', '#3E9E45', '#86C540', '#B9DD5A'];
const PETALS: [string, string][] = [
  ['#F48AA8', '#FFADC4'],
  ['#fd5183', '#F48AA8'],
  ['#E4E4E4', '#ffffff'],
];
const f = (n: number) => n.toFixed(1).replace(/\.0$/, '');

/** One brush flower: a ring of darker petal dabs, a lighter ring turned a little, a bud and three seeds. */
function flower(x: number, y: number, r: number, [dark, light]: [string, string], rnd: () => number): string {
  const n = 5;
  const turn = rnd() * 72;
  let s = '';
  for (let i = 0; i < n; i++) s += `<use href="#bed-lf" fill="${dark}" transform="translate(${f(x)} ${f(y)}) rotate(${f(turn + i * 72)}) scale(${f(r / 9 + rnd() * 0.1)})"/>`;
  for (let i = 0; i < n; i++) s += `<use href="#bed-lf" fill="${light}" transform="translate(${f(x)} ${f(y)}) rotate(${f(turn + 36 + i * 72)}) scale(${f(r / 13)})"/>`;
  s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.22)}" fill="#F2E15A"/>`;
  for (let i = 0; i < 3; i++) {
    const a = rnd() * Math.PI * 2;
    s += `<circle cx="${f(x + Math.cos(a) * r * 0.1)}" cy="${f(y + Math.sin(a) * r * 0.1)}" r=".6" fill="#8A6A1A"/>`;
  }
  return s;
}

/** A painted bed inside `box`, with `count` flowers (capped at nine). */
export function plantedBed(key: string, box: Box, count: number): string {
  const rnd = prng(key);
  const { x, y, w, h } = box;
  const pad = 10;
  let s = `<rect x="${x + 7}" y="${y + 8}" width="${w}" height="${h}" fill="#131313" opacity=".14"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff" stroke="#131313" stroke-width="2.5"/>`;
  s += `<rect x="${x + pad}" y="${y + pad}" width="${w - pad * 2}" height="${h - pad * 2}" fill="#686957" filter="url(#bed-paint)"/>`;
  // Leaf dabs: darker low and right, lighter up and left, like the footer's bushes.
  const dabs = Math.round((w * h) / 120);
  for (let i = 0; i < dabs; i++) {
    const u = rnd();
    const v = rnd();
    const light = 1 - (u * 0.5 + v * 0.5);
    const c = GREENS[Math.min(GREENS.length - 1, Math.floor(light * GREENS.length + rnd() * 1.2))];
    const dx = x + pad + 4 + u * (w - pad * 2 - 8);
    const dy = y + pad + 4 + v * (h - pad * 2 - 8);
    s += `<use href="#bed-lf" fill="${c}" transform="translate(${f(dx)} ${f(dy)}) rotate(${Math.floor(rnd() * 360)}) scale(${f(0.9 + rnd() * 0.6)})"/>`;
  }
  // Flowers on a loose grid so they don't pile up.
  const n = Math.min(Math.max(count, 1), 9);
  const cols = Math.ceil(Math.sqrt((n * w) / h));
  const rows = Math.ceil(n / cols);
  let flowers = '';
  for (let i = 0; i < n; i++) {
    const cx = x + pad + ((i % cols) + 0.5 + (rnd() - 0.5) * 0.5) * ((w - pad * 2) / cols);
    const cy = y + pad + (Math.floor(i / cols) + 0.5 + (rnd() - 0.5) * 0.4) * ((h - pad * 2) / rows);
    flowers += flower(cx, cy, 8 + rnd() * 3, PETALS[Math.floor(rnd() * PETALS.length)], rnd);
  }
  return `<g>${s}<g class="g-bob">${flowers}</g></g>`;
}

/** The mockup's dashed outline for an empty plot. */
export function emptyPlot(key: string): string {
  return (unplanted as Record<string, string>)[key] ?? '';
}

/** Shared defs for generated beds. */
export const bedDefs =
  '<defs><path id="bed-lf" d="M0 0 C3 -4.5 9 -4.5 12 0 C9 4.5 3 4.5 0 0Z"/>' +
  '<filter id="bed-paint" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
