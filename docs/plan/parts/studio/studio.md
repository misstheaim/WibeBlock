# Part — Studio

> Editor, AI, logic, codegen, local runner and hosts. Phases 1–3 and 7 in the [master plan](../../00-master.md), delivered in stages **alpha → MVP → v1 → garden** (D-25). Epic IDs `S-nn`.

## 1. Scope

Everything the user touches to build an app, plus everything needed to run it on one machine without a backend: the **Studio** package (`packages/studio`, rendered by every host, D-19), its local host `apps/studio`, the **Node Runner**, and the shared packages **core**, **prompts**, **ai** and **ui**. Alternative hosts (Claude Code plugin, VS Code extension, browser-only) are here too.

Not here: the mobile layout workflow, companion app and native target ([Mobile part](../mobile/mobile.md), Phase 7); accounts, server storage and billing ([Platform](../platform/platform.md)). The platform app's side of the Studio (the adapters it passes in) is sketched in §6 and planned in the Platform part.

## 2. Stages

| Stage | Phase | Goal | Done when |
|---|---|---|---|
| **alpha** | 1 | The smallest Studio the backend can be built against: schema with JSON Schema export, adapter contract, Runner storage and AI proxy, design canvas with block frames, starter layout, Structure panel, inspector, one AI task with proposals, undo. | `pnpm dev` → create a project → add a page, which opens with a random starter layout → add, nest and reorder blocks in the Structure panel → set flex layout in the inspector → view the page at phone, Full HD and 4K with zoom → generate a block body (own API key or the fake provider) → accept or discard → undo/redo → the project is on disk as schema-valid JSON, and the JSON Schema export exists for the platform. |
| **MVP** | 2 (alongside Platform foundation) | The full local loop. | Create a project with a preset theme, tune the palette, write knowledge notes and a style guide, lay out two pages, generate and refine bodies, revert an AI turn from history, (optional) wire a button to show/hide a block in the logic canvas, check the real app in the run preview, Compact to a folder, and run `npm install && npm run dev` there with no WibeBlock dependency. |
| **v1** | 3 (alongside Platform connected) | AI depth and developer power. | AI themes from a prompt, the global prompt bar arranging a page through a reviewed proposal, logic v1 (data, lists, forms, context), prompt library with pinned versions, Developer panels, snapshots, assets, Claude Code connection, onboarding. |
| **garden** | 7 | Everything else, picked freely. | Each epic stands alone. |

User stories carry their stage tag (`[alpha]`, `[MVP]`, `[v1]`, `[garden]`). The platform track starts right after the alpha (D-25); sessions alternate between tracks.

## 3. Features

| Feature | What it covers | Epics |
|---|---|---|
| [Codegen](codegen/codegen.md) | Project schema (universal + framework layers, ports), validation, migrations, JSON Schema export, codegen engine and targets, Compact | S-01, S-13, S-17 |
| [Editor](editor/editor.md) | Shell and routes, project lifecycle, design canvas with viewports, zoom and block frames, starter canvas, Structure and Files panel, schema-driven inspector, history, snapshots | S-02, S-03, S-18, S-31, S-32, S-19, S-15, S-20 |
| [AI](ai/ai.md) | AI core (task registry, providers, proposals, cost), block generation, knowledge base, global prompt bar, prompt & skills library, AI knowledge base | S-07, S-04, S-21, S-22, S-08, S-23 |
| [Design](design/design.md) | Theme studio (presets, palette, tokens), AI themes, assets & media | S-05, S-24, S-16 |
| [Logic](logic/logic.md) | Logic canvas (blueprint graphs per framework), ports and bindings, logic v1 nodes, framework porting | S-25, S-26, S-27 |
| [Preview](preview/preview.md) | Run preview of the generated app, Developer panels | S-06, S-28 |
| [Runner & hosts](runner-and-hosts/runner-and-hosts.md) | Node Runner, Claude Code connection (MCP), VS Code extension, browser-only mode | S-09, S-10, S-11, S-12 |
| [Studio UX](studio-ux/studio-ux.md) | Design system (`packages/ui`, Storybook), onboarding & polish, pro tools | S-14, S-29, S-30 |

### Epics by stage

| Stage | Epics (stories of that stage) |
|---|---|
| alpha | S-01, S-14, S-02, S-09, S-03, S-18, S-31, S-19, S-15, S-07, S-04, S-05 |
| MVP | the rest of the alpha epics, plus S-32, S-21, S-06, S-13, S-25 (optional) |
| v1 | S-20, S-22, S-08, S-24, S-16, S-26, S-28, S-10, S-29 |
| garden | S-17, S-27, S-23, S-11, S-12, S-30 |

