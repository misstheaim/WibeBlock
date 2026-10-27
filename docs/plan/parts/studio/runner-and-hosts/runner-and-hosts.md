# Feature — Runner & hosts

> Part: [Studio](../studio.md) · Epics: S-09, S-10, S-11, S-12

## Purpose

Everything that gives the browser-based Studio access to the file system, a preview server and AI in Local mode, plus the alternative hosts: Claude Code (via MCP), VS Code, and a browser-only fallback.

## Design notes

- **Node Runner** (`apps/runner`): local HTTP + WebSocket server bound to localhost with a session token; project folder operations; file watcher so edits from Claude Code or an editor appear live; Vite dev server lifecycle per project; AI proxy (`packages/ai`); Compact; one `npm start` launches Studio + Runner.
- **Claude Code connection** (D-05): the Runner exposes an **MCP server**; each project gets `.mcp.json` and `.claude/skills/` generated from `packages/prompts`, so `claude` run inside the project connects automatically. Tools: `get_project_summary`, `get_page`, `get_block`, `get_block_context`, `set_block_prompt`, `set_block_body`, `list_stale_blocks`, `regenerate`, `get_theme`, `set_theme_tokens`, `add_page`, `add_block`, `move_block`. WibeBlock never holds the user's Claude credentials; changes are recorded in the project like any other edit (generation log notes `source: claude-code`).
- Concurrency: Runner serialises writes per project; the Studio shows a toast when an external edit changes the selected block.
- **VS Code extension**: Studio in a webview; the extension host implements the Runner's API surface; opens the workspace folder as the project.
- **Browser-only**: File System Access API + in-browser codegen + Sandpack preview + BYO key from the browser; Chromium only; a fallback, not a primary host.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [S-09](epics/S-09-node-runner.md) | **Node Runner** | Local server: project folder ops, watcher, Vite lifecycle, AI proxy, Compact execution, `npm start`, localhost security. | S-01 | 1 |
| [S-10](epics/S-10-claude-code-connection.md) | **Claude Code connection** (`apps/claude-plugin`) | MCP server in the Runner, tool set, `.mcp.json` + `.claude/` scaffolding, WibeBlock skills for Claude Code, live reflection in Studio, concurrent-edit handling. | S-04, S-09 | 2 |
| [S-11](epics/S-11-vscode-extension.md) | **VS Code extension** | Studio in a webview, extension-host implementation of the Runner API, workspace as project, commands, status bar. | S-09 | 2 |
| [S-12](epics/S-12-browser-only-mode.md) | **Browser-only mode** | File System Access API storage, in-browser codegen, Sandpack/esbuild-wasm preview, BYO key in browser. | S-01, S-06 | 7 |
