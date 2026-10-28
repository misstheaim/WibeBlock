# S-20 — Snapshots & diff

> Part: Studio · Phase: 3 · Stages: v1 · Depends on: S-15 · Status: ready

## Goal
Beyond step-by-step history, the user can save named versions of the whole project, compare any two versions visually and as data, and restore one. Large AI proposals (S-22) create a snapshot automatically, so even a big page rework is one click away from undone.

## Scope
- In: named snapshots; snapshot list; visual diff (changed, added, removed blocks highlighted on the canvas) and JSON diff (Developer mode); restore as a history entry; automatic snapshots before large proposals and before Compact; retention.
- Out: branching or merging versions; platform versions (P-04 stores versions server-side).

## Concepts and model
- **Snapshot**: id, name, createdAt, reason (manual, before-proposal, before-compact), a full copy of the project documents (or a compact delta), stored in `snapshots/`.
- **Diff**: per page: blocks added, removed, moved, frame changed, body changed; theme and knowledge changes listed.

## User stories
- **US-1** `[v1]` As a user, I can save a named snapshot of my project, so that I can return to a version I liked.
  - Acceptance: "Save snapshot" with a name; the list shows name, time and reason; snapshots survive reload.
- **US-2** `[v1]` As a user, I can compare the current project with a snapshot and see what changed on the canvas, so that I understand the difference.
  - Acceptance: compare mode highlights added (green), removed (red) and changed (amber) blocks per page; a side list of changes navigates to them; Developer mode shows a JSON diff.
- **US-3** `[v1]` As a user, I can restore a snapshot, so that I can undo a whole direction at once.
  - Acceptance: restore replaces the project with the snapshot as one history entry (so it can itself be undone).
- **US-4** `[v1]` As a user, a snapshot is taken automatically before big AI changes and before export, so that I'm protected without thinking about it.
  - Acceptance: page- and project-scope proposals (S-22) and Compact create snapshots with a reason; automatic snapshots are trimmed by a retention setting; manual ones are kept.

## UX notes
Snapshots live in the History tab under a "Snapshots" section. Compare mode is a canvas overlay with a toggle between "before" and "after".

## Technical design
Reuses the history patch machinery for restore; diff is computed over the flat block maps (ids make it cheap). Storage format (full copy vs delta) is an implementation choice; weigh size vs simplicity.

## Tests (optional)
Diff computation over block maps (moves vs remove+add).

## Risks and open questions
- Snapshot size for projects with many assets: snapshots reference assets, never copy them.

## Done when
- [ ] Snapshots can be saved, compared visually and restored; automatic snapshots appear before large proposals and Compact.
