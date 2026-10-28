# S-21 — Knowledge base

> Part: Studio · Phase: 2 · Stages: MVP · Depends on: S-02, S-07 · Status: ready

## Goal
Users collect everything they know about their app (the idea, audience, brand voice, features, style rules) in a **knowledge base** inside the project, and every AI task uses it as context (D-23). One entry, the **style guide**, replaces the old global prompt: changing it marks bodies stale so the app can be brought back in line.

## Scope
- In: Knowledge workspace; notes with title and markdown body; the style guide entry; in-context toggle per note; context budget preview; search; staleness rule for the style guide; templates for common notes.
- Out: the AI's own hidden notes (S-23); retrieval with embeddings (later option); collaboration on notes (L-09).

## Concepts and model
- **Knowledge entry**: id, title, kind (note | style-guide), in-context flag, markdown body, updatedAt. Stored as `knowledge/<id>.md` with front matter (S-01).
- **Style guide**: exactly one per project, always in context; part of every body's inputs hash.
- **Context budget**: the share of each AI request reserved for knowledge; notes beyond the budget are left out, in a visible order.

## User stories
- **US-1** `[MVP]` As a user, I can write notes about my app in a Knowledge workspace, so that my ideas live next to the design.
  - Acceptance: a list of notes and an editor; create, rename, delete, reorder; markdown with a preview; changes save automatically and are undoable.
- **US-2** `[MVP]` As a user, I can write a style guide that every generation follows, so that I describe the look once.
  - Acceptance: the style guide is pinned at the top and can't be deleted; a new project starts with a short template; generations include it (visible in "what was sent").
- **US-3** `[MVP]` As a user, I can choose which notes the AI sees, and see how much of the context they use, so that I control quality and cost.
  - Acceptance: an in-context toggle per note; a budget bar shows the share used; notes that don't fit are flagged "not sent".
- **US-4** `[MVP]` As a user, when I change the style guide, I'm told which blocks are now out of date, so that I can regenerate them.
  - Acceptance: after an edit, a notice offers "Regenerate stale (n)" (S-04); stale badges appear; editing other notes doesn't mark anything stale.
- **US-5** `[MVP]` As a user, I can search my notes and start from templates (audience, brand, features, pages), so that a good knowledge base is quick to build.
  - Acceptance: search filters titles and text as I type; "new from template" offers a few templates with guiding headings.

## UX notes
Two-pane workspace: list on the left (style guide pinned), editor on the right. Plain markdown with a toggle preview; no heavy formatting toolbar. A small "used by AI" indicator per note.

## Technical design
Entries are part of the Redux document (entity adapter) and saved as markdown files by the storage adapter; `useDeferredValue` for search. Editor choice is open: a plain textarea with preview (simplest) vs a rich editor like Lexical or TipTap (more learning, more work); weigh in the first ticket.

## Tests (optional)
Front-matter round trip (parse → save gives the same file); budget trimming order.

## Risks and open questions
- Large knowledge bases blow the context budget; summaries or retrieval (embeddings) are the later answer.
- Should notes be able to target a page or block ("only for the pricing page")? Candidate for v1.

## Done when
- [ ] Notes and the style guide can be written and searched; the AI receives them within a visible budget.
- [ ] Editing the style guide marks bodies stale and offers regeneration.
