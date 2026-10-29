# S-19 — Schema-driven inspector

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: S-18 · Status: ready

## Goal
Each block has a window for managing its style and behaviour, and that window is built from the block's own schema: a container shows layout controls, a leaf shows its prompt and body, a block with ports shows its bindings. Adding a field to the schema adds it to the inspector without hand-writing a new form. Labels are plain language for everyone; Developer mode adds CSS terms and raw JSON.

## Scope
- In: inspector panel with tabs (Layout, Content, Behaviour, Dev); field registry mapping schema field types to controls; frame editing (layout, size, padding, gap, alignment, position); plain-language labels; Developer mode extras; docked vs floating window; multi-selection editing of shared fields.
- Out: the prompt and generation UI itself (S-04, which plugs into the Content tab); bindings editing beyond the list (S-25); mobile overrides (Mobile part).

## Concepts and model
- **Field registry**: a map from a schema field kind (enum, number with unit, size mode, alignment, colour token, text, prompt) to a control from `packages/ui` plus a label and help text.
- **Inspector schema**: the block's Zod schema plus metadata (group, order, label, Developer-only flag, visible-when condition), so the form is generated, not hand-built.
- **Edit transactions**: dragging a number scrubber or typing produces one history entry when the change settles, not one per keystroke.

## User stories
- **US-1** `[alpha]` As a user, I can edit the selected container's layout (direction, gap, alignment, wrap, padding) in plain language, so that I can lay out content without knowing CSS.
  - Acceptance: "Stack: vertical / horizontal / grid", "Spacing between", "Align", "Padding" controls; the canvas updates as I change them; one change is one undo step.
- **US-2** `[alpha]` As a user, I can set a block's width and height to fill, fit content or fixed, so that blocks size the way I expect.
  - Acceptance: a size mode control per axis; fixed shows a number with unit; min/max appear on demand; invalid values are explained inline.
- **US-3** `[alpha]` As a developer, I can add a field to the block schema and see it appear in the inspector, so that the inspector never drifts from the data.
  - Acceptance: a new frame field with registry metadata shows up in the right group with the right control, no inspector code changed.
- **US-4** `[MVP]` As a user, the inspector shows only what makes sense for the selected block, so that it stays simple.
  - Acceptance: containers get Layout and Content (surface); leaves get Size and Content; blocks with ports get Behaviour; fields hide when they don't apply (e.g. grid columns only for grid).
- **US-5** `[MVP]` As a developer, I can switch on Developer mode and see the CSS names, block id and raw JSON, so that I know exactly what is generated.
  - Acceptance: labels gain CSS terms ("Stack → flex-direction"); a Dev tab shows the block JSON (read-only in the MVP) and the generated class list.
- **US-6** `[MVP]` As a user on a small screen, the inspector opens as a floating window next to the selected block, so that the canvas stays large.
  - Acceptance: below the docking threshold the inspector floats near the selection, can be moved and pinned; above it, it is docked on the right.
- **US-7** `[MVP]` As a user, I can edit shared fields of several selected blocks at once, so that consistent changes take one step.
  - Acceptance: with several blocks selected, fields with equal values show the value, differing ones show "mixed"; a change applies to all as one undo step.
- **US-8** `[MVP]` As a user, I can see a block's ports and bindings in a Behaviour tab and jump to the logic canvas, so that behaviour is discoverable from the block.
  - Acceptance: the tab lists ports (inputs and outputs) and which are bound; "open in logic" switches to the Logic workspace with the block's node selected (with S-25; hidden if S-25 is not built).

## UX notes
Groups with headers (Layout, Size, Spacing, Position); compact two-column rows; reset-to-default per field; help tooltips. Changes are live; no "save" button.

## Technical design
React Hook Form with a Zod resolver, fields rendered from registry metadata; `watch`/subscription to dispatch Redux actions on settle; controls from `packages/ui`. The registry is plain data plus components, so new block kinds or targets extend it.

## Tests (optional)
- **First React Testing Library tests by hand (D-16):** the inspector renders the right controls for a container and a leaf, and a change dispatches one action.
- Registry metadata coverage (every schema field has a control or is explicitly hidden).

## Risks and open questions
- Form state vs store state: the store is the truth; the form must reset when the selection changes and not echo its own updates back. Worth a careful first ticket.
- Performance with many fields; subscribe per field rather than re-render the whole form.

## Done when
- [ ] Containers and leaves can be laid out and sized from the inspector in plain language.
- [ ] A new schema field appears in the inspector from metadata alone.
- [ ] (MVP) Contextual tabs, Developer mode, floating window, multi-edit and the Behaviour tab work.
