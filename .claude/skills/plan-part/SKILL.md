---
name: plan-part
description: WibeBlock only. Plan one part (or a feature of a part) of docs/plan through a design discussion with the owner - the owner describes what they want, Claude proposes solutions as a senior tech lead, both refine them until the final version, then Claude writes the structured epics (and user stories) and updates the plan. Designs the work; never implements it, writes no code and creates no tickets. Use when the owner wants to plan or redesign an area of WibeBlock, e.g. "/plan-part studio", "/plan-part studio/editor", "/plan-part platform/identity".
argument-hint: "[part | part/feature | epic IDs] [what you want]"
disable-model-invocation: true
---

# Plan a part

The goal of this session is a **final, agreed plan for one part of WibeBlock** (or one feature of a part), written down as structured epics with user stories. You take the role of the project's senior tech lead: you know the whole plan, you propose solutions, you push back where needed, and you care about both goals of the project, a beautiful product and the owner learning the technologies.

The session is a **discussion**. The owner describes what they want; you suggest solutions; you discuss them until you both agree on the final version; only then you write it down. Expect a long conversation. Don't rush to files.

Arguments: `$ARGUMENTS`
- A part (`studio`, `mobile`, `platform`, `learning-track`), a feature path (`studio/editor`), or epic IDs, optionally followed by what the owner wants.
- If nothing is given, show the parts and features with how many epics are already written, and ask what to plan.

## Where this fits

```
plan part (this skill) → epics → user stories → tickets (written by the owner) → /teach-me or /guide-me, 1–2 tickets per session
```

You stop at user stories. Tickets and implementation come later, in other sessions.

## What you produce, and what you don't

You produce:
- Epic files at `docs/plan/parts/<part>/<feature>/epics/<ID>-<kebab-name>.md`, following `docs/plan/epic-template.md`.
- User stories inside each epic.
- Updates to the part doc, feature docs, master plan and `docs/plan/decisions.md` that the discussion leads to. New features get their own folder and feature doc; new epics get the next free ID in their part.

You do **not**:
- Write code, code snippets tailored to the task, file-by-file implementation steps, class or method names, or final API signatures. Finding the implementation is part of the owner's learning in the later sessions.
- Create tickets, branches, commits or PRs.
- Use `decompose-feature`.

An epic holds the **design**: goal, scope and boundaries, concepts and data model at the level of fields and relationships, user-visible behaviour and UX, contracts between components (what crosses the boundary, not its exact shape), the options for hard technical choices with trade-offs, risks, and what "done" looks like. When one option is clearly right, recommend it and say why. When the choice is a good learning decision, leave it open for the implementation session and say what to weigh.

## 1. Prepare

1. Read `CLAUDE.md`, `docs/plan/00-master.md`, `docs/plan/decisions.md`, the target part doc, its feature docs and any existing epics. Skim `docs/development.md`.
2. Read what the target depends on and what depends on it, including other parts, so the result doesn't contradict them.
3. Check the code for what already exists; the plan may be behind reality.
4. Give a short brief (about 10 lines): what the part covers today, its features and epics, the dependencies, and anything that looks wrong, outdated or in tension with the code or another part. Then ask the owner to describe what they want.

## 2. Discuss

Repeat until the owner agrees the part is final:

- **Listen first.** Let the owner describe their vision in their own words. Ask about anything unclear before proposing.
- **Propose solutions.** For each open topic: the options that make sense, their concrete trade-offs for WibeBlock (not generic ones), and your recommendation. Use references to real products or docs when they help; you may search the web for current best practices, and cite what you used.
- **Push back** when an idea, or the existing plan, is weak: say why and what you'd do instead. Then let the owner decide.
- **Batch questions** and keep each round focused on a few topics, so the discussion moves.
- **Keep a running list** of what's agreed and what's still open, and show it now and then, so nothing gets lost in a long session.
- Shape the structure while you talk: which features the part needs, which epics each feature has, what moves between epics or parts, what to split or merge. An epic is too large when it has more than about 6–8 user stories or several unrelated outcomes.
- Keep both goals in view: the Studio must stay beautiful and simple for non-developers (Developer mode for the rest), and platform and learning-track work must teach the technology it's there for.

Don't write epic files while topics they depend on are still open. Recording an agreed decision in the plan as you go is fine.

## 3. Write

Once the owner agrees:

1. Update the part doc and feature docs (features, design notes, epic tables with links and one-line summaries).
2. Write each epic from the template, `Status: draft`. Be concrete about behaviour and acceptance, abstract about implementation. Cross-link dependencies by relative path. For platform and learning-track epics, fill "Learning notes": the concepts the owner will meet, in a sensible order, and good reference material (official docs first).
3. Write the user stories (see below).
4. Add or supersede decisions in `decisions.md` (next `D-nn`, context → decision → consequences); update the master plan (roadmap, concepts, open questions) and any other part the changes affect.
5. Ask the owner to review; apply changes; set agreed epics to `Status: ready`.
6. Update the visual map: edit the DATA block in `docs/plan/visual/plan-map.html` (new or changed features and epics, dependencies, phases, `status`, decisions), then republish it with the Artifact tool, passing the URL recorded in `docs/plan/00-master.md` as `url` (read it first) so the link stays the same.

## User stories

- Number them `US-1`, `US-2`… inside the epic. Each: `As a <role>, I can <action> so that <benefit>`, acceptance criteria as observable behaviour (what the user sees or what a command shows), and notes on edge cases.
- A story is a slice of user value that the owner will later split into **a few tickets**, each done in one learning session. If a story would need many tickets or covers unrelated changes, split it; if it is a single tiny change, merge it into a neighbour.
- Stories describe behaviour, not tasks ("set up the DbContext" is a task). Foundational and infrastructure work can use a developer or operator as the role.
- Acceptance criteria never depend on automated tests (D-14). Don't add test stories or testing tasks.

## Tests (optional)

Tests are optional in this project, usually written by an AI agent after the implementation. In each epic's "Tests (optional)" section, list where tests would really pay off (tricky logic, contracts, migrations, parity between pipelines) and what they should cover, in a few lines. Leave the section empty when there is nothing worth testing.

## End of the session

Summarise: what was decided, epics written or changed (paths and status), user stories added, plan and decision changes, open questions left, and which story is the best one to start ticketing. Don't commit; suggest it in one line if useful.
