# Feature — Preview

> Part: [Studio](../studio.md) · Epics: S-06

## Purpose

Show the real generated app while editing, and give developers the code-level views (Developer mode).

## Design notes

- Preview is the **real generated code** in `out/<target>/` served by the Runner's Vite dev server in an iframe (D-04); no second renderer. In browser-only mode (S-12) Sandpack/esbuild-wasm replaces Vite.
- A small preview bridge script (dev only, not part of Compact output) maps DOM → block IDs for select-in-preview, hover highlights and error overlays.
- Viewports: desktop, tablet, mobile widths; the mobile view in the editor (M-01) uses the same iframe at mobile width.
- Light/dark toggle switches the theme mode class in the preview.
- **Developer mode** panels: Monaco code panel (generated files read-only; body HTML editable with validation), Tailwind class chips per block, generated file tree, provider/usage panel.
- UI: open — whether the canvas *is* the preview (WYSIWYG) or the preview is a separate pane.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [S-06](epics/S-06-live-preview-and-developer-panels.md) | **Live preview & Developer panels** | Iframe preview from the Runner's Vite server, page switcher, viewport sizes, light/dark toggle, select-in-preview and hover highlight, error overlay; Developer mode: Monaco code panel, class chips, file tree. | S-01, S-09 | 1 |
