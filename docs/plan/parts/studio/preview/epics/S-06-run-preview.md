# S-06 — Run preview

> Part: Studio · Phase: 2 · Stages: MVP · Depends on: S-01, S-09, S-03 · Status: ready

## Goal
The user can try the real generated app inside the Studio: the **Preview** workspace shows the React app the Runner generates and serves, with working routes and logic, at the same viewports as the design canvas. Clicking something in the preview selects the block in the Studio, and runtime errors point to the block or logic node that caused them.

## Scope
- In: Preview workspace; iframe on the Runner's Vite server; follow the current page; viewport presets and zoom shared with the canvas; light/dark; reload; open in a new tab; preview bridge (select-in-preview, hover highlight); runtime error overlay; build status.
- Out: Developer panels (S-28); preview without a Runner (S-12, platform preview); preview on a phone (Mobile part).

## Concepts and model
- **Preview bridge**: a dev-only script injected into `out/react` that reports which block an element belongs to and forwards errors; never part of Compact output.
- **Build status**: idle, regenerating, ready, error (codegen or Vite compile errors).

## User stories
- **US-1** `[MVP]` As a user, I can open the Preview workspace and use my real app, so that I can check behaviour, not just looks.
  - Acceptance: the preview shows the current page of the generated app; links and navigation work; logic (S-25) runs; a "Building…" state shows while the Runner starts the server.
- **US-2** `[MVP]` As a user, the preview updates by itself shortly after I change something, so that I never wonder whether it's current.
  - Acceptance: after a change is saved, the preview refreshes within a couple of seconds without losing the current route; the status shows "regenerating" meanwhile.
- **US-3** `[MVP]` As a user, I can view the preview at the same viewports and in light or dark, so that I can compare it with the canvas.
  - Acceptance: viewport and zoom controls behave as on the canvas and are shared through the URL; light/dark switches the theme mode in the preview.
- **US-4** `[MVP]` As a user, I can click an element in the preview to jump to its block, so that fixing what I see is quick.
  - Acceptance: with "select mode" on, hovering highlights the block and clicking selects it in the Structure panel and opens Design; with it off, the app behaves normally.
- **US-5** `[MVP]` As a user, when the app breaks I see what went wrong and where, so that I can fix it.
  - Acceptance: compile and runtime errors show in an overlay with a plain-language message, the block or logic node involved (when known) and a "go to" button; Developer mode shows the stack.
- **US-6** `[MVP]` As a user, I can open the preview in a separate browser tab or window, so that I can test it at full size or on a second monitor.
  - Acceptance: "open in new tab" opens the preview URL; it keeps updating with changes.

## UX notes
Preview is a workspace tab next to Design; a small "select mode" toggle; the build status sits in the toolbar. A side-by-side canvas/preview view is a nice later addition.

## Technical design
The preview adapter (S-02) supplies the URL and status; `useSyncExternalStore` subscribes to bridge messages (`postMessage`) and Runner events. The bridge maps DOM elements to block ids through data attributes added only in preview builds.

## Tests (optional)
A smoke check that the sample project builds and serves; bridge message handling.

## Risks and open questions
- Hot reload sometimes loses state; acceptable for a preview, but avoid full reloads when possible.
- Data attributes for the bridge must never leak into Compact output (S-13 check).

## Done when
- [ ] The Preview workspace shows the running app, updates after changes, follows page and viewport, and supports select-in-preview and error overlays.
