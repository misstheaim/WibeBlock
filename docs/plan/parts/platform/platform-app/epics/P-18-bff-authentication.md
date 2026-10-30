# P-18 — BFF authentication

> Part: Platform · Phase: 0 · Stages: skeleton · Depends on: P-08 (P-01 and P-03 for US-6) · Status: draft

## Goal
Users sign in and out of the platform app with OpenID Connect, and the browser never sees a token. The platform app's Node server is the **backend-for-frontend** (D-26, D-34): it runs the Authorization Code flow with PKCE as a confidential client, keeps tokens in a server-side session, gives the browser only an httpOnly cookie, refreshes tokens quietly and attaches them to API calls. It is built first against a **mock OIDC server** (D-33), so the flow is real from day one, and switched to the Identity service (P-03) by configuration.

## Scope
- In: mock OIDC server for local development; OIDC client in the platform app server (discovery, authorization request with state, nonce and PKCE, code exchange, ID token validation); server-side session store and session cookie; sign-in, sign-out (including at the login server), protected routes with return to the requested page; token refresh; session-expired flow; `/api/*` forwarding route for browser calls; CSRF protection; switch to Identity and to a Redis session store.
- Out (and where it lives instead): the login, sign-up and reset pages themselves (mock server now, Identity's Razor Pages in P-03); JWT validation of API calls (P-02, and each service); profile data (P-19); WebSocket and SignalR forwarding (P-06, P-16).

## Concepts and model
- **Roles in the flow:** the browser (user agent), the platform app server (OIDC **confidential client**, the BFF), the login server (mock now, Identity later; the **authorization server**) and the API (Gateway → Core API; the **resource server**).
- **Session:** a random session id in a cookie (HttpOnly, Secure, SameSite=Lax, path `/`); on the server the session holds the access token, refresh token, ID token, expiry times and the user's basic claims (`sub`, name, email, picture). Store: in memory for the skeleton, Redis once P-01 exists (US-6).
- **Login transaction:** short-lived data kept between the redirect to the login server and the callback: `state`, `nonce`, PKCE code verifier and the return URL. Stored server-side or in a short-lived encrypted cookie.
- **Return URL:** only same-site paths are accepted, so the login cannot be abused as an open redirect.
- **Mock OIDC server:** a ready-made container (recommended: `navikt/mock-oauth2-server`) that issues real signed tokens, serves discovery and JWKS, supports PKCE, refresh and logout, and shows a simple login form where any user name works. Started with one command (e.g. a compose file next to the app); moved into the Aspire AppHost by P-01 until P-03 replaces it.
- **Forwarding route:** `/api/*` on the platform app forwards browser requests to the API base URL with the session's access token attached. Server-side loaders and actions use the same token through the API client (P-08).

## User stories
- **US-1** `[skeleton]` As a user, I can sign in and land on the page I originally asked for, so that signing in never loses my place.
  - Acceptance: one command starts the mock login server, and the app is configured through its discovery URL (issuer, client id and secret, scopes, redirect URLs in environment settings; no secret committed); "Sign in" (or opening a protected page) redirects to the login page; after signing in I'm back on the original page; the user menu shows my name and avatar from the ID token; browser devtools show no tokens in storage, JavaScript-readable cookies or responses, only the session cookie; a callback with a wrong `state` or a return URL to another site is rejected with a friendly error.
- **US-2** `[skeleton]` As a user, I can sign out, so that nobody else can use my session on this device.
  - Acceptance: "Sign out" removes the server session and the cookie and ends the session at the login server (RP-initiated logout), then lands on the public page; opening a protected page afterwards asks me to sign in again; the browser's back button does not show protected content from the cache.
- **US-3** `[skeleton]` As a user, I only see signed-in pages when I am signed in, and the right page when I'm not, so that access works as expected.
  - Acceptance: every signed-in route checks the session on the server before rendering; signed-out visitors are redirected to sign in with the return URL; `/` sends signed-in users to the dashboard and others to sign in; public pages (the landing link target, error pages) work signed out.
- **US-4** `[skeleton]` As a user, my session stays alive while I work, and when it really ends I'm asked to sign in again without losing my place, so that long sessions feel smooth.
  - Acceptance: the server refreshes the access token shortly before it expires, invisibly to the user (with short token lifetimes configured on the mock server, a long session shows several refreshes in the logs); when refresh fails (token revoked or expired), the session is cleared and I see "Your session has ended, sign in again", returning to the same page afterwards; two requests that hit an expired token at the same moment refresh only once.
- **US-5** `[skeleton]` As a developer, browser code can call the platform API through `/api/*`, and the token is attached on the server, so that client-side features (later the Studio's adapters) never handle tokens.
  - Acceptance: a request from the browser to `/api/...` reaches the API base URL (answered by MSW in mocked mode) with an Authorization header added server-side; without a session it returns 401 and the app reacts by asking to sign in; state-changing requests (POST, PUT, PATCH, DELETE) from another origin are rejected (CSRF); response status and body pass through unchanged.
  - Notes: the skeleton has few browser-side calls; the theme switch (P-19 US-3) can be the first. WebSocket forwarding for SignalR comes with P-06.
- **US-6** `[skeleton]` As a developer, I can switch from the mock login server to Identity and keep sessions across restarts, so that the skeleton runs on the real backend.
  - Acceptance: changing configuration (issuer, client credentials) points the app at Identity (P-03); sign-in shows Identity's Razor login page and GitHub login works end to end; differences from the mock server (claim names, logout parameters) are fixed in the platform app; sessions are stored in Redis (P-01), so restarting the platform app keeps users signed in.
  - Notes: done after P-01 and P-03; it completes the skeleton.

## UX notes
- Signed-out visitors see the public layout (P-08) with a single clear "Sign in" action; the actual form is the login server's page (mock now, Identity later, styled like the app).
- The "session ended" message is calm and offers one button; never a raw 401.

## Technical design
- OIDC client library on the Node server: recommended **`openid-client`** (certified, close to the protocol, which suits learning). Alternatives: a React Router auth library with an OIDC strategy (less to write, hides the protocol), or Auth.js (not first-class for React Router). Decide in the first ticket.
- Session cookie and session storage use React Router's session API with a custom store (memory, then Redis).
- CSRF: SameSite=Lax cookies plus a check of the `Origin` header on state-changing requests; a synchronizer token only if a case appears that this does not cover. Explain the choice in the ticket.
- Token refresh happens where tokens are used (the API client and the forwarding route), with a per-session lock so parallel requests share one refresh.
- Logout uses the login server's end-session endpoint with the ID token hint and a registered post-logout redirect URL.
- Local development across ports: cookies are scoped by host, not port, so the app, the mock server and later Identity on different localhost ports need distinct cookie names; document this.

## Learning notes
Concepts in a sensible order:
1. **OAuth 2.0 vs OpenID Connect**: authorization vs authentication; the four roles; ID token vs access token vs refresh token.
2. **Authorization Code flow with PKCE**: the redirect, `state`, `nonce`, code verifier and challenge, the code exchange; why confidential clients still use PKCE.
3. **Discovery and JWKS**: how a client learns endpoints and verifies token signatures.
4. **The BFF pattern**: why tokens stay on the server for browser apps; session cookies and their attributes.
5. **CSRF** and SameSite cookies; open redirects.
6. **Token refresh and rotation**, refresh-token reuse detection; RP-initiated logout.

References: [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html), [RFC 6749 OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749), [RFC 7636 PKCE](https://www.rfc-editor.org/rfc/rfc7636), [OAuth 2.0 for Browser-Based Applications (IETF draft, BFF section)](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/), [openid-client](https://github.com/panva/openid-client), [mock-oauth2-server](https://github.com/navikt/mock-oauth2-server), [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [React Router — sessions and cookies](https://reactrouter.com/explanation/sessions-and-cookies).

## Tests (optional)
Unit tests for the return-URL check and the refresh lock; an end-to-end sign-in/sign-out run against the mock server (Playwright) is the most valuable single test of this epic.

## Risks and open questions
- **Mock vs real server differences** (claims, logout, token lifetimes): expected; US-6 absorbs them.
- **In-memory sessions** disappear on every dev-server restart until Redis arrives; acceptable for the skeleton, annoying with hot reload; a file-backed dev store is an option if it gets in the way.
- **SignalR through the BFF** (P-06): WebSockets must be forwarded by the Node server with the token attached; may require a custom server. Recorded in D-34.
- Token size: OpenIddict tokens can be large; keep them in the session store, never in the cookie.

## Done when
- [ ] Sign in, sign out and return-to-page work against the mock login server.
- [ ] No token is visible to browser JavaScript; `/api/*` attaches it server-side; cross-origin writes are rejected.
- [ ] Quiet refresh and the session-ended flow work.
- [ ] The same app signs in through Identity (Razor login, GitHub) with sessions in Redis.
