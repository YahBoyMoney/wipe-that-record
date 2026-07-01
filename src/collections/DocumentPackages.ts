import { CollectionConfig } from 'payload';

// Tracks the lifecycle of a document package produced for a paid order/customer.
//
// PII policy: this collection deliberately does NOT copy sensitive case data
// (case numbers, charges, convictions, DOB). Sensitive legal details live on the
// related `orders.caseDetails` record, reachable via the `linkedOrder` relationship
// under the admin access gate. Only an operational `customerEmail` is stored here.
const DocumentPackages: CollectionConfig = {
  slug: 'document-packages',
  admin: {
    useAsTitle: 'sourceSessionId',
    defaultColumns: ['sourceSessionId', 'templateKey', 'status', 'customerEmail', 'createdAt'],
    group: 'Documents',
    description:
      'Document packages generated for paid orders. Review-required packages must be approved before generation.',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'superadmin',
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'superadmin',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'superadmin',
    delete: ({ req }) => req.user?.role === 'superadmin',
  },
  fields: [
    {
      name: 'sourceSessionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Idempotency key — Stripe checkout session id, or order:<id> / manual:<id>.',
      },
    },
    {
      name: 'templateKey',
      type: 'select',
      required: true,
      options: [
        { label: 'DIY Kit', value: 'diy_kit' },
        { label: 'Expert Review', value: 'expert_review' },
        { label: 'Full Service', value: 'full_service' },
        { label: 'Official CA Dismissal Packet (CR-180 + CR-181)', value: 'official_ca_dismissal_packet' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'intake_needed',
      admin: {
        readOnly: true,
        description: 'Driven by the document service; do not edit directly.',
      },
      options: [
        { label: 'Intake Needed', value: 'intake_needed' },
        { label: 'Ready for Review', value: 'ready_for_review' },
        { label: 'Needs Manual Review', value: 'needs_manual_review' },
        { label: 'Generated', value: 'generated' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Blocked', value: 'blocked' },
      ],
    },
    {
      name: 'customerEmail',
      type: 'email',
      admin: {
        description: 'Operational lookup only. Never written to logs or analytics.',
      },
    },
    {
      name: 'linkedLead',
      type: 'relationship',
      relationTo: 'leads' as any,
      admin: {
        description: 'Lead record created at purchase (current webhook path).',
      },
    },
    {
      name: 'linkedOrder',
      type: 'relationship',
      relationTo: 'orders' as any,
      admin: {
        description: 'Order record, when the order-based path is used.',
      },
    },
    {
      name: 'review',
      type: 'group',
      admin: {
        description: 'Human-review gate. Required before generating personalized legal packets.',
      },
      fields: [
        { name: 'approved', type: 'checkbox', defaultValue: false },
        { name: 'reviewedBy', type: 'text' },
        { name: 'reviewedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'reviewNotes', type: 'textarea' },
      ],
    },
    {
      name: 'officialIntake',
      type: 'group',
      admin: {
        description:
          'Staff-reviewed intake for official CR-180/CR-181 generation. Contains case PII; ' +
          'admin-gated, never logged or sent to analytics. Every legal choice here must be ' +
          'entered by a human reviewer — never inferred from marketing-quiz answers.',
        condition: (data) => data?.templateKey === 'official_ca_dismissal_packet',
      },
      fields: [
        {
          name: 'staffReviewed',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Hard gate: must be true before generation can fill official forms.' },
        },
        { name: 'selfRepresented', type: 'checkbox', defaultValue: false },
        {
          name: 'petitioner',
          type: 'group',
          fields: [
            { name: 'fullName', type: 'text' },
            { name: 'street', type: 'text' },
            { name: 'city', type: 'text' },
            { name: 'state', type: 'text' },
            { name: 'zip', type: 'text' },
            { name: 'phone', type: 'text' },
            { name: 'email', type: 'email' },
          ],
        },
        {
          name: 'court',
          type: 'group',
          fields: [
            { name: 'county', type: 'text' },
            { name: 'courtName', type: 'text' },
            { name: 'courtStreet', type: 'text' },
            { name: 'courtCityZip', type: 'text' },
          ],
        },
        {
          name: 'caseInfo',
          type: 'group',
          fields: [
            { name: 'caseNumber', type: 'text' },
            { name: 'convictionDate', type: 'text' },
            {
              name: 'charges',
              type: 'array',
              fields: [
                { name: 'code', type: 'text' },
                { name: 'section', type: 'text' },
                { name: 'type', type: 'text' },
              ],
            },
          ],
        },
        {
          name: 'relief',
          type: 'group',
          fields: [
            {
              name: 'dismissalBasis',
              type: 'select',
              options: [
                { label: '§ 1203.4 — probation granted', value: '1203.4' },
                { label: '§ 1203.4a — non-probation misdemeanor/infraction', value: '1203.4a' },
                { label: '§ 1203.41 — felony jail/prison', value: '1203.41' },
                { label: '§ 1203.42 — pre-realignment felony prison', value: '1203.42' },
                { label: '§ 1203.49 — § 647(b) trafficking victim', value: '1203.49' },
              ],
            },
            { name: 'felonyReductionRequested', type: 'checkbox', defaultValue: false },
          ],
        },
        { name: 'savedBy', type: 'text', admin: { readOnly: true } },
        { name: 'savedAt', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      name: 'validation',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Last validation result for the official intake. Reasons are non-PII strings only.',
        condition: (data) => data?.templateKey === 'official_ca_dismissal_packet',
      },
      fields: [
        { name: 'ok', type: 'checkbox', defaultValue: false },
        {
          name: 'reasons',
          type: 'array',
          fields: [{ name: 'reason', type: 'text' }],
        },
        { name: 'checkedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      name: 'generatedFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Generated PDF packet (admin-gated storage). No public download route exists yet.',
      },
    },
    {
      name: 'generatedArtifact',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Non-PII metadata about the most recently generated packet artifact.',
      },
      fields: [
        { name: 'fileName', type: 'text' },
        { name: 'byteSize', type: 'number' },
        { name: 'sample', type: 'checkbox', defaultValue: false },
        { name: 'generatedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      name: 'downloadToken',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Reserved for a future signed-download route. Not used in Phase 1.',
      },
    },
    {
      name: 'auditLog',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Status/action history. Must never contain PII.',
      },
      fields: [
        { name: 'at', type: 'text' },
        { name: 'action', type: 'text' },
        { name: 'fromStatus', type: 'text' },
        { name: 'toStatus', type: 'text' },
        { name: 'actor', type: 'text' },
        { name: 'detail', type: 'text' },
      ],
    },
  ],
  timestamps: true,
};

export default DocumentPackages;