## 4. Studio UI decisions

Agreed in the 2026-10-28 design session. Visual sketch: the "Studio" chapter of the [plan map](../../00-master.md).

```
┌ Top bar (quiet) ───────────────────────────────────────────────────────────────────────┐
│ ◆ WibeBlock / Demo / Home │ Design · Logic · Theme · Knowledge · Preview │ ✦ prompt bar │ viewport ▾ │ Export │
├ Left panel ──────┬ Canvas ────────────────────────────────────────────┬ Right panel ─────┤
│ Structure | Files │  ┌───────────╮ ┌──────────────────╮              │ Inspector        │
│  (hierarchy of    │  │ ✦ describe │ │   ✦ describe…    │  random      │ (only when a     │
│  the page) /      │  ╰───────────╯ ╰──────────────────╯  starter     │  block is        │
│  (pages, compo-   │  ┌──────────────────────────────╮ ⊕ ✦ ⋯ ← border│  selected)       │
│  nents, assets…)  │  │ generated content, border kept│    buttons    │                  │
│                   │  ╰──────────────────────────────╯  [Shuffle]    │                  │
└───────────────────┴──────────────────────────────────────────────────┴──────────────────┘
```

- **Workspaces** (routes): **Design** (canvas, left panel, inspector), **Logic** (graph canvas per page and framework), **Theme** (theme studio with a sample sheet), **Knowledge** (notes and style guide), **Preview** (the real app). Project list and settings are routes too.
- **Two surfaces** (D-20): the design canvas renders the project data for editing; the run preview runs the generated app. They must look identical.
- **Viewports** (D-27): phone, tablet, laptop, Full HD, 2K, 4K, custom width; zoom to fit, fixed percentages, 100 %. Larger-than-screen sizes are reached by zooming out.
- **Starter canvas** (D-28, S-31): an empty page opens with a random arrangement of empty blocks (random sizes and arrangement, always a valid flex/grid tree) in a random, mostly pastel palette, different every time; each empty block shows only a prompt input in its centre. Shuffle regenerates it.
- **Block frames** (D-29, S-03): every block is a rounded, bordered frame with a few management buttons on its border (generate, add, duplicate, delete, more). After generation the content takes the body's style and the border stays; "Show frames" hides them. Frames are editor chrome, never exported.
- **Left panel** (D-30): **Structure** (the component hierarchy of the page, S-18) and **Files** (the project's folder structure, S-32). Photoshop-style layers are a separate, later tool (S-30).
- **Responsive Studio**: on large screens panels dock on both sides; on small screens they collapse to overlays and the inspector becomes a floating window next to the selected block.
- **Per-block window**: the border buttons plus the inspector, whose fields are generated from the block's schema (S-19); the inspector appears only when a block is selected.
- **AI feedback** (D-22): every AI change is a proposal shown on the canvas with *Accept* and *Discard*; accepted proposals are one history entry.
- **Prompt bar**: a command input in the top bar with a scope (selection in the MVP; page and project in v1, S-22).
- **Plain language by default**: "Stack: vertical / horizontal", "Size: fill / fit / fixed"; Developer mode adds CSS terms, IDs, raw JSON and code.
- **Visual direction** (D-30): minimal and light: warm paper-like neutrals, one pastel lime accent, few visible controls, chrome that appears on hover. The pastel starter blocks and the user's app are the most colourful things on screen. Light and dark modes come from the shared kit (`packages/ui`, P-17, D-35); details in S-14.
- **Later** (garden, S-30): Photoshop-style layers and Figma-like tools (locking and grouping, align/distribute, guides, measurements, reusable components).

## 5. Architecture

```
apps/studio (local host) ──renders──► packages/studio ◄──renders── apps/platform (RR8, D-26)
   │ Runner adapters                     │                              │ platform adapters (P-16)
   ▼                                     │                              ▼
apps/runner (HTTP + WebSocket)           │                        Gateway → services
   ├ project folder on disk: wibeblock/ (universal layer, targets/react/, knowledge, history)
   ├ AI proxy (packages/ai, keys stay on the server side)
   ├ codegen → out/react/ → Vite dev server (run preview)
   └ Compact → chosen folder
packages/studio  shell, routes, workspaces, stores, canvas renderer, inspector, logic canvas
packages/core    Zod schema, JSON Schema export, migrations, frame → CSS, body sanitiser, codegen + targets
packages/ai      AI task registry, providers (Vercel AI SDK), context assembly, proposals, fake provider
packages/prompts skills, task prompts, presets (data, versioned)
packages/ui      Studio design system (Tailwind v4, Radix, CVA, Storybook)
```

**Adapters** (D-19) come from the host through React context. The Studio never knows which host it runs in.

| Adapter | Local (`apps/studio` + Runner) | Platform (`apps/platform`, P-16) |
|---|---|---|
| storage | Runner: project files on disk | Core API: JSONB documents, optimistic concurrency |
| ai | Runner: AI tasks with the user's key or the fake provider | Core API → AI Generation service, streamed over SignalR |
| export | Runner: Compact to a folder | Export service: zip or GitHub |
| preview | Runner's Vite server | Sandpack / hosted preview |
| realtime | WebSocket to the Runner (external edits, job status) | SignalR |

**State** (D-24):
- **Redux Toolkit**: the project document (entity adapters for blocks, pages, nodes, edges, bindings), history, proposals; listener middleware for side effects (autosave, staleness, sync).
- **Zustand**: transient UI state (hover, drag in progress, zoom, panel sizes) that must not enter history.
- **TanStack Query**: data from the Runner (and the platform), e.g. project list, file status, AI settings.
- **URL** (TanStack Router search params): workspace, page, selected block, viewport, zoom.

## 6. React technology map

Each technology has one real job (P7). Where it is introduced:

| Technology | Job in the Studio | First epic |
|---|---|---|
| React 19 + React Compiler | everything | S-02 |
| Context | adapters from the host, current project | S-02 |
| Suspense + `use` | loading the project and Runner data | S-02 |
| Portals | rendering into the canvas iframe; floating windows and popovers | S-03 |
| Error boundaries | a broken block or body never takes the canvas down | S-03 |
| `useTransition` | viewport and page switches that re-render the whole canvas | S-03 |
| `useSyncExternalStore` | Runner WebSocket, iframe bridge events | S-09 / S-06 |
| `useDeferredValue` | filtering the Structure panel, searching the knowledge base | S-18 / S-21 |
| Actions, `useActionState`, `useOptimistic` | create-project and settings forms; showing an accepted proposal before it is saved | S-02 / S-04 |
| Custom hooks | everywhere; the logic canvas also *generates* them | S-25 |
| **TanStack Router** | Studio routes and type-safe search params | S-02 |
| **Redux Toolkit**, react-redux, `createSelector`, listener middleware | document, history, proposals, side effects | S-02 / S-15 |
| **Zustand** | transient UI state | S-03 |
| **TanStack Query** | Runner API (platform later) | S-02 |
| **React Hook Form + Zod** | schema-driven inspector, settings, dialogs | S-19 |
| **dnd-kit** | Structure tree and canvas reordering | S-18 |
| **TanStack Virtual** | large Structure trees, history list | S-18 |
| **React Flow (xyflow)** | logic canvas | S-25 |
| **Motion** | panel, proposal and canvas transitions | S-14 |
| **Radix + CVA + Storybook** | `packages/ui` | S-14 |
| **cmdk** | command palette | S-02 |
| **Vercel AI SDK UI** (`useObject`) | streaming structured AI output (theme tokens, proposals) | S-24 |
| **XState** (optional) | AI turn lifecycle: streaming → validating → repairing → proposal → accepted / discarded | S-04 |
| **Comlink** web worker | codegen and validation off the main thread | S-13 |
| **Monaco** | Developer-mode code panel | S-28 |
| Vitest, React Testing Library, Playwright | optional tests (D-16) | S-01, S-19, S-29 |

The platform app adds **React Router v8 framework mode** (server rendering, loaders, actions), a generated **OpenAPI client** and the **SignalR client** (D-26, P-08, P-16).

## 7. Platform touchpoints (general shape)

- The Studio stays platform-agnostic; `apps/platform` renders it on `/projects/:id/edit` with platform adapters and fills the slots (user menu, share/export area).
- The schema's **JSON Schema export** (S-01, alpha) is what the Projects module validates against (P-04). The **AI task definitions** in `packages/prompts` are what the AI Generation service runs (P-05), so local and platform generations stay equivalent.
- The proposal and history model is client-side; the platform stores accepted changes with optimistic concurrency and shows a conflict screen when versions diverge (P-16).
- See [Platform app](../platform/platform-app/platform-app.md) for the host itself.
