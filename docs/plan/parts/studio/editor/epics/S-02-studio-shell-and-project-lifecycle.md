# S-02 — Studio shell & project lifecycle

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: S-01, S-14 (S-09 for disk storage) · Status: ready

## Goal
The Studio becomes a real app: a monorepo with `packages/studio` rendered by a thin local host `apps/studio`, the adapter contract every host fills in (D-19), the stores and routes everything else builds on, and the project lifecycle: create a project (choosing its frameworks), open recent ones, manage pages and settings. This is where most of the React foundations are learned: context, Suspense, routing, Redux Toolkit, TanStack Query and Actions.

## Scope
- In: pnpm workspace with `apps/studio` and `packages/studio` (set up first, D-32); the code structure inside `packages/studio`; `packages/studio` as a component taking adapters and slots; adapter contract (storage, ai, export, preview, realtime); Redux store with the document slice; Zustand UI store; TanStack Query client; TanStack Router routes and search params; project list, create, open; target choice; pages; project settings; Developer mode; shortcuts; command palette; responsive shell.
- Out: the canvas (S-03), Structure (S-18), inspector (S-19), history logic (S-15), the platform host (P-08, P-16).

## Concepts and model
- **Host**: renders `<Studio adapters slots />`. `apps/studio` passes Runner adapters; until S-09 exists, an **in-memory adapter** (optionally persisted to browser storage) lets editor work start immediately.
- **Adapter contract**: plain TypeScript interfaces in `packages/studio` (or a small TS package of its own; not the root `contracts/` folder, which holds language-neutral schemas, D-32) describing operations and events, not transport. Each host implements them.
- **Routes**: project list; project workspaces Design, Logic, Theme, Knowledge, Preview; project settings. **Search params**: page, selected block, viewport, zoom.
- **Project settings**: name, targets, history depth (S-15), AI defaults (S-07), Developer mode default.

## User stories
- **US-1** `[alpha]` As a developer, I can run the Studio as a package inside a thin host, so that the same editor later runs in VS Code and the platform app.
  - Acceptance: `packages/studio` and `apps/studio` exist in a pnpm workspace; `apps/studio` only wires adapters and renders the Studio; the Studio has no imports from any host.
- **US-2** `[alpha]` As a user, I can create a project with a name, a starting theme and the frameworks to build, so that the project starts right.
  - Acceptance: the create dialog validates the name, offers React (Vue and Angular visible but disabled, "later"), and a default theme; after creating, the Design workspace opens with one empty page.
- **US-3** `[alpha]` As a user, I can see my recent projects and open one, so that I can continue where I left off.
  - Acceptance: the project list shows recent projects with last-opened time; opening shows a loading state (Suspense) and then the Design workspace; a project that fails validation shows the errors instead of a blank screen.
- **US-4** `[alpha]` As a user, I can add, rename, reorder and delete pages and set their routes, so that my app is multi-page.
  - Acceptance: a Pages list in the left panel (the Files view, organised into folders in S-32) supports all of these; new pages open with a starter layout (S-31); routes are unique and validated; deleting asks for confirmation; switching pages updates the URL.
- **US-5** `[alpha]` As a user, I can move between workspaces and reload without losing my place, so that the Studio feels like a real app.
  - Acceptance: Design/Logic/Theme/Knowledge/Preview are tabs in the top bar backed by routes; page, selection, viewport and zoom survive a reload and can be shared as a link.
- **US-6** `[MVP]` As a user, I can change project settings (name, history depth, AI defaults, Developer mode), so that the Studio works the way I want.
  - Acceptance: a settings route with a form; invalid values are explained inline; saved settings apply immediately.
- **US-7** `[MVP]` As a user, I can drive the Studio from the keyboard and a command palette, so that frequent actions are fast.
  - Acceptance: shortcuts for undo/redo, delete, duplicate, workspace switch, zoom; a command palette (Ctrl/Cmd+K) lists commands and pages with fuzzy search; shortcuts are shown in tooltips.
- **US-8** `[MVP]` As a user on a small screen, I get a usable Studio, and on a large screen I get all panels docked, so that both laptops and big monitors work well.
  - Acceptance: above a width threshold both side panels are docked; below it they become overlays toggled from the top bar; the canvas always keeps a minimum width.

## UX notes
See the layout sketch in the [Studio part](../../studio.md) §4. The top bar holds the project and page switchers, workspace tabs, the prompt bar, undo/redo, viewport and zoom, theme switcher, Compact, settings, Developer mode and the host's slot (user menu in the platform app).

## Technical design
- React context provides the adapters; Suspense + `use` for initial loads; TanStack Query for Runner data; Redux Toolkit store for the document (entity adapters: pages, blocks), with listener middleware for autosave through the storage adapter; Zustand for UI state; Actions / `useActionState` for create and settings forms; cmdk for the palette.
- TanStack Router with typed search params.

## Tests (optional)
Adapter contract tests with the in-memory adapter; route search-param parsing.

## Risks and open questions
- **Code structure inside `packages/studio` (decide in the first step of this epic).** Not decided while setting up the workspace. Before the shell, stores and routes are written, decide and write up in `docs/development.md` (workspace conventions) and `decisions.md`:
  - folders **by feature** (`features/canvas`, `features/projects`, … each with its components, hooks and state) vs **by type** (`components/`, `hooks/`, `store/`);
  - TanStack Router **file-based** routes (generated route tree, Vite plugin in the host) vs **code-based** routes, keeping in mind that the Studio is a package rendered by several hosts and must accept a base path (risk below);
  - **barrel files** only at the package boundary (`src/index.ts`), no `index.ts` re-exports inside the package.
- **Two routers in the platform app**: `apps/platform` uses React Router (D-26) and the Studio uses TanStack Router. The Studio must accept a base path (and possibly a history object) from its host. Validate early with a small spike; fallback: memory history synced to the host URL, or React Router inside the Studio.
- Autosave granularity: debounce vs per action; decide with S-09 and S-15.

## Done when
- [ ] `apps/studio` renders `packages/studio` with adapters; an in-memory adapter and the Runner adapter both work.
- [ ] Projects can be created (with target choice), listed and opened; pages managed; URL state survives reload.
- [ ] (MVP) Settings, shortcuts, command palette and the responsive shell work.
