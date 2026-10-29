# S-26 — Logic v1

> Part: Studio · Phase: 3 · Stages: v1 · Depends on: S-25, S-07 · Status: ready

## Goal
The logic canvas grows from toggles to real application behaviour: loading data from an API, repeating blocks for each item of a list, forms with validation, derived values, effects, state shared across pages, and reusable custom hooks built as sub-graphs. The AI can propose a graph from a description. Generated React code stays idiomatic.

## Scope
- In: data fetch node (loading, error, data), list binding (repeat a block per item), form node (fields, validation, submit), derived value, effect, context (app-level state), custom hook (group nodes into a reusable sub-graph), AI-proposed graphs, generated-app library options.
- Out: other frameworks and porting (S-27); backend generation (not planned).

## Concepts and model
- **List port**: a container's input that repeats one child block per item; the item's fields bind to the child's ports.
- **Context node**: state defined once for the app, readable on every page.
- **Custom hook**: a named sub-graph with inputs and outputs, reusable across pages; generated as a `use…` hook.
- **Target options**: which libraries the generated app uses for data and forms (e.g. plain `fetch` + `useEffect` vs TanStack Query; plain state vs a form library), stored in `targets/react/target.json`.

## User stories
- **US-1** `[v1]` As a user, I can load data from an API and show it, with loading and error states, so that my app shows real content.
  - Acceptance: a Fetch node with URL and options; its loading, error and data pins bind to blocks; the run preview shows all three states.
- **US-2** `[v1]` As a user, I can repeat a block for each item of a list, so that cards, rows and menus come from data.
  - Acceptance: binding a list to a container repeats its template child; item fields bind to the child's ports; the design canvas shows a few placeholder repeats.
- **US-3** `[v1]` As a user, I can build forms with validation and a submit action, so that my app collects input.
  - Acceptance: a Form node knows its field ports, validation rules and submit event; errors show next to fields in the run preview.
- **US-4** `[v1]` As a user, I can share state across pages and react to changes, so that things like a cart or a logged-in flag work everywhere.
  - Acceptance: context state is visible on every page's graph; effect nodes run when inputs change; derived nodes compute values.
- **US-5** `[v1]` As a user, I can turn part of a graph into a reusable custom hook, so that I don't rebuild the same logic.
  - Acceptance: selecting nodes → "make hook" creates a named sub-graph with inputs/outputs; it appears in the palette; codegen emits a `use…` hook file.
- **US-6** `[v1]` As a user, I can describe behaviour in words and get a proposed graph, so that I don't need to know every node.
  - Acceptance: an AI action in the Logic workspace returns a graph proposal shown as ghost nodes; accept or discard (D-22).

## UX notes
Sub-graphs open like folders (breadcrumb). Data pins show a preview of their value shape. A target options page explains the library choices in plain words.

## Technical design
Extends the S-25 node registry and React target codegen; AI graph generation is a structured-output task (S-07) with the graph schema.

## Tests (optional)
Golden codegen for each new node type; list repeat binding.

## Risks and open questions
- Node explosion: add nodes only with a concrete sample app needing them.
- Choice of generated-app libraries (plain vs TanStack Query) affects readability of output; decide with a sample.

## Done when
- [ ] A sample app with fetched list, form and shared state is built entirely with the logic canvas and works in the preview and Compact output.
