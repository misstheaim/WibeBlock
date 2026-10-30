# Development

Technologies, repository layout, local setup and workflow. The *why* behind the choices is in [plan/decisions.md](plan/decisions.md); the *what* and *when* is in [plan/00-master.md](plan/00-master.md). Like the plan, this file changes as the project evolves. Each technology below is marked with the phase it arrives in.

## Technologies

### Frontend and shared TypeScript (Phase 1–3)

Each library has one job in the Studio (D-24); the full map with first epics is in [the Studio part](plan/parts/studio/studio.md) §6.

| Technology | Used for |
|---|---|
| **TypeScript**, **React 19**, **Vite** | The Studio package (`packages/studio`) and its React hosts (`apps/studio`, `apps/platform`), React Compiler enabled |
| **pnpm workspaces** with a version catalog (+ Turborepo if builds get slow) | Monorepo; shared versions of React, its types and TypeScript live in the catalog |
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
| **React Router v8** (framework mode) | Platform app: server rendering, loaders/actions, BFF (D-26, D-34, D-36) |
| **openid-client** (or similar) | OIDC client in the platform app's BFF (P-18) |
| **MSW** (Mock Service Worker) + a mock OIDC server (`mock-oauth2-server`, Docker) | Backend mocks while the platform frontend is built first (D-33) |
| **orval** or **openapi-typescript** + **@microsoft/signalr** | Typed platform API client generated from the Core API's OpenAPI; realtime in the platform adapters |
| **Astro** | Static landing page (`apps/website`, P-20) |
| **dnd-kit** | Drag-and-drop in the layout editor |
| **Radix UI** primitives, **CVA**, **Lucide** icons | Studio design system (`packages/ui`), own components built the shadcn way |
| **Tailwind CSS v4** (+ `@tailwindcss/browser` in the canvas iframe) | Styling of the Studio *and* of generated bodies; theme tokens as CSS variables via `@theme` |
| **Monaco editor** | Developer-mode code panel |
| **React Router** | Routing in the generated React projects |
| **Prettier** | Deterministic formatting of codegen output |
| **Vercel AI SDK** (`ai` + provider packages, UI hooks) | AI tasks over Anthropic, OpenAI, Google and Ollama (`packages/ai`); streamed structured output in the Studio |
| **Model Context Protocol** (TypeScript SDK) | MCP server in the Runner for the Claude Code connection |
| **Node.js** (LTS) | Node Runner (`apps/runner`), Export service (`apps/export`) |
| **Sandpack / esbuild-wasm** | Preview without a Runner: platform app and browser-only mode (Phase 3, 7) |
| **VS Code Extension API** | VS Code host (Phase 7) |
| **Expo / React Native**, **NativeWind**, **Expo Router** | Mobile companion app and native target (Phase 7) |

### Backend (Phase 2–4)

| Technology | Used for |
|---|---|
| **.NET 10**, **ASP.NET Core** (minimal APIs) | All .NET services |
| **.NET Aspire** | Local orchestration of services and containers, OpenTelemetry dashboard |
| **EF Core** + **PostgreSQL** (JSONB) | Store of record; one `DbContext` per module |
| **ASP.NET Core Identity** + **OpenIddict** + **Razor Pages** | Identity service: OIDC server, PKCE, external logins (GitHub, then Google), login and account-security pages |
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

The repo root is the pnpm workspace (D-32). Folders are created only when the epic that needs them starts; today `apps/studio`, `packages/studio` and `apps/platform` (scaffolded early, D-36) exist.

```
package.json         workspace root: scripts, pinned pnpm (packageManager)
pnpm-workspace.yaml  workspace globs (apps/*, packages/*) and the version catalog
tsconfig.base.json   shared compiler options; every TS project extends it
.nvmrc               Node LTS version
apps/studio          Local host for the Studio (@wibeblock/studio-app), started by pnpm dev or pnpm dev:studio
apps/platform        Platform host (@wibeblock/platform-app, React Router v8, server rendering + BFF): login, dashboard, account pages, editor route
apps/website         Astro landing page (P-20)
apps/runner          Node Runner: files, preview, AI, MCP server, Compact
apps/export          Export service (Node, gRPC): server-side codegen, zip, GitHub push
apps/vscode-ext      VS Code extension
apps/claude-plugin   Claude Code plugin: skills + MCP config
apps/mobile          Expo companion app
packages/studio      The editor as a React package (@wibeblock/studio): adapters + slots, no login
packages/core        project schema, validation, migrations, codegen + targets
packages/prompts     skills and predefined prompts (data, versioned)
packages/ai          provider abstraction, prompt assembly, fake provider
packages/ui          Shared UI kit (P-17, extended by S-14 for the Studio)
contracts/           language-neutral contracts shared by TypeScript and .NET
  json-schema/       project schema export (S-01), body validation rules, event payloads
  proto/             gRPC service definitions
  fixtures/          sample projects and messages both sides test against
backend/             .NET only: WibeBlock.slnx, src/ (AppHost, ServiceDefaults, Gateway, Identity, CoreApi, AiGeneration, Shared.Contracts, Functions), tests/
infra/               Terraform, Helm charts, GitHub Actions release workflows
docs/                plan and this file
```

### Workspace conventions

