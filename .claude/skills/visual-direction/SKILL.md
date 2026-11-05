---
name: visual-direction
description: Project method for developing a visual direction from audience, purpose, content and references before any UI is built — produces a design brief with composition, typography, colour, interaction and states. Use when designing a new page or section, redesigning something that feels generic, or when a frontend change needs a visual decision. This is the project skill; it replaces the global frontend-design skill in this repository.
---

# Visual direction

A visual direction is a set of decisions that follow from *who reads this, why, and what the content is*. It is never a style picked first and filled in later. Different projects get different directions; this skill gives the method, not the look.

## Workflow

### 1. Audience and purpose (write 4–6 lines)
- Who arrives, from where (QR code at a monument? search? social link?), on what device, with what prior knowledge and reading stamina.
- The single job of the page: learn, find, listen, apply, contact. One primary action at most.
- Tone in three adjectives that exclude something (e.g. "documentary, calm, ceremonial" excludes playful and salesy).

### 2. Content inventory (before any layout)
List what really exists: headings, body length (words), images (count, aspect ratio, quality, provenance), audio/video, data, quotes, captions, CTAs. Mark what is missing or unverified. **Layout follows the real content**; never design for placeholder content that may never arrive.

### 3. References (3–5, from outside the obvious genre)
For each: URL or name, **one specific thing** to take (a grid, a caption treatment, a type pairing, a rhythm), and what not to take. Good sources: museum collections, publishers, archives, newspapers, exhibition catalogues, record labels. Avoid SaaS landing pages and template galleries as references for cultural/editorial work.

### 4. The direction (one paragraph + 3 principles)
Name it in plain words ("archive catalogue on warm paper", "concert programme"). State three principles that will settle future arguments, e.g. "image first, text beside, never over", "one accent colour per screen", "type does the decorating".

### 5. Composition
- Define the grid: columns, gutters, max widths, reading measure (55–75 characters).
- Choose a dominant element per screen. Vary density between sections: an open image spread, then a dense list, then a quiet text column.
- Describe each breakpoint (mobile ≤ 480, tablet ≤ 768, desktop ≥ 1024): order, what collapses, what disappears.
- Whitespace is assigned, not leftover: name the spacing tokens between major blocks.

### 6. Typography
- Prefer one family with a strong range (optical sizes, weights) over several families. A second family only with a reason.
- Specify a scale (e.g. 5–7 steps), line heights, letter-spacing for caps, max line length.
- Verify language support for every character the content uses before choosing a font.

### 7. Colour and surfaces
- Roles, not swatches: canvas, surface, ink, muted ink, accent, line, danger/success. Assign every colour a role.
- One accent used sparingly. Check text contrast on every surface (4.5:1 body, 3:1 large text and UI).
- Decoration (patterns, textures) only where it carries meaning and never under body text at full strength.

### 8. Interaction and motion
What responds to the user and how (hover, focus, open/close, scroll). Motion must explain a change of state; see the `motion-design` skill.

### 9. States
Empty, loading, error, very long text, missing image, one item vs many, keyboard focus.

## Anti-patterns (reject in your own brief)
Equal card grids as the default layout; centered hero + three features; decorative gradients; purple/blue SaaS palette; pill-shaped buttons and huge radii everywhere; glassmorphism; icons as filler; numbered 01/02/03 sections without meaning; all-caps mono labels everywhere; animation on every element; stock imagery standing in for real content.

## Quality criteria (brief is ready when)
- [ ] Every decision traces back to audience, purpose or content.
- [ ] Composition is described per breakpoint, with the dominant element named.
- [ ] Type scale and colour roles use existing tokens or name new ones explicitly.
- [ ] States and accessibility notes are present.
- [ ] An engineer could build it without making a visual decision.
- [ ] Out of scope is listed.

Write the brief to `docs/design/<slug>.md` (sections in `docs/design/README.md`). For this repository, also apply `kui-anasy-design`.
