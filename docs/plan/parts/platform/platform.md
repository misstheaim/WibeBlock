# Part — Platform

> Backend services behind the Connected and Cloud modes. Phases 3, 4 and 6 in the [master plan](../../00-master.md). Epic IDs `P-nn`.
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
| [Connected mode](connected-mode/connected-mode.md) | Studio adapters for the platform, dashboard, upload/download; website & account pages | P-08, P-14 |

## 3. Services and data stores

| Service | Runtime | Why separate |
|---|---|---|
| Gateway | .NET, YARP | One place for cross-cutting concerns; learn YARP |
| Identity | .NET, ASP.NET Identity + OpenIddict | Different lifecycle and security posture; others only validate JWTs |
| Core API | .NET modular monolith | Product logic together until a split is justified (L-06) |
| AI Generation | .NET, official `Anthropic` NuGet | Long-running, streams, scales differently, isolates the API key |
| Export | Node, `packages/core` | Codegen is TypeScript; polyglot gRPC boundary |

| Store | Used for | Local | Cloud |
|---|---|---|---|
| PostgreSQL | Store of record: identity, projects as JSONB, versions, billing, metering, outbox | Docker | Flexible Server, burstable |
| Redis | Cache, rate limits, SignalR backplane, locks | Docker | Azure Cache (basic) or in AKS |
| Blob | Assets, export zips | Azurite | Azure Blob |
| Kafka | Async events (Learning track) | Redpanda / Strimzi in kind | Strimzi in AKS or Event Hubs |
| Neo4j | Design Graph read model (Learning track) | Docker | Aura Free |
| Secrets | | Aspire user secrets | Key Vault |

## 4. Request flows

**Interactive generation:** `Studio → Gateway → Core API (quota, create Generation) → gRPC stream → AI Generation → Claude → tokens stream back → SignalR → Studio; Core API stores body, writes outbox event generation.completed`

**Export:** `Studio → Core API (ExportJob) → gRPC → Export service (codegen, zip → Blob or GitHub push) → status via SignalR → download URL`

**Async:** `outbox → Kafka (generation.completed, tokens.used, project.changed, billing.*, export.completed) → Metering, Notifications, Design Graph, Analytics`. Until Kafka exists, an in-process dispatcher drains the outbox into the same consumer interfaces.

## 5. Running locally and in the cloud

- **Aspire AppHost** orchestrates every service (including Node and the Studio dev server) and the containers; OTel dashboard included. **kind/k3d** with Helm charts for deployment exercises (L-08).
- **Cloud (P-13), cheapest first:** Terraform state + Key Vault + Blob (~€1/mo) → Static Web Apps for Studio and website (free) → PostgreSQL burstable (~€15/mo, stoppable) → AKS free control plane + 1 small node (~€35/mo running, stop when idle) → Strimzi / Aura Free. Container Apps is skipped on purpose (D-09).
