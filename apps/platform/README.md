# @wibeblock/platform-app

The platform host (D-19, D-26): the React app with sign-in, the dashboard, account pages and the editor route that renders `<Studio />` from [`@wibeblock/studio`](../../packages/studio). It runs React Router v8 in framework mode with server rendering; its server is the BFF that calls the API (D-34). Until the backend skeleton exists, it runs against MSW mocks (D-33).

## Stack

- React Router v8 (framework mode, `ssr: true`), Vite, React 19 with the React Compiler.
- Tailwind v4 and the shared kit [`@wibeblock/ui`](../../packages/ui); Zod for form schemas.
- MSW in the dev server for the mocked API ([app/mocks/](app/mocks/)).

## Running

From the repo root:

```bash
pnpm install
pnpm dev:platform
```

Copy [.env.example](.env.example) to `.env` once; it explains each setting (`API_BASE_URL`, `API_MOCKS`, `API_MOCK_SCENARIO`).

This app's scripts: `pnpm --filter @wibeblock/platform-app <dev|build|start|typecheck>`. `build` doesn't type-check, so run `typecheck` before merging.

See [docs/development.md](../../docs/development.md) for the workflow and the conventions (routes, the API client, mocks and error handling).
