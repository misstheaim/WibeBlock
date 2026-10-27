# Decisions

Lightweight decision log. Each entry: context → decision → consequences. Add new entries at the end; mark superseded ones instead of deleting.

| ID | Decision | Date |
|---|---|---|
| D-01 | Flex/grid block tree instead of free coordinates | 2026-10-27 |
| D-02 | Frame (user) / Body (AI) split; bodies are HTML + Tailwind fragments | 2026-10-27 |
| D-03 | Tailwind v4 + CSS-variable tokens; theme live, global prompt → stale | 2026-10-27 |
| D-04 | Framework-neutral JSON source; codegen targets; React (Vite) first | 2026-10-27 |
| D-05 | No Claude-subscription API use; Claude Code connects via WibeBlock MCP server; BYO key via Vercel AI SDK | 2026-10-27 |
| D-06 | Local-first; platform optional and runnable locally; cloud last, cheapest first | 2026-10-27 |
| D-07 | Service boundaries: Identity, AI Generation, Export separate; modular monolith for the rest; gRPC sync, Kafka async | 2026-10-27 |
| D-08 | Postgres JSONB is the store of record; Neo4j is a Kafka-fed read model | 2026-10-27 |
| D-09 | Kubernetes locally (kind/k3d) first; AKS later; no Container Apps | 2026-10-27 |
| D-10 | Terraform for IaC; OpenTelemetry from the first service | 2026-10-27 |
| D-11 | Developer mode toggle instead of separate UIs for developers and non-developers | 2026-10-27 |
| D-12 | Two breakpoints (desktop base + mobile overrides) in the MVP | 2026-10-27 |
| D-13 | No CI on pull requests; GitHub Actions only for releases and deployment | 2026-10-27 |
| D-14 | Automated tests are optional and usually written by an AI agent | 2026-10-27 |

## D-01 Flex/grid block tree instead of free coordinates
**Context.** IDEA.md described blocks as divs positioned "however the user likes". Absolute x/y coordinates export to non-responsive code that developers won't own.
**Decision.** Every block lives in a flex (default) or grid container; the user controls direction, gap, alignment, wrap, sizing (fixed/fill/hug) and breakpoint overrides. Drag-and-drop reorders/reparents only. Absolute positioning is an explicit per-container opt-in for overlays.
**Consequences.** Clean, responsive codegen; editor is a tree + inspector (like Webflow/Framer), not a canvas with coordinates. Requires good visual feedback for flex concepts for non-developers (S-03, S-14).

## D-02 Frame / Body split; bodies as HTML + Tailwind fragments
**Context.** "AI only styles" would force users to build all content from nested divs; letting AI touch layout breaks user ownership.
**Decision.** Frame (layout, size, position, responsive) is user-owned and never edited by AI. Body (prompt + generated content and styling inside the frame) is AI-owned, editable as text, and can be ejected into child blocks. Bodies are stored as sanitised HTML fragments with Tailwind classes and CSS-variable token references so that any target framework can emit them.
**Consequences.** Output validation and a repair round are needed (S-04). Interactivity inside bodies is declarative and limited; richer behaviour is a later decision (open question in master §8).

## D-03 Tailwind v4 + CSS-variable tokens
**Decision.** Theme tokens are emitted as CSS variables consumed by Tailwind v4 `@theme`. Changing tokens requires no regeneration. Global-prompt and skill-version changes mark bodies stale; the user regenerates selectively.
**Consequences.** Idiomatic, small exported code; LLMs are reliable with Tailwind. Theme token set must be fixed early (S-05).

## D-04 Framework-neutral source with codegen targets
**Context.** React first, Vue/Angular/React Native later; the user wants the project data to be framework-independent JSON.
**Decision.** `wibeblock/*.json` is the single source of truth. `packages/core` codegen has a target plugin API; `react-vite` is the first target. The Runner keeps `out/<target>/` regenerated for preview; Compact writes a clean project to a chosen folder.
**Consequences.** One schema for Local files and platform JSONB documents. Preview = real generated code, no second renderer locally. Each new target is an epic (S-17).

