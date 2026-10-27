# Feature — Companion app

> Part: [Mobile](../mobile.md) · Epics: M-02

## Purpose

See the real app on a real phone while editing: the Studio shows a QR code, the Expo companion app opens the live preview (local network in Local mode; platform tunnel in Connected/Cloud), and refreshes as the project changes. Later: notifications for platform jobs (generation batches, exports) via P-12.

## Design notes

- The companion app is a thin shell: a WebView pointed at the Runner's preview URL plus a device picker and reload; no editing on the phone.
- Local mode requires the phone and the computer on the same network; the Runner binds the preview to the LAN interface only while pairing is active and uses a short-lived token.
- Shake-to-report: capture a screenshot and the current page/block IDs into the project's notes.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [M-02](epics/M-02-companion-app.md) | **Companion app** (`apps/mobile`, Expo) | QR pairing, live preview on device, page switcher, reload, LAN security, platform tunnel in Connected/Cloud, notifications later. | S-06, S-09 (P-12 for notifications) | 7 |
