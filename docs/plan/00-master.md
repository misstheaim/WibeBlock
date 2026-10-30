# WibeBlock — Master Plan

> **Status:** v1.2, 2026-10-30 (platform skeleton planned as Phase 0: UI kit, platform app shell, BFF sign-in, profile, landing page, backend skeleton; D-33…D-35). v1.1, 2026-10-28: Studio part planned in detail. Supersedes `IDEA.md` wherever they differ. Decisions are recorded in [decisions.md](decisions.md).
> **Visual map:** https://claude.ai/artifact/CjKkK1RtSsxGyfrNjbRUUM (source: [visual/plan-map.html](visual/plan-map.html); update its DATA block and republish to the same URL when the plan changes).

## How this plan is organised

```
00-master.md                       whole application, high level (this file)
decisions.md                       decision log (D-nn)
epic-template.md                   template for epic files
parts/<part>/<part>.md             a PART: one large area, high level, links to its features
parts/<part>/<feature>/<feature>.md a FEATURE: one subsystem of the part, design notes + links to its epics
parts/<part>/<feature>/epics/<ID>-<name>.md   an EPIC: one deliverable feature, detailed enough to write stories and tickets
```

| Part | Prefix | Folder |
|---|---|---|
| **Studio** — editor, design and logic canvases, AI, codegen, local runner | `S-nn` | [parts/studio/studio.md](parts/studio/studio.md) |
| **Mobile** — mobile layout workflow, companion app, native target | `M-nn` | [parts/mobile/mobile.md](parts/mobile/mobile.md) |
| **Platform** — backend services (local first, cloud later) | `P-nn` | [parts/platform/platform.md](parts/platform/platform.md) |
| **Learning track** — platform engineering technologies | `L-nn` | [parts/learning-track/learning-track.md](parts/learning-track/learning-track.md) |

- Epics are written by hand (or with AI pointed at the epic). No automated decomposition. Tickets reference the epic ID and user story (`S-04 / US-3`).
- When something here conflicts with code or a later decision, update this plan; it is the source of truth for scope.

## 1. Vision

WibeBlock lets developers and non-developers build web applications with AI **without handing everything to the AI**. The user owns the structure: pages and a tree of **blocks** laid out with flex/grid tools. The AI owns the inside of each block: from a **block prompt**, it generates the block's **body** (markup + Tailwind styling) within the user's frame, and every AI change arrives as a **proposal** the user accepts or discards. **Themes** (design tokens) and a **knowledge base** about the app keep it consistent. Behaviour is built on a second canvas, the **logic canvas**, as blueprint-style graphs per framework bound to the blocks. **Compact** turns the project into a standalone, idiomatic codebase in a target framework (React first; Vue, Angular, React Native later) that the user fully owns.

Two purposes, equally important:

1. **Product:** a polished, beautiful tool that is pleasant for both audiences.
2. **Learning:** the backend is a vehicle to learn modern platform technologies (.NET, gRPC, RabbitMQ / Azure Service Bus, Kafka, Neo4j, Kubernetes, observability, testing, a little Go…). Each technology must have a real job in the system, but it does not need to be the "optimal" choice for the product's load.

## 2. Product principles

| # | Principle | Consequence |
|---|---|---|
| P1 | **User owns the Frame, AI owns the Body** | AI generates inside a block. It may *propose* layout changes, but nothing changes without the user accepting it (D-22). User can edit generated text directly or "eject" a body into child blocks. |
| P2 | **Real layout, not coordinates** | Blocks are flex/grid containers in a tree. Drag-and-drop reorders/reparents; it never sets x/y. Absolute positioning is an explicit opt-in per container for overlays. |
| P3 | **Universal source + framework layers** | The project is JSON documents: a universal layer (pages, blocks, themes, knowledge) shared by all targets, plus one layer per framework holding its logic, linked through ports (D-21). Bodies are HTML + Tailwind fragments. Codegen **targets** (React first) turn the source into a project. |
| P4 | **The user owns the output** | Compact produces a readable, idiomatic project with no runtime dependency on WibeBlock. |
| P5 | **Two audiences, one UI** | Default UI is for everyone. A **Developer mode** toggle reveals code panel, Tailwind classes, file tree, Compact options, provider settings. |
| P6 | **Local-first, platform optional** | MVP runs entirely locally with no backend. Backend services can be started locally at any time (Connected mode) and deployed to the cloud later. The Studio talks to all of this through adapters supplied by the host app it runs in (D-19). |
| P7 | **Every technology has a real job** | Learning-track tech is added only where it does something the system uses. Product first; infrastructure after the core loop works. |
| P8 | **Prompt library is data** | Skills and predefined prompts are versioned markdown/JSON consumed by the TypeScript runner, the .NET services and Claude Code skills. |
| P9 | **Mobile is a first-class view** | The data model carries breakpoint overrides from day one and the canvas renders any device width; the mobile adaptation workflow arrives with the Mobile part (Phase 7, D-25). |

