# P-17 — UI foundation (`packages/ui`)

> Part: Platform · Phase: 0 · Stages: skeleton, later · Depends on: — · Status: draft

## Goal
The platform app gets a small, polished design system to build on, and the Studio later inherits it: `packages/ui` with **semantic design tokens** in a **light and a dark mode**, the base components the platform skeleton needs (buttons, form fields, menus, dialogs, toasts, avatars…), and a Storybook catalogue. It is the first frontend work of the project (D-33), so it also sets the conventions every later component follows. The app theme has the same shape as the themes users build for their projects, so the Studio's theme editor can customise it later (D-35).

## Scope
- In: `packages/ui` as a source-only workspace package (D-32); semantic tokens as CSS variables feeding Tailwind v4; light and dark values for every colour token; the mode mechanism (one attribute on the page switches every token); base components written from scratch and on Radix primitives; CVA variants; Lucide icons; Storybook with a light/dark toolbar and a token page; accessibility baseline (focus, contrast, reduced motion).
- Out (and where it lives instead): where the mode choice is stored and how it reaches the first paint (P-08 US-5, P-19 US-3); Studio-only components: panels, tree rows, pro inputs, Motion rules (S-14); the themes users build for their own projects (S-05); customising the app theme beyond light/dark (US-6, after S-05).

## Concepts and model
- **Semantic tokens** are the contract between the kit and everything that uses it. Components only use semantic names, never raw colours. Groups, aligned with the project theme groups in [design.md](../../../studio/design/design.md):
  - `color`: background, surface, text, muted, primary, secondary, accent, border, success, warning, error, each with a foreground pair where text sits on it; plus a focus ring colour.
  - `font` (families), `fontSize` scale, `radius`, `shadow`. Spacing uses Tailwind's default scale; it becomes a token group only if customisation needs it.
- **App theme** = one set of token values with a **light** and a **dark** mode. The light mode is the D-30 look (warm paper-like neutrals, one pastel lime accent); the dark mode is its counterpart, not an inversion: same accent family, softened surfaces. Users pick the mode; the first paint follows the operating-system setting until they do.
- **Token names are fixed here** and adopted by S-05 for project themes (D-35). This answers the colour part of the master plan's open question on token naming; S-05 may add groups, not rename these.
- **Component tiers** (as in S-14): (1) written from scratch: button, icon button, link styled as a button, input, textarea, label, form field (label + control + hint + error), card, badge, separator, skeleton, spinner; (2) on Radix primitives: dropdown menu, dialog, tooltip, toast, avatar (image with fallback).
- **Variants** with CVA: intent (primary, secondary, ghost, destructive), size (sm, md, lg), states (loading, disabled, invalid).

## User stories
- **US-1** `[skeleton]` As a developer, I can use `packages/ui` from the platform app, so that every screen is built from one shared kit.
  - Acceptance: `@wibeblock/ui` exists as a source-only package linked with `workspace:*`; importing its stylesheet once in an app gives all tokens and component styles; a button from the kit renders correctly styled in `apps/platform`; changing a token value in one place changes it everywhere.
  - Notes: Tailwind v4 only scans the app's own files by default; the kit's sources must be included explicitly, or its classes silently disappear. React is a peer dependency (one React on the page).
- **US-2** `[skeleton]` As a user, I see a calm, readable palette and type scale in both light and dark mode, so that the app is pleasant at any time of day.
  - Acceptance: every colour token has a light and a dark value; text/background pairs meet WCAG AA contrast in both modes (checked with a contrast tool, numbers noted on the token page); switching the mode attribute restyles the whole page at once without reload; the operating-system preference is the default.
  - Notes: shadows usually need different values in dark mode (lighter borders instead of dark shadows).
- **US-3** `[skeleton]` As a user, I can use buttons and form controls that look and behave the same everywhere, so that the app feels like one product.
  - Acceptance: button (all intents and sizes, loading and disabled states), icon button (always with an accessible label and tooltip), input, textarea, label and form field exist; keyboard use works and focus is always visible; a field in the error state shows its message under the control and screen readers announce it with the field.
- **US-4** `[skeleton]` As a user, I get menus, dialogs, notifications and placeholders that behave predictably, so that interactions are never confusing.
  - Acceptance: dropdown menu and dialog open from mouse and keyboard, trap focus while open, close with Esc and return focus to the trigger; toasts appear in one corner, are announced to screen readers and disappear after a few seconds unless hovered; the avatar shows an image or falls back to initials on a stable colour; skeleton and spinner exist for loading states; with reduced motion turned on, animations become fades or disappear.
