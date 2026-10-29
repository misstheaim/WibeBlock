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
| D-07 | Service boundaries: Identity, AI Generation, Export separate; modular monolith for the rest; gRPC sync, Kafka async (async part superseded by D-15) | 2026-10-27 |
| D-08 | Postgres JSONB is the store of record; Neo4j is a Kafka-fed read model (feed superseded by D-15) | 2026-10-27 |
| D-09 | Kubernetes locally (kind/k3d) first; AKS later; no Container Apps | 2026-10-27 |
| D-10 | Terraform for IaC; OpenTelemetry from the first service | 2026-10-27 |
| D-11 | Developer mode toggle instead of separate UIs for developers and non-developers | 2026-10-27 |
| D-12 | Two breakpoints (desktop base + mobile overrides) in the MVP | 2026-10-27 |
| D-13 | No CI on pull requests; GitHub Actions only for releases and deployment | 2026-10-27 |
| D-14 | Automated tests are optional and usually written by an AI agent (refined by D-16) | 2026-10-27 |
| D-15 | Message bus first (RabbitMQ locally, Azure Service Bus in Cloud); Kafka later as an upgrade for event streams | 2026-10-27 |
| D-16 | Tests stay optional; the owner writes the first tests with each toolkit by hand, then delegates to agents | 2026-10-27 |
| D-17 | Go as a small, optional language; its job is chosen later | 2026-10-27 |
| D-18 | Azure Functions for small event-driven jobs that must run while the cluster is stopped | 2026-10-27 |
| D-19 | The Studio is a package rendered by host apps; accounts live only in a separate React platform app; Astro landing page | 2026-10-27 |
| D-20 | Two surfaces: a design canvas that renders the project data, and a run preview of the generated app | 2026-10-28 |
| D-21 | Universal layer + one framework layer per target, linked through ports; logic lives in per-framework graphs; bodies are pure markup | 2026-10-28 |
| D-22 | AI changes arrive as proposals the user accepts or discards; the AI may propose layout changes | 2026-10-28 |
| D-23 | A knowledge base replaces the single global prompt | 2026-10-28 |
| D-24 | Studio frontend stack: Redux Toolkit for the document, Zustand for transient UI, TanStack Query and Router, own components on Tailwind | 2026-10-28 |
| D-25 | Stages alpha → MVP → v1 → garden, run as parallel Studio and platform tracks; Mobile moves to Phase 7 | 2026-10-28 |
| D-26 | Platform app on React Router v7 framework mode with server rendering and a backend-for-frontend | 2026-10-28 |
| D-27 | Canvas viewports with zoom-to-fit, separate from breakpoints | 2026-10-28 |
| D-28 | Starter canvas: new pages open with a random, seeded, valid block layout in pastel scaffold colours | 2026-10-28 |
| D-29 | Block frames with border buttons are editor chrome: they stay after generation and are never exported | 2026-10-28 |
| D-30 | Left panel shows Structure and Files; Photoshop-style layers come later; minimal light Studio with a pastel lime accent | 2026-10-28 |

## D-01 Flex/grid block tree instead of free coordinates
**Context.** IDEA.md described blocks as divs positioned "however the user likes". Absolute x/y coordinates export to non-responsive code that developers won't own.
**Decision.** Every block lives in a flex (default) or grid container; the user controls direction, gap, alignment, wrap, sizing (fixed/fill/hug) and breakpoint overrides. Drag-and-drop reorders/reparents only. Absolute positioning is an explicit per-container opt-in for overlays.
**Consequences.** Clean, responsive codegen; editor is a tree + inspector (like Webflow/Framer), not a canvas with coordinates. Requires good visual feedback for flex concepts for non-developers (S-03, S-14).

