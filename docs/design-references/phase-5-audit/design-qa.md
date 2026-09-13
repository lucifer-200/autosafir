# Phase 5 Compare — Product Design QA

## Evidence

- Selected visual system: `docs/design-references/phase-2-mobile-shell.png`
- Dark 390px implementation: `docs/design-references/phase-5-compare-mobile.png`
- Light 390px implementation: `docs/design-references/phase-5-audit/mobile-light.png`

The source and implementation were inspected at the same mobile width. The
source defines the Gallery Ledger language; Phase 5 extends that system to a
data-dense comparison flow rather than copying its navigation content.

## Visual and interaction review

- P0: none.
- P1: none.
- P2: none.
- P3: demo records have no approved vehicle media or full technical data, so
  the comparison intentionally uses typography and `ثبت نشده` rather than
  invented imagery or specifications. Replace these in Phase 11 only with
  authorized, verified content.

The implementation preserves the source's obsidian/ivory foundation,
champagne hairlines, quiet technical captions, rectangular controls, generous
vertical spacing, and restrained density. The selection area stays compact;
the comparison ledger is the only dense region. On 390px the document remains
390px wide while the table alone scrolls horizontally (752px content width).
The sticky specification column remains visible during horizontal movement.
Light mode uses warm ivory instead of pure white and retains sufficient visual
separation through borders rather than shadows or glow.

Keyboard focus is visible, selection uses native buttons with `aria-pressed`,
the scroll region is keyboard-focusable and labelled, status is conveyed in
text as well as color, and reduced motion introduces no required animation.

## Verification

- Selection count and 2–3 vehicle states: passed.
- `?add=slug` detail handoff: passed.
- Local persistence through repository/store abstraction: passed.
- Async vehicle hydration regression: passed.
- Mobile horizontal swipe with sticky row labels: passed.
- Dark/light and 390px overflow inspection: passed.
- Browser console: no repeatable application warning or error.
- Public cost information absent: passed.

final result: passed
