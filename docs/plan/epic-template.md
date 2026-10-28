# Epic template

One file per epic at `parts/<part>/<feature>/epics/<ID>-<kebab-name>.md` (e.g. `parts/studio/codegen/epics/S-01-project-schema-and-codegen-engine.md`). Each feature document lists its epics with summaries, dependencies and phases, and links to these files.

Epics are detailed enough to write user stories and tickets from, but they do not contain tickets. Tickets reference the epic ID and the user story number (e.g. `S-04 / US-3`).

**Stages (D-25).** Studio work is delivered in stages: `alpha` → `MVP` → `v1` → `garden`. An epic can span stages, so each user story carries a stage tag in square brackets after its number. The header lists the stages the epic touches. An epic is "alpha-done" when its `[alpha]` stories are done. Epics outside the Studio may omit stage tags when the whole epic belongs to one phase.

## Template

```markdown
# <ID> — <Epic name>

> Part: <Studio | Mobile | Platform | Learning track> · Phase: <n> · Stages: <alpha, MVP, v1, garden> · Depends on: <IDs> · Status: draft | ready | in progress | done

## Goal
One paragraph: what the user (or developer/operator) can do when this epic is done, and why it matters.

## Scope
- In: …
- Out (and where it lives instead): …

## Concepts and model
Data structures, schema changes, new terms. Reference `packages/core` types where relevant.

## User stories
- **US-1** `[alpha]` As a <role>, I can <action> so that <benefit>.
  - Acceptance: …
  - Notes: edge cases …
- **US-2** `[MVP]` …

## UX notes
Screens, panels, interactions, Developer-mode differences. Sketches or references welcome.

## Technical design
Architecture, components touched, APIs/contracts, libraries, codegen or service impact, data migrations.

## Learning notes (learning-track and platform epics)
What technology is being learned, which concepts to cover, reference material.

## Tests (optional)
Where automated tests would pay off and what they should cover. Optional (D-14, D-16): the owner decides per ticket. If this epic is the first one for a toolkit (see D-16), mark the tests the owner writes by hand to learn it; later tests are usually delegated to an AI agent.

## Risks and open questions
…

## Done when
Checklist of observable outcomes (demo script).
```