## D-02 Frame / Body split; bodies as HTML + Tailwind fragments
**Context.** "AI only styles" would force users to build all content from nested divs; letting AI touch layout breaks user ownership.
**Decision.** Frame (layout, size, position, responsive) is user-owned and never edited by AI. Body (prompt + generated content and styling inside the frame) is AI-owned, editable as text, and can be ejected into child blocks. Bodies are stored as sanitised HTML fragments with Tailwind classes and CSS-variable token references so that any target framework can emit them.
**Consequences.** Output validation and a repair round are needed (S-04). Interactivity inside bodies is declarative and limited; richer behaviour is a later decision (open question in master §8).
**Partly superseded by D-21 and D-22:** interactivity never lives in bodies; it lives in the framework logic graph, bound to ports the AI marks in the body. The AI may *propose* frame changes, which the user accepts or discards.

## D-03 Tailwind v4 + CSS-variable tokens
**Decision.** Theme tokens are emitted as CSS variables consumed by Tailwind v4 `@theme`. Changing tokens requires no regeneration. Global-prompt and skill-version changes mark bodies stale; the user regenerates selectively.
**Consequences.** Idiomatic, small exported code; LLMs are reliable with Tailwind. Theme token set must be fixed early (S-05).
**Partly superseded by D-23:** the global prompt is now the *style guide* entry of the knowledge base; editing it marks bodies stale, editing other knowledge entries does not.

## D-04 Framework-neutral source with codegen targets
**Context.** React first, Vue/Angular/React Native later; the user wants the project data to be framework-independent JSON.
**Decision.** `wibeblock/*.json` is the single source of truth. `packages/core` codegen has a target plugin API; `react-vite` is the first target. The Runner keeps `out/<target>/` regenerated for preview; Compact writes a clean project to a chosen folder.
**Consequences.** One schema for Local files and platform JSONB documents. Preview = real generated code, no second renderer locally. Each new target is an epic (S-17).
**Partly superseded by D-20 and D-21:** the editing canvas renders the project data itself (real generated code only in the run preview), and the source is a universal layer plus one layer per framework instead of one fully neutral document.

## D-05 Claude Code connection, no subscription API use
**Context.** Anthropic's consumer terms forbid using Claude subscription OAuth tokens in third-party tools (incl. Agent SDK); subscriptions stopped covering third-party usage in April 2026.
**Decision.** WibeBlock never uses the user's Claude credentials. For developers, the Runner exposes an MCP server and each project ships `.mcp.json` + skills, so the user runs Claude Code themselves and it edits the project through WibeBlock tools. For everyone else: BYO API key (any provider via Vercel AI SDK) locally, or the platform's key in Connected/Cloud mode.
**Consequences.** Prompt library must be data usable from TS, .NET and Claude Code skills (P8). Studio must handle external edits live (S-09, S-10).

## D-06 Local-first; platform optional; cloud last and cheapest first
**Context.** Minimal spending; everything should be buildable and learnable on one machine.
**Decision.** Phase 1–2 need no backend. Platform services run locally under Aspire + Docker and in kind/k3d; the Studio has a Connected mode pointing at them. Azure deployment is a single late epic (P-13) ordered by cost: Blob + static hosting → Postgres → AKS → Kafka/Neo4j; the cluster is stopped when idle.
**Consequences.** All adapters must be swappable at runtime (Local ↔ Connected). Mail, blob, queues all need local equivalents (Mailpit, Azurite, Redpanda).
**Partly superseded by D-19:** adapters are chosen by the host app the Studio runs in, not switched at runtime.
**Partly superseded by D-15:** the cloud order ends with Service Bus/Neo4j instead of Kafka, and the local queue is RabbitMQ instead of Redpanda.

## D-07 Service boundaries and protocols
**Decision.** Separate services: Identity (OpenIddict), AI Generation (.NET, Anthropic SDK), Export (Node, codegen); the rest is a modular monolith (Core API) with hard module boundaries. gRPC (incl. server-streaming) for synchronous calls where a user waits; Kafka + outbox for asynchronous events and batch work. Billing + Metering are extracted later as the deliberate "split a module" exercise (L-06).
**Consequences.** Each technology has a distinct job; streaming tokens never goes through Kafka. Polyglot gRPC (Node ↔ .NET) is exercised by Export.
**Partly superseded by D-15:** asynchronous events go through a message bus (RabbitMQ / Azure Service Bus) + outbox first; Kafka comes later for event streams. The service boundaries and gRPC stand.

