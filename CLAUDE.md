# kavya.wiki

Kavya's digital garden. Notes that get planted, tended and sometimes composted, a shelf of quotes, a turntable of records, and a painted garden that every page scrolls down into. Kavya builds and runs it alone with Claude Code. There is no other developer.

Read this whole file before changing anything. When this file and your instincts disagree, this file wins. When this file and the design system disagree, the design system wins and this file gets fixed.

## Sources of truth

| What | Where |
|---|---|
| Design system: tokens, rules, components | https://claude.ai/artifact/1nXPMnsfRo7APjyFHyGSmN ("Kavya Wiki") |
| Page mockups, one artboard per page | https://claude.ai/artifact/Lz4Gb8d2cwxXRvEUwEcnp6 ("Kavya Wiki V1") |
| Content | `src/content/` in this repo. Flat files. No database, no CMS. |

The mockups are the spec for layout, copy tone and motion. Match them. Where a mockup uses stand-in content (records, notes, `[your portrait]`, `[your email]`), keep the structure and wait for real content.

## Stack

- **Astro**, static output. Content collections for everything Kavya writes.
- **Plain CSS** with custom properties generated from the design system's `tokens.json`. No Tailwind, no CSS-in-JS. Component styles mirror the design system's `components/bundle.css`.
- **No client framework.** Vanilla JS islands only where something reacts to the reader: the turntable, the quote unfold, relative dates, the logo intro.
- **Hosting:** not chosen yet (moving off Replit). Ask Kavya before picking one. The output is a plain static folder, so it can go anywhere without changes.
- **Commands:** `npm run dev` to preview, `npm run build` to build and check. Both run `npm run gen` first, which regenerates `src/styles/tokens.css`, `src/styles/components.css` and the painted scenes.
- Fonts from Google Fonts: Fraunces, DM Sans, Shantell Sans, and Tiro Devanagari Hindi on `/quotes` only. Home's one Devanagari quote loads Tiro subset to just its own characters. Preload Fraunces.

## Routes (V1)

| Route | Page | Mockup artboard |
|---|---|---|
| `/` | Home: tall sky, hero, recently tended, on the turntable, a quote, garden | Home |
| `/map` | The garden from above, with census and a plain list | The map |
| `/notes` | Every note, newest tended first | Notes |
| `/notes/[slug]` | One note, with marginalia and backlinks | A note |
| `/quotes` | The bento of ticket stubs | Quotes |
| `/gardener` | About, what I'm growing, small things I've made, terms of the garden | The Gardener |
| `/on-repeat` | The turntable and the shelf | On repeat |
| `/404` | "This one hasn't grown yet." A tendril that stops short. | none yet |

Not in V1, and planned as empty plots on the map: Built, Reading bench, Compost, Guestbook. Topics come later too. Don't build any of these until Kavya asks.

## Content model

All dates are ISO (`2026-10-04`). Kavya writes these files by hand or asks you to.

**Notes:** `src/content/notes/<slug>.md`

```yaml
---
title: The résumé is a compression artifact
summary: Everything interesting about a career is the part that doesn't fit on one page.
planted: 2026-10-01
tended: 2026-10-04
---
```

Body is markdown. Two extras:
- Marginalia: a fenced block ` ```aside ` renders as Shantell in the margin (see the Annotation component).
- Links to other notes are plain markdown links to `/notes/<slug>`. Backlinks are built from these at build time. No wiki syntax.

**Quotes:** `src/content/quotes.yaml`, one list

```yaml
- id: kabir-mali
  original: "माली सींचे सौ घड़ा, ऋतु आए फल होय।"
  script: deva            # deva | latin
  translit: ""
  translation: "The gardener pours a hundred pots of water, but fruit comes in its season."
  highlight: "but fruit comes in its season."   # one phrase, gets the sun-wash
  source: Kabir
  when: 15th century
  reflection: "The whole reason this site is a garden, in one line."
  ink: false             # true = the dark ticket variant. Max two on the page.
  added: 2026-10-01
