# Homepage redesign — 2026-09-14

The approved reference is the rounded real-estate composition attached to the user request, adapted to AutoSafir's supplied vehicle image, Persian RTL content, white/champagne palette and fixed viewport. This is an automotive adaptation, not a literal reproduction of the real-estate content.

## Delivered behavior

- Home has no document scroll. GSAP Observer turns wheel/swipe input into one destination change per gesture. Buttons and PageUp/PageDown/arrow keys also navigate. Hash history supports direct entry, refresh and Back/Forward; real links open the existing routes.
- Route destinations are separate stacked cards. The next card remains partially visible behind the active card; forward navigation exits the active card diagonally toward the upper-left while the next enters from the lower-right with restrained rotation and scale. Reverse navigation mirrors that path, and only the latest request is queued during a transition.
- The home header now lives inside the image as a rounded capsule with compact primary links, collection CTA and full-menu trigger. Theme/showroom controls form a separate vertical rail inside the image.
- Desktop retains the left contact card. Mobile shows collection, compare, visit and showroom cards in sequence. The left rail exposes theme and showroom controls. Small contact panels scroll internally without changing scene.
- Hidden panels are inert and aria-hidden. Reduced motion skips spatial transitions. Event handlers and animations clean up on route departure. Links/buttons still work if the animation chunk cannot load.
- Light is the default; saved theme preferences take precedence. Contact details come from the existing centralized data. Public footer is minimal and home includes the demo label and AKH credit.

## Main changes

- `src/components/home/`: new showroom layout, shared contact card and navigation hook.
- `src/lib/home-navigation.ts`: hash resolution and bounded desktop/mobile navigation, with unit coverage.
- Public shell/header/footer, root theme/bootstrap, theme toggle and color tokens updated. Existing internal routes and repository contracts retained.
- `public/images/home/`: locally encoded responsive AVIF/WebP images. `public/branding/favicon.svg`: small initial mark replacing the 1.77 MB photo favicon.
- Removed obsolete intro, Lenis/ScrollTrigger home components, adaptive WebGL components and their unused helpers/tests. Removed Lenis, Three, R3F and Drei dependencies (52 packages removed). GSAP and UI transition dependencies remain.
- Preserved the user's port-2000 dev command and unrelated pre-existing package changes.

## Validation by phase

1. Structure/theme/footer: production build, typecheck, lint; 72 unit/component tests passed.
2. URL/motion/mobile: production build, typecheck, lint; 74 unit/component tests and 9 applicable home browser tests passed.
3. Assets/cleanup/QA: production build, typecheck, lint, static-export verification; 65 unit/component tests passed after removing 9 obsolete intro/WebGL tests. Full browser suite: 48 passed, 8 device-specific skips, no failures.

Responsive checks cover 360×640, 390×844, 430×932, 768×1024, 1024×768, 1440×900 and 844×390 in both themes, collection and showroom states (28 captures). No document overflow, obscured persistent control, offscreen persistent control or page error was detected. Browser coverage includes menus/focus, hash/history, swipe, wheel, reduced motion, collection/status filters, compare, forms, static vehicle details and admin create/update/delete/import/export flows.

Reproduce with `npm run build`, `npm run typecheck`, `npm run lint`, `npm test -- --maxWorkers=4`, `npx playwright test --workers=2`, and `npm run verify:static`. Serve `out` on port 4173 for the QA/performance scripts. Development remains on http://localhost:2000.

## Measured performance

Three cold-cache production runs per version, Chrome at 390×844 / DPR 1, 1.6 Mbps download, 150 ms latency and 4× CPU throttling. No concurrent browser tests during measurement. Raw results are in `performance-before.json` and `performance-after.json`; `scripts/measure-home.mjs` records them.

| Metric | Before | After |
| --- | ---: | ---: |
| Median LCP | 12,788 ms | 916 ms |
| CLS | 0 | 0.000741 |
| JavaScript received during load observation | 519,605 bytes | 237,165 bytes |
| Images received, including favicon | 3,542,748 bytes | 23,849 bytes |

The image/favicons accounted for much of the previous delay. Mobile AVIF files are 23.6/46.5 KB, desktop AVIF is 31.9 KB; WebP fallbacks are 35.9/70.3 KB mobile and 51.4 KB desktop. The original source remains available for other existing content. No image optimization backend is needed.

## Limits

- These are local lab results, not field metrics or promises for every device/network. Real Safari/iPhone hardware has not been tested; mobile coverage is Chromium emulation.
- The source vehicle photo is portrait and 853 pixels wide. Desktop uses an intentional tighter crop rather than inventing or generating a wider scene.
- Contact details require internal scrolling on constrained mobile panels. The document itself stays fixed as requested.
- In-app browser startup failed with a local kernel-assets path error. QA used rendered Chrome test screenshots instead; no claim of successful in-app browser verification is made.
- Static demo, noindex/nofollow, mocked integrations and locally persisted vehicle CRUD are retained. Nothing was published.