## D-08 Postgres store of record, Neo4j read model
**Context.** The user wanted to learn a graph database; the block tree itself is a document loaded whole, and Local mode stores the same JSON.
**Decision.** Projects are JSONB documents in Postgres. Neo4j holds the Design Graph, a CQRS read model projected from Kafka events, used for insights and prompt-library quality analysis. It can be rebuilt by replay.
**Consequences.** Core stays simple and identical across modes; Neo4j is isolated in L-02 and never on the critical path.
**Partly superseded by D-15:** the Design Graph is fed from the message bus, and a rebuild replays the event log kept in Postgres; it moves to Kafka topics with the Kafka upgrade (L-12).

## D-09 Kubernetes: local first, AKS later, no Container Apps
**Decision.** Learn Kubernetes on kind/k3d with Helm charts for all services (L-08); deploy to AKS only in P-13. Skip Azure Container Apps to avoid writing deployment twice.
**Consequences.** Aspire for daily development, kind for deployment exercises; both must stay in sync (same images).
**Note (D-18):** Azure Functions are added for a few small jobs only; services still run in Kubernetes.

## D-10 Terraform; OpenTelemetry from the start
**Decision.** Terraform for all cloud infrastructure (transferable, works with AKS/Helm/Aura). OTel instrumentation is wired in P-01 because Aspire provides it nearly for free and retrofitting tracing is costly.

## D-11 Developer mode toggle
**Decision.** One UI for both audiences; a toggle reveals developer panels (code, classes, files, provider settings, Compact options).

## D-12 Two breakpoints in MVP
**Decision.** Desktop base + mobile overrides in the Frame model from day one; more breakpoints later. Avoids a data-model retrofit.
**Note (D-25, D-27):** the schema keeps the two-breakpoint slot from the Studio alpha; editing mobile overrides moves to the Mobile part (Phase 7). Canvas viewports are preview sizes, not breakpoints.

## D-13 No CI on pull requests
**Context.** Solo pet project; work happens in local learning sessions.
**Decision.** No CI runs on pull requests or pushes. GitHub Actions is used only for release workflows (tag → build → publish → deploy).
**Consequences.** Builds and lint are checked locally before merging. Load-test regressions (L-04) run from a local script.

## D-14 Automated tests are optional
**Context.** Tests are worth learning and useful where logic is tricky, but the owner doesn't want writing them to be part of every task.
**Decision.** Tests are never required for a ticket to be done. Epics may list where tests would pay off (codegen golden files, validators, schema migrations, local/platform parity, module-boundary architecture tests, Testcontainers integration tests); the owner decides per ticket whether to add them, usually by having an AI agent write them after the implementation. Learning a testing tool (e.g. Testcontainers, k6) can be the goal of a ticket in its own right.
**Consequences.** Acceptance criteria are checked by running the app, a command or a manual step, not by tests. Test projects and scripts exist only where someone chose to add them.
**Refined by D-16:** the first tests with each toolkit are written by the owner, to learn it.

## D-15 Message bus first, Kafka later
**Context.** D-07 put Kafka in as the async backbone. What the platform needs first is simpler: reliable delivery of integration events to a few consumers (Metering, Notifications, Design Graph) and work queues for background jobs. Kafka is heavy to run in kind and costly in Azure, and its main strength, a replayable log, is only needed for projections and analytics.
**Decision.** L-01 introduces a **message bus**: **RabbitMQ** locally (Docker under Aspire; the RabbitMQ Cluster Operator in kind) and **Azure Service Bus** (Standard tier, needed for topics) in Cloud. Services talk to one transport abstraction, so the broker is configuration, not code; which abstraction (Wolverine, MassTransit, or a thin interface over the official clients) is chosen when L-01 is planned. The outbox stays, and published outbox rows are kept as an **append-only event log** in Postgres, so read models can be rebuilt by replaying it. **Kafka** comes later as an upgrade (L-12, Phase 7): event streams for projections and analytics move to Kafka topics, while work queues stay on the bus, which teaches queues vs logs side by side.
**Consequences.** Supersedes the async part of D-07 and the Kafka feed in D-08. Local equivalent of the queue is RabbitMQ (D-06). KEDA scales on queue length. The Analytics store (L-07) waits for L-12. Learning order: RabbitMQ and Service Bus in Phase 5, Kafka in Phase 7.

