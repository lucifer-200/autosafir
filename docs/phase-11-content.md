# Phase 11 — Real AutoSafir Content

Captured: 2026-09-14 (Asia/Tehran)

## Content policy

- The public seed contains only vehicles whose model, year, and mileage were stated in a public post from `@autosafirgallery`.
- `AVAILABLE` means the vehicle appeared as a sales listing at the post date. It is not a live stock guarantee; the public collection and each detail record ask visitors to confirm current availability.
- No price is stored or shown.
- Missing technical fields remain empty. Model-level specifications were not filled from memory or third-party catalogues.
- Instagram CDN files were not copied. Cards use the existing neutral AutoSafir demo fallback until the showroom supplies or approves original media.
- The current public source window produced six fully documentable records. The 20–30 vehicle target remains pending an authorized inventory export or more source posts containing all required fields.

## Vehicle sources

| Vehicle                          | Source date | Recorded facts                                     | Official source                                           |
| -------------------------------- | ----------- | -------------------------------------------------- | --------------------------------------------------------- |
| Volkswagen Tiguan 2018           | 2026-09-02  | 40,000 km and listed equipment                     | https://www.instagram.com/autosafirgallery/p/Dc0EIIlDPju/ |
| BMW 428 Convertible 2015         | 2026-09-01  | 77,000 km, M kit and listed equipment              | https://www.instagram.com/autosafirgallery/p/Dcxi0GEjP_x/ |
| Toyota RAV4 Hybrid 2026          | 2026-08-31  | zero km, Japan hybrid version and listed equipment | https://www.instagram.com/autosafirgallery/p/Dcu6iXHDBTW/ |
| Toyota Land Cruiser 70 2026      | 2026-08-30  | zero km                                            | https://www.instagram.com/autosafirgallery/p/DcsVxhBDJt8/ |
| Mitsubishi Pajero 2022           | 2026-08-28  | 52,000 km, six-cylinder, no-paint condition        | https://www.instagram.com/autosafirgallery/p/DcnMOQ3DJee/ |
| Toyota Land Cruiser 300 VXR 2024 | 2026-08-25  | 8,000 km, Limited/Twin Turbo and listed equipment  | https://www.instagram.com/autosafirgallery/p/DcfxOEjjP4e/ |

## Deliberately excluded

- BMW 735i 2026 and Toyota Corolla Cross 2026 were visible in recent AutoSafir content, but their mileage was not stated in the accessible source.
- Sold highlights confirmed the state but did not expose enough model/year/mileage data for the required `Vehicle` schema.
- No record was assigned `RESERVED`; no public source verified that state at capture time.

## Existing-browser migration

The repository replaces only the exact three original `Demo Aurora / Atelier / Studio` placeholders. Any store containing a user-created vehicle is preserved. Reset Demo Data restores this real, source-backed seed.

## Design alignment

Phase 11 preserves the approved restrained visual system. Content provenance is carried through concise copy and direct source links instead of badges, gradients, or added decoration. The existing local 9:16 atmospheric image remains a clearly non-model-specific fallback.

Figma read/write alignment was attempted against the existing project, but the connected Starter plan had exhausted its tool-call allowance and the native Figma app was not exposed to this Codex session. No Figma file was changed.
