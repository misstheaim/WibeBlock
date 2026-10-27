# Part — Mobile

> Mobile adaptation of generated apps, preview on devices, and native output. Epic IDs `M-nn`. Phases 1 (M-01 minimal) and 7.

## 1. Scope

Principle P9: every page has a desktop base and a mobile adaptation the user can inspect and adjust. This part owns the **mobile layout workflow** inside the Studio, the **companion app** for previewing on a real device, and the **React Native / Expo target**. The breakpoint data model itself lives in Codegen (S-01); the desktop layout editor in Editor (S-03).

## 2. Features

| Feature | What it covers | Epics |
|---|---|---|
| [Mobile layout](mobile-layout/mobile-layout.md) | Mobile view in the editor, overflow/touch warnings, per-block mobile overrides (hide, reorder, resize, stack), reset to desktop | M-01 |
| [Companion app](companion-app/companion-app.md) | Expo app: scan a QR in the Studio to open the live preview on a phone; device testing; later notifications | M-02 |
| [Native target](native-target/native-target.md) | React Native / Expo codegen target; how HTML bodies map to native primitives | M-03 |

## 3. Discussion points (open)

- Should mobile adaptation be **automatic by default** (flex rows stack to columns under the mobile breakpoint, with the user overriding) or **explicit** (nothing changes until the user adjusts)? Proposal: automatic sensible defaults (rows → columns, fill widths, reduced gaps) with explicit overrides and a clear "overridden" indicator; this keeps non-developers productive.
- Should the AI be allowed to propose mobile overrides ("adapt this page for mobile")? Proposal: yes as an *assistant action* that produces Frame overrides the user reviews, since Frames are user-owned (P1) — the AI suggests, the user accepts.
- Tablet breakpoint: later, once the data model supports N breakpoints.
