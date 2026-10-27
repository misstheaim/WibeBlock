# Feature — Identity

> Part: [Platform](../platform.md) · Epics: P-03

## Purpose

A self-hosted OpenID Connect provider (D-07): sign-up, login, external logins, roles, tokens for the Studio, the companion app and API clients.

## Design notes

- ASP.NET Core Identity for the user store + **OpenIddict** as the authorization server; flows: Authorization Code + PKCE (Studio, mobile), Client Credentials (service-to-service), refresh tokens.
- External logins: GitHub and Google; account linking.
- Razor Pages or a minimal React UI for login/consent/reset; themed to match the Studio.
- Claims: `sub`, roles, plan (from Billing via a cached lookup), email verified. Other services validate JWTs with the JWKS endpoint; a tiny gRPC surface exists only for admin lookups.
- Learning focus: OIDC flows, token lifetimes, key rotation, PKCE, security headers.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-03](epics/P-03-identity-service.md) | **Identity service** | OpenIddict server, Identity store, sign-up/login/reset UI, GitHub & Google login, roles, token lifetimes/refresh/rotation, Studio PKCE flow, admin gRPC. | P-01 | 3 |
