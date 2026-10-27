# Feature — Generation

> Part: [Studio](../studio.md) · Epics: S-04, S-07, S-08

## Purpose

The AI-owned half of principle P1: from a block prompt plus context, generate the block's Body inside the user's Frame, stream it into the preview, validate it, and keep track of staleness. Also the provider layer and the prompt/skills library that make generations good and portable across providers and modes.

## Pipeline

1. **Context**: block frame, parent chain summary, sibling names, theme tokens, global prompt, selected skills (pinned versions), block prompt, previous body (for refinement).
2. **Prompt assembly** (`packages/ai`) from `packages/prompts` templates; call the provider with **streaming**.
3. **Validation**: allowed tags/attributes, Tailwind classes only (no arbitrary CSS unless whitelisted), token references via CSS variables, no scripts, `<wb-slot/>` only in surface bodies. Invalid → one automatic repair round with the validator's report.
4. **Write** body + metadata (`model`, `skillVersions`, `generatedAt`, `inputsHash`); codegen regenerates the page; preview hot-reloads.
5. **Staleness**: `inputsHash` covers global prompt, skill versions and the block prompt; theme tokens are excluded (they apply live).

## Design notes

- Generation is per block; batch "regenerate stale" runs sequentially with a progress list and can be cancelled.
- Refinement sends the previous body and the delta prompt ("make the button larger") rather than regenerating from scratch.
- Container **surface bodies** style the container (background, border, padding) and must contain exactly one `<wb-slot/>` where children render.
- **Eject**: converts a body's top-level elements into child leaf blocks with frames inferred from the markup, so the user can take control.
- Providers: Anthropic, OpenAI, Google, Ollama (local) through the Vercel AI SDK; a **fake provider** with latency profiles for tests and load tests.
- Prompt library is data (P8): markdown skills + JSON manifests with semantic versions; projects pin versions; Claude Code skills (S-10) are generated from the same source.
- UI: open — where the prompt is entered (inspector, inline popover on the block, side chat), how streaming is shown (in place vs. skeleton), how stale blocks are surfaced.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [S-04](epics/S-04-block-body-generation.md) | **Block body generation** | Block prompt editor, generate with streaming, validation + repair, refine/regenerate, direct text editing, eject body into child blocks, surface bodies, staleness badges and "regenerate stale", generation log per project. | S-03, S-07 | 1 |
| [S-07](epics/S-07-ai-provider-layer.md) | **AI provider layer** (`packages/ai`) | Vercel AI SDK abstraction, provider/model config, key storage (OS keychain / env), streaming, structured output, retries, token usage and cost display, fake provider, prompt assembly from `packages/prompts`. | S-01 | 1 |
| [S-08](epics/S-08-prompt-and-skills-library.md) | **Prompt & skills library** (`packages/prompts`) | Data format and versioning, core skills (body constraints, token usage, accessibility, responsive patterns, component idioms), predefined block prompt gallery, per-project selection and pinning, evaluation harness (golden prompts → scored outputs). | S-04 | 2 |
