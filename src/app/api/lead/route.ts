import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

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
      leadMagnet
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

    // Calculate lead score based on provided data
    let leadScore = 0;
    
    // Base score for providing email
    leadScore += 10;
    
    // Phone number provided (higher intent)
    if (phone) leadScore += 15;
    
    // Conviction details provided (serious buyer)
    if (convictionType) leadScore += 20;
    if (convictionYear) leadScore += 10;
    
    // Urgency scoring
    if (urgency === 'immediate') leadScore += 20;
    else if (urgency === 'within-month') leadScore += 15;
    else if (urgency === 'within-3months') leadScore += 10;
    
    // Budget scoring
    if (budget === 'over-2000' || budget === 'flexible') leadScore += 15;
    else if (budget === '1000-2000') leadScore += 10;
    else if (budget === '500-1000') leadScore += 5;
    
    // Previous attempts scoring (shows commitment)
    if (previousAttempts === 'hired-lawyer') leadScore += 15;
    else if (previousAttempts === 'tried-myself') leadScore += 10;
    
    // Engagement scoring
    if (timeOnSite) {
      const timeMinutes = parseInt(timeOnSite) / 60000; // Convert ms to minutes
      if (timeMinutes > 5) leadScore += 15;
      else if (timeMinutes > 2) leadScore += 10;
      else if (timeMinutes > 1) leadScore += 5;
    }
    
    if (pagesViewed) {
      if (pagesViewed >= 5) leadScore += 15;
      else if (pagesViewed >= 3) leadScore += 10;
      else if (pagesViewed >= 2) leadScore += 5;
    }
    
    // Traffic source scoring (paid traffic = higher intent)
    if (source === 'paid') leadScore += 10;
    else if (source === 'organic') leadScore += 5;
    
    // Lead magnet specific scoring
    if (leadMagnet === 'free-consultation') leadScore += 25;
    else if (leadMagnet === 'eligibility-check') leadScore += 20;
    else if (leadMagnet === 'cost-calculator') leadScore += 15;
    
    // Determine lead segment for email automation
    let leadSegment = 'cold';
    if (leadScore >= 60) leadSegment = 'hot';
    else if (leadScore >= 40) leadSegment = 'warm';
    else if (leadScore >= 25) leadSegment = 'lukewarm';
    
    // Determine email sequence based on lead data
    let emailSequence = 'general-nurture';
    if (convictionType === 'DUI') emailSequence = 'dui-specific';
    else if (convictionType === 'misdemeanor') emailSequence = 'misdemeanor-specific';
    else if (leadMagnet === 'free-consultation') emailSequence = 'consultation-follow-up';
    else if (leadScore >= 50) emailSequence = 'high-intent-acceleration';

    // Prepare lead data for database - only include fields that exist in schema
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
      paid: false,
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
    console.log('🔍 Creating lead with score:', leadScore, 'segment:', leadSegment);

    // Check if payload is initialized
    if (!payload) {
      console.error('❌ Payload not initialized');
      return NextResponse.json({ error: 'System not ready' }, { status: 500 });
    }

    // Create lead in Payload
    console.log('🔍 Attempting to create lead in database...');
    const lead = await payload.create({
      collection: 'leads',
      data: leadPayload,
    });

    console.log('✅ Lead created successfully:', lead.id);

    // Trigger email automation based on segment and sequence
    try {
      console.log('🔍 Triggering email automation...');
      await triggerEmailAutomation(lead.id, email, first, emailSequence, leadSegment, leadData);
    } catch (emailError) {
      console.error('⚠️ Email automation failed (non-blocking):', emailError);
      // Don't fail the lead creation if email fails
    }

    // Return success with lead scoring info
    return NextResponse.json({ 
      success: true, 
      leadId: lead.id,
      leadScore,
      leadSegment,
      emailSequence,
      nextSteps: getNextStepsForLead(leadSegment, convictionType, leadScore)
    });

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