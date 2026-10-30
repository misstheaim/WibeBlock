# P-19 — Profile & account

> Part: Platform · Phase: 0 · Stages: skeleton · Depends on: P-08, P-18 (P-01, P-02, P-03 for US-5 and US-6) · Status: draft

## Goal
A signed-in user can see and edit their profile, has their light/dark choice follow them to any device, and finds their account security actions. The epic crosses the whole stack in the skeleton: the frontend is built first against mocks (D-33), then a small **Accounts module** in the Core API serves the real data through the Gateway, and the mocks are switched off. Identity stays responsible for credentials and security only; the profile lives in the Core API (D-34).

## Scope
- In: profile page (avatar, display name, email, member since); editing the display name; theme preference saved in the profile; account page with links to Identity's security pages; the Core API Accounts module (profile created on first use, read and update own profile, OpenAPI document); replacing the mocks with the real API.
- Out (and where it lives instead): password, email, linked logins, sign-out-everywhere logic (Identity, P-03 US-5); avatar upload (later, needs Blob storage from P-01 US-5); BYO API keys, plan and usage, data export and account deletion (P-14); customising the app theme beyond light/dark (P-17 US-6).

## Concepts and model
- **Profile** (Core API, Accounts module): user id (= the token's `sub`), display name, email (copied from the token, read-only here; Identity owns it), avatar URL (from the `picture` claim, e.g. GitHub; empty → initials), preferences, created and updated times.
- **Preferences:** a small document with the theme mode (`light`, `dark` or `system`) for now; later the app theme customisation (P-17 US-6), default canvas viewport and notification settings. Stored as JSONB, so new preferences need no migration.
- **First-use creation:** the "my profile" endpoint creates the profile from the token's claims when it does not exist yet (just-in-time provisioning), so no separate sign-up step or event is needed. Email and avatar are refreshed from the claims on each sign-in.
- **Ownership:** a user can only read and change their own profile; the user id always comes from the validated token, never from the URL or body.

## User stories
- **US-1** `[skeleton]` As a user, I can see my profile, so that I know how I appear in WibeBlock.
  - Acceptance: `/profile` shows my avatar (GitHub picture, or initials on a stable colour), display name, email and "member since"; the data comes from the "my profile" API (mocked first); a slow response shows skeletons, a failed one shows a message with "Try again".
- **US-2** `[skeleton]` As a user, I can change my display name, so that I appear the way I want.
  - Acceptance: an edit form with validation (required, trimmed, 1–50 characters) checked in the browser and again on the server; server-side errors appear under the field; the form also works with JavaScript disabled; on success a toast confirms and the user menu shows the new name immediately.
- **US-3** `[skeleton]` As a user, my light/dark choice follows me to every browser I sign in on, so that I set it once.
  - Acceptance: switching the mode (P-08 US-5) also saves it to my profile in the background, without blocking the UI (if saving fails, the mode stays and a quiet toast says it wasn't saved); after signing in on another browser, the saved mode is applied and written to that browser's mode cookie; signed out, the cookie or OS preference is used.
- **US-4** `[skeleton]` As a user, I can find my account security settings, so that I can manage how I sign in.
  - Acceptance: `/account` shows my email with a "verified" badge, my linked sign-in methods, and buttons "Change password", "Manage linked accounts" and "Sign out everywhere" that open Identity's pages (P-03) and return me to `/account`; in mocked mode these buttons are disabled with a short explanation.
- **US-5** `[skeleton]` As a developer, the Core API's Accounts module serves the profile through the Gateway, so that the frontend has a real backend.
  - Acceptance: through the Gateway with a valid token, "get my profile" returns the profile and creates it on first call; "update my profile" changes display name and preferences with validation errors returned as problem details (400); another user's profile is never reachable; data lives in the module's own Postgres schema with migrations; an OpenAPI document and a dev API explorer (e.g. Scalar) describe the endpoints.
  - Notes: depends on P-01 (Core API skeleton), P-02 (Gateway) and a token issuer (mock server or P-03).
- **US-6** `[skeleton]` As a developer, I can switch the profile pages from mocks to the real API, so that the skeleton runs end to end.
  - Acceptance: with the mock flag off, US-1 to US-4 work against Gateway → Core API with no other changes to pages; differences between mock and real responses are fixed in the platform app's API client, whose types are now generated from the Core API's OpenAPI document; the mock handlers are either deleted or rebuilt on the generated types as dev fixtures (decide in the ticket).

## UX notes
- `/profile` is about how I appear (name, avatar, preferences); `/account` is about how I sign in (security, linked accounts). Both are reachable from the user menu.
- Changes save with a clear confirmation; nothing auto-saves silently except the mode switch, which applies instantly anyway.

## Technical design
- **Frontend:** loaders read, actions write (P-08); a Zod schema validates the form in the browser and in the action. React Router's `Form` keeps the form working without JavaScript; React Hook Form is not needed for forms this simple (D-24 keeps it for the Studio inspector). The background save of the mode uses a fetcher (no navigation).
- **Backend:** Accounts module in the Core API (module template from P-01): minimal API endpoints in a route group requiring an authenticated user; EF Core with its own `DbContext` and schema; preferences as a JSONB column; problem details for errors; the built-in OpenAPI generation plus a dev-only explorer UI.
- **Typed client:** generated from the Core API's OpenAPI document (orval or `openapi-typescript`; choose in US-6). Generated types replace the hand-written mock types.

## Learning notes
Concepts in a sensible order:
1. **Forms in React Router**: actions, validation errors, progressive enhancement, fetchers for background saves, optimistic UI.
2. **Zod** schemas shared between client and server checks.
3. **ASP.NET Core minimal APIs**: route groups, endpoint filters, authorization on endpoints, reading the user from claims.
4. **EF Core with Postgres**: a module's `DbContext`, schemas, migrations, JSONB columns with Npgsql.
5. **Problem details** (RFC 9457) for API errors and how the frontend shows them.
6. **OpenAPI**: generating the document from .NET, generating a TypeScript client from it.

References: [React Router — form validation](https://reactrouter.com/how-to/form-validation), [fetchers](https://reactrouter.com/how-to/fetchers), [Zod](https://zod.dev), [Minimal APIs overview](https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis/overview), [OpenAPI in ASP.NET Core](https://learn.microsoft.com/aspnet/core/fundamentals/openapi/overview), [EF Core](https://learn.microsoft.com/ef/core/), [Npgsql JSON mapping](https://www.npgsql.org/efcore/mapping/json.html), [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457), [Scalar for .NET](https://guides.scalar.com/scalar/scalar-api-references/integrations/net-aspnet-core), [orval](https://orval.dev), [openapi-typescript](https://openapi-ts.dev).

## Tests (optional)
The Accounts module is the first Core API module with a database, so it is a natural place for the **first xUnit + Testcontainers tests written by hand** (D-16 names P-01/P-04; this comes earlier): first-use creation, ownership (another user's profile unreachable), validation. A Zod schema test for the display-name rules is cheap.

## Risks and open questions
- **Email and avatar copied from claims** can go stale between sign-ins; acceptable, refreshed at each sign-in.
- **Mock vs generated types**: the mock is hand-written first; US-6 is where they meet. Keep the mock small to keep this cheap.
- Where the mode lives when signed out vs signed in (cookie vs profile): the profile wins after sign-in; the cookie is a cache.

## Done when
- [ ] Profile and account pages work against mocks, with validation, loading and error states.
- [ ] The mode follows the user across browsers.
- [ ] The Accounts module serves the profile through the Gateway; the mocks are switched off and everything still works.
