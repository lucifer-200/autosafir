# AutoSafir Luxury Digital Showroom — Product Specification & User Stories

Version: 1.0 — Concept/Demo  
Brand: AutoSafir / اتو سفیر  
Primary target: Mobile-first luxury showcase for presentation to AutoSafir  
Current deployment: Static hosting only  
Future production: ASP.NET Core + SQL Server + n8n

## Product Mission
ساخت یک Digital Showroom بسیار لوکس، سینمایی و Mobile-first برای AutoSafir که در نسخه Demo خودروهای موجود و فروخته‌شده را نمایش دهد و در صورت عقد قرارداد همان codebase بدون بازنویسی کامل به نسخه Production متصل به Backend، SQL Server و Automationها ارتقا یابد.

## Non-negotiable decisions
- Public product یک Luxury Showcase است، نه ecommerce.
- هیچ قیمت خودرو در Public Website نمایش داده نمی‌شود.
- statusها: AVAILABLE, SOLD, RESERVED.
- Sold vehicles حذف نمی‌شوند.
- صفحات: Home, Collection, Vehicle Detail, Compare, Sell Your Car, Book a Visit, About, Branches, Contact, Journal.
- Demo کاملاً Static است.
- هیچ Secret/API Key در Client قرار نمی‌گیرد.
- Admin Demo فقط CRUD واقعی خودروها را با browser storage انجام می‌دهد.
- Public Website و Admin در همان device از یک persisted demo store استفاده می‌کنند.
- Production بعداً به ASP.NET Core + SQL Server متصل می‌شود.
- n8n در Production integration layer است، نه source of truth.
- Divar/Bama/Instagram publishing در Demo فقط simulation است.
- Mobile Experience اولویت اول است.
- Dark و Light هر دو first-class هستند.
- Dark = Obsidian/Graphite + Champagne Gold.
- Light = Warm Ivory/Cream + Champagne Gold + Graphite.
- 3D/WebGL progressive enhancement است و fallback دارد.
- Intro لوگوی SAFIR signature experience است.
- Footer: `Developed by AKH` و AKH یک custom SVG wordmark نزدیک به `ΛKΉ` / `Λｋｈ` است؛ Cinzel/Trajan جایگزین مورد قبول نیست.
- Demo باید noindex/nofollow باشد تا قبل از قرارداد به‌عنوان سایت رسمی ایندکس نشود.

## Brand/contact data for demo
Instagram: https://www.instagram.com/autosafirgallery  
Telegram: https://t.me/autosafirgallery1  
WhatsApp Channel: https://whatsapp.com/channel/0029VaZuzPzJJhzbIJ00r21R  
Phones: 0912-2222-346 / 0912-7777-427 / 021-88527000-5  
Branch 1: خیابان بهشتی، تقاطع احمد قصیر  
Branch 2: خیابان مطهری، تقاطع مفتح

این اطلاعات برای Production باید دوباره از خود مجموعه تأیید شود.

## Personas
1. Mobile Visitor — عمدتاً از Instagram وارد می‌شود.
2. Serious Buyer — فیلتر، Detail، Compare و Contact.
3. Seller — Sell Your Car flow.
4. AutoSafir Admin — CRUD خودروها.
5. Decision Maker — مدیر مجموعه که Demo را برای تصمیم تجاری می‌بیند.

## Visual direction
Keywords: Elegant, Restrained, Cinematic, Premium, Automotive, Editorial, Architectural, Minimal, Precise, Quiet Luxury.

از Glow/Gradient/Glass فقط محدود و هدفمند استفاده شود. Cyberpunk، Gaming، neon-heavy و template-like ممنوع.

### Dark tokens
- bg-primary #080808
- bg-secondary #111111
- surface #171717
- graphite #202020
- text-primary #F5F2EA
- gold-primary #C6A15B
- gold-soft #D8BE82

### Light tokens
- bg-primary #F5F2EA
- bg-secondary #EBE5D9
- surface #FAF8F3
- text-primary #171717
- gold-primary #B4924F
- gold-soft #C7A866

