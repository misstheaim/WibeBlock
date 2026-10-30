# Feature — Gateway

> Part: [Platform](../platform.md) · Epics: P-02

## Purpose

Single entry point for API traffic from the platform app's server (and its `/api/*` forwarding route): routes to services, validates JWTs issued by Identity, applies rate limits, and later proxies SignalR/WebSockets.

## Design notes

- YARP in ASP.NET Core; routes configured from Aspire service discovery locally and from Helm values in Kubernetes.
- JWT validation at the edge plus per-service validation (defence in depth); the token is passed through unchanged, so services read claims from it rather than from forwarded headers.
- Rate limiting with the ASP.NET rate limiter: per user and per IP in memory first, Redis-backed and stricter on generation endpoints later.
- **Not the BFF** (D-34): sessions and cookies live in the platform app; the Gateway only sees bearer tokens. No CORS, because browsers never call it directly.
- Local TLS via dev certs.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-02](epics/P-02-gateway.md) | **Gateway (YARP)** | Routing through service discovery, JWT validation at the edge, per-user rate limits with 429, request telemetry, local TLS; later SignalR proxying and shared limits. | P-01 | 0, 3 |
