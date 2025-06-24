import { sendEmail } from './email';

// 🎯 ADVANCED EMAIL AUTOMATION SYSTEM
// Behavioral triggers, urgency escalation, social proof

export interface EmailTrigger {
  name: string;
  condition: (leadData: any, behavior?: any) => boolean;
  delay: number; // minutes
  sequence: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// 🔥 BEHAVIORAL TRIGGERS
export const behaviorTriggers: EmailTrigger[] = [
  {
    name: 'cart_abandonment',
    condition: (leadData, behavior) => behavior?.startedCheckout && !behavior?.completed,
    delay: 15, // 15 minutes after abandoning
    sequence: 'cart_recovery',
    priority: 'urgent'
  },
  {
    name: 'high_engagement',
    condition: (leadData, behavior) => behavior?.emailOpens >= 3 && behavior?.clickThroughs >= 2,
    delay: 30, // 30 minutes after high engagement
    sequence: 'hot_prospect',
    priority: 'high'
  },
  {
    name: 'price_shopper',
    condition: (leadData, behavior) => behavior?.pricePageVisits >= 3,
    delay: 60, // 1 hour after multiple price checks
    sequence: 'price_objection',
    priority: 'high'
  },
  {
    name: 'non_responder',
    condition: (leadData, behavior) => behavior?.daysSinceLastEmail >= 3 && behavior?.emailOpens === 0,
    delay: 1440, // 24 hours
    sequence: 'reactivation',
    priority: 'medium'
  }
];

// 🚨 URGENCY ESCALATION SEQUENCES
export const urgencySequences = {
  cart_recovery: [
    {
      delay: 0,
      subject: "⚠️ Your expungement application is waiting...",
      urgency: 'medium',
      template: (name: string, leadData: any) => ({
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
              <h1>⏰ DON'T LOSE YOUR SPOT</h1>
            </div>
            <div style="padding: 30px;">
              <h2>Hi ${name},</h2>
              <p>I noticed you started your expungement application but didn't finish...</p>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>⚠️ What you're about to lose:</h3>
                <ul>
                  <li>✅ Your spot in our priority queue</li>
                  <li>✅ Current low pricing ($50 vs $150+ elsewhere)</li>
                  <li>✅ 30-60 day processing time</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wipethatrecord.com/complete-order?id=${leadData.sessionId}" 
                   style="background: #dc2626; color: white; padding: 18px 40px; text-decoration: none; 
                          border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                  🔒 COMPLETE MY APPLICATION
                </a>
              </div>
              
              <p style="color: #dc2626; text-align: center;">
                ⏰ Your reserved spot expires in 2 hours
              </p>
            </div>
          </div>
        `,
        text: `Complete your expungement application before losing your spot: https://wipethatrecord.com/complete-order?id=${leadData.sessionId}`
      })
    },
    {
      delay: 60, // 1 hour later
      subject: "🚨 FINAL WARNING: Your spot expires in 1 hour",
      urgency: 'urgent',
      template: (name: string, leadData: any) => ({
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
              <h1>🚨 FINAL WARNING</h1>
              <p style="font-size: 20px; margin: 0;">1 HOUR REMAINING</p>
            </div>
            <div style="padding: 30px; text-align: center;">
              <h2>Last chance, ${name}!</h2>
              
              <div style="background: #fef2f2; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <p style="font-size: 18px; color: #dc2626; margin: 0;">
                  <strong>⏰ Your expungement spot expires in exactly 1 hour.</strong>
                </p>
                <p style="margin: 10px 0 0 0;">After that, you'll go to the back of a 6-month waiting list.</p>
              </div>
              
              <a href="https://wipethatrecord.com/complete-order?id=${leadData.sessionId}" 
                 style="background: #dc2626; color: white; padding: 20px 50px; text-decoration: none; 
                        border-radius: 8px; font-size: 20px; font-weight: bold; display: inline-block;">
                🚨 SAVE MY SPOT NOW
              </a>
              
              <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">
                This is the final notice. No extensions possible.
              </p>
            </div>
          </div>
        `,
        text: `FINAL WARNING: Your expungement spot expires in 1 hour. Save it now: https://wipethatrecord.com/complete-order?id=${leadData.sessionId}`
      })
    }
  ],

  hot_prospect: [
    {
      delay: 0,
      subject: "🔥 VIP Fast-Track: Skip the Line (Invitation Only)",
      urgency: 'high',
      template: (name: string, leadData: any) => ({
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #7c3aed; color: white; padding: 30px; text-align: center;">
              <h1>🔥 VIP INVITATION</h1>
              <p style="font-size: 18px; margin: 0;">Exclusive Fast-Track Program</p>
            </div>
            <div style="padding: 30px;">
              <h2>Hi ${name},</h2>
              
              <p>Based on your engagement, I'm personally inviting you to our <strong>VIP Fast-Track Program</strong>.</p>
              
              <div style="background: #f3e8ff; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #7c3aed;">🚀 VIP Benefits (Today Only):</h3>
                <ul>
                  <li>✅ <strong>Skip the 30-day wait</strong> - process in 10-15 days</li>
                  <li>✅ <strong>Dedicated case manager</strong> - personal support</li>
                  <li>✅ <strong>Priority court filing</strong> - jump ahead of 200+ applicants</li>
                  <li>✅ <strong>Same price</strong> - no VIP upcharge</li>
                </ul>
              </div>
              
              <div style="background: #dcfce7; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="color: #166534; font-size: 16px; margin: 0;">
                  <strong>🎯 Only 3 VIP spots remaining today</strong>
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wipethatrecord.com/vip-fasttrack" 
                   style="background: #7c3aed; color: white; padding: 18px 40px; text-decoration: none; 
                          border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                  🔥 CLAIM MY VIP SPOT
                </a>
              </div>
              
              <p style="color: #7c3aed; text-align: center; font-style: italic;">
                "Got my record cleared in 12 days. Incredible!" - Marcus T.
              </p>
            </div>
          </div>
        `,
        text: `VIP Fast-Track Invitation: Skip the line, process in 10-15 days. Claim your spot: https://wipethatrecord.com/vip-fasttrack`
      })
    }
  ],

  price_objection: [
    {
      delay: 0,
      subject: "💰 Can't afford $1500? Here's your $50 solution",
      urgency: 'medium',
      template: (name: string, leadData: any) => ({
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #059669; color: white; padding: 30px; text-align: center;">
              <h1>💰 BUDGET-FRIENDLY SOLUTION</h1>
              <p style="font-size: 18px; margin: 0;">Get the same result for 96% less</p>
            </div>
            <div style="padding: 30px;">
              <h2>Hi ${name},</h2>
              
              <p>I get it. $1500 for full service feels expensive...</p>
              
              <p><strong>But what if I told you that you can get the EXACT same result for just $50?</strong></p>
              
              <div style="background: #ecfdf5; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #059669;">💡 The $50 Secret:</h3>
                <p>Our DIY package gives you everything you need:</p>
                <ul>
                  <li>✅ All required forms (pre-filled)</li>
                  <li>✅ Step-by-step instructions</li>
                  <li>✅ Court filing guide</li>
                  <li>✅ Email support</li>
                  <li>✅ Same legal outcome</li>
                </ul>
                <p style="background: white; padding: 15px; border-radius: 6px; text-align: center; margin-top: 20px;">
                  <strong style="color: #059669; font-size: 18px;">Just $50 vs $1500</strong><br/>
                  <span style="color: #666;">96% savings, same result</span>
                </p>
              </div>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #92400e;">⚠️ Reality Check:</h3>
                <p>That background check failure is costing you way more than $50:</p>
                <ul>
                  <li>❌ Lost job: $50,000/year</li>
                  <li>❌ Rejected apartment: $1,200/month rent</li>
                  <li>❌ Higher insurance: $200/month</li>
                </ul>
                <p style="color: #dc2626; font-weight: bold;">
                  Not fixing this costs you $60,000+ per year!
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wipethatrecord.com/diy-50" 
                   style="background: #059669; color: white; padding: 18px 40px; text-decoration: none; 
                          border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                  💰 GET STARTED FOR $50
                </a>
              </div>
              
              <p style="text-align: center; color: #666; font-size: 14px;">
                30-day money-back guarantee
              </p>
            </div>
          </div>
        `,
        text: `Can't afford $1500? Get the same result for $50 with our DIY package: https://wipethatrecord.com/diy-50`
      })
    }
  ]
};

// 🎯 SOCIAL PROOF GENERATOR
export function generateSocialProof(leadData: any) {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "Los Angeles",
      conviction: "DUI",
      result: "Cleared in 45 days, got promoted at work",
      rating: 5
    },
    {
      name: "Marcus T.", 
      location: "San Francisco",
      conviction: "Misdemeanor",
      result: "Landed dream job after 8 months of rejections",
      rating: 5
    },
    {
      name: "Jennifer K.",
      location: "San Diego", 
      conviction: "Drug Possession",
      result: "Finally got approved for apartment",
      rating: 5
    }
  ];
  
  // Match testimonial to lead's conviction type
  const matchingTestimonial = testimonials.find(t => 
    t.conviction.toLowerCase() === leadData.convictionType?.toLowerCase()
  ) || testimonials[0];
  
  return matchingTestimonial;
}

