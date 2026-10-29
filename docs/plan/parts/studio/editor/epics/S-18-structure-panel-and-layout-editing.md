# S-18 — Structure panel & layout editing

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: S-03 · Status: ready

## Goal
The user builds the structure of each page: adding container and leaf blocks, nesting them, reordering by drag-and-drop in the **Structure** panel (the component hierarchy, D-30) and on the canvas, and doing the everyday edits (wrap, unwrap, duplicate, delete, rename). Layout stays real flex/grid; nothing is positioned by coordinates (D-01).

## Scope
- In: Structure tree with expand/collapse; add container/leaf; wrap in container, unwrap; duplicate; delete; rename; drag-and-drop reorder/reparent in the Structure panel and on the canvas; keyboard navigation; copy/paste; multi-select basics; absolute opt-in for overlays.
- Out: frame fields (S-19); lock, hide, groups and other pro features (S-30); mobile-specific order and visibility (Mobile part).

## Concepts and model
- **Container** blocks lay out children (flex or grid); **leaf** blocks hold a body. A container can also have a surface body (S-04).
- **Drop targets** are tree positions (before, after, inside), never coordinates. Dropping into an absolute-enabled container still places the child in the tree; its offsets are set in the inspector.
- Block names default to their role ("Container", "Card") and can be renamed; names become component names in codegen.

## User stories
- **US-1** `[alpha]` As a user, I can see the page as a tree in the Structure panel and select blocks there, so that I can reach any block, even tiny or hidden ones.
  - Acceptance: the tree shows names and kind icons, expands and collapses; selecting in the tree selects on the canvas and the other way round; the selected row scrolls into view.
- **US-2** `[alpha]` As a user, I can add container and leaf blocks inside or next to the selected block, so that I can build structure quickly.
  - Acceptance: add buttons in the Structure panel and on the block's border (S-03); new blocks get sensible default frames (container: vertical stack with gap; leaf: fill width, hug height) and are selected after adding.
- **US-3** `[alpha]` As a user, I can drag blocks in the Structure panel to reorder them or move them into another container, so that rearranging is direct.
  - Acceptance: a drop indicator shows before/after/inside; invalid drops (into a leaf, into its own descendant) are refused; the canvas updates on drop; one drag is one undo step.
- **US-4** `[alpha]` As a user, I can delete, duplicate and rename blocks, so that I can fix mistakes and reuse work.
  - Acceptance: delete removes the block and its children (one undo step); duplicate copies with new ids and places the copy after the original; double-click renames inline.
- **US-5** `[MVP]` As a user, I can drag blocks directly on the canvas to reorder them inside a container, so that I can arrange visually.
  - Acceptance: dragging a selected block shows an insertion line between siblings; dropping on another container shows that container highlighted; works at any zoom level.
- **US-6** `[MVP]` As a user, I can wrap blocks in a new container or unwrap a container, so that I can restructure without rebuilding.
  - Acceptance: wrap puts the selection into a new container at the same position; unwrap moves children up and removes the container; both are one undo step each.
- **US-7** `[MVP]` As a user, I can navigate and edit the tree from the keyboard and copy/paste blocks, so that structure editing is fast.
  - Acceptance: arrow keys move through the tree, Left/Right collapse/expand, Enter renames, Delete deletes, Ctrl/Cmd+C/V/D copy, paste and duplicate (also across pages); Shift/Ctrl-click selects several blocks for delete, duplicate and wrap.
- **US-8** `[MVP]` As a user, I can let a container position some children freely on top of others, so that I can build overlays like badges and hero captions.
  - Acceptance: "allow overlays" on a container enables absolute positioning for its children; such children show a marker in the Structure panel; others are unaffected.

## UX notes
Structure rows: kind icon, name, small markers (has body, stale, has logic, absolute). Large trees stay smooth (virtualised list). Drag uses a ghost of the row; auto-scroll near panel edges; auto-expand on hover over a collapsed container.

## Technical design
dnd-kit for both the tree and canvas drags; TanStack Virtual for the tree; `useDeferredValue` for a Structure filter box. Every structural edit is a Redux action on the block entity map (parentId/childIds), so history (S-15) groups and reverts it cleanly.

## Tests (optional)
Tree operations (move, wrap, unwrap, duplicate) as pure functions on the block map are worth unit tests: they are easy to get subtly wrong.

## Risks and open questions
- Drag-and-drop on a scaled iframe: pointer coordinates must be mapped through zoom; spike before US-5.
- Accessibility of drag-and-drop: keyboard alternatives (move up/down, indent/outdent) cover it.

## Done when
- [ ] Blocks can be added, nested, reordered by drag, deleted, duplicated and renamed from the Structure panel.
- [ ] (MVP) Canvas drag, wrap/unwrap, keyboard and copy/paste, multi-select and overlay containers work.
