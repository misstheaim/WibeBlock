# Feature — Foundation

> Part: [Platform](../platform.md) · Epics: P-01, P-13

## Purpose

The skeleton every service stands on (solution layout, Aspire, conventions, observability) and, much later, the Terraform-driven Azure deployment.

## Design notes

- `backend/` solution: `AppHost` (Aspire), `ServiceDefaults` (OTel, health, resilience), one project per service, `Shared.Contracts` for gRPC protos and event schemas, `tests/` with Testcontainers.
- Core API module template: own EF `DbContext` and schema, public interface + in-process events only, no cross-module table access (enforced by an architecture test).
- OTel from day one (D-10): traces, metrics, logs through Aspire locally; exporter swap for Grafana/Azure Monitor later (L-03).
- No CI on pull requests (D-13). GitHub Actions is used only for release workflows (build and publish images, deploy), introduced in P-13.
- Cloud: Terraform modules mirroring the cheapest-first steps; stop/start scripts and budgets; one `dev` environment first.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-01](epics/P-01-backend-foundation.md) | **Backend foundation** | Solution layout, Aspire AppHost, Core API skeleton with module boundaries, EF Core + Postgres, Redis, Azurite, OTel wiring, health checks, conventions, architecture tests. | — | 3 |
| [P-13](epics/P-13-cloud-deployment.md) | **Cloud deployment (Azure, Terraform)** | Terraform modules per cost step, GitHub Actions release workflows (tag → build → registry → deploy), dev/prod environments, Key Vault secrets, cost controls, runbook. | P-01…P-08, L-08 | 6 |
