# S-01 — Project schema & codegen engine

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: — · Status: ready

## Goal
The project has one well-defined, validated format that every other piece reads and writes: the Studio, the Runner, the platform (through a JSON Schema export) and codegen. In the alpha this means the universal layer, validation, migrations and the shared frame → CSS mapping, which is enough for the design canvas and for the backend to start (D-25). In the MVP it adds the React framework layer (ports, logic graph, bindings) and the codegen engine with the `react-vite` target that turns a project into a standalone app.

## Scope
- In: `packages/core` setup; Zod schema for project, page, block, frame, body, theme, knowledge entry, React target layer; reference validation; migrations; JSON Schema export; frame → CSS mapping; body sanitiser and its rules as data; port derivation from bodies; codegen engine and the `react-vite` target; deterministic formatting.
- Out: the Compact dialog and folder output (S-13); the run preview server (S-06, S-09); other targets (S-17); the logic canvas UI (S-25); mobile override editing (Mobile part).

## Concepts and model
See the source format in the [Codegen feature](../codegen.md). Key points:
- **Universal layer**: project, pages (flat block map + root id), themes, knowledge entries. **Framework layer** per target under `targets/<target>/`: target options and one logic graph per page (D-21).
- **Ports** are derived from the block (built-in ports) and its body (marked elements), never stored twice.
- **Validation** levels: (1) shape, from the Zod schema; (2) references: every child, parent, binding and port exists, one root per page, no cycles, routes unique; (3) body rules: sanitiser report.
- **Migrations**: `schemaVersion` plus an ordered list of migration steps; each step takes a document of version n and returns version n+1.
- **Frame → CSS**: one mapping from a frame (and the breakpoint in effect) to CSS/Tailwind classes, shared by the canvas (S-03) and codegen.

## User stories
- **US-1** `[alpha]` As a developer, I can describe a project's universal layer in one schema package, so that every part of WibeBlock agrees on what a valid project is.
  - Acceptance: `packages/core` exists in the workspace; a sample project folder (two pages, ~10 blocks, one theme) validates; breaking it (missing child, unknown layout type, two roots) produces readable errors with the path to the problem.
  - Notes: decide units for sizes and spacing (token steps vs px) and record them in the codegen feature doc.
- **US-2** `[alpha]` As a platform developer, I can get the project schema as JSON Schema, so that the .NET Projects module validates the same documents (P-04).
  - Acceptance: one command produces versioned JSON Schema files; the sample project validates against them with an off-the-shelf validator; the files are committed to `contracts/json-schema/`, where the backend reads them (D-32); the sample project lives in `contracts/fixtures/`.
  - Notes: reference checks (level 2) are not expressible in JSON Schema; document which rules the server must check itself.
- **US-3** `[alpha]` As a developer, I can turn a frame into CSS in one place, so that the design canvas and the generated code lay blocks out identically.
  - Acceptance: a table of frame examples (row/column, gap, wrap, fill/hug/fixed, grid columns, absolute in an opted-in container) maps to the expected classes; the same function is imported by the canvas and the codegen.
- **US-4** `[alpha]` As a developer, I can sanitise and validate an AI-generated body, so that only safe HTML with Tailwind classes and token references enters a project.
  - Acceptance: scripts, inline handlers, unknown tags/attributes and raw colours are removed or reported; the report lists what changed; the rules exist as a data file the platform can load.
- **US-5** `[alpha]` As a user, I can open a project written by an older WibeBlock version, so that my work is never stranded by a schema change.
  - Acceptance: a project with an older `schemaVersion` is migrated on load; the Studio is told that a migration happened; a migration test fixture exists for at least one real step.
- **US-6** `[MVP]` As a developer, I can store a React framework layer with ports, logic graphs and bindings, so that behaviour has a home in the project (D-21).
  - Acceptance: a project with `targets: ["react"]` has `targets/react/`; ports are derived from bodies with markers; a binding to a missing port is reported by validation.
- **US-7** `[MVP]` As a developer, I can generate a React + Vite project from a WibeBlock project, so that the user gets real, idiomatic code.
  - Acceptance: the sample project generates a project with React Router routes per page, Tailwind v4 with the theme as CSS variables, one component per page and per named block, and logic graphs turned into hooks and handlers; `npm install && npm run dev` works; generating twice gives byte-identical output.
- **US-8** `[MVP]` As a developer, I can regenerate only what changed, so that the run preview updates quickly.
  - Acceptance: changing one block's body rewrites only the affected component files; the engine reports which files changed.

## UX notes
No UI of its own. Validation messages must be readable by the Studio (path, message, severity) so S-02/S-03 can show them next to the right block.

## Technical design
- `packages/core` is plain TypeScript, no React, usable in Node, the browser and a web worker.
- Zod schemas are the source; types are inferred from them; JSON Schema generated from them.
- Codegen: an engine that walks pages and asks a **target plugin** for files; the target owns templates and naming; Prettier formats the output. Body HTML → JSX is a mechanical transform (attributes, `class` → `className`, `<wb-slot/>` → children, port markers → props and handlers).
- Choice to leave open for the implementation session: template strings vs an AST builder for JSX output. Weigh readability of templates vs correctness of AST printing.

## Tests (optional)
- **First Vitest tests by hand (D-16):** schema validation fixtures (valid and broken projects) and the frame → CSS table.
- Golden-file tests for the `react-vite` target (sample project → expected file tree), sanitiser cases, each migration step.

## Risks and open questions
- Units and the token scale (tokens vs px) affect every later epic; settle in US-1.
- Port marker format inside bodies must be easy for the AI to produce and robust to sanitising.
- Keeping JSON Schema and reference rules in sync with the .NET side; a shared fixture folder used by both helps.

## Done when
- [ ] The sample project validates; broken variants fail with clear paths.
- [ ] JSON Schema export exists and validates the sample project.
- [ ] Frame → CSS mapping is shared by the canvas and codegen.
- [ ] Sanitiser rules exist as data.
- [ ] (MVP) The sample project generates a React + Vite app that runs, with identical output on a second run.
