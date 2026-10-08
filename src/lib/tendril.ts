// The design system's tendril generator (Tendril component), ported to TypeScript.
// Curvature wobbles along the stem, then ramps hard at the end. Coils turn counter-clockwise.

export interface TendrilOpts {
  x?: number;
  y?: number;
  /** Starting heading, radians. */
  h?: number;
  len?: number;
  wobble?: number;
  freq?: number;
  coil?: number;
  /** Where the coil starts, 0–1 along the stem. 1 means no coil: the tendril stops short. */
  coilStart?: number;
  seed?: number;
}

export function tendril(o: TendrilOpts): [number, number][] {
  let x = o.x ?? 0,
    y = o.y ?? 0,
    h = o.h ?? 0;
  const len = o.len ?? 600,
    step = 3,
    w = o.wobble ?? 0.012,
    f = o.freq ?? 0.035,
    coil = o.coil ?? 0.18,
    seed = o.seed ?? 1;
  const n = Math.floor(len / step);
  const cs = Math.floor(n * (o.coilStart ?? 0.8));
  const p: [number, number][] = [[x, y]];
  let s = step;
  for (let i = 0; i < n; i++) {
    let k = w * Math.sin(i * f + seed);
    if (i > cs) {
      const t = (i - cs) / (n - cs);
      k = -coil * Math.pow(t, 1.6) - 0.01;
      s = step * (1 - t * 0.45);
    }
    h += k;
    x += Math.cos(h) * s;
    y += Math.sin(h) * s;
    p.push([x, y]);
  }
  return p;
}

export const stemPath = (p: [number, number][]) => 'M' + p.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' L');

export function leafAt(p: [number, number][], at: number, side: 1 | -1, size: number, cls: string): string {
  const i = Math.min(p.length - 2, Math.floor(p.length * at));
  const a = Math.atan2(p[i + 1][1] - p[i][1], p[i + 1][0] - p[i][0]) + side * 1.1;
  const d = (a * 180) / Math.PI;
  return `<path class="${cls}" transform="translate(${p[i][0].toFixed(1)} ${p[i][1].toFixed(1)}) rotate(${d.toFixed(1)})" d="M0 0 C${size * 0.4} ${-size * 0.55} ${size} ${-size * 0.45} ${size * 1.3} 0 C${size} ${size * 0.45} ${size * 0.4} ${size * 0.55} 0 0Z"/>`;
}
