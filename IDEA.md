# WibeBlock — Project Idea

> **Status:** first draft of the idea (2026-10-23). **Superseded by [docs/plan/00-master.md](docs/plan/00-master.md) (2026-10-27)**; kept for history. Where they differ, the plan wins (see [docs/plan/decisions.md](docs/plan/decisions.md)).

## 1. Vision

WibeBlock helps developers and non-developers build web applications with AI without handing everything over to the AI.

The user **lays out the UI themselves** from blocks: plain `div`s they can position, size and nest however they like. **Inside each block** they write a prompt describing how the block should look, and the AI writes the styling code for that block. A **global theme** and a **global prompt** keep the whole app consistent. Our **skills and predefined prompts** give the AI the context it needs to generate good code.

When the user is done, they click **Compact**, and WibeBlock generates a normal, standalone **multi-page React project** in a folder they choose. The user owns that code.

- **Target framework now:** React.
- **Later:** Vue and Angular.

## 2. Two editions, one frontend

| | **Local edition** (open source) | **Cloud edition** (hosted web app) |
|---|---|---|
| **How you get it** | Clone the public GitHub repo, configure `.env`, `npm start`, work on `localhost` | Sign up on the public website |
| **Frontend** | WibeBlock React app | The same WibeBlock React app |
| **Backend** | None, or a thin local helper (see §5) | ASP.NET Core backend on Azure |
| **AI access** | User's **Claude Code subscription**, or **their own API key**, or **another AI tool** they connect | **Our Anthropic API key**, billed through subscription plans |
| **Storage** | Local file system | PostgreSQL + Azure Blob Storage |
| **Accounts** | None | Authentication, user data, projects, subscriptions |

- The Claude Code subscription option exists **only in the Local edition**. The Cloud edition always uses an API key.
- The frontend is the same codebase in both editions. Whatever differs (storage, AI provider, auth, export target) sits behind **adapters**, so the UI doesn't care which edition it runs in.
- The frontend may move to its own repo (or git submodule) later. For now everything lives in this repo.

## 3. Core concepts

