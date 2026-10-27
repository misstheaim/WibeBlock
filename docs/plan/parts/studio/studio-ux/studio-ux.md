# Feature — Studio UX

> Part: [Studio](../studio.md) · Epics: S-14

## Purpose

The Studio's own look and feel: the design system (`packages/ui`), onboarding, empty states, motion, accessibility, and the overall "beautiful UI" goal of the product.

## Design notes

- `packages/ui`: tokens for the Studio itself (not the user's theme), primitives (buttons, inputs, panels, trees, popovers, command palette), icons, motion rules. First pick: Radix primitives + Tailwind, Lucide icons.
- Non-developer defaults: plain language in the inspector ("Stack: vertical / horizontal", "Size: fill / fit content / fixed"), Developer mode shows the CSS terms alongside.
- Onboarding: first-run tour, a starter template gallery, inline tips tied to the first generation.
- Accessibility of the Studio: keyboard navigation of tree and canvas, focus management, contrast.
- UI: open — visual direction (dark-first? density? references), panel layout, where generation feedback appears. Record here once decided.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [S-14](epics/S-14-studio-design-system-and-polish.md) | **Studio design system & polish** (`packages/ui`) | Visual language, primitives, onboarding tour, template gallery, empty states, motion, accessibility, Studio theming, responsive Studio layout. | S-02 | 2 |
