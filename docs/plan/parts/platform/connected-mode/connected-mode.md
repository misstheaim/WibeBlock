# Feature — Connected mode

> Part: [Platform](../platform.md) · Epics: P-08, P-14

## Purpose

Make the Studio work against the platform: login, project dashboard, platform-backed adapters (storage, ai, export, realtime), moving projects between Local and Connected, and the public website with account pages.

## Design notes

- The Studio switches modes at runtime via a settings screen (Local ↔ Connected URL); adapters are resolved from the mode.
- Without a Runner (Cloud mode in a plain browser) the preview uses Sandpack/esbuild-wasm from S-12's work; with a Runner present, Connected mode can still use the local Vite preview.
- Upload/download: a Local project folder ↔ a platform project is the same JSON; conflicts resolved by version compare + snapshot.
- Website: static (Astro or the Studio's stack), docs, pricing; account pages: profile, BYO API keys (encrypted at rest), plan, usage, GDPR export/delete.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [P-08](epics/P-08-studio-connected-mode.md) | **Studio connected mode** | Platform adapters, PKCE login UI, project dashboard, upload/download between Local and Connected, mode settings, Sandpack preview fallback. | P-03…P-07 | 3 |
| [P-14](epics/P-14-website-and-account-management.md) | **Website & account management** | Landing site, docs, pricing page, account pages (profile, BYO keys, plan, usage, data export/delete). | P-03, P-09 | 4 |
