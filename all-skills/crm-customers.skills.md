# CRM Customers — `/crm/customers`

The contact database. Every lead becomes a customer; not every customer is an active lead.

## Model

```prisma
model Customer {
  id          String   @id @default(cuid())
  agencyId    String
  email       String
  phone       String?
  name        String
  nationality String?
  language    String?
  source      String?
  stage       CustomerStage  // prospect | active | client | past
  tags        String[]
  budgetMin   Decimal?
  budgetMax   Decimal?
  interest    Interest[]     // buy | rent | invest | off-plan
  preferredCommunities String[]
  assignedAgentId String?
  totalSpentAed Decimal @default(0)
  createdAt   DateTime @default(now())
  deletedAt   DateTime?
  @@unique([agencyId, email])
  @@index([agencyId, stage])
}
```

## Index — `/crm/customers`

- **Filters**: stage, agent, nationality, language, tags, interest, budget range, search.
- **Table**: avatar, name, contact, stage badge, total spent, # inquiries, # viewings, assigned agent, last activity, actions.
- **Bulk**: tag, change stage, assign agent, export, add to email campaign.

## Detail — `/crm/customers/[id]`

Left rail: contact + stage stepper + assigned agent.

Tabs:
1. **Overview** — KPIs, preferences (budget, interest, communities).
2. **Leads** — all leads from this customer (most have 1, some many).
3. **Viewings** — past + upcoming.
4. **Deals** — closed transactions with AED value, property, date.
5. **Saved properties** — from website favorites (if customer has portal account).
6. **Notes** — markdown, pinned items.
7. **Communications** — unified inbox (email + WhatsApp).
8. **Files** — IDs, passport, contracts.
9. **Tasks** — follow-ups assigned to agent.
10. **Consent & GDPR** — marketing opt-ins, request data export, right to be forgotten.

## Merge duplicates

When two customers identified as same person:
- Manager action: select primary, secondary → "Merge".
- Backend: move all leads/viewings/deals/notes to primary, write `customer_merge_event`, soft-delete secondary.
- Audit trail preserved.

## GDPR / data rights

- **Export**: generate JSON of all customer data → email signed S3 download link (24h expiry).
- **Forget**: anonymize (`name = "[redacted]"`, email/phone hashed, files deleted) — keep transactional records for legal retention (7 years).

## Email campaigns

- Segments built from filters → push to Resend/Mailchimp via API.
- Track sends/opens/clicks per customer.
- Always include unsubscribe; respect `consent.marketing = false`.

## Permissions

- `agent`: customers assigned to them
- `agency_admin`: all in agency
- Cross-agency sharing only when admin explicitly enables

## Anti-patterns

- ❌ Storing passport/ID files unencrypted
- ❌ Marketing emails without consent or unsubscribe (PDPL/GDPR fine)
- ❌ Hard-deleting customers with transactions (breaks accounting)
- ❌ Allowing agent A to view agent B's customer details
