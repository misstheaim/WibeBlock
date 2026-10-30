# P-08 — Platform app shell

> Part: Platform · Phase: 0, 2, 3 · Stages: skeleton, foundation, connected · Depends on: P-17 (P-04 for the project list, S-01 for import/export) · Status: draft

## Goal
`apps/platform` becomes a real, server-rendered React app (React Router v8 framework mode, D-26): the layouts, navigation and user menu, a dashboard placeholder, the editor route rendering the `<Studio />` stub, clear error and loading states, and a light/dark switch that is right from the first paint. During the skeleton it runs against a **mocked backend** (D-33), so the whole frontend can be built before any .NET service exists. This is where the project learns server-side React: loaders, actions, nested layouts, error boundaries and hydration.

## Scope
- In: the app in the pnpm workspace; React Router v8 framework mode with server rendering; route configuration; root document (meta, links, mode attribute); public and signed-in layouts; top bar with navigation and user menu; dashboard placeholder; editor route with the Studio stub and its user-menu slot; error boundaries, 404, "backend unavailable" state; navigation progress; light/dark switch remembered per device and applied during server rendering; mocked-backend mode (MSW on the server); a server-only API client the loaders and actions use.
- Out (and where it lives instead): sign-in, sessions and `/api/*` forwarding (P-18); profile and account pages (P-19); landing page (P-20); the Studio's platform adapters (P-16); account extras such as BYO keys, plan and usage (P-14); running under Aspire (P-01 US-1).

## Concepts and model
- **Route map (skeleton):** `/` (signed in → dashboard, signed out → sign-in, P-18), `/projects` (dashboard), `/projects/:id/edit` (editor), `/profile` and `/account` (P-19), plus the auth routes of P-18. Unknown paths → 404.
- **Layouts as nested routes:** a root layout (document, mode, toasts), a **public layout** (minimal: logo, mode switch, sign-in), a **signed-in layout** (top bar, content area) and a **full-screen editor layout** (no top bar; the Studio owns the screen).
- **Server-only API client:** one module, only importable from server code, that knows the API base URL and how to attach the access token (P-18). Loaders and actions use it; components never call the backend directly. Its base URL points at the Gateway (P-02) later; in mocked mode MSW answers.
- **Mocked-backend mode:** a configuration flag that starts MSW's Node interceptor in the server process. Mock handlers and fixtures live in one folder, separated from app code, with switchable scenarios (normal, slow, server error, unauthorised). Turning the flag off is the only change needed to use the real backend; mismatches found then are fixed in the API client (D-33).
- **Mode cookie:** a small, non-secret cookie holding `light` or `dark`; absent means "follow the OS".
- **Slots:** the Studio stub accepts a user-menu slot (D-19); the platform app fills it.

## User stories
- **US-1** `[skeleton]` As a developer, I can run the platform app with server rendering from the repo root, so that I work on it like the Studio.
  - Acceptance: one command from the root starts the dev server (`pnpm dev:platform`, or `pnpm dev` for every app); viewing the page source shows server-rendered HTML; a production build starts with Node and serves the same pages; route types are generated so loader data is typed in components; React Compiler is enabled as in `apps/studio`.
  - Notes: the app was scaffolded from the `create-react-router` default template in the monorepo setup and is wired into the workspace, with the dev scripts, server rendering and route type generation already working (D-36). What remains: React Compiler, the route configuration, the code structure, the production start check, and replacing the template's sample route.
- **US-2** `[skeleton]` As a developer, I can run the app against a mocked backend, so that every screen can be built before the .NET services exist.
  - Acceptance: with the mock flag on, requests from the server to the API base URL are answered by mock handlers with a small realistic delay; a scenario switch (environment variable or a dev-only control) makes them slow, failing (500) or unauthorised (401); with the flag off, the app calls the configured base URL; the production build never includes mocks.
  - Notes: mocks cover only what the skeleton uses (profile, P-19). Login is mocked differently, by a mock OIDC server (P-18).
- **US-3** `[skeleton]` As a signed-in user, I see a clear layout with navigation and my user menu, so that I always know where I am.
  - Acceptance: a top bar with the logo, "Projects" navigation (active item highlighted) and the user menu (avatar, name; Profile, Account, light/dark, Sign out); the layout works from phone width (navigation collapses into a menu) to wide screens; every page sets its own title; keyboard users can skip to the content.
  - Notes: user name and avatar come from the session (P-18); until P-18 is done, a fixed mock user.
- **US-4** `[skeleton]` As a user, I can open the dashboard and from there the editor, so that the main path of the product already exists.
  - Acceptance: `/projects` greets me by name and shows an empty state ("Projects are coming") with a button "Try the editor" that opens `/projects/demo/edit`; the editor route renders `<Studio />` from `packages/studio` full screen, with the user menu in its slot and a way back to the dashboard; a browser refresh on the editor route works.
  - Notes: the Studio stub gets a minimal slot prop here; S-02 designs the real slot and adapter API. Any `:id` opens the stub for now.
