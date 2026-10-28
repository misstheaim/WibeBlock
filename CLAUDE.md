# WibeBlock

A **pet project of the owner, built for learning**. Two goals carry equal weight:

1. **Product:** a tool with a polished UI for building web apps with AI. The user lays out a tree of blocks, the AI generates what goes inside each block, and **Compact** exports a standalone project (React first).
2. **Learning:** the backend and platform exist mostly so the owner can learn new technologies (.NET, gRPC, RabbitMQ, Kafka, Neo4j, Kubernetes, OpenIddict, Terraform…). A technology can be in the project because it is worth learning, as long as it has a real job in the system.

## How work is done here

The flow from plan to code:

```
plan part (/plan-part) → epics → user stories → tickets (the owner writes them) → /teach-me or /guide-me, 1–2 tickets per session
```

- **Planning** a part of the plan uses the project skill **`/plan-part`** (`.claude/skills/plan-part/`): a design discussion where the owner describes what they want, Claude proposes solutions, and both refine them until the final version, which is then written as epics and user stories. It designs and does not implement.
- **Tickets** are created by the owner from user stories. Don't use `decompose-feature` here, and don't create tickets unless asked.
- **Implementation** happens with the owner's learning skills, one or two tickets per session: **`/teach-me`** (Claude implements step by step and explains each step) or **`/guide-me`** (Claude guides, the owner writes the code). In those modes the goal is the owner's understanding, not speed. Explain the technology, not just the change.
- **Tests are optional** (D-14): never required for a ticket to be done. When the owner wants them, they are usually written by an AI agent after the implementation; epics list where they would pay off.
- No CI on pull requests. GitHub Actions is used only for releases and deployment (see [docs/development.md](docs/development.md)).

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

**The plan is a direction, not a final decision.** Any part, feature or epic can be changed, merged, split or dropped when development teaches us something. Expect that, and act on it:

- Before working on something, read the master plan, the relevant part and feature docs, and the epic. Read upward too: an epic depends on decisions made in its feature and part docs.
- If the code, a new finding or the owner's request conflicts with the plan, say so and suggest updating the plan. Don't silently work around it, and don't treat the plan as a reason to refuse a better idea.
- When a decision changes, update the affected docs at every level (master, part, feature, epic) and add or supersede an entry in `decisions.md`. Mark superseded decisions; don't delete them.
- `IDEA.md` is the original idea draft, kept for history. The plan wins where they differ.

## Technologies and conventions

Read [docs/development.md](docs/development.md) when you need the tech stack, repository layout, how to run things locally, or the branching and release workflow. Not every task needs it.

## Current state

The repo has a plan and a bare Vite + React scaffold in `wibeblock/` (it will become `packages/studio` with a thin local host in `apps/studio`, D-19). Nothing else is built yet.
