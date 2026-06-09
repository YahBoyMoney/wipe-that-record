# Official California Judicial Council form templates

These are the official, blank Judicial Council of California forms used to assemble the
`official_ca_dismissal_packet`. They are stored in the repo (not hotlinked at runtime) so
generation is deterministic and offline-safe.

| File | Form | Title | Revision | Source URL |
|------|------|-------|----------|------------|
| `CR-180.pdf` | CR-180 | Petition for Dismissal | Rev. January 1, 2024 | https://www.courts.ca.gov/documents/cr180.pdf |
| `CR-181.pdf` | CR-181 | Order for Dismissal | Rev. January 1, 2024 | https://www.courts.ca.gov/documents/cr181.pdf |

- **Retrieved:** 2026-06-09
- **Form status:** Both are *Form Approved for Optional Use* by the Judicial Council of California.
- **Penal Code sections referenced on both forms:** §§ 17(b), 17(d)(2), 1203.4, 1203.4a,
  1203.41, 1203.42, 1203.43, and 1203.49.
- **License / source notes:** California Judicial Council forms are official government
  forms published for public use. They are reproduced here unmodified in content. No
  copyright is asserted by WipeThatRecord over the form layouts.

## Important: these files are *decrypted* copies

The originals downloaded from courts.ca.gov ship with an empty-password owner encryption and
an embedded XFA (Adobe LiveCycle) layer. That combination prevents most server-side fillers
(including `pdf-lib`) from reading the AcroForm fields. We therefore store **decrypted** copies
produced with:

```bash
qpdf --decrypt cr180.pdf CR-180.pdf
qpdf --decrypt cr181.pdf CR-181.pdf
```

Decryption only removes the (blank-password) permissions wrapper; it does not alter the form
content. At fill time, `pdf-lib` additionally drops the XFA layer and falls back to the static
AcroForm, which renders the filled values in every PDF viewer and when flattened/printed.

A note on CR-180/CR-181 themselves: the visible note on CR-180 states a conviction may already
have been automatically dismissed by the DOJ under Penal Code § 1203.425, so filing may be
unnecessary but can still provide additional benefits (e.g. felony reduction). Staff should
account for this during review.

## Updating these forms when the Judicial Council revises them

1. Download the new revisions:
   ```bash
   curl -sSL -o cr180.pdf https://www.courts.ca.gov/documents/cr180.pdf
   curl -sSL -o cr181.pdf https://www.courts.ca.gov/documents/cr181.pdf
   ```
2. Decrypt them (see above) and replace `CR-180.pdf` / `CR-181.pdf`.
3. Re-enumerate the fillable field names — they are versioned in the PDF and can change between
   revisions:
   ```bash
   python3 - <<'PY'
   import pypdf
   for fn in ['CR-180.pdf','CR-181.pdf']:
       r = pypdf.PdfReader(fn)
       for k, v in (r.get_fields() or {}).items():
           if v.get('/FT') in ('/Tx', '/Btn'):
               print(fn, v.get('/FT'), k)
   PY
   ```
4. Reconcile any renamed fields against the field-name constants in
   `src/lib/documents/official/cr-fields.mjs`.
5. Bump the `revision` strings in `src/lib/documents/official/forms.mjs` and the table above,
   and update the `retrieved` date.
6. Run `npm test` — the official-packet tests assert the registry metadata and that a sample
   packet still contains both CR-180 and CR-181.
