# Buy Listings — `/buy`

Catalog of `listing = "sale"` properties. Faceted search, URL-driven filters, server-rendered.

## Route

`app/(marketing)/buy/page.tsx` — RSC. `searchParams` is the source of truth.

## URL params (all optional, all validated by zod)

```
?community=marina,downtown
&kind=apartment,penthouse
&minPrice=1000000&maxPrice=10000000
&beds=2,3,4
&completion=ready|off-plan
&furnished=true
&sort=price-asc|price-desc|newest
&page=1
```

Use `nuqs` or hand-rolled URL helpers. Never store filter state in `useState` for SSR'd pages.

## Layout

- **Sticky filter bar** (top, desktop): communities multi-select, price slider, beds chips, more filters drawer.
- **Mobile**: filter button → bottom Sheet.
- **Results header**: "X properties in Dubai" + sort dropdown + map toggle.
- **Two-pane**: results grid (left) + Mapbox map (right, sticky) on desktop ≥1280px. Map markers cluster; hovering a card highlights the marker and vice versa.
- **Property cards**: image carousel (3 photos preload), price, beds/baths/sqft, community, agent avatar, save heart.
- **Pagination**: 24 per page, server-paginated, `<Link rel="next" />` + `<Link rel="prev" />` in head.

## Data

```ts
const filters = BuySearchSchema.parse(searchParams);
const { items, total, facets } = await propertyService.search({
  ...filters, listing: "sale",
});
```

`facets` returns counts per community/kind/bed so the filter bar shows "Marina (124)".

Cache with `unstable_cache` keyed on the serialized filter object, tag `"properties"`. Revalidate tag on any property mutation.

## SEO

- `title`: build from filters — `"2-bed Apartments for Sale in Dubai Marina | Luxe"` when filters active, else generic.
- `canonical`: strip non-canonical params (`page=1`, default sort).
- JSON-LD: `ItemList` of the first page results with `RealEstateListing` items.
- `rel=prev/next` for pagination.
- Disallow `?` URLs with too many combinations in `robots.ts` (allow main facets only).

## Performance

- Cards use `next/image` with `sizes="(max-width: 768px) 100vw, 33vw"`.
- Map is lazy: `dynamic(() => import("@/components/map/MapboxMap"), { ssr: false })` and only mounted when user toggles map view OR viewport ≥1280px AND `prefers-reduced-data: no-preference`.
- Defer marker rendering with `requestIdleCallback`.

## Empty state

"No properties match these filters." + "Clear filters" button + 3 suggested similar searches.

## Anti-patterns

- ❌ Filter state in `useState` (breaks deep links + SSR)
- ❌ Fetching all properties client-side and filtering in JS
- ❌ Map and grid both mounted on mobile (kills perf)
- ❌ Infinite scroll without `?page=N` URL fallback (kills SEO)
