import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '../../../../payload.config';
import mongoose from 'mongoose';

let payload: any = null;

async function initPayload() {
  if (!payload) {
    console.log('🔄 Initializing Payload in lead route...');
    payload = await getPayload({ config });
    console.log('✅ Payload initialized successfully');
    // Fix: payload.collections is not an array, it's an object
    const collectionNames = payload.config.collections?.map((c: any) => c.slug) || [];
    console.log('📋 Registered collections:', collectionNames);
  }
  return payload;
}

// Mongoose fallback schema
const leadSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  convictionType: String,
  created: { type: Date, default: Date.now }
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Lead API called');
    
    const leadData = await req.json();
    console.log('🔍 Received lead data:', JSON.stringify(leadData, null, 2));
    
    // Extract and validate required fields
    const { 
      fullName, 
      email, 
      phone,
      convictionType,
      convictionYear,
      urgency,
      budget,
      previousAttempts,
      interests = [],
      employmentGoals,
      source = 'direct',
      utmCampaign,
      utmSource,
      utmMedium,
      deviceType,
      timeOnSite,
      pagesViewed,
      referrer,
      leadMagnet,
      paid = false,
      amount = 0,
      lookup = false,
      fullService = false
    } = leadData;
    
    // Validate required fields
    if (!fullName || !email) {
      console.log('❌ Missing required fields:', { fullName: !!fullName, email: !!email });
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }
    
    // Split full name into first and last
    const nameParts = fullName.trim().split(' ');
    const first = nameParts[0] || '';
    const last = nameParts.slice(1).join(' ') || '';

    console.log('🔍 Processing lead:', { first, last, email, convictionType });

    // Calculate lead score
    let leadScore = 10; // Base score
    if (phone) leadScore += 15;
    if (convictionType) leadScore += 20;
    if (convictionYear) leadScore += 10;
    if (urgency === 'immediate') leadScore += 20;
    else if (urgency === 'within-month') leadScore += 15;
    else if (urgency === 'within-3months') leadScore += 10;
    
    if (budget === 'over-2000' || budget === 'flexible') leadScore += 15;
    else if (budget === '1000-2000') leadScore += 10;
    else if (budget === '500-1000') leadScore += 5;
    
    if (previousAttempts === 'hired-lawyer') leadScore += 15;
    else if (previousAttempts === 'tried-myself') leadScore += 10;

    // Determine lead segment
    let leadSegment = 'cold';
    if (leadScore >= 60) leadSegment = 'hot';
    else if (leadScore >= 40) leadSegment = 'warm';
    else if (leadScore >= 25) leadSegment = 'lukewarm';
    
    // Determine email sequence
    let emailSequence = 'general-nurture';
    if (convictionType === 'DUI') emailSequence = 'dui-specific';
    else if (convictionType === 'misdemeanor') emailSequence = 'misdemeanor-specific';
    else if (leadMagnet === 'free-consultation') emailSequence = 'consultation-follow-up';
    else if (leadScore >= 50) emailSequence = 'high-intent-acceleration';

    // Prepare lead data for database
    const leadPayload = {
      email,
      first,
      last,
      phone: phone || undefined,
      convictionType: convictionType || undefined,
      convictionYear: convictionYear || undefined,
      urgency: urgency || undefined,
      budget: budget || undefined,
      previousAttempts: previousAttempts || undefined,
      interests: Array.isArray(interests) ? interests.join(', ') : (interests || undefined),
      employmentGoals: employmentGoals || undefined,
      leadScore,
      leadSegment,
      emailSequence,
      leadMagnet: leadMagnet || undefined,
      referrer: referrer || undefined,
      paid: paid || false,
      amount: amount || 0,
      lookup: lookup || false,
      fullService: fullService || false,
      source: source as 'organic' | 'paid' | 'referral' | 'direct' | 'social' | 'email',
      utmCampaign: utmCampaign || undefined,
      utmSource: utmSource || undefined,
      utmMedium: utmMedium || undefined,
      deviceType: (deviceType as 'desktop' | 'mobile' | 'tablet') || 'desktop',
      timeOnSite: timeOnSite ? timeOnSite.toString() : undefined,
      pagesViewed: pagesViewed || undefined,
      conversionStage: 'lead' as const,
      emailStatus: 'not_sent' as const,
      emailsSent: 0,
      totalRevenue: 0,
      lifetimeValue: 0
    };

    console.log('🔍 Lead payload prepared:', JSON.stringify(leadPayload, null, 2));

    try {
      // Initialize Payload and attempt to create lead
      const payloadInstance = await initPayload();
      // Fix: payload.collections is not an array, it's an object
      const collectionNames = payloadInstance.config.collections?.map((c: any) => c.slug) || [];
      console.log('🔍 Registered collections:', collectionNames);
      
      console.log('🔍 Attempting to create lead in Payload...');
      const lead = await payloadInstance.create({
        collection: 'leads',
        data: leadPayload,
      });

      console.log('✅ Lead created successfully in Payload:', lead.id);

      return NextResponse.json({ 
        success: true, 
        leadId: lead.id,
        leadScore,
        leadSegment,
        emailSequence,
        method: 'payload'
      }, { status: 201 });

    } catch (payloadError) {
      console.error('❌ Payload create failed, falling back to Mongoose:', payloadError);
      
      // Fallback to Mongoose
      try {
        console.log('🔄 Connecting to MongoDB via Mongoose...');
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.DATABASE_URI!);
        }
        
        console.log('🔍 Creating lead via Mongoose fallback...');
        const doc = await Lead.create({ 
          fullName, 
          email, 
          phone: phone || undefined,
          convictionType: convictionType || undefined,
          created: new Date() 
        });
        
        console.log('✅ Lead created successfully via Mongoose:', doc._id);
        
        // 🔥 SEND EMAIL DIRECTLY (since Payload hooks won't trigger)
        if (paid) {
          try {
            console.log('📧 Triggering email directly from MongoDB fallback...');
            const { sendDiyConfirmationEmail } = await import('../../../lib/email');
            const fullName = first && last ? `${first} ${last}` : first || '';
            await sendDiyConfirmationEmail(email, fullName);
            console.log('✅ DIY confirmation email sent successfully!');
          } catch (emailError) {
            console.error('❌ Email sending failed:', emailError);
            // Don't fail the lead creation if email fails
          }
        } else {
          // 🚀 TRIGGER AGGRESSIVE EMAIL FUNNEL for non-paid leads
          try {
            console.log('🚀 Triggering aggressive email funnel...');
            const { triggerEmailSequence } = await import('../../../lib/email-sequences');
            const { triggerPromoSequence } = await import('../../../lib/promo-email-sequences');
            const fullName = first && last ? `${first} ${last}` : first || '';
            
            // Trigger appropriate sequence based on lead data
            await triggerEmailSequence(email, fullName, emailSequence, {
              convictionType,
              convictionYear,
              urgency,
              budget,
              leadScore,
              leadSegment,
              source
            }, doc._id.toString());
            
            console.log(`✅ Triggered ${emailSequence} sequence for ${email}`);
            
            // 💰 TRIGGER AGGRESSIVE PROMO SEQUENCES
            if (leadScore >= 70) {
              // High-intent leads get flash sale
              await triggerPromoSequence(email, fullName, 'flash-sale', {
                convictionType,
                urgency,
                budget,
                leadScore,
                leadSegment
              });
              console.log(`🔥 Triggered flash-sale promo sequence for high-intent lead`);
            } else if (budget === 'under-100') {
              // Budget-conscious leads get budget-friendly promos
              await triggerPromoSequence(email, fullName, 'budget-friendly', {
                convictionType,
                urgency,
                budget,
                leadScore,
                leadSegment
              });
              console.log(`💰 Triggered budget-friendly promo sequence`);
            } else if (urgency === 'immediate') {
              // Urgent leads get urgency sequence
              await triggerPromoSequence(email, fullName, 'urgency', {
                convictionType,
                urgency,
                budget,
                leadScore,
                leadSegment
              });
              console.log(`🚨 Triggered urgency promo sequence`);
            } else {
              // Everyone else gets success story sequence
              await triggerPromoSequence(email, fullName, 'success-story', {
                convictionType,
                urgency,
                budget,
                leadScore,
                leadSegment
              });
              console.log(`🏆 Triggered success-story promo sequence`);
            }
            
          } catch (emailError) {
            console.error('❌ Email sequence failed:', emailError);
            // Don't fail the lead creation if email fails
          }
        }
        
        return NextResponse.json({
          success: true,
          leadId: doc._id,
          leadScore,
          leadSegment,
          emailSequence,
          method: 'mongoose_fallback',
          emailSent: paid ? true : false
        }, { status: 201 });
        
      } catch (mongooseError) {
        console.error('❌ Mongoose fallback also failed:', mongooseError);
        throw mongooseError;
      }
    }

  } catch (error) {
    console.error('❌ Error creating lead:', error);
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      return NextResponse.json({ 
        error: 'Failed to create lead',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        errorType: error.name
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create lead',
      details: 'Unknown error occurred'
    }, { status: 500 });
  }
}

