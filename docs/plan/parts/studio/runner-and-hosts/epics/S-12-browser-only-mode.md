# S-12 — Browser-only mode

> Part: Studio · Phase: 7 · Stages: garden · Depends on: S-01, S-06 · Status: ready

## Goal
Someone can try WibeBlock without installing Node: a static build of the Studio uses the File System Access API for a project folder, generates code in the browser and previews it with Sandpack or esbuild-wasm, with the API key entered in the browser. A fallback for Chromium browsers, not a primary host. Its preview work is reused by the platform app (P-08).

## Scope
- In: browser storage adapter (File System Access API), in-browser codegen (web worker), Sandpack/esbuild-wasm preview adapter, key handling in the browser with clear warnings.
- Out: Firefox/Safari support (no File System Access API); MCP and Compact install/build.

## User stories
- **US-1** `[garden]` As a curious user, I can open WibeBlock in Chrome and work on a local folder without installing anything, so that trying it is easy.
  - Acceptance: a static build opens a folder, edits and saves the project.
- **US-2** `[garden]` As a user, I can see the run preview without a Runner, so that browser-only mode is complete.
  - Acceptance: the preview adapter bundles and runs the generated app in the browser.
- **US-3** `[garden]` As a user, I'm told clearly where my API key is kept and what the risks are, so that I decide knowingly.
  - Acceptance: entering a key shows a warning and stores it only for the session unless I choose otherwise.

## Risks and open questions
- Bundling a React + Tailwind app in the browser is heavy; measure Sandpack vs esbuild-wasm.

## Done when
- [ ] The Studio works in Chrome against a local folder with preview and BYO key, no Node required.
