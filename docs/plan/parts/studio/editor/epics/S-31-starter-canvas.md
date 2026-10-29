# S-31 — Starter canvas

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: S-01, S-03, S-18 · Status: ready

## Goal
An empty page never opens as a blank white rectangle. It opens with a **randomly generated starter layout**: a handful of blocks with random sizes and arrangement, different every time, in a random, mostly pastel colour palette. Each block is a rounded, bordered frame that is empty except for a prompt input in its centre, so the user can start by describing what goes where. Under the hood the layout is always a real flex/grid tree (D-01, D-28), so it stays responsive and exports to clean code.

## Scope
- In: random layout generator (seeded, valid block tree); random pastel palettes for empty frames; the starter layout on new and empty pages; shuffle; keeping chosen blocks while shuffling; starting empty instead; the centred prompt input in empty blocks (its generation is S-04).
- Out: the frame chrome and border buttons themselves (S-03); AI-generated page layouts from a description (S-22); templates (S-29).

## Concepts and model
- **Starter layout**: a block tree built by a generator from a **seed**: a column of 2–5 sections; each section is either one leaf or a row (sometimes a grid) of 2–4 leaves, some split again; sizes come from random grow ratios and section heights. Only frames are generated, never bodies or coordinates.
- **Scaffold colour**: an editor-only colour per block, drawn from a palette chosen at random per shuffle (mostly pastel: light, low-saturation fills with a slightly darker border; now and then one stronger accent block). Stored in the block's Studio-only metadata (`editor`), never exported and never part of the user's theme (S-01).
- **Seed**: stored with the page until the user edits it, so reload shows the same starter; shuffle picks a new seed.

## User stories
- **US-1** `[alpha]` As a user, a new page opens with a random arrangement of empty blocks, so that I start from shapes, not from nothing.
  - Acceptance: creating a page shows 3–10 empty blocks in a valid layout (visible in the Structure panel as containers and leaves); two new pages look different; each empty block shows a centred prompt input.
  - Notes: the generator is a pure function of the seed in `packages/core`, so the same seed always gives the same layout.
- **US-2** `[alpha]` As a user, empty blocks have soft, varied colours with rounded borders, so that I can tell them apart at a glance.
  - Acceptance: each empty block has a pastel fill and border from the page's random palette; colours never appear in the run preview or Compact output.
- **US-3** `[MVP]` As a user, I can shuffle the starter layout until I like it, so that I can explore arrangements quickly.
  - Acceptance: a Shuffle button generates a new layout and palette; shuffle is undoable; blocks that already have a prompt or body are kept in place while the rest are reshuffled.
- **US-4** `[MVP]` As a user, I can choose how a new page starts: random starter, empty, or a copy of another page, so that the starter never gets in my way.
  - Acceptance: the "new page" action offers the three options; the default is remembered in project settings.
- **US-5** `[MVP]` As a user, I can shuffle only the colours, so that I can keep a layout but change its mood while sketching.
  - Acceptance: "Shuffle colours" changes the scaffold palette without touching the layout; undoable.

## UX notes
Calm and playful at the same time: generous gaps, large corner radii, soft pastel fills on the warm Studio background (D-30). Each empty block shows only its prompt input; border buttons appear on hover or selection (S-03). Shuffle sits in the canvas header, next to the viewport controls.

## Technical design
Seeded pseudo-random generator in `packages/core` producing a block tree that passes validation (S-01). Palettes generated in OKLCH (same utility as the theme palette tool, S-05) for even lightness across hues. A shuffle is one history transaction (S-15).

## Tests (optional)
Generator property checks: every seed produces a valid tree within the block-count limits; the same seed produces the same tree.

## Risks and open questions
- Random layouts must still look intentional; tune the generator's limits (depth, minimum sizes) with real use.
- How starter blocks behave at phone width belongs to the Mobile part's defaults; until then rows wrap.

## Done when
- [ ] New pages open with a random, valid, pastel starter layout with prompt inputs in empty blocks.
- [ ] (MVP) Shuffle (layout and colours), keep-filled-blocks, and the start-mode choice work.
