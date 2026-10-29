# Feature — Logic

> Part: [Studio](../studio.md) · Epics: S-25, S-26, S-27

## Purpose

WibeBlock builds real applications, not just styled pages. The **logic canvas** is a second canvas, next to the design canvas, where the user builds an app's behaviour as **blueprint-style graphs** (nodes and wires, like Unreal Engine Blueprints) bound to the UI blocks. Each chosen framework has its own logic layer and canvas (D-21), so React logic uses React concepts (state, effects, context, hooks) and a future Angular layer uses Angular ones (signals, services).

## Concepts

- **Port**: a connection point on a block. *Inputs* the logic can drive: text, list, value, visible, enabled. *Outputs* the logic can listen to: click, submit, change. Every block has built-in ports (visible, click); the AI marks further ports inside a body when it generates it ("this heading is a text port named `title`", "this button is an event port named `subscribe`").
- **Logic graph**: per page and per framework: **nodes** (state, event, set state, navigate, condition, …), **edges** between node pins (data edges carry values; event edges carry "this happened"), and **bindings** between node pins and block ports.
- **Block node**: dragging a block from the Structure panel into the graph creates a node that shows the block's ports as pins.
- **Completeness**: a framework layer is complete when every port that some layer binds is also bound in it; the validator lists unbound and broken bindings (needed for porting, S-27).
- **Codegen**: the React target turns a page graph into hooks and handlers in the page component (and extracts reusable hooks in v1).

## Design notes

- **React Flow (xyflow)** for the canvas; custom node components; typed pins (text, number, boolean, list, event) with connection validation.
- The design canvas never runs logic (D-20). It marks bound blocks and can show a state preview later; real behaviour is checked in the run preview.
- Graph edits are document actions like any other, so they are undoable and part of history.
- **MVP node set** (S-25, optional for the MVP): State (text, number, boolean), Block (ports), Event, Set state, Toggle, Navigate, Condition, Bind (to a port input). Enough for "button toggles a panel", "input text shows in a heading", "link goes to another page".
- **v1 node set** (S-26): data fetch with loading and error, list (repeat a block for each item), form (fields, validation, submit), derived value, effect, context (shared state across pages), custom hook (group nodes into a reusable sub-graph). AI can propose a graph from a description.
- **Generated-app libraries** (e.g. plain `fetch` vs TanStack Query for data, form handling) are a target option recorded in `targets/react/target.json`; decide in S-26.
- **Porting** (S-27, garden): add a target layer to an existing project either with AI (a proposal that builds the new graph from the React graph and the ports) or with a manual tool (side-by-side graphs, port checklist, node mapping hints).

## Epics

| ID | Epic | Summary | Depends on | Phase | Stages |
|---|---|---|---|---|---|
| [S-25](epics/S-25-logic-canvas-foundation.md) | **Logic canvas foundation** | Logic workspace with React Flow, ports and bindings, block nodes, minimal React node set, validation, logic markers on the design canvas, React codegen of the graph. Optional for the MVP. | S-01, S-03, S-19 | 2 | MVP (optional) |
| [S-26](epics/S-26-logic-v1.md) | **Logic v1** | Data fetch, lists, forms, derived values, effects, context, custom hooks as sub-graphs, AI-proposed graphs, generated-app library options. | S-25, S-07 | 3 | v1 |
| [S-27](epics/S-27-framework-porting.md) | **Framework porting** | Add a framework layer to a project, AI porting via proposals, manual porting tool, completeness checks. | S-26, S-17 | 7 | garden |
