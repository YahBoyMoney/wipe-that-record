// Professional Email Service with Zoho Mail as primary service
let resend: any = null;

// Initialize Resend as fallback if available
if (process.env.RESEND_API_KEY) {
  try {
    import('resend').then((ResendModule) => {
      resend = new ResendModule.Resend(process.env.RESEND_API_KEY);
    }).catch(() => {
      console.log('⚠️ Resend not available, using Zoho Mail only');
    });
  } catch {
    console.log('⚠️ Resend not available, using Zoho Mail only');
  }
}

// 🚀 PROFESSIONAL EMAIL SERVICE WITH ZOHO MAIL PRIMARY
// Using Zoho Mail as primary, Resend as fallback

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: string[];
}

// Professional email sender using Zoho Mail as primary
export async function sendProfessionalEmail(opts: EmailOptions) {
  try {
    // First try Zoho Mail (primary)
    if (process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD) {
      console.log('📧 Using Zoho Mail as primary email service');
      return await sendZohoEmail(opts);
    }
    
    // Fallback to Resend if Zoho not configured
    if (process.env.RESEND_API_KEY && resend) {
      console.log('⚠️ Zoho not configured, falling back to Resend');
      const result = await resend.emails.send({
        from: opts.from || 'Wipe That Record <noreply@wipethatrecord.com>',
        to: [opts.to],
        subject: opts.subject,
        html: addUnsubscribeFooter(opts.html, opts.to),
        text: opts.text,
        replyTo: opts.replyTo || 'admin@wipethatrecord.com',
        tags: opts.tags || ['transactional']
      });

      console.log(`✅ Professional email sent via Resend to ${opts.to}`);
      return result;
    }
    
    // Last resort - use basic Zoho without environment variables
    console.log('⚠️ No email service properly configured, using fallback');
    return await sendBackupEmail(opts);
    
  } catch (error) {
    console.error(`❌ Professional email failed to ${opts.to}:`, error);
    // Try fallback services
    try {
      if (process.env.RESEND_API_KEY && resend) {
        console.log('🔄 Retrying with Resend fallback');
        const result = await resend.emails.send({
          from: opts.from || 'Wipe That Record <noreply@wipethatrecord.com>',
          to: [opts.to],
          subject: opts.subject,
          html: addUnsubscribeFooter(opts.html, opts.to),
          text: opts.text,
          replyTo: opts.replyTo || 'admin@wipethatrecord.com'
        });
        return result;
      }
    } catch (fallbackError) {
      console.error('❌ Fallback email also failed:', fallbackError);
    }
    
    return await sendBackupEmail(opts);
  }
}

// Primary Zoho email function
async function sendZohoEmail(opts: EmailOptions) {
  const { sendEmail } = await import('./email');
  const result = await sendEmail({
    to: opts.to,
    subject: opts.subject,
    html: addUnsubscribeFooter(opts.html, opts.to),
    text: opts.text
  });
  
  console.log(`✅ Professional email sent via Zoho to ${opts.to}`);
  return result;
}

function addUnsubscribeFooter(html: string, email: string): string {
  const unsubscribeUrl = `https://wipethatrecord.com/unsubscribe?email=${encodeURIComponent(email)}`;
  
  const footer = `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
      <p style="margin: 0 0 10px 0;">
        <strong>Wipe That Record</strong> - California Licensed Attorney Services
      </p>
      <p style="margin: 0 0 10px 0;">
        <a href="${unsubscribeUrl}" style="color: #6b7280;">Unsubscribe</a> | 
        <a href="mailto:admin@wipethatrecord.com" style="color: #6b7280;">Contact Us</a>
      </p>
    </div>
  `;
  
  return html + footer;
}

// Backup email service (using original Zoho as last resort)
async function sendBackupEmail(opts: EmailOptions) {
  try {
    const { sendEmail } = await import('./email');
    return await sendEmail({
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text
    });
  } catch (error) {
    console.error('❌ Backup email also failed:', error);
    throw error;
  }
}