Pure white رنگ غالب Light Mode نباشد.

## Typography
Persian: یک Variable Persian typeface مدرن و premium، ترجیح اولیه Estedad Variable یا جایگزین هم‌سطح.  
English UI: Manrope/Inter یا جایگزین هم‌سطح.  
AKH: custom vector wordmark؛ A lambda-like، K هندسی، H inscription-like، aria-label="AKH".

## Motion principles
- Motion purposeful.
- scroll hijacking ممنوع.
- GSAP/ScrollTrigger برای scroll choreography.
- Lenis فقط smooth scroll بدون trap.
- Motion/Framer Motion فقط UI transitions/micro-interactions.
- prefers-reduced-motion کامل.
- Mobile animations سبک‌تر.
- Theme transition بدون white flash.

## Demo stack
Next.js + React + TypeScript + Tailwind CSS  
GSAP + ScrollTrigger + Lenis  
Three.js + React Three Fiber + Drei  
Motion/Framer Motion  
Zustand + persist  
React Hook Form + Zod  
Static seed JSON + localStorage/IndexedDB

## Architecture
UI نباید مستقیماً localStorage را صدا بزند.

VehicleRepository
- DemoVehicleRepository
- ApiVehicleRepository (future)

Demo از DemoVehicleRepository استفاده می‌کند و Production با کمترین تغییر به API repository سوییچ می‌شود.

## Static routing constraint
چون Admin می‌تواند بعد از Build خودرو بسازد، detail route نباید نیازمند build-time dynamic route باشد.
Demo route پیشنهادی:
`/vehicle?slug=mercedes-s500-2025`
Production later:
`/cars/mercedes-s500-2025`

## Public routes
/
 /collection
 /vehicle
 /compare
 /sell-your-car
 /book-visit
 /about
 /branches
 /contact
 /journal
 /404

## Admin routes
/admin/login
/admin
/admin/vehicles
/admin/vehicles/new
/admin/vehicles/edit
/admin/integrations
/admin/settings

# USER STORIES

## US-001 — Global App Shell
As a visitor, I want the site shell to feel premium so I trust the AutoSafir brand.

Acceptance:
- Luxury minimal header.
- SAFIR logo.
- Nav: خانه، خودروها، مقایسه، فروش خودرو، درباره ما، شعب، تماس.
- Premium mobile full-screen/drawer nav.
- Theme toggle.
- Theme persists.
- Footer with social/contact and Developed by AKH custom wordmark.
- No public admin link.
- Coordinated page transitions.
- Transparent hero header may become surface after scroll.
- Mobile touch targets >=44px.

## US-002 — SAFIR Signature Intro
As a first-time visitor, I want a short cinematic intro so the SAFIR identity is memorable.

Flow:
1. Obsidian full screen.
2. SAFIR SVG paths draw.
3. Main lines muted ivory.
4. Gold diagonal stroke of A appears.
5. Restrained highlight.
6. AUTO SAFIR microcopy.
7. Mask/camera transition to Hero.
8. Unlock scroll.

Acceptance:
- 2–3 seconds.
- Not repeated on internal navigation.
- Shorter/skippable on repeat visit.
- Skip Intro.
- Reduced-motion fade variant.
- No CLS.
- Mobile 60fps target.
- SVG path animation, not heavy GIF/video fake.

## US-003 — Cinematic Homepage Hero
As a mobile visitor, I want an immediate premium automotive hero.

Acceptance:
- Full viewport.
- iOS/Android safe area.
- modern dvh/svh.
- responsive media.
- CTA: مشاهده خودروها.
- optional secondary CTA: موجودی امروز.
- subtle scroll cue.
- no price.
- muted autoplay only.
- Save-Data/weak device fallback to static premium image.
- Hero critical media prioritized.
- Works in Light/Dark.
- AutoSafir remains the brand; Mercedes is only design inspiration.
- Hero can rotate through multiple AutoSafir vehicles.

## US-004 — Scroll Story / Parallax
As a visitor, I want a cinematic scroll story.

