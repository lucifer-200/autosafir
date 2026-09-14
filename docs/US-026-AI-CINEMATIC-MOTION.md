# US-026 — AI-First Cinematic Motion & Sitewide Parallax

Status: Proposed for implementation  
Product: AutoSafir Luxury Digital Showroom  
Scope: Public website motion system and AI-generated hero media  
Primary device: Mobile, 360–430 px  
Related stories: US-002, US-003, US-004, US-005, US-016, US-021, US-022, US-023, US-025

## 1. Product outcome

As a mobile-first AutoSafir visitor, I want every public page to respond to my scrolling with restrained cinematic depth and purposeful entrances, so that the showroom feels bespoke, memorable and premium without reducing readability, speed, accessibility or control.

The experience may take inspiration from the restraint, precision and cinematic presentation of premium automotive websites, but AutoSafir must remain the visible brand. Mercedes-Maybach is a featured visual subject, not the identity of the website.

The target feeling is **Quiet Cinematic Luxury**:

- approximately 70% visually calm and stable;
- approximately 20% subtle movement and depth;
- no more than approximately 10% spectacle;
- no cyberpunk, gaming, neon-heavy, template-like or effect-first treatment;
- no scroll hijacking or long trapped scenes.

## 2. Hero creative decision

The homepage hero uses an AI-generated, two-tone Mercedes-Maybach S-Class concept visual.

### Dark theme art direction

- lower body: deep obsidian black;
- upper body and roof: restrained champagne gold;
- environment: black architectural studio;
- light: narrow champagne edge reflections and soft museum-grade key light;
- text: muted ivory with restrained champagne details.

### Light theme art direction

- lower body: warm ivory, not pure white;
- upper body and roof: soft champagne gold;
- environment: warm ivory architectural studio;
- light: natural premium daylight with soft champagne reflections;
- text: graphite with restrained champagne details.

### Model-truth rule

- Until the exact generation and trim are verified, the asset is internally named `Mercedes-Maybach S-Class concept visual`.
- `S 500`, a model year, factory paint name or inventory status must not be displayed or placed in metadata unless verified from an authoritative source.
- The custom two-tone treatment must not be described as a factory configuration unless that exact configuration is verified.
- AI output must not be presented as a photograph of AutoSafir's real inventory.
- No price may appear in the image, copy, metadata, filename or alt text.

## 3. AI-only asset production workflow

The cinematic media is produced through AI tools. Page choreography is still implemented as real browser motion so that it responds to scroll and remains accessible.

### 3.1 Selected pipeline

1. Collect 3–6 clean visual references of the same Mercedes-Maybach generation:
   - front three-quarter view;
   - side profile;
   - rear three-quarter view;
   - grille and headlamp detail;
   - wheel detail;
   - an official two-tone reference when available.
2. Generate four master stills with Adobe Firefly or OpenAI ImageGen:
   - dark desktop;
   - dark mobile;
   - light desktop;
   - light mobile.
3. Animate each approved master still with Runway Gen-4.5 Image-to-Video.
4. Generate at least three motion candidates per master and reject any candidate with geometry drift.
5. Refine the selected clips in DaVinci Resolve or Adobe Premiere:
   - trim;
   - loop cleanup;
   - colour match;
   - first-frame alignment;
   - removal of audio.
6. Use Topaz Video only when enhancement, denoise or stabilization is required. It is not the primary generator.
7. Export production web assets as MP4, WebM and still posters.

### 3.2 Why this pipeline is fixed

- Text-to-Video alone is not accepted for the final car because it can mutate body proportions and details.
- Image-to-Video begins from an approved composition and gives the best chance of preserving the vehicle.
- Mobile and desktop are generated separately; one output must not be carelessly cropped into both aspect ratios.
- The two themes are generated from matched compositions so switching theme does not cause a perceptual jump.
- AI generates the cinematic media; GSAP/ScrollTrigger connects that media and the page elements to real scrolling.

### 3.3 Required AI outputs

