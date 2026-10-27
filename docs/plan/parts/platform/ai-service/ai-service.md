# Feature — AI service

> Part: [Platform](../platform.md) · Epics: P-05

## Purpose

Server-side generation with the platform's API key: the same pipeline as the Studio's local generation (context → prompt assembly → stream → validate → repair), implemented in .NET and exposed over gRPC server-streaming to the Core API.

## Design notes

- Official `Anthropic` NuGet SDK; model selection per plan; retries/timeouts with Polly; **fake provider** mode (latency profiles, canned bodies) for tests, load tests (L-04) and chaos (L-05).
- Prompt assembly reads the same `packages/prompts` data (published through the Prompt Library module) so local and platform generations are equivalent; parity tests compare both pipelines on golden inputs.
- Validation/repair rules shared with `packages/core` via an exported JSON spec (allowed tags, attributes, class patterns).
- Emits `tokens.used` and `generation.completed` events (outbox in Core API after the stream completes).
- Learning focus: gRPC streaming, cancellation, back-pressure, structured logging of generations, Polly.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-05](epics/P-05-ai-generation-service.md) | **AI Generation service** | gRPC server-streaming API, prompt assembly from the prompt library, Anthropic SDK client, model selection, retries/timeouts/cancellation, fake provider, usage reporting, parity tests with the local pipeline. | P-01 | 3 |
