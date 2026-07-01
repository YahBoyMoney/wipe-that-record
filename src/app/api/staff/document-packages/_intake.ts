import type { OfficialIntake } from '@/lib/documents/types';

// Coerces an untrusted JSON body from the staff dashboard into the canonical OfficialIntake
// shape. Only known fields are read; anything else is dropped. No validation of legal
// correctness happens here — that lives in official/mapping.mjs and is invoked by the
// service layer. This is purely structural shaping at the system boundary.
export function parseIntakeBody(body: unknown): OfficialIntake {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, any>;
  const p = b.petitioner || {};
  const court = b.court || {};
  const c = b.case || b.caseInfo || {};
  const relief = b.relief || {};

  const charges = Array.isArray(c.charges)
    ? c.charges
        .map((x: any) => ({
          code: str(x?.code),
          section: str(x?.section),
          type: str(x?.type),
        }))
        .filter((x: any) => x.code || x.section || x.type)
    : [];

  return {
    staffReviewed: b.staffReviewed === true,
    selfRepresented: b.selfRepresented === true,
    petitioner: {
      fullName: str(p.fullName),
      street: str(p.street),
      city: str(p.city),
      state: str(p.state),
      zip: str(p.zip),
      phone: str(p.phone),
      email: str(p.email),
    },
    court: {
      county: str(court.county),
      courtName: str(court.courtName),
      courtStreet: str(court.courtStreet),
      courtCityZip: str(court.courtCityZip),
    },
    case: {
      caseNumber: str(c.caseNumber),
      convictionDate: str(c.convictionDate),
      charges,
    },
    relief: {
      dismissalBasis: str(relief.dismissalBasis) as OfficialIntake['relief']['dismissalBasis'],
      felonyReductionRequested: relief.felonyReductionRequested === true,
    },
  };
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}
