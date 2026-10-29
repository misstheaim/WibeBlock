# S-22 — Global prompt bar

> Part: Studio · Phase: 3 · Stages: v1 · Depends on: S-04, S-08, S-15 · Status: ready

## Goal
The prompt bar at the top of the Studio works on the whole page or project, not just one block. The AI understands the page structure, the viewport, the theme, the knowledge base and the app's layout rules, and returns a **proposal** that may add, move, resize and re-layout blocks as well as generate bodies (D-22). The user reviews the changes on the canvas, accepts all or some, and can revert them later. On an empty page it builds a first layout from a description.

## Scope
- In: scope selector (selection, page, project); "arrange page" and "build page" tasks; context of the whole page; layout proposals with frame changes; visual diff on the canvas; per-change accept; automatic snapshot before applying; layout rules skill.
- Out: logic changes from the prompt bar (S-26 has its own AI graph generation); multi-page creation flows beyond "add these pages" (later).

## Concepts and model
- **Scope**: selection (as in the MVP, body generation), page (the current page's tree), project (all pages, theme, knowledge).
- **Layout proposal**: a list of changes (add block, remove block, move, set frame, set body prompt and body), each with a reason; grouped by area of the page.
- **App rules**: the layout skill (S-08): flex/grid only, no coordinates, sensible sizing, token spacing, accessibility; the AI must follow them and the validator checks them.

## User stories
- **US-1** `[v1]` As a user, I can type an instruction for the whole page ("make this a landing page with hero, features and pricing"), so that the AI does the heavy lifting.
  - Acceptance: the scope selector is set to Page; the AI returns a proposal that adds and arranges blocks with prompts and bodies; the proposal respects existing blocks unless told otherwise.
- **US-2** `[v1]` As a user, I can review a page proposal on the canvas and accept all, some or none of it, so that I keep control.
  - Acceptance: added, moved, changed and removed blocks are highlighted; a list lets me untick individual changes; Accept applies the ticked ones as one history entry; Discard restores the page.
- **US-3** `[v1]` As a user, I can start from an empty page and get a first layout from a description, so that I don't face a blank canvas.
  - Acceptance: on an empty page the prompt bar offers "Build this page"; the result follows the knowledge base and theme; it is a normal proposal.
- **US-4** `[v1]` As a user, I can ask for project-wide changes ("make all cards rounder and calmer"), so that consistency is one instruction.
  - Acceptance: project scope produces one proposal grouped by page; large proposals create a snapshot before applying (S-20).
- **US-5** `[v1]` As a user, AI layouts are always valid and responsive, so that they don't break my app.
  - Acceptance: proposals that break layout rules are repaired once or rejected with an explanation; no absolute positioning unless the container allows overlays.

## UX notes
The prompt bar shows the scope as a chip; suggested prompts appear when empty. Proposal review is a panel with grouped changes plus canvas highlights; hovering a change highlights its block.

## Technical design
New AI tasks in the registry (S-07) with structured output (a change list schema); changes map to the same editor actions as manual edits, so history and revert work for free. Context includes a compact outline of the page (names, kinds, frames) rather than full bodies.

## Tests (optional)
Change-list validation and application (a proposal applied then reverted leaves the document unchanged).

## Risks and open questions
- Output size for whole pages; may need multi-step generation (outline first, then bodies per block, each streaming).
- Measuring quality: golden page prompts in the S-08 evaluation harness.

## Done when
- [ ] A page can be built and rearranged from the prompt bar through reviewed proposals with per-change accept, snapshots and revert.
