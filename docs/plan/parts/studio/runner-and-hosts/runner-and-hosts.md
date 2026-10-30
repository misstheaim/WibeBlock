# Feature — Runner & hosts

> Part: [Studio](../studio.md) · Epics: S-09, S-10, S-11, S-12

## Purpose

Everything that gives the browser-based Studio access to the file system, AI and a preview server in Local mode, plus the alternative hosts: Claude Code (via MCP), VS Code, and a browser-only fallback.

## Design notes

- **Node Runner** (`apps/runner`): a local HTTP + WebSocket server bound to localhost with a session token. In the **alpha** it stores projects (list, create, open, save with schema validation) and runs AI tasks with the user's key (keys never reach the browser). In the **MVP** it adds a file watcher (external edits appear live), codegen to `out/`, the Vite dev server for the run preview, and Compact. One `pnpm dev` launches the Studio host and the Runner.
- The Runner is deliberately the same shape as the platform (stores projects, runs AI tasks, exports), so the adapter contract is tested against a real server before the .NET services exist (D-25).
- **Claude Code connection** (D-05): the Runner exposes an **MCP server**; each project gets `.mcp.json` and `.claude/skills/` generated from `packages/prompts`, so `claude` run inside the project connects automatically. Tools to read the project, set prompts and bodies, list stale blocks, edit theme tokens, add pages and blocks, and (with S-25) read and edit logic graphs. Changes from Claude Code are recorded like any other edit (AI log `source: claude-code`).
- Concurrency: the Runner serialises writes per project; the Studio shows a notice when an external edit changes the selected block.
- **Hosts** (D-19): `apps/studio` (Runner adapters), the VS Code extension, and `apps/platform` (platform adapters, D-26) each render `packages/studio`. Only the platform app has login.
- **VS Code extension**: the Studio in a webview; the extension host implements the Runner's API; the workspace folder is the project.
- **Browser-only**: File System Access API storage, in-browser codegen, Sandpack preview, key entered in the browser; Chromium only; a fallback, not a primary host.

## Epics

| ID | Epic | Summary | Depends on | Phase | Stages |
|---|---|---|---|---|---|
| [S-09](epics/S-09-node-runner.md) | **Node Runner** | Project storage with validation, AI task execution, localhost security, `pnpm dev`; then watcher, codegen output, Vite lifecycle, Compact execution, WebSocket events. | S-01 | 1–2 | alpha, MVP |
| [S-10](epics/S-10-claude-code-connection.md) | **Claude Code connection** (`apps/claude-plugin`) | MCP server in the Runner, tool set, `.mcp.json` + `.claude/` scaffolding, generated skills, live reflection in the Studio, concurrent-edit handling. | S-04, S-09, S-08 | 3 | v1 |
| [S-11](epics/S-11-vs-code-extension.md) | **VS Code extension** | Studio in a webview, extension-host implementation of the Runner API, workspace as project, commands, status bar. | S-09 | 7 | garden |
| [S-12](epics/S-12-browser-only-mode.md) | **Browser-only mode** | File System Access API storage, in-browser codegen, Sandpack/esbuild-wasm preview, key in the browser. | S-01, S-06 | 7 | garden |
