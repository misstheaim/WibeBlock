# S-14 — Studio design system

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: — · Status: ready

## Goal
The Studio has its own small, polished design system in `packages/ui`: Studio tokens, base components written by the owner on Tailwind v4, Radix-backed components for hard behaviour, and the professional inputs a design tool needs, all catalogued in Storybook. The alpha needs enough to build the shell, Structure and inspector; the MVP completes the set.

## Scope
- In: `packages/ui` setup; Studio tokens (light/dark); base components; Radix-backed overlays; pro inputs; icons (Lucide); Motion rules; Storybook; accessibility baseline.
- Out: the user's theme (S-05); onboarding and templates (S-29); pro tools like guides and alignment (S-30).

## Concepts and model
- **Studio tokens** ≠ user theme tokens. Studio tokens style the tool; the user's tokens style their app inside the canvas iframe, so the two never collide.
- **Component tiers**: (1) written from scratch: button, icon button, input, textarea, label, badge, kbd, panel, tabs, tree row, separator, toolbar; (2) on Radix primitives: dialog, popover, dropdown menu, context menu, select, tooltip, toggle group, scroll area; (3) pro inputs: number field with drag-to-scrub and units, size mode control (fill / fit / fixed), alignment pad, segmented control, token colour picker, resizable panels.
- **Variants** with CVA (size, intent, density).

## User stories
- **US-1** `[alpha]` As the owner, I can develop Studio components in isolation, so that the design system grows independently of the app.
  - Acceptance: Storybook runs from the repo; every component has a story with its variants in light and dark; the Studio imports components from `packages/ui` only.
- **US-2** `[alpha]` As a user, I see a calm, minimal, light Studio, so that my own app stands out on the canvas.
  - Acceptance: Studio tokens (colours, type, spacing, radius, shadow) follow D-30: warm light neutrals, one pastel lime accent, few borders; every component uses them; the canvas content is unaffected. A dark Studio theme is a later story (US-7).
- **US-3** `[alpha]` As a user, I can use buttons, inputs, tabs, panels, menus, dialogs, tooltips and tree rows that look and behave the same everywhere, so that the Studio feels like one product.
  - Acceptance: the tier 1 and tier 2 components exist with keyboard support and visible focus; overlays trap and restore focus.
- **US-4** `[MVP]` As a user, I can set sizes and spacing quickly with pro inputs, so that editing layout feels like a design tool, not a form.
  - Acceptance: the number field supports typing, arrow keys (with Shift for ×10) and drag-to-scrub; the size mode control, alignment pad and segmented control work by mouse and keyboard; the token colour picker shows the active theme's tokens.
- **US-5** `[MVP]` As a user, I can resize and collapse panels, so that I can give the canvas more space.
  - Acceptance: side panels resize by dragging, collapse and restore; sizes are remembered per user.
- **US-6** `[MVP]` As a user, I see short, purposeful motion, so that changes (panels, proposals, selection) are easy to follow.
  - Acceptance: motion rules (durations, easing) are documented in Storybook; panels and popovers animate; with reduced motion turned on, animations are removed or reduced to fades.

- **US-7** `[v1]` As a user, I can switch the Studio to a dark theme, so that I can work comfortably at night.
  - Acceptance: a dark set of Studio tokens; the switch changes every component; the canvas keeps the app's own theme mode.

## UX notes
Minimal (D-30): light, warm neutrals (paper-like background, soft beige lines), one pastel lime accent for selection and primary actions, generous spacing, quiet chrome that appears on hover. Controls show only when relevant (border buttons on hover, inspector only with a selection). References: the WibeBlock plan map's palette, Figma's UI3 minimised UI, Framer. Every icon button has a tooltip and an accessible label.

## Technical design
Tailwind v4 with `@theme` for Studio tokens; the shadcn approach (copy the source of Radix-based components into `packages/ui` and own it); CVA for variants; Motion for animation; Lucide icons. Storybook with the Vite builder.

## Tests (optional)
Interaction tests in Storybook for the pro inputs (scrub, keyboard) would pay off; visual snapshots are optional.

## Risks and open questions
- Scope creep: build components when a screen needs them, not ahead of time.
- Tailwind class conflicts between Studio and canvas are avoided by the iframe; keep it that way.

## Done when
- [ ] Storybook shows all alpha components in light and dark.
- [ ] The shell, Structure panel and inspector are built only from `packages/ui`.
- [ ] (MVP) Pro inputs, resizable panels and motion rules exist and are used in the inspector.
