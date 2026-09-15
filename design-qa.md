# AutoSafir cinematic homepage — Design QA

## Evidence

- Source visual truth: `C:\Users\i.akhavan\.codex\generated_images\01a08668-a4e1-7753-a549-c51e3ad89efd\exec-c281c0a7-c9ed-46eb-8c51-11aaf0368948.png` (approved desktop direction) and `exec-c86225a7-8b6b-44f7-8278-9f6b08a1162b.png` (approved mobile direction).
- Implementation: `http://127.0.0.1:2000/`, rendered and inspected in the Codex in-app browser.
- Viewport: browser capture approximately 1279×846 CSS px at DPR 1, light theme, initial hero state.
- Implementation screenshot path: unavailable; the in-app browser displayed the capture in-session but did not expose a filesystem path.
- Density normalization: source and implementation were inspected as desktop compositions; the source is an art-direction target rather than a pixel-identical production frame.

## Full-view comparison evidence

- The implementation preserves the defining composition: architectural wash outside a large rounded central frame, restrained notched ivory navigation, full-bleed automotive image, right-aligned editorial headline, large contact card and smaller inventory card.
- AutoSafir remains the visual brand. Real confirmed branch and phone information replaces the reference's property copy.
- The final browser pass confirmed that the AutoSafir label no longer clips against the header curve and the hero has no horizontal overflow.

## Focused-region evidence

- Header: inspected at full rendered scale; navigation spacing, theme control and sculpted corners remain legible.
- Floating cards: confirmed clear hierarchy between the ivory contact card and smaller champagne inventory card.
- Hero typography: Persian title, Latin eyebrow and CTA retain separate optical weights and sufficient contrast.
- Lower-page focused captures were not available from the in-app browser API, so a complete visual fidelity judgment for all long-page sections cannot be recorded.

## Required fidelity surfaces

- Fonts/typography: Estedad/Manrope hierarchy is coherent, with restrained weights and technical Latin labels. Hero wraps to three lines at the inspected viewport; acceptable for the cinematic composition.
- Spacing/layout: central frame, overlap, radii and elevation match the approved direction. Desktop header clipping found in the first inspection was fixed with added inline margin.
- Colors/tokens: warm ivory, champagne gold and graphite are mapped locally; dark mode uses obsidian while preserving the gold accent.
- Image quality: existing responsive AVIF/WebP AutoSafir hero assets are retained. No replacement model or fake 3D asset was introduced.
- Copy/content: no public prices, fabricated claims or fabricated branch data. Empty inventory receives an explicit premium recovery state.
- Motion/accessibility: GSAP/ScrollTrigger owns scroll-linked depth; document scrolling remains native; reduced-motion disables choreography; semantic links and headings remain available without JavaScript motion.

## Comparison history

- P2 header brand clipping: the first browser inspection showed the final letters too close to the sculpted edge. Fixed by adding logical inline margin; the second browser inspection showed the full AutoSafir label.
- P2 empty inventory gap: local storage may contain zero vehicles, leaving the first editorial section blank. Fixed with a truthful, designed empty state connected to contact.
- P2 route mismatch: Home initially linked to non-existent `/sell` and `/collection/[slug]` routes. Fixed to `/sell-your-car` and `/vehicle?slug=...`.

## Remaining findings

- [P2] Complete long-page and mobile visual comparison is not captured to a persistent file.
  - Location: sections below the hero and mobile 390px state.
  - Evidence: automated responsive behavior passed, but the selected in-app browser exposes only a session image and no saved screenshot path.
  - Impact: formal Product Design QA cannot prove all visual surfaces against the approved mockups.
  - Fix: authorize a direct Playwright screenshot pass or provide a browser workflow that exposes persistent captures.

## Verification

- TypeScript passed.
- ESLint passed with zero warnings.
- Unit/component tests: 26 files, 66 tests passed.
- Home E2E: 7 passed, 1 intended desktop skip.
- Combined foundation/Home E2E: 38 passed, 4 intended skips, 2 pre-existing vehicle-detail expectation failures unrelated to Home.
- Static production build and export verification passed.

final result: blocked
