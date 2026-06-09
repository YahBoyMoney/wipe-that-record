// Deterministic data mapping + guardrails for the official CA dismissal packet.
//
// This module turns a STAFF-REVIEWED intake record into a flat, strongly-shaped set of
// values for the CR-180 / CR-181 fields. It does NOT infer legal eligibility. Every
// case-specific legal choice (which Penal Code section / dismissal basis applies, whether
// a felony reduction is requested, probation/jail/prison facts) must be present on the
// reviewed record; if it is missing or not staff-confirmed, generation is blocked with a
// precise reason rather than guessed.
//
// Pure logic, no PDF/DB access, so it is unit-testable with zero dependencies.

import { DISMISSAL_BASES, SUPPORTED_COUNTIES } from './forms.mjs';

// Fields the system can safely fill once they are present and staff-reviewed. Anything
// not in this map is left blank on the form for manual completion.
//
// `intake` shape (all values come from staff-reviewed data, e.g. orders.caseDetails plus a
// reviewer-completed `officialIntake` block — never raw marketing-quiz answers):
//   {
//     staffReviewed: true,                 // hard gate: must be explicitly true
//     petitioner: { fullName, street?, city?, state?, zip?, phone?, email? },
//     selfRepresented: boolean,            // true => "ATTORNEY FOR" = petitioner, in pro per
//     court: { county, courtName?, courtStreet?, courtCityZip? },
//     case: { caseNumber, convictionDate?, charges?: [{ code?, section?, type? }] },
//     relief: { dismissalBasis, felonyReductionRequested? },  // dismissalBasis ∈ DISMISSAL_BASES
//   }

const REQUIRED_REASONS = {
  STAFF_REVIEW: 'Intake is not marked staffReviewed — official filings require staff-reviewed data.',
  PETITIONER_NAME: 'Missing petitioner full name (defendant on the form).',
  COUNTY: 'Missing court county.',
  CASE_NUMBER: 'Missing court case number.',
  DISMISSAL_BASIS: 'Missing dismissal basis (Penal Code section). A reviewer must select one explicitly.',
  UNKNOWN_BASIS: 'Dismissal basis is not one of the supported Penal Code sections.',
};

// Format "LAST, FIRST M." style defendant label from a free-text full name without
// re-ordering unless the reviewer already supplied "Last, First". We keep it verbatim to
// avoid mangling names; staff entered it deliberately.
function defendantLabel(fullName) {
  return String(fullName).trim();
}

function countyCourtLabel(county) {
  const known = SUPPORTED_COUNTIES[county];
  if (known) return known.courtCounty;
  // Unknown/other county: uppercase a human-readable version of the slug. The court address
  // itself is NOT invented — it is only filled if staff supplied it (see court.* below).
  return String(county).replace(/_/g, ' ').toUpperCase();
}

// Validate the reviewed intake. Returns { ok: true, data } when fillable, or
// { ok: false, status, reasons } when it must be blocked / sent for manual review.
// `reasons` are short, non-PII strings safe to log.
export function validateOfficialIntake(intake) {
  const reasons = [];
  if (!intake || typeof intake !== 'object') {
    return { ok: false, status: 'blocked', reasons: ['No intake data provided.'] };
  }
  if (intake.staffReviewed !== true) reasons.push(REQUIRED_REASONS.STAFF_REVIEW);

  const petitioner = intake.petitioner || {};
  if (!petitioner.fullName || !String(petitioner.fullName).trim()) reasons.push(REQUIRED_REASONS.PETITIONER_NAME);

  const court = intake.court || {};
  if (!court.county || !String(court.county).trim()) reasons.push(REQUIRED_REASONS.COUNTY);

  const theCase = intake.case || {};
  if (!theCase.caseNumber || !String(theCase.caseNumber).trim()) reasons.push(REQUIRED_REASONS.CASE_NUMBER);

  const relief = intake.relief || {};
  if (!relief.dismissalBasis) {
    reasons.push(REQUIRED_REASONS.DISMISSAL_BASIS);
  } else if (!DISMISSAL_BASES[relief.dismissalBasis]) {
    reasons.push(REQUIRED_REASONS.UNKNOWN_BASIS);
  }

  if (reasons.length) {
    // Missing required data / unreviewed choices => needs_manual_review (recoverable once
    // staff supplies the data). A total lack of intake is `blocked` (handled above).
    return { ok: false, status: 'needs_manual_review', reasons };
  }

  return { ok: true, data: buildFieldValues(intake) };
}

