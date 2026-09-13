# Phase 7 visual QA

Viewport: 390 × 844, Chrome.

## Captures

- Dark About: `test-results/phase7-about-390-dark.png`
- Light Journal / SAFIR STORIES: `test-results/phase7-journal-390-light.png`

## Checks

- Dark and light theme tokens render without a white flash.
- About and Journal measured `scrollWidth === clientWidth === 390`.
- Contact measured `scrollWidth === clientWidth === 390` with reduced motion enabled.
- Story rail retains intentional horizontal touch scrolling within its own region.
- Primary controls meet the 44px minimum target.
- Branch addresses and phone numbers use only the confirmed demo content source.
- No map is rendered because exact coordinates are not confirmed.

## Content limitation

The repository contains one reliable local automotive/showroom poster and only a
confirmed Instagram profile URL. Story cards therefore reuse distinct crops of
that poster and link explicitly to the profile; they do not represent individual
live posts or depend on a token/embed.
