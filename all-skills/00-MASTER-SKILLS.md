# SKILLS.md — Building Luxe-Style Real Estate Platforms

> **Purpose.** A reusable, enterprise-grade playbook for building a public real-estate marketing site **plus** an internal CRM (leads, properties, viewings, agents, customers, reports) on a modern Next.js stack. Use this as the working contract whenever you scaffold, extend, or refactor an app like Luxe Properties.

---

## 1. Target Stack (locked)

| Layer            | Choice                                                     |
| ---------------- | ---------------------------------------------------------- |
| Framework        | **Next.js 16** (App Router, RSC, Server Actions)           |
| Language         | **TypeScript** (strict mode, `noUncheckedIndexedAccess`)   |
| Styling          | **Tailwind CSS** (v4, CSS-first config via `globals.css`)  |
| UI Kit           | **shadcn/ui** (Radix primitives + Tailwind)                |
| Icons            | **lucide-react**                                           |
| Forms            | **react-hook-form** + **zod** resolvers                    |
| Data (client)    | **@tanstack/react-query** for mutations & realtime caches  |
| Backend          | **Next.js Route Handlers** (`app/api/**/route.ts`) + Server Actions |
| Database         | **PostgreSQL 16** (Neon / RDS / Supabase Postgres)         |
| ORM              | **Prisma 5** (with `prisma generate` in CI)                |
| Auth             | **Auth.js v5 (NextAuth)** — Credentials + Google + JWT     |
| File storage     | **S3-compatible** (AWS S3 / R2) + signed PUT URLs          |
| Maps             | **Mapbox GL JS** (public token in env, style URL pinned)   |
| Email            | **Resend** or **AWS SES**                                  |
| Background jobs  | **Inngest** or **Vercel Queues**                           |
| Realtime         | **Pusher** / **Ably** (or Postgres LISTEN/NOTIFY via SSE)  |
| Observability    | **Sentry** + **Vercel Analytics** + **OpenTelemetry**      |
| Hosting          | **Vercel** (Edge for static, Node runtime for Prisma APIs) |
| CI               | **GitHub Actions**: lint, typecheck, prisma validate, test |

> **Runtime rule.** Any route that touches Prisma must set `export const runtime = "nodejs"`. Edge runtime is reserved for purely static or fetch-only handlers.

---

## 2. Folder Layout (canonical)

```
app/
  (marketing)/                 # public site — grouped route, shared layout
    layout.tsx
    page.tsx                   # /
    buy/page.tsx
    rent/page.tsx
    off-plan/page.tsx
    properties/
      page.tsx                 # /properties (listings + filters)
      [slug]/page.tsx          # /properties/luxe-villa-marina
      [slug]/opengraph-image.tsx
    communities/
      page.tsx
      [slug]/page.tsx
    agents/
      page.tsx
      [id]/page.tsx
    about/page.tsx
    contact/page.tsx
  (crm)/                       # internal CRM — separate layout + auth gate
    layout.tsx                 # calls auth(); redirects to /sign-in
    crm/
      page.tsx                 # dashboard
      leads/page.tsx
      leads/[id]/page.tsx
      properties/page.tsx
      viewings/page.tsx
      customers/page.tsx
      agents/page.tsx
      reports/page.tsx
      settings/page.tsx
  (auth)/
    sign-in/page.tsx
    sign-up/page.tsx
  api/
    auth/[...nextauth]/route.ts
    leads/route.ts             # POST public capture, GET CRM list
    leads/[id]/route.ts
    properties/route.ts
    properties/[slug]/route.ts
    viewings/route.ts
    media/upload/route.ts      # returns signed S3 URL
    webhooks/
      stripe/route.ts
      lead/route.ts            # HMAC-verified inbound
    cron/
      digest/route.ts          # protected by CRON_SECRET
  layout.tsx                   # root: <html>, fonts, providers
  globals.css                  # Tailwind v4 @theme + tokens
components/
  ui/                          # shadcn primitives (generated)
  marketing/                   # Hero, PropertyCard, CommunityGrid…
  crm/                         # CrmLayout, StatsCard, LeadsTable…
  forms/                       # LeadCaptureForm, PropertyForm…
  map/                         # MapboxMap (client-only)
lib/
  db.ts                        # prisma singleton
  auth.ts                      # NextAuth config
  authz.ts                     # hasRole, requireRole helpers
  s3.ts                        # signed URL helpers
  validators/                  # zod schemas, one file per resource
  formatters.ts                # money, area, dates (Intl.*)
  rate-limit.ts                # upstash ratelimit wrapper
  logger.ts                    # pino w/ request-id
server/
  actions/                     # "use server" entrypoints
  services/                    # pure data-access (Prisma) — no HTTP
  mappers/                     # DB row → API DTO
prisma/
  schema.prisma
  migrations/
  seed.ts
types/
  index.ts                     # public DTOs (Property, Agent, Community)
  crm.ts                       # CRM DTOs (Lead, Viewing, Customer)
stores/                        # zustand for UI-only state
tests/
  unit/                        # vitest
  e2e/                         # playwright
```

