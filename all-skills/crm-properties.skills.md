# CRM Properties — `/crm/properties`

Internal inventory management. Same `Property` table as the public site, augmented with `status` (`draft|published|sold|rented|archived`), `views`, `inquiries`.

## Index — `/crm/properties`

- **Filters**: status, listing (sale/rent), community, agent, completion (ready/off-plan), price range, beds, search.
- **Table** columns: thumbnail, title, slug, community, listing, price, beds, status badge, views, inquiries, days on market, agent, actions.
- **Quick actions**: publish/unpublish, mark sold/rented, duplicate, archive.
- **Bulk**: change status, reassign agent, export CSV, add to feed export (Property Finder / Bayut XML).

## Create / Edit — `/crm/properties/new` and `/crm/properties/[id]/edit`

Multi-step form (saves draft after each step):

1. **Basics** — title, listing type, completion, kind, community (typeahead), address (Mapbox autocomplete → lat/lng).
2. **Specs** — beds, baths, area sqft, parking, furnished, year built.
3. **Pricing** — price, currency, price period (rent only), service charges, payment plan (off-plan only).
4. **Description & features** — rich text (Tiptap), features multi-select, amenities.
5. **Media** — drag-drop uploader → signed S3 PUT → store keys; reorder via dnd-kit; primary photo selector; auto-AVIF conversion in background job.
6. **Compliance** — RERA permit number, Trakheesi number, BRN. **Required for publish**.
7. **Agent assignment**.
8. **SEO** — slug (auto-generated from title + bedrooms + community, editable; uniqueness validated), meta title/description overrides.
9. **Review & publish**.

## Validation

```ts
const PropertyPublishSchema = z.object({
  title: z.string().min(10).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/).max(120),
  listing: z.enum(["sale","rent"]),
  price: z.number().positive().max(1_000_000_000),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  areaSqft: z.number().int().positive(),
  images: z.array(z.string()).min(3),                 // S3 keys
  reraPermit: z.string().min(5),                       // required to publish
  trakheesi: z.string().min(5),
  agentId: z.string(),
  // ...
});
```

Save-as-draft can skip RERA/images checks; publish cannot.

## Media pipeline

- Client requests `POST /api/media/upload` → returns `{ url, key, fields }` signed for 5 min, `Content-Type` locked.
- Client PUTs file directly to S3.
- After upload, client `POST /api/properties/[id]/images { key }` to register.
- Background job (Inngest): generate AVIF/WebP variants in 4 widths (400/800/1200/1920), update DB with variant URLs.
- Virus scan via ClamAV Lambda before public exposure.

## Feed exports

- Nightly cron generates Property Finder + Bayut XML feeds → S3 → portal pulls.
- Only `published` properties with complete compliance fields included.

## Permissions

- `agent`: edit own listings only
- `agency_admin`: all in agency, can reassign
- `admin`: all
- Auditing: every edit writes `PropertyEvent`.

## Anti-patterns

- ❌ Publishing without RERA/Trakheesi (regulatory violation)
- ❌ Uploading via your API server (bandwidth + memory) — always signed S3 PUT
- ❌ Storing raw images without optimization variants
- ❌ Hard-delete properties with active leads or viewings (block + suggest archive)