// Email automation trigger function
async function triggerEmailAutomation(
  leadId: string, 
  email: string, 
  firstName: string, 
  sequence: string, 
  segment: string, 
  leadData: any
) {
  console.log(`🚀 Triggering email sequence: ${sequence} for segment: ${segment}`);
  
  // In production, integrate with your email service (ConvertKit, Mailchimp, etc.)
  // For now, we'll update the lead record and log the automation
  
  const automationData = {
    emailStatus: 'sent' as const,
    lastEmailSent: new Date().toISOString(),
    emailsSent: 1
  };

  // Update lead with automation info
  await payload.update({
    collection: 'leads',
    id: leadId,
    data: automationData
  });

  // Here you would integrate with your email service
  // Examples:
  
  // ConvertKit integration
  if (process.env.CONVERTKIT_API_KEY) {
    await addToConvertKitSequence(email, firstName, sequence, leadData);
  }
  
  // Mailchimp integration
  if (process.env.MAILCHIMP_API_KEY) {
    await addToMailchimpAudience(email, firstName, segment, leadData);
  }
  
  // ActiveCampaign integration
  if (process.env.ACTIVECAMPAIGN_API_KEY) {
    await addToActiveCampaignAutomation(email, firstName, sequence, leadData);
  }

  console.log(`✅ Email automation triggered for ${email}`);
}

