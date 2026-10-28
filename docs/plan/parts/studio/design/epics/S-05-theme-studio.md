# S-05 — Theme studio

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: S-02, S-03 · Status: ready

## Goal
Projects don't have just one look: WibeBlock ships several preset themes, a project can hold several themes with one active, and a **theme studio** lets the user tune the palette, type, spacing, radius and shadows in light and dark, seeing the result live on a sample sheet and on the canvas. Tokens become CSS variables, so changes never require regeneration (D-03). The same interface later takes an AI prompt (S-24).

## Scope
- In: default theme applied to the canvas; theme tokens → CSS variables; presets; several themes per project; Theme workspace with token editor and sample sheet; palette tool (tonal scales, semantic mapping, contrast checks); light/dark; quick switcher; import/export JSON.
- Out: AI themes (S-24); fonts upload and assets (S-16); the Studio's own tokens (S-14).

## Concepts and model
- **Theme**: id, name, tokens per group (color, font, fontSize, space, radius, shadow), colour tokens with light and dark values. Stored in `themes/<id>.json`; the project's `activeThemeId` picks one.
- **Preset**: a theme shipped in `packages/prompts` (data); choosing one copies it into the project.
- **Palette**: a base colour → tonal scale (in OKLCH) → semantic tokens (primary, surface, text…); the mapping is editable.
- **Contrast check**: WCAG AA for each text/background token pair, with a suggested nearest passing value.

## User stories
- **US-1** `[alpha]` As a user, my new project has a good-looking default theme applied on the canvas, so that blocks look designed from the start.
  - Acceptance: the default theme's tokens are emitted as CSS variables in the canvas iframe; bodies using token classes pick them up; the token names are documented for the AI prompts.
- **US-2** `[MVP]` As a user, I can choose from several preset themes and keep more than one theme in my project, so that I can compare directions.
  - Acceptance: a preset gallery with previews; "use" copies a preset into the project; the theme switcher in the top bar changes the active theme and the canvas updates instantly.
- **US-3** `[MVP]` As a user, I can edit colours, fonts, type sizes, spacing, radius and shadows in a theme studio and see the result live, so that I can make the app mine.
  - Acceptance: a Theme workspace with grouped token editors, a sample sheet (buttons, cards, form, typography, surfaces) and the current page side by side; every change is live and undoable.
- **US-4** `[MVP]` As a user, I can generate a full palette from one brand colour and fix contrast problems, so that a good palette needs no colour theory.
  - Acceptance: picking a base colour generates a scale and maps it to semantic tokens; failing text/background pairs are flagged with a one-click fix.
- **US-5** `[MVP]` As a user, I can switch the canvas between light and dark and edit both modes, so that my app works in both.
  - Acceptance: a light/dark toggle in the top bar and in the theme studio; colour tokens show both values; the canvas and sample sheet follow the toggle.
- **US-6** `[MVP]` As a user, I can export a theme as a file and import one, so that I can reuse themes across projects.
  - Acceptance: export downloads a JSON file; import validates it and adds it as a new theme; invalid files explain what's wrong.

## UX notes
The theme studio is a full workspace, not a cramped panel. Colour editing shows swatches with names in plain words ("Main colour", "Background") and token names in Developer mode. References: Radix Colors' scale approach, Tailwind's theme docs, Figma variables.

## Technical design
Tokens → CSS variables in a stylesheet injected into the canvas iframe and generated into the app by codegen (one source, S-01); Tailwind v4 `@theme` maps them to utilities. OKLCH colour maths in a small utility (library choice open, e.g. culori). Theme edits are document actions (history).

## Tests (optional)
Palette generation and contrast calculation (pure functions); theme JSON import validation.

## Risks and open questions
- The token set must be settled before many bodies exist; AI skills reference token names. Lock it in US-1 (master §8 open question).
- Fonts: system and Google Fonts first; loading fonts in the canvas iframe and in generated apps the same way.

## Done when
- [ ] (alpha) The default theme drives the canvas through CSS variables.
- [ ] (MVP) Presets, several themes, the theme studio with palette tool and contrast checks, light/dark and import/export work.
