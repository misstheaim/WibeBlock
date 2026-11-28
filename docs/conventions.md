# Conventions

Rules for writing code here, in short. The code is the reference for details; this file keeps only what the code can't tell you: the rule to follow, a non-obvious reason, how to try something, a trap. The platform app's and the kit's conventions are also the reference for generated projects (D-41): when you change one, check whether a generated `react-vite` project would follow it too.

## Workspace

- Internal packages are source-only: `exports` points at `src/index.ts` and the host's Vite compiles them. A package gets a build step only when something outside the workspace consumes it.
- Names use the `@wibeblock/` scope; apps depend on packages with `workspace:*`.
- Shared versions go in the `catalog:` of `pnpm-workspace.yaml` (alphabetical) as soon as a second package will use them. Libraries take React as a peer dependency, so only one React loads.
- TypeScript projects extend `tsconfig.base.json`. TypeScript stays on 6.x until typescript-eslint supports 7.
- Split folders and packages when the code needs it, not up front.

## Formatting and linting

- Prettier decides how code looks (`prettier-plugin-tailwindcss` sorts classes); ESLint only reports likely bugs, its style rules are off. One flat config at the root ([eslint.config.js](../eslint.config.js)) covers every package; no package has its own.
- Hot-reload hints (`react-refresh/only-export-components`) are warnings and don't fail `pnpm lint`.
- VS Code: install the recommended extensions (`.vscode/extensions.json`), format on save with Prettier, and associate `*.css` with the `tailwindcss` language mode, or the CSS checker flags `@theme`, `@apply` and `@source`.

## Styling

- Tailwind classes live only in variants or styles files (`*Variants.ts` in the kit, `*Styles.ts` in apps), never in a component `.tsx`. Each class appears once; a look shared by several components is one constant (in the kit, `src/lib/`).
- Colours come from tokens (`bg-background`, `text-foreground`…), never `dark:` (D-38).
- An app's stylesheet imports `tailwindcss` first, then `@wibeblock/ui/styles.css`.

## `packages/ui`

- One folder per component in `src/components/<kebab-name>/`: `Component.tsx`, `componentVariants.ts`, stories, and an `index.ts` that names the public parts. Variants get their own file because a file that exports a component must export only components, or fast refresh reloads the whole page. `src/index.ts` re-exports each folder; apps never import deep paths.
- A component accepts its element's native props plus its variants, sets safe defaults (`type="button"`) before spreading the rest, merges `className` last with `cn`, and exports its CVA function too. A native attribute that clashes with a variant name is removed with `Omit`. A component built on another kit component wraps it.
- Form controls read `FormField`'s context (`id`, `aria-describedby`, `aria-invalid`) and spread it before `...rest`, so they work inside and outside a `FormField`. The error look comes from `aria-invalid:` classes, never from a prop.

## `apps/platform`

- Routes are declared in `app/routes.ts`, not by file names. Route modules in `app/routes/` (kebab-case) stay thin: `meta`, `loader`, `action` and a page that composes features. Layouts in `app/layouts/` own the frame and the single `<main>`; pages render only their content.
- Features go in `app/features/<name>/` once a route grows or two routes share UI; app-wide helpers in `app/lib/`.
- Server-only code ends in `.server.ts`; the build fails if browser code imports it.
- Dev-only pages live under `/dev/*`.

### API

- Only `app/lib/api.server.ts` calls the API. Each backend module gets one `app/lib/<module>.server.ts` with its types and endpoint functions; form schemas stay with their feature. Loaders and actions call the endpoint functions, components read `loaderData`, and pages inside the signed-in layout reuse its profile (`useRouteLoaderData("layouts/signed-in")`) instead of fetching again.
- The API answers errors with RFC 9457 problem details, as ASP.NET Core does; validation failures are `400` with an `errors` map keyed by camelCase field. The client throws `ApiError` for any non-2xx.
- When the API can't be reached, the client throws a `503` `Response`, not an `Error`: in production React Router replaces a server `Error` with "Unexpected Server Error", while a thrown response keeps its status and body (`isRouteErrorResponse` in the boundary).

### Mocks (until P-19 US-6)

- MSW runs inside the dev server, started by the Vite plugin in `app/mocks/index.server.ts`. App code never imports `app/mocks/`, so the mocks never reach the build. Mock files import each other with the `.server.ts` extension (Vite's native config loader needs it).
- A new endpoint is a handler in `handlers.server.ts`, wrapped in `mock(...)` so the scenario applies.
- Mock state lives in memory until the dev server restarts. `PATCH /accounts/me` rejects the name `admin`, to test API-side validation past the form's own checks.

### Loading and errors

- New pages go inside the `page-boundary` layout in `routes.ts`: its `ErrorBoundary` keeps the top bar. The root boundary covers the layouts and the editor route.
- Every boundary renders `ErrorView` with `describeError(error)` and sets the tab title in `meta({ error })`: with an error, only the `meta` functions up to the boundary route run.
- Try each state: `/dev/errors?kind=500|503|404|render|flaky`, any unknown URL, `API_MOCK_SCENARIO=error` (root boundary) or `slow` (progress bar), `API_MOCKS=off` (unreachable).
- Never point the dev server's `API_BASE_URL` at the dev server itself: its layout loader would call itself forever.
