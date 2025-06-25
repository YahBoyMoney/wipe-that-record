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
  first: String,
  last: String,
  email: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  zipCode: String,
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
      first,
      last,
      email, 
      phone,
      
      // Address information
      street,
      city,
      state,
      zipCode,
      
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
      fullService = false,
      age,
      employmentStatus,
      howDidYouHear,
      additionalInfo
    } = leadData;
    
    // Validate required fields
    if (!first || !email) {
      console.log('❌ Missing required fields:', { first: !!first, email: !!email });
      return NextResponse.json({ error: 'First name and email are required' }, { status: 400 });
    }

    console.log('🔍 Processing lead:', { first, last, email, convictionType });

    // 🎯 ENHANCED LEAD SCORING ALGORITHM
    let leadScore = 0;
    let conversionProbability = 'low';
    let leadQuality = 'cold';
    
    // Urgency scoring (40 points max)
    switch (urgency) {
      case 'immediate': leadScore += 40; break;
      case 'within-month': leadScore += 30; break;
      case 'within-3-months': leadScore += 20; break;
      case 'within-6-months': leadScore += 10; break;
      case 'just-researching': leadScore += 5; break;
    }
    
    // Conviction type scoring (25 points max)
    switch (convictionType) {
      case 'dui': leadScore += 25; break; // High demand
      case 'drug-possession': leadScore += 20; break;
      case 'theft': leadScore += 18; break;
      case 'misdemeanor': leadScore += 15; break;
      case 'felony': leadScore += 22; break;
      case 'domestic-violence': leadScore += 12; break;
      case 'other': leadScore += 10; break;
    }
    
    // Age scoring (15 points max) - recent convictions easier to expunge
    if (age && age !== 'prefer-not-to-say') {
      const ageNum = parseInt(age);
      if (ageNum >= 18 && ageNum <= 30) leadScore += 15;
      else if (ageNum <= 40) leadScore += 12;
      else if (ageNum <= 50) leadScore += 8;
      else leadScore += 5;
    }
    
    // Employment status scoring (10 points max)
    switch (employmentStatus) {
      case 'employed': leadScore += 10; break;
      case 'seeking-employment': leadScore += 8; break;
      case 'self-employed': leadScore += 7; break;
      case 'student': leadScore += 5; break;
      case 'unemployed': leadScore += 3; break;
    }
    
    // Contact preferences scoring (10 points max)
    if (phone) leadScore += 5; // Phone = higher intent
    if (howDidYouHear === 'referral') leadScore += 5; // Referrals convert better
    
    // Calculate conversion probability and quality
    if (leadScore >= 80) {
      conversionProbability = 'very-high';
      leadQuality = 'hot';
    } else if (leadScore >= 65) {
      conversionProbability = 'high';
      leadQuality = 'warm';
    } else if (leadScore >= 50) {
      conversionProbability = 'medium';
      leadQuality = 'warm';
    } else if (leadScore >= 35) {
      conversionProbability = 'low-medium';
      leadQuality = 'cold';
    } else {
      conversionProbability = 'low';
      leadQuality = 'cold';
    }

    // 🎯 LEAD SEGMENTATION FOR TARGETED CAMPAIGNS
    let leadSegment = 'general-nurture';
    
    if (convictionType === 'dui' && urgency === 'immediate') {
      leadSegment = 'dui-urgent';
    } else if (convictionType === 'dui') {
      leadSegment = 'dui-specific';
    } else if (urgency === 'immediate') {
      leadSegment = 'urgent-general';
    } else if (leadScore >= 75) {
      leadSegment = 'high-intent-acceleration';
    } else if (employmentStatus === 'seeking-employment') {
      leadSegment = 'job-seeker-focused';
    } else if (convictionType === 'misdemeanor') {
      leadSegment = 'misdemeanor-specific';
    }

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
      
      // Address information
      street: street || undefined,
      city: city || undefined,
      state: state || undefined,
      zipCode: zipCode || undefined,
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
      totalRevenue: 0,
      lifetimeValue: 0,
      conversionProbability,
      leadQuality,
      conversionStage: 'lead_captured',
      emailStatus: 'pending',
      emailsSent: 0,
      lastEmailSent: null,
      emailSequenceDay: 0,
      estimatedLifetimeValue: calculateEstimatedLTV(leadScore, convictionType, urgency),
      priority: leadScore >= 75 ? 'high' : leadScore >= 50 ? 'medium' : 'low',
      followUpDate: new Date(Date.now() + 24*60*60*1000).toISOString(), // Next day
      automationActive: true,
      nurtureSequenceActive: false,
      hasBeenUpsold: false,
      stripeSessionId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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

      // 🚀 TRIGGER N8N AUTOMATION WORKFLOWS
      try {
        // 1. Immediate lead nurture sequence
        await triggerN8nWebhook('lead_nurture_sequence', {
          email,
          leadScore,
          convictionType,
          urgency,
          leadSegment,
          sequenceDay: 1,
          name: first,
          priority: leadPayload.priority
        });
        
        // 2. High-priority lead notifications
        if (leadScore >= 85) {
          await triggerN8nWebhook('high_priority_lead_alert', {
            email,
            name: `${first} ${last}`,
            leadScore,
            convictionType,
            urgency,
            phone: phone || '',
            estimatedLTV: leadPayload.estimatedLifetimeValue
          });
        }
        
        // 3. Segment-specific workflows
        if (leadSegment === 'dui-urgent') {
          await triggerN8nWebhook('dui_urgent_sequence', {
            email,
            name: first,
            phone: phone || '',
            leadScore
          });
        }
        
        console.log(`🔗 n8n automations triggered for ${email} (Score: ${leadScore})`);
        
      } catch (webhookError) {
        console.error('❌ n8n webhook failed:', webhookError);
        // Don't fail the lead creation if webhook fails
      }

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
          first,
          last,
          email, 
          phone: phone || undefined,
          street: street || undefined,
          city: city || undefined,
          state: state || undefined,
          zipCode: zipCode || undefined,
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

// Helper function to calculate estimated lifetime value
function calculateEstimatedLTV(leadScore: number, convictionType: string, urgency: string): number {
  let baseLTV = 150; // Base LTV for all leads
  
  // Score multiplier
  baseLTV *= (leadScore / 50);
  
  // Conviction type multiplier
  if (convictionType === 'dui') baseLTV *= 1.8;
  else if (convictionType === 'felony') baseLTV *= 2.2;
  else if (convictionType === 'misdemeanor') baseLTV *= 1.4;
  
  // Urgency multiplier
  if (urgency === 'immediate') baseLTV *= 2.5;
  else if (urgency === 'within-month') baseLTV *= 1.8;
  else if (urgency === 'within-3-months') baseLTV *= 1.3;
  
  return Math.round(baseLTV);
}

// Helper function to trigger n8n webhooks
async function triggerN8nWebhook(action: string, data: any) {
  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nUrl) {
      console.log('⚠️ N8N_WEBHOOK_URL not configured');
      return;
    }

    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'WipeThatRecord-Railway'
      },
      body: JSON.stringify({ 
        action, 
        timestamp: new Date().toISOString(),
        source: 'railway-api',
        ...data 
      })
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status}`);
    }

    console.log(`✅ n8n webhook triggered: ${action}`);
    
  } catch (error) {
    console.error(`❌ n8n webhook error for ${action}:`, error);
    throw error;
  }
} 