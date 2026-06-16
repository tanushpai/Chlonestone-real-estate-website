# Auth & Sign-in Flow

Auth.js v5 + Prisma adapter. Roles stored in separate `UserRole` table.

## Routes

- `/sign-in` — credentials + Google
- `/sign-up` — clients only (agents are invite-only)
- `/forgot-password`
- `/reset-password?token=`
- `/verify-email?token=`
- `/api/auth/[...nextauth]/route.ts`

## Roles

```ts
type Role = "client" | "agent" | "agency_admin" | "admin";
```

- **client**: public users; access portal (saved properties, viewing history, profile)
- **agent**: CRM access scoped to own leads/customers/listings
- **agency_admin**: full agency CRM access
- **admin**: cross-agency platform admin

## Session

- Strategy: **JWT** (15 min) + DB session for revocation
- `session.user`: `{ id, email, name, role, agencyId, image }`
- Refresh: silent rotation on activity; absolute max 30 days
- Logout: invalidates DB session row

## Authorization helpers

```ts
// lib/authz.ts
export function requireRole(session: Session | null, allowed: Role[]): asserts session {
  if (!session) throw new HttpError(401, "Unauthenticated");
  if (!allowed.includes(session.user.role)) throw new HttpError(403, "Forbidden");
}
export async function hasRole(userId: string, role: Role): Promise<boolean> {
  return prisma.userRole.findFirst({ where: { userId, role } }).then(Boolean);
}
export function scopeToAgency(session: Session) {
  return session.user.role === "admin" ? {} : { agencyId: session.user.agencyId };
}
```

## Sign-in modal vs page

- Modal (`SignInModal`) for in-context auth (saving a favorite, submitting a form).
- Dedicated `/sign-in` page for deep links + SEO `noindex`.

## MFA

- TOTP via `otplib`; QR via `qrcode`.
- Mandatory for `admin`; optional for others.
- Recovery codes (10, single-use, hashed).

## Password rules

- Min 12 chars, must include 3 of 4 character classes
- Check against HIBP via k-anonymity API on signup/reset
- bcrypt cost 12

## OAuth

- Google: scopes `email profile openid`.
- Auto-link by verified email if existing account; require step-up confirm.

## Rate limits

- `/api/auth/*` POST: 5/min per IP
- Failed sign-in: lockout after 10 failures in 10 min (CAPTCHA challenge)

## Anti-patterns

- ❌ Storing role on `User` column (privilege escalation)
- ❌ Trusting `session.user.role` without re-verifying on sensitive ops
- ❌ Localstorage for tokens (use httpOnly cookies)
- ❌ "Remember me" extending session indefinitely (cap at 30d)
- ❌ Email enumeration ("user not found" vs "wrong password" — return generic)
