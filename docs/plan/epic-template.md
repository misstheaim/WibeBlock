# Epic template

One file per epic at `parts/<part>/<feature>/epics/<ID>-<kebab-name>.md` (e.g. `parts/studio/codegen/epics/S-01-project-schema-and-codegen-engine.md`). Each feature document lists its epics with summaries, dependencies and phases, and links to these files.

Epics are detailed enough to write user stories and tickets from, but they do not contain tickets. Tickets reference the epic ID and the user story number (e.g. `S-04 / US-3`).

## Template

```markdown
# <ID> — <Epic name>

> Part: <Studio | Platform | Learning track> · Phase: <n> · Depends on: <IDs> · Status: draft | ready | in progress | done

## Goal
One paragraph: what the user (or developer/operator) can do when this epic is done, and why it matters.

## Scope
- In: …
- Out (and where it lives instead): …

## Concepts and model
Data structures, schema changes, new terms. Reference `packages/core` types where relevant.

## User stories
- **US-1** As a <role>, I can <action> so that <benefit>.
  - Acceptance: …
- **US-2** …

## UX notes
Screens, panels, interactions, Developer-mode differences. Sketches or references welcome.

## Technical design
Architecture, components touched, APIs/contracts, libraries, codegen or service impact, data migrations.

## Learning notes (learning-track and platform epics)
What technology is being learned, which concepts to cover, reference material.

## Tests (optional)
Where automated tests would pay off and what they should cover. Optional (D-14): the owner decides per ticket, usually having an AI agent write them after the implementation.

## Risks and open questions
…

## Done when
Checklist of observable outcomes (demo script).
```
