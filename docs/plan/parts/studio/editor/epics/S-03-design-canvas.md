# S-03 — Design canvas

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: S-01, S-02 · Status: ready
> Updated 2026-10-28: block frames with border buttons replace the floating toolbar (D-29).

## Goal
The centre of the Studio: a canvas that renders the current page from the project data at any real device width, from a phone to 4K, scaled to fit the screen, with instant feedback on every edit (D-20, D-27). Every block is drawn as a rounded, bordered **frame** with management buttons on its border (D-29); the frames stay visible after content is generated and can be hidden to see the clean result, which looks the same as the run preview.

## Scope
- In: iframe renderer of the universal layer (frames, bodies, theme CSS); in-browser Tailwind; viewport presets and custom width; zoom and pan; block frames (rounded border, scaffold colour) with border buttons; show/hide frames; selection and hover; per-block error isolation; breakpoint indicator; logic markers; empty states; parity checks with the preview.
- Out: editing the tree (S-18), inspector (S-19), generation UI (S-04), the run preview (S-06), mobile override editing (Mobile part).

## Concepts and model
- **Viewport**: a width (and a nominal height) the page is rendered at: phone 390, tablet 834, laptop 1440, Full HD 1920, 2K 2560, 4K 3840, or custom. Stored in the URL.
- **Zoom**: fit (default), fixed steps (25–200 %), 100 %. The iframe keeps the real width; the Studio scales it.
- **Breakpoint in effect**: derived from the viewport width (mobile below the breakpoint, desktop above) and shown in the status bar.
- **Overlay**: block frames, border buttons, the prompt input in empty blocks, selection, hover and proposal highlights are drawn by the Studio above the iframe at a fixed screen size (readable at any zoom), using block rectangles reported from inside the iframe.
- **Block frame** (D-29): editor chrome around each block: rounded border in the block's scaffold colour (S-31) and a few buttons sitting on the border. It is never part of the body and never exported. Empty blocks show their scaffold fill; once a body exists, the body's own styling shows inside and only the border remains.

## User stories
- **US-1** `[alpha]` As a user, I see my page rendered on the canvas exactly as it is laid out, so that I can design visually.
  - Acceptance: containers and leaves render with their frames; bodies render as HTML with Tailwind classes; theme tokens apply as CSS variables; empty leaves show a soft placeholder; editing a frame updates the canvas immediately.
- **US-2** `[alpha]` As a user, I can switch between phone, tablet, laptop, Full HD, 2K and 4K, or drag a custom width, so that I can check my layout at any size.
  - Acceptance: the viewport menu lists presets with sizes; a drag handle sets a custom width; the current size shows in the status bar; sizes larger than my screen are shown scaled.
- **US-3** `[alpha]` As a user, I can zoom to fit, zoom in and out, and pan, so that I can work on details or see the whole page.
  - Acceptance: zoom controls and shortcuts (Ctrl/Cmd + / − / 0 / 1); scroll to pan; viewport and zoom survive reload through the URL.
- **US-4** `[alpha]` As a user, I can click a block to select it and see where blocks are as I hover, so that I always know what I'm editing.
  - Acceptance: hover shows an outline and the block name; click selects (also in the Structure panel); Escape selects the parent; selection survives zoom and viewport changes.
- **US-5** `[alpha]` As a user, every block is shown as a rounded, bordered frame with a few buttons on its border, so that I can manage it right where it is.
  - Acceptance: hovering or selecting a block reveals buttons on its border: generate (S-04), add inside, duplicate, delete, more (wrap, open logic with S-25); empty blocks show their scaffold fill (S-31) and a centred prompt input; the buttons keep a fixed size at every zoom and never cover the prompt input.
- **US-9** `[MVP]` As a user, frames stay around generated content while I edit, and I can hide them to see the clean result, so that I always know where blocks are but can still judge the real look.
  - Acceptance: after a body is accepted, the block shows the generated styling inside its border; a "Show frames" toggle (shortcut) hides all frames and buttons; the run preview never shows frames.
- **US-6** `[MVP]` As a user, one broken block never breaks the whole canvas, so that I can keep working and fix it.
  - Acceptance: a body that fails to render shows an error tile in that block with "show details" and "regenerate"; the rest of the page renders normally.
- **US-7** `[MVP]` As a user, I can see which blocks have logic attached and which breakpoint applies, so that I understand what the run preview will do.
  - Acceptance: bound blocks show a small logic marker; hovering it lists the bindings; the status bar names the breakpoint for the current viewport.
- **US-8** `[MVP]` As a user, the canvas and the run preview look the same, so that I can trust what I design.
  - Acceptance: a sample page compared at three viewports shows no visible layout differences between canvas and preview; known differences (logic not running) are documented.

## UX notes
The canvas is the most colourful area: the Studio chrome around it stays neutral. The page sits on a light checker or neutral background with its width visible. The selection colour is the Studio accent; the hover colour is lighter. With large viewports zoomed out, text in the overlay (block names) stays readable at a fixed size.

## Technical design
- Render with a React portal into the iframe's document so the canvas shares the Studio's stores and contexts; the iframe isolates the user's CSS from the Studio's.
- Tailwind compiles in the browser inside the iframe (`@tailwindcss/browser`, same version as codegen); theme CSS variables injected from the active theme.
- The frame → CSS function from `packages/core` (S-01) is the only layout mapping.
- Block rectangles for the overlay come from the iframe (ResizeObserver / measurements); hover and drag state lives in Zustand, not Redux.
- Error boundary per block; `useTransition` for viewport and page switches.

## Tests (optional)
Parity checks between canvas and generated app (screenshot comparison at a few viewports) would pay off later, once S-06 exists.

## Risks and open questions
- In-browser Tailwind performance on large pages; measure early, and fall back to compiling classes in a worker if needed.
- Portals into iframes have quirks (events, focus, styles in head); spike in the first ticket.
- Keeping overlay positions in sync during zoom and scroll.
- Frames add visual weight around generated content; tune border colour and thickness so the user's design still reads clearly (D-30).

## Done when
- [ ] A page renders on the canvas at any preset or custom width, zoomed to fit.
- [ ] Block frames with border buttons, selection and hover work at every zoom level.
- [ ] (MVP) Frames stay around generated content and can be hidden.
- [ ] (MVP) A failing block is isolated; logic markers and breakpoint indicator show; canvas and preview match on the sample page.