// 🚀 AUTOMATED SEQUENCE TRIGGER
export async function triggerBehavioralEmail(
  email: string,
  name: string,
  triggerName: string,
  leadData: any,
  behaviorData: any
) {
  console.log(`🎯 Triggering behavioral email: ${triggerName} for ${email}`);
  
  const sequence = urgencySequences[triggerName as keyof typeof urgencySequences];
  if (!sequence) {
    console.log(`❌ No sequence found for trigger: ${triggerName}`);
    return;
  }
  
  // Add social proof to lead data
  leadData.socialProof = generateSocialProof(leadData);
  
  for (const step of sequence) {
    setTimeout(async () => {
      try {
        const { html, text } = step.template(name, leadData);
        await sendEmail({
          to: email,
          subject: step.subject,
          html,
          text
        });
        console.log(`✅ Sent ${triggerName} email to ${email} (urgency: ${step.urgency})`);
      } catch (error) {
        console.error(`❌ Failed to send ${triggerName} email to ${email}:`, error);
      }
    }, step.delay * 60 * 1000); // Convert minutes to milliseconds
  }
}

// 📊 CONVERSION OPTIMIZATION
export function optimizeEmailTiming(leadData: any) {
  const { timeZone, urgency, leadScore } = leadData;
  
  // High-urgency leads get immediate emails
  if (urgency === 'immediate' || leadScore >= 70) {
    return 0; // Send immediately
  }
  
  // Optimize for time zone (send during business hours)
  const now = new Date();
  const hour = now.getHours();
  
  if (hour < 9 || hour > 17) {
    // Schedule for 9 AM next business day
    const nextMorning = new Date(now);
    nextMorning.setDate(now.getDate() + 1);
    nextMorning.setHours(9, 0, 0, 0);
    return nextMorning.getTime() - now.getTime();
  }
  
  return 0; // Send now if during business hours
}

// 🎪 A/B TEST VARIATIONS
export const emailVariations = {
  subject_lines: {
    urgency: [
      "⚠️ Your criminal record is costing you $50K/year",
      "🚨 Last chance: Clear your record in 30 days",
      "⏰ URGENT: Your background check is about to fail again"
    ],
    social_proof: [
      "🏆 How 2,847 Californians cleared their records",
      "✅ Same result that worked for Maria, Marcus, and Sarah",
      "🎯 Join the 94% who got approved this month"
    ],
    value: [
      "💰 $50 solution vs $60,000 problem",
      "🎁 Get $1500 results for just $50",
      "💡 The $50 secret lawyers don't want you to know"
    ]
  },
  
  call_to_action: {
    urgency: ["🚨 SECURE MY SPOT NOW", "⏰ CLAIM BEFORE MIDNIGHT", "🔒 RESERVE MY PLACE"],
    value: ["💰 START FOR $50", "🚀 GET STARTED NOW", "✅ CLEAR MY RECORD"],
    social: ["👥 JOIN 2,847+ SUCCESS STORIES", "🏆 GET THE SAME RESULTS", "✅ FOLLOW THE PROVEN PATH"]
  }
}; 