// 📧 IMPROVED EMAIL TEMPLATES WITH BETTER DELIVERABILITY
export const professionalEmailTemplates = {
  diyPurchase: (name: string) => ({
    subject: '🎉 Your DIY Expungement Kit is Ready - Download Now',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your DIY Expungement Kit</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🎉 Welcome to Wipe That Record!</h1>
            <p style="margin: 15px 0 0 0; font-size: 20px; opacity: 0.95;">Your DIY expungement kit is ready for download</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${name || 'there'},</h2>
            
            <p style="color: #4b5563; line-height: 1.7; font-size: 16px; margin-bottom: 25px;">
              Thank you for choosing Wipe That Record! Your DIY expungement kit has been prepared and is ready for immediate download.
            </p>
            
            <!-- Download CTA -->
            <div style="background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 22px;">📁 Your Complete DIY Kit</h3>
              <a href="https://wipethatrecord.com/download?token=diy-${Date.now()}" 
                 style="background: #3b82f6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; display: inline-block; margin: 10px 0;">
                📥 Download Your Kit Now
              </a>
              <p style="color: #1e40af; margin: 15px 0 0 0; font-size: 14px;">
                ✅ All forms pre-filled • ✅ Step-by-step guide • ✅ Court filing instructions
              </p>
            </div>
            
            <!-- What's Included -->
            <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin: 30px 0;">
              <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">📋 What's included in your kit:</h3>
              <ul style="color: #4b5563; line-height: 1.8; font-size: 16px; margin: 0; padding-left: 20px;">
                <li><strong>Complete Filing Guide</strong> - Step-by-step instructions with screenshots</li>
                <li><strong>Pre-filled Court Forms</strong> - All necessary paperwork ready to file</li>
                <li><strong>Eligibility Checklist</strong> - Verify your qualification before filing</li>
                <li><strong>Fee Schedule</strong> - Exact court costs and payment methods</li>
                <li><strong>Timeline & Tracking</strong> - What to expect and when</li>
                <li><strong>Bonus: Common Mistakes Guide</strong> - Avoid delays and rejections</li>
              </ul>
            </div>
            
            <!-- Next Steps -->
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 25px; margin: 30px 0;">
              <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">🚀 Next Steps:</h3>
              <ol style="color: #166534; line-height: 1.7; font-size: 16px; margin: 0; padding-left: 20px;">
                <li>Download your complete kit using the button above</li>
                <li>Review the eligibility checklist first</li>
                <li>Fill out any remaining personal information on forms</li>
                <li>Follow the filing guide to submit to court</li>
                <li>Track your case using our timeline guide</li>
              </ol>
            </div>
            
            <!-- Support -->
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 25px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">💬 Need Help?</h3>
              <p style="color: #92400e; margin: 0; font-size: 16px; line-height: 1.6;">
                Reply to this email or contact us at <strong>admin@wipethatrecord.com</strong><br>
                We typically respond within 2-4 hours during business days.
              </p>
            </div>
            
            <!-- Social Proof -->
            <div style="text-align: center; margin: 40px 0;">
              <p style="color: #6b7280; font-size: 16px; margin: 0 0 15px 0;">
                ⭐⭐⭐⭐⭐ <strong>4.9/5 rating</strong> from 1,847+ satisfied customers
              </p>
              <p style="color: #6b7280; font-size: 14px; font-style: italic; margin: 0;">
                "The DIY kit made the process so much easier than I expected!" - Sarah M.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to Wipe That Record! Your DIY expungement kit is ready for download. Visit https://wipethatrecord.com/download to access your complete kit with all forms and instructions. Need help? Reply to this email or contact admin@wipethatrecord.com.`,
    tags: ['purchase-confirmation', 'diy-package']
  }),

  reviewUpgrade: (name: string) => ({
    subject: '⚖️ Expert Review Service Activated - We\'ll Handle Everything',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Expert Review Service Activated</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">⚖️ Great Choice!</h1>
            <p style="margin: 15px 0 0 0; font-size: 20px; opacity: 0.95;">We'll handle your case review and document preparation</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${name || 'there'},</h2>
            
            <p style="color: #4b5563; line-height: 1.7; font-size: 16px; margin-bottom: 25px;">
              Excellent decision! You've upgraded to our <strong>Expert Review & Document Completion</strong> service. Our legal professionals will now handle the complex parts of your case.
            </p>
            
            <!-- Process Timeline -->
            <div style="background: #f0f9ff; border-radius: 12px; padding: 30px; margin: 30px 0;">
              <h3 style="color: #1e40af; margin: 0 0 25px 0; font-size: 22px; text-align: center;">📅 Your 5-Day Process</h3>
              
              <div style="position: relative;">
                <!-- Day 1 -->
                <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                  <div style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">1</div>
                  <div>
                    <h4 style="color: #1e40af; margin: 0 0 5px 0; font-size: 16px;">Record Lookup (24 hours)</h4>
                    <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.5;">We'll pull your complete criminal record from all California counties</p>
                  </div>
                </div>
                
                <!-- Day 2-3 -->
                <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                  <div style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">2</div>
                  <div>
                    <h4 style="color: #1e40af; margin: 0 0 5px 0; font-size: 16px;">Eligibility Review (Days 2-3)</h4>
                    <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.5;">Legal team verifies which charges qualify for expungement</p>
                  </div>
                </div>
                
                <!-- Day 4-5 -->
                <div style="display: flex; align-items: flex-start;">
                  <div style="background: #10b981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">3</div>
                  <div>
                    <h4 style="color: #166534; margin: 0 0 5px 0; font-size: 16px;">Document Preparation (Days 4-5)</h4>
                    <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.5;">All court forms completed professionally and ready to file</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- What We Handle -->
            <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin: 30px 0;">
              <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; text-align: center;">✅ What Our Experts Handle</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="color: #10b981; font-size: 14px;">✓ Complete record research</div>
                <div style="color: #10b981; font-size: 14px;">✓ Eligibility verification</div>
                <div style="color: #10b981; font-size: 14px;">✓ All court forms completion</div>
                <div style="color: #10b981; font-size: 14px;">✓ Legal accuracy review</div>
                <div style="color: #10b981; font-size: 14px;">✓ Filing instructions</div>
                <div style="color: #10b981; font-size: 14px;">✓ Priority support</div>
              </div>
            </div>
            
            <!-- Priority Support -->
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 25px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🎯 Priority Support Activated</h3>
              <p style="color: #92400e; margin: 0; font-size: 16px; line-height: 1.6;">
                As an Expert Review client, you now have <strong>priority email support</strong>. We'll respond to any questions within 2 hours during business hours (9 AM - 6 PM PST).
              </p>
            </div>
            
            <!-- Next Steps -->
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 25px; margin: 30px 0;">
              <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">📞 What Happens Next</h3>
              <p style="color: #166534; margin: 0 0 15px 0; font-size: 16px; line-height: 1.7;">
                <strong>Within 24 hours:</strong> Our legal team will begin your record lookup and send you a confirmation with your case reference number.
              </p>
              <p style="color: #166534; margin: 0; font-size: 16px; line-height: 1.7;">
                <strong>Day 3:</strong> You'll receive an eligibility report showing exactly which charges can be expunged.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Expert Review Service Activated! Our legal team will handle your case review and document preparation. Process: Day 1 - Record lookup, Days 2-3 - Eligibility review, Days 4-5 - Document preparation. You now have priority support with 2-hour response time. Contact admin@wipethatrecord.com with questions.`,
    tags: ['upgrade-confirmation', 'expert-review']
  }),

  adminNotification: (type: 'form_submission' | 'purchase', data: any) => ({
    subject: type === 'purchase' 
      ? `💰 NEW PURCHASE: $${data.amount} - ${data.email}`
      : `📝 NEW LEAD: ${data.email} - Score: ${data.leadScore}/100`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: ${type === 'purchase' ? '#10b981' : '#3b82f6'}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">
              ${type === 'purchase' ? '💰 NEW PURCHASE!' : '📝 NEW LEAD!'}
            </h1>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937;">Customer Details:</h3>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Name:</strong> ${data.fullName || data.first + ' ' + data.last || 'Not provided'}</p>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            
            ${type === 'purchase' ? `
              <h3 style="margin: 20px 0 15px 0; color: #1f2937;">Purchase Details:</h3>
              <p style="margin: 5px 0; color: #059669; font-size: 18px; font-weight: bold;">Amount: $${data.amount}</p>
              <p style="margin: 5px 0; color: #4b5563;"><strong>Service:</strong> ${data.product}</p>
              <p style="margin: 5px 0; color: #4b5563;"><strong>Stripe Session:</strong> ${data.stripeSessionId}</p>
            ` : `
              <h3 style="margin: 20px 0 15px 0; color: #1f2937;">Lead Details:</h3>
              <p style="margin: 5px 0; color: #4b5563;"><strong>Lead Score:</strong> ${data.leadScore}/100</p>
              <p style="margin: 5px 0; color: #4b5563;"><strong>Conviction Type:</strong> ${data.convictionType}</p>
              <p style="margin: 5px 0; color: #4b5563;"><strong>Urgency:</strong> ${data.urgency}</p>
              <p style="margin: 5px 0; color: #4b5563;"><strong>Segment:</strong> ${data.leadSegment}</p>
            `}
            
            <h3 style="margin: 20px 0 15px 0; color: #1f2937;">Timestamp:</h3>
            <p style="margin: 5px 0; color: #4b5563;">${new Date().toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://wipethatrecord.com/admin/collections/leads" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View in Admin Dashboard
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `${type === 'purchase' ? 'NEW PURCHASE' : 'NEW LEAD'}: ${data.email} - ${type === 'purchase' ? `$${data.amount}` : `Score: ${data.leadScore}/100`}. View details in admin dashboard.`,
    tags: ['admin-notification', type]
  })
};

// Helper functions for professional emails
export async function sendProfessionalDiyEmail(email: string, name: string = '') {
  const template = professionalEmailTemplates.diyPurchase(name);
  return await sendProfessionalEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: template.tags
  });
}

