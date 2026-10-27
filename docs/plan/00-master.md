# WibeBlock — Master Plan

> **Status:** v1, 2026-10-27. Supersedes `IDEA.md` wherever they differ. Decisions are recorded in [decisions.md](decisions.md).
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
| **Studio** — editor, AI generation, codegen, local runners | `S-nn` | [parts/studio/studio.md](parts/studio/studio.md) |
| **Mobile** — mobile layout workflow, companion app, native target | `M-nn` | [parts/mobile/mobile.md](parts/mobile/mobile.md) |
| **Platform** — backend services (local first, cloud later) | `P-nn` | [parts/platform/platform.md](parts/platform/platform.md) |
| **Learning track** — platform engineering technologies | `L-nn` | [parts/learning-track/learning-track.md](parts/learning-track/learning-track.md) |

- Epics are written by hand (or with AI pointed at the epic). No automated decomposition. Tickets reference the epic ID and user story (`S-04 / US-3`).
- When something here conflicts with code or a later decision, update this plan; it is the source of truth for scope.

## 1. Vision

WibeBlock lets developers and non-developers build web applications with AI **without handing everything to the AI**. The user owns the structure: pages and a tree of **blocks** laid out with flex/grid tools. The AI owns the inside of each block: from a **block prompt**, it generates the block's **body** (markup + Tailwind styling) within the user's frame. A **global theme** (design tokens) and a **global prompt** keep the app consistent. **Compact** turns the project into a standalone, idiomatic codebase in a target framework (React first; Vue, Angular, React Native later) that the user fully owns.

Two purposes, equally important:

1. **Product:** a polished, beautiful tool that is pleasant for both audiences.
2. **Learning:** the backend is a vehicle to learn modern platform technologies (.NET, gRPC, Kafka, Neo4j, Kubernetes, observability…). Each technology must have a real job in the system, but it does not need to be the "optimal" choice for the product's load.

## 2. Product principles

| # | Principle | Consequence |
|---|---|---|
| P1 | **User owns the Frame, AI owns the Body** | Layout tree, sizing, breakpoints are never modified by AI. AI only generates inside a block. User can edit generated text directly or "eject" a body into child blocks. |
| P2 | **Real layout, not coordinates** | Blocks are flex/grid containers in a tree. Drag-and-drop reorders/reparents; it never sets x/y. Absolute positioning is an explicit opt-in per container for overlays. |
| P3 | **Framework-neutral source** | The project is JSON documents (pages, blocks, theme, prompts). Bodies are stored as HTML + Tailwind fragments. Codegen **targets** (React first) turn the source into a project. |
| P4 | **The user owns the output** | Compact produces a readable, idiomatic project with no runtime dependency on WibeBlock. |
| P5 | **Two audiences, one UI** | Default UI is for everyone. A **Developer mode** toggle reveals code panel, Tailwind classes, file tree, Compact options, provider settings. |
| P6 | **Local-first, platform optional** | MVP runs entirely locally with no backend. Backend services can be started locally at any time (Connected mode) and deployed to the cloud later. The Studio talks to all of this through adapters. |
| P7 | **Every technology has a real job** | Learning-track tech is added only where it does something the system uses. Product first; infrastructure after the core loop works. |
| P8 | **Prompt library is data** | Skills and predefined prompts are versioned markdown/JSON consumed by the TypeScript runner, the .NET services and Claude Code skills. |
| P9 | **Mobile is a first-class view** | Every page has a desktop base and a mobile adaptation the user can inspect and adjust; the data model carries breakpoint overrides from day one. |

## 3. Core concepts

