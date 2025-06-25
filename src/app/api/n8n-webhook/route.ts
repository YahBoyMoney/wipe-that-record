import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';
import { sendProfessionalEmail } from '@/lib/email-professional';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { action, ...webhookData } = data;

    console.log(`🔗 n8n webhook received: ${action}`, webhookData);

    switch (action) {
      case 'lead_nurture_sequence':
        return await handleLeadNurture(webhookData);
      
      case 'post_purchase_upsell':
        return await handlePostPurchaseUpsell(webhookData);
      
      case 'abandoned_cart_recovery':
        return await handleAbandonedCart(webhookData);
      
      case 'review_follow_up':
        return await handleReviewFollowUp(webhookData);
      
      case 'referral_trigger':
        return await handleReferralTrigger(webhookData);
      
      default:
        console.log('❓ Unknown n8n action:', action);
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ n8n webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle lead nurturing sequences
async function handleLeadNurture(data: any) {
  const { email, leadScore, convictionType, sequenceDay } = data;
  
  try {
    // Get lead from database
    const leads = await payload.find({
      collection: 'leads',
      where: { email: { equals: email } }
    });

    if (leads.docs.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads.docs[0];
    
    // Send personalized nurture email based on conviction type and day
    const emailTemplate = getNurtureEmail(convictionType, sequenceDay, lead);
    
    await sendProfessionalEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      tags: ['nurture-sequence', `day-${sequenceDay}`, convictionType]
    });

    // Update lead with sequence progress
    await payload.update({
      collection: 'leads',
      id: lead.id,
      data: {
        lastEmailSent: new Date().toISOString(),
        emailStatus: 'sent'
      }
    });

    // Trigger next sequence step in n8n after delay
    await triggerN8nWebhook('lead_sequence_progress', {
      email,
      nextDay: sequenceDay + 1,
      leadScore,
      convictionType
    });

    console.log(`✅ Nurture email sent - Day ${sequenceDay} to ${email}`);
    return NextResponse.json({ success: true, sequenceDay });
    
  } catch (error) {
    console.error('❌ Lead nurture failed:', error);
    return NextResponse.json({ error: 'Nurture sequence failed' }, { status: 500 });
  }
}

// Handle post-purchase upsells
async function handlePostPurchaseUpsell(data: any) {
  const { email, purchaseType, amount, timeDelay } = data;
  
  try {
    const upsellTemplate = getUpsellEmail(purchaseType, amount);
    
    await sendProfessionalEmail({
      to: email,
      subject: upsellTemplate.subject,
      html: upsellTemplate.html,
      tags: ['upsell', purchaseType, 'revenue-optimization']
    });

    console.log(`💰 Upsell email sent to ${email} for ${purchaseType}`);
    return NextResponse.json({ success: true, upsellType: purchaseType });
    
  } catch (error) {
    console.error('❌ Upsell email failed:', error);
    return NextResponse.json({ error: 'Upsell failed' }, { status: 500 });
  }
}

// Handle abandoned cart recovery
async function handleAbandonedCart(data: any) {
  const { email, cartItems, abandonedAt, recoveryStep } = data;
  
  try {
    const recoveryTemplate = getAbandonedCartEmail(cartItems, recoveryStep);
    
    await sendProfessionalEmail({
      to: email,
      subject: recoveryTemplate.subject,
      html: recoveryTemplate.html,
      tags: ['cart-recovery', `step-${recoveryStep}`, 'conversion-optimization']
    });

    console.log(`🛒 Cart recovery email sent - Step ${recoveryStep} to ${email}`);
    return NextResponse.json({ success: true, recoveryStep });
    
  } catch (error) {
    console.error('❌ Cart recovery failed:', error);
    return NextResponse.json({ error: 'Cart recovery failed' }, { status: 500 });
  }
}

// Handle review follow-ups
async function handleReviewFollowUp(data: any) {
  const { email, serviceType, completedAt } = data;
  
  try {
    const reviewTemplate = getReviewRequestEmail(serviceType);
    
    await sendProfessionalEmail({
      to: email,
      subject: reviewTemplate.subject,
      html: reviewTemplate.html,
      tags: ['review-request', serviceType, 'customer-satisfaction']
    });

    console.log(`⭐ Review request sent to ${email} for ${serviceType}`);
    return NextResponse.json({ success: true, serviceType });
    
  } catch (error) {
    console.error('❌ Review request failed:', error);
    return NextResponse.json({ error: 'Review request failed' }, { status: 500 });
  }
}