**Rule:** Route handlers and server actions are **thin** — validate → call `server/services/*` → map → respond. No business logic inline.

---

## 3. Routing Conventions

* **Marketing routes** live in the `(marketing)` group with its own `layout.tsx` (Navbar, Footer, global SignIn modal). SEO metadata via `generateMetadata` on every page — never reuse home metadata.
* **CRM routes** live in `(crm)` with a layout that calls `await auth()` and `redirect("/sign-in")` if no session, plus a role gate using `requireRole(["agent","agency_admin","admin"])`.
* **Dynamic segments:** `[slug]` for SEO-friendly URLs (properties, communities), `[id]` for opaque IDs (leads, customers, agents).
* **Parallel & intercepted routes** (`@modal`, `(.)`) for image lightboxes and quick-view drawers in the CRM.
* **`loading.tsx` + `error.tsx`** in every route segment with non-trivial fetches.
* **`not-found.tsx`** at the root and per dynamic segment (`properties/[slug]/not-found.tsx`).

---

## 4. Data Layer — Prisma + PostgreSQL

### 4.1 Schema rules

* Use `enum` types for `app_role`, `lead_stage`, `listing_type`, `viewing_status`.
* **Roles in a separate `UserRole` table** — never a column on `User`. Privilege checks go through `hasRole(userId, role)`.
* Money as `Decimal(12,2)`; area as `Int` (sqft) — never `Float`.
* Every table: `id String @id @default(cuid())`, `createdAt`, `updatedAt @updatedAt`.
* Soft-delete via `deletedAt DateTime?` on Lead, Property, Customer; default Prisma middleware filters them out.
* Add indexes on every FK and on filter columns: `@@index([agencyId, stage])`, `@@index([community, listing, price])`.

### 4.2 Prisma client

```ts
// lib/db.ts
import { PrismaClient } from "@prisma/client";
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient({ log: ["warn", "error"] });
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
```

### 4.3 Migrations & seed

* `prisma migrate dev` locally, `prisma migrate deploy` in CI on `main`.
* `prisma/seed.ts` creates: 1 demo agency, 1 admin / 1 agent / 1 client user, 6 properties, 3 communities, 5 leads. Keep seed idempotent (use `upsert`).
* **Never** run destructive migrations without a paired data backfill migration.

---

## 5. API Contracts (Route Handlers)

Every handler follows the same template:

```ts
// app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireRole } from "@/lib/authz";
import { rateLimit } from "@/lib/rate-limit";
import { LeadCreateSchema, LeadQuerySchema } from "@/lib/validators/lead";
import { leadService } from "@/server/services/lead.service";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const { success } = await rateLimit.limit(`lead:${ip}`);
  if (!success) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = LeadCreateSchema.parse(await req.json());
  const lead = await leadService.createPublic(body, { ip });
  return NextResponse.json({ id: lead.id }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  requireRole(session, ["agent", "agency_admin", "admin"]);
  const query = LeadQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
  const result = await leadService.list(query, session.user);
  return NextResponse.json(result);
}
```

**Hard rules:**

1. **Validate every input** with zod — bodies, query, params. Reject bodies > 16 KB.
2. **Authorize every non-public route** — `requireRole` throws → caught by a shared `withApi()` wrapper that returns 401/403.
3. **Never return raw Prisma models** — pass through a mapper in `server/mappers/`.
4. **Webhooks** must HMAC-verify before any DB write. Use `crypto.timingSafeEqual`.
5. **Cron routes** check `request.headers.get("authorization") === \`Bearer ${process.env.CRON_SECRET}\``.
6. **Idempotency:** mutating webhooks accept an `Idempotency-Key` header and persist to a `webhook_events` table.

---

## 6. Auth & Authorization

* **Auth.js v5** with Prisma adapter. Session strategy: JWT (15 min) + refresh via DB session table for revocation.
* Providers: **Credentials (bcrypt, cost 12)** and **Google**. Add MFA (TOTP) for `admin` role.
* `lib/authz.ts` exposes:

  ```ts
  export type Role = "client" | "agent" | "agency_admin" | "admin";
  export async function hasRole(userId: string, role: Role): Promise<boolean>;
  export function requireRole(session: Session | null, allowed: Role[]): asserts session;
  ```
