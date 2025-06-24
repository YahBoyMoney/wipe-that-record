import { sendEmail } from './email';

// 🔥 AGGRESSIVE PROMO CODE EMAIL SEQUENCES
// Hard-selling tactics with real working discounts

export interface PromoEmailStep {
  delay: number; // minutes
  subject: string;
  promoCode: string;
  discount: number;
  urgency: 'low' | 'medium' | 'high' | 'extreme';
  template: (name: string, leadData: any, promoCode: string, discount: number) => { html: string; text: string };
}

// 🚨 FLASH SALE SEQUENCE (24-48 hours)
export const flashSaleSequence: PromoEmailStep[] = [
  {
    delay: 0, // Immediate
    subject: "🚨 FLASH SALE: 50% OFF Your Expungement (Next 24 Hours Only)",
    promoCode: "FLASH50",
    discount: 50,
    urgency: 'extreme',
    template: (name: string, leadData: any, promoCode: string, discount: number) => ({
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🚨 FLASH SALE ALERT</h1>
            <p style="font-size: 20px; margin: 10px 0 0 0;">50% OFF EVERYTHING</p>
            <p style="font-size: 16px; margin: 5px 0 0 0;">⏰ Next 24 Hours Only</p>
          </div>
          
          <div style="padding: 30px; background: #fef2f2;">
            <h2>Hi ${name},</h2>
            
            <p><strong>I'm breaking all the rules for the next 24 hours...</strong></p>
            
            <div style="background: #dc2626; color: white; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h2 style="margin: 0; font-size: 24px;">FLASH50</h2>
              <p style="margin: 10px 0; font-size: 18px;">50% OFF ANY SERVICE</p>
              <p style="margin: 0; font-size: 14px;">Use code at checkout</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">⚡ Flash Sale Pricing:</h3>
              <ul style="font-size: 18px; margin: 0;">
                <li><strong>DIY Package:</strong> <s>$50</s> → <span style="color: #dc2626; font-weight: bold;">$25</span></li>
                <li><strong>Expert Review:</strong> <s>$100</s> → <span style="color: #dc2626; font-weight: bold;">$50</span></li>
                <li><strong>Full Service:</strong> <s>$1500</s> → <span style="color: #dc2626; font-weight: bold;">$750</span></li>
              </ul>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 25px 0;">
              <h3 style="color: #92400e; margin-top: 0;">🔥 Why This Flash Sale?</h3>
              <p>My business partner thinks I'm crazy, but I believe everyone deserves a second chance.</p>
              <p><strong>I'm literally losing money on this deal</strong> - but I'd rather help 100 people clear their records than make maximum profit.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wipethatrecord.com/checkout?promo=FLASH50" 
                 style="background: #dc2626; color: white; padding: 20px 40px; text-decoration: none; 
                        border-radius: 8px; font-size: 20px; font-weight: bold; display: inline-block;
                        box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);">
                🚨 CLAIM 50% OFF NOW
              </a>
              <p style="margin: 15px 0 0 0; color: #dc2626; font-weight: bold;">
                ⏰ Expires in 24 hours - No extensions!
              </p>
            </div>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                🚨 <strong>Only 25 flash sale spots available</strong><br/>
                Once they're gone, this offer disappears forever
              </p>
            </div>
          </div>
        </div>
      `,
      text: `FLASH SALE: 50% OFF everything for 24 hours only! Use code FLASH50. DIY: $25, Review: $50, Full Service: $750. Claim now: https://wipethatrecord.com/checkout?promo=FLASH50`
    })
  },
  {
    delay: 720, // 12 hours later
    subject: "⏰ FINAL 12 HOURS: 50% OFF Flash Sale Ending Soon",
    promoCode: "FLASH50",
    discount: 50,
    urgency: 'extreme',
    template: (name: string, leadData: any, promoCode: string, discount: number) => ({
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">⏰ FINAL 12 HOURS</h1>
            <p style="font-size: 18px; margin: 10px 0 0 0;">Flash Sale Ending Soon</p>
          </div>
          
          <div style="padding: 30px;">
            <h2>Hi ${name},</h2>
            
            <p><strong>This is your final warning...</strong></p>
            
            <p>The 50% OFF Flash Sale ends in exactly 12 hours, and I won't be extending it.</p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h3 style="margin: 0; color: #92400e;">🚨 What happens at midnight:</h3>
              <ul style="text-align: left; color: #92400e; margin: 15px 0;">
                <li>Code FLASH50 stops working forever</li>
                <li>Prices return to normal ($50, $100, $1500)</li>
                <li>You lose $25-$750 in savings</li>
                <li>No future sales this aggressive</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wipethatrecord.com/checkout?promo=FLASH50" 
                 style="background: #f59e0b; color: white; padding: 18px 40px; text-decoration: none; 
                        border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                ⏰ SECURE 50% OFF NOW
              </a>
            </div>
            
            <p style="text-align: center; color: #dc2626; font-weight: bold;">
              Don't let procrastination cost you $750...
            </p>
          </div>
        </div>
      `,
      text: `FINAL 12 HOURS: 50% OFF Flash Sale ending! Don't lose $750 in savings. Use FLASH50: https://wipethatrecord.com/checkout?promo=FLASH50`
    })
  }
];