Acceptance:
- subtle multi-layer parallax.
- restrained stagger text reveals.
- depth shift on vehicles.
- controlled mask/reveal transitions.
- no long trapped pinned sections.
- Mobile user never needs excessive scroll to escape a scene.
- proper cleanup of GSAP timelines/listeners.
- browser back/forward works.
- content remains readable without JS motion.

## US-005 — Adaptive 3D/WebGL
As a visitor on a capable device, I want premium 3D moments.

Quality tiers:
A Full WebGL/3D
B Cinematic video/image-sequence
C Static premium image

Acceptance:
- lazy-loaded R3F/Three.
- not critical render blocking.
- use only where asset quality supports it.
- weak devices fallback.
- WebGL context loss handled.
- error boundary.
- text/CTA remains semantic HTML outside Canvas.
- compressed textures.
- Draco/Meshopt when useful.
- pause hidden-tab animation.
- clamp DPR.
- restrained scroll rotation.

## US-006 — Vehicle Collection
As a buyer, I want to filter inventory.

Filters:
Status, Brand, Model, Year, Body Type, Mileage, Fuel, Transmission, Condition, Plate Type.

Acceptance:
- quick filters: همه / موجود / فروخته‌شده.
- Reserved distinct.
- no price.
- clear/reset.
- mobile bottom-sheet filter.
- active filter count.
- brand/model search.
- live result count.
- premium empty state.
- uniform vehicle cards.
- card: image, brand, model, trim, year, mileage, status, short specs.
- Sold tasteful desaturation + SOLD label.
- click opens detail.
- filters work on local demo data.

## US-007 — Vehicle Detail
As a serious buyer, I want a full cinematic vehicle detail.

Fields:
brand, model, trim, year, mileage, exteriorColor, interiorColor, bodyType, engine, horsepower, transmission, drivetrain, fuelType, condition, plateType, features, description, media, status, advisor, instagramUrl, createdAt.

Sections:
Cinematic Hero, Status, Key Specs, Exterior, Interior, Features, Technical Specs, Gallery, Video/Reel, Advisor, Related Cars, Compare CTA, Book Visit CTA.

Acceptance:
- no price.
- swipe gallery mobile.
- desktop thumbnails optional.
- accessible lightbox.
- lazy media.
- Sold detail stays visible.
- CTA: Call, WhatsApp Channel, Telegram, Instagram, Book a Visit.
- Web Share API when available + copy fallback.
- Related cars by brand/body/status.
- Add to Compare.
- local Admin-created vehicle detail works without rebuild.

## US-008 — Compare
As a buyer, I want to compare 2–3 vehicles.

Acceptance:
- min 2, max 3.
- easy add/remove.
- mobile horizontal swipe.
- readable sticky labels/equivalent.
- compare: model/trim, year, mileage, engine, horsepower, transmission, drivetrain, fuel, body type, colors, condition, features, status.
- no price.
- differences highlighted subtly, not loud red/green.
- selection persists.
- empty state links to Collection.

## US-009 — Sold Collection
As a visitor, I want to see sold inventory to understand dealership credibility.

Acceptance:
- sold vehicles never auto-delete.
- sold filter.
- optional Homepage Sold Collection section.
- full Sold detail remains.
- purchase CTA becomes مشابه‌ها / available alternatives.
- premium SOLD treatment.

## US-010 — Sell Your Car
As a seller, I want a premium multi-step flow.

Steps:
01 Vehicle
02 Condition
03 Media
04 Contact
05 Review

Fields:
Brand, Model, Year, Mileage, Exterior/Interior Color, Condition, Description, Name, Phone, optional local photo preview.

Acceptance:
- React Hook Form + Zod.
- progress indicator.
- mobile keyboard UX.
- local image preview only.
- no real server upload.
- premium success animation.
- unofficial demo must not falsely claim transmission to AutoSafir.
- production service interface prepared.

## US-011 — Book a Visit
As a buyer, I want a visit-booking UX.

Fields:
Vehicle, Name, Phone, Branch, Date, Time, Note.

Acceptance:
- vehicle preselected from detail.
- branch data centralized.
- validation.
- no past date.
- no real network write in Demo.
- premium success.
- immediate call CTA.
- future service adapter.

