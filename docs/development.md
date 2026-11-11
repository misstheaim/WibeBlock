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
| **Prettier** (+ `prettier-plugin-tailwindcss`) | Formatting of the repo's own code (format on save) and deterministic formatting of codegen output |
| **ESLint** (`typescript-eslint`, React Hooks rules) | Linting of every TypeScript package and app (`pnpm lint`) |
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
- **Shared versions** go in the `catalog:` of `pnpm-workspace.yaml` (React and its types, TypeScript, Vite, `@types/node`, Tailwind, the React Compiler toolchain, `class-variance-authority` / `clsx` / `tailwind-merge`) and are referenced as `"catalog:"`. A dependency goes into the catalog as soon as we know a second package will use it, not only once it does; the catalog is kept alphabetical. Libraries such as `packages/studio` take React as a **peer dependency**, so only one React is ever loaded.
- **TypeScript** projects extend `tsconfig.base.json` (`apps/studio/tsconfig.app.json`, `apps/platform/tsconfig.json`, `packages/studio/tsconfig.json`).
- **Root scripts** run across the workspace: `pnpm build` is recursive (`pnpm -r`, in dependency order; packages without the script are skipped); `pnpm lint` (`eslint .`) and `pnpm format` / `pnpm format:check` (Prettier) run once from the root over every app and package; `pnpm dev` starts every app in parallel (`pnpm -r --parallel dev`); `pnpm dev:studio` and `pnpm dev:platform` start one app (`pnpm --filter`). The platform app's type check is `pnpm --filter @wibeblock/platform-app typecheck`, because `react-router build` does not type-check.
- **TypeScript 6.x** is pinned in the catalog because typescript-eslint does not support TypeScript 7 yet. Move to 7 when it does.

### Formatting, linting and editor

- **Indentation and line endings** come from [.editorconfig](../.editorconfig) (2 spaces, LF). Prettier reads it, so the two never disagree.
- **Prettier** formats all JS/TS/CSS/JSON. `prettier-plugin-tailwindcss` sorts Tailwind classes. ESLint's style rules stay off, so the two tools don't fight: Prettier decides how code looks, ESLint reports likely bugs.
- **ESLint** has one flat config at the root ([eslint.config.js](../eslint.config.js)) for every app and package; packages have no ESLint config or `lint` script of their own. Rule sets: `@eslint/js` and `typescript-eslint` recommended, React Hooks (including the React Compiler checks) and React Refresh; `eslint-config-prettier` comes last. React Router route modules may export `meta`, `links`, `loader` and the other framework exports next to the component. Correctness rules are errors; hot-reload hints (`react-refresh/only-export-components`) are warnings, which don't fail `pnpm lint`. Flat config doesn't read `.gitignore`, so build output is ignored in the config itself. If a package ever needs its own lint run, move the config into a shared `packages/eslint-config` package.
- **VS Code:** recommended extensions are Prettier, ESLint, Tailwind CSS IntelliSense and EditorConfig. Turn on *Format On Save* with Prettier as the default formatter. Associate `*.css` with the `tailwindcss` language mode (`"files.associations"` in your user settings). Otherwise the built-in CSS checker warns about `@source`, `@apply` and `@theme`. `.vscode/*` is git-ignored except `extensions.json`, so these are personal settings; shared recommendations go in `.vscode/extensions.json`.

### `packages/ui` structure (P-17)

- **One folder per component** in `src/components/<name>/` (kebab-case folder): the component in `PascalCase.tsx` (e.g. `Button.tsx`), its CVA variants in their own `camelCase.ts` file (e.g. `buttonVariants.ts`, because a file that exports a component should export only components, or hot reload falls back to a full page reload), its stories next to it (`Button.stories.tsx`), and an `index.ts` that re-exports the public parts. Sub-parts of compound components (dropdown menu, form field) live in the same folder.
- **Shared code** outside components: `src/lib/` (helpers such as the class-merging `cn`), `src/styles/` (tokens and the Tailwind mapping).
- **Public API:** `src/index.ts` re-exports each component folder with `export *`; each component's `index.ts` lists its public parts by name (values with `export { }`, types with `type`, as `verbatimModuleSyntax` requires), so internal exports don't leak. The package exposes `.` (components) and `./styles.css` (the stylesheet, imported once by each app). Apps never import deep paths.
- **Component API:** a component accepts every native prop of its element plus its variants (`ComponentProps<"button"> & VariantProps<typeof buttonVariants>`), spreads the rest onto the element, merges `className` last with `cn` so the app's classes win, and sets safe native defaults before the spread (`type="button"`). The CVA function is exported too, so other elements can take the same look.
- **Styles in an app:** the app's stylesheet imports `tailwindcss` first, then `@wibeblock/ui/styles.css`; the kit's `@source` makes Tailwind scan the kit's sources. Page colours use tokens (`bg-background text-foreground`), never `dark:` (D-38).

