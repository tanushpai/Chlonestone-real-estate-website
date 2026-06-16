# Property Detail — `/properties/[slug]`

Highest-converting page. Goal: enough info to book a viewing or submit a lead, in under 8s of scroll.

## Route

`app/(marketing)/properties/[slug]/page.tsx` — RSC with streaming.

```ts
export async function generateStaticParams() {
  const slugs = await propertyService.featuredSlugs(500);
  return slugs.map(slug => ({ slug }));
}
export const revalidate = 3600;
export async function generateMetadata({ params }) { /* dynamic OG + title */ }
```

## Sections

1. **Breadcrumb** — Home / Buy / Marina / This Property.
2. **Gallery** — hero (16:9, `priority`), thumbnail row, "View all (N)" → lightbox (intercepting modal route `@modal/(.)properties/[slug]/photos`).
3. **Title bar** — H1 (single), address, listing type ribbon, save heart, share menu.
4. **Price + key stats** — price (large), beds, baths, sqft, parking, completion status. Use `<dl>`.
5. **Two-column body**
   - **Left (2/3)**: Description, features list, amenities grid, floor plan (image w/ zoom), location section (Mapbox map + nearby points), similar properties.
   - **Right (1/3)**: Sticky agent card (photo, name, rating, "Call" / "WhatsApp" / "Email" / "Book viewing" buttons), payment calculator (mortgage), schedule viewing form.
6. **Lead capture modal trigger** on "Book viewing" / "Request info" / scroll-50% (only once per session).
7. **Below fold**: Similar properties (Suspense streamed), agent's other listings.

## Data

```ts
const property = await propertyService.bySlug(params.slug);
if (!property) notFound();
// stream the rest
const similarPromise = propertyService.similar(property.id, 6);
```

In JSX:
```tsx
<Suspense fallback={<SimilarSkeleton />}>
  <SimilarProperties promise={similarPromise} />
</Suspense>
```

## SEO

- `title`: `"${property.bedrooms}-bed ${kind} for ${listing} in ${community} | AED ${price}"`
- `description`: first 155 chars of clean description.
- `og:image` = first property image (full URL).
- JSON-LD `RealEstateListing` with `price`, `priceCurrency`, `address`, `geo`, `numberOfRooms`, `floorSize`, `image[]`, `agent` (Person).
- Canonical: `/properties/[slug]` even if visited with tracking params.

## Lead capture

- Form posts to `POST /api/leads` with `propertyId`, `source: "property-detail"`.
- On submit: toast + replace agent card with "We'll reach out within 2 hours" success state.
- Fire analytics event `lead_submit` with property attributes (price bucket, community).

## Compliance (UAE)

- RERA permit number visible in footer of card.
- Trakheesi number for the listing.
- Agent BRN (Broker Registration Number).

## Performance

- LCP: hero image, `priority`, AVIF, sized to viewport.
- Mapbox lazy-loaded only when location section enters viewport (`IntersectionObserver`).
- Mortgage calculator: client component, < 5 KB.

## 404 / unpublished

- If `property.status !== "published"` (CRM-side draft/sold/rented) and visitor is not staff → `notFound()` with custom `not-found.tsx` suggesting similar listings.
- If sold/rented and recently → show with "No longer available" banner + similar.

## Anti-patterns

- ❌ Lightbox as a full-page nav (breaks back button — use intercepting routes)
- ❌ Auto-opening lead modal on load (kills bounce)
- ❌ Inline 30 images without lazy-loading
- ❌ Map mounted at top of file (loads Mapbox even when user never scrolls)
