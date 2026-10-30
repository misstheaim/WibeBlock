# P-01 — Backend foundation

> Part: Platform · Phase: 0, 2 · Stages: skeleton, foundation · Depends on: — (comes after the frontend skeleton epics, D-33) · Status: draft

## Goal
The .NET side gets its skeleton: a solution in `backend/`, an **Aspire** AppHost that starts every service and container with one command (including the platform app's dev server), shared service defaults with **OpenTelemetry** from the first line (D-10), and a **Core API** shaped as a modular monolith with its first module (Accounts, P-19) on EF Core and Postgres. After this epic, every later service is "add a project, register it in the AppHost".

## Scope
- In: `backend/WibeBlock.slnx` with `src/` and `tests/` (D-32); AppHost; ServiceDefaults (OpenTelemetry, health checks, service discovery, HTTP resilience); Core API skeleton with the module structure and conventions; Postgres and Redis containers with persistent volumes; EF Core per module with its own schema and migrations applied locally; the platform app and the mock login server in the AppHost; the platform app's server sending traces to the same dashboard; Azurite (foundation); module boundary enforcement (foundation).
- Out (and where it lives instead): Identity (P-03) and Gateway (P-02) projects; the Accounts module's content (P-19 US-5); `Shared.Contracts` built from `contracts/` (with the first proto or schema that needs it: P-04, P-05); outbox and message bus (P-04, L-01); Kubernetes (L-08); cloud (P-13).

## Concepts and model
- **AppHost**: the C# program that describes the local system (projects, containers, Node apps, their references and environment) and starts it with a dashboard.
- **ServiceDefaults**: one shared project every .NET service calls at startup: telemetry, health endpoints, service discovery, resilience for outgoing HTTP.
- **Modular monolith**: one deployable Core API; each module (Accounts first, Projects next) owns its endpoints, its `DbContext` and its Postgres schema, and exposes only a public interface and in-process events (core-api.md). No module reads another module's tables.
- **Local data**: Postgres and Redis run as containers with named volumes, so data survives restarts; a reset wipes them deliberately.

## User stories
- **US-1** `[skeleton]` As a developer, I can start the whole platform with one command, so that working on it is as easy as the Studio.
  - Acceptance: one command (e.g. `aspire run` or `dotnet run` on the AppHost) starts Postgres, Redis, the Core API, the mock login server and the platform app's dev server; the Aspire dashboard lists them with their state and health; stopping the AppHost stops them all; Docker is the only extra prerequisite; `docs/development.md` explains it.
  - Notes: the mock login server stays in the AppHost until P-03 replaces it; Identity and Gateway are added by their epics.
- **US-2** `[skeleton]` As a developer, I can follow one request through every service in the dashboard, so that I understand and debug the system from day one.
  - Acceptance: loading the profile page shows one trace spanning the platform app server, the Core API and the Postgres query; logs are structured and linked to their trace; basic metrics (request rate, duration, errors) are visible per service; health and liveness endpoints exist in development.
  - Notes: the platform app (Node) needs the OpenTelemetry Node SDK pointed at the dashboard's OTLP endpoint; Aspire passes the endpoint as configuration.
- **US-3** `[skeleton]` As a developer, I can add a Core API module by following one documented pattern, so that modules stay consistent and separate.
  - Acceptance: the Core API hosts modules that each register their own endpoints, services and `DbContext`; the Accounts module is the first (empty endpoints are enough here; P-19 fills it); the module conventions (folders, vertical slices, naming, what is public) are written in `docs/development.md`.
- **US-4** `[skeleton]` As a developer, each module's database schema is created and updated automatically on my machine, so that I never run migrations by hand during development.
  - Acceptance: each module has its own schema and migrations; starting the AppHost applies pending migrations before the Core API serves traffic; data persists across restarts; a documented command resets local data.
  - Notes: how migrations run (at startup in development vs a separate migration step that also works in Kubernetes and the cloud) is a learning decision; recommended: a small migration worker started first by the AppHost, because it carries over to L-08 and P-13.
- **US-5** `[foundation]` As a developer, I have local blob storage and the conventions for using it, so that Projects (P-04) can store assets and exports.
  - Acceptance: Azurite runs in the AppHost with a volume; a service can reach it by name through configuration; the Aspire dashboard shows it.
- **US-6** `[foundation]` As a developer, modules cannot reach into each other's internals, so that the monolith can later be split (L-06).
  - Acceptance: a module's internal types are not accessible from other modules (compile-time); modules communicate through a public interface or in-process events, shown by one real example once Projects exists (e.g. Projects reads a user's display name through the Accounts interface); the rules are documented.

## UX notes
No end-user UI. The developer experience is the product: one command, one dashboard, readable logs.

## Technical design
- .NET 10, `WibeBlock.slnx`, `backend/src/AppHost`, `backend/src/ServiceDefaults`, `backend/src/CoreApi` (host) plus module projects or folders (choose in US-3: separate projects make boundaries compiler-enforced, folders are simpler; separate projects recommended for US-6).
- Aspire hosting integrations for Postgres and Redis; the JavaScript hosting integration for the platform app; a container resource for the mock login server.
- EF Core with Npgsql; one `DbContext` per module with its own default schema and migrations history table.
- Central package management (`Directory.Packages.props`) and shared build settings (`Directory.Build.props`) for the solution.

## Learning notes
Concepts in a sensible order:
1. **Aspire**: AppHost, resources, references and service discovery, the dashboard, integrations for containers and Node apps.
2. **OpenTelemetry**: traces, spans, context propagation (W3C `traceparent`), metrics, logs; auto-instrumentation in .NET and Node; OTLP.
3. **ASP.NET Core hosting**: the generic host, configuration sources, dependency injection, health checks.
4. **Modular monolith**: module boundaries, vertical slices, in-process events, why one `DbContext` per module.
5. **EF Core migrations** and how to run them safely across environments.

References: [Aspire docs](https://aspire.dev), [Aspire on Microsoft Learn](https://learn.microsoft.com/dotnet/aspire/), [OpenTelemetry concepts](https://opentelemetry.io/docs/concepts/), [OpenTelemetry .NET](https://opentelemetry.io/docs/languages/dotnet/), [OpenTelemetry JavaScript (Node)](https://opentelemetry.io/docs/languages/js/), [EF Core migrations](https://learn.microsoft.com/ef/core/managing-schemas/migrations/), [Npgsql EF Core provider](https://www.npgsql.org/efcore/), [Modular monolith with DDD (reference repo)](https://github.com/kgrzybek/modular-monolith-with-ddd).

## Tests (optional)
An architecture test (e.g. NetArchTest or ArchUnitNET) that fails when a module references another module's internals would back up US-6. xUnit + Testcontainers starts here or with the Accounts module (P-19), written by hand first (D-16).

## Risks and open questions
- **Aspire and the Node app**: the platform app's dev server, its environment (API base URL, OIDC settings) and OTel must be wired from the AppHost; check hot reload still works when started by Aspire.
- **Two ways to run the frontend** (plain `pnpm` with mocks, and under Aspire with the backend): keep both working; the mock flag decides.
- Aspire evolves quickly (new CLI, renamed packages); follow the current docs, not older blog posts.

## Done when
- [ ] (skeleton) One command starts Postgres, Redis, the Core API, the mock login server and the platform app; the dashboard shows them healthy.
- [ ] (skeleton) A profile page load is one trace from the platform app server to Postgres.
- [ ] (skeleton) The Accounts module has its schema, created automatically; module conventions are documented.
- [ ] (foundation) Azurite runs; module boundaries are enforced.
