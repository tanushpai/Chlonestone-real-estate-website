# Market Insights — `/market-insights`

Data-driven content marketing. Long dwell time; positions the brand as authority.

## Route

`app/(marketing)/market-insights/page.tsx` — RSC, `revalidate: 21600` (6h).

## Sections

1. **Hero** — H1 "Dubai Property Market Insights" + last updated timestamp.
2. **Headline KPIs** — 4 stat cards: avg price psf (delta vs LY), transactions volume (delta), rental yield avg, off-plan share %.
3. **Price index chart** — line chart, 5-year, toggle sale vs rent, by community filter. `recharts` (client) but data server-fetched.
4. **Transactions by community** — bar chart, top 15 communities by volume this quarter.
5. **Hot communities** — table with sortable columns: community, avg price, YoY %, rental yield, days on market.
6. **Off-plan launches** — timeline of upcoming handovers.
7. **Reports** — downloadable PDF quarterly reports (S3 signed URLs, email-gated).
8. **Newsletter signup** — "Get monthly insights" → lead with `source: "insights-newsletter"`.

## Data source

- DLD (Dubai Land Department) open transactions data, ingested nightly by a cron worker into `market_transactions` table.
- Aggregations computed in materialized views, refreshed by `pg_cron` every 6h.
- Never compute heavy aggregates on request — always pre-aggregate.

```ts
const [kpis, priceIndex, hotCommunities] = await Promise.all([
  marketService.kpis(),
  marketService.priceIndex({ years: 5 }),
  marketService.hotCommunities({ limit: 15 }),
]);
```

## SEO

- `title`: `"Dubai Real Estate Market Insights ${year} | Luxe"`
- JSON-LD: `Dataset` + `Report` for each downloadable PDF.
- Republish month-over-month with `dateModified` updated → strong freshness signal.

## Performance

- Charts: serialize data on server, hydrate small client component. Don't ship raw transaction rows to the browser.
- Limit table to top 15; full table behind "View all".

## Citations & trust

- Every chart needs a "Source: DLD, ${month} ${year}" caption.
- Methodology link → `/market-insights/methodology` page explaining how indices are computed.

## Anti-patterns

- ❌ Made-up numbers or "Luxe Index" without methodology
- ❌ Shipping 50k transaction rows to the client
- ❌ Stale data without a "last updated" stamp
