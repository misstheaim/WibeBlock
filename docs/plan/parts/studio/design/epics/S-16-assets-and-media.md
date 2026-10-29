# S-16 — Assets & media

> Part: Studio · Phase: 3 · Stages: v1 · Depends on: S-04 · Status: ready

## Goal
Users can bring their own images (logo, photos, illustrations) into a project, manage them in an asset panel, and have the AI use them in bodies; when there is no image yet, the AI uses placeholders and an icon set. Codegen copies the assets into the exported app.

## Scope
- In: upload/import (drag-and-drop, paste), optimisation on import, asset panel, alt text, use in bodies (by picking or by AI), placeholder images, Lucide icons for the AI, asset references in codegen, unused asset cleanup.
- Out: stock photo search (garden idea); server-side thumbnails (P-15 for platform projects).

## Concepts and model
**Asset**: id, file path under `wibeblock/assets/`, type, dimensions, size, alt text, used-by (derived). Bodies reference assets by relative path.

## User stories
- **US-1** `[v1]` As a user, I can add images to my project by dropping or pasting them, so that my app uses my own visuals.
  - Acceptance: images are copied into `assets/`, optimised (size and format), and shown in the asset panel with dimensions.
- **US-2** `[v1]` As a user, I can put an image into a block or tell the AI to use it, so that generated content includes my visuals.
  - Acceptance: dragging an asset onto a leaf offers "use in body"; the AI context lists available assets with alt text; generated bodies reference them correctly.
- **US-3** `[v1]` As a user, the AI uses placeholder images and icons when I have none, so that layouts look complete.
  - Acceptance: bodies can use placeholder images and Lucide icons; the asset panel shows which blocks use placeholders so I can replace them.
- **US-4** `[v1]` As a user, my exported app contains the images it uses, and nothing else, so that it's complete and lean.
  - Acceptance: Compact copies used assets; unused assets are listed in the panel with a cleanup action.

## UX notes
Asset panel as a tab in the left panel; grid of thumbnails with search; alt text editing inline.

## Technical design
Image optimisation in the Runner (library choice open, e.g. sharp); codegen maps asset references to the target's static assets folder.

## Tests (optional)
Reference rewriting in codegen.

## Risks and open questions
- Large files in git-tracked project folders; set a size warning.

## Done when
- [ ] Images can be imported, used by the user and the AI, and exported with the app; placeholders and icons work.