| Concept | Definition |
|---|---|
| **Project** | The app being built: settings, pages, theme, global prompt, selected skills, assets. Stored as a folder of JSON files (local) or as JSONB documents (platform). |
| **Page** | One route of the generated app, with a single root block. |
| **Block** | A node in the page tree. Has a **Frame** and optionally a **Body**. Kinds: *container* (children laid out by flex/grid) and *leaf* (AI body). A container may also have a *surface* body (background, border, padding) generated by AI. |
| **Frame** | User-owned: layout type (flex/grid), direction, gap, alignment, wrap, padding, sizing (fixed / fill / hug), position mode (flow / absolute opt-in), per-breakpoint overrides. |
| **Body** | AI-owned: block prompt + generated HTML/Tailwind fragment (+ metadata: model, skill versions, timestamp, hash of inputs). Can be *stale* when its inputs changed. |
| **Theme** | Design tokens (colour, typography, spacing, radius, shadow, light/dark modes) emitted as CSS variables that Tailwind reads. Changing a token restyles everything without regeneration. |
| **Global prompt** | Project-wide instructions to the AI. Changing it marks bodies stale; the user regenerates selectively. |
| **Skills / predefined prompts** | Versioned library teaching the AI how WibeBlock bodies must be written (constraints, token usage, accessibility, patterns). |
| **Generation** | One AI run for one block (or batch): inputs, provider, streamed output, result. Recorded in the project. |
| **Target** | A codegen plugin producing a framework project (react-vite first). |
| **Compact** | Full codegen for the chosen target into a chosen folder (local) or a zip / GitHub push (platform), plus README and optional install/build check. |
| **Mode** | How the Studio runs: **Local** (Studio + Node Runner, files on disk, BYO key or Claude Code), **Connected** (Studio + platform services running on the developer's machine), **Cloud** (hosted platform). |

## 4. System overview

```
                      ┌─────────────────────── Studio (React, shared in all modes) ───────────────────────┐
                      │ Layout editor · Block prompts · Theme · Preview · Mobile view · Dev mode · Compact │
                      └───────────────┬──────────────────────────────┬────────────────────────────────────┘
                              adapters: storage / ai / auth / export / realtime
              ┌───────────────────────┴──────────┐             ┌─────┴───────────────────────────────────────────┐
   LOCAL MODE │ Node Runner (apps/runner)        │  CONNECTED  │ Platform services (backend/, .NET + Node)        │
              │ · project folder on disk         │  / CLOUD    │ YARP Gateway                                    │
              │ · Vite preview server            │             │ ├ Identity (OpenIddict)                         │
              │ · AI via Vercel AI SDK (BYO key) │             │ ├ Core API (modular monolith: Projects, Prompt   │
              │ · MCP server for Claude Code     │             │ │   Library, Billing, Metering, Notifications;    │
              │ · codegen + Compact              │             │ │   SignalR hub)                                  │
              └──────────────────────────────────┘             │ ├ AI Generation (gRPC streaming, Anthropic SDK)  │
   Also: VS Code extension, browser-only fallback,             │ ├ Export (Node, codegen, zip / GitHub)           │
         mobile companion app (Expo)                           │ └ Kafka → Metering, Notifications, Design Graph  │
                                                               │       (Neo4j read model), Analytics              │
   Shared packages: core (schema+codegen) · prompts · ai · ui  │ Postgres (JSONB) · Redis · Blob · Key Vault      │
                                                               └─────────────────────────────────────────────────┘
   Runs locally under .NET Aspire + Docker (+ kind/k3d for Kubernetes). Deployed later to Azure with Terraform, cheapest services first.
```

Interactive generation is a **gRPC server-stream** (user is waiting for tokens). Everything asynchronous (metering, notifications, projections, batch regeneration) flows through **Kafka** with the outbox pattern.

## 5. Repository layout (target)

```
apps/studio          React + TS + Vite — the editor (current wibeblock/ scaffold moves here)
apps/runner          Node + TS — local server: files, preview, AI, MCP server, Compact
apps/vscode-ext      VS Code extension hosting the Studio in a webview
apps/claude-plugin   Claude Code plugin: skills + MCP config pointing at the runner
apps/mobile          Expo companion app (preview on device, notifications)
packages/core        project schema, validation, migrations, codegen engine + targets
packages/prompts     skills and predefined prompts (markdown + JSON manifests, versioned)
packages/ai          provider abstraction (Vercel AI SDK), prompt assembly, fake provider
packages/ui          Studio design system
backend/             .NET solution: Gateway, Identity, CoreApi, AiGeneration, Export (Node), Aspire AppHost
infra/               Terraform, Kubernetes manifests / Helm, GitHub Actions (release workflows only)
docs/plan            this plan
```

pnpm workspaces (+ Turborepo if builds get slow). Frontend may move to its own repo later; not now.

## 6. Roadmap

| Phase | Goal | Epics |
|---|---|---|
| **1. Studio MVP (local)** | The core loop works: layout → prompt → body → preview → mobile check → Compact to React. No backend. | S-01, S-02, S-03, S-04, S-05, S-06, S-07, S-09, S-13, M-01 (minimal) |
| **2. Studio polish** | Developer mode depth, Claude Code connection, prompt library v1, history, assets, VS Code extension, Studio UI polish. | S-08, S-10, S-11, S-14, S-15, S-16 |
| **3. Platform, locally** | Backend services run on the dev machine under Aspire; Studio Connected mode; local Kubernetes. | P-01 … P-08 |
| **4. Product features** | Accounts, plans, billing (Stripe test mode), metering, notifications, website. All still local. | P-09, P-10, P-11, P-12, P-14 |
| **5. Learning track** | Kafka + outbox, Design Graph (Neo4j), observability, load tests, chaos, service extraction, k8s maturity. | L-01 … L-06, L-08 |
| **6. Cloud deployment** | Terraform to Azure, cheapest first: static hosting + Blob → Postgres → AKS → Kafka. Stop/scale-to-zero by default. | P-13 |
| **7. Later** | Vue/Angular targets, companion app, React Native target, collaboration, preview hosting, analytics store, browser-only mode, AWS exercise. | S-12, S-17, M-02, M-03, L-07, L-09, L-10, L-11 |

Phases 3–6 are optional overlays: Local mode stays fully usable without them.

## 7. Key decisions (summary)

See [decisions.md](decisions.md).

- D-01 Flex/grid block tree, no free coordinates (absolute as opt-in).
- D-02 Frame (user) / Body (AI) split; bodies stored as HTML + Tailwind fragments.
- D-03 Tailwind v4 + CSS-variable tokens; theme changes need no regeneration, global-prompt changes mark bodies stale.
- D-04 Framework-neutral JSON source; codegen targets; React (Vite) first.
- D-05 No Claude-subscription API use (Anthropic ToS). Claude Code connects as a client through WibeBlock's MCP server; BYO API key via Vercel AI SDK.
- D-06 Local-first; platform optional; cloud last, cheapest first.
- D-07 Separate Identity (OpenIddict), AI Generation and Export services; the rest a modular monolith; gRPC for sync streaming, Kafka for async.
- D-08 Postgres (JSONB) is the store of record; Neo4j is a Kafka-fed read model (Design Graph).
- D-09 Kubernetes learned locally (kind/k3d) first; AKS later, no Container Apps step.
- D-10 Terraform for IaC; OpenTelemetry from the first service.
- D-13 No CI on pull requests; GitHub Actions only for releases and deployment.
- D-14 Automated tests are optional, usually written by an AI agent after implementation.
- D-11 Developer mode toggle. D-12 Two breakpoints in the MVP; mobile adaptation is its own workflow (Mobile part).

## 8. Open questions

- Body interactivity: how far do declarative behaviours go (links, toggles, simple state) before Compact must emit real component code? Decide in S-01/S-04.
- Exact theme token set and naming (align with Tailwind v4 `@theme` conventions). Decide in S-05.
- Prompt library evaluation: how do we measure a skill version is better? Decide in S-08.
- Studio UI decisions: see [parts/studio/studio.md §3](parts/studio/studio.md) (being recorded).
- Plans and prices: only after real token costs are known (P-09).
