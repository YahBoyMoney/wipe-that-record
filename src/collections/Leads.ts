import { CollectionConfig } from 'payload';
import { 
  sendDiyConfirmationEmail, 
  sendReviewConfirmationEmail, 
  sendFullServiceConfirmationEmail 
} from '@/lib/email';

const Leads: CollectionConfig = {
  slug: 'leads',
  admin: { 
    useAsTitle: 'email', 
    defaultColumns: [
      'first',
      'last', 
      'email',
      'convictionType',
      'city',
      'state',
      'conversionStage',
      'leadScore',
      'totalRevenue',
      'source',
      'emailStatus',
      'createdAt'
    ],
    description: 'Lead management and analytics dashboard - Visit /admin/dashboard for detailed analytics',
    group: 'Customer Analytics'
  },
  fields: [
    // Basic Lead Information
    { name: 'email', type: 'email', required: true },
    { name: 'first', type: 'text', required: true },
    { name: 'last', type: 'text', required: true },
    { name: 'phone', type: 'text', label: 'Phone Number' },
    
    // Address Information (for legal paperwork)
    { name: 'street', type: 'text', label: 'Street Address' },
    { name: 'city', type: 'text', label: 'City' },
    { name: 'state', type: 'text', label: 'State' },
    { name: 'zipCode', type: 'text', label: 'ZIP Code' },
    
    // Case Information
    { 
      name: 'convictionType', 
      type: 'select',
      label: 'Type of Conviction',
      options: [
        { label: 'DUI/DWI', value: 'DUI' },
        { label: 'Felony', value: 'felony' },
        { label: 'Misdemeanor', value: 'misdemeanor' },
        { label: 'Drug Possession', value: 'drug-possession' },
        { label: 'Theft/Shoplifting', value: 'theft' },
        { label: 'Domestic Violence', value: 'domestic-violence' },
        { label: 'Assault', value: 'assault' },
        { label: 'Other', value: 'other' },
        { label: 'Not Sure', value: 'not-sure' },
      ]
    },
    { name: 'convictionYear', type: 'text', label: 'Year of Conviction' },
    
    // Lead Qualification Data
    { 
      name: 'urgency', 
      type: 'select',
      label: 'Urgency Level',
      options: [
        { label: 'Immediate (job application pending)', value: 'immediate' },
        { label: 'Within a month', value: 'within-month' },
        { label: 'Within 3 months', value: 'within-3months' },
        { label: 'Within a year', value: 'within-year' },
        { label: 'Just exploring options', value: 'just-exploring' },
      ]
    },
    { 
      name: 'budget', 
      type: 'select',
      label: 'Budget Range',
      options: [
        { label: 'Under $100', value: 'under-100' },
        { label: '$100 - $500', value: '100-500' },
        { label: '$500 - $1,000', value: '500-1000' },
        { label: '$1,000 - $2,000', value: '1000-2000' },
        { label: 'Over $2,000', value: 'over-2000' },
        { label: 'Flexible', value: 'flexible' },
      ]
    },
    { 
      name: 'previousAttempts', 
      type: 'select',
      label: 'Previous Attempts',
      options: [
        { label: 'Never tried', value: 'never' },
        { label: 'Tried myself but failed', value: 'tried-myself' },
        { label: 'Hired a lawyer before', value: 'hired-lawyer' },
        { label: 'Had partial success', value: 'partial-success' },
      ]
    },
    { name: 'interests', type: 'text', label: 'Goals/Interests' },
    { name: 'employmentGoals', type: 'text', label: 'Employment Goals' },
    
    // Lead Scoring & Segmentation
    { 
      name: 'leadScore', 
      type: 'number', 
      label: 'Lead Score (0-100)',
      admin: { description: 'Automatically calculated lead score' }
    },
    { 
      name: 'leadSegment', 
      type: 'select',
      label: 'Lead Segment',
      options: [
        { label: 'Hot (60+ points)', value: 'hot' },
        { label: 'Warm (40-59 points)', value: 'warm' },
        { label: 'Lukewarm (25-39 points)', value: 'lukewarm' },
        { label: 'Cold (<25 points)', value: 'cold' },
      ]
    },
    { 
      name: 'emailSequence', 
      type: 'select',
      label: 'Email Sequence',
      options: [
        { label: 'General Nurture', value: 'general-nurture' },
        { label: 'DUI Specific', value: 'dui-specific' },
        { label: 'Misdemeanor Specific', value: 'misdemeanor-specific' },
        { label: 'Consultation Follow-up', value: 'consultation-follow-up' },
        { label: 'High Intent Acceleration', value: 'high-intent-acceleration' },
      ]
    },
    { name: 'leadMagnet', type: 'text', label: 'Lead Magnet Used' },
    { name: 'referrer', type: 'text', label: 'Referrer URL' },
    
    // Payment Information
    { name: 'amount', type: 'number' },
    { name: 'paid', type: 'checkbox', defaultValue: false },
    { name: 'stripeSessionId', type: 'text' },
    
    // Service Levels
    {
      name: 'lookup',
      type: 'checkbox',
      label: 'Paid record lookup ($100)',
      defaultValue: false,
    },
    {
      name: 'fullService',
      type: 'checkbox',
      label: 'Paid full-service ($1500)',
      defaultValue: false,
    },
    
    // Analytics & Tracking
    {
      name: 'source',
      type: 'select',
      label: 'Lead Source',
      options: [
        { label: 'Organic Search', value: 'organic' },
        { label: 'Paid Advertising', value: 'paid' },
        { label: 'Referral', value: 'referral' },
        { label: 'Direct Traffic', value: 'direct' },
        { label: 'Social Media', value: 'social' },
        { label: 'Email Campaign', value: 'email' },
      ],
      defaultValue: 'direct',
    },
    { 
      name: 'utmCampaign', 
      type: 'text', 
      label: 'UTM Campaign',
      admin: { description: 'Marketing campaign identifier' }
    },
    { 
      name: 'utmSource', 
      type: 'text', 
      label: 'UTM Source',
      admin: { description: 'Traffic source (google, facebook, etc.)' }
    },
    { 
      name: 'utmMedium', 
      type: 'text', 
      label: 'UTM Medium',
      admin: { description: 'Marketing medium (cpc, email, social, etc.)' }
    },
    
    // Conversion Tracking
    {
      name: 'conversionStage',
      type: 'select',
      label: 'Conversion Stage',
      options: [
        { label: 'Lead Captured', value: 'lead' },
        { label: 'DIY Purchased', value: 'diy_purchased' },
        { label: 'Review Upgrade', value: 'review_upgrade' },
        { label: 'Full Service', value: 'full_service' },
      ],
      defaultValue: 'lead',
    },
    { 
      name: 'diyPurchaseDate', 
      type: 'date', 
      label: 'DIY Purchase Date',
      admin: { description: 'When the $50 DIY package was purchased' }
    },
    { 
      name: 'upgradeDate', 
      type: 'date', 
      label: 'Upgrade Date',
      admin: { description: 'When they upgraded to review or full service' }
    },
    {
      name: 'upgradeType',
      type: 'select',
      label: 'Upgrade Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Review Service ($100)', value: 'review' },
        { label: 'Full Service ($1500)', value: 'full' },
      ],
      defaultValue: 'none',
    },
    { 
      name: 'timeToUpgrade', 
      type: 'number', 
      label: 'Time to Upgrade (minutes)',
      admin: { description: 'Minutes from DIY purchase to upgrade' }
    },
    
    // Revenue Tracking
    { 
      name: 'totalRevenue', 
      type: 'number', 
      label: 'Total Revenue',
      admin: { description: 'Sum of all purchases from this lead' }
    },
    { 
      name: 'lifetimeValue', 
      type: 'number', 
      label: 'Customer Lifetime Value',
      admin: { description: 'Projected total value of this customer' }
    },
    
    // Email Analytics
    {
      name: 'emailStatus',
      type: 'select',
      label: 'Email Status',
      options: [
        { label: 'Not Sent', value: 'not_sent' },
        { label: 'Sent', value: 'sent' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'not_sent',
    },
    { 
      name: 'lastEmailSent', 
      type: 'date', 
      label: 'Last Email Sent',
      admin: { description: 'When the last email was sent to this lead' }
    },
    { 
      name: 'emailsSent', 
      type: 'number', 
      label: 'Total Emails Sent',
      defaultValue: 0,
      admin: { description: 'Count of emails sent to this lead' }
    },
    
    // Behavioral Data
    { 
      name: 'timeOnSite', 
      type: 'text', 
      label: 'Time on Site',
      admin: { description: 'How long they spent on the website before converting' }
    },
    { 
      name: 'pagesViewed', 
      type: 'number', 
      label: 'Pages Viewed',
      admin: { description: 'Number of pages viewed before converting' }
    },
    { 
      name: 'deviceType', 
      type: 'select', 
      label: 'Device Type',
      options: [
        { label: 'Desktop', value: 'desktop' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
      ],
      admin: { description: 'Device used for conversion' }
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc }) => {
        // Auto-update analytics fields
        const now = new Date();

        // Set conversion stage and dates based on purchase type
        if (operation === 'create' && data.paid) {
          data.diyPurchaseDate = now;
          data.conversionStage = 'diy_purchased';
          data.totalRevenue = data.amount || 50;
          
          if (data.lookup && !data.fullService) {
            data.conversionStage = 'review_upgrade';
            data.upgradeType = 'review';
            data.upgradeDate = now;
            data.totalRevenue = 100;
          } else if (data.fullService) {
            data.conversionStage = 'full_service';
            data.upgradeType = 'full';
            data.upgradeDate = now;
            data.totalRevenue = 1500;
          }
        }

        // Calculate time to upgrade for updates
        if (operation === 'update' && originalDoc) {
          if (!originalDoc.lookup && data.lookup) {
            data.upgradeDate = now;
            data.upgradeType = 'review';
            data.conversionStage = 'review_upgrade';
            data.totalRevenue = (originalDoc.totalRevenue || 50) + 100;
            
            // Calculate time to upgrade in minutes
            if (originalDoc.diyPurchaseDate) {
              const timeDiff = now.getTime() - new Date(originalDoc.diyPurchaseDate).getTime();
              data.timeToUpgrade = Math.round(timeDiff / (1000 * 60));
            }
          }
          
          if (!originalDoc.fullService && data.fullService) {
            data.upgradeDate = now;
            data.upgradeType = 'full';
            data.conversionStage = 'full_service';
            data.totalRevenue = 1500;
            
            // Calculate time to upgrade in minutes
            if (originalDoc.diyPurchaseDate) {
              const timeDiff = now.getTime() - new Date(originalDoc.diyPurchaseDate).getTime();
              data.timeToUpgrade = Math.round(timeDiff / (1000 * 60));
            }
          }
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        try {
          // Skip email sending in development unless explicitly enabled
          if (process.env.NODE_ENV !== 'production' && process.env.SEND_EMAILS !== 'true') {
            console.log('Skipping email send in development mode');
            return;
          }

          const fullName = doc.first && doc.last ? `${doc.first} ${doc.last}` : doc.first || '';

          // Update email tracking
          const updateEmailStatus = async (status: string) => {
            await fetch('/api/update-lead-email-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                leadId: doc.id,
                emailStatus: status,
                lastEmailSent: new Date(),
                emailsSent: (doc.emailsSent || 0) + 1
              })
            });
          };

          // 1️⃣ DIY purchase (initial $50 payment)
          if (operation === 'create' && doc.paid && !doc.lookup && !doc.fullService) {
            await sendDiyConfirmationEmail(doc.email, fullName);
            await updateEmailStatus('sent');
            console.log(`✅ DIY purchase confirmation email sent to ${doc.email}`);
            return;
          }

          // 2️⃣ Review upgrade ($100 service)
          if (operation === 'create' && doc.paid && doc.lookup && !doc.fullService) {
            await sendReviewConfirmationEmail(doc.email, fullName);
            await updateEmailStatus('sent');
            console.log(`✅ Review upgrade confirmation email sent to ${doc.email}`);
            return;
          }

          // 3️⃣ Full service upgrade ($1500 service)
          if (operation === 'create' && doc.paid && doc.fullService) {
            await sendFullServiceConfirmationEmail(doc.email, fullName);
            await updateEmailStatus('sent');
            console.log(`✅ Full service upgrade confirmation email sent to ${doc.email}`);
            return;
          }

          // Legacy: Handle updates to existing records (for backward compatibility)
          if (operation === 'update') {
            // Added record-lookup to existing record
            if (!previousDoc?.lookup && doc.lookup) {
              await sendReviewConfirmationEmail(doc.email, fullName);
              await updateEmailStatus('sent');
              console.log(`✅ Review upgrade email sent to ${doc.email}`);
              return;
            }

            // Upgraded to full service on existing record
            if (!previousDoc?.fullService && doc.fullService) {
              await sendFullServiceConfirmationEmail(doc.email, fullName);
              await updateEmailStatus('sent');
              console.log(`✅ Full service upgrade email sent to ${doc.email}`);
            }
          }
        } catch (error) {
          console.error('Error sending email:', error);
          // Don't throw error to prevent payment processing issues
        }
      },
    ],
  },
};

export default Leads; 