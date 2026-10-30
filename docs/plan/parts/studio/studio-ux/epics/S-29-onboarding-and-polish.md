# S-29 — Onboarding & polish

> Part: Studio · Phase: 3 · Stages: v1 · Depends on: S-14, S-04 · Status: ready

## Goal
A first-time user understands WibeBlock in minutes and gets a good result in the first session; the Studio feels finished: helpful empty states, starter templates, smooth motion and solid accessibility. This epic is also where the first end-to-end test is written by hand (D-16).

## Scope
- In: first-run tour; starter templates; empty states with next steps; tips tied to first actions; motion polish; accessibility pass (keyboard, focus, labels, contrast); first Playwright flow.
- Out: marketing site and documentation pages (P-20).

## User stories
- **US-1** `[v1]` As a new user, I get a short guided tour of the Studio, so that I know where things are.
  - Acceptance: a skippable tour on first open highlights the Structure panel, canvas, inspector, prompt bar and Preview; it can be restarted from Help.
- **US-2** `[v1]` As a new user, I can start from a template project (landing page, portfolio, dashboard), so that I see what's possible right away.
  - Acceptance: the create dialog offers templates with previews; a template creates a full project with pages, theme, knowledge notes and bodies.
- **US-3** `[v1]` As a user, every empty screen tells me what to do next, so that I'm never stuck.
  - Acceptance: empty page, an empty Structure panel, empty knowledge base, empty logic graph and no API key each have a clear empty state with an action.
- **US-4** `[v1]` As a keyboard or screen-reader user, I can use the main flows, so that the Studio is accessible.
  - Acceptance: create project → add blocks → generate → accept → preview works with the keyboard only; toolbars and icon buttons have labels; contrast meets AA in both Studio themes.
- **US-5** `[v1]` As the owner, I have one end-to-end test of the core flow, so that I learn Playwright and catch regressions.
  - Acceptance: a Playwright test creates a project, adds a block, generates with the fake provider, accepts and checks the preview.

## Technical design
Tour as a small in-house component on `packages/ui` popovers (or a library; decide in the ticket). Templates are project folders in `packages/prompts`.

## Tests (optional)
- **First Playwright test by hand (D-16):** US-5.

## Risks and open questions
- Templates need good prompts and themes; they double as evaluation cases (S-08).

## Done when
- [ ] Tour, templates, empty states and the accessibility pass are done; the Playwright flow passes.
