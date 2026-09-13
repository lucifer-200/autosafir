# AGENTS.md — AutoSafir

Before implementing any non-trivial feature, read:
`AUTOSAFIR_PRODUCT_SPEC.md`

This file is the authoritative product/design brief.

Core rules:
- Mobile-first; assume nearly all visitors arrive from mobile/Instagram.
- Static demo only; no real backend, secrets or third-party publishing.
- Next.js + React + TypeScript + Tailwind.
- GSAP/ScrollTrigger owns scroll choreography.
- Three.js/R3F is progressive enhancement and must have fallbacks.
- Motion/Framer Motion is for UI transitions, not the main scroll engine.
- Persist vehicle CRUD locally through repository abstraction.
- Public site never shows vehicle prices.
- statuses: AVAILABLE, SOLD, RESERVED.
- Sold vehicles stay visible.
- Light = warm ivory + champagne gold + graphite.
- Dark = obsidian + champagne gold + ivory.
- Brand direction = restrained Mercedes/Maybach-like luxury, while AutoSafir remains the brand.
- Admin must also look premium but enterprise-oriented.
- AKH is a custom vector wordmark close to ΛKΉ / Λｋｈ; do not solve it with Cinzel/Trajan.
- Demo is noindex/nofollow until authorization.
- No fake AutoSafir claims.
- No client API keys.
- Divar/Bama/Instagram/n8n integration UI is explicitly mocked.

Workflow:
1. Implement one phase at a time.
2. Run build/typecheck/lint/tests at the end of every phase.
3. Report files changed, tests run and known limitations.
4. Do not begin heavy 3D until foundation/data/public flows are stable.
5. Mobile, dark/light, reduced-motion and static export are part of Done.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
