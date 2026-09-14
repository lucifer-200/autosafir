# AutoSafir homepage card/header revision — Design QA

## Evidence

- Source visual truth: the user-supplied 736×920 ORIZON DESIGN reference in this conversation.
- Implementation captures: `docs/home-redesign/390x844-light-collection.png`, `390x844-dark-collection.png`, `1440x900-light-collection.png`, `844x390-light-collection.png`, plus all viewport/theme states in the same directory.
- Captures are Chrome-rendered at DPR 1; the filename records CSS viewport and pixel dimensions. Responsive matrix: 360×640, 390×844, 430×932, 768×1024, 1024×768, 1440×900 and 844×390, light/dark and collection/showroom states.
- The source is a visual-language reference. Its property imagery and real-estate labels are intentionally replaced with the supplied AutoSafir automotive asset and approved Persian content.

## Comparison history

- Resolved P1: previous implementation used one stationary card surface and swapped its contents. The revision keeps independent route articles, exposes the next card behind the active one and animates outgoing/incoming cards through distinct diagonal GSAP paths with rotation and scale.
- Resolved P1: previous header sat outside the visual frame and resembled a conventional site header. It is now a white/graphite capsule inside the image, with compact links, primary CTA and round menu control.
- Resolved P2: light/dark previously behaved mainly as a token swap. The revision changes shell, card material, borders, layered shadow, image brightness/saturation, overlay and control inversion per theme.
- Resolved P2: the first revised capture showed the redundant bottom collection link beneath the carousel controls and landscape controls outside the frame. The duplicate link was removed and landscape deck position raised. The final automated matrix reports no overflow, offscreen control, obscured control or page error in 28 states.

## Required fidelity surfaces

- Typography: Estedad and Manrope remain consistent; display, navigation, metadata and action labels have distinct weights and spacing. Persian RTL and Latin counters stay aligned at all checked sizes.
- Spacing/layout: the rounded image frame, embedded capsule header, left vertical rail, fixed desktop showroom card and layered destination deck reproduce the main reference hierarchy. Mobile reduces the header and shows one primary card plus a visible stacked successor.
- Colors/tokens: light uses warm ivory, pearl white and graphite with a small champagne active mark. Dark uses obsidian/graphite, ivory and the same restrained accent. Both retain readable contrast.
- Image quality: responsive AVIF/WebP versions of the supplied car image remain the only hero imagery. The crop keeps the vehicle as the central subject without generated replacements.
- Copy/icons: each route has a Phosphor icon, numbered state, short factual detail and circular CTA. Contact rows use phone/location/social icons. Promotional filler and duplicate footer data remain absent.
- Motion/accessibility: wheel, touch, buttons, PageUp/PageDown, arrows and browser history select the same independent cards. Inactive cards are inert; reduced motion removes spatial movement; controls preserve 44px targets and visible focus.

## Verification

- `scripts/capture-home-qa.mjs`: 28 states, zero automated layout/hit-target/page-error failures.
- Full browser suite: 48 passed and 8 intentional device-specific skips. The home scenarios passed for wheel, touch, URL/history, reduced motion and fixed viewport behavior. Unit/component suite: 65 passed. Build, TypeScript, lint and static export passed during the revision.
- The Codex in-app browser could not initialize because its kernel-assets path was missing. Visual inspection used the captured Chrome output instead. This blocks the Product Design skill's preferred in-app-browser handoff even though the implementation and fallback browser verification pass.

## Remaining P3

- A wider authorized source photo would reduce the tight desktop crop.
- Physical iPhone Safari verification remains outstanding.

final result: blocked
