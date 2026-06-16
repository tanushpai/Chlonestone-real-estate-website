# CRM Leads — `/crm/leads` and `/crm/leads/[id]`

Operational core. Most agent time is spent here. Optimize for speed + bulk actions.

## Index — `/crm/leads`

`app/(crm)/crm/leads/page.tsx` — RSC shell + client `LeadsTable`.

### URL state (source of truth)

```
?stage=new,contacted
&source=website
&agentId=me|all|<id>
&q=ahmed
&from=2025-01-01&to=2025-03-31
&sort=createdAt-desc
&page=1&perPage=50
```

### Layout

- **Filter bar**: stage chips (multi-select with counts), source select, agent select, date range, search box (debounced).
- **Saved views**: "My open leads", "Hot this week", "Unassigned" — persisted per user.
- **Table** (TanStack Table headless + shadcn `<Table>`):
  - Columns: checkbox, name, contact, source badge, stage (inline editable dropdown), assigned agent (inline reassign), budget, interest, last activity, created, actions menu.
  - Server-side pagination, sorting.
  - Row hover → quick action bar (call, WhatsApp, email, open).
- **Bulk action bar** (sticky, appears on selection): assign agent, change stage, add tag, export CSV, delete.
- **Kanban toggle**: switch table view ↔ kanban (columns by stage, drag cards).

### Mutations

- Inline stage change → optimistic update, `PATCH /api/leads/[id]`, on failure revert + toast.
- Bulk assign → `POST /api/leads/bulk-assign` with `{ ids[], agentId }`.
- Always write an entry to `LeadEvent` (audit).

## Detail — `/crm/leads/[id]`

Two-column layout.

### Left rail (sticky)

- Customer summary card: name, contact buttons (call/WhatsApp/email all logged), source, created date.
- Property of interest (if any) — mini card with link.
- Stage stepper (vertical), click to advance.
- Assigned agent, reassign dropdown (admin/manager only).
- Tags.

### Main column (tabs)

1. **Timeline** — activities, notes, calls, emails, WhatsApp messages, viewings (chronological).
2. **Notes** — markdown, @mentions team members (notify), pin important.
3. **Viewings** — list + "Schedule viewing" → opens form.
4. **Documents** — upload IDs, contracts (signed S3, virus-scanned).
5. **Communications** — email thread (via SES inbound parsing), WhatsApp thread (Twilio/360dialog).
6. **Matching properties** — auto-suggested based on budget + interest + community prefs.

### Activity logging

Every action writes to `LeadEvent` table:

```ts
await leadService.logEvent(leadId, {
  type: "stage_changed",
  actorId: session.user.id,
  payload: { from: "new", to: "contacted" },
});
```

## Lead creation

- **Public capture**: `POST /api/leads` (no auth, captcha, rate-limit).
- **CRM manual**: `POST /api/leads` with auth header → goes straight to `contacted` stage, assigned to creator.
- **Inbound email/WhatsApp**: webhooks → match by email/phone → append to existing lead or create new.

## Dedup

On create, fuzzy-match by email + phone (last 7 digits). If match found, append as new event on existing lead instead of creating duplicate. Surface "Possible duplicate" warning in UI for manual confirm.

## Permissions

- `agent`: read/write own leads only
- `agency_admin`: read/write all leads in agency, can reassign
- `admin`: cross-agency

## Performance

- Table virtualized when > 100 rows (`@tanstack/react-virtual`).
- Counts in stage chips cached for 60s.
- Inbox-style: keyboard shortcuts `j/k` row nav, `e` open, `a` assign, `s` change stage.

## Anti-patterns

- ❌ Loading all leads then filtering in browser
- ❌ Stage changes without writing to `LeadEvent`
- ❌ Allowing agents to see other agents' leads
- ❌ Hard-delete leads (always soft-delete; admin-only restore)
