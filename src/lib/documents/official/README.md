# Official CA Dismissal Packet (CR-180 + CR-181)

The first **real court-document** packet the system produces. It assembles the official
California Judicial Council forms **CR-180 (Petition for Dismissal)** and **CR-181 (Order for
Dismissal)**, filled from **staff-reviewed** intake data, and keeps the existing human-review
gate. It is **never auto-delivered** to a client.

> True "expungement" does not exist in California, and record-cleaning law is situation-
> specific (see https://selfhelp.courts.ca.gov/clean-your-record). This packet does not
> promise relief, create an attorney-client relationship, or imply court affiliation. Every
> case-specific legal choice is made by a human reviewer, not by the automation.

## Modules (`src/lib/documents/official/`)

| File | Purpose |
|------|---------|
| `forms.mjs` | Form metadata (ids, revisions, source URLs), the closed set of dismissal bases, and supported-county court values. |
| `cr-fields.mjs` | Exact AcroForm field names inside CR-180 / CR-181 (versioned by form revision). |
| `mapping.mjs` | Validates staff-reviewed intake and maps it to per-form field values. **Guardrails live here.** |
| `fill.mjs` | Loads the stored templates, fills + flattens with `pdf-lib`, merges into one packet, optional SAMPLE watermark. |
| `../templates/official/` | The decrypted CR-180 / CR-181 PDFs + `SOURCES.md` (provenance + refresh steps). |

Pure logic (`forms`, `cr-fields`, `mapping`) is dependency-free and unit-tested with
`node --test`. Only `fill.mjs` imports `pdf-lib`, and it is `import()`-ed dynamically by the
service so the rest of the pipeline stays dependency-free.

## Why pdf-lib, and why decrypted templates

`pdf-lib` is pure-JS with **zero native dependencies**, so it builds and runs on Vercel
(unlike puppeteer/headless-chrome). The official PDFs ship empty-password-encrypted with an
embedded XFA (Adobe LiveCycle) layer, which prevents `pdf-lib` from reading their AcroForm
fields. We therefore store **decrypted** copies (`qpdf --decrypt`) — decryption only removes
the blank-password permissions wrapper, not form content. At fill time `pdf-lib` also drops
the XFA layer and falls back to the static AcroForm, which renders the filled values in every
viewer and when flattened/printed. See `../templates/official/SOURCES.md`.

## What gets filled vs. left manual

**Filled deterministically** (only from staff-reviewed data):
- Caption: court county, case number, defendant/petitioner name (repeated on every page).
- Party block: name, address, phone, email; "ATTORNEY FOR" = petitioner *in pro per* when self-represented.
- Conviction date + the **first** conviction-table row (code / section / type).
- **Exactly one** CR-180 relief checkbox, chosen from the reviewer-selected dismissal basis.

**Left blank for manual completion:**
- Conviction-table rows 2–5 (multi-count cases).
- Attorney bar number / firm / fax.
- The "interests of justice" narrative fields.
- **All of CR-181's grant/deny decision** — that is the *court's* choice; we only fill the
  CR-181 caption so the proposed order matches the petition. We never pre-check a decision.
- Court street/mailing address unless staff supplied it (we never invent a courthouse address).

## Dismissal bases (closed set)

The automation will only fill these Penal Code sections, each mapping to one CR-180 checkbox:

| Basis | CR-180 item |
|-------|-------------|
| `1203.4` | Felony/misdemeanor with probation granted |
| `1203.4a` | Misdemeanor/infraction, sentence other than probation |
| `1203.41` | Felony county-jail / state-prison sentence |
| `1203.42` | Pre-realignment felony prison sentence |
| `1203.49` | PC 647(b) misdemeanor, human-trafficking victim |

A basis outside this set is **rejected**, not guessed.

## Counties

Launch counties with deterministic court-county values: **San Bernardino**, **Riverside**
(California, statewide-capable). Other counties still generate, but the court *address* fields
stay blank unless staff supplies them. Add counties in `SUPPORTED_COUNTIES` (`forms.mjs`).

## Guardrails (when generation is blocked)

`validateOfficialIntake` (in `mapping.mjs`) gates generation. The package is moved to a
non-`generated` status with **precise, non-PII reasons** rather than producing a wrong form:

- **`blocked`** — no intake object at all.
- **`needs_manual_review`** — any of: `staffReviewed !== true`; missing petitioner name,
  county, or case number; missing or unsupported dismissal basis.

The generator *also* always enforces the human-review gate first: even with perfect intake,
an unapproved package is sent to `needs_manual_review`. Once staff fix the data and the
package is approved, a re-run normalizes the status and generates.

## How staff prepare and review intake

The legal choices must come from a reviewer, **never** from the marketing quiz. Sources of
truth: `orders.caseDetails` (case number, county, conviction date/type, charges) plus the
reviewer's determination of the dismissal basis and whether a § 17(b) felony reduction is
requested. The reviewer assembles an `OfficialIntake` object (typed in `../types.ts`):

```jsonc
{
  "staffReviewed": true,              // must be explicitly true
  "selfRepresented": true,
  "petitioner": { "fullName": "DOE, JOHN A.", "street": "...", "city": "...", "state": "CA", "zip": "..." },
  "court": { "county": "san_bernardino", "courtStreet": "...", "courtCityZip": "..." },
  "case": { "caseNumber": "FSB-12345", "convictionDate": "2019-04-15",
            "charges": [{ "code": "PC", "section": "459", "type": "felony" }] },
  "relief": { "dismissalBasis": "1203.4", "felonyReductionRequested": true }
}
```

### Generating (internal, CRON_SECRET-gated)

```bash
curl -X POST https://wipethatrecord.com/api/documents/<id>/generate-official \
  -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" \
  -d '{ "actor": "reviewer@firm", "sample": false, "intake": { ...OfficialIntake... } }'
```

- `409` with `reasons[]` if review isn't approved or intake is incomplete.
- On success the merged PDF is stored as admin-gated Payload media; status → `generated`
  (**not** `delivered`). A human still approves delivery separately.
- `"sample": true` watermarks the output **SAMPLE - NOT FOR FILING** (demos/tests only).
  Real packets carry no watermark.

## Sensitive-data protections

- Intake never reaches analytics; logs use `safeLog` and only ever record counts/flags
  (e.g. number of validation issues), never names/case numbers/charges.
- Validation `reasons` are short rule strings with no case data, safe to return to staff tooling.
- Generated PDFs live in admin-gated media — no public download route.
- The packet's PDF metadata documents the included forms + sample flag but carries no PII.

## Updating forms when the Judicial Council revises them

See `../templates/official/SOURCES.md` for the full procedure: re-download, decrypt,
re-enumerate field names, reconcile `cr-fields.mjs`, bump revisions in `forms.mjs`, run tests.