| Asset | Aspect ratio | Target duration | Required variants |
| --- | ---: | ---: | --- |
| Dark mobile hero | 9:16 | 5–7 s | 3 candidates + 1 approved |
| Light mobile hero | 9:16 | 5–7 s | 3 candidates + 1 approved |
| Dark desktop hero | 16:9 or 21:9 | 5–7 s | 3 candidates + 1 approved |
| Light desktop hero | 16:9 or 21:9 | 5–7 s | 3 candidates + 1 approved |
| Hero posters | matching video | static | first-frame match for all 4 clips |
| Fallback stills | matching viewport | static | AVIF/WebP/JPEG fallback |

### 3.4 AI master-frame prompt

Use the same reference set and composition instructions for both themes. Change only the palette and environment tokens.

```text
An ultra-realistic premium editorial automotive campaign featuring one
Mercedes-Maybach S-Class sedan, exact production-car geometry preserved from
the supplied references, front three-quarter view, centred slightly toward the
visual-safe side of the frame, full wheels visible, realistic wheelbase, correct
grille, headlamps, mirrors, glass and chrome details. Two-tone body treatment:
[THEME COLOURS]. Minimal [THEME ENVIRONMENT] architectural studio, museum-grade
lighting, controlled champagne-gold edge reflections, realistic paint and glass,
quiet luxury, restrained contrast, generous negative space reserved for AutoSafir
headline and CTA, no people, no text, no license plate text, no price, no showroom
branding, no neon, no excessive glow, no lens flare, no motion blur, no fantasy
body kit, no altered proportions, no duplicated wheels, no malformed emblem.
```

Desktop composition keeps safe negative space for the RTL headline. Mobile composition places the car lower in the frame and preserves a clean upper text-safe region.

### 3.5 Image-to-video motion prompt

```text
The vehicle remains perfectly still and dimensionally consistent. The camera
performs an extremely slow, restrained lateral dolly with a subtle forward drift.
A narrow champagne reflection moves once across the upper body and chrome edge.
Atmospheric light changes almost imperceptibly. Wheels, grille, lights, emblem,
body panels and background architecture remain stable. No driving, no wheel
rotation, no door movement, no aggressive zoom, no morphing, no logo mutation,
no new objects, no camera shake and no lens flare. Finish on a visually compatible
frame for a seamless calm loop.
```

### 3.6 AI rejection checklist

Reject the asset if any one of these defects is visible:

- body proportions change between frames;
- a wheel, mirror, light, grille bar, emblem or door seam mutates;
- the two-tone boundary crawls or changes height;
- glass reflections behave like liquid;
- the vehicle appears to move while the wheels remain static;
- text, a fake plate or a malformed logo appears;
- gold becomes yellow, orange, neon or excessively glossy;
- the studio gains unexplained objects;
- the first and last frames cannot form a calm transition;
- the subject is cropped under the planned UI safe area;
- the clip looks more like a generic car advertisement than AutoSafir's visual language.

## 4. Hero interaction story

### Entry choreography

1. SAFIR Intro completes or is skipped.
2. The matching theme poster is already visible and reserves the full hero area.
3. The hero is uncovered through a restrained mask transition.
4. The car settles from approximately `scale 1.03` to `scale 1`.
5. The AutoSafir headline reveals from a clipped text mask.
6. The primary CTA appears after the headline.
7. The secondary CTA, if present, follows.
8. The scroll cue appears last.
9. The theme-specific video replaces the poster only after it can play without a flash.

### Scroll choreography

- The environment moves slowest.
- The vehicle has a limited depth shift.
- Editorial text leaves slightly faster than the vehicle.
- The CTA remains readable and tappable throughout its visible range.
- The hero transfers naturally into the next section without trapping scroll.
- Mobile users can leave the hero with one normal continued swipe.

### Theme behaviour

- Only the current theme's hero video is preloaded on mobile.
- Theme switching first resolves to a matching poster.
- The new theme media fades in only when ready.
- No white flash, black flash, layout shift or hydration mismatch is allowed.
- The vehicle position and camera angle remain perceptually aligned across themes.

