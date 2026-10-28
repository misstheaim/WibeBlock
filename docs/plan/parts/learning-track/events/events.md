# Feature — Events

> Part: [Learning track](../learning-track.md) · Epics: L-01, L-06, L-12

## Purpose

A message bus as the asynchronous backbone of the platform (D-15), replacing the in-process outbox dispatcher without changing consumers; then the deliberate extraction of Billing + Metering into their own service to learn distributed data and sagas; later, Kafka as an upgrade for event streams.

## Design notes

- Message bus: RabbitMQ in Docker (Aspire) for daily work and the RabbitMQ Cluster Operator in kind; Azure Service Bus (Standard, for topics) in Cloud. One transport abstraction, so the broker is configuration; choose it when planning L-01 (Wolverine, MassTransit, or a thin interface over the official clients; note MassTransit v9+ is commercially licensed).
- Events: `generation.completed`, `tokens.used`, `project.changed`, `export.completed`, `billing.subscription-changed`, …; JSON contracts in `Shared.Contracts`. Pub/sub through exchanges (RabbitMQ) and topics/subscriptions (Service Bus); work queues for background jobs such as batch regeneration.
- Consumer framework: idempotency store keyed by event ID, retries with backoff, dead-letter queues.
- Replay: published outbox rows are kept as an append-only event log in Postgres; a replay tool feeds them to one consumer (e.g. to rebuild the Design Graph).
- Kafka upgrade (L-12): Redpanda in Docker, Strimzi in kind; Strimzi in AKS or Event Hubs' Kafka API in Cloud. Event streams move to topics (keys by user/project, optional Avro + schema registry); projections and Analytics read from Kafka and replay from it; work queues stay on the bus.
- Extraction: strangler approach, separate database, gRPC for synchronous quota checks, saga "upgrade plan → raise quota → notify" with compensation.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [L-01](epics/L-01-message-bus.md) | **Message bus (RabbitMQ / Azure Service Bus)** | RabbitMQ locally, Service Bus in Cloud behind one abstraction, contracts, outbox publisher, consumer framework with idempotency, DLQs, event-log replay, Aspire/kind integration. | P-01, P-04 | 5 |
| [L-06](epics/L-06-service-extraction-billing-metering.md) | **Service extraction: Billing & Metering** | Extract to a Billing service: own DB, message contracts, gRPC quota checks, saga with compensation, data migration, strangler rollout. | P-09, P-10, L-01 | 5 |
| [L-12](epics/L-12-kafka-upgrade.md) | **Kafka upgrade** | Kafka (Redpanda / Strimzi) for event streams: topic design, partition keys, move projections to topics, replay from Kafka, queues vs logs comparison. | L-01, L-02 | 7 |