### `apps/platform` structure (P-08)

- **Routes are declared in [app/routes.ts](../apps/platform/app/routes.ts)** with `index()`, `route()` and later `layout()` / `prefix()`, not with file-system routing: the whole route map is readable in one file, URLs don't depend on file names, and the nested layouts (public, signed-in, full-screen editor) are explicit.
- **Route modules are thin**, one file per route in `app/routes/` (kebab-case, e.g. `dev-tokens.tsx`): `meta`, `loader`, `action` and a small page component that composes features. No business logic or large UI in them.
- **Layout routes** live in `app/layouts/` (e.g. `signed-in.tsx`), apart from the pages, and are declared with `layout()` in `routes.ts`. A layout owns the page frame (full height, background, the single `<main>` landmark, the top bar) and renders the page through `<Outlet />`; pages render only their content.
- **Features** live in `app/features/<name>/` (components, hooks, their server code), created when a route grows beyond a few elements or two routes share UI. **App-wide helpers** go in `app/lib/`.
- **Server-only code** (API client, session, mocks) uses the `.server.ts` suffix (or a `.server/` folder). React Router refuses to bundle these into the browser build, so secrets and tokens can't leak.
- **React Compiler** runs through `@rolldown/plugin-babel` with `reactCompilerPreset()` from `@vitejs/plugin-react` (the same as `apps/studio`, without the `react()` plugin, which `reactRouter()` replaces). The preset compiles only the client build.
- **Dev-only pages** live under `/dev/*` (today `/dev/tokens`, the token showcase with a temporary mode toggle; removed when Storybook arrives, P-17 US-5).

### Platform API settings and mocked backend (P-08 US-2, D-33)

Until the backend exists, MSW answers the platform app's server-side calls to the API. The browser never calls the API directly; loaders and actions do, through the server-only API client.

- **Settings** come from the `.env` files in `apps/platform` (copy [.env.example](../apps/platform/.env.example) to `.env`); variables set in the shell win. The mocks read them with Vite's `loadEnv`; how the app's own server code reads `API_BASE_URL` is decided with the API client.

  | Variable | Meaning |
  |---|---|
  | `API_BASE_URL` | Base URL of the API, later the Gateway (P-02), e.g. `http://localhost:5100` (the port is a placeholder until P-02 picks one) |
  | `API_MOCKS` | `on` answers requests to `API_BASE_URL` with MSW, in development only; anything else is off |
  | `API_MOCK_SCENARIO` | `normal` (default, 100–300 ms delay), `slow` (about 3 s), `error` (500), `unauthorized` (401) |

