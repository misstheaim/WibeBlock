# Feature — Editor

> Part: [Studio](../studio.md) · Epics: S-02, S-03, S-15

## Purpose

The workspace where the user builds pages: app shell, project and page lifecycle, and the layout editor that manipulates the block tree (Frames). This is the user-owned half of principle P1.

## Design notes

- **Tree + canvas + inspector.** The block tree panel and the canvas are two views of the same selection; the inspector edits the selected block's Frame (and hands over to Generation for the Body).
- **Layout model** (D-01): containers are flex (default) or grid; children sized fixed / fill / hug; padding and gap on containers; absolute positioning only inside containers that opt in.
- **Drag-and-drop** reorders or reparents; drop targets are tree positions, never coordinates. `dnd-kit` is the first pick.
- **Breakpoints**: desktop is the base; mobile overrides are edited in the mobile view (Mobile part, M-01). The editor exposes a view switch and shows an "overridden" indicator on frame fields.
- **Developer mode** adds: block IDs, raw Frame JSON, generated class list per frame.
- **History**: every editor action is a command; undo/redo across all panels; named snapshots.
- UI: open — canvas model (edit on the rendered preview vs. a schematic canvas), panel layout, inline vs. panel prompt entry.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [S-02](epics/S-02-studio-shell-and-project-lifecycle.md) | **Studio shell & project lifecycle** | App shell on `packages/ui`, create/open/recent projects, pages list (add/rename/route/delete/reorder), project settings, Developer mode toggle, keyboard shortcuts, command palette skeleton. | S-01, S-09 | 1 |
| [S-03](epics/S-03-layout-editor.md) | **Layout editor** | Tree panel, canvas, inspector; add container/leaf blocks; select; drag to reorder/reparent; flex/grid props; sizing fixed/fill/hug; padding/gap; absolute opt-in; alignment guides; multi-select basics; view switch desktop/mobile (mobile editing itself in M-01). | S-02 | 1 |
| [S-15](epics/S-15-history-undo-redo-snapshots.md) | **History, undo/redo & snapshots** | Command-based undo/redo across editor actions (frames, bodies, theme, pages), named snapshots of the project, diff view between snapshots, restore. | S-03 | 2 |
