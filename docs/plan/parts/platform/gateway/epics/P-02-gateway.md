# P-02 — Gateway (YARP)

> Part: Platform · Phase: 0, 3 · Stages: skeleton, connected · Depends on: P-01 (a token issuer: the mock login server, then P-03) · Status: draft

## Goal
All API traffic enters the platform through one **YARP** gateway: it routes requests to the right service, rejects requests without a valid token before they reach a service, limits how fast one user can call, and makes every request visible in traces. It is a plain gateway, not the BFF: sessions live in the platform app (D-34).

## Scope
- In: Gateway project in the AppHost; routes to the Core API resolved through service discovery; JWT bearer validation at the edge (issuer, audience, signature through JWKS, lifetime) with the services validating again; per-user and per-IP rate limits with 429 responses; request telemetry; local HTTPS. Later: WebSocket/SignalR proxying, routes for further services, stricter limits on generation, limits shared across instances.
- Out (and where it lives instead): sessions, cookies and token attachment (platform app BFF, P-18); CORS (not needed: the browser only talks to the platform app, and the Astro site makes no API calls; add it only if a browser client ever calls the Gateway directly); authorization rules inside services (each service).

## Concepts and model
- **Routes and clusters**: a route matches a path prefix (e.g. `/accounts/...`) and sends it to a cluster (a service's instances, found by name through service discovery).
- **Defence in depth**: the Gateway rejects bad tokens early; each service still validates the token and applies its own authorization.
- **Rate-limit partitions**: authenticated requests are limited per user (`sub`), anonymous ones per client IP; generation endpoints get their own, stricter policy later.

## User stories
- **US-1** `[skeleton]` As a developer, the platform app reaches the Core API only through the Gateway, so that there is one entry point to secure and observe.
  - Acceptance: the platform app's API base URL is the Gateway; requests under the Core API's prefix reach the Core API, found through service discovery; unknown paths return 404 from the Gateway; adding a service is a route and a cluster in configuration.
- **US-2** `[skeleton]` As a developer, requests without a valid token are rejected at the edge, so that services only see authenticated traffic.
  - Acceptance: missing, expired, wrongly signed, wrong-issuer and wrong-audience tokens get 401 from the Gateway and never reach the Core API; valid requests pass with the token unchanged and the Core API validates it again; switching the issuer from the mock login server to Identity is configuration only.
- **US-3** `[skeleton]` As a user, the app tells me to slow down instead of breaking when I send too many requests, so that the platform stays responsive for everyone.
  - Acceptance: above the limit the Gateway answers 429 with `Retry-After`; limits are per user for authenticated calls and per IP otherwise; the platform app shows a calm "Too many requests, try again in a moment" message; limits are configurable.
- **US-4** `[skeleton]` As a developer, I can see every request the Gateway handles, so that I can find slow or failing calls.
  - Acceptance: Gateway spans appear in the same trace as the platform app and the Core API (P-01 US-2); logs show route, status, duration and user id (never the token).
- **US-5** `[connected]` As a developer, realtime connections pass through the Gateway, so that the Studio's live updates reach the browser.
  - Acceptance: WebSocket (SignalR) connections to the realtime hub (P-06) are proxied with the token validated on connect; long-lived connections are not cut by default timeouts.
- **US-6** `[connected]` As a developer, the AI and export services are routed with stricter, shared limits, so that expensive calls are protected even with several Gateway instances.
  - Acceptance: routes for P-05 and P-07 endpoints (through the Core API where that is the design); a stricter policy on generation; limits stored in Redis so they hold across instances.

## UX notes
No UI of its own; its messages reach users only through the platform app (429 handling in P-08's error states).

## Technical design
- ASP.NET Core with YARP; routes and clusters from configuration (code or `appsettings`), destinations resolved by Aspire service discovery locally and by Kubernetes services later (L-08).
- JWT bearer authentication with the issuer's metadata (discovery and JWKS); an authorization policy on proxied routes that requires an authenticated user.
- ASP.NET Core rate limiting middleware with partitioned limiters (in-memory in the skeleton; Redis-backed in US-6).

## Learning notes
Concepts in a sensible order:
1. **Reverse proxies and API gateways**: what they do, what they should not do (business logic, sessions).
2. **YARP**: routes, clusters, destinations, transforms, configuration sources, service discovery.
3. **JWT validation**: claims, issuer, audience, signature through JWKS, clock skew, why validate at the edge and in services.
4. **Rate limiting**: fixed window, sliding window, token bucket, concurrency limiters; partitions; `Retry-After`.

References: [YARP documentation](https://learn.microsoft.com/aspnet/core/fundamentals/servers/yarp/yarp-overview), [YARP repository and samples](https://github.com/dotnet/yarp), [JWT bearer authentication in ASP.NET Core](https://learn.microsoft.com/aspnet/core/security/authentication/configure-jwt-bearer-authentication), [rate limiting middleware](https://learn.microsoft.com/aspnet/core/performance/rate-limit), [RFC 7519 JWT](https://www.rfc-editor.org/rfc/rfc7519).

## Tests (optional)
A few integration tests with tokens signed by a test key (expired, wrong audience, valid) pay off, because a mistake here opens or closes the whole API.

## Risks and open questions
- **OpenIddict access-token encryption** must be resolved in P-03 US-6, or the Gateway cannot read tokens.
- Rate limits in memory are per instance; fine until the Gateway runs more than once (L-08).

## Done when
- [ ] (skeleton) The platform app talks to the Core API only through the Gateway.
- [ ] (skeleton) Bad tokens get 401 at the edge; valid ones reach the Core API and are validated there too.
- [ ] (skeleton) 429 with Retry-After appears above the limit and the app handles it.
- [ ] (connected) SignalR and the other services are routed; limits are shared.
