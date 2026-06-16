# CRM Agents — `/crm/agents`

Team management. Admin / agency_admin only. Agents see read-only "team" view.

## Index — `/crm/agents`

- **Filters**: status (active/away/inactive), specialization, language, community focus.
- **Table**: avatar, name, role badge, leads (open / month), deals (month), revenue (month), conversion %, last login, status, actions.
- **Leaderboard view toggle**: top by revenue / deals / leads handled / response time.

## Invite agent

Admin clicks "Invite":
- Form: email, name, role, default community focus, languages.
- Backend creates `User` (no password) + sends magic invite link (24h expiry).
- On accept: agent sets password, uploads photo, completes profile (bio, RERA BRN, languages, specializations).
- BRN validated against RERA public registry (Dubai) before activation.

## Detail — `/crm/agents/[id]`

Tabs:
1. **Profile** — public profile preview + edit (admin can edit anyone; agent can edit self).
2. **Performance** — KPIs over selectable range; charts (leads over time, conversion funnel, avg response time, customer satisfaction).
3. **Listings** — properties assigned.
4. **Leads & Customers** — lists, with reassignment action (admin).
5. **Schedule** — availability, working hours, leave dates (auto-routes leads away during leave).
6. **Targets** — monthly targets for leads / deals / revenue; progress bar.
7. **Commission** — per-deal commission %, override per deal, history of payouts.
8. **Permissions** — role, communities scope, can-export toggle, can-publish toggle.
9. **Activity log** — every action this agent took.

## Lead routing rules

Configurable per agency:
- **Round-robin** with weights by performance
- **Community-based**: lead community → matching agent pool
- **Language-based**: customer language → agent who speaks it
- **Specialization**: off-plan lead → off-plan agent pool
- **Fallback**: unassigned bucket if no match in 5 min → manager pings

## Performance metrics (defined once, used everywhere)

- **Response time**: minutes from lead created → first agent action
- **Conversion rate**: closed deals / total leads (12mo)
- **Pipeline value**: sum of `Property.price` × `winProbability(stage)`
- **NPS**: from post-deal survey
- **Activity score**: weighted (calls + emails + viewings + notes)

## Offboarding

Deactivate (don't delete):
- `status = "inactive"`, revoke session, remove from routing pool
- Bulk-reassign open leads + viewings to chosen replacement
- Public profile hidden; historical attribution kept

## Anti-patterns

- ❌ Letting agents edit their own performance metrics
- ❌ Routing lead to inactive/away agent
- ❌ Deleting agent record (breaks historical attribution)
- ❌ Showing commission/salary data to peer agents