## D-16 Testing toolkits: learn by hand, then delegate
**Context.** Testing is expected in backend and frontend roles alike, and tests written only by an agent don't teach the toolkit. D-14 keeps tests optional, and that stays.
**Decision.** Tests remain optional for every ticket. For each toolkit the owner writes the first tests by hand in the epic where it fits best, then delegates further tests to AI agents. Toolkits and their first epics: **Vitest** (S-01, codegen golden files and the validator), **React Testing Library** (S-03, layout editor components), **xUnit + Testcontainers** (P-01/P-04, Postgres-backed integration tests), **Playwright** (S-14, one end-to-end flow: create a block, generate, preview), **k6 / NBomber** (L-04, already planned). Releases and deployment keep their GitHub Actions pipelines (D-13); tests that exist can run there.
**Consequences.** Those epics list a "first tests by hand" item in their optional tests section. Nothing blocks a ticket on tests.
**Note (D-25):** after the Studio re-plan, React Testing Library starts in S-19 (inspector) and Playwright in S-29 (onboarding & polish).

## D-17 Go as a small, optional language
**Context.** Go is widely used in cloud tooling and carries a pay premium, but a third backend language should not dilute the .NET and TypeScript focus.
**Decision.** Go is allowed for one small, optional piece of the platform. The first candidate is the preview-hosting builder or Kubernetes operator (L-10), where Go is the native choice (client-go, kubebuilder). The final job is chosen when that epic is planned, or earlier if a better fit appears.
**Consequences.** No core path depends on Go; the piece can be skipped or rewritten in .NET without changing the rest.

## D-18 Azure Functions for small event-driven jobs
**Context.** Azure Functions are common in .NET + Azure roles and worth learning. The AKS cluster is stopped when idle (D-06), so anything that must react while it is off, such as Stripe webhooks, needs to live outside it.
**Decision.** One Azure Functions app (P-15) runs three jobs: Stripe webhook intake (HTTP trigger → Service Bus queue, consumed by Billing), export cleanup (timer trigger) and asset processing (Blob trigger → thumbnails). Functions only receive, clean up or transform, then hand off; product logic stays in the services. Runs locally with Core Tools + Azurite under Aspire; deployed on a consumption plan by Terraform in P-13.
**Consequences.** A second hosting model next to Kubernetes, kept deliberately small (D-09 still holds for services). Billing gets webhooks from a queue once P-15 exists; before that they go straight to the Core API.

## D-19 The Studio as a package with host apps
**Context.** A developer who clones the repo and runs `npm start` should get only a working Studio: no login, profiles or account management. Those belong to the platform. Hosting the Studio in an iframe inside a platform app was considered and rejected: the token still has to reach the Studio, the preview is already an iframe (nested iframes), routes must be synced across the boundary, and cross-origin storage is restricted.
**Decision.** The editor lives in `packages/studio` as a React component that takes **adapters** (storage, ai, export, realtime) and **slots** (e.g. a user menu) from its host and has no login or account code. Hosts: `apps/studio` (Local, Runner adapters, what `npm start` runs), `apps/vscode-ext` (VS Code), and `apps/platform`, a **React** app with login (PKCE), project dashboard, account, plan and usage pages, which renders the Studio on its editor route with platform adapters. The mode is chosen by the host, not by a runtime switch. The public landing page is an optional static **Astro** site (`apps/website`). Learning option: an Angular version of the platform app hosting the Studio as a Web Component (`<wibe-studio>`); React stays the product choice because it shares `packages/ui`, data and auth code with the Studio and keeps one framework on the page.
**Consequences.** S-02 sets up `packages/studio` with a thin `apps/studio` host from the start. P-08 becomes the platform app; P-14 the account pages plus the optional landing page. Local ↔ platform transfer is an import (folder or zip) and a zip download in the platform app, not a mode switch. Supersedes D-06's "adapters swappable at runtime".
**Refined by D-26:** the platform app is a React Router v7 framework-mode app with server rendering and a backend-for-frontend; tokens stay on its server instead of a PKCE flow in the browser.