// ConvertKit integration
async function addToConvertKitSequence(email: string, firstName: string, sequence: string, leadData: any) {
  const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
  const FORM_ID = getConvertKitFormId(sequence);
  
  if (!CONVERTKIT_API_KEY || !FORM_ID) return;

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email,
        first_name: firstName,
        fields: {
          conviction_type: leadData.convictionType,
          lead_score: leadData.leadScore,
          lead_segment: leadData.leadSegment,
          source: leadData.source,
          phone: leadData.phone
        }
      })
    });

    if (response.ok) {
      console.log(`✅ Added ${email} to ConvertKit sequence: ${sequence}`);
    } else {
      console.error('ConvertKit API error:', await response.text());
    }
  } catch (error) {
    console.error('ConvertKit integration error:', error);
  }
}

// Get ConvertKit form ID based on sequence
function getConvertKitFormId(sequence: string): string | null {
  const formMap: Record<string, string> = {
    'general-nurture': process.env.CONVERTKIT_GENERAL_FORM_ID || '',
    'dui-specific': process.env.CONVERTKIT_DUI_FORM_ID || '',
    'misdemeanor-specific': process.env.CONVERTKIT_MISDEMEANOR_FORM_ID || '',
    'consultation-follow-up': process.env.CONVERTKIT_CONSULTATION_FORM_ID || '',
    'high-intent-acceleration': process.env.CONVERTKIT_HIGH_INTENT_FORM_ID || ''
  };
  
  return formMap[sequence] || null;
}

