# S-04 — Block generation & proposals

> Part: Studio · Phase: 1–3 · Stages: alpha, MVP, v1 · Depends on: S-07, S-19 · Status: ready

## Goal
The heart of the product: the user writes what a block should contain, the AI generates the body inside the user's frame, and the result appears on the canvas as a **proposal** to accept or discard (D-22). Then the user refines it, edits text directly, and keeps bodies up to date when the style guide changes. This epic also builds the proposal review UI that later AI features reuse.

## Scope
- In: block prompt editor (the prompt input centred in an empty block, the inspector Content tab, the ✦ border button, the prompt bar with selection scope); generate with streaming; sanitise, validate and one repair round; proposal review on the canvas (before/after, accept, discard); refine with a follow-up prompt; direct text editing of bodies; surface bodies for containers; port markers in bodies; staleness and "regenerate stale"; eject.
- Out: page/project-scope prompt bar and layout proposals (S-22); prompt library content (S-08); logic bindings (S-25).

## Concepts and model
- **Body**: prompt, sanitised HTML + Tailwind, meta (task version, model, generatedAt, inputsHash, stale). See S-01.
- **Surface body**: a container's own look (background, border, decoration) with exactly one `<wb-slot/>` where its children render.
- **Proposal** (from S-07): for this task, "set body of block X to …", plus a summary; for regenerate-stale, one proposal per block.
- **Port markers**: the AI marks elements that logic may drive or listen to (text, list, value, event) with names; they become ports (D-21).
- **Stale**: inputs hash changed (block prompt, style guide, skill versions, task version).

## User stories
- **US-1** `[alpha]` As a user, I can write a prompt for a block and generate its content, watching it appear, so that the AI fills my layout.
  - Acceptance: an empty block shows a prompt input in its centre (S-31); pressing Enter generates; the Content tab, the ✦ border button and the prompt bar (when a block is selected) do the same; the block shows streaming progress; the result renders inside the block's frame on the canvas.
- **US-2** `[alpha]` As a user, I can accept or discard what the AI generated, so that nothing changes my project without my approval.
  - Acceptance: a proposal bar shows on the canvas with Accept, Discard and a before/after toggle; Accept writes the body (one history entry); Discard restores the previous look; leaving the page with a pending proposal asks what to do.
- **US-3** `[alpha]` As a user, I only ever get safe, valid content, so that a bad generation can't break my app.
  - Acceptance: output is sanitised and validated; invalid output triggers one automatic repair round; if it still fails, the proposal shows the problem and offers retry instead of applying.
- **US-4** `[MVP]` As a user, I can refine a body with a follow-up instruction ("make the button bigger"), so that I don't start from scratch each time.
  - Acceptance: Refine sends the current body and the instruction; the result is a new proposal; the prompt history of the block is visible.
- **US-5** `[MVP]` As a user, I can edit the text inside a generated body directly on the canvas, so that small wording fixes need no AI.
  - Acceptance: double-click on text in a selected body edits it in place; structure and classes are kept; the edit is one history entry and doesn't mark the body stale.
- **US-6** `[MVP]` As a user, I can give a container its own look (background, border, decoration) around its children, so that sections look designed.
  - Acceptance: containers have a surface prompt; the generated surface wraps the children at its slot; a surface without exactly one slot is rejected by validation.
- **US-7** `[MVP]` As a user, I can see which blocks are out of date after I change the style guide, and regenerate them in one go, so that the app stays consistent.
  - Acceptance: stale blocks show a badge on the canvas and in the Structure panel; "Regenerate stale" runs them one by one with a progress list and Cancel; each result is a proposal; "Accept all" applies the rest as one entry.
- **US-8** `[MVP]` As a user, generated bodies expose named points that logic can use, so that I can wire behaviour without editing markup.
  - Acceptance: buttons, headings, inputs and lists in new bodies carry port markers with readable names; the Behaviour tab (S-19) lists them.
- **US-9** `[v1]` As a user, I can eject a body into child blocks, so that I can take over its layout.
  - Acceptance: Eject turns the body's top-level elements into leaf blocks inside the block (now a container) with inferred frames; the look stays the same; one history entry.

## UX notes
Streaming shows a shimmer over the block with the text appearing; the rest of the canvas stays editable. The proposal controls (Accept, Discard, before/after) sit on the block's border like the other border buttons (D-29), or in a bar at the bottom for multi-block proposals. Before/after toggles in place. Keyboard: Enter to accept, Escape to discard while the bar is focused.

## Technical design
Uses the "generate body" and "refine body" tasks from S-07; proposals live in a Redux slice; accepted proposals dispatch editor actions inside one history transaction (S-15). The run lifecycle (streaming → validating → repairing → proposal → accepted/discarded/failed) is a good fit for **XState** (optional) and `useOptimistic` for showing an accepted body before the save completes.

## Tests (optional)
Sanitiser + repair loop with fake provider outputs (valid, invalid-then-fixed, invalid twice); staleness hash rules.

## Risks and open questions
- Quality depends heavily on prompts and skills; the first prompts live in `packages/prompts` and improve in S-08.
- Direct text editing inside sanitised HTML must not break port markers.

## Done when
- [ ] A leaf body can be generated with streaming and accepted or discarded; invalid output never lands.
- [ ] (MVP) Refine, in-place text edits, surface bodies, port markers and regenerate-stale work.
- [ ] (v1) Eject works.
