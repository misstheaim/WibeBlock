# Feature — Editor

> Part: [Studio](../studio.md) · Epics: S-02, S-03, S-18, S-31, S-32, S-19, S-15, S-20

## Purpose

The workspace where the user builds pages: the app shell and routes, the project lifecycle, the **design canvas** with its **starter layouts**, the left panel (**Structure** and **Files**), the **inspector**, and **history**. This is the user-owned half of principle P1, plus the safety net (undo, revert, snapshots) that makes AI changes cheap to try.

## Design notes

- **Shell and routes** (S-02): workspaces Design · Logic · Theme · Knowledge · Preview are routes (TanStack Router); page, selected block, viewport and zoom are search params, so a view survives reload and can be shared. The Studio takes adapters and slots from its host (D-19).
- **Design canvas** (S-03, D-20): renders the universal layer in an iframe through a portal, with in-browser Tailwind and theme CSS variables. Block frames (rounded borders in a scaffold colour, with management buttons on the border, D-29), selection and hover are drawn by the Studio above the iframe. Viewports from phone to 4K with zoom (D-27). The canvas never runs logic; bound blocks get a small marker.
- **Structure panel** (S-18): the component hierarchy of the current page (D-30; Photoshop-style layers are a later, separate idea in S-30). Drag-and-drop reorders and reparents (dnd-kit), never sets coordinates (D-01). Add container or leaf, wrap, unwrap, duplicate, delete, rename, keyboard navigation, multi-select basics.
- **Starter canvas** (S-31, D-28): an empty page opens with a random, valid block layout in a random pastel palette; each empty block shows a centred prompt input; Shuffle regenerates it.
- **Files** (S-32, D-30): the second view of the left panel: pages as route folders, components, assets, themes, knowledge; generated files in Developer mode.
- **Inspector** (S-19): generated from the selected block's schema. Tabs Layout (frame), Content (prompt and body), Behaviour (ports and bindings, with S-25), Dev (raw JSON, Developer mode). Docked on large screens, floating next to the block on small ones. Plain-language labels; CSS terms in Developer mode.
- **History** (S-15): every document change is a Redux action recorded with Immer patches; drags and accepted AI proposals are grouped into one entry each (D-22). Undo/redo everywhere, a history panel that can revert a specific AI turn, history persisted with the project, depth set in project settings.
- **Snapshots** (S-20, v1): named copies of the project, diff, restore as a history entry, automatic snapshot before large AI proposals.
- **Breakpoints**: the canvas shows which breakpoint applies to the current viewport; editing mobile overrides belongs to the Mobile part (D-25).

## Epics

| ID | Epic | Summary | Depends on | Phase | Stages |
|---|---|---|---|---|---|
| [S-02](epics/S-02-studio-shell-and-project-lifecycle.md) | **Studio shell & project lifecycle** | Monorepo, `packages/studio` + `apps/studio` host, adapter contract, stores, routes, create/open projects with target choice, pages, settings, Developer mode, shortcuts, command palette, responsive panels. | S-01, S-09, S-14 | 1–2 | alpha, MVP |
| [S-03](epics/S-03-design-canvas.md) | **Design canvas** | Iframe renderer of the universal layer, viewport presets and custom width, zoom, block frames with border buttons, show/hide frames, selection and hover, error isolation, logic markers, canvas/preview parity. | S-01, S-02 | 1–2 | alpha, MVP |
| [S-18](epics/S-18-structure-panel-and-layout-editing.md) | **Structure panel & layout editing** | Structure tree, add/wrap/unwrap/duplicate/delete/rename, drag-and-drop in the tree and on the canvas, keyboard navigation, multi-select, absolute opt-in. | S-03 | 1–2 | alpha, MVP |
| [S-31](epics/S-31-starter-canvas.md) | **Starter canvas** | Random seeded starter layout for new pages, pastel scaffold palettes, centred prompt inputs, shuffle (layout or colours), start-mode choice. | S-01, S-03, S-18 | 1–2 | alpha, MVP |
| [S-32](epics/S-32-project-explorer.md) | **Project explorer** | Files view of the left panel: pages as route folders, components, assets, themes, knowledge; search; generated files in Developer mode. | S-02, S-18 | 2 | MVP |
| [S-19](epics/S-19-schema-driven-inspector.md) | **Schema-driven inspector** | Inspector generated from the block schema, field registry, Layout/Content/Behaviour/Dev tabs, plain language vs Developer mode, docked or floating window. | S-18 | 1–2 | alpha, MVP |
| [S-15](epics/S-15-history-and-ai-turn-revert.md) | **History & AI-turn revert** | Action log with patches, grouped entries, undo/redo, history panel, revert a specific AI turn, persistence, depth setting. | S-02 | 1–2 | alpha, MVP |
| [S-20](epics/S-20-snapshots-and-diff.md) | **Snapshots & diff** | Named snapshots, visual and JSON diff, restore, automatic snapshots before large proposals. | S-15 | 3 | v1 |