// Handle referral triggers
async function handleReferralTrigger(data: any) {
  const { email, referralBonus, completionStatus } = data;
  
  try {
    const referralTemplate = getReferralEmail(referralBonus);
    
    await sendProfessionalEmail({
      to: email,
      subject: referralTemplate.subject,
      html: referralTemplate.html,
      tags: ['referral-program', 'customer-acquisition']
    });

    console.log(`🤝 Referral email sent to ${email} with $${referralBonus} bonus`);
    return NextResponse.json({ success: true, referralBonus });
    
  } catch (error) {
    console.error('❌ Referral email failed:', error);
    return NextResponse.json({ error: 'Referral failed' }, { status: 500 });
  }
}

// Trigger n8n webhooks
async function triggerN8nWebhook(action: string, data: any) {
  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nUrl) return;

    await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data })
    });
  } catch (error) {
    console.error('❌ Failed to trigger n8n webhook:', error);
  }
}

// Email template generators
function getNurtureEmail(convictionType: string, day: number, lead: any) {
  const templates = {
    1: {
      subject: "🔍 Your Expungement Journey Starts Here - Free Eligibility Check",
      html: generateNurtureDay1Email(lead.first || 'there', convictionType)
    },
    3: {
      subject: "⚡ 48 Hours Left - Special Discount Inside",
      html: generateNurtureDay3Email(lead.first || 'there', convictionType)
    },
    7: {
      subject: "📞 Personal Success Story + Your Next Steps",
      html: generateNurtureDay7Email(lead.first || 'there', convictionType)
    },
    14: {
      subject: "🎯 Last Chance - Exclusive Offer Expires Tonight",
      html: generateNurtureDay14Email(lead.first || 'there', convictionType)
    }
  };

  return templates[day as keyof typeof templates] || templates[1];
}

function getUpsellEmail(purchaseType: string, amount: number) {
  if (purchaseType === 'diy') {
    return {
      subject: "🚀 Upgrade to Expert Review - Get It Done Right (Limited Time)",
      html: generateDiyUpsellEmail(amount)
    };
  }
  
  if (purchaseType === 'review') {
    return {
      subject: "⚖️ Full Service Available - We Handle Everything",
      html: generateReviewUpsellEmail(amount)
    };
  }

  return {
    subject: "🎉 Thank You - Here's How We Can Help You Further",
    html: generateDiyUpsellEmail(amount)
  };
}

function getAbandonedCartEmail(cartItems: any, step: number) {
  const templates = {
    1: {
      subject: "🤔 Forgot Something? Your Expungement Kit is Waiting",
      html: generateAbandonedCart1Email(cartItems)
    },
    2: {
      subject: "💰 15% OFF Your Expungement Service - Don't Miss Out!",
      html: generateAbandonedCart2Email(cartItems)
    },
    3: {
      subject: "⏰ Final Notice - Your Cart Expires in 24 Hours",
      html: generateAbandonedCart3Email(cartItems)
    }
  };

  return templates[step as keyof typeof templates] || templates[1];
}

function getReviewRequestEmail(serviceType: string) {
  return {
    subject: "⭐ How Was Your Experience with Wipe That Record?",
    html: generateReviewRequestEmail(serviceType)
  };
}

function getReferralEmail(bonus: number) {
  return {
    subject: `💰 Earn $${bonus} for Each Friend You Refer!`,
    html: generateReferralEmail(bonus)
  };
}

// Email template generators (simplified versions - full HTML templates would be longer)
function generateNurtureDay1Email(name: string, convictionType: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Hi ${name}! 👋</h1>
      <p>You took the first step toward clearing your ${convictionType} record - that's HUGE!</p>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🎯 Free Eligibility Check (2 minutes)</h3>
        <p>Let's make sure you qualify before you spend a dime:</p>
        <a href="https://wipethatrecord.com/eligibility" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Check My Eligibility →
        </a>
      </div>
      
      <p><strong>Quick Question:</strong> What's motivating you to clear your record right now?</p>
      <ul>
        <li>Better job opportunities?</li>
        <li>Housing applications?</li>
        <li>Peace of mind?</li>
      </ul>
      
      <p>Whatever your reason, you're making the right choice. Reply and let me know - I read every email! 📧</p>
      
      <p>Rooting for you,<br>Admin Team<br>Wipe That Record</p>
    </div>
  `;
}

function generateNurtureDay3Email(name: string, convictionType: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>⚡ ${name}, This Expires in 48 Hours</h1>
      
      <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🎁 Special Discount: 25% OFF</h3>
        <p>Use code: <strong>FRESH48</strong></p>
        <p>Valid until: <strong>${new Date(Date.now() + 48*60*60*1000).toLocaleDateString()}</strong></p>
      </div>
      
      <p>I noticed you haven't started your expungement process yet. Here's what happens when you wait:</p>
      
      <ul>
        <li>❌ More job applications get rejected</li>
        <li>❌ Housing opportunities slip away</li>
        <li>❌ The stress keeps building</li>
      </ul>
      
      <p><strong>But here's what happens when you take action:</strong></p>
      
      <ul>
        <li>✅ Fresh start within 60-90 days</li>
        <li>✅ No more explaining your past</li>
        <li>✅ Better opportunities open up</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wipethatrecord.com/checkout" style="background: #10b981; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
          Start My Fresh Start (25% OFF) →
        </a>
      </div>
      
      <p>Questions? Just reply - I'm here to help! 💪</p>
    </div>
  `;
}

