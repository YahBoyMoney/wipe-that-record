# Document Automation (Phase 1)

Turns a **paid order** into a tracked **document package** with a clear lifecycle,
a branded PDF packet, a human-review gate, and PII-safe handling.

> **Scope / safety:** Phase 1 does **not** generate official California court forms
> (e.g. CR-180) and does **not** auto-email personalized legal filings. It produces a
> branded, **non-personalized** informational cover sheet + checklist packet that
> explicitly states an official form template and human review are required before any
> filing. Personalized legal filings are a later phase (official templates + deterministic
> data mapping + mandatory human review).

## Modules (`src/lib/documents/`)

| File | Purpose |
|------|---------|
| `status.mjs` | Status machine: allowed transitions, audit entries. |
| `registry.mjs` | Template registry; maps products/sessions → template key; initial status. |
| `disclaimers.mjs` | Mandatory legal disclaimers embedded in every packet. |
| `pdf.mjs` | **Dependency-free** PDF generator (hand-written bytes; no puppeteer/pdfkit). |
| `redact.mjs` | PII-safe logging (`safeLog`, `redactEmail`). |
| `service-core.mjs` | Runtime orchestration (create/approve/generate), DB-injected. |
| `service.ts` | Typed wrapper over `service-core.mjs`. |
| `index.ts` / `types.ts` | Typed entry point + TypeScript types. |

Pure logic lives in `.mjs` so it can be unit-tested with zero dependencies via
`node --test` on Node 20 (which cannot import `.ts` directly). The `.ts` files are thin
typed wrappers around the `.mjs` core — single source of truth, no duplication.

## Lifecycle / status machine

```
intake_needed ─▶ ready_for_review ─▶ generated ─▶ delivered
      │                  │                │            │
      ├─▶ needs_manual_review ◀───────────┴────────────┘
      └─▶ blocked
```

- **DIY kit** (`requiresHumanReview: false`) → created as `ready_for_review`; can generate immediately.
- **Expert Review / Full Service** (`requiresHumanReview: true`) → created as `intake_needed`;
  generation is **blocked** (→ `needs_manual_review`) until a reviewer approves
  (→ `ready_for_review`), then it can generate.

`generated` is reachable only from `ready_for_review`.

## Collection

`DocumentPackages` (slug `document-packages`), admin group **Documents**. Admin/superadmin
read/update; superadmin delete. Stores only: `sourceSessionId` (unique idempotency key),
`templateKey`, `status`, `customerEmail` (operational lookup), `linkedLead`/`linkedOrder`,
`review` gate, `generatedFile` (media), `downloadToken` (reserved), and a non-PII `auditLog`.

**PII policy:** sensitive case data (case numbers, charges, convictions, DOB) is **not**
copied here — it stays on `orders.caseDetails`, reachable via `linkedOrder` under the admin
gate. Logs use `safeLog`, which redacts sensitive keys. No analytics events carry PII.

## Post-payment hook

`src/app/api/webhook/route.ts` (Stripe `checkout.session.completed`) creates the lead as
before, then calls `createPackageForSession(payload, { sourceSessionId: session.id, ... })`.
This is **additive, idempotent** (dedups on the Stripe session id, so retries don't
duplicate), and **error-swallowing** (a packaging failure can never 500 the webhook or
block lead creation).

## Internal/admin API

All routes require `Authorization: Bearer ${CRON_SECRET}` (same pattern as `api/cron/*`).
Staff can also manage packages through the role-gated Payload admin UI. No public endpoints.

| Method & path | Action |
|---------------|--------|
| `GET /api/documents` | List packages (`?status=`, `?page=`, `?limit=`). |
| `GET /api/documents/[id]` | Fetch one package. |
| `POST /api/documents/[id]/approve` | Record human-review approval. Body: `{ "actor": "name", "notes"?: "..." }`. |
| `POST /api/documents/[id]/generate` | Generate/regenerate the PDF. `409` if review required and not approved. |

Example:

```bash
curl -X POST https://wipethatrecord.com/api/documents/<id>/generate \
  -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" -d '{}'
```

## Staff workflow

1. A paid checkout creates a package automatically (via the webhook).
2. DIY packages are `ready_for_review`; call **generate** to produce the PDF.
3. Review/Full-Service packages are `intake_needed`; a reviewer verifies the case, calls
   **approve**, then **generate**.
4. The generated PDF is stored as admin-gated Payload **media** (`generatedFile`).
   There is **no public download route yet** — see "Delivery" below.

## Delivery (current state)

The generated PDF lives in Payload media, accessible only through the admin gate. The
`downloadToken` field is reserved for a future **signed-download route** so customers can
retrieve their packet without exposing media publicly. Phase 1 does **not** expose
sensitive PDFs publicly and does not auto-email packets.

## Environment variables

No new **required** secrets. Uses existing infrastructure:

- `CRON_SECRET` — gates the `/api/documents/*` routes (already used by `api/cron/*`).
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — existing Stripe webhook.
- `PAYLOAD_SECRET`, `DATABASE_URI` — existing Payload/Mongo.

## Tests

```bash
npm test        # node --test, zero dependencies
npm run typecheck
```

Covers status transitions, template selection, idempotency, review gating, PDF validity
(`%PDF`/`%%EOF`/disclaimers), and PII redaction.

## Future phases (official court forms)

1. Add official Judicial Council form templates (e.g. CR-180) as fillable assets.
2. Build a **deterministic** data mapping from verified `orders.caseDetails` → form fields.
3. Keep the human-review gate mandatory before any personalized filing is delivered.
4. Add a signed-download route backed by `downloadToken` (short-lived, single-use).
5. Optionally render official forms by overlaying mapped data — replacing the Phase 1
   informational packet for personalized filings only.
```
