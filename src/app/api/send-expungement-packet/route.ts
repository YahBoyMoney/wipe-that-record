import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  console.log('📧 Starting email send process...');
  
  try {
    // Create Zoho transporter with your credentials
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: 'admin@wipethatrecord.com',
        pass: 'Agj21990.' // Your Zoho password
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      },
      debug: true,
      logger: true
    });

    console.log('📧 Verifying SMTP connection...');
    
    // Verify connection
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError: any) {
      console.error('❌ SMTP verification failed:', verifyError);
      
      // Try alternative port if 465 fails
      console.log('🔄 Trying alternative configuration (port 587)...');
      const altTransporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 587,
        secure: false, // TLS
        auth: {
          user: 'admin@wipethatrecord.com',
          pass: 'Agj21990.'
        },
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        }
      });
      
      await altTransporter.verify();
      console.log('✅ Alternative SMTP connection verified');
    }

    console.log('📧 Sending email to yahboymoney@gmail.com...');

    // Email content with sample packet
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Your CR-180 Expungement Packet</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Your Sample Expungement Packet</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Complete CR-180 Filing Package</p>
  </div>

  <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
    <h2 style="color: #2d3748; margin-top: 0;">Hello,</h2>
    <p>As requested, here's your sample CR-180 expungement packet showing exactly what a completed filing looks like.</p>
    
    <h3 style="color: #4a5568; margin-top: 25px;">📋 What's Included:</h3>
    <ul style="color: #4a5568;">
      <li><strong>CR-180 Petition for Dismissal</strong> - Main court form (Page 1)</li>
      <li><strong>Declaration in Support</strong> - Your personal statement (Page 2)</li>
      <li><strong>Memorandum of Points & Authorities</strong> - Legal arguments (Page 3)</li>
      <li><strong>Proposed Order</strong> - For judge signature (Page 4)</li>
      <li><strong>Proof of Service</strong> - DA notification (Page 5)</li>
      <li><strong>Filing Checklist</strong> - Step-by-step instructions (Page 6)</li>
    </ul>
  </div>

  <div style="background: white; border: 2px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
    <h3 style="color: #2d3748; margin-top: 0;">📄 View Full Packet Online</h3>
    <p style="color: #4a5568;">Click the button below to view the complete sample packet with all forms:</p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="https://wipethatrecord.com/sample-expungement-packet.html" 
         style="display: inline-block; background: #4299e1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        View Sample Packet →
      </a>
    </div>
    
    <p style="color: #718096; font-size: 14px; text-align: center;">
      You can print it or save as PDF from your browser
    </p>
  </div>

  <div style="background: #fef5e7; border-left: 4px solid #f39c12; padding: 20px; margin-bottom: 25px;">
    <h3 style="color: #7d4f07; margin-top: 0;">⚠️ Important Notes:</h3>
    <ul style="color: #7d4f07; margin: 0;">
      <li>This is a SAMPLE with fictional information</li>
      <li>You must customize all details for your specific case</li>
      <li>Court fees are $150 (fee waiver available)</li>
      <li>Processing time is typically 2-4 months</li>
    </ul>
  </div>

  <div style="background: #e6fffa; border: 1px solid #38b2ac; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
    <h3 style="color: #234e52; margin-top: 0;">💡 Need Help?</h3>
    <p style="color: #234e52; margin: 10px 0;">We offer three service levels:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
      <tr>
        <td style="padding: 12px; background: #f7fafc; border: 1px solid #cbd5e0;">
          <strong>DIY Kit - $147</strong><br>
          <span style="color: #718096; font-size: 14px;">Forms + Instructions</span>
        </td>
        <td style="padding: 12px; background: #fef5e7; border: 1px solid #f39c12;">
          <strong>Filing Review - $497</strong><br>
          <span style="color: #7d4f07; font-size: 14px;">We Prepare Everything</span>
        </td>
        <td style="padding: 12px; background: #e6fffa; border: 1px solid #38b2ac;">
          <strong>Full Service - $1,497</strong><br>
          <span style="color: #234e52; font-size: 14px;">Attorney Handles All</span>
        </td>
      </tr>
    </table>
    
    <div style="text-align: center; margin-top: 20px;">
      <a href="https://wipethatrecord.com/checkout/diy" 
         style="display: inline-block; background: #48bb78; color: white; padding: 10px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Get Started Today →
      </a>
    </div>
  </div>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

  <div style="text-align: center; color: #718096; font-size: 14px;">
    <p><strong>WipeThatRecord.com</strong></p>
    <p>Professional Expungement Services Since 2010</p>
    <p>📞 (909) 639-4602 | 📧 admin@wipethatrecord.com</p>
    <p style="margin-top: 20px; font-size: 12px;">
      This email contains attorney advertising. Prior results do not guarantee similar outcomes.<br>
      Not certified by the State Bar of California as a specialist.
    </p>
  </div>

</body>
</html>
    `;

    // Send email
    const mailOptions = {
      from: '"WipeThatRecord" <admin@wipethatrecord.com>',
      to: 'yahboymoney@gmail.com',
      subject: '📋 Your Sample CR-180 Expungement Packet - WipeThatRecord',
      html: emailContent,
      text: 'View your sample expungement packet at: https://wipethatrecord.com/sample-expungement-packet.html'
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);

    return NextResponse.json({
      success: true,
      message: 'Sample packet sent to yahboymoney@gmail.com',
      messageId: info.messageId,
      response: info.response
    });

  } catch (error: any) {
    console.error('❌ Email error:', error);
    
    // Detailed error response
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      details: {
        host: 'smtp.zoho.com',
        user: 'admin@wipethatrecord.com',
        suggestion: 'Please check: 1) Password is correct, 2) 2FA is disabled or app password is used, 3) SMTP access is enabled in Zoho'
      }
    }, { status: 500 });
  }
}

// GET endpoint for easy testing
export async function GET(req: NextRequest) {
  return POST(req);
}