// Mailchimp integration
async function addToMailchimpAudience(email: string, firstName: string, segment: string, leadData: any) {
  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const DC = process.env.MAILCHIMP_DC; // Data center (us1, us2, etc.)
  
  if (!MAILCHIMP_API_KEY || !AUDIENCE_ID || !DC) return;

  try {
    const response = await fetch(`https://${DC}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          CONVICTION: leadData.convictionType || '',
          LEADSCORE: leadData.leadScore || 0,
          SEGMENT: segment,
          SOURCE: leadData.source || '',
          PHONE: leadData.phone || ''
        },
        tags: [segment, leadData.convictionType, leadData.source].filter(Boolean)
      })
    });

    if (response.ok) {
      console.log(`✅ Added ${email} to Mailchimp audience with segment: ${segment}`);
    } else {
      console.error('Mailchimp API error:', await response.text());
    }
  } catch (error) {
    console.error('Mailchimp integration error:', error);
  }
}

// ActiveCampaign integration
async function addToActiveCampaignAutomation(email: string, firstName: string, sequence: string, leadData: any) {
  const AC_API_KEY = process.env.ACTIVECAMPAIGN_API_KEY;
  const AC_BASE_URL = process.env.ACTIVECAMPAIGN_BASE_URL;
  
  if (!AC_API_KEY || !AC_BASE_URL) return;

  try {
    // First, create or update contact
    const contactResponse = await fetch(`${AC_BASE_URL}/api/3/contact/sync`, {
      method: 'POST',
      headers: {
        'Api-Token': AC_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact: {
          email,
          firstName,
          phone: leadData.phone || '',
          fieldValues: [
            { field: '1', value: leadData.convictionType || '' }, // Custom field for conviction type
            { field: '2', value: leadData.leadScore?.toString() || '0' }, // Custom field for lead score
            { field: '3', value: leadData.source || '' } // Custom field for source
          ]
        }
      })
    });

    if (contactResponse.ok) {
      const contact = await contactResponse.json();
      
      // Add to automation based on sequence
      const automationId = getActiveCampaignAutomationId(sequence);
      if (automationId) {
        await fetch(`${AC_BASE_URL}/api/3/contactAutomations`, {
          method: 'POST',
          headers: {
            'Api-Token': AC_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contactAutomation: {
              contact: contact.contact.id,
              automation: automationId
            }
          })
        });
      }
      
      console.log(`✅ Added ${email} to ActiveCampaign automation: ${sequence}`);
    } else {
      console.error('ActiveCampaign API error:', await contactResponse.text());
    }
  } catch (error) {
    console.error('ActiveCampaign integration error:', error);
  }
}

// Get ActiveCampaign automation ID based on sequence
function getActiveCampaignAutomationId(sequence: string): string | null {
  const automationMap: Record<string, string> = {
    'general-nurture': process.env.AC_GENERAL_AUTOMATION_ID || '',
    'dui-specific': process.env.AC_DUI_AUTOMATION_ID || '',
    'misdemeanor-specific': process.env.AC_MISDEMEANOR_AUTOMATION_ID || '',
    'consultation-follow-up': process.env.AC_CONSULTATION_AUTOMATION_ID || '',
    'high-intent-acceleration': process.env.AC_HIGH_INTENT_AUTOMATION_ID || ''
  };
  
  return automationMap[sequence] || null;
}

// Get next steps recommendation based on lead data
function getNextStepsForLead(segment: string, convictionType: string, leadScore: number) {
  if (segment === 'hot') {
    return {
      priority: 'high',
      action: 'immediate_follow_up',
      recommendation: 'Call within 5 minutes',
      email_sequence: 'high-intent-acceleration',
      offer: 'Free 15-minute consultation'
    };
  } else if (segment === 'warm') {
    return {
      priority: 'medium',
      action: 'follow_up_today',
      recommendation: 'Send personalized email within 2 hours',
      email_sequence: convictionType ? `${convictionType}-specific` : 'general-nurture',
      offer: 'Free eligibility assessment'
    };
  } else {
    return {
      priority: 'low',
      action: 'nurture_sequence',
      recommendation: 'Add to email nurture sequence',
      email_sequence: 'general-nurture',
      offer: 'Educational content about expungement'
    };
  }
} 