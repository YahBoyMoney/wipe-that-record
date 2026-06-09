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
      name: 'generatedFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Generated PDF packet (admin-gated storage). No public download route exists yet.',
      },
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