## D-20 Design canvas and run preview
**Context.** The canvas must resize live to any viewport (phone to 4K) and give instant feedback while the user drags, nests and edits. Rendering every edit through codegen → disk → Vite hot reload (D-04, "no second renderer") is too slow for that, and it ties the editor to the Runner.
**Decision.** Two surfaces. The **design canvas** renders the project's universal layer directly in an iframe (frames → CSS, bodies as HTML, Tailwind compiled in the browser, theme as CSS variables); this is where the user edits. The **run preview** shows the real generated app from the Runner's Vite server; this is where logic runs and the app is tried out. The goal is parity: one shared frame → CSS mapping in `packages/core` used by both the canvas and codegen, the same Tailwind version and the same theme CSS.
**Consequences.** Editor work can start before the Runner has a preview server. The canvas never runs user logic; it only marks bound blocks. Drift between canvas and preview is a class of bug to watch (S-03, S-06).

## D-21 Universal layer, framework layers and ports
**Context.** Fully framework-neutral source (D-04) can describe layout and markup but not real application behaviour: React, Angular and Vue express state and effects differently, and the owner wants framework features (hooks, context, signals, services) to be visible and editable. Projects should later be able to target several frameworks at once.
**Decision.** A project has one **universal layer** (pages, block tree with frames, bodies, themes, knowledge base, routes) and one **framework layer per chosen target** (React first). Blocks expose **ports**: inputs the logic can drive (text, list, visibility, value) and outputs it can listen to (click, submit, change). Block-level ports are built in; ports inside a body are elements the AI marks when it generates the body. A framework layer holds a **logic graph** per page (blueprint-style nodes and edges, with framework-native nodes) and **bindings** from graph pins to ports. Codegen for a target reads the universal layer plus that target's layer. The user chooses targets when creating a project (React only until S-17). Further targets are added later by AI porting or a manual porting tool (S-27); a target layer is complete when every port it needs is bound. Storage stays JSON validated by Zod, with entities kept in **flat maps by ID** (blocks, nodes, edges, bindings) instead of nested trees.
**Consequences.** Answers the "body interactivity" open question: bodies stay pure markup. The schema (S-01) carries the React layer from the start. Porting and multi-target projects have a concrete shape (S-17, S-27). Flat maps keep history patches small and references stable.

## D-22 AI changes are proposals
**Context.** The owner wants users to try what the AI made and throw it away easily, both for a block and for a whole page. Principle P1 forbade the AI from touching frames, which rules out requests like "arrange this page".
**Decision.** Every AI task that changes the project returns a **proposal**: a set of document changes with a summary, shown on the canvas before anything is applied. The user **accepts** it (it becomes one history entry and can be reverted later) or **discards** it. The AI may propose frame changes (add, move, resize, re-layout blocks) when the scope allows it (global prompt bar, S-22); it never changes frames without review. P1 becomes "the user owns the frame, the AI owns the body, and the AI may *propose* frame changes".
**Consequences.** One proposal model and one review UI serve body generation (S-04), the prompt bar (S-22), AI themes (S-24), logic generation (S-26) and porting (S-27). History (S-15) groups each accepted proposal into one entry.

