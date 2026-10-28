# Development

Technologies, repository layout, local setup and workflow. The *why* behind the choices is in [plan/decisions.md](plan/decisions.md); the *what* and *when* is in [plan/00-master.md](plan/00-master.md). Like the plan, this file changes as the project evolves. Each technology below is marked with the phase it arrives in.

## Technologies

### Frontend and shared TypeScript (Phase 1–3)

Each library has one job in the Studio (D-24); the full map with first epics is in [the Studio part](plan/parts/studio/studio.md) §6.

| Technology | Used for |
|---|---|
| **TypeScript**, **React 19**, **Vite** | The Studio package (`packages/studio`) and its React hosts (`apps/studio`, `apps/platform`), React Compiler enabled |
| **pnpm workspaces** (+ Turborepo if builds get slow) | Monorepo |
| **Redux Toolkit** (+ react-redux, entity adapter, listener middleware, Immer patches) | Project document, history, AI proposals |
| **Zustand** | Transient Studio UI state (hover, drag, zoom, panel sizes) |
| **TanStack Query** | Server state: Runner API, later the platform API |
| **TanStack Router** | Studio routes and typed search params |
| **React Hook Form + Zod** | Schema-driven inspector and forms; Zod is also the project schema (`packages/core`) with a JSON Schema export |
| **React Flow (xyflow)** | Logic canvas |
| **TanStack Virtual**, **Motion**, **cmdk** | Large lists, animation, command palette |
| **Comlink** (web workers) | Codegen and validation off the main thread |
| **XState** (optional) | AI turn lifecycle |
| **Storybook** | Workshop and catalogue for `packages/ui` |
| **React Router v7** (framework mode) | Platform app: server rendering, loaders/actions, BFF (D-26) |
| **orval** (or similar) + **@microsoft/signalr** | Typed platform API client from OpenAPI; realtime in the platform adapters |
| **Astro** | Optional static landing page (`apps/website`) |
| **dnd-kit** | Drag-and-drop in the layout editor |
| **Radix UI** primitives, **CVA**, **Lucide** icons | Studio design system (`packages/ui`), own components built the shadcn way |
| **Tailwind CSS v4** (+ `@tailwindcss/browser` in the canvas iframe) | Styling of the Studio *and* of generated bodies; theme tokens as CSS variables via `@theme` |
| **Monaco editor** | Developer-mode code panel |
| **React Router** | Routing in the generated React projects |
| **Prettier** | Deterministic formatting of codegen output |
| **Vercel AI SDK** (`ai` + provider packages, UI hooks) | AI tasks over Anthropic, OpenAI, Google and Ollama (`packages/ai`); streamed structured output in the Studio |
| **Model Context Protocol** (TypeScript SDK) | MCP server in the Runner for the Claude Code connection |
| **Node.js** | Node Runner (`apps/runner`), Export service |
| **Sandpack / esbuild-wasm** | Preview without a Runner: platform app and browser-only mode (Phase 3, 7) |
| **VS Code Extension API** | VS Code host (Phase 7) |
| **Expo / React Native**, **NativeWind**, **Expo Router** | Mobile companion app and native target (Phase 7) |

### Backend (Phase 2–4)

