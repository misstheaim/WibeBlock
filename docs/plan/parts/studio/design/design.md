# Feature — Design

> Part: [Studio](../studio.md) · Epics: S-05, S-24, S-16

## Purpose

Project-wide visual consistency: **themes** (presets, a palette tool, design tokens in light and dark), **AI themes** generated from a prompt, and the **assets** bodies can use. The style guide text that used to be the "global prompt" now lives in the knowledge base (D-23).

## Design notes

- **Tokens → CSS variables → Tailwind v4 `@theme`** (D-03). Token groups: `color` (semantic: background, surface, text, muted, primary, secondary, accent, border, success, warning, error, each with a foreground), `font` (families), `fontSize` scale, `space` scale, `radius`, `shadow`. Every colour token has light and dark values.
- **Several themes per project, one active.** Presets (a handful of starter themes shipped in `packages/prompts`) are copied into the project when chosen; the user then edits their copy. Themes can be duplicated, renamed, imported and exported as JSON.
- **Theme studio** is its own workspace: token editor on one side, a **sample sheet** (buttons, cards, forms, typography, surfaces) and the live canvas on the other. A quick theme switcher and light/dark toggle sit in the top bar.
- **Palette tool**: pick a base colour → generate a tonal scale (OKLCH) → map scale steps to semantic tokens; contrast checks (WCAG AA) next to each text/background pair, with a suggested fix.
- Changing tokens never triggers regeneration; skills tell the AI to use semantic token classes (`bg-primary`, `text-muted`) instead of raw colours.
- **AI themes** (S-24, v1) reuse the same theme studio: a prompt produces a proposed theme, streamed token by token, reviewed side by side, then accepted as a new theme or as a replacement.
- **Assets** (S-16, v1) live in `wibeblock/assets/`, are referenced by relative path in bodies, optimised on import and copied by codegen. Placeholder images and an icon set (Lucide) are available to the AI through skills.

## Epics

| ID | Epic | Summary | Depends on | Phase | Stages |
|---|---|---|---|---|---|
| [S-05](epics/S-05-theme-studio.md) | **Theme studio** | Default theme applied to the canvas, presets, several themes per project, token editor with light/dark, palette tool with contrast checks, sample sheet, import/export. | S-02, S-03 | 1–2 | alpha, MVP |
| [S-24](epics/S-24-ai-themes.md) | **AI themes** | Theme from a prompt with streamed structured output, side-by-side review, accept as new or replace, automatic contrast fixes, variations. | S-05, S-07 | 3 | v1 |
| [S-16](epics/S-16-assets-and-media.md) | **Assets & media** | Image upload and optimisation, asset panel, placeholder images and icons for generation, asset references in codegen. | S-04 | 3 | v1 |
