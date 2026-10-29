# Feature — Studio UX

> Part: [Studio](../studio.md) · Epics: S-14, S-29, S-30

## Purpose

The Studio's own look and feel: the design system (`packages/ui`), onboarding, empty states, motion, accessibility, and later the professional tools (Figma- and Photoshop-like) that make the side panels powerful.

## Design notes

- **Own components, Tailwind v4** (D-24): `packages/ui` is built the shadcn way: Radix primitives for hard behaviour (dialog, popover, menu, select, tooltip, focus management), CVA for variants, source owned and edited in the repo. Simple components (button, input, panel, tabs, tree row) are written from scratch. **Storybook** is the workshop and catalogue.
- **Studio tokens** are separate from the user's theme: warm light neutrals, one pastel lime accent, light-first (dark later) (D-30). The user's app and the pastel starter blocks are the most colourful things on screen.
- **Visual direction**: minimal and light (D-30): few visible controls, chrome that appears on hover, generous spacing. Motion is short and functional (panels, proposals, selection), built with **Motion**, and respects reduced-motion settings.
- **Pro inputs** the Studio needs and generic kits lack: number field with drag-to-scrub and units, size mode control (fill / fit / fixed), alignment pad, token colour picker, resizable panels, tree rows with drag handles.
- Plain language by default; Developer mode shows CSS terms alongside.
- **Onboarding** (S-29): first-run tour, starter templates, empty states with a next step, tips at the first generation.
- **Accessibility of the Studio**: keyboard navigation of the Structure panel, canvas and inspector; visible focus; contrast; screen-reader labels on toolbars.
- **Pro tools** (S-30, garden): Photoshop-style layers, Structure-panel lock/hide/grouping, align and distribute, guides and measurements, reusable components (one block definition, many instances). To be designed in a later session.

## Epics

| ID | Epic | Summary | Depends on | Phase | Stages |
|---|---|---|---|---|---|
| [S-14](epics/S-14-studio-design-system.md) | **Studio design system** (`packages/ui`) | Studio tokens, base primitives, pro inputs, Storybook, Motion rules, light/dark, accessibility baseline. | — | 1–2 | alpha, MVP |
| [S-29](epics/S-29-onboarding-and-polish.md) | **Onboarding & polish** | First-run tour, starter templates, empty states, motion polish, accessibility pass, first Playwright flow. | S-14, S-04 | 3 | v1 |
| [S-30](epics/S-30-pro-tools.md) | **Pro tools** | Figma/Photoshop-like tools for the side panels: lock, hide, groups, align/distribute, guides, measurements, reusable components. Placeholder, to be designed. | S-18, S-19 | 7 | garden |
