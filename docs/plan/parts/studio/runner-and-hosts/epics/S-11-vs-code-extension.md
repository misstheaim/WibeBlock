# S-11 — VS Code extension

> Part: Studio · Phase: 7 · Stages: garden · Depends on: S-09 · Status: ready

## Goal
Developers can use the Studio inside VS Code: the extension opens the workspace folder as a WibeBlock project and shows the Studio in a webview, with the extension host providing the Runner's capabilities (D-19).

## Scope
- In: `apps/vscode-ext`; Studio in a webview; extension-host implementation of the Runner API (or launching the Runner); workspace folder as project; commands (open Studio, Compact, regenerate stale); status bar item.
- Out: a separate editor UI for VS Code.

## User stories
- **US-1** `[garden]` As a developer, I can open the Studio for my workspace from the command palette, so that I stay in my editor.
  - Acceptance: "WibeBlock: Open Studio" shows the Studio in a tab with the workspace project loaded.
- **US-2** `[garden]` As a developer, edits in the Studio and in files stay in sync, so that I can switch freely.
  - Acceptance: file edits update the Studio and the other way round.
- **US-3** `[garden]` As a developer, I can run Compact and regenerate stale blocks from VS Code commands, so that common actions are at hand.
  - Acceptance: commands exist and report progress in a notification.

## Risks and open questions
- Webview restrictions (CSP, iframes for the canvas and preview) need a spike first.

## Done when
- [ ] The Studio runs inside VS Code against the workspace project with sync and commands.