// 💰 BUDGET-FRIENDLY SEQUENCE
export const budgetFriendlySequence: PromoEmailStep[] = [
  {
    delay: 0,
    subject: "💰 Can't Afford Full Price? Here's 40% OFF",
    promoCode: "SAVE40",
    discount: 40,
    urgency: 'high',
    template: (name: string, leadData: any, promoCode: string, discount: number) => ({
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; color: white; padding: 30px; text-align: center;">
            <h1>💰 BUDGET RELIEF</h1>
            <p style="font-size: 18px; margin: 0;">40% OFF Everything</p>
          </div>
          
          <div style="padding: 30px;">
            <h2>Hi ${name},</h2>
            
            <p>I get it. Money's tight right now...</p>
            
            <p><strong>But your criminal record is costing you WAY more than my services.</strong></p>
            
            <div style="background: #ecfdf5; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #059669;">💡 The Math That Will Shock You:</h3>
              <ul>
                <li><strong>Failed job application:</strong> -$50,000/year salary</li>
                <li><strong>Rejected apartment:</strong> -$1,200/month rent</li>
                <li><strong>Higher insurance:</strong> -$200/month</li>
                <li><strong>Lost opportunities:</strong> Priceless</li>
              </ul>
              <p style="color: #dc2626; font-weight: bold; margin: 20px 0 0 0;">
                Your record costs you $60,000+ per year!
              </p>
            </div>
            
            <div style="background: #059669; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h3 style="margin: 0;">Use Code: SAVE40</h3>
              <p style="margin: 10px 0;">40% OFF Any Service</p>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="margin: 0;"><strong>DIY Package:</strong> $50 → $30</p>
                <p style="margin: 5px 0 0 0;"><strong>Expert Review:</strong> $100 → $60</p>
                <p style="margin: 5px 0 0 0;"><strong>Full Service:</strong> $1500 → $900</p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wipethatrecord.com/checkout?promo=SAVE40" 
                 style="background: #dc2626; color: white; padding: 18px 40px; text-decoration: none; 
                        border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                💰 START FOR JUST $30
              </a>
            </div>
            
            <p style="color: #059669; font-weight: bold; text-align: center;">
              💸 Stop losing $60,000/year. Invest $30 to fix it.
            </p>
          </div>
        </div>
      `,
      text: `Stop losing $60,000/year to your criminal record! 40% OFF all services. DIY now just $30. Use code SAVE40: https://wipethatrecord.com/checkout?promo=SAVE40`
    })
  }
];

// 🏆 SUCCESS-FOCUSED SEQUENCE
export const successSequence: PromoEmailStep[] = [
  {
    delay: 0,
    subject: "🏆 Join 2,847+ Success Stories (25% OFF New Start)",
    promoCode: "NEWSTART25",
    discount: 25,
    urgency: 'medium',
    template: (name: string, leadData: any, promoCode: string, discount: number) => ({
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #7c3aed; color: white; padding: 30px; text-align: center;">
            <h1>🏆 SUCCESS STORIES</h1>
            <p style="font-size: 18px; margin: 0;">Join 2,847+ Cleared Records</p>
          </div>
          
          <div style="padding: 30px;">
            <h2>Hi ${name},</h2>
            
            <p>I want to share something that will give you hope...</p>
            
            <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; border-left: 4px solid #0284c7; margin: 25px 0;">
              <h3 style="color: #0284c7; margin-top: 0;">💼 Marcus T. - San Francisco</h3>
              <p><em>"I had a ${leadData.convictionType || 'misdemeanor'} that killed every job interview. Used the DIY package, got my record cleared in 6 weeks. Now I make $85K at a tech company. Best investment ever!"</em></p>
            </div>
            
            <div style="background: #f0fdf4; padding: 25px; border-radius: 8px; border-left: 4px solid #22c55e; margin: 25px 0;">
              <h3 style="color: #22c55e; margin-top: 0;">🏠 Jennifer K. - Los Angeles</h3>
              <p><em>"Couldn't get approved for any apartment with my record. Full service expungement changed everything. Now I own a house!"</em></p>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h3 style="color: #92400e; margin-top: 0;">🎯 Your New Start Discount</h3>
              <p style="font-size: 20px; margin: 10px 0; color: #dc2626;"><strong>NEWSTART25</strong></p>
              <p style="margin: 0;">25% OFF Your Fresh Beginning</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wipethatrecord.com/checkout?promo=NEWSTART25" 
                 style="background: #7c3aed; color: white; padding: 18px 40px; text-decoration: none; 
                        border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">
                🚀 START MY SUCCESS STORY
              </a>
            </div>
            
            <p style="text-align: center; color: #666; font-style: italic;">
              "The best time to plant a tree was 20 years ago. The second best time is now."
            </p>
          </div>
        </div>
      `,
      text: `Join 2,847+ success stories! Get 25% OFF your fresh start with code NEWSTART25. Start now: https://wipethatrecord.com/checkout?promo=NEWSTART25`
    })
  }
];

