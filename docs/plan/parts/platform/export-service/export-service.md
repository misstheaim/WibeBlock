# Feature — Export service

> Part: [Platform](../platform.md) · Epics: P-07

## Purpose

Compact on the server: run `packages/core` codegen for a stored project and deliver a zip (Blob, expiring URL) or push to a GitHub repository.

## Design notes

- Node service in `apps/export` (pnpm workspace, D-32) exposing gRPC (`@grpc/grpc-js`), registered in Aspire like the .NET services; protos come from `contracts/proto/`, shared with the .NET side.
- GitHub push via a GitHub App installation or the user's OAuth token (scoped to repo creation); creates a new repo and pushes an initial commit.
- Jobs are short; status is reported to the Core API which relays over SignalR and emits `export.completed`.
- Learning focus: polyglot gRPC, Node in Aspire/Kubernetes, GitHub App auth.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-07](epics/P-07-export-service.md) | **Export service** | Node gRPC service running codegen, zip to Blob with expiring URL, GitHub push to a new repo, job status events, parity with local Compact. | P-01, P-04 | 3 |
