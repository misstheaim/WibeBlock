# Feature — Collaboration

> Part: [Learning track](../learning-track.md) · Epics: L-09

## Purpose

Real-time multi-user editing of a project: CRDT documents (Yjs) for pages synced over SignalR, presence and cursors, and permissions.

## Design notes

- Yjs document per page mapping the Block tree; the Studio's Redux document actions (D-24) are applied to the Yjs doc; persistence of Yjs updates alongside JSONB snapshots.
- SignalR as the transport (reuse P-06); awareness protocol for presence/selection.
- Permissions: owner / editor / viewer per project; generation attribution per user for metering.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [L-09](epics/L-09-real-time-collaboration.md) | **Real-time collaboration** | Yjs page documents, SignalR transport, presence/cursors, permissions, conflict-free edits, attribution. | P-06, P-08 | 7 |
