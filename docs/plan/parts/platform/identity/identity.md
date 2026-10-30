# Feature — Identity

> Part: [Platform](../platform.md) · Epics: P-03

## Purpose

A self-hosted OpenID Connect provider (D-07): sign-up, login, external logins, account security, tokens for the platform app, later the companion app and service-to-service clients. **Authentication only** (D-34): profile data lives in the Core API's Accounts module (P-19).

## Design notes

- ASP.NET Core Identity for the user store + **OpenIddict** as the authorization server; flows: Authorization Code + PKCE for the platform app's server as a confidential client (BFF, D-26, D-34) and later for the mobile app, Client Credentials (service-to-service, when needed), rotating refresh tokens.
- External logins: **GitHub first** (skeleton), Google later; account linking only after the user proves ownership of the existing account.
- **Razor Pages** for login, sign-up, consent, reset and account security, styled with the `@wibeblock/ui` stylesheet (P-17) so they look like the app. Login UI never lives in the React app: the OIDC flow redirects to Identity's pages (D-34).
- Claims: `sub`, `email`, `email_verified`, `name`, `picture`; roles later; plan from Billing later (P-09). Other services validate JWTs with the JWKS endpoint. OpenIddict encrypts access tokens by default; turning it off for the API audience, or using OpenIddict validation in the services, is decided in P-03 US-6.
- Email through Mailpit locally.
- The admin gRPC lookup from the first plan is dropped until a service needs it.
- In Phase 0 the frontend uses a mock OIDC server; Identity replaces it by configuration (D-33).
- Learning focus: OIDC flows, token lifetimes, refresh rotation, key handling, PKCE, account linking, security headers.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-03](epics/P-03-identity-service.md) | **Identity service** | OpenIddict server, Identity store, Razor sign-up/login/reset/account-security pages, GitHub login and linking, token lifetimes and keys, platform app client; later Google, roles, service clients. | P-01, P-17 | 0, 2, 3 |
