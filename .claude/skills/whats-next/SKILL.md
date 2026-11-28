---
name: whats-next
description: WibeBlock only. Answers "what's next?" from the plan - the next queued item with a short description, a few alternatives that can start right now, and a short roadmap of what comes after; suggests /plan-part when the planned work runs out. Use when the owner asks what to work on, what's next, or for the next item, ticket or story in the plan, usually at the start of a session.
---

# What's next

The owner usually opens a session by asking what to work on. Give a short, decision-ready answer: the queued item, what else could start now, and where the plan goes after that. This skill only reads; it creates no tickets and moves nothing on the board until the owner picks.

## 1. Gather

Read only what decides the order, cheapest first:

1. `CLAUDE.md` "Current state": the phase and what comes next.
2. `docs/plan/00-master.md` §6 Roadmap, and the newest decisions in `docs/plan/decisions.md` that set the order of the current phase (they win over the roadmap table).
3. The epics of the current phase and the next one: the header (`Status`, `Depends on`) and the stories with their stage tags. Stories in a `draft` epic aren't ready for tickets yet.
4. Progress, which the epics don't record story by story (all read-only):
   - `git fetch origin develop`, then `git log --oneline -15 origin/develop`;
   - `gh issue list --state all --limit 40 --json number,title,state` (titles carry `<epic> / US-n`);
   - `gh pr list --state open`;
   - the board: `gh project item-list 4 --owner misstheaim --format json --limit 100` (status per ticket).

A story is done when its tickets are closed and nothing in its acceptance is left; in progress when a ticket is `In Progress`, `Blocked` or `In Review`.

## 2. Decide

- **Next item:** unfinished work first (a ticket `In Progress`, a `Blocked` one whose blocker is gone, an open PR). Otherwise the next story in the order the plan sets: the phase, then the decisions that order it, then epic dependencies, then story order inside the epic.
- **Alternatives (2–3):** stories that can start right now, with their dependencies met, from the current phase or work the plan allows in parallel. Prefer a different kind of work from the next item (frontend, backend, docs) or a different technology to learn, and say what each trades against the next item.
- **Roadmap:** the 4–6 items after the next one, in order, then one line on what follows the current phase (the next phase and its first epics). Nothing further out.
- **Planning check:** suggest `/plan-part <part or part/feature>` when nothing ready is left, when only two or three ready stories remain in the current and next phase, or when the next work sits in `draft` epics or in features without epic files. Name what to plan and why.
- If the code and the plan disagree (a story built but the plan says otherwise, an order the code has overtaken), say so in one line and suggest the plan update.

## 3. Answer

About 25 lines, in this shape:

```markdown
**Next: <EPIC> / US-n <short title>**
<2–3 lines: what it delivers, why it is next, its size in tickets or sessions, ticket #N or "no ticket yet", and /guide-me or /teach-me with a reason>

**Or start one of these now**
- <item>: <one line on why, and what it trades>
- <item>: …

**Roadmap**
1. <next item>
2. …
After that: <next phase and its first epics, one line>

**Planning:** <only when the check above fires: "/plan-part <target>: <why>">
```

End by asking which one to take. Once the owner picks: create the ticket if there is none (create-ticket, per `CLAUDE.md`), set it `In Progress` on the board, and give the branch commands.
