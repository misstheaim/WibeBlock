# S-24 — AI themes

> Part: Studio · Phase: 3 · Stages: v1 · Depends on: S-05, S-07 · Status: ready

## Goal
In the theme studio, the user describes a look ("warm editorial, cream background, deep green accent, high contrast") and the AI proposes a complete theme, streamed token by token into the sample sheet. The user compares it with the current theme and accepts it as a new theme or as a replacement. The same prompt box can create variations of the current theme.

## Scope
- In: theme-from-prompt task with structured output; streamed preview; side-by-side review; accept as new / replace / discard; automatic contrast fixes; variations of an existing theme; using the knowledge base's brand notes as context.
- Out: theme from an image (garden idea); font upload (S-16).

## Concepts and model
A **theme proposal** is a full theme object (S-05 shape) plus a short rationale; it goes through the same contrast checks as manual edits before review.

## User stories
- **US-1** `[v1]` As a user, I can describe a look and get a full theme proposal, so that I don't need to pick every colour myself.
  - Acceptance: a prompt box in the theme studio; the sample sheet fills in as tokens stream; the result covers all token groups in light and dark.
- **US-2** `[v1]` As a user, I can compare the proposed theme with my current one and decide, so that I stay in control.
  - Acceptance: a side-by-side (or toggle) view on the sample sheet and the canvas; Accept as new theme, Replace current, or Discard; accepted changes are one history entry.
- **US-3** `[v1]` As a user, AI themes are always readable, so that I don't ship poor contrast.
  - Acceptance: failing contrast pairs are fixed automatically before review, with a note of what changed.
- **US-4** `[v1]` As a user, I can ask for variations of my current theme ("darker", "more playful"), so that I can explore around a direction.
  - Acceptance: a variations action produces a few proposals shown as cards; choosing one opens it for review.

## UX notes
Streaming is visible and pleasant: swatches fill in, the sample sheet re-colours progressively.

## Technical design
A structured-output task (S-07) streamed to the Studio and consumed with the AI SDK's `useObject` hook; partial objects drive the live preview.

## Tests (optional)
Schema validation of theme proposals and contrast auto-fix.

## Risks and open questions
- Partial themes during streaming may look broken; fill missing tokens from the current theme until they arrive.

## Done when
- [ ] A theme can be created from a description with streamed preview, review, contrast fixes and variations.
