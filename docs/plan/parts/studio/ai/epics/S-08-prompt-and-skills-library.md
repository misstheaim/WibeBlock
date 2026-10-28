# S-08 — Prompt & skills library

> Part: Studio · Phase: 3 · Stages: v1 · Depends on: S-07 · Status: ready

## Goal
The quality of every AI feature comes from its prompts. `packages/prompts` becomes a proper, versioned library: skills that teach the AI WibeBlock's rules, task prompts, a gallery of predefined block prompts, per-project pinning of versions, and an evaluation harness that shows whether a new version is actually better. The same files feed the Runner, the platform's AI service (P-05, P-11) and Claude Code skills (S-10) (P8).

## Scope
- In: data format (markdown + JSON manifests, semantic versions); core skills (body rules, token usage, accessibility, responsive patterns, port marking, layout rules, logic idioms); task prompts; preset themes as data; predefined prompt gallery; per-project skill selection and pinning; evaluation harness; generation of Claude Code skills.
- Out: the platform's publish flow and experiments (P-11); the hidden AI knowledge base (S-23).

## Concepts and model
- **Skill**: id, version, description, markdown body, which tasks use it.
- **Manifest**: the list of skills and task prompts with versions; a project pins versions in `project.json`.
- **Evaluation case**: an input (block or page context + prompt) and checks (validator passes, uses tokens, accessibility rules, optionally an LLM-judge score).

## User stories
- **US-1** `[v1]` As a developer, I can version skills and task prompts as files, so that changes are reviewable and reproducible.
  - Acceptance: a manifest lists skills and prompts with versions; tasks load them by version; a changed prompt with the same version is flagged.
- **US-2** `[v1]` As a user, my project keeps using the prompt versions it was built with until I choose to upgrade, so that results don't change under me.
  - Acceptance: project settings show pinned versions and available upgrades; upgrading marks affected bodies stale.
- **US-3** `[v1]` As a user, I can start a block from a gallery of ready prompts (hero, pricing card, testimonial, footer…), so that I get good results quickly.
  - Acceptance: the Content tab offers a searchable gallery with previews; choosing one fills the prompt, which stays editable.
- **US-4** `[v1]` As the owner, I can run an evaluation of a prompt change against golden cases, so that I know whether it's better.
  - Acceptance: one command runs the cases with a chosen model (or the fake provider for plumbing), and prints pass rates and scores side by side for two versions.
- **US-5** `[v1]` As a developer using Claude Code, I get WibeBlock skills generated from the same library, so that Claude Code follows the same rules.
  - Acceptance: a build step writes `.claude/skills/` content for projects from the library (used by S-10).

## UX notes
Mostly developer-facing; the user sees the gallery and the pinned versions in settings.

## Technical design
Plain files in `packages/prompts`; a small loader shared by TS; .NET reads the same files (P-05). Evaluation runs as a Node script; LLM-judge scoring optional and clearly labelled.

## Tests (optional)
The evaluation harness is the test suite for prompts.

## Risks and open questions
- How to measure "better" (master §8): start with validator pass rate, token usage rules and a few judged cases.
- Eval cost; keep the golden set small and run on demand.

## Done when
- [ ] Skills and prompts are versioned and pinned per project; the gallery works; evaluations compare two versions; Claude Code skills are generated.
