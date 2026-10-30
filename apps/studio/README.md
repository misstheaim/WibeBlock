# @wibeblock/studio-app

The local host for the WibeBlock Studio (D-19). It renders `<Studio />` from [`@wibeblock/studio`](../../packages/studio) and, as the Studio grows, passes it the Local adapters (in-memory first, then the Node Runner, S-02 and S-09). The editor itself lives in the package; this app only wires it up. No login and no account code belong here.

## Stack

- Vite 8 + React 19, with the React Compiler enabled through `@rolldown/plugin-babel` and `reactCompilerPreset()` in [vite.config.ts](vite.config.ts).
- TypeScript: [tsconfig.app.json](tsconfig.app.json) extends the root `tsconfig.base.json`; [tsconfig.node.json](tsconfig.node.json) covers the Vite config.
- ESLint with typescript-eslint and the React Hooks and React Refresh plugins ([eslint.config.js](eslint.config.js)).
- `@wibeblock/studio` is linked with `workspace:*`. React, React DOM, their types and TypeScript come from the workspace catalog (`catalog:`).

## Running

From the repo root:

```bash
pnpm install
pnpm dev
```

To run only this app's scripts: `pnpm --filter @wibeblock/studio-app <dev|build|lint|preview>`.

Changes in `packages/studio` hot-reload here, because the package is source-only and Vite compiles it directly.

See [docs/development.md](../../docs/development.md) for the workspace conventions and workflow.