| Technology | Used for |
|---|---|
| **.NET 10**, **ASP.NET Core** (minimal APIs) | All .NET services |
| **.NET Aspire** | Local orchestration of services and containers, OpenTelemetry dashboard |
| **EF Core** + **PostgreSQL** (JSONB) | Store of record; one `DbContext` per module |
| **ASP.NET Core Identity** + **OpenIddict** | Identity service: OIDC server, PKCE, external logins (GitHub, Google) |
| **YARP** | Gateway |
| **gRPC** (`Grpc.AspNetCore`, `@grpc/grpc-js`) | Synchronous service-to-service calls, server-streaming generation |
| **SignalR** + **Redis** backplane | Real-time delivery to the Studio |
| **Redis** | Cache, rate limits, locks |
| **Anthropic** NuGet package (official C# SDK, v10+) | AI Generation service |
| **Polly** | Retries, timeouts, circuit breakers |
| **Stripe** (test mode) | Billing |
| **Azurite**, **Mailpit** | Local stand-ins for Blob Storage and email |
| **OpenTelemetry** | Traces, metrics, logs from the first service |

### Learning track (Phase 5+)

| Technology | Used for |
|---|---|
| **RabbitMQ** (locally, operator in Kubernetes) / **Azure Service Bus** (Cloud) | Message bus: async events, work queues, outbox, idempotent consumers |
| **Kafka** (Redpanda locally, Strimzi in Kubernetes) | Later upgrade for event streams: projections, analytics (Phase 7) |
| **Neo4j** (.NET driver, Cypher) | Design Graph read model |
| **Grafana stack** (Tempo, Loki, Prometheus) | Observability backend |
| **k6**, **NBomber** | Load testing with the fake AI provider |
| **Chaos Mesh** | Chaos experiments |
| **Kubernetes**: kind / k3d, **Helm**, **KEDA**, **Argo CD**, cert-manager | Running and scaling the platform |
| **ClickHouse** | Analytics store (Phase 7) |
| **Yjs** | Real-time collaboration (Phase 7) |
| **Azure Functions** (.NET isolated worker; Core Tools + Azurite locally) | Small event jobs: Stripe webhook intake, export cleanup, asset thumbnails (P-15, D-18) |
| **Go** (optional, D-17) | One small piece; first candidate: the preview-hosting builder or operator (L-10) |

### Cloud and delivery (Phase 6)

| Technology | Used for |
|---|---|
| **Azure**: Blob Storage, Static Web Apps, Key Vault, PostgreSQL Flexible Server, AKS | Hosting, deployed cheapest first |
| **Terraform** | All cloud infrastructure |
| **GitHub Actions** | **Releases and deployment only**: build images, publish, deploy. No CI on pull requests |
| GitHub Container Registry or ACR | Container images |

## Repository layout (target)

```
apps/studio          Local host for the Studio, started by npm start (the current wibeblock/ scaffold moves here)
apps/platform        Platform host (React Router v7, server rendering + BFF): login, dashboard, account pages, editor route
apps/website         Optional Astro landing page
apps/runner          Node Runner: files, preview, AI, MCP server, Compact
apps/vscode-ext      VS Code extension
apps/claude-plugin   Claude Code plugin: skills + MCP config
apps/mobile          Expo companion app
packages/studio      The editor as a React package (adapters + slots, no login)
packages/core        project schema, validation, migrations, codegen + targets
packages/prompts     skills and predefined prompts (data, versioned)
packages/ai          provider abstraction, prompt assembly, fake provider
packages/ui          Studio design system
backend/             .NET solution: AppHost, ServiceDefaults, Gateway, Identity, CoreApi, AiGeneration, Shared.Contracts; Export (Node)
infra/               Terraform, Helm charts, GitHub Actions release workflows
docs/                plan and this file
```

## Running locally

_Fill in as each piece exists._

- **Studio (now):** `cd wibeblock && npm install && npm run dev`.
- **Studio + Runner (Phase 1, Studio alpha):** a single `npm start` from the repo root.
- **Platform (Phase 2+):** `dotnet run` on the Aspire AppHost; needs Docker Desktop.
- **Kubernetes (Phase 5):** kind/k3d cluster scripts in `infra/`.

Secrets: `.env` files (gitignored) for the Studio and Runner, .NET user secrets for the platform. Never commit API keys.

## Testing

Automated tests are **optional** (D-14, D-16). No ticket requires them; acceptance is checked by running the app, a command or a manual step.

- Each epic may have a "Tests (optional)" section listing where tests would pay off. The owner decides per ticket whether to add them.
- Learn by hand, then delegate (D-16): the owner writes the first tests with each toolkit, then usually asks an AI agent for further tests after the implementation is done.

| Toolkit | Used for | First tests by hand in |
|---|---|---|
| **Vitest** | TypeScript units: codegen golden files, validator, sanitiser, schema migrations | S-01 |
| **React Testing Library** | Studio components and hooks | S-19 |
| **xUnit** + **Testcontainers** | .NET units and integration tests against real Postgres / Redis / RabbitMQ | P-01, P-04 |
| **Playwright** | Studio end-to-end: create a block, generate, preview | S-29 |
| **k6**, **NBomber** | Load tests with the fake AI provider | L-04 |

- Places where tests are most valuable: codegen golden files (`packages/core`), the body validator and sanitiser, schema migrations, local vs platform generation parity, Core API module-boundary architecture tests, integration tests with Testcontainers.
- Learning a testing tool can be the goal of a ticket in its own right.

## Workflow

- **Branches:** `master` is the main branch. Work on `feature/…`, `fix/…`, `refactor/…`, `docs/…` or `chore/…` branches created from `origin/master`, with the epic or ticket code in the name when there is one (e.g. `feature/S-18-layers`).
- **Commits:** Conventional Commits, with the ticket as the scope when there is one (e.g. `feat(S-19): add flex inspector`).
- **No CI on pull requests.** Check builds and lint locally before merging.
- **Releases:** tag a version on `master`; a GitHub Actions workflow builds and publishes (and later deploys). Release workflows arrive with the first thing worth releasing.
- **Plan changes** go in the same branch as the work that caused them (see CLAUDE.md, "The plan").