## D-23 Knowledge base instead of a global prompt
**Context.** A single global prompt field cannot hold what users know about their app: the idea, audience, brand, features, style rules.
**Decision.** Each project has a **knowledge base** of notes written by the user. Every AI task receives the relevant notes as context. One entry is the **style guide**, which takes over the role of the global prompt: editing it marks bodies stale (D-03); editing other notes does not. The **prompt bar** at the top of the Studio is a command (D-22), not a stored setting. A second, hidden knowledge base where the AI keeps its own notes is planned for later (S-23) and will be designed together with the AI work.
**Consequences.** Context assembly in the AI core (S-07) must fit notes into a token budget; retrieval with embeddings is a later option for large knowledge bases.

## D-24 Studio frontend stack
**Context.** The Studio should teach as much of the React ecosystem as possible, but every library needs a real job (P7). The project document needs a serialisable change log for history, proposals and, later, collaboration.
**Decision.** **Redux Toolkit** (react-redux, entity adapter, listener middleware) for the project document, history and proposals; **Zustand** for fast-changing UI state that must not enter history (drag in progress, hover, zoom, panel sizes); **TanStack Query** for server state (Runner now, platform later; no RTK Query); **TanStack Router** for the Studio's own routes; **React Hook Form + Zod** for the schema-driven inspector and forms; **React Flow** for the logic canvas; **dnd-kit**, **TanStack Virtual**, **Motion**, **cmdk**, **Monaco**, web workers via **Comlink**; **XState** optional for the AI turn lifecycle. Styling: **Tailwind v4** for the Studio and for generated bodies, with **our own components** in `packages/ui` built the shadcn way (Radix primitives for hard behaviour, CVA variants, source owned in the repo) and developed in **Storybook**. Each React 19 feature gets a named job (see the Studio part doc). No i18n, and no second router or query library for coverage alone.
**Consequences.** Replaces "Zustand stores per domain" in the Studio part. The platform app uses React Router (D-26), so the Studio's router must accept a base path from its host (risk recorded in S-02).

## D-25 Stages and parallel tracks
**Context.** The Studio plan grew (logic canvas, knowledge base, themes, history). Finishing a full Studio MVP before any backend work would delay platform learning by months. Mobile work does not belong in the Studio roadmap.
**Decision.** The Studio is delivered in stages: **alpha** (the smallest Studio the backend can be built against: schema with JSON Schema export, adapter contract, Runner storage and AI proxy, canvas, layers, inspector, one AI task with proposals, undo), **MVP** (the full local loop up to Compact; the minimal logic canvas is optional), **v1** (AI themes, global prompt bar, logic v1, prompt library, Developer panels, snapshots, Claude Code) and **garden** (everything else, picked freely). User stories carry a stage tag. The roadmap runs two tracks: Phase 1 Studio alpha; Phase 2 Studio MVP alongside Platform foundation (P-01…P-04); Phase 3 Studio v1 alongside Platform connected (P-05…P-08, P-16); Phases 4–6 unchanged; Phase 7 the garden, the Mobile part and other later items. Sessions alternate between tracks.
**Consequences.** M-01 leaves Phase 1. Platform foundation starts right after the alpha. Epics can span stages; an epic is "alpha-done" when its alpha stories are done.

## D-26 Platform app: React Router v7 with server rendering and a BFF
**Context.** The Studio is a pure single-page app, so server-side React had no home in the project. Keeping OAuth tokens in the browser is no longer the recommended practice for browser apps (IETF *OAuth 2.0 for Browser-Based Apps*).
**Decision.** `apps/platform` uses **React Router v7 in framework mode** with server rendering (loaders, actions, streaming). Its Node server acts as a **backend-for-frontend (BFF)**: it runs the OIDC login with Identity as a confidential client, keeps the tokens server-side and gives the browser only an httpOnly session cookie; browser calls to the platform API and SignalR go through the same origin. Data access uses a typed client generated from the services' OpenAPI documents. Where exactly the token is attached (the platform app server, or YARP acting as the BFF) is decided when P-02, P-03 and P-08 are planned.
**Consequences.** The platform app runs as a Node service (Aspire locally, a container in Kubernetes) instead of on Static Web Apps; Static Web Apps keeps only the landing page. P-03's login flow becomes a server-side Authorization Code + PKCE flow. New epic P-16 for the Studio's platform adapters.

