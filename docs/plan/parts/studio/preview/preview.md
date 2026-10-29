# Feature — Preview

> Part: [Studio](../studio.md) · Epics: S-06, S-28

## Purpose

Show and try the **real generated app** (the run preview, D-20), and give developers code-level views of what WibeBlock generates (Developer mode).

## Design notes

- The run preview is the generated code in `out/<target>/`, served by the Runner's Vite dev server and shown in the **Preview** workspace (and optionally in a new browser tab). This is the only place logic runs.
- Codegen regenerates changed files shortly after document changes are saved; Vite hot-reloads them.
- The preview uses the same viewport presets and zoom as the design canvas and follows the current page; light/dark switches the theme mode.
- A small **preview bridge** script (dev only, never in Compact output) maps DOM elements to block ids: click-to-select in the Studio, hover highlight, runtime error overlay that points to the block or logic node.
- **Parity check**: the design canvas and the preview should look the same; a visible mismatch is a bug in the shared frame → CSS mapping or the body renderer (S-01, S-03).
- In platform and browser-only hosts the preview comes from Sandpack / esbuild-wasm or a hosted preview instead of the Runner (preview adapter).
- **Developer panels** (S-28, v1): Monaco code panel (generated files read-only; body HTML editable with validation), Tailwind class chips per block, generated file tree, raw JSON of the selection, AI usage panel.

## Epics

| ID | Epic | Summary | Depends on | Phase | Stages |
|---|---|---|---|---|---|
| [S-06](epics/S-06-run-preview.md) | **Run preview** | Codegen to `out/react`, Runner Vite server lifecycle, Preview workspace, page and viewport sync, light/dark, select-in-preview, error overlay, open in a new tab. | S-01, S-09, S-03 | 2 | MVP |
| [S-28](epics/S-28-developer-panels.md) | **Developer panels** | Monaco code panel, editable body HTML with validation, class chips, file tree, raw JSON, AI usage panel. | S-06 | 3 | v1 |
