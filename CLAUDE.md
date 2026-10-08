# kavya.wiki

Kavya's digital garden: the place for the thinking that doesn't fit on LinkedIn. Half-ideas, things she's changed her mind about, words she keeps returning to. Kavya builds and runs it alone with Claude Code.

**The order of importance is Kavya, then what she thinks and makes, then the garden.** The garden is the site's physics (things get planted, tended, left alone, revisited), not its decoration. When in doubt, take something away.

Read this whole file before changing anything. If this file and the design system disagree, the design system wins and this file gets fixed.

## Sources of truth

| What | Where |
|---|---|
| Design system: tokens, rules, components | https://claude.ai/artifact/1nXPMnsfRo7APjyFHyGSmN ("Kavya Wiki", V2) |
| Page mockups | https://claude.ai/artifact/Lz4Gb8d2cwxXRvEUwEcnp6, the page called **"V2, quieter"**. Ignore the "V1" page. |
| Content | `src/content/` in this repo. Flat files, no database, no CMS. |

The V2 mockups are the spec for layout, spacing, copy and motion. Match them. Stand-in content (`[your portrait]`, `[your email]`, the record notes) keeps its structure until Kavya supplies the real thing.

## Migrating from V1 (do this first)

The site was already built once, against V1 (sky to garden). V2 is a deliberate subtraction. Before building anything new:

**Remove**
- The sky scenes (`SkyHome`, `SkyMap`, `SkyStrip`), clouds, birds and canopy corners.
- `GardenFooter` and the whole painted garden: arch scene, bushes, lawn, brush flowers, and the scene generator (`src/scene/` or wherever it lives) with its pre-rendered SVGs.
- Tape, tilted or rotated paper, hard offset shadows, the ticket-stub quote tiles with tear lines, hanging tags (on the map or anywhere), ink slabs.
- The `LogoIntro` animation. The logo is static now.
- The V1 colour tokens: `moss`, `leaf`, `spot-wash`, `moss-tape`, `paper-press`, every `sky-*`, `cloud-*`, `garden-*` token, `lawn` (V1 value), `path-edge`, `bud`.
- Any Shantell (handwriting) used for kickers, buttons, labels or quote reflections.

**Change**
- `/gardener` becomes `/about`. Nav label "About", page heading "The gardener". Add a permanent redirect from `/gardener`.
- Add `/made` ("Things I've made") as a top-level page.
- `/map` stays, but leaves the header nav. It's reached through the gate drawing on Home and from the footer.
- Notes render as a plain list everywhere. No note cards.
- Footer becomes the small dark green band.
- Swap in the V2 tokens (below) and the paper grain.

**Keep:** the content collections, the census logic, the yellow-dot rule, backlinks, the relative-date script, the turntable logic and crackle, the fonts, and the voice rules.

Do the migration as one commit ("Migrate to V2: remove scenes, new tokens") before any new work, and make sure the build passes with nothing from the removal list still referenced.

## Stack

- **Astro**, static output. Content collections for everything Kavya writes.
- **Plain CSS** with custom properties from the design system's `tokens.json`. Class names follow the V2 mockup (`ul`, `tl`, `row`, `card`, `vine`). The design system's `components/bundle.css` has the same rules with a `kw-` prefix.
- **No client framework.** Small vanilla JS only for: the turntable, relative dates, and starting the tendril draw when it scrolls into view.
- **Hosting:** not chosen yet (moving off Replit). Ask Kavya before picking one. Output is a plain static folder.
- **Commands:** `npm run dev` to preview, `npm run build` to build and check, `npm run export` for a one-file preview to share (`exports/`, not committed).
- **Fonts** (Google Fonts): Fraunces, DM Sans, Shantell Sans, and Tiro Devanagari Hindi on pages that show Devanagari: in full on Quotes, subset to the featured quote's characters on Home. Preload Fraunces.

## Routes

| Route | Page | Mockup artboard |
|---|---|---|
| `/` | Home | Home |
| `/notes` | Notes, grouped by year | Notes |
| `/notes/[slug]` | One note | A note |
| `/quotes` | Quotes | Quotes |
| `/on-repeat` | The turntable and the shelf | On repeat |
| `/made` | Things I've made | Things I've made |
| `/about` | About ("The gardener") | About |
| `/map` | The garden from above | The map |
| `/404` | "This one hasn't grown yet." with a tendril that stops short | none, build in the same style |

Header nav, in this order and with these exact words: **Notes · Quotes · On repeat · Things I've made · About.** Interface words stay boring on purpose; the content gets to be surprising.

Planned for later, shown as dotted plots on the map: Reading, Compost, Guestbook. Don't build these until Kavya asks.

## Tokens (V2)

