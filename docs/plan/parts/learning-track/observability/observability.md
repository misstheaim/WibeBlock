# Feature — Observability, load and resilience

> Part: [Learning track](../learning-track.md) · Epics: L-03, L-04, L-05

## Purpose

See what the platform does end to end, measure what it can handle, and make it survive failures: OpenTelemetry tracing across HTTP/gRPC/SignalR/Kafka, load tests with the fake AI provider, and chaos experiments.

## Design notes

- Grafana stack in Docker (Tempo, Loki, Prometheus/Mimir) as the local backend; Azure Monitor as the cloud alternative. Dashboards: generation latency and token usage, queue lag, error rates, export durations.
- SLOs: generation p95, availability of the gateway; alert rules as code.
- Load: k6 scenarios (login → generate × N, export), NBomber for gRPC; fake provider latency profiles; repeatable runs from a local script (no CI, D-13); documented capacity feeding plan limits.
- Resilience: Polly policies per dependency, bulkheads around the AI service, Chaos Mesh in kind (pod kill, network delay, Kafka partition), game-day checklist.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [L-03](epics/L-03-observability.md) | **Observability** | Trace propagation across all transports, span conventions, Grafana stack, dashboards, SLOs and alerts, log correlation. | P-01, L-01 | 5 |
| [L-04](epics/L-04-load-and-performance-testing.md) | **Load & performance testing** | k6 + NBomber scenarios, fake provider profiles, result dashboards, capacity report, scripted local regression runs. | P-05, L-03 | 5 |
| [L-05](epics/L-05-resilience-and-chaos.md) | **Resilience & chaos** | Polly policies, bulkheads, Chaos Mesh experiments, game days, fixes for findings. | L-03, L-08 | 5 |
