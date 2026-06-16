# Communities — `/communities` and `/communities/[slug]`

Neighborhood guides. SEO goldmine — long-tail traffic for "living in Dubai Marina", "Palm Jumeirah area guide", etc.

## Index route — `/communities`

`app/(marketing)/communities/page.tsx` — RSC, `revalidate: 86400`.

Sections:
1. **Hero** — map of Dubai with all community polygons; click → community page.
2. **Grid** — cards: cover image, name, avg price, rental yield %, YoY growth %, popular for (apartments / villas).
3. **Filter strip** — city (Dubai/Abu Dhabi), best for (investment / family / lifestyle), price tier.

## Detail route — `/communities/[slug]`

`app/(marketing)/communities/[slug]/page.tsx` — RSC, `generateStaticParams` for all communities.

Sections:
1. **Hero** — community cover + name + 1-line tagline.
2. **Stats strip** — avg price (sale + rent), rental yield, YoY growth, avg days on market, population.
3. **Description** — 3–4 paragraphs (editorial, from CMS).
4. **Map** — Mapbox with community boundary polygon + key amenities pins (schools, malls, metro, beach).
5. **Live listings** — split tabs: For Sale (8 cards) / For Rent (8 cards) → "View all" → `/buy?community=slug`.
6. **Off-plan in this community** — project cards.
7. **Lifestyle** — schools, dining, gyms, beaches (curated, with photos).
8. **Transport** — metro lines, drive times to DXB, downtown, JBR.
9. **Investment snapshot** — chart: price psf over last 5 years (`recharts`, server-fetched data).
10. **Top agents in this community** — 3 cards with sold count.
11. **FAQ accordion** — schema.org `FAQPage` JSON-LD.

## Data

```ts
const [community, listings, offPlan, priceHistory, topAgents] = await Promise.all([
  communityService.bySlug(params.slug),
  propertyService.byCommunity(params.slug, { limit: 16 }),
  projectService.byCommunity(params.slug),
  reportService.pricePsfHistory(params.slug, { months: 60 }),
  agentService.topInCommunity(params.slug, 3),
]);
if (!community) notFound();
```

## SEO

- `title`: `"${community.name} Area Guide — Properties, Prices & Lifestyle | Luxe"`
- JSON-LD: `Place` with `geo`, `containedInPlace` (city); `FAQPage` for FAQ.
- Internal linking: every property card on `/properties/[slug]` links community name → this page.

## Performance

- Boundary polygon GeoJSON cached to S3, fetched as static asset (not from DB on every render).
- Price chart rendered server-side as SVG if possible (`@visx`) to skip client JS.

## Anti-patterns

- ❌ Stuffing keywords ("buy property Dubai Marina cheap best luxury")
- ❌ Fake stats — every number must come from a service backed by DB
- ❌ Mapbox loaded eagerly above the fold (LCP killer); lazy-load