| Token | Value | Job |
|---|---|---|
| `paper` | `#F4F1EA` | Page ground, with grain |
| `paper-lift` | `#FBFAF6` | Cards only |
| `ink` | `#1A1916` | Text, lines, focus ring (15.6:1) |
| `muted` | `#6B675E` | Summaries, dates, captions, margin notes (5.0:1) |
| `hair` | `rgba(26,25,22,0.12)` | Hairlines, card borders, card hover shadow |
| `green` | `#2F5D45` | The one green: tendril leaves, backlinks glyph, "playing" |
| `green-deep` | `#22442F` | Footer only |
| `green-mid`, `green-soft` | `#3F6B52`, `#6E8F72` | Gate drawing and map only |
| `spot` | `#fd5183` | Link underlines, active nav, the one flower, vinyl label, selected sleeve. Never text |
| `blue` | `#A7CDE0` | Sky through the gate, water on the map |
| `sun` | `#FDE837` | The recently-tended dot |
| `sun-wash` | `rgba(253,232,55,0.7)` | One highlighted phrase per page |
| `path`, `lawn` | `#E7E0D1`, `#E4E8D7` | Gate drawing and map only |

Pink and yellow never appear in the same component.

**Paper grain:** an absolutely positioned SVG behind the content (`mix-blend-mode: multiply`, opacity .5) with two `feTurbulence` layers: fine grain (`baseFrequency .9`, 16% alpha) and horizontal fibre (`baseFrequency .012 .18`, 9% alpha). It sits under content, never over cards. Render it once in the base layout. If it costs paint performance on long pages, bake it to a small tiled PNG instead.

## Type

- **Fraunces**: H1 (`opsz 144, SOFT 50, WONK 1`, weight 600), H2 (weight 600), titles in lists (23 to 24px, weight 500), quotes.
- **DM Sans**: everything else. Nav, body (17px; articles 18.5px at 1.7), dates, labels, buttons, quote reasons.
- **Shantell Sans**: exactly three kinds of place. One margin note per article at most, the caption under the gate on Home, "thanks for wandering in" in the footer. Never rotated, never in UI.

## Content model

All dates ISO (`2026-10-05`).

**Notes:** `src/content/notes/<slug>.md`

```yaml
---
title: The résumé is a compression artifact
summary: Everything interesting about a career is the part that doesn't fit on one page.
planted: 2026-03-12
tended: 2026-10-05
margin: still not sure if this is a complaint or a design brief.   # optional, max one
highlight: nine words on a page                                     # optional, exact phrase in the body
---
```

Body is markdown. Links to other notes are plain links to `/notes/<slug>`; backlinks come from these.

**Quotes:** `src/content/quotes.yaml`

```yaml
- id: kabir-mali
  original: "धीरे-धीरे रे मना, धीरे सब कुछ होय। माली सींचे सौ घड़ा, ऋतु आए फल होय।"
  translation: "Slowly, mind, everything happens slowly. The gardener pours a hundred pots of water, but fruit comes in its season."
  source: Kabir, 15th century
  why: The whole reason this site is a garden, in two lines.
  featured: true     # exactly one: shown big at the top of /quotes and on Home
  added: 2026-10-01
```

**Records:** `src/content/records.yaml` (title, artist, note, listen_url, sleeve, added). `sleeve` picks a drawn two-colour sleeve (`ink` + `spot`) from `src/sleeves.ts`. Never real album art, never hosted audio.

**Things I've made:** `src/content/projects.yaml` with `kind: run` (StoryCV, Resumey.Pro, Red Thread Careers, The Brave Rocketeers: shown as a list with a "Since 2019" style note) or `kind: small` (weekend projects: shown as cards with a 16:10 screenshot).

**Site settings:** `src/site.ts`: `planted`, socials (LinkedIn and X), map plots. No email on the site, by Kavya's choice: no email link or contact form anywhere, even where a mockup shows `[your email]`.

## How the site counts itself

Nothing is a hand-typed number. All of it is computed at build time.

- **Yellow dot:** a note whose `tended` is within 14 days of the build. Same everywhere.
- **Dates in lists:** "Tended 5 Oct" this year, "Tended Jan 2025" otherwise. The Notes page adds "planted Mar 2026" underneath, or "never tended since" when `planted == tended`.
- **Neglect shows:** notes not tended for over a year get a `muted` title. Don't hide old notes.
- **Last tended** (map census, note header): output `<time datetime>`; a few lines of JS turn it into "3 days ago" in the browser where that reads better. Without JS it's the plain date.
- **Map census:** one line under the map: "7 notes, 6 quotes, 6 records, 7 things made. Last tended 5 Oct 2026."
- **Map plots:** each plot in `site.ts` names a collection. Empty means a dashed plot labelled "later"; one entry or more means a drawn bed with a count.
- **Backlinks:** inverted note-to-note link map. "Mentioned in" only renders when there's at least one.

## Page anatomy

Every page: `SiteHeader`, the page's content, `Footer`. That's it. No scenes above or below.

