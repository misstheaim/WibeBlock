# S-13 — Compact & export

> Part: Studio · Phase: 2 · Stages: MVP · Depends on: S-01, S-09 · Status: ready

## Goal
The final step of the local loop: **Compact** writes a clean, standalone React project to a folder the user chooses, with a README, optionally installs dependencies and checks the build, and reports what it produced. The output has no runtime dependency on WibeBlock (P4) and is the same for the same input.

## Scope
- In: Compact dialog (target, folder, options), progress with log, result summary, open folder, overwrite protection, README generation, install and build check, reproducible output, codegen off the main thread in the Studio where it runs in the browser.
- Out: zip and GitHub export (platform, P-07); other targets (S-17).

## Concepts and model
- **Compact options**: target (React in the MVP), destination folder, run install, run build check, include README, package manager.
- **Compact result**: files written, size, warnings (e.g. unbound ports, stale bodies), install/build outcome, duration.

## User stories
- **US-1** `[MVP]` As a user, I can export my project as a React app to a folder I choose, so that I own the code.
  - Acceptance: the Compact dialog asks for the destination and options; the folder contains a runnable Vite + React project with no `wibeblock/` folder and no preview bridge.
- **US-2** `[MVP]` As a user, I see Compact's progress and any problems before and during the export, so that I know what I get.
  - Acceptance: pre-checks warn about stale bodies, invalid blocks and unbound ports, with links to them; progress shows steps and log lines; Cancel stops it cleanly.
- **US-3** `[MVP]` As a user, I can let Compact install dependencies and check that the app builds, so that I know it works before I open it.
  - Acceptance: with the options on, install and build run and their result is shown; a failing build shows the error output.
- **US-4** `[MVP]` As a user, my exported project has a README that explains how to run and change it, so that anyone can pick it up.
  - Acceptance: the README lists the scripts, the folder structure, where the theme lives and how pages map to routes.
- **US-5** `[MVP]` As a user, exporting twice gives identical output and never silently overwrites my changes, so that I can export again safely.
  - Acceptance: same input → byte-identical output; exporting into a non-empty folder asks to overwrite, choose another folder or cancel.

## UX notes
A dialog launched from the top bar; after success, a summary with "Open folder" and "Copy run command". Warnings are actionable links, not blockers.

## Technical design
The Runner executes Compact (S-09) with `packages/core` codegen. Where codegen runs in the browser (validation pre-checks, browser-only mode later), it runs in a web worker through Comlink so the UI stays responsive.

## Tests (optional)
Golden output for the sample project (shared with S-01) and a check that no preview-only attributes appear.

## Risks and open questions
- Package versions in the generated `package.json`: pinned and updated deliberately, recorded in the target.

## Done when
- [ ] Compact writes a clean React project that installs, builds and runs with no WibeBlock dependency, with progress, warnings, README and overwrite protection.
