# Phase 4 · Vehicle Detail visual QA

Evidence: `01-mobile-detail-dark.png` (full available-detail flow) and `02-mobile-sold-dark.png` (sold hero), captured at 390 × 844 from the production static export on 2026-09-12.

## Flow reviewed

1. Open an available vehicle from the static-safe `/vehicle?slug=` route — healthy.
2. Read the hero, status and recorded vehicle fields — healthy; missing data is described instead of fabricated.
3. Move through material, engineering and feature sections — healthy; the editorial spacing remains calm at 390 px.
4. Reach advisor/contact, compare and share actions — healthy; controls are large and channels are named precisely.
5. Continue to related cars — healthy; SOLD and RESERVED remain visibly distinct.

## Findings

- The mobile composition carries the selected Gallery Ledger direction forward with one atmospheric media field, restrained gold rules, large typography and generous black space.
- The fallback clearly says that dedicated media is pending, so the atmospheric image is not presented as the listed model.
- The action hierarchy remains quiet: one champagne primary action, one direct-call action and lower-emphasis external channels.
- Visual hierarchy, RTL flow, 44 px targets, focus-visible styles and semantic headings are present in the captured implementation.
- Keyboard trapping, Escape dismissal, focus restoration, reduced-motion behavior, light theme and persisted-data behavior were verified by automated tests rather than the screenshot alone.

## Limits

- The fictional Phase 1 seed intentionally has no vehicle media or detailed technical attributes; authorized inventory and media remain a Phase 11 dependency.
- Figma alignment could not be written back because its connector is OAuth-unavailable. GitHub has no connected repository, so no remote change was made.
