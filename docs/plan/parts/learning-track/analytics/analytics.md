# Feature — Analytics

> Part: [Learning track](../learning-track.md) · Epics: L-07

## Purpose

A columnar analytics store fed from Kafka (after the Kafka upgrade, L-12) for usage trends, prompt-library metrics and product funnels; complements the Design Graph (relationships) with aggregates over time.

## Design notes

- ClickHouse in Docker locally (Kafka table engine or a small consumer); Azure Data Explorer as the cloud alternative.
- Materialised views: tokens per day/plan/model, generations per skill version, regeneration rates, export counts; Grafana dashboards; retention policies.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [L-07](epics/L-07-analytics-store.md) | **Analytics store** | ClickHouse fed from Kafka, materialised views, Grafana dashboards, retention; ADX alternative documented. | L-12 | 7 |
