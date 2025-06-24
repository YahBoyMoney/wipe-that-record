import { sendEmail } from './email';

// Aggressive Email Funnel Sequences
// Designed to convert leads over days/weeks with escalating urgency

export interface EmailSequenceStep {
  day: number;
  subject: string;
  template: (name: string, leadData: any) => { html: string; text: string };
  trigger?: string;
  nextAction?: string;
}

// 🔥 HIGH-INTENT ACCELERATION SEQUENCE (Hot Leads)
export const highIntentSequence: EmailSequenceStep[] = [
  {
    day: 0, // Immediate
    subject: "⚡ Your Record Could Be Clear in 60 Days - Act Now",
    template: (name: string, leadData: any) => ({
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1>🚨 HIGH PRIORITY ALERT</h1>
            <p style="font-size: 18px; margin: 0;">Your ${leadData.convictionType || 'conviction'} case is PERFECT for expungement</p>
          </div>
          
          <div style="padding: 30px; background: #fef2f2; border-left: 4px solid #dc2626;">
            <h2>Hi ${name},</h2>
            <p><strong>I just reviewed your case details and I have URGENT news...</strong></p>
            
            <p>Based on your ${leadData.convictionType || 'conviction'} from ${leadData.convictionYear || 'years ago'}, you're in the <span style="background: yellow; padding: 2px 8px;"><strong>TOP 5%</strong></span> of cases that get approved FAST.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #dc2626;">⏰ TIME-SENSITIVE OPPORTUNITY</h3>
              <ul>
                <li><strong>🎯 Approval Rate:</strong> 94% for cases like yours</li>
                <li><strong>⚡ Processing Time:</strong> 30-60 days (vs 6+ months DIY)</li>
                <li><strong>💰 Investment:</strong> Starting at just $50</li>
                <li><strong>🛡️ Guarantee:</strong> 100% money-back if not approved</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wipethatrecord.com/diy-start" 
                 style="background: #dc2626; color: white; padding: 18px 40px; text-decoration: none; 
                        border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                🚀 START MY EXPUNGEMENT NOW ($50)
              </a>
              <p style="margin-top: 10px; font-size: 14px; color: #666;">
                ⏰ <strong>Limited spots available today</strong>
              </p>
            </div>
            
            <p style="color: #dc2626; font-weight: bold;">
              WARNING: California processes applications on a first-come, first-served basis. 
              Waiting could mean months of delay.
            </p>
          </div>
        </div>
      `,
      text: `URGENT: Your ${leadData.convictionType} case is perfect for expungement. 94% approval rate, 30-60 day processing. Start now for $50: https://wipethatrecord.com/diy-start`
    })
  },
  {
    day: 1,
    subject: "❌ Your spot expires in 24 hours - ${name}",
    template: (name: string, leadData: any) => ({
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
            <h1>⏰ FINAL NOTICE</h1>
            <p style="font-size: 20px; margin: 0;">24 HOURS REMAINING</p>
          </div>
          
          <div style="padding: 30px;">
            <h2>Hi ${name},</h2>
            
            <p>I'm personally reaching out because I noticed you haven't secured your expungement spot yet.</p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h3>What happens if you wait:</h3>
              <ul>
                <li>❌ Your case gets pushed to the back of the line</li>
                <li>❌ Processing time increases from 60 days to 6+ months</li>
                <li>❌ You continue failing background checks</li>
                <li>❌ Lost job opportunities pile up</li>
              </ul>
            </div>
            
            <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #166534;">🎯 Secure your spot TODAY:</h3>
              <p style="font-size: 18px; margin: 0;"><strong>DIY Package: $50</strong> (saves $1,450 vs full service)</p>
              <p style="margin: 5px 0 0 0; color: #166534;">✅ Complete in 30-60 days</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wipethatrecord.com/diy-start" 
                 style="background: #dc2626; color: white; padding: 18px 40px; text-decoration: none; 
                        border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                🔒 SECURE MY SPOT NOW
              </a>
            </div>
            
            <p style="text-align: center; color: #666; font-style: italic;">
              This offer expires at midnight PST. No extensions.
            </p>
          </div>
        </div>
      `,
      text: `Final notice: Your expungement spot expires in 24 hours. Secure it now for $50: https://wipethatrecord.com/diy-start`
    })
  },
  {
    day: 3,
    subject: "🏆 Success Story: How Maria Got Her Dream Job After Expungement",
    template: (name: string, leadData: any) => ({
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #10b981; color: white; padding: 30px; text-align: center;">
            <h1>🏆 SUCCESS STORY</h1>
            <p style="font-size: 18px; margin: 0;">From Background Check Failure to Dream Job</p>
          </div>
          
          <div style="padding: 30px;">
            <h2>Hi ${name},</h2>
            
            <p>I want to share Maria's story because it mirrors exactly what you're going through...</p>
            
            <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; border-left: 4px solid #0284c7;">
              <h3 style="color: #0284c7;">Maria's Story:</h3>
              <p><em>"I had a ${leadData.convictionType || 'misdemeanor'} from 2018 that kept ruining my life. Every job application ended the same way - background check failure."</em></p>
              
              <p><em>"I found Wipe That Record and started with the $50 DIY package. Within 45 days, my record was CLEAN."</em></p>
              
              <p><em>"Two weeks later, I got my dream job at a tech company making $75,000/year. Best $50 I ever spent!"</em></p>
              
              <p style="text-align: right; font-weight: bold;">- Maria R., Sacramento</p>
            </div>
            
            <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #166534;">Your Path to Success:</h3>
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="flex: 1; margin: 10px; text-align: center;">
                  <div style="background: #166534; color: white; border-radius: 50%; width: 40px; height: 40px; 
                              display: inline-flex; align-items: center; justify-content: center; font-weight: bold;">1</div>
                  <p style="margin: 10px 0 0 0; font-size: 14px;">Start DIY<br/>($50)</p>
                </div>
                <div style="flex: 1; margin: 10px; text-align: center;">
                  <div style="background: #166534; color: white; border-radius: 50%; width: 40px; height: 40px; 
                              display: inline-flex; align-items: center; justify-content: center; font-weight: bold;">2</div>
                  <p style="margin: 10px 0 0 0; font-size: 14px;">File Forms<br/>(We Guide You)</p>
                </div>
                <div style="flex: 1; margin: 10px; text-align: center;">
                  <div style="background: #166534; color: white; border-radius: 50%; width: 40px; height: 40px; 
                              display: inline-flex; align-items: center; justify-content: center; font-weight: bold;">3</div>
                  <p style="margin: 10px 0 0 0; font-size: 14px;">Get Approved<br/>(30-60 days)</p>
                </div>
                <div style="flex: 1; margin: 10px; text-align: center;">
                  <div style="background: #166534; color: white; border-radius: 50%; width: 40px; height: 40px; 
                              display: inline-flex; align-items: center; justify-content: center; font-weight: bold;">4</div>
                  <p style="margin: 10px 0 0 0; font-size: 14px;">Land Dream Job<br/>(Priceless)</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wipethatrecord.com/diy-start" 
                 style="background: #10b981; color: white; padding: 18px 40px; text-decoration: none; 
                        border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                🚀 START MY SUCCESS STORY
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              Join 2,847+ Californians who've cleared their records with us
            </p>
          </div>
        </div>
      `,
      text: `Success Story: Maria cleared her record in 45 days and landed a $75K job. Your turn: https://wipethatrecord.com/diy-start`
    })
  }
];

