# CRM Dashboard — `/crm`

Landing page after agent/admin login. Single screen — actionable, not vanity.

## Route

`app/(crm)/crm/page.tsx` — RSC, behind layout auth gate.

```ts
// app/(crm)/layout.tsx
const session = await auth();
if (!session) redirect("/sign-in?next=/crm");
requireRole(session, ["agent","agency_admin","admin"]);
```

## Layout

`CrmLayout` — left sidebar (Dashboard, Leads, Properties, Viewings, Customers, Agents, Reports, Settings) + top bar (search, notifications bell, user menu).

## Sections (dashboard body)

1. **KPI strip** (4 cards, scoped to agent unless admin)
   - New leads this month (+Δ vs last)
   - Viewings this week
   - Deals in pipeline (count + AED value)
   - Conversion rate (leads → closed)
2. **Pipeline funnel** — horizontal bar: New / Contacted / Interested / Viewing / Negotiation / Closed; click stage → filtered leads list.
3. **Recent leads** (6) — name, source, stage chip, age, "Open" link.
4. **Today's viewings** — list with time, property, customer, status; quick actions (mark complete, reschedule, cancel).
5. **Tasks / follow-ups** — overdue at top, color-coded.
6. **Activity feed** — last 20 events (lead stage changed, viewing booked, property listed). Realtime via Pusher/SSE.

## Data

```ts
const userId = session.user.id;
const scope = session.user.role === "admin" ? { agencyId: session.user.agencyId } : { agentId: userId };
const [kpis, funnel, recentLeads, todayViewings, tasks] = await Promise.all([
  reportService.dashboardKpis(scope),
  reportService.pipelineFunnel(scope),
  leadService.recent(scope, 6),
  viewingService.today(scope),
  taskService.dueOrOverdue(userId, 10),
]);
```

## Realtime

Subscribe to channel `agency:${agencyId}` for events `lead.created`, `viewing.updated`. On event: invalidate the relevant React Query key + toast.

## Empty states

Every section has a designed empty state — never "no data" plain text. CTA pointing at how to create the first item.

## Permissions

- `agent`: sees own scope only
- `agency_admin`: sees entire agency
- `admin` (platform): can pick agency from a switcher

## Anti-patterns

- ❌ "Vanity metrics" (total page views) — show actionable numbers
- ❌ Dashboard that requires scrolling on a 1366×768 laptop
- ❌ Live polling every 5s instead of push (kills DB)
- ❌ Computing KPIs on every request from raw `leads` table — use materialized views or daily snapshots
