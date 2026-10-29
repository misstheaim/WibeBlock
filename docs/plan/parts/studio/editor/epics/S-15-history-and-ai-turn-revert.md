# S-15 — History & AI-turn revert

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: S-02 · Status: ready

## Goal
Every change is reversible. Undo and redo work across all workspaces, each AI turn is one history entry that can be reverted even after later edits, history survives closing the project, and the user decides in settings how much history is kept. This is what makes trying AI ideas cheap (D-22).

## Scope
- In: action log with patches and inverse patches; grouping (drags, typing, accepted proposals); undo/redo; history panel; revert a specific entry; persistence in the project; depth setting; clear history.
- Out: named snapshots and diff (S-20); collaboration-aware history (L-09).

## Concepts and model
- **History entry**: id, label ("Moved Hero", "AI: generated body for Pricing card"), source (user, AI task, external edit), timestamp, forward patches, inverse patches, affected ids.
- **Transaction**: several actions grouped into one entry (a drag, a scrub, an accepted proposal, a wrap).
- **Revert**: applying an entry's inverse patches as a *new* entry. Reverting an older entry works when later entries did not touch the same paths; otherwise the user is shown the conflict and can revert the later entries too.
- **Depth**: maximum number of entries (and optionally age) kept per project; older entries are dropped.
- **External edits** (S-09) become entries with source "external" so they are visible and undoable.

## User stories
- **US-1** `[alpha]` As a user, I can undo and redo any change, so that I can experiment safely.
  - Acceptance: Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (and toolbar buttons) undo and redo frame edits, tree edits, page edits and accepted AI proposals; selection returns to the affected block.
- **US-2** `[alpha]` As a user, a drag or a slider scrub undoes in one step, not dozens, so that undo matches what I did.
  - Acceptance: one drag, one scrub, one typed value and one accepted proposal each produce exactly one entry.
- **US-3** `[MVP]` As a user, I can see the history as a list with clear labels and AI turns highlighted, so that I can find the change I want to undo.
  - Acceptance: a History tab lists entries newest first with label, source icon and time; clicking an entry highlights the affected blocks; the list stays smooth with hundreds of entries.
- **US-4** `[MVP]` As a user, I can revert one AI turn I didn't like, even after I made other changes, so that I don't lose my later work.
  - Acceptance: "Revert" on an AI entry restores the previous body/frames as a new entry; if later entries changed the same blocks, the Studio explains which and offers to revert them as well or cancel.
- **US-5** `[MVP]` As a user, my history is still there after I close and reopen the project, so that I can revert yesterday's AI changes.
  - Acceptance: history is stored in the project's `history/` folder; reopening restores the list and undo works across the reload.
- **US-6** `[MVP]` As a user, I can set how much history is kept and clear it, so that projects don't grow without limit.
  - Acceptance: project settings has a history depth (entries; optional max age); lowering it trims on save; "clear history" asks for confirmation.

## UX notes
AI entries carry the ✦ icon and the task name; external edits show their source. Undo of an action in another workspace switches to it (e.g. undoing a theme change opens Theme). Toast after undo with "redo".

## Technical design
Redux Toolkit reducers use Immer; record patches per action (Immer's patch support) in a history slice or middleware; transactions are begin/commit actions. Persistence through the storage adapter (append-only log file, compacted to the depth limit). Redux DevTools for watching it work.

## Tests (optional)
Undo/redo round trips (apply → undo → redo gives identical state), revert-with-conflict detection, trimming to depth.

## Risks and open questions
- Patches against flat maps are small, but body HTML changes can be large; store them compressed or as references if history files grow.
- Interaction with external edits: an external change between an action and its undo must not corrupt state; conflict detection covers it.

## Done when
- [ ] Undo/redo work for every alpha action with sensible grouping.
- [ ] (MVP) History panel, revert of a specific AI turn with conflict handling, persistence and depth setting work.