- **Internal packages are source-only.** `packages/*` ship no build step: `exports` points at `./src/index.ts` and the host's bundler (Vite) compiles them. A package gets a build only if something outside the workspace has to consume it.
- **Package names** use the `@wibeblock/` scope: `@wibeblock/studio` (the package), `@wibeblock/studio-app` (its local host), `@wibeblock/platform-app` (the platform app).
- **Linking:** apps depend on packages with `workspace:*`.
- **Shared versions** go in the `catalog:` of `pnpm-workspace.yaml` (React, React DOM, their types, TypeScript, Vite, `@types/node`) and are referenced as `"catalog:"`. A dependency moves into the catalog as soon as a second package uses it. Libraries such as `packages/studio` take React as a **peer dependency**, so only one React is ever loaded.
- **TypeScript** projects extend `tsconfig.base.json` (`apps/studio/tsconfig.app.json`, `apps/platform/tsconfig.json`, `packages/studio/tsconfig.json`).
- **Root scripts** run across the workspace: `pnpm build` and `pnpm lint` are recursive (`pnpm -r`, in dependency order; packages without the script are skipped); `pnpm dev` starts every app in parallel (`pnpm -r --parallel dev`); `pnpm dev:studio` and `pnpm dev:platform` start one app (`pnpm --filter`). The platform app's type check is `pnpm --filter @wibeblock/platform-app typecheck`, because `react-router build` does not type-check.
- **TypeScript 6.x** is pinned in the catalog because typescript-eslint does not support TypeScript 7 yet. Move to 7 when it does.

## Running locally

_Fill in as each piece exists._

- **Prerequisites:** Node LTS (version in `.nvmrc`) and pnpm (`npm install -g pnpm`; the exact pnpm version is pinned in the root `package.json` and fetched automatically).
- **Everything (now):** from the repo root, `pnpm install`, then `pnpm dev` starts the Studio and the platform app side by side (each prints its own `localhost` URL; the second one moves to the next free port). `pnpm build` and `pnpm lint` run the same way for the whole workspace.
- **One app:** `pnpm dev:studio` (only the local Studio, no accounts) or `pnpm dev:platform`.
- **Studio + Runner (Phase 1, Studio alpha):** the Runner joins `pnpm dev` and `pnpm dev:studio`.
- **Platform frontend (Phase 0):** `pnpm dev:platform` (and later `apps/website`), against mocks: MSW in the server process and the mock login server in Docker (D-33).
- **Platform with backend (Phase 0 onwards):** run the Aspire AppHost in `backend/` (starts the services, containers and the platform app); needs Docker Desktop.
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
| **xUnit** + **Testcontainers** | .NET units and integration tests against real Postgres / Redis / RabbitMQ | P-19 (Accounts module) or P-01, P-04 |
| **Playwright** | Studio end-to-end: create a block, generate, preview | S-29 |
| **k6**, **NBomber** | Load tests with the fake AI provider | L-04 |

- Places where tests are most valuable: codegen golden files (`packages/core`), the body validator and sanitiser, schema migrations, local vs platform generation parity, Core API module-boundary architecture tests, integration tests with Testcontainers.
- Learning a testing tool can be the goal of a ticket in its own right.

## Workflow

Git flow with squash-merged features and merge-committed releases (D-31).

### Branches

| Branch | Role |
|---|---|
| `develop` | Integration branch and the **GitHub default branch**. All feature work lands here. |
| `master` | Released code only. Every commit on it is a release and carries a version tag. |
| `feature/…`, `fix/…`, `refactor/…`, `docs/…`, `chore/…` | Short-lived work branches from `origin/develop`. |
| `release/<version>` | Prepares a release from `develop`. |
| `hotfix/<desc>` | Urgent fix for released code, from `master`. |

### Day-to-day work

1. `git fetch origin develop` and `git switch -c feature/42-short-name origin/develop`.
2. Commit, push, open a PR into `develop`.
3. **Squash merge**, so each ticket becomes one commit on `develop`.

### Releases

1. Create `release/<version>` from `develop` (e.g. `release/0.1.0`); only release fixes, version bumps and notes go on it.
2. PR `release/<version>` into `master`, merged with a **merge commit**.
3. Tag the merge commit on `master` as `v<version>` (e.g. `v0.1.0`) and push the tag; the release workflow runs from the tag.
4. Merge `master` back into `develop` with a **merge commit**, so the release fixes reach `develop`.

**Hotfixes** follow the same path: `hotfix/<desc>` from `master` → PR into `master` (merge commit) → patch tag (e.g. `v0.1.1`) → merge `master` back into `develop`.

Never squash or rebase `release/*` → `master` or `master` → `develop`: that rewrites the commits both branches share, and the next merge between them conflicts. The repository settings must therefore allow **both squash merges and merge commits** (rebase merges can stay off).

### Versions

Milestones map to versions:

| Milestone | Version |
|---|---|
| Platform skeleton | `0.1.0` |
| Studio alpha | `0.2.0` |
| Studio MVP | `0.3.0` |
| v1 | `1.0.0` |

Between milestones, minor releases and patches are cut when something is worth releasing.

### Tickets and naming

- Tickets are **GitHub issues**. Each one references its epic and user story in the body (e.g. `S-02 / US-1`).
- Names use the **issue number**: branch `feature/42-studio-package`, commits `feat(#42): add studio package`, PR title `#42 Add studio package`, and `Closes #42` in the PR description.
- `Closes #42` closes the issue only when the PR merges into the default branch, which is why `develop` is the default.
- Commits follow Conventional Commits (`feat`, `fix`, `refactor`, `docs`, `test`, `chore`, …).

### Other rules

- **No CI on pull requests** (D-13). Check `pnpm build`, `pnpm lint` and the platform app's `typecheck` locally before merging.
- **Release workflows** (GitHub Actions) run on version tags and arrive with the first thing worth releasing.
- **Plan changes** go in the same branch as the work that caused them (see CLAUDE.md, "The plan").

### Bootstrap (one-off)

The monorepo setup is committed directly to `master`, without a PR. After that, `develop` is moved to the new `master`, pushed and made the GitHub default branch, and from then on the flow above applies.