## US-012 — Social / Instagram Experience
As an Instagram-origin visitor, I want AutoSafir social content in the same visual language.

Acceptance:
- `SAFIR STORIES` section.
- vertical 9:16 cards.
- curated static Reel/Post URL list in Demo.
- no Instagram token needed.
- local video only when available/appropriate; otherwise poster + outbound link.
- no token in client.
- future Meta API adapter.
- failed embed never breaks layout.

## US-013 — Branches & Contact
As a visitor, I want fast access to branches and contact channels.

Acceptance:
- Branch 1: خیابان بهشتی، تقاطع احمد قصیر.
- Branch 2: خیابان مطهری، تقاطع مفتح.
- display current phone numbers.
- Instagram/Telegram/WhatsApp Channel links.
- click-to-call.
- copy address.
- only confirmed addresses used for maps.
- cinematic but usable Contact page.

## US-014 — About
As a new visitor, I want to understand the brand quickly.

Acceptance:
- short premium About.
- no unverified founding year, transaction count, "largest", etc.
- values can include curated vehicles, premium experience, trusted advisory.
- use real showroom imagery only when reliable asset exists.
- otherwise cinematic automotive abstract media.
- concise editorial copy.

## US-015 — Journal
As a visitor, I want editorial automotive content.

Acceptance:
- 3–6 static seed articles.
- examples: trim comparison, premium car inspection guide, tech/options.
- editorial article layout.
- related vehicle CTA.
- no fake claims/dates.
- future CMS/SEO adapter.

## US-016 — Light/Dark Theme
As a visitor, I want both themes without losing luxury identity.

Acceptance:
- demo may default dark.
- preference persists.
- no white flash.
- no hydration mismatch.
- light = warm ivory/cream/champagne/graphite.
- dark = obsidian/graphite/champagne/ivory.
- Canvas/3D theme-aware or neutral.
- contrast/focus checked.

## US-017 — Demo Admin Login
As the presenter/admin, I want a separate admin entry.

Critical: static client login is not secure.

Acceptance:
- /admin/login.
- premium visual login.
- demo credential only acts as UI gate.
- no real secret.
- no admin public link.
- sessionStorage/localStorage gate allowed.
- production auth replacement point documented.
- do not claim secure auth.

## US-018 — Luxury Admin Dashboard
As an AutoSafir admin, I want a premium dashboard.

Acceptance:
- Luxury Enterprise style, not cinematic/WebGL-heavy.
- responsive navigation.
- KPI from local vehicle data: Total, Available, Sold, Reserved.
- recent vehicles.
- quick add.
- subtle DEMO badge.
- Light/Dark.
- mobile usable.
- no decorative meaningless chart.

## US-019 — Admin Vehicle CRUD
As an admin, I want to create/read/update/delete vehicles.

Form groups:
General, Specifications, Features, Media, Status, Advisor, Publishing.

Acceptance:
- React Hook Form + Zod.
- required fields.
- slug auto-generated/editable.
- duplicate id/slug blocked.
- media by local path/string/local preview.
- CRUD persists in localStorage/IndexedDB.
- Public Collection reads same persisted store.
- status updates immediately visible publicly.
- premium delete confirm.
- search/sort/filter admin list.
- Reset Demo Data.
- Export JSON.
- Import JSON with schema validation and confirmation.
- invalid import does not corrupt current state.
- immutable seed copy for reset.
- schema version for persisted data.

## US-020 — Integrations Demo
As a decision maker, I want to visualize future multi-channel publishing.

UI:
Website Ready
Divar Demo
Bama Demo
Instagram Demo
n8n Planned

Simulation:
Preparing vehicle → Optimizing images → Website → Divar → Bama → Instagram → Complete

Acceptance:
- no real external write.
- no API key.
- explicit demo status.
- optional simulated failure.
- define PublishingProvider interface.
- Demo fake provider.
- Production server/n8n provider later.

## US-021 — Mobile-first
As the majority mobile audience, I want zero compromise on phone.

