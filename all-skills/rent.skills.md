# Rent Listings — `/rent`

Catalog of `listing = "rent"`. Same shape as `/buy` with rent-specific UX.

## Route

`app/(marketing)/rent/page.tsx` — RSC. Mirror `/buy` skill.

## Differences from `/buy`

- **Price filter** is per **year** by default, with a toggle to monthly (`pricePeriod`).
- **Additional filters**: `furnished` (true/false/either), `minLeaseMonths` (3/6/12), `petsAllowed`, `billsIncluded`, `cheques` (1/2/4/12).
- **Card** shows `AED 180,000 / yr` with secondary line `≈ AED 15,000 / mo`.
- **Sort** options: `price-asc`, `newest`, `availability-soonest`.
- **Available from** date filter (`availableFrom >= today`).
- **No off-plan toggle** — rentals are ready by definition.

## SEO

- `title`: `"Apartments for Rent in Dubai | Luxe Properties"`
- Generate static pages for high-intent slugs: `/rent/apartments-in-dubai-marina`, etc. via `generateStaticParams` mapped to filter presets.

## Conversion notes

- Renters convert faster — surface **"Book a viewing"** CTA on the card itself, not only on detail page.
- Track `daysOnMarket`; ribbon "New" if ≤ 3 days, "Reduced" if price dropped in last 14 days.

## Anti-patterns

- ❌ Showing sale + rent in one list (always scope by `listing`)
- ❌ Confusing yearly vs monthly price — always label the unit
