# Contact Page — `/contact`

Direct enquiry funnel + office details. Must be reachable from every page footer.

## Route

`app/(marketing)/contact/page.tsx` — RSC shell + client `ContactForm`.

## Sections

1. **Heading** — H1 "Get in touch", subtitle naming response SLA ("within 2 business hours").
2. **Two-column layout**
   - **Left:** Contact form (name, email, phone with country code, topic select, message, GDPR checkbox, hCaptcha).
   - **Right:** Office card (address, embedded Mapbox static image — NOT interactive map, saves JS), phone (click-to-call), WhatsApp button, email, opening hours, social links.
3. **FAQ accordion** — 6–8 common pre-sales questions (financing, viewings, off-plan).
4. **Footer CTA** — "Prefer to book a viewing?" → `/properties`.

## Form

```ts
const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  phone: z.string().min(7).max(20),
  topic: z.enum(["buy","rent","sell","off-plan","general"]),
  message: z.string().min(10).max(2000),
  consent: z.literal(true),
  captchaToken: z.string().min(10),
});
```

Submission: `POST /api/leads` with `source: "contact-form"`. Verify captcha server-side. Rate-limit by IP (5/hour).

## After submit

- Toast: "Thanks — an advisor will reach out shortly."
- Redirect: stay on page, replace form with success state (do NOT navigate away — kills attribution).
- Send transactional email (Resend/SES): user receipt + internal notify to round-robin agent.

## SEO

- `title`: `"Contact Luxe Properties | Dubai Office"`
- JSON-LD: `RealEstateAgent` with `address`, `telephone`, `openingHoursSpecification`
- Static map image (Mapbox Static API) — instant LCP, no JS

## Anti-patterns

- ❌ Live interactive map above the fold (CLS + JS cost)
- ❌ Form without captcha or rate-limit → spam
- ❌ `mailto:` only (kills conversion tracking)
