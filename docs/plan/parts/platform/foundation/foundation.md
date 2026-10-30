# Feature — Foundation

> Part: [Platform](../platform.md) · Epics: P-01, P-13

## Purpose

The skeleton every service stands on (solution layout, Aspire, conventions, observability) and, much later, the Terraform-driven Azure deployment.

## Design notes

- `backend/` is .NET only (D-32): `WibeBlock.slnx`, `src/` with `AppHost` (Aspire), `ServiceDefaults` (OTel, health, resilience), one project per .NET service and `Shared.Contracts` (C# types built from the root `contracts/`: protos in `contracts/proto/`, event and project schemas in `contracts/json-schema/`; created with the first contract that needs it), `tests/` with Testcontainers. The Node apps (platform app, Export service) live in `apps/` and are registered in the AppHost from there.
- The AppHost also runs the mock login server until Identity replaces it (D-33), and the platform app's dev server, whose Node OpenTelemetry SDK reports to the same dashboard.
- Core API module template: own EF `DbContext` and schema, public interface + in-process events only, no cross-module table access (enforced by project boundaries; an architecture test optionally).
- OTel from day one (D-10): traces, metrics, logs through Aspire locally; exporter swap for Grafana/Azure Monitor later (L-03).
- No CI on pull requests (D-13). GitHub Actions is used only for release workflows (build and publish images, deploy), introduced in P-13.
- Cloud: Terraform modules mirroring the cheapest-first steps; stop/start scripts and budgets; one `dev` environment first.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-01](epics/P-01-backend-foundation.md) | **Backend foundation** | Solution layout, Aspire AppHost (services, containers, platform app, mock login server), ServiceDefaults with OTel, Core API skeleton with module conventions and the Accounts module's schema, EF Core + Postgres, Redis; later Azurite and enforced module boundaries. | — | 0, 2 |
| [P-13](epics/P-13-cloud-deployment.md) | **Cloud deployment (Azure, Terraform)** | Terraform modules per cost step (including the Functions app from P-15), GitHub Actions release workflows (tag → build → registry → deploy), dev/prod environments, Key Vault secrets, cost controls, runbook. | P-01…P-08, L-08 | 6 |
