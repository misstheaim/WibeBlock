# P-20 — Landing page (Astro)

> Part: Platform · Phase: 0, 4 · Stages: skeleton, later · Depends on: P-17, P-08 (P-09 for pricing) · Status: draft

## Goal
Visitors find a simple public page that says what WibeBlock is and one button that takes them into the product: signed-in users land on their dashboard, everyone else on the sign-in page. It is a static **Astro** site (`apps/website`, D-19) that looks like the platform app. Later it grows docs and pricing pages.

## Scope
- In: `apps/website` in the workspace; one landing page (hero, a few feature points, call to action); the "Open WibeBlock" button linking to the platform app; shared look through the `@wibeblock/ui` tokens; light/dark following the OS; static build; per-environment app URL.
- Out (and where it lives instead): deciding signed in vs signed out (the platform app does it, P-18 US-3); any API calls (the site makes none); docs and pricing pages (US-3, later).

## Concepts and model
- **The site never handles auth.** It cannot read the platform app's session cookie (httpOnly, possibly another origin), and a login must start in the platform app, which creates the `state` and PKCE values (P-18). So the button always links to the platform app's root, which redirects signed-in users to the dashboard and others to sign-in. Linking straight to Identity's login page would not bring the user back signed in (D-34).
- **Shared look:** the site imports the kit's stylesheet (tokens and Tailwind setup) but no React components, unless an interactive island needs one.

## User stories
- **US-1** `[skeleton]` As a visitor, I can read what WibeBlock is and open it with one button, so that I get into the product quickly.
  - Acceptance: the page has a hero (name, one-sentence pitch), three short feature points and an "Open WibeBlock" button; the button opens the platform app root; signed in, I land on the dashboard, otherwise on the sign-in page and then on the dashboard; the page uses the app's tokens and follows the OS light/dark setting; it reads well on a phone.
- **US-2** `[skeleton]` As a developer, I can run and build the site from the repo root, so that it is part of the workspace like everything else.
  - Acceptance: a root script starts the Astro dev server; the build produces static files only; the platform app URL comes from environment configuration (local, later cloud); the page scores well in Lighthouse (performance, accessibility).
- **US-3** `[later]` As a visitor, I can read docs and see pricing, so that I understand the product before signing up.
  - Acceptance: docs pages from Markdown content; a pricing page reflecting the plans from P-09; navigation between landing, docs and pricing.
  - Notes: moved here from P-14.

## UX notes
Quiet and light like the app (D-30), the pastel lime accent on the call to action. No cookie banner needed: the site sets no cookies.

## Technical design
Astro with static output and Tailwind v4 through the shared stylesheet; content collections for docs later; hosted later on Static Web Apps (P-13). No client JavaScript in the skeleton unless the mode switch is added.

## Learning notes
1. **Astro basics**: pages, layouts, components, static output.
2. **Islands architecture**: when a page ships JavaScript and when it ships none.
3. **Sharing a design system** across frameworks through CSS tokens.
4. Later: **content collections** for docs.

References: [Astro docs](https://docs.astro.build), [Astro islands](https://docs.astro.build/en/concepts/islands/), [Tailwind CSS with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro), [content collections](https://docs.astro.build/en/guides/content-collections/).

## Tests (optional)
Nothing worth testing automatically in the skeleton.

## Risks and open questions
- Importing a workspace package's CSS into Astro: confirm Tailwind scans what it needs (same issue as P-17 US-1).

## Done when
- [ ] The landing page builds statically and looks like the app in light and dark.
- [ ] "Open WibeBlock" leads signed-in users to the dashboard and others through sign-in to the dashboard.
