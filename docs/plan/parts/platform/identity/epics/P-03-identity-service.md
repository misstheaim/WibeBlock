# P-03 — Identity service

> Part: Platform · Phase: 0, 2, 3 · Stages: skeleton, foundation, connected · Depends on: P-01, P-17 (its stylesheet) · Status: draft

## Goal
WibeBlock gets its own OpenID Connect provider (D-07): people sign up with email or GitHub, confirm their email, sign in, reset a forgotten password and manage how they sign in, on pages that look like the rest of the product. The platform app (P-18) signs users in through it as a confidential client; other services only validate the tokens it issues. Identity handles **authentication and account security only**; profile data lives in the Core API (D-34).

## Scope
- In: the Identity service project in the AppHost with its own Postgres schema; ASP.NET Core Identity as the user store; OpenIddict as the authorization server (discovery, JWKS, authorization, token, end-session and revocation endpoints); Authorization Code + PKCE and refresh tokens; the platform app registered as a confidential client; Razor Pages UI for sign-up, sign-in, sign-out, email confirmation, forgot and reset password, GitHub login and account linking, account security (change password, linked logins, sign out everywhere); email through Mailpit; token lifetimes and signing keys; styling with the `@wibeblock/ui` stylesheet. Later: Google login, roles and service-to-service clients.
- Out (and where it lives instead): the client side of the flow (P-18); profile data (P-19); JWT validation at the edge (P-02); plan claims (P-09); the mobile app client (Mobile part, Phase 7).

