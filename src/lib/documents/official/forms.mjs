// Official California Judicial Council form metadata for the dismissal packet.
//
// These descriptors are the single source of truth for which official forms the
// `official_ca_dismissal_packet` includes, their revision dates, and where they came
// from. The actual blank PDFs live (decrypted) under ../templates/official and are
// loaded at fill time — never hotlinked at runtime. See ../templates/official/SOURCES.md
// for how to refresh them when the Judicial Council publishes a new revision.

export const OFFICIAL_FORMS = {
  'CR-180': {
    id: 'CR-180',
    title: 'Petition for Dismissal',
    revision: 'Rev. January 1, 2024',
    sourceUrl: 'https://www.courts.ca.gov/documents/cr180.pdf',
    retrieved: '2026-06-09',
    file: 'CR-180.pdf',
    formStatus: 'Form Approved for Optional Use',
    penalCodeSections: ['17(b)', '17(d)(2)', '1203.4', '1203.4a', '1203.41', '1203.42', '1203.43', '1203.49'],
  },
  'CR-181': {
    id: 'CR-181',
    title: 'Order for Dismissal',
    revision: 'Rev. January 1, 2024',
    sourceUrl: 'https://www.courts.ca.gov/documents/cr181.pdf',
    retrieved: '2026-06-09',
    file: 'CR-181.pdf',
    formStatus: 'Form Approved for Optional Use',
    penalCodeSections: ['17(b)', '17(d)(2)', '1203.4', '1203.4a', '1203.41', '1203.42', '1203.43', '1203.49'],
  },
};

export const OFFICIAL_FORM_IDS = Object.keys(OFFICIAL_FORMS);

// Dismissal basis statutes a reviewer can select. Each maps a Penal Code section to the
// CR-180 relief checkbox and the conviction posture it applies to. This is the closed set
// the automation will fill — anything outside it is left to manual handling so the system
// never guesses a relief statute. The descriptions mirror the language on CR-180.
export const DISMISSAL_BASES = {
  '1203.4': {
    code: '1203.4',
    label: 'Felony or misdemeanor with probation granted (Pen. Code, § 1203.4)',
    requiresProbation: true,
  },
  '1203.4a': {
    code: '1203.4a',
    label: 'Misdemeanor or infraction with sentence other than probation (Pen. Code, § 1203.4a)',
    requiresProbation: false,
  },
  '1203.41': {
    code: '1203.41',
    label: 'Felony county jail / state prison sentence (Pen. Code, § 1203.41)',
    requiresProbation: false,
  },
  '1203.42': {
    code: '1203.42',
    label: 'Pre-realignment felony prison sentence (Pen. Code, § 1203.42)',
    requiresProbation: false,
  },
  '1203.49': {
    code: '1203.49',
    label: 'Misdemeanor under Penal Code section 647(b) — human trafficking victim (Pen. Code, § 1203.49)',
    requiresProbation: true,
  },
};

export const DISMISSAL_BASIS_CODES = Object.keys(DISMISSAL_BASES);

// Counties for which we have deterministic court-address values. Generation for other
// counties is allowed but requires staff to supply the court address explicitly; we never
// invent a courthouse address. San Bernardino and Riverside are the launch counties.
export const SUPPORTED_COUNTIES = {
  san_bernardino: {
    value: 'san_bernardino',
    courtCounty: 'SAN BERNARDINO',
  },
  riverside: {
    value: 'riverside',
    courtCounty: 'RIVERSIDE',
  },
};

export const SUPPORTED_COUNTY_VALUES = Object.keys(SUPPORTED_COUNTIES);
