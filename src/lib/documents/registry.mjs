// Template registry mapping paid products to document-package templates.
//
// IMPORTANT: Sections contain only generic, non-personalized guidance and checklist
// items. They deliberately contain NO official court-form field content (e.g. CR-180).
// Official forms + deterministic data mapping + human review are a later phase.

export const TEMPLATE_KEYS = ['diy_kit', 'expert_review', 'full_service'];

export const TEMPLATES = {
  diy_kit: {
    key: 'diy_kit',
    title: 'California Record Relief — DIY Starter Packet',
    productLabel: 'DIY Kit',
    // DIY packet is informational only, so it does not require a human review gate
    // before the (non-personalized) starter packet is produced. The official court
    // form itself still must be obtained and reviewed by the customer/staff.
    requiresHumanReview: false,
    requiresOfficialCourtForms: true,
    sections: [
      {
        heading: 'What this packet is',
        body: [
          'A step-by-step starter guide for pursuing California record relief on your own.',
          'It explains the general process and what to gather. It does not contain a completed court form.',
        ],
      },
      {
        heading: 'How the process generally works',
        body: [
          '1. Confirm your eligibility for the relief you are seeking.',
          '2. Obtain the correct official Judicial Council form for your case type from the court.',
          '3. Complete the form accurately using your own case records.',
          '4. File with the correct court and pay or request a waiver of any fees.',
          '5. Track your hearing date and the court’s decision.',
        ],
      },
    ],
    checklist: [
      'Locate your case number and the county/court where the case was handled',
      'Obtain a copy of your record of conviction (RAP sheet or court docket)',
      'Confirm any probation is complete and fines/restitution are paid',
      'Download the correct official Judicial Council form for your case type',
      'Complete the form using your own accurate case information',
      'Have the completed form reviewed before filing',
      'File with the court and keep proof of filing',
    ],
  },

  expert_review: {
    key: 'expert_review',
    title: 'California Record Relief — Expert Review Packet',
    productLabel: 'Expert Review',
    // Personalized review of a customer's situation: must be approved by qualified
    // staff (human-review gate) before any packet is generated or delivered.
    requiresHumanReview: true,
    requiresOfficialCourtForms: true,
    sections: [
      {
        heading: 'What this packet is',
        body: [
          'A cover sheet for the expert review of your record-relief documents.',
          'A qualified reviewer must approve your case before any personalized packet is produced.',
        ],
      },
      {
        heading: 'Review checklist (staff)',
        body: [
          'Verify eligibility against the records provided.',
          'Confirm the correct official form and county are identified.',
          'Flag anything that requires manual handling before delivery.',
        ],
      },
    ],
    checklist: [
      'Records received and verified',
      'Eligibility assessed',
      'Correct official form identified',
      'Reviewer approval recorded',
    ],
  },

  full_service: {
    key: 'full_service',
    title: 'California Record Relief — Full Service Packet',
    productLabel: 'Full Service',
    requiresHumanReview: true,
    requiresOfficialCourtForms: true,
    sections: [
      {
        heading: 'What this packet is',
        body: [
          'A case cover sheet for full-service handling of your record-relief matter.',
          'A qualified team member must approve your case before any personalized filing packet is produced.',
        ],
      },
      {
        heading: 'Case handling checklist (staff)',
        body: [
          'Confirm scope and county.',
          'Gather and verify all required records.',
          'Prepare the official form using verified data.',
          'Obtain human review approval before filing.',
        ],
      },
    ],
    checklist: [
      'Intake complete',
      'Records verified',
      'Official form prepared from verified data',
      'Human review approval recorded',
      'Filing scheduled',
    ],
  },
};

export function getTemplate(key) {
  const tpl = TEMPLATES[key];
  if (!tpl) throw new Error(`Unknown template key: ${key}`);
  return tpl;
}

// Maps the Stripe checkout session metadata (see src/app/api/webhook/route.ts) to a
// template key. Mirrors the webhook's metadata.type / upgradeType branches.
export function templateKeyForSession({ type, upgradeType } = {}) {
  if (type === 'diy') return 'diy_kit';
  if (type === 'upgrade') {
    if (upgradeType === 'review') return 'expert_review';
    if (upgradeType === 'full') return 'full_service';
  }
  return 'diy_kit';
}

// Initial status for a newly created package: packets that require human review start
// in intake_needed (gated); informational packets are immediately ready_for_review.
export function initialStatusForTemplate(key) {
  return getTemplate(key).requiresHumanReview ? 'intake_needed' : 'ready_for_review';
}

// Maps a Products collection record (category / serviceType) to a template key.
// Used by the future order-based path.
export function templateKeyForProduct({ category, serviceType } = {}) {
  if (serviceType === 'full_service' || category === 'legal') return 'full_service';
  if (category === 'review') return 'expert_review';
  return 'diy_kit';
}
