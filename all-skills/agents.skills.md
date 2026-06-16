# Agents — `/agents` and `/agents/[id]`

Agent directory + individual profile. Profiles convert: many users prefer "people first" over "property first".

## Index — `/agents`

`app/(marketing)/agents/page.tsx` — RSC, ISR `revalidate: 3600`.

Sections:
1. **Filter bar** — language, specialization (luxury / off-plan / commercial / villas), community focus, sort (top sellers / highest rated / most reviews).
2. **Grid of agent cards** — photo, name, title, rating + reviews, sold count last 12mo, languages (flag chips), top community badge.
3. **Pagination** — 24 per page.

## Detail — `/agents/[id]`

`app/(marketing)/agents/[id]/page.tsx` — RSC.

Sections:
1. **Hero band** — large photo, name, title, RERA BRN, rating, years of experience.
2. **CTA row** — Call · WhatsApp · Email · Book a meeting. Phone is click-to-call, WhatsApp deep link with prefilled message ("Hi, I saw your profile on Luxe...").
3. **About** — bio, languages, specializations.
4. **Stats strip** — properties sold (12mo), AED transacted, avg days to close, response time.
5. **Active listings tab** — grid of agent's properties.
6. **Sold listings tab** — last 24 months, with sold price + days on market.
7. **Reviews** — verified buyer/seller reviews; `Review` JSON-LD. Show rating breakdown (knowledge / responsiveness / negotiation).
8. **Service areas** — map highlighting communities agent works in.
9. **Lead capture** — sticky right rail "Get in touch with ${firstName}".

## Data

```ts
const agent = await agentService.byId(params.id);
if (!agent) notFound();
const [active, sold, reviews, stats] = await Promise.all([
  propertyService.byAgent(agent.id, { status: "published" }),
  propertyService.byAgent(agent.id, { status: "sold", months: 24 }),
  reviewService.forAgent(agent.id, { limit: 20 }),
  reportService.agentStats(agent.id),
]);
```

## Privacy

- Public profile shows business phone/email only — never personal.
- Hide reviewer's last name (`Sarah K.`).
- WhatsApp button uses a centralized number, not personal mobile, if agency policy requires.

## SEO

- `title`: `"${agent.name} — ${agent.title} at Luxe | Dubai Real Estate"`
- JSON-LD: `RealEstateAgent` (Person) with `worksFor` (Organization), `knowsLanguage`, `aggregateRating`.
- `og:image`: agent photo (square crop, 1200×1200 → letterboxed for 1200×630).

## Lead routing

Leads from `/agents/[id]` → directly assigned to that agent (not round-robin). Falls back to round-robin if agent is on leave (`agent.status = "away"`).

## Anti-patterns

- ❌ Showing personal mobile/WhatsApp without consent
- ❌ Fake/manufactured reviews (legal risk + trust collapse)
- ❌ Listing agent without RERA BRN visible (regulatory violation in Dubai)