## D-27 Canvas viewports and zoom
**Context.** The owner wants to check layouts at device sizes from phone to 4K, as in browser devtools.
**Decision.** The canvas renders at the real viewport width (presets: phone, tablet, laptop, Full HD, 2K, 4K, plus a custom drag width) and scales with zoom; sizes larger than the user's screen are reached by zooming out. Studio panels dock on large screens and collapse to overlays on small ones. Viewports are preview sizes, not breakpoints: which breakpoint's overrides apply is derived from the viewport width.
**Consequences.** The schema keeps two breakpoints (D-12); more breakpoints and override editing arrive with the Mobile part. Viewport and zoom live in the URL so a view can be shared and restored (S-03).

## D-28 Starter canvas
**Context.** The owner wants an empty canvas to open with randomly generated blocks of random sizes in random places, different every time, in a random, mostly pastel palette, each empty except for a prompt input in its centre. Free positions would break D-01 (no coordinates; responsive, clean export).
**Decision.** New (and empty) pages open with a **random starter layout** produced by a seeded generator in `packages/core`: a valid flex/grid block tree with random section counts, splits and size ratios, so blocks look randomly sized and placed while staying real layout. Empty blocks get an editor-only **scaffold colour** from a palette picked at random per shuffle (mostly pastel), and show a centred prompt input. Shuffle regenerates layout or colours; blocks with a prompt or body are kept. Users can also start empty or copy a page.
**Consequences.** New epic S-31 (alpha, MVP). Blocks carry Studio-only `editor` metadata (S-01). The generator must always pass validation; free positioning stays an explicit opt-in (D-01).

## D-29 Block frames and border buttons
**Context.** The owner wants blocks drawn with borders and rounded corners, management buttons on the border, and the border to remain after content is generated.
**Decision.** Each block on the design canvas is shown inside a **block frame**: Studio chrome drawn above the iframe (rounded border in the scaffold colour, a few buttons sitting on the border: generate, add, duplicate, delete, more). The frame replaces the floating block toolbar. After a body is generated, its own styling shows inside and the border stays; a "Show frames" toggle hides all frames to judge the clean result. Frames are never part of the body, the run preview or Compact output.
**Consequences.** S-03 owns frames and border buttons; S-04's prompt input lives in the centre of empty blocks and its proposal controls on the border. Frames must stay readable but light so the user's design still reads (D-30).

## D-30 Left panel, layers and Studio look
**Context.** "Layers" was meant as Photoshop-style layers, a later feature; the tree panel had been named Layers after Figma. The owner wants the left panel to show the component hierarchy under a different name, plus the project's folder structure, and a more minimal, light Studio with pastel lime.
**Decision.** The left panel has two views: **Structure** (the page's component hierarchy, S-18) and **Files** (pages as route folders, components, assets, themes, knowledge; generated files in Developer mode; S-32). **Photoshop-style layers** (stacking, visibility, opacity, blending of overlapping elements) are a separate tool in S-30 (garden). The Studio's visual direction is **minimal and light**: warm paper-like neutrals, one pastel lime accent, chrome that appears on hover, the inspector only with a selection; a dark Studio theme comes later.
**Consequences.** S-18 is renamed "Structure panel & layout editing"; new epic S-32 (MVP); S-14 starts light-only and adds dark in v1. Supersedes the earlier "dense pro-tool, light and dark" direction in the Studio part.

## Superseded ideas from IDEA.md
- Claude Code subscription as an AI provider → D-05.
- Free positioning of divs → D-01.
- Cloud edition in Phase 3 with Container Apps → D-06, D-09.
- "Cloud edition" / "Local edition" as two products → replaced by **modes** (Local, Connected, Cloud) of one Studio.
