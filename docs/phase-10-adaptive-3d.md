# Phase 10 — Adaptive 3D

## Product decision

AutoSafir does not yet have an authorized, production-quality vehicle model. Phase 10 therefore does not fabricate a 3D car. The enhanced tier adds a restrained architectural depth aperture over the existing reliable showroom image. The semantic image, caption, heading, and calls to action remain normal HTML.

## Quality tiers

### A — WebGL

- Requires WebGL without a major performance caveat.
- Requires more than 4 GB reported device memory when that hint exists.
- Requires more than 4 logical processors when that hint exists.
- Loads React Three Fiber and Drei only after the hero is near the viewport and the browser is idle.
- Clamps device pixel ratio to 1–1.5.
- Uses a transparent, pointer-free Canvas above the real image.
- Downgrades when the performance monitor declines or the WebGL context is lost.
- Stops the render loop while the document is hidden.

### B — Cinematic image

- Used when motion is allowed but WebGL is unavailable or the device reports middle-tier memory/CPU hints.
- Keeps the existing GSAP-controlled image depth shift.
- Loads no Three.js scene.

### C — Static image

- Used for reduced motion, Save-Data, 2 GB-or-lower memory, or 2-core-or-lower CPU hints.
- Keeps the critical optimized image and all semantic content.
- Loads no Three.js scene and applies no hero parallax.

## Failure handling

- The original image is always rendered before and beneath Canvas, so WebGL never owns critical content.
- A React error boundary removes the scene after a render error.
- `webglcontextlost` prevents the default broken-canvas state and downgrades to cinematic image treatment.
- Runtime frame decline also downgrades the scene.
- Canvas is `aria-hidden`; the meaningful image retains Persian alternative text.

## Production asset boundary

A real vehicle model should only replace this aperture after AutoSafir supplies or authorizes an accurate model and texture set. Production assets should use compressed textures and Draco/Meshopt where measurements show a benefit. Model identity, proportions, trim, wheels, and materials must not be approximated.