```

**Records:** `src/content/records.yaml`

```yaml
- title: Teardrop
  artist: Massive Attack
  label: TEARDROP          # printed on the vinyl label, caps, short
  note: "On when I need to think and not talk."   # optional; Kavya writes it
  listen_url: https://open.spotify.com/track/...
  sleeve: drop             # which drawn sleeve, see src/scene/sleeves.ts
  added: 2026-10-01
```

Never host audio files. Playback is a link out to `listen_url`. The only sound the site makes is the generated vinyl crackle.

**Small things I've made:** `src/content/projects.yaml` (title, url, blurb, image, alt, cta, added). `image` is a file in `src/content/images/made/`, written `./images/made/<file>`; the build serves it as resized WebP. `cta` is the link label ("Play with it").

**What I'm growing:** `src/content/growing.yaml` (title, optional url, blurb), the bigger projects on The Gardener, shown in file order.

**Map plots** live in `src/site.ts` with their position in the 1200×800 map drawing. Plots the mockup didn't paint (Built, Reading bench, Compost, Guestbook) are drawn by `src/scene/beds.ts`: dashed when their collection is empty, a seeded painted bed with one flower per entry once it isn't.

**Site settings:** `src/site.ts` holds `planted` (the garden's birthday), socials (LinkedIn and X) and the list of map plots. There's no email on the site, by Kavya's choice: don't add one or a contact form.

## How the site counts itself

Nothing on the site is a hand-typed number. Everything is worked out at build time from the content files.

- **Census** on the map: `notes.length`, `quotes.length`, `records.length`, `projects.length`, and `site.planted`.
- **Recently tended** (yellow dot): a note whose `tended` is within 14 days of the build. Same rule everywhere: Home, Notes, the map's Notes bed.
- **Last tended:** the newest `tended` across notes. Output the ISO date in a `<time datetime>` and let a few lines of client JS turn it into "3 days ago", so it never goes stale between builds. Without JS it reads as the plain date.
- **Notes order:** newest `tended` first.
- **Map plots:** each plot in `site.ts` names a collection. Zero entries means a dashed "not planted yet" plot with a dashed tag. One or more means a solid bed with a count. Adding the first Compost entry redraws the map with no other change.
- **Backlinks:** build an inverted map of note-to-note links. A note with any backlinks shows the Backlinks component (tendril vine) under "Mentioned in".

## Page anatomy

Every page is three layers, top to bottom:

1. **Sky.** `SkyHome` (900px, canopy in both top corners, layered clouds, birds) on `/`. `SkyMap` (620px, same) on `/map`. `SkyStrip` (210px, one cloud, one bird) on every other page. The header sits on the sky. Each sky ends in a cloud bank that turns into `paper`.
2. **Paper.** All content. Scrapbook rules from the design system: square paper, hard offset shadows, tape, tilts inside containers only.
3. **Garden.** `GardenFooter` on every page: canopy trees, hedge, bushes, lawn, path, and the green arch with the iron gate. The arch links to `/map` with a gate sign reading "the map, this way". On `/map` it links to `/` and reads "back to the start". Below it, the footer on `garden-deep` with the menu in one horizontal row.

Make these three layout components (`SkyHome`, `SkyMap`, `SkyStrip`, `GardenFooter`) and one `Base` layout that composes them, so a new page is just its middle.

## The painted scenes

The mockups hold only the painted output, not a generator. So the sources are that output, copied from the V1 mockups into `src/scene/source/` (garden, Home sky, map sky, one strip per inner page). `src/scene/paint.ts` cuts each one into cached static layers in `public/scene/` and a small inline part in `src/scene/generated/`. Every build paints the same garden. It also holds a small table of cloud nudges so no text sits on a cloud. A seeded generator is still needed for anything new, like the map's beds; write it in `src/scene/` when that page is built.

Performance matters more than fidelity here. The mockups inline about 600KB of SVG per page, which is too heavy to ship.

- At build time, render the static painted layers (dabs, hedge, lawn, canopies) to an optimised SVG file per scene, and reference it as an image. It's identical on every page, so it caches.
- Inline only what moves or responds: the clouds (drift), the gate leaves (open on hover), the gate sign, the birds.
- Budget: under 250KB transferred for any page on first load, fonts excluded. Check with the build output, not by guessing.
- If Kavya later hand-paints the arch, canopy or a bush in Procreate, those come in as transparent PNG or WebP and replace the generated layer. Keep the animated parts as they are.

Brush rules: crisp edges with a turbulence displacement filter for the wobble. Never blur, gradient washes or watercolour bleeds. Blur is banned site-wide because it causes eye strain.

## Motion

- One big moment per page: the scroll from sky to garden.
- Clouds drift about 48px over 30 to 46s, alternating. Bushes sway ±0.8deg. Flowers bob 2px. The gate swings open on hover or focus (scaleX to .18, 700ms).
- Paper hover: 2px nudge up-left, `shadow-press` to `shadow-lift`, 220ms.
- Stroke draws: 1.9s `cubic-bezier(.35,.1,.25,1)`.
- `LogoIntro` plays once per session (sessionStorage flag), never under reduced motion.
- `prefers-reduced-motion: reduce`: everything renders in its final state. Links, the gate link, the turntable and sound still work.

## Interactions

- **Turntable** (`/on-repeat`): pick a sleeve, then drop the needle (button, and dragging the arm past halfway). The record spins, the potted plant on the plinth dances, the crackle fades in through WebAudio. Lift to stop. Arrow keys work on the arm. The audio context is created on the first click, never on load.
- **Quote unfold:** the ticket stub's reflection is clipped by the tile edge. Click to unfold it in place. One open at a time.
- **Map:** every planted bed and its hanging tag is one link. Tags straighten on hover. The map has a plain-list version below it for phones and screen readers. Don't remove it.

## Floors

- Text contrast 4.5:1 minimum. `spot` (pink) is never text. `sun` is never text on paper. Ink on the sky bands is over 9:1. Use these, not new colours.
- Every interactive thing is a real `<a>` or `<button>` with a visible focus ring (`ink`, or `spot` on scenes), and at least 44px tall.
- Every scene SVG is `aria-hidden`. The arch link has an `aria-label`.
- Works at 360px wide: nav wraps, scenes crop to the centre (the arch and path), no horizontal scroll.
- No dark mode. Paper doesn't invert.
- No trackers, cookie banners or third-party scripts. Analytics, if ever, must be cookieless.

## Copy and voice

Any copy you write (empty states, alt text, 404, meta descriptions, button labels) follows Kavya's voice:

- Short paragraphs, contractions always, sharp and a little wry.
- No em dashes, ever. Use a full stop, a comma or a colon.
- Banned: "landscape", "leverage", "game-changer", "unlock", "delve", "quietly", and any "This isn't X, this is Y" construction.
- No LinkedIn-speak or clichés. Physical verbs for abstract ideas. Humour through specificity.
- Garden verbs where they're natural: planted, tended, unfold, drop the needle. Plain words where a stranger needs them.
- Shantell (handwriting) is only for Kavya's own voice. If removing a sentence loses information, it's DM Sans.

Never write a note, quote reflection or record note for Kavya. Draft only when she asks, and mark it as a draft.

## Common jobs

- **"Add a note":** create `src/content/notes/<slug>.md` with `planted` and `tended` set to today. Slug from the title, lowercase, hyphens.
- **"I tended X":** set `tended` to today in that note. Nothing else changes; the dot, the order and the census follow.
- **"Add a record / quote / project":** append to the YAML file. Pick a sleeve that isn't already on the shelf.
- **"Plant a new section"** (Compost, Reading, Built, Guestbook): ask Kavya first. Then add the collection, the route, the plot in `site.ts`, and the page in the same three-layer anatomy. Ask before inventing any new component; check the design system for one first.
- **Before every commit:** `npm run build` must pass, with no broken internal links (fail the build on one) and pages under budget.

## Don't

- Add flowers, leaves or garden art anywhere except the scenes and the tendril.
- Put text on a cloud.
- Make the footer menu vertical or handwritten.
- Add a second big tendril to a screen, or a tendril on the arch.
- Use blur, `backdrop-filter`, soft shadows or gradients as fills.
- Add a dependency for something 30 lines of code can do.
- Change a colour, font or rule without updating the design system first.

## Still open

- A note for Chasing Cars, and the rest of the shelf (up to six records).
- The real Spotify track link for Chasing Cars (it's a search link for now).
- The first real notes (the mockup titles are placeholders).
