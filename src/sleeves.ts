// The drawn record sleeves on /on-repeat, from the V2 mockup. Each is the inside of a 100×100 SVG,
// in two colours only: ink and spot. Never real album art.
// A record in records.yaml picks one by name (`sleeve: drop`), one not already on the shelf.

const INK = '#1A1916';
const SPOT = '#fd5183';

export const sleeves: Record<string, string> = {
  // A pink seed inside a ring.
  seed: `<circle cx="50" cy="50" r="26" fill="none" stroke="${INK}" stroke-width="1.5"/><path d="M50 24 Q68 50 50 76 Q32 50 50 24z" fill="${SPOT}"/>`,
  // A teardrop over a curve.
  drop: `<path d="M50 20 C68 44 68 62 50 74 C32 62 32 44 50 20z" fill="${SPOT}"/><path d="M22 80 Q50 66 78 80" stroke="${INK}" stroke-width="1.5" fill="none"/>`,
  // Five strings, the middle one plucked.
  strings: [26, 38, 50, 62, 74]
    .map((x) => `<line x1="${x}" y1="24" x2="${x}" y2="76" stroke="${x === 50 ? SPOT : INK}" stroke-width="${x === 50 ? 3 : 1.2}"/>`)
    .join(''),
  // A house with a pink door.
  house: `<rect x="28" y="40" width="44" height="34" fill="none" stroke="${INK}" stroke-width="1.5"/><path d="M24 42 L50 22 L76 42" fill="none" stroke="${INK}" stroke-width="1.5"/><rect x="44" y="56" width="12" height="18" fill="${SPOT}"/>`,
  // A pink sun over a hill.
  sunset: `<path d="M20 62 Q50 30 80 62" stroke="${INK}" stroke-width="1.5" fill="none"/><circle cx="64" cy="38" r="8" fill="${SPOT}"/><path d="M20 72 L80 72" stroke="${INK}" stroke-width="1.5"/>`,
  // A black square with a pink dot.
  box: `<rect x="30" y="30" width="40" height="40" fill="${INK}"/><circle cx="50" cy="50" r="6" fill="${SPOT}"/>`,
};

export function sleeve(name: string): string {
  const s = sleeves[name];
  if (!s) throw new Error(`records.yaml: no sleeve called "${name}". Pick one of: ${Object.keys(sleeves).join(', ')}.`);
  return s;
}