- **US-5** `[skeleton]` As a user, I can switch between light and dark mode, and the app remembers it on this device without flashing the wrong mode, so that the switch feels native.
  - Acceptance: the switch in the user menu (and in the public layout) changes the mode instantly without reload; the choice is stored in the mode cookie; a reload renders the chosen mode in the server HTML (no flash, also visible with JavaScript disabled); on a first visit the OS preference is used; P-19 later saves the choice to the profile.
  - Notes: "follow OS" on a first visit needs either a tiny inline script before paint or the client-hints approach; pick one in the ticket and explain the trade-off.
- **US-6** `[skeleton]` As a user, I see what is happening when pages load or something fails, so that the app never looks broken or frozen.
  - Acceptance: a thin progress bar during navigations and form submissions; unknown routes show a 404 page with a link home; an error in one page keeps the layout and shows a message with "Try again"; when the backend is unreachable the page says so in plain words; error details and stack traces appear only in development.
- **US-7** `[foundation]` As a user, I can see, create, rename and delete my projects on the dashboard, so that the placeholder becomes the real entry point.
  - Acceptance: the dashboard lists projects from the Projects module (P-04) with name, last change and a preview placeholder; create opens the editor; rename and delete work with confirmation; an empty state invites me to create the first project.
  - Notes: depends on P-04. The editor still renders the Studio; real adapters arrive with P-16.
- **US-8** `[connected]` As a user, I can import a Local project (folder or zip) and download a platform project as a zip, so that I can move work between Local mode and the platform.
  - Acceptance: import with the File System Access API or a zip upload, validated against the schema (P-04) with readable errors; download produces the same JSON files the Local Studio opens.
  - Notes: depends on S-01 and P-04.

## UX notes
- Top bar, not a sidebar: the skeleton has few pages; revisit when the dashboard grows. UI details will evolve while building, as there is no separate design document.
- The editor route is full screen; the Studio's own top bar holds the platform's user menu (slot).
- Empty states always offer the next step; errors are written for non-developers.

## Technical design
- React Router v8 **framework mode** with its Vite plugin; routes declared in a route config file (explicit and readable) rather than file-system routing, unless the owner prefers the latter after trying both (decide in the first ticket).
- **Server vs client code:** server-only modules (API client, session, mocks) are marked as server-only so they can never be bundled into the browser.
- Data: **loaders and actions** for all platform pages; no TanStack Query here (D-33). Streaming with Suspense only where a page has a slow, non-critical part.
- Node server: the framework's default server first; a custom server (Express) only if P-18 or P-06 needs it (e.g. WebSocket proxying).
- Styling: Tailwind v4 with `@wibeblock/ui` (P-17).
- Code structure inside `apps/platform` (route modules thin, features in folders, where server code lives) is decided in the first step and written up in `docs/development.md`, mirroring S-02's decision for `packages/studio`.

## Learning notes
Concepts in a sensible order:
1. **Server rendering and hydration**: what the server sends, what the browser takes over, why mismatches happen (dates, mode, random values).
2. **React Router framework mode**: route modules, route config, nested routes and `Outlet`, layouts, generated route types.
3. **Loaders and actions**: data on the server, forms that work without JavaScript, revalidation after actions, pending UI.
4. **Error boundaries and status codes**: thrown responses, 404 vs 500, error boundaries per route.
5. **Cookies**: attributes (HttpOnly, Secure, SameSite, Max-Age), reading them during server rendering.
6. **Server/client module boundaries** and environment variables.
7. **MSW in Node**: request interception, handlers, scenarios.

References: [React Router — framework mode](https://reactrouter.com/start/framework/installation) (routing, data loading, actions, pending UI, error boundaries, sessions and cookies chapters), [React — server rendering APIs](https://react.dev/reference/react-dom/server), [React — hydrateRoot and mismatches](https://react.dev/reference/react-dom/client/hydrateRoot), [MSW — Node integration](https://mswjs.io/docs/integrations/node), [MDN — HTTP cookies](https://developer.mozilla.org/docs/Web/HTTP/Cookies).

## Tests (optional)
A Playwright smoke run (sign in with the mock login server, open dashboard, open editor, switch mode, reload) would catch hydration and routing regressions cheaply; D-16 puts the first Playwright tests in S-29, so this can be the first instead if the owner wants it earlier.

## Risks and open questions
- **Two routers** (D-24): the editor route will host the Studio's TanStack Router inside React Router. The stub does not exercise it; S-02's spike must run before the real Studio lands here.
- **Hydration mismatches** around the mode, dates and anything read from the browser.
- **Mocks drifting from the real API**: accepted (D-33); keep handlers small and replace them in P-19 US-6.
- **React Compiler with framework mode**: confirm the Babel plugin setup works with the React Router Vite plugin.

## Done when
- [ ] (skeleton) The app runs with server rendering from the repo root, against mocks.
- [ ] (skeleton) Dashboard placeholder, editor stub with user menu, 404 and error pages work; navigation shows progress.
- [ ] (skeleton) Light/dark switch survives reload with no flash.
- [ ] (foundation) The dashboard lists real projects.
- [ ] (connected) Local projects can be imported and downloaded.
