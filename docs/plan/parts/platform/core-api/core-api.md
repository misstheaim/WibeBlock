# Feature — Core API (modular monolith)

> Part: [Platform](../platform.md) · Epics: P-04, P-06, P-09, P-10, P-11, P-12

## Purpose

The product's server-side logic in one deployable with hard module boundaries: Projects, Realtime, Billing, Metering, Prompt Library, Notifications. Modules talk through public interfaces and in-process events; the outbox publishes integration events (Kafka later). Billing + Metering are extracted into their own service later as an exercise (L-06).

## Module map

| Module | Owns | Talks to |
|---|---|---|
| Projects | project documents (JSONB, validated by `packages/core` schema via a JSON Schema export), versions, assets (Blob), upload/download | AI Generation (gRPC), Export (gRPC), Realtime |
| Realtime | SignalR hub, groups per project/user, Redis backplane | all modules (publish), Gateway (proxy) |
| Billing | plans, Stripe (test mode), subscriptions, webhooks (idempotent), entitlements | Metering, Identity claims |
| Metering | token usage per generation, quotas, enforcement, monthly reset | Billing, Projects |
| Prompt Library | published skill versions from `packages/prompts`, per-project pins, experiment flags | AI Generation |
| Notifications | in-app centre, email (Mailpit locally), later push | Realtime, Kafka consumers |

## Design notes

- Vertical slices inside modules (minimal APIs + handlers); one `DbContext` per module; migrations per module.
- Outbox table per module; dispatcher in-process until L-01 swaps in Kafka.
- Optimistic concurrency on project documents (`version` column); Connected mode reconciles conflicts in the Studio.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-04](epics/P-04-projects-module.md) | **Projects module** | CRUD for projects/pages/theme as JSONB with server-side schema validation, versions/snapshots, assets to Blob, upload/download of Local projects, optimistic concurrency, per-user limits. | P-01, P-03 | 3 |
| [P-06](epics/P-06-realtime-delivery.md) | **Real-time delivery** | SignalR hub, Redis backplane, groups, streaming generation tokens and job status, reconnection, Studio realtime adapter. | P-02, P-04 | 3 |
| [P-09](epics/P-09-billing-module.md) | **Billing module** | Plans (Free: BYO key or small allowance; Pro: our key, bigger quota, GitHub export), Stripe Checkout + Customer Portal (test mode), idempotent webhooks + outbox, entitlement model. | P-04 | 4 |
| [P-10](epics/P-10-usage-and-metering.md) | **Usage & metering** | Token counting per generation, per-user/plan quotas, enforcement before generation, usage dashboard in Studio, monthly reset, BYO-key bypass. | P-05, P-09 | 4 |
| [P-11](epics/P-11-prompt-library-module.md) | **Prompt Library module** | Serve versioned skills to the AI service, pin versions per project, publish flow, experiment flags (metrics in L-02). | P-05 | 4 |
| [P-12](epics/P-12-notifications.md) | **Notifications** | In-app centre, email (Mailpit local; ACS/Resend cloud), events: export ready, quota nearly used, billing; later push to the companion app. | P-06 | 4 |
