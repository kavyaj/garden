// Turns the design system's tokens.json into src/styles/tokens.css.
// tokens.json is a copy of the "Kavya Wiki" design system. Change it there first, then copy it here.
import fs from 'node:fs';

const t = JSON.parse(fs.readFileSync('src/design/tokens.json', 'utf8'));
const lines = [];
const alias = (v) => (typeof v === 'string' ? v.replace(/^\{(.+)\}$/, 'var(--$1)') : v);

for (const tok of t.color.tokens) lines.push(`  --${tok.name}: ${alias(tok.value)};`);
for (const fam of ['spacing', 'radius', 'shadow', 'rotation', 'measure']) {
  for (const tok of t[fam]?.tokens ?? []) lines.push(`  --${tok.name}: ${tok.value};`);
}
for (const [name, stack] of Object.entries(t.type.families)) lines.push(`  --font-${name}: ${stack};`);

const classes = [];
for (const group of t.type.groups) {
  for (const s of group.styles) {
    const lh = s.lineHeight;
    lines.push(`  --text-${s.name}: ${s.fontStyle ? s.fontStyle + ' ' : ''}${s.fontWeight} ${s.fontSize}/${lh} var(--font-${group.family});`);
    classes.push(
      `.type-${s.name}{font:var(--text-${s.name});letter-spacing:${s.letterSpacing ?? 0}` +
        (s.opticalSize ? `;font-variation-settings:"opsz" ${s.opticalSize}` : '') +
        '}'
    );
  }
}

const css = `/* Generated from src/design/tokens.json by scripts/tokens.mjs. Don't edit. */\n:root{\n${lines.join('\n')}\n}\n${classes.join('\n')}\n`;
fs.mkdirSync('src/styles', { recursive: true });
fs.writeFileSync('src/styles/tokens.css', css);
console.log(`tokens.css: ${lines.length} properties, ${classes.length} type styles`);

// The design system's component styles, minus its font @import: fonts load per page from Base.astro,
// so Tiro Devanagari Hindi only loads on /quotes.
const bundle = fs.readFileSync('src/design/bundle.css', 'utf8').replace(/^@import url\(".*?"\);[^\n]*\n/m, '');
fs.writeFileSync('src/styles/components.css', `/* Generated from src/design/bundle.css by scripts/tokens.mjs. Don't edit. */\n${bundle}`);
