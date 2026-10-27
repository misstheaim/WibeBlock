# Part — Studio

> Editor, AI generation, codegen, local runners. Phases 1, 2 and parts of 7 in the [master plan](../../00-master.md). Epic IDs `S-nn`.

## 1. Scope

Everything the user touches to build an app, plus everything needed to run it on one machine without a backend: the **Studio** React app (shared by all modes), the **Node Runner**, the shared packages **core**, **prompts**, **ai**, **ui**, and alternative hosts (Claude Code plugin, VS Code extension, browser-only). Mobile-specific workflows live in the [Mobile part](../mobile/mobile.md); accounts/storage/billing in [Platform](../platform/platform.md).

## 2. Features

| Feature | What it covers | Epics |
|---|---|---|
| [Editor](editor/editor.md) | App shell, project/pages lifecycle, layout editor (tree, canvas, inspector), history/undo/snapshots | S-02, S-03, S-15 |
| [Generation](generation/generation.md) | Block prompts, body generation and validation, staleness, AI provider layer, prompt & skills library | S-04, S-07, S-08 |
| [Design](design/design.md) | Theme tokens, light/dark, global prompt, assets & media | S-05, S-16 |
| [Preview](preview/preview.md) | Live preview, responsive sizes, select-in-preview, Developer-mode panels (code, classes, files) | S-06 |
| [Codegen](codegen/codegen.md) | Project schema, validation, migrations, codegen engine and targets, Compact | S-01, S-13, S-17 |
| [Runner & hosts](runner-and-hosts/runner-and-hosts.md) | Node Runner, Claude Code connection (MCP), VS Code extension, browser-only mode | S-09, S-10, S-11, S-12 |
| [Studio UX](studio-ux/studio-ux.md) | Design system of the Studio itself, onboarding, polish, accessibility | S-14 |

## 3. Studio UI decisions

_To be recorded from the design discussion (layout of panels, canvas model, where prompts live, generation feedback, visual style, Developer mode). Until then, feature docs mark UI points as "UI: open"._

## 4. Architecture

```
apps/studio ──(HTTP + WebSocket)──► apps/runner ──► project folder on disk
   │  adapters: storage | ai | auth | export | realtime      │  ├ wibeblock/   JSON source of truth
   │  Local mode: all adapters point at the runner           │  ├ .claude/ + .mcp.json  Claude Code connection
   │  Connected/Cloud: adapters point at the platform        │  └ out/<target>/  generated project for preview
   └── iframe preview ◄── Vite dev server started by runner  └─ Compact: codegen to a chosen folder
packages/core: schema, validation, migrations, codegen engine, target: react-vite
packages/ai:   provider abstraction (Vercel AI SDK), prompt assembly, streaming, fake provider
packages/prompts: skills + predefined prompts (data), versioned manifests
```

| Adapter | Local | Connected / Cloud |
|---|---|---|
| storage | Runner, files on disk | Core API, JSONB documents |
| ai | Runner → Vercel AI SDK with BYO key; or Claude Code via MCP | AI Generation service via Core API, streamed over SignalR |
| auth | none | Identity service (OIDC) |
| export | Runner → folder | Export service → zip / GitHub |
| realtime | WebSocket to Runner | SignalR |

State: Zustand stores per domain (project document, selection, UI), command bus for undoable actions (S-15), TanStack Query for platform data.

## 5. MVP definition (Phase 1, done when…)

A user can `npm start`, create a project, add two pages, lay out ~10 blocks with flex containers, write prompts, generate bodies with their own API key, tune theme tokens and see the preview update live, switch to the mobile view and fix the layout, then Compact to a folder and run `npm install && npm run dev` in the output with no WibeBlock dependency.
