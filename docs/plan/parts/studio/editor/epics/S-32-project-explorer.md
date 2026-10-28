# S-32 — Project explorer

> Part: Studio · Phase: 2 · Stages: MVP · Depends on: S-02, S-18 · Status: ready

## Goal
The left panel has two views (D-30): **Structure**, the component hierarchy of the current page (S-18), and **Files**, the project's folder structure: pages (and their routes as folders), components, assets, themes and knowledge notes. Users find and organise everything in their project the way they would in a code editor, without needing to know the files on disk. In Developer mode the same view can also show the generated code's files.

## Scope
- In: Files view in the left panel; folders for pages (nested routes), components (named blocks that become component files), assets, themes, knowledge; create, rename, move and delete pages and folders; open an item in its workspace; search; Developer-mode view of generated files.
- Out: the page list basics (S-02 alpha stories, which this epic moves into the Files view); asset import (S-16); reusable component instances (S-30); editing generated files (never; S-28 shows them read-only).

## Concepts and model
- **Project explorer**: a tree derived from the project: pages grouped by route segments (`/plans/monthly` → `plans/monthly`), user-created folders for organising pages, named blocks listed under Components, plus assets, themes and knowledge entries.
- Folders are organisation only; a page's route stays the source of truth for URLs. Moving a page between route folders asks whether to change its route.

## User stories
- **US-1** `[MVP]` As a user, I can switch the left panel between Structure and Files, so that I see both the current page's hierarchy and my whole project.
  - Acceptance: two tabs at the top of the left panel; the choice is remembered; the Structure view follows the page opened from Files.
- **US-2** `[MVP]` As a user, I see my pages as folders that follow their routes and can create, rename, move and delete pages and folders, so that a multi-page app stays organised.
  - Acceptance: `/plans/monthly` appears under `plans/`; drag-and-drop moves pages (with a route change confirmation); deleting a folder asks what to do with its pages.
- **US-3** `[MVP]` As a user, I can see components, assets, themes and knowledge notes in the same tree and open them, so that one place leads to everything.
  - Acceptance: clicking a component selects its block on its page; a theme opens the Theme workspace; a note opens Knowledge; assets show a preview.
- **US-4** `[MVP]` As a user, I can search the project tree, so that large projects stay navigable.
  - Acceptance: typing filters the tree as I type and keeps matching parents expanded.
- **US-5** `[MVP]` As a developer, I can switch the Files view to the generated code's folders, so that I can see where everything ends up.
  - Acceptance: in Developer mode a toggle shows `out/react/` as a read-only tree; opening a file shows it in the code panel when S-28 exists (until then, a plain read-only view).

## UX notes
Same tree component and visual language as the Structure panel (S-18): minimal rows, folder icons, quiet markers. Plain names for non-developers ("Pages", "Components", "Images"), file names only in Developer mode.

## Technical design
The tree is derived (memoised selectors) from the Redux document, not stored separately, except user-created folders, which are stored in project settings. Shares the virtualised tree and dnd-kit setup with S-18.

## Tests (optional)
Route-to-folder derivation and the move-with-route-change rules.

## Risks and open questions
- Page folders vs routes can confuse users; the confirmation on move must be clear.

## Done when
- [ ] The left panel switches between Structure and Files; pages, components, assets, themes and notes are browsable, organisable and searchable; Developer mode shows the generated files.
