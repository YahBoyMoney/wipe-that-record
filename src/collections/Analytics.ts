import { CollectionConfig } from 'payload';

const Analytics: CollectionConfig = {
  slug: 'analytics',
  admin: {
    useAsTitle: 'eventType',
    defaultColumns: ['eventType', 'source', 'value', 'createdAt'],
    group: 'Business Intelligence',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'superadmin',
    create: () => true, // Allow analytics tracking from frontend
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'superadmin',
  },
  fields: [
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        // Revenue Events
        { label: 'Sale Completed', value: 'sale_completed' },
        { label: 'Payment Received', value: 'payment_received' },
        { label: 'Refund Processed', value: 'refund_processed' },
        { label: 'Subscription Started', value: 'subscription_started' },
        { label: 'Subscription Cancelled', value: 'subscription_cancelled' },
        
        // Customer Events
        { label: 'Lead Created', value: 'lead_created' },
        { label: 'Customer Registered', value: 'customer_registered' },
        { label: 'Customer Login', value: 'customer_login' },
        { label: 'Profile Updated', value: 'profile_updated' },
        
        // Product Events
        { label: 'Product Viewed', value: 'product_viewed' },
        { label: 'Product Added to Cart', value: 'cart_add' },
        { label: 'Product Removed from Cart', value: 'cart_remove' },
        { label: 'Checkout Started', value: 'checkout_started' },
        { label: 'Checkout Completed', value: 'checkout_completed' },
        { label: 'Checkout Abandoned', value: 'checkout_abandoned' },
        
        // Marketing Events
        { label: 'Email Opened', value: 'email_opened' },
        { label: 'Email Clicked', value: 'email_clicked' },
        { label: 'Ad Clicked', value: 'ad_clicked' },
        { label: 'Social Share', value: 'social_share' },
        { label: 'Referral Made', value: 'referral_made' },
        
        // System Events
        { label: 'Page View', value: 'page_view' },
        { label: 'Search Performed', value: 'search_performed' },
        { label: 'Form Submitted', value: 'form_submitted' },
        { label: 'Download Started', value: 'download_started' },
        { label: 'Error Occurred', value: 'error_occurred' },
      ],
      admin: {
        description: 'Type of analytics event',
      },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Mobile App', value: 'mobile_app' },
        { label: 'API', value: 'api' },
        { label: 'Admin Panel', value: 'admin' },
        { label: 'Email Campaign', value: 'email' },
        { label: 'Social Media', value: 'social' },
        { label: 'Google Ads', value: 'google_ads' },
        { label: 'Facebook Ads', value: 'facebook_ads' },
        { label: 'Referral', value: 'referral' },
        { label: 'Direct', value: 'direct' },
        { label: 'Telegram Bot', value: 'telegram' },
        { label: 'System', value: 'system' },
      ],
      admin: {
        description: 'Source of the event',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Revenue', value: 'revenue' },
        { label: 'Customer', value: 'customer' },
        { label: 'Product', value: 'product' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'System', value: 'system' },
        { label: 'Legal', value: 'legal' },
        { label: 'Support', value: 'support' },
      ],
      admin: {
        description: 'Event category for grouping',
      },
    },
    {
      name: 'value',
      type: 'number',
      admin: {
        description: 'Numeric value (revenue, quantity, etc.)',
        step: 0.01,
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      admin: {
        description: 'Currency code for monetary values',
      },
    },
    {
      name: 'userId',
      type: 'text',
      admin: {
        description: 'Associated user ID',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      admin: {
        description: 'Session identifier',
      },
    },
    {
      name: 'relatedObject',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Product', value: 'product' },
            { label: 'Order', value: 'order' },
            { label: 'Lead', value: 'lead' },
            { label: 'User', value: 'user' },
            { label: 'Page', value: 'page' },
            { label: 'Email Campaign', value: 'email_campaign' },
          ],
        },
        {
          name: 'id',
          type: 'text',
          admin: {
            description: 'ID of related object',
          },
        },
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Name/title of related object',
          },
        },
      ],
      admin: {
        description: 'Related object reference',
      },
    },
    {
      name: 'properties',
      type: 'json',
      admin: {
        description: 'Additional event properties (JSON)',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'userAgent',
          type: 'text',
          admin: {
            description: 'User agent string',
          },
        },
        {
          name: 'ipAddress',
          type: 'text',
          admin: {
            description: 'IP address (anonymized)',
          },
        },
        {
          name: 'referrer',
          type: 'text',
          admin: {
            description: 'Referrer URL',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'Current page URL',
          },
        },
        {
          name: 'utmSource',
          type: 'text',
          admin: {
            description: 'UTM source parameter',
          },
        },
        {
          name: 'utmMedium',
          type: 'text',
          admin: {
            description: 'UTM medium parameter',
          },
        },
        {
          name: 'utmCampaign',
          type: 'text',
          admin: {
            description: 'UTM campaign parameter',
          },
        },
        {
          name: 'utmTerm',
          type: 'text',
          admin: {
            description: 'UTM term parameter',
          },
        },
        {
          name: 'utmContent',
          type: 'text',
          admin: {
            description: 'UTM content parameter',
          },
        },
        {
          name: 'device',
          type: 'select',
          options: [
            { label: 'Desktop', value: 'desktop' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'Unknown', value: 'unknown' },
          ],
        },
        {
          name: 'browser',
          type: 'text',
          admin: {
            description: 'Browser name and version',
          },
        },
        {
          name: 'os',
          type: 'text',
          admin: {
            description: 'Operating system',
          },
        },
        {
          name: 'location',
          type: 'group',
          fields: [
            {
              name: 'country',
              type: 'text',
            },
            {
              name: 'state',
              type: 'text',
            },
            {
              name: 'city',
              type: 'text',
            },
            {
              name: 'zipCode',
              type: 'text',
            },
          ],
        },
      ],
      admin: {
        description: 'Event metadata and context',
      },
    },
    {
      name: 'performance',
      type: 'group',
      admin: {
        description: 'Performance metrics',
      },
      fields: [
        {
          name: 'pageLoadTime',
          type: 'number',
          admin: {
            description: 'Page load time in milliseconds',
          },
        },
        {
          name: 'processingTime',
          type: 'number',
          admin: {
            description: 'Processing time in milliseconds',
          },
        },
        {
          name: 'responseTime',
          type: 'number',
          admin: {
            description: 'Response time in milliseconds',
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'A/B Test', value: 'ab_test' },
        { label: 'High Value', value: 'high_value' },
        { label: 'New Customer', value: 'new_customer' },
        { label: 'Returning Customer', value: 'returning_customer' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Desktop', value: 'desktop' },
        { label: 'Conversion', value: 'conversion' },
        { label: 'Abandonment', value: 'abandonment' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
      ],
      admin: {
        description: 'Event tags for filtering and analysis',
      },
    },
    {
      name: 'isProcessed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Has this event been processed by analytics systems?',
      },
    },
    {
      name: 'processedAt',
      type: 'date',
      admin: {
        description: 'When the event was processed',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set category based on event type if not provided
        if (!data.category && data.eventType) {
          const revenueEvents = ['sale_completed', 'payment_received', 'refund_processed', 'subscription_started', 'subscription_cancelled'];
          const customerEvents = ['lead_created', 'customer_registered', 'customer_login', 'profile_updated'];
          const productEvents = ['product_viewed', 'cart_add', 'cart_remove', 'checkout_started', 'checkout_completed', 'checkout_abandoned'];
          const marketingEvents = ['email_opened', 'email_clicked', 'ad_clicked', 'social_share', 'referral_made'];
          
          if (revenueEvents.includes(data.eventType)) {
            data.category = 'revenue';
          } else if (customerEvents.includes(data.eventType)) {
            data.category = 'customer';
          } else if (productEvents.includes(data.eventType)) {
            data.category = 'product';
          } else if (marketingEvents.includes(data.eventType)) {
            data.category = 'marketing';
          } else {
            data.category = 'system';
          }
        }

        // Auto-set processing timestamp when marked as processed
        if (data.isProcessed && !data.processedAt) {
          data.processedAt = new Date().toISOString();
        }

        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        if (operation === 'create') {
          console.log(`📊 Analytics event recorded: ${doc.eventType} from ${doc.source}`);
          
          // Auto-trigger processing for certain high-priority events
          const priorityEvents = ['sale_completed', 'payment_received', 'lead_created'];
          if (priorityEvents.includes(doc.eventType)) {
            console.log(`🔥 High-priority analytics event: ${doc.eventType}`);
            // Here you could trigger immediate processing, notifications, etc.
          }
        }
      },
    ],
     },
   timestamps: true,
 };

export default Analytics;