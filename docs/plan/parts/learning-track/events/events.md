# Feature — Events

> Part: [Learning track](../learning-track.md) · Epics: L-01, L-06

## Purpose

Kafka as the asynchronous backbone of the platform (D-07), replacing the in-process outbox dispatcher without changing consumers; then the deliberate extraction of Billing + Metering into their own service to learn distributed data and sagas.

## Design notes

- Local: Redpanda in Docker (Aspire) for daily work; Strimzi in kind for the Kubernetes path. Cloud: Strimzi in AKS or Event Hubs' Kafka API.
- Topics: `generation.completed`, `tokens.used`, `project.changed`, `export.completed`, `billing.subscription-changed`, …; keys by user/project; JSON with schema files in `Shared.Contracts` (Avro + schema registry as an optional extension).
- Consumer framework: idempotency store keyed by event ID, retries with backoff, dead-letter topics, replay tool.
- Extraction: strangler approach, separate database, gRPC for synchronous quota checks, saga "upgrade plan → raise quota → notify" with compensation.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [L-01](epics/L-01-event-backbone-kafka.md) | **Event backbone (Kafka)** | Local Kafka, topic design, contracts, outbox publisher, consumer framework with idempotency, DLQs, replay, Aspire/kind integration. | P-01, P-04 | 5 |
| [L-06](epics/L-06-service-extraction-billing-metering.md) | **Service extraction: Billing & Metering** | Extract to a Billing service: own DB, Kafka contracts, gRPC quota checks, saga with compensation, data migration, strangler rollout. | P-09, P-10, L-01 | 5 |