function generateNurtureDay7Email(name: string, convictionType: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>📞 ${name}, Here's Sarah's Story...</h1>
      
      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
        <p><em>"I was rejected from 12 jobs because of a mistake I made 8 years ago. After working with Wipe That Record, I got my dream job within 3 weeks of clearing my record. Best investment I ever made."</em></p>
        <p><strong>- Sarah M., Software Developer</strong></p>
      </div>
      
      <p>Sarah had a ${convictionType} on her record too. Here's what changed everything:</p>
      
      <ol>
        <li><strong>Week 1:</strong> Started her expungement process</li>
        <li><strong>Week 8:</strong> Record officially cleared</li>
        <li><strong>Week 11:</strong> Landed her dream job at $85K/year</li>
      </ol>
      
      <p><strong>The difference?</strong> She took action instead of waiting.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wipethatrecord.com/success-stories" style="color: #3b82f6; text-decoration: underline;">
          Read More Success Stories →
        </a>
      </div>
      
      <p>Ready to write your own success story?</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wipethatrecord.com/checkout" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">
          Start My Success Story →
        </a>
      </div>
    </div>
  `;
}

function generateNurtureDay14Email(name: string, convictionType: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>🎯 ${name}, This is It</h1>
      
      <div style="background: #fef2f2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>⏰ FINAL NOTICE</h3>
        <p>Your exclusive access expires at midnight tonight.</p>
        <p>After that, you'll pay full price (if spots are available).</p>
      </div>
      
      <p>I've been helping people clear their records for 5+ years, and I've seen this pattern:</p>
      
      <p><strong>People who take action within 2 weeks:</strong> 89% success rate<br>
      <strong>People who wait longer:</strong> Only 23% ever follow through</p>
      
      <p>Don't be a statistic. Your future self will thank you.</p>
      
      <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🎁 Last Chance Bonus:</h3>
        <ul>
          <li>✅ 30% OFF any service</li>
          <li>✅ Priority processing</li>
          <li>✅ Free consultation call</li>
        </ul>
        <p>Code: <strong>LASTCHANCE30</strong></p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wipethatrecord.com/checkout?promo=LASTCHANCE30" style="background: #ef4444; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
          Claim My Fresh Start (30% OFF) →
        </a>
      </div>
      
      <p>This offer expires in <strong>6 hours</strong>. Don't let your past define your future.</p>
      
      <p>Last chance,<br>Wipe That Record Team</p>
    </div>
  `;
}

function generateDiyUpsellEmail(originalAmount: number) {
  const upgradePrice = 297;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>🚀 Upgrade to Expert Review</h1>
      
      <p>Congratulations on starting your expungement journey! 🎉</p>
      
      <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>⚠️ Important: Most DIY Applications Get Rejected</h3>
        <p>Court data shows that <strong>73% of self-filed expungements get rejected</strong> due to paperwork errors.</p>
      </div>
      
      <p><strong>Why risk it?</strong> Upgrade to our Expert Review service and get:</p>
      
      <ul>
        <li>✅ Legal professional reviews your case</li>
        <li>✅ All paperwork double-checked</li>
        <li>✅ 94% success rate (vs 27% DIY)</li>
        <li>✅ Money-back guarantee</li>
      </ul>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3>Special Upgrade Pricing</h3>
        <p style="text-decoration: line-through; color: #6b7280;">Regular: $497</p>
        <p style="font-size: 24px; color: #10b981; font-weight: bold;">Upgrade Price: $${upgradePrice}</p>
        <p>Save $200 as an existing customer!</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wipethatrecord.com/checkout/upgrade?type=review" style="background: #10b981; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
          Upgrade to Expert Review →
        </a>
      </div>
      
      <p><small>Limited time offer for existing customers only.</small></p>
    </div>
  `;
}

function generateReviewUpsellEmail(originalAmount: number) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>⚖️ Full Service Available</h1>
      
      <p>Great choice on the Expert Review! 👏</p>
      
      <p>Since you're already investing in professional help, would you like us to handle <strong>everything</strong>?</p>
      
      <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🎯 Full Service = Zero Work for You</h3>
        <ul>
          <li>✅ We file everything with the court</li>
          <li>✅ We pay all court fees</li>
          <li>✅ We handle court appearances</li>
          <li>✅ You do literally nothing</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wipethatrecord.com/checkout/upgrade?type=full" style="background: #3b82f6; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
          Upgrade to Full Service →
        </a>
      </div>
      
      <p>Sit back, relax, and let us handle everything. ✨</p>
    </div>
  `;
}

