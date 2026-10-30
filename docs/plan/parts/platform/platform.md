# Part — Platform

> Backend services behind the Connected and Cloud modes, and the platform app that hosts the Studio. Phases 0 and 2–6 in the [master plan](../../00-master.md): the project starts with a **platform skeleton** (Phase 0, D-33); the rest of the platform track runs alongside the Studio after its alpha (D-25). Epic IDs `P-nn`.
> **Local first.** Everything here runs on the developer's machine under .NET Aspire + Docker (and a local Kubernetes cluster) with zero cloud cost. Cloud deployment is one late epic (P-13) and is optional.

## 1. Scope

The platform app and its UI kit, accounts and profiles, server-side storage of projects, server-side AI generation with our key, server-side export, plans/billing/metering, notifications, the website, and the infrastructure to run all of it locally and later in Azure.

## 2. Features

| Feature | What it covers | Epics |
|---|---|---|
| [Foundation](foundation/foundation.md) | .NET solution, Aspire, conventions, OpenTelemetry; Terraform cloud deployment with release workflows | P-01, P-13 |
| [Gateway](gateway/gateway.md) | YARP entry point: routing, JWT validation, rate limiting, later SignalR pass-through; not the BFF (D-34) | P-02 |
| [Identity](identity/identity.md) | OpenIddict OIDC server for authentication only: Razor login pages, GitHub login, account security, tokens | P-03 |
| [Core API](core-api/core-api.md) | Modular monolith: Accounts (P-19), Projects, Realtime (SignalR), Billing, Metering, Prompt Library, Notifications | P-04, P-06, P-09, P-10, P-11, P-12 |
| [AI service](ai-service/ai-service.md) | AI Generation service: gRPC streaming, Anthropic SDK, fake provider | P-05 |
| [Export service](export-service/export-service.md) | Node gRPC service running codegen: zip, GitHub push | P-07 |
| [Platform app](platform-app/platform-app.md) | React Router v8 host for the Studio with server rendering and a BFF (D-26, D-34): UI kit, shell, sign-in, profile and account, editor route; the Studio's platform adapters; account extras; Astro landing page | P-17, P-08, P-18, P-19, P-20, P-16, P-14 |
| [Serverless jobs](serverless-jobs/serverless-jobs.md) | Azure Functions: Stripe webhook intake, export cleanup, asset thumbnails | P-15 |

## 3. Platform skeleton (Phase 0)

The first milestone of the whole project (D-33): the platform app with a Studio stub, simple authentication, profile management and a basic UI, then the backend skeleton it talks to. **Frontend first**: everything backend-related is mocked (a mock OIDC server for login, MSW for API data) and replaced when the backend exists, adjusting the frontend where the real API differs.

| Step | Epic (skeleton stories) | Result |
|---|---|---|
| 1 | [P-17](platform-app/epics/P-17-ui-foundation.md) UI foundation | `packages/ui` with light/dark tokens, base components, Storybook |
| 2 | [P-08](platform-app/epics/P-08-platform-app-shell.md) Platform app shell | Server-rendered app: layouts, dashboard placeholder, editor stub, errors, light/dark, mocked backend |
| 3 | [P-18](platform-app/epics/P-18-bff-authentication.md) BFF authentication (US-1…US-5) | Sign in/out through the mock login server; sessions; `/api/*` forwarding |
| 4 | [P-19](platform-app/epics/P-19-profile-and-account.md) Profile & account (US-1…US-4) | Profile, display name, mode preference, account page, against mocks |
| 5 | [P-20](platform-app/epics/P-20-landing-page.md) Landing page | Astro page with "Open WibeBlock" |
| 6 | [P-01](foundation/epics/P-01-backend-foundation.md) Backend foundation | Aspire AppHost, OTel, Core API with the Accounts schema, Postgres, Redis |
| 7 | [P-03](identity/epics/P-03-identity-service.md) Identity service | Razor login, sign-up, reset, GitHub, account security, tokens |
| 8 | [P-02](gateway/epics/P-02-gateway.md) Gateway | Routing, JWT at the edge, rate limits |
| 9 | P-19 US-5, US-6 and P-18 US-6 | Accounts module live, mocks switched off, Identity and Redis sessions: the skeleton runs end to end |

