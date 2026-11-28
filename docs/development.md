# Development

How work is done day to day: running and checking the code, and the git, ticket and board workflow.

- **Conventions** for writing code: [conventions.md](conventions.md).
- **Technologies and the target repo layout** are in the plan: [00-master.md](plan/00-master.md) §5, the [Studio part](plan/parts/studio/studio.md) §6 and the [Platform part](plan/parts/platform/platform.md). The reasons are in [decisions.md](plan/decisions.md).

## Repository today

A pnpm workspace at the root (D-32); folders appear when their epic starts.

```
apps/platform     @wibeblock/platform-app: React Router v8 framework mode, server rendering + BFF
apps/studio       @wibeblock/studio-app: local host for the Studio
packages/studio   @wibeblock/studio: the editor as a React package (a stub until the Studio alpha)
packages/ui       @wibeblock/ui: the shared UI kit
docs/             the plan, this file, conventions.md
```

## Running locally

- **Prerequisites:** Node LTS (`.nvmrc`) and pnpm (`npm install -g pnpm`; the exact version is pinned in the root `package.json`).
- From the root: `pnpm install`, then `pnpm dev` (every app in parallel, each prints its URL) or `pnpm dev:platform` / `pnpm dev:studio`.
- **Platform settings:** copy `apps/platform/.env.example` to `.env` once; the file explains each variable. Shell values win, e.g. `$env:API_MOCK_SCENARIO = "slow"; pnpm dev:platform`. After editing `.env`, stop the dev server and start it again: Vite's own restart keeps the old values. A production build (`pnpm build`, then `pnpm start` in `apps/platform`) reads no `.env`, so set real environment variables. There is no sign-in until P-18; a fixed mock user stands in.
- **Secrets** go in git-ignored `.env` files. Never commit API keys.

## Checks

There is no CI on pull requests (D-13). Before merging, run `pnpm build`, `pnpm lint` and `pnpm --filter @wibeblock/platform-app typecheck` (`react-router build` doesn't type-check). `pnpm format` runs Prettier over everything.

Tests are optional (D-14, D-16) and never required for a ticket. Epics list where they would pay off. The owner writes the first tests with each toolkit, then usually asks an agent for more.

## Workflow

Git flow (D-31): features are squash-merged into `develop`, releases are merge-committed into `master`.

### Branches

- `develop` is the default and integration branch.
- `master` holds released code only; every commit on it carries a version tag.
- Work branches (`feature/`, `fix/`, `refactor/`, `docs/`, `chore/`) start from `origin/develop`:
  1. `git fetch origin develop`
  2. `git switch -c feature/42-short-name origin/develop`
  3. Open a PR into `develop` and squash merge it.
- Rulesets on both branches: no deletion or force-push, changes only through PRs (0 approvals needed). `develop` allows squash and merge commits, `master` merge commits only. Admins can bypass in an emergency.

### Releases

1. Create `release/<version>` from `develop`; only fixes, version bumps and notes go on it.
2. Open a PR into `master` and merge it with a **merge commit**.
3. Tag that commit `v<version>` and push the tag; the release workflow runs from the tag.
4. Merge `master` back into `develop` with a **merge commit** (a PR).

Hotfixes go the same way, starting from `master` (`hotfix/<desc>`, patch tag). Never squash or rebase `release/*` → `master` or `master` → `develop`: the next merge between them would conflict. Milestone versions are in D-33.

### Tickets

- Tickets are GitHub issues made from the one template ([.github/ISSUE_TEMPLATE/ticket.md](../.github/ISSUE_TEMPLATE/ticket.md)), each referencing its epic and story (`S-02 / US-1`).
- Names use the issue number:
  - branch `feature/42-studio-package`
  - commit `feat(#42): add studio package` (Conventional Commits)
  - PR title `#42 Add studio package`, with `Closes #42` in the body
- `Closes #42` works only on merges into the default branch, which is why that is `develop`.
- Plan changes go in the same branch as the work that caused them.

### Project board

Tickets live on the GitHub Project **WibeBlock** (owner `misstheaim`, number `4`).

| Status | When | Moved by |
|---|---|---|
| `Todo` | issue created | the board's auto-add workflow; the agent also sets it when it creates a ticket |
| `In Progress` | the work's first step | the agent |
| `Blocked` | a started ticket must wait for another feature (owner agrees; the branch is kept, back to `In Progress` when work resumes) | the agent |
| `In Review` | PR opened | whoever opens the PR (the owner runs the command from the session-end git block) |
| `Done` | PR merged | GitHub (`Closes #N` + the "Item closed" workflow) |

The agent moves only its own ticket, and never backwards without asking. Moves use `gh` (needs the `project` scope: `gh auth refresh -s project`):

```bash
# item id of an issue on the board (adds it if missing)
gh project item-add 4 --owner misstheaim --url https://github.com/misstheaim/WibeBlock/issues/<N> --format json --jq .id
# set its status
gh project item-edit --id <item-id> --project-id PVT_kwHOB4W9ys4Bs3Mv --field-id PVTSSF_lAHOB4W9ys4Bs3MvzhrDS9w --single-select-option-id <option>
```

Options: `Todo` `f75ad846` · `In Progress` `47fc9ee4` · `Blocked` `a6c3bcb1` · `In Review` `05f20bba` · `Done` `98236657`. If an ID stops working, look it up again with `gh project list --owner misstheaim --format json` and `gh project field-list 4 --owner misstheaim --format json`.
