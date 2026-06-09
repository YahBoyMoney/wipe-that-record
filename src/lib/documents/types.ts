export type DocumentStatus =
  | 'intake_needed'
  | 'ready_for_review'
  | 'needs_manual_review'
  | 'generated'
  | 'delivered'
  | 'blocked';

export type TemplateKey =
  | 'diy_kit'
  | 'expert_review'
  | 'full_service'
  | 'official_ca_dismissal_packet';

// Penal Code sections a reviewer may select as the dismissal basis. Closed set — the
// automation never fills a relief statute outside this list.
export type DismissalBasis = '1203.4' | '1203.4a' | '1203.41' | '1203.42' | '1203.49';

// Staff-reviewed intake for an official packet. Every legal choice here must come from a
// human reviewer, never from marketing-quiz answers.
export interface OfficialIntake {
  staffReviewed: boolean;
  selfRepresented?: boolean;
  petitioner: {
    fullName: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    email?: string;
  };
  court: {
    county: string;
    courtName?: string;
    courtStreet?: string;
    courtCityZip?: string;
  };
  case: {
    caseNumber: string;
    convictionDate?: string;
    charges?: Array<{ code?: string; section?: string; type?: string }>;
  };
  relief: {
    dismissalBasis: DismissalBasis;
    felonyReductionRequested?: boolean;
  };
}

export interface TemplateSection {
  heading: string;
  body: string[];
}

export interface TemplateDefinition {
  key: TemplateKey;
  title: string;
  productLabel: string;
  requiresHumanReview: boolean;
  requiresOfficialCourtForms: boolean;
  sections: TemplateSection[];
  checklist: string[];
}

export interface AuditEntry {
  at: string;
  action: string;
  fromStatus: DocumentStatus | null;
  toStatus: DocumentStatus | null;
  actor: string;
  detail: string;
}

export interface PacketInput {
  templateKey: TemplateKey;
  recipientLabel?: string;
  referenceCode?: string;
  generatedAt?: string;
}