## 3. Core concepts

| Concept | Definition |
|---|---|
| **Project** | The app being built: settings, chosen targets, pages, themes, knowledge base, framework layers, history, assets. Stored as a folder of JSON files (local) or as JSONB documents (platform). |
| **Page** | One route of the generated app, with a single root block. |
| **Block** | A node in the page tree. Has a **Frame** and optionally a **Body**. Kinds: *container* (children laid out by flex/grid) and *leaf* (AI body). A container may also have a *surface* body (background, border, padding) generated by AI. |
| **Frame** | User-owned: layout type (flex/grid), direction, gap, alignment, wrap, padding, sizing (fixed / fill / hug), position mode (flow / absolute opt-in), per-breakpoint overrides. |
| **Body** | AI-owned: block prompt + generated HTML/Tailwind fragment (+ metadata: model, skill versions, timestamp, hash of inputs). Can be *stale* when its inputs changed. Marks elements as ports. |
| **Port** | A connection point on a block that logic can drive (text, list, value, visible) or listen to (click, submit, change). Built-in per block or marked in the body (D-21). |
| **Framework layer** | Per-target part of the project: a **logic graph** per page (nodes, edges) and **bindings** from graph pins to ports. React first; Vue/Angular later, ported by AI or by hand. |
| **Proposal** | The result of an AI task: a set of changes shown on the canvas; accepted (one history entry) or discarded (D-22). |
| **Theme** | Design tokens (colour, typography, spacing, radius, shadow, light/dark modes) emitted as CSS variables that Tailwind reads. Several per project from presets, one active. Changing a token restyles everything without regeneration. |
| **Knowledge base** | User notes about the app sent as context to every AI task; its **style guide** entry replaces the old global prompt and marks bodies stale when edited (D-23). |
| **Prompt bar** | A command input at the top of the Studio; runs an AI task on the selection, page or project and returns a proposal. |
| **Design canvas / run preview** | The canvas renders the project data for editing at any viewport (phone to 4K, with zoom); the run preview runs the generated app (D-20, D-27). |
| **Starter canvas** | A new page opens with a random, valid block layout in a pastel palette; each empty block shows a prompt input in its centre (D-28). |
| **Block frame** | Editor chrome around each block: rounded border with management buttons on it; stays after generation, never exported (D-29). |
| **Stage** | Delivery step of a story: Studio alpha → MVP → v1 → garden (D-25); platform skeleton → foundation → connected → later (D-33). |
| **Skills / predefined prompts** | Versioned library teaching the AI how WibeBlock bodies must be written (constraints, token usage, accessibility, patterns). |
| **AI task** | A versioned unit of AI work (generate body, theme from prompt, arrange page, generate logic, port framework) with prompts, context, output schema and model settings; same definitions locally and on the platform. Each run is logged. |
| **Target** | A codegen plugin producing a framework project (react-vite first). |
| **Compact** | Full codegen for the chosen target into a chosen folder (local) or a zip / GitHub push (platform), plus README and optional install/build check. |
| **Mode** | How the Studio runs: **Local** (Studio + Node Runner, files on disk, BYO key or Claude Code), **Connected** (the platform app with the Studio inside + platform services running on the developer's machine), **Cloud** (hosted platform). The mode is chosen by the host app (D-19). |
| **Host** | An app that renders the Studio package and gives it adapters: the local Studio (`apps/studio`), the VS Code extension, the platform app (`apps/platform`). Only the platform app has login and accounts. |

## 4. System overview

```
                      ┌─────────────────────── Studio (React, shared in all modes) ───────────────────────┐
                      │ Design canvas · Structure/Files · Logic · Theme · Knowledge · Preview · Compact     │
                      └───────────────┬──────────────────────────────┬────────────────────────────────────┘
                              adapters: storage / ai / auth / export / realtime
              ┌───────────────────────┴──────────┐             ┌─────┴───────────────────────────────────────────┐
   LOCAL MODE │ Node Runner (apps/runner)        │  CONNECTED  │ Platform services (backend/ .NET + apps/export)  │
              │ · project folder on disk         │  / CLOUD    │ YARP Gateway                                    │
              │ · Vite preview server            │             │ ├ Identity (OpenIddict)                         │
              │ · AI via Vercel AI SDK (BYO key) │             │ ├ Core API (modular monolith: Projects, Prompt   │
              │ · MCP server for Claude Code     │             │ │   Library, Billing, Metering, Notifications;    │
              │ · codegen + Compact              │             │ │   SignalR hub)                                  │
              └──────────────────────────────────┘             │ ├ AI Generation (gRPC streaming, Anthropic SDK)  │
   Also local: VS Code extension, browser-only fallback        │ ├ Export (Node, codegen, zip / GitHub)           │
                                                               │ └ Message bus → Metering, Notifications, Design  │
   All modes: mobile companion app (Expo)                      │     Graph (Neo4j); Kafka later → Analytics       │
   Shared packages: core (schema+codegen) · prompts · ai · ui  │ Postgres (JSONB) · Redis · Blob · Key Vault      │
                                                               └─────────────────────────────────────────────────┘
   Runs locally under .NET Aspire + Docker (+ kind/k3d for Kubernetes). Deployed later to Azure with Terraform, cheapest services first.
```

Interactive generation is a **gRPC server-stream** (user is waiting for tokens). Everything asynchronous (metering, notifications, projections, batch regeneration) flows through a **message bus** (RabbitMQ locally, Azure Service Bus in Cloud) with the outbox pattern; **Kafka** comes later as an upgrade for event streams (D-15).

## 5. Repository layout (target)

```
packages/studio      the editor as a React package: adapters + slots, no login (D-19)
apps/studio          Local host: the Studio + Runner adapters, started by `pnpm dev:studio` (`pnpm dev` starts every app, D-36)
apps/platform        Platform host (React Router v8, server rendering + BFF, D-26): login, dashboard, account pages, editor route
apps/website         Astro landing page (P-20)
apps/runner          Node + TS — local server: files, preview, AI, MCP server, Compact
apps/export          Export service (Node, gRPC): server-side codegen, zip, GitHub push
apps/vscode-ext      VS Code extension hosting the Studio in a webview
apps/claude-plugin   Claude Code plugin: skills + MCP config pointing at the runner
apps/mobile          Expo companion app (preview on device, notifications)
packages/core        project schema, validation, migrations, codegen engine + targets
packages/prompts     skills and predefined prompts (markdown + JSON manifests, versioned)
packages/ai          provider abstraction (Vercel AI SDK), prompt assembly, fake provider
packages/ui          shared UI kit: semantic tokens, light/dark, components (P-17, extended by S-14)
contracts/           language-neutral contracts for TS and .NET: json-schema/, proto/, fixtures/
backend/             .NET only (WibeBlock.slnx): Gateway, Identity, CoreApi, AiGeneration, Aspire AppHost
infra/               Terraform, Kubernetes manifests / Helm, GitHub Actions (release workflows only)
docs/plan            this plan
```

The repo root is the pnpm workspace with a version catalog (+ Turborepo if builds get slow); folders appear when their epic starts (D-32). Branching and releases: `develop` → `master` with tagged versions (D-31, details in [development.md](../development.md)). Frontend may move to its own repo later; not now.

## 6. Roadmap

| Phase | Studio track | Platform track | Epics |
|---|---|---|---|
| **0. Platform skeleton** | — (the Studio is a stub in the platform app) | Frontend first against mocks: UI kit with light/dark, platform app shell, BFF sign-in, profile and account, Astro landing page. Then the backend skeleton: Aspire, Core API with the Accounts module, Identity, Gateway; mocks switched off. | P-17, P-08, P-18, P-19, P-20 · `[skeleton]` stories of P-01, P-03, P-02 |
| **1. Studio alpha** | The smallest Studio the backend can be built against: schema + JSON Schema export, adapters, Runner storage and AI proxy, canvas with viewports and block frames, random starter layouts, Structure panel, inspector, one AI task with proposals, undo. | — | `[alpha]` stories of S-01, S-14, S-02, S-09, S-03, S-18, S-31, S-19, S-15, S-07, S-04, S-05 |
| **2. Studio MVP ∥ Platform foundation** | The full local loop up to Compact: theme studio, knowledge base, history panel, run preview, Compact; minimal logic canvas (optional). | Projects module, real project dashboard, the rest of the foundation (Azurite, module boundaries, Google login). | `[MVP]` stories of the alpha epics + S-32, S-21, S-06, S-13, S-25 · P-04, `[foundation]` stories of P-01, P-03, P-08 |
| **3. Studio v1 ∥ Platform connected** | AI themes, global prompt bar, logic v1, prompt library, Developer panels, snapshots, assets, Claude Code, onboarding. | AI Generation service, realtime, Export service, the real Studio in the platform app, platform adapters, Local import/export. | S-20, S-22, S-08, S-24, S-16, S-26, S-28, S-10, S-29 · P-05, P-06, P-07, P-16, `[connected]` stories of P-02, P-03, P-08 |
| **4. Product features** | — | Account extras (BYO keys, plan and usage, data export), plans, billing (Stripe test mode), metering, notifications, docs and pricing pages. All still local. | P-09, P-10, P-11, P-12, P-14, P-20 US-3 |
| **5. Learning track** | — | Message bus + outbox, Design Graph, observability, load tests, chaos, service extraction, k8s maturity, serverless jobs. | L-01 … L-06, L-08, P-15 |
| **6. Cloud deployment** | — | Terraform to Azure, cheapest first; stop/scale-to-zero by default. | P-13 |
| **7. Later / garden** | Garden: other targets, framework porting, AI knowledge base, VS Code, browser-only, pro tools. | Mobile part, Kafka upgrade, collaboration, preview hosting, analytics store, AWS exercise. | S-17, S-27, S-23, S-11, S-12, S-30, M-01, M-02, M-03, L-07, L-09, L-10, L-11, L-12 |

The project starts with the **platform skeleton** (Phase 0, D-33): the platform app with a Studio stub, simple authentication, profile management and a basic UI, built frontend first against mocks, then the backend skeleton it talks to. Then the Studio alpha. Tracks run in parallel from Phase 2 on, sessions alternating between Studio and platform work (D-25); the rest of the platform track waits for the alpha because it needs what the alpha provides (schema export, adapter contract, AI task definitions).

The platform track is an optional overlay: Local mode stays fully usable without it.

## 7. Key decisions (summary)

See [decisions.md](decisions.md).

- D-01 Flex/grid block tree, no free coordinates (absolute as opt-in).
- D-02 Frame (user) / Body (AI) split; bodies stored as HTML + Tailwind fragments.
- D-03 Tailwind v4 + CSS-variable tokens; theme changes need no regeneration, global-prompt changes mark bodies stale.
- D-04 Framework-neutral JSON source; codegen targets; React (Vite) first.
- D-05 No Claude-subscription API use (Anthropic ToS). Claude Code connects as a client through WibeBlock's MCP server; BYO API key via Vercel AI SDK.
- D-06 Local-first; platform optional; cloud last, cheapest first.
- D-07 Separate Identity (OpenIddict), AI Generation and Export services; the rest a modular monolith; gRPC for sync streaming (async part superseded by D-15).
- D-08 Postgres (JSONB) is the store of record; Neo4j is a read model (Design Graph).
- D-09 Kubernetes learned locally (kind/k3d) first; AKS later, no Container Apps step.
- D-10 Terraform for IaC; OpenTelemetry from the first service.
- D-13 No CI on pull requests; GitHub Actions only for releases and deployment.
- D-14 Automated tests are optional, usually written by an AI agent after implementation (refined by D-16).
- D-15 Message bus first (RabbitMQ locally, Azure Service Bus in Cloud); Kafka later as an upgrade for event streams.
- D-16 Tests stay optional; the owner writes the first tests with each toolkit (Vitest, React Testing Library, xUnit + Testcontainers, Playwright) by hand, then delegates.
- D-17 Go as a small, optional language; first candidate is preview hosting (L-10).
- D-18 Azure Functions for small event-driven jobs (Stripe webhook intake, export cleanup, asset thumbnails) that must run while the cluster is stopped.
- D-19 The Studio is a package rendered by host apps (local, VS Code, platform); login and accounts live only in the React platform app; optional Astro landing page. Angular host via a Web Component is a learning option.
- D-11 Developer mode toggle. D-12 Two breakpoints in the MVP; mobile adaptation is its own workflow (Mobile part).
- D-20 Design canvas renders the project; run preview runs the generated app; parity through a shared frame → CSS mapping.
- D-21 Universal layer + per-framework layers linked by ports; logic as blueprint graphs per framework; flat ID maps.
- D-22 AI changes are proposals (accept / discard); the AI may propose layout changes.
- D-23 Knowledge base with a style guide replaces the global prompt; the prompt bar is a command.
- D-24 Studio stack: Redux Toolkit (document), Zustand (transient UI), TanStack Query + Router, RHF + Zod, React Flow; own components on Tailwind (shadcn approach) with Storybook.
- D-25 Stages alpha → MVP → v1 → garden; Studio and platform tracks in parallel; Mobile in Phase 7.
- D-26 Platform app on React Router framework mode with server rendering and a BFF (v8 since D-36).
- D-27 Canvas viewports (phone → 4K) with zoom-to-fit, separate from breakpoints.
- D-28 Starter canvas: random, seeded, valid flex/grid layouts with pastel scaffold colours.
- D-29 Block frames with border buttons are editor chrome that stays after generation and is never exported.
- D-30 Left panel = Structure + Files; Photoshop-style layers later; minimal light Studio with a pastel lime accent.
- D-31 Git flow: `develop` (default) for squash-merged work, `master` for tagged releases via `release/*` merge commits; alpha `0.1.0`, MVP `0.2.0`, v1 `1.0.0`.
- D-33 Platform skeleton first (Phase 0), frontend first against a mock OIDC server and MSW; versions: skeleton `0.1.0`, Studio alpha `0.2.0`, MVP `0.3.0`, v1 `1.0.0`.
- D-34 Identity for authentication only (Razor Pages, GitHub first); the platform app's server is the BFF; YARP a plain gateway; profiles in a Core API Accounts module.
- D-35 App UI on semantic tokens with light and dark modes chosen by the user; customisable later with the S-05 theme editor.
- D-32 Repo root is the pnpm workspace; Export service in `apps/export`; `contracts/` (JSON Schema, protos, fixtures) shared by TS and .NET; `backend/` is .NET only.
- D-36 Platform app on React Router v8, scaffolded in the monorepo setup; `pnpm dev` starts every app, `pnpm dev:studio` / `pnpm dev:platform` one.

## 8. Open questions

- Exact theme token set and naming (align with Tailwind v4 `@theme` conventions). Colour token names are fixed in P-17 for the app theme and adopted by S-05 (D-35); the remaining groups are decided in S-05.
- Prompt library evaluation: how do we measure a skill version is better? Decide in S-08.
- Studio UI decisions: recorded in [parts/studio/studio.md §4](parts/studio/studio.md).
- Sizes and spacing units in the schema (token steps vs px). Decide in S-01.
- Knowledge base editor: plain markdown vs a rich editor (Lexical / TipTap). Decide in S-21.
- Generated-app libraries for data and forms (plain React vs TanStack Query / a form library). Decide in S-26.
- Two routers in the platform app (React Router host, TanStack Router inside the Studio). Validate with a spike in S-02, before the real Studio replaces the stub in the platform app.
- Code structure inside `packages/studio` (by feature vs by type, file-based vs code-based routes, barrel files). Decide in the first step of S-02.
- Plans and prices: only after real token costs are known (P-09).
- AI engineering techniques beyond plain generation: RAG with embeddings (e.g. pgvector for similar blocks and prompts), LLM evals and GenAI telemetry, Microsoft.Extensions.AI as the .NET provider abstraction, agents that drive WibeBlock's MCP tools. Decide per topic when planning S-07, S-08, P-05 and P-11.
- Later idea, not planned: **deploy from the app**. After checking the preview, the user deploys the site, either to their own hosting (Vercel, Netlify, Static Web Apps; via GitHub push or provider API) or to WibeBlock hosting by promoting a preview build (extending L-10 with promote and rollback). If taken up: a "deploy" adapter per host (D-19), user sites on a separate domain (not under the app's domain), sandboxed build jobs, abuse controls, metering by plan. A Go operator (D-17) could manage hosted sites.
