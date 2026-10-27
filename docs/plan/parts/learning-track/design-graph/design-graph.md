# Feature — Design Graph

> Part: [Learning track](../learning-track.md) · Epics: L-02

## Purpose

A Neo4j read model (D-08) projected from Kafka events: projects → pages → blocks → prompts → skill versions → generations → theme tokens. It answers questions the relational/JSONB store answers badly and gives Neo4j a real job without putting it on the critical path.

## Example questions

- Which skill versions produce bodies users regenerate most (quality signal for the prompt library)?
- Blocks structurally or semantically similar to this one, across the user's projects ("reuse this hero").
- Which theme tokens are never used by generated bodies? Which blocks reference tokens that changed?
- Per-project structure insights: depth, container/leaf ratios, stale clusters.

## Design notes

- Projection consumer (L-01) writes with the official Neo4j .NET driver; rebuildable by replaying topics.
- Exposed via a small Insights API in the Core API and an "Insights" panel in the Studio (Developer mode first).
- Local: Neo4j in Docker; cloud: Aura Free.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [L-02](epics/L-02-design-graph-read-model.md) | **Design Graph read model (Neo4j)** | Graph model, Kafka projection, Cypher queries for the example questions, Insights API + Studio panel, replay/rebuild. | L-01, P-11 | 5 |
