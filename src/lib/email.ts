import nodemailer from 'nodemailer';

// Configure email transporter with multiple providers fallback
const createTransporter = () => {
  // Try Zoho first
  if (process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD) {
    console.log('📧 Using Zoho email configuration');
    return nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });
  }
  
  // Fallback to Gmail/SMTP
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('📧 Using SMTP email configuration');
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  console.warn('⚠️ No email configuration found - emails will not be sent');
  return null;
};

export const mailer = createTransporter();

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    if (!mailer) {
      console.warn(`⚠️ Email not sent to ${opts.to} - no transporter configured`);
      console.warn(`📋 Subject: ${opts.subject}`);
      return { messageId: 'no-transporter', mock: true };
    }

    const fromEmail = process.env.ZOHO_EMAIL || process.env.SMTP_USER || 'admin@wipethatrecord.com';
    const info = await mailer.sendMail({
      from: `"Wipe That Record" <${fromEmail}>`,
      ...opts,
    });
    
    console.log(`✅ Email sent successfully to ${opts.to}`);
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📋 Subject: ${opts.subject}`);
    
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${opts.to}:`, error);
    console.error(`📋 Subject: ${opts.subject}`);
    
    // Don't throw error, just log it and return mock response
    return { messageId: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Email templates
export const emailTemplates = {
  diyPurchase: (name: string) => ({
    subject: 'Your DIY Expungement Kit is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Wipe That Record!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your DIY expungement kit is ready</p>
        </div>
        
        <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${name || 'there'},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for choosing Wipe That Record! Your DIY expungement kit has been prepared and is ready for download.
          </p>
          <p style="color: #4b5563; line-height: 1.6;">
            <strong>What's included in your kit:</strong>
          </p>
          <ul style="color: #4b5563; line-height: 1.6;">
            <li>Step-by-step filing instructions</li>
            <li>Required court forms (pre-filled where possible)</li>
            <li>Eligibility checklist</li>
            <li>Filing fee information</li>
            <li>Timeline and next steps</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Download Your Kit
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Need help? Reply to this email or contact us at admin@wipethatrecord.com</p>
          <p>© 2024 Wipe That Record. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Welcome to Wipe That Record! Your DIY expungement kit is ready for download. Contact us at admin@wipethatrecord.com if you need help.`
  }),

  reviewUpgrade: (name: string) => ({
    subject: 'Thank You for Upgrading - We\'ll Handle Your Case Review',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">Great Choice!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">We'll handle your case review and filing</p>
        </div>
        
        <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${name || 'there'},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for upgrading to our Filing Review & Document Completion service! You made a smart decision.
          </p>
          <p style="color: #4b5563; line-height: 1.6;">
            <strong>What happens next:</strong>
          </p>
          <ol style="color: #4b5563; line-height: 1.6;">
            <li>We'll look up your complete criminal record within 24 hours</li>
            <li>Our team will verify your eligibility for expungement</li>
            <li>We'll prepare all necessary documents professionally</li>
            <li>You'll receive everything ready to file with the court</li>
          </ol>
          <p style="color: #4b5563; line-height: 1.6;">
            <strong>Expected timeline:</strong> 3-5 business days for complete case preparation.
          </p>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #92400e; margin-top: 0;">Priority Support</h3>
          <p style="color: #92400e; margin-bottom: 0;">
            As a premium client, you now have priority email support. We'll respond to any questions within 2 hours during business hours.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Questions? Reply to this email or contact us at admin@wipethatrecord.com</p>
          <p>© 2024 Wipe That Record. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Thank you for upgrading! We'll handle your case review and document preparation. Expected timeline: 3-5 business days. Contact us at admin@wipethatrecord.com with questions.`
  }),

  fullServiceUpgrade: (name: string) => ({
    subject: 'Welcome to Full Service - We\'ll Handle Everything',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">Premium Service Activated!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Sit back and relax - we've got this</p>
        </div>
        
        <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${name || 'there'},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Congratulations on choosing our Full Expungement Service! You can now relax knowing that experienced professionals will handle your entire case from start to finish.
          </p>
          <p style="color: #4b5563; line-height: 1.6;">
            <strong>Your dedicated service includes:</strong>
          </p>
          <ul style="color: #4b5563; line-height: 1.6;">
            <li>Complete case management from start to finish</li>
            <li>Dedicated attorney representation</li>
            <li>All court filing fees included</li>
            <li>Court appearance handling (if required)</li>
            <li>Direct communication with court clerks</li>
            <li>Regular status updates throughout the process</li>
          </ul>
          <p style="color: #4b5563; line-height: 1.6;">
            <strong>Expected timeline:</strong> 2-4 months for complete case resolution.
          </p>
        </div>
        
        <div style="background: #dcfce7; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #166534; margin-top: 0;">Your Attorney Will Contact You</h3>
          <p style="color: #166534; margin-bottom: 0;">
            Within 24 hours, your assigned attorney will reach out to gather any additional information needed to begin your case. They'll also answer any questions you may have about the process.
          </p>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #92400e; margin-top: 0;">Money-Back Guarantee</h3>
          <p style="color: #92400e; margin-bottom: 0;">
            If your case is not approved for expungement, we'll provide a full refund of your service fee. That's how confident we are in our success rate.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Questions? Reply to this email or contact us at admin@wipethatrecord.com</p>
          <p>© 2024 Wipe That Record. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Welcome to Full Service! Your dedicated attorney will contact you within 24 hours. Expected timeline: 2-4 months. Money-back guarantee if not approved. Contact us at admin@wipethatrecord.com with questions.`
  })
};

// Helper functions for each email flow
export async function sendDiyConfirmationEmail(email: string, name: string = '') {
  const template = emailTemplates.diyPurchase(name);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendReviewConfirmationEmail(email: string, name: string = '') {
  const template = emailTemplates.reviewUpgrade(name);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendFullServiceConfirmationEmail(email: string, name: string = '') {
  const template = emailTemplates.fullServiceUpgrade(name);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
} 