// Build the flat per-form field values from validated intake. Only called after validation
// passes, so required fields are guaranteed present.
export function buildFieldValues(intake) {
  const petitioner = intake.petitioner || {};
  const court = intake.court || {};
  const theCase = intake.case || {};
  const relief = intake.relief || {};
  const basis = DISMISSAL_BASES[relief.dismissalBasis];

  const defendant = defendantLabel(petitioner.fullName);
  const attyFor = intake.selfRepresented ? `${defendant}, in pro per` : (petitioner.fullName ? defendant : '');
  const firstCharge = Array.isArray(theCase.charges) ? theCase.charges[0] : undefined;

  const cr180 = {
    caseNumber: String(theCase.caseNumber),
    caseNumberP2: String(theCase.caseNumber),
    caseNumberP3: String(theCase.caseNumber),
    defendant,
    defendantP2: defendant,
    defendantP3: defendant,
    partyName: petitioner.fullName ? String(petitioner.fullName) : '',
    partyStreet: petitioner.street ? String(petitioner.street) : '',
    partyCity: petitioner.city ? String(petitioner.city) : '',
    partyState: petitioner.state ? String(petitioner.state) : '',
    partyZip: petitioner.zip ? String(petitioner.zip) : '',
    partyPhone: petitioner.phone ? String(petitioner.phone) : '',
    partyEmail: petitioner.email ? String(petitioner.email) : '',
    attyFor,
    courtCounty: countyCourtLabel(court.county),
    courtStreet: court.courtStreet ? String(court.courtStreet) : '',
    courtCityZip: court.courtCityZip ? String(court.courtCityZip) : '',
    convictionDate: theCase.convictionDate ? String(theCase.convictionDate) : '',
    convRow1Code: firstCharge && firstCharge.code ? String(firstCharge.code) : '',
    convRow1Section: firstCharge && firstCharge.section ? String(firstCharge.section) : '',
    convRow1Type: firstCharge && firstCharge.type ? String(firstCharge.type) : '',
  };

  // The single relief checkbox to check on CR-180, keyed by basis code.
  const basisCheckboxKey = {
    '1203.4': 'basis1203_4',
    '1203.4a': 'basis1203_4a',
    '1203.41': 'basis1203_41',
    '1203.42': 'basis1203_42',
    '1203.49': 'basis1203_49',
  }[basis.code];

  // CR-181 is the proposed ORDER. We fill only the caption so it matches the petition.
  // We deliberately do NOT pre-check the court's grant/deny decision.
  const cr181 = {
    caseNumber: String(theCase.caseNumber),
    caseNumberP2: String(theCase.caseNumber),
    defendant,
    shortTitleP2: `People v. ${defendant}`,
    partyName: petitioner.fullName ? String(petitioner.fullName) : '',
    partyStreet: petitioner.street ? String(petitioner.street) : '',
    partyCity: petitioner.city ? String(petitioner.city) : '',
    partyState: petitioner.state ? String(petitioner.state) : '',
    partyZip: petitioner.zip ? String(petitioner.zip) : '',
    partyEmail: petitioner.email ? String(petitioner.email) : '',
    attyFor,
    courtCounty: countyCourtLabel(court.county),
    courtStreet: court.courtStreet ? String(court.courtStreet) : '',
    courtCityZip: court.courtCityZip ? String(court.courtCityZip) : '',
  };

  return {
    cr180Text: stripEmpty(cr180),
    cr180Checkboxes: basisCheckboxKey ? [basisCheckboxKey] : [],
    cr181Text: stripEmpty(cr181),
    cr181Checkboxes: [],
    meta: { dismissalBasis: basis.code, felonyReductionRequested: relief.felonyReductionRequested === true },
  };
}

function stripEmpty(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== '' && v !== undefined && v !== null) out[k] = v;
  }
  return out;
}
