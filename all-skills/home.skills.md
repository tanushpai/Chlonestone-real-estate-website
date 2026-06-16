# Home Page — `/`

Marketing landing page. First impression; must load fast, look premium, and funnel into search → property detail → lead capture.

## Route

`app/(marketing)/page.tsx` — RSC. No `"use client"` at the top.

## Sections (top → bottom)

1. **Hero** — Full-bleed image/video, H1 (single per page), one-line value prop, `HeroSearch` (community, listing, beds, price range).
2. **Featured Properties** — 6–8 hand-picked cards (`featured = true`), horizontal scroll on mobile, grid on desktop.
3. **Communities strip** — 4–6 communities, image + name + avg price.
4. **Why us** — 3 trust badges (transactions YTD, RERA license, languages).
5. **Off-plan teaser** — 3 projects with handover date + developer.
6. **Press / Awards logo bar** — grayscale, hover color.
7. **Testimonials** — 3, schema.org `Review` JSON-LD.
8. **Final CTA** — "Talk to a specialist" → opens `LeadCaptureModal`.
9. **Footer** (shared layout).

## Data fetching

```ts
// Parallel — never sequential awaits
const [featured, communities, offPlan] = await Promise.all([
  propertyService.featured(8),
  communityService.top(6),
  propertyService.offPlanTeaser(3),
]);
```

Wrap each section after the hero in `<Suspense fallback={<Skeleton />}>` so the hero streams first.

## SEO

- `title`: `"Luxe Properties — Dubai's Curated Real Estate"` (≤60)
- `description`: one sentence, includes "Dubai", "luxury", "buy", "rent" (≤160)
- `og:image`: branded hero (1200×630), NOT a generic property photo
- JSON-LD: `Organization` + `WebSite` with `SearchAction`

## Performance budget

- LCP: hero image, `priority` + AVIF, < 2.0s on 4G
- CLS: 0 — reserve hero height with aspect ratio
- JS shipped: < 120 KB gz on this route

## Anti-patterns

- ❌ Multiple `<h1>` (search bar label is not h1)
- ❌ Auto-playing video with sound
- ❌ Carousel as the primary hero (kills LCP)
- ❌ Importing Mapbox on this page
