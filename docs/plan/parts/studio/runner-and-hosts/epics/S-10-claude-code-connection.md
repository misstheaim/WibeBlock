# S-10 — Claude Code connection

> Part: Studio · Phase: 3 · Stages: v1 · Depends on: S-04, S-09, S-08 · Status: ready

## Goal
Developers who use Claude Code can work on a WibeBlock project from their terminal: the Runner exposes an MCP server, each project ships `.mcp.json` and WibeBlock skills, and `claude` run inside the project reads and edits it through WibeBlock tools. Changes appear live in the Studio and are recorded like any other edit. WibeBlock never touches the user's Claude credentials (D-05).

## Scope
- In: MCP server in the Runner; tool set; `.mcp.json` + `.claude/skills/` scaffolding (`apps/claude-plugin`); generated skills (S-08); live reflection; concurrent-edit handling; AI log with `source: claude-code`.
- Out: using Claude subscriptions as a provider (forbidden, D-05).

## Concepts and model
**Tools** (names indicative): project summary, get page, get block with context, set block prompt, set block body (validated), list stale blocks, get/set theme tokens, add page, add/move block, read and edit logic graphs (with S-25), read knowledge notes.

## User stories
- **US-1** `[v1]` As a developer, I can run `claude` in my project folder and it connects to WibeBlock automatically, so that setup is zero.
  - Acceptance: new projects contain `.mcp.json` and skills; Claude Code lists the WibeBlock tools while the Runner runs.
- **US-2** `[v1]` As a developer, I can ask Claude Code to generate or change blocks, and the Studio shows the results live, so that I can mix both tools.
  - Acceptance: a body set through MCP appears on the canvas within a second, is validated like any body, and is a history entry with the Claude Code source.
- **US-3** `[v1]` As a developer, Claude Code follows the same rules as the built-in AI, so that results are consistent.
  - Acceptance: skills are generated from `packages/prompts`; invalid bodies sent through MCP are rejected with the validator report.
- **US-4** `[v1]` As a user, I'm told when Claude Code changes the block I'm editing, so that edits don't collide silently.
  - Acceptance: a notice appears on the selected block with "view change" and "undo".

## Technical design
MCP TypeScript SDK in the Runner; tools call the same document operations as the Studio; writes serialised per project (S-09).

## Tests (optional)
Tool contract tests against a sample project.

## Risks and open questions
- Claude Code edits arrive as document changes, not proposals; decide whether they should appear as proposals in the Studio instead.

## Done when
- [ ] Claude Code edits a project through MCP tools; changes appear live, validated and undoable.
