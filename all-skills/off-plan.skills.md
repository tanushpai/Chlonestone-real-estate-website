# Off-Plan Projects — `/off-plan`

Developer-led pre-construction sales. Different shape from resale — focus on **project** (a development) not individual unit.

## Route

`app/(marketing)/off-plan/page.tsx` — RSC, ISR `revalidate: 3600`.

## Domain model addition

Off-plan needs a `Project` table (separate from `Property`):

```prisma
model Project {
  id           String   @id @default(cuid())
  slug         String   @unique
  name         String
  developer    String
  communityId  String
  handoverDate DateTime
  startingPrice Decimal
  paymentPlan  Json     // [{milestone: "On booking", pct: 10}, ...]
  unitMix      Json     // [{beds: 1, fromSqft: 700, fromPrice: 1_200_000}, ...]
  status       ProjectStatus  // announced | selling | sold-out | handed-over
  brochureKey  String?  // S3 key
  images       ProjectImage[]
  units        Property[]  @relation("ProjectUnits")
}
enum ProjectStatus { announced selling sold_out handed_over }
```

## Index page sections

1. **Hero** — "Dubai's newest launches" + filter chips (developer, handover year, community, starting price).
2. **Filter bar** — sticky.
3. **Project cards** — image, developer badge, name, community, "From AED X", "Handover Q3 2027", "Starting at 10% down", ribbon if `selling` is new.
4. **Map view toggle** — show project pins with handover-year color scale.
5. **Compare drawer** — pick up to 3 projects → side-by-side payment plans + unit mixes.

## Project detail — `/off-plan/[slug]`

1. **Gallery** — renders, masterplan, floor plans (separate tabs).
2. **Key facts strip** — Developer · Handover · Total units · Starting price.
3. **Payment plan** — visual timeline (10% booking → 40% during construction → 50% on handover).
4. **Unit mix table** — beds / sqft range / price range / availability count.
5. **Masterplan** — interactive image hotspots OR Mapbox satellite with building polygons.
6. **Location & amenities** — drive times to airport/metro/mall.
7. **Developer profile** — track record (past completed projects with year + on-time %).
8. **Brochure download** — gates email (creates lead with `source: "brochure-download"`, sends signed S3 URL by email — do NOT return it inline).
9. **Register interest** — `LeadCaptureModal` with `interest: "off-plan"`, `projectId`.

## Lead capture nuance

Off-plan leads are hotter than resale. Custom fields:

- Investor or end-user
- Funding (cash / mortgage / installments)
- Timeframe (now / 3-6 months / exploring)

Route to a dedicated `off-plan` agent pool, not the general round-robin.

## SEO

- JSON-LD: `Apartment` or `Residence` per unit type + `Organization` for developer.
- Pre-render all `selling` projects with `generateStaticParams`.
- Schema for handover date: `availabilityStarts`.

## Compliance (UAE/Dubai)

- Show RERA project number, escrow account number, permit number — these are legally required on every off-plan listing in Dubai.
- Store these in `Project` table, never hardcode.

## Anti-patterns

- ❌ Treating each unit as a separate listing in the main `/buy` page
- ❌ Returning brochure URL without email capture (leakage + lost lead)
- ❌ Omitting RERA/escrow numbers (legal risk in UAE)
- ❌ "Guaranteed ROI" copy (banned by regulators)
