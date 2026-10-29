# S-27 — Framework porting

> Part: Studio · Phase: 7 · Stages: garden · Depends on: S-26, S-17 · Status: ready

## Goal
A user with a React project can build the same app in Angular or Vue. The universal layer is shared; only the logic has to be recreated for the new framework, either by the **AI** (it reads the React graph and the ports and proposes the new framework's graph) or with a **manual porting tool** (side-by-side graphs, a checklist of ports to bind, mapping hints between node types).

## Scope
- In: add a target to an existing project; AI porting as a proposal; manual porting tool; completeness check (every bound port bound in the new layer); keeping layers in sync when ports change.
- Out: automatic two-way sync of logic between frameworks.

## User stories
- **US-1** `[garden]` As a user, I can add Angular (or Vue) to my React project and have the AI create its logic, so that I get the second app quickly.
  - Acceptance: "Port with AI" builds a proposal per page for the new framework's graph; accept or discard per page.
- **US-2** `[garden]` As a user, I can port logic by hand with the React graph beside the new one, so that I control and learn the mapping.
  - Acceptance: a split view shows both graphs; a checklist lists ports bound in React but not yet in the new layer; mapping hints suggest equivalent nodes.
- **US-3** `[garden]` As a user, I'm told when a framework layer is incomplete or out of date, so that all my apps keep working.
  - Acceptance: after a body change removes or adds ports, every target layer shows which bindings need attention; Compact warns per target.

## Risks and open questions
- Some React patterns have no direct equivalent (e.g. context vs DI services); hints must explain rather than force a 1:1 mapping.

## Done when
- [ ] A sample React project is ported to a second framework with AI and finished manually; both apps behave the same.
