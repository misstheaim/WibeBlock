# Feature — Codegen

> Part: [Studio](../studio.md) · Epics: S-01, S-13, S-17

## Purpose

The framework-neutral project format and the engine that turns it into real projects (D-04). `packages/core` is shared by the Runner, the VS Code extension, browser-only mode and the platform's Export service.

## Project source format

```
<project>/wibeblock/
  project.json      id, name, schemaVersion, target, breakpoints, globalPrompt, skills[] (name@version), settings
  theme.json        tokens { color, font, fontSize, space, radius, shadow } × modes { light, dark }
  pages/<id>.json   { id, route, title, root: Block }
  assets/           images and other media, referenced by relative path
  generations/      optional JSONL log: one line per generation (inputs hash, provider, model, skill versions, usage, result hash)
```

```ts
type Block = {
  id: string; name: string; kind: 'container' | 'leaf';
  frame: {
    layout: { type: 'flex' | 'grid'; direction?; wrap?; gap?; align?; justify?; columns?; rows?; padding? };
    size: { width: Fixed | Fill | Hug; height: Fixed | Fill | Hug; min?; max? };
    position: { mode: 'flow' } | { mode: 'absolute'; inset: ... };   // absolute only inside containers that allow it
    responsive?: { mobile?: Partial<Frame> & { hidden?: boolean; order?: number } };  // more breakpoints later
  };
  body?: { prompt: string; html?: string; meta?: { model; skillVersions; generatedAt; inputsHash; stale: boolean } };
  children: Block[];
};
```

## Design notes

- **Targets** are plugins: `react-vite` first (React Router, Tailwind v4, CSS-variable theme, one component per page, one component per named block); Vue and Angular later (S-17); React Native/Expo in the Mobile part (M-03).
- Body HTML → target templates is a mechanical transform (JSX attribute mapping, `class`→`className`, `<wb-slot/>` → children).
- Output is **deterministic** (stable ordering, formatting via Prettier) so diffs stay readable; golden-file tests per target.
- `out/<target>/` is regenerated incrementally for preview; **Compact** writes a clean project (no `wibeblock/`, no bridge script) to a chosen folder, adds a README, optionally runs install and a build check.
- Schema migrations: `schemaVersion` + ordered migration functions; the Studio migrates on open and offers to save.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [S-01](epics/S-01-project-schema-and-codegen-engine.md) | **Project schema & codegen engine** | JSON schema for project/page/block/theme, validation, migrations, HTML-body grammar and sanitiser, codegen engine with the `react-vite` target, deterministic output, golden-file tests. | — | 1 |
| [S-13](epics/S-13-compact-and-export-ux.md) | **Compact & export UX** | Compact dialog (target, folder, options: install deps, build check, README), progress, result summary, open folder; reproducible output. | S-01, S-09 | 1 |
| [S-17](epics/S-17-additional-codegen-targets.md) | **Additional codegen targets** | Vue (Vite) and Angular targets; target plugin API hardening; shared conformance test suite. | S-01, S-13 | 7 |
