# Staff Document Dashboard

An operational, **staff-only** dashboard for reviewing document packages created from paid
orders and generating the official California dismissal packet (CR-180 + CR-181) from
staff-reviewed intake.

This sits on top of the document-automation core (`src/lib/documents/`) and the official
generator added in earlier phases. It adds **no new generation logic** — it is a secure UI +
session-authenticated API surface over the existing services.

## Where things live

| Path | Purpose |
|------|---------|
| `src/app/admin-panel/document-packages/page.tsx` | Server component. Auth gate (Payload session, admin/superadmin), then mounts the client dashboard. |
| `src/components/staff/DocumentPackagesDashboard.tsx` | List view: filter by status / official-only, status chips, per-row check summary. |
| `src/components/staff/OfficialPackageReview.tsx` | Detail/review panel: intake form, validation checklist, Save / Approve / Generate. |
| `src/components/staff/constants.ts` | UI option lists (dismissal bases, supported counties, status labels) mirroring the backend closed sets. |
| `src/app/api/staff/_session.ts` | `requireStaff()` — Payload session auth + role check for every staff API call. |
| `src/app/api/staff/document-packages/**` | Session-authenticated list / detail / save-intake / approve / generate routes. |

## Security model

- **Not public.** Every page render and every API request re-checks the logged-in Payload
  user via `payload.auth({ headers })` and requires role `admin` or `superadmin`. This is the
  same auth that guards the Payload admin UI — no new, weaker credential is introduced.
- The CRON_SECRET-gated routes under `src/app/api/documents/*` still exist for server-side
  tooling and are **unchanged**. The staff dashboard uses the separate session-gated
  `/api/staff/*` routes so a human session never needs the shared secret.
- **No public PDF exposure.** The dashboard shows only non-PII artifact metadata (file name,
  byte size, sample flag, timestamp). The generated PDF stays in admin-gated Payload media;
  there is still no signed public download route (intentional — see "What remains manual").
- **PII discipline.** The list view omits intake PII entirely. Validation reasons and the
  audit log are short, non-PII strings. Logging uses `safeLog`; no intake data is logged or
  sent to analytics.

## Staff workflow

1. **Open** `/admin-panel/document-packages` (must be signed into the admin panel as
   admin/superadmin). Filter to **Official only** to focus on CR-180/CR-181 packages.
2. **Open a package** to see its status, review state, and (for official packages) the
   intake form + validation checklist.
3. **Enter / edit the staff-reviewed intake**:
   - **Petitioner**: full name (required), address, contact, self-represented flag.
   - **Court**: county (required). San Bernardino / Riverside have known court addresses;
     other counties require the court address fields to be filled manually.
   - **Case**: case number (required), conviction date, charges.
   - **Relief**: dismissal basis Penal Code section (**required — a reviewer must select it
     explicitly; it is never inferred from quiz answers**), felony-reduction flag.
   - Tick **"staff-reviewed"** to satisfy the hard gate.
4. **Save Review** — persists the intake and re-runs validation. Missing/blocking items show
   in the **Validation** checklist.
5. **Approve Intake** — records the human-review approval (reviewer = the logged-in staff
   user). Required before generation.
6. **Generate Official Packet** — only enabled after approval. Blocked (with reasons) unless
   the saved intake validates. **Generate Sample** stamps a SAMPLE / NOT FOR FILING
   watermark for demos.
7. **Review the artifact metadata** and follow the manual next steps below.

## Required fields (generation will block without them)

- `staffReviewed = true`
- Petitioner full name
- Court county
- Case number
- Dismissal basis (one of §§ 1203.4 / 1203.4a / 1203.41 / 1203.42 / 1203.49)

## What remains manual (by design)

- **Retrieving the PDF**: it lives in admin-gated Payload media. There is no public/signed
  download route yet — a reviewer pulls it from media storage. Building a secure, audited
  download/delivery route is a deliberate future step.
- **Final verification**: a human verifies the filled CR-180/CR-181 before anything is filed.
- **Delivery**: packets are left at `generated` and are **never auto-delivered** to clients.
- **Other counties' court addresses**: only San Bernardino / Riverside are known; other
  counties require staff to enter the court address — the system never invents one.
