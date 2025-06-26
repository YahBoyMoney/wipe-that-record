import { CollectionConfig } from 'payload';

const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer.email', 'status', 'total', 'createdAt'],
    group: 'E-Commerce',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'superadmin',
    create: () => true, // Allow order creation from frontend
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'superadmin',
    delete: ({ req }) => req.user?.role === 'superadmin',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique order identifier',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Payment', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Document Review', value: 'review' },
        { label: 'Filing in Progress', value: 'filing' },
        { label: 'Court Processing', value: 'court_processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'On Hold', value: 'on_hold' },
      ],
    },
    {
      name: 'customer',
      type: 'group',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'address',
          type: 'group',
          fields: [
            {
              name: 'street',
              type: 'text',
            },
            {
              name: 'city',
              type: 'text',
            },
            {
              name: 'state',
              type: 'text',
              defaultValue: 'CA',
            },
            {
              name: 'zipCode',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products' as any,
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: {
            description: 'Price at time of purchase',
            step: 0.01,
          },
        },
        {
          name: 'total',
          type: 'number',
          required: true,
          admin: {
            description: 'Line item total (quantity × price)',
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'totals',
      type: 'group',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'tax',
          type: 'number',
          defaultValue: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'discount',
          type: 'number',
          defaultValue: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'total',
          type: 'number',
          required: true,
          admin: {
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      fields: [
        {
          name: 'method',
          type: 'select',
          options: [
            { label: 'Credit Card', value: 'credit_card' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'Bank Transfer', value: 'bank_transfer' },
            { label: 'Check', value: 'check' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Processing', value: 'processing' },
            { label: 'Completed', value: 'completed' },
            { label: 'Failed', value: 'failed' },
            { label: 'Refunded', value: 'refunded' },
            { label: 'Partially Refunded', value: 'partial_refund' },
          ],
        },
        {
          name: 'transactionId',
          type: 'text',
          admin: {
            description: 'Payment processor transaction ID',
          },
        },
        {
          name: 'stripePaymentIntentId',
          type: 'text',
          admin: {
            description: 'Stripe Payment Intent ID',
          },
        },
        {
          name: 'paidAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'refundAmount',
          type: 'number',
          defaultValue: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'refundReason',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'caseDetails',
      type: 'group',
      admin: {
        description: 'Legal case information',
      },
      fields: [
        {
          name: 'caseNumber',
          type: 'text',
          admin: {
            description: 'Court case number',
          },
        },
        {
          name: 'court',
          type: 'text',
          admin: {
            description: 'Court where case was filed',
          },
        },
        {
          name: 'county',
          type: 'select',
          options: [
            { label: 'Los Angeles', value: 'los_angeles' },
            { label: 'Orange', value: 'orange' },
            { label: 'San Diego', value: 'san_diego' },
            { label: 'Riverside', value: 'riverside' },
            { label: 'San Bernardino', value: 'san_bernardino' },
            { label: 'Ventura', value: 'ventura' },
            { label: 'Santa Barbara', value: 'santa_barbara' },
            { label: 'Kern', value: 'kern' },
            { label: 'Fresno', value: 'fresno' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'convictionDate',
          type: 'date',
        },
        {
          name: 'convictionType',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Felony', value: 'felony' },
            { label: 'Misdemeanor', value: 'misdemeanor' },
            { label: 'Infraction', value: 'infraction' },
            { label: 'Juvenile', value: 'juvenile' },
            { label: 'DUI/DWI', value: 'dui' },
            { label: 'Drug Offense', value: 'drug' },
          ],
        },
        {
          name: 'charges',
          type: 'array',
          fields: [
            {
              name: 'charge',
              type: 'text',
              required: true,
            },
            {
              name: 'code',
              type: 'text',
              admin: {
                description: 'Penal code section',
              },
            },
            {
              name: 'disposition',
              type: 'text',
              admin: {
                description: 'Final disposition of charge',
              },
            },
          ],
        },
        {
          name: 'documents',
          type: 'array',
          fields: [
            {
              name: 'document',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Court Records', value: 'court_records' },
                { label: 'ID Copy', value: 'id_copy' },
                { label: 'Fingerprint Card', value: 'fingerprint' },
                { label: 'Probation Records', value: 'probation' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'description',
              type: 'text',
            },
            {
              name: 'uploadedAt',
              type: 'date',
              defaultValue: () => new Date().toISOString(),
            },
          ],
        },
      ],
    },
    {
      name: 'timeline',
      type: 'array',
      admin: {
        description: 'Case progress timeline',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'status',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'internal',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Internal note (not visible to customer)',
          },
        },
        {
          name: 'updatedBy',
          type: 'text',
          admin: {
            description: 'Staff member who made the update',
          },
        },
      ],
    },
    {
      name: 'assignedTo',
      type: 'group',
      admin: {
        description: 'Staff assignment',
      },
      fields: [
        {
          name: 'attorney',
          type: 'text',
          admin: {
            description: 'Assigned attorney',
          },
        },
        {
          name: 'paralegal',
          type: 'text',
          admin: {
            description: 'Assigned paralegal',
          },
        },
        {
          name: 'caseManager',
          type: 'text',
          admin: {
            description: 'Assigned case manager',
          },
        },
      ],
    },
    {
      name: 'communications',
      type: 'array',
      admin: {
        description: 'Customer communications log',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Email', value: 'email' },
            { label: 'Phone Call', value: 'phone' },
            { label: 'Text Message', value: 'sms' },
            { label: 'Mail', value: 'mail' },
            { label: 'In-Person', value: 'in_person' },
          ],
        },
        {
          name: 'direction',
          type: 'select',
          required: true,
          options: [
            { label: 'Inbound', value: 'inbound' },
            { label: 'Outbound', value: 'outbound' },
          ],
        },
        {
          name: 'subject',
          type: 'text',
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'staffMember',
          type: 'text',
          admin: {
            description: 'Staff member who handled communication',
          },
        },
      ],
    },
    {
      name: 'expectedCompletion',
      type: 'date',
      admin: {
        description: 'Expected completion date',
      },
    },
    {
      name: 'actualCompletion',
      type: 'date',
      admin: {
        description: 'Actual completion date',
      },
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Rush Order', value: 'rush' },
        { label: 'VIP Customer', value: 'vip' },
        { label: 'Complex Case', value: 'complex' },
        { label: 'Prop 47', value: 'prop_47' },
        { label: 'Prop 64', value: 'prop_64' },
        { label: 'Repeat Customer', value: 'repeat' },
        { label: 'Referral', value: 'referral' },
      ],
    },
    {
      name: 'notes',
      type: 'array',
      admin: {
        description: 'Internal notes',
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'note',
          type: 'textarea',
          required: true,
        },
        {
          name: 'author',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'general',
          options: [
            { label: 'General', value: 'general' },
            { label: 'Legal', value: 'legal' },
            { label: 'Customer Service', value: 'customer_service' },
            { label: 'Billing', value: 'billing' },
            { label: 'Technical', value: 'technical' },
          ],
        },
      ],
    },
    {
      name: 'source',
      type: 'select',
      admin: {
        description: 'How customer found us',
      },
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Google Search', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'Referral', value: 'referral' },
        { label: 'Repeat Customer', value: 'repeat' },
        { label: 'Attorney Referral', value: 'attorney_referral' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'promoCode',
      type: 'text',
      admin: {
        description: 'Promotional code used',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Generate order number for new orders
        if (operation === 'create' && !data.orderNumber) {
          const timestamp = Date.now().toString();
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          data.orderNumber = `WTR-${timestamp.slice(-8)}-${random}`;
        }

        // Auto-calculate totals
        if (data.items && Array.isArray(data.items)) {
          const subtotal = data.items.reduce((sum, item) => {
            const itemTotal = (item.quantity || 1) * (item.price || 0);
            item.total = itemTotal;
            return sum + itemTotal;
          }, 0);

          if (!data.totals) data.totals = {};
          data.totals.subtotal = subtotal;
          data.totals.total = subtotal + (data.totals.tax || 0) - (data.totals.discount || 0);
        }

        // Auto-add timeline entry for status changes
        if (operation === 'update' && data.status) {
          if (!data.timeline) data.timeline = [];
          
          // Check if status is different from last timeline entry
          const lastEntry = data.timeline[data.timeline.length - 1];
          if (!lastEntry || lastEntry.status !== data.status) {
            data.timeline.push({
              date: new Date().toISOString(),
              status: data.status,
              description: `Order status changed to: ${data.status}`,
              internal: false,
              updatedBy: 'System',
            });
          }
        }

        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        if (operation === 'create') {
          console.log(`✅ New order created: ${doc.orderNumber} - $${doc.totals?.total || 0}`);
        }
      },
    ],
  },
  timestamps: true,
};

export default Orders;