Acceptance:
- design first at 360–430px.
- safe areas.
- dvh/svh.
- zero horizontal overflow.
- readable typography.
- thumb-friendly controls.
- bottom sheets where suitable.
- swipe gallery.
- tap states.
- no hover-only info.
- muted inline video.
- touch scroll never blocked.
- fixed CTA doesn't cover content.
- adaptive 3D.
- reduced motion.
- landscape usable.
- forms survive keyboard opening.

## US-022 — Performance
As a mobile visitor, I want fast loading despite motion/3D.

Acceptance:
- route code splitting.
- WebGL dynamic import.
- responsive AVIF/WebP when practical.
- video poster.
- no large autoplay on Save-Data.
- optimized/self-hosted fonts where possible.
- critical-only preload.
- offscreen lazy load.
- no animation memory leaks/listener duplication.
- mobile quality tier.
- profile on mid-range Android.
- minimal CLS.
- core UI usable before heavy 3D.

## US-023 — Accessibility
Acceptance:
- semantic HTML.
- heading hierarchy.
- meaningful alt.
- keyboard nav.
- visible focus.
- accessible dialogs.
- real labels.
- reduced-motion.
- color contrast.
- status not color-only.
- Canvas has equivalent HTML content.
- AKH SVG has aria-label.
- accessible theme toggle.
- field errors associated.

## US-024 — Demo SEO/Indexing
Demo:
- robots noindex,nofollow.
- do not impersonate official production website in metadata.
Production later:
- vehicle metadata.
- OpenGraph.
- AutoDealer/Organization + Vehicle structured data.
- sitemap/robots/canonical.
- journal SEO.
- no unverified structured claims.

## US-025 — Edge States
Must design:
no vehicles, no filter result, missing vehicle/image/video, WebGL unsupported, invalid JSON import, unavailable/corrupt storage, offline, 404, reduced-motion, theme hydration.

No blank/crashed screen allowed.

## Vehicle model
```ts
export type VehicleStatus = "AVAILABLE" | "SOLD" | "RESERVED";

export interface VehicleAdvisor {
  name: string;
  phone: string;
}

export interface VehicleMedia {
  id: string;
  type: "IMAGE" | "VIDEO";
  src: string;
  alt?: string;
  poster?: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  trim?: string;
  year: number;
  mileage: number;
  exteriorColor?: string;
  interiorColor?: string;
  bodyType?: string;
  engine?: string;
  horsepower?: number;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  condition?: string;
  plateType?: string;
  features: string[];
  description?: string;
  media: VehicleMedia[];
  status: VehicleStatus;
  advisor?: VehicleAdvisor;
  instagramUrl?: string;
  createdAt: string;
  updatedAt?: string;
}
```

Price field intentionally absent.

## Demo state
Seed JSON → DemoVehicleRepository → Zustand Store → persist → localStorage/IndexedDB.

Rules:
- first visit hydrates seed.
- mutations persist.
- Public reads same store.
- reset restores seed.
- export current valid JSON.
- import validates then replaces after confirmation.
- persisted schema versioned.

## Content seed
Demo target: 20–30 real AutoSafir vehicles.
Suggested: 12–15 Available + 8–15 Sold.

Rules:
- facts from real AutoSafir content.
- unknown facts are not guessed.
- no price.
- uncertain technical spec remains blank unless verified against exact model/year.
- Instagram URL stored when known.
- AI imagery must not distort model identity.
- temporary public social assets should be replaced by authorized originals before Production.

## AI/Cinematic asset direction
Dark:
Luxury automotive studio photography; museum-grade lighting; obsidian environment; champagne-gold edge reflections; controlled volumetric light; premium editorial automotive campaign; realistic materials; restrained contrast; no cyberpunk; no neon; no excessive lens flare; no fake text; no altered proportions.

Light:
Warm ivory architectural studio; soft champagne reflections; natural premium daylight; minimal editorial automotive campaign.

## Admin visual direction
Public = Cinematic Luxury.
Admin = Luxury Enterprise.
No stock dashboard template. Strong grid, refined cards, restrained shadows, excellent spacing, precise typography, premium status treatment.

