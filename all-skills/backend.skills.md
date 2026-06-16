# Backend / API Conventions

Next.js Route Handlers (`app/api/**/route.ts`) + Server Actions. PostgreSQL via Prisma.

## File layout

```
app/api/
  leads/route.ts                 # GET list, POST create
  leads/[id]/route.ts            # GET, PATCH, DELETE
  properties/route.ts
  properties/[slug]/route.ts
  viewings/route.ts
  media/upload/route.ts
  webhooks/
    stripe/route.ts
    lead/route.ts                # external inbound
    portal/route.ts              # Property Finder / Bayut sync
  cron/
    digest/route.ts
    feed-export/route.ts
    refresh-views/route.ts
  health/route.ts
server/services/                 # data access (Prisma)
server/mappers/                  # row → DTO
server/actions/                  # "use server" entrypoints
lib/validators/                  # zod schemas per resource
lib/withApi.ts                   # shared handler wrapper
lib/rate-limit.ts
lib/logger.ts
```

## The handler template

```ts
// app/api/leads/route.ts
import { withApi } from "@/lib/withApi";
import { LeadCreateSchema, LeadQuerySchema } from "@/lib/validators/lead";
import { leadService } from "@/server/services/lead.service";

export const runtime = "nodejs";          // Prisma requires Node
export const dynamic = "force-dynamic";   // for POST / authed GETs

export const POST = withApi({
  body: LeadCreateSchema,
  rateLimit: { key: "lead-create", limit: 10, window: "1 m" },
  captcha: true,
})(async ({ data, req, ip }) => {
  const lead = await leadService.createPublic(data, { ip });
  return { status: 201, json: { id: lead.id } };
});

export const GET = withApi({
  query: LeadQuerySchema,
  auth: { roles: ["agent","agency_admin","admin"] },
})(async ({ query, session }) => {
  return { json: await leadService.list(query, session.user) };
});
```

`withApi` handles: JSON parsing (body ≤ 16KB), zod validation, auth, role check, rate limit, captcha, error mapping, request-id, logging, CORS.

## Errors

```ts
class HttpError extends Error {
  constructor(public status: number, message: string, public code?: string) { super(message); }
}
```

Errors mapped to:
```json
{ "error": { "code": "validation_failed", "message": "...", "fields": {...} } }
```

Never leak stack traces in prod. Always log full error with `request_id`.

## Services

Pure functions, no `Request`/`Response`. Take primitives + caller context.

```ts
// server/services/lead.service.ts
export const leadService = {
  async createPublic(input: LeadCreateInput, ctx: { ip: string }) { ... },
  async list(filters: LeadQueryInput, caller: SessionUser) {
    const where = { ...filterToWhere(filters), ...scopeToAgency(caller) };
    return prisma.lead.findMany({ where, take: filters.perPage, skip: ... });
  },
  async update(id: string, patch: LeadUpdateInput, caller: SessionUser) {
    await assertCanEditLead(id, caller);
    return prisma.$transaction(async (tx) => {
      const before = await tx.lead.findUniqueOrThrow({ where: { id } });
      const after = await tx.lead.update({ where: { id }, data: patch });
      await tx.leadEvent.create({ data: { leadId: id, type: "updated", actorId: caller.id, payload: diff(before, after) } });
      return after;
    });
  },
};
```

## Validators

One file per resource, exporting Schema + inferred Input type:

```ts
export const LeadCreateSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  phone: z.string().min(7).max(20),
  interest: z.enum(["buy","rent","off-plan"]),
  propertyId: z.string().cuid().optional(),
  source: z.string().max(40).default("website"),
  notes: z.string().max(2000).optional(),
});
export type LeadCreateInput = z.infer<typeof LeadCreateSchema>;
```

## Rate limiting

Upstash Redis sliding window:
```ts
export const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});
```

## Webhooks

```ts
export const POST = async (req: Request) => {
  const body = await req.text();                          // read once
  const sig = req.headers.get("x-signature") ?? "";
  const expected = createHmac("sha256", process.env.WEBHOOK_SECRET!).update(body).digest("hex");
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return new Response("invalid signature", { status: 401 });
  }
  const payload = JSON.parse(body);
  // idempotency
  const dup = await prisma.webhookEvent.findUnique({ where: { id: payload.id } });
  if (dup) return Response.json({ ok: true });
  await prisma.webhookEvent.create({ data: { id: payload.id, type: payload.type, payload } });
  await handle(payload);
  return Response.json({ ok: true });
};
```

## Cron

`vercel.json`:
```json
{ "crons": [{ "path": "/api/cron/refresh-views", "schedule": "0 * * * *" }] }
```

Handler checks `Authorization: Bearer ${CRON_SECRET}`.

## Pagination

Cursor-based for big tables, offset for UIs ≤ 10k rows:

```ts
{ items, nextCursor?: string, total?: number }
```

## Transactions

Multi-step writes always in `prisma.$transaction([...])` or interactive `$transaction(async tx => ...)`. Set `isolationLevel: "Serializable"` for inventory-like operations (preventing double-booking a viewing slot).

## Logging

Structured (`pino`), one line per request:
```
{ level, time, request_id, method, path, status, dur_ms, user_id?, agency_id? }
```
Scrub PII (hash email/phone) before shipping to Sentry.

## CORS

Default: same-origin only. Public APIs (`/api/public/*`) add CORS headers explicitly. Webhooks: no CORS (they're server-to-server).

## Health

`/api/health` returns `{ ok, db: "up", commit, time }`. Used by uptime monitor and Vercel health checks.

## Anti-patterns

- ❌ Logic in route handlers — services own it
- ❌ Returning Prisma rows directly — always map to DTO
- ❌ Skipping zod validation "just for this one endpoint"
- ❌ Mutating without writing an audit event
- ❌ `try/catch` swallowing errors silently
- ❌ Console.log in production code (use logger)
- ❌ Long-running work in request handlers — queue with Inngest
- ❌ Prisma + Edge runtime without Accelerate (will fail at runtime)
