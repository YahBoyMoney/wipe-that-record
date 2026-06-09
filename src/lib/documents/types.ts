export type DocumentStatus =
  | 'intake_needed'
  | 'ready_for_review'
  | 'needs_manual_review'
  | 'generated'
  | 'delivered'
  | 'blocked';

export type TemplateKey = 'diy_kit' | 'expert_review' | 'full_service';

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