- **Project:** the user's app being built. It has pages, a global theme, a global prompt and settings.
- **Page:** one route of the generated app. Generated apps are **multi-page**.
- **Block:** any `div` on a page. The user positions, resizes, nests and aligns it with our layout tools. Each block has:
  - its layout (position, size, nesting, responsiveness);
  - a **block prompt** ("how should this block look");
  - the **AI-generated styling** for that block (the AI only styles inside the block; it doesn't control the layout).
- **Global theme:** design tokens (colors, typography, spacing, radii, etc.) that every block uses.
- **Global prompt:** project-wide instructions to the AI ("modern, minimal, dark-first…").
- **Skills and predefined prompts:** our curated library that teaches the AI how WibeBlock projects are structured and how to write the code. This is a core asset and gets versioned.
- **Compact:** generates the final React project into a chosen folder.
- *More concepts to come*: not described yet, to be added during decomposition.

## 4. Main user flows

1. **Create a project:** pick a name, set up the global theme and global prompt.
2. **Build pages:** add pages, then add blocks and arrange them with the layout tools.
3. **Style blocks:** write a prompt in a block → the AI generates its styling → live preview → refine the prompt or regenerate.
4. **Iterate globally:** change the theme or global prompt → affected blocks update.
5. **Compact:** export a standalone multi-page React project to a folder (Local) or as a download / GitHub push (Cloud, to be decided).
6. **Cloud only:** sign up, manage projects, choose a plan, track AI usage.

## 5. Local edition: run options

A plain browser app can't run CLIs or write freely to a folder. So the Local edition offers several ways to run, and the user picks one:

| Option | How it works | Notes |
|---|---|---|
| **Node runner** (chosen default) | `npm start` starts the React app *and* a small local Node server. The server writes files, runs Compact and calls the AI (Claude Code CLI / Agent SDK, or an API key). | Works in any browser. The user still just runs `npm start`. |
| **VS Code extension** | WibeBlock runs in a VS Code webview. The extension host handles files and AI. | Good for developers. Can reuse the user's workspace. |
| **Browser-only** | Uses the browser's File System Access API plus a bring-your-own API key called from the browser. | Chromium only. No Claude Code subscription support. Limited fallback. |

## 6. Cloud edition: server architecture

Start as a **modular monolith** in ASP.NET Core. Each module has clear boundaries, so it can be split into a separate service later as a learning exercise.

| Module | Responsibility |
|---|---|
| **Identity** | Sign-up, login, OAuth (GitHub/Google), roles |
| **Projects** | Projects, pages, blocks, themes, prompts, version snapshots |
| **AI Generation** | Generation jobs, calls to the Claude API, streams results to the UI |
| **Prompt Library** | Versioned skills and predefined prompts, prompt-quality experiments |
| **Billing** | Plans, Stripe subscriptions, webhooks, token quotas |
| **Usage / Metering** | Counts AI tokens per user and enforces plan limits |
| **Export** | Runs Compact on the server; zip download / GitHub push |
| **Notifications** | Emails and in-app notifications |
| *Later:* **Preview hosting**, **Analytics**, **Collaboration** | |

Request flow (rough):
`React app → Gateway (auth, rate limits) → Module API → (queue) → AI Generation worker → Claude API → streamed back via SignalR`

## 7. Initial tech stack

**Frontend (shared)**
- React + TypeScript + Vite (the scaffold is already in `wibeblock/`)
- Block layout and drag-and-drop: `dnd-kit` and/or `react-grid-layout`, or a custom engine
- State: Zustand. Server data: TanStack Query
- Code view: Monaco editor. Live preview in an iframe (Local: Vite dev server; Cloud: Sandpack or esbuild-wasm. Avoid WebContainers because of their commercial licensing)
- Monorepo: pnpm workspaces (+ Turborepo if needed)

**Local helpers**
- Node runner (Node + TypeScript)
- VS Code extension (TypeScript)

**Backend (Cloud)**
- .NET 10 (LTS), ASP.NET Core, EF Core, PostgreSQL
- .NET Aspire for local orchestration and the observability dashboard
- SignalR for streaming generation results
- Redis for caching, rate limiting and the SignalR backplane
- Stripe for billing
- Anthropic API (Claude) for generation

**Azure**
- Azure Container Apps first; AKS later as a learning step
- Azure Database for PostgreSQL, Azure Blob Storage, Azure Cache for Redis, Key Vault
- Entra External ID (or self-hosted ASP.NET Identity / OpenIddict / Keycloak, to be decided)
- Infrastructure as code with Bicep or Terraform; CI/CD with GitHub Actions

## 8. Learning playground

The Cloud edition also serves as a learning project. We deliberately add technologies that are worth learning even if the product doesn't strictly need them. Rules:

- Each technology should have a **real job** in the system, not a demo on the side.
- Add them **after** the core loop works (block → prompt → generated style → Compact), so the product doesn't get stuck behind infrastructure.

Candidate topics and where they fit:

| Topic | Real job in WibeBlock |
|---|---|
| **Kafka** (or Azure Event Hubs with its Kafka API) | Generation-job queue, usage/metering events, analytics stream |
| **High-load simulation** | k6 / NBomber load tests against the generation pipeline using a *fake AI provider* with simulated latency, so tests don't spend tokens |
| **Microservice split** | Extract AI Generation and Billing from the monolith; gRPC between services |
| **YARP gateway** | Single entry point, routing, rate limiting |
| **Outbox pattern, idempotency** | Reliable Stripe webhooks and event publishing |
| **CQRS** | Project read models / dashboards |
| **OpenTelemetry** | Tracing across UI → API → queue → AI, using Grafana stack or Azure Monitor |
| **Kubernetes (AKS)** | Moving from Container Apps to AKS |
| **Chaos testing** | Kill workers or slow the AI provider and check how the system recovers |
| **Real-time collaboration** | SignalR + CRDTs (e.g. Yjs) for multi-user editing, in a later version |
| **Analytics store** | ClickHouse or Azure Data Explorer fed from Kafka |

## 9. Plans (Cloud)

- **Free:** limited projects, bring your own API key, or a small monthly token allowance.
- **Pro:** our API token with a larger quota, more projects, export to GitHub, preview hosting.
- Exact limits and prices come from real token costs; to be decided.

## 10. Rough phases (direction, not a plan)

1. **Local MVP:** blocks + layout tools, block prompts, global theme/prompt, AI styling via one provider, Compact to a React project.
2. **Local polish:** more AI providers (Claude Code subscription, API key, others), VS Code extension, the first version of the skills/prompt library.
3. **Cloud MVP:** modular monolith with Identity, Projects, AI Generation and Export, deployed to Azure.
4. **Cloud product:** Billing, Usage/Metering, Notifications, plans.
5. **Learning track:** Kafka, load testing, observability, service split, AKS, chaos testing…
6. **Later:** Vue and Angular generation, collaboration, preview hosting, analytics.

## 11. Open questions

- What does the project model look like, and how is it saved (one JSON file? one per page?)
- How exactly does the AI's styling inside a block combine with the user's layout (CSS modules, Tailwind, styled-components…)?
- Which layout tools come first (free positioning, flex/grid helpers, snapping, responsive breakpoints)?
- How do the global theme and prompt propagate: regenerate everything, or only on request?
- Compact output: structure of the generated project, routing library, styling approach.
- Local AI via Claude Code subscription: check Anthropic's current terms for third-party tools that use the user's own Claude Code login.
- Which "other AI tools" to support first, and what provider interface they share.
- Identity: managed (Entra External ID) or self-hosted?
- Cloud export: zip, GitHub push, or both?
- Moving the frontend to its own repo / submodule: when and how?
- The "other things not mentioned yet" around the global theme and prompt.

## 12. Out of scope for now

- Vue and Angular generation (React first).
- Real-time collaboration.
- Multi-cloud (Azure only; AWS maybe later as a migration exercise).