## D-05 Claude Code connection, no subscription API use
**Context.** Anthropic's consumer terms forbid using Claude subscription OAuth tokens in third-party tools (incl. Agent SDK); subscriptions stopped covering third-party usage in April 2026.
**Decision.** WibeBlock never uses the user's Claude credentials. For developers, the Runner exposes an MCP server and each project ships `.mcp.json` + skills, so the user runs Claude Code themselves and it edits the project through WibeBlock tools. For everyone else: BYO API key (any provider via Vercel AI SDK) locally, or the platform's key in Connected/Cloud mode.
**Consequences.** Prompt library must be data usable from TS, .NET and Claude Code skills (P8). Studio must handle external edits live (S-09, S-10).

## D-06 Local-first; platform optional; cloud last and cheapest first
**Context.** Minimal spending; everything should be buildable and learnable on one machine.
**Decision.** Phase 1–2 need no backend. Platform services run locally under Aspire + Docker and in kind/k3d; the Studio has a Connected mode pointing at them. Azure deployment is a single late epic (P-13) ordered by cost: Blob + static hosting → Postgres → AKS → Kafka/Neo4j; the cluster is stopped when idle.
**Consequences.** All adapters must be swappable at runtime (Local ↔ Connected). Mail, blob, queues all need local equivalents (Mailpit, Azurite, Redpanda).

## D-07 Service boundaries and protocols
**Decision.** Separate services: Identity (OpenIddict), AI Generation (.NET, Anthropic SDK), Export (Node, codegen); the rest is a modular monolith (Core API) with hard module boundaries. gRPC (incl. server-streaming) for synchronous calls where a user waits; Kafka + outbox for asynchronous events and batch work. Billing + Metering are extracted later as the deliberate "split a module" exercise (L-06).
**Consequences.** Each technology has a distinct job; streaming tokens never goes through Kafka. Polyglot gRPC (Node ↔ .NET) is exercised by Export.

## D-08 Postgres store of record, Neo4j read model
**Context.** The user wanted to learn a graph database; the block tree itself is a document loaded whole, and Local mode stores the same JSON.
**Decision.** Projects are JSONB documents in Postgres. Neo4j holds the Design Graph, a CQRS read model projected from Kafka events, used for insights and prompt-library quality analysis. It can be rebuilt by replay.
**Consequences.** Core stays simple and identical across modes; Neo4j is isolated in L-02 and never on the critical path.

## D-09 Kubernetes: local first, AKS later, no Container Apps
**Decision.** Learn Kubernetes on kind/k3d with Helm charts for all services (L-08); deploy to AKS only in P-13. Skip Azure Container Apps to avoid writing deployment twice.
**Consequences.** Aspire for daily development, kind for deployment exercises; both must stay in sync (same images).

## D-10 Terraform; OpenTelemetry from the start
**Decision.** Terraform for all cloud infrastructure (transferable, works with AKS/Helm/Aura). OTel instrumentation is wired in P-01 because Aspire provides it nearly for free and retrofitting tracing is costly.

## D-11 Developer mode toggle
**Decision.** One UI for both audiences; a toggle reveals developer panels (code, classes, files, provider settings, Compact options).

## D-12 Two breakpoints in MVP
**Decision.** Desktop base + mobile overrides in the Frame model from day one; more breakpoints later. Avoids a data-model retrofit.

## D-13 No CI on pull requests
**Context.** Solo pet project; work happens in local learning sessions.
**Decision.** No CI runs on pull requests or pushes. GitHub Actions is used only for release workflows (tag → build → publish → deploy).
**Consequences.** Builds and lint are checked locally before merging. Load-test regressions (L-04) run from a local script.

## D-14 Automated tests are optional
**Context.** Tests are worth learning and useful where logic is tricky, but the owner doesn't want writing them to be part of every task.
**Decision.** Tests are never required for a ticket to be done. Epics may list where tests would pay off (codegen golden files, validators, schema migrations, local/platform parity, module-boundary architecture tests, Testcontainers integration tests); the owner decides per ticket whether to add them, usually by having an AI agent write them after the implementation. Learning a testing tool (e.g. Testcontainers, k6) can be the goal of a ticket in its own right.
**Consequences.** Acceptance criteria are checked by running the app, a command or a manual step, not by tests. Test projects and scripts exist only where someone chose to add them.

## Superseded ideas from IDEA.md
- Claude Code subscription as an AI provider → D-05.
- Free positioning of divs → D-01.
- Cloud edition in Phase 3 with Container Apps → D-06, D-09.
- "Cloud edition" / "Local edition" as two products → replaced by **modes** (Local, Connected, Cloud) of one Studio.