## 5. Global motion language

Every cinematic section may use up to four conceptual layers:

1. environment;
2. primary vehicle or media;
3. editorial typography;
4. functional UI.

Functional UI—including navigation, filters, forms, CTAs and essential facts—must always be the most stable layer.

### Motion rules

- Motion must guide attention, explain hierarchy, reveal content or create depth.
- Transform and opacity are preferred for continuous animation.
- Width, height, top and left must not be continuously animated during scroll.
- Permanent glow is prohibited.
- Gold motion is limited to line drawing, edge light or small emphasis.
- Functional controls must not move away while the user attempts to interact.
- No information may be understandable only through animation.
- The complete page remains readable when JavaScript motion is unavailable.
- Browser back/forward navigation must restore a stable page.
- Scroll restoration must not leave scenes half-pinned or invisible.

### Mobile intensity

- Maximum three moving layers at one time.
- Typical positional travel: 12–24 px.
- Typical scale change: no more than approximately 3%.
- Long pins and nested cinematic scrollers are prohibited.
- Horizontal motion must not conflict with browser gestures, galleries or carousels.
- Touch scrolling must never be delayed or blocked.

### Desktop intensity

- Maximum four moving layers at one time.
- Typical positional travel: 40–80 px.
- Pinning is allowed only for a short signature scene.
- A pinned scene must not add more than approximately half a viewport of forced travel.
- Essential text and CTAs remain stable even when surrounding layers move.

## 6. Page-by-page motion signatures

### Home

- The Maybach hero is the strongest cinematic scene.
- Featured vehicle media has restrained inner-image parallax.
- Vehicle cards reveal once on first entry, not repeatedly on small scroll changes.
- SAFIR Stories uses limited depth offsets while preserving native touch interaction.
- The brand section uses an architectural media layer and a champagne progress line.
- The footer ends quietly and must not compete with the hero.

### Collection

- The page header has slow image parallax.
- Media inside each Vehicle Card may move independently from the card by a small amount.
- Search, result count, filters and quick status controls remain stable.
- Card entrances use short alternating stagger.
- Changing filters must not replay an expensive entrance on every card.
- AVAILABLE, SOLD and RESERVED remain readable and are never communicated by colour alone.

### Vehicle Detail

- The detail hero is the second-strongest scene after Home.
- Environment and vehicle use different depth speeds.
- Key Specs enter with a short restrained stagger.
- Exterior and Interior media use controlled crop-to-frame reveals.
- Mobile gallery preserves native swipe behaviour.
- Technical specifications remain almost entirely static.
- Contact, Compare and Book Visit actions remain stable and tappable.
- SOLD vehicles retain their complete detail experience.

### Compare

- Only the header and initial vehicle arrival may use parallax.
- Comparison labels, rows and values remain static.
- Differences are emphasized with contrast or champagne rules, not persistent animation.
- No ambient motion runs while the user is comparing specifications.

### Sell Your Car and Book a Visit

- Only a background environment layer may move slowly.
- Step transitions use short masked or directional UI transitions.
- Fields, validation, review data and keyboard flow have no parallax.
- Success uses one short SAFIR signature moment and then becomes static.

### About

- The story is divided into short editorial chapters.
- Media and text may travel at slightly different speeds.
- No unverified history, numbers, awards or commercial claims are added for cinematic effect.

### Branches

- Each confirmed branch forms one architectural chapter.
- Address, phone and Copy Address stay fixed within the content flow.
- AI architectural media must not be represented as a real AutoSafir showroom.

### Contact

- Large typography is the main entrance gesture.
- Contact methods enter with a brief stagger.
- Telephone and social links do not shift position on hover, focus or tap.

### Journal

- Article hero media may use slow parallax.
- Long-form reading content has no continuous ambient movement.
- Editorial images use a single restrained reveal.
- A subtle reading-progress rule is permitted.

### 404

