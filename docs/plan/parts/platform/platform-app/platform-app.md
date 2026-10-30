# Feature — Platform app

> Part: [Platform](../platform.md) · Epics: P-17, P-08, P-18, P-19, P-20, P-16, P-14

## Purpose

The platform's host for the Studio (D-19, D-26): a React Router v8 app (`apps/platform`) in framework mode with server rendering, acting as a backend-for-frontend, with login, the project dashboard and the account pages, which renders the Studio package on its editor route with platform adapters. Someone who clones the repo and runs `pnpm dev:studio` gets only the local Studio (`pnpm dev` starts every app, D-36); everything about accounts lives here. Plus the shared UI kit it starts (`packages/ui`) and a static landing page.

It is the **first thing built** in the project (Phase 0, D-33): a platform skeleton with a Studio stub, simple authentication, profile management and a basic UI, built frontend first against mocks, then connected to the backend skeleton.

## Design notes

- **Hosts, not runtime modes** (D-19): `packages/studio` is the editor and knows nothing about login or accounts. Each host passes its own adapters: `apps/studio` (Local, Runner adapters), `apps/vscode-ext` (VS Code), `apps/platform` (Connected and Cloud). The mode is chosen by which host runs, not by a settings screen.
- **Routes:** `/projects` (dashboard; a placeholder in the skeleton), `/projects/:id/edit` (the Studio; a stub in the skeleton), `/profile` (how I appear), `/account` (how I sign in; links to Identity), the auth routes; later `/billing` and account extras (P-14).
- **Layout:** a top bar with navigation and the user menu; the editor route is full screen with the user menu in the Studio's slot. The UI is refined while building; there is no separate design document.
- **Slots:** the Studio exposes a few slots (user menu in the top bar, a share/export area); the platform app fills them with React components, the local host leaves them empty.
- **Framework (D-26):** React Router v8 framework mode: server-rendered pages with **loaders and actions**; the editor route renders the client-side Studio. **No TanStack Query in the platform pages**: loaders already load data on the server; TanStack Query stays in the Studio and its adapters (D-33, P-16).
- **Auth as a BFF (D-26, D-34):** the platform app's Node server runs the OIDC Authorization Code + PKCE flow as a confidential client, keeps tokens in a server-side session (memory, then Redis) and gives the browser an httpOnly session cookie. Loaders and actions call the Gateway with the access token; browser calls go through the app's `/api/*` forwarding route. YARP is a plain gateway. The Studio package never shows login UI and never sees a token.
- **Frontend first, with mocks (D-33):** login runs against a **mock OIDC server** (Docker) and API data comes from **MSW** in the server process until the backend skeleton exists; then configuration switches to Identity and the Gateway, and the frontend's API client absorbs any differences.
- **Typed API client:** once the Core API exists, types are generated from its OpenAPI document (orval or `openapi-typescript`, chosen in P-19 US-6).
- **Look and themes (D-35):** built from `packages/ui` (P-17) with semantic tokens; light and dark modes chosen by the user, kept in a cookie for the first paint and in the profile; later customisable with the Studio's theme editor.
- **Studio platform adapters (P-16):** storage (Core API, optimistic concurrency with a conflict screen), ai (AI tasks streamed over SignalR, proposals as in Local mode), export (Export service), preview (Sandpack or hosted preview), realtime (SignalR client).
- **Shared code:** `packages/ui` for the look, project types from `packages/core`.
- **Preview without a Runner:** Sandpack / esbuild-wasm from S-12's work; if a Runner is running on the same machine, the platform app can still use its Vite preview.
- **Moving projects between Local and the platform:** the platform app imports a Local project folder (File System Access API) or a zip, and downloads a project as a zip to unpack into a local folder (P-08 US-8).
- **Landing page:** `apps/website`, a static **Astro** site (P-20). Its one button opens the platform app, which decides between dashboard and sign-in; the site never handles auth. Docs and pricing come later.
- **Learning option, Angular:** the product choice is React (D-19). For learning, an Angular version of the platform app (or part of it) can host the Studio wrapped as a Web Component (`<wibe-studio>`). It costs a second framework on the editor page and no shared UI kit, so it stays an exercise, not the product path.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-17](epics/P-17-ui-foundation.md) | **UI foundation** (`packages/ui`) | Semantic tokens with light and dark modes, base components on Tailwind v4 + Radix + CVA, Storybook; shared later with the Studio. | — | 0 |
| [P-08](epics/P-08-platform-app-shell.md) | **Platform app shell** | React Router v8 app with server rendering: layouts, user menu, dashboard placeholder, editor route with the Studio stub, error and loading states, light/dark without flash, mocked-backend mode; later the real project list and Local import/export. | P-17 | 0, 2, 3 |
| [P-18](epics/P-18-bff-authentication.md) | **BFF authentication** | OIDC sign-in/out on the server (Code + PKCE, confidential client), server-side sessions, protected routes, quiet refresh, `/api/*` forwarding with CSRF protection; mock login server first, then Identity and Redis. | P-08 | 0 |
| [P-19](epics/P-19-profile-and-account.md) | **Profile & account** | Profile page and display name, theme preference that follows the user, account page linking to Identity; Core API Accounts module; switch from mocks to the real API. | P-08, P-18 | 0 |
| [P-20](epics/P-20-landing-page.md) | **Landing page (Astro)** | Static landing page with one "Open WibeBlock" button; later docs and pricing. | P-17, P-08 | 0, 4 |
| [P-16](epics/P-16-studio-platform-adapters.md) | **Studio platform adapters** | Storage, ai, export, preview and realtime adapters for the Studio against the platform: generated OpenAPI client, SignalR client, optimistic concurrency and conflict screen, Sandpack preview fallback. | P-05, P-06, P-07, P-08 | 3 |
| [P-14](epics/P-14-account-extras.md) | **Account extras** | BYO API keys (encrypted at rest), plan and usage, data export and account deletion in the platform app. | P-19, P-09 | 4 |
