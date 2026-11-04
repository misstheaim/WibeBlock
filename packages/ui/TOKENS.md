# Design tokens (`@wibeblock/ui`)

The default app theme (D-37). Source of truth: [src/styles/index.css](src/styles/index.css). This page is temporary: the Storybook Tokens page (P-17 US-5) replaces it.

## How tokens work

Two layers in `index.css`:

1. **Raw values** on `:root` (`--card`, `--font-family-sans`, `--radius`…): the theme dataset. A theme or preset replaces only these.
2. **Tailwind theme variables** in `@theme inline` (`--color-card`, `--font-sans`, `--radius-lg`…): they point at the raw values and create the utilities. Raw and Tailwind names must differ, or the variable references itself and becomes invalid.

Colours are `light-dark(light, dark)`. With no `data-mode` on `<html>` the OS preference picks the side; `data-mode="light"` or `"dark"` forces one. Components use the utilities only: never raw colours, never Tailwind's `dark:` variant (D-38).

## Colours and contrast

WCAG 2.2 AA: 4.5:1 for normal text, 3:1 for UI components (focus ring). Measured 2026-11-04 with the WCAG relative-luminance formula.

| Pair (text / background) | Utilities | Light | Ratio | Dark | Ratio |
|---|---|---|---|---|---|
| foreground / background | `text-foreground` `bg-background` | `#2a1f17` / `#f4ede1` | 13.81 | `#f2e9dc` / `#1c1611` | 14.90 |
| card-foreground / card | `text-card-foreground` `bg-card` | `#2a1f17` / `#fbf7f0` | 15.05 | `#f2e9dc` / `#261e18` | 13.63 |
| muted-foreground / muted | `text-muted-foreground` `bg-muted` | `#6b5a4a` / `#ebe3d5` | 5.17 | `#b3a493` / `#30271f` | 6.02 |
| muted-foreground / background | `text-muted-foreground` `bg-background` | `#6b5a4a` / `#f4ede1` | 5.66 | `#b3a493` / `#1c1611` | 7.38 |
| primary-foreground / primary | `text-primary-foreground` `bg-primary` | `#2a1f17` / `#86b81e` | 6.80 | `#1c1611` / `#b4e14b` | 11.78 |
| secondary-foreground / secondary | `text-secondary-foreground` `bg-secondary` | `#2a1f17` / `#e6dccb` | 11.83 | `#f2e9dc` / `#3a2f26` | 10.82 |
| accent-foreground / accent | `text-accent-foreground` `bg-accent` | `#2f4a05` / `#e3efc4` | 8.28 | `#dff0b0` / `#34401f` | 9.07 |
| success-foreground / success | `text-success-foreground` `bg-success` | `#f7fbf4` / `#2e7d4f` | 4.82 | `#10261a` / `#6cc38b` | 7.47 |
| warning-foreground / warning | `text-warning-foreground` `bg-warning` | `#2a1f17` / `#e0a526` | 7.33 | `#2a1f17` / `#f0bf55` | 9.40 |
| destructive-foreground / destructive | `text-destructive-foreground` `bg-destructive` | `#fff8f2` / `#b83a27` | 5.44 | `#2a0f0a` / `#ef7a66` | 6.53 |
| destructive / background (error text) | `text-destructive` `bg-background` | `#b83a27` / `#f4ede1` | 4.91 | `#ef7a66` / `#1c1611` | 6.52 |
| ring / background (3:1) | `ring-ring` | `#557a0d` / `#f4ede1` | 4.32 | `#b4e14b` / `#1c1611` | 11.78 |

Not measured, because they don't carry text: `border` (`#ddd0bc` / `#463a2f`), `--shadow-color`.

**Close to the limit:** `success` in light mode (4.82) and `destructive` as text (4.91). Darken rather than lighten them if they change. Text on a pair not listed here (e.g. `muted-foreground` on `accent`) is unchecked: measure it before use. Opacity modifiers on text (`text-foreground/60`) lower the contrast too.

## Other tokens

| Group | Raw (`:root`) | Utilities | Values |
|---|---|---|---|
| Font family | `--font-family-sans`, `--font-family-mono` | `font-sans`, `font-mono` | Inter + system stack; system monospace stack |
| Font size | `--font-size-xs` … `--font-size-4xl` | `text-xs` … `text-4xl` | 0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.875, 2.25 rem (Tailwind's default line heights) |
| Radius | `--radius` (0.625rem) | `rounded-sm` / `-md` / `-lg` / `-xl` | radius − 4px, − 2px, radius, + 4px |
| Shadow | `--shadow-color` | `shadow-xs` / `-sm` / `-md` / `-lg` | Soft brown in light, near-black in dark; in dark mode surfaces rely on `border-border` |