// 🎯 DUI-SPECIFIC SEQUENCE
export const duiSpecificSequence: EmailSequenceStep[] = [
  {
    day: 0,
    subject: "✅ Good News: Your DUI CAN Be Expunged in California",
    template: (name: string, leadData: any) => ({
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; color: white; padding: 30px; text-align: center;">
            <h1>✅ DUI EXPUNGEMENT CONFIRMED</h1>
            <p style="font-size: 18px; margin: 0;">Your case qualifies for complete removal</p>
          </div>
          
          <div style="padding: 30px;">
            <h2>Hi ${name},</h2>
            
            <p>I have excellent news about your DUI case...</p>
            
            <div style="background: #ecfdf5; padding: 25px; border-radius: 8px; border-left: 4px solid #059669;">
              <h3 style="color: #059669;">✅ DUI Expungement Facts:</h3>
              <ul>
                <li><strong>89% of DUI cases get approved</strong> for expungement</li>
                <li><strong>No jail time required</strong> - probation completion is enough</li>
                <li><strong>Works for first-time AND repeat offenses</strong></li>
                <li><strong>Completely removes DUI from background checks</strong></li>
              </ul>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #92400e;">🚗 Why DUI Expungement Changes Everything:</h3>
              <ul>
                <li>✅ Pass employment background checks</li>
                <li>✅ Qualify for professional licenses</li>
                <li>✅ Get approved for apartments/housing</li>
                <li>✅ Lower car insurance rates</li>
                <li>✅ Restore your reputation</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wipethatrecord.com/dui-expungement" 
                 style="background: #dc2626; color: white; padding: 18px 40px; text-decoration: none; 
                        border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                🚗 START MY DUI EXPUNGEMENT
              </a>
              <p style="margin: 10px 0 0 0; color: #666;">Starting at just $50</p>
            </div>
            
            <p style="color: #059669; font-weight: bold;">
              📞 Questions? Reply to this email - I personally read every response.
            </p>
          </div>
        </div>
      `,
      text: `Good news: Your DUI qualifies for expungement! 89% approval rate. Start now: https://wipethatrecord.com/dui-expungement`
    })
  }
];

