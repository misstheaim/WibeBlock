# Feature — Codegen

> Part: [Studio](../studio.md) · Epics: S-01, S-13, S-17

## Purpose

The project format and the engine that turns it into real projects. A project is a **universal layer** shared by all targets plus **one framework layer per target** (D-21). `packages/core` holds the schema, validation, migrations, the frame → CSS mapping shared with the design canvas (D-20), the body sanitiser and the codegen targets. It is used by the Studio, the Runner, the VS Code extension, browser-only mode and the platform (Projects module validation through the JSON Schema export, Export service).

## Project source format

```
<project>/wibeblock/
  project.json             id, name, schemaVersion, targets (["react"]), breakpoints, activeThemeId, settings
  pages/<pageId>.json      id, route, title, rootBlockId, blocks: map by id
  themes/<themeId>.json    tokens (color, font, fontSize, space, radius, shadow) × modes (light, dark)
  knowledge/<entryId>.md   front matter: title, kind (note | style-guide), inContext; markdown body
  targets/react/
    target.json            target options (component naming, router, generated-app libraries)
    logic/<pageId>.json    logic graph: nodes, edges, bindings (maps by id)
  history/                 persisted history log (S-15)
  snapshots/               named snapshots (S-20, v1)
  assets/                  images and media (S-16, v1)
  ai-log.jsonl             one line per AI task run: task, version, model, usage, cost, result
```

**Block** (fields and relationships, not a final type):
- `id`, `name`, `kind` (container | leaf), `parentId`, ordered `childIds`.
- `frame` (user-owned): layout (flex | grid, direction, wrap, gap, align, justify, columns/rows, padding), size (fixed | fill | hug per axis, min/max), position (flow | absolute inside an opted-in container), `responsive.mobile` overrides (slot kept for the Mobile part, D-12).
- `editor` (Studio-only, never exported): scaffold colour for the block frame (S-31, D-29).
- `body` (AI-owned, optional): prompt, sanitised HTML with Tailwind classes, `meta` (task version, model, generatedAt, inputsHash, stale).
- **Ports** (D-21): built-in block ports (visible, click) plus ports derived from markers in the body (an element marked as a text, list, value or event port, with a name). Ports are derived, not stored separately, so they always match the body.

**Logic graph** (per page, per target): nodes (kind, config, position on the logic canvas), edges (from pin → to pin, data or event), bindings (graph pin ↔ block port). See [Logic](../logic/logic.md).

## Design notes

- **Flat maps by id** for blocks, nodes, edges and bindings (D-21): stable references, small history patches, straightforward Redux entity adapters.
- **Zod is the source of truth** for the schema; a **JSON Schema export** is generated from it for the platform (P-04) and editors. Validation has two levels: shape (schema) and references (every `childId`, binding and port exists; one root per page; no cycles).
- **Migrations**: `schemaVersion` + ordered migration functions; the Studio migrates on open and saves after confirmation.
- **Frame → CSS** is one function in `packages/core`, used by both the canvas renderer and codegen, so the two surfaces look the same (D-20).
- **Body sanitiser**: allowed tags and attributes, Tailwind classes only, token references through CSS variables, no scripts or inline handlers, port markers in a fixed attribute format, `<wb-slot/>` only in surface bodies. Its rules are exported as data so the platform's AI service validates the same way.
- **Targets** are plugins. `react-vite` first: Vite, React, React Router, Tailwind v4, theme CSS variables, one component per page and per *named* block, logic graph → hooks and handlers. Vue and Angular later (S-17); React Native in the Mobile part (M-03).
- **Deterministic output** (stable ordering, Prettier) so diffs stay readable; golden-file tests per target.
- `out/<target>/` is regenerated for the run preview; **Compact** writes a clean project (no `wibeblock/`, no preview bridge) to a chosen folder with a README.

## Epics

| ID | Epic | Summary | Depends on | Phase | Stages |
|---|---|---|---|---|---|
| [S-01](epics/S-01-project-schema-and-codegen-engine.md) | **Project schema & codegen engine** | Universal + React layer schema in Zod, ports, validation, migrations, JSON Schema export, frame → CSS, body sanitiser, codegen engine with the `react-vite` target, deterministic output. | — | 1–2 | alpha, MVP |
| [S-13](epics/S-13-compact-and-export.md) | **Compact & export** | Compact dialog, progress, result summary, open folder, optional install and build check, output with no WibeBlock dependency. | S-01, S-09 | 2 | MVP |
| [S-17](epics/S-17-additional-codegen-targets.md) | **Additional codegen targets** | Vue and Angular targets for the universal layer and their framework layers, target plugin API hardening, conformance suite. | S-01, S-13, S-26 | 7 | garden |
