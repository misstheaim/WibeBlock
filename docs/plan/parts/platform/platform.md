# Part — Platform

> Backend services behind the Connected and Cloud modes. Phases 2–6 in the [master plan](../../00-master.md): the platform track starts right after the Studio alpha and runs alongside the Studio (D-25). Epic IDs `P-nn`.
> **Local first.** Everything here runs on the developer's machine under .NET Aspire + Docker (and a local Kubernetes cluster) with zero cloud cost. Cloud deployment is one late epic (P-13) and is optional.

## 1. Scope

Accounts, server-side storage of projects, server-side AI generation with our key, server-side export, plans/billing/metering, notifications, the website, and the infrastructure to run all of it locally and later in Azure.

## 2. Features

| Feature | What it covers | Epics |
|---|---|---|
| [Foundation](foundation/foundation.md) | .NET solution, Aspire, conventions, OpenTelemetry; Terraform cloud deployment with release workflows | P-01, P-13 |
| [Gateway](gateway/gateway.md) | YARP entry point: routing, JWT validation, rate limiting, SignalR pass-through | P-02 |
| [Identity](identity/identity.md) | OpenIddict OIDC server, external logins, roles, Studio login flow | P-03 |
| [Core API](core-api/core-api.md) | Modular monolith: Projects, Realtime (SignalR), Billing, Metering, Prompt Library, Notifications | P-04, P-06, P-09, P-10, P-11, P-12 |
| [AI service](ai-service/ai-service.md) | AI Generation service: gRPC streaming, Anthropic SDK, fake provider | P-05 |
| [Export service](export-service/export-service.md) | Node gRPC service running codegen: zip, GitHub push | P-07 |
| [Platform app](platform-app/platform-app.md) | React Router v7 host for the Studio with server rendering and a BFF (D-26): login, project dashboard, account pages, editor route; the Studio's platform adapters; optional Astro landing page | P-08, P-16, P-14 |
| [Serverless jobs](serverless-jobs/serverless-jobs.md) | Azure Functions: Stripe webhook intake, export cleanup, asset thumbnails | P-15 |

## 3. Services and data stores

| Service | Runtime | Why separate |
|---|---|---|
| Gateway | .NET, YARP | One place for cross-cutting concerns; learn YARP |
| Identity | .NET, ASP.NET Identity + OpenIddict | Different lifecycle and security posture; others only validate JWTs |
| Core API | .NET modular monolith | Product logic together until a split is justified (L-06) |
| AI Generation | .NET, official `Anthropic` NuGet | Long-running, streams, scales differently, isolates the API key |
| Export | Node, `packages/core` | Codegen is TypeScript; polyglot gRPC boundary |
| Functions | Azure Functions, .NET isolated worker | Small event jobs that must run while the cluster is stopped (D-18) |

| Store | Used for | Local | Cloud |
|---|---|---|---|
| PostgreSQL | Store of record: identity, projects as JSONB, versions, billing, metering, outbox | Docker | Flexible Server, burstable |
| Redis | Cache, rate limits, SignalR backplane, locks | Docker | Azure Cache (basic) or in AKS |
| Blob | Assets, export zips | Azurite | Azure Blob |
| Message bus | Async events and work queues (Learning track) | RabbitMQ (Docker; operator in kind) | Azure Service Bus (Standard) |
| Kafka | Event streams for projections and analytics (later upgrade, L-12) | Redpanda / Strimzi in kind | Strimzi in AKS or Event Hubs |
| Neo4j | Design Graph read model (Learning track) | Docker | Aura Free |
| Secrets | | Aspire user secrets | Key Vault |

## 4. Request flows

**Interactive generation:** `Studio (in the platform app, through its BFF) → Gateway → Core API (quota, create Generation) → gRPC stream → AI Generation → Claude → tokens stream back → SignalR → Studio; Core API stores body, writes outbox event generation.completed`

**Export:** `Studio → Core API (ExportJob) → gRPC → Export service (codegen, zip → Blob or GitHub push) → status via SignalR → download URL`; a timer Function deletes expired zips (P-15).

**Stripe webhooks:** `Stripe → webhook Function (verify signature) → Service Bus queue → Billing module (idempotent)`. Before P-15: `Stripe → Gateway → Core API`.

**Async:** `outbox → message bus (generation.completed, tokens.used, project.changed, billing.*, export.completed) → Metering, Notifications, Design Graph`. Until the bus exists (L-01), an in-process dispatcher drains the outbox into the same consumer interfaces. Published outbox rows are kept as an event log, so read models can be rebuilt by replay. With the Kafka upgrade (L-12) the event streams move to Kafka topics and Analytics joins; work queues stay on the bus (D-15).

## 5. Running locally and in the cloud

- **Aspire AppHost** orchestrates every service (including Node and the platform app's dev server) and the containers; OTel dashboard included. **kind/k3d** with Helm charts for deployment exercises (L-08).
- **Cloud (P-13), cheapest first:** Terraform state + Key Vault + Blob (~€1/mo) → Static Web Apps for the landing page (free; the platform app runs as a Node container, D-26) → PostgreSQL burstable (~€15/mo, stoppable) → AKS free control plane + 1 small node (~€35/mo running, stop when idle) → Service Bus Standard (~€10/mo) / Aura Free → Functions on a consumption plan (free grant covers this load) → Kafka only after L-12. Container Apps is skipped on purpose (D-09).