* **Agency scoping** is enforced in services, not handlers: every `leadService.list` query includes `where: { agencyId: session.user.agencyId }` unless caller is `admin`.
* **Audit log** table writes on every privileged mutation (`who, action, target, before, after, at`).

---

## 7. Frontend Patterns

### 7.1 Server Components first

* Default to RSC. Drop into Client Components (`"use client"`) only for: forms with local state, Mapbox, animations, anything using browser APIs, anything using shadcn `Dialog`/`Sheet`/`Popover` triggers.
* Fetch data in the **Server Component** with `await prisma.x.findMany(...)` (via a service) — do **not** call your own `/api` from RSC; that's an extra network hop.

### 7.2 Forms

```tsx
const form = useForm<LeadCreateInput>({
  resolver: zodResolver(LeadCreateSchema),
  defaultValues: { source: "website" },
});
const { mutate, isPending } = useMutation({
  mutationFn: (data: LeadCreateInput) =>
    fetch("/api/leads", { method: "POST", body: JSON.stringify(data) }).then(r => r.json()),
  onSuccess: () => toast.success("We'll be in touch shortly."),
});
```

### 7.3 Tables (CRM)

* Use **TanStack Table** for headless logic + shadcn `Table` primitives.
* Server-side pagination, filtering, sorting via URL search params (`useSearchParams` + `router.replace`). The URL is the source of truth.
* Bulk actions via a sticky action bar that appears when rows are selected.

### 7.4 Property listings

* `app/(marketing)/properties/page.tsx` is a RSC; filters live in the URL (`?community=marina&minPrice=...`).
* **Faceted filtering** computed in Postgres with a single grouped query, cached with `unstable_cache` keyed on the filter set, revalidated on property mutation tags.
* `next/image` with `sizes` for every card; AVIF + WebP via Vercel's image optimizer.

### 7.5 Maps

```tsx
"use client";
import dynamic from "next/dynamic";
const MapboxMap = dynamic(() => import("@/components/map/MapboxMap"), { ssr: false });
```

Pin the Mapbox style URL, never expose a secret token (only `NEXT_PUBLIC_MAPBOX_TOKEN`, URL-restricted in the Mapbox dashboard).

---

## 8. Design System

* **Tailwind v4** with CSS-first config in `globals.css`:

  ```css
  @import "tailwindcss";
  @theme {
    --color-background: 0 0% 100%;
    --color-foreground: 222 47% 11%;
    --color-primary: 215 90% 50%;
    --color-gold: 38 76% 56%;
    --font-display: "Fraunces", serif;
    --font-sans: "Inter", system-ui, sans-serif;
    --radius: 0.75rem;
  }
  ```
* **No hardcoded colors in JSX.** Always reference semantic tokens (`bg-card`, `text-muted-foreground`).
* **Typography pairing:** display serif for headlines, geometric sans for body. Reject default Inter-only.
* **Motion:** `framer-motion` for hero reveals and CRM dashboard cards (`initial/animate`, `transition.duration: 0.3`).
* **Dark mode:** via `next-themes`, `class` strategy, tokens defined twice in `@theme` and `@theme dark`.

---

## 9. Performance & SEO

* **Streaming SSR** for `/properties/[slug]` — wrap secondary sections (similar properties, agent card) in `<Suspense>`.
* **PPR (Partial Prerendering)** enabled where stable — `export const experimental_ppr = true` on listing pages.
* **`generateStaticParams`** for the top 500 properties and all communities; ISR `revalidate: 3600` on the rest.
* **Metadata:** unique `title` (<60 chars) + `description` (<160) per page. `generateMetadata` reads loader data.
* **OpenGraph images:** `opengraph-image.tsx` per `[slug]` route uses the first property photo.
* **Structured data:** JSON-LD `RealEstateListing` on `/properties/[slug]`, `RealEstateAgent` on `/agents/[id]`.
* **Sitemap:** `app/sitemap.ts` enumerates properties, communities, agents from DB.
* **Robots:** `app/robots.ts` allows marketing routes; disallows `/crm/*` and `/api/*`.

---

## 10. Security Checklist (must pass before merge)

* [ ] All API inputs validated by zod (body + query + params).
* [ ] Rate limiting on every public POST (`/api/leads`, contact form, sign-in).
* [ ] CSRF: rely on same-site cookies for Server Actions; double-submit token for cross-origin webhooks.
* [ ] Security headers via `next.config.ts` `headers()`: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, CSP with nonces.
* [ ] Mapbox & Google client IDs are URL-restricted in their dashboards.
* [ ] No secret read in any module imported by client (`process.env.X` only inside route handlers / server actions / services).
* [ ] Prisma queries always parameterized — never `$queryRawUnsafe` with interpolation.
* [ ] Signed S3 URLs scoped to a single key + 5-min expiry + `Content-Type` enforced.
* [ ] Logs scrub PII (email/phone → hash) before shipping to Sentry.

