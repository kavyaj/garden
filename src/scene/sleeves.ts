// The drawn record sleeves on /on-repeat, from the V1 mockup. Each is the inside of a 100×100 SVG.
// A record in records.yaml picks one by name (`sleeve: drop`). Covers are drawn, not borrowed:
// to add a sleeve, draw it here in ink, spot and moss, one spot shape per sleeve.

export const sleeves: Record<string, string> = {
  // A pink seed inside a ring.
  seed: '<circle cx="50" cy="50" r="26" fill="none" stroke="#131313" stroke-width="1.5"/><path d="M50 24 Q68 50 50 76 Q32 50 50 24z" fill="#fd5183"/><circle cx="50" cy="50" r="4" fill="#f0f0f0"/>',
  // A teardrop over a curve.
  drop: '<path d="M50 20 C68 44 68 62 50 74 C32 62 32 44 50 20z" fill="#fd5183"/><path d="M22 80 Q50 66 78 80" stroke="#131313" stroke-width="1.5" fill="none"/>',
  // Five strings, the middle one plucked.
  strings:
    '<line x1="26" y1="24" x2="26" y2="76" stroke="#131313" stroke-width="1.2"/><line x1="38" y1="24" x2="38" y2="76" stroke="#131313" stroke-width="1.2"/><line x1="50" y1="24" x2="50" y2="76" stroke="#fd5183" stroke-width="3"/><line x1="62" y1="24" x2="62" y2="76" stroke="#131313" stroke-width="1.2"/><line x1="74" y1="24" x2="74" y2="76" stroke="#131313" stroke-width="1.2"/><circle cx="50" cy="50" r="9" fill="none" stroke="#686957" stroke-width="1.5"/>',
  // A house with a pink door.
  house: '<rect x="28" y="40" width="44" height="34" fill="none" stroke="#131313" stroke-width="1.5"/><path d="M24 42 L50 22 L76 42" fill="none" stroke="#131313" stroke-width="1.5"/><rect x="44" y="56" width="12" height="18" fill="#fd5183"/>',
  // A pink sun over a hill.
  sunset: '<path d="M20 62 Q50 30 80 62" stroke="#131313" stroke-width="1.5" fill="none"/><circle cx="64" cy="38" r="8" fill="#fd5183"/><path d="M20 72 L80 72" stroke="#686957" stroke-width="1.5"/>',
  // Squares inside squares.
  box: '<rect x="30" y="30" width="40" height="40" fill="#131313"/><rect x="40" y="40" width="20" height="20" fill="#FDE837"/><circle cx="50" cy="50" r="4" fill="#fd5183"/>',
};

export function sleeve(name: string): string {
  const s = sleeves[name];
  if (!s) throw new Error(`records.yaml: no sleeve called "${name}". Pick one of: ${Object.keys(sleeves).join(', ')}.`);
  return s;
}
