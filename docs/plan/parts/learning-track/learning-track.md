# Part — Learning track (platform engineering)

> Technologies added primarily to learn them, each with a real job in the platform. Phase 5 and parts of 7 in the [master plan](../../00-master.md). Epic IDs `L-nn`.
> Rules: (1) product core before infrastructure; (2) every technology does something the system actually uses; (3) everything runs locally first (Docker, kind/k3d); cloud only via P-13.

## Features

| Feature | Technology → real job | Epics |
|---|---|---|
| [Events](events/events.md) | RabbitMQ / Azure Service Bus + outbox + idempotent consumers → async backbone; service extraction with sagas; Kafka later for event streams | L-01, L-06, L-12 |
| [Design Graph](design-graph/design-graph.md) | Neo4j / Cypher + CQRS projection → insights on prompts, skills, blocks | L-02 |
| [Observability](observability/observability.md) | OpenTelemetry + Grafana stack → traces/metrics/SLOs; k6/NBomber → load tests; Polly + Chaos Mesh → resilience | L-03, L-04, L-05 |
| [Kubernetes](kubernetes/kubernetes.md) | Helm, KEDA, Argo CD, network policies → run and scale the platform; preview hosting | L-08, L-10 |
| [Analytics](analytics/analytics.md) | ClickHouse / ADX fed from Kafka (after L-12) → usage and prompt metrics | L-07 |
| [Collaboration](collaboration/collaboration.md) | SignalR + Yjs → multi-user editing | L-09 |
| [Multi-cloud](multi-cloud/multi-cloud.md) | AWS (EKS/RDS) → migrate one service as an exercise | L-11 |

## Suggested order

L-08 (local k8s, needed to practise everything else) → L-01 (message bus) → L-03 (observability) → L-02 (Design Graph) → L-04 (load) → L-05 (chaos) → L-06 (extraction) → later L-12 (Kafka), L-07, L-09, L-10, L-11.
