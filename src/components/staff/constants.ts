// UI-facing option lists for the staff document dashboard. These mirror the backend's
// closed sets (src/lib/documents/official/forms.mjs). They are intentionally duplicated as
// plain UI constants so the client bundle does not pull in the .mjs document core; the
// server still re-validates every submission, so this list is convenience only.

export const DISMISSAL_BASIS_OPTIONS = [
  { value: '1203.4', label: '§ 1203.4 — Felony/misdemeanor with probation granted' },
  { value: '1203.4a', label: '§ 1203.4a — Misdemeanor/infraction, non-probation sentence' },
  { value: '1203.41', label: '§ 1203.41 — Felony county jail / state prison sentence' },
  { value: '1203.42', label: '§ 1203.42 — Pre-realignment felony prison sentence' },
  { value: '1203.49', label: '§ 1203.49 — § 647(b) human-trafficking victim' },
] as const;

export const SUPPORTED_COUNTY_OPTIONS = [
  { value: 'san_bernardino', label: 'San Bernardino (court address known)' },
  { value: 'riverside', label: 'Riverside (court address known)' },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  intake_needed: 'Intake Needed',
  ready_for_review: 'Ready for Review',
  needs_manual_review: 'Needs Manual Review',
  generated: 'Generated',
  delivered: 'Delivered',
  blocked: 'Blocked',
};

export const STATUS_CHIP_CLASS: Record<string, string> = {
  intake_needed: 'bg-gray-100 text-gray-800',
  ready_for_review: 'bg-blue-100 text-blue-800',
  needs_manual_review: 'bg-amber-100 text-amber-800',
  generated: 'bg-green-100 text-green-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  blocked: 'bg-red-100 text-red-800',
};

export const TEMPLATE_LABELS: Record<string, string> = {
  diy_kit: 'DIY Kit',
  expert_review: 'Expert Review',
  full_service: 'Full Service',
  official_ca_dismissal_packet: 'Official CA Dismissal Packet',
};
