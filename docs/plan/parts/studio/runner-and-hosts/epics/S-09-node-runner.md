# S-09 — Node Runner

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: S-01 · Status: ready

## Goal
A small local server gives the Studio what a browser cannot do safely: read and write project folders, call AI providers with the user's key, and later generate code, serve the run preview and run Compact. It is deliberately the same shape as the platform, so the adapter contract is proven against a real server before the .NET services exist (D-25). One `npm start` launches the Studio host and the Runner.

## Scope
- In: `apps/runner`; HTTP API + WebSocket; localhost binding and session token; workspace folder for projects; project list/create/open/save with validation; AI task execution through `packages/ai`; `npm start`; file watcher; codegen output to `out/`; Vite dev server lifecycle; Compact execution; event stream.
- Out: the MCP server (S-10); AI task logic (S-07); Compact UI (S-13); preview UI (S-06).

## Concepts and model
- **Workspace**: a folder (configured in `.env` or on first run) under which projects live; projects can also be opened from any path.
- **Session token**: generated at start, handed to the Studio host, required on every call; protects against other sites calling `localhost`.
- **Runner API surface** (what crosses the boundary, not the exact shape): projects (list, create, read, save document parts), AI (run task with streaming, cancel, settings), codegen and preview (status, URL), Compact (start, progress), events (external file change, job status).

## User stories
- **US-1** `[alpha]` As a user, I can run `npm start` once and get the Studio and the Runner together, so that local setup is one step.
  - Acceptance: from a fresh clone with `.env` filled, `npm start` starts both; the Studio shows "Runner connected" in the status bar; stopping the Runner shows "disconnected" with a retry.
- **US-2** `[alpha]` As a user, I can create, list and open projects stored as folders on my disk, so that I own my files.
  - Acceptance: creating a project writes a valid `wibeblock/` folder; the project list shows name, path and last opened; opening reads and validates it and reports problems by path.
- **US-3** `[alpha]` As a user, my edits are saved to disk automatically and safely, so that I never lose work.
  - Acceptance: changes appear in the JSON files within a second or two; writes are atomic (no half-written files after a crash); invalid documents are rejected with the validation report and the Studio shows it.
- **US-4** `[alpha]` As a user, I can run AI tasks with my own API key without the key ever reaching the browser, so that my key stays safe.
  - Acceptance: the key is read from `.env` (or set in AI settings and stored by the Runner); the browser network tab never shows it; streamed tokens reach the Studio; cancel stops the provider call.
- **US-5** `[alpha]` As a user, I am protected from other websites talking to my Runner, so that running it is safe.
  - Acceptance: the Runner listens on localhost only; calls without the session token or from a foreign origin are refused.
- **US-6** `[MVP]` As a user, edits made to the project files outside the Studio (editor, Claude Code) appear in the Studio live, so that I can mix tools.
  - Acceptance: editing a page file on disk updates the canvas within a second; the Studio notices when the selected block changed externally; the Runner ignores its own writes.
- **US-7** `[MVP]` As a user, the Runner keeps a generated React app and a preview server running for my project, so that the run preview is always current.
  - Acceptance: opening a project generates `out/react/` and starts a Vite dev server on a free port; saving changes regenerates changed files; closing the project stops the server.
- **US-8** `[MVP]` As a user, I can run Compact and follow its progress, so that I get a standalone project in a folder I choose.
  - Acceptance: Compact writes the project to the chosen folder, streams progress and log lines, optionally runs install and build, and reports success or the failing step.

## UX notes
The Runner has no UI of its own. Its state appears in the Studio status bar (connected, preview running, job in progress).

## Technical design
- Node + TypeScript; HTTP framework choice open (Fastify or Hono; weigh schema validation and WebSocket support). WebSocket for events and streaming.
- Writes per project are serialised; atomic writes (temp file + rename).
- Codegen work may run in a worker thread so the API stays responsive.
- The Studio's Runner adapters (S-02) use this API; TanStack Query on the Studio side.

## Tests (optional)
API contract tests (create → save → read round trip, token refusal) and the atomic write behaviour.

## Risks and open questions
- Windows path handling and file watching quirks (duplicate events); test on Windows early.
- Port collisions for the Vite server; pick free ports and report them.

## Done when
- [ ] `npm start` brings up Studio + Runner; projects can be created, opened and saved.
- [ ] AI tasks run with the key kept on the Runner.
- [ ] Foreign origins and missing tokens are refused.
- [ ] (MVP) External edits appear live; `out/react` and its preview server follow the project; Compact runs with progress.