export async function sendProfessionalReviewEmail(email: string, name: string = '') {
  const template = professionalEmailTemplates.reviewUpgrade(name);
  return await sendProfessionalEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: template.tags
  });
}

export async function sendAdminNotification(type: 'form_submission' | 'purchase', data: any) {
  const adminEmails = process.env.ADMIN_NOTIFICATION_EMAILS?.split(',') || ['admin@wipethatrecord.com'];
  
  const subject = type === 'purchase' 
    ? `💰 NEW PURCHASE: $${data.amount} - ${data.email}`
    : `📝 NEW LEAD: ${data.email} - Score: ${data.leadScore}/100`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: ${type === 'purchase' ? '#10b981' : '#3b82f6'}; color: white; padding: 20px; border-radius: 8px; text-align: center;">
        <h1 style="margin: 0;">${type === 'purchase' ? '💰 NEW PURCHASE!' : '📝 NEW LEAD!'}</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Name:</strong> ${data.fullName || 'Not provided'}</p>
        ${type === 'purchase' 
          ? `<p><strong>Amount:</strong> $${data.amount}</p><p><strong>Service:</strong> ${data.product}</p>` 
          : `<p><strong>Lead Score:</strong> ${data.leadScore}/100</p><p><strong>Conviction:</strong> ${data.convictionType}</p>`
        }
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;

  const notifications = adminEmails.map(email => 
    sendProfessionalEmail({
      to: email.trim(),
      subject,
      html,
      tags: ['admin-notification']
    })
  );
  
  return await Promise.all(notifications);
} 