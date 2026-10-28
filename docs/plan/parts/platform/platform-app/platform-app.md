# Feature — Platform app

> Part: [Platform](../platform.md) · Epics: P-08, P-14

## Purpose

The platform's host for the Studio (D-19, D-26): a React Router v7 app (`apps/platform`) in framework mode with server rendering, acting as a backend-for-frontend, with login, the project dashboard and the account pages, which renders the Studio package on its editor route with platform adapters. Someone who clones the repo and runs `npm start` gets only the local Studio; everything about accounts lives here. Plus an optional static landing page.

## Design notes

- **Hosts, not runtime modes** (D-19): `packages/studio` is the editor and knows nothing about login or accounts. Each host passes its own adapters: `apps/studio` (Local, Runner adapters), `apps/vscode-ext` (VS Code), `apps/platform` (Connected and Cloud). The mode is chosen by which host runs, not by a settings screen.
- **Routes:** `/projects` (dashboard), `/projects/:id/edit` (the Studio with platform adapters and the access token), `/account` (profile, BYO API keys encrypted at rest), `/billing` (plan, usage, Stripe customer portal), `/account/data` (GDPR export and delete), plus the OIDC callback.
- **Slots:** the Studio exposes a few slots (user menu in the top bar, a share/export area); the platform app fills them with React components, the local host leaves them empty.
- **Framework (D-26):** React Router v7 framework mode: server-rendered dashboard and account pages with loaders and actions, streaming where useful; the editor route renders the client-side Studio. This is where the project learns server-side React.
- **Auth as a BFF (D-26):** the platform app's Node server runs the OIDC Authorization Code + PKCE flow against Identity (P-03) as a confidential client, keeps tokens server-side and gives the browser an httpOnly session cookie. Browser calls to the API and SignalR go through the same origin; whether the platform app server or YARP attaches the token is decided when P-02, P-03 and P-08 are planned. The Studio package never shows login UI.
- **Typed API client:** generated from the services' OpenAPI documents (e.g. orval producing TanStack Query hooks), so frontend and backend contracts stay in sync.
- **Studio platform adapters (P-16):** storage (Core API, optimistic concurrency with a conflict screen), ai (AI tasks streamed over SignalR, proposals as in Local mode), export (Export service), preview (Sandpack or hosted preview), realtime (SignalR client).
- **Shared code:** `packages/ui` for the look, TanStack Query for platform data, project types from `packages/core`.
- **Preview without a Runner:** Sandpack / esbuild-wasm from S-12's work; if a Runner is running on the same machine, the platform app can still use its Vite preview.
- **Moving projects between Local and the platform:** the platform app imports a Local project folder (File System Access API) or a zip, and downloads a project as a zip to unpack into a local folder. Same JSON on both sides; conflicts resolved by version compare + snapshot.
- **Landing page (optional):** `apps/website`, built with **Astro** as a static site: landing, docs, pricing. It links to sign-in and to the platform app and makes no Core API calls. It can be built at any point or skipped.
- **Learning option, Angular:** the product choice is React (D-19). For learning, an Angular version of the platform app (or part of it) can host the Studio wrapped as a Web Component (`<wibe-studio>`, a custom element that renders the React Studio inside). It costs a second framework on the editor page and no shared UI kit, so it stays an exercise, not the product path.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-08](epics/P-08-platform-app.md) | **Platform app** | React Router v7 app `apps/platform` with server rendering: BFF login, project dashboard, editor route rendering `packages/studio`, slots, import/export of Local projects. | P-03, P-04 | 3 |
| [P-16](epics/P-16-studio-platform-adapters.md) | **Studio platform adapters** | Storage, ai, export, preview and realtime adapters for the Studio against the platform: generated OpenAPI client, SignalR client, optimistic concurrency and conflict screen, Sandpack preview fallback. | P-05, P-06, P-07, P-08 | 3 |
| [P-14](epics/P-14-account-pages-and-landing-page.md) | **Account pages & landing page** | Account, BYO keys, plan and usage, data export/delete in the platform app; optional Astro landing page (landing, docs, pricing). | P-03, P-09 | 4 |
