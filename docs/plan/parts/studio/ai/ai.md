# Feature — AI

> Part: [Studio](../studio.md) · Epics: S-07, S-04, S-21, S-22, S-08, S-23

## Purpose

Everything the AI does in the Studio and the machinery that makes it good: the **AI core** (task registry, providers, context, proposals, cost), **block generation**, the **knowledge base** that gives the AI context, the **global prompt bar**, the **prompt & skills library**, and later the AI's own hidden knowledge base. Formerly the "Generation" feature.

## Concepts

- **AI task**: a named, versioned unit of AI work: its prompt templates (from `packages/prompts`), the context it needs, its output schema, model settings and validation. Tasks: generate block body (alpha), refine body (MVP), theme from prompt (S-24), arrange page (S-22), generate logic (S-26), port framework (S-27). The same task definitions run locally (Runner) and on the platform (P-05).
- **Context**: what a task receives: block frame and neighbours, page outline, theme tokens, the style guide and knowledge notes marked "in context", pinned skills, the previous result for refinement. Assembled to a token budget.
- **Proposal** (D-22): the result of any task that changes the project: a set of document changes plus a summary, shown on the canvas; *Accept* applies it as one history entry, *Discard* drops it.
- **Knowledge base** (D-23): user notes about the app; one **style guide** entry replaces the global prompt.
- **Staleness**: a body is stale when its inputs hash (block prompt, style guide, pinned skill versions, task version) changed. Theme tokens are excluded; they apply live (D-03).

## Pipeline (block body)

1. Assemble context → 2. stream from the provider → 3. sanitise and validate (S-01 rules); invalid output gets one automatic repair round with the validator's report → 4. build a proposal → 5. user accepts or discards → 6. accepted: body + meta written, history entry, canvas updates.

## Design notes

- AI calls run in the **Runner** (or the platform), never in the browser with a raw key. The Studio talks to the AI adapter.
- Providers through the **Vercel AI SDK**: Anthropic, OpenAI, Google, Ollama; a **fake provider** with latency profiles and canned outputs for development and later load tests.
- Every run is logged (`ai-log.jsonl`): task, version, model, usage, cost, outcome (accepted, discarded, failed). Usage and cost are visible in the status bar and an AI activity list.
- Prompt library is data (P8): markdown skills + JSON manifests with semantic versions; projects pin versions; Claude Code skills (S-10) are generated from the same source.
- The **prompt bar** in the top bar is a command with a scope: selection in the MVP (runs block generation), page and project in v1 (S-22), where the AI may propose layout changes.
- Batch "regenerate stale" runs sequentially with a progress list and can be cancelled; it produces one proposal per block.
- **Eject** (v1): turn a body's top-level elements into child blocks so the user can take control of the layout.

## Epics

| ID | Epic | Summary | Depends on | Phase | Stages |
|---|---|---|---|---|---|
| [S-07](epics/S-07-ai-core.md) | **AI core** (`packages/ai`) | Task registry, providers via Vercel AI SDK, fake provider, key storage in the Runner, streaming and structured output, context assembly, proposal model, retries and cancel, AI log, usage and cost, AI settings. | S-01, S-09 | 1–2 | alpha, MVP |
| [S-04](epics/S-04-block-generation-and-proposals.md) | **Block generation & proposals** | Block prompt, generate with streaming, validation and repair, proposal review on the canvas, refine, direct text editing, surface bodies, port markers, staleness and regenerate stale, eject. | S-07, S-19 | 1–3 | alpha, MVP, v1 |
| [S-21](epics/S-21-knowledge-base.md) | **Knowledge base** | Knowledge workspace, notes and style guide, in-context toggles, context budget preview, search, staleness rule for the style guide. | S-02, S-07 | 2 | MVP |
| [S-22](epics/S-22-global-prompt-bar.md) | **Global prompt bar** | Page and project scope, AI that understands the page and app rules, layout proposals with a visual diff, per-change accept, build a page from an empty canvas. | S-04, S-08, S-15 | 3 | v1 |
| [S-08](epics/S-08-prompt-and-skills-library.md) | **Prompt & skills library** (`packages/prompts`) | Data format and versioning, core skills (body rules, tokens, accessibility, layout rules, logic), prompt gallery, per-project pinning, evaluation harness, generated Claude Code skills. | S-07 | 3 | v1 |
| [S-23](epics/S-23-ai-knowledge-base.md) | **AI knowledge base** | A hidden knowledge base where the AI keeps its own notes about the project. To be designed with the AI work. | S-21, S-08 | 7 | garden |
