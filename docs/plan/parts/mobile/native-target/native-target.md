# Feature — Native target

> Part: [Mobile](../mobile.md) · Epics: M-03

## Purpose

Generate a React Native / Expo project from the same framework-neutral source, so a WibeBlock project can become a native app.

## Design notes

- Frames map well (flexbox is native to React Native). Bodies are the hard part: HTML + Tailwind must map to `View`/`Text`/`Image`/`Pressable` with NativeWind classes; unsupported tags are flagged by a target-specific validator and skills can be asked to generate native-friendly bodies.
- Navigation: Expo Router with one route per page.
- This is an investigation-first epic: build a conformance report for existing projects before committing to full support.

## Epics

| ID | Epic | Summary | Depends on | Phase |
|---|---|---|---|---|
| [M-03](epics/M-03-react-native-target.md) | **React Native / Expo target** | Target plugin, HTML→native mapping with NativeWind, conformance validator, Expo Router pages, theme tokens on native, sample projects. | S-17 (target API), M-01 | 7 |