- **How it starts:** a dev-only Vite plugin, `apiMocks()` in [app/mocks/index.server.ts](../apps/platform/app/mocks/index.server.ts), registered in `vite.config.ts`. It starts MSW in the dev server's process when `API_MOCKS=on`; no app module imports the mocks, so MSW never reaches `build/`. Editing a mock file restarts the dev server and swaps the handlers in place (one interceptor per process). The log shows `[mocks] API mocks on for <url>, scenario: <name>`.
- **Files** in [app/mocks/](../apps/platform/app/mocks/), all `.server.ts` and imported with the extension (Vite's native config loader needs it): `index` (the plugin), `handlers` (one entry per endpoint), `scenarios` (delay, errors, `problem()`), `fixtures` (data and hand-written types).
- **Adding an endpoint:** add `http.<method>(\`${baseUrl}/<path>\`, mock(() => ...))` in `handlers.server.ts`; wrapping the resolver in `mock(...)` applies the scenario. A call to `API_BASE_URL` without a handler prints an `[MSW] Error` and then fails on the network.
- **Errors** are RFC 9457 problem details (`application/problem+json`, `{ type, title, status, detail }`), the shape ASP.NET Core returns.
- **Endpoints** (Gateway paths: the Core API's Accounts module lives under `/accounts`):

  | Endpoint | Response |
  |---|---|
  | `GET /accounts/me` | `200` `{ id, displayName, email, avatarUrl: string \| null, preferences: { theme: "light" \| "dark" \| "system" }, createdAt, updatedAt }` (ISO 8601 dates) |

- The mock types are hand-written and small on purpose; P-19 US-6 replaces them with types generated from the Core API's OpenAPI document and switches the mocks off.

## Running locally

_Fill in as each piece exists._

- **Prerequisites:** Node LTS (version in `.nvmrc`) and pnpm (`npm install -g pnpm`; the exact pnpm version is pinned in the root `package.json` and fetched automatically).
- **Everything (now):** from the repo root, `pnpm install`, then `pnpm dev` starts the Studio and the platform app side by side (each prints its own `localhost` URL; the second one moves to the next free port). `pnpm build` and `pnpm lint` run the same way for the whole workspace.
- **One app:** `pnpm dev:studio` (only the local Studio, no accounts) or `pnpm dev:platform`.
- **Studio + Runner (Phase 1, Studio alpha):** the Runner joins `pnpm dev` and `pnpm dev:studio`.
- **Platform frontend (Phase 0):** `pnpm dev:platform` (and later `apps/website`), against mocks: MSW in the server process (copy `apps/platform/.env.example` to `.env` once; see "Platform API settings and mocked backend") and the mock login server in Docker (D-33).
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

**Protection:** two GitHub rulesets, `develop` and `master`, one per branch. Neither branch can be deleted or force-pushed, and changes reach them only through a pull request (0 required approvals, since a solo owner can't approve their own PR). `develop` allows squash (features) and merge commit (`master` → `develop` after a release, also a PR). `master` allows **merge commit only**, so a release or hotfix PR can't be squashed by mistake. There are no required status checks (no PR CI). **Repository admins bypass both rulesets (mode: always):** in an emergency the owner can commit on the local branch and push directly; GitHub records it as a bypass.

### Day-to-day work

1. `git fetch origin develop` and `git switch -c feature/42-short-name origin/develop`.
2. Commit, push, open a PR into `develop`.
3. **Squash merge**, so each ticket becomes one commit on `develop`.

### Releases

1. Create `release/<version>` from `develop` (e.g. `release/0.1.0`); only release fixes, version bumps and notes go on it.
2. PR `release/<version>` into `master`, merged with a **merge commit**.
3. Tag the merge commit on `master` as `v<version>` (e.g. `v0.1.0`) and push the tag; the release workflow runs from the tag.
4. Merge `master` back into `develop` with a **merge commit**, so the release fixes reach `develop`. Because of the ruleset this is a PR from `master` into `develop`, merged with **Create a merge commit**.

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
- **Every implementation starts from a ticket.** If none exists when work begins, the agent writes and creates it (also in `/guide-me` and `/teach-me`) without asking for approval.
- **One template for every ticket type** (feature, bug, chore, docs): [.github/ISSUE_TEMPLATE/ticket.md](../.github/ISSUE_TEMPLATE/ticket.md), also offered by GitHub's "New issue" page. Sections: Context, Goal, Implementation notes, Acceptance criteria (`AC1`…), Related, Suggested model.
- Names use the **issue number**: branch `feature/42-studio-package`, commits `feat(#42): add studio package`, PR title `#42 Add studio package`, and `Closes #42` in the PR description.
- `Closes #42` closes the issue only when the PR merges into the default branch, which is why `develop` is the default.
- Commits follow Conventional Commits (`feat`, `fix`, `refactor`, `docs`, `test`, `chore`, …).

### Other rules

- **No CI on pull requests** (D-13). Check `pnpm build`, `pnpm lint` and the platform app's `typecheck` locally before merging.
- **Release workflows** (GitHub Actions) run on version tags and arrive with the first thing worth releasing.
- **Plan changes** go in the same branch as the work that caused them (see CLAUDE.md, "The plan").

### Bootstrap (one-off)

The monorepo setup is committed directly to `master`, without a PR. After that, `develop` is moved to the new `master`, pushed and made the GitHub default branch, and from then on the flow above applies.
