# Feature — Design

> Part: [Studio](../studio.md) · Epics: S-05, S-16

## Purpose

Project-wide visual consistency: the theme (design tokens, light/dark modes), the global prompt, and the assets (images, icons) bodies can use.

## Design notes

- **Tokens → CSS variables → Tailwind v4 `@theme`** (D-03). Token groups: `color` (semantic: background, surface, text, primary, secondary, accent, border, success/warn/error), `font` (families), `fontSize` scale, `space` scale, `radius`, `shadow`. Each colour token has light and dark values.
- Changing tokens never triggers regeneration; skills instruct the AI to use semantic tokens (`bg-primary`, `text-muted`) instead of raw colours.
- **Presets**: a handful of starter themes; import/export as JSON; later: generate a theme from a prompt or an image.
- **Global prompt** edits mark all bodies stale; the UI offers "regenerate all / selected / none".
- **Assets** live in `wibeblock/assets/`, are referenced by relative path in bodies, optimised on import, and copied by codegen. Placeholder images and an icon set (e.g. Lucide) are available to the AI via skills.
- UI: open — theme editor placement (panel vs. full-screen page), token editing UX for non-developers.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [S-05](epics/S-05-theme-and-global-prompt.md) | **Theme & global prompt** | Token editor (colour, type scale, spacing, radius, shadow; light/dark), presets, CSS-variable emission, global prompt editor, propagation rules (tokens live; prompt → stale), import/export. | S-02 | 1 |
| [S-16](epics/S-16-assets-and-media.md) | **Assets & media** | Image upload/import, optimisation, placeholder/stock images for generation, icon library access for bodies, asset references in codegen, asset panel. | S-04 | 2 |