// 💰 UPGRADE SEQUENCES (DIY → Review → Full Service)
export const upgradeSequences = {
  diyToReview: [
    {
      day: 3,
      subject: "⚠️ Don't Make This $1,400 Mistake",
      template: (name: string, leadData: any) => ({
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
              <h1>⚠️ CRITICAL WARNING</h1>
              <p style="font-size: 18px; margin: 0;">One mistake could cost you $1,400</p>
            </div>
            
            <div style="padding: 30px;">
              <h2>Hi ${name},</h2>
              
              <p>I need to warn you about something that could derail your entire expungement...</p>
              
              <div style="background: #fef2f2; padding: 25px; border-radius: 8px; border-left: 4px solid #dc2626;">
                <h3 style="color: #dc2626;">❌ The $1,400 Mistake:</h3>
                <p><strong>Filing your paperwork incorrectly the first time.</strong></p>
                
                <p>When courts reject your application, you have to:</p>
                <ul>
                  <li>❌ Pay court fees again ($150-$300)</li>
                  <li>❌ Wait 6+ months for a new court date</li>
                  <li>❌ Hire an attorney ($1,200-$2,000)</li>
                  <li>❌ Start the entire process over</li>
                </ul>
              </div>
              
              <div style="background: #dcfce7; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #166534;">✅ The Smart Solution: Expert Review ($100)</h3>
                <ul>
                  <li>✅ Professional attorney reviews your case</li>
                  <li>✅ We complete ALL paperwork for you</li>
                  <li>✅ 98% approval rate (vs 73% DIY)</li>
                  <li>✅ Money-back guarantee</li>
                </ul>
                
                <p style="margin: 20px 0 0 0; padding: 15px; background: white; border-radius: 6px; text-align: center;">
                  <strong style="color: #166534;">Upgrade to Expert Review: Just $100</strong><br/>
                  <span style="color: #666; font-size: 14px;">(Save $1,300+ vs hiring attorney later)</span>
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wipethatrecord.com/upgrade-review" 
                   style="background: #f59e0b; color: white; padding: 18px 40px; text-decoration: none; 
                          border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                  🛡️ PROTECT MY CASE - UPGRADE NOW
                </a>
              </div>
            </div>
          </div>
        `,
        text: `Warning: DIY filing mistakes cost $1,400+. Upgrade to expert review for $100: https://wipethatrecord.com/upgrade-review`
      })
    }
  ],

  reviewToFull: [
    {
      day: 7,
      subject: "🎯 VIP Treatment: Let Us Handle EVERYTHING",
      template: (name: string, leadData: any) => ({
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #7c3aed; color: white; padding: 30px; text-align: center;">
              <h1>👑 VIP FULL SERVICE</h1>
              <p style="font-size: 18px; margin: 0;">White-glove expungement service</p>
            </div>
            
            <div style="padding: 30px;">
              <h2>Hi ${name},</h2>
              
              <p>Since you're serious about clearing your record, I want to offer you our VIP treatment...</p>
              
              <div style="background: #f3e8ff; padding: 25px; border-radius: 8px; border-left: 4px solid #7c3aed;">
                <h3 style="color: #7c3aed;">👑 Full Service Includes:</h3>
                <ul>
                  <li>✅ <strong>Dedicated attorney</strong> handles your entire case</li>
                  <li>✅ <strong>Court appearances</strong> - you never go to court</li>
                  <li>✅ <strong>All fees included</strong> - no hidden costs</li>
                  <li>✅ <strong>Priority processing</strong> - jump the line</li>
                  <li>✅ <strong>100% money-back guarantee</strong></li>
                  <li>✅ <strong>Concierge support</strong> - direct attorney access</li>
                </ul>
              </div>
              
              <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <h3 style="color: #166534; margin-top: 0;">💎 Limited Time VIP Pricing</h3>
                <p style="font-size: 24px; margin: 10px 0; color: #dc2626;"><s>$2,500</s></p>
                <p style="font-size: 32px; margin: 10px 0; color: #166534; font-weight: bold;">$1,500</p>
                <p style="margin: 0; color: #666;">Complete white-glove service</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wipethatrecord.com/full-service" 
                   style="background: #7c3aed; color: white; padding: 18px 40px; text-decoration: none; 
                          border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                  👑 UPGRADE TO VIP SERVICE
                </a>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                  Only 5 VIP spots available this month
                </p>
              </div>
              
              <p style="color: #7c3aed; font-weight: bold; text-align: center;">
                "Best decision I ever made. Completely stress-free." - Jennifer K.
              </p>
            </div>
          </div>
        `,
        text: `VIP Full Service: Let us handle everything for $1,500. Dedicated attorney, court appearances included: https://wipethatrecord.com/full-service`
      })
    }
  ]
};