// 🚨 URGENCY ESCALATION SEQUENCE
export const urgencySequence: PromoEmailStep[] = [
  {
    delay: 0,
    subject: "🚨 URGENT: 50% OFF Expires Tonight at Midnight",
    promoCode: "URGENT50",
    discount: 50,
    urgency: 'extreme',
    template: (name: string, leadData: any, promoCode: string, discount: number) => ({
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">🚨 URGENT NOTICE</h1>
            <p style="font-size: 20px; margin: 10px 0 0 0;">EXPIRES TONIGHT</p>
          </div>
          
          <div style="padding: 30px; background: #fef2f2;">
            <h2>Hi ${name},</h2>
            
            <p><strong>This is not a drill...</strong></p>
            
            <p>Your 50% OFF discount expires at midnight tonight. After that, it's gone forever.</p>
            
            <div style="background: #dc2626; color: white; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h2 style="margin: 0;">URGENT50</h2>
              <p style="margin: 10px 0; font-size: 18px;">50% OFF EVERYTHING</p>
              <p style="margin: 0; font-size: 14px;">⏰ Expires at midnight PST</p>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #92400e; margin-top: 0;">⚠️ What you lose at midnight:</h3>
              <ul style="color: #92400e;">
                <li>$25 savings on DIY package</li>
                <li>$50 savings on Expert Review</li>
                <li>$750 savings on Full Service</li>
                <li>This exact pricing NEVER returns</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wipethatrecord.com/checkout?promo=URGENT50" 
                 style="background: #dc2626; color: white; padding: 20px 50px; text-decoration: none; 
                        border-radius: 8px; font-size: 20px; font-weight: bold; display: inline-block;
                        animation: pulse 2s infinite;">
                🚨 SAVE $750 BEFORE MIDNIGHT
              </a>
            </div>
            
            <p style="text-align: center; color: #dc2626; font-weight: bold;">
              Don't wake up tomorrow regretting this...
            </p>
          </div>
        </div>
      `,
      text: `URGENT: 50% OFF expires at midnight! Don't lose $750 in savings. Use URGENT50: https://wipethatrecord.com/checkout?promo=URGENT50`
    })
  }
];

// 🎯 TRIGGER PROMO EMAIL SEQUENCES
export async function triggerPromoSequence(
  email: string,
  name: string,
  sequenceType: 'flash-sale' | 'budget-friendly' | 'success-story' | 'urgency',
  leadData: any
) {
  console.log(`🎯 Triggering ${sequenceType} promo sequence for ${email}`);
  
  let sequence: PromoEmailStep[] = [];
  
  switch (sequenceType) {
    case 'flash-sale':
      sequence = flashSaleSequence;
      break;
    case 'budget-friendly':
      sequence = budgetFriendlySequence;
      break;
    case 'success-story':
      sequence = successSequence;
      break;
    case 'urgency':
      sequence = urgencySequence;
      break;
    default:
      sequence = flashSaleSequence;
  }
  
  // Schedule emails with delays
  for (const step of sequence) {
    setTimeout(async () => {
      try {
        const { html, text } = step.template(name, leadData, step.promoCode, step.discount);
        await sendEmail({
          to: email,
          subject: step.subject,
          html,
          text
        });
        console.log(`✅ Sent ${sequenceType} promo email to ${email} (${step.promoCode}: ${step.discount}% OFF)`);
      } catch (error) {
        console.error(`❌ Failed to send ${sequenceType} promo email to ${email}:`, error);
      }
    }, step.delay * 60 * 1000); // Convert minutes to milliseconds
  }
} 