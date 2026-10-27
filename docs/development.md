# Development

Technologies, repository layout, local setup and workflow. The *why* behind the choices is in [plan/decisions.md](plan/decisions.md); the *what* and *when* is in [plan/00-master.md](plan/00-master.md). Like the plan, this file changes as the project evolves. Each technology below is marked with the phase it arrives in.

## Technologies

### Frontend and shared TypeScript (Phase 1–2)

| Technology | Used for |
|---|---|
| **TypeScript**, **React 19**, **Vite** | Studio app (`apps/studio`), React Compiler enabled |
| **pnpm workspaces** (+ Turborepo if builds get slow) | Monorepo |
| **Zustand** | Studio state (project document, selection, UI) |
| **TanStack Query** | Platform data in Connected mode (Phase 3) |
| **dnd-kit** | Drag-and-drop in the layout editor |
| **Radix UI** primitives, **Lucide** icons | Studio design system (`packages/ui`) |
| **Tailwind CSS v4** | Styling of the Studio *and* of generated bodies; theme tokens as CSS variables via `@theme` |
| **Monaco editor** | Developer-mode code panel |
| **React Router** | Routing in the generated React projects |
| **Prettier** | Deterministic formatting of codegen output |
| **Vercel AI SDK** (`ai` + provider packages) | One provider interface over Anthropic, OpenAI, Google and Ollama (`packages/ai`) |
| **Model Context Protocol** (TypeScript SDK) | MCP server in the Runner for the Claude Code connection |
| **Node.js** | Node Runner (`apps/runner`), Export service |
| **Sandpack / esbuild-wasm** | Preview without a Runner: browser-only and Cloud modes (Phase 3, 7) |
| **VS Code Extension API** | VS Code host (Phase 2) |
| **Expo / React Native**, **NativeWind**, **Expo Router** | Mobile companion app and native target (Phase 7) |

### Backend (Phase 3–4)

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
| **Kafka** (Redpanda locally, Strimzi in Kubernetes) | Async event backbone, outbox, idempotent consumers |
| **Neo4j** (.NET driver, Cypher) | Design Graph read model |
| **Grafana stack** (Tempo, Loki, Prometheus) | Observability backend |
| **k6**, **NBomber** | Load testing with the fake AI provider |
| **Chaos Mesh** | Chaos experiments |
| **Kubernetes**: kind / k3d, **Helm**, **KEDA**, **Argo CD**, cert-manager | Running and scaling the platform |
| **ClickHouse** | Analytics store (Phase 7) |
| **Yjs** | Real-time collaboration (Phase 7) |

### Cloud and delivery (Phase 6)

| Technology | Used for |
|---|---|
| **Azure**: Blob Storage, Static Web Apps, Key Vault, PostgreSQL Flexible Server, AKS | Hosting, deployed cheapest first |
| **Terraform** | All cloud infrastructure |
| **GitHub Actions** | **Releases and deployment only**: build images, publish, deploy. No CI on pull requests |
| GitHub Container Registry or ACR | Container images |

## Repository layout (target)

```
apps/studio          Studio (the current wibeblock/ scaffold moves here)
apps/runner          Node Runner: files, preview, AI, MCP server, Compact
apps/vscode-ext      VS Code extension
apps/claude-plugin   Claude Code plugin: skills + MCP config
apps/mobile          Expo companion app
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
- **Studio + Runner (Phase 1):** a single `npm start` from the repo root.
- **Platform (Phase 3):** `dotnet run` on the Aspire AppHost; needs Docker Desktop.
- **Kubernetes (Phase 5):** kind/k3d cluster scripts in `infra/`.

Secrets: `.env` files (gitignored) for the Studio and Runner, .NET user secrets for the platform. Never commit API keys.

## Testing

Automated tests are **optional** (D-14). No ticket requires them; acceptance is checked by running the app, a command or a manual step.

- Each epic may have a "Tests (optional)" section listing where tests would pay off. The owner decides per ticket whether to add them, usually by asking an AI agent to write them after the implementation is done.
- Places where tests are most valuable: codegen golden files (`packages/core`), the body validator and sanitiser, schema migrations, local vs platform generation parity, Core API module-boundary architecture tests, integration tests with Testcontainers.
- Tools when tests are added: **Vitest** (TypeScript), **xUnit** + **Testcontainers** (.NET), **Playwright** (Studio end-to-end, later), **k6 / NBomber** (load, L-04).
- Learning a testing tool can be the goal of a ticket in its own right.

## Workflow

- **Branches:** `master` is the main branch. Work on `feature/…`, `fix/…`, `refactor/…`, `docs/…` or `chore/…` branches created from `origin/master`, with the epic or ticket code in the name when there is one (e.g. `feature/S-03-layout-editor`).
- **Commits:** Conventional Commits, with the ticket as the scope when there is one (e.g. `feat(S-03): add flex inspector`).
- **No CI on pull requests.** Check builds and lint locally before merging.
- **Releases:** tag a version on `master`; a GitHub Actions workflow builds and publishes (and later deploys). Release workflows arrive with the first thing worth releasing.
- **Plan changes** go in the same branch as the work that caused them (see CLAUDE.md, "The plan").