Platform user stories carry stage tags like Studio ones (D-33): `[skeleton]` (Phase 0), `[foundation]` (Phase 2), `[connected]` (Phase 3), `[later]` (Phase 4 and beyond). After the skeleton the Studio alpha follows, and the platform track continues with P-04 in Phase 2.

## 4. Services and data stores

| Service | Runtime | Why separate |
|---|---|---|
| Platform app | Node, React Router v8 | Server rendering and the BFF: sessions and tokens stay on its server (D-26, D-34) |
| Gateway | .NET, YARP | One place for cross-cutting concerns; learn YARP |
| Identity | .NET, ASP.NET Identity + OpenIddict | Different lifecycle and security posture; others only validate JWTs |
| Core API | .NET modular monolith | Product logic together until a split is justified (L-06) |
| AI Generation | .NET, official `Anthropic` NuGet | Long-running, streams, scales differently, isolates the API key |
| Export | Node, `packages/core` | Codegen is TypeScript; polyglot gRPC boundary |
| Functions | Azure Functions, .NET isolated worker | Small event jobs that must run while the cluster is stopped (D-18) |

| Store | Used for | Local | Cloud |
|---|---|---|---|
| PostgreSQL | Store of record: identity, projects as JSONB, versions, billing, metering, outbox | Docker | Flexible Server, burstable |
| Redis | Platform app sessions, cache, rate limits, SignalR backplane, locks | Docker | Azure Cache (basic) or in AKS |
| Blob | Assets, export zips | Azurite | Azure Blob |
| Message bus | Async events and work queues (Learning track) | RabbitMQ (Docker; operator in kind) | Azure Service Bus (Standard) |
| Kafka | Event streams for projections and analytics (later upgrade, L-12) | Redpanda / Strimzi in kind | Strimzi in AKS or Event Hubs |
| Neo4j | Design Graph read model (Learning track) | Docker | Aura Free |
| Secrets | | Aspire user secrets | Key Vault |

## 5. Request flows

**Sign-in (D-34):** `browser → platform app (BFF) → redirect to Identity (Razor login, or GitHub) → callback to the platform app → code exchanged for tokens → tokens kept in the server session (Redis) → browser gets an httpOnly session cookie`. Page data: `platform app loader → Gateway (JWT check) → Core API (JWT check) → module`. Browser calls: `browser → platform app /api/* (token attached) → Gateway → service`. In Phase 0 before the backend exists: a mock OIDC server instead of Identity and MSW instead of the Gateway (D-33).

**Interactive generation:** `Studio (in the platform app, through its BFF) → Gateway → Core API (quota, create Generation) → gRPC stream → AI Generation → Claude → tokens stream back → SignalR → Studio; Core API stores body, writes outbox event generation.completed`

**Export:** `Studio → Core API (ExportJob) → gRPC → Export service (codegen, zip → Blob or GitHub push) → status via SignalR → download URL`; a timer Function deletes expired zips (P-15).

**Stripe webhooks:** `Stripe → webhook Function (verify signature) → Service Bus queue → Billing module (idempotent)`. Before P-15: `Stripe → Gateway → Core API`.

**Async:** `outbox → message bus (generation.completed, tokens.used, project.changed, billing.*, export.completed) → Metering, Notifications, Design Graph`. Until the bus exists (L-01), an in-process dispatcher drains the outbox into the same consumer interfaces. Published outbox rows are kept as an event log, so read models can be rebuilt by replay. With the Kafka upgrade (L-12) the event streams move to Kafka topics and Analytics joins; work queues stay on the bus (D-15).

## 6. Running locally and in the cloud

- **Frontend only (Phase 0, steps 1–5):** `pnpm` scripts from the repo root plus the mock login server in Docker; no .NET needed.
- **Aspire AppHost** orchestrates every service (including Node and the platform app's dev server) and the containers; OTel dashboard included. **kind/k3d** with Helm charts for deployment exercises (L-08).
- **Cloud (P-13), cheapest first:** Terraform state + Key Vault + Blob (~€1/mo) → Static Web Apps for the landing page (free; the platform app runs as a Node container, D-26) → PostgreSQL burstable (~€15/mo, stoppable) → AKS free control plane + 1 small node (~€35/mo running, stop when idle) → Service Bus Standard (~€10/mo) / Aura Free → Functions on a consumption plan (free grant covers this load) → Kafka only after L-12. Container Apps is skipped on purpose (D-09).