// 🚀 AUTOMATION FUNCTIONS
export async function triggerEmailSequence(
  email: string,
  name: string,
  sequenceType: string,
  leadData: any,
  leadId: string
) {
  console.log(`🚀 Starting ${sequenceType} sequence for ${email}`);
  
  let sequence: EmailSequenceStep[] = [];
  
  switch (sequenceType) {
    case 'high-intent-acceleration':
      sequence = highIntentSequence;
      break;
    case 'dui-specific':
      sequence = duiSpecificSequence;
      break;
    case 'general-nurture':
      sequence = getGeneralNurtureSequence(leadData);
      break;
    default:
      sequence = getGeneralNurtureSequence(leadData);
  }
  
  // Schedule emails (in production, use a job queue like Bull or Agenda)
  for (const step of sequence) {
    setTimeout(async () => {
      try {
        const { html, text } = step.template(name, leadData);
        await sendEmail({
          to: email,
          subject: step.subject.replace('${name}', name),
          html,
          text
        });
        console.log(`✅ Sent day ${step.day} email to ${email}`);
      } catch (error) {
        console.error(`❌ Failed to send day ${step.day} email to ${email}:`, error);
      }
    }, step.day * 24 * 60 * 60 * 1000); // Convert days to milliseconds
  }
}

function getGeneralNurtureSequence(leadData: any): EmailSequenceStep[] {
  // Return appropriate sequence based on lead data
  if (leadData.leadScore >= 60) {
    return highIntentSequence;
  } else if (leadData.convictionType === 'DUI') {
    return duiSpecificSequence;
  } else {
    return defaultNurtureSequence;
  }
}

const defaultNurtureSequence: EmailSequenceStep[] = [
  {
    day: 0,
    subject: "🎯 Your Criminal Record Doesn't Have to Define You",
    template: (name: string, leadData: any) => ({
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1f2937; color: white; padding: 30px; text-align: center;">
            <h1>🎯 SECOND CHANCES</h1>
            <p style="font-size: 18px; margin: 0;">Everyone deserves a fresh start</p>
          </div>
          
          <div style="padding: 30px;">
            <h2>Hi ${name},</h2>
            
            <p>Your past doesn't have to control your future.</p>
            
            <p>Right now, your ${leadData.convictionType || 'criminal record'} is probably:</p>
            <ul>
              <li>❌ Blocking job opportunities</li>
              <li>❌ Preventing housing approvals</li>
              <li>❌ Limiting your potential</li>
              <li>❌ Causing embarrassment and stress</li>
            </ul>
            
            <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #0284c7;">✅ What Expungement Does:</h3>
              <ul>
                <li>Legally dismisses your case</li>
                <li>Removes conviction from most background checks</li>
                <li>Restores many civil rights</li>
                <li>Gives you a genuine fresh start</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wipethatrecord.com/get-started" 
                 style="background: #0284c7; color: white; padding: 18px 40px; text-decoration: none; 
                        border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                🚀 START MY FRESH START
              </a>
            </div>
            
            <p style="text-align: center; color: #666; font-style: italic;">
              "The best time to plant a tree was 20 years ago. The second best time is now."
            </p>
          </div>
        </div>
      `,
      text: `Your criminal record doesn't have to define you. Start your fresh start today: https://wipethatrecord.com/get-started`
    })
  }
]; 