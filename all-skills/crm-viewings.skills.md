# CRM Viewings — `/crm/viewings`

Schedule and run property viewings. Calendar-centric.

## Route

`app/(crm)/crm/viewings/page.tsx` — RSC + client calendar.

## Views (toggle)

1. **Calendar** — week / day / month. Color by status (scheduled / completed / cancelled / no-show / rescheduled).
2. **List** — filterable table: date, property, customer, agent, status, feedback, actions.
3. **Map** — pins for today's viewings, optimized route (TSP) for agent's day.

## Filters

Status, agent, date range, property, customer, source.

## Create viewing

Modal/sheet with:

- Property (typeahead, filtered to `published`)
- Customer (typeahead, "+ Create new customer" inline)
- Lead (optional link)
- Agent (default = current user)
- Date + time (15-min increments)
- Duration (default 45 min)
- Notes

Backend checks:

- Agent availability (no overlap)
- Property availability (`status === "published"` or `"reserved"`)
- Buffer time between viewings at different properties (drive time via Mapbox Matrix API)
- Working hours (no 11pm bookings unless override)

On create:

- Calendar invite (.ics) emailed to customer + agent
- WhatsApp confirmation to customer
- Add to agent's Google/Outlook calendar via OAuth integration
- Create `LeadEvent` if lead linked

## Day-of automations (cron: every 15 min)

- **T-24h**: WhatsApp reminder to customer.
- **T-2h**: SMS to customer with agent contact + map link.
- **T+30min after end**: prompt agent to log feedback + outcome.

## Outcome / feedback form

After completion:

- Status: completed / no-show / cancelled / reschedule
- Customer interest level (1–5)
- Notes (private to agent)
- Next action: schedule second viewing / send proposal / mark lost / advance to negotiation
- Optional photos (e.g., changes since listing photos)

Linked lead's stage auto-advances based on outcome.

## Reschedule / cancel

- Reschedule: keep original record with `status = "rescheduled"`, create new record linked via `rescheduledTo`.
- Cancel: require reason (customer cancelled / agent unavailable / property unavailable / other).
- Both fire notifications.

## Conflicts

Hard block double-booking same agent same time slot. Property double-booking allowed (open house) but warns.

## Permissions

- `agent`: own viewings only
- `agency_admin`: all in agency; can reassign
- Customers (client portal) can view their own scheduled viewings and request reschedule, never edit directly.

## Anti-patterns

- ❌ Overlapping bookings without warning
- ❌ No reminders → no-show rate spikes
- ❌ Feedback fields optional and skipped → loses pipeline intelligence
- ❌ Storing time without timezone (always UTC in DB, render in `Asia/Dubai`)