---

## 11. Testing

* **Unit (Vitest):** every zod schema, every service function (mock Prisma with `prisma-mock` or a test DB).
* **Integration:** spin up Postgres via testcontainers; run handlers with `next-test-api-route-handler`.
* **E2E (Playwright):** smoke flows — visitor browses → submits lead → agent logs into CRM → updates stage → views report.
* **Visual regression:** Playwright + `toHaveScreenshot()` for marketing pages at desktop + mobile breakpoints.
* CI gate: lint + typecheck + `prisma validate` + unit + a smoke E2E must pass before deploy.

---

## 12. Observability

* **Sentry** for client and server (`@sentry/nextjs`); enable performance tracing 10%.
* **Structured logs** with `pino` — every request stamped with `x-request-id` (generated in middleware).
* **Metrics:** count leads/day, viewings/day, conversion by source. Expose `/api/metrics` (CRON_SECRET-protected) for a Grafana scrape.
* **Uptime:** healthcheck `/api/health` returns DB ping + commit SHA.

---

## 13. Deployment (Vercel)

* **Environments:** `preview` per PR, `staging` from `develop`, `production` from `main`.
* **Env vars** segregated by environment in Vercel dashboard. Never commit `.env`.
* **DB migrations** run in a separate Vercel Build step: `prisma migrate deploy && next build`.
* **Connection pooling:** PgBouncer (Neon's built-in or AWS RDS Proxy). Prisma `?connection_limit=1&pool_timeout=20` on serverless.
* **Image optimization:** allow Mapbox + S3 hostnames in `next.config.ts` `images.remotePatterns`.
* **Cron:** Vercel `vercel.json` schedules to `/api/cron/*` with `CRON_SECRET` bearer.

---

## 14. Build Order (when scaffolding a new app like Luxe)

1. `pnpm create next-app@latest` with TS + Tailwind + App Router + ESLint.
2. Install: `prisma @prisma/client next-auth@beta @auth/prisma-adapter zod react-hook-form @hookform/resolvers @tanstack/react-query @tanstack/react-table mapbox-gl lucide-react`.
3. `pnpm dlx shadcn@latest init` → add `button card dialog dropdown-menu form input table tabs toast sheet popover select badge avatar`.
4. Wire `lib/db.ts`, `lib/auth.ts`, `lib/authz.ts`, `lib/rate-limit.ts`, `lib/s3.ts`, `lib/logger.ts`.
5. Author `prisma/schema.prisma` with all enums + tables + indexes; `prisma migrate dev --name init`; seed.
6. Build marketing layout + home + `/properties` listing + `/properties/[slug]` detail.
7. Public lead capture form → `POST /api/leads` → toast → email to agent.
8. CRM layout with auth gate + dashboard StatsCards.
9. CRM Leads table (TanStack Table + URL state) + drawer detail + stage updates.
10. CRM Properties CRUD + image upload via signed S3 URLs.
11. Viewings calendar (use `react-day-picker` + custom day cells).
12. Reports page — Postgres aggregates → `recharts`.
13. Settings: profile, agency, team invites, notification prefs.
14. Add Sentry, security headers, sitemap, robots, JSON-LD.
15. CI workflow + Vercel project + production cutover.

---

## 15. Anti-patterns (do not ship)

* ❌ Calling `/api/*` from a Server Component (extra hop — call the service directly).
* ❌ Storing role on `User.role` column (privilege escalation surface).
* ❌ `useEffect(fetch)` for initial render data (use RSC or RQ `prefetchQuery` + `HydrationBoundary`).
* ❌ Importing the Prisma client into a Client Component (bundles secrets, breaks build).
* ❌ Hardcoded hex colors / fonts in JSX.
* ❌ Inline business logic in route handlers.
* ❌ Webhook handlers that read the body twice without buffering — always `await req.text()` once, then HMAC then JSON.parse.
* ❌ Mapbox tokens without URL restriction.
* ❌ Edge runtime + Prisma (use Node runtime; or Prisma Accelerate / Data Proxy if Edge is required).

---

## 16. Reference Resources

* Next.js: <https://nextjs.org/docs>
* Auth.js v5: <https://authjs.dev>
* Prisma: <https://www.prisma.io/docs>
* shadcn/ui: <https://ui.shadcn.com>
* Tailwind v4: <https://tailwindcss.com/docs>
* Mapbox GL JS: <https://docs.mapbox.com/mapbox-gl-js>
* Vercel platform: <https://vercel.com/docs>

---

**End of SKILLS.md** — treat every rule above as binding. If a future change conflicts with one, update this file in the same PR so the contract stays the source of truth.
