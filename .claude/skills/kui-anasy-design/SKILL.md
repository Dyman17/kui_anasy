---
name: kui-anasy-design
description: Project visual direction for «Күй анасы» — the client-approved book-cover palette (forest green, antique gold, parchment), typography status (move to one main family), page character, imagery and cultural-content rules. Use together with visual-direction and design-system for any UI work in this repository.
---

# «Күй анасы» — project design direction

Status: updated 05.11.2026 to match the code and the client's confirmed direction. Where `client/README.md` disagrees (its palette and font tables describe an older terracotta/plum system), **this skill and the `:root` tokens in `client/src/styles.css` win**. Updating `client/README.md` is a separate task.

## Audience and tone
Readers of all ages interested in Kazakh music and culture, many on phones, many arriving by QR code at the Kuyshiler alley and monuments; older readers are a core group. Tone: documentary, calm, ceremonial, contemporary — a museum catalogue and a concert programme, not a startup page.

## Colour (client-approved: «Ұлы дала әуені» book cover)
Reference image: `client/public/images/uly-dala-aueni-cover.jpg`.

| Role | Token | Value |
|---|---|---|
| Deep surface / header in dark areas | `--forest-deep` | `#0B1C15` |
| Primary brand green | `--forest` | `#10291F` |
| Raised green surface | `--forest-light` | `#1D4030` |
| Accent gold | `--gold` | `#D7B45F` |
| Highlight gold | `--gold-light` | `#F0D78C` |
| Lines, badges, gold text on light | `--gold-dark` | `#A9853C` |
| Light canvas | `--parchment` | `#F2EBDD` |
| Surface | `--paper` | `#E8DFC9` |
| Ink | `--ink` | `#26372D` |
| Muted ink | `--ink-muted` | `#536458` |

- Use semantic aliases in components (`--bg-canvas`, `--bg-surface`, `--text-primary`, `--text-muted`, `--accent-gold`, `--line`).
- `--terra`, `--plum`, `--wine` are legacy aliases mapped onto the green/gold palette; do not use them in new code.
- Two themes exist (`data-theme="light" | "dark"` on `<html>`); every new surface must be checked in both.
- Gold is an accent: headings marks, rules, focus, key actions. Never gold body text on parchment below 4.5:1 — use `--gold-dark` or ink.
- No purple/blue, no decorative gradients beyond the existing photo-shading overlays.

## Typography
- **Client requirement:** one main typeface that carries the brand, readable in long articles, with full Kazakh support. The current site still loads several families (Medeo Sans for body, KTF Jermilov, Nauryz Red Keds, Playfair Display, Alistair Signature, Capture It and others via `--font-*` tokens).
- **Proposed, pending client approval:** Literata (variable, OFL; specimen `docs/font-specimen.png`). Until approved: **do not add any new family** and do not spread the secondary display families to new components. New UI uses `--font-body` and existing display tokens only.
- Fonts load only from `client/fonts/`; no Google Fonts or CDNs.
- Kazakh glyphs ә ғ қ ң ө ұ ү һ і (both cases) must render; check uppercase specifically before using `text-transform: uppercase`.
- Person names in headings: `white-space: nowrap`; size them with `clamp()` so the longest name fits at 320 px.
- Body ≥ 16 px desktop, ≥ 15 px mobile; measure 55–75 characters.

## Composition and page character
- Editorial and uneven: one dominant image or title per screen, staggered story blocks, catalogue-like lists. Avoid equal card grids and numbered rows as defaults.
- **Home:** strong Kazakh headline, documentary photography, the heritage map (`client/src/components/HeritageMap.jsx`), clear routes into people, music, library.
- **People:** biographical emphasis — name, confirmed dates, region/school, sources. No invented portraits.
- **Library:** real covers, calm catalogue reading.
- **Monument / alley:** photography first; content works on a phone in daylight (contrast, large type).
- **Admin:** functional and legible; same tokens, no decorative treatment.

## Imagery, patterns, cultural content
- Use supplied photographs and archival scans with credits; no stock substitutes.
- Instrument contour patterns (`client/public/patterns/contour-*.svg`) are contemporary graphics, used at low contrast behind open areas, never at full strength under body text. They are not claims about traditional symbolism.
- `client/public/images/dombra-player-illustration.png` is an illustration, not a portrait of a named person.
- Static ornament frames on page edges, faux parchment textures and random ornament packs are not used.

## Hard rules
No invented facts or numbers (route content to `content-guard`); no fake buttons or players; no new npm dependencies; Kazakh text never broken; check both themes and 320–1280 px.

## Acceptance checklist
- [ ] `npm run build` passes.
- [ ] No console errors; no external font/CDN requests.
- [ ] Kazakh glyphs correct in every new text style; names unbroken.
- [ ] Light and dark themes checked.
- [ ] 320 / 375 / 768 / 1280 px checked.
- [ ] New content has a source.
