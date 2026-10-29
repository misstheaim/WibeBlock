# Feature — Mobile layout

> Part: [Mobile](../mobile.md) · Epics: M-01

## Purpose

Let the user see how each page looks on a phone and fix it without leaving the Studio: switch to the mobile view, spot problems, and override frames for the mobile breakpoint.

## Design notes

- The mobile view reuses the editor canvas/preview at a phone width inside a device frame; selection and tree stay shared with the desktop view.
- **Defaults** (see discussion in the part doc): flex rows stack into columns, fixed widths wider than the viewport become fill, gaps/padding scale down. Defaults are computed, not stored; only overrides are stored in `frame.responsive.mobile`.
- **Overrides**: hidden on mobile, order, direction, wrap, size, gap/padding; "reset to desktop" per field and per block. Overridden fields are marked in the inspector.
- **Diagnostics**: horizontal overflow, text smaller than a threshold, tap targets under 44px, images without max-width; listed in a panel and highlighted on the canvas.
- Bodies are not regenerated for mobile; skills require bodies to be fluid. A later option is a mobile-specific body variant if real projects need it.
- Moved to Phase 7 (D-25). The Studio already provides device-width viewports and zoom (S-03); this epic adds computed defaults, override editing and diagnostics on top. Planned in its own session.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [M-01](epics/M-01-mobile-layout-workflow.md) | **Mobile layout workflow** | Mobile view with device frame, computed mobile defaults, per-block overrides with indicators and reset, diagnostics panel, AI-proposed adaptations (review-before-apply). | S-03, S-18, S-19, S-06 | 7 |
