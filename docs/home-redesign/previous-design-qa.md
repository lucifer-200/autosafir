# AutoSafir Phase 10 — Design QA

## Evidence

- Source visual truth: `D:\autosafir\docs\design-references\phase-10-audit\source-direction.png`
- Combined comparison: `D:\autosafir\docs\design-references\phase-10-audit\source-vs-phase10.png`
- Mobile WebGL capture: `D:\autosafir\docs\design-references\phase-10-audit\home-mobile-webgl.png`
- Desktop WebGL capture: `D:\autosafir\docs\design-references\phase-10-audit\home-desktop-webgl.png`
- Mobile static/light/reduced-motion capture: `D:\autosafir\docs\design-references\phase-10-audit\home-mobile-static-light.png`
- Source pixels: 853 × 1844.
- Mobile WebGL capture pixels: 375 × 812 from the Codex in-app browser; its verified CSS viewport was 390 × 844. The browser surface applied its own output scaling.
- Mobile static capture pixels and CSS viewport: 390 × 844 at deviceScaleFactor 1.
- Desktop WebGL capture pixels: 1279 × 846; verified browser state had no horizontal overflow.
- State: homepage hero, first screen, intro already completed; WebGL quality tier for capable-device captures and static tier for light/reduced-motion capture.

The supplied reference is an open navigation composition while Phase 10 changes only the homepage media layer. The comparison therefore evaluates art direction, density, image treatment, and gold-line hierarchy rather than claiming pixel-identical screen fidelity.

## Findings

No actionable P0, P1, or P2 finding remains.

- Typography: Estedad and Manrope hierarchy is unchanged from the approved Phase 9 homepage. Canvas contains no text, so font rendering, wrapping, and antialiasing remain ordinary HTML concerns.
- Spacing and layout: WebGL is absolutely overlaid within the existing hero media box. It causes no layout shift, crop change, content reflow, or horizontal overflow at 390 px or desktop.
- Colors and tokens: the aperture uses only the existing champagne-gold value `#D8BE82` at restrained opacity over the obsidian/warm-image composition. No glow, neon, or gradient was introduced.
- Image quality and asset fidelity: the reliable local showroom portrait remains the critical image and always renders beneath Canvas. No fake 3D vehicle, substitute illustration, handcrafted vehicle SVG, or placeholder model was introduced.
- Copy and content: all AutoSafir copy, honest demo labelling, price-free public experience, status behavior, heading hierarchy, and calls to action remain unchanged and semantic.
- Motion: the WebGL aperture adds a small scroll/pointer depth response only on capable devices. It does not trap or pin scroll. DPR is clamped to 1–1.5 and the render loop stops while the page is hidden.
- Fallbacks: reduced motion, Save-Data, very weak memory/CPU hints, unavailable WebGL, low runtime performance, render errors, and context loss all retain the meaningful static/cinematic image and HTML content.
- Accessibility: Canvas is `aria-hidden` and pointer-free. The meaningful image keeps its Persian alternative text; controls remain outside Canvas and keyboard-accessible.
- Icons and controls: Phase 10 introduces no new interactive icon or control and preserves the existing Phosphor icon family and 44 px touch behavior.

## Full-view and focused comparison

The combined view confirms that the implementation retains the reference's obsidian field, warm automotive photography, champagne hairlines, and restrained editorial balance while using one image instead of the reference's crowded image rail. The WebGL bars echo architectural edges already present in the photograph and remain subordinate to the vehicle and AutoSafir lockup.

A focused hero-only review was sufficient because Phase 10 changes no content below the fold. It covered the vehicle crop, four aperture rails, header/logo visibility, image caption, hero heading, CTA contrast, boundary line, and first-screen density in both mobile and desktop captures.

## Comparison history

1. Initial WebGL visual pass had no P0/P1/P2 layout or art-direction mismatch.
2. Runtime testing found a P2 resilience issue: the renderer could observe `webglcontextlost` before the scene-level guard, so downgrade was not guaranteed.
3. Fix: moved context-loss interception to the hero media parent in capture phase, ahead of the renderer target.
4. Post-fix evidence: the dedicated browser test now changes `data-render-tier` from `webgl` to `cinematic`, removes Canvas, and keeps the semantic image visible.
5. Console QA found a P3 `/favicon.ico` 404 inherited from the demo shell. Metadata now points the icon to the existing reliable local image; the final in-app browser and static/reduced-motion capture both report zero console errors.

## Primary interactions tested

- Adaptive selection for full WebGL, cinematic image motion, and static image tiers.
- WebGL context loss and automatic downgrade.
- Runtime performance-decline downgrade.
- Reduced-motion static tier with zero Canvas.
- Capable mobile and desktop WebGL activation.
- Hidden-tab render-loop pause logic.
- Intro, theme persistence, mobile navigation, collection, detail, compare, forms, admin CRUD, status persistence, and static-route regression coverage.
- Console errors, horizontal overflow, static export, and direct homepage refresh.

## Implementation checklist

- [x] Lazy-loaded R3F/Three/Drei chunk
- [x] Non-critical, semantic HTML and image outside Canvas
- [x] Full/cinematic/static quality selection
- [x] Save-Data, reduced-motion, weak-device, no-WebGL fallbacks
- [x] Error boundary and context-loss recovery
- [x] Runtime performance downgrade
- [x] Hidden-tab pause and DPR clamp
- [x] Mobile, desktop, dark/light and static export verification
- [x] No fabricated vehicle model

## Open questions and limitations

- A true vehicle-model experience remains intentionally deferred until AutoSafir supplies or authorizes an accurate model and texture set. Phase 10 uses an architectural depth aperture instead of misrepresenting a real vehicle.
- Figma authentication succeeded, but the connected Starter/View account has reached its MCP call limit and the native Figma surface is unavailable to this task. Existing AutoSafir Figma tokens/state were used; no Figma edit is claimed.
- `npm audit` still reports four pre-existing dependency findings: one moderate and three high. No forced major-version audit rewrite was applied during this visual phase.

final result: passed
