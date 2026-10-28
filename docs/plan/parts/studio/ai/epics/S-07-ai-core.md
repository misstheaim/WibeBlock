# S-07 — AI core

> Part: Studio · Phase: 1–2 · Stages: alpha, MVP · Depends on: S-01, S-09 · Status: ready

## Goal
One solid foundation for every AI feature: a registry of versioned **AI tasks**, provider access through the Vercel AI SDK with a fake provider for development, context assembly, the **proposal** model (D-22), streaming and structured output, cancellation and retries, and a log of every run with usage and cost. The same task definitions run in the Runner now and in the platform's AI service later (P-05), which is the "strong base of system prompts and AI management" the product needs.

## Scope
- In: `packages/ai`; task definition format; task registry; providers (Anthropic first, then OpenAI, Google, Ollama); fake provider; key handling in the Runner; streaming text and structured output; context assembly with a token budget; proposal model; retries, timeouts, cancel; AI log; usage and cost display; AI settings (provider, model per task).
- Out: the skill library content and evaluation (S-08); individual task UIs (S-04, S-22, S-24, S-26, S-27); the platform AI service (P-05).

## Concepts and model
- **AI task definition**: id, version, prompt templates (system, user) from `packages/prompts`, context requirements, output schema (Zod), default model profile, post-processing (e.g. sanitise body), and how the result becomes a proposal.
- **Context assembly**: gathers what the task needs (block, neighbours, page outline, theme, style guide, knowledge notes marked in-context, pinned skills, previous result) and trims it to a budget with a visible breakdown.
- **Proposal**: id, task, scope (block ids / page / project), document changes (expressed as the same actions the editor uses), summary, status (streaming, ready, accepted, discarded, failed), cost.
- **AI log entry**: task + version, provider + model, inputs hash, tokens in/out, cost estimate, duration, outcome, source (Studio, Claude Code).
- **Model profile**: provider + model + parameters, chosen per task in settings (e.g. a cheap model for refinements).

## User stories
- **US-1** `[alpha]` As a developer, I can define an AI task once (prompts, context, output schema) and run it through the Runner, so that every AI feature follows the same pattern.
  - Acceptance: the "generate block body" task is defined in the registry and runs end to end; adding a second task requires no change to the plumbing.
- **US-2** `[alpha]` As a user, I can use my own Anthropic key, or the fake provider without any key, so that I can work with real AI or offline.
  - Acceptance: with a key in `.env`, tasks call the real model; with the fake provider selected, tasks return canned results after a realistic delay; the status bar shows which is active.
- **US-3** `[alpha]` As a user, I can watch AI results stream in and cancel a run, so that I'm never stuck waiting.
  - Acceptance: output arrives progressively; Cancel stops the run within a second and leaves the project unchanged; network errors are retried a limited number of times and then shown clearly.
- **US-4** `[MVP]` As a user, I can choose the provider and the model per task in AI settings, so that I control quality and cost.
  - Acceptance: settings list Anthropic, OpenAI, Google and Ollama with key status (configured / missing); a model per task; a "test connection" button.
- **US-5** `[MVP]` As a user, I can see what each AI run cost and what it used, so that I'm never surprised by my bill.
  - Acceptance: the status bar shows session usage; an AI activity list shows each run (task, model, tokens, cost estimate, outcome); entries persist in `ai-log.jsonl`.
- **US-6** `[MVP]` As a user, the AI knows about my app, my style guide and the surrounding page, so that results fit without repeating myself.
  - Acceptance: context includes the style guide and in-context knowledge notes (S-21), neighbouring blocks and the theme; a "what was sent" view (Developer mode) shows the assembled prompt and the budget breakdown.
- **US-7** `[MVP]` As a developer, I can get validated structured output from a task, so that tasks like themes and layouts return data, not prose.
  - Acceptance: a task with an output schema returns an object that passes the schema or fails with the validation report; partial objects stream for UIs that show progress.

## UX notes
AI activity sits in the status bar (spinner + current task, click for the list). Errors use plain language ("Your Anthropic key was rejected") with a link to settings.

## Technical design
- Vercel AI SDK Core (`streamText`, `streamObject`) in the Runner; the Studio receives streams through the AI adapter (WebSocket); the Studio side uses the AI SDK UI hooks where they fit (S-24).
- Task definitions are data + small functions; prompts live in `packages/prompts` so .NET can read the same files (P8).
- Optional: XState for the run lifecycle shared by all task UIs (see S-04).
- Keys: `.env` first; OS keychain as an option to decide in the ticket.

## Tests (optional)
Context assembly (budget trimming, ordering), task output validation with the fake provider, and later parity between local and platform pipelines on golden inputs (P-05).

## Risks and open questions
- Cost estimates need per-model prices; keep a small price table in data and mark estimates as estimates.
- How much of the page to send as context; start small and measure quality (S-08 evaluation).
- RAG over large knowledge bases is a later option (master §8).

## Done when
- [ ] The body task runs through the registry with a real key and with the fake provider, streams, and can be cancelled.
- [ ] (MVP) Provider/model settings, AI activity with cost, context with knowledge notes, and structured output work.
