# WibeBlock

A **pet project of the owner, built for learning**. Two goals carry equal weight:

1. **Product:** a tool with a polished UI for building web apps with AI. The user lays out a tree of blocks, the AI generates what goes inside each block, and **Compact** exports a standalone project (React first).
2. **Learning:** the backend and platform exist mostly so the owner can learn new technologies (.NET, gRPC, RabbitMQ, Kafka, Neo4j, Kubernetes, OpenIddict, Terraform…). A technology can be in the project because it is worth learning, as long as it has a real job in the system.

## How work is done here

```
plan part (/plan-part) → epics → user stories → tickets → /teach-me or /guide-me, 1–2 tickets per session
```

- **Planning** uses the project skill **`/plan-part`**: a design discussion that ends in epics and user stories. It designs and does not implement.
- **What's next:** when the owner asks what to work on (usually at session start), use the project skill **`whats-next`**: the next item, alternatives that can start now, a short roadmap, and `/plan-part` when the planned work runs out.
- **Docs check:** after a session that changed a big chunk of the docs (a `/plan-part` run, a decision changed at several levels, a docs restructure, or five or more docs, memory and skills included), end with a one-line suggestion to run the project skill **`/docs-check`**: it re-checks every doc for conflicts and republishes the [docs map](https://claude.ai/artifact/CGotLoVZC1juTA1VB6YoSb).
- **No implementation starts without a ticket**, including `/guide-me` and `/teach-me`. If there is no GitHub issue for the work, write one with the `create-ticket` skill from the one template ([.github/ISSUE_TEMPLATE/ticket.md](.github/ISSUE_TEMPLATE/ticket.md)), referencing `<epic> / US-n`. **Creating tickets needs no approval** (standing permission, 2026-11-04): create it, then show its link and body. Editing, closing or labelling existing issues still needs approval. Don't use `decompose-feature`, and don't create tickets for work that isn't about to start.
- **Project board:** the agent keeps its ticket's status in step without asking (standing permission, 2026-11-23): `Todo` on creation, `In Progress` at the first step, `Blocked` when the owner agrees it must wait, `In Review` when the PR opens. When the owner opens the PR, the session-end git block includes the command. Statuses, IDs and commands: [docs/development.md](docs/development.md).
- **Implementation** uses the owner's learning skills: **`/teach-me`** (Claude implements and explains each step) or **`/guide-me`** (Claude guides, the owner writes the code). The goal is the owner's understanding, not speed. Explain the technology, not just the change.
- **Tests are optional** (D-14). No CI on pull requests.

## The plan

The plan lives in `docs/plan/` and has four levels:

```
docs/plan/00-master.md                                  whole application, phases, principles, concepts
docs/plan/decisions.md                                  decision log (D-nn)
docs/plan/epic-template.md                              template for epic files
docs/plan/visual/plan-map.html                          source of the visual plan map artifact (link in 00-master.md)
docs/plan/parts/<part>/<part>.md                        part: studio · mobile · platform · learning-track
docs/plan/parts/<part>/<feature>/<feature>.md           feature: one subsystem, design notes, epic table
docs/plan/parts/<part>/<feature>/epics/<ID>-<name>.md   epic: detailed feature, user stories
```

Epic IDs: `S-nn` Studio, `M-nn` Mobile, `P-nn` Platform, `L-nn` Learning track. Tickets refer to them as `S-04 / US-3`.

**The plan is a direction, not a final decision.** Any part, feature or epic can be changed, merged, split or dropped when development teaches us something:

- Before working on something, read the master plan, the relevant part and feature docs, and the epic. Read upward too: an epic depends on decisions made in its feature and part docs.
- If the code, a new finding or the owner's request conflicts with the plan, say so and suggest updating the plan. Don't silently work around it, and don't treat the plan as a reason to refuse a better idea.
- When a decision changes, update the affected docs at every level (master, part, feature, epic) and add or supersede an entry in `decisions.md`. Mark superseded decisions; don't delete them.
- **When a ticket's work is done** (before the session-end git block, in the same branch), bring the plan in line with what was built. Update the epic where the implementation differs from it (a story split or changed, an approach replaced), and the higher levels and `decisions.md` if a decision changed. Set the epic's `Status`: `in progress` from its first merged ticket, `done` when all its stories are. Keep it short: the plan says what and why, not how the code does it.
- `IDEA.md` is the original idea draft, kept for history. The plan wins where they differ.

## Docs

| File | Holds | Read |
|---|---|---|
| `CLAUDE.md` | what every session needs | always |
| [docs/development.md](docs/development.md) | running and checking the code, git, tickets, the board | every development session |
| [docs/conventions.md](docs/conventions.md) | rules for writing code | when writing code |
| `docs/plan/` | what to build, technologies, decisions | before working on an epic, and again when the work is done (see "The plan") |

Other docs (readmes, memory, the plan) point readers to `docs/development.md`, which links the conventions, not straight to `docs/conventions.md`, so moving a doc changes one link. Saying where a new convention is written (`docs/conventions.md`) is fine.

Keep them small. When work ends, add to them only what the code can't tell you:
- a convention for new code;
- a non-obvious reason;
- how to run or try something;
- a trap.

Write each item as one or two lines in the file it belongs to. Don't describe what a file does, its props or a message table, and don't list features here. This also applies when an epic or ticket asks to "document X in development.md". `Current state` below stays at a few lines: the phase, what exists, what comes next.

## Current state

Phase 0, the platform skeleton (D-33). What exists:
- `packages/ui`: the UI kit (P-17);
- `apps/platform`: the React Router v8 frontend (P-08, P-19), against MSW mocks, with no sign-in yet;
- `apps/studio` + `packages/studio`: a stub until the Studio alpha.

Next comes P-19 US-4 (the account page), then the backend skeleton (P-01, P-03, P-02), then sign-in (P-18). The light/dark switch and Storybook come last (D-40).
