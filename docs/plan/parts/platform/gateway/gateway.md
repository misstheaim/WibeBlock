# Feature — Gateway

> Part: [Platform](../platform.md) · Epics: P-02

## Purpose

Single entry point for the Studio and the website: routes to services, validates JWTs issued by Identity, applies rate limits, and proxies SignalR/WebSockets.

## Design notes

- YARP in ASP.NET Core; routes configured in code from Aspire service discovery locally and from Helm values in Kubernetes.
- JWT validation at the edge plus per-service validation (defence in depth); user/plan claims forwarded as headers.
- Rate limiting with the ASP.NET rate limiter backed by Redis; stricter limits on generation endpoints.
- Local TLS via dev certs; CORS for the Studio origin.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-02](epics/P-02-gateway.md) | **Gateway (YARP)** | Routing, JWT validation, rate limiting, CORS, SignalR/WebSocket proxying, request logging, local TLS. | P-01 | 3 |
