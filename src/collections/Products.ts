import { CollectionConfig } from 'payload';

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'status', 'inventory'],
    group: 'E-Commerce',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Product name/title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly product identifier',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Detailed product description',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Brief product summary (max 300 chars)',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'DIY Kits', value: 'diy' },
        { label: 'Legal Services', value: 'legal' },
        { label: 'Consultations', value: 'consultation' },
        { label: 'Express Services', value: 'express' },
        { label: 'Document Review', value: 'review' },
      ],
    },
    {
      name: 'serviceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Digital Product', value: 'digital' },
        { label: 'Service', value: 'service' },
        { label: 'Consultation', value: 'consultation' },
        { label: 'Full Service', value: 'full_service' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in USD',
        step: 0.01,
      },
    },
    {
      name: 'originalPrice',
      type: 'number',
      min: 0,
      admin: {
        description: 'Original price (for showing discounts)',
        step: 0.01,
      },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: {
        description: 'Stripe Price ID for payments',
      },
    },
    {
      name: 'stripeProductId',
      type: 'text',
      admin: {
        description: 'Stripe Product ID',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'inventory',
      type: 'group',
      fields: [
        {
          name: 'trackInventory',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'quantity',
          type: 'number',
          defaultValue: 0,
          admin: {
            condition: (data) => data?.inventory?.trackInventory,
          },
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          defaultValue: 5,
          admin: {
            condition: (data) => data?.inventory?.trackInventory,
          },
        },
        {
          name: 'allowBackorders',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (data) => data?.inventory?.trackInventory,
          },
        },
      ],
    },
    {
      name: 'processingTime',
      type: 'group',
      fields: [
        {
          name: 'minDays',
          type: 'number',
          defaultValue: 1,
          admin: {
            description: 'Minimum processing days',
          },
        },
        {
          name: 'maxDays',
          type: 'number',
          defaultValue: 7,
          admin: {
            description: 'Maximum processing days',
          },
        },
        {
          name: 'businessDaysOnly',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'convictionTypes',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Felony', value: 'felony' },
        { label: 'Misdemeanor', value: 'misdemeanor' },
        { label: 'Infraction', value: 'infraction' },
        { label: 'Juvenile', value: 'juvenile' },
        { label: 'DUI/DWI', value: 'dui' },
        { label: 'Drug Offense', value: 'drug' },
        { label: 'Violent Crime', value: 'violent' },
        { label: 'White Collar', value: 'white_collar' },
      ],
      admin: {
        description: 'Types of convictions this service covers',
      },
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      admin: {
        description: 'Key features and benefits',
      },
    },
    {
      name: 'requirements',
      type: 'array',
      fields: [
        {
          name: 'requirement',
          type: 'text',
          required: true,
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
      admin: {
        description: 'Requirements for this service',
      },
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
        },
      ],
      admin: {
        description: 'Frequently asked questions',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          maxLength: 60,
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 160,
        },
        {
          name: 'keywords',
          type: 'text',
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
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
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'downloadable',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
      admin: {
        description: 'Downloadable documents (for digital products)',
      },
    },
    {
      name: 'analytics',
      type: 'group',
      admin: {
        description: 'Product performance metrics',
      },
      fields: [
        {
          name: 'views',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'totalSales',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'revenue',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            step: 0.01,
          },
        },
        {
          name: 'conversionRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            step: 0.01,
            description: 'Conversion rate percentage',
          },
        },
        {
          name: 'averageRating',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            step: 0.1,
          },
        },
        {
          name: 'totalReviews',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show on homepage and featured sections',
      },
    },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as popular choice',
      },
    },
    {
      name: 'bestValue',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as best value option',
      },
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'California', value: 'california' },
        { label: 'Los Angeles', value: 'los_angeles' },
        { label: 'Orange County', value: 'orange_county' },
        { label: 'San Francisco', value: 'san_francisco' },
        { label: 'San Diego', value: 'san_diego' },
        { label: 'Expungement', value: 'expungement' },
        { label: 'Record Sealing', value: 'record_sealing' },
        { label: 'Prop 47', value: 'prop_47' },
        { label: 'Prop 64', value: 'prop_64' },
        { label: 'Fast Track', value: 'fast_track' },
        { label: 'Attorney Review', value: 'attorney_review' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate slug from name if not provided
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        return data;
      },
    ],
  },
  timestamps: true,
};

export default Products;