- One lightweight depth scene is permitted.
- The return action works immediately without waiting for motion.

### Full-screen navigation

- The menu uses no more than two or three large, quiet image frames.
- The active or focused destination may update the associated image.
- Mobile images are darker and less prominent than navigation labels.
- Keyboard navigation, Escape and focus containment work regardless of motion.
- Opening and closing use a short mask expansion/collapse.

### Admin

- Admin remains Luxury Enterprise.
- Only short route, panel, dialog and status transitions are allowed.
- No cinematic parallax, autoplay hero video or WebGL is introduced.

## 7. Animation ownership

### GSAP and ScrollTrigger own

- scroll-linked choreography;
- image and environment parallax;
- masked text and media reveals;
- vehicle depth shift;
- champagne line progression;
- short pinned scenes;
- hero timeline;
- scene cleanup and refresh after responsive changes.

### Motion/Framer Motion owns

- navigation open/close;
- dialog and modal transitions;
- mobile bottom sheets;
- filters and state changes;
- form-step transitions;
- buttons and status micro-interactions;
- non-scroll UI transitions.

### Lenis owns

- optional smooth scrolling only;
- no input trapping, forced snapping or scroll hijacking;
- automatic disablement when reduced motion or the selected quality tier requires it.

### Three.js/R3F usage

Three.js is not required for this story. The default implementation uses AI-generated video/still media plus browser-native layered motion.

Three.js may be used later only if a visually accurate, licensed and performant vehicle model becomes available. It must never be used merely to claim that the site has 3D.

## 8. Adaptive quality tiers

### Tier A — Full

- capable device;
- stable WebGL when a 3D enhancement exists;
- Save-Data disabled;
- reduced-motion disabled;
- full restrained parallax;
- theme-specific hero video;
- maximum allowed layer count.

### Tier B — Balanced

- lighter parallax;
- fewer simultaneous layers;
- hero video or compact image sequence;
- no heavy 3D;
- reduced blur and shadow work.

### Tier C — Safe

- static theme-matched poster;
- short non-scroll fade/reveal only;
- no scrub, pin, autoplay or WebGL;
- complete content and functional CTAs.

### Required fallback triggers

- `prefers-reduced-motion: reduce`;
- Save-Data;
- weak or unstable rendering capability;
- WebGL unavailable or context lost;
- video decoding or loading failure;
- tab hidden;
- runtime animation error;
- device or viewport profile outside the safe animation budget.

No fallback may produce an empty hero, hidden content or broken navigation.

## 9. Accessibility acceptance criteria

- Reduced-motion removes scroll scrub, pinning, large transforms and 3D rotation.
- Reduced-motion still presents the full hierarchy and all content.
- All text and CTAs remain semantic HTML outside video or Canvas.
- Decorative duplicate media is hidden from assistive technology.
- Focus remains visible in both themes.
- Heading hierarchy is not changed for visual composition.
- Autoplay media is muted and uses `playsInline`.
- Touch targets are at least 44 px.
- Vehicle status is not colour-only.
- Animation cannot prevent keyboard navigation or form submission.

## 10. Performance acceptance criteria

- A theme-matched poster renders before the hero video.
- Hero media never blocks the critical navigation and CTA.
- Only critical hero media is prioritized.
- Offscreen media is lazy-loaded.
- Hidden-tab video and animation pause.
- WebGL, if later approved, is lazy-loaded and has clamped DPR.
- All GSAP contexts, timelines, triggers and listeners are removed on unmount.
- Route changes do not duplicate listeners or timelines.
- No theme switch produces a white flash or large layout shift.
- Target CLS is below 0.1.
- Target mobile LCP is below 2.5 seconds under the agreed QA profile.
- When 60 fps cannot be maintained, the effect is reduced or disabled instead of degrading input responsiveness.

## 11. Behaviour scenarios

### Scenario A — First mobile visit, dark theme

Given a first-time visitor on a capable mobile device  
And the default theme is dark  
When the SAFIR Intro completes or is skipped  
Then the dark poster is already visible without layout shift  
And the dark Maybach clip begins only after it can play safely  
And the headline and CTA remain tappable  
And one continued natural swipe leaves the hero.

### Scenario B — Light theme selection

Given the user changes from dark to light  
When the light media is not yet ready  
Then the matched light poster is shown  
And no black or white flash appears  
And the light clip fades in only after loading  
And the car composition does not visibly jump.

### Scenario C — Reduced motion

Given the operating system requests reduced motion  
When any public route loads  
Then no scroll scrub, pin, large parallax or 3D rotation starts  
And a static premium composition is visible  
And all content and actions remain available.

### Scenario D — Save-Data or weak device

Given Save-Data is enabled or the device is assigned Tier C  
When the homepage loads  
Then the hero video is not downloaded automatically  
And the theme-matched fallback image is used  
And the page remains visually complete.

### Scenario E — Media failure

Given the hero video fails to load or decode  
When the error occurs  
Then the poster remains visible  
And no error UI replaces the hero  
And the headline, CTA and navigation continue to work.

### Scenario F — Internal navigation cleanup

Given a visitor enters and leaves multiple public routes  
When the visitor returns using browser Back  
Then no duplicate animation runs  
And no section remains pinned or hidden  
And scroll restoration produces a stable readable page.

### Scenario G — Admin isolation

Given an authenticated demo administrator enters Admin  
When navigating dashboard and CRUD screens  
Then public cinematic scenes do not mount  
And enterprise UI transitions remain brief and usable.

## 12. QA matrix

The following must be checked before this story is Done:

- widths: 360, 375, 390, 412, 430, 768, 1024, 1280 and 1440+;
- iPhone Safari;
- Chrome Android;
- Chrome, Firefox and Edge desktop;
- portrait and mobile landscape;
- dark and light theme;
- reduced motion;
- Save-Data or an equivalent forced Tier C test;
- slow network and delayed video;
- missing poster;
- failed video decode;
- WebGL unavailable and context loss if 3D exists;
- browser Back/Forward;
- direct route refresh;
- keyboard-only navigation;
- touch interactions and swipe galleries;
- form use while the mobile keyboard is open;
- no horizontal overflow;
- no console or hydration errors;
- no public prices;
- no secrets or client API keys;
- successful static export.

## 13. Definition of Done

US-026 is complete only when:

- all four hero master stills are visually approved;
- all four hero motion clips pass the AI rejection checklist;
- all posters match the first visible video frames;
- every public route has one purposeful motion signature;
- functional UI remains stable and usable;
- mobile motion is lighter than desktop motion;
- all adaptive quality tiers work;
- reduced-motion is complete, not a broken or empty version;
- media failure never creates a blank scene;
- theme switching is flash-free;
- timeline and listener cleanup is verified;
- Admin remains restrained Luxury Enterprise;
- the complete QA matrix passes;
- no model, inventory, factory colour or dealership claim is fabricated;
- AutoSafir remains the dominant brand;
- the project build, typecheck, lint, unit tests, component tests, E2E tests and static export pass.

## 14. Out of scope

- real vehicle inventory publishing;
- claiming the AI Maybach is physically available at AutoSafir;
- full-site WebGL backgrounds;
- scroll hijacking;
- adding public vehicle prices;
- generating fake showroom photography and presenting it as real;
- production CDN, CMS, ASP.NET Core, SQL Server or n8n integration;
- changes to the repository or data architecture unrelated to motion delivery.

## 15. Implementation gate

No production motion implementation begins until these four visual targets are approved:

1. dark mobile Maybach master frame;
2. light mobile Maybach master frame;
3. dark desktop Maybach master frame;
4. light desktop Maybach master frame.

After approval, the first implementation slice is limited to:

1. homepage hero;
2. full-screen navigation;
3. Collection card entrance and inner-media parallax;
4. Vehicle Detail hero and gallery reveal.

The motion speed, easing, depth and fallback behaviour approved in that slice become the shared contract for the remaining public routes.