- **US-5** `[skeleton]` As the owner, I can develop and review every component in Storybook in both modes, so that the kit grows independently of the app.
  - Acceptance: one command from the repo root starts Storybook; every component has stories for its variants and states; a toolbar switches light/dark; a Tokens page lists every token with its light and dark value; an accessibility panel flags contrast and labelling problems.
- **US-6** `[later]` As a user, I can customise the app's look (accent, radius, fonts) beyond light and dark, so that the tool feels like mine.
  - Acceptance: the theme editor from S-05 edits a copy of the app theme; the result is stored in the profile preferences (P-19) and applied on first paint; "reset to default" restores the shipped theme.
  - Notes: depends on S-05. Designed with it; until then light/dark buttons are the only choice (D-35).

## UX notes
- Minimal and light by default (D-30): warm neutrals, one pastel lime accent for primary actions and selection, generous spacing, few borders. The dark mode keeps the same personality.
- Every icon-only button has a tooltip and an accessible label. Destructive actions use the destructive intent and a confirmation dialog.
- References for the feel: Linear and Vercel dashboards (quiet chrome), Radix Themes (token naming ideas), the WibeBlock plan map's palette.

## Technical design
- Tailwind v4, CSS-first: tokens are declared once as CSS variables, with a dark-mode block overriding them; Tailwind's theme maps its utilities to those variables, so `bg-surface`-style utilities follow the mode automatically. Dark mode is driven by an attribute or class on the root element (a custom dark variant), not only by the OS media query, because the user's choice must win.
- The shadcn approach: Radix primitives for hard behaviour, component source owned in the repo, CVA for variants, a small class-merging helper for overrides.
- Storybook with the Vite builder, the accessibility addon and a theme toolbar.
- Package conventions follow D-32: source-only, `exports` pointing at the sources, React and React DOM as peers from the catalog. The kit has no knowledge of the platform app, the Studio or React Router.
- Folder structure inside the package (one folder per component vs flat files) is decided in the first step; document it in `docs/development.md`.

## Learning notes
Concepts in a sensible order:
1. **Design tokens**: primitive vs semantic tokens, why components only see semantic names, how modes swap values.
2. **CSS custom properties** and the cascade: inheritance, overriding on a parent element, fallbacks.
3. **Tailwind v4 CSS-first configuration**: the theme block, mapping utilities to variables, custom variants for dark mode, including sources from another package.
4. **Accessible components**: WAI-ARIA patterns for menu, dialog and tooltip; focus management; why Radix primitives exist.
5. **Variant APIs** with CVA and composition (`asChild`-style slotting).
6. **Storybook**: stories, args and controls, decorators for the mode, the accessibility addon.

References: [Tailwind CSS — theme variables](https://tailwindcss.com/docs/theme), [dark mode](https://tailwindcss.com/docs/dark-mode), [detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files); [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction); [shadcn/ui docs](https://ui.shadcn.com/docs); [CVA](https://cva.style/docs); [Storybook docs](https://storybook.js.org/docs); [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/); [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum).

## Tests (optional)
Storybook interaction tests for dialog and dropdown focus handling (open, trap, Esc, focus returns) would pay off; the accessibility addon covers contrast and labels. Visual snapshots are optional.

## Risks and open questions
- **Building ahead of need.** Build a component when a screen in P-08, P-18, P-19 or P-20 needs it; the list in US-3 and US-4 is what the skeleton uses.
- **Token names must survive S-05.** If S-05 needs a different structure, rename once, early, across both.
- **Razor Pages in Identity (P-03) need the same look** without React: they can only reuse the CSS (tokens and Tailwind classes), so keep component styles expressible as classes, not only as React logic.
- Hydration and the mode: the server must render the right mode attribute (P-08 US-5); the kit must not read `window` during render.

## Done when
- [ ] `apps/platform` imports `@wibeblock/ui` and renders a styled button.
- [ ] Storybook shows every skeleton component in light and dark, with a Tokens page.
- [ ] Switching the mode attribute restyles everything; contrast pairs pass AA in both modes.
- [ ] Menus and dialogs are fully usable with the keyboard.
