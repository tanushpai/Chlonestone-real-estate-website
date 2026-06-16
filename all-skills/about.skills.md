# About Page — `/about`

Company story, team, credentials. Static content; high SEO value for branded queries.

## Route

`app/(marketing)/about/page.tsx` — RSC. `export const revalidate = 86400` (24h ISR).

## Sections

1. **Hero strip** — H1 ("About Luxe"), subtitle, single editorial photo.
2. **Story** — 2–3 paragraphs, founding year, mission. Pull from CMS (`aboutContent.story`) so marketing can edit without a deploy.
3. **By the numbers** — 4 stat tiles (years operating, transactions, AED transacted, team size). Pulled live from DB aggregates with 1h cache.
4. **Leadership** — 3–6 leadership cards (photo, name, role, LinkedIn).
5. **Full team grid** — links into `/agents`.
6. **Credentials** — RERA license, ISO, awards (image + caption + year).
7. **Values** — 3 columns, icon + heading + 1 sentence.
8. **CTA band** — "Join the team" → `/careers`, "Work with us" → `/contact`.

## Data

```ts
const [stats, leadership] = await Promise.all([
  reportService.companyStats(),     // cached: unstable_cache, tag "company-stats"
  agentService.leadership(),
]);
```

## SEO

- `title`: `"About Luxe Properties | Dubai Real Estate Specialists"`
- JSON-LD: `Organization` with `foundingDate`, `numberOfEmployees`, `award[]`, `address`
- `og:image`: team photo, not a logo

## Accessibility

- Leadership photos need `alt={\`\${name}, \${role}\`}`
- Stat tiles: use `<dl>/<dt>/<dd>` so screen readers announce label + value
- Award images: `alt` with year + awarding body

## Anti-patterns

- ❌ Wall of stock photos
- ❌ Hardcoded numbers that drift from reality — always pull stats from DB
- ❌ Embedding a 50MB autoplay reel