## Suggested folders
```text
src/
  app/
  components/{ui,layout,branding,vehicle,animation,three,forms,admin}
  features/{vehicles,compare,sell-car,booking,social,publishing}
  repositories/
  services/
  stores/
  data/
  hooks/
  lib/
  schemas/
  types/
  styles/
public/{branding,cars,videos,models,textures}
docs/
AGENTS.md
```

## Production upgrade
Next.js → ASP.NET Core Web API → SQL Server → domain/application events → n8n → external channels.

Production rules:
- SQL Server source of truth.
- n8n is not database.
- API keys server-side only.
- real auth.
- server validation.
- rate limits.
- external image storage.
- audit log.
- publishing retry/idempotency.
- integration status.
- monitoring/backups.

## Testing
Unit:
filters, repository, persistence migration, status helpers, compare rules, form schemas.

Component:
VehicleCard, Filters, Theme Toggle, Admin Vehicle Form, Compare, dialogs.

E2E business flow:
1. Homepage load.
2. Intro complete/skip.
3. Collection filter.
4. Vehicle detail.
5. Compare two cars.
6. Theme switch.
7. Admin login.
8. Create vehicle.
9. Public sees new vehicle.
10. Change to SOLD.
11. Public reflects SOLD.
12. Delete.
13. Export JSON.
14. Reset.
15. Import valid JSON.
16. Reject invalid JSON safely.
17. Sell form success.
18. Booking form success.
19. reduced-motion.
20. mobile navigation.

## QA devices
Chrome Android, Safari iPhone, Chrome/Firefox/Edge desktop.
Widths: 360, 375, 390, 412, 430, 768, 1024, 1280, 1440+.
At least one throttled mid-range Android profile.

## Definition of Done
A feature is not done until:
- Mobile checked.
- Dark/Light checked.
- Reduced motion checked.
- Empty/error state exists.
- Keyboard checked.
- no console/hydration errors.
- no obvious CLS.
- no broken links.
- no price exposed.
- no secret/API key.
- static export succeeds.
- direct refresh works on target host.
- admin local CRUD persists.
- public reflects CRUD.
- responsive QA done.
- animation cleanup verified.
- performance regression reviewed.

## Codex implementation phases
0 Foundation: Next/TS, Tailwind, lint/format, folders, tokens, theme, typography, static export, tests.
1 Data: model, Zod, seed, repository, Zustand persistence, reset/import/export.
2 Global UI: header, mobile nav, footer, AKH SVG, page transitions.
3 Collection.
4 Vehicle Detail.
5 Compare.
6 Sell Your Car + Book Visit.
7 About/Branches/Contact/Journal.
8 Admin.
9 Signature Motion: SAFIR intro, GSAP parallax/transitions.
10 Adaptive 3D.
11 Real AutoSafir seed/content polish.
12 QA/performance/accessibility/static hosting.

Do NOT implement all phases in one prompt/commit.

## Codex working rules
- Read this spec before each phase.
- Do not change architecture casually.
- Do not add out-of-scope features.
- Do not use generic stock UI templates.
- No random gradients/glows.
- Mobile first.
- Functional first, motion second.
- Heavy 3D only after foundation is stable.
- End each phase with summary, files changed, tests run, known limitations.
- No secrets.
- Demo integrations explicit mocks only.
- Price nowhere in public mock data/components/metadata.
- If a requirement has architectural consequences, ask. Otherwise make a conservative decision consistent with the design system.

## Presentation scenario
1. Open URL on mobile.
2. SAFIR intro.
3. Cinematic homepage.
4. Available collection.
5. Filter.
6. Open vehicle.
7. Compare.
8. Sold collection.
9. Contact/social.
10. Manually open /admin.
11. Dashboard.
12. Add vehicle.
13. Save.
14. Return public.
15. See new vehicle.
16. Change to Sold.
17. See Sold state.
18. Open Integrations Demo.
19. Explain future flow:
Admin → Website → n8n → Divar/Bama/Instagram.

This presentation flow is the primary commercial acceptance test.