function generateAbandonedCart1Email(cartItems: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>🤔 Forgot Something?</h1>
      
      <p>Hi there! 👋</p>
      
      <p>I noticed you were interested in clearing your record but didn't complete your order.</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Your Cart Contains:</h3>
        <p>📦 ${cartItems?.service || 'Expungement Service'}</p>
        <p>💰 Total: $${cartItems?.amount || '97'}</p>
      </div>
      
      <p><strong>Quick question:</strong> What's holding you back?</p>
      
      <ul>
        <li>❓ Have questions about the process?</li>
        <li>💭 Need to think about it?</li>
        <li>💰 Concerned about the investment?</li>
      </ul>
      
      <p>Whatever it is, I'm here to help! Just reply to this email.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wipethatrecord.com/checkout" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">
          Complete My Order →
        </a>
      </div>
      
      <p>Your fresh start is just one click away! 🌟</p>
    </div>
  `;
}

function generateAbandonedCart2Email(cartItems: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>💰 15% OFF Your Order</h1>
      
      <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🎁 Special Discount Just for You</h3>
        <p>Save 15% on your expungement service</p>
        <p>Code: <strong>SAVE15NOW</strong></p>
        <p style="color: #ef4444;"><strong>Expires in 24 hours!</strong></p>
      </div>
      
      <p>I don't want price to be what stops you from getting your fresh start.</p>
      
      <p>That's why I'm offering you 15% OFF your order - but only for the next 24 hours.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wipethatrecord.com/checkout?promo=SAVE15NOW" style="background: #10b981; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
          Claim 15% Discount →
        </a>
      </div>
      
      <p>Your future self will thank you! 🚀</p>
    </div>
  `;
}

function generateAbandonedCart3Email(cartItems: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>⏰ Final Notice</h1>
      
      <div style="background: #fef2f2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🚨 Your Cart Expires in 24 Hours</h3>
        <p>After that, we can't guarantee availability or pricing.</p>
      </div>
      
      <p>This is my final email about your pending order.</p>
      
      <p>I understand that life gets busy, but I also know that <strong>the cost of waiting is always higher than the price of taking action</strong>.</p>
      
      <p>Every day you wait:</p>
      <ul>
        <li>❌ Potential job opportunities pass by</li>
        <li>❌ The stress continues</li>
        <li>❌ Your past keeps limiting your future</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wipethatrecord.com/checkout" style="background: #ef4444; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
          Complete My Order Now →
        </a>
      </div>
      
      <p>Don't let your past define your future.</p>
      
      <p>Final chance,<br>Wipe That Record Team</p>
    </div>
  `;
}

function generateReviewRequestEmail(serviceType: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>⭐ How Was Your Experience?</h1>
      
      <p>Hi there! 👋</p>
      
      <p>I hope you're thrilled with your ${serviceType} service results!</p>
      
      <p>Your success story helps other people make the decision to clear their records too.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://google.com/business/reviews" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 10px;">
          ⭐ Leave Google Review
        </a>
        <br><br>
        <a href="https://yelp.com/reviews" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 10px;">
          📝 Leave Yelp Review
        </a>
      </div>
      
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🤝 Refer Friends & Earn $50</h3>
        <p>Know someone who needs their record cleared?</p>
        <p>You both get $50 when they complete their service!</p>
        <a href="https://wipethatrecord.com/referral" style="color: #10b981;">Get Your Referral Link →</a>
      </div>
      
      <p>Thanks for trusting us with your fresh start! 🌟</p>
    </div>
  `;
}

function generateReferralEmail(bonus: number) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>💰 Earn $${bonus} Per Referral</h1>
      
      <p>You've experienced the life-changing power of clearing your record.</p>
      
      <p>Now you can help friends AND earn money doing it!</p>
      
      <div style="background: #f0f9ff; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>💸 Here's How It Works:</h3>
        <ol>
          <li>Share your unique referral link</li>
          <li>Friend completes their expungement service</li>
          <li>You both get $${bonus} (PayPal or Venmo)</li>
        </ol>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wipethatrecord.com/referral-program" style="background: #10b981; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
          Get My Referral Link →
        </a>
      </div>
      
      <p><strong>Who do you know that could use a fresh start?</strong></p>
      
      <ul>
        <li>Friends looking for better jobs</li>
        <li>Family members applying for housing</li>
        <li>Anyone held back by their past</li>
      </ul>
      
      <p>Turn your success into cash! 💰</p>
    </div>
  `;
}

export async function GET() {
  return NextResponse.json({ 
    message: 'n8n webhook endpoint active',
    availableActions: [
      'lead_nurture_sequence',
      'post_purchase_upsell', 
      'abandoned_cart_recovery',
      'review_follow_up',
      'referral_trigger'
    ]
  });
} 