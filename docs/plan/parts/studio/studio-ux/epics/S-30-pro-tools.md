# S-30 — Pro tools

> Part: Studio · Phase: 7 · Stages: garden · Depends on: S-18, S-19 · Status: draft (placeholder, to be designed)

## Goal
The side panels grow professional tools familiar from Figma and Photoshop, adapted to a flex/grid world (D-01): layer locking, hiding and grouping, align and distribute, guides and measurements, and reusable components (one block definition used in many places, with overrides). To be designed in a later session; this file collects candidate ideas.

## Candidate ideas
- **Photoshop-style layers** (D-30): a real Layers panel for stacking order, visibility, opacity and blend effects of overlapping elements (inside overlay containers and inside bodies), separate from the Structure panel.
- **Structure panel extras**: lock, hide in editor, colour labels, groups that don't affect layout, search and filters.
- **Arrange**: align and distribute inside a container (maps to justify/align/gap), equalise sizes.
- **Measure**: hover distances between blocks, rulers, spacing overlay, guides.
- **Components**: turn a block into a reusable component; instances with overridable prompts/text; update all instances.
- **Style tools**: copy/paste style between blocks; element-level style editing inside a body.

## User stories
- **US-1** `[garden]` As a user, I can turn a block into a reusable component and use it in many places, so that changes apply everywhere.
  - Acceptance: to be defined in the design session.

## Risks and open questions
- Reusable components touch the schema, codegen and logic (instances with ports); likely its own epic when designed.

## Done when
To be defined.