## Concepts and model
- **User** (ASP.NET Core Identity): id (becomes `sub`), email, email confirmed, password hash, lockout data, security stamp, external logins (provider + provider user id).
- **Client applications** (OpenIddict): the platform app (confidential, Authorization Code + PKCE, refresh tokens, redirect and post-logout URLs). Seeded from configuration at startup, not created by hand.
- **Scopes and claims:** `openid`, `profile`, `email`, `offline_access`, and an API scope for the Core API (the access token's audience). Claims: `sub`, `email`, `email_verified`, `name`, `picture` (e.g. the GitHub avatar).
- **Tokens:** short-lived access tokens (minutes), rotating refresh tokens with reuse detection, ID tokens for the client. Access tokens must be readable by the Gateway and services (JWT, signed, validated through JWKS); OpenIddict encrypts access tokens by default, so either turn encryption off for the API audience or use OpenIddict's validation handler in the resource servers (decide in US-6; D-34).
- **Signing and encryption keys:** persistent development keys (not ephemeral), so restarts don't invalidate every session; certificates from Key Vault in the cloud (P-13).
- **Account linking:** an external login is linked to an existing account only after the user proves ownership of that account (signs in with its password); never merged silently by matching email.

## User stories
- **US-1** `[skeleton]` As a new user, I can sign up with my email and a password and confirm my email, so that I have a WibeBlock account.
  - Acceptance: from the login page, "Create account" opens a sign-up page with password rules shown up front; a confirmation email arrives in Mailpit; the link confirms the email and signs me in; unconfirmed accounts cannot sign in and can resend the email; the pages use the app's tokens and follow the OS light/dark setting.
- **US-2** `[skeleton]` As a user, I can sign in and out of the platform app through Identity, so that one account opens the product.
  - Acceptance: the platform app's sign-in (P-18 US-6) shows Identity's login page and returns me signed in; discovery and JWKS documents are served; the ID token carries `sub`, `email`, `email_verified`, `name`, `picture`; signing out from the platform app also ends the Identity session; a wrong password shows a generic message; repeated failures lock the account for a while.
- **US-3** `[skeleton]` As a user who forgot my password, I can reset it by email, so that I can get back in.
  - Acceptance: "Forgot password" sends a reset link to Mailpit; the page says the same thing whether or not the email exists; the link expires and works once; after the reset, existing refresh tokens are revoked.
- **US-4** `[skeleton]` As a user, I can sign in with GitHub, so that I don't need another password.
  - Acceptance: "Continue with GitHub" works for new users (account created with GitHub's verified email and avatar as `picture`) and for returning users; if an account with that email already exists, I'm asked to sign in with its password once to link GitHub; the GitHub OAuth app's client secret is in user secrets, not in the repo.
- **US-5** `[skeleton]` As a user, I can manage how I sign in, so that my account stays secure.
  - Acceptance: account security pages (reached from the platform app's `/account`, P-19 US-4) let me change my password, link or unlink GitHub (I can't remove my last way to sign in), and "sign out everywhere", which revokes all my refresh tokens so other devices must sign in again when their access token expires; each page has a way back to the platform app.
- **US-6** `[skeleton]` As a developer, tokens and keys are configured deliberately, so that the system is secure and pleasant in development.
  - Acceptance: access token lifetime of a few minutes, refresh tokens rotating with reuse detection, documented lifetimes; signing keys persist across restarts in development; access tokens for the API scope can be validated by the Gateway and the Core API (P-02 US-2) using the JWKS; the platform app client is seeded from configuration; Identity is added to the AppHost and replaces the mock login server.
- **US-7** `[foundation]` As a user, I can sign in with Google too, so that I can use the account I prefer.
  - Acceptance: same behaviour as GitHub (US-4) with Google; linking rules identical.
- **US-8** `[connected]` As a developer, services can call each other with their own tokens and admins have a role, so that service-to-service calls and admin features are authorised.
  - Acceptance: Client Credentials clients exist for services that need them (first: when P-05 or P-07 call back into the Core API); an `admin` role appears as a claim and protects admin-only endpoints.
  - Notes: the "admin gRPC lookup" from the old plan is dropped unless a service actually needs it.

## UX notes
- The login pages are the first thing new users see: same tokens, type and spacing as the app (P-17), WibeBlock logo, one clear primary action per page, plain-language errors.
- "Continue with GitHub" sits above the email form; the password rules are visible before typing.

## Technical design
- ASP.NET Core with Razor Pages for the UI; ASP.NET Core Identity with EF Core on Postgres (own schema); OpenIddict server with its EF Core stores in the same database; the authorization and logout endpoints in pass-through mode so Razor Pages render the UI.
- Styling: the Tailwind CLI builds a stylesheet from `@wibeblock/ui`'s tokens plus classes used in the Razor views (no React here).
- Email through an abstraction with an SMTP implementation pointed at Mailpit (added to the AppHost here).
- Security headers (CSP, frame-ancestors, HSTS outside development); antiforgery on all forms; Data Protection keys persisted.

## Learning notes
Concepts in a sensible order:
1. **ASP.NET Core Identity**: user store, password hashing, lockout, email confirmation and reset tokens, external logins.
2. **OpenIddict**: server setup, endpoints, pass-through mode, application and scope registration, claims destinations (which claim goes into which token).
3. **Token design**: lifetimes, refresh rotation and reuse detection, revocation, signing vs encryption keys, JWKS.
4. **External OAuth providers**: a GitHub OAuth app, callback URLs, safe account linking.
5. **Razor Pages** and server-rendered forms with antiforgery.
6. **Security headers** and OWASP authentication guidance.

References: [OpenIddict documentation](https://documentation.openiddict.com), [OpenIddict samples](https://github.com/openiddict/openiddict-samples), [ASP.NET Core Identity](https://learn.microsoft.com/aspnet/core/security/authentication/identity), [external login providers](https://learn.microsoft.com/aspnet/core/security/authentication/social/), [GitHub OAuth apps](https://docs.github.com/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps), [Razor Pages](https://learn.microsoft.com/aspnet/core/razor-pages/), [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Tailwind CLI](https://tailwindcss.com/docs/installation/tailwind-cli).

## Tests (optional)
Integration tests with Testcontainers for the risky rules pay off: account linking never merges by email alone, reset tokens are single-use, refresh-token reuse revokes the family, unlinking the last login is refused.

## Risks and open questions
- **Access token encryption vs validation at the Gateway** (see Concepts): decide early in US-6; it affects P-02.
- **Styling Razor Pages with the kit** depends on P-17 keeping styles expressible as classes.
- OpenIddict is a toolkit, not a turnkey server: more to write than Duende IdentityServer or Keycloak, which is the point for learning; keep the UI scope small.
- Email deliverability does not matter locally (Mailpit); a real provider is chosen in P-13 / P-12.

## Done when
- [ ] (skeleton) Sign up with email confirmation, sign in, sign out, password reset and GitHub login work through the platform app.
- [ ] (skeleton) Account security pages work, including sign out everywhere.
- [ ] (skeleton) Identity runs in the AppHost and has replaced the mock login server; tokens validate at the Gateway.
- [ ] (foundation) Google login works.
- [ ] (connected) Service clients and the admin role exist.
