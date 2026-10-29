# S-25 — Logic canvas foundation

> Part: Studio · Phase: 2 · Stages: MVP (optional) · Depends on: S-01, S-03, S-19 · Status: ready

## Goal
A second canvas, the **Logic** workspace, where the user builds an app's behaviour as a blueprint-style graph bound to UI blocks (D-21). The MVP version is deliberately small: state, events, set state, navigation, conditions and bindings to block ports, which is enough for "this button opens that panel" or "this input fills that heading". It turns into real React hooks and handlers in the generated app. This epic is **optional for the MVP** and can move to v1 without blocking anything.

## Scope
- In: Logic workspace per page (React layer); React Flow canvas; node palette; block nodes with port pins; MVP node set; typed pins and connection validation; bindings; graph validation (broken and unbound bindings); logic markers on the design canvas (with S-03); React codegen of the graph; graph edits in history.
- Out: data, lists, forms, context, custom hooks and AI-generated graphs (S-26); other frameworks and porting (S-27).

## Concepts and model
- **Graph** per page in `targets/react/logic/<pageId>.json`: nodes, edges, bindings (S-01).
- **Pins** are typed: text, number, boolean, event. Data edges connect value pins; event edges connect "when this happens" to "do this".
- **MVP nodes**: State (text, number or boolean, with an initial value), Block (the block's ports as pins), Event (from a block output port), Set state, Toggle, Navigate (to a page), Condition (if/else on a boolean), Bind (state → a block input port: text, visible, value).
- **Binding**: a pin ↔ a port. Removing a port (e.g. after regenerating a body) breaks the binding; validation lists it.

## User stories
- **US-1** `[MVP]` As a user, I can open the Logic workspace for the current page and see a graph canvas, so that behaviour has its own space.
  - Acceptance: the Logic tab shows the page's graph with pan, zoom, minimap and a node palette; an empty graph shows a short how-to.
- **US-2** `[MVP]` As a user, I can drag a block from the Structure panel into the graph and see its ports as pins, so that I can connect behaviour to my UI.
  - Acceptance: a block node lists its input and output ports with names and types; selecting it highlights the block (switching to Design shows it selected).
- **US-3** `[MVP]` As a user, I can create state and connect events and actions to it, so that my app reacts to the user.
  - Acceptance: adding State, Set state, Toggle, Navigate and Condition nodes; connecting "button click" → Toggle(state); invalid connections (event to text, number to boolean) are refused with a hint.
- **US-4** `[MVP]` As a user, I can bind state to what a block shows (text, visibility, value), so that the UI updates with the state.
  - Acceptance: connecting a state pin to a block input port creates a binding; the block gets a logic marker on the design canvas; the Behaviour tab (S-19) lists it.
- **US-5** `[MVP]` As a user, I see when logic is broken or incomplete, so that the exported app works.
  - Acceptance: nodes with missing connections and bindings to missing ports are flagged on the graph and in a problems list; Compact (S-13) warns about them.
- **US-6** `[MVP]` As a user, my graph becomes working React code, so that the run preview and exported app behave as designed.
  - Acceptance: the sample "toggle a panel" and "input mirrors heading" graphs work in the run preview; the generated page component uses `useState` and handlers that a React developer would recognise (visible in Developer mode).

## UX notes
Blueprint look: dark-ish grid, typed pins colour-coded, event wires distinct from data wires. Nodes are compact with clear titles. Undo works for every graph edit. References: Unreal Engine Blueprints, React Flow examples, Node-RED.

## Technical design
React Flow (xyflow) with custom node components; graph state in the Redux document (entity adapters for nodes, edges, bindings) so edits are history entries; viewport state (pan/zoom) in Zustand. Codegen of the graph lives in the React target (S-01): state → `useState`, events → handlers attached to port elements, bindings → expressions in JSX.

## Tests (optional)
Graph → code generation for the sample graphs (golden files); connection type rules.

## Risks and open questions
- Keeping the node set small is the main risk: every node is UI + validation + codegen. Resist adding nodes before S-26.
- Ports disappearing after regeneration: consider keeping port names stable across refinements (prompt rule in S-08).

## Done when
- [ ] On a sample page, a button toggles a panel and an input mirrors into a heading, built only in the Logic workspace, working in the run preview and in Compact output.