- **Home:** H1 "A garden I tend in public.", two lines about Kavya (with "still figuring out" highlighted), "This is where I put the thinking that doesn't fit on LinkedIn." On the right, the gate drawing (`GateIllustration`), which links to `/map`. Then the page's one tendril, Recently tended (4 notes, list), the featured quote large, then On repeat and Things I've made side by side, small.
- **Notes:** H1, one paragraph, the list by year, then a tendril trailing off next to "That's everything, for now."
- **A note:** narrow editorial column (36rem), title, meta line, body, margin note on the right on wide screens (inline on phones), "Mentioned in", All notes and Next.
- **Quotes:** H1, intro, the featured quote big with no card (the page's loud thing), a tendril, then `QuoteCard`s with "Why I keep it" in a native `<details>`.
- **On repeat:** turntable on the left, the 3×2 shelf on the right. See Interactions.
- **Things I've made:** the `run` list, a tendril, the `small` cards.
- **About:** "The gardener" bio and portrait, a tendril, then Terms of the garden with "Everything here is a work in progress, including me." set large in Fraunces.
- **The map:** flat drawn plan (no scene, no hanging tags), plain labels with a count, a dashed ink outline on hover, the census line, then the same garden as a plain list for phones and screen readers. Keep that list.

**One loud thing per viewport.** If a section has a big title, a big quote or the drawing, everything near it stays quiet.

## Tendrils

At most one big tendril per page, and it always has a job: a divider between the two halves of a page, or the end of a list. It's a thin ink line (1.6px) with a counter-clockwise coil and two small leaves (`green`, `green-soft`). It draws in once (2.2s) when it scrolls into view.

Small marks that don't count toward the one: the glyph beside "Mentioned in", the coil beside the footer signoff, and the pink coil that draws off the end of a `tl` link on hover.

Never on cards, never on the gate drawing, never looping.

## Motion

Only these:
1. **Growth:** the gate drawing grows in once on Home (about 2.6s in total); a page's tendril draws in once.
2. **The gate:** swings open on hover and focus (700ms), because it's the door to the map. The flower leans a little.
3. **Hover details:** list titles get a pink underline growing from the left, `tl` links draw a coil, cards lift 2px with a `hair` shadow.
4. **The turntable:** arm swing and spinning record.

Nothing else moves. The logo is static. `prefers-reduced-motion`: everything shows in its final state, and the gate link and turntable still work.

## Interactions

- **Turntable** (`/on-repeat`): picking a sleeve gives it a 2px pink outline and puts the record on the platter with its title on the pink label. "Drop the needle" is a real `<button>`: the arm swings 24deg, the record spins, and a soft crackle fades in (WebAudio noise through a 700Hz highpass, created on first click). "Lift the needle" reverses it. "Listen on Spotify" links out.
- **Quote reasons:** native `<details>`; the `+` rotates into an `×`.
- **Map:** each planted bed is one link. Unplanted plots aren't links.

## Floors

- Text 4.5:1 minimum. Pink and yellow are never text.
- Real `<a>` and `<button>` everywhere, visible `ink` focus ring, targets at least 44px.
- Decorative SVG is `aria-hidden`. The gate link has `aria-label="Through the gate: a map of the whole site"`.
- Works at 360px wide: the nav wraps, the margin note drops inline, the shelf stays 3 across or drops to 2, no horizontal scroll.
- Under 150KB transferred per page on first load, fonts excluded.
- No dark mode, no trackers, no cookie banner.

## Copy and voice

Any copy you write (alt text, empty states, 404, meta descriptions, labels) follows Kavya's voice:

- Short paragraphs, contractions always, sharp and a little wry.
- No em dashes, ever.
- Banned: "landscape", "leverage", "game-changer", "unlock", "delve", "quietly", and any "This isn't X, this is Y" construction.
- No LinkedIn-speak, no clichés. Physical verbs. Humour through specificity.
- Plain words in the interface. Garden verbs (planted, tended) only for dates.

Never write a note, quote reason or record note on Kavya's behalf unless she asks, and mark anything you draft as a draft.

## Common jobs

- **"Add a note":** new file in `src/content/notes/` with `planted` and `tended` set to today.
- **"I tended X":** set `tended` to today. The dot, the order and the census follow.
- **"Add a quote / record / project":** append to the YAML file.
- **"Plant Reading / Compost / Guestbook":** ask first. Then the collection, the route, the map plot, and the page in the same anatomy, reusing existing components. Check the design system before inventing anything.
- **Before every commit:** `npm run build` passes, there are no broken internal links (fail the build on one), and no page goes over budget.

## Don't

- Bring back anything from the V1 removal list.
- Add illustrations beyond the gate drawing and the map.
- Use cards for notes.
- Use Shantell outside its three places.
- Put pink and yellow in one component.
- Add a second big tendril to a page.
- Animate anything not listed under Motion.
- Use blur, gradients as fills, soft shadows, rotations or tape.
- Add a dependency for something 30 lines of code can do.

## Still open

- The rest of the records (Chasing Cars is the only one so far), with a note each, and Chasing Cars' Spotify track link.
- The real notes (the mockup titles are placeholders).
