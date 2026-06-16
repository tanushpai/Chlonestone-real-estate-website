# CRM Reports — `/crm/reports`

Business intelligence. Pre-aggregated, exportable, time-bound.

## Route

`app/(crm)/crm/reports/page.tsx` — RSC + client charts.

## Global controls (sticky top bar)

- Date range presets (Today / Week / Month / Quarter / Year / Custom)
- Compare-to toggle (vs previous period / vs LY)
- Scope: agency-wide / by community / by agent (admin only)
- Export (CSV / XLSX / PDF)
- Schedule report (email recurring)

## Report tabs

### 1. Overview
Headline KPIs (leads, viewings, deals, revenue) with sparklines + delta %.

### 2. Lead Performance
- Leads by source (pie + table with conversion %)
- Lead → close funnel
- Time-to-first-contact distribution
- Lead aging buckets (0-7d, 8-30d, 30-90d, 90+d)
- Lost reasons breakdown

### 3. Sales
- Revenue trend (line)
- Deals closed by month (bar)
- Avg deal size
- Avg days to close
- Top properties by leads / by deals
- Top agents by revenue (leaderboard)

### 4. Marketing
- Source attribution (first-touch vs last-touch)
- Cost per lead (if ad spend integrated)
- ROI by channel
- Property page conversion (views → leads)

### 5. Operations
- Viewing utilization (booked / available slots)
- No-show rate
- Avg response time by agent
- Tasks overdue
- Pipeline health (stuck deals)

### 6. Market Position
- Avg days on market vs market avg
- Price reduction frequency
- Listing-to-sold price ratio

## Data architecture

- **Don't query raw tables for reports.** Use materialized views refreshed every 1h by `pg_cron`:
  - `mv_daily_lead_stats(agency_id, agent_id, source, date, count)`
  - `mv_daily_deal_stats(...)`
  - `mv_funnel_snapshot(...)`
- Charts hit these views; sub-second responses even at scale.

```ts
const data = await reportService.leadFunnel({
  agencyId, from, to, agentId, compareToPrev: true,
});
```

## Exports

- **CSV/XLSX**: streamed response, `Content-Disposition: attachment`. Done in route handler with Node runtime.
- **PDF**: queued job (Inngest) → headless Chrome (Browserless / Lambda) → S3 → signed link emailed.
- **Scheduled reports**: cron → generate → email to subscribed users.

## Permissions

- `agent`: only own performance reports
- `agency_admin`: all agency reports
- `admin`: cross-agency benchmarks

## Anti-patterns

- ❌ Computing reports from raw tables on each request (kills DB)
- ❌ Shipping 100k rows to browser for client-side aggregation
- ❌ Letting agents see other agents' revenue
- ❌ "Real-time" reports (60-min stale is fine and 10x cheaper)
- ❌ Charts without comparison baselines (numbers without context are noise)
