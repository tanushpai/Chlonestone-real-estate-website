# CRM Settings — `/crm/settings`

Configuration. Scoped per user, per agency, per system.

## Sections (sub-routes)

```
/crm/settings/profile          # self
/crm/settings/security         # self (password, 2FA, sessions)
/crm/settings/notifications    # self (email, push, WhatsApp prefs)
/crm/settings/agency           # agency_admin (brand, address, RERA)
/crm/settings/team             # agency_admin (invites, roles)
/crm/settings/integrations     # agency_admin (Mapbox, Twilio, SES, Stripe, calendar)
/crm/settings/lead-routing     # agency_admin (rules)
/crm/settings/email-templates  # agency_admin (transactional + marketing)
/crm/settings/portals          # agency_admin (Property Finder, Bayut feed config)
/crm/settings/billing          # agency_admin (Stripe subscription)
/crm/settings/audit-log        # admin (full)
/crm/settings/api-keys         # admin (issue + rotate)
/crm/settings/webhooks         # admin (configure outbound)
```

## Profile (self)

Photo (S3 signed upload), name, title, bio, RERA BRN, languages, specializations, working hours, time zone.

## Security (self)

- Change password (current + new + confirm; bcrypt cost 12)
- Enable TOTP 2FA (mandatory for `admin`)
- Active sessions list with "Revoke" — backed by DB session table
- Login history (IP, UA, time)
- Personal API tokens (if exposed) with scopes + last used

## Notifications (self)

Channel × event matrix. Defaults sane but per-user override.

| Event | Email | Push | WhatsApp |
| --- | --- | --- | --- |
| New lead assigned | ✓ | ✓ | ✓ |
| Lead replied | ✓ | ✓ | — |
| Viewing T-24h | ✓ | ✓ | ✓ |
| Daily digest | ✓ | — | — |

## Agency settings

- Logo upload
- Primary brand color (writes CSS variable for emails + portal)
- Office addresses (multiple branches), phone, email
- RERA license number, ORN, Trakheesi config
- Default time zone, currency, units (sqft vs sqm)
- Lead capture form field config (which fields show on public form)

## Team

Invite agents, change roles, deactivate. See `crm-agents.skills.md`.

## Integrations

- **Calendar**: OAuth connect Google/Outlook → sync viewings
- **WhatsApp**: 360dialog/Twilio number provisioning
- **Email**: domain verification (SPF/DKIM/DMARC) for SES
- **Mapbox**: token (URL-restricted)
- **Payments**: Stripe Connect for booking deposits
- **Portals**: Property Finder + Bayut + Dubizzle credentials (encrypted at rest)

## Lead routing

Visual rule builder: IF conditions (source, community, language, budget) THEN action (assign to pool / round-robin / specific agent / fallback).
Drag to reorder priority. Test mode: simulate a lead and show the winning rule.

## Email templates

WYSIWYG (MJML behind the scenes for email reliability):
- Lead welcome
- Viewing confirmation
- Viewing reminder
- Brochure delivery
- Quarterly market report
- Newsletter

Variables: `{{customer.name}}`, `{{property.title}}`, etc., validated at save.

## Audit log

Filterable by actor, action, target, date. Export CSV.

## API keys & webhooks

- Generate API keys with scoped permissions (read:leads, write:leads, etc.); displayed once on creation.
- Outbound webhooks: configure URL + events + HMAC secret. Auto-retry with exponential backoff; show last 100 deliveries with status.

## Permissions

Enforced per sub-route. `agent` only sees Profile / Security / Notifications.

## Anti-patterns

- ❌ Storing integration secrets in plaintext (encrypt with KMS-managed key)
- ❌ Letting agents change their own role
- ❌ No audit on settings changes (every change writes audit entry)
- ❌ Showing full API keys after creation (one-time reveal only)
