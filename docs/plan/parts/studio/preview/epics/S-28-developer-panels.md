# S-28 — Developer panels

> Part: Studio · Phase: 3 · Stages: v1 · Depends on: S-06 · Status: ready

## Goal
In Developer mode, the Studio shows what WibeBlock generates and lets developers work at the code level where it is safe: a Monaco code panel with the generated files, editable body HTML with validation, Tailwind class chips per block, the generated file tree, raw JSON of the selection, and an AI usage panel.

## Scope
- In: code panel (generated files read-only), body HTML editing with validation, class chips, file tree, raw JSON view and edit with validation, AI usage panel.
- Out: editing generated files directly (they are regenerated); a full IDE.

## User stories
- **US-1** `[v1]` As a developer, I can see the generated code for the selected block or page, so that I know exactly what I'll get.
  - Acceptance: a code panel shows the component file of the selection, read-only, with syntax highlighting; it updates after changes.
- **US-2** `[v1]` As a developer, I can edit a body's HTML directly with validation, so that I can fix details without the AI.
  - Acceptance: an editable HTML view; invalid edits show validator errors inline and are not applied; valid edits are one history entry.
- **US-3** `[v1]` As a developer, I can see and edit a block's Tailwind classes as chips, so that small styling tweaks are quick.
  - Acceptance: chips for each class in the body's top element (and selected element); add/remove with autocomplete; validation applies.
- **US-4** `[v1]` As a developer, I can browse the generated project's file tree and the raw JSON of the selection, so that I can debug the pipeline.
  - Acceptance: the generated-files view of the left panel (S-32) opens files in the code panel; a JSON view of the selected block/node is editable with schema validation.
- **US-5** `[v1]` As a developer, I can see AI usage in detail, so that I can tune prompts and models.
  - Acceptance: a panel lists runs with tokens, cost, duration, prompt and response (from the AI log).

## Technical design
Monaco editor (lazy-loaded); the code comes from the Runner (TanStack Query); validation from `packages/core`.

## Tests (optional)
None beyond what S-01 covers.

## Risks and open questions
- Monaco bundle size: load on demand only in Developer mode.

## Done when
- [ ] Developer mode shows generated code, file tree, JSON and AI usage, and allows validated body HTML and